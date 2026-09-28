"""Turn the Titan renders (from render.mjs) into the two images the site
still uses from them:

    python3 scripts/titans/sprite.py <renderdir>

Writes to public/images/titans/:
  <slug>-sil.webp    flat silhouette of the front view (to-scale strip)
  <slug>-xray.webp   the x-ray plate, 480x960 (the "enter the Titan" transition,
                     and the Founding's index column, whose own plate is sealed)
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SLUGS = ["founding", "attack", "colossal", "armored", "female", "beast", "jaw", "cart", "war-hammer"]
src = Path(sys.argv[1])
out = Path(__file__).resolve().parents[2] / "public" / "images" / "titans"
out.mkdir(parents=True, exist_ok=True)

def save(img: Image.Image, name: str, q: int):
    p = out / name
    img.save(p, "WEBP", quality=q, alpha_quality=40, method=6)
    print(f"{name:26s} {p.stat().st_size // 1024:4d} KB")


def silhouette(img: Image.Image) -> Image.Image:
    """Dark flat fill with a faint paper rim, from the render's alpha."""
    a = np.asarray(img.convert("RGBA"))[..., 3]
    m = Image.fromarray(a).filter(ImageFilter.GaussianBlur(0.6))
    rim = np.clip(np.asarray(m, float) - np.asarray(m.filter(ImageFilter.MinFilter(5)), float), 0, 255)
    rgb = np.zeros(a.shape + (3,), float) + np.array([34, 30, 26], float)
    rgb += (rim / 255)[..., None] * (np.array([216, 208, 184], float) - 34) * 0.55
    return Image.fromarray(np.dstack([np.clip(rgb, 0, 255), np.asarray(m, float)]).astype(np.uint8), "RGBA")


for f, slug in enumerate(SLUGS):
    front = Image.open(src / f"t{f}_00.png").resize((300, 600), Image.LANCZOS)
    save(silhouette(front), f"{slug}-sil.webp", 80)
    xr = Image.open(src / f"x{f}.png").convert("RGBA").resize((480, 960), Image.LANCZOS)
    save(xr, f"{slug}-xray.webp", 70)
