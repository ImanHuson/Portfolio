"use client";

import { useState } from "react";
import Link from "next/link";
import { PEOPLE, TAGS, type Tag } from "@/lib/data/people";
import { asset, cn } from "@/lib/utils";

// Files spread on a desk, not a grid of cards: varied widths and a small
// vertical offset per file, so the rhythm reads as paper put down by hand.
const SPAN = ["md:col-span-5", "md:col-span-4 md:mt-16", "md:col-span-3 md:mt-6", "md:col-span-4", "md:col-span-3 md:mt-20", "md:col-span-5 md:mt-4"];

/** The filter is a real control only with JS; without it every file shows. */
export default function PersonnelDesk() {
  const [tag, setTag] = useState<Tag | null>(null);
  const shown = (t: Tag[]) => !tag || t.includes(tag);
  const count = PEOPLE.filter((p) => shown(p.tags)).length;

  return (
    <div>
      <div data-js-only role="group" aria-label="Filter the files" className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-pressed={tag === null}
          onClick={() => setTag(null)}
          className={cn(
            "border px-3 py-2 font-military text-[0.9rem] tracking-[0.18em] uppercase transition-colors active:translate-y-px",
            tag === null ? "border-paper bg-paper text-ink" : "border-line-strong text-paper/80 hover:border-paper/60 hover:text-paper",
          )}
        >
          All files
        </button>
        {TAGS.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={tag === t.id}
            onClick={() => setTag(tag === t.id ? null : t.id)}
            className={cn(
              "border px-3 py-2 font-military text-[0.9rem] tracking-[0.18em] uppercase transition-colors active:translate-y-px",
              tag === t.id ? "border-paper bg-paper text-ink" : "border-line-strong text-paper/80 hover:border-paper/60 hover:text-paper",
            )}
          >
            {t.label}
          </button>
        ))}
        <p aria-live="polite" className="ml-auto font-mono text-meta tracking-[0.12em] text-ash uppercase">
          {count} of {PEOPLE.length} files
        </p>
      </div>

      <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-12 md:gap-x-8 md:gap-y-16">
        {PEOPLE.map((p, i) => (
          <li key={p.slug} hidden={!shown(p.tags)} className={cn("desk-file col-span-1", SPAN[i % SPAN.length])}>
            <Link href={`/soldiers/${p.slug}/`} className="group block">
              <img
                src={asset(`/images/personnel/${p.slug}.webp`)}
                alt={`${p.name}, personnel file`}
                width={800}
                height={900}
                loading={i < 4 ? "eager" : "lazy"}
                className="w-full transition-transform duration-300 ease-[var(--ease-out)] motion-safe:[@media(hover:hover)]:group-hover:-translate-y-1.5 motion-safe:[@media(hover:hover)]:group-hover:rotate-[0.6deg]"
              />
              <span className="mt-2 flex flex-wrap items-baseline justify-between gap-x-3 px-2">
                <span className="font-military text-[1.1rem] font-semibold tracking-[0.12em] text-paper uppercase group-hover:underline group-hover:decoration-paper/40 group-hover:underline-offset-4">
                  {p.name}
                </span>
                <span className="font-mono text-meta tracking-[0.1em] text-ash">{p.file}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
