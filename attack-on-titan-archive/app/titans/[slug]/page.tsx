import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Sealed from "@/components/archive/Sealed";
import XrayIntro from "@/components/titans/XrayIntro";
import { asset } from "@/lib/utils";
import { INHERITANCE, ORIGIN, STATUS, TITANS, getTitan } from "@/lib/data/titans";
import SectionBackdrop from "@/components/archive/SectionBackdrop";
import { BG } from "@/lib/data/backgrounds";

export const dynamicParams = false;

export function generateStaticParams() {
  return TITANS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/titans/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = getTitan(slug);
  if (!t) return {};
  return { title: t.name, description: `${t.name}, ${t.height} m. ${t.trait}`, alternates: { canonical: "./" } };
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line pt-6">
      <h2 className="font-military text-[1.05rem] font-semibold tracking-[0.2em] text-paper uppercase">{label}</h2>
      <div className="mt-4 text-lede leading-relaxed text-paper/80">{children}</div>
    </section>
  );
}

export default async function TitanFile({ params }: PageProps<"/titans/[slug]">) {
  const { slug } = await params;
  const t = getTitan(slug);
  if (!t) notFound();
  const i = TITANS.indexOf(t);
  const prev = TITANS[(i - 1 + TITANS.length) % TITANS.length];
  const next = TITANS[(i + 1) % TITANS.length];

  return (
    <article className="relative isolate px-4 pt-[calc(var(--nav-h)+3rem)] md:px-8">
      <SectionBackdrop src={BG.colossi.src} credit={BG.colossi.credit} position="50% 60%" strength={0.16} />
      <XrayIntro slug={t.slug} />
      <div className="mx-auto max-w-[1400px]">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-2 font-mono text-meta tracking-[0.16em] text-paper/60 uppercase">
            <li className="flex gap-2">
              <Link href="/#index" className="inline-block py-1 hover:text-paper">Index</Link>
              <span aria-hidden>/</span>
            </li>
            <li className="flex gap-2">
              <Link href="/titans/" className="inline-block py-1 hover:text-paper">The Titans</Link>
              <span aria-hidden>/</span>
            </li>
            <li className="py-1 text-paper/85">{t.name}</li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          {/* not sticky when a sealed second plate can open under it: a sticky block taller than the screen hides its foot */}
          <figure className={t.plate.later ? "relative lg:self-start" : "relative lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start"}>
            <img src={asset(`/images/titans/${t.slug}-plate.webp`)} alt={`Specimen plate: the ${t.name}`} width={820} height={1100} loading="lazy" className="mx-auto w-full max-w-[520px] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]" />
            <figcaption className="mx-auto mt-3 max-w-[520px] text-meta text-ash">{t.plate.credit}</figcaption>
            {t.plate.later && (
              <Sealed label={t.plate.later.label} className="mx-auto mt-6 max-w-[520px]">
                <img src={asset(`/images/titans/${t.slug}-${t.plate.later.id}-plate.webp`)} alt={t.plate.later.alt} width={820} height={1100} loading="lazy" className="w-full" />
                <p className="mt-3 text-meta text-ash">{t.plate.later.credit}</p>
              </Sealed>
            )}
          </figure>

          <div>
            <h1 className="font-display text-h1 leading-[0.95] font-bold text-paper">{t.name.replace(" Titan", "")}</h1>
            <p className="mt-2 font-display text-h3 font-semibold text-paper/60">Titan</p>
            <p className="mt-6 max-w-[40ch] font-serif text-h3 leading-snug text-paper/90 italic">{t.trait}</p>

            <div className="mt-14 grid gap-12">
              <Block label="Origin">
                <p>{ORIGIN}</p>
              </Block>
              <Block label="Inheritance">
                <p>{INHERITANCE}</p>
              </Block>
              <Block label="Abilities">
                <ul className="grid gap-3">
                  {t.abilities.map((a) => (
                    <li key={a} className="grid grid-cols-[1.25rem_1fr]">
                      <span aria-hidden className="text-flare">&middot;</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </Block>
              <Block label="Known events">
                <ol className="grid gap-4">
                  {t.events.map((e) => (
                    <li key={e.text} className="grid grid-cols-[4rem_1fr] gap-4">
                      <span className="font-mono text-[0.95rem] text-paper/60">{e.year}</span>
                      <span>{e.text}</span>
                    </li>
                  ))}
                </ol>
              </Block>
              <Block label="Known holders">
                <Sealed label="Sealed: who held it">
                  <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-2">
                    {t.holders.map((h, k) => (
                      <li key={h.name} className="flex items-center gap-3">
                        {h.slug ? (
                          <Link href={`/soldiers/${h.slug}/`} className="underline decoration-paper/40 underline-offset-4 hover:decoration-paper">
                            {h.name}
                          </Link>
                        ) : (
                          <span>{h.name}</span>
                        )}
                        {k < t.holders.length - 1 && <span aria-hidden className="text-ash-2">&rarr;</span>}
                      </li>
                    ))}
                  </ol>
                </Sealed>
              </Block>
              <Block label="Current status">
                <Sealed label="Sealed: spoils the ending">
                  <p className="pt-2">{STATUS}</p>
                </Sealed>
              </Block>
            </div>
          </div>
        </div>

        <nav aria-label="Other Titans" className="mt-24 grid grid-cols-2 border-t border-line py-10">
          <Link href={`/titans/${prev.slug}/`} className="group py-2">
            <span className="font-mono text-meta tracking-[0.14em] text-ash uppercase">Previous</span>
            <span className="mt-2 block font-display text-h3 font-bold text-paper group-hover:text-wall">{prev.name}</span>
          </Link>
          <Link href={`/titans/${next.slug}/`} className="group py-2 text-right">
            <span className="font-mono text-meta tracking-[0.14em] text-ash uppercase">Next</span>
            <span className="mt-2 block font-display text-h3 font-bold text-paper group-hover:text-wall">{next.name}</span>
          </Link>
        </nav>
      </div>
    </article>
  );
}
