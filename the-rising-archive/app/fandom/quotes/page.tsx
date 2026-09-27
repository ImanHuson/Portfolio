import type { Metadata } from "next";
import PageHeader from "@/components/typography/PageHeader";
import Reveal from "@/components/archive/Reveal";
import Stamp from "@/components/archive/Stamp";
import { WORDS } from "@/lib/data/fandom";

export const metadata: Metadata = {
  title: "Words that survived",
  description: "Short, verified Red Rising quotations, correctly attributed. Everything longer is cited, not reproduced.",
  alternates: { canonical: "./" },
};

export default function QuotesPage() {
  return (
    <>
      <PageHeader
        tone="gold"
        trail={[{ href: "/", label: "Archive" }, { href: "/fandom/", label: "The Fandom" }, { href: "/fandom/quotes/", label: "Quotes" }]}
        title="Words that survived"
        lede="Only short quotations the archive could verify, attributed to the right speaker. Anything longer becomes a memory fragment: a pointer to the page, not a copy of it."
      />
      <section aria-label="Quotations" className="px-5 pb-28 md:px-8">
        <div className="mx-auto max-w-[1100px] divide-y divide-line border-t border-line">
          {WORDS.map((g) => (
            <Reveal key={g.group} className="grid gap-8 py-14 md:grid-cols-[16rem_1fr]">
              <h2 className="font-mono text-meta tracking-[0.2em] text-ash-2 uppercase md:pt-3">{g.group}</h2>
              <div className="space-y-10">
                {g.quotes.length === 0 && !g.fragments && (
                  <div className="flex flex-wrap items-center gap-4">
                    <p className="font-serif text-2xl text-ash-2 italic">Nothing here has cleared verification yet.</p>
                    <Stamp kind="unknown" />
                  </div>
                )}
                {g.quotes.map((q) => (
                  <figure key={q.text}>
                    <blockquote className="font-serif text-h2 leading-tight text-bone italic">{q.text}</blockquote>
                    <figcaption className="mt-4 font-mono text-meta tracking-[0.18em] text-ash uppercase">
                      {q.who}, <span className="text-ash-2">{q.where}</span>
                    </figcaption>
                  </figure>
                ))}
                {g.fragments?.map((f) => (
                  <div key={f.note} className="border-l-2 border-gold-dim pl-6">
                    <p className="font-mono text-meta tracking-[0.2em] text-gold-dim uppercase">Memory fragment</p>
                    <p className="mt-2 text-lede text-ash">{f.note}</p>
                    <p className="mt-2 font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">See: {f.where}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
