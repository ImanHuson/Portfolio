"use client";

import { useArchive } from "@/components/providers/ArchiveProvider";
import { HOWLERS } from "@/lib/data/factions";
import { cn } from "@/lib/utils";

/** Roll call: names stay lit, get crossed out, or become memorials, but only
 * as far as the reader's clearance reaches. Below it, everyone is still lit. */
export default function HowlerRollCall() {
  const { clearance } = useArchive();
  return (
    <ol className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3" aria-label="Howler roll call">
      {HOWLERS.map((h) => {
        const state = h.fate && h.fate.book <= clearance ? h.fate.state : "lit";
        return (
          <li key={h.name} className="relative bg-void p-7">
            <p
              className={cn(
                "font-display text-5xl leading-none font-extrabold uppercase",
                state === "lit" && "text-bone",
                state === "crossed" && "text-ash-2 line-through decoration-red decoration-4",
                state === "memorial" && "font-serif font-medium text-ash normal-case italic",
              )}
            >
              {h.name}
            </p>
            <p className="mt-3 font-mono text-meta tracking-[0.16em] text-ash-2 uppercase">
              First: {h.first}
            </p>
            {h.loyalty.book <= clearance ? (
              <p className="mt-4 text-ash">{h.loyalty.text}</p>
            ) : (
              <p className="mt-4 font-mono text-meta tracking-[0.16em] text-ash-2 uppercase">Loyalty sealed</p>
            )}
            {h.fate && h.fate.book <= clearance && (
              <p className={cn("mt-3 border-l-2 pl-3 text-sm", state === "memorial" ? "border-ash-2 text-ash" : state === "crossed" ? "border-red text-bone/80" : "border-gold-dim text-bone/80")}>
                {h.fate.text}
              </p>
            )}
            {state === "memorial" && <span className="absolute top-6 right-6 font-mono text-[0.65rem] tracking-[0.2em] text-ash-2 uppercase">In the Vale</span>}
          </li>
        );
      })}
    </ol>
  );
}
