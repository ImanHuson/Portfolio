"""Real images for the archive's plates, replacing the generated ones where
a real thing comes close to the description. Only public-domain sources:
The Metropolitan Museum of Art's Open Access (CC0) and NASA (not
copyrighted). Credits live in lib/data/credits.ts; keep them in sync.

Three treatments, each for a reason:
- object:   museum photographs sit on light-grey studio paper, which
            glares on the near-black site. The object is cut out (flood
            fill from the corners) and set on the archive's own stage:
            near-black, light from above, a faint burgundy floor.
- planet:   NASA's black space is kept; the disc is centred, and blacks
            are lifted to the page's void so the frame edge disappears.
- painting: cropped to 16:9 and given the covers' light grade (whites
            held to aged bone, a faint grain). Colours are left alone.
- fleet:    ships cut from a supplied ship chart (the video game
            Dreadnought's roster, the user's image, kept in gitignored
            sourced-src/ship-chart.jpg and credited as a stand-in), set in a
            formation above the NASA Mars limb: distant ships smaller and
            hazed toward the void.

    python3 scripts/art/sourced.py          # from the-rising-archive/
    python3 scripts/art/sourced.py razor    # some

Downloads are cached in gitignored sourced-src/.
"""

import sys
import urllib.parse
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "sourced-src"
PUB = ROOT / "public" / "images"
VOID = np.array([7, 7, 10], float)
BONE = np.array([233, 228, 218], float)

MET = "https://images.metmuseum.org/CRDImages/"
NASA = "https://images-assets.nasa.gov/image/"

# out path: (kind, url, options)
JOBS = {
    "vault/razor": ("object", MET + "aa/original/173997.jpg", {"fit": 0.9, "rotate": -38, "tol": 30}),
    "vault/starshell": ("object", MET + "aa/original/DP-46028-001.jpg", {"fit": 0.86}),
    "vault/minds-eye": ("object", MET + "eg/original/DP112570.jpg", {"fit": 0.7}),
    "vault/carving": ("object", MET + "gr/original/DP9053.jpg", {"fit": 0.8, "rotate": -28}),
    "vault/holotech": ("object", MET + "gr/original/DP367987.jpg", {"fit": 0.82}),
    "vault/psychospike": ("object", MET + "as/original/CI49.23ab.jpg", {"fit": 0.84, "rotate": -40}),
    "houses/augustus": ("object", MET + "gr/original/DP-43517-001.jpg", {"fit": 0.84}),
    "houses/bellona": ("object", MET + "ad/original/2002.21.jpg", {"fit": 0.8}),
    "houses/telemanus": ("object", MET + "as/original/LC-10_211_1409-001.jpg", {"fit": 0.78, "tol": 34, "neutral": True}),
    "houses/lune": ("object", MET + "gr/original/DP109367.jpg", {"fit": 0.74, "flame": True}),
    "houses/raa": ("object", MET + "es/original/ES5844.jpg", {"fit": 0.8, "tol": 26}),
    "places/mars": ("planet", NASA + "PIA00407/PIA00407~large.jpg", {}),
    "places/luna": ("planet", NASA + "PIA00405/PIA00405~large.jpg", {}),
    "places/mercury": ("planet", NASA + "PIA15160/PIA15160~large.jpg", {}),
    "places/venus": ("planet", NASA + "PIA23791/PIA23791~orig.jpg", {"half": "right"}),
    "places/io": ("planet", NASA + "PIA02308/PIA02308~large.jpg", {}),
    "places/earth": ("planet", NASA + "GSFC_20171208_Archive_e002131/GSFC_20171208_Archive_e002131~large.jpg", {}),
    "vault/dreadnought": ("fleet", "local:ship-chart.jpg", {"ships": [
        # (crop box in the chart, centre x, centre y, width, depth: 0 near .. 1 far)
        ((565, 38, 940, 132), 0.70, 0.2, 0.46, 0.85),
        ((315, 168, 690, 245), 0.27, 0.29, 0.4, 0.7),
        ((40, 38, 440, 132), 0.5, 0.48, 0.96, 0.0),
    ]}),
    "vault/starship": ("fleet", "local:ship-chart.jpg", {"ships": [
        ((690, 505, 920, 580), 0.78, 0.16, 0.2, 0.9),
        ((390, 505, 625, 580), 0.22, 0.19, 0.22, 0.85),
        ((75, 505, 345, 580), 0.52, 0.1, 0.2, 0.9),
        ((350, 370, 670, 445), 0.28, 0.34, 0.44, 0.55),
        ((600, 280, 925, 352), 0.73, 0.37, 0.44, 0.5),
        ((60, 278, 400, 352), 0.48, 0.56, 0.84, 0.0),
    ]}),
    "rising/movement": ("painting", MET + "ad/original/DP215410.jpg", {"cy": 0.5}),
    "rising/war": ("painting", MET + "ep/original/DT2944.jpg", {"cy": 0.55}),
    "rising/myth": ("painting", MET + "ep/original/DP119115.jpg", {"cy": 0.62}),
    "rising/government": ("painting", MET + "ep/original/DP-13139-001.jpg", {"cy": 0.5}),
}


