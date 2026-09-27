import type { Metadata } from "next";
import PageHeader from "@/components/typography/PageHeader";
import { SOURCES } from "@/lib/data/author";

export const metadata: Metadata = {
  title: "Official sources",
  description: "Where to find Pierce Brown’s own notes, interviews and news, and the sources this archive checked its facts against.",
  alternates: { canonical: "./" },
};

export default function SourcesPage() {
  return (
    <>
      <PageHeader
        trail={[{ href: "/", label: "Archive" }, { href: "/author/", label: "The Author" }, { href: "/author/sources/", label: "Sources" }]}
        title="Official sources"
        lede="The author’s notes and interviews live with the author, not here. These are the places to read them, and the places this archive checked its facts."
      />
      <section aria-label="Sources" className="px-5 pb-28 md:px-8">
        <ul role="list" className="mx-auto max-w-[1100px] divide-y divide-line border-y border-line">
          {SOURCES.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="group grid gap-2 py-7 md:grid-cols-[20rem_1fr] md:gap-10">
                <span className="font-display text-2xl font-bold uppercase group-hover:text-red">{s.label}</span>
                <span className="text-ash">{s.note}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
