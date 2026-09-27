import type { Metadata } from "next";
import PageHeader from "@/components/typography/PageHeader";
import Timeline from "@/components/sections/Timeline";
import { TIMELINE } from "@/lib/data/timeline";
import { BOOK_TITLES } from "@/lib/data/spoilers";

export const metadata: Metadata = {
  title: "The Timeline",
  description: "The history of the Red Rising Saga, from the Conquering to the sealed file: dates, places, participants and the dead.",
  alternates: { canonical: "./" },
};

export default function TimelinePage() {
  return (
    <>
      <PageHeader
        trail={[{ href: "/story/", label: "The Story" }, { href: "/story/timeline/", label: "Timeline" }]}
        title="Seven centuries of a lie"
        lede="PCE counts the years since the Conquering. Dates appear only where the record fixes them; otherwise an event is placed by the book that tells it."
      />
      <section aria-label="Timeline" className="px-5 pb-32 md:px-8">
        <Timeline />
        {/* JS-free record of every node, still spoiler-sealed via native <details>. */}
        <noscript>
          <ul className="mx-auto mt-16 grid max-w-[1100px] gap-6">
            {TIMELINE.map((n) => (
              <li key={n.slug}>
                <strong>{n.title}</strong> ({n.when})
                {n.book > 0 ? (
                  <details className="spoiler mt-2">
                    <summary className="text-ash">Sealed. Contains {BOOK_TITLES[n.book]}. Open</summary>
                    <p>{n.summary}</p>
                  </details>
                ) : (
                  <p>{n.summary}</p>
                )}
              </li>
            ))}
          </ul>
        </noscript>
      </section>
    </>
  );
}
