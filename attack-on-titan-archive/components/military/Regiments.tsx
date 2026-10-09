import Link from "next/link";
import Sealed from "@/components/archive/Sealed";
import { BRANCHES } from "@/lib/data/military";
import { getPerson } from "@/lib/data/people";
import { asset, cn } from "@/lib/utils";

/** One file per branch, alternating sides: what it is for, who gets in, who
 * led it, who served, and the one entry its record is remembered by. */
export default function Regiments() {
  return (
    <div className="mx-auto grid max-w-[1400px] gap-24 md:gap-32">
      {BRANCHES.map((b, i) => (
        <article key={b.id} id={b.id} aria-labelledby={`${b.id}-name`} className="grid scroll-mt-[calc(var(--nav-h)+2rem)] gap-10 lg:grid-cols-12 lg:gap-12">
          <header className={cn("lg:col-span-5 lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start", i % 2 === 1 && "lg:order-2 lg:col-start-8")}>
            <p className="font-mono text-meta text-ash">
              Regiment file {String(i + 1).padStart(2, "0")} &middot; {b.emblem}
            </p>
            <h2 id={`${b.id}-name`} className="mt-3 font-display text-h2 leading-none font-bold text-paper">
              {b.name}
            </h2>
            <p className="mt-6 max-w-[48ch] font-serif text-lede leading-snug text-paper/85 italic">{b.role}</p>
          </header>

          <div className={cn("grid min-w-0 gap-10 lg:col-span-7", i % 2 === 1 && "lg:order-1 lg:col-span-6")}>
            <dl className="grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-2 border-t border-line pt-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-y-6">
              <dt className={label}>Who joins</dt>
              <dd className="mb-4 max-w-[60ch] leading-relaxed text-paper/85 sm:mb-0">{b.joins}</dd>
              <dt className={label}>Command</dt>
              <dd className="mb-4 sm:mb-0">
                <ol className="grid gap-3">
                  {b.command.map((c) => (
                    <li key={c.name + c.note}>
                      {c.sealed ? (
                        <Sealed label={`Sealed: who became ${c.note.toLowerCase()}`} chapter={c.sealed}>
                          <Commander {...c} />
                        </Sealed>
                      ) : (
                        <Commander {...c} />
                      )}
                    </li>
                  ))}
                </ol>
              </dd>
              <dt className={label}>On record</dt>
              <dd className="max-w-[60ch] leading-relaxed text-paper/85">{b.record}</dd>
            </dl>

            {b.sealed && (
              <Sealed label={`Sealed: ${b.sealed.label}`} chapter={b.sealed.chapter}>
                <p className="max-w-[60ch] leading-relaxed text-paper/85">{b.sealed.text}</p>
                <ul className="mt-4 grid max-w-sm grid-cols-3 gap-3">
                  {["reiner", "annie"].map((s) => (
                    <li key={s}>
                      <PersonChip slug={s} />
                    </li>
                  ))}
                </ul>
              </Sealed>
            )}

            {b.named && (
              <div>
                <p className={label}>Also on record</p>
                <ul className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-5 sm:grid-cols-2">
                  {b.named.map((n) => (
                    <li key={n.name} className="border-l border-line pl-4">
                      <p className="font-military text-[1.1rem] font-semibold tracking-[0.08em] text-paper uppercase">{n.name}</p>
                      <p className="mt-1 max-w-[46ch] leading-relaxed text-paper/80">{n.note}</p>
                      {n.sealed && (
                        <Sealed label="Sealed: what became of him" chapter={n.sealed.chapter} className="mt-3">
                          <p className="leading-relaxed text-paper/85">{n.sealed.text}</p>
                        </Sealed>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[0.9rem] text-ash">No personnel file yet: these files need a photograph.</p>
              </div>
            )}

            {b.members.length > 0 && (
              <div>
                <p className={label}>Files in the archive</p>
                <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {b.members.map((s) => (
                    <li key={s}>
                      <PersonChip slug={s} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

const label = "font-military text-[0.95rem] font-semibold tracking-[0.14em] text-ash uppercase";

function Commander({ name, note, slug }: { name: string; note: string; slug?: string }) {
  return (
    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="font-military text-[1.1rem] font-semibold tracking-[0.08em] text-paper uppercase">{name}</span>
      <span className="text-ash">{note}</span>
      {slug && (
        <Link href={`/soldiers/${slug}/`} className="font-mono text-meta text-ash underline decoration-line-strong underline-offset-4 transition-colors hover:text-paper">
          Personnel file
        </Link>
      )}
    </span>
  );
}

function PersonChip({ slug }: { slug: string }) {
  const p = getPerson(slug);
  if (!p) return null;
  return (
    <Link href={`/soldiers/${slug}/`} className="group block">
      <span className="block aspect-[4/5] overflow-hidden border border-line bg-base-2 transition-colors group-hover:border-paper/50">
        <img
          src={asset(`/images/personnel/${slug}.webp`)}
          alt=""
          width={240}
          height={300}
          loading="lazy"
          className="size-full object-contain transition-transform duration-300 ease-[var(--ease-out)] motion-safe:[@media(hover:hover)]:group-hover:scale-[1.04]"
        />
      </span>
      <span className="mt-2 block font-military text-[0.95rem] font-semibold tracking-[0.1em] text-paper/85 uppercase group-hover:text-paper">{p.name.split(" ")[0]}</span>
    </Link>
  );
}
