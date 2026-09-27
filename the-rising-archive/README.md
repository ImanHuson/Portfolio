# The Red Rising Archive

An unofficial fan archive of Pierce Brown's Red Rising Saga. Not affiliated with the author or publisher.

Next.js (App Router, `output: "export"`) + TypeScript + Tailwind v4 + vendored shadcn/ui, `ogl` for the WebGL opening, Lenis + GSAP ScrollTrigger for scroll, Motion for UI micro-interactions.

```bash
npm ci
npm run dev     # http://localhost:3000/Portfolio/the-rising-archive
npm run build   # static site in out/, deployed by the repo's .github/workflows/pages.yml
```

- `lib/data/` holds all content. Every entry carries the book it spoils; `SpoilerGate` seals it behind a native `<details>` until the reader's clearance covers it.
- `components/three/` is the Mars descent (planet, stars, dust, shaft, camera choreography).
- `scripts/art/` regenerates every image in `public/images/`: `scenes.mjs` (three.js, via the repo's level-2 image skill setup) and `books.py` (Pillow, via the level-1 skill).
- `components/ui/` is shadcn/ui source, copied from the shadcn GitHub repo because the registry host is blocked in the build container.
