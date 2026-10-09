"""Section backgrounds from public-domain (CC0) museum images: the Cleveland
Museum of Art's Open Access collection (openaccess-api.clevelandart.org; its
images are reachable from this container, The Met's search API is not).

    python3 -I scripts/bg/sourced.py          (from attack-on-titan-archive/)

Downloads each print-size image once into bg-src/cma/ (gitignored), crops
off mounts and borders, and grades it with treat.py's grade() into
public/images/bg/<name>.webp. `ink`: a print on white paper is inverted
first, so its lines read light on the dark page instead of a grey sheet.
Credits for the page live in lib/data/backgrounds.ts.
"""
import pathlib
import sys
import urllib.request

from PIL import Image, ImageOps

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from treat import OUT, grade  # noqa: E402

SRC = pathlib.Path("bg-src/cma")
CDN = "https://openaccess-cdn.clevelandart.org/{a}/{a}_print.jpg"

# name: (accession number, crop box as fractions, ink)
JOBS = {
    "soldiers": ("1942.1248", (0.10, 0.36, 0.92, 0.93), False),  # Homer, A Bivouac Fire on the Potomac, 1861
    "titans": ("1993.8", (0.035, 0.07, 0.97, 0.93), False),  # Agostino Veneziano, Skeletons, 1518
    "liberio": ("1992.329", (0.0, 0.0, 0.975, 1.0), False),  # Sutcliffe, Harbor Scene, c. 1880
    "forest": ("1988.167", (0.0, 0.0, 1.0, 1.0), False),  # Famin, Forest of Fontainebleau, c. 1874
    "memorial": ("1988.159", (0.0, 0.0, 1.0, 1.0), False),  # Barnard, Battlefield of New Hope Church, 1865-66
    "archive": ("2020.276.10", (0.075, 0.07, 0.97, 0.93), True),  # Nolli, La Pianta Grande di Roma, 1748
}

if __name__ == "__main__":
    SRC.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (acc, box, ink) in JOBS.items():
        f = SRC / f"{name}.jpg"
        if not f.exists():
            req = urllib.request.Request(CDN.format(a=acc), headers={"User-Agent": "Mozilla/5.0 aot-archive"})
            f.write_bytes(urllib.request.urlopen(req, timeout=120).read())
        im = Image.open(f).convert("RGB")
        w, h = im.size
        im = im.crop((round(box[0] * w), round(box[1] * h), round(box[2] * w), round(box[3] * h)))
        # shown faint behind text, so 1920 px is plenty and keeps the files light
        im.thumbnail((1920, 1920), Image.LANCZOS)
        if ink:
            im = ImageOps.autocontrast(ImageOps.invert(ImageOps.grayscale(im)), cutoff=1).convert("RGB")
        out = OUT / f"{name}.webp"
        grade(im).save(out, quality=68, method=6)
        print(name, "->", out, Image.open(out).size, f"{out.stat().st_size // 1024} KB")
