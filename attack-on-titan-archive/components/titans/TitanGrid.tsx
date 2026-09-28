"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Turntable from "@/components/titans/Turntable";
import { TITANS } from "@/lib/data/titans";
import { prefersReducedMotion } from "@/lib/animation/tokens";
import { asset, cn } from "@/lib/utils";

export const ENTER_KEY = "aot-titan-enter";

/** The nine columns. Opening one "enters the Titan": the column pushes in
 * toward its chest, the page goes dark, and its x-ray fills the screen; the
 * Titan's own page then opens out of that x-ray (XrayIntro). Modifier-clicks,
 * reduced motion and no-JS just follow the link. */
export default function TitanGrid() {
  const router = useRouter();
  const [entering, setEntering] = useState<string | null>(null);
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const timers = useRef<number[]>([]);
  const [ready, setReady] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    // the full turns download quietly once the page is idle, never on data-saver
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    const load = () =>
      TITANS.forEach((t) => {
        const img = new Image();
        img.onload = () => setReady((r) => new Set(r).add(t.slug));
        img.src = asset(`/images/titans/${t.slug}-sm.webp`);
      });
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const id = w.requestIdleCallback ? w.requestIdleCallback(load, { timeout: 4000 }) : window.setTimeout(load, 2500);
    const t = timers.current;
    return () => {
      t.forEach(clearTimeout);
      if (!w.requestIdleCallback) clearTimeout(id);
    };
  }, []);

  function enter(e: React.MouseEvent<HTMLAnchorElement>, slug: string) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || prefersReducedMotion()) return;
    e.preventDefault();
    const href = `/titans/${slug}/`;
    router.prefetch(href);
    setEntering(slug);
    setPhase(1);
    timers.current.push(
      window.setTimeout(() => setPhase(2), 520),
      window.setTimeout(() => {
        try {
          sessionStorage.setItem(ENTER_KEY, slug);
        } catch {}
        router.push(href);
      }, 1050),
    );
  }

  return (
    <>
      <ol className="mx-auto grid max-w-[1500px] grid-cols-3 gap-px bg-line md:grid-cols-9">
        {TITANS.map((t) => (
          <li key={t.slug} className={cn("overflow-hidden bg-base", entering === t.slug && "titan-enter relative z-10")}>
            <Link
              href={`/titans/${t.slug}/`}
              onClick={(e) => enter(e, t.slug)}
              className="turn-on-hover group flex h-full flex-col items-center px-2 pt-6 pb-5 text-center transition-colors hover:bg-base-2 focus-visible:bg-base-2"
            >
              <span className="font-mono text-[0.72rem] tracking-[0.12em] text-ash">{t.height} M</span>
              <Turntable slug={t.slug} small ready={ready.has(t.slug)} className="mt-3 w-full max-w-[150px]" />
              <span className="mt-4 font-display text-[0.95rem] leading-tight font-bold text-paper md:text-[1rem]">{t.name.replace(" Titan", "")}</span>
              <span className="mt-2 hidden min-h-[4.5em] max-w-[18ch] text-[0.82rem] leading-snug text-ash opacity-70 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:block">
                {t.trait}
              </span>
            </Link>
          </li>
        ))}
      </ol>
      {entering && (
        <div
          aria-hidden
          className="xray-veil transition-opacity duration-500 ease-out"
          style={{
            opacity: phase === 2 ? 1 : 0,
            backgroundImage: `url(${asset(`/images/titans/${entering}-xray.webp`)})`,
          }}
        />
      )}
    </>
  );
}
