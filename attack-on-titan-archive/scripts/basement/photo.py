"""The photograph from Grisha's first book, as a print.

The source is the anime's colour frame of the family posing (sharper and
unobstructed); the tones are sampled from the episode's own shot of the
sepia print (shadow, mid, highlight), so the result matches what Eren holds.

Run from attack-on-titan-archive/:
    python3 scripts/basement/photo.py

Input:  basement-src/photograph.jpg   (gitignored: raw screenshots never ship)
Output: public/images/basement/photograph.webp
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "basement-src" / "photograph.jpg"
OUT = ROOT / "public" / "images" / "basement" / "photograph.webp"

# sampled from the episode's print: 5th, 50th and 95th percentile
SHADOW = np.array([40, 28, 20], float)
MID = np.array([96, 76, 52], float)
LIGHT = np.array([214, 194, 152], float)
BORDER = np.array([226, 214, 188], float)


def gradient_map(lum):
    lo = np.clip(lum * 2, 0, 1)[..., None]
    hi = np.clip(lum * 2 - 1, 0, 1)[..., None]
    return np.where(lum[..., None] < 0.5, SHADOW + (MID - SHADOW) * lo, MID + (LIGHT - MID) * hi)


def main():
    img = Image.open(SRC).convert("RGB")
    w, h = img.size
    # the print is portrait: the family, the chair and a little curtain either side
    cw = int(h * 0.77)
    cx = int(w * 0.494)
    img = img.crop((cx - cw // 2, 0, cx + cw // 2, h))
    img = img.resize((770, 1000), Image.LANCZOS)

    rgb = np.asarray(img, float) / 255
    lum = rgb @ np.array([0.299, 0.587, 0.114])
    lo, hi = np.percentile(lum, 1.5), np.percentile(lum, 99)
    lum = np.clip((lum - lo) / (hi - lo), 0, 1)
    lum = lum ** 1.12  # prints sit darker in the mids than a screen frame
    out = gradient_map(lum)

    # an old lens: soft, a little bloom in the highlights, darker corners
    base = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))
    a = np.asarray(base, float)
    bloom = np.asarray(base.filter(ImageFilter.GaussianBlur(14)), float)
    a = a + np.clip(bloom - 150, 0, None) * 0.35
    H, W = lum.shape
    y, x = np.mgrid[0:H, 0:W]
    d = np.sqrt(((x - W / 2) / (W / 2)) ** 2 + ((y - H / 2) / (H / 2)) ** 2)
    a *= (1 - 0.42 * np.clip(d - 0.45, 0, 1) ** 1.6)[..., None]
    # silver grain and faint fading toward one edge
    rng = np.random.default_rng(850)
    a += rng.normal(0, 7, (H, W))[..., None]
    a = a * (1 - 0.1 * (x / W))[..., None] + 18 * (x / W)[..., None]

    # the card: a narrow border, slightly uneven, with a worn edge
    pad = 26
    card = np.zeros((H + pad * 2, W + pad * 2, 3), float) + BORDER
    card *= (0.93 + 0.07 * rng.random((H + pad * 2, W + pad * 2)))[..., None]
    card[pad : pad + H, pad : pad + W] = a
    card = np.clip(card, 0, 255).astype(np.uint8)
    Image.fromarray(card).save(OUT, quality=82, method=6)
    print(OUT.name, OUT.stat().st_size // 1024, "KB")


if __name__ == "__main__":
    main()
