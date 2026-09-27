"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Plate from "@/components/archive/Plate";
import SpoilerGate from "@/components/archive/SpoilerGate";
import { PLACES } from "@/lib/data/places";
import { cssEase } from "@/lib/animation/tokens";
import { cn } from "@/lib/utils";

const R = 46; // max orbit radius, in % of the map box

function pos(orbit: number, angle: number, nudge = 0) {
  const a = ((angle + nudge) * Math.PI) / 180;
  return { x: 50 + Math.cos(a) * orbit * R, y: 50 + Math.sin(a) * orbit * R };
}

export default function SolarMap() {
  const [sel, setSel] = useState("mars");
  const reduce = useReducedMotion();
  const place = PLACES.find((p) => p.slug === sel)!;
  const orbits = [...new Set(PLACES.map((p) => p.orbit))];

  return (
    <div className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:items-start">
      <div className="relative mx-auto aspect-square w-full max-w-[720px]">
        <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          {orbits.map((o) => (
            <circle key={o} cx="50" cy="50" r={o * R} fill="none" stroke="rgba(233,228,218,0.12)" strokeWidth="0.15" />
          ))}
          <circle cx="50" cy="50" r={0.66 * R} fill="none" stroke="rgba(233,228,218,0.06)" strokeWidth="1.2" strokeDasharray="0.3 0.8" />
          <circle cx="50" cy="50" r="2.4" fill="#f2c67a" />
          <circle cx="50" cy="50" r="5" fill="rgba(242,198,122,0.12)" />
        </svg>
        <span className="absolute top-[53.5%] left-1/2 hidden -translate-x-1/2 font-mono sm:inline text-[0.6rem] tracking-[0.2em] text-ash-2 uppercase">Sol</span>
        <span className="absolute top-[21%] left-[66%] hidden font-mono sm:inline text-[0.6rem] tracking-[0.2em] text-ash-2 uppercase">The Belt</span>
        <ul role="list" aria-label="Places" className="absolute inset-0">
          {PLACES.map((p) => {
            const { x, y } = pos(p.orbit, p.angle, p.slug === "luna" ? 9 : 0);
            const active = p.slug === sel;
            return (
              <li key={p.slug} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
                <button
                  type="button"
                  onClick={() => setSel(p.slug)}
                  aria-pressed={active}
                  aria-label={p.name}
                  className="group flex flex-col items-center gap-2 p-2"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "block rounded-full transition-transform duration-300",
                      p.slug === "luna" ? "size-2" : "size-3.5",
                      active ? "scale-150 bg-red" : "bg-bone group-hover:scale-125",
                    )}
                  />
                  <span aria-hidden className={cn("font-mono text-[0.65rem] tracking-[0.18em] uppercase whitespace-nowrap", active ? "text-bone" : "hidden text-ash-2 group-hover:text-bone sm:inline")}>
                    {p.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div aria-live="polite" className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={place.slug}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: cssEase.out }}
          >
            <Plate src={place.plate} alt={`${place.name}, rendered for this archive.`} className="border border-line" />
            <h2 className="mt-6 font-display text-h2 leading-none font-bold uppercase">{place.name}</h2>
            <div className="mt-5 space-y-4">
              {place.lines.map((l) => (
                <SpoilerGate key={l.text} book={l.book} compact>
                  <p className="text-lede text-bone/85">{l.text}</p>
                </SpoilerGate>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
