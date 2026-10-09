import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Sealed from "@/components/archive/Sealed";
import { PEOPLE, getPerson } from "@/lib/data/people";
import { PORTRAITS } from "@/lib/data/portraits";
import { asset } from "@/lib/utils";
import SectionBackdrop from "@/components/archive/SectionBackdrop";
import { BG } from "@/lib/data/backgrounds";

export const dynamicParams = false;

export function generateStaticParams() {
  return PEOPLE.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/soldiers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getPerson(slug);
  if (!p) return {};
  return {
    title: `${p.name}, personnel file`,
    description: `${p.name}. ${p.unit}. ${p.identity}`,
    alternates: { canonical: "./" },
  };
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-4 border-t border-ink/15 py-3 break-words first:border-t-0">
      <dt className="font-mono text-meta tracking-[0.14em] text-ink/55 uppercase">{label}</dt>
      <dd className="font-military text-[1.1rem] leading-snug font-semibold tracking-[0.06em] text-ink uppercase">{value}</dd>
    </div>
  );
}

function Layer({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-6">
      <h2 className="font-mono text-meta tracking-[0.18em] text-ash uppercase">{label}</h2>
      <p className="mt-3 max-w-[58ch] text-lede leading-relaxed text-paper/85">{children}</p>
    </div>
  );
}

export default async function Dossier({ params }: PageProps<"/soldiers/[slug]">) {
  const { slug } = await params;
  const p = getPerson(slug);
  if (!p) notFound();
  const i = PEOPLE.indexOf(p);
  const prev = PEOPLE[(i - 1 + PEOPLE.length) % PEOPLE.length];
  const next = PEOPLE[(i + 1) % PEOPLE.length];
  const credit = PORTRAITS.find((x) => x.id === p.slug);

  return (
    <article className="relative isolate px-4 pt-[calc(var(--nav-h)+3rem)] md:px-8">
      <SectionBackdrop src={BG.soldiers.src} credit={BG.soldiers.credit} position="50% 40%" strength={0.14} />
      <div className="mx-auto max-w-[1400px]">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-2 font-mono text-meta tracking-[0.16em] text-paper/60 uppercase">
            <li className="flex gap-2">
              <Link href="/#index" className="inline-block py-1 hover:text-paper">Index</Link>
              <span aria-hidden>/</span>
            </li>
            <li className="flex gap-2">
              <Link href="/soldiers/" className="inline-block py-1 hover:text-paper">The Soldiers</Link>
              <span aria-hidden>/</span>
            </li>
            <li className="py-1 text-paper/85">{p.file}</li>
          </ol>
        </nav>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <figure className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start">
            <img src={asset(`/images/personnel/${p.slug}.webp`)} alt={`${p.name}, recovered portrait`} width={800} height={900} fetchPriority="high" className="mx-auto w-full max-w-[520px]" />
            {credit && <figcaption className="mx-auto mt-3 max-w-[520px] px-6 text-meta text-ash">{credit.credit}</figcaption>}
          </figure>

          <div>
            <h1 className="font-display text-h1 leading-[0.92] font-extrabold text-paper">{p.name}</h1>
            <p className="mt-4 font-serif text-h3 text-paper/70 italic">{p.word}</p>

            <div className="paper relative mt-10 px-6 py-7 md:px-9">
              <p className="font-mono text-meta tracking-[0.14em] text-ink/60 uppercase">Personnel file {p.file}</p>
              <dl className="mt-4">
                <Field label="Name" value={p.name} />
                <Field label="Origin" value={p.origin} />
                <Field label="Unit" value={p.unit} />
                {p.titan && <Field label="Titan" value={p.titan} />}
              </dl>
              <div className="mt-5 border-t border-ink/15 pt-5">
                <Sealed onPaper label="Status sealed: spoils the ending">
                  <span className="stamp text-[0.95rem]">
                    {p.status}
                    {p.statusNote ? `, ${p.statusNote}` : ""}
                  </span>
                </Sealed>
              </div>
            </div>

            <div className="mt-14 grid gap-10">
              <Layer label="Identity">{p.identity}</Layer>
              <Layer label="History">{p.history}</Layer>
              <Layer label="Relationships">{p.relationships}</Layer>
              <Layer label="Belief">{p.belief}</Layer>
              <div className="border-t border-line pt-6">
                <Sealed label="Transformation and legacy sealed: spoils the ending">
                  <div className="grid gap-10 pt-4">
                    <Layer label="Transformation">{p.transformation}</Layer>
                    <Layer label="Legacy">{p.legacy}</Layer>
                  </div>
                </Sealed>
              </div>
            </div>
          </div>
        </div>

        <nav aria-label="Other files" className="mt-24 grid grid-cols-2 border-t border-line py-10">
          <Link href={`/soldiers/${prev.slug}/`} className="group py-2">
            <span className="font-mono text-meta tracking-[0.14em] text-ash uppercase">Previous file</span>
            <span className="mt-2 block font-military text-h3 font-semibold tracking-[0.08em] text-paper uppercase group-hover:text-wall">{prev.name}</span>
          </Link>
          <Link href={`/soldiers/${next.slug}/`} className="group py-2 text-right">
            <span className="font-mono text-meta tracking-[0.14em] text-ash uppercase">Next file</span>
            <span className="mt-2 block font-military text-h3 font-semibold tracking-[0.08em] text-paper uppercase group-hover:text-wall">{next.name}</span>
          </Link>
        </nav>
      </div>
    </article>
  );
}
