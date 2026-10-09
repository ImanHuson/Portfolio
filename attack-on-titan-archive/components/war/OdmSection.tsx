"use client";

import { useState } from "react";
import { ODM_PARTS } from "@/lib/data/war";
import { cn } from "@/lib/utils";
import OdmPlate from "@/components/war/OdmPlate";
import OdmMotion from "@/components/war/OdmMotion";
import SectionBackdrop from "@/components/archive/SectionBackdrop";
import { BG } from "@/lib/data/backgrounds";
/** The gear as an engineering plate: pick out a part, take it apart, and see how a swing works. */
export default function OdmSection() {
  const [play, setPlay] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [explode, setExplode] = useState(0);
  const part = ODM_PARTS.find((p) => p.id === active);

  function choose(id: string) {
    const next = active === id ? null : id;
    setActive(next);
  }

  return (
    <section aria-labelledby="odm-title" className="relative isolate border-t border-line px-4 py-24 md:px-8 md:py-32">
      <SectionBackdrop src={BG.forest.src} credit={BG.forest.credit} position="50% 40%" strength={0.26} />
      <div className="mx-auto max-w-[1400px]">
        <h2 id="odm-title" className="font-display text-h2 leading-tight font-bold text-paper">
          Omni-directional mobility gear
        </h2>
        <p className="mt-4 max-w-[60ch] text-lede leading-relaxed text-paper/80">
          The one thing that lets a person fight something fifteen metres tall. Pick out a part, take it apart, and see how a swing works.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-14">
          <div>
            <div className="relative border border-line bg-[radial-gradient(ellipse_at_50%_40%,#1d1e19,#0b0c0a_75%)] p-2 sm:p-4">
              <OdmPlate active={active} explode={explode} />
            </div>
            <div data-js-only className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
              <label className="flex items-center gap-3 font-mono text-meta tracking-[0.16em] text-paper/80 uppercase">
                Take apart
                <input type="range" min={0} max={1} step={0.01} value={explode} onChange={(e) => setExplode(Number(e.target.value))} className="w-40 accent-[#a8261c]" />
              </label>
            </div>
            <div className="mt-10 border border-line p-3 sm:p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-military text-[1.05rem] font-semibold tracking-[0.14em] text-paper uppercase">How a swing works</h3>
                <button
                  type="button"
                  data-js-only
                  onClick={() => setPlay((n) => n + 1)}
                  className="press border border-paper/40 px-4 py-2 font-mono text-meta tracking-[0.16em] text-paper uppercase hover:border-paper hover:bg-paper/5"
                >
                  {play ? "Again" : "Play it"}
                </button>
              </div>
              <OdmMotion play={play} />
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
              {part ? part.text : "Choose a part to see where it sits and what it does."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
