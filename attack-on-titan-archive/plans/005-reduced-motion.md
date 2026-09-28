# 005 — Reduced motion keeps feedback; hover movement only on real hover; press transition

- **Status**: DONE
- **Commit**: e07f0a1
- **Severity**: MEDIUM
- **Category**: Accessibility / Physicality
- **Estimated scope**: 3 files

## Problem
`app/globals.css:187`: under `prefers-reduced-motion: reduce`, `*` gets `transition-duration: 0.001ms !important`, which also removes colour/opacity/border feedback. Hover nudges `group-hover:translate-x-1` / `-translate-x-1` (`components/typography/NextChapter.tsx:16,32`, `components/sections/ArchiveIndex.tsx:31`) are neither motion-gated nor limited to hover-capable pointers (touch fires them on tap). `.file-link:active { transform: translateY(1px) }` has no transition.

## Target
- Reduced motion: keep the `animation` override; replace the transition override with `transition-property: opacity, color, background-color, border-color !important` so feedback stays and movement goes.
- Arrow nudges: `motion-safe:[@media(hover:hover)]:group-hover:translate-x-1` (and the negative variant).
- `.file-link`: add `transform 160ms var(--ease-out)` to its transition list.

## Verification
Build clean. With reduced motion emulated: hovering a card still changes border/background; nothing moves. On touch emulation, tapping a card does not leave an arrow shifted.
