"use client";
import { useEffect } from "react";

/**
 * Hero slides after the first are written without a src, so a page doesn't fetch every slide
 * at full size before the reader has seen one (Lighthouse measured 19 MB on Japan's page).
 * Each slide's image is requested a few seconds before its turn in the CSS cross-dissolve.
 * Under reduced motion only the first slide shows, so nothing else loads.
 */
export function SlideLoader() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers: number[] = [];
    document.querySelectorAll<HTMLImageElement>("[data-hero] img[data-src]").forEach((img) => {
      const at = parseFloat(img.style.getPropertyValue("--slide-at")) || 0;
      timers.push(
        window.setTimeout(() => {
          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
          img.src = img.dataset.src!;
        }, Math.max(0, at - 5) * 1000),
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);
  return null;
}
