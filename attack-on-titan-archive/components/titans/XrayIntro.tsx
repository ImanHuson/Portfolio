"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ENTER_KEY } from "@/components/titans/TitanGrid";
import { asset } from "@/lib/utils";

const noop = () => () => {};

/** Arriving from the Titans index: the page opens out of the Titan's x-ray.
 * Only when the visitor came through the "enter" transition (a session flag);
 * a direct visit, a reload or no-JS shows the page as is. */
export default function XrayIntro({ slug }: { slug: string }) {
  // read the flag once, on the client, without setState-in-effect
  const arrived = useSyncExternalStore(
    noop,
    () => {
      try {
        return sessionStorage.getItem(ENTER_KEY) === slug;
      } catch {
        return false;
      }
    },
    () => false,
  );
  const [gone, setGone] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!arrived) return;
    try {
      sessionStorage.removeItem(ENTER_KEY);
    } catch {}
    const a = requestAnimationFrame(() => requestAnimationFrame(() => setFading(true)));
    const b = window.setTimeout(() => setGone(true), 500);
    return () => {
      cancelAnimationFrame(a);
      clearTimeout(b);
    };
  }, [arrived]);

  if (!arrived || gone) return null;
  return (
    <div
      aria-hidden
      className="xray-veil transition-[opacity,transform] duration-[450ms] ease-[var(--ease-out)]"
      style={{
        backgroundImage: `url(${asset(`/images/titans/${slug}-xray.webp`)})`,
        opacity: fading ? 0 : 1,
        transform: fading ? "scale(1.08)" : "scale(1)",
      }}
    />
  );
}
