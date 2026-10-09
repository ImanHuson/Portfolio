"""Section backgrounds: grade an image you made (Gemini / ChatGPT) into the
archive's look and write it where the site expects it.

    python3 -I scripts/bg/treat.py            (from attack-on-titan-archive/)

Reads every image in bg-src/ (gitignored: raw generations stay out of the
repo) and writes public/images/bg/<same name>.webp:
  - at most 2400 px on the long side (portrait art stays portrait)
  - blacks lifted to the site's ground (#0b0c0a), whites held at paper
    (#d8d0b8), so it sits on the page instead of glowing off it
  - saturation eased to 85 % (the accent stays the brightest colour on the page)
  - a little film grain, the same as the rest of the archive
"""
import pathlib
import random
from PIL import Image, ImageEnhance

SRC = pathlib.Path("bg-src")
OUT = pathlib.Path("public/images/bg")
BASE = (11, 12, 10)
PAPER = (216, 208, 184)


def grade(im: Image.Image) -> Image.Image:
    im = im.convert("RGB")
    w, h = im.size
    s = 2400 / max(w, h)
    if s < 1:
        im = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
    im = ImageEnhance.Color(im).enhance(0.85)
    # map 0..255 per channel onto base..paper
    lut = []
    for c in range(3):
        lo, hi = BASE[c], PAPER[c] + (255 - PAPER[c]) * 0.35
        lut += [round(lo + (hi - lo) * (v / 255)) for v in range(256)]
    im = im.point(lut)
    noise = Image.effect_noise(im.size, 22).convert("L")
    grain = Image.merge("RGB", (noise,) * 3)
    return Image.blend(im, grain, 0.04)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    random.seed(7)
    files = [p for p in sorted(SRC.glob("*")) if p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}]
    if not files:
        print("no images in bg-src/")
    for p in files:
        out = OUT / (p.stem + ".webp")
        grade(Image.open(p)).save(out, quality=80, method=6)
        print(p.name, "->", out, Image.open(out).size)
