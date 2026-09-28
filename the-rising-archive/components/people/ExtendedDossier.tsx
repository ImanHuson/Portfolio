import Link from "next/link";
import CardWash from "@/components/archive/CardWash";
import Plate from "@/components/archive/Plate";
import QuoteFigure from "@/components/archive/QuoteFigure";
import SpoilerGate from "@/components/archive/SpoilerGate";
import Stamp from "@/components/archive/Stamp";
import HowlPlate from "@/components/people/HowlPlate";
import Sophocles from "@/components/people/Sophocles";
import { EXTENDED, type ExtendedPerson, type Gated } from "@/lib/data/extended";
import { PEOPLE } from "@/lib/data/people";
import { ACCENT_CLASS, NAME_CLASS, RULE_CLASS } from "@/lib/registers";
import { cn } from "@/lib/utils";

const KNOWN = new Set([...PEOPLE.map((p) => p.slug), ...EXTENDED.map((p) => p.slug)]);

function Paras({ items, className }: { items: Gated[]; className?: string }) {
  return (
    <div className="space-y-5">
      {items.map((it, i) =>
        typeof it === "string" ? (
          <p key={i} className={className}>
            {it}
          </p>
        ) : (
          <SpoilerGate key={i} book={it.book} compact>
            <p className={cn("mt-4", className)}>{it.text}</p>
          </SpoilerGate>
        ),
      )}
    </div>
  );
}

function Label({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-mono text-meta tracking-[0.2em] text-ash-2 uppercase">
      {children}
    </h2>
  );
}

/** The shared dossier template for the extended ten (brief section 56):
 * header, essence, traits, role, themes, connections, moments, words and a
 * labelled reading. Every spoiler is a native <details>. */
