"""Book covers: the publisher's own images (Del Rey / Penguin Random House,
US editions), fetched from PRH's cover service by ISBN, then filed as
archive copies in the site's palette so they sit with the rest of the
archive: a partial grade toward void/bone, a fine print screen, grain,
worn edges, and one artifact per book (the wear its story would leave),
and the site's burgundy card wash. Still recognisably the published covers: they are
shown, credited, to identify the books.

    python3 scripts/art/covers.py              # from the-rising-archive/
    python3 scripts/art/covers.py iron-gold    # some

Raw TIFFs are cached in the gitignored covers-src/. Fonts are the site's
own (Big Shoulders, Geist Mono; OFL) in scripts/art/fonts/.
"""

import io
import math
import random
import sys
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "covers-src"
OUT = ROOT / "public" / "images" / "covers"
FONTS = Path(__file__).resolve().parent / "fonts"
W, H = 900, 1350

VOID = np.array([7, 7, 10], float)
BONE = np.array([233, 228, 218], float)

BOOKS = {
    # slug: (isbn, numeral, year, artifact, colour kept, white ceiling)
    "red-rising": ("9780345539786", "I", 2014, "dust", 0.62, 0.9),
    "golden-son": ("9780345539816", "II", 2015, "gilt", 0.62, 0.9),
    "morning-star": ("9780345539847", "III", 2016, "bleach", 0.55, 0.9),
    "iron-gold": ("9780425285930", "IV", 2018, "scorch", 0.45, 0.72),
    "dark-age": ("9780425285961", "V", 2019, "stain", 0.45, 0.74),
    "light-bringer": ("9780425285992", "VI", 2023, "clean", 0.62, 0.9),
}


def font(name, size):
    return ImageFont.truetype(str(FONTS / name), size)


def load(slug, isbn):
    SRC.mkdir(exist_ok=True)
    raw = SRC / f"{slug}.tif"
    if not raw.exists():
        raw.write_bytes(urllib.request.urlopen(f"https://images.penguinrandomhouse.com/cover/tif/{isbn}", timeout=60).read())
    im = Image.open(raw).convert("RGB")
    # Every cover is within ~2% of 2:3; fit (a hair of edge crop) so they line up.
    return ImageOps.fit(im, (W, H), Image.LANCZOS)


