"""Record chosen photos in scripts/media/remote-<country>.json.

    python3 scripts/media/pick.py <country> <key> <picks.json>

<picks.json> maps a media id to {"n": candidate index, "side": ..., "alt": ...,
"location": ...}. Each pick's licence and author are re-read from its Commons
file page (the authority; Openverse's copy can be stale) before it is saved.
"""
import html, json, os, re, subprocess, sys, time, urllib.parse

WORK = os.environ.get("MEDIA_WORK", "media-work")
HERE = os.path.dirname(os.path.abspath(__file__))
UA = "TerrarumAtlas/1.0 (https://imanhuson.github.io/Portfolio/terrarum/)"
SIDES = {"approach", "exterior", "interior", "detail", "grounds", "surroundings", "view", "people", "season", "night", "aerial", "history"}
LIC_PAGE = [
    (r"Creative Commons Attribution-Share Alike 4\.0|CC BY-SA 4\.0", ("by-sa", "4.0")),
    (r"Creative Commons Attribution-Share Alike 3\.0|CC BY-SA 3\.0", ("by-sa", "3.0")),
    (r"Creative Commons Attribution-Share Alike 2\.5|CC BY-SA 2\.5", ("by-sa", "2.5")),
    (r"Creative Commons Attribution-Share Alike 2\.0|CC BY-SA 2\.0", ("by-sa", "2.0")),
    (r"Creative Commons Attribution 4\.0|CC BY 4\.0", ("by", "4.0")),
    (r"Creative Commons Attribution 3\.0|CC BY 3\.0", ("by", "3.0")),
    (r"Creative Commons Attribution 2\.5|CC BY 2\.5", ("by", "2.5")),
    (r"Creative Commons Attribution 2\.0|CC BY 2\.0", ("by", "2.0")),
    (r"CC0|Creative Commons Zero", ("cc0", "1.0")),
    (r"public domain", ("pdm", "1.0")),
]


RANK = {"pdm": 0, "cc0": 1, "by": 2, "by-sa": 3}


def license_of(block_link, block_short):
    """Map one licence template (its link and short name) to (code, version)."""
    m = re.search(r"creativecommons\.org/(licenses|publicdomain)/([a-z-]+)/(\d\.\d)", block_link or "")
    if m:
        kind, code, ver = m.groups()
        if kind == "publicdomain":
            return ("cc0", ver) if code == "zero" else ("pdm", ver)
        return (code, ver) if code in ("by", "by-sa") else None  # NC/ND/other: not free enough
    if re.search(r"public domain", block_short or "", re.I):
        return ("pdm", "1.0")
    return None


def verify(landing, file_url):
    # The file name in the image URL is the one certain key to its Commons page
    # (Openverse gives curid links and display titles instead).
    name = file_url.rsplit("/", 1)[1]
    url = landing if "/wiki/File:" in landing else f"https://commons.wikimedia.org/wiki/File:{name}"
    page = ""
    for attempt in range(4):
        r = subprocess.run(["curl", "-sL", "-m", "40", "-A", UA, url], capture_output=True, text=True)
        page = r.stdout.replace("&#95;", "_")
        if "licensetpl" in page or "fileinfotpl" in page:
            break
        time.sleep(5 * (attempt + 1))
    else:
        return None
    text = lambda h: html.unescape(re.sub(r"\s+", " ", re.sub("<[^>]+>", " ", h))).strip()
    links = re.findall(r'class="licensetpl_link"[^>]*>(.*?)</span>', page, re.S)
    shorts = re.findall(r'class="licensetpl_short"[^>]*>(.*?)</span>', page, re.S)
    found = [license_of(text(links[i]) if i < len(links) else "", text(s)) for i, s in enumerate(shorts)]
    found = [f for f in found if f]
    lic = min(found, key=lambda f: RANK[f[0]]) if found else None
    m = re.search(r'id="fileinfotpl_aut"[^>]*>.*?</td>\s*<td[^>]*>(.*?)</td>', page, re.S)
    author = text(m.group(1)) if m else None
    canonical = re.search(r'<link rel="canonical" href="([^"]+)"', page)
    time.sleep(1.5)
    return {"license": lic, "author": author, "page": canonical.group(1) if canonical else url, "all": found}


def main():
    country, key, picks_path = sys.argv[1:4]
    cands = json.load(open(os.path.join(WORK, "ov", f"{key}.json")))
    out_path = os.path.join(HERE, f"remote-{country}.json")
    store = json.load(open(out_path)) if os.path.exists(out_path) else {}
    for mid, p in json.load(open(picks_path)).items():
        c = cands[p["n"]]
        assert p["side"] in SIDES, (mid, p["side"])
        assert len(p["alt"]) >= 25, mid
        v = verify(c["landing"], c["url"])
        if not v or not v["license"]:
            print(f"SKIP {mid}: licence not confirmed on Commons page"); continue
        if c["license"] not in ("?", v["license"][0]):
            print(f"NOTE {mid}: Openverse said {c['license']} {c['lv']}, Commons page says {v['license']}")
        path = urllib.parse.unquote(c["url"].split("/wikipedia/commons/", 1)[1])
        store[mid] = {
            "file": path.split("/", 2)[2], "path": path, "title": c["title"].removeprefix("File:").rsplit(".", 1)[0],
            "creator": (v["author"] or c["creator"] or "Unknown")[:160], "license": v["license"][0], "lv": v["license"][1],
            "landing": v["page"], "w": c["w"], "h": c["h"], "side": p["side"], "alt": p["alt"], "location": p.get("location"),
            "place": key, "accessed": time.strftime("%Y-%m-%d"),
        }
        for k in ("kind", "date", "creator"):
            if p.get(k):
                store[mid][k] = p[k]
        print(f"ok {mid} {v['license']} {store[mid]['creator'][:40]}")
    json.dump(store, open(out_path, "w"), ensure_ascii=False, indent=1, sort_keys=True)


main()
