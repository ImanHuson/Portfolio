"""Personnel-file portraits: each character's screenshot becomes a different
recovered artifact (a burned print, a map-clipped photo, a research notebook
page, a Marleyan poster...), over one shared base treatment so they read as
one archive: duotone in the site palette, a fine halftone screen, film grain.

Run from attack-on-titan-archive/:
    python3 scripts/portraits/treat.py            # all
    python3 scripts/portraits/treat.py eren annie # some

Input:  portraits-src/<name>.jpg   (gitignored: raw screenshots never ship)
Output: public/images/personnel/<name>.webp  (RGBA, ~900 px on the long side)

Fonts are the site's own (OFL), converted from the build's woff2.
"""

import math
import random
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "portraits-src"
OUT = ROOT / "public" / "images" / "personnel"
FONTS = Path(__file__).resolve().parent / "fonts"

INK = np.array([22, 23, 20], float)
PAPER = np.array([216, 208, 184], float)
BLOOD = (110, 23, 23)


def font(name, size):
    return ImageFont.truetype(str(FONTS / name), size)


MONO = lambda s: font("Courier_Prime_Bold.ttf", s)
COND = lambda s: font("Barlow_Condensed_Bold_700.ttf", s)
ITAL = lambda s: font("IM_FELL_English_Italic.ttf", s)
SERIF = lambda s: font("Cinzel_Bold.ttf", s)


# ---------------------------------------------------------------- base look

def crop(img, box, aspect=None):
    w, h = img.size
    x0, y0, x1, y1 = box
    img = img.crop((int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)))
    if aspect:
        img = ImageOps.fit(img, (1000, int(1000 / aspect)), centering=(0.5, 0.35))
    return img


def fit(img, long_side=820):
    w, h = img.size
    s = long_side / max(w, h)
    return img.resize((max(1, int(w * s)), max(1, int(h * s))), Image.LANCZOS)


def tone(img, ink=INK, paper=PAPER, contrast=1.15, keep_red=0.0, fade=0.0):
    """Duotone from ink to paper. keep_red lets saturated reds survive as the
    only colour in the frame (Mikasa's scarf)."""
    rgb = np.asarray(img.convert("RGB"), float) / 255
    lum = rgb @ np.array([0.299, 0.587, 0.114])
    lo, hi = np.percentile(lum, 2), np.percentile(lum, 98)
    lum = np.clip((lum - lo) / max(hi - lo, 1e-3), 0, 1)
    lum = np.clip((lum - 0.5) * contrast + 0.5, 0, 1)
    lum = lum * (1 - fade) + fade * 0.78
    out = ink[None, None] + (paper - ink)[None, None] * lum[..., None]
    if keep_red:
        r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
        red = np.clip((r - np.maximum(g, b)) * 3.2 - 0.25, 0, 1) * keep_red
        tint = np.array([150, 28, 24], float) * (0.35 + lum[..., None] * 0.8)
        out = out * (1 - red[..., None]) + tint * red[..., None]
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def halftone(img, cell=4.0, amount=0.16, angle=0.26):
    """A fine rotated dot screen, multiplied in lightly: print, not pop-art."""
    a = np.asarray(img, float)
    h, w = a.shape[:2]
    y, x = np.mgrid[0:h, 0:w].astype(float)
    c, s = math.cos(angle), math.sin(angle)
    u, v = (x * c - y * s) / cell, (x * s + y * c) / cell
    dots = (np.sin(u * 2 * math.pi) * np.sin(v * 2 * math.pi)) * 0.5 + 0.5
    lum = a.mean(axis=2) / 255
    screen = np.where(dots < lum * 1.1, 1.0, 1 - amount)
    return Image.fromarray(np.clip(a * screen[..., None], 0, 255).astype(np.uint8))


def grain(img, amount=10, seed=0):
    rng = np.random.default_rng(seed)
    a = np.asarray(img, float)
    n = rng.normal(0, amount, a.shape[:2])[..., None]
    return Image.fromarray(np.clip(a + n, 0, 255).astype(np.uint8))


