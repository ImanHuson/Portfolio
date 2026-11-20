---
name: site-check
description: Measure a built or live page instead of reading its code - Lighthouse (performance, Core Web Vitals lab values, best practices, SEO) and axe-core (WCAG 2.2 A/AA accessibility) in a real Chromium. Use after any visible change before a deploy, when a page feels slow, when asked "is it accessible / fast / production-ready", or to confirm a fix with a before/after number. Complements web-design-guidelines and impeccable audit, which read code; this one runs the page.
---

# site-check

Two measurements, both free and local (no account, no key, no cost):

- **axe-core 4.14.0** (MPL-2.0): WCAG 2.2 A/AA + best-practice rules on the rendered DOM, at 375 and 1440 px.
- **Lighthouse 13.6.0** (Apache-2.0): performance (LCP, TBT, CLS, Speed Index), accessibility, best practices, SEO, with the failing audits listed.

They install into `~/.cache/site-check`, never into a project's `package.json`.

## Setup (once per session)

```bash
bash .claude/skills/site-check/scripts/setup.sh      # prints SITE-CHECK-READY
```

Playwright comes from the container (`require('playwright')` works anywhere). On a machine without `/opt/pw-browsers/chromium` the scripts use Playwright's or Lighthouse's own Chrome.

## Run

```bash
cd ~/.cache/site-check
node <repo>/.claude/skills/site-check/scripts/axe.mjs <url> [url...]       # AXE-OK or AXE-FAIL n
node <repo>/.claude/skills/site-check/scripts/axe.mjs --all <url>          # also fail on minor/moderate
bash <repo>/.claude/skills/site-check/scripts/lighthouse.sh <url> [--desktop] [out.json]
```

Run against the local static build (serve `out/` under its basePath, e.g. `scratchpad/site/Portfolio/<project>/`) before a deploy, and against `https://imanhuson.github.io/Portfolio/...` after it.

## Reading the results honestly

- **axe serious/critical = fix before deploy.** `color-contrast` over photographs can be a false positive (axe can't see the image under a scrim); check it against the project's own contrast gate and a screenshot before dismissing it, and say which you did.
- **Lighthouse performance in this container is pessimistic.** It emulates a mid-range phone with 4x CPU throttling on a shared host. Check `benchmarkIndex` in the output; compare against `main` measured the same way rather than against the absolute score. Real regressions show up as a change, not as a low number.
- Things a static GitHub Pages site can't change: cache lifetimes (Pages sends 10 minutes), third-party cookies from Wikimedia's image hosts. Don't chase them.
- Things that are always worth fixing: console errors, a missing favicon (the browser asks for `/favicon.ico` at the origin root), large unused JavaScript loaded up front (lazy-load maps and viewers), images far larger than drawn.
- Use the numbers as evidence in the report: "LCP 4.3 s → 2.1 s on the same host", not "faster".