def fetch(name, url):
    SRC.mkdir(exist_ok=True)
    if url.startswith("local:"):
        return Image.open(SRC / url[6:]).convert("RGB")
    f = SRC / (name.replace("/", "_") + ".jpg")
    if not f.exists():
        # Met originals are huge; its web-large rendition is plenty here.
        url = url.replace("/original/", "/web-large/")
        req = urllib.request.Request(urllib.parse.quote(url, safe=":/~"), headers={"User-Agent": "rising-archive/1.0"})
        try:
            f.write_bytes(urllib.request.urlopen(req, timeout=120).read())
        except Exception as e:
            raise SystemExit(f"{name}: {url}: {e}")
    return Image.open(f).convert("RGB")


def grain(a, amt=2.4, seed=1):
    return a + np.random.default_rng(seed).normal(0, amt, a.shape[:2] + (1,))


def save(a, name, q=84):
    out = PUB / f"{name}.webp"
    Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(out, quality=q, method=6)
    print(name, (out.stat().st_size // 1024), "KB")


def stage(W, H):
    """The archive's stage: near-black, a pool of light from above, a
    faint burgundy floor."""
    y, x = np.mgrid[0:H, 0:W].astype(float)
    a = np.zeros((H, W, 3)) + VOID
    top = np.exp(-(((x - W / 2) / (W * 0.42)) ** 2 + ((y - H * 0.18) / (H * 0.55)) ** 2))
    a += top[..., None] * np.array([34, 30, 30])
    floor = np.exp(-(((x - W / 2) / (W * 0.5)) ** 2 + ((y - H * 0.95) / (H * 0.22)) ** 2))
    a += floor[..., None] * np.array([46, 8, 12])
    return a


def cutout(im, tol=18, neutral=False):
    """Mask of the object. A flood fill from the edges marks the studio paper
    as probable background; OpenCV's GrabCut then separates the object
    properly (the Met's backdrops are gradients a flood fill alone can't
    follow). Small leftover islands are dropped, and the edge is feathered."""
    import cv2

    w, h = im.size
    work = im.copy()
    MARK = (255, 0, 255)
    step = max(4, w // 40)
    seeds = [(x, 0) for x in range(0, w, step)] + [(x, h - 1) for x in range(0, w, step)] + [(0, y) for y in range(0, h, step)] + [(w - 1, y) for y in range(0, h, step)]
    for sd in seeds:
        if work.getpixel(sd) != MARK:
            ImageDraw.floodfill(work, sd, MARK, thresh=tol)
    bg = np.all(np.asarray(work) == MARK, axis=2)
    gc = np.where(bg, cv2.GC_PR_BGD, cv2.GC_PR_FGD).astype(np.uint8)
    b = max(3, int(min(w, h) * 0.02))
    gc[:b, :] = gc[-b:, :] = cv2.GC_BGD
    gc[:, :b] = gc[:, -b:] = cv2.GC_BGD
    img = cv2.cvtColor(np.asarray(im), cv2.COLOR_RGB2BGR)
    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(img, gc, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
    fg = np.isin(gc, (cv2.GC_FGD, cv2.GC_PR_FGD)).astype(np.uint8)
    if neutral:  # a warm object on neutral grey paper: drop the grey
        a = np.asarray(im, float)
        chroma = a.max(axis=2) - a.min(axis=2)
        fg[(chroma < 14) & (a.mean(axis=2) > 120)] = 0
    fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(fg, 8)
    if n > 1:
        big = stats[1:, cv2.CC_STAT_AREA].max()
        keep = [k for k in range(1, n) if stats[k, cv2.CC_STAT_AREA] >= big * 0.06]
        fg = np.isin(lab, keep).astype(np.uint8)
    fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    mask = Image.fromarray(fg * 255).filter(ImageFilter.GaussianBlur(1.4))
    return mask


def do_object(name, im, fit=0.8, rotate=0, tol=18, flame=False, neutral=False):
    W = H = 900
    mask = cutout(im, tol, neutral)
    if rotate:
        im = im.rotate(rotate, expand=True, resample=Image.BICUBIC, fillcolor=(0, 0, 0))
        mask = mask.rotate(rotate, expand=True, resample=Image.BICUBIC, fillcolor=0)
    bbox = mask.getbbox()
    im, mask = im.crop(bbox), mask.crop(bbox)
    s = fit * min(W / im.width, H / im.height)
    size = (max(1, int(im.width * s)), max(1, int(im.height * s)))
    im, mask = im.resize(size, Image.LANCZOS), mask.resize(size, Image.LANCZOS)
    a = stage(W, H)
    ox, oy = (W - size[0]) // 2, int((H - size[1]) * 0.56)
    # Contact shadow on the floor under the object.
    y, x = np.mgrid[0:H, 0:W].astype(float)
    cy = oy + size[1]
    sh = np.exp(-(((x - W / 2) / (size[0] * 0.5)) ** 2 + ((y - cy) / 14) ** 2)) * 0.55
    a = a * (1 - sh[..., None])
    obj = np.asarray(im, float)
    # Warm key from above, slight darkening toward the object's foot, so it
    # sits in the stage light rather than on top of it.
    grad = np.linspace(1.04, 0.82, size[1])[:, None, None]
    obj = obj * grad
    m = np.asarray(mask, float)[..., None] / 255
    region = a[oy : oy + size[1], ox : ox + size[0]]
    a[oy : oy + size[1], ox : ox + size[0]] = region * (1 - m) + obj * m
    if flame:  # Lune: light from darkness, a flame at the lamp's nozzle.
        fx, fy = ox + size[0] * 0.2, oy + size[1] * 0.12
        glow = np.exp(-(((x - fx) / 38) ** 2 + ((y - fy) / 52) ** 2))
        a += glow[..., None] * np.array([255, 170, 70]) * 0.9
        halo = np.exp(-(((x - fx) / 220) ** 2 + ((y - fy) / 220) ** 2))
        a += halo[..., None] * np.array([90, 50, 20]) * 0.5
    save(grain(a), name)


def do_planet(name, im, half=None):
    if half == "right":  # the Venus pair has a white divider down the middle
        im = im.crop((int(im.width * 0.53), 0, im.width, im.height))
    g = np.asarray(im.convert("L"), float)
    ys, xs = np.where(g > 18)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    cx, cy, r = (x0 + x1) / 2, (y0 + y1) / 2, max(x1 - x0, y1 - y0) / 2
    side = int(r * 2 / 0.8)
    box = (int(cx - side / 2), int(cy - side / 2), int(cx + side / 2), int(cy + side / 2))
    canvas = Image.new("RGB", (side, side), (0, 0, 0))
    canvas.paste(im.crop((max(box[0], 0), max(box[1], 0), min(box[2], im.width), min(box[3], im.height))), (max(-box[0], 0), max(-box[1], 0)))
    a = np.asarray(canvas.resize((900, 900), Image.LANCZOS), float)
    a = VOID + a * (1 - VOID / 255)
    save(grain(a, 1.6), name)


def do_painting(name, im, cy=0.5):
    W, H = 1600, 900
    s = max(W / im.width, H / im.height)
    im = im.resize((int(im.width * s + 0.5), int(im.height * s + 0.5)), Image.LANCZOS)
    y = int(min(max(cy * im.height - H / 2, 0), im.height - H))
    x = (im.width - W) // 2
    a = np.asarray(im.crop((x, y, x + W, y + H)), float)
    lum = a @ np.array([0.299, 0.587, 0.114]) / 255
    k = np.clip((lum - 0.8) / 0.2, 0, 1)[..., None] ** 1.5
    a = a * (1 - k * 0.2) + BONE * 0.9 * k * 0.2
    a = VOID + a * (1 - VOID / 255)
    save(grain(a), name)


def ship_mask(im):
    """The chart's ships are light metal on a near-black ground, one ship per
    crop. A luminance key finds the hull, a wide close joins its plates, and
    filling from the edges keeps the dark gaps and engine blocks inside it.
    The rim's alpha follows luminance, so edges fade into the void."""
    import cv2

    lum = np.asarray(im, float) @ np.array([0.299, 0.587, 0.114])
    fg = (lum > 40).astype(np.uint8)
    fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    h, w = fg.shape
    flood = fg.copy()
    cv2.floodFill(flood, np.zeros((h + 2, w + 2), np.uint8), (0, 0), 1)
    fg = (fg | (flood == 0)).astype(np.uint8)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(fg, 8)
    if n > 1:
        big = stats[1:, cv2.CC_STAT_AREA].max()
        fg = np.isin(lab, [k for k in range(1, n) if stats[k, cv2.CC_STAT_AREA] >= big * 0.01]).astype(np.uint8)
    core = cv2.erode(fg, np.ones((5, 5), np.uint8)).astype(float)
    soft = np.clip((lum - 22) / 40, 0, 1)
    alpha = np.where(fg > 0, np.maximum(soft, core), 0)
    return Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))


def do_fleet(name, chart, ships):
    W = H = 900
    y, x = np.mgrid[0:H, 0:W].astype(float)
    a = np.zeros((H, W, 3)) + VOID
    rng = np.random.default_rng(11)
    for _ in range(260):  # a sparse, faint starfield
        sx, sy, b = rng.uniform(0, W), rng.uniform(0, H * 0.8), rng.uniform(40, 170) * rng.uniform(0.2, 1) ** 2
        a[int(sy), int(sx)] += b
    # The Mars limb below: NASA's Viking mosaic. Its equatorial band is bent
    # onto a large arc and darkened, so the ships lead.
    mars = fetch("places/mars", JOBS["places/mars"][1])
    g = np.asarray(mars.convert("L"), float)
    ys, xs = np.where(g > 18)
    d = mars.crop((xs.min(), ys.min(), xs.max(), ys.max()))
    band = np.asarray(d.crop((int(d.width * 0.12), int(d.height * 0.4), int(d.width * 0.88), int(d.height * 0.62))), float)
    top, R = int(H * 0.76), 1500
    cy0 = top + R
    r = np.hypot(x - W / 2, y - cy0)
    u = np.clip(np.arctan2(x - W / 2, cy0 - y) / 0.8 + 0.5, 0, 1)
    v = np.clip((R - r) / (H - top + 20), 0, 1)
    bh, bw = band.shape[:2]
    samp = band[np.clip((v * (bh - 1)).astype(int), 0, bh - 1), np.clip((u * (bw - 1)).astype(int), 0, bw - 1)]
    inside = np.clip((R - r) * 0.8, 0, 1)[..., None]
    shade = (0.3 + 0.4 * np.clip(1 - v * 1.4, 0, 1))[..., None]  # lit at the limb, falling into night
    a = a * (1 - inside) + samp * shade * inside
    atmo = np.exp(-((r - R) / 7) ** 2) + 0.35 * np.exp(-((r - R) / 26) ** 2) * (r > R)
    a += atmo[..., None] * np.array([190, 80, 55]) * 0.55
    glow = np.exp(-(((x - W / 2) / (W * 0.8)) ** 2 + ((y - H * 0.95) / (H * 0.3)) ** 2))
    a += glow[..., None] * np.array([50, 8, 12])
    for box, cx, cy, wf, depth in ships:
        s = chart.crop(box)
        m = ship_mask(s)
        w = int(W * wf)
        h = int(s.height * w / s.width)
        s, m = s.resize((w, h), Image.LANCZOS), m.resize((w, h), Image.LANCZOS)
        obj = np.asarray(s, float)
        # Distance: darker and hazed toward the void.
        obj = obj * (1 - 0.55 * depth) + VOID * 0.55 * depth
        # A warm underside, lit from Mars below.
        obj = obj + (np.linspace(0, 1, h)[:, None, None] ** 2) * np.array([38, 8, 6]) * (1 - depth)
        mm = np.asarray(m, float)[..., None] / 255
        ox, oy = int(cx * W - w / 2), int(cy * H - h / 2)
        reg = a[oy : oy + h, ox : ox + w]
        a[oy : oy + h, ox : ox + w] = reg * (1 - mm) + obj * mm
    save(grain(a, 2.0), name)


for key in sys.argv[1:] or JOBS:
    name = key if "/" in key else next(k for k in JOBS if k.endswith("/" + key))
    kind, url, opt = JOBS[name]
    im = fetch(name, url)
    {"object": do_object, "planet": do_planet, "painting": do_painting, "fleet": do_fleet}[kind](name, im, **opt)
