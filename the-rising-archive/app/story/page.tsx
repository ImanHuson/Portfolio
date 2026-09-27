import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/typography/PageHeader";
import Plate from "@/components/archive/Plate";
import Reveal from "@/components/archive/Reveal";
import Stamp from "@/components/archive/Stamp";
import { BOOKS } from "@/lib/data/books";
import Spotlight from "@/components/archive/Spotlight";

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
              <Spotlight tone="red" className="h-full">
              <Link
                href={`/story/books/${b.slug}/`}
                className="group grid grid-cols-[5rem_1fr] items-center gap-5 py-8 md:grid-cols-[7rem_9rem_1fr_auto] md:gap-10 md:py-10"
              >
                <Plate src={`/images/books/${b.slug}.webp`} alt="" width={900} height={1350} className="w-20 transition-transform duration-500 group-hover:-translate-y-1 md:w-28" sizes="112px" />
                <span className="hidden font-display text-7xl leading-none font-extrabold text-line-strong transition-colors duration-300 group-hover:text-red md:block md:text-8xl">
                  {b.numeral}
                </span>
                <span>
                  <span className="block font-display text-h3 leading-none font-bold uppercase">{b.title}</span>
                  <span className="mt-2 block font-serif text-xl text-ash italic">{b.subtitle}</span>
                </span>
                <span className="col-start-2 flex gap-6 font-mono text-meta tracking-[0.16em] text-ash-2 uppercase md:col-start-auto md:flex-col md:items-end md:gap-1">
                  <span>{b.published}</span>
                  <span>{b.narrators.length === 1 ? "Darrow narrates" : `${b.narrators.length} narrators`}</span>
                </span>
              </Link>
              </Spotlight>
            </Reveal>
          ))}
          <li className="border-b border-line">
            <Link href="/sealed/" className="group grid grid-cols-[5rem_1fr] items-center gap-5 py-8 opacity-80 transition-opacity hover:opacity-100 md:grid-cols-[7rem_9rem_1fr_auto] md:gap-10 md:py-10">
              <span aria-hidden className="block aspect-[2/3] w-20 border border-dashed border-line-strong md:w-28" />
              <span className="hidden font-display text-7xl leading-none font-extrabold text-void-3 group-hover:text-red-deep md:block md:text-8xl">VII</span>
              <span>
                <span className="block font-display text-h3 leading-none font-bold text-ash-2 uppercase">Red God</span>
                <span className="mt-2 block font-serif text-xl text-ash-2 italic">Status: incomplete</span>
              </span>
              <Stamp kind="sealed" className="col-start-2 justify-self-start md:col-start-auto" />
            </Link>
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
