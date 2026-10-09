"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { reducedMotionStore } from "@/lib/animation/tokens";
import Sealed from "@/components/archive/Sealed";
import { MIRRORS, type MirrorPair, type MirrorStage } from "@/lib/data/world";
import { asset, cn } from "@/lib/utils";
import SectionBackdrop from "@/components/archive/SectionBackdrop";
import { BG } from "@/lib/data/backgrounds";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

const pairName = (p: MirrorPair) => `${p.left} / ${p.right}`;

/** One pair as a two-column table (JS off, reduced motion). */
function PairTable({ pair }: { pair: MirrorPair }) {
  return (
    <div className="border-t border-line pt-14 first:border-t-0 first:pt-0">
      <h3 className="text-center font-display text-h2 leading-tight font-bold text-paper">
        {pair.left} <span className="text-ash">/</span> {pair.right}
      </h3>
      {pair.warning && <p className="mt-2 text-center font-mono text-meta tracking-[0.2em] text-alert uppercase">{pair.warning}</p>}
      <div className="mt-8 grid grid-cols-2 gap-6">
        <Portrait slug={pair.leftSlug} className="ml-auto h-36 w-auto object-contain md:h-48" />
        <Portrait slug={pair.rightSlug} className="h-36 w-auto object-contain md:h-48" />
      </div>
      <dl className="mt-10 grid border-t border-line">
        {pair.stages.map((s) => (
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
    </div>
  );
}

function StaticMirror() {
  return (
    <section aria-labelledby="mirror-title" className="relative isolate px-4 py-20 md:px-8 md:py-28">
      <SectionBackdrop src={BG.colossiPair.src} credit={BG.colossiPair.credit} position="50% 60%" strength={0.2} />
      <div className="mx-auto grid max-w-[1200px] gap-16">
        <h2 id="mirror-title" className="text-center font-mono text-meta tracking-[0.3em] text-ash uppercase">
          The mirror: six pairs
        </h2>
        {MIRRORS.map((p) => (
          <PairTable key={pairName(p)} pair={p} />
        ))}
        <p className="text-center font-display text-h2 leading-tight font-bold text-paper">
          {CLOSE[0]} <span className="text-flare">{CLOSE[1]}</span>
        </p>
      </div>
    </section>
  );
}

/**
 * The mirror: two lives either side of a dividing line. Each stage of scroll
 * brings the next pair of lines; the line drifts as it goes, and at the end
 * the two sides slide into each other and the portraits overlap. The tabs
 * switch pairs and rewind the pinned sequence to its start.
 */
export default function Mirror() {
  const mode = useSyncExternalStore(
    reducedMotionStore.subscribe,
    () => (reducedMotionStore.getSnapshot() ? "still" : "cinematic"),
    () => "static" as const,
  );
  const hostRef = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const pair = MIRRORS[idx];
  const n = pair.stages.length;

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
      const span = 0.86 / n;
      pair.stages.forEach((_, i) => {
        const t = 0.02 + i * span;
        const el = q(`[data-stage='${i}']`);
        tl.fromTo(el, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: span * 0.25 }, t);
        if (i < n - 1) tl.to(el, { autoAlpha: 0, y: -10, duration: span * 0.2 }, t + span * 0.8);
        // the dividing line drifts, a little further each stage, one way then the other
        tl.to(q("[data-divider]"), { xPercent: (i % 2 ? -1 : 1) * (6 + i * 5), duration: span * 0.6, ease: "sine.inOut" }, t);
      });
      // overlap: the two sides and their portraits slide into each other
      const end = 0.02 + n * span;
      tl.to(q("[data-stage]"), { autoAlpha: 0, duration: 0.02 }, end - 0.01)
        .to(q("[data-divider]"), { xPercent: 0, scaleY: 0.2, autoAlpha: 0, duration: 0.05 }, end)
        .to(q("[data-portrait='left']"), { xPercent: 42, duration: 0.07, ease: "power2.inOut" }, end)
        .to(q("[data-portrait='right']"), { xPercent: -42, duration: 0.07, ease: "power2.inOut" }, end)
        .to(q("[data-names]"), { autoAlpha: 0, duration: 0.03 }, end)
        .to(q("[data-close]"), { autoAlpha: 1, y: 0, duration: 0.04, stagger: 0.02 }, end + 0.05);
      tl.to({}, { duration: 0.01 }, 0.99);
    },
    { dependencies: [mode, idx], scope: hostRef, revertOnUpdate: true },
  );

  function choose(i: number) {
    if (i === idx) return;
    setIdx(i);
    // back to the first stage of the new pair
    const host = hostRef.current;
    if (!host) return;
    const top = host.getBoundingClientRect().top + window.scrollY;
    // a cut, not a rewind: jump straight to the pair's first stage (a smooth scroll
    // back up a 900vh scene replays the whole timeline backwards at speed), with the
    // stage dipping out and back so the swap does not teleport; the tabs stay put
    const stage = [...host.querySelectorAll<HTMLElement>(".sticky > :not([role='tablist'])")];
    stage.forEach((el) => Object.assign(el.style, { transition: "none", opacity: "0" }));
    window.scrollTo({ top, behavior: "instant" });
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        stage.forEach((el) => Object.assign(el.style, { transition: "opacity 200ms var(--ease-out)", opacity: "" })),
      ),
    );
  }

  if (mode !== "cinematic") return <StaticMirror />;

  return (
    <section ref={hostRef} aria-labelledby="mirror-title" className="relative isolate h-[900vh]">
      <SectionBackdrop src={BG.colossiPair.src} position="50% 60%" strength={0.2} />
      <div className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden pt-[var(--nav-h)]">
        <h2 id="mirror-title" className="sr-only">
          The mirror
        </h2>
        {/* the six pairs */}
        <div role="tablist" aria-label="Pairs" className="mx-auto flex w-full max-w-[1100px] gap-1 overflow-x-auto px-4 pt-4 [scrollbar-width:none]">
          {MIRRORS.map((p, i) => (
            <button
              key={pairName(p)}
              role="tab"
              aria-selected={i === idx}
              onClick={() => choose(i)}
              className={cn(
                "shrink-0 border-b-2 px-3 py-2 font-mono text-meta tracking-[0.14em] whitespace-nowrap uppercase transition-colors",
                i === idx ? "border-paper text-paper" : "border-transparent text-ash hover:text-paper",
              )}
            >
              {pairName(p)}
              {p.warning && <span className="ml-2 text-alert">· {p.warning}</span>}
            </button>
          ))}
        </div>

        <div key={idx} className="flex flex-1 flex-col">
          {/* the two faces, which end up on top of each other */}
          <div className="relative mx-auto mt-4 grid w-full max-w-[900px] grid-cols-2 px-4 md:mt-8">
            <div data-portrait="left" className="flex justify-end pr-3 md:pr-8">
              <Portrait slug={pair.leftSlug} className="h-[16vh] w-auto object-contain mix-blend-screen md:h-[24vh]" />
            </div>
            <div data-portrait="right" className="flex justify-start pl-3 md:pl-8">
              <Portrait slug={pair.rightSlug} className="h-[16vh] w-auto object-contain mix-blend-screen md:h-[24vh]" />
            </div>
          </div>
          <div data-names className="mx-auto mt-3 grid w-full max-w-[900px] grid-cols-2 px-4 font-display text-h3 font-bold text-paper">
            <p className="pr-3 text-right md:pr-8">{pair.left}</p>
            <p className="pl-3 md:pl-8">{pair.right}</p>
          </div>

          <div className="relative mx-auto mt-5 w-full max-w-[900px] flex-1 px-4">
            <span data-divider aria-hidden className="absolute top-0 bottom-10 left-1/2 w-px bg-paper/45" />
            {pair.stages.map((s, i) => (
              <div key={s.stage} data-stage={i} className="absolute inset-x-4 top-0">
                <p className="relative z-10 mx-auto w-fit bg-base px-3 py-1 font-mono text-meta tracking-[0.28em] text-ash uppercase">{s.stage}</p>
                <div className="mt-5 grid grid-cols-2 text-[0.92rem] leading-relaxed text-paper/85 md:text-lede">
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
      </div>
    </section>
  );
}
