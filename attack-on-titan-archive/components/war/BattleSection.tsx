"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { reducedMotionStore } from "@/lib/animation/tokens";
import Sealed from "@/components/archive/Sealed";
import { BATTLES, MAINLAND, SIDE_CSS, WALL_KM, type Battle } from "@/lib/data/war";
import { cn } from "@/lib/utils";
import type { MapApi } from "@/components/three/battlemap/BattleMap";

const BattleMap = dynamic(() => import("@/components/three/battlemap/BattleMap"), { ssr: false });

const noSub = () => () => {};

/** The flat version (JS off, and the key under the 3D map): Walls, districts, battles. */
function FlatMap({ className }: { className?: string }) {
  const S = 0.1; // px per km in the 110-unit box
  const pt = (deg: number, km: number) => {
    const a = (deg * Math.PI) / 180;
    return [55 + Math.sin(a) * km * S, 55 - Math.cos(a) * km * S];
  };
  return (
    <svg viewBox="0 0 110 110" className={className} role="img" aria-label="The Walls, with the battles of 850 marked">
      <rect width="110" height="110" fill="#121310" />
      <circle cx="55" cy="55" r={WALL_KM.maria * S} fill="#1a1b17" stroke="#c7c0a9" strokeWidth="0.6" />
      <circle cx="55" cy="55" r={WALL_KM.rose * S} fill="#1f201b" stroke="#c7c0a9" strokeWidth="0.5" />
      <circle cx="55" cy="55" r={WALL_KM.sina * S} fill="#24251f" stroke="#c7c0a9" strokeWidth="0.45" />
      {BATTLES.map((b) => {
        const [x, y] = pt(b.at.deg, b.at.km);
        return (
          <g key={b.id}>
            <circle cx={x} cy={y} r="1.6" fill="#e0685c" />
            <text x={x + 2.4} y={y + 1} fontSize="3" fill="#d8d0b8" fontFamily="monospace">
              {b.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function BattleFile({ b, onBack }: { b: Battle; onBack?: () => void }) {
  return (
    <article>
      <p className="font-mono text-meta tracking-[0.2em] text-ash uppercase">
        {b.year}
        {b.approx && <span className="ml-3 text-ash">Position approximate</span>}
      </p>
      <h3 className="mt-2 font-display text-h3 leading-tight font-bold text-paper">{b.name}</h3>
      <p className="mt-4 text-[1.02rem] leading-relaxed text-paper/85">{b.summary}</p>
      <ol className="mt-4 grid gap-3 text-[0.98rem] leading-relaxed text-paper/75">
        {b.beats.map((t) => (
          <li key={t} className="grid grid-cols-[1rem_1fr]">
            <span aria-hidden className="text-flare">
              ·
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ol>
      {b.sealed && (
        <Sealed className="mt-4">
          <p className="pt-1 text-paper/80">{b.sealed}</p>
        </Sealed>
      )}
      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2" aria-label="Forces">
        {b.forces.map((f) => (
          <li key={f.label} className="flex items-center gap-2 font-mono text-meta tracking-[0.1em] text-paper/70 uppercase">
            <span aria-hidden className="size-2.5 rounded-full" style={{ background: SIDE_CSS[f.side] }} />
            {f.label}
          </li>
        ))}
      </ul>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mt-8 border border-paper/40 px-4 py-2 font-mono text-meta tracking-[0.16em] text-paper uppercase transition-colors hover:border-paper hover:bg-paper/5"
        >
          Back to the map
        </button>
      )}
    </article>
  );
}

export default function BattleSection() {
  const hydrated = useSyncExternalStore(noSub, () => true, () => false);
  const reduced = useSyncExternalStore(reducedMotionStore.subscribe, reducedMotionStore.getSnapshot, () => false);
  const api = useRef<MapApi | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const battle = BATTLES.find((b) => b.id === picked);

  function pick(id: string | null) {
    setPicked(id);
    api.current?.focus(id);
  }

  return (
    <section aria-labelledby="map-title" className="px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <h2 id="map-title" className="font-display text-h2 leading-tight font-bold text-paper">
          850: five battles in one year
        </h2>
        <p className="mt-4 max-w-[62ch] text-lede leading-relaxed text-paper/80">
          Choose a battle to go down to it. The Walls and districts sit where the story puts them; the land itself is illustrative, and the forces are schematic.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-12">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#0b0c0a] sm:aspect-[16/10]">
            {hydrated ? (
              <BattleMap apiRef={api} reduced={reduced} onPick={(id) => pick(id)} className="absolute inset-0" />
            ) : (
              <FlatMap className="absolute inset-0 size-full" />
            )}
          </div>

          <div aria-live="polite">
            {hydrated && battle ? (
              <BattleFile b={battle} onBack={() => pick(null)} />
            ) : hydrated ? (
              <div>
                <p className="text-paper/70">Or choose from the list:</p>
                <ul className="mt-4 grid gap-1">
                  {BATTLES.map((b) => (
                    <li key={b.id}>
                      <button
                        type="button"
                        onClick={() => pick(b.id)}
                        className="flex w-full items-baseline justify-between border-b border-line py-3 text-left font-military text-[1.05rem] tracking-[0.08em] text-paper/75 uppercase transition-colors hover:text-paper"
                      >
                        {b.name}
                        <span className="font-mono text-meta text-ash">{b.year}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        {/* JS off: every battle's file in full (never rendered, so never shifts, when JS runs) */}
        <noscript>
          <div className="mt-16 grid gap-14 md:grid-cols-2">
            {BATTLES.map((b) => (
              <BattleFile key={b.id} b={b} />
            ))}
          </div>
        </noscript>

        <div className="mt-24 border-t border-line pt-14">
          <h3 className="font-mono text-meta tracking-[0.2em] text-ash uppercase">Across the sea, 854</h3>
          <div className="mt-8 grid gap-12 md:grid-cols-2">
            {MAINLAND.map((m) => (
              <article key={m.id}>
                <h4 className={cn("font-display text-h3 leading-tight font-bold text-paper")}>{m.name}</h4>
                <p className="mt-4 max-w-[56ch] text-[1.02rem] leading-relaxed text-paper/80">{m.text}</p>
                {m.sealed && (
                  <Sealed className="mt-4">
                    <p className="pt-1 text-paper/80">{m.sealed}</p>
                  </Sealed>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
