"""Character portraits: fan art the user supplied, cropped to the archive's
4:5 portrait frame and given one light treatment for a stated reason, never a
restyle for its own sake. The frame itself (Color material, burgundy mat,
plaque) is CSS; see components/archive/FramedPortrait.tsx.

What is done, and why:
- Crop only: to 4:5 around the face, and clear of watermarks, the Reddit
  "posted in" bars and painted titles.
- Whites held down to aged bone (as the book covers): pale backgrounds
  (Victra, Fitchner, Lysander, Ragnar's snow) otherwise glare on the
  near-black page and pull the eye off every other portrait.
- Orion only: saturation down a third. The piece is neon blue and would be
  the one image on the site in a different palette.
- A faint shared grain, so flat digital colour and painted texture sit
  together behind the same glass.

    python3 scripts/art/portraits.py          # from the-rising-archive/
    python3 scripts/art/portraits.py victra   # some

Raw files live in gitignored portraits-src/<slug>.jpg.
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "portraits-src"
OUT = ROOT / "public" / "images" / "portraits"
BONE = np.array([233, 228, 218], float)

# slug: (source, centre x, centre y, crop height as a fraction of the
#        largest 4:5 crop that fits, extra box to trim first (fractions))
CROPS = {
    "darrow": ("darrow", 0.5, 0.42, 0.78, None),
    "virginia": ("virginia", 0.5, 0.36, 0.86, None),
    "cassius": ("cassius", 0.52, 0.42, 0.9, None),
    "sevro": ("sevro", 0.5, 0.4, 0.95, None),
    "pax": ("pax-electra", 0.25, 0.66, 0.7, (0, 0, 1, 0.93)),
    "diomedes": ("diomedes", 0.55, 0.42, 0.9, None),
    "atlas": ("atlas", 0.5, 0.36, 0.86, None),
    "lysander": ("lysander", 0.5, 0.38, 0.9, None),
    "victra": ("victra", 0.5, 0.42, 0.95, None),
    "the-jackal": ("the-jackal", 0.5, 0.45, 1.0, None),
    "apollonius": ("apollonius", 0.62, 0.5, 1.0, None),
    "lyria": ("lyria", 0.48, 0.45, 0.9, None),
    "ephraim": ("ephraim", 0.5, 0.42, 0.95, None),
    "volga": ("volga", 0.5, 0.4, 0.95, None),
    "ragnar": ("ragnar", 0.5, 0.4, 0.95, None),
    "kavax": ("kavax", 0.5, 0.45, 1.0, None),
    "fitchner": ("fitchner", 0.45, 0.4, 0.95, None),
    "lorn": ("lorn", 0.5, 0.4, 0.95, None),
    "orion": ("orion", 0.5, 0.45, 1.0, None),
    "romulus": ("romulus", 0.45, 0.42, 1.0, None),
    "eo": ("eo", 0.5, 0.48, 0.86, (0.02, 0.07, 0.98, 1)),
}
SATURATION = {"orion": 0.66}

# Face crops for the small sizes (thumbnails under ~120 px), as
# (centre x, centre y, height) fractions of the finished portrait.
FACE = {
    "darrow": (0.46, 0.22, 0.56), "virginia": (0.5, 0.33, 0.6), "cassius": (0.56, 0.2, 0.5), "sevro": (0.5, 0.26, 0.55),
    "pax": (0.45, 0.35, 0.62), "diomedes": (0.45, 0.25, 0.55), "atlas": (0.5, 0.25, 0.55), "lysander": (0.3, 0.46, 0.55),
    "victra": (0.45, 0.35, 0.6), "the-jackal": (0.5, 0.45, 0.75), "apollonius": (0.36, 0.3, 0.5), "lyria": (0.45, 0.35, 0.6),
    "ephraim": (0.55, 0.42, 0.72), "volga": (0.5, 0.3, 0.6), "ragnar": (0.5, 0.2, 0.5), "kavax": (0.4, 0.2, 0.5),
    "fitchner": (0.55, 0.3, 0.6), "lorn": (0.5, 0.35, 0.65), "orion": (0.5, 0.45, 0.7), "romulus": (0.42, 0.33, 0.55),
    "eo": (0.5, 0.3, 0.6),
}
H = 1200  # output height; smaller sources are not upscaled past 1.4x


def crop(im, cx, cy, frac):
    w, h = im.size
    ch = min(h, w * 1.25) * frac
    cw = ch / 1.25
    x = min(max(cx * w - cw / 2, 0), w - cw)
    y = min(max(cy * h - ch / 2, 0), h - ch)
    return im.crop((int(x), int(y), int(x + cw), int(y + ch)))


def treat(slug):
    src, cx, cy, frac, box = CROPS[slug]
    im = Image.open(SRC / f"{src}.jpg").convert("RGB")
    if box:
        w, h = im.size
        im = im.crop((int(box[0] * w), int(box[1] * h), int(box[2] * w), int(box[3] * h)))
    im = crop(im, cx, cy, frac)
    oh = min(H, int(im.size[1] * 1.4))
    im = im.resize((int(oh / 1.25), oh), Image.LANCZOS)
    if slug in SATURATION:
        im = ImageEnhance.Color(im).enhance(SATURATION[slug])
    a = np.asarray(im, float)
    # Hold the whites to aged bone: a soft shoulder above 80% luminance.
    lum = a @ np.array([0.299, 0.587, 0.114]) / 255
    k = np.clip((lum - 0.8) / 0.2, 0, 1)[..., None] ** 1.5
    a = a * (1 - k * 0.18) + BONE * 0.9 * k * 0.18
    a = a + np.random.default_rng(len(slug)).normal(0, 2.4, a.shape[:2] + (1,))
    out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    OUT.mkdir(parents=True, exist_ok=True)
    out.save(OUT / f"{slug}.webp", quality=84, method=6)
    fx, fy, fh = FACE[slug]
    W2, H2 = out.size
    ch = H2 * fh
    cw = ch / 1.25
    x = min(max(fx * W2 - cw / 2, 0), W2 - cw)
    y = min(max(fy * H2 - ch / 2, 0), H2 - ch)
    face = out.crop((int(x), int(y), int(x + cw), int(y + ch))).resize((320, 400), Image.LANCZOS)
    face.save(OUT / f"{slug}-face.webp", quality=82, method=6)
    print(slug, out.size, (OUT / f"{slug}.webp").stat().st_size // 1024, "KB")


for s in sys.argv[1:] or CROPS:
    treat(s)
