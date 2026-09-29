"use client";

import { useArchive } from "@/components/providers/ArchiveProvider";
import Spotlight from "@/components/archive/Spotlight";
import { HOWLERS, HOWLERS_ALSO } from "@/lib/data/factions";
import { cn } from "@/lib/utils";

/** Roll call: names stay lit, get crossed out, or become memorials, but only
 * as far as the reader's clearance reaches. Below it, everyone is still lit,
 * and members who join later are sealed rather than named. */
export default function HowlerRollCall() {
  const { clearance } = useArchive();
  const shown = HOWLERS.filter((h) => h.book <= clearance || h.book <= 1);
  const also = HOWLERS_ALSO.filter((h) => h.book <= clearance);
  const sealedCount = HOWLERS.length - shown.length + HOWLERS_ALSO.length - also.length;

  return (
    <>
      <ol className="grid hairline sm:grid-cols-2 lg:grid-cols-3" aria-label="Howler roll call">
        {shown.map((h) => {
          const state = h.fate && h.fate.book <= clearance ? h.fate.state : "lit";
          return (
            <Spotlight as="li" key={h.name} tone={state === "memorial" ? "rim" : "red"} className="bg-void p-7">
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
              {h.alias && <p className="mt-2 font-serif text-lg text-ash italic">{h.alias}</p>}
              <div className="mt-3 flex flex-wrap gap-2 font-mono text-meta tracking-[0.16em] text-ash-2 uppercase">
                {h.first && <span>First: {h.first}</span>}
                {h.pup && <span className="border border-line-strong px-1.5">Lancer, not a full Howler</span>}
              </div>
              {h.loyalty.book <= clearance ? (
                <p className="mt-4 text-ash">{h.loyalty.text}</p>
              ) : (
                <p className="mt-4 font-mono text-meta tracking-[0.16em] text-ash-2 uppercase">Loyalty sealed</p>
              )}
              {h.weapon && h.weapon.book <= clearance && (
                <p className="mt-3 text-sm text-bone/80">
                  <span className="font-mono text-meta tracking-[0.16em] text-ash-2 uppercase">Weapon </span>
                  {h.weapon.text}
                </p>
              )}
              {h.fate && h.fate.book <= clearance && (
                <p className={cn("mt-3 border-l-2 pl-3 text-sm", state === "memorial" ? "border-ash-2 text-ash" : state === "crossed" ? "border-red text-bone/80" : "border-gold-dim text-bone/80")}>
                  {h.fate.text}
                </p>
              )}
              {state === "memorial" && <span className="absolute top-6 right-6 font-mono text-meta tracking-[0.2em] text-ash-2 uppercase">In the Vale</span>}
            </Spotlight>
          );
        })}
      </ol>
      {also.length > 0 && (
        <p className="mt-8 max-w-[70ch] text-ash">
          <span className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Also on the roll </span>
          {also.map((h) => h.name).join(", ")}.
        </p>
      )}
      {sealedCount > 0 && (
        <p className="mt-4 font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">
          {sealedCount} more {sealedCount === 1 ? "name joins" : "names join"} the pack in books past your clearance.
        </p>
      )}
    </>
  );
}
