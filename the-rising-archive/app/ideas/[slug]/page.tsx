import type { Metadata } from "next";
import Link from "next/link";
import CardWash from "@/components/archive/CardWash";
import { notFound } from "next/navigation";
import Plate from "@/components/archive/Plate";
import FramedPortrait from "@/components/archive/FramedPortrait";
import Reveal from "@/components/archive/Reveal";
import SpoilerGate from "@/components/archive/SpoilerGate";
import Stamp from "@/components/archive/Stamp";
import { IDEAS, getIdea } from "@/lib/data/ideas";

export const dynamicParams = false;

export function generateStaticParams() {
  return IDEAS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/ideas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const idea = getIdea(slug);
  if (!idea) return {};
  return { title: idea.name, description: idea.question, alternates: { canonical: "./" } };
}

export default async function IdeaPage({ params }: PageProps<"/ideas/[slug]">) {
  const { slug } = await params;
  const idea = getIdea(slug);
  if (!idea) notFound();
  const idx = IDEAS.findIndex((i) => i.slug === slug);
  const next = IDEAS[idx + 1];

  return (
    <article>
      <header className="relative px-5 pt-[calc(var(--nav-h)+4rem)] pb-16 md:px-8 md:pt-[calc(var(--nav-h)+6rem)]">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[8fr_4fr] md:items-end">
          <div>
            <nav aria-label="Breadcrumb" className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">
              <Link href="/ideas/" className="hover:text-bone">The Ideas</Link>
              <span aria-hidden> / </span>
              <span>{idea.name}</span>
            </nav>
            <h1 className="mt-6 font-display text-colossal leading-[0.8] font-extrabold tracking-tight uppercase">{idea.name}</h1>
            <p className="mt-8 max-w-[30ch] font-serif text-h2 leading-tight text-bone italic">{idea.question}</p>
          </div>
          {idea.portrait ? (
            <FramedPortrait slug={idea.portrait.slug} name={idea.portrait.name} size="hero" priority sizes="(min-width: 768px) 30vw, 80vw" />
          ) : (
            <Plate src={idea.plate} alt={idea.plateAlt} width={idea.plateW ?? 900} height={idea.plateH ?? 900} priority className="border border-line" sizes="(min-width: 768px) 33vw, 100vw" />
          )}
        </div>
      </header>

      <section aria-label="Reading" className="border-t border-line px-5 py-20 md:px-8">
        <div className="mx-auto max-w-[900px]">
          <Stamp kind="reading" />
          {idea.lines.length > 0 && (
            <div className="mt-8 space-y-6">
              {idea.lines.map((l) => (
                <SpoilerGate key={l.text} book={l.book}>
                  <Reveal>
                    <p className="text-lede text-bone/85">{l.text}</p>
                  </Reveal>
                </SpoilerGate>
              ))}
            </div>
          )}
          {idea.pairs && (
            <ul role="list" className="mt-8 grid gap-px bg-line">
              {idea.pairs.map((p) => (
                <li key={p.a + p.b} className="bg-void py-6">
                  <SpoilerGate book={p.book} compact>
                    <div className="grid gap-2 md:grid-cols-[14rem_1fr] md:gap-8">
                      <p className="font-display text-3xl leading-none font-bold uppercase">
                        {p.a}
                        {idea.slug === "fatherhood" && <span className="text-red"> &rarr;</span>}
                      </p>
                      <div>
                        <p className="font-serif text-2xl text-bone italic">{p.b}</p>
                        <p className="mt-1 text-ash">{p.note}</p>
                      </div>
                    </div>
                  </SpoilerGate>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <nav aria-label="Next idea" className="border-t border-line">
        <Link href={next ? `/ideas/${next.slug}/` : "/what-survives/"} className="group block p-8 text-right wash-card md:p-12">
          <span className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">{next ? "Next question" : "The end of the archive"}</span>
          <span className="mt-2 block font-display text-h3 font-bold uppercase group-hover:text-red">{next ? next.name : "What the war couldn’t kill"}</span>
          <CardWash />
        </Link>
      </nav>
    </article>
  );
}
