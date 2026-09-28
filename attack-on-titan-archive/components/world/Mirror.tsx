"use client";

import { useRef, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { reducedMotionStore } from "@/lib/animation/tokens";
import Sealed from "@/components/archive/Sealed";
import { MIRROR, type MirrorStage } from "@/lib/data/world";
import { asset } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const N = MIRROR.stages.length;
const CLOSE = ["Same world.", "Different side."];

function Side({ s, side }: { s: MirrorStage; side: "left" | "right" }) {
  const text = side === "left" ? s.left : s.right;
  const sealed = side === "left" ? s.leftSealed : s.rightSealed;
  // a fully sealed line shows only its seal
  if (sealed && text === "Sealed.")
    return (
      <Sealed label="Sealed" className="text-left">
        <p className="pt-1">{sealed}</p>
      </Sealed>
    );
  return (
    <>
      <p>{text}</p>
      {sealed && (
        <Sealed label="Sealed" className="mt-2 text-left">
          <p className="pt-1">{sealed}</p>
        </Sealed>
      )}
    </>
  );
}

function Portrait({ slug, className }: { slug: string; className?: string }) {
  return <img src={asset(`/images/personnel/${slug}.webp`)} alt="" width={800} height={900} className={className} />;
}

/** JS off and reduced motion: the same comparison as a two-column table. */
function StaticMirror() {
  return (
    <section aria-labelledby="mirror-title" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1200px]">
        <h2 id="mirror-title" className="text-center font-display text-h2 leading-tight font-bold text-paper">
          {MIRROR.left} <span className="text-ash-2">/</span> {MIRROR.right}
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-6">
          <Portrait slug={MIRROR.leftSlug} className="ml-auto h-40 w-auto object-contain md:h-56" />
          <Portrait slug={MIRROR.rightSlug} className="h-40 w-auto object-contain md:h-56" />
        </div>
        <dl className="mt-12 grid gap-0 border-t border-line">
          {MIRROR.stages.map((s) => (
            <div key={s.stage} className="grid grid-cols-2 gap-x-8 border-b border-line py-6 md:grid-cols-[1fr_9rem_1fr]">
              <dt className="col-span-2 mb-3 text-center font-mono text-meta tracking-[0.24em] text-ash uppercase md:col-span-1 md:col-start-2 md:row-start-1 md:mb-0 md:self-center">
                {s.stage}
              </dt>
              <dd className="text-right text-paper/85 md:col-start-1 md:row-start-1">
                <Side s={s} side="left" />
              </dd>
              <dd className="text-paper/85 md:col-start-3 md:row-start-1">
                <Side s={s} side="right" />
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-14 text-center font-display text-h2 leading-tight font-bold text-paper">
          {CLOSE[0]} <span className="text-flare">{CLOSE[1]}</span>
        </p>
      </div>
    </section>
  );
}

/**
 * The mirror: two lives either side of a dividing line. Each stage of scroll
 * brings the next pair of lines; the line drifts as it goes, and at the end
 * the two sides slide into each other and the portraits overlap.
 */
export default function Mirror() {
  const mode = useSyncExternalStore(
    reducedMotionStore.subscribe,
    () => (reducedMotionStore.getSnapshot() ? "still" : "cinematic"),
    () => "static" as const,
  );
  const hostRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (mode !== "cinematic" || !hostRef.current) return;
      const q = gsap.utils.selector(hostRef);
      gsap.set(q("[data-stage]"), { autoAlpha: 0 });
      gsap.set(q("[data-close]"), { autoAlpha: 0, y: 16 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: hostRef.current, start: "top top", end: "bottom bottom", scrub: 0.5 },
      });
      const span = 0.86 / N;
      MIRROR.stages.forEach((_, i) => {
        const t = 0.02 + i * span;
        const el = q(`[data-stage='${i}']`);
        tl.fromTo(el, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: span * 0.25 }, t);
        if (i < N - 1) tl.to(el, { autoAlpha: 0, y: -10, duration: span * 0.2 }, t + span * 0.8);
        // the dividing line drifts, a little further each stage, one way then the other
        tl.to(q("[data-divider]"), { xPercent: (i % 2 ? -1 : 1) * (6 + i * 5), duration: span * 0.6, ease: "sine.inOut" }, t);
      });
      // overlap: the two sides and their portraits slide into each other
      const end = 0.02 + N * span;
      tl.to(q("[data-stage]"), { autoAlpha: 0, duration: 0.02 }, end - 0.01)
        .to(q("[data-divider]"), { xPercent: 0, scaleY: 0.2, autoAlpha: 0, duration: 0.05 }, end)
        .to(q("[data-portrait='left']"), { xPercent: 42, duration: 0.07, ease: "power2.inOut" }, end)
        .to(q("[data-portrait='right']"), { xPercent: -42, duration: 0.07, ease: "power2.inOut" }, end)
        .to(q("[data-names]"), { autoAlpha: 0, duration: 0.03 }, end)
        .to(q("[data-close]"), { autoAlpha: 1, y: 0, duration: 0.04, stagger: 0.02 }, end + 0.05);
      tl.to({}, { duration: 0.01 }, 0.99);
    },
    { dependencies: [mode], scope: hostRef },
  );

  if (mode !== "cinematic") return <StaticMirror />;

  return (
    <section ref={hostRef} aria-labelledby="mirror-title" className="relative h-[900vh]">
      <div className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden pt-[var(--nav-h)]">
        <h2 id="mirror-title" className="sr-only">
          {MIRROR.left} and {MIRROR.right}
        </h2>
        {/* the two faces, which end up on top of each other */}
        <div className="relative mx-auto mt-6 grid w-full max-w-[900px] grid-cols-2 px-4 md:mt-10">
          <div data-portrait="left" className="flex justify-end pr-3 md:pr-8">
            <Portrait slug={MIRROR.leftSlug} className="h-[18vh] w-auto object-contain mix-blend-screen md:h-[26vh]" />
          </div>
          <div data-portrait="right" className="flex justify-start pl-3 md:pl-8">
            <Portrait slug={MIRROR.rightSlug} className="h-[18vh] w-auto object-contain mix-blend-screen md:h-[26vh]" />
          </div>
        </div>
        <div data-names className="mx-auto mt-4 grid w-full max-w-[900px] grid-cols-2 px-4 font-display text-h3 font-bold text-paper">
          <p className="pr-3 text-right md:pr-8">{MIRROR.left}</p>
          <p className="pl-3 md:pl-8">{MIRROR.right}</p>
        </div>

        <div className="relative mx-auto mt-6 w-full max-w-[900px] flex-1 px-4">
          <span data-divider aria-hidden className="absolute top-0 bottom-10 left-1/2 w-px bg-paper/45" />
          {MIRROR.stages.map((s, i) => (
            <div key={s.stage} data-stage={i} className="absolute inset-x-4 top-0">
              <p className="relative z-10 mx-auto w-fit bg-base px-3 py-1 font-mono text-meta tracking-[0.28em] text-ash uppercase">{s.stage}</p>
              <div className="mt-6 grid grid-cols-2 text-[0.95rem] leading-relaxed text-paper/85 md:text-lede">
                <div className="pr-4 text-right md:pr-10">
                  <Side s={s} side="left" />
                </div>
                <div className="pl-4 md:pl-10">
                  <Side s={s} side="right" />
                </div>
              </div>
            </div>
          ))}
          <div className="pointer-events-none absolute inset-x-4 top-4 text-center font-display text-h2 leading-tight font-bold text-paper">
            <p data-close>{CLOSE[0]}</p>
            <p data-close className="text-flare">
              {CLOSE[1]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
