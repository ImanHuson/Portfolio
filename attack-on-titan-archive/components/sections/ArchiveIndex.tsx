import Link from "next/link";
import { ACTS } from "@/lib/data/chapters";

/** The file index, as a document on the desk: not a card grid. One sheet
 * per act, typed entries, a stamp where a chapter is still sealed. */
export default function ArchiveIndex() {
  return (
    <section id="index" aria-labelledby="index-title" className="relative overflow-hidden px-4 py-28 md:px-8 md:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(38,59,46,0.35),transparent_55%),radial-gradient(ellipse_at_85%_90%,rgba(59,56,50,0.4),transparent_50%)]" />
      <div className="relative mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
        <div className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)] lg:self-start">
          <h2 id="index-title" className="font-display text-h2 leading-[1.02] font-semibold text-paper">
            Recovered after the war.
          </h2>
          <p className="mt-6 max-w-[46ch] text-lede leading-relaxed text-paper/80">
            This archive was assembled from what survived: military records, research notes, intelligence files, and
            the testimony of the people who were there. It reads in order, the way the story does.
          </p>
          <p className="mt-6 max-w-[46ch] text-[0.95rem] text-ash">
            Everything past the first chapter spoils the story. If you have not finished it, stop at the Wall.
          </p>
        </div>

        <div className="flex flex-col gap-14">
          {ACTS.map((act, ai) => (
            <article
              key={act.name}
              aria-labelledby={`act-${ai}`}
              className="paper relative px-6 py-8 md:px-10 md:py-10"
              style={{ transform: `rotate(${[-0.6, 0.45, -0.3][ai]}deg)` }}
            >
              <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-ink/25 pb-4">
                <h3 id={`act-${ai}`} className="font-display text-h3 font-extrabold tracking-[0.04em] text-ink uppercase">
                  {act.name}
                </h3>
                <p className="font-mono text-[0.72rem] tracking-[0.08em] text-ink/60 uppercase">Survey Corps Archive</p>
              </header>
              <p className="mt-4 max-w-[52ch] font-display text-[1.02rem] text-ink/75 italic">{act.register}</p>
              <ol className="mt-6 flex flex-col">
                {act.chapters.map((c) => {
                  const body = (
                    <>
                      <span className="font-mono text-[0.72rem] tracking-[0.1em] text-ink/55">{c.id}</span>
                      <span>
                        <span className="block font-military text-[1.35rem] leading-tight font-semibold tracking-[0.12em] text-ink uppercase">
                          {c.title}
                        </span>
                        <span className="mt-1 block text-[0.95rem] leading-snug text-ink/70">{c.line}</span>
                      </span>
                      {c.open ? (
                        <span className="font-mono text-[0.72rem] tracking-[0.14em] text-scout uppercase">Open</span>
                      ) : (
                        <span className="stamp text-[0.68rem]">Sealed</span>
                      )}
                    </>
                  );
                  const cls = "grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 py-4";
                  return (
                    <li key={c.id} className="border-t border-ink/10 first:border-t-0">
                      {c.open && c.href ? (
                        <Link href={c.href} className={`${cls} transition-colors hover:bg-ink/5`}>
                          {body}
                        </Link>
                      ) : (
                        <div className={cls}>{body}</div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
