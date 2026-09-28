"use client";

import { useRef } from "react";
import CardWash from "@/components/archive/CardWash";
import { cn } from "@/lib/utils";

// The Apollonius card's theatrical spotlight, made reusable. Every card rests
// in the burgundy card wash and brightens on hover, with a light following
// the cursor (see `.wash-card` in globals.css). Position is written straight
// to CSS variables on pointermove: no React state, no re-render per frame.
export type SpotTone = "red" | "gold" | "rim";

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
      data-wash={tone}
      style={{ ...rest.style, ["--spot-r" as string]: `${radius}px` }}
      className={cn(
        "wash-card group/spot relative overflow-hidden",
        lift && "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-10 focus-within:z-10 motion-safe:hover:scale-[1.012] motion-safe:focus-within:scale-[1.012]",
        className,
      )}
    >
      {children}
      <CardWash />
    </Tag>
  );
}
