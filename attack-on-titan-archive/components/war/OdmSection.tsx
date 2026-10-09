"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { reducedMotionStore } from "@/lib/animation/tokens";
import { ODM_PARTS } from "@/lib/data/war";
import { asset, cn } from "@/lib/utils";
import SectionBackdrop from "@/components/archive/SectionBackdrop";
import { BG } from "@/lib/data/backgrounds";
import type { OdmApi } from "@/components/three/odm/OdmViewer";

const OdmViewer = dynamic(() => import("@/components/three/odm/OdmViewer"), { ssr: false });

const noSub = () => () => {};

/** The gear, functional 3D: turn it, take it apart, watch how it moves. */
export default function OdmSection() {
  const hydrated = useSyncExternalStore(noSub, () => true, () => false);
  const reduced = useSyncExternalStore(reducedMotionStore.subscribe, reducedMotionStore.getSnapshot, () => false);
  const api = useRef<OdmApi | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [explode, setExplode] = useState(0);
  const part = ODM_PARTS.find((p) => p.id === active);

  function choose(id: string) {
    const next = active === id ? null : id;
    setActive(next);
    api.current?.setActive(next);
  }

  return (
    <section aria-labelledby="odm-title" className="relative isolate border-t border-line px-4 py-24 md:px-8 md:py-32">
      <SectionBackdrop src={BG.forest.src} credit={BG.forest.credit} position="50% 40%" strength={0.26} />
      <div className="mx-auto max-w-[1400px]">
        <h2 id="odm-title" className="font-display text-h2 leading-tight font-bold text-paper">
          Omni-directional mobility gear
        </h2>
        <p className="mt-4 max-w-[60ch] text-lede leading-relaxed text-paper/80">
          The one thing that lets a person fight something fifteen metres tall. Turn it, take it apart, and watch how it moves.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-14">
          <div>
            <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,#23241f,#0b0c0a_70%)] sm:aspect-[16/11]">
              {hydrated && <OdmViewer apiRef={api} labels={ODM_PARTS} reduced={reduced} className="absolute inset-0" />}
              {/* JS off: a still of the gear taken apart (never fetched when JS runs) */}
              <noscript>
                <img
                  src={asset("/images/war/odm-exploded.webp")}
                  alt="The gear taken apart: harness, main unit with spools and turbine, anchors, blade boxes with gas canisters, grips, blades and Thunder Spears."
                  width={1400}
                  height={962}
                  className="absolute inset-0 size-full object-contain"
                />
              </noscript>
              <p className="pointer-events-none absolute bottom-3 left-3 font-mono text-meta tracking-[0.14em] text-ash uppercase" data-js-only>
                Drag to turn
              </p>
            </div>
            <div data-js-only className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
              <label className="flex items-center gap-3 font-mono text-meta tracking-[0.16em] text-paper/80 uppercase">
                Take apart
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={explode}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setExplode(v);
                    api.current?.setExplode(v);
                  }}
                  className="w-40 accent-[#a8261c]"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  setExplode(0);
                  api.current?.demo();
                }}
                className="press border border-paper/40 px-4 py-2 font-mono text-meta tracking-[0.16em] text-paper uppercase hover:border-paper hover:bg-paper/5"
              >
                How it moves
              </button>
              <p className="w-full max-w-[52ch] text-meta leading-snug text-ash">
                Simulated, simply: gravity, two wires that can only pull, reeled in at a fixed rate, a little gas, then release. Shown at half speed.
              </p>
            </div>
          </div>

          <div>
            <ul className="grid gap-1" aria-label="Parts">
              {ODM_PARTS.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-pressed={active === p.id}
                    onClick={() => choose(p.id)}
                    className={cn(
                      "flex w-full items-baseline justify-between border-b border-line py-3 text-left font-military text-[1.05rem] tracking-[0.08em] uppercase transition-colors",
                      active === p.id ? "text-paper" : "text-paper/65 hover:text-paper",
                    )}
                  >
                    {p.name}
                    <span aria-hidden className="font-mono text-meta text-ash-2">
                      {active === p.id ? "−" : "+"}
                    </span>
                  </button>
                  {/* JS off: every description is simply shown */}
                  <noscript>
                    <p className="pb-3 text-[0.95rem] leading-relaxed text-paper/75">{p.text}</p>
                  </noscript>
                </li>
              ))}
            </ul>
            <p aria-live="polite" className="mt-6 min-h-[6lh] max-w-[46ch] text-[1rem] leading-relaxed text-paper/85">
              {part ? part.text : hydrated ? "Choose a part to see where it sits and what it does." : ""}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
