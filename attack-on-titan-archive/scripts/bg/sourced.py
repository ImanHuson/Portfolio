"""Every image behind the archive's sections and scroll scenes: anime frames
from the Attack on Titan Wiki (bg-src/wiki/, see WIKI below) and the user's
own frame. The CMA (CC0) path is kept for museum images. Nothing here is
rendered or generated.

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
    # the user's own frame (the opening's Colossal Titan over the Wall)
    "colossal-wall": ("local:titans-src/colossal.jpg", (0.0, 0.0, 1.0, 0.925), "frame", 1920),
    # CC0 museum images (Cleveland Museum of Art) were the site's backgrounds
    # before the anime frames below replaced them; add one back as
    # "name": ("<accession number>", (crop box), "photo" | "ink" | "paint", px).
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


# Anime frames from the Attack on Titan Wiki (attackontitan.fandom.com, its
# image CDN is reachable here), fetched into bg-src/wiki/ (gitignored) by the
# picker in the session scratchpad; meta.json records each frame's wiki title.
# Same fair-use call as the portraits and Titan plates; credited on the page.
WIKI = pathlib.Path("bg-src/wiki")
if (WIKI / "meta.json").exists():
    import json

    for _name in json.loads((WIKI / "meta.json").read_text()):
        JOBS.setdefault(f"aot-{_name}", (f"local:{WIKI}/{_name}.png", (0.0, 0.0, 1.0, 1.0), "frame", 2560 if _name == "rumbling-marley" else 1920))


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
