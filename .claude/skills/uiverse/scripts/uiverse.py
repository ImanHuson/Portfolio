#!/usr/bin/env python3
"""Search and preview Uiverse.io elements (MIT) from the uiverse-io/galaxy repo.

Commands:
  sync                                   clone or update the galaxy repo into the cache
  search [--category C] [--tags a,b] [--query TEXT] [--limit N] [--sheet OUT.html]
  show <path>                            print one element (HTML + <style>)

Each element file starts its <style> with a comment like
  /* From Uiverse.io by <author> - Tags: loading, loader, animated */
which is what search matches on (plus the file name and, with --query, the body).
--sheet writes a contact-sheet page (one sandboxed iframe per match) to screenshot
with playwright-cli. Cache: $UIVERSE_CACHE or ~/.cache/uiverse-galaxy.
"""
from __future__ import annotations

import argparse
import html
import os
import re
import subprocess
import sys
from pathlib import Path

REPO = "https://github.com/uiverse-io/galaxy"
CACHE = Path(os.environ.get("UIVERSE_CACHE", Path.home() / ".cache" / "uiverse-galaxy"))
META = re.compile(r"From Uiverse\.io by\s+(?P<author>\S+)(?:\s*-\s*Tags:\s*(?P<tags>.*?))?\s*(?:\*/|-->|$)", re.I | re.M)


def sync() -> None:
    if (CACHE / ".git").exists():
        subprocess.run(["git", "-C", str(CACHE), "pull", "-q", "--depth", "1"], check=True)
    else:
        CACHE.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(["git", "clone", "-q", "--depth", "1", REPO, str(CACHE)], check=True)
    print(f"galaxy at {CACHE}", file=sys.stderr)


def ensure() -> None:
    if not (CACHE / ".git").exists():
        sync()


def meta(text: str) -> tuple[str, list[str]]:
    m = META.search(text)
    if not m:
        return "unknown", []
    tags = [t.strip().lower() for t in (m.group("tags") or "").split(",") if t.strip()]
    return m.group("author"), tags


def kind(text: str) -> str:
    """css = self-contained HTML + <style>; tailwind = utility classes only (needs Tailwind)."""
    return "css" if "<style" in text else "tailwind"


def cmd_search(a) -> None:
    ensure()
    want = [t.strip().lower() for t in (a.tags or "").split(",") if t.strip()]
    q = (a.query or "").lower().split()
    rows = []
    for f in sorted(CACHE.glob("*/*.html")):
        cat = f.parent.name
        if a.category and cat.lower() != a.category.lower():
            continue
        text = f.read_text(errors="replace")
        author, tags = meta(text)
        if a.kind and kind(text) != a.kind:
            continue
        if want and not all(any(w in t for t in tags) for w in want):
            continue
        if q and not all(w in (f.name + " " + " ".join(tags) + " " + text).lower() for w in q):
            continue
        rows.append((f, author, tags, text))
    for f, author, tags, _ in rows[: a.limit]:
        print(f"{f.relative_to(CACHE)}  {kind(_)}  by {author}  [{', '.join(tags[:6])}]")
    print(f"{len(rows)} match(es)", file=sys.stderr)
    if a.sheet:
        cells = []
        for f, author, _, text in rows[: a.limit]:
            tw = kind(text) == "tailwind"
            doc = (
                "<!doctype html><meta charset=utf-8>"
                + ('<script src="https://cdn.tailwindcss.com/3.4.17"></script>' if tw else "")
                + "<style>html,body{margin:0;height:100%;"
                f"display:grid;place-items:center;background:{a.bg};color:#ddd;font-family:sans-serif}}</style>{text}"
            )
            # Tailwind cells need the Play CDN script; no allow-same-origin, so they stay isolated.
            cells.append(
                f'<figure><iframe sandbox{"=allow-scripts" if tw else ""} srcdoc="{html.escape(doc)}"></iframe>'
                f"<figcaption>{html.escape(str(f.relative_to(CACHE)))}<br>by {html.escape(author)}</figcaption></figure>"
            )
        Path(a.sheet).write_text(
            "<!doctype html><meta charset=utf-8><title>Uiverse sheet</title><style>"
            f"body{{margin:16px;background:{a.bg};color:#bbb;font:12px/1.4 sans-serif}}"
            "main{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}"
            "figure{margin:0;border:1px solid #333}iframe{width:100%;height:220px;border:0;display:block}"
            "figcaption{padding:6px 8px;border-top:1px solid #333;word-break:break-all}</style><main>"
            + "".join(cells)
            + "</main>"
        )
        print(f"sheet: {a.sheet}", file=sys.stderr)


def cmd_show(a) -> None:
    ensure()
    p = (CACHE / a.path).resolve()
    if CACHE.resolve() not in p.parents or not p.is_file():
        sys.exit(f"error: no element at {a.path}")
    print(p.read_text(errors="replace"))


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("sync").set_defaults(fn=lambda a: sync())
    s = sub.add_parser("search")
    s.add_argument("--category", help="Buttons, Cards, loaders, Toggle-switches, Inputs, Forms, Checkboxes, Patterns, Radio-buttons, Tooltips, Notifications")
    s.add_argument("--tags", help="comma list; every tag must match (substring)")
    s.add_argument("--query", help="words that must all appear in name, tags or code")
    s.add_argument("--kind", choices=["css", "tailwind"], help="css for plain-HTML pages, tailwind for the Tailwind builds")
    s.add_argument("--limit", type=int, default=24)
    s.add_argument("--sheet", help="write a contact-sheet HTML of the matches")
    s.add_argument("--bg", default="#0b0b0c", help="sheet/background colour (use the target page's)")
    s.set_defaults(fn=cmd_search)
    sh = sub.add_parser("show")
    sh.add_argument("path", help="e.g. loaders/0xnihilism_xyz-12.html")
    sh.set_defaults(fn=cmd_show)
    a = p.parse_args()
    a.fn(a)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
