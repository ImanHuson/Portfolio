# Claude Code Website Build — Reusable Prompt Template

Environment: Claude Code desktop app. Skills used: Front End Design Skill (Anthropic),
Taste, Awesome Design, Playwright. Run the 4 steps in order — each one builds on
the last. Fill every `[BRACKET]` before pasting.

---

## Step 0 — Confirm skill names before you paste anything
Skill names here (Awesome Design, Front End Design Skill, Taste) are descriptive,
not guaranteed to match the exact installed slug. Run `/skills` in Claude Code
first, or check `~/.claude/skills/` (global) and `.claude/skills/` (project-level,
repo-relative) — both are valid locations, which one applies depends on how the
skill was installed. Swap the bracketed names below for whatever actually appears.

In this repo specifically, the installed slugs are: `design-md-reference`
(Awesome Design), `design-taste-frontend` (Taste), and `playwright-cli`
(Playwright). There is no "Front End Design Skill" installed here — either
name a different installed skill in its place or drop that clause from Step 2.

## Step 1 — Lock the design system
*Paste before any code is written.*

```
Use the [AWESOME DESIGN SKILL — exact name as installed] skill. Show me the
design.md for [REFERENCE SITE/PRODUCT WHOSE LOOK I LIKE — e.g. "Linear", "Arc
browser"]. I want to borrow its palette, typography, spacing, and component
patterns for a new site — not clone it.
```

## Step 2 — Brief + plan
*Paste after you approve the system above.*

```
Use the [FRONT END DESIGN SKILL — exact name as installed] and [TASTE SKILL —
exact name as installed] for everything below.

I'm building a [SITE TYPE — e.g. landing page / portfolio / marketing site] for
[BUSINESS/PROJECT NAME AND WHAT IT DOES]. Target audience: [WHO]. Aesthetic
direction: [2-3 WORDS — e.g. "dark, moody, minimal" or "warm, handcrafted,
editorial"], based on the design.md from the previous step.

Pages/sections needed: [LIST — e.g. hero, about, pricing, contact].

Ask me clarifying questions before writing any code.
```

## Step 3 — Build
*Paste once you've answered its clarifying questions.*

```
Build it. Single-file HTML/CSS/JS unless there's a specific reason for more
files. Keep it fast and lightweight — no unnecessary frameworks.
```

## Step 4 — QA (not optional)
*Paste once the build exists.*

```
Use the [PLAYWRIGHT SKILL — exact name as installed, e.g. "playwright-cli"].
Test every page: form submissions, navigation, and layout at desktop, tablet,
and 320px mobile width. Also check: what happens on a slow network, and what
happens with JavaScript disabled. Report what breaks before telling me it's
done.
```

---

## Step 5 — Deploy (portfolio / practice builds only — never for a paid client's live site)

GitHub Pages free tier prohibits commercial use. Verified quote from GitHub's
own Pages limits documentation: "GitHub Pages is not intended for or allowed
to be used as a free web-hosting service to run your online business,
e-commerce site, or any other website that is primarily directed at either
facilitating commercial transactions or providing commercial software as a
service (SaaS)." (docs.github.com — re-check the live page yourself before
relying on this for a client-facing decision; policies change.) Fine for your
own portfolio or practice builds. For a client's live site, use paid hosting
(Hostinger, Vercel Pro) instead.

1. Create a **public** GitHub repo (private repos need GitHub Pro/Team for Pages).
2. Push your files:
   ```
   git init
   git remote add origin https://github.com/[USERNAME]/[REPO-NAME].git
   git add .
   git commit -m "Initial deploy"
   git push -u origin main
   ```
3. In the repo: Settings → Pages → Source: "Deploy from a branch" → branch `main` → folder `/ (root)` → Save.
4. Wait ~1-2 min. Check the Actions tab if it's not live — build failures show there, not on the Pages settings screen.
5. **Check asset paths before assuming it's broken.** Your site lives at
   `username.github.io/repo-name` — a subpath, not the domain root. Any
   absolute asset paths (`/images/hero.jpg`) will 404 there. Use relative
   paths (`images/hero.jpg`) instead.
6. Optional: name the repo exactly `[USERNAME].github.io` to deploy at the
   root URL with no subpath issue — only works once per account, so reserve
   it for your main portfolio, not every practice build.

## Worked Example — Book Website
Same 4 steps, pre-filled for a book/author site. Sections chosen are what
book sites typically need (cover, synopsis, author bio, reviews, buy links,
excerpt) — swap or trim to fit your actual book. The bracketed fields below
are the ones only you can answer; I'm not guessing your book's title, genre,
or tone.

