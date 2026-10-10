---
name: uiverse
description: Find, preview and adapt free MIT-licensed UI elements from Uiverse.io (about 3,800 buttons, loaders, toggle switches, checkboxes, radio buttons, inputs, forms, cards, tooltips, notifications and CSS patterns) for these sites. Use when a page needs a small interactive element (a button style, loader, toggle, checkbox, tooltip, background pattern) and especially for the plain-HTML pages (main portfolio, landing page), where React component libraries don't fit. No account, no cost.
---

# Uiverse elements

Uiverse.io's community elements are mirrored in `uiverse-io/galaxy` (MIT, every element). Each file is one element: HTML plus a `<style>` block (`css` kind, about 3,370), or HTML with Tailwind utility classes only (`tailwind` kind, about 430). The first line credits it: `From Uiverse.io by <author> - Tags: …`. The website itself returns 403 from this container. The GitHub mirror works, so search it locally.

## Find and preview

From the repo root (stdlib only; the first run clones about 24 MB to `~/.cache/uiverse-galaxy`):

```bash
P=.claude/skills/uiverse/scripts/uiverse.py
python3 $P search --category Toggle-switches --kind css --tags minimal --limit 12 \
  --bg '#0b0b0c' --sheet <scratchpad>/sheet.html
python3 $P search --category Buttons --query "gold shine"   # words in name, tags or code
python3 $P show Buttons/<author>_<name>.html
```

Categories: Buttons, Cards, loaders, Toggle-switches, Inputs, Forms, Checkboxes, Patterns, Radio-buttons, Tooltips, Notifications. `--kind css` for the plain-HTML pages; either kind for the Tailwind builds (the classes are Tailwind v3, nearly all valid in v4). Set `--bg` to the target page's background, since many elements are black on black otherwise. Serve the scratchpad over `python3 -m http.server` and screenshot the sheet with `playwright-cli`; **pick by looking**, never by tags alone.

## Adapt before shipping (always)

An element straight from Uiverse is a demo, not a component. Before it goes on a page:
1. **Scope it.** Class names are generic (`.container`, `.loader`, `.btn`). Rename them under a project prefix, and drop rules on `body`, `html` or `*`.
2. **Retoken it.** Replace its colours, fonts and radii with the project's tokens (`--gold`, `--void`, radius 0 in the archives, and so on). A neon or purple demo palette is never kept.
3. **Fix the motion** (the `emil-*` skills decide): no `transition: all`; animate only transform and opacity; hover motion inside `@media (hover: hover)`; a `prefers-reduced-motion` block that keeps colour or opacity feedback and drops movement; infinite loops only on loaders.
4. **Fix the semantics** (`frontend-a11y`, `web-design-guidelines`): a real `<button>`, `<input type="checkbox">` or `<label>` instead of a clickable div; a visible focus style; text contrast at AA; and an `aria-label` where the element has no text.
5. **Credit it.** Put a comment above the CSS: `/* Adapted from Uiverse.io by <author> (MIT) */`. On the archives, also add a line to the page's credits list where one exists. Attribution is not mandatory under MIT, but this repo credits every source it uses.

One element at a time, where it earns its place: this repo's rule is 2–3 intentional touches per page, not a gallery of effects.
