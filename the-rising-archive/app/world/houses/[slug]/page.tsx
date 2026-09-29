import type { Metadata } from "next";
import Link from "next/link";
import CardWash from "@/components/archive/CardWash";
import { notFound } from "next/navigation";
import Plate from "@/components/archive/Plate";
import { altFor, creditLine } from "@/lib/data/credits";
import Reveal from "@/components/archive/Reveal";
import SpoilerGate from "@/components/archive/SpoilerGate";
import Spotlight from "@/components/archive/Spotlight";
import Stamp from "@/components/archive/Stamp";
import TelemanusTable from "@/components/world/TelemanusTable";
import RaaTree from "@/components/world/RaaTree";
import { HOUSES, getHouse } from "@/lib/data/houses";

export const dynamicParams = false;

export function generateStaticParams() {
  return HOUSES.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: PageProps<"/world/houses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const h = getHouse(slug);
  if (!h) return {};
  return {
    title: h.name,
    description: `${h.name}${h.motto ? `, “${h.motto}”` : ""}. ${h.lede[0]}`,
    alternates: { canonical: "./" },
  };
}

export default async function HousePage({ params }: PageProps<"/world/houses/[slug]">) {
  const { slug } = await params;
  const h = getHouse(slug);
  if (!h) notFound();
  const idx = HOUSES.findIndex((x) => x.slug === slug);
  const next = HOUSES[(idx + 1) % HOUSES.length];

  return (
    <article>
      <header className="relative overflow-hidden px-5 pt-[calc(var(--nav-h)+4rem)] pb-16 md:px-8 md:pt-[calc(var(--nav-h)+6rem)] md:pb-24">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(ellipse_60%_60%_at_20%_0%,rgba(146,111,52,0.2),transparent_70%)]" />
        <div className="relative mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[7fr_5fr] md:items-center">
          <div>
            <nav aria-label="Breadcrumb" className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">
              <Link href="/world/" className="hover:text-bone">The World</Link>
              <span aria-hidden> / </span>
              <Link href="/world/houses/" className="hover:text-bone">Houses</Link>
            </nav>
            <p className="mt-8 font-mono text-meta tracking-[0.3em] text-red uppercase">Political dossier</p>
            <h1 className="mt-3 font-serif text-h1 leading-[0.9] font-medium text-bone">{h.name}</h1>
            {h.motto && (
              <p className="mt-4 font-serif text-h3 italic">
                <span className="gold-foil">{h.motto}</span> <span className="text-ash">“{h.mottoEn}.”</span>
              </p>
            )}
            <div className="mt-8 max-w-[52ch] space-y-3 text-lede text-bone/85">
              {h.lede.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
            <dl className="mt-10 grid max-w-2xl gap-6 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Seat</dt>
                <dd className="mt-1 text-bone">{h.seat}</dd>
              </div>
              <div>
                <dt className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Sigil</dt>
                <dd className="mt-1 text-bone">{h.sigil ?? <Stamp kind="unknown" />}</dd>
              </div>
            </dl>
          </div>
          <figure>
            <Plate src={h.plate} alt={altFor(h.plate, `The ${h.name} seal.`)} priority className="border border-line" />
            <figcaption className="mt-3 font-mono text-[0.7rem] tracking-[0.12em] text-ash-2 uppercase">A stand-in for the house’s sign. {creditLine(h.plate)}</figcaption>
          </figure>
        </div>
      </header>

      <section aria-labelledby="members" className="border-t border-line px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[3fr_9fr]">
          <h2 id="members" className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase md:pt-2">The family file</h2>
          <ul role="list" className="grid gap-px bg-line">
            {h.members.map((m) => (
              <li key={m.name} className="bg-void py-6 md:px-6">
                <SpoilerGate book={m.book} compact>
                  <p className="font-serif text-3xl text-bone">{m.name}</p>
                  <p className="mt-1 text-ash">{m.note}</p>
                  {/* Only seal the fate separately when it spoils a later book
                      than the member does; otherwise it is one seal, not two. */}
                  {m.fate && (
                    <SpoilerGate book={m.fate.book > m.book ? m.fate.book : 0} compact className="mt-3">
                      <p className="mt-3 border-l-2 border-red pl-4 text-bone/85">{m.fate.text}</p>
                    </SpoilerGate>
                  )}
                </SpoilerGate>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {h.artifacts && (
        <section aria-labelledby="artifacts" className="border-t border-line px-5 py-20 md:px-8">
          <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[3fr_9fr]">
            <h2 id="artifacts" className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase md:pt-2">Archive artifacts</h2>
            <ol className="grid gap-px bg-line sm:grid-cols-2">
              {h.artifacts.map((a, i) => (
                <Spotlight as="li" tone="gold" key={a.title} className="bg-void p-6 md:p-8">
                  <p className="font-mono text-meta tracking-[0.2em] text-red uppercase">Item {String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-2 font-display text-2xl font-bold uppercase">{a.title}</p>
                  <SpoilerGate book={a.book} compact className="mt-4">
                    <p className="mt-4 text-ash">{a.body}</p>
                  </SpoilerGate>
                </Spotlight>
              ))}
            </ol>
          </div>
        </section>
      )}

      {h.essay && (
        <section aria-labelledby="essay" className="border-t border-line px-5 py-24 md:px-8">
          <div className="mx-auto max-w-[900px]">
            <Stamp kind="reading" />
            <h2 id="essay" className="mt-6 font-serif text-h2 leading-tight text-bone italic">{h.essay.question}</h2>
            <SpoilerGate book={h.essay.book} className="mt-10">
              <div className="mt-10 space-y-6 text-lede text-bone/85">
                {h.essay.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </SpoilerGate>
          </div>
        </section>
      )}

      {h.slug === "telemanus" && (
        <section aria-label="The Telemanus Table" className="border-t border-line px-5 py-24 md:px-8">
          <Reveal>
            <TelemanusTable />
          </Reveal>
        </section>
      )}

      {h.slug === "raa" && (
        <section aria-labelledby="genealogy" className="border-t border-line px-5 py-20 md:px-8">
          <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[3fr_9fr]">
            <h2 id="genealogy" className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase md:pt-2">Genealogy</h2>
            <RaaTree />
          </div>
        </section>
      )}

      <nav aria-label="Next house" className="border-t border-line">
        <Link href={`/world/houses/${next.slug}/`} className="group block p-8 text-right wash-card md:p-12">
          <span className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Next dossier</span>
          <span className="mt-2 block font-serif text-h3 text-bone group-hover:text-red">{next.name}</span>
          <CardWash />
        </Link>
      </nav>
    </article>
  );
}
