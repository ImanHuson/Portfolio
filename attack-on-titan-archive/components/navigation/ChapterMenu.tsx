"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ACTS, chapterFor } from "@/lib/data/chapters";
import { WAYS } from "@/lib/data/ways";
import ReadingProgress from "@/components/archive/ReadingProgress";
import { cn } from "@/lib/utils";

/**
 * Every chapter, one click from anywhere. A native <details>, so it opens
 * with JS off; with JS it also closes on Escape, on an outside click, and
 * after navigating. The summary names where the reader is.
 */
export default function ChapterMenu() {
  const pathname = usePathname();
  const current = chapterFor(pathname);
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && el.open) {
        el.open = false;
        el.querySelector("summary")?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (el.open && !el.contains(e.target as Node)) el.open = false;
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <details ref={ref} className="chapter-menu group relative">
      <summary className="flex cursor-pointer list-none items-center gap-3 py-2 font-military text-[0.95rem] tracking-[0.14em] whitespace-nowrap text-paper/85 uppercase transition-colors hover:text-paper [&::-webkit-details-marker]:hidden">
        <span aria-hidden className="hidden font-mono text-meta tracking-[0.08em] text-ash sm:inline">{current?.id ?? "AOT"}</span>
        <span>
          Chapters
          {current && <span className="sr-only">, now reading {current.title}</span>}
        </span>
        <span aria-hidden className="block size-2 translate-y-[-2px] rotate-45 border-r border-b border-current transition-transform group-open:translate-y-[2px] group-open:rotate-[225deg]" />
      </summary>
      <div className="fixed inset-x-0 top-[var(--nav-h)] max-h-[calc(100dvh-var(--nav-h))] overflow-y-auto overscroll-contain border-b border-line bg-base px-4 pt-8 pb-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.95)] md:px-8">
        <nav aria-label="Chapters" className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-3 md:gap-8">
          {ACTS.map((act) => (
            <div key={act.name}>
              <p className="border-b border-line pb-3 font-display text-h3 font-bold text-paper">{act.name}</p>
              <ol className="mt-2">
                {act.chapters.map((c) => {
                  const here = current?.id === c.id;
                  return (
                    <li key={c.id}>
                      <Link
                        href={c.href ?? "/"}
                        aria-current={here ? "page" : undefined}
                        className={cn(
                          "group/row grid grid-cols-[3.75rem_minmax(0,1fr)] items-baseline gap-3 border-l-2 py-3 pl-3 transition-colors",
                          here ? "border-alert bg-paper/[0.04]" : "border-transparent hover:border-paper/40 hover:bg-paper/[0.03]",
                        )}
                      >
                        <span className="font-mono text-meta text-ash">{c.id}</span>
                        <span>
                          <span className={cn("block font-military text-[1.1rem] font-semibold tracking-[0.1em] uppercase", here ? "text-paper" : "text-paper/85 group-hover/row:text-paper")}>
                            {c.title}
                          </span>
                          <span className="mt-0.5 block text-[0.9rem] leading-snug text-ash">{c.line}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </nav>
        <nav aria-label="Ways in" className="mx-auto mt-10 max-w-[1400px] border-t border-line pt-6">
          <p className="font-military text-[0.95rem] font-semibold tracking-[0.14em] text-ash uppercase">Or go in by theme</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-6">
            {WAYS.map((w) => (
              <li key={w.href}>
                <Link
                  href={w.href}
                  aria-current={pathname === w.href || pathname === w.href.slice(0, -1) ? "page" : undefined}
                  className="group/way block border-l-2 border-transparent py-2 pl-3 transition-colors hover:border-paper/40 aria-[current=page]:border-alert"
                >
                  <span className="block font-military text-[1.05rem] font-semibold tracking-[0.1em] text-paper/85 uppercase group-hover/way:text-paper">{w.name}</span>
                  <span className="block text-[0.85rem] leading-snug text-ash">{w.line}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mx-auto mt-8 flex max-w-[1400px] flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <p className="text-[0.9rem] text-ash">Everything past The Wall spoils the story. The last three files ask before they open.</p>
          <ReadingProgress />
        </div>
      </div>
    </details>
  );
}
