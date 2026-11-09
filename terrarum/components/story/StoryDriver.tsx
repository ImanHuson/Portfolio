"use client";

import { useEffect, useRef } from "react";

/**
 * Marks the step nearest the middle of the screen as active, and shows its
 * photograph in the pinned frame. Writes attributes only; no React state, so
 * scrolling never re-renders anything.
 */
export function StoryDriver() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const root = ref.current?.closest("[data-story]");
    if (!root) return;
    const steps = [...root.querySelectorAll<HTMLElement>("[data-step]")];
    const frames = [...root.querySelectorAll<HTMLElement>("[data-frame]")];
    const show = (i: number) => {
      steps.forEach((s, j) => s.toggleAttribute("data-active", j === i));
      frames.forEach((f, j) => f.toggleAttribute("data-active", j === i));
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) show(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    steps.forEach((s) => io.observe(s));
    root.setAttribute("data-live", "");
    return () => {
      io.disconnect();
      root.removeAttribute("data-live");
    };
  }, []);
  return <span ref={ref} hidden />;
}
