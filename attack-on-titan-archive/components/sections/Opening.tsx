"use client";

import { useRef, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { reducedMotionStore } from "@/lib/animation/tokens";
import { BG, FRAMES, FRAME_CREDIT } from "@/lib/data/backgrounds";
import { sound } from "@/lib/audio/engine";
import { asset } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
 * The opening, as a short film cut from real images rather than a rendered
 * scene, all anime frames: Shiganshina from above, the district seen from the
 * top of Wall Maria, a lightning flash, then the Colossal Titan over the Wall. Every move is a transform or an
 * opacity on a few images, scrubbed by scroll, so it runs on the compositor
 * and never drops a frame to the main thread. Facts in the lines are the
 * verified ones: Walls 50 m, the Colossal Titan 60 m, the outer gate kicked in.
 */

const PLACE = ["845", "Shiganshina District", "Wall Maria"];

const BEATS: { at: number; out: number; text: string; alert?: boolean; big?: boolean }[] = [
  { at: 0.1, out: 0.2, text: "For a hundred years, humanity lived behind three Walls.", big: true },
  { at: 0.25, out: 0.37, text: "They stood fifty metres high. Nothing had ever come over them." },
  { at: 0.46, out: 0.54, text: "Lightning, beyond the Wall." },
  { at: 0.54, out: 0.595, text: "Steam rose past its top. The thing in it stood sixty metres." },
  { at: 0.63, out: 0.69, text: "The outer gate is gone.", alert: true },
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

const ChaptersLink = ({ className = "" }: { className?: string }) => (
  <a
    href="#index"
    className={`press inline-flex items-center gap-3 border border-paper/50 bg-base/60 px-5 py-3 font-military text-[1rem] tracking-[0.18em] text-paper uppercase hover:border-paper hover:bg-paper hover:text-ink ${className}`}
  >
    Open the chapters <span aria-hidden>&darr;</span>
  </a>
);

/** JS off, before hydration, and reduced motion: the frame of the Colossal
 * Titan over the Wall, with every line readable, and nothing moving. */
function StaticOpening() {
  return (
    <section aria-labelledby="opening-title" className="relative flex min-h-[100dvh] items-end overflow-hidden px-4 pt-[var(--nav-h)] pb-16 md:px-8 md:pb-20">
      <img
        src={asset(FRAMES.colossal)}
        alt="The Colossal Titan's face over the top of the Wall, steam pouring off it, a soldier in flight beside it."
        width={1920}
        height={1079}
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover object-[28%_30%]"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-base via-base/45 to-base/20" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_90%,rgba(11,12,10,0.85),transparent_60%)]" />
      <div className="rise relative mx-auto w-full max-w-[1400px]">
        <p className="font-mono text-meta tracking-[0.16em] text-paper/75 uppercase sm:tracking-[0.3em]">{PLACE.join(" / ")}</p>
        <div className="mt-6">
          <Title id="opening-title" />
        </div>
        <ChaptersLink className="mt-10" />
      </div>
      <p className="absolute right-4 bottom-3 max-w-[60ch] text-right font-mono text-meta text-ash/80 md:right-8">Frame: {FRAME_CREDIT}.</p>
    </section>
  );
}

