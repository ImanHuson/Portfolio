"use client";

import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface GalleryItem {
  id: string;
  src: string;
  srcSet: string;
  large: string;
  thumb: string;
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
 * The photographs of a place and their full-screen viewer.
 *
 * "emaki" (Japan) is a hand-scroll read right to left. On wide screens with
 * motion allowed, the section pins and the strip unrolls as the reader scrolls
 * down (GSAP ScrollTrigger); everywhere else it is a native sideways scroll.
 * "wall" is a masonry wall. Without JavaScript each photo links to its large
 * copy; with it, the link opens a <dialog> that pages with buttons, arrow keys
 * or a swipe, and returns focus on close.
 */
export function GalleryViewer({ items, layout = "wall", header }: { items: GalleryItem[]; layout?: "wall" | "emaki"; header?: React.ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [at, setAt] = useState(0);
  const [pinned, setPinned] = useState(false);
  const swipe = useRef<number | null>(null);
  const n = items.length;
  const go = useCallback((d: number) => setAt((i) => (i + d + n) % n), [n]);
  const emaki = layout === "emaki";

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

  // Pin and unroll on wide screens; undo everything when the media query stops matching.
  useEffect(() => {
    if (!emaki || !pin.current || !track.current || !view.current) return;
    let alive = true;
    let undo = () => {};
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (!alive) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const t = track.current!;
        const v = view.current!;
        const distance = () => Math.max(0, t.scrollWidth - v.clientWidth);
        if (distance() < 40) return;
        setPinned(true);
        // The view is right-to-left, so the strip starts at its right end and moves right.
        const tween = gsap.to(t, {
          x: () => distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin.current!,
            // Below the site header (3.5rem), so the heading stays in view while pinned.
            start: "top 56px",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        // Keyboard: bring a focused photograph into view by scrolling to its point on the scroll.
        const items = [...t.querySelectorAll<HTMLElement>(".scroll-item")];
        const onFocus = (e: FocusEvent) => {
          const i = items.findIndex((li) => li.contains(e.target as Node));
          const st = tween.scrollTrigger;
          if (i < 0 || !st) return;
          window.scrollTo({ top: st.start + (st.end - st.start) * (items.length > 1 ? i / (items.length - 1) : 0), behavior: "auto" });
        };
        t.addEventListener("focusin", onFocus);
        return () => {
          t.removeEventListener("focusin", onFocus);
          setPinned(false);
        };
      });
      undo = () => mm.revert();
    })();
    return () => {
      alive = false;
      undo();
    };
  }, [emaki]);

  const it = items[at];
  const open = (i: number) => {
    setAt(i);
    dialog.current?.showModal();
  };
  /** Unroll the hand-scroll by about one picture, in reading direction (leftward). */
  const unroll = (d: 1 | -1) => {
    const el = view.current;
    if (!el) return;
    el.scrollBy({ left: -d * el.clientWidth * 0.8, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const link = (m: GalleryItem, i: number, img: React.ReactNode) => (
    <a
      href={m.large}
      className="zoom block overflow-hidden"
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        open(i);
      }}
    >
      {img}
    </a>
  );

  return (
    <>
      {emaki ? (
        <div ref={pin} data-emaki className="relative lg:flex lg:h-[calc(100svh-56px)] lg:flex-col lg:justify-center">
          <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-end justify-between gap-4 px-4 md:px-8">
            <div>
              {header}
              <p className="mt-2 text-sm text-muted">Read from right to left, as a hand-scroll unrolls.</p>
            </div>
            <div className={`flex gap-1 ${pinned ? "invisible" : ""}`} data-js-only>
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
          <div
            ref={view}
            dir="rtl"
            tabIndex={pinned ? -1 : 0}
            aria-label="Photographs, read right to left as a hand-scroll unrolls"
            className={`emaki mt-8 ${pinned ? "overflow-hidden" : "overflow-x-auto"} pb-6`}
          >
            <ul ref={track} data-pinned={pinned ? "" : undefined} className="scroll-track flex w-max items-start gap-[5vw] px-4 md:px-[6vw]">
              {items.map((m, i) => (
                <li key={m.id} dir="ltr" className="scroll-item shrink-0">
                  <figure>
                    {link(
                      m,
                      i,
                      <img
                        src={m.src}
                        srcSet={m.srcSet}
                        sizes="(min-width:768px) 50vw, 85vw"
                        width={m.w}
                        height={m.h}
                        alt={m.alt}
                        data-fallback={m.fallback}
                        loading="lazy"
                        decoding="async"
                        className="scroll-shot photo w-auto max-w-[86vw] bg-surface object-cover"
                      />,
                    )}
                    <figcaption className="mt-3 max-w-[34ch] text-[13px] leading-snug text-muted" data-pagefind-ignore>
                      <span className="block font-display text-base text-ink">{m.side}.</span> <Credit c={m.credit} />.
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <>
          {header}
          <ul className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {items.map((m, i) => (
              <li key={m.id} className="mb-8 break-inside-avoid">
                <figure>
                  {link(
                    m,
                    i,
                    <img
                      src={m.src}
                      srcSet={m.srcSet}
                      sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw"
                      width={m.w}
                      height={m.h}
                      alt={m.alt}
                      data-fallback={m.fallback}
                      loading="lazy"
                      decoding="async"
                      className="photo h-auto w-full bg-surface"
                    />,
                  )}
                  <figcaption className="mt-2 text-[13px] leading-snug text-muted" data-pagefind-ignore>
                    <span className="font-medium text-ink">{m.side}.</span> <Credit c={m.credit} />.
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </>
      )}

      <dialog
        ref={dialog}
        aria-label="Photo viewer"
        className="gallery-dialog m-0 h-dvh max-h-none w-screen max-w-none overscroll-contain bg-[#07090f] p-0 text-[#ece4d4] backdrop:bg-black/80"
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      >
        {it && (
          <div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto_auto]">
            <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-8">
              <p className="text-sm text-[#b9b3a6]" aria-live="polite">
                {at + 1} of {n}
                <span className="ml-3 font-display text-base text-[#ece4d4]">{it.side}</span>
              </p>
              <button type="button" onClick={() => dialog.current?.close()} className="press -mr-2 p-2 hover:text-[#f08068]">
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
              <button type="button" onClick={() => go(-1)} className="press absolute left-1 top-1/2 hidden -translate-y-1/2 p-3 hover:text-[#f08068] md:block">
                <CaretLeft size={30} aria-hidden />
                <span className="sr-only">Previous photo</span>
              </button>
              <button type="button" onClick={() => go(1)} className="press absolute right-1 top-1/2 hidden -translate-y-1/2 p-3 hover:text-[#f08068] md:block">
                <CaretRight size={30} aria-hidden />
                <span className="sr-only">Next photo</span>
              </button>
            </div>
            <div className="flex items-start justify-between gap-4 px-4 pb-4 md:px-8">
              <p className="max-w-[80ch] text-sm leading-snug">
                {it.alt} <span className="text-[#b9b3a6] [&_a]:decoration-[#6b675e]"><Credit c={it.credit} />.</span>
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
            {/* A filmstrip to jump straight to any photograph. */}
            <ol className="hidden gap-2 overflow-x-auto px-4 pb-5 md:flex md:px-8" aria-label="All photographs">
              {items.map((m, i) => (
                <li key={m.id} className="shrink-0">
                  <button type="button" onClick={() => setAt(i)} aria-current={i === at ? "true" : undefined} className={`block h-14 overflow-hidden outline-offset-2 ${i === at ? "ring-2 ring-[#e0573f]" : "opacity-55 hover:opacity-100"}`}>
                    <img src={m.thumb} alt="" width={m.w} height={m.h} loading="lazy" className="h-full w-auto object-cover" />
                    <span className="sr-only">{`Photo ${i + 1}: ${m.side}`}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </dialog>
    </>
  );
}
