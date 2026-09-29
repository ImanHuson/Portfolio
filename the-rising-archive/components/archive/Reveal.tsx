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
 * from this repo’s book-site-react and red-rising-archive builds.
 * `cell`: for a cell in a hairline grid (gap-px over bg-line). The content
 * lifts inside the cell instead of the cell itself, so the grid's line
 * colour never shows through the gap while it moves. */
export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  y = 28,
  className,
  cell = false,
}: {
  children: React.ReactNode;
  as?: React.ElementType;
  delay?: number;
  y?: number;
  className?: string;
  cell?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      gsap.from(cell && inner.current ? inner.current : ref.current, {
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
      {cell ? (
        <div ref={inner} className="h-full">
          {children}
        </div>
      ) : (
        children
      )}
    </Tag>
  );
}
