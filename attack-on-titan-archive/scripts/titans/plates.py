"""Titan specimen plates: one screenshot per Titan, given the personnel
portraits' base treatment (duotone in the site palette with Titan-muscle red
kept, fine halftone, grain) so both read as one archive.

Run from attack-on-titan-archive/:
    python3 scripts/titans/plates.py            # all
    python3 scripts/titans/plates.py cart jaw   # some

Input:  titans-src/<slug>.jpg  (gitignored: raw screenshots never ship)
Output: public/images/titans/<slug>-plate.webp  specimen plate on card, 4:5 (Titan page)
        public/images/titans/<slug>-col.webp    tall crop, 1:2, edges fade out (index column)
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageOps

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "portraits"))
from treat import COND, INK, MONO, base, grain, noise_field  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "titans-src"
OUT = ROOT / "public" / "images" / "titans"

# trim: (left, top, right, bottom) fractions kept, which removes Reddit strips
# and subtitles. plate: ImageOps.fit centering (where the crop sits in the
# slack). col: the point of the source the column is centred on, and coltop
# trims empty sky above a low subject before the column crop.
TITANS = {
    "founding":   dict(n="01", name="FOUNDING TITAN",   h="13 M", trim=(0, 0, 1, 0.925), plate=(0.5, 0.3),  col=(0.5, 0.25)),
    "attack":     dict(n="02", name="ATTACK TITAN",     h="15 M", trim=(0, 0, 1, 0.8),   plate=(0.4, 0.3),  col=(0.38, 0.3)),
    "colossal":   dict(n="03", name="COLOSSAL TITAN",   h="60 M", trim=(0, 0, 1, 0.925), plate=(0.25, 0.4), col=(0.27, 0.4)),
    "armored":    dict(n="04", name="ARMORED TITAN",    h="15 M", trim=(0, 0, 1, 0.925), plate=(0.72, 0.3), col=(0.74, 0.3)),
    "female":     dict(n="05", name="FEMALE TITAN",     h="14 M", trim=(0, 0, 1, 0.925), plate=(0.5, 0.3),  col=(0.5, 0.35)),
    "beast":      dict(n="06", name="BEAST TITAN",      h="17 M", trim=(0, 0, 1, 0.925), plate=(0.5, 0.3),  col=(0.5, 0.3)),
    "jaw":        dict(n="07", name="JAW TITAN",        h="5 M",  trim=(0, 0, 1, 0.925), plate=(0.55, 0.3), col=(0.6, 0.3)),
    "cart":       dict(n="08", name="CART TITAN",       h="4 M",  trim=(0, 0, 1, 0.925), plate=(0.3, 0.6),  col=(0.42, 0.5), coltop=0.3),
    "war-hammer": dict(n="09", name="WAR HAMMER TITAN", h="15 M", trim=(0, 0, 1, 1),     plate=(0.45, 0.3), col=(0.47, 0.3)),
}

CARD = (228, 220, 198)


def load(slug, spec):
    img = Image.open(SRC / f"{slug}.jpg").convert("RGB")
    w, h = img.size
    l, t, r, b = spec["trim"]
    return img.crop((int(l * w), int(t * h), int(r * w), int(b * h)))


def treat(img, seed):
    # upscale small sources before the screen so the halftone stays fine
    if max(img.size) < 1400:
        s = 1400 / max(img.size)
        img = img.resize((int(img.width * s), int(img.height * s)), Image.LANCZOS)
    return base(img, seed, contrast=1.2, keep_red=0.85, halftone=0.13)


def plate(slug, spec, i):
    img = ImageOps.fit(load(slug, spec), (1000, 1250), Image.LANCZOS, centering=spec["plate"])
    photo = treat(img, i).resize((720, 900), Image.LANCZOS)
    W, H = 820, 1100
    card = Image.new("RGB", (W, H), CARD)
    # aged card: mottling and a darker rim
    a = np.asarray(card, float)
    a *= (0.92 + 0.1 * noise_field(W, H, 60, i))[..., None]
    y, x = np.mgrid[0:H, 0:W]
    edge = np.minimum.reduce([x, y, W - 1 - x, H - 1 - y]) / 60
    a *= (0.82 + 0.18 * np.clip(edge, 0, 1))[..., None]
    card = grain(Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)), 7, i + 50)
    card.paste(photo, (50, 50))
    d = ImageDraw.Draw(card)
    d.rectangle((49, 49, 50 + 720, 50 + 900), outline=tuple(int(c) for c in INK), width=2)
    ink = tuple(int(c) for c in INK)
    d.text((50, 975), f"SPECIMEN PLATE {spec['n']} / 09", font=MONO(24), fill=ink)
    d.text((W - 50, 975), f"RECORDED HEIGHT {spec['h']}", font=MONO(24), fill=ink, anchor="ra")
    d.text((50, 1012), spec["name"], font=COND(46), fill=ink)
    card = card.convert("RGBA")
    card.save(OUT / f"{slug}-plate.webp", quality=78, method=6)


def fit_at(img, size, cx, cy):
    """Crop to size's aspect with (cx, cy) of the source as the centre."""
    w, h = img.size
    a = size[0] / size[1]
    cw, ch = (h * a, h) if w / h > a else (w, w / a)
    x0 = min(max(cx * w - cw / 2, 0), w - cw)
    y0 = min(max(cy * h - ch / 2, 0), h - ch)
    return img.crop((int(x0), int(y0), int(x0 + cw), int(y0 + ch))).resize(size, Image.LANCZOS)


def column(slug, spec, i):
    src = load(slug, spec)
    if spec.get("coltop"):
        src = src.crop((0, int(src.height * spec["coltop"]), src.width, src.height))
    img = fit_at(src, (600, 1200), *spec["col"])
    photo = treat(img, i + 100).resize((300, 600), Image.LANCZOS).convert("RGBA")
    # feather into the dark page: soft fade on every edge, longer at the foot
    w, h = photo.size
    y, x = np.mgrid[0:h, 0:w].astype(float)
    fx = np.clip(np.minimum(x, w - 1 - x) / (w * 0.18), 0, 1)
    fy = np.clip(y / (h * 0.08), 0, 1) * np.clip((h - 1 - y) / (h * 0.3), 0, 1)
    alpha = (fx * fy) ** 1.4 * 255
    photo.putalpha(Image.fromarray(alpha.astype(np.uint8)))
    photo.save(OUT / f"{slug}-col.webp", quality=72, method=6, alpha_quality=100)


if __name__ == "__main__":
    want = sys.argv[1:] or list(TITANS)
    for i, slug in enumerate(TITANS):
        if slug not in want:
            continue
        plate(slug, TITANS[slug], i)
        column(slug, TITANS[slug], i)
        sizes = [f"{p.name} {p.stat().st_size // 1024} KB" for p in sorted(OUT.glob(f"{slug}-[pc][lo]*.webp"))]
        print(slug, ", ".join(sizes))
