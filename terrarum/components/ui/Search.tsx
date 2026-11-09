"use client";

import { MagnifyingGlass, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SearchItem } from "@/lib/content";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

interface PagefindResult {
  url: string;
  title: string;
  excerpt: string;
}
type Pagefind = {
  search(q: string): Promise<{ results: { data(): Promise<{ url: string; meta: { title?: string }; excerpt: string }> }[] }>;
};

// Loaded from the exported site at runtime, never bundled: Pagefind builds
// its index from the HTML after `next build` (see package.json).
let pagefind: Promise<Pagefind | null> | null = null;
function loadPagefind() {
  pagefind ??= (new Function("u", "return import(u)")(`${BASE}/pagefind/pagefind.js`) as Promise<Pagefind>).catch(() => null);
  return pagefind;
}

/**
 * Search across everything. Full text comes from Pagefind, a static index
 * built from the exported pages and searched in the browser, which stands in
 * for the database search the brief asked for (there is no server). A small
 * index of country names covers countries that have no pages yet, and is the
 * whole search in `next dev`, where no Pagefind index exists.
 */
export function Search({ index }: { index: SearchItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState("");
  const [full, setFull] = useState<{ q: string; results: PagefindResult[] } | null>(null);

  const quick = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return index
      .filter((it) => it.kind === "Country" || it.kind.startsWith("Region") || it.kind === "City")
      .filter((it) => words.every((w) => norm(`${it.title} ${it.native ?? ""} ${it.terms}`).includes(w)))
      .slice(0, 4);
  }, [q, index]);

  const fallback = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return index
      .filter((it) => it.status === "open" && words.every((w) => norm(`${it.title} ${it.native ?? ""} ${it.kind} ${it.terms}`).includes(w)))
      .slice(0, 10);
  }, [q, index]);

  useEffect(() => {
    const term = q.trim();
    if (!term) return;
    let live = true;
    const t = setTimeout(async () => {
      const pf = await loadPagefind();
      if (!pf || !live) return;
      const res = await pf.search(term);
      const data = await Promise.all(res.results.slice(0, 8).map((r) => r.data()));
      if (live) setFull({ q: term, results: data.map((d) => ({ url: d.url, title: d.meta.title ?? d.url, excerpt: d.excerpt })) });
    }, 120);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [q]);

  const close = () => dialog.current?.close();
  // Pagefind's results once they arrive for this query; the static matches until then.
  const list: PagefindResult[] =
    full && full.q === q.trim() ? full.results : fallback.map((it) => ({ url: `${BASE}${it.href}`, title: it.title, excerpt: it.kind }));
  const nothing = q && quick.length === 0 && list.length === 0;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          loadPagefind();
          dialog.current?.showModal();
        }}
        className="press flex items-center gap-2 rounded-sm px-1.5 py-2 text-[#c9c4bb] hover:text-white sm:px-3"
        aria-haspopup="dialog"
        data-js-only
      >
        <MagnifyingGlass size={18} weight="regular" aria-hidden />
        <span className="hidden sm:inline">Search</span>
        <span className="sr-only sm:hidden">Search</span>
      </button>
      <dialog
        ref={dialog}
        aria-label="Search Terrarum"
        className="m-0 mx-auto mt-[10vh] w-[min(680px,calc(100vw-2rem))] overscroll-contain border border-[#2a313a] bg-[#151a20] p-0 text-[#e8e4dc] backdrop:bg-black/60"
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
            placeholder="Kyoto, torii, atolls…"
            autoComplete="off"
            spellCheck={false}
            className="h-14 flex-1 bg-transparent text-base outline-none focus-visible:outline-none placeholder:text-[#8b929a]"
          />
          <button type="button" onClick={close} className="press p-2 text-[#9aa1a8] hover:text-white">
            <X size={18} aria-hidden />
            <span className="sr-only">Close search</span>
          </button>
        </form>
        <div aria-live="polite" className="max-h-[64vh] overflow-y-auto">
          {!q && <p className="px-4 py-6 text-sm text-[#9aa1a8]">Search every page: countries, places, history, food, words.</p>}
          {nothing && (
            <p className="px-4 py-6 text-sm text-[#9aa1a8]">Nothing found for “{q}”. Some countries are still being researched.</p>
          )}
          {quick.length > 0 && (
            <ul className="border-b border-[#2a313a] py-2">
              {quick.map((it) => (
                <li key={it.href + it.title}>
                  <Link href={it.href} onClick={close} className="flex items-baseline justify-between gap-4 px-4 py-2.5 hover:bg-[#1c232b] focus-visible:bg-[#1c232b]">
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
          {q && list.length > 0 && (
            <ul className="py-2">
              {list.map((r) => (
                <li key={r.url}>
                  <Link href={r.url.replace(BASE, "") || "/"} onClick={close} className="block px-4 py-3 hover:bg-[#1c232b] focus-visible:bg-[#1c232b]">
                    <span className="block">{r.title.replace(/ · Terrarum$/, "")}</span>
                    <span
                      className="mt-1 block text-sm text-[#9aa1a8] [&_mark]:bg-transparent [&_mark]:font-semibold [&_mark]:text-[#e2b45a]"
                      // Pagefind escapes page text and adds only <mark> around matches.
                      dangerouslySetInnerHTML={{ __html: r.excerpt }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </dialog>
    </>
  );
}
