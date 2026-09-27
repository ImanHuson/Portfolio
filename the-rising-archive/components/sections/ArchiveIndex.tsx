import Link from "next/link";
import Reveal from "@/components/archive/Reveal";

const DEEP = [
  { href: "/story/timeline/", title: "The Timeline", body: "From the Conquering to the sealed file." },
  { href: "/people/relationships/", title: "The Constellation", body: "Everyone Darrow loved, lost, or fought." },
  { href: "/people/the-vale/", title: "The Vale", body: "The dead, remembered by name." },
];

export default function ArchiveIndex() {
  return (
    <section aria-labelledby="index-title" className="border-t border-line px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <p className="font-mono text-meta tracking-[0.22em] text-red uppercase">The archive</p>
        <h2 id="index-title" className="mt-4 max-w-[16ch] font-display text-h2 leading-[0.9] font-bold uppercase">
          Where do you want to begin?
        </h2>

        <div className="mt-16 grid gap-px bg-line md:grid-cols-[7fr_5fr]">
          <Reveal>
            <Link
              href="/story/"
              className="group relative flex min-h-[26rem] flex-col justify-end overflow-hidden bg-void p-8 md:p-12"
            >
              <span
                aria-hidden
                className="absolute -top-10 -right-6 font-display text-[16rem] leading-none font-extrabold text-void-3 transition-colors duration-500 group-hover:text-red-deep/60"
              >
                VI
              </span>
              <span className="relative font-display text-h2 leading-none font-bold uppercase">The Story</span>
              <span className="relative mt-4 max-w-[40ch] text-ash">
                Six books as six chapters in the history of a civilization, and the timeline they sit on.
              </span>
              <span className="relative mt-8 font-mono text-meta tracking-[0.2em] text-bone uppercase group-hover:text-red">
                Open the story
              </span>
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <Link
              href="/people/"
              className="group relative flex min-h-[26rem] flex-col justify-end overflow-hidden bg-void p-8 md:p-12"
            >
              <span
                aria-hidden
                className="absolute -top-6 -right-4 font-display text-[16rem] leading-none font-extrabold text-void-3 transition-colors duration-500 group-hover:text-red-deep/60"
              >
                X
              </span>
              <span className="relative font-display text-h2 leading-none font-bold uppercase">The People</span>
              <span className="relative mt-4 max-w-[36ch] text-ash">
                Ten faces of power, their dossiers, and what the war took from each of them.
              </span>
              <span className="relative mt-8 font-mono text-meta tracking-[0.2em] text-bone uppercase group-hover:text-red">
                Open the dossiers
              </span>
            </Link>
          </Reveal>
        </div>

        <ul className="mt-px grid gap-px bg-line md:grid-cols-3" role="list">
          {DEEP.map((d) => (
            <li key={d.href} className="bg-void">
              <Link href={d.href} className="group block p-8 transition-colors hover:bg-void-2">
                <span className="font-display text-2xl font-semibold uppercase group-hover:text-red">{d.title}</span>
                <span className="mt-2 block text-sm text-ash">{d.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
