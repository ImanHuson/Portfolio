"""Search Openverse for openly licensed Wikimedia Commons photos of a subject.

    python3 scripts/media/find.py <key> "<query>" ["<query>" ...]

Writes every candidate (wide enough, free licence) to $MEDIA_WORK/ov/<key>.json
for sheet.py to draw. Openverse is used because the Commons API refuses this
build machine; it indexes Commons with licence, creator and size. Anonymous
Openverse allows page_size <= 20, so each query reads up to `pages` pages.
"""
import json, os, subprocess, sys, time, urllib.parse

WORK = os.environ.get("MEDIA_WORK", "media-work")
LICENSES = "by,by-sa,cc0,pdm"


def search(q, page):
    url = "https://api.openverse.org/v1/images/?" + urllib.parse.urlencode(
        {"q": q, "source": "wikimedia", "license": LICENSES, "page_size": 20, "page": page, "mature": "false"})
    for attempt in range(5):
        r = subprocess.run(["curl", "-s", "-m", "40", url], capture_output=True, text=True)
        try:
            return json.loads(r.stdout)
        except json.JSONDecodeError:
            time.sleep(4 * (attempt + 1))
    return {"results": []}


def main():
    key, queries = sys.argv[1], sys.argv[2:]
    pages = int(os.environ.get("PAGES", "2"))
    minw = int(os.environ.get("MINW", "1600"))
    os.makedirs(os.path.join(WORK, "ov"), exist_ok=True)
    path = os.path.join(WORK, "ov", f"{key}.json")
    seen = {c["id"]: c for c in json.load(open(path))} if os.path.exists(path) else {}
    for q in queries:
        for page in range(1, pages + 1):
            d = search(q, page)
            for r in d.get("results", []):
                w, h = r.get("width") or 0, r.get("height") or 0
                if max(w, h) < minw or r["id"] in seen:
                    continue
                if not r["url"].startswith("https://upload.wikimedia.org/wikipedia/commons/"):
                    continue
                if r["url"].lower().rsplit(".", 1)[-1] not in ("jpg", "jpeg", "png", "webp"):
                    continue
                seen[r["id"]] = {
                    "id": r["id"], "q": q, "title": r["title"], "creator": r.get("creator"), "license": r["license"],
                    "lv": r.get("license_version"), "landing": r["foreign_landing_url"], "url": r["url"], "w": w, "h": h,
                    "tags": [t["name"] for t in (r.get("tags") or [])][:12],
                }
            if page >= (d.get("page_count") or 0):
                break
            time.sleep(1.2)
    json.dump(list(seen.values()), open(path, "w"), ensure_ascii=False, indent=0)
    print(f"{key}: {len(seen)} candidates")


main()
