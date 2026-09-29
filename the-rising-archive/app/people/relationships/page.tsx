import type { Metadata } from "next";
import PageHeader from "@/components/typography/PageHeader";
import Constellation from "@/components/people/Constellation";
import Network from "@/components/people/Network";
import PeopleNav from "@/components/people/PeopleNav";
import { safeAs, getPerson } from "@/lib/data/people";
import { getExtended } from "@/lib/data/extended";
import { KINDS, LINKS } from "@/lib/data/network";
import { BONDS } from "@/lib/data/relationships";
import { BOOK_TITLES } from "@/lib/data/spoilers";

export const metadata: Metadata = {
  title: "The Constellation",
  description: "Darrow’s relationships in the Red Rising Saga followed from first scene to last, and the full network of the archive’s twenty people: family, friendship, rivalry, betrayal.",
  alternates: { canonical: "./" },
};

export default function RelationshipsPage() {
  return (
    <>
      <PageHeader
        trail={[{ href: "/people/", label: "The People" }, { href: "/people/relationships/", label: "Constellation" }]}
        title="The constellation"
        lede="Not a paragraph saying it’s complicated. Every line is a sequence of events, and you can follow it."
      />
      <PeopleNav current="/people/relationships/" />
      <section aria-label="Relationship constellation" className="px-5 pb-32 md:px-8">
        <Constellation />
        <noscript>
          <ul className="mx-auto mt-12 grid max-w-[1100px] gap-6">
            {BONDS.map((b) => (
              <li key={b.slug}>
                <strong>Darrow and {b.name}</strong>, {b.kind}
                <details className="spoiler mt-2">
                  <summary className="text-ash">Sealed. Contains {BOOK_TITLES[Math.max(...b.arc.map((s) => s.book))]}. Open</summary>
                  <p>{b.arc.map((s) => s.label).join(", then ")}. {b.note}</p>
                </details>
              </li>
            ))}
          </ul>
        </noscript>
      </section>

      <section aria-labelledby="network-title" className="border-t border-line px-5 pt-24 pb-32 md:px-8">
        <div className="mx-auto mb-10 max-w-[1400px]">
          <h2 id="network-title" className="font-display text-h1 leading-[0.9] font-extrabold uppercase">
            The whole web
          </h2>
          <p className="mt-6 max-w-[60ch] text-lede text-ash">
            Beyond Darrow: all twenty people in the archive and the lines between them. A line can change over the books, from friendship to betrayal and back, and the map shows the latest one your clearance allows.
          </p>
        </div>
        <Network />
        <noscript>
          <ul className="mx-auto mt-12 grid max-w-[1100px] gap-4">
            {LINKS.map((l) => {
              const nm = (slug: string) => {
                const p = getPerson(slug);
                return p ? safeAs(p).name : getExtended(slug)?.name ?? slug;
              };
              // One seal per stage: a later stage must not open with an earlier one.
              return l.stages.map((st) => (
                <li key={`${l.a}-${l.b}-${st.book}`}>
                  <details className="spoiler">
                    <summary className="text-ash">Sealed. Contains {BOOK_TITLES[st.book]}. Open</summary>
                    <p>
                      <strong>
                        {nm(l.a)} and {nm(l.b)}
                      </strong>
                      : {KINDS.find((k) => k.key === st.kind)!.label}. {st.note}
                    </p>
                  </details>
                </li>
              ));
            })}
          </ul>
        </noscript>
      </section>
    </>
  );
}