**Step 1:**
```
Use the [AWESOME DESIGN SKILL — exact name as installed] skill. Show me the
design.md for [REFERENCE SITE/AUTHOR WHOSE LOOK YOU LIKE — e.g. a specific
author or publisher site]. I want to borrow its palette, typography, spacing,
and component patterns for a new site — not clone it.
```

**Step 2:**
```
Use the [FRONT END DESIGN SKILL — exact name as installed] and [TASTE SKILL —
exact name as installed] for everything below.

I'm building an author/book landing page for [BOOK TITLE] by [AUTHOR NAME] —
[ONE-LINE DESCRIPTION OF THE BOOK/GENRE]. Target audience: [WHO — e.g. genre
readers, book clubs]. Aesthetic direction: [2-3 WORDS matching the book's
tone — e.g. "literary, atmospheric, restrained" or "bold, commercial, punchy"],
based on the design.md from the previous step.

Sections needed: hero with book cover, synopsis, about the author, reviews/
blurbs, where to buy (links to retailers), excerpt or sample chapter,
newsletter signup. [ADD/REMOVE AS NEEDED]

Ask me clarifying questions before writing any code.
```

Steps 3 and 4 are unchanged from the base template above — build, then QA.

---

## Optional add-ons (not in the default flow — add only if the project needs them)

**Scroll-driven hero video / animated asset**
Requires an MCP-connected media generator. Higgsfield is the one this template
has docs for — not a hard dependency: any MCP server that exposes image/video
generation tools to Claude Code substitutes, so swap it for whichever one
you have access to.

What's confirmed by Higgsfield's own documentation (Creator Hub help center,
"What is Higgsfield MCP"): it's a real OAuth connector at
`https://mcp.higgsfield.ai/mcp` that lets Claude and other MCP-compatible
agents generate images/video/audio using your existing Higgsfield account
and credits — **requires a paid Higgsfield plan**, $19/mo Starter was the
floor as checked 2026-09-26; re-check Higgsfield's pricing page before relying
on that number, it will drift.

What's corroborated by third-party guides only, not on Higgsfield's official
page verbatim: the exact one-line Claude Code install command (`claude mcp
add --transport http --scope user higgsfield https://mcp.higgsfield.ai/mcp`)
— likely to work, but confirm against Higgsfield's current docs before relying
on the exact syntax.

A separate image→video→upscale pipeline was mentioned in one source under the
name "11ElevenLabs" — that name doesn't match any real product found on
verification (only unrelated voice/TTS tool ElevenLabs exists). Don't use that
name to search for or install anything; find the actual tool from the original
video before relying on this path.

**Interactive 3D object from a photo**
Likely tool: **img2threejs** — an agent skill that converts a single reference
image into editable, animation-ready Three.js code. (Earlier drafts of this
template called this "Image23JS," from a source transcript — that name appears
to be a mis-transcription of img2threejs, not a confirmed separate product.
Verify the repo yourself before installing.) Needs a clean single object on a
plain background — busy or backgrounded photos produce broken output.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Skill not firing | Confirm it's at `~/.claude/skills/<name>/SKILL.md` (global) or `.claude/skills/<name>/SKILL.md` (project-level, repo-relative) — check which scope it was installed to, not nested one level deeper |
| Design system drifting mid-build | Re-paste the type/spacing scale at the start of each new section — don't rely on it to remember |
| Two design skills producing inconsistent output | You're only running Taste by default — if you add Impeccable too, disable one; running both causes conflicting output |
| `npx playwright install` slow/failing, or browser version mismatch errors | Environment-dependent — behavior differs between a fresh local install and a pre-provisioned/cloud container, where a pre-installed browser may already exist under a different path. Try `npx playwright install chromium` (one engine only) locally first; if you're in a managed/cloud session, check for existing project docs or env vars (e.g. an executable-path variable) before reinstalling — reinstalling over a working pre-provisioned browser can break more than it fixes. In this repo on Claude Code on the web: don't reinstall — export `PLAYWRIGHT_MCP_EXECUTABLE_PATH=/opt/pw-browsers/chromium` instead (see `CLAUDE.md`). |
| Playwright passes but page still feels broken | It only tested what you asked — explicitly add slow-network and no-JS checks (already in Step 4) |

---

## Why these defaults (context if you revisit this later)
- Taste chosen over Impeccable: source recommends only one taste-enforcing skill
  at a time; Impeccable's link was also never confirmed as correct.
- Higgsfield/11ElevenLabs/Image23JS excluded by default: real added cost/complexity
  for a specific feature (video hero, 3D object) most builds don't need.
- Hosting/deployment intentionally left out of this template — add a step for
  your host (e.g. Hostinger) once the build passes QA.
