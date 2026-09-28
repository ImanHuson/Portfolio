"""Post for the realism renders (real.mjs / relics.mjs): depth of field from
the depth pass, bloom, a filmic grade into the site palette, vignette and
grain, then downscale to the site's plate size.

    python3 scripts/art/post.py <outBase> <dest.webp> [size]

<outBase>.color.png, .depth.f32 and .meta.json come from captureWithDepth;
meta may carry focus (world units), aperture (px of blur per unit of
defocus), bloom and exposure.
"""

import json
import sys

import numpy as np
from PIL import Image


def box(a, r, axis):
    if r < 1:
        return a
    c = np.cumsum(np.pad(a, [(r + 1, r) if i == axis else (0, 0) for i in range(a.ndim)], mode="edge"), axis=axis)
    n = a.shape[axis]
    hi = np.take(c, np.arange(2 * r + 1, 2 * r + 1 + n), axis=axis)
    lo = np.take(c, np.arange(0, n), axis=axis)
    return (hi - lo) / (2 * r + 1)


def blur(a, sigma):
    """Three box passes per axis: close to a gaussian, fast in numpy."""
    if sigma < 0.5:
        return a
    r = max(1, int(round(np.sqrt(12 * sigma * sigma / 3 + 1) - 1) // 2))
    for _ in range(3):
        a = box(a, r, 0)
        a = box(a, r, 1)
    return a


def to_lin(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def to_srgb(c):
    c = np.clip(c, 0, 1)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * c ** (1 / 2.4) - 0.055)


def main(base, dest, size=900):
    meta = json.load(open(base + ".meta.json"))
    W, H = meta["W"], meta["H"]
    img = to_lin(np.asarray(Image.open(base + ".color.png").convert("RGB"), np.float32) / 255)
    z = np.fromfile(base + ".depth.f32", dtype=np.float32).reshape(H, W)
    k = W / 2160  # parameters are tuned at 2160 px

    # Depth of field: blur radius from defocus, layered blends.
    focus, ap = meta.get("focus"), meta.get("aperture", 0)
    if focus and ap:
        coc = np.clip(ap * np.abs(1 - focus / np.maximum(z, 1e-3)) * k, 0, 26 * k)
        # Soften the CoC map so edges don't step.
        coc = blur(coc, 4 * k)
        radii = [0, 2.5 * k, 5 * k, 10 * k, 18 * k, 26 * k]
        layers = [img] + [blur(img, r / 2) for r in radii[1:]]
        out = np.zeros_like(img)
        for i in range(len(radii) - 1):
            lo, hi = radii[i], radii[i + 1]
            t = np.clip((coc - lo) / (hi - lo), 0, 1)[..., None]
            inside = ((coc >= lo) & (coc < hi))[..., None] if i < len(radii) - 2 else (coc >= lo)[..., None]
            out = np.where(inside, layers[i] * (1 - t) + layers[i + 1] * t, out)
        img = out

    img = img * meta.get("exposure", 1.0)

    # Bloom from the highlights.
    b = meta.get("bloom", 0.22)
    if b:
        lum = img @ np.array([0.2126, 0.7152, 0.0722], np.float32)
        bright = img * (np.clip((lum - 0.55) / 0.45, 0, 1))[..., None]
        img = img + (blur(bright, 12 * k) * 0.6 + blur(bright, 40 * k) * 0.4) * b

    # Grade: gentle shoulder, blacks settle on the page's void, a warm lift
    # in the highlights and a cool hint in the shadows.
    img = img / (1 + img * 0.18)
    lum = (img @ np.array([0.2126, 0.7152, 0.0722], np.float32))[..., None]
    img = img * (1 + np.array([0.04, 0.0, -0.05]) * np.clip(lum * 2, 0, 1)) + np.array([0.0, 0.0, 0.004]) * (1 - np.clip(lum * 4, 0, 1))
    void = to_lin(np.array([7, 7, 10]) / 255)
    img = void + img * (1 - void)

    # Vignette.
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.hypot((x - W / 2) / (W / 2), (y - H / 2) / (H / 2))
    img = img * (1 - 0.38 * np.clip((r - 0.55) / 0.9, 0, 1) ** 1.5)[..., None]

    out = to_srgb(img)
    im = Image.fromarray((out * 255 + 0.5).astype(np.uint8)).resize((size, size * H // W), Image.LANCZOS)
    g = np.random.default_rng(1).normal(0, 3.2, (im.size[1], im.size[0], 1))
    im = Image.fromarray(np.clip(np.asarray(im, np.float32) + g, 0, 255).astype(np.uint8))
    im.save(dest, quality=86, method=6)
    print("wrote", dest)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 900)
