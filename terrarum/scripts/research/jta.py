"""The Japan Tourism Agency's multilingual explanation database (JTA
Sightseeing Database, mlit.go.jp/tagengo-db): English texts written for the
sites' own signs, pamphlets and websites, commissioned by the national
tourism agency with each site or local council. Over 9,000 entries.

    jta.py load <xlsm>              export the bulk workbook to $JTA_WORK/jta.jsonl
    jta.py find <regex> [pref]      entries whose English title or text match
    jta.py show <n>                 one entry in full (English and Japanese)
    jta.py url <n>                  find the entry's own page (for citing) and
                                    save it with rs.py as jta-<id>

The bulk file has no page ids, so `url` searches the database by the entry's
English title and keeps the result whose page text matches the entry.
"""
import json, os, re, subprocess, sys, urllib.parse

WORK = os.environ.get("JTA_WORK", "jta-work")
DB = os.path.join(WORK, "jta.jsonl")
SITE = "https://www.mlit.go.jp/tagengo-db/en/"
UA = "Mozilla/5.0 (X11; Linux x86_64) TerrarumAtlas/1.0 (https://imanhuson.github.io/Portfolio/terrarum/)"


def rows():
    return [json.loads(l) for l in open(DB, encoding="utf-8")]


def load(path):
    import openpyxl  # only needed once, to read the workbook

    ws = openpyxl.load_workbook(path, read_only=True, data_only=True)["Sheet1"]
    os.makedirs(WORK, exist_ok=True)
    with open(DB, "w", encoding="utf-8") as out:
        for r in list(ws.iter_rows(values_only=True))[1:]:
            n, yr, pref, council, jt, et, jb, eb = (tuple(r) + (None,) * 8)[:8]
            out.write(json.dumps(dict(n=str(n), yr=yr, pref=(pref or "").strip(), council=council, jt=jt, et=et, jb=jb, eb=eb), ensure_ascii=False) + "\n")


def norm(s):
    return re.sub(r"\W+", " ", s or "").strip().lower()


def find(rx, pref=None):
    p = re.compile(rx, re.I)
    for r in rows():
        if pref and pref not in (r["pref"] or ""):
            continue
        if p.search(r["et"] or "") or p.search(r["eb"] or ""):
            print(f'{r["n"]:>5}  {r["pref"]}  {r["et"]}  | {(r["eb"] or "")[:90]}')


def show(n):
    r = next(x for x in rows() if x["n"] == n)
    print(f'{r["et"]} / {r["jt"]}  ({r["pref"]}, {r["yr"]}, {r["council"]})\n\n{r["eb"]}\n\n{r["jb"]}')


def url(n):
    r = next(x for x in rows() if x["n"] == n)
    # The 2018 (平成30年) entries are numbered in the same order as the bulk file:
    # row n is page H30-<n>. Checked on rows 431, 510-533.
    if "平成30年" in str(r["yr"]):
        print(f"{SITE}H30-{int(n):05d}.html")
        return
    # Untitled rows: search by the opening words of the text instead.
    key = (r["et"] or "").strip() or " ".join((r["eb"] or "").split()[:6])
    # The search takes GET (a POST returns the default listing); ask for 100 hits.
    q = urllib.parse.urlencode({"keyword": key, "page_size": 100})
    res = subprocess.run(["curl", "-s", "-m", "60", "-A", UA, f"{SITE}cgi-bin/search.cgi?{q}"], capture_output=True)
    ids = sorted(set(re.findall(r"((?:R\d|H3\d)-\d{5})\.html", res.stdout.decode("utf-8", "ignore"))))
    # Page ids carry the fiscal year (令和2年 -> R2-); try those first.
    m = re.match(r"令和(\d+)年", str(r["yr"]))
    if m:
        ids = [i for i in ids if i.startswith(f"R{m.group(1)}-")] + [i for i in ids if not i.startswith(f"R{m.group(1)}-")]
    want = norm(r["eb"])[:160]
    rs = os.path.join(os.path.dirname(__file__), "rs.py")
    for i in ids:
        subprocess.run([sys.executable, rs, "get", f"jta-{i}", f"{SITE}{i}.html"], capture_output=True)
        txt = open(os.path.join(os.environ.get("RS_WORK", "rs-work"), f"jta-{i}.txt"), errors="ignore").read()
        if want and want in norm(txt):
            print(f"{SITE}{i}.html")
            return
    print("no page matched; candidates:", " ".join(ids) or "none")


cmd, *rest = sys.argv[1:]
{"load": lambda: load(rest[0]), "find": lambda: find(*rest), "show": lambda: show(rest[0]), "url": lambda: url(rest[0])}[cmd]()
