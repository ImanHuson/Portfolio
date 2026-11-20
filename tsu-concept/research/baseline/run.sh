#!/usr/bin/env bash
# Lighthouse baseline for tsu.edu.ph: 5 mobile runs per page, sequential (polite, and parallel runs skew CPU).
# Usage: bash run.sh   (needs node; CHROME_PATH defaults to Playwright's Chromium)
set -u
cd "$(dirname "$0")"
CHROME_PATH="${CHROME_PATH:-$(ls -d /opt/pw-browsers/chromium*/chrome-linux*/chrome | head -1)}"
export CHROME_PATH
declare -A PAGES=(
  [home]="https://www.tsu.edu.ph/"
  [admissions]="https://www.tsu.edu.ph/admissions/"
  [announcements]="https://www.tsu.edu.ph/announcements/"
  [calendar]="https://www.tsu.edu.ph/academics/offices/admission-and-registration-office/academic-calendar/"
  [colleges]="https://www.tsu.edu.ph/academics/colleges/"
)
for name in home admissions announcements calendar colleges; do
  for i in 1 2 3 4 5; do
    out="raw/${name}-${i}.json"
    [ -s "$out.gz" ] && continue
    timeout 240 npx -y lighthouse@12 "${PAGES[$name]}" --quiet --form-factor=mobile \
      --chrome-flags="--headless=new --no-sandbox" --output=json --output-path="$out" >/dev/null 2>"raw/${name}-${i}.err" \
      && gzip -9 "$out" && rm -f "raw/${name}-${i}.err"
    echo "$(date -u +%H:%M:%S) $name run $i done ($( [ -s "$out.gz" ] && echo ok || echo FAILED))"
    sleep 3
  done
done
echo ALL_RUNS_FINISHED
