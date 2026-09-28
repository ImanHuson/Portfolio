"""Book covers: the publisher's own images (Del Rey / Penguin Random House,
US editions), fetched from PRH's cover service by ISBN and saved as WebP.
Shown credited, to identify the books. Raw TIFFs are not committed.

    python3 scripts/art/covers.py   # from the-rising-archive/
"""
import io
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps

ISBN = {
    "red-rising": "9780345539786",
    "golden-son": "9780345539816",
    "morning-star": "9780345539847",
    "iron-gold": "9780425285930",
    "dark-age": "9780425285961",
    "light-bringer": "9780425285992",
}
OUT = Path("public/images/covers")
OUT.mkdir(parents=True, exist_ok=True)

for slug, isbn in ISBN.items():
    raw = urllib.request.urlopen(f"https://images.penguinrandomhouse.com/cover/tif/{isbn}", timeout=60).read()
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    # Every cover is within ~2% of 2:3; fit (a hair of edge crop) so they line up.
    im = ImageOps.fit(im, (900, 1350), Image.LANCZOS)
    im.save(OUT / f"{slug}.webp", quality=86, method=6)
    print(slug, (OUT / f"{slug}.webp").stat().st_size // 1024, "KB")
