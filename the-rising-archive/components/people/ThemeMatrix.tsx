"use client";

import Link from "next/link";
import { useState } from "react";
import FramedPortrait from "@/components/archive/FramedPortrait";
import { useArchive } from "@/components/providers/ArchiveProvider";
import { FEATURED } from "@/lib/data/featured";
import { MATRIX, THEMES, memberBook, memberSlug, type Theme } from "@/lib/data/themes";
import { cn } from "@/lib/utils";

/** Pick a theme; the people the archive reads through it light up.
 * Below, the whole matrix as a table. Both are the archive's reading. */
export default function ThemeMatrix() {
  const { clearance } = useArchive();
  const [theme, setTheme] = useState<Theme | null>(null);

  const isIn = (t: Theme, slug: string) => MATRIX[t].some((m) => memberSlug(m) === slug && memberBook(m) <= clearance);
  const sealedIn = (t: Theme) => MATRIX[t].filter((m) => memberBook(m) > clearance).length;
  const members = theme ? FEATURED.filter((f) => isIn(theme, f.slug)) : [];
  const nameOf = (slug: string) => FEATURED.find((x) => x.slug === slug)!.as(clearance).name;

  return (
    <div className="mx-auto max-w-[1400px]">
      <div role="group" aria-label="Choose a theme" className="flex flex-wrap gap-2">
        {THEMES.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={theme === t}
            onClick={() => setTheme((c) => (c === t ? null : t))}
            className={cn(
              "min-h-11 border px-4 py-2 motion-safe:active:scale-[0.97] font-display text-lg font-bold tracking-wide uppercase transition-colors md:text-xl",
              theme === t ? "border-red bg-red/15 text-bone" : "border-line text-ash hover:border-line-strong hover:text-bone",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-6 min-h-14 max-w-[70ch] text-lede text-bone/90">
        {theme ? (
          <>
            <span className="font-mono text-meta tracking-[0.2em] text-red uppercase">{theme}</span>{" "}
            {members.length ? members.map((m) => nameOf(m.slug)).join(", ") : "No one at your clearance yet."}
            {sealedIn(theme) > 0 && <span className="text-ash-2"> · {sealedIn(theme)} more sealed at your clearance</span>}
          </>
        ) : (
          <span className="text-ash">Choose a theme to see who the archive reads through it.</span>
        )}
      </p>

      <ul role="list" className="mt-8 grid grid-cols-2 hairline sm:grid-cols-4 lg:grid-cols-5">
        {FEATURED.map((f) => {
          const on = theme ? isIn(theme, f.slug) : true;
          return (
            <li key={f.slug} className="bg-void">
              <Link
                href={`/people/${f.slug}/`}
                data-wash={f.register === "rim" ? "rim" : f.register === "gold" ? "gold" : "red"}
                className={cn("wash-card group flex h-full items-center gap-3 p-4 transition-opacity duration-300", theme && !on && "opacity-25")}
              >
                <FramedPortrait slug={f.slug} name={f.as(clearance).name} size="thumb" className="w-11 shrink-0" sizes="48px" />
                <span className="min-w-0">
                  <span className="block truncate font-display text-lg leading-tight font-bold uppercase">{f.as(clearance).name}</span>
                  <span className="block truncate font-mono text-[0.7rem] tracking-[0.14em] text-ash uppercase">{f.color}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <details className="mt-16 border-t border-line pt-8">
        <summary className="inline-flex min-h-11 cursor-pointer items-center font-mono text-meta tracking-[0.2em] text-ash uppercase hover:text-bone">
          The whole matrix, as a table
        </summary>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <caption className="sr-only">Which themes the archive reads each person through</caption>
            <thead>
              <tr>
                <th scope="col" className="py-2 pr-4 font-mono text-meta tracking-[0.14em] text-ash-2 uppercase">
                  Person
                </th>
                {THEMES.map((t) => (
                  <th key={t} scope="col" className={cn("px-1 py-2 text-center font-mono text-[0.7rem] tracking-[0.1em] uppercase", theme === t ? "text-red" : "text-ash-2")}>
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURED.map((f) => (
                <tr key={f.slug} className="border-t border-line">
                  <th scope="row" className="py-2 pr-4 font-display text-base font-bold whitespace-nowrap uppercase">
                    {f.as(clearance).name}
                  </th>
                  {THEMES.map((t) => (
                    <td key={t} className={cn("px-1 py-2 text-center", theme === t && "bg-red/10")}>
                      {isIn(t, f.slug) ? <span aria-label="yes" className="text-red">●</span> : <span aria-hidden className="text-line-strong">·</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
