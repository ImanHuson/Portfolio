#!/usr/bin/env python3
"""Fetch CC0 assets from Poly Haven (api.polyhaven.com) for ogl/WebGL scenes.

Commands:
  search  --type hdris|textures|models [--category C] [--query Q] [--limit N]
  hdri    <id> [--res 1k|2k|4k] [--out DIR] [--bg-width 2048]
  texture <id> [--res 1k|2k] [--maps diff,nor_gl,rough,ao,disp,arm] [--out DIR]
  model   <id> [--res 1k|2k] [--out DIR]

Every download appends an entry to <out>/polyhaven-credits.json (name, authors,
page URL). Poly Haven's API terms require crediting Poly Haven on the site; the
assets themselves are CC0. Needs Python 3.10+, numpy and Pillow (hdri only).
"""
from __future__ import annotations

import argparse
import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path

API = "https://api.polyhaven.com"
UA = "ImanHuson-Portfolio-skill/1.0 (+https://github.com/ImanHuson/Portfolio)"


def get(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()


def api(path: str):
    return json.loads(get(API + path))


def credit(out: Path, asset_id: str, kind: str, files: list[str]) -> None:
    info = api(f"/info/{asset_id}")
    path = out / "polyhaven-credits.json"
    data = json.loads(path.read_text()) if path.exists() else {}
    data[asset_id] = {
        "name": info.get("name"),
        "type": kind,
        "authors": list((info.get("authors") or {}).keys()),
        "license": "CC0",
        "page": f"https://polyhaven.com/a/{asset_id}",
        "files": files,
    }
    path.write_text(json.dumps(data, indent=2) + "\n")


def save(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(get(url))
    print(f"  {dest} ({dest.stat().st_size // 1024} KB)", file=sys.stderr)


# ---------- search ----------

def cmd_search(a) -> None:
    q = {"t": a.type}
    if a.category:
        q["c"] = a.category
    assets = api("/assets?" + urllib.parse.urlencode(q))
    rows = []
    for aid, info in assets.items():
        hay = " ".join([aid, info.get("name", ""), *info.get("tags", []), *info.get("categories", [])]).lower()
        if a.query and not all(w in hay for w in a.query.lower().split()):
            continue
        rows.append((info.get("download_count", 0), aid, info))
    rows.sort(reverse=True)
    for _, aid, info in rows[: a.limit]:
        extra = f" polys={info['polycount']}" if info.get("polycount") else ""
        print(f"{aid:42s} {info.get('name','')[:34]:34s} [{', '.join(info.get('categories', [])[:4])}]{extra}")
    print(f"{len(rows)} match(es)", file=sys.stderr)


# ---------- hdri ----------

def read_hdr(data: bytes):
    """Minimal Radiance .hdr (RGBE, new-style RLE) reader -> float32 HxWx3."""
    import numpy as np

    i = 0
    while True:  # header lines until a blank line
        j = data.index(b"\n", i)
        line = data[i:j]
        i = j + 1
        if line == b"":
            break
    j = data.index(b"\n", i)
    dims = data[i:j].split()
    i = j + 1
    if dims[0] != b"-Y" or dims[2] != b"+X":
        sys.exit("error: unsupported .hdr orientation")
    h, w = int(dims[1]), int(dims[3])
    img = np.zeros((h, w, 4), dtype=np.uint8)
    buf = memoryview(data)
    for y in range(h):
        if buf[i] != 2 or buf[i + 1] != 2:
            sys.exit("error: old-style .hdr encoding not supported")
        i += 4
        for c in range(4):
            x = 0
            while x < w:
                n = buf[i]
                i += 1
                if n > 128:
                    n -= 128
                    img[y, x : x + n, c] = buf[i]
                    i += 1
                else:
                    img[y, x : x + n, c] = np.frombuffer(buf[i : i + n], dtype=np.uint8)
                    i += n
                x += n
    e = img[..., 3].astype(np.int32)
    scale = np.where(e > 0, np.ldexp(1.0, e - 136), 0.0).astype(np.float32)
    return img[..., :3].astype(np.float32) * scale[..., None]


def to_rgbm(rgb, max_range: float = 6.0):
    """Encode linear HDR as RGBM (8-bit). Decode in GLSL: rgb * a * 6.0."""
    import numpy as np

    v = np.clip(rgb / max_range, 0, 1)
    m = np.clip(np.max(v, axis=-1, keepdims=True), 1e-6, 1)
    m = np.ceil(m * 255) / 255
    return np.concatenate([np.clip(v / m, 0, 1), m], axis=-1)


def aces(x):
    a, b, c, d, e = 2.51, 0.03, 2.43, 0.59, 0.14
    return (x * (a * x + b)) / (x * (c * x + d) + e)


def cmd_hdri(a) -> None:
    import numpy as np
    from PIL import Image, ImageFilter

    files = api(f"/files/{a.id}")["hdri"]
    url = files[a.res]["hdr"]["url"]
    out = Path(a.out)
    raw = out / f"{a.id}_{a.res}.hdr"
    save(url, raw)
    hdr = read_hdr(raw.read_bytes())
    h, w, _ = hdr.shape

    def u8(arr):
        return Image.fromarray((np.clip(arr, 0, 1) * 255 + 0.5).astype(np.uint8))

    # 1. Background: tone-mapped sRGB equirect, WebP.
    bg = aces(hdr * a.exposure) ** (1 / 2.2)
    img = u8(bg)
    if img.width > a.bg_width:
        img = img.resize((a.bg_width, a.bg_width // 2), Image.LANCZOS)
    img.save(out / f"{a.id}-bg.webp", quality=88)

    # 2. Specular env: RGBM PNG, linear, for sharp-ish reflections (sample with textureLod/mips).
    spec_w = min(w, 1024)
    spec = np.stack([np.asarray(Image.fromarray(hdr[..., c]).resize((spec_w, spec_w // 2), Image.BILINEAR)) for c in range(3)], -1)
    u8(to_rgbm(spec)).save(out / f"{a.id}-env-rgbm.png", optimize=True)

    # 3. Diffuse irradiance stand-in: tiny, heavily blurred RGBM (good enough for ambient light).
    small = np.stack([np.asarray(Image.fromarray(hdr[..., c]).resize((128, 64), Image.BOX)) for c in range(3)], -1)
    rgbm = u8(to_rgbm(small)).filter(ImageFilter.GaussianBlur(6)).resize((64, 32), Image.BILINEAR)
    rgbm.save(out / f"{a.id}-diffuse-rgbm.png", optimize=True)

    raw.unlink() if not a.keep_hdr else None
    credit(out, a.id, "hdri", [f"{a.id}-bg.webp", f"{a.id}-env-rgbm.png", f"{a.id}-diffuse-rgbm.png"])
    print(f"done: {a.id} ({w}x{h} source)", file=sys.stderr)


# ---------- textures ----------

def cmd_texture(a) -> None:
    from PIL import Image

    files = api(f"/files/{a.id}")
    out = Path(a.out)
    written = []
    for m in [s.strip() for s in a.maps.split(",") if s.strip()]:
        key = {"diff": "Diffuse", "nor_gl": "nor_gl", "rough": "Rough", "ao": "AO", "disp": "Displacement", "arm": "arm"}.get(m, m)
        if key not in files:
            print(f"  skip {m}: not offered ({', '.join(files)})", file=sys.stderr)
            continue
        entry = files[key][a.res]
        fmt = "jpg" if "jpg" in entry else next(iter(entry))
        tmp = out / f"{a.id}_{m}.{fmt}"
        save(entry[fmt]["url"], tmp)
        dest = out / f"{a.id}_{m}_{a.res}.webp"
        Image.open(tmp).convert("RGB").save(dest, quality=90 if m == "diff" else 95)
        tmp.unlink()
        written.append(dest.name)
    credit(out, a.id, "texture", written)


# ---------- models ----------

def cmd_model(a) -> None:
    files = api(f"/files/{a.id}")
    g = files["gltf"][a.res]["gltf"]
    out = Path(a.out) / a.id
    save(g["url"], out / Path(g["url"]).name)
    names = [Path(g["url"]).name]
    for rel, f in g.get("include", {}).items():
        save(f["url"], out / rel)
        names.append(rel)
    info = api(f"/info/{a.id}")
    print(f"done: {a.id} polycount={info.get('polycount')} dims(mm)={info.get('dimensions')}", file=sys.stderr)
    credit(Path(a.out), a.id, "model", [f"{a.id}/{n}" for n in names])


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("search")
    s.add_argument("--type", required=True, choices=["hdris", "textures", "models"])
    s.add_argument("--category")
    s.add_argument("--query")
    s.add_argument("--limit", type=int, default=20)
    s.set_defaults(fn=cmd_search)

    h = sub.add_parser("hdri")
    h.add_argument("id")
    h.add_argument("--res", default="2k", choices=["1k", "2k", "4k"])
    h.add_argument("--out", default=".")
    h.add_argument("--bg-width", type=int, default=2048)
    h.add_argument("--exposure", type=float, default=1.0)
    h.add_argument("--keep-hdr", action="store_true")
    h.set_defaults(fn=cmd_hdri)

    t = sub.add_parser("texture")
    t.add_argument("id")
    t.add_argument("--res", default="1k", choices=["1k", "2k", "4k"])
    t.add_argument("--maps", default="diff,nor_gl,rough")
    t.add_argument("--out", default=".")
    t.set_defaults(fn=cmd_texture)

    m = sub.add_parser("model")
    m.add_argument("id")
    m.add_argument("--res", default="1k", choices=["1k", "2k", "4k"])
    m.add_argument("--out", default=".")
    m.set_defaults(fn=cmd_model)

    a = p.parse_args()
    a.fn(a)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
