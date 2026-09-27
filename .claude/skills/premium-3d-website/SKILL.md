---
name: premium-3d-website
description: Build a premium, cinematic, scroll-driven 3D website from a topic/brief alone. Use when the user asks for a "premium 3D website," "cinematic site," "flagship portfolio piece," or a new scroll-storytelling 3D showcase build — not for a plain landing page, a portfolio/resume site, or any edit to an existing site (those go through design-taste-frontend directly, or ask first per this repo's own architecture-change rule).
user-invocable: true
---

# Premium 3D Website — Build Template

This is a **decision system**, not a fixed stack. It exists so a future "build me
a site about X" doesn't require re-pasting the original toolkit brief, and so it
doesn't silently import that brief's stack wholesale — several of its defaults
were tested against this exact environment and found wrong for it. Follow the
decision rules below over the letter of any pasted brief.

**Scope**: this skill is for a genuinely new, standalone cinematic/showcase build
(the `red-rising-archive` category, per this repo's `CLAUDE.md` point 3). It is
never applied retroactively to an existing project (`book-site-react`,
`red-rising-archive`, the main portfolio) without being asked — see this repo's
"say plainly whether you're replacing or adding" rule.

## 0. Direction before stack

Run `design-taste-frontend` first (plus `brandkit` or `ui-ux-pro-max` if there's
no visual direction yet) to get an actual point of view — audience, tone, what
"premium" means for *this* topic — before choosing a single library. A
restrained build with 2-3 signature moments beats one carrying every tool below.
State the Design Read (Section 0.B of that skill) before writing any code.

## 1. Stack decision rules (resolved once, reused every time — don't re-relitigate per build)

**Bundler**: Vite + React by default for a new single-page cinematic build.
Reach for Next.js only when the project has a *specific, named* need for its
routing, SSR/SSG, or built-in image optimization (e.g. a real multi-page site,
not a single scroll experience) — never switch frameworks for preference or
because a brief says so. If Next.js is chosen, prefer `output: 'export'` static
export so it still fits this repo's existing GitHub Pages Actions deploy
(`.github/workflows/pages.yml`) unless the user separately asks for Vercel
hosting — that's its own deployment decision, not a side effect of picking Next.js.

**Language/styling**: TypeScript + Tailwind CSS + shadcn/ui by default for a new
build under this skill (this is a deliberate difference from this repo's
existing plain-JS/hand-written-CSS projects, which stay as they are — this
default applies only to new cinematic builds going forward). Use shadcn/ui for
real UI chrome (buttons, dialogs, menus, tooltips, nav) — never for the
cinematic/3D portions of the page, which stay custom-built. Don't turn the page
into a collection of cards.

**3D library** — the one place this repo has hard-won, container-specific
evidence, so read this carefully:
- Use **`ogl`** for lightweight WebGL effects: particle fields, simple geometric
  staging, a starfield, a small number of shaded planes/meshes. This is the
  proven default (`book-site-react`'s `Particles`, `red-rising-archive`'s book
  carousel) — cheap, fast, no known failure mode in this environment.
- Use **Three.js + React Three Fiber + Drei** when the experience genuinely
  needs a complex scene: real GLB/GLTF models, skeletal animation, multiple
  materials/lighting setups, post-processing, or Drei helpers with no `ogl`
  equivalent. This repo previously found the exact combination of
  `@react-three/fiber` + `three.js` + `@react-three/drei` rendering a solid
  black canvas in this container despite every internal check passing; a later
  re-test with a bare spinning-mesh + GSAP `pin: true` scenario rendered
  correctly, so the fundamental failure is **not currently reproducing** — but
  that re-test used no real textures, materials, or Drei helpers, so it does
  **not** clear a complex scene by itself.
  - **Mandatory before committing to R3F for a real build**: build the
    riskiest piece of the actual planned scene first (real texture/material,
    the specific Drei helpers needed, the real camera/pin setup) as an
    isolated smoke test, verified with a `playwright-cli` screenshot showing
    real rendered content, before writing the rest of the scene around it. If
    it renders a blank canvas, stop and fall back to `ogl` rather than
    debugging deeper — see `red-rising-archive`'s engineering-lesson note in
    `CLAUDE.md` for how expensive that debugging was the first time.

**Animation**: Lenis (smooth scroll) + GSAP `ScrollTrigger` (scroll
choreography) for anything scroll-driven — camera moves, section transitions,
pinned sequences. `Motion` (motion/react) for discrete UI micro-interactions
(button feedback, menu open/close) that aren't scroll-driven. Never mix GSAP
and Motion for the same element's animation. Never track continuous scroll
progress in `useState` (re-renders every frame) — a `useRef` for the raw value,
`setState` only when a derived, coarser value actually changes. This exact bug
caused real, user-reported jitter in `red-rising-archive` — see its
`CLAUDE.md` section.

**Testing/verification**: `playwright-cli` at 320/375/1440px, plus an explicit
no-JS check and `prefers-reduced-motion` check — not a skipped afterthought.
`web-design-guidelines` audit before calling anything done.

## 2. The five-act structure

Treat the page as one continuous cinematic sequence, not a flat section list:

1. **Arrival** — identity, atmosphere, the central 3D subject, the title. Must
   communicate quality in the first viewport alone.
2. **Revelation** — scrolling reveals information: camera moves, the subject
   transforms, lighting/typography shifts.
3. **Exploration** — interactive content: object/character showcases,
   timelines, information panels. This is where the user does something, not
   just watches.
4. **Immersion** — the deepest visual layer: camera choreography, particles,
   depth, lighting changes, restrained post-processing.
5. **Finale** — a deliberate closing sequence, not just "the bottom of the page."

Connect the acts with something that carries narrative weight, not a literal
"Act II" label — generic stage/phase numbering (`Stage 1`, `00 / INDEX`, `Act
II`) is a named AI-tell in `design-taste-frontend`. `red-rising-archive`'s
`ActDivider` component (one full-bleed editorial line per transition, tinted
ambient background) is the proven pattern for this — reuse the approach, not
literally the copy.

## 3. Camera choreography

Camera movement needs narrative purpose, not "move it so people notice there's
3D." A working, already-proven pattern in this repo
(`red-rising-archive/src/components/SixBooksScroll.jsx`): interpolate camera
**distance and height only** (not fov) off scroll progress, with a smoothstep
easing at the two transition boundaries —

```
close-up (progress 0-0.08) -> orbiting plateau (0.08-0.9) -> pulled-back wide shot (0.9-1)
```

Distance-only keeps this cheap and avoids re-introducing risk around a 3D
library's camera/perspective API. Verify the choreography live by scrolling to
specific progress values and screenshotting — confirm the framing actually
differs, not just that the code looks right.

## 4. Performance fallbacks (mandatory, not optional polish)

- Pause any WebGL render loop via `IntersectionObserver` when its canvas host
  isn't visible (sticky-pinned sections are only on-screen part of the time).
- Cap device pixel ratio (`Math.min(window.devicePixelRatio, 1.5)` or similar)
  rather than rendering at full DPR on high-density displays.
- Reduce or drop particle counts, shadow quality, and post-processing on
  narrow viewports — don't just shrink the desktop layout.
- Gate every JS-driven animation (GSAP tweens included — the global CSS
  `prefers-reduced-motion` rule does **not** touch a `gsap.fromTo` call, only
  CSS transitions/animations) behind an explicit
  `window.matchMedia('(prefers-reduced-motion: reduce)').matches` check. This
  exact gap shipped once in `red-rising-archive` and was only caught by a
  `web-design-guidelines` audit — don't repeat it.

## 5. Accessibility and SEO (non-negotiable floor, not a nice-to-have)

Semantic HTML first, then ARIA. Visible focus states (`:focus-visible`, never
`outline: none` without a replacement). Keyboard equivalents for every
drag/swipe/scroll-hijack interaction. `color-scheme: dark` (or `light`) plus a
matching `<meta name="theme-color">` set from the start, not bolted on later.
Full metadata (title, description, OG, Twitter card, structured data where it
adds real value) — a cinematic page is still a page search engines and screen
readers need to parse.

## 6. Build order (incremental, verify at each stage — don't build the whole thing in one pass)

Direction -> architecture -> design tokens (type scale, spacing, color, motion
durations/easing, all defined once, not improvised per component) -> 3D
foundation (with the smoke test from Section 1 if R3F is in play) -> scroll
system -> sections, act by act -> responsive pass -> accessibility pass ->
`playwright-cli` visual QA at all three widths + no-JS + reduced-motion ->
performance pass -> `web-design-guidelines` audit -> final polish.

## 7. Final quality bar (run this before calling anything done)

- Does it look custom, not templated? (`design-taste-frontend`'s Pre-Flight
  Check, run for real, not skimmed.)
- Is every animation motivated (hierarchy, storytelling, feedback, or state
  change) — if you can't name which in one sentence, cut it?
- Does the camera move with narrative purpose, not just to prove there's 3D?
- Does it survive a full-page screenshot, JS disabled, and reduced motion?
- Is the 3D system modular (scene/camera/lighting/materials separated), not
  one massive component?
- Two or three signature moments, not fifty effects — if you're reaching for
  a fourth "wow" technique, that's the sign to stop, not to add it.

## What this skill deliberately does not do

Doesn't install Next.js/Tailwind/shadcn/three.js speculatively "just in case" —
those get added when a build under this skill actually needs them, per Section
1's rules, not as a blanket first step. Doesn't touch any existing project in
this repo. Doesn't assume Vercel hosting - defaults to this repo's existing
GitHub Pages Actions pipeline unless told otherwise.

## 8. Deployment gotchas (GitHub Pages specifically — folded in from this repo's
retired plain-HTML template, verified facts worth keeping even though that
template itself is gone)

- **Commercial use**: GitHub's own Pages limits documentation states Pages
  "is not intended for or allowed to be used as a free web-hosting service to
  run your online business, e-commerce site, or any other website that is
  primarily directed at either facilitating commercial transactions or
  providing commercial software as a service (SaaS)." Fine for a portfolio or
  practice build; re-check docs.github.com yourself before relying on this for
  a client-facing decision — policies change.
- **Asset paths**: a project deployed at `username.github.io/repo-name` lives
  at a subpath, not the domain root — any absolute path (`/images/hero.jpg`)
  404s there. Use relative paths, or (for a Vite build) set `base` in
  `vite.config.js` to match, the way `red-rising-archive/vite.config.js`
  already does.
- Naming a repo exactly `username.github.io` deploys it at the account's root
  URL with no subpath — only works once per account, so reserve it for a main
  portfolio, not a practice build.
- Private repos need GitHub Pro/Team for Pages; a public repo doesn't.

## 9. Optional media-generation add-ons (not a default — add only if the specific feature is actually wanted)

- **Scroll-driven hero video / animated asset**: requires an MCP-connected
  media generator. Higgsfield is a real, confirmed one — a real OAuth
  connector at `https://mcp.higgsfield.ai/mcp` (per Higgsfield's own Creator
  Hub docs) that lets Claude generate images/video/audio against an existing
  Higgsfield account and credits. **Requires a paid Higgsfield plan** ($19/mo
  Starter was the floor as last checked 2026-09-26 — re-verify against
  Higgsfield's current pricing before relying on that number). Any other
  MCP server exposing image/video generation tools substitutes equally.
- **Interactive 3D object from a single reference photo**: likely tool is
  **img2threejs**, an agent skill that converts one clean, plain-background
  reference image into editable, animation-ready Three.js code. Needs a
  single object on a plain background — busy/backgrounded photos produce
  broken output. Verify the actual repo before installing; it was not
  independently vetted here.
