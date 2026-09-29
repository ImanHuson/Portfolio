"use client";

import Link from "next/link";
import { useId, useSyncExternalStore } from "react";
import CardWash from "@/components/archive/CardWash";
import FramedPortrait from "@/components/archive/FramedPortrait";
import { useArchive } from "@/components/providers/ArchiveProvider";
import { EXTENDED } from "@/lib/data/extended";
import { FEATURED } from "@/lib/data/featured";
import { cn } from "@/lib/utils";

// The reader's pick, kept in this browser only. There is no server, so the
// archive cannot count anyone else's answer, and the copy never implies it.
const KEY = "rra-iron-rain";
const listeners = new Set<() => void>();
let cache: string | null | undefined;
const pickStore = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  get(): string | null {
    if (cache === undefined) {
      try {
        cache = window.localStorage.getItem(KEY);
      } catch {
        cache = null;
      }
    }
    return cache;
  },
  set(v: string | null) {
    cache = v;
    try {
      if (v) window.localStorage.setItem(KEY, v);
      else window.localStorage.removeItem(KEY);
    } catch {
      /* this browser only, and only if it lets us */
    }
    listeners.forEach((l) => l());
  },
};

/** "Who would you follow into the Iron Rain?" (brief section 64): an
 * interactive prompt, not a ranking. A native radio group, so it works
 * with a keyboard and a screen reader like any form. */
export default function IronRain() {
  const { clearance } = useArchive();
  const pick = useSyncExternalStore(pickStore.subscribe, pickStore.get, () => null);
  const name = useId();
  const chosen = pick ? FEATURED.find((f) => f.slug === pick) : null;
  const ext = chosen ? EXTENDED.find((e) => e.slug === chosen.slug) : null;
  const line = ext ? (clearance >= ext.lineBook ? ext.line : ext.lineEarly) : null;

  return (
    <section aria-labelledby="iron-rain-title" className="border-t border-line px-5 py-24 md:px-8" data-js-only>
      <div className="mx-auto max-w-[1400px]">
        <fieldset>
          <legend id="iron-rain-title" className="max-w-[18ch] font-display text-h1 leading-[0.9] font-extrabold uppercase">
            Who would you follow into the Iron Rain?
          </legend>
          <p className="mt-6 max-w-[60ch] text-lede text-ash">
            The Iron Rain: soldiers dropped from orbit in armor onto a defended world. Pick one person to fall beside. This isn’t a vote and nothing is counted: your answer stays in this browser.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-px bg-line sm:grid-cols-4 lg:grid-cols-5">
            {FEATURED.map((f) => {
              const on = pick === f.slug;
              return (
                <label
                  key={f.slug}
                  data-wash="red"
                  className={cn(
                    "wash-card group relative flex cursor-pointer flex-col gap-3 bg-void p-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-red md:p-5",
                    on && "outline-2 -outline-offset-2 outline-red",
                  )}
                >
                  <CardWash />
                  <input type="radio" name={name} value={f.slug} checked={on} onChange={() => pickStore.set(f.slug)} className="sr-only" />
                  <FramedPortrait
                    slug={f.slug}
                    name={f.as(clearance).name}
                    size="card"
                    className={cn("transition-opacity", on ? "opacity-100" : "opacity-75 group-hover:opacity-100")}
                    sizes="(min-width: 1024px) 18vw, (min-width: 640px) 24vw, 45vw"
                  />
                  <span className="font-display text-lg leading-tight font-bold uppercase md:text-xl">{f.as(clearance).name}</span>
                  {on && <span aria-hidden className="absolute top-3 right-3 size-2.5 bg-red" />}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div aria-live="polite" className="mt-12 min-h-24">
          {chosen && (
            <div className="border-l-2 border-red pl-6">
              <p className="font-serif text-h3 text-bone italic">You would follow {chosen.as(clearance).name} into the Iron Rain.</p>
              {line && <p className="mt-3 max-w-[56ch] text-lede text-ash">{line}</p>}
              <div className="mt-6 flex flex-wrap gap-6">
                <Link href={`/people/${chosen.slug}/`} className="border-b border-red pb-1 font-mono text-meta tracking-[0.2em] uppercase hover:text-red">
                  Open their dossier
                </Link>
                <button type="button" onClick={() => pickStore.set(null)} className="font-mono text-meta tracking-[0.2em] text-ash uppercase hover:text-bone">
                  Clear my answer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
