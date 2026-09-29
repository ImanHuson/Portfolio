"use client";

import Link from "next/link";
import CardWash from "@/components/archive/CardWash";
import FramedPortrait from "@/components/archive/FramedPortrait";
import { useArchive } from "@/components/providers/ArchiveProvider";
import { EXTENDED } from "@/lib/data/extended";
import { BOOK_TITLES } from "@/lib/data/spoilers";
import { NAME_CLASS } from "@/lib/registers";
import { cn } from "@/lib/utils";

/** The ones who deserve a place: a curated second collection, deliberately
 * laid out as a register of files, not a ranked grid. */
export default function ExtendedArchive() {
  const { clearance } = useArchive();
  return (
    <ul role="list" className="mx-auto grid max-w-[1400px] gap-px bg-line lg:grid-cols-2">
      {EXTENDED.map((p) => {
        const line = clearance >= p.lineBook ? p.line : p.lineEarly;
        return (
          <li key={p.slug} className="bg-void">
            <Link
              href={`/people/${p.slug}/`}
              data-wash={p.wash}
              className="wash-card group grid h-full grid-cols-[5.5rem_1fr] gap-5 bg-void p-6 sm:grid-cols-[8rem_1fr] md:p-8"
            >
              <FramedPortrait slug={p.slug} name={p.name} size="card" sizes="128px" />
              <div className="min-w-0">
                <p className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">
                  {p.color} · {p.origin}
                </p>
                <h3 className={cn("mt-2 text-3xl leading-[0.95] md:text-4xl", NAME_CLASS[p.register])}>{p.name}</h3>
                <p className="mt-1 text-ash">{p.epithet}</p>
                {line ? (
                  <p className="mt-4 max-w-[44ch] font-serif text-lg text-bone/90 italic">{line}</p>
                ) : (
                  <p className="mt-4 font-mono text-meta tracking-[0.16em] text-ash-2 uppercase">Their line opens after {BOOK_TITLES[p.lineBook]}</p>
                )}
                {p.easter === "minotaur" && (
                  <p className="mt-3 font-display text-lg font-bold tracking-[0.2em] gold-foil uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                    The Minotaur approaches.
                  </p>
                )}
                <span className="mt-5 block font-mono text-meta tracking-[0.18em] text-ash uppercase transition-colors group-hover:text-red">
                  Open dossier <span aria-hidden>→</span>
                </span>
              </div>
              <CardWash />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
