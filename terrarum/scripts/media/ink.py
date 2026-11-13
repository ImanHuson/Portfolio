"""Japan's branches: cut-outs from Kamisaka Sekka's woodblock plates in
"Flowers of a Hundred Worlds" (Momoyogusa, 1909-10), Cleveland Museum of Art
Open Access (CC0). Each design is lifted off its paper so it can hang on the
night ground: the cherry and willow as the year-round yozakura, and one
branch per season for the seasonal plate.

    python3 scripts/media/ink.py            # fetch (once) and cut every recipe
    python3 scripts/media/ink.py autumn     # one recipe

Raw scans go to media-src/ink/ (gitignored); output to public/media/ink/ as
WebP with alpha, plus a full-plate WebP per season for the "right now" strip.
Needs Pillow, numpy and scikit-image.
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageFilter
from skimage import color, morphology

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SRC = os.path.join(ROOT, "media-src", "ink")
OUT = os.path.join(ROOT, "public", "media", "ink")
UA = "Mozilla/5.0 (X11; Linux x86_64) Chrome/120 TerrarumAtlas/1.0 (https://imanhuson.github.io/Portfolio/terrarum/)"

# keep: how pixels are chosen. "paper" keeps everything far from the paper
# colour; "hue" keeps saturated pixels within hue ranges (degrees).
# crop: (left, top, right, bottom) as fractions of the plate.
RECIPES = {
    "yozakura": dict(cma=154162, keep="paper", thr=12, crop=(0.02, 0.03, 0.97, 0.965)),
    # Spring: the cherry in blossom from the same plate, cropped to the flowering boughs.
    "spring": dict(cma=154162, keep="paper", thr=12, crop=(0.08, 0.42, 0.97, 0.965)),
    "summer": dict(cma=154136, keep="paper", thr=12, crop=(0.02, 0.03, 0.98, 0.965), lift=(62, 66, 70)),
    # Autumn: Kiyohara Yukinobu's maple branch on silk ("Autumn in Takao"), the painting only.
    "autumn": dict(cma=156124, keep="paper", thr=11, crop=(0.12, 0.22, 0.97, 0.66), plate=154180),
    # Winter: Ogata Korin's ink plum; sumi strokes become pale ink on the night ground.
    "winter": dict(cma=151078, keep="ink", crop=(0.1, 0.06, 0.9, 0.66), plate=154167),
}


def fetch(cma):
    os.makedirs(SRC, exist_ok=True)
    path = os.path.join(SRC, f"{cma}.jpg")
    if not os.path.exists(path):
        meta = json.loads(subprocess.run(["curl", "-s", "-m", "60", "-A", UA, f"https://openaccess-api.clevelandart.org/api/artworks/{cma}"], capture_output=True, text=True).stdout)["data"]
        url = (meta["images"].get("print") or meta["images"]["web"])["url"]
        subprocess.run(["curl", "-s", "-m", "180", "-A", UA, "-o", path, url], check=True)
    return path


def paper_colour(lab):
    h, w = lab.shape[:2]
    inner = lab[h // 10: -h // 10, w // 10: -w // 10].reshape(-1, 3)
    vals, counts = np.unique(np.round(inner / 4).astype(int), axis=0, return_counts=True)
    mode = vals[counts.argmax()] * 4
    return inner[np.sqrt(((inner - mode) ** 2).sum(-1)) < 6].mean(axis=0)


def cut(name):
    r = RECIPES[name]
    im = Image.open(fetch(r["cma"])).convert("RGB")
    im.thumbnail((2400, 2400))
    W, H = im.size
    l, t, rt, b = r["crop"]
    im = im.crop((int(l * W), int(t * H), int(rt * W), int(b * H)))
    a = np.asarray(im).astype(float) / 255
    lab = color.rgb2lab(a)
    paper = paper_colour(lab)
    if r["keep"] == "paper":
        m = np.sqrt(((lab - paper) ** 2).sum(-1)) > r["thr"]
    elif r["keep"] == "ink":
        # Sumi on silk: opacity follows how much darker than the silk a pixel is,
        # and the stroke is redrawn in pale ink so it reads on the night ground.
        dens = np.clip((paper[0] - lab[..., 0] - 4) / 32, 0, 1)
        dens[: im.size[1] // 60] = 0
        a8 = (dens ** 0.6 * 255).astype("uint8")
        ivory = Image.new("RGB", im.size, (240, 233, 218))
        ivory.putalpha(Image.fromarray(a8).filter(ImageFilter.GaussianBlur(0.6)))
        ivory = ivory.crop(ivory.getbbox())
        return save(name, r, ivory)
    else:
        hsv = np.asarray(im.convert("HSV")).astype(float)
        hue = hsv[..., 0] * 360 / 255
        sat = hsv[..., 1] / 255
        m = np.zeros(hue.shape, bool)
        for lo, hi in r["hues"]:
            m |= (hue >= lo) & (hue <= hi)
        m &= sat > r["sat"]
    m = morphology.remove_small_objects(m, max_size=80)
    m = morphology.closing(m, morphology.disk(2))
    alpha = Image.fromarray((m * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(1.1))
    rgba = im.copy()
    if r.get("lift"):
        # Black sumi strokes vanish on the night ground: lift them to a dark ink grey.
        arr = np.asarray(rgba).astype(float)
        dark = arr.sum(-1) < 150
        arr[dark] = np.maximum(arr[dark], r["lift"])
        rgba = Image.fromarray(arr.astype("uint8"))
    rgba.putalpha(alpha)
    return save(name, r, rgba.crop(rgba.getbbox()))


def save(name, r, rgba):
    os.makedirs(OUT, exist_ok=True)
    big = rgba.copy()
    big.thumbnail((1200, 1200))
    big.save(os.path.join(OUT, f"{name}.webp"), "WEBP", quality=78, alpha_quality=90, method=6)
    if name != "yozakura":
        plate = Image.open(fetch(r.get("plate", r["cma"]))).convert("RGB")
        plate.thumbnail((1400, 1400))
        plate.save(os.path.join(OUT, f"{name}-plate.webp"), "WEBP", quality=84, method=6)
    print(name, big.size)


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
    for n in sys.argv[1:] or [*RECIPES, "mount"]:
        mount() if n == "mount" else cut(n)
