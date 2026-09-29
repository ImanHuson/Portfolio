"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { useArchive } from "@/components/providers/ArchiveProvider";
import { SEARCH_EXAMPLES, searchArchive } from "@/lib/data/search";

/** "Search the archive": the twenty featured people and the cast, by name,
 * Color, House, trait, theme, book or role. Results respect the reader's
 * clearance, so a search never answers with a spoiler. */
export default function ArchiveSearch() {
  const params = useSearchParams();
  const { clearance } = useArchive();
  const [q, setQ] = useState(() => params.get("q") ?? "");
  const id = useId();
  const hits = useMemo(() => searchArchive(q, clearance), [q, clearance]);
  // How many more a full clearance would find: said, never shown.
  const hidden = useMemo(() => (clearance < 6 ? searchArchive(q, 6).length - hits.length : 0), [q, clearance, hits.length]);

  const update = (v: string) => {
    setQ(v);
    // Keep the query in the address so a search can be shared or reloaded.
    const url = new URL(window.location.href);
    if (v) url.searchParams.set("q", v);
    else url.searchParams.delete("q");
    window.history.replaceState(window.history.state, "", url);
  };

  return (
    <div role="search" className="mx-auto max-w-[1400px]">
      <label htmlFor={id} className="font-display text-h2 leading-none font-bold uppercase">
        Search the archive
      </label>
      <input
        id={id}
        type="search"
        value={q}
        onChange={(e) => update(e.target.value)}
        placeholder="A name, a Color, a House, a trait, a theme, a book"
        autoComplete="off"
        spellCheck={false}
        className="mt-6 block w-full border-b-2 border-line-strong bg-transparent py-3 font-serif text-2xl text-bone italic placeholder:text-ash-2 focus:border-red focus:outline-none md:text-3xl"
      />
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="font-mono text-meta tracking-[0.16em] text-ash-2 uppercase">Try</span>
        {SEARCH_EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => update(ex)}
            className="min-h-10 border border-line px-3 py-1.5 font-mono text-meta tracking-[0.14em] text-ash uppercase hover:border-line-strong hover:text-bone"
          >
            {ex}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="mt-8">
        {q.trim() && (
          <p className="font-mono text-meta tracking-[0.18em] text-ash uppercase">
            {hits.length ? `${hits.length} ${hits.length === 1 ? "result" : "results"}` : "Nothing at your clearance matches that"}
            {hidden > 0 && <span className="text-ash-2"> · {hidden} more sealed at your clearance</span>}
          </p>
        )}
        {hits.length > 0 && (
          <ul role="list" className="mt-4 divide-y divide-line border-y border-line">
            {hits.map((h) => (
              <li key={h.key}>
                <Link href={h.href} className="group grid gap-1 py-4 sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] sm:items-baseline sm:gap-6">
                  <span className="font-display text-xl font-bold uppercase group-hover:text-red">{h.name}</span>
                  <span className="min-w-0 text-ash">
                    {h.meta}
                    {h.match && <span className="text-ash-2"> · {h.match}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
