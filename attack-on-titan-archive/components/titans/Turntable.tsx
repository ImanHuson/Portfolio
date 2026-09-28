"use client";

import { useEffect, useState } from "react";
import { asset, cn } from "@/lib/utils";

/** A Titan turntable: a still of frame 0, swapped for the 24-frame sprite
 * once that has downloaded (see .turntable in globals.css). Both images are
 * transparent, so they are never layered: the still would show through. */
export default function Turntable({
  slug,
  small = false,
  live = false,
  className,
  style,
  ready = false,
}: {
  slug: string;
  small?: boolean;
  /** load the sprite immediately (a Titan's own page), not only on hover */
  live?: boolean;
  /** the sprite is already downloaded (the grid's prefetch); hover may turn it */
  ready?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const vars = {
    "--still": `url(${asset(`/images/titans/${slug}-still.webp`)})`,
    "--sprite": `url(${asset(`/images/titans/${slug}${small ? "-sm" : ""}.webp`)})`,
  } as React.CSSProperties;
  const sprite = asset(`/images/titans/${slug}${small ? "-sm" : ""}.webp`);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!live) return;
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.src = sprite;
  }, [live, sprite]);
  return <div aria-hidden data-live={(live && loaded) || undefined} data-ready={ready || undefined} className={cn("turntable aspect-[1/2]", className)} style={{ ...vars, ...style }} />;
}
