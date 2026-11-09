import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Widget } from "@/components/chapter/Widget";
import { Crumbs } from "@/components/ui/Crumbs";
import { Facts } from "@/components/ui/Facts";
import { Figure } from "@/components/ui/Figure";
import { Bars, Passage } from "@/components/ui/Passage";
import { SourceList } from "@/components/ui/Refs";
import { ThemeShell } from "@/components/ui/ThemeShell";
import { getCountry, getPlace, makeRefs, openCountrySlugs, placePath } from "@/lib/content";
import { imgSrc, media } from "@/lib/content/media";

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

  return (
    <ThemeShell country={country}>
      <main id="main" data-pagefind-body>
        <header className="mx-auto grid max-w-[1400px] gap-8 px-4 pb-16 pt-8 md:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end lg:pt-12">
          <div className="enter-2 lg:pb-4">
            <Crumbs trail={[{ href: "/", label: "Globe" }, { href: `/${country}/`, label: c.entry.name }, { label: ch.title }]} />
            {ch.native && (
              <p className="mt-6 font-display text-2xl text-accent-text" lang={lang}>
                {ch.native}
              </p>
            )}
            <h1 className="mt-2 font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">{ch.title}</h1>
            <p className="mt-5 max-w-[46ch] text-lg">{ch.summary}</p>
          </div>
          <Figure id={ch.hero} priority sizes="(min-width:1024px) 58vw, 100vw" className="enter" imgClassName="aspect-[3/2] w-full object-cover" />
        </header>

        {ch.facts && ch.facts.length > 0 && (
          <section aria-label="Key figures" className="mx-auto max-w-[1400px] px-4 pb-16 md:px-8">
            <Facts facts={ch.facts} refs={refs} className="lg:grid-cols-4" />
          </section>
        )}

        <div className="mx-auto grid max-w-[1400px] gap-10 border-t border-line px-4 py-16 md:px-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
          <nav aria-label="In this chapter" className="lg:sticky lg:top-24 lg:self-start">
            <details className="group lg:hidden">
              <summary className="cursor-pointer list-none py-2 font-medium">
                Contents <span className="text-muted">({ch.passages.length})</span>
              </summary>
              <ol className="mt-2 space-y-2 border-l border-line pl-4 text-sm">
                {ch.passages.map((p) => (
                  <li key={p.id}>
                    <a href={`#${p.id}`} className="hover:text-accent-text">{p.heading}</a>
                  </li>
                ))}
              </ol>
            </details>
            <ol className="hidden space-y-2.5 border-l border-line pl-4 text-sm lg:block">
              {ch.passages.map((p) => (
                <li key={p.id}>
                  <a href={`#${p.id}`} className="text-muted hover:text-accent-text">{p.heading}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-24">
            {ch.passages.map((p) => {
              const places = (p.places ?? []).map((s) => ({ pl: getPlace(country, s)!, href: placePath(country, s).href }));
              return (
                <div key={p.id} className="grid items-start gap-8 xl:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] xl:gap-12">
                  {p.widget && (
                    <div className="order-last xl:col-span-2">
                      <Widget name={p.widget} />
                    </div>
                  )}
                  <div>
                    <Passage p={p} refs={refs} />
                    {p.figure && p.images?.length ? (
                      <div className="mt-10 max-w-[56ch]">
                        <Bars figure={p.figure} compact />
                      </div>
                    ) : null}
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
                  </div>
                  {p.figure && !p.images?.length && (
                    <div className="xl:mt-14">
                      <Bars figure={p.figure} compact />
                    </div>
                  )}
                  {p.images && p.images.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 xl:mt-14 xl:grid-cols-1">
                      {p.images.slice(0, 2).map((id) => (
                        <Figure key={id} id={id} sizes="(min-width:1280px) 28vw, (min-width:640px) 45vw, 100vw" imgClassName="w-full" />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {ch.notApplicable && ch.notApplicable.length > 0 && (
          <section aria-labelledby="na-h" className="mx-auto max-w-[1400px] px-4 pb-16 md:px-8">
            <h2 id="na-h" className="font-display text-2xl">Left out, and why</h2>
            <ul className="mt-4 max-w-[65ch] space-y-3 text-muted">
              {ch.notApplicable.map((n) => (
                <li key={n.topic}>{n.why}</li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="more-h" className="border-t border-line bg-surface">
          <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8">
            <h2 id="more-h" className="font-display text-3xl">More about {c.entry.name}</h2>
            <ul className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/${country}/topics/${o.slug}/`} className="lift press zoom group block">
                    <div className="overflow-hidden">
                      <Figure id={o.hero} credit="none" sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 100vw" imgClassName="aspect-[4/3] w-full object-cover" />
                    </div>
                    <p className="mt-3 font-display text-xl group-hover:text-accent-text">{o.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8">
          <SourceList refs={refs} />
        </div>
      </main>
    </ThemeShell>
  );
}
