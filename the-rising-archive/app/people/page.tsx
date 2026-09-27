import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/typography/PageHeader";
import TenFaces from "@/components/people/TenFaces";
import { PEOPLE } from "@/lib/data/people";

export const metadata: Metadata = {
  title: "The Ten Faces of Power",
  description: "Ten Red Rising characters as ten ideas of power, from Darrow’s rebellion to the Jackal’s control. Not a ranking.",
  alternates: { canonical: "./" },
};

export default function PeoplePage() {
  return (
    <>
      <PageHeader
        trail={[{ href: "/", label: "Archive" }, { href: "/people/", label: "The People" }]}
        title="Ten faces of power"
        lede="Not a ranking. Ten people, ten ideas of what power is for. Switch the lens to read all ten the same way, then open any dossier."
      />
      <section aria-label="The ten" className="px-5 pb-24 md:px-8">
        <TenFaces />
        <noscript>
          <ul className="mx-auto mt-10 grid max-w-[1400px] gap-4">
            {PEOPLE.map((p) => (
              <li key={p.slug}>
                <a href={`/Portfolio/the-rising-archive/people/${p.slug}/`}>
                  {p.name}, {p.epithet}: {p.face}
                </a>
              </li>
            ))}
          </ul>
        </noscript>
      </section>
      <section aria-label="More of the people" className="px-5 pb-28 md:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-px bg-line md:grid-cols-2">
          <Link href="/people/relationships/" className="group bg-void p-10 transition-colors hover:bg-void-2">
            <span className="font-display text-h3 font-bold uppercase group-hover:text-red">The Constellation</span>
            <span className="mt-3 block max-w-[40ch] text-ash">Darrow at the center. Every line opens into the story of one relationship.</span>
          </Link>
          <Link href="/people/the-vale/" className="group bg-void p-10 transition-colors hover:bg-void-2">
            <span className="font-display text-h3 font-bold uppercase group-hover:text-red">The Vale</span>
            <span className="mt-3 block max-w-[40ch] text-ash">The dead, as memory rather than a body count.</span>
          </Link>
        </div>
      </section>
    </>
  );
}
