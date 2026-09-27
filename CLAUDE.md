# Portfolio

`Iman_Kasim_Portfolio.html` is the main single-file site (inline CSS/JS, Google Fonts). `KASIM_ImanHuson_BSCS-3B_cpu_scheduling.py` is a standalone coursework script, not part of the site. `book-site/index.html` is a design-template worked example (unofficial Red Rising Saga fan tribute — not academic work, not linked from the main portfolio's project list). `index.html` at repo root is a landing page linking the two sites, needed because GitHub Pages' root URL 404s without one. `docs/website-build-template.md` is the reusable 4-step prompt template these were built from.

## Design tooling (project skills in `.claude/skills/`)

| Skill | Use it for | Source |
|---|---|---|
| `design-taste-frontend` | Design direction for the portfolio; anti-template rules and pre-flight checklist | Leonxlnx/taste-skill (MIT) |
| `image-to-code` | Generate a design image, then implement it. Needs an image-generation tool — Claude Code has none built in, so this only works with one connected | Leonxlnx/taste-skill (MIT) |
| `brandkit` | Turn a rough idea/brief into a full brand board (palette, type, logo direction) | Leonxlnx/taste-skill (MIT) |
| `design-md-reference` | Fetch a real brand's DESIGN.md tokens as reference (fixed list of ~74 brands) | VoltAgent/awesome-design-md (MIT) |
| `extract-design` | Extract design tokens (colors/type/spacing/shadows) from **any live URL**, not just the fixed brand list — shells out to `npx designlang <url>` at run time | Manavarya09/design-extract (MIT). Runtime dependency on a third-party npm package (`designlang`), single maintainer — normal npx supply-chain exposure, not independently audited here. |
| `ui-ux-pro-max` | Searchable local design-decision database: style archetypes, color palettes, font pairings, UX rules, GSAP presets, per-stack implementation notes | nextlevelbuilder/ui-ux-pro-max-skill (MIT). Ships its own Python scripts + CSV/JSON data, stdlib-only, tested working in this container. Its README/blog coverage advertises different (larger) counts than what's actually in the data files — treat marketing numbers for this one skeptically, the skill itself works. |
| `web-design-guidelines` | Audit the HTML against Vercel's Web Interface Guidelines (`file:line` findings) | vercel-labs/agent-skills (MIT) |
| `emil-*` (10 skills: `animate`, `animation-vocabulary`, `apple-design`, `ask-sonner`, `design-eng`, `find-animation-opportunities`, `improve-animations`, `pick-ui-library`, `prototype`, `review-animations`) | Emil Kowalski's motion/UI-polish philosophy — when animation is warranted, durations/easing, reviewing existing motion for jank | emilkowalski/skills (MIT). Repo ships 12 skills; `animate-expo`, `mobile-native`, `write-swift` were left out — React Native/iOS-only, not relevant to a static HTML site. |
| `playwright-cli` | Open the page in a real browser, screenshot, click through, check console | microsoft/playwright-cli (Apache-2.0) |

Suggested loop: direction (`design-taste-frontend` / `brandkit` / `ui-ux-pro-max`, optionally `design-md-reference` or `extract-design`) → edit HTML, consulting `emil-*` only where motion is actually warranted → verify with `playwright-cli` screenshots at 375px and 1440px → audit with `web-design-guidelines`.

### Requested but not installed as skills — these are libraries and reference sites, not Claude skills

- **Lenis** (darkroomengineering/lenis), **GSAP** (greensock/GSAP), **Vanta** (tengbao/vanta) — real JS animation/scroll libraries with CDN builds. Could be added to the static HTML via `<script>` tags if a future redesign wants scroll-smoothing or animated backgrounds — not wired in, since that's a real behavior change to the live site, not a tooling install.
- **react-bits** (DavidHDev/react-bits) — real component library, but its components are React source files installed via a CLI (`jsrepo`) into a React project. This repo is plain HTML/CSS/JS with no bundler, so it doesn't fit without first adding a build step. Flagging the mismatch rather than forcing it in.
- **daisyUI** (daisyui.com) — Tailwind CSS component classes; needs Tailwind (CDN Play mode works for prototyping, not recommended for production).
- **OriginKit** (originkit.dev), **particles.casberry.in** — component/inspiration sites to browse, not installable packages.

## Running playwright-cli

```bash
npm install -g @playwright/cli@latest
python3 -m http.server 8765 &          # file:// URLs are blocked by default
playwright-cli open http://localhost:8765/Iman_Kasim_Portfolio.html
playwright-cli screenshot
```

`.playwright/cli.config.json` selects Chromium. In Claude Code on the web, the bundled Playwright expects a newer Chromium than the one pre-installed, so also run `export PLAYWRIGHT_MCP_EXECUTABLE_PATH=/opt/pw-browsers/chromium` (don't run `playwright install`). Locally, run `playwright-cli install-browser chromium` once instead.
