"""Research helper: keep each source's text on disk and read it by line.

    rs.py get <id> <url>          fetch (HTML or PDF) to $RS_WORK/<id>.txt
    rs.py grep <id> <word> ...    matching lines with line numbers
    rs.py show <id> <from> <n>    n lines from line <from>
"""
import html, os, re, subprocess, sys

WORK = os.environ.get("RS_WORK", "rs-work")
UA = "Mozilla/5.0 (X11; Linux x86_64) TerrarumAtlas/1.0 (https://imanhuson.github.io/Portfolio/terrarum/)"


def get(i, url):
    os.makedirs(WORK, exist_ok=True)
    raw = os.path.join(WORK, f"{i}.raw")
    r = subprocess.run(["curl", "-sL", "-m", "60", "-A", UA, "-o", raw, "-w", "%{http_code} %{content_type}", url], capture_output=True, text=True)
    code, _, ctype = r.stdout.partition(" ")
    if "pdf" in ctype or url.lower().endswith(".pdf"):
        subprocess.run(["pdftotext", "-layout", raw, os.path.join(WORK, f"{i}.txt")])
    else:
        s = open(raw, encoding="utf-8", errors="ignore").read()
        title = re.search(r"(?is)<title>(.*?)</title>", s)
        s = re.sub(r"(?is)<(script|style|noscript|svg|nav|footer|header)\b.*?</\1>", " ", s)
        s = re.sub(r"(?i)<br\s*/?>|</(p|div|li|h\d|tr|section|article)>", "\n", s)
        s = html.unescape(re.sub(r"(?s)<[^>]+>", " ", s))
        lines = [re.sub(r"[ \t　]+", " ", l).strip() for l in s.split("\n")]
        lines = [l for l in lines if len(l) > 2]
        open(os.path.join(WORK, f"{i}.txt"), "w").write((f"TITLE: {html.unescape(title.group(1).strip())}\n" if title else "") + f"URL: {url}\n" + "\n".join(lines))
    n = sum(1 for _ in open(os.path.join(WORK, f"{i}.txt"), errors="ignore")) if os.path.exists(os.path.join(WORK, f"{i}.txt")) else 0
    print(f"{i}: HTTP {code}, {n} lines")


def lines(i):
    return open(os.path.join(WORK, f"{i}.txt"), errors="ignore").read().split("\n")


cmd, i, *rest = sys.argv[1:]
if cmd == "get":
    get(i, rest[0])
elif cmd == "grep":
    for n, l in enumerate(lines(i)):
        if any(w.lower() in l.lower() for w in rest):
            print(f"{n}: {l[:500]}")
elif cmd == "show":
    a, k = int(rest[0]), int(rest[1])
    for n, l in enumerate(lines(i)[a:a + k], a):
        print(f"{n}: {l[:700]}")
