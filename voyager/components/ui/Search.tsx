"use client";

import { MagnifyingGlass, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { SearchItem } from "@/lib/content";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Search across every country, region, city, place and topic. The index is
 * built at export time; there is no server to query. */
export function Search({ index }: { index: SearchItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return index
      .map((it) => {
        const title = norm(`${it.title} ${it.native ?? ""}`);
        const all = `${title} ${norm(it.kind)} ${norm(it.terms)}`;
        if (!words.every((w) => all.includes(w))) return null;
        const score = words.reduce((s, w) => s + (title.includes(w) ? 3 : 1), 0) + (it.status === "open" ? 1 : 0);
        return { it, score };
      })
      .filter((x): x is { it: SearchItem; score: number } => !!x)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }, [q, index]);

  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="press flex items-center gap-2 rounded-sm px-2 py-2 text-[#c9c4bb] hover:text-white sm:px-3"
        aria-haspopup="dialog"
        data-js-only
      >
        <MagnifyingGlass size={18} weight="regular" aria-hidden />
        <span className="hidden sm:inline">Search</span>
        <span className="sr-only sm:hidden">Search</span>
      </button>
      <dialog
        ref={dialog}
        aria-label="Search Voyager"
        className="m-0 mx-auto mt-[10vh] w-[min(640px,calc(100vw-2rem))] overscroll-contain border border-[#2a313a] bg-[#151a20] p-0 text-[#e8e4dc] backdrop:bg-black/60"
        onClick={(e) => e.target === dialog.current && close()}
      >
        <form method="dialog" className="flex items-center gap-3 border-b border-[#2a313a] px-4 focus-within:border-[#e2b45a]" onSubmit={(e) => e.preventDefault()}>
          <MagnifyingGlass size={18} aria-hidden className="text-[#9aa1a8]" />
          <label htmlFor="search-q" className="sr-only">Search countries, places and topics</label>
          <input
            id="search-q"
            name="q"
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Kyoto, torii, washoku…"
            autoComplete="off"
            spellCheck={false}
            className="h-14 flex-1 bg-transparent text-base outline-none focus-visible:outline-none placeholder:text-[#8b929a]"
          />
          <button type="button" onClick={close} className="press p-2 text-[#9aa1a8] hover:text-white">
            <X size={18} aria-hidden />
            <span className="sr-only">Close search</span>
          </button>
        </form>
        <div aria-live="polite" className="max-h-[60vh] overflow-y-auto">
          {q && results.length === 0 && (
            <p className="px-4 py-6 text-sm text-[#9aa1a8]">
              Nothing found for “{q}”. Only Japan is open so far; other countries are still being researched.
            </p>
          )}
          {results.length > 0 && (
            <ul className="py-2">
              {results.map(({ it }) => (
                <li key={it.href + it.title}>
                  <Link
                    href={it.href}
                    onClick={close}
                    className="flex items-baseline justify-between gap-4 px-4 py-3 hover:bg-[#1c232b] focus-visible:bg-[#1c232b]"
                  >
                    <span>
                      {it.title}
                      {it.native && <span className="ml-2 text-[#9aa1a8]">{it.native}</span>}
                    </span>
                    <span className="shrink-0 text-sm text-[#9aa1a8]">{it.status === "open" ? it.kind : "In research"}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {!q && <p className="px-4 py-6 text-sm text-[#9aa1a8]">Search countries, regions, cities, places and topics.</p>}
        </div>
      </dialog>
    </>
  );
}
