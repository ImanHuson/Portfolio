import type { Metadata } from "next";
import Link from "next/link";
import CardWash from "@/components/archive/CardWash";
import PersonName from "@/components/people/PersonName";
import FramedPortrait from "@/components/archive/FramedPortrait";
import { notFound } from "next/navigation";
import Reveal from "@/components/archive/Reveal";
import SpoilerGate from "@/components/archive/SpoilerGate";
import Stamp from "@/components/archive/Stamp";
import { PEOPLE, getPerson, safeAs, type Person } from "@/lib/data/people";
import { ACCENT_CLASS, NAME_CLASS, RULE_CLASS } from "@/lib/registers";
import { cn } from "@/lib/utils";
import Spotlight from "@/components/archive/Spotlight";
import QuoteFigure from "@/components/archive/QuoteFigure";
import ExtendedDossier from "@/components/people/ExtendedDossier";
import { WolfIcon } from "@/components/people/icons";
import { EXTENDED, getExtended } from "@/lib/data/extended";
import { TEN_QUOTES } from "@/lib/data/quotes";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...PEOPLE, ...EXTENDED].map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/people/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const ext = getExtended(slug);
  if (ext)
    return {
      title: `${ext.name}, ${ext.epithet}`,
      description: `Archive dossier: ${ext.name} in the Red Rising Saga. ${ext.color}, ${ext.origin}. ${ext.categories.join(", ")}.`,
      alternates: { canonical: "./" },
    };
  const p = getPerson(slug);
  if (!p) return {};
  return {
    title: `${safeAs(p).name}, ${safeAs(p).epithet}`,
    description: `Archive dossier: ${safeAs(p).name} (${safeAs(p).epithet}) in the Red Rising Saga. ${p.face}. ${p.question}`,
    alternates: { canonical: "./" },
  };
}

// Brief-specific treatments for three dossiers.
function Special({ person }: { person: Person }) {
  if (person.slug === "lysander") {
    return (
      <section aria-label="Two readings" className="border-t border-line px-5 py-20 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="font-display text-h3 font-bold uppercase">The same man, two columns</h2>
          <p className="mt-3 max-w-[56ch] text-ash">The archive does not tell you which column is true. Let the contradiction breathe.</p>
          <SpoilerGate book={4} className="mt-10">
            <div className="mt-10 grid gap-px bg-line md:grid-cols-2">
              <Spotlight tone="gold" lift={false} className="bg-void p-8">
                <p className="font-mono text-meta tracking-[0.18em] text-gold uppercase">What Lysander believes</p>
                <ul className="mt-6 space-y-3 font-serif text-3xl" role="list">
                  {["Order", "Continuity", "Hierarchy", "Responsibility", "Civilization"].map((w) => <li key={w}>{w}</li>)}
                </ul>
              </Spotlight>
              <Spotlight tone="red" lift={false} className="bg-void p-8">
                <p className="font-mono text-meta tracking-[0.18em] text-red uppercase">What the reader sees</p>
                <ul className="mt-6 space-y-3 font-display text-3xl font-bold uppercase" role="list">
                  {["Privilege", "Paternalism", "Self-justification", "Ambition", "Violence"].map((w) => <li key={w}>{w}</li>)}
                </ul>
              </Spotlight>
            </div>
          </SpoilerGate>
        </div>
      </section>
    );
  }
  if (person.slug === "atlas") {
    const files = [
      ["War philosophy", "Understanding over force. Fear as a precise instrument, not a mood."],
      ["Psychological warfare", "He wins by knowing where his enemy’s mind will go before it goes there."],
      ["The failure", "747 PCE, the Siege of Olympia: a Red spy, Daedre, spends a week earning his trust, then poisons 104 of his soldiers."],
      ["The totems", "Afterward he begins carving meditation totems of the people who preyed on his prejudices. Daedre is among them."],
      ["Family", "Brother of Romulus au Raa. Uncle of Diomedes. Father of Ajax."],
      ["Status", "Banished from the Core to the Kuiper Belt in 739 PCE. Later returned."],
    ];
    return (
      <section aria-label="The Atlas files" className="border-t border-line bg-void-2 px-5 py-20 md:px-8">
        <div className="mx-auto max-w-[1100px]">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="font-mono text-lg tracking-[0.3em] text-rim uppercase">The Atlas files</h2>
          </div>
          <p className="mt-3 max-w-[56ch] font-mono text-sm text-ash">Assembled from fragments. Where the record ends, so does the file.</p>
          <SpoilerGate book={6} className="mt-10">
            <dl className="mt-10 divide-y divide-line border-y border-line font-mono text-sm">
              {files.map(([k, v]) => (
                <div key={k} className="grid gap-2 py-5 md:grid-cols-[220px_1fr]">
                  <dt className="tracking-[0.18em] text-rim-dim uppercase">{k}</dt>
                  <dd className="text-bone/90">{v}</dd>
                </div>
              ))}
            </dl>
          </SpoilerGate>
        </div>
      </section>
    );
  }
  return null;
}

