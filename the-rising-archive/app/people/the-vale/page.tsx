import type { Metadata } from "next";
import PageHeader from "@/components/typography/PageHeader";
import Vale from "@/components/people/Vale";
import { VALE } from "@/lib/data/vale";
import { BOOK_TITLES } from "@/lib/data/spoilers";

export const metadata: Metadata = {
  title: "The Vale",
  description: "A memorial to the dead of the Red Rising Saga: who they were, who they left behind, and what their deaths meant.",
  alternates: { canonical: "./" },
};

export default function ValePage() {
  return (
    <>
      <PageHeader
        tone="rim"
        trail={[{ href: "/people/", label: "The People" }, { href: "/people/the-vale/", label: "The Vale" }]}
        title="The Vale"
        lede="The Reds’ word for what comes after. Everyone here is dead. Stars past your clearance stay unnamed. Choose one, and the archive goes quiet."
      />
      <section aria-label="Memorial" className="px-5 pb-32 md:px-8">
        <Vale />
        <p className="mx-auto mt-6 max-w-[1400px] font-mono text-meta tracking-[0.16em] text-ash-2 uppercase">
          Earlier deaths sit higher, like older light. Ages are left out on purpose: the record rarely fixes them.
        </p>
        <noscript>
          <ul className="mx-auto mt-12 grid max-w-[1100px] gap-6">
            {VALE.map((m) => (
              <li key={m.slug}>
                <details className="spoiler">
                  <summary className="text-ash">A star from {BOOK_TITLES[m.book]}. Open</summary>
                  <p>
                    <strong>{m.name}</strong>. {m.how} {m.meaning}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </noscript>
      </section>
    </>
  );
}
