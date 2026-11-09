"""Check that every photo served from Wikimedia Commons still exists.

    python3 scripts/media/check-remote.py

Requests each file's 330 px thumbnail once, slowly, and exits 1 listing any
that no longer resolve, so a deleted or renamed file is replaced rather than
left on its local fallback. Run monthly by .github/workflows/terrarum-media.yml.
"""
import json, os, sys, time, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
UA = "TerrarumAtlas/1.0 (https://imanhuson.github.io/Portfolio/terrarum/; link check)"
dead = []
items = []
for name in sorted(os.listdir(HERE)):
    if name.startswith("remote-") and name.endswith(".json"):
        items += list(json.load(open(os.path.join(HERE, name))).items())
for key, p in items:
    d1, d2, f = p["path"].split("/", 2)
    q = urllib.parse.quote(f)
    url = f"https://upload.wikimedia.org/wikipedia/commons/thumb/{d1}/{d2}/{q}/330px-{q}"
    ok = False
    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60) as r:
                ok = r.status == 200
                break
        except urllib.error.HTTPError as e:
            if e.code == 404:
                break
            time.sleep(10 * (attempt + 1))
        except Exception:
            time.sleep(10 * (attempt + 1))
    if not ok:
        dead.append(f"{key}: {p['landing']}")
    time.sleep(1)
print(f"{len(items)} checked, {len(dead)} missing")
for d in dead:
    print("MISSING", d)
sys.exit(1 if dead else 0)
