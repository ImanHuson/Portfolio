"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { reducedMotionStore } from "@/lib/animation/tokens";
import { asset, cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Beat = { at: number; until: number; text: string; big?: boolean };

/**
 * A pinned, scroll-scrubbed scene with text beats. Progress goes to the
 * scene through a ref. JS off and reduced motion get stills rendered from
 * the same scene, each with its lines.
 */
export default function PinnedScene({
  label,
  beats,
  Scene,
  stills,
  height = "h-[800vh]",
  hud,
}: {
  label: string;
  beats: Beat[];
  Scene: React.ComponentType<{ progress: React.RefObject<number>; className?: string; onTooSlow?: () => void }>;
  stills: { src: string; beats: number[] }[];
  height?: string;
  /** lines for a HUD, recomputed from progress on every scroll update (no React state) */
  hud?: (p: number) => string[];
}) {
  const anchor = `scene-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  const mode = useSyncExternalStore(
    reducedMotionStore.subscribe,
    () => (reducedMotionStore.getSnapshot() ? "still" : "cinematic"),
    () => "static" as const,
  );
  const hostRef = useRef<HTMLElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  // a device too slow for the live scene gets the stills instead, kept in place
  const [tooSlow, setTooSlow] = useState(false);
  const onTooSlow = useCallback(() => setTooSlow(true), []);
  useEffect(() => {
    if (!tooSlow) return;
    document.documentElement.classList.remove("nav-hidden");
    document.getElementById(anchor)?.scrollIntoView({ block: "start" });
  }, [tooSlow, anchor]);

  useGSAP(
    () => {
      if (mode !== "cinematic" || tooSlow || !hostRef.current) return;
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
          scrub: 0.5,
          onUpdate: (self) => {
            progress.current = self.progress;
            drawHud(self.progress);
          },
        },
      });
      drawHud(0);
      beats.forEach((b, i) => {
        tl.to(q(`[data-beat='${i}']`), { autoAlpha: 1, y: 0, duration: 0.02 }, b.at);
        if (b.until < 1) tl.to(q(`[data-beat='${i}']`), { autoAlpha: 0, duration: 0.02 }, b.until);
      });
      tl.to({}, { duration: 0.01 }, 0.99);
    },
    { dependencies: [mode, tooSlow], scope: hostRef },
  );
  // never leave the navigation hidden when the scene unmounts
  useEffect(() => () => document.documentElement.classList.remove("nav-hidden"), []);

  if (mode !== "cinematic" || tooSlow)
    return (
      <section id={anchor} aria-label={label} className="scroll-mt-[var(--nav-h)] bg-void px-4 py-20 md:px-8 md:py-28">
        <ol className="mx-auto grid max-w-[1400px] gap-x-6 gap-y-14 md:grid-cols-2">
          {stills.map((f, k) => (
            <li key={f.src} className={cn(k === 0 && "md:col-span-2")}>
              <img src={asset(f.src)} alt="" width={1600} height={1000} loading="lazy" className="w-full" />
              {f.beats.map((i) => (
                <p key={i} className={cn("mt-3", beats[i].big ? "font-display text-h3 font-bold text-paper uppercase" : "font-serif text-lede text-paper/90 italic")}>
                  {beats[i].text}
                </p>
              ))}
            </li>
          ))}
        </ol>
      </section>
    );

  return (
    <section ref={hostRef} id={anchor} aria-label={label} className={cn("relative bg-void", height)}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <Scene progress={progress} onTooSlow={onTooSlow} className="absolute inset-0" />
        {hud && (
          <div
            ref={hudRef}
            aria-hidden
            className="pointer-events-none absolute top-[calc(var(--nav-h)+1rem)] left-4 grid gap-1 font-mono text-[0.72rem] tracking-[0.16em] text-paper/75 uppercase transition-opacity duration-500 md:left-8"
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
                    : "max-w-[40ch] font-serif text-lede leading-snug text-paper/90 italic",
                )}
              >
                {b.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
