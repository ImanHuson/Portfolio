# 001 — Make "enter the Titan" fast and ease-out

- **Status**: DONE
- **Commit**: e07f0a1
- **Severity**: HIGH
- **Category**: Purpose & frequency / Easing & duration
- **Estimated scope**: 3 files, small

## Problem
`app/globals.css` `.titan-enter .titan-col { transform: scale(7); transition: transform 900ms cubic-bezier(0.7, 0, 0.84, 0); }` is a strong ease-in: nothing visibly happens for the first ~300 ms after the click. `components/titans/TitanGrid.tsx:36-41` shows the veil at 520 ms and navigates at 1050 ms; `components/titans/XrayIntro.tsx:45` then fades the veil over `duration-[1000ms] ease-out`. Click-to-readable is ~2.1 s, every time, on a grid readers browse repeatedly.

## Target
- Column: `transition: transform 480ms var(--ease-in-out)` (on-screen movement), `scale(7)` unchanged.
- Veil: at 260 ms, opacity 0 -> 1 over 220 ms `var(--ease-out)`; navigate at 500 ms.
- Arrival (XrayIntro): opacity 1 -> 0 and scale 1 -> 1.08 over 450 ms `var(--ease-out)`; unmount at 500 ms.
- Frequency: the full sequence plays on the first entry of a session only (sessionStorage key `aot-titan-entered`); later clicks are plain links.

## Steps
1. globals.css: replace the `.titan-enter .titan-col` transition with `transform 480ms var(--ease-in-out)`.
2. TitanGrid.tsx: timers 520 -> 260 and 1050 -> 500; veil classes `transition-opacity duration-[220ms] ease-[var(--ease-out)]`; return early (plain link) when `sessionStorage.getItem("aot-titan-entered")` is set; set it on first entry.
3. XrayIntro.tsx: `duration-[450ms] ease-[var(--ease-out)]`, scale 1.08, unmount timer 1100 -> 500.

## Boundaries
Motion only. No change to markup, the x-ray images, or reduced-motion/modifier-click behaviour (they already skip the transition).

## Verification
- tsc, eslint, build clean.
- Feel check: click a Titan; the push-in starts moving on the first frame; the page is readable in under ~1 s. Click a second Titan in the same session: it navigates directly. At 10 % playback the column accelerates and settles, never hangs at the start.
