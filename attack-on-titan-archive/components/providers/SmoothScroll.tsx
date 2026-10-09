"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Native scrolling, on the compositor thread. A JS smooth-scroll library
 * (Lenis, used here before) moves the page from the main thread, so any busy
 * frame shows as a stutter; measured here it cost ~40% more main-thread work
 * per scroll. Scrubbed scenes smooth themselves with ScrollTrigger's `scrub`
 * lag instead. This only resets scroll and re-measures triggers per route.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return <>{children}</>;
}
