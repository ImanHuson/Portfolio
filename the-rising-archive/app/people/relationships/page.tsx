import type { Metadata } from "next";
import PageHeader from "@/components/typography/PageHeader";
import Constellation from "@/components/people/Constellation";
import { BONDS } from "@/lib/data/relationships";
import { BOOK_TITLES } from "@/lib/data/spoilers";

export const metadata: Metadata = {
  title: "The Constellation",
  description: "Darrow’s relationships in the Red Rising Saga, from Eo to Lysander, each followed from its first scene to its last.",
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
    </>
  );
}
