"""CC0 stock photos -> src/img/*.webp (640 and full width) + content/photos.json.
Raw downloads (gitignored) and sources.json live next to this script.
Usage, from tsu-concept/: python3 research/photos-src/process.py"""
import json
from pathlib import Path
from PIL import Image

HERE = Path(__file__).parent
OUT = HERE.parent.parent / "src" / "img"
OUT.mkdir(parents=True, exist_ok=True)
src = json.loads((HERE / "sources.json").read_text())

# Alt text written by looking at each photo. Captions say plainly what they are.
ALT = {
    "graduates": "Graduates in black gowns with red hoods walk away along a tree-lined campus path.",
    "freshman": "A young woman in a white blouse holds a folder, standing in tall grass.",
    "studying": "A student's arm rests beside an open laptop and a notebook on a desk.",
}
CREATOR = {"graduates": "rawpixel", "freshman": "Nguyen Nguyen on StockSnap", "studying": "Startup Stock Photos on StockSnap"}

photos = {}
for name, meta in src.items():
    im = Image.open(HERE / f"{name}.jpg").convert("RGB")
    full_w = im.width
    for w in (640, full_w):
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(OUT / f"{name}-{w}.webp", "WEBP", quality=72, method=6)
    photos[name] = {
        "w": full_w, "h": im.height, "sizes": [640, full_w], "alt": ALT[name],
        "creator": CREATOR[name], "license": "CC0 1.0", "landing": meta["landing"],
    }
    print(name, full_w, "x", im.height, [f"{(OUT / f'{name}-{w}.webp').stat().st_size // 1024} KB" for w in (640, full_w)])

(HERE.parent.parent / "content" / "photos.json").write_text(json.dumps(photos, indent=2))
