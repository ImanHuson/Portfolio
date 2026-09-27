# Portfolio

`Iman_Kasim_Portfolio.html` is the main single-file site (inline CSS/JS, Google Fonts) — kept as plain static HTML on purpose, not converted to React. `KASIM_ImanHuson_BSCS-3B_cpu_scheduling.py` is a standalone coursework script, not part of the site. `book-site/index.html` is a static design-template worked example (unofficial Red Rising Saga fan tribute — not academic work, not linked from the main portfolio's project list). `book-site-react/` is a second build of the *same* book site, in React + Vite, added specifically to use react-bits/GSAP/Lenis/Framer-Motion-style tooling that needs a bundler — see its own section below. `index.html` at repo root is a landing page linking the sites, needed because GitHub Pages' root URL 404s without one. `docs/website-build-template.md` is the reusable 4-step prompt template these were built from.

## Default approach when asked to build a new site here (read this first)

Every tool listed in this file — skills and libraries both — is available. The point of this section is to make sure they're all *considered*, not that they're all *used*. Stacking every library onto one site is not what makes it look premium; the `web_cheatcodes.pdf` someone sent for this repo ends with the line that actually matters: *"Good design + typography + spacing + 2–3 intentional animations > 50 random effects."* Take that literally.

1. **Direction before tools.** Start with `design-taste-frontend` (plus `brandkit` or `ui-ux-pro-max` if there's no direction yet) to get an actual point of view for *this* project — audience, tone, what "premium" means here — before reaching for any library. A restrained static page with 2–3 intentional touches beats one carrying every tool in this file.
2. **Plain HTML/CSS/JS is the default.** Only add a bundler (Vite + React, per `book-site-react/`) when a specific chosen effect genuinely needs one (`react-bits`, `@react-three/fiber`, Framer Motion). Converting a project to React is a real architecture decision, not a tooling add — ask first, the way `book-site-react/` only happened after being asked directly.
3. **Match the tool to the project, don't stack them all in:**
   - *Landing/marketing page* → direction skill, maybe `Lenis` + GSAP `ScrollTrigger` for scroll feel, then `web-design-guidelines` + `playwright-cli` to verify. No 3D unless there's an actual 3D subject.
   - *Portfolio / resume / academic work* → restraint over spectacle: clean typography, fast load, accessible. This is `emil-apple-design`'s "feedback, spatial consistency, restraint" and the PDF's "don't animate everything," applied hardest — a recruiter or professor isn't the audience for a WebGL showcase (this is why `Iman_Kasim_Portfolio.html` stayed plain HTML).
   - *Deliberately cinematic/showcase project* (like `book-site-react/`) → the fuller stack is fair game, but still pick 2–3 signature moments, not every effect in the PDF's "Premium Website Effects" list. This repo's example used exactly three: one hero starfield, one headline reveal, one metallic-text accent.
   - *3D* (Three.js / React Three Fiber / Drei / Spline) is only for a project with an actual 3D subject — a product, a model, a spatial concept. Bolting 3D onto a page with nothing 3D to show is the "don't load huge libraries for tiny effects" anti-pattern the PDF itself names.
4. **Verify before calling it premium.** `web-design-guidelines` audit + `playwright-cli` screenshots at 320/375/1440px + an actual no-JS and reduced-motion check — not a skipped afterthought. Both real bugs this repo has hit so far (`book-site/`'s no-JS nav, `book-site-react/`'s opacity-gated content going invisible under a full-page screenshot) were caught exactly this way. Something that breaks under a screenshot tool or with JS off isn't premium, it's fragile.

Full tool inventory — what each one is for, and its real caveats — is below.

## book-site-react (React + Vite build)

Source lives in `book-site-react/`; `node_modules/` and `dist/` are gitignored — **the build output is not committed**. It's built and deployed by `.github/workflows/pages.yml`, which also assembles the plain files (root `index.html`, `Iman_Kasim_Portfolio.html`, `book-site/`) into the same Pages artifact. **This is a real, already-required change, not optional**: GitHub Pages allows only one deployment source per repo, so once this workflow exists, Settings → Pages → Source must be switched from "Deploy from a branch" to "GitHub Actions" — otherwise nothing here goes live. That's a Settings-UI toggle only the repo owner can do; no available tool can flip it remotely.

Libraries used and why: **Lenis** (smooth scroll) + **GSAP `ScrollTrigger`** (scroll-based reveal), wired via the standard `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker` integration in `src/main.jsx`. Three **react-bits** components are vendored into `src/components/` (not npm-installed — that's how react-bits ships): `Particles` (WebGL starfield, `ogl` dependency), `SplitText` (GSAP-driven headline reveal), `ShinyText` (`motion` dependency, metallic sheen on the byline). License is MIT + Commons Clause (`src/components/REACT-BITS-LICENSE.md`) — fine to use in this site, not fine to resell/redistribute the components themselves.

One real trade-off from switching to client-rendered React, not swept under the rug: there's no server-side rendering, so with JavaScript disabled the page shows nothing but a `<noscript>` message linking back to the plain-HTML `book-site/` version — unlike the static build, which stayed fully readable with JS off. If that regression matters more than the animation, use the static version instead.

One bug found and fixed during QA, worth knowing if this pattern gets reused: the scroll-reveal (`src/components/Reveal.jsx`) originally hid content at `opacity: 0` until a real scroll event fired it — which meant a full-page screenshot tool (including `playwright-cli --full-page`, used for this repo's own QA), print/PDF export, or any partial JS failure left everything below the hero permanently invisible. Fixed by never touching opacity: only the lift `transform` animates, so content defaults to fully visible and readable even if the scroll trigger never fires.

Environment note: this container's Chromium needs `--no-sandbox` to launch as root — already set in `.playwright/cli.config.json`'s `launchOptions.args`; don't remove it.

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
- **react-bits** (DavidHDev/react-bits) — real component library; its components are React source files copied in (its own model, not npm-installed), which needs a bundler. Not usable against the plain-HTML main portfolio or `book-site/` as-is — this is exactly why `book-site-react/` exists as a separate build. Don't add a bundler to the plain-HTML pages just to reach for this; build (or ask about) a proper React target instead, same as that one was.
- **daisyUI** (daisyui.com) — Tailwind CSS component classes; needs Tailwind (CDN Play mode works for prototyping, not recommended for production).
- **OriginKit** (originkit.dev), **particles.casberry.in** — component/inspiration sites to browse, not installable packages.
- **Three.js / React Three Fiber / Drei / GLSL shaders / Spline** (from `web_cheatcodes.pdf`) — real 3D tooling, same bundler requirement as react-bits, plus real payload weight. Only reach for these when a project has an actual 3D subject to render — see point 3 above.

## Running playwright-cli

```bash
npm install -g @playwright/cli@latest
python3 -m http.server 8765 &          # file:// URLs are blocked by default
playwright-cli open http://localhost:8765/Iman_Kasim_Portfolio.html
playwright-cli screenshot
```

`.playwright/cli.config.json` selects Chromium. In Claude Code on the web, the bundled Playwright expects a newer Chromium than the one pre-installed, so also run `export PLAYWRIGHT_MCP_EXECUTABLE_PATH=/opt/pw-browsers/chromium` (don't run `playwright install`). Locally, run `playwright-cli install-browser chromium` once instead.
