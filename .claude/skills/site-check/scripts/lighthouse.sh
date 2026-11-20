#!/usr/bin/env bash
# Lighthouse on one URL (mobile by default, --desktop for desktop) and a short
# summary: category scores, Core Web Vitals lab values, and every failing audit.
# Usage: lighthouse.sh <url> [--desktop] [out.json]
set -euo pipefail
DIR="${SITE_CHECK_HOME:-$HOME/.cache/site-check}"
URL="$1"; shift
PRESET=""; OUT="$(mktemp -d)/lh.json"
for a in "$@"; do case "$a" in --desktop) PRESET="--preset=desktop";; *) OUT="$a";; esac; done
[ -x /opt/pw-browsers/chromium ] && export CHROME_PATH=/opt/pw-browsers/chromium
"$DIR/node_modules/.bin/lighthouse" "$URL" --quiet $PRESET \
  --chrome-flags="--headless=new --no-sandbox" \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output-path="$OUT"
python3 - "$OUT" <<'PY'
import json, sys
d = json.load(open(sys.argv[1])); A = d["audits"]
print("scores:", {k: v["score"] for k, v in d["categories"].items()})
for a in ["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift", "speed-index"]:
    print(f"  {a}: {A[a]['displayValue']}")
print("benchmarkIndex (host CPU speed; under ~1000 means the host, not the page, is slow):", d["environment"].get("benchmarkIndex"))
for cat, c in d["categories"].items():
    for r in c["auditRefs"]:
        a = A[r["id"]]
        if a.get("score") is not None and a["score"] < 0.9 and a.get("scoreDisplayMode") not in ("notApplicable", "informative", "manual"):
            print(f"  [{cat}] {r['id']} {a.get('displayValue', '')} | {a['title']}")
print("full report:", sys.argv[1])
PY
