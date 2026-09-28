// Single source of truth for motion. CSS mirrors these as custom properties
// in app/globals.css. Rule: GSAP + ScrollTrigger own scroll-driven
// choreography; Motion owns discrete UI micro-interactions. Never both on
// the same element.

export const ease = {
  out: "power3.out",
  inOut: "power2.inOut",
  cinematic: "expo.inOut",
  none: "none",
} as const;

export const cssEase = {
  out: [0.16, 1, 0.3, 1] as const,
  cinematic: [0.65, 0, 0.35, 1] as const,
};

export const duration = {
  micro: 0.18,
  ui: 0.32,
  reveal: 0.9,
  cinematic: 1.6,
} as const;

export const stagger = {
  tight: 0.04,
  base: 0.07,
  slow: 0.14,
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const smoothstep = (t: number) => {
  const x = Math.min(Math.max(t, 0), 1);
  return x * x * (3 - 2 * x);
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Maps progress p into a 0..1 sub-range [start, end]. */
export const range = (p: number, start: number, end: number) =>
  Math.min(Math.max((p - start) / (end - start), 0), 1);

const RM = "(prefers-reduced-motion: reduce)";
/** For useSyncExternalStore: reduced-motion as a subscribable value. */
export const reducedMotionStore = {
  subscribe(cb: () => void) {
    const mq = window.matchMedia(RM);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  },
  getSnapshot: () => window.matchMedia(RM).matches,
};

/** True when the reader has scrolled into this (pinned) section, so a swap to
 * shorter stills should keep them at its start; false before they reach it. */
export function readerInside(el: HTMLElement | null) {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.top < 0 && r.bottom > 0;
}
