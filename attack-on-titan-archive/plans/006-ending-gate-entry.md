# 006 — Ending files fade in when opened

- **Status**: DONE
- **Commit**: e07f0a1
- **Severity**: LOW
- **Category**: Missed opportunity
- **Estimated scope**: 1 file

## Problem
`components/ending/EndingGate.tsx`: opening the `<details>` swaps a full-screen gate for the chapter instantly.

## Target
`@starting-style` entry on the opened content: `.ending-gate[open] > :not(summary) { transition: opacity 300ms var(--ease-out); } @starting-style { .ending-gate[open] > :not(summary) { opacity: 0; } }`. Opacity only; no transform (the content includes pinned scenes that ScrollTrigger measures).

## Verification
Build clean. Open an ending file: the chapter fades in over ~300 ms; with JS off it still opens (unsupported browsers just show it instantly).
