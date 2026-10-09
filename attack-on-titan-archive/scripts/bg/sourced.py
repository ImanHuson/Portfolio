"""Every image behind the archive's sections and scroll scenes, from two
sources: public-domain (CC0) museum images from the Cleveland Museum of Art's
Open Access collection, and the anime frames the user supplied (titans-src/,
gitignored). Nothing here is rendered or generated.

    python3 -I scripts/bg/sourced.py [name ...]      (from attack-on-titan-archive/)

CMA images are fetched once at print size (3400 px) into bg-src/cma/
(gitignored; the API and CDN want a browser-like User-Agent). Each job crops
off mounts and margins and is graded into the archive's palette:
  photo  blacks lifted to the page ground, whites held at paper, eased colour
  ink    a print on white paper, inverted so its lines read light on the dark page
  paint  a lighter grade that keeps a painting's own colour
  frame  an anime frame: a touch of the archive's warmth, the colour kept
  night  a daylight photograph turned to moonlight: dark, cold, the sky to black
Output: public/images/bg/<name>.webp. Credits: lib/data/backgrounds.ts.
"""
import pathlib
import sys
import urllib.request

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from treat import OUT, grade  # noqa: E402

SRC = pathlib.Path("bg-src/cma")
CDN = "https://openaccess-cdn.clevelandart.org/{a}/{a}_print.jpg"

# name: (source, crop box as fractions, mode, long side in px)
#   source: a CMA accession number, or "local:<path>" for a supplied frame
JOBS = {
    # sections (CC0, Cleveland Museum of Art)
    "soldiers": ("1942.1248", (0.10, 0.36, 0.92, 0.93), "photo", 1920),  # Homer, A Bivouac Fire on the Potomac, 1861
    "titans": ("1993.8", (0.035, 0.07, 0.97, 0.93), "photo", 1920),  # Veneziano, Skeletons, 1518
    "liberio": ("1992.329", (0.0, 0.0, 0.975, 1.0), "photo", 1920),  # Sutcliffe, Harbor Scene, c. 1880
    "forest": ("1988.167", (0.0, 0.0, 1.0, 1.0), "photo", 1920),  # Famin, Forest of Fontainebleau, c. 1874
    "memorial": ("1988.159", (0.0, 0.0, 1.0, 1.0), "photo", 1920),  # Barnard, New Hope Church, 1865-66
    "archive": ("2020.276.10", (0.075, 0.07, 0.97, 0.93), "ink", 1920),  # Nolli, Pianta Grande di Roma, 1748
    "city": ("1949.565", (0.02, 0.05, 0.98, 0.95), "photo", 2400),  # de' Barbari, View of Venice, 1500
    "rampart": ("2024.5.30", (0.0, 0.12, 1.0, 0.97), "photo", 2400),  # Bourne, Delhi, the Kashmir Gate, 1863-70
    "town-gate": ("2003.278", (0.01, 0.05, 0.99, 0.92), "ink", 1920),  # Hollar, Moated Town Gate, 1676
    "city-ink": ("1949.565", (0.02, 0.05, 0.98, 0.95), "ink", 1920),  # de' Barbari again, in negative
    "burning": ("1942.647", (0.0, 0.0, 1.0, 1.0), "paint", 2400),  # Turner, Burning of the Houses of Parliament, 1835
    "fort": ("2018.215", (0.0, 0.1, 1.0, 0.9), "photo", 1920),  # Photoglob, Agra. The Fort, 1890
    "colossi": ("1992.306", (0.0, 0.0, 1.0, 0.92), "photo", 2400),  # Beato, The Colossi of Memnon, c. 1860s
    "colossi-pair": ("2006.119", (0.0, 0.08, 1.0, 0.88), "photo", 1920),  # Bechard, The Colossi of Memnon, 1870s
    "sea": ("1924.195", (0.0, 0.0, 1.0, 1.0), "paint", 2400),  # Homer, Early Morning After a Storm at Sea, 1900-03
    "prison-stair": ("1941.26.12", (0.02, 0.03, 0.98, 0.97), "photo", 2000),  # Piranesi, Carceri XII
    "prison-platform": ("1941.26.8", (0.03, 0.05, 0.97, 0.95), "photo", 2000),  # Piranesi, Carceri X
    "siege-right": ("1923.69.a", (0.0, 0.03, 1.0, 0.97), "ink", 2400),  # Durer, Siege of a Fortress, 1527
    "siege-left": ("1923.69.b", (0.0, 0.03, 1.0, 0.97), "ink", 1920),
    "dunes": ("2002.45", (0.0, 0.15, 1.0, 0.92), "photo", 2400),
    "dunes-night": ("2002.45", (0.02, 0.12, 0.58, 0.8), "night", 2000),  # the same, as moonlight for Paths  # O'Sullivan, Sand Dunes, Carson Desert, 1867
    "simoom": ("2012.263", (0.0, 0.0, 0.6, 0.95), "paint", 2000),  # Haghe after Roberts, Approach of the Simoon, 1849
    "still-life": ("1965.235", (0.0, 0.0, 1.0, 1.0), "paint", 1920),  # Harnett, Memento Mori, 1879
    "candle": ("2023.1", (0.0, 0.3, 1.0, 0.84), "paint", 1920),  # Therbusch, A Scientist by Candlelight, 1755
    # the user's frames (anime screenshots; same fair-use call as the portraits)
    "colossal-wall": ("local:titans-src/colossal.jpg", (0.0, 0.0, 1.0, 0.925), "frame", 1920),
    "rumbling-founding": ("local:titans-src/founding-rumbling.jpg", (0.0, 0.0, 1.0, 0.905), "frame", 900),
    "rumbling-founding-haze": ("local:titans-src/founding-rumbling.jpg", (0.0, 0.0, 1.0, 0.905), "haze", 640),
}


