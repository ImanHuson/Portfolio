import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import SpoilerGate from "@/components/archive/SpoilerGate";
import PageHeader from "@/components/typography/PageHeader";
import ArchiveSearch from "@/components/people/ArchiveSearch";
import PeopleNav from "@/components/people/PeopleNav";
import { CAST, getCast } from "@/lib/data/cast";
import { getExtended } from "@/lib/data/extended";
import { getPerson, safeAs } from "@/lib/data/people";
import { BOOK_TITLES } from "@/lib/data/spoilers";

export const metadata: Metadata = {
  title: "The complete cast",
  description: "Search the archive by name, Color, House, trait, theme or book, and the Red Rising Saga’s wider cast in short, spoiler-sealed entries.",
  alternates: { canonical: "./" },
};

function related(slug: string) {
  const p = getPerson(slug);
  if (p) return { href: `/people/${slug}/`, name: safeAs(p).name };
  const e = getExtended(slug);
  if (e) return { href: `/people/${slug}/`, name: e.name };
  const c = getCast(slug);
  return c ? { href: `#${slug}`, name: c.name } : null;
}

const BOOKS = [1, 2, 3, 4, 5, 6].filter((b) => CAST.some((c) => c.book === b));

export default function CastPage() {
  return (
    <>
      <PageHeader
        trail={[
          { href: "/people/", label: "The People" },
          { href: "/people/cast/", label: "Complete cast" },
        ]}
        title="The complete cast"
        lede="Not every name gets a dossier. These are the people around the twenty: short entries, each sealed until the book where they matter first."
      />
      <PeopleNav current="/people/cast/" />

      <section id="search" aria-label="Search" className="scroll-mt-24 px-5 pb-24 md:px-8">
        <Suspense fallback={<p className="mx-auto max-w-[1400px] text-ash">Search needs JavaScript. The whole cast is listed below.</p>}>
          <ArchiveSearch />
        </Suspense>
      </section>

      <section aria-labelledby="cast-title" className="border-t border-line px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <h2 id="cast-title" className="font-display text-h1 leading-[0.9] font-extrabold uppercase">
            Everyone else
          </h2>
          <p className="mt-6 max-w-[62ch] text-ash">
            Only people who could be checked against sources are here. Each entry says who someone is when you first meet them, never how their story ends.
          </p>
          {BOOKS.map((b) => (
            <div key={b} className="mt-16">
              <h3 className="font-mono text-meta tracking-[0.2em] text-ash-2 uppercase">First met in {BOOK_TITLES[b]}</h3>
              <ul role="list" className="mt-6 grid gap-px bg-line md:grid-cols-2 xl:grid-cols-3">
                {CAST.filter((c) => c.book === b).map((c) => (
                  <li key={c.slug} id={c.slug} className="scroll-mt-28 bg-void p-6 md:p-7">
                    <p className="font-display text-2xl leading-tight font-bold uppercase">{c.name}</p>
                    <p className="mt-1 font-mono text-meta tracking-[0.16em] text-ash uppercase">{c.color}</p>
                    <SpoilerGate book={c.book} compact className="mt-4">
                      <p className="mt-4 font-mono text-meta tracking-[0.16em] text-ash-2 uppercase">{c.role}</p>
                      <p className="mt-2 text-bone/90">{c.line}</p>
                      {c.related.length > 0 && (
                        <p className="mt-3 text-sm text-ash">
                          Related:{" "}
                          {c.related
                            .map(related)
                            .filter((r): r is { href: string; name: string } => r !== null)
                            .map((r, i) => (
                              <span key={r.href}>
                                {i > 0 && ", "}
                                <Link href={r.href} className="inline-block py-1 text-ash underline decoration-line-strong underline-offset-4 hover:text-bone">
                                  {r.name}
                                </Link>
                              </span>
                            ))}
                        </p>
                      )}
                    </SpoilerGate>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