def vignette(img, strength=0.35):
    a = np.asarray(img, float)
    h, w = a.shape[:2]
    y, x = np.mgrid[0:h, 0:w]
    d = np.sqrt(((x - w / 2) / (w / 2)) ** 2 + ((y - h / 2) / (h / 2)) ** 2)
    f = 1 - strength * np.clip(d - 0.55, 0, 1) ** 1.5
    return Image.fromarray(np.clip(a * f[..., None], 0, 255).astype(np.uint8))


def base(img, seed, **kw):
    ht = kw.pop("halftone", 0.16)
    img = tone(img, **kw)
    img = halftone(img, amount=ht)
    img = vignette(img)
    return grain(img, seed=seed)


def noise_field(w, h, scale, seed):
    """Smooth value noise in 0..1 (upsampled random grid)."""
    rng = np.random.default_rng(seed)
    g = rng.random((max(2, int(h / scale)) + 2, max(2, int(w / scale)) + 2))
    return np.asarray(Image.fromarray((g * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), float) / 255


def paper(w, h, seed, color=PAPER, fibre=10):
    a = np.ones((h, w, 3)) * color
    a *= (0.93 + 0.1 * noise_field(w, h, 60, seed))[..., None]
    a += np.random.default_rng(seed + 1).normal(0, fibre / 3, (h, w))[..., None]
    # foxing: a few soft brown stains
    stains = noise_field(w, h, 140, seed + 2)
    a -= (np.clip(stains - 0.72, 0, 1) * 120)[..., None] * np.array([0.6, 0.75, 1.0])
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).convert("RGBA")


def shadowed(obj, pad=40, blur=18, alpha=150, offset=(6, 14)):
    """Place an RGBA object on a transparent canvas with a soft drop shadow."""
    w, h = obj.size
    canvas = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    sh = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    mask = obj.split()[3].point(lambda v: alpha if v > 10 else 0)
    sh.paste((0, 0, 0, 255), (pad + offset[0], pad + offset[1]), mask)
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    canvas = Image.alpha_composite(canvas, sh)
    canvas.alpha_composite(obj, (pad, pad))
    return canvas


def rotate(obj, deg):
    return obj.rotate(deg, resample=Image.BICUBIC, expand=True)