export default async function DossierPage({ params }: PageProps<"/people/[slug]">) {
  const { slug } = await params;
  const ext = getExtended(slug);
  if (ext) return <ExtendedDossier person={ext} />;
  const person = getPerson(slug);
  if (!person) notFound();
  const idx = PEOPLE.findIndex((p) => p.slug === slug);
  const prev = PEOPLE[(idx - 1 + PEOPLE.length) % PEOPLE.length];
  const next = PEOPLE[(idx + 1) % PEOPLE.length];

  return (
    <article>
      <header
        className={cn(
          "relative overflow-hidden px-5 pt-[calc(var(--nav-h)+4rem)] pb-20 md:px-8 md:pt-[calc(var(--nav-h)+6rem)] md:pb-28",
        )}
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0",
            person.register === "red" && "bg-[radial-gradient(ellipse_70%_70%_at_10%_0%,rgba(122,15,23,0.32),transparent_70%)]",
            person.register === "gold" && "bg-[radial-gradient(ellipse_70%_70%_at_10%_0%,rgba(140,116,70,0.2),transparent_70%)]",
            person.register === "rim" && "bg-[radial-gradient(ellipse_70%_70%_at_10%_0%,rgba(170,178,186,0.16),transparent_70%)]",
            person.register === "none" && "bg-[radial-gradient(ellipse_70%_70%_at_10%_0%,rgba(147,143,136,0.12),transparent_70%)]",
          )}
        />
        <div className="relative mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[7fr_5fr] lg:items-center">
          <div>
          <nav aria-label="Breadcrumb" className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">
            <Link href="/people/" className="hover:text-bone">The People</Link>
            <span aria-hidden> / </span>
            <span>Dossier</span>
          </nav>
          <h1 className={cn("mt-6 max-w-[14ch] text-h1 leading-[0.88]", NAME_CLASS[person.register])}><PersonName person={person} /></h1>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span aria-hidden className={cn("h-px w-12", RULE_CLASS[person.register])} />
            <p className={cn("font-serif text-h3 italic", ACCENT_CLASS[person.register])}><PersonName person={person} part="epithet" /></p>
            {person.epithetSource === "archive" && (
              <span className="border border-line-strong px-1.5 py-0.5 font-mono text-[0.65rem] tracking-[0.18em] text-ash-2 uppercase">The archive’s name, not the books’</span>
            )}
          </div>
          <dl className="mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
            <div>
              <dt className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Color</dt>
              <dd className="mt-1 text-bone">{person.color}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Face of power</dt>
              <dd className="mt-1 text-bone">{person.face}</dd>
            </div>
            <div className="md:col-span-3">
              <dt className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Titles</dt>
              <dd className="mt-1">
                <SpoilerGate book={person.lensBook} compact>
                  <span className="text-bone">{person.titles.join(", ")}</span>
                </SpoilerGate>
              </dd>
            </div>
          </dl>
          </div>
          {/* Fan easter eggs: Sevro's goblin peeks in on hover; Atlas's plate
              starts veiled and clears on its own. */}
          <div className={cn("group relative w-full max-w-[460px] justify-self-center lg:justify-self-end", person.slug === "atlas" && "atlas-veil")}>
            <FramedPortrait slug={person.slug} name={safeAs(person).name} size="hero" priority sizes="(min-width: 1024px) 30vw, 80vw" />
            {person.slug === "sevro" && <WolfIcon className="goblin-peek pointer-events-none absolute right-8 bottom-28 w-10 text-bone/80" />}
          </div>
        </div>
      </header>

      <section aria-label="Introduction" className="border-t border-line px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[7fr_5fr]">
          <SpoilerGate book={person.firstBook - 1}>
            <div className="space-y-6">
              {person.intro.map((p, i) =>
                typeof p === "string" ? (
                  <Reveal key={i}>
                    <p className="max-w-[58ch] text-lede text-bone/90">{p}</p>
                  </Reveal>
                ) : (
                  <SpoilerGate key={i} book={p.book} compact>
                    <p className="mt-4 max-w-[58ch] text-lede text-bone/90">{p.text}</p>
                  </SpoilerGate>
                ),
              )}
            </div>
          </SpoilerGate>
          <aside className="space-y-10 md:border-l md:border-line md:pl-10">
            {person.motif && (
              <div>
                <p className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Archive motif</p>
                <p className="mt-2 font-serif text-2xl text-bone italic">{person.motif}</p>
              </div>
            )}
            <div>
              <p className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Archive question</p>
              <p className="mt-2 font-display text-2xl leading-tight font-semibold uppercase">{person.question}</p>
            </div>
          </aside>
        </div>
      </section>

      {TEN_QUOTES[person.slug] && (
        <section aria-labelledby="words-title" className="border-t border-line px-5 py-20 md:px-8">
          <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[4fr_8fr]">
            <h2 id="words-title" className="font-mono text-meta tracking-[0.2em] text-ash-2 uppercase">In their words</h2>
            <QuoteFigure q={TEN_QUOTES[person.slug]} />
          </div>
        </section>
      )}

      <section aria-labelledby="dossier-title" className="border-t border-line px-5 py-20 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-center gap-4">
            <h2 id="dossier-title" className="font-display text-h2 leading-none font-bold uppercase">The dossier</h2>
            <Stamp kind="reading" />
          </div>
          <dl className="mt-12 border-t border-line">
            {person.dossier.map((d) => (
              <div key={d.q} className="grid gap-3 border-b border-line py-7 md:grid-cols-[4fr_8fr] md:gap-12">
                <dt className="font-display text-xl leading-tight font-semibold text-bone/80 uppercase">{d.q}</dt>
                <dd>
                  <SpoilerGate book={d.book} compact>
                    <p className="max-w-[62ch] text-lede text-bone/90">{d.a}</p>
                  </SpoilerGate>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {person.bonds && (
        <section aria-label="Core relationships" className="border-t border-line px-5 py-20 md:px-8">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="font-display text-h3 font-bold uppercase">Core relationships</h2>
            <ul className="mt-8 grid gap-px bg-line md:grid-cols-4" role="list">
              {person.bonds.map((b) => (
                <Spotlight as="li" tone="red" key={b.name} className="bg-void p-6">
                  <p className="font-display text-2xl font-bold uppercase">{b.name}</p>
                  <SpoilerGate book={b.book} compact className="mt-2">
                    <p className="mt-2 text-ash">{b.note}</p>
                  </SpoilerGate>
                </Spotlight>
              ))}
            </ul>
            <Link href="/people/relationships/" className="mt-8 inline-block border-b border-red pb-1 font-mono text-meta tracking-[0.2em] uppercase hover:text-red">
              Open the constellation
            </Link>
          </div>
        </section>
      )}

      <Special person={person} />

      <nav aria-label="Other dossiers" className="grid border-t border-line md:grid-cols-2">
        <Link href={`/people/${prev.slug}/`} className="group border-line p-8 wash-card md:border-r md:p-12">
          <span className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Previous dossier</span>
          <span className={cn("mt-2 block text-3xl group-hover:opacity-80", NAME_CLASS[prev.register])}><PersonName person={prev} /></span>
          <CardWash />
        </Link>
        <Link href={`/people/${next.slug}/`} className="group p-8 text-right wash-card md:p-12">
          <span className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Next dossier</span>
          <span className={cn("mt-2 block text-3xl group-hover:opacity-80", NAME_CLASS[next.register])}><PersonName person={next} /></span>
          <CardWash />
        </Link>
      </nav>
    </article>
  );
}
