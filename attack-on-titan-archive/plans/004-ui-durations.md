# 004 — Bring UI durations into budget and add the strong curves as tokens

- **Status**: DONE
- **Commit**: e07f0a1
- **Severity**: MEDIUM
- **Category**: Easing & duration / Cohesion & tokens
- **Estimated scope**: 1 file

## Problem
`app/globals.css`: `.file-link::before { transition: transform 600ms var(--ease-out); }` (hover, tens of times per visit) and `.site-header { transition: opacity 600ms ..., transform 600ms ... }` both exceed the 300 ms UI budget. `--ease-out` is `cubic-bezier(0.16, 1, 0.3, 1)`; there is no ease-in-out token, and one hand-typed ease-in curve for the Titan push-in.

## Target
- Tokens: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1);` `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);`
- `.file-link::before`: `transform 250ms var(--ease-out)`.
- `.site-header`: `opacity 300ms var(--ease-out), transform 300ms var(--ease-out)`.

## Verification
Build clean. Feel check: the accent line under the cursor finishes before the pointer settles; the header leaves and returns without lag.
