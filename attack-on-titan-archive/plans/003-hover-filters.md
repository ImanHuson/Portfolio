# 003 — Hover on images: transform and opacity only

- **Status**: DONE
- **Commit**: e07f0a1
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 2 files, small

## Problem
`components/sections/ArchiveIndex.tsx:16`: `grayscale-[0.4] transition-[filter,transform] duration-700 ... group-hover:grayscale-0 motion-safe:group-hover:scale-[1.03]` animates `filter` on up to 1680-px images (repaint every frame) for 700 ms. `components/titans/TitanGrid.tsx:62`: `transition-[opacity,filter] ... motion-safe:group-hover:brightness-110`.

## Target
- Index: no filter animation. Image at rest `opacity-90`, hover `opacity-100` and `scale-[1.03]` (motion-safe), `transition-[opacity,transform] duration-300 ease-[var(--ease-out)]`. Remove grayscale.
- Titans: drop `brightness-110` and `filter` from the transition list: `transition-opacity duration-200`.

## Verification
Build clean. Performance panel while hovering across cards shows no long paint on the image layer.
