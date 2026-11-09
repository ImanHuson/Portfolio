"use client";

import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface GalleryItem {
  id: string;
  src: string;
  srcSet: string;
  large: string;
  fallback?: string;
  w: number;
  h: number;
  alt: string;
  side: string;
  credit: { what: string; creator: string; date?: string; license: string; licenseUrl: string; sourceUrl: string };
}

function Credit({ c }: { c: GalleryItem["credit"] }) {
  return (
    <>
      <a href={c.sourceUrl} className="underline decoration-line underline-offset-2 hover:decoration-current">
        {c.what}
      </a>
      {c.what === "Photo" ? " by " : ", "}
      {c.creator}
      {c.date ? `, ${c.date}` : ""},{" "}
      <a href={c.licenseUrl} className="underline decoration-line underline-offset-2 hover:decoration-current">
        {c.license}
      </a>
    </>
  );
}

/**
 * The photo grid and its full-screen viewer. Without JavaScript each photo is
 * a plain link to its large copy; with it, the link opens a native <dialog>
 * that pages with buttons, arrow keys or a swipe, and returns focus on close.
 */
export function GalleryViewer({ items, layout = "wall" }: { items: GalleryItem[]; layout?: "wall" | "emaki" }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const strip = useRef<HTMLUListElement>(null);
  const [at, setAt] = useState(0);
  const swipe = useRef<number | null>(null);
  const n = items.length;
  const go = useCallback((d: number) => setAt((i) => (i + d + n) % n), [n]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    el.addEventListener("keydown", key);
    return () => el.removeEventListener("keydown", key);
  }, [go]);

  const it = items[at];
  const open = (i: number) => {
    setAt(i);
    dialog.current?.showModal();
  };
  /** Unroll the hand-scroll by about one picture, in reading direction (leftward). */
  const unroll = (d: 1 | -1) => {
    const el = strip.current;
    if (!el) return;
    el.scrollBy({ left: -d * el.clientWidth * 0.8, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const emaki = layout === "emaki";
  return (
    <>
      {emaki && (
        <div className="mt-8 flex items-center justify-between gap-4 text-sm text-muted">
          <p>Read from right to left, as a hand-scroll unrolls.</p>
          <div className="flex gap-1" data-js-only>
            <button type="button" onClick={() => unroll(-1)} className="press border border-line p-2 hover:border-accent hover:text-accent-text">
              <CaretRight size={18} aria-hidden />
              <span className="sr-only">Back</span>
            </button>
            <button type="button" onClick={() => unroll(1)} className="press border border-line p-2 hover:border-accent hover:text-accent-text">
              <CaretLeft size={18} aria-hidden />
              <span className="sr-only">Unroll further</span>
            </button>
          </div>
        </div>
      )}
      <ul
        ref={strip}
        dir={emaki ? "rtl" : undefined}
        tabIndex={emaki ? 0 : undefined}
        aria-label={emaki ? "Photographs, scrolling sideways" : undefined}
        className={emaki ? "emaki mt-4 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6" : "mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3"}
      >
        {items.map((m, i) => (
          <li key={m.id} dir={emaki ? "ltr" : undefined} className={emaki ? "emaki-item shrink-0 snap-start" : "mb-8 break-inside-avoid"}>
            <figure>
              <a
                href={m.large}
                className="zoom block overflow-hidden"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                  e.preventDefault();
                  open(i);
                }}
              >
                <img
                  src={m.src}
                  srcSet={m.srcSet}
                  sizes={emaki ? "(min-width:768px) 40vw, 85vw" : "(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw"}
                  width={m.w}
                  height={m.h}
                  alt={m.alt}
                  data-fallback={m.fallback}
                  loading="lazy"
                  decoding="async"
                  className={emaki ? "photo h-full w-auto max-w-none bg-surface" : "photo h-auto w-full bg-surface"}
                />
              </a>
              <figcaption className={`mt-2 text-[13px] leading-snug text-muted ${emaki ? "max-w-[36ch]" : ""}`} data-pagefind-ignore>
                <span className="font-medium text-ink">{m.side}.</span> <Credit c={m.credit} />.
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label="Photo viewer"
        className="gallery-dialog m-0 h-dvh overscroll-contain max-h-none w-screen max-w-none bg-bg p-0 text-ink backdrop:bg-black/80"
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      >
        {it && (
          <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto]">
            <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-8">
              <p className="text-sm text-muted" aria-live="polite">
                {at + 1} of {n}
                <span className="ml-3 text-ink">{it.side}</span>
              </p>
              <button type="button" onClick={() => dialog.current?.close()} className="press -mr-2 p-2 hover:text-accent-text">
                <X size={22} aria-hidden />
                <span className="sr-only">Close viewer</span>
              </button>
            </div>
            <div
              className="relative flex min-h-0 items-center justify-center px-2 md:px-20"
              onPointerDown={(e) => (swipe.current = e.clientX)}
              onPointerUp={(e) => {
                if (swipe.current === null) return;
                const dx = e.clientX - swipe.current;
                swipe.current = null;
                if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
              }}
            >
              <img
                key={it.id}
                src={it.large}
                srcSet={it.srcSet}
                sizes="100vw"
                width={it.w}
                height={it.h}
                alt={it.alt}
                data-fallback={it.fallback}
                className="gallery-shot photo max-h-full w-auto max-w-full object-contain"
              />
              <button type="button" onClick={() => go(-1)} className="press absolute left-1 top-1/2 hidden -translate-y-1/2 p-3 hover:text-accent-text md:block">
                <CaretLeft size={30} aria-hidden />
                <span className="sr-only">Previous photo</span>
              </button>
              <button type="button" onClick={() => go(1)} className="press absolute right-1 top-1/2 hidden -translate-y-1/2 p-3 hover:text-accent-text md:block">
                <CaretRight size={30} aria-hidden />
                <span className="sr-only">Next photo</span>
              </button>
            </div>
            <div className="flex items-start justify-between gap-4 px-4 py-4 md:px-8">
              <p className="max-w-[80ch] text-sm leading-snug">
                {it.alt} <span className="text-muted"><Credit c={it.credit} />.</span>
              </p>
              <div className="flex shrink-0 gap-1 md:hidden">
                <button type="button" onClick={() => go(-1)} className="press p-2">
                  <CaretLeft size={24} aria-hidden />
                  <span className="sr-only">Previous photo</span>
                </button>
                <button type="button" onClick={() => go(1)} className="press p-2">
                  <CaretRight size={24} aria-hidden />
                  <span className="sr-only">Next photo</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
