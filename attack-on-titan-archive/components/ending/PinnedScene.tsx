"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { reducedMotionStore } from "@/lib/animation/tokens";
import { asset, cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type Beat = { at: number; until: number; text: string; kicker?: string; big?: boolean };
type Pose = { s: number; x?: number; y?: number };
export type Shot = {
  src: string;
  alt?: string;
  /** progress where it fades in and out (0..1 of the pinned scroll) */
  at: number;
  until: number;
  /** the slow camera move: scale and offset (% of the frame) at `at` and at `until` */
  from: Pose;
  to: Pose;
  position?: string;
  /** a small source (a supplied frame): shown as a framed print, not full-bleed */
  framed?: boolean;
  /** portrait art: its full height, sides feathered into the dark on wide screens */
  contain?: boolean;
};

/**
 * A pinned, scroll-scrubbed scene cut from real images, with text beats.
 * Every move is a transform or an opacity on an <img>, so it composites on
 * the GPU and never waits for the main thread (no WebGL, no canvas). JS off
 * and reduced motion get the same images as a captioned sequence.
 */
export default function PinnedScene({
  label,
  beats,
  shots,
  height = "h-[700vh]",
  hud,
  overlay,
  credit,
}: {
  label: string;
  beats: Beat[];
  shots: Shot[];
  height?: string;
  /** lines for a HUD, recomputed from progress on every scroll update (no React state) */
  hud?: (p: number) => string[];
  /** anything drawn over the shots (stars, motes): must animate transform/opacity only */
  overlay?: React.ReactNode;
  credit?: string;
}) {
  const anchor = `scene-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  const mode = useSyncExternalStore(
    reducedMotionStore.subscribe,
    () => (reducedMotionStore.getSnapshot() ? "still" : "film"),
    () => "still" as const,
  );
  const hostRef = useRef<HTMLElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (mode !== "film" || !hostRef.current) return;
      // the surreal scenes have no interface: the site's navigation fades while one is pinned
      // (it comes back on keyboard focus, and as soon as the scene is scrolled past)
      ScrollTrigger.create({
        trigger: hostRef.current,
        start: "top top",
        end: "bottom bottom",
        onToggle: (self) => document.documentElement.classList.toggle("nav-hidden", self.isActive),
      });
      const q = gsap.utils.selector(hostRef);
      gsap.set(q("[data-beat]"), { autoAlpha: 0, y: 10 });
      const drawHud = (p: number) => {
        if (!hud || !hudRef.current) return;
        const lines = hud(p);
        hudRef.current.style.opacity = lines.length ? "1" : "0";
        hudRef.current.replaceChildren(...lines.map((l) => Object.assign(document.createElement("p"), { textContent: l })));
      };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hostRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (self) => drawHud(self.progress),
        },
      });
      drawHud(0);
      shots.forEach((s, i) => {
        const el = q(`[data-shot='${i}']`);
        gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, scale: s.from.s, xPercent: s.from.x ?? 0, yPercent: s.from.y ?? 0 });
        tl.to(el, { scale: s.to.s, xPercent: s.to.x ?? 0, yPercent: s.to.y ?? 0, duration: s.until - s.at, ease: "sine.inOut" }, s.at);
        if (i > 0) tl.to(el, { autoAlpha: 1, duration: 0.035 }, s.at);
        if (s.until < 1) tl.to(el, { autoAlpha: 0, duration: 0.035 }, s.until - 0.02);
      });
      beats.forEach((b, i) => {
        tl.to(q(`[data-beat='${i}']`), { autoAlpha: 1, y: 0, duration: 0.02 }, b.at);
        if (b.until < 1) tl.to(q(`[data-beat='${i}']`), { autoAlpha: 0, duration: 0.02 }, b.until);
      });
      tl.to({}, { duration: 0.001 }, 0.999);
    },
    { dependencies: [mode], scope: hostRef },
  );
  // never leave the navigation hidden when the scene unmounts
  useEffect(() => () => document.documentElement.classList.remove("nav-hidden"), []);

  const beatText = (b: Beat) => (
    <>
      {b.kicker && <span className="mb-2 block font-mono text-meta tracking-[0.24em] text-paper/65 not-italic uppercase">{b.kicker}</span>}
      {b.text}
    </>
  );

  if (mode !== "film")
    return (
      <section id={anchor} aria-label={label} className="scroll-mt-[var(--nav-h)] bg-void px-4 py-20 md:px-8 md:py-28">
        <ol className="mx-auto grid max-w-[1400px] gap-x-6 gap-y-14 md:grid-cols-2">
          {shots.map((s, k) => (
            <li key={s.src + k} className={cn(k === 0 && "md:col-span-2")}>
              <img src={asset(s.src)} alt={s.alt ?? ""} loading="lazy" className={cn("w-full", s.framed ? "mx-auto max-w-[520px] border border-paper/20" : "aspect-[16/10] object-cover")} style={{ objectPosition: s.position }} />
              {beats
                .filter((b) => b.at >= s.at && b.at < s.until)
                .map((b) => (
                  <p key={b.text} className={cn("mt-3", b.big ? "font-display text-h3 font-bold text-paper uppercase" : "max-w-[48ch] font-serif text-lede text-paper/90 italic")}>
                    {beatText(b)}
                  </p>
                ))}
            </li>
          ))}
        </ol>
        {credit && <p className="mx-auto mt-12 max-w-[1400px] font-mono text-meta text-ash/80">{credit}</p>}
      </section>
    );

  return (
    <section ref={hostRef} id={anchor} aria-label={label} className={cn("relative bg-void", height)}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {shots.map((s, i) =>
          s.framed ? (
            <div key={i} data-shot={i} className="absolute inset-0 flex items-center justify-center will-change-transform">
              <img src={asset(s.src)} alt={s.alt ?? ""} className="max-h-[62dvh] w-auto max-w-[min(78vw,560px)] border border-paper/20 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]" />
            </div>
          ) : (
            <img
              key={i}
              data-shot={i}
              src={asset(s.src)}
              alt={s.alt ?? ""}
              loading={i === 0 ? "eager" : "lazy"}
              className={cn(
                "absolute inset-0 size-full object-cover will-change-transform",
                s.contain && "md:object-contain md:[mask-image:linear-gradient(90deg,transparent_calc(50%-28dvh),#000_calc(50%-17dvh),#000_calc(50%+17dvh),transparent_calc(50%+28dvh))]",
              )}
              style={{ objectPosition: s.position }}
            />
          ),
        )}
        {overlay}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(3,3,3,0.7)_100%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[45vh] bg-[linear-gradient(0deg,rgba(5,5,5,0.85),transparent)]" />
        {hud && (
          <div
            ref={hudRef}
            aria-hidden
            className="pointer-events-none absolute top-[calc(var(--nav-h)+1rem)] left-4 grid gap-1 font-mono text-meta tracking-[0.16em] text-paper/80 uppercase transition-opacity duration-500 md:left-8"
          />
        )}
        {beats.map((b, i) => (
          <div
            key={b.text}
            className={cn("pointer-events-none absolute inset-x-0 px-4 md:px-8", b.big ? "top-1/2 -translate-y-1/2" : "bottom-0 pb-16 md:pb-14")}
          >
            <div className="mx-auto max-w-[1400px]">
              <p
                data-beat={i}
                className={cn(
                  "[text-shadow:0_1px_20px_rgba(0,0,0,0.95)]",
                  b.big
                    ? "text-center font-display text-[clamp(2.4rem,1rem+7vw,7rem)] leading-none font-bold tracking-[0.04em] text-paper uppercase"
                    : "max-w-[40ch] font-serif text-h3 leading-snug text-paper italic",
                )}
              >
                {beatText(b)}
              </p>
            </div>
          </div>
        ))}
        {credit && <p className="absolute right-4 bottom-3 max-w-[70ch] text-right font-mono text-meta text-ash/70 md:right-8">{credit}</p>}
      </div>
    </section>
  );
}
