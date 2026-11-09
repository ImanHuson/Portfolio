import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Widget } from "@/components/chapter/Widget";
import { CinemaHero } from "@/components/story/CinemaHero";
import { Collage } from "@/components/story/Collage";
import { FactBand } from "@/components/story/Statement";
import { Story, type StoryStep } from "@/components/story/Story";
import { themeFor } from "@/lib/themes";
import { Figure } from "@/components/ui/Figure";
import { Bars, Passage } from "@/components/ui/Passage";
import { SourceList } from "@/components/ui/Refs";
import { ThemeShell } from "@/components/ui/ThemeShell";
import { getCountry, getPlace, makeRefs, openCountrySlugs, placePath } from "@/lib/content";
import { imgSrc, media } from "@/lib/content/media";
import type { Passage as P } from "@/lib/content/types";

export const dynamicParams = false;
export function generateStaticParams() {
  return openCountrySlugs().flatMap((country) => (getCountry(country)?.chapters ?? []).map((ch) => ({ country, topic: ch.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[country]/topics/[topic]">): Promise<Metadata> {
  const { country, topic } = await params;
  const c = getCountry(country)!;
  const ch = c.chapters.find((x) => x.slug === topic)!;
  const hero = media(ch.hero);
  return {
    title: `${ch.title}, ${c.entry.name}`,
    description: ch.summary,
    openGraph: { images: [{ url: hero.remote ? imgSrc(hero, 1280) : `.${hero.src}`, alt: hero.alt }] },
  };
}

export default async function ChapterPage({ params }: PageProps<"/[country]/topics/[topic]">) {
  const { country, topic } = await params;
  const c = getCountry(country);
  const ch = c?.chapters.find((x) => x.slug === topic);
  if (!c || !ch) notFound();
  const lang = c.entry.nativeLang?.split(" ")[0];
  const refs = makeRefs([...(ch.facts ?? []).map((f) => f.cite), ...ch.passages.map((p) => p.cite)]);
  const others = c.chapters.filter((x) => x.slug !== ch.slug);
  const vertical = themeFor(country)?.native === "vertical";

  // Passages are told beside their photographs; a passage with an interactive
  // widget closes its story segment, and the widget gets the full width after it.
  const segments: { steps: StoryStep[]; widget?: NonNullable<P["widget"]>; key: string }[] = [];
  let cur: StoryStep[] = [];
  ch.passages.forEach((p, i) => {
    const places = (p.places ?? []).map((s) => ({ pl: getPlace(country, s)!, href: placePath(country, s).href }));
    cur.push({
      key: p.id,
      image: p.images?.[0] ?? ch.hero,
      content: (
        <div>
          <Passage p={p} refs={refs} />
          {p.figure && (
            <div className="mt-10 max-w-[56ch]">
              <Bars figure={p.figure} compact />
            </div>
          )}
          {places.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {places.map(({ pl, href }) => (
                <li key={pl.slug}>
                  <Link href={href} className="font-medium text-accent-text underline decoration-line underline-offset-4 hover:decoration-current">
                    {pl.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {p.images?.slice(1, 2).map((id) => (
            <Figure key={id} id={id} sizes="(min-width:1024px) 30vw, 100vw" className="mt-10 max-w-[30rem]" imgClassName="w-full" />
          ))}
        </div>
      ),
    });
    if (p.widget || i === ch.passages.length - 1) {
      segments.push({ steps: cur, widget: p.widget, key: p.id });
      cur = [];
    }
  });

  return (
    <ThemeShell country={country}>
      <main id="main" data-pagefind-body>
        <CinemaHero
          ids={[ch.hero]}
          kicker={`Know ${c.entry.name}`}
          title={ch.title}
          summary={ch.summary}
          native={ch.native}
          entry={c.entry}
          trail={[{ href: "/", label: "Globe" }, { href: `/${country}/`, label: c.entry.name }, { label: ch.title }]}
        />

        {ch.facts && ch.facts.length > 0 && (
          <section aria-label="Key figures" className="relative isolate overflow-hidden pt-[16vh]">
            {vertical && ch.native && (
              <p aria-hidden lang={lang} className="cine-kanji tategaki pointer-events-none absolute right-[2vw] top-[4vh] -z-10 font-display max-md:hidden" style={{ "--n": [...(ch.native ?? "")].length } as React.CSSProperties}>
                {ch.native}
              </p>
            )}
            <FactBand facts={ch.facts} refs={refs} />
          </section>
        )}

        <nav aria-label="In this chapter" className="settle mx-auto max-w-[1400px] px-4 pb-[10vh] md:px-8">
          <h2 className="text-sm font-medium tracking-wide text-accent-text">In this chapter</h2>
          <ol className="mt-6 grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {ch.passages.map((p, i) => (
              <li key={p.id} className="grid grid-cols-[2rem_minmax(0,1fr)] items-baseline border-t border-line pt-3">
                <span className="text-sm tabular-nums text-muted">{i + 1}</span>
                <a href={`#${p.id}`} className="font-display text-lg leading-snug hover:text-accent-text">{p.heading}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="country-rule" aria-hidden />
        {segments.map((seg, i) => (
          <div key={seg.key}>
            <Story steps={seg.steps} label={i === 0 ? ch.title : `${ch.title}, continued`} flip={i % 2 === 1} />
            {seg.widget && (
              <section aria-label={`${ch.passages.find((x) => x.id === seg.key)?.heading}: explore the data`} className="settle mx-auto max-w-[1400px] px-4 py-[10vh] md:px-8">
                <Widget name={seg.widget} />
              </section>
            )}
          </div>
        ))}

        {ch.notApplicable && ch.notApplicable.length > 0 && (
          <section aria-labelledby="na-h" className="mx-auto max-w-[1400px] px-4 py-[10vh] md:px-8">
            <h2 id="na-h" className="font-display text-2xl">Left out, and why</h2>
            <ul className="mt-4 max-w-[65ch] space-y-3 text-muted">
              {ch.notApplicable.map((n) => (
                <li key={n.topic}>{n.why}</li>
              ))}
            </ul>
          </section>
        )}

        {others.length > 0 && (
          <section aria-labelledby="more-h" className="mx-auto max-w-[1400px] px-4 py-[12vh] md:px-8">
            <h2 id="more-h" className="settle font-display text-3xl md:text-5xl">More about {c.entry.name}</h2>
            <div className="mt-10">
              <Collage lang={lang} items={others.map((o) => ({ href: `/${country}/topics/${o.slug}/`, image: o.hero, title: o.title, native: o.native, summary: o.summary }))} />
            </div>
          </section>
        )}

        <div className="mx-auto max-w-[1400px] border-t border-line px-4 py-16 md:px-8">
          <SourceList refs={refs} />
        </div>
      </main>
    </ThemeShell>
  );
}
