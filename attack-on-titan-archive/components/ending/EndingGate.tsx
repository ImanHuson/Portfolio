"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The last three files are the ending. The whole chapter sits inside a
 * native <details>, so nothing spoils by accident and it works with JS off.
 * Opening it re-measures every pinned scroll scene inside.
 */
export default function EndingGate({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // a reader who opened one ending file has seen the gate: open the next ones
    try {
      if (sessionStorage.getItem("aot-ending-open") === "1") el.open = true;
    } catch {}
    const onToggle = () => {
      if (el.open) {
        try {
          sessionStorage.setItem("aot-ending-open", "1");
        } catch {}
      }
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    el.addEventListener("toggle", onToggle);
    return () => el.removeEventListener("toggle", onToggle);
  }, []);
  return (
    <details ref={ref} className="ending-gate group">
      <summary className="flex min-h-[100dvh] cursor-pointer list-none flex-col items-center justify-center gap-8 bg-void px-6 pt-[var(--nav-h)] text-center group-open:hidden [&::-webkit-details-marker]:hidden">
        <p className="font-mono text-meta tracking-[0.3em] text-ash uppercase">{id}</p>
        <h1 className="font-display text-h1 leading-none font-bold text-paper uppercase">{title}</h1>
        <p className="max-w-[40ch] font-serif text-lede text-paper/70 italic">This file holds the ending of the story. Nothing past this point is sealed.</p>
        <span className="border border-paper/50 px-6 py-3 font-mono text-meta tracking-[0.24em] text-paper uppercase transition-colors hover:border-paper hover:bg-paper/5">
          Open the file
        </span>
      </summary>
      {children}
    </details>
  );
}
