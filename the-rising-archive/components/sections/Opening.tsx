"use client";

import { useRef, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { reducedMotionStore } from "@/lib/clearanceStore";
import { useArchive } from "@/components/providers/ArchiveProvider";
import { getLenis } from "@/components/providers/SmoothScroll";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// WebGL is code-split: nothing about ogl ships until the opening mounts.
const MarsDescent = dynamic(() => import("@/components/three/MarsDescent"), { ssr: false });

const META = ["736 PCE", "Mars", "Lykos"];

/** CSS-only planet: what renders with JS off, before WebGL boots, or if
 * WebGL is unavailable. Never blank. */
function CssPlanet({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none rounded-full ${className}`}
      style={{
        background:
          "radial-gradient(circle at 34% 32%, #b8633a 0%, #7a2b14 34%, #3b1109 62%, #0d0605 78%, transparent 79%)",
        boxShadow: "0 0 90px 10px rgba(181,69,42,0.18)",
      }}
    />
  );
}

function StaticOpening() {
  return (
    <section
      aria-labelledby="opening-title"
      className="relative flex min-h-[100dvh] items-center overflow-hidden px-5 pt-[var(--nav-h)] md:px-8"
    >
      <div className="absolute inset-0">
        <CssPlanet className="absolute top-1/2 right-[-18vw] size-[88vw] -translate-y-1/2 md:right-[-6vw] md:size-[62vw] md:max-w-[900px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/80 to-transparent" />
      </div>
      <div className="relative mx-auto w-full max-w-[1400px]">
        <p className="font-mono text-meta tracking-[0.3em] text-ash uppercase">
          {META.join("   /   ")}
        </p>
        <blockquote className="mt-8 max-w-[22ch] font-serif text-h3 leading-tight text-bone italic">
          <p>I would have lived in peace.</p>
          <p>But my enemies brought me war.</p>
          <footer className="mt-3 font-mono text-meta tracking-[0.18em] text-ash-2 not-italic uppercase">
            Darrow, the opening line of Red Rising
          </footer>
        </blockquote>
        <h1 id="opening-title" className="mt-12 font-display text-h1 leading-[0.85] font-extrabold tracking-tight uppercase">
          Red Rising
          <span className="block text-[0.42em] font-semibold tracking-[0.12em] text-red">The Archive</span>
        </h1>
        <a
          href="#live-for-more"
          className="mt-10 inline-flex items-center gap-3 border-b border-red pb-1 font-mono text-meta tracking-[0.22em] uppercase transition-colors hover:text-red"
        >
          Enter the world
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
  const progress = useRef(0);
  const last = useRef(0);
  const { cue } = useArchive();

  useGSAP(
    () => {
      if (mode !== "cinematic" || !hostRef.current) return;
      const q = gsap.utils.selector(hostRef);
      gsap.set(q("[data-beat]"), { autoAlpha: 0, y: 14 });
      gsap.set(q("[data-title] > *"), { autoAlpha: 0, y: 40 });

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
            if (prev < 0.03 && p >= 0.03) cue("heartbeat");
            if (prev < 0.235 && p >= 0.235) cue("heartbeat");
            if (prev < 0.62 && p >= 0.62) cue("strike");
            last.current = p;
            progress.current = p;
          },
        },
      });

      // the scroll cue is the only thing on screen at rest; it leaves on the first scroll
      tl.to(q("[data-cue]"), { autoAlpha: 0, duration: 0.015 }, 0.002);
      // heartbeat pip
      tl.fromTo(q("[data-pip]"), { scale: 0.4, autoAlpha: 0 }, { scale: 1.6, autoAlpha: 1, duration: 0.02 }, 0.01)
        .to(q("[data-pip]"), { scale: 0.8, duration: 0.02 }, 0.03)
        .to(q("[data-pip]"), { autoAlpha: 0, duration: 0.02 }, 0.09);
      // 736 PCE / Mars / Lykos
      q("[data-meta]").forEach((el, i) => {
        tl.to(el, { autoAlpha: 1, y: 0, duration: 0.03 }, 0.05 + i * 0.03);
      });
      tl.to(q("[data-meta]"), { autoAlpha: 0, duration: 0.03 }, 0.17);
      // the two lines, one beat apart
      tl.to(q("[data-line='1']"), { autoAlpha: 1, y: 0, duration: 0.03 }, 0.18)
        .to(q("[data-line='2']"), { autoAlpha: 1, y: 0, duration: 0.03 }, 0.24)
        .to(q("[data-cite]"), { autoAlpha: 1, y: 0, duration: 0.02 }, 0.26)
        .to(q("[data-line], [data-cite]"), { autoAlpha: 0, y: -10, duration: 0.03 }, 0.3);
      // title
      tl.to(q("[data-title] > *"), { autoAlpha: 1, y: 0, duration: 0.05, stagger: 0.025 }, 0.87);
      tl.to({}, { duration: 0.01 }, 0.99); // pin the timeline length to 1
    },
    { dependencies: [mode], scope: hostRef },
  );

  // Reduced motion gets the same composed CSS frame as no-JS: no GPU work,
  // and the planet stays clear of the text.
  if (mode !== "cinematic") return <StaticOpening />;

  return (
    <section ref={hostRef} aria-labelledby="opening-title" className="relative h-[640vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <MarsDescent progress={progress} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,7,10,0.75)_100%)]" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <span data-pip aria-hidden className="absolute size-2 bg-red shadow-[0_0_24px_6px_rgba(196,30,42,0.45)]" />
          <p className="absolute flex flex-col gap-4 font-mono text-sm tracking-[0.5em] text-bone uppercase">
            {META.map((m) => (
              <span key={m} data-beat data-meta>
                {m}
              </span>
            ))}
          </p>
          <blockquote className="absolute max-w-[18ch] font-serif text-h2 leading-[1.1] text-bone italic">
            <p data-beat data-line="1">I would have lived in peace.</p>
            <p data-beat data-line="2" className="mt-2">But my enemies brought me war.</p>
            <footer data-beat data-cite className="mt-6 font-mono text-meta tracking-[0.22em] text-ash not-italic uppercase">
              Darrow, the opening line of Red Rising
            </footer>
          </blockquote>

          <div data-title className="absolute flex flex-col items-center">
            <h1 id="opening-title" className="font-display text-colossal leading-[0.8] font-extrabold tracking-tight uppercase">
              Red Rising
            </h1>
            <p className="mt-3 font-display text-h3 font-semibold tracking-[0.4em] text-red uppercase">The Archive</p>
            <a
              href="#live-for-more"
              onClick={(e) => {
                const lenis = getLenis();
                if (!lenis) return;
                e.preventDefault();
                lenis.scrollTo("#live-for-more", { duration: 1.6 });
              }}
              className="pointer-events-auto mt-10 inline-flex items-center gap-3 border-b border-red pb-1 font-mono text-meta tracking-[0.22em] uppercase transition-colors hover:text-red"
            >
              Enter the world
            </a>
          </div>
        </div>

        <p
          data-cue
          aria-hidden
          className="absolute bottom-16 left-1/2 -translate-x-1/2 font-mono text-meta tracking-[0.3em] text-ash uppercase md:bottom-8"
        >
          Scroll to descend
        </p>

        <a
          href="#live-for-more"
          onClick={(e) => {
            const lenis = getLenis();
            if (!lenis) return;
            e.preventDefault();
            lenis.scrollTo("#live-for-more", { immediate: true });
          }}
          className="absolute right-5 bottom-5 py-1.5 font-mono text-meta tracking-[0.2em] text-ash-2 uppercase transition-colors hover:text-bone focus-visible:text-bone md:right-8 md:bottom-8"
        >
          Skip the opening
        </a>
      </div>
    </section>
  );
}
