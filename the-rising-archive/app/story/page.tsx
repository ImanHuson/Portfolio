import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/typography/PageHeader";
import Reveal from "@/components/archive/Reveal";
import Stamp from "@/components/archive/Stamp";
import { BOOKS } from "@/lib/data/books";

export const metadata: Metadata = {
  title: "The Story",
  description: "The six published Red Rising novels, read as six chapters in the history of a civilization, plus the timeline they sit on.",
  alternates: { canonical: "./" },
};

export default function StoryPage() {
  return (
    <>
      <PageHeader
        trail={[{ href: "/", label: "Archive" }, { href: "/story/", label: "The Story" }]}
        title="Six chapters in the history of a civilization"
        lede="Not six plot summaries. Six stages of one revolution: the lie, the infiltration, the rising, the cost, the burning, and the way home."
      />

      <section aria-label="The six books" className="px-5 md:px-8">
        <ol className="mx-auto max-w-[1400px] border-t border-line" role="list">
          {BOOKS.map((b, i) => (
            <Reveal as="li" key={b.slug} delay={i * 0.03} className="border-b border-line">
              <Link
                href={`/story/books/${b.slug}/`}
                className="group grid items-center gap-4 py-8 md:grid-cols-[9rem_1fr_auto] md:gap-10 md:py-10"
              >
                <span className="font-display text-7xl leading-none font-extrabold text-line-strong transition-colors duration-300 group-hover:text-red md:text-8xl">
                  {b.numeral}
                </span>
                <span>
                  <span className="block font-display text-h3 leading-none font-bold uppercase">{b.title}</span>
                  <span className="mt-2 block font-serif text-xl text-ash italic">{b.subtitle}</span>
                </span>
                <span className="flex gap-6 font-mono text-meta tracking-[0.16em] text-ash-2 uppercase md:flex-col md:items-end md:gap-1">
                  <span>{b.published}</span>
                  <span>{b.narrators.length === 1 ? "Darrow narrates" : `${b.narrators.length} narrators`}</span>
                </span>
              </Link>
            </Reveal>
          ))}
          <li className="border-b border-line">
            <div className="grid items-center gap-4 py-8 opacity-80 md:grid-cols-[9rem_1fr_auto] md:gap-10 md:py-10">
              <span className="font-display text-7xl leading-none font-extrabold text-void-3 md:text-8xl">VII</span>
              <span>
                <span className="block font-display text-h3 leading-none font-bold text-ash-2 uppercase">Red God</span>
                <span className="mt-2 block font-serif text-xl text-ash-2 italic">Status: incomplete</span>
              </span>
              <Stamp kind="sealed" />
            </div>
          </li>
        </ol>
      </section>

      <section aria-label="More of the story" className="px-5 py-24 md:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-px bg-line md:grid-cols-2">
          <Link href="/story/timeline/" className="group bg-void p-10 transition-colors hover:bg-void-2">
            <span className="font-display text-h3 font-bold uppercase group-hover:text-red">The Timeline</span>
            <span className="mt-3 block max-w-[40ch] text-ash">
              Seven centuries, from the Conquering to the sealed file. Every node opens.
            </span>
          </Link>
          <Link href="/story/the-rising/" className="group bg-void p-10 transition-colors hover:bg-void-2">
            <span className="font-display text-h3 font-bold uppercase group-hover:text-red">The Rising</span>
            <span className="mt-3 block max-w-[40ch] text-ash">
              Not an organization. A movement, a war, a myth, and eventually a government.
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
