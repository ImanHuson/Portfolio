"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

// The Apollonius card's theatrical spotlight, made reusable. A light follows
// the cursor and a colour wash rises behind it. The light is an overlay in
// `screen` blend mode, so it brightens whatever is beneath (text, plates,
// backgrounds) without z-index games. Position is written straight to CSS
// variables on pointermove: no React state, no re-render per frame.
const TONES = {
  gold: { spot: "rgba(200,169,106,0.22)", wash: "rgba(122,15,23,0.32)" },
  red: { spot: "rgba(196,30,42,0.24)", wash: "rgba(122,15,23,0.26)" },
  rim: { spot: "rgba(223,232,255,0.16)", wash: "rgba(170,178,186,0.1)" },
} as const;

export type SpotTone = keyof typeof TONES;

export default function Spotlight({
  as: Tag = "div",
  tone = "red",
  lift = true,
  radius = 240,
  className,
  children,
  ...rest
}: {
  as?: React.ElementType;
  tone?: SpotTone;
  lift?: boolean;
  radius?: number;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const t = TONES[tone];
  return (
    <Tag
      ref={ref}
      {...rest}
      onPointerMove={(e: React.PointerEvent<HTMLElement>) => {
        const el = ref.current;
        if (!el || e.pointerType === "touch") return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={cn(
        "group/spot relative overflow-hidden",
        lift && "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-10 focus-within:z-10 motion-safe:hover:scale-[1.012] motion-safe:focus-within:scale-[1.012]",
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-500 group-hover/spot:opacity-100 group-focus-within/spot:opacity-100"
        style={{
          background: `radial-gradient(circle ${radius}px at var(--mx, 50%) var(--my, 40%), ${t.spot}, transparent 70%), linear-gradient(160deg, ${t.wash}, transparent 60%)`,
        }}
      />
    </Tag>
  );
}
