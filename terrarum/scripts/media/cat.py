"""Collect candidate photos from a Commons category and its subcategories.

    python3 scripts/media/cat.py <key> "Category:Kinkaku-ji" [more categories...]

Commons sorts a place's photos into subcategories (interiors, gardens, the
place in winter, at night), which is how a gallery gets every side of it, and
lists each file's real size. The category pages are read as ordinary pages
(the API refuses this machine), slowly. Candidates at least MINW px on the long
side (default 2400) are added to $MEDIA_WORK/ov/<key>.json, the same list
find.py writes; licence and author are confirmed later by pick.py.
"""
import html, json, os, re, subprocess, sys, time, urllib.parse

WORK = os.environ.get("MEDIA_WORK", "media-work")
UA = "TerrarumAtlas/1.0 (https://imanhuson.github.io/Portfolio/terrarum/)"
SKIP = re.compile(r"maps?\b|logo|diagram|plan\b|svg|coat of arms|stamps?|postcards?|aerial photographs? by|people of|videos?|audio|drawings?|signs?\b", re.I)


def get(url):
    for attempt in range(4):
        r = subprocess.run(["curl", "-sL", "-m", "40", "-A", UA, url], capture_output=True, text=True)
        if r.stdout and "mw-category" in r.stdout or "gallerybox" in r.stdout:
            time.sleep(1.5)
            return r.stdout
        time.sleep(5 * (attempt + 1))
    return ""


def crawl(cat, depth, seen_cats, out, hint):
    if cat in seen_cats or len(seen_cats) > int(os.environ.get("MAXCATS", "25")):
        return
    seen_cats.add(cat)
    url = "https://commons.wikimedia.org/wiki/" + urllib.parse.quote(cat.replace(" ", "_"))
    while url:
        page = get(url)
        for block in re.findall(r'<li class="gallerybox".*?</li>', page, re.S):
            m = re.search(r'href="/wiki/(File:[^"]+)"', block)
            th = re.search(r'src="(https://[a-z.]+wikimedia\.org/wikipedia/commons/thumb/([0-9a-f])/([0-9a-f]{2})/([^/]+)/)', block)
            dim = re.search(r"([\d,]+) × ([\d,]+); ([\d.]+) ([KMG]B)", block)
            if not (m and th and dim):
                continue
            w, h = int(dim.group(1).replace(",", "")), int(dim.group(2).replace(",", ""))
            name = urllib.parse.unquote(th.group(4))
            if name.lower().rsplit(".", 1)[-1] not in (os.environ.get("EXTS", "jpg,jpeg").split(",")) or max(w, h) < int(os.environ.get("MINW", "2400")):
                continue
            size = float(dim.group(3)) * {"KB": 1e-3, "MB": 1, "GB": 1e3}[dim.group(4)]
            fid = html.unescape(urllib.parse.unquote(m.group(1)))
            out.setdefault(fid, {
                "id": fid, "q": hint, "title": fid, "creator": None, "license": "?", "lv": None,
                "landing": "https://commons.wikimedia.org/wiki/" + urllib.parse.quote(fid.replace(" ", "_")),
                "url": f"https://upload.wikimedia.org/wikipedia/commons/{th.group(2)}/{th.group(3)}/{th.group(4)}",
                "w": w, "h": h, "mb": round(size, 1), "tags": [],
            })
        nxt = re.search(r'<a href="(/w/index\.php\?title=Category:[^"]+filefrom=[^"]+)"[^>]*>next page</a>', page)
        url = "https://commons.wikimedia.org" + html.unescape(nxt.group(1)) if nxt else None
        if len(out) > int(os.environ.get("MAXFILES", "400")):
            return
    if depth <= 0:
        return
    for sub in re.findall(r'<a href="/wiki/(Category:[^"]+)" title="Category:[^"]+">[^<]+</a></bdi> <span title="Contains', page):
        sub = html.unescape(urllib.parse.unquote(sub)).replace("_", " ")
        if not SKIP.search(sub):
            crawl(sub, depth - 1, seen_cats, out, sub.removeprefix("Category:"))


def search(query, out):
    """Commons' own file search, read as a page: better ranking than Openverse,
    and every hit carries its real size."""
    for offset in range(0, int(os.environ.get("SEARCH_MAX", "200")), 100):
        url = ("https://commons.wikimedia.org/w/index.php?" + urllib.parse.urlencode(
            {"search": query, "title": "Special:Search", "profile": "advanced", "fulltext": "1", "ns6": "1", "limit": "100", "offset": str(offset)}))
        r = subprocess.run(["curl", "-sL", "-m", "60", "-A", UA, url], capture_output=True, text=True)
        items = re.findall(r'<li class="mw-search-result[^"]*".*?</li>', r.stdout, re.S)
        for block in items:
            m = re.search(r'href="/wiki/(File:[^"]+)"', block)
            th = re.search(r'src="https://[a-z.]+wikimedia\.org/wikipedia/commons/thumb/([0-9a-f])/([0-9a-f]{2})/([^/]+)/', block)
            dim = re.search(r'data-file-width="(\d+)" data-file-height="(\d+)"', block)
            if not (m and th and dim):
                continue
            w, h = int(dim.group(1)), int(dim.group(2))
            name = urllib.parse.unquote(th.group(3))
            if name.lower().rsplit(".", 1)[-1] not in os.environ.get("EXTS", "jpg,jpeg").split(",") or max(w, h) < int(os.environ.get("MINW", "2400")):
                continue
            fid = html.unescape(urllib.parse.unquote(m.group(1)))
            out.setdefault(fid, {
                "id": fid, "q": query, "title": fid, "creator": None, "license": "?", "lv": None,
                "landing": "https://commons.wikimedia.org/wiki/" + urllib.parse.quote(fid.replace(" ", "_")),
                "url": f"https://upload.wikimedia.org/wikipedia/commons/{th.group(1)}/{th.group(2)}/{th.group(3)}",
                "w": w, "h": h, "tags": [],
            })
        time.sleep(2)
        if len(items) < 100:
            break


def main():
    key, cats = sys.argv[1], sys.argv[2:]
    os.makedirs(os.path.join(WORK, "ov"), exist_ok=True)
    path = os.path.join(WORK, "ov", f"{key}.json")
    existing = json.load(open(path)) if os.path.exists(path) else []
    out = {c["id"]: c for c in existing}
    seen = set()
    for cat in cats:
        if cat.startswith("search:"):
            search(cat[7:], out)
            continue
        crawl(cat if cat.startswith("Category:") else "Category:" + cat, int(os.environ.get("DEPTH", "2")), seen, out, cat.removeprefix("Category:"))
    # Round-robin across subcategories, largest first within each, so a sheet
    # shows every side of the place instead of one photographer's series.
    groups = {}
    for c in sorted(out.values(), key=lambda c: -(c["w"] * c["h"])):
        groups.setdefault(c["q"], []).append(c)
    items = []
    while any(groups.values()):
        for g in list(groups.values()):
            if g:
                items.append(g.pop(0))
    json.dump(items, open(path, "w"), ensure_ascii=False, indent=0)
    print(f"{key}: {len(items)} candidates from {len(seen)} categories")


main()
