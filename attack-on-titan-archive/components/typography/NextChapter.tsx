import Link from "next/link";
import { CHAPTERS } from "@/lib/data/chapters";

/** The foot of every chapter: back one file, on to the next, or to the index.
 * `current` is this chapter's id. */
export default function NextChapter({ current }: { current: string }) {
  const i = CHAPTERS.findIndex((c) => c.id === current);
  const prev = CHAPTERS[i - 1];
  const next = CHAPTERS[i + 1];
  return (
    <nav aria-label="Chapters" className="border-t border-line px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:items-end md:gap-16">
        <div className="order-2 grid gap-4 md:order-1">
          {prev && (
            <Link href={prev.href ?? "/"} className="group flex items-baseline gap-3 text-ash transition-colors hover:text-paper">
              <span aria-hidden className="transition-transform duration-200 ease-[var(--ease-out)] motion-safe:[@media(hover:hover)]:group-hover:-translate-x-1">&larr;</span>
              <span>
                <span className="font-mono text-meta">{prev.id}</span> <span className="font-military tracking-[0.1em] uppercase">{prev.title}</span>
              </span>
            </Link>
          )}
          <Link href="/#index" className="group flex items-baseline gap-3 text-ash transition-colors hover:text-paper">
            <span aria-hidden>&uarr;</span>
            <span className="font-military tracking-[0.1em] uppercase">All chapters</span>
          </Link>
        </div>
        {next && (
          <Link href={next.href ?? "/"} className="file-link group relative order-1 block border border-line bg-base-2 p-6 md:order-2 md:p-10">
            <span className="font-mono text-meta text-ash">Next &middot; {next.id}</span>
            <span className="mt-3 flex items-end justify-between gap-6">
              <span className="font-display text-h2 leading-none font-bold text-paper">{next.title}</span>
              <span aria-hidden className="pb-1 text-h3 text-paper/60 transition-[color,transform] duration-200 ease-[var(--ease-out)] group-hover:text-paper motion-safe:[@media(hover:hover)]:group-hover:translate-x-1.5">
                &rarr;
              </span>
            </span>
            <span className="mt-4 block max-w-[52ch] text-ash transition-colors group-hover:text-paper/85">{next.line}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