def smooth_noise(rng, scale, blur):
    n = Image.fromarray((rng.random((H // scale, W // scale)) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
    return np.asarray(n.filter(ImageFilter.GaussianBlur(blur)), float) / 255


def grade(im, keep=0.62, ceiling=0.9):
    """Blend the cover toward a void-to-bone duotone, keeping `keep` of its
    own colour, and pull saturated reds and golds toward the site's accents
    so a blue or yellow cover still belongs to this archive."""
    rgb = np.asarray(im, float) / 255
    lum = rgb @ np.array([0.299, 0.587, 0.114])
    duo = VOID + (BONE - VOID) * lum[..., None]
    col = rgb * 255
    # Desaturate the source a touch and warm it.
    grey = lum[..., None] * 255
    col = grey + (col - grey) * 0.78
    col = col * np.array([1.03, 1.0, 0.94])
    out = col * keep + duo * (1 - keep)
    # Lift the pure blacks to the page's void, and hold the whites down to
    # aged bone, so a white or yellow jacket doesn't glare on the dark page.
    out = VOID + (out / 255) * (BONE * ceiling - VOID)
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def screen(im, cell=4.2, amount=0.12, angle=0.26):
    """A fine rotated dot screen multiplied in lightly: printed, not pop-art."""
    y, x = np.mgrid[0:H, 0:W].astype(float)
    c, s = math.cos(angle), math.sin(angle)
    u, v = (x * c - y * s) / cell, (x * s + y * c) / cell
    dots = (np.cos(u * 2 * math.pi) * np.cos(v * 2 * math.pi)) * 0.5 + 0.5
    arr = np.asarray(im, float)
    lum = (arr @ np.array([0.299, 0.587, 0.114]))[..., None] / 255
    # Screen shows most in the midtones.
    k = amount * (1 - np.abs(lum - 0.5) * 1.6).clip(0, 1)
    arr = arr * (1 - k * (1 - dots[..., None]))
    return Image.fromarray(arr.clip(0, 255).astype(np.uint8))


def grain(im, amount=9, seed=0):
    rng = np.random.default_rng(seed)
    n = rng.normal(0, amount, (H, W, 1))
    return Image.fromarray((np.asarray(im, float) + n).clip(0, 255).astype(np.uint8))


def wear(im, seed):
    """Edge wear: a soft vignette, lighter scuffed corners and a few hairline
    scratches, as if the copy had been handled for years."""
    rnd = random.Random(seed)
    arr = np.asarray(im, float)
    y, x = np.mgrid[0:H, 0:W].astype(float)
    d = np.minimum.reduce([x, y, W - 1 - x, H - 1 - y])
    edge = np.exp(-d / 26)[..., None]
    arr = arr * (1 - 0.35 * edge) + VOID * 0.35 * edge
    # Scuffed corners: bone showing through the ink, noisy.
    noise = np.random.default_rng(seed).random((H, W))
    for cx, cy in [(0, 0), (W, 0), (0, H), (W, H)]:
        r = np.hypot(x - cx, y - cy)
        m = ((r < rnd.uniform(20, 38)) & (noise > r / 42)).astype(float)[..., None] * 0.45
        arr = arr * (1 - m) + np.array([196, 188, 172]) * m
    img = Image.fromarray(arr.clip(0, 255).astype(np.uint8))
    d2 = ImageDraw.Draw(img, "RGBA")
    for _ in range(5):
        x0, y0 = rnd.uniform(0, W), rnd.uniform(0, H)
        a, ln = rnd.uniform(-0.4, 0.4) + math.pi / 2 * rnd.choice([0, 1]), rnd.uniform(60, 260)
        d2.line([(x0, y0), (x0 + math.cos(a) * ln, y0 + math.sin(a) * ln)], fill=(233, 228, 218, 26), width=1)
    return img


def artifact(im, kind, seed):
    """One kind of wear per book."""
    arr = np.asarray(im, float)
    y, x = np.mgrid[0:H, 0:W].astype(float)
    rng = np.random.default_rng(seed + 7)
    if kind == "dust":  # Red Rising: red mine dust settled along the foot.
        n = smooth_noise(rng, 6, 4)
        m = (np.clip((y / H - 0.62) / 0.38, 0, 1) ** 1.6 * (0.35 + 0.65 * n))[..., None] * 0.34
        arr = arr * (1 - m) + np.array([150, 52, 36]) * m
    elif kind == "gilt":  # Golden Son: a gilt edge catching light down the spine side.
        m = (np.exp(-x / 14) * 0.5)[..., None]
        arr = arr * (1 - m) + np.array([210, 172, 71]) * m
    elif kind == "bleach":  # Morning Star: sun-faded from the top right.
        r = np.hypot(x - W * 1.05, y + H * 0.05) / (W * 1.3)
        m = (np.clip(1 - r, 0, 1) ** 1.4 * 0.30)[..., None]
        arr = arr * (1 - m) + np.array([226, 214, 190]) * m
    elif kind == "scorch":  # Iron Gold: a scorched lower corner, clear of the title.
        r = np.hypot(x - W * 1.0, y - H * 1.0) / (W * 0.62)
        n = smooth_noise(rng, 8, 6)
        edge = r + (n - 0.5) * 0.3
        burnt = np.clip((0.24 - edge) / 0.03, 0, 1)[..., None]
        char = np.clip((0.42 - edge) / 0.16, 0, 1)[..., None] * 0.8
        ember = np.exp(-((edge - 0.25) / 0.02) ** 2)[..., None] * 0.6
        arr = arr * (1 - char) + np.array([30, 16, 12]) * char
        arr = arr * (1 - ember) + np.array([196, 70, 30]) * ember
        arr = arr * (1 - burnt) + VOID * burnt
    elif kind == "stain":  # Dark Age: a dried stain, darkening a corner.
        r = np.hypot(x - W * 0.86, y - H * 0.84) / (W * 0.34)
        n = smooth_noise(rng, 10, 8)
        e = r + (n - 0.5) * 0.35
        m = (np.clip((1 - e) / 0.2, 0, 1) * 0.42)[..., None]
        ring = (np.exp(-((e - 1.0) / 0.05) ** 2) * 0.35)[..., None]
        arr = arr * (1 - m) + np.array([92, 18, 22]) * m
        arr = arr * (1 - ring) + np.array([70, 12, 16]) * ring
    return Image.fromarray(arr.clip(0, 255).astype(np.uint8))


def wash(im):
    """The archive's card wash, baked in: a low burgundy glow rising from the
    foot and a thin hot line along the top edge, like a card at rest."""
    arr = np.asarray(im, float)
    y, x = np.mgrid[0:H, 0:W].astype(float)
    glow = (np.clip((y / H - 0.45) / 0.55, 0, 1) ** 1.8 * 0.30)[..., None]
    burg = np.array([122, 15, 23], float)
    # Screen blend, so darks warm up and lights barely change.
    arr = 255 - (255 - arr) * (1 - glow * burg / 255)
    line = (np.exp(-y / 2.2) * 0.55)[..., None]
    arr = arr * (1 - line) + np.array([196, 30, 42], float) * line
    return Image.fromarray(arr.clip(0, 255).astype(np.uint8))


def treat(slug):
    isbn, numeral, year, kind, keep, ceiling = BOOKS[slug]
    seed = sum(map(ord, slug))
    im = load(slug, isbn)
    im = grade(im, keep=keep, ceiling=ceiling)
    im = artifact(im, kind, seed)
    im = screen(im)
    im = wear(im, seed)
    im = wash(im)
    im = grain(im, amount=6, seed=seed)
    OUT.mkdir(parents=True, exist_ok=True)
    im.save(OUT / f"{slug}.webp", quality=80, method=6)
    print(slug, (OUT / f"{slug}.webp").stat().st_size // 1024, "KB")


for slug in sys.argv[1:] or BOOKS:
    treat(slug)
