"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { duration, ease, prefersReducedMotion } from "@/lib/animation/tokens";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Scroll reveal that NEVER touches opacity: only a lift. Content is fully
 * readable if JS fails, under a full-page screenshot, in print, and under
 * reduced motion (where the tween is skipped entirely). Lesson carried over
 * from this repo’s book-site-react and red-rising-archive builds. */
export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  y = 28,
  className,
}: {
  children: React.ReactNode;
  as?: React.ElementType;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      gsap.from(ref.current, {
        y,
        duration: duration.reveal,
        delay,
        ease: ease.out,
        scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
      });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
