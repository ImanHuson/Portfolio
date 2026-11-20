"""Turn the saved 2026 announcement list pages (ia/ann-2026*.html, gitignored) into
content/announcements.json for the concept. Run from tsu-concept/: python3 research/content-src/extract-announcements.py"""
import html, json, re
from datetime import datetime

BASE = "https://www.tsu.edu.ph"
CLASS = re.compile(r"asynchronous|online (classes|learning)|flexible learning|face-to-face|learning modality|suspen", re.I)
ADMIT = re.compile(r"admission|enrol|cae\b|calendar|freshm|scholar|first year", re.I)
PERSON = re.compile(r"\b(hon|pres|dr|engr|atty|prof|mr|ms|mrs)\.|congratulations", re.I)  # headlines naming individuals

items, skipped = [], []
for f in ["ann-2026.html", "ann-2026-p2.html", "ann-2026-p3.html", "ann-2026-p4.html"]:
    s = open(f"research/ia/{f}", encoding="utf-8", errors="ignore").read()
    for m in re.finditer(r'<small class="has-text-grey">([^<]+)</small>\s*<a[^>]+href="([^"]+)"[^>]*>\s*<h4[^>]*>(.*?)</h4>\s*</a>\s*(?:<p>(.*?)</p>)?', s, re.S):
        date, href, title, ex = m.groups()
        title = " ".join(html.unescape(re.sub("<[^>]+>", "", title)).split())
        ex = " ".join(html.unescape(re.sub("<[^>]+>", "", ex or "")).split()).rstrip("…").rstrip()
        title, ex = (re.sub(r"\s*[\u2013\u2014]\s*", lambda m: "-" if m.group(0).strip() == m.group(0) else " - ", x) for x in (title, ex))
        d = datetime.strptime(date.strip(), "%a, %b %d, %Y").date().isoformat()
        if PERSON.search(title) or PERSON.search(ex):
            skipped.append(title); continue
        kind = "class" if CLASS.search(title) else "admission" if ADMIT.search(title) else "general"
        # Shout-case headlines become sentence case for reading; the source link keeps the original
        if title.isupper():
            title = title.capitalize()
            for w in ["TSU", "AY", "TSU-CAE", "CAE", "CHED", "OAR", "PE"]:
                title = re.sub(rf"\b{w.lower()}\b", w, title, flags=re.I)
            for mo in ["january","february","march","april","may","june","july","august","september","october","november","december","concepcion"]:
                title = re.sub(rf"\b{mo}\b", mo.capitalize(), title)
        items.append({"date": d, "title": title, "excerpt": ex, "kind": kind, "source": BASE + href})

items.sort(key=lambda x: x["date"], reverse=True)
json.dump({"fetched": "2026-11-20", "items": items, "leftOut": len(skipped)}, open("content/announcements.json", "w"), indent=1, ensure_ascii=False)
print(len(items), "kept;", len(skipped), "left out (name individuals):", skipped)
print({k: sum(1 for i in items if i["kind"] == k) for k in ("class", "admission", "general")})
