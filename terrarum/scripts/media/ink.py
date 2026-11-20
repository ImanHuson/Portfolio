"""The cloth of a real hanging-scroll mounting for the Japan gallery: the gold
karakusa brocade and the gold-thread ichimonji strip from Kiyohara Yukinobu's
"Autumn in Takao" (Cleveland Museum of Art, CC0).

    python3 scripts/media/ink.py

Raw scans go to media-src/ink/ (gitignored); output to public/media/ink/.
Sekka's seasonal plates and cut-out branches used to be made here too; they
were removed from the site (Nov 2026) because they looked pasted on.
"""
import json, os, subprocess

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SRC = os.path.join(ROOT, "media-src", "ink")
OUT = os.path.join(ROOT, "public", "media", "ink")
UA = "Mozilla/5.0 (X11; Linux x86_64) Chrome/120 TerrarumAtlas/1.0 (https://imanhuson.github.io/Portfolio/terrarum/)"

def fetch(cma):
    os.makedirs(SRC, exist_ok=True)
    path = os.path.join(SRC, f"{cma}.jpg")
    if not os.path.exists(path):
        meta = json.loads(subprocess.run(["curl", "-s", "-m", "60", "-A", UA, f"https://openaccess-api.clevelandart.org/api/artworks/{cma}"], capture_output=True, text=True).stdout)["data"]
        url = (meta["images"].get("print") or meta["images"]["web"])["url"]
        subprocess.run(["curl", "-s", "-m", "180", "-A", UA, "-o", path, url], check=True)
    return path

def mount():
    """The cloth of a real hanging-scroll mounting (Kiyohara Yukinobu's "Autumn in
    Takao", CMA 156124): the gold karakusa brocade and the gold-thread ichimonji
    strip, used to mount the photographs in the hand-scroll gallery."""
    im = Image.open(fetch(156124)).convert("RGB")
    W, H = im.size
    brocade = im.crop((int(W * 0.03), int(H * 0.003), int(W * 0.97), int(H * 0.034)))
    side = im.crop((int(W * 0.0), int(H * 0.08), int(W * 0.035), int(H * 0.92)))
    ichimonji = im.crop((int(W * 0.1), int(H * 0.037), int(W * 0.9), int(H * 0.061)))
    os.makedirs(OUT, exist_ok=True)
    for name, img, q in (("brocade", brocade, 82), ("brocade-side", side, 82), ("ichimonji", ichimonji, 84)):
        img.save(os.path.join(OUT, f"{name}.webp"), "WEBP", quality=q, method=6)
        print(name, img.size)

if __name__ == "__main__":
    mount()
