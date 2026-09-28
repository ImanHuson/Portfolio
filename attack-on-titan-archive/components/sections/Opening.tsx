"use client";

import { useRef, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { reducedMotionStore } from "@/lib/animation/tokens";
import { getLenis } from "@/components/providers/SmoothScroll";
import { altitudeAt } from "@/components/three/choreography";
import { sound } from "@/lib/audio/engine";
import { asset } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// WebGL is code-split: nothing about ogl ships until the opening mounts.
const WallShot = dynamic(() => import("@/components/three/WallShot"), { ssr: false });

const PLACE = ["845", "Shiganshina District", "Wall Maria"];

// Field report lines, typed in as the shot unfolds. Only verifiable facts:
// the Walls are 50 m, the Colossal Titan 60 m, a shifter transforms in a
// lightning strike, the outer gate was breached.
const LOG = [
  { at: 0.405, text: "Lightning strike south of the Wall." },
  { at: 0.43, text: "A shadow across the district. Steam beyond the Wall." },
  { at: 0.56, text: "Height estimated at 60 m. The Wall stands 50 m." },
  { at: 0.617, text: "Outer gate destroyed.", alert: true },
];

function Title({ id }: { id?: string }) {
  return (
    <>
      <h1 id={id} className="font-display text-colossal leading-[0.86] font-extrabold tracking-[-0.02em] text-paper uppercase">
        Attack on Titan
      </h1>
      <p className="mt-3 font-military text-h3 font-semibold tracking-[0.5em] text-paper/85 uppercase">The Archive</p>
      <div className="mt-8 max-w-[34ch] font-serif text-lede leading-snug text-paper/90 italic">
        <p>Humanity lived behind the Walls for one hundred years.</p>
        <p className="mt-1">It took one day to destroy the illusion.</p>
      </div>
    </>
  );
}

/** What renders with JS off, before hydration, and under reduced motion:
 * the composed frame of the Titan at the Wall, with every line readable. */
function StaticOpening() {
  return (
    <section aria-labelledby="opening-title" className="relative flex min-h-[100dvh] items-end overflow-hidden px-4 pt-[var(--nav-h)] pb-16 md:px-8 md:pb-20">
      {/* a real frame of the scene, rendered from it: the Titan's head over the Wall */}
      <picture>
        <source media="(max-aspect-ratio: 4/5)" srcSet={asset("/images/opening-845-portrait.webp")} />
        <img
          src={asset("/images/opening-845.webp")}
          alt=""
          width={1680}
          height={1050}
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover object-[70%_50%]"
        />
      </picture>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-base via-base/25 to-base/40" />
      <div className="relative mx-auto w-full max-w-[1400px]">
        <p className="font-mono text-meta tracking-[0.3em] text-paper/70 uppercase">{PLACE.join("   /   ")}</p>
        <div className="mt-6">
          <Title id="opening-title" />
        </div>
        <a
          href="#index"
          className="mt-10 inline-block border-b border-paper/60 pb-1 font-military text-[0.95rem] tracking-[0.3em] text-paper uppercase transition-colors hover:border-paper"
        >
          Open the archive
        </a>
      </div>
    </section>
  );
}

export default function Opening() {
  // "static" on the server and before hydration (readable with JS off);
  // "still" under reduced motion; "cinematic" otherwise.
  const mode = useSyncExternalStore(
    reducedMotionStore.subscribe,
    () => (reducedMotionStore.getSnapshot() ? "still" : "cinematic"),
    () => "static" as const,
  );
  const hostRef = useRef<HTMLElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);
  const progress = useRef(0);
  const last = useRef(0);

  useGSAP(
    () => {
      if (mode !== "cinematic" || !hostRef.current) return;
      const q = gsap.utils.selector(hostRef);
      gsap.set(q("[data-beat]"), { autoAlpha: 0, y: 12 });
      gsap.set(q("[data-title] > *"), { autoAlpha: 0, y: 30 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hostRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            const prev = last.current;
            if (prev < 0.403 && p >= 0.403) sound.cue("arrival");
            if (prev < 0.616 && p >= 0.616) sound.cue("breach");
            last.current = p;
            progress.current = p;
            if (altRef.current) altRef.current.textContent = String(altitudeAt(p)).padStart(3, "0");
          },
        },
      });

      // 845 / Shiganshina District / Wall Maria, one at a time, on black
      q("[data-place]").forEach((el, i) => {
        tl.to(el, { autoAlpha: 1, y: 0, duration: 0.02 }, 0.004 + i * 0.022);
      });
      tl.to(q("[data-place]"), { autoAlpha: 0, duration: 0.03 }, 0.2);
      tl.to(q("[data-hud]"), { autoAlpha: 1, y: 0, duration: 0.03 }, 0.1).to(q("[data-hud]"), { autoAlpha: 0, duration: 0.02 }, 0.74);

      // the field report
      LOG.forEach((l, i) => {
        tl.to(q(`[data-log='${i}']`), { autoAlpha: 1, y: 0, duration: 0.012 }, l.at);
      });
      tl.to(q("[data-log]"), { autoAlpha: 0, duration: 0.02 }, 0.64);

      // title
      tl.to(q("[data-title] > *"), { autoAlpha: 1, y: 0, duration: 0.03, stagger: 0.012 }, 0.655);
      tl.to(q("[data-title] > *"), { autoAlpha: 0, y: -16, duration: 0.025 }, 0.725);

      // inside the Wall
      tl.to(q("[data-inside]"), { autoAlpha: 1, y: 0, duration: 0.02 }, 0.8).to(q("[data-inside]"), { autoAlpha: 0, duration: 0.02 }, 0.852);

      tl.to({}, { duration: 0.01 }, 0.99); // pin the timeline length to 1
    },
    { dependencies: [mode], scope: hostRef },
  );

  if (mode === "static") return <StaticOpening />;

  if (mode === "still")
    return (
      <section aria-labelledby="opening-title" className="relative flex min-h-[100dvh] items-end overflow-hidden px-4 pt-[var(--nav-h)] pb-16 md:px-8 md:pb-20">
        <WallShot still stillAt={0.705} className="absolute inset-0" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-base via-base/10 to-base/30" />
        <div className="relative mx-auto w-full max-w-[1400px]">
          <p className="font-mono text-meta tracking-[0.3em] text-paper/70 uppercase">{PLACE.join("   /   ")}</p>
          <div className="mt-6">
            <Title id="opening-title" />
          </div>
          <a href="#index" className="mt-10 inline-block border-b border-paper/60 pb-1 font-military text-[0.95rem] tracking-[0.3em] text-paper uppercase">
            Open the archive
          </a>
        </div>
      </section>
    );

  return (
    <section ref={hostRef} aria-labelledby="opening-title" className="relative h-[1000vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <WallShot progress={progress} className="absolute inset-0" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(11,12,10,0.7)_100%)]" />

        {/* 845 / place / wall */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center">
          {PLACE.map((m, i) => (
            <p
              key={m}
              data-beat
              data-place
              className={
                i === 0
                  ? "font-display text-h1 leading-none font-semibold text-paper"
                  : "font-military text-lede font-medium tracking-[0.45em] text-paper/85 uppercase"
              }
            >
              {m}
            </p>
          ))}
        </div>

        {/* altitude: the only HUD, because the camera's height is the story of the first minute */}
        <p data-beat data-hud className="absolute top-[calc(var(--nav-h)+1.25rem)] left-4 font-mono text-meta tracking-[0.2em] text-paper/70 uppercase md:left-8">
          Alt <span ref={altRef}>031</span> m
        </p>

        {/* field report */}
        <ol aria-label="Field report" className="absolute bottom-24 left-4 flex max-w-[36ch] flex-col gap-2 font-mono text-[0.8rem] leading-snug md:bottom-12 md:left-8">
          {LOG.map((l, i) => (
            <li key={l.text} data-beat data-log={i} className={l.alert ? "text-[#e4a49b]" : "text-paper/85"}>
              <span className="mr-2 text-paper/50">OBS {String(i + 1).padStart(2, "0")}</span>
              {l.text}
            </li>
          ))}
        </ol>

        {/* title, over a scrim so the lines read against stone */}
        <div data-title className="isolate absolute inset-x-0 bottom-0 mx-auto flex max-w-[1400px] flex-col items-start px-4 pb-20 md:px-8 md:pb-16">
          <div aria-hidden className="pointer-events-none absolute -inset-x-[20vw] -top-24 bottom-0 -z-10 bg-[radial-gradient(ellipse_at_15%_85%,rgba(11,12,10,0.85),transparent_62%)]" />
          <Title id="opening-title" />
        </div>

        <p
          data-beat
          data-inside
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center font-display text-h2 leading-tight font-semibold text-paths uppercase"
        >
          The Walls were never what they seemed.
        </p>

        <a
          href="#index"
          onClick={(e) => {
            const lenis = getLenis();
            if (!lenis) return;
            e.preventDefault();
            lenis.scrollTo("#index", { immediate: true });
          }}
          className="absolute right-4 bottom-5 py-1.5 font-mono text-meta tracking-[0.2em] text-paper/60 uppercase transition-colors hover:text-paper focus-visible:text-paper md:right-8 md:bottom-8"
        >
          Skip the opening
        </a>
      </div>
    </section>
  );
}
