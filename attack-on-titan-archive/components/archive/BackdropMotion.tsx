"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/animation/tokens";

gsap.registerPlugin(ScrollTrigger);

/** Where the browser has no CSS scroll-driven animations (Firefox, older
 * Safari), drives the same backdrop and header motion as `.bd-move` /
 * `.hd-move` in globals.css with ScrollTrigger, transforms only. Renders nothing. */
export default function BackdropMotion() {
  const pathname = usePathname();
  useEffect(() => {
    if (CSS.supports("animation-timeline: view()") || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>("[data-backdrop]").forEach((host) => {
        const img = host.querySelector<HTMLElement>(".bd-move");
        if (!img) return;
        gsap.fromTo(
          img,
          { yPercent: -4, scale: 1.18 },
          { yPercent: 4, scale: 1.04, ease: "none", scrollTrigger: { trigger: host, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
      document.querySelectorAll<HTMLElement>(".hd-move").forEach((img) => {
        gsap.to(img, { yPercent: 16, scale: 1.08, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top top", end: "bottom top", scrub: true } });
      });
    });
    return () => ctx.revert();
  }, [pathname]);
  return null;
}
