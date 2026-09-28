# 002 — Mirror pair tabs: jump to the start, don't scrub back

- **Status**: DONE
- **Commit**: e07f0a1
- **Severity**: HIGH
- **Category**: Interruptibility / Purpose
- **Estimated scope**: 1 file, small

## Problem
`components/world/Mirror.tsx:152`: `lenis.scrollTo(top, { duration: 0.8 })`. The section is 900vh, so choosing a pair from deep inside scrolls up to eight screens in 0.8 s and the scrubbed timeline replays backwards at speed. Tabs are clicked several times in a row.

## Target
Immediate jump (`{ immediate: true }`, `window.scrollTo({ top })` without smooth), with the pinned stage dipping to opacity 0.0 and back over 200 ms `var(--ease-out)` so the swap reads as a cut, not a teleport.

## Steps
1. In `choose()`, set the sticky stage's opacity to 0 (no transition), jump, then on the next frame restore opacity with `transition: opacity 200ms var(--ease-out)`.
2. Skip the dip under reduced motion (the static table renders there anyway).

## Boundaries
Do not change the timeline or the stages.

## Verification
Build clean. Feel check: scroll to the end of a pair, choose another: no reverse flicker; a short fade and the new pair's first stage.
