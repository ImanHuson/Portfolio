"""Grade and assemble the Titan renders (from render.mjs) for the site.

Every frame gets the archive's photographic plate treatment, the same idea
that makes the personnel portraits read as records rather than CG: a sepia
duotone that lets the red of exposed muscle survive, a soft highlight glow,
and film grain that changes frame to frame (so the turn flickers like film).

    python3 scripts/titans/sprite.py <renderdir>

Writes to public/images/titans/:
  <slug>.webp        24-frame turntable, 340x680 per frame (a Titan's page)
  <slug>-sm.webp     24-frame turntable, 150x300 per frame (index, on hover)
  <slug>-still.webp  frame 0 at 300x600 (index column and to-scale strip)
  <slug>-xray.webp   the x-ray plate, 480x960 (the "enter the Titan" transition)
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SLUGS = ["founding", "attack", "colossal", "armored", "female", "beast", "jaw", "cart", "war-hammer"]
FRAMES = 24
src = Path(sys.argv[1])
out = Path(__file__).resolve().parents[2] / "public" / "images" / "titans"
out.mkdir(parents=True, exist_ok=True)

INK = np.array([0.07, 0.065, 0.055])
PAPER = np.array([0.93, 0.86, 0.72])


def grade(im: Image.Image, seed: int) -> Image.Image:
    a = np.asarray(im.convert("RGBA"), float) / 255
    rgb, alpha = a[..., :3], a[..., 3:4]
    lum = rgb @ np.array([0.299, 0.587, 0.114])
    duo = INK + (PAPER - INK) * np.clip(lum * 1.08, 0, 1)[..., None]
    red = np.clip((rgb[..., 0] - np.maximum(rgb[..., 1], rgb[..., 2])) * 2.6 - 0.05, 0, 1)[..., None]
    graded = duo * 0.62 + rgb * 0.38
    graded = graded * (1 - red * 0.75) + rgb * 1.05 * red * 0.75
    # soft highlight glow
    hi = Image.fromarray((np.clip((lum - 0.55) * 2.2, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(5))
    graded += (np.asarray(hi, float) / 255)[..., None] * np.array([0.22, 0.19, 0.14])
    # film grain, a new pattern every frame
    g = np.random.default_rng(seed).normal(0, 0.035, lum.shape)[..., None]
    graded = np.clip(graded + g, 0, 1)
    return Image.fromarray((np.concatenate([graded, alpha], axis=2) * 255).astype(np.uint8), "RGBA")


def save(img: Image.Image, name: str, q: int):
    p = out / name
    img.save(p, "WEBP", quality=q, alpha_quality=40, method=6)
    print(f"{name:26s} {p.stat().st_size // 1024:4d} KB")


for f, slug in enumerate(SLUGS):
    frames = [grade(Image.open(src / f"t{f}_{i:02d}.png"), f * 100 + i) for i in range(FRAMES)]
    for suffix, w, h, q in (("", 340, 680, 76), ("-sm", 150, 300, 55)):
        sheet = Image.new("RGBA", (w * FRAMES, h), (0, 0, 0, 0))
        for i, fr in enumerate(frames):
            sheet.paste(fr.resize((w, h), Image.LANCZOS), (i * w, 0))
        save(sheet, f"{slug}{suffix}.webp", q)
    save(frames[0].resize((300, 600), Image.LANCZOS), f"{slug}-still.webp", 70)
    xr = Image.open(src / f"x{f}.png").convert("RGBA").resize((480, 960), Image.LANCZOS)
    save(xr, f"{slug}-xray.webp", 70)
