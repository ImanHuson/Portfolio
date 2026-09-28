import type { Metadata } from "next";
import Link from "next/link";
import CardWash from "@/components/archive/CardWash";
import PageHeader from "@/components/typography/PageHeader";
import TenFaces from "@/components/people/TenFaces";
import ExtendedArchive from "@/components/people/ExtendedArchive";
import PeopleNav from "@/components/people/PeopleNav";
import TheyAreTheStory from "@/components/people/TheyAreTheStory";
import { PEOPLE, safeAs } from "@/lib/data/people";

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
      <PeopleNav />
      <section id="ten" aria-label="The ten" className="scroll-mt-24 px-5 pb-24 md:px-8">
        <TenFaces />
        <noscript>
          <ul className="mx-auto mt-10 grid max-w-[1400px] gap-4">
            {PEOPLE.map((p) => (
              <li key={p.slug}>
                <a href={`/Portfolio/the-rising-archive/people/${p.slug}/`}>
                  {safeAs(p).name}, {safeAs(p).epithet}: {p.face}
                </a>
              </li>
            ))}
          </ul>
        </noscript>
      </section>
      <section id="extended" aria-labelledby="extended-title" className="scroll-mt-24 border-t border-line px-5 pt-24 pb-24 md:px-8">
        <div className="mx-auto mb-12 max-w-[1400px]">
          <h2 id="extended-title" className="font-display text-h1 leading-[0.9] font-extrabold uppercase">
            The ones who deserve a place
          </h2>
          <p className="mt-4 font-serif text-h3 text-bone/90 italic">Not ranked. Not forgotten.</p>
          <p className="mt-6 max-w-[58ch] text-lede text-ash">
            The saga is too large for ten names. These are the characters who changed the shape of the story, challenged its ideas, broke its people, or simply refused to disappear from memory.
          </p>
        </div>
        <ExtendedArchive />
      </section>
      <section aria-label="More of the people" className="px-5 pb-28 md:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-px bg-line md:grid-cols-2">
          <Link href="/people/relationships/" className="group bg-void p-10 wash-card">
            <span className="font-display text-h3 font-bold uppercase group-hover:text-red">The Constellation</span>
            <span className="mt-3 block max-w-[40ch] text-ash">Darrow at the center. Every line opens into the story of one relationship.</span>
            <CardWash />
          </Link>
          <Link data-wash="rim" href="/people/the-vale/" className="group bg-void p-10 wash-card">
            <span className="font-display text-h3 font-bold uppercase group-hover:text-red">The Vale</span>
            <span className="mt-3 block max-w-[40ch] text-ash">The dead, as memory rather than a body count.</span>
            <CardWash />
          </Link>
        </div>
      </section>
      <TheyAreTheStory />
    </>
  );
}
