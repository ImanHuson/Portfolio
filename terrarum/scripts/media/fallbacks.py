"""Keep a small local copy of every photo served from Wikimedia Commons.

    python3 scripts/media/fallbacks.py

Photos load from Commons' image host (GitHub Pages caps a site at 1 GB). If
Commons is unreachable, or a file is ever deleted there, the page swaps in
this 500 px copy (see the error listener in app/layout.tsx). Each is ~30 KB,
so eleven countries' worth stays far under the cap. Downloads are slow and
polite; files already present are skipped.
"""
import io, json, os, subprocess, sys, time, urllib.parse
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(ROOT, "public", "media", "c")
UA = "TerrarumAtlas/1.0 (https://imanhuson.github.io/Portfolio/terrarum/)"


def main():
    os.makedirs(OUT, exist_ok=True)
    items = []
    for name in sorted(os.listdir(HERE)):
        if name.startswith("remote-") and name.endswith(".json"):
            items += list(json.load(open(os.path.join(HERE, name))).items())
    done = fails = 0
    for key, p in items:
        dest = os.path.join(OUT, f"{key}.webp")
        if os.path.exists(dest):
            continue
        d1, d2, name = p["path"].split("/", 2)
        f = urllib.parse.quote(name)
        url = f"https://thumb.wikimedia.org/wikipedia/commons/thumb/{d1}/{d2}/{f}/500px-{f}" if p["w"] > 500 else f"https://upload.wikimedia.org/wikipedia/commons/{d1}/{d2}/{f}"
        for attempt in range(4):
            r = subprocess.run(["curl", "-s", "-m", "60", "-A", UA, url], capture_output=True)
            try:
                im = Image.open(io.BytesIO(r.stdout)).convert("RGB")
                im.save(dest, "WEBP", quality=70, method=6)
                done += 1
                break
            except Exception:
                time.sleep(5 * (attempt + 1))
        else:
            fails += 1
            print("FAILED", key, file=sys.stderr)
        time.sleep(1.2)
    print(f"fallbacks: {done} new, {fails} failed, {len(items)} total")


main()