export default function ExtendedDossier({ person }: { person: ExtendedPerson }) {
  const idx = EXTENDED.findIndex((p) => p.slug === person.slug);
  const prev = EXTENDED[(idx - 1 + EXTENDED.length) % EXTENDED.length];
  const next = EXTENDED[(idx + 1) % EXTENDED.length];
  const plate = (
    <Plate
      src={`/images/people/${person.slug}.webp`}
      alt={`Archive relic for ${person.name}: ${person.motif}`}
      priority
      className="border border-line"
      sizes="(min-width: 1024px) 40vw, 100vw"
    />
  );

  return (
    <article>
      <header className="relative overflow-hidden px-5 pt-[calc(var(--nav-h)+4rem)] pb-20 md:px-8 md:pt-[calc(var(--nav-h)+6rem)] md:pb-28">
        <div aria-hidden className={cn("mood", `mood-${person.mood}`)} />
        {person.easter === "orbit" && (
          <div aria-hidden className="orbits">
            {[
              [220, 9],
              [380, 14],
              [560, 21],
            ].map(([size, dur]) => (
              <span
                key={size}
                className="orbit"
                style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, ["--dur" as string]: `${dur}s` }}
              />
            ))}
          </div>
        )}
        <div className="relative mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[7fr_5fr] lg:items-center">
          <div>
            <nav aria-label="Breadcrumb" className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">
              <Link href="/people/" className="hover:text-bone">
                The People
              </Link>
              <span aria-hidden> / </span>
              <Link href="/people/#extended" className="hover:text-bone">
                The ones who deserve a place
              </Link>
            </nav>
            <h1 className={cn("mt-6 max-w-[14ch] text-h1 leading-[0.88]", NAME_CLASS[person.register])}>{person.name}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span aria-hidden className={cn("h-px w-12", RULE_CLASS[person.register])} />
              <p className={cn("font-serif text-h3 italic", ACCENT_CLASS[person.register])}>{person.epithet}</p>
              {person.epithetSource === "archive" && (
                <span className="border border-line-strong px-1.5 py-0.5 font-mono text-[0.65rem] tracking-[0.18em] text-ash-2 uppercase">
                  The archive’s name, not the books’
                </span>
              )}
            </div>
            <dl className="mt-12 grid max-w-4xl gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Color", person.color],
                ["House / origin", person.origin],
                ["Role", person.role],
                ["Archive category", person.categories.join(" · ")],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">{k}</dt>
                  <dd className="mt-1 text-bone">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className="max-w-[560px] lg:justify-self-end">
            {person.easter === "howl" ? <HowlPlate>{plate}</HowlPlate> : plate}
            <figcaption className="mt-3 font-mono text-[0.65rem] tracking-[0.18em] text-ash-2 uppercase">Archive relic. {person.motif}</figcaption>
          </figure>
        </div>
      </header>

      <section aria-labelledby="essence" className="border-t border-line px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[7fr_5fr]">
          <div>
            <Label id="essence">Essence</Label>
            <div className="mt-6">
              <SpoilerGate book={person.firstBook - 1}>
                <Paras items={person.essence} className="max-w-[58ch] text-lede text-bone/90" />
              </SpoilerGate>
            </div>
          </div>
          <aside className="space-y-8 md:border-l md:border-line md:pl-10">
            <div>
              <p className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Personal archive</p>
              {person.lineEarly && <p className="mt-3 font-serif text-2xl text-bone/80 italic">{person.lineEarly}</p>}
              <SpoilerGate book={person.lineBook} compact className="mt-3">
                <p className="mt-3 font-serif text-2xl text-bone italic">{person.line}</p>
              </SpoilerGate>
            </div>
            <div>
              <p className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Themes</p>
              <p className="mt-2 font-display text-xl font-semibold uppercase">{person.themes.join(" · ")}</p>
            </div>
          </aside>
        </div>
      </section>

      <section aria-labelledby="traits" className="border-t border-line px-5 py-20 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <Label id="traits">Traits</Label>
          <SpoilerGate book={person.firstBook} className="mt-6">
            <ul role="list" className="mt-6 flex flex-wrap gap-2">
              {person.traits.map((t, i) => (
                <li
                  key={t}
                  className="trait-chip border border-line-strong px-3 py-2 font-display text-lg font-semibold tracking-wide uppercase md:text-xl"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  {t}
                </li>
              ))}
            </ul>
          </SpoilerGate>
        </div>
      </section>

      <section aria-labelledby="role" className="border-t border-line px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[4fr_8fr]">
          <Label id="role">Their role</Label>
          <SpoilerGate book={person.firstBook}>
            <Paras items={person.roleText} className="max-w-[62ch] text-lede text-bone/90" />
          </SpoilerGate>
        </div>
      </section>

      <section aria-labelledby="connections" className="border-t border-line px-5 py-20 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <Label id="connections">Connections</Label>
          <ul role="list" className="mt-8 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {person.connections.map((c) => {
              const body = (
                <SpoilerGate book={c.book} compact>
                  <p className="font-display text-2xl leading-tight font-bold uppercase">{c.name}</p>
                  <p className="mt-2 text-ash">{c.note}</p>
                  {c.slug && KNOWN.has(c.slug) && (
                    <span className="mt-4 block font-mono text-meta tracking-[0.18em] text-ash uppercase group-hover:text-red">
                      Their dossier <span aria-hidden>→</span>
                    </span>
                  )}
                </SpoilerGate>
              );
              return (
                <li key={c.name} className="bg-void">
                  {c.slug && KNOWN.has(c.slug) ? (
                    <Link href={`/people/${c.slug}/`} data-wash={person.wash} className="wash-card group block h-full p-6">
                      {body}
                      <CardWash />
                    </Link>
                  ) : (
                    <div data-wash={person.wash} className="wash-card h-full p-6">
                      {body}
                      <CardWash />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          {person.easter === "sophocles" && (
            <div className="mt-12 border-t border-line pt-8">
              <Sophocles />
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="moments" className="border-t border-line px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[4fr_8fr]">
          <Label id="moments">Moments</Label>
          <ol className="space-y-6 border-l border-line pl-6">
            {person.moments.map((m) => (
              <li key={m.title}>
                <SpoilerGate book={m.book} compact>
                  <p className="font-display text-2xl leading-tight font-bold uppercase">{m.title}</p>
                  <p className="mt-2 max-w-[60ch] text-lede text-bone/85">{m.text}</p>
                </SpoilerGate>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {person.words && (
        <section aria-labelledby="words" className="border-t border-line px-5 py-20 md:px-8">
          <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[4fr_8fr]">
            <Label id="words">In their words</Label>
            <QuoteFigure q={person.words} />
          </div>
        </section>
      )}

      <section aria-labelledby="reading" className="border-t border-line px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[4fr_8fr]">
          <div className="space-y-4">
            <Label id="reading">My reading</Label>
            <Stamp kind="reading" />
          </div>
          <SpoilerGate book={person.firstBook}>
            <p className="max-w-[58ch] font-serif text-h3 leading-snug text-bone italic">{person.reading}</p>
            <p className="mt-4 text-sm text-ash-2">An interpretation written for this archive, not a fact from the books.</p>
          </SpoilerGate>
        </div>
      </section>

      <nav aria-label="Other dossiers" className="grid border-t border-line md:grid-cols-2">
        <Link href={`/people/${prev.slug}/`} data-wash={prev.wash} className="group wash-card border-line p-8 md:border-r md:p-12">
          <span className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Another dossier</span>
          <span className={cn("mt-2 block text-3xl group-hover:opacity-80", NAME_CLASS[prev.register])}>{prev.name}</span>
          <CardWash />
        </Link>
        <Link href={`/people/${next.slug}/`} data-wash={next.wash} className="group wash-card p-8 text-right md:p-12">
          <span className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Another dossier</span>
          <span className={cn("mt-2 block text-3xl group-hover:opacity-80", NAME_CLASS[next.register])}>{next.name}</span>
          <CardWash />
        </Link>
      </nav>
    </article>
  );
}