def stamp(draw_img, text, xy, size=34, deg=-6, color=BLOOD, box=True, seed=0):  # noqa: ARG001
    """A rubber stamp: condensed caps, uneven ink, slightly rotated."""
    f = COND(size)
    tw = draw_img.textlength(text, font=f) if hasattr(draw_img, "textlength") else f.getlength(text)
    pad = int(size * 0.35)
    layer = Image.new("RGBA", (int(tw) + pad * 2 + 8, size + pad * 2 + 8), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.text((pad + 4, pad + 2), text, font=f, fill=color + (255,))
    if box:
        d.rectangle((2, 2, layer.width - 3, layer.height - 3), outline=color + (255,), width=max(2, size // 12))
    # uneven ink: knock out specks
    a = np.asarray(layer).copy()
    n = noise_field(layer.width, layer.height, 3, seed) * 0.6 + np.random.default_rng(seed).random(a.shape[:2]) * 0.4
    a[..., 3] = (a[..., 3] * np.clip((n - 0.1) * 3.0, 0, 1) * 0.95).astype(np.uint8)
    return rotate(Image.fromarray(a), deg), xy


def paste_stamp(img, text, xy, **kw):
    s, _ = stamp(ImageDraw.Draw(img), text, xy, **kw)
    img.alpha_composite(s, xy)


# ------------------------------------------------------------- the artifacts

def print_with_border(photo, border=26, color=(226, 219, 199)):
    w, h = photo.size
    card = Image.new("RGBA", (w + border * 2, h + border * 2), color + (255,))
    card = Image.alpha_composite(card, paper(card.width, card.height, 3, np.array(color, float), fibre=6))
    card.paste(photo.convert("RGBA"), (border, border))
    return card


def burned(photo, seed):
    """Eren: a print that went through a fire. Scorched, a corner gone."""
    card = print_with_border(photo, 22)
    w, h = card.size
    a = np.asarray(card).astype(float)
    y, x = np.mgrid[0:h, 0:w]
    edge = np.minimum.reduce([x, y, w - 1 - x, h - 1 - y]).astype(float)
    n = noise_field(w, h, 26, seed) * 60 + noise_field(w, h, 7, seed + 3) * 18
    # the missing corner: a burned-away diagonal at the top right
    corner = (w - x) + y * 0.9 - w * 0.34 + n * 0.8
    keep = np.minimum(edge + n - 38, corner)
    char = np.clip(1 - keep / 26, 0, 1)
    a[..., :3] = a[..., :3] * (1 - char[..., None] * 0.88) + np.array([40, 20, 8]) * char[..., None] * 0.88
    glow = np.clip(1 - np.abs(keep) / 5, 0, 1)
    a[..., :3] += np.array([120, 45, 10]) * glow[..., None] * 0.6
    a[..., 3] = np.where(keep > 0, 255, 0)
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def map_clip(photo, seed, label):
    """Armin: a photo clipped to a hand-annotated map sheet."""
    pw, ph = photo.size
    W, H = int(pw * 1.32), int(ph * 1.28)
    sheet = paper(W, H, seed, np.array([214, 204, 176], float))
    d = ImageDraw.Draw(sheet)
    # contour lines from a noise height field
    hgt = noise_field(W, H, 90, seed + 5)
    lines = (np.abs((hgt * 14) % 1 - 0.5) < 0.03)
    a = np.asarray(sheet).copy()
    a[lines] = (a[lines] * 0.55 + np.array([120, 90, 60, 255]) * 0.45).astype(np.uint8)
    sheet = Image.fromarray(a)
    d = ImageDraw.Draw(sheet)
    for gx in range(0, W, 90):
        d.line([(gx, 0), (gx, H)], fill=(120, 100, 70, 90), width=1)
    for gy in range(0, H, 90):
        d.line([(0, gy), (W, gy)], fill=(120, 100, 70, 90), width=1)
    d.text((24, H - 46), label, font=MONO(20), fill=(70, 55, 40, 230))
    ph_ = rotate(print_with_border(photo, 14), 3.5)
    sheet.alpha_composite(ph_, (int(W * 0.14), int(H * 0.05)))
    # the paper clip, bent wire across the top edge
    cx, cy = int(W * 0.5), int(H * 0.035)
    for i, (rw, rh) in enumerate([(26, 110), (17, 86)]):
        d.rounded_rectangle((cx - rw, cy - 10 + i * 8, cx + rw, cy + rh), radius=rw, outline=(90, 92, 95, 255), width=5)
    return sheet


def card_mount(photo, seed, name, role):
    """Erwin: a formal portrait on thick mount board with a bevelled window."""
    pw, ph = photo.size
    W, H = pw + 150, ph + 260
    board = paper(W, H, seed, np.array([196, 186, 160], float), fibre=5)
    d = ImageDraw.Draw(board)
    x0, y0 = 75, 75
    d.rectangle((x0 - 8, y0 - 8, x0 + pw + 8, y0 + ph + 8), fill=(232, 226, 208, 255))
    board.paste(photo.convert("RGBA"), (x0, y0))
    d.rectangle((x0 - 8, y0 - 8, x0 + pw + 8, y0 + ph + 8), outline=(150, 138, 110, 255), width=2)
    f1, f2 = SERIF(40), COND(24)
    tw = d.textlength(name, font=f1)
    d.text(((W - tw) / 2, y0 + ph + 45), name, font=f1, fill=(34, 32, 28, 255))
    tw = d.textlength(role, font=f2)
    d.text(((W - tw) / 2, y0 + ph + 105), role, font=f2, fill=(90, 80, 64, 255))
    return board


def snapshot(photo, seed, caption):
    """Connie, Sasha: a candid snapshot, white border, ink caption."""
    pw, ph = photo.size
    W, H = pw + 56, ph + 130
    snap = paper(W, H, seed, np.array([232, 228, 214], float), fibre=4)
    snap.paste(photo.convert("RGBA"), (28, 28))
    d = ImageDraw.Draw(snap)
    d.text((34, ph + 52), caption, font=ITAL(40), fill=(40, 44, 70, 235))
    return snap


def notebook(photo, seed, notes):
    """Hange: a research notebook page, the photo taped in, notes around it."""
    pw, ph = photo.size
    W, H = int(pw * 1.25), int(ph * 1.45)
    page = paper(W, H, seed, np.array([224, 218, 196], float), fibre=5)
    d = ImageDraw.Draw(page)
    for y in range(90, H, 38):
        d.line([(0, y), (W, y)], fill=(120, 140, 170, 90), width=1)
    d.line([(70, 0), (70, H)], fill=(170, 60, 60, 120), width=2)
    ph_ = rotate(print_with_border(photo, 10), -2.5)
    px, py = int(W * 0.12), 70
    page.alpha_composite(ph_, (px, py))
    # tape: two translucent strips over the corners
    for (tx, ty, deg) in [(px - 20, py - 6, 32), (px + ph_.width - 110, py + ph_.height - 40, 28)]:
        tape = Image.new("RGBA", (150, 42), (230, 222, 190, 150))
        page.alpha_composite(rotate(tape, deg), (tx, ty))
    y = py + ph_.height + 30
    for line in notes:
        d.text((90, y), line, font=ITAL(32), fill=(35, 40, 60, 235))
        y += 50
    return page


def frosted(photo, seed):
    """Annie: a cold print, frost creeping in from the edges (the crystal)."""
    card = print_with_border(photo, 20, color=(214, 220, 222))
    w, h = card.size
    a = np.asarray(card).astype(float)
    y, x = np.mgrid[0:h, 0:w]
    edge = np.minimum.reduce([x, y, w - 1 - x, h - 1 - y]).astype(float)
    cryst = noise_field(w, h, 9, seed) * 0.6 + noise_field(w, h, 3, seed + 1) * 0.4
    frost = np.clip(1 - (edge - 10) / 110 + (cryst - 0.5) * 0.9, 0, 1) ** 1.6
    a[..., :3] = a[..., :3] * (1 - frost[..., None] * 0.75) + np.array([226, 236, 242]) * frost[..., None] * 0.75
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def faded_damaged(photo, seed):
    """Ymir: a water-damaged, half-faded print, a torn lower edge."""
    card = print_with_border(photo, 18)
    w, h = card.size
    a = np.asarray(card).astype(float)
    y, x = np.mgrid[0:h, 0:w]
    stain = noise_field(w, h, 160, seed)
    tide = np.clip((stain - 0.62) * 4, 0, 1)
    a[..., :3] = a[..., :3] * (1 - tide[..., None] * 0.4) + np.array([200, 186, 150]) * tide[..., None] * 0.4
    ring = np.clip(1 - np.abs(stain - 0.62) / 0.01, 0, 1)
    a[..., :3] -= (ring * 38)[..., None]
    tear = h - 1 - y - (noise_field(w, h, 14, seed + 4) * 36 + 6)
    a[..., 3] = np.where(tear > 0, 255, 0)
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def engraving(src, seed, caption):
    """Historia: an engraved royal portrait, like a banknote, in an oval."""
    g = np.asarray(ImageOps.autocontrast(src.convert("L"), cutoff=2), float) / 255
    h, w = g.shape
    y, x = np.mgrid[0:h, 0:w].astype(float)
    # horizontal engraving lines whose width follows darkness, bent by the tone
    period = 5.0
    phase = (y + (g - 0.5) * 6) / period
    line = np.abs((phase % 1) - 0.5) * 2
    ink = line < (1 - g) * 0.95
    a = np.where(ink[..., None], np.array([40, 36, 52], float), np.array([222, 214, 190], float))
    img = Image.fromarray(a.astype(np.uint8)).convert("RGBA")
    W, H = w + 140, h + 230
    sheet = paper(W, H, seed, np.array([214, 206, 182], float), fibre=4)
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).ellipse((6, 6, w - 6, h - 6), fill=255)
    sheet.paste(img, (70, 70), mask)
    d = ImageDraw.Draw(sheet)
    for k, col in [(0, (60, 54, 70, 255)), (10, (60, 54, 70, 160))]:
        d.ellipse((70 - 6 - k, 70 - 6 - k, 70 + w + 6 + k, 70 + h + 6 + k), outline=col, width=3 if k == 0 else 1)
    tw = d.textlength(caption, font=SERIF(38))
    d.text(((W - tw) / 2, 70 + h + 60), caption, font=SERIF(38), fill=(40, 36, 52, 255))
    return sheet


def poster(photo, seed, headline, sub, dark=(30, 26, 24), red=(150, 30, 26)):
    """Gabi, Zeke: a Marleyan print. Two inks on cheap paper, a red band."""
    g = np.asarray(ImageOps.autocontrast(photo.convert("L"), cutoff=3), float) / 255
    h, w = g.shape
    th = np.where(g < 0.42, 0, np.where(g < 0.7, 1, 2))
    pal = np.array([dark, (150, 136, 118), (214, 204, 180)], float)
    img = Image.fromarray(pal[th].astype(np.uint8)).convert("RGBA")
    img = halftone(img.convert("RGB"), cell=5, amount=0.22).convert("RGBA")
    W, H = w + 90, h + 300
    sheet = paper(W, H, seed, np.array([212, 202, 176], float))
    d = ImageDraw.Draw(sheet)
    d.rectangle((0, 0, W, 150), fill=red + (255,))
    f = COND(92)
    tw = d.textlength(headline, font=f)
    d.text(((W - tw) / 2, 22), headline, font=f, fill=(232, 222, 200, 255))
    sheet.paste(img, (45, 175))
    f2 = COND(46)
    tw = d.textlength(sub, font=f2)
    d.text(((W - tw) / 2, 175 + h + 30), sub, font=f2, fill=dark + (255,))
    return sheet


def index_card(photo, seed, file_no, name):
    """Reiner (Marley side): a clean intelligence index card, typed."""
    pw, ph = photo.size
    W, H = pw + 120, ph + 220
    card = paper(W, H, seed, np.array([200, 198, 190], float), fibre=4)
    d = ImageDraw.Draw(card)
    d.text((60, 40), file_no, font=MONO(24), fill=(40, 40, 40, 255))
    d.line([(60, 80), (W - 60, 80)], fill=(90, 90, 90, 255), width=2)
    card.paste(photo.convert("RGBA"), (60, 100))
    d.text((60, 100 + ph + 30), name, font=MONO(30), fill=(30, 30, 30, 255))
    return card


def basement_photo(photo, seed):
    """Grisha: one of the basement photographs. Sepia, deckled edge, old."""
    ph_ = photo.convert("RGBA")
    w, h = ph_.size
    card = Image.new("RGBA", (w + 44, h + 44), (224, 212, 184, 255))
    card = Image.alpha_composite(card, paper(card.width, card.height, seed, np.array([224, 212, 184], float), fibre=5))
    card.paste(ph_, (22, 22))
    a = np.asarray(card).astype(float)
    H_, W_ = a.shape[:2]
    y, x = np.mgrid[0:H_, 0:W_]
    edge = np.minimum.reduce([x, y, W_ - 1 - x, H_ - 1 - y]).astype(float)
    deckle = edge - (np.sin(x * 0.9) * 2.5 + np.sin(y * 0.9) * 2.5 + 3)
    a[..., 3] = np.where(deckle > 0, 255, 0)
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


# ------------------------------------------------------------------ the file

SEPIA_INK = np.array([40, 26, 16], float)
SEPIA_PAPER = np.array([222, 198, 158], float)
COLD_INK = np.array([22, 28, 36], float)
COLD_PAPER = np.array([206, 214, 218], float)
MARLEY_INK = np.array([26, 26, 26], float)
MARLEY_PAPER = np.array([196, 194, 186], float)

# name: (crop box as fractions, target aspect, rotation, builder)
PEOPLE = {
    "eren": ((0.2, 0.0, 0.76, 1.0), 0.95, -3.0,
             lambda p, s: burned(p, s)),
    "mikasa": ((0.34, 0.0, 0.88, 1.0), 0.9, 2.0,
               lambda p, s: print_with_border(p, 24)),
    "armin": ((0.24, 0.0, 0.8, 1.0), 0.9, 0.0,
              lambda p, s: map_clip(p, s, "PARADIS / SOUTH / SURVEY GRID 12")),
    "levi": ((0.05, 0.02, 0.95, 0.98), 0.8, -2.0,
             lambda p, s: print_with_border(p, 20)),
    "erwin": ((0.12, 0.08, 1.0, 0.5), 0.8, 0.0,
              lambda p, s: card_mount(p, s, "Erwin Smith", "13TH COMMANDER, SURVEY CORPS")),
    "reiner": ((0.24, 0.0, 1.0, 1.0), 0.85, 1.5,
               lambda p, s: index_card(p, s, "MARLEY / WARRIOR UNIT / FILE 0112", "BRAUN, REINER")),
    "connie": ((0.12, 0.0, 0.94, 1.0), 0.9, 4.0,
               lambda p, s: snapshot(p, s, "Connie Springer")),
    "sasha": ((0.36, 0.0, 1.0, 1.0), 1.1, -4.5,
              lambda p, s: snapshot(p, s, "Sasha Braus")),
    "jean": ((0.05, 0.0, 1.0, 1.0), 0.95, 2.5,
             lambda p, s: print_with_border(p, 22)),
    "hange": ((0.14, 0.0, 0.9, 1.0), 1.05, 0.0,
              lambda p, s: notebook(p, s, ["Hange Zoë", "Squad Leader, then 14th Commander"])),
    "annie": ((0.0, 0.0, 1.0, 0.87), 0.85, -2.0,
              lambda p, s: frosted(p, s)),
    "grisha": ((0.0, 0.0, 1.0, 1.0), 0.95, 3.0,
               lambda p, s: basement_photo(p, s)),
    "gabi": ((0.0, 0.0, 1.0, 1.0), 0.95, -1.5,
             lambda p, s: poster(p, s, "WARRIOR CANDIDATE", "GABI BRAUN")),
    "zeke": ((0.22, 0.0, 0.84, 0.8), 0.9, 1.0,
             lambda p, s: poster(p, s, "WAR CHIEF", "ZEKE YEAGER", red=(120, 26, 24))),
    "ymir": ((0.0, 0.0, 1.0, 1.0), 0.9, -3.5,
             lambda p, s: faded_damaged(p, s)),
    "historia": ((0.28, 0.02, 0.74, 0.62), 0.8, 0.0,
                 lambda p, s: engraving(p, s, "Historia Reiss")),
}

TONES = {
    "grisha": dict(ink=SEPIA_INK, paper=SEPIA_PAPER, fade=0.18),
    "annie": dict(ink=COLD_INK, paper=COLD_PAPER),
    "reiner": dict(ink=MARLEY_INK, paper=MARLEY_PAPER, contrast=1.3),
    "mikasa": dict(keep_red=1.0),
    "ymir": dict(fade=0.28),
}

# the builders that draw their own image from the raw crop (not the toned base)
RAW = {"historia", "gabi", "zeke"}

STAMPS = {
    "mikasa": ("104TH CADET CORPS", (40, 40)),
    "jean": ("SURVEY CORPS", (40, 36)),
    "levi": ("SURVEY CORPS", (40, 36)),
    "eren": ("CLASSIFIED", (60, 60)),
    "annie": ("MILITARY POLICE", (40, 40)),
}


def build(name):
    box, aspect, deg, make = PEOPLE[name]
    src = Image.open(SRC / f"{name}.jpg").convert("RGB")
    seed = sum(map(ord, name))
    random.seed(seed)
    raw = fit(crop(src, box, aspect), 760)
    photo = raw if name in RAW else base(raw, seed, **TONES.get(name, {}))
    art = make(photo, seed).convert("RGBA")
    if name in STAMPS:
        text, xy = STAMPS[name]
        paste_stamp(art, text, xy, size=46, deg=-7, color=(140, 26, 24), seed=seed)
    art = shadowed(rotate(art, deg))
    OUT.mkdir(parents=True, exist_ok=True)
    art = fit(art, 900)
    art.save(OUT / f"{name}.webp", "WEBP", quality=80, method=6)
    return art


if __name__ == "__main__":
    names = sys.argv[1:] or [n for n in PEOPLE if (SRC / f"{n}.jpg").exists()]
    for n in names:
        a = build(n)
        print(f"{n:9s} {a.size[0]}x{a.size[1]}  {(OUT / f'{n}.webp').stat().st_size // 1024} KB")
