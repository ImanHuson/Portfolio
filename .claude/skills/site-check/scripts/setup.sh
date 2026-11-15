#!/usr/bin/env bash
# Installs the pinned measuring tools into a cache dir, never into a project.
set -euo pipefail
DIR="${SITE_CHECK_HOME:-$HOME/.cache/site-check}"
mkdir -p "$DIR"
cd "$DIR"
[ -f package.json ] || npm init -y >/dev/null
npm i --no-audit --no-fund --silent lighthouse@13.6.0 axe-core@4.14.0
echo "SITE-CHECK-READY $DIR"
