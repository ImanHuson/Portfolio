"""Draw a numbered contact sheet of the candidates find.py collected.

    python3 scripts/media/sheet.py <key> [start] [count]

Thumbnails come from Commons' standard 330 px width, one request at a time
with a pause, backing off on refusals (the host rate-limits this machine).
"""
import json, os, subprocess, sys, time, urllib.parse
from PIL import Image, ImageDraw, ImageFont

WORK = os.environ.get("MEDIA_WORK", "media-work")
UA = "TerrarumAtlas/1.0 (https://imanhuson.github.io/Portfolio/terrarum/)"


def thumb_url(url):
    path = url.split("/wikipedia/commons/", 1)[1]
    d1, d2, name = path.split("/", 2)
    return f"https://thumb.wikimedia.org/wikipedia/commons/thumb/{d1}/{d2}/{name}/330px-{name}"


def fetch(c):
    out = os.path.join(WORK, "thumbs", f"{c['id']}.jpg")
    if os.path.exists(out) and os.path.getsize(out) > 2000:
        return out
    for attempt in range(4):
        r = subprocess.run(["curl", "-s", "-m", "30", "-A", UA, "-o", out, "-w", "%{http_code}", thumb_url(c["url"])], capture_output=True, text=True)
        if r.stdout == "200" and os.path.getsize(out) > 2000:
            time.sleep(1.5)
            return out
        time.sleep(6 * (attempt + 1))
    return None


def zoom(key, picks):
    """Sharpness check: a 100% crop from the 1280 px copy visitors actually get."""
    cands = json.load(open(os.path.join(WORK, "ov", f"{key}.json")))
    tiles = []
    for n in picks:
        c = cands[n]
        out = os.path.join(WORK, "thumbs", f"{key}-{n}-1280.jpg")
        if not (os.path.exists(out) and os.path.getsize(out) > 5000):
            url = thumb_url(c["url"]).replace("/330px-", "/1280px-")
            subprocess.run(["curl", "-s", "-m", "60", "-A", UA, "-o", out, url])
            time.sleep(2)
        im = Image.open(out).convert("RGB")
        cw, ch = 420, 300
        x, y = (im.width - cw) // 2, (im.height - ch) // 2
        tiles.append((n, im.crop((x, y, x + cw, y + ch))))
    cols = 4
    rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * 424, rows * 322), "white")
    d = ImageDraw.Draw(sheet)
    for i, (n, t) in enumerate(tiles):
        x, y = (i % cols) * 424, (i // cols) * 322
        sheet.paste(t, (x + 2, y + 2))
        d.text((x + 6, y + 303), f"{n} (100% of 1280 px)", fill="black", font=ImageFont.load_default(size=15))
    out = os.path.join(WORK, "sheets", f"{key}-zoom.jpg")
    sheet.save(out, quality=88)
    print(out)


def main():
    key = sys.argv[1]
    if len(sys.argv) > 2 and sys.argv[2] == "zoom":
        return zoom(key, [int(n) for n in sys.argv[3].split(",")])
    start = int(sys.argv[2]) if len(sys.argv) > 2 else 0
    count = int(sys.argv[3]) if len(sys.argv) > 3 else 30
    os.makedirs(os.path.join(WORK, "thumbs"), exist_ok=True)
    os.makedirs(os.path.join(WORK, "sheets"), exist_ok=True)
    cands = json.load(open(os.path.join(WORK, "ov", f"{key}.json")))[start:start + count]
    cols, cw, ch = 5, 330, 250
    rows = (len(cands) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * cw, rows * (ch + 22)), "white")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default(size=15)
    for i, c in enumerate(cands):
        x, y = (i % cols) * cw, (i // cols) * (ch + 22)
        f = fetch(c)
        if f:
            im = Image.open(f).convert("RGB")
            im.thumbnail((cw - 6, ch - 4))
            sheet.paste(im, (x + 3 + (cw - 6 - im.width) // 2, y + 2 + (ch - 4 - im.height) // 2))
        draw.text((x + 4, y + ch + 2), f"{start + i} {c['w']}x{c['h']} {(c.get('q') or '')[:22]}", fill="black", font=font)
    out = os.path.join(WORK, "sheets", f"{key}-{start}.jpg")
    sheet.save(out, quality=82)
    print(out)


main()
