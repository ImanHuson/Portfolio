import type { Metadata } from "next";
import Link from "next/link";
import CardWash from "@/components/archive/CardWash";
import Stamp from "@/components/archive/Stamp";
import PageHeader from "@/components/typography/PageHeader";
import PeopleNav from "@/components/people/PeopleNav";
import ThemeMatrix from "@/components/people/ThemeMatrix";
import { getExtended } from "@/lib/data/extended";
import { getPerson, safeAs } from "@/lib/data/people";
import { CIRCLES } from "@/lib/data/themes";

export const metadata: Metadata = {
  title: "Themes and circles",
  description: "Twelve themes and five circles: how this fan archive reads the Red Rising Saga’s people, from Will and Honor to Sacrifice. An interpretation, not canon.",
  alternates: { canonical: "./" },
};

const nameOf = (slug: string) => {
  const p = getPerson(slug);
  return p ? safeAs(p).name : getExtended(slug)!.name;
};

export default function ThemesPage() {
  return (
    <>
      <PageHeader
        trail={[
          { href: "/people/", label: "The People" },
          { href: "/people/themes/", label: "Themes" },
        ]}
        title="What they carry"
        lede="Twelve ideas the saga keeps returning to, and the people it tests them on. This is how the archive reads them, not a classification the books make."
      >
        <Stamp kind="reading" className="mt-8" />
      </PageHeader>
      <PeopleNav current="/people/themes/" />

      <section aria-label="Thematic matrix" className="px-5 pb-24 md:px-8">
        <ThemeMatrix />
      </section>

      <section aria-labelledby="circles-title" className="border-t border-line px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <h2 id="circles-title" className="font-display text-h1 leading-[0.9] font-extrabold uppercase">
            Circles
          </h2>
          <p className="mt-6 max-w-[58ch] text-lede text-ash">
            Five groupings drawn by this archive. A person can stand in more than one. Lorn is both a Reaper’s teacher and a Knight.
          </p>
          <ul role="list" className="mt-12 grid hairline md:grid-cols-2 xl:grid-cols-3">
            {CIRCLES.map((c) => (
              <li key={c.name} className="bg-void">
                <div data-wash={c.name === "The Sovereigns" ? "gold" : "red"} className="wash-card h-full p-8">
                  <h3 className="font-display text-h3 leading-none font-bold uppercase">{c.name}</h3>
                  <p className="mt-2 font-mono text-meta tracking-[0.16em] text-ash uppercase">{c.theme}</p>
                  <p className="mt-5 max-w-[40ch] text-ash">{c.note}</p>
                  <ul role="list" className="mt-6 flex flex-wrap gap-x-4 gap-y-1">
                    {c.members.map((m) => (
                      <li key={m}>
                        <Link href={`/people/${m}/`} className="relative z-10 inline-block py-1 font-serif text-xl text-bone italic underline decoration-line-strong underline-offset-4 hover:text-red">
                          {nameOf(m)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <CardWash />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
