import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/typography/PageHeader";
import QuoteFigure from "@/components/archive/QuoteFigure";
import Reveal from "@/components/archive/Reveal";
import { EXTENDED } from "@/lib/data/extended";
import { PEOPLE, safeAs } from "@/lib/data/people";
import { BEST_LINES, TEN_QUOTES } from "@/lib/data/quotes";

export const metadata: Metadata = {
  title: "Words that survived",
  description: "The Red Rising Saga’s best lines, and one line for each of the archive’s twenty characters: short quotations, attributed, each sealed at the book it comes from.",
  alternates: { canonical: "./" },
};

const VOICES: { group: string; people: { slug: string; name: string }[] }[] = [
  { group: "The Ten Faces", people: PEOPLE.map((p) => ({ slug: p.slug, name: safeAs(p).name })) },
  { group: "The ones who deserve a place", people: EXTENDED.map((p) => ({ slug: p.slug, name: p.name })) },
];
const quoteFor = (slug: string) => TEN_QUOTES[slug] ?? EXTENDED.find((p) => p.slug === slug)?.words;

export default function QuotesPage() {
  return (
    <>
      <PageHeader
        tone="gold"
        trail={[
          { href: "/", label: "Archive" },
          { href: "/fandom/", label: "The Fandom" },
          { href: "/fandom/quotes/", label: "Quotes" },
        ]}
        title="Words that survived"
        lede="Short lines only, attributed to the right speaker, each sealed until the book it comes from. Anything longer is pointed to, not reproduced."
      />

      <section aria-labelledby="best-title" className="px-5 pb-24 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <h2 id="best-title" className="font-display text-h2 leading-none font-bold uppercase">
            The lines that stayed
          </h2>
          <p className="mt-4 max-w-[56ch] text-ash">The saga’s best lines, as this archive would choose them. A selection, not a ranking.</p>
          <ol className="mt-14 space-y-16 border-l border-line pl-6 md:pl-10">
            {BEST_LINES.map((q) => (
              <Reveal as="li" key={q.text}>
                <QuoteFigure q={q} showSpeaker />
              </Reveal>
            ))}
          </ol>
          <div className="mt-16 border-l-2 border-gold-dim pl-6">
            <p className="font-mono text-meta tracking-[0.2em] text-gold-deep uppercase">Memory fragment</p>
            <p className="mt-2 text-lede text-ash">“Break the chains.” The saga’s arc words, returning book after book.</p>
            <p className="mt-2 font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">See: across the saga</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="voices-title" className="border-t border-line px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <h2 id="voices-title" className="font-display text-h2 leading-none font-bold uppercase">
            Twenty voices
          </h2>
          <p className="mt-4 max-w-[56ch] text-ash">One line for each person in the archive, said by them or about them.</p>
          {VOICES.map((v) => (
            <div key={v.group} className="mt-16">
              <h3 className="font-mono text-meta tracking-[0.2em] text-ash-2 uppercase">{v.group}</h3>
              <ul role="list" className="mt-6 divide-y divide-line border-y border-line">
                {v.people.map((p) => {
                  const q = quoteFor(p.slug);
                  if (!q) return null;
                  return (
                    <li key={p.slug} className="grid gap-4 py-10 md:grid-cols-[14rem_1fr] md:gap-10">
                      <Link href={`/people/${p.slug}/`} className="self-start py-1 font-display text-xl font-semibold uppercase hover:text-red">
                        {p.name}
                      </Link>
                      <QuoteFigure q={q} size="md" />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <p className="mt-12 max-w-[64ch] text-sm text-ash-2">
            These lines are as quoted by readers’ archives (redrisingquotes.com and Goodreads), cross-checked where more than one source carried them. Where a source could only place a line in a trilogy, the archive says so rather than guessing the book.
          </p>
        </div>
      </section>
    </>
  );
}
