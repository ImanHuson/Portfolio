import Link from "next/link";
import { ACTS, type Chapter } from "@/lib/data/chapters";
import { asset, cn } from "@/lib/utils";

function ChapterCard({ c, feature }: { c: Chapter; feature?: boolean }) {
  return (
    <Link href={c.href ?? "/"} className={cn("file-link group relative flex w-full flex-col border border-line bg-base-2", feature && "md:grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]")}>
      {c.image ? (
        <span className={cn("relative block overflow-hidden", feature ? "aspect-[16/10]" : "aspect-[4/3]")}>
          <img
            src={asset(c.image)}
            alt=""
            width={1680}
            height={1050}
            loading="lazy"
            className="size-full object-cover grayscale-[0.4] transition-[filter,transform] duration-700 ease-[var(--ease-out)] group-hover:grayscale-0 motion-safe:group-hover:scale-[1.03]"
          />
          <span aria-hidden className={cn("absolute inset-0 bg-gradient-to-t from-base-2/80 to-transparent to-40%", feature && "md:bg-gradient-to-l md:from-base-2/60 md:to-30%")} />
        </span>
      ) : (
        // the ending files: no picture on the index, it would give them away
        <span aria-hidden className="sealed-plate relative flex aspect-[4/3] items-center justify-center overflow-hidden">
          <span className="font-display text-[clamp(3rem,2rem+4vw,5.5rem)] font-bold text-paper/[0.07]">{c.id.slice(-2)}</span>
          <span className="stamp absolute right-4 bottom-4 text-meta">Sealed</span>
        </span>
      )}
      <span className={cn("flex flex-1 flex-col p-5 md:p-6", feature && "md:justify-end md:p-8")}>
        <span className="font-mono text-meta text-ash">{c.id}</span>
        <span className={cn("mt-2 flex items-baseline justify-between gap-4 font-display leading-none font-bold text-paper", feature ? "text-[clamp(1.8rem,1rem+1.6vw,2.5rem)]" : "text-h3")}>
          {c.title}
          <span aria-hidden className="text-[1.1rem] text-paper/40 transition-[color,transform] duration-300 group-hover:translate-x-1 group-hover:text-paper">
            &rarr;
          </span>
        </span>
        <span className="mt-3 block max-w-[46ch] text-[0.975rem] leading-snug text-ash transition-colors group-hover:text-paper/85">{c.line}</span>
      </span>
    </Link>
  );
}

/** The table of contents: ten files in three acts, each one a picture of
 * where it takes you, so choosing is by sight as well as by title. */
export default function ArchiveIndex() {
  return (
    <section id="index" aria-labelledby="index-title" className="relative px-4 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-6 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-end md:gap-16">
          <h2 id="index-title" className="font-display text-h1 leading-[0.95] font-bold text-paper">
            Ten files, in the order it happened.
          </h2>
          <div className="grid max-w-[46ch] gap-4">
            <p className="text-lede leading-relaxed text-paper/80">
              Military records, research notes, intelligence files and the people who were there, recovered after the war.
            </p>
            <p className="text-[0.95rem] text-ash">Everything past The Wall spoils the story. If you have not finished it, start there and stop there.</p>
          </div>
        </div>

        <div className="mt-20 grid gap-20 md:mt-28 md:gap-24">
          {ACTS.map((act, ai) => (
            <section key={act.name} aria-labelledby={`act-${ai}`} className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:gap-12">
              <header className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start">
                <h3 id={`act-${ai}`} className="font-display text-h2 leading-none font-bold text-paper">
                  {act.name}
                </h3>
                <p className="mt-4 max-w-[34ch] font-serif text-[1.1rem] leading-snug text-paper/70 italic">{act.register}</p>
              </header>
              <ol className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-6">
                {act.chapters.map((c, i) => {
                  // the act's first file leads, full width; the rest share the row below it evenly
                  const feature = i === 0 && !!c.image;
                  const rest = act.chapters.length - (act.chapters[0].image ? 1 : 0);
                  const k = feature ? -1 : i - (act.chapters[0].image ? 1 : 0);
                  return (
                    <li
                      key={c.id}
                      className={cn(
                        "flex",
                        feature ? "sm:col-span-2 lg:col-span-6" : rest === 3 ? "lg:col-span-2" : "lg:col-span-3",
                        !feature && rest % 2 === 1 && k === rest - 1 && "sm:col-span-2 lg:col-span-2",
                      )}
                    >
                      <ChapterCard c={c} feature={feature} />
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