export default function Opening() {
  // "static" on the server and before hydration (readable with JS off) and
  // under reduced motion; "film" otherwise
  const mode = useSyncExternalStore(
    reducedMotionStore.subscribe,
    () => (reducedMotionStore.getSnapshot() ? "static" : "film"),
    () => "static" as const,
  );
  const hostRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const last = useRef(0);

  useGSAP(
    () => {
      if (mode !== "film" || !hostRef.current) return;
      const q = gsap.utils.selector(hostRef);
      const portrait = window.innerHeight > window.innerWidth;

      gsap.set(q("[data-beat]"), { autoAlpha: 0, y: 14 });
      gsap.set(q("[data-title] > *"), { autoAlpha: 0, y: 30 });
      gsap.set(q("[data-shot='rampart'], [data-shot='colossal']"), { autoAlpha: 0 });
      gsap.set(q("[data-shot='city']"), { scale: 1.45, xPercent: portrait ? 8 : 4, yPercent: 4 });
      gsap.set(q("[data-shot='rampart']"), { scale: 1.05 });
      // the Colossal frame opens tight on the steam over the Wall's top, above the face
      gsap.set(q("[data-shot='colossal']"), portrait ? { scale: 1.3, xPercent: -22, yPercent: 6 } : { scale: 1.75, xPercent: -38, yPercent: 14 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hostRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.9,
          onUpdate: (self) => {
            const p = self.progress;
            const prev = last.current;
            if (prev < 0.45 && p >= 0.45) sound.cue("arrival");
            if (prev < 0.63 && p >= 0.63) sound.cue("breach");
            last.current = p;
            if (railRef.current) railRef.current.style.transform = `scaleY(${p})`;
          },
        },
      });

      // shot 1: the city from above, gliding down and in
      tl.to(q("[data-shot='city']"), { scale: 1.12, xPercent: 0, yPercent: -2, duration: 0.3 }, 0);
      tl.to(q("[data-place]"), { autoAlpha: 0, y: -14, duration: 0.04 }, 0.07);
      // shot 2: from the top of the Wall, a slow push over the district
      tl.to(q("[data-shot='rampart']"), { autoAlpha: 1, duration: 0.05 }, 0.2);
      tl.to(q("[data-shot='city']"), { autoAlpha: 0, duration: 0.03 }, 0.25);
      tl.to(q("[data-shot='rampart']"), { scale: 1.32, xPercent: -6, yPercent: 3, duration: 0.24 }, 0.2);
      // lightning: a white flash, the rampart gone, black
      tl.to(q("[data-flash]"), { autoAlpha: 0.95, duration: 0.008 }, 0.43)
        .to(q("[data-flash]"), { autoAlpha: 0, duration: 0.03 }, 0.438)
        .to(q("[data-flash]"), { autoAlpha: 0.6, duration: 0.006 }, 0.47)
        .to(q("[data-flash]"), { autoAlpha: 0, duration: 0.025 }, 0.476);
      tl.to(q("[data-shot='rampart']"), { autoAlpha: 0, duration: 0.01 }, 0.438);
      // shot 3: the Colossal Titan. Up out of the steam, down onto the face
      tl.to(q("[data-shot='colossal']"), { autoAlpha: 1, duration: 0.04 }, 0.47);
      tl.to(q("[data-shot='colossal']"), { scale: portrait ? 1.04 : 1.22, xPercent: portrait ? 6 : 4, yPercent: 2, duration: 0.17, ease: "power1.inOut" }, 0.47);
      // the kick: a short shake and a red pulse
      const shake = q("[data-shake]");
      [3, -4, 3, -2, 1, 0].forEach((x, i) => tl.to(shake, { x: x * 6, y: (i % 2 ? -1 : 1) * x * 3, duration: 0.004 }, 0.63 + i * 0.004));
      tl.to(q("[data-red]"), { autoAlpha: 0.35, duration: 0.006 }, 0.63).to(q("[data-red]"), { autoAlpha: 0, duration: 0.05 }, 0.636);
      // the title, over the darkened frame
      tl.to(q("[data-shot='colossal']"), { scale: portrait ? 1 : 1.08, xPercent: portrait ? 6 : 0, duration: 0.2 }, 0.68);
      tl.to(q("[data-dim]"), { autoAlpha: 1, duration: 0.05 }, 0.69);
      tl.to(q("[data-title] > *"), { autoAlpha: 1, y: 0, duration: 0.04, stagger: 0.012 }, 0.71);
      // out to black, down into the index
      tl.to(q("[data-title] > *"), { autoAlpha: 0, y: -16, duration: 0.04 }, 0.88);
      tl.to(q("[data-shot='colossal']"), { autoAlpha: 0, duration: 0.06 }, 0.9);

      BEATS.forEach((b, i) => {
        tl.to(q(`[data-beat='${i}']`), { autoAlpha: 1, y: 0, duration: 0.025 }, b.at).to(q(`[data-beat='${i}']`), { autoAlpha: 0, y: -10, duration: 0.025 }, b.out);
      });
      tl.to({}, { duration: 0.001 }, 0.999); // pin the timeline length to 1
    },
    { dependencies: [mode], scope: hostRef },
  );

  if (mode === "static") return <StaticOpening />;

  const shot = "absolute inset-0 size-full object-cover will-change-transform";
  return (
    <section ref={hostRef} aria-labelledby="opening-title" className="relative h-[520vh] bg-void">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <div data-shake className="absolute inset-[-3%]">
          <img data-shot="city" src={asset(BG.shiganshina.src)} alt="" fetchPriority="high" className={shot} />
          <img data-shot="rampart" src={asset(BG.wallTop.src)} alt="" className={`${shot} object-[50%_50%]`} />
          <img
            data-shot="colossal"
            src={asset(FRAMES.colossal)}
            alt="The Colossal Titan's face over the top of the Wall, steam pouring off it, a soldier in flight beside it."
            className={`${shot} origin-[30%_35%] object-[28%_30%]`}
          />
        </div>
        {/* grade and frame: a vignette, letterbox bars, the dim under the title */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(11,12,10,0.75)_100%)]" />
        {/* a low scrim, so the narration reads over any frame */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[45vh] bg-[linear-gradient(0deg,rgba(11,12,10,0.85),transparent)]" />
        <div data-dim aria-hidden className="pointer-events-none invisible absolute inset-0 bg-[linear-gradient(0deg,rgba(11,12,10,0.92),rgba(11,12,10,0.35)_55%,rgba(11,12,10,0.2))] opacity-0" />
        <div data-red aria-hidden className="pointer-events-none invisible absolute inset-0 bg-blood opacity-0" />
        <div data-flash aria-hidden className="pointer-events-none invisible absolute inset-0 bg-[#f4f1e6] opacity-0" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[7vh] bg-void" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[7vh] bg-void" />

        {/* 845 / place / wall: on screen from the first frame */}
        <div data-place className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center [text-shadow:0_2px_30px_rgba(11,12,10,0.9)]">
          {PLACE.map((m, i) => (
            <p
              key={m}
              className={
                i === 0
                  ? "font-display text-h1 leading-none font-semibold text-paper"
                  : "font-military text-lede font-medium tracking-[0.45em] text-paper uppercase"
              }
            >
              {m}
            </p>
          ))}
        </div>

        {/* the narration */}
        {BEATS.map((b, i) => (
          <p
            key={b.text}
            data-beat={i}
            className={`absolute inset-x-0 bottom-[16vh] mx-auto max-w-[30ch] px-6 text-center [text-shadow:0_2px_24px_rgba(11,12,10,0.95)] ${
              b.big ? "font-display text-h2 leading-tight text-paper" : b.alert ? "font-military text-h3 font-semibold tracking-[0.2em] text-paper uppercase" : "font-serif text-h3 leading-snug text-paper italic"
            }`}
          >
            {b.text}
          </p>
        ))}

        <div data-title className="absolute inset-x-0 bottom-[9vh] mx-auto flex max-w-[1400px] flex-col items-start px-4 md:px-8">
          <Title id="opening-title" />
        </div>

        <a
          href="#index"
          className="press absolute top-[calc(7vh+0.75rem)] right-4 border md:top-auto md:bottom-[calc(7vh+0.75rem)] border-paper/30 bg-base/60 px-4 py-2.5 font-military text-[0.9rem] tracking-[0.18em] text-paper/90 uppercase hover:border-paper/70 hover:text-paper md:right-8"
        >
          Skip to the chapters
        </a>

        {/* where the reader is in the film */}
        <span aria-hidden className="absolute top-[calc(7vh+4rem)] right-4 bottom-[calc(7vh+1rem)] w-px md:top-[calc(var(--nav-h)+1.25rem)] md:bottom-[calc(7vh+4rem)] bg-paper/15 md:right-8">
          <span ref={railRef} className="block h-full w-full origin-top scale-y-0 bg-paper/70" />
        </span>
        <p className="absolute bottom-[1.5vh] left-4 max-w-[90vw] truncate font-mono text-meta text-ash/70 md:left-8">
          Frames: {FRAME_CREDIT}.
        </p>
      </div>
    </section>
  );
}