def load(name, src):
    if src.startswith("local:"):
        return Image.open(src[6:]).convert("RGB")
    f = SRC / f"{src}.jpg"
    if not f.exists():
        req = urllib.request.Request(CDN.format(a=src), headers={"User-Agent": "Mozilla/5.0 aot-archive"})
        f.write_bytes(urllib.request.urlopen(req, timeout=120).read())
    return Image.open(f).convert("RGB")


def light(im, sat):
    """the paint/frame grade: keep the colour, hold whites below paper, lift
    blacks to the page ground, a little grain"""
    im = ImageEnhance.Color(im).enhance(sat)
    lut = []
    for lo, hi in ((11, 236), (12, 228), (10, 206)):
        lut += [round(lo + (hi - lo) * (v / 255)) for v in range(256)]
    im = im.point(lut)
    noise = Image.effect_noise(im.size, 20).convert("L")
    return Image.blend(im, Image.merge("RGB", (noise,) * 3), 0.03)


if __name__ == "__main__":
    SRC.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    only = set(sys.argv[1:])
    for name, (src, box, mode, size) in JOBS.items():
        if only and name not in only:
            continue
        im = load(name, src)
        w, h = im.size
        im = im.crop((round(box[0] * w), round(box[1] * h), round(box[2] * w), round(box[3] * h)))
        im.thumbnail((size, size), Image.LANCZOS)
        if mode == "ink":
            im = grade(ImageOps.autocontrast(ImageOps.invert(ImageOps.grayscale(im)), cutoff=1).convert("RGB"))
        elif mode == "photo":
            im = grade(im)
        elif mode == "night":
            g = ImageOps.grayscale(im).point(lambda v: round(255 * (v / 255) ** 2.6))
            im = ImageOps.colorize(g, black=(3, 5, 11), mid=(24, 44, 58), white=(150, 186, 190), midpoint=150)
        elif mode == "haze":  # the same frame as a blurred, darkened ground behind its framed print
            im = ImageEnhance.Brightness(light(im, 0.8).filter(ImageFilter.GaussianBlur(18))).enhance(0.45)
        elif mode == "paint":
            im = light(im, 0.9)
        else:  # frame
            im = light(im, 0.92)
        out = OUT / f"{name}.webp"
        im.save(out, quality=72, method=6)
        print(f"{name:18} {im.size[0]}x{im.size[1]} {out.stat().st_size // 1024} KB")
