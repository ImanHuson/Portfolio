"use client";

import { useEffect } from "react";
import { getLenis } from "@/components/providers/SmoothScroll";
import { useArchive } from "@/components/providers/ArchiveProvider";

/** A plain anchor (works with JS off); with JS it glides via Lenis. */
export function TowerLink({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        const lenis = getLenis();
        if (!lenis) return;
        e.preventDefault();
        lenis.scrollTo(`#${to}`, { duration: 2.2, offset: -64 });
      }}
    >
      {children}
    </a>
  );
}

/** Sound changes as you ascend: a heartbeat at the bottom, a seal at the top.
 * Silent unless the reader turned sound on. */
export function TowerSound() {
  const { cue } = useArchive();
  useEffect(() => {
    const red = document.getElementById("tier-red");
    const gold = document.getElementById("tier-gold");
    if (!red || !gold) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          cue(e.target.id === "tier-gold" ? "seal" : "heartbeat");
        }
      },
      { threshold: 0.6 },
    );
    io.observe(red);
    io.observe(gold);
    return () => io.disconnect();
  }, [cue]);
  return null;
}
