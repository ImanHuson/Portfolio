import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AtlasMap } from "@/components/map/AtlasMap";
import { CinemaHero } from "@/components/story/CinemaHero";
import { Collage } from "@/components/story/Collage";
import { FactBand } from "@/components/story/Statement";
import { Story, type StoryStep } from "@/components/story/Story";
import { Omikuji } from "@/components/ornament/Omikuji";
import { SeasonNow } from "@/components/ornament/SeasonNow";
import { Gaps } from "@/components/ui/Gaps";
import { Bars, Passage } from "@/components/ui/Passage";
import { Cite, SourceList } from "@/components/ui/Refs";
import { ThemeShell } from "@/components/ui/ThemeShell";
import { cityPath, getCity, getCountry, getPlace, getRegion, makeRefs, openCountrySlugs, placePath } from "@/lib/content";
import type { Passage as P } from "@/lib/content/types";
import { imgSrc, imgSrcSet, media } from "@/lib/content/media";
import { boundsOf } from "@/lib/geo";
import { themeFor } from "@/lib/themes";

export const dynamicParams = false;
export function generateStaticParams() {
  return openCountrySlugs().map((country) => ({ country }));
}

export async function generateMetadata({ params }: PageProps<"/[country]">): Promise<Metadata> {
  const c = getCountry((await params).country)!;
  return { title: c.entry.name, description: c.summary };
}

const WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

export default async function CountryPage({ params }: PageProps<"/[country]">) {
  const { country: slug } = await params;
  const c = getCountry(slug);
  if (!c) notFound();
  const e = c.entry;
  const lang = e.nativeLang?.split(" ")[0];
  const orn = themeFor(slug)?.ornament;
  const regions = c.regions.map((r) => getRegion(slug, r)!);
  const firstCity = getCity(slug, c.startCity ?? regions[0].cities[0])!;
  const starts = firstCity.places.map((p) => ({ p: getPlace(slug, p)!, href: placePath(slug, p).href }));
  const journey = c.journeys[0];
  const stops = journey?.stops.map((s) => ({ ...s, p: getPlace(slug, s.place)!, href: placePath(slug, s.place).href })) ?? [];
  const refs = makeRefs([...c.facts.map((f) => f.cite), ...c.passages.map((p) => p.cite), c.timeline.cite]);
  const open: Record<string, string> = Object.fromEntries(regions.map((r) => [r.geoKey, `/${slug}/${r.slug}/`]));
  const labels: Record<string, string> = Object.fromEntries([
    ...regions.map((r) => [r.geoKey, r.name] as const),
    ...c.pendingRegions.map((r) => [r.geoKey, r.name] as const),
  ]);
  const [lead, ...rest] = c.passages;
  const banded = rest.filter((p) => p.figure);
  const paired = rest.filter((p) => !p.figure);
  const seeAlso = (p: P) =>
    p.seeAlso && (
      <Link href={placePath(slug, p.seeAlso.place).href} className="mt-6 inline-block font-medium text-accent-text underline underline-offset-4">
        {p.seeAlso.label}
      </Link>
    );

  const firstChapter = c.chapters[0];
  const heroes = [firstChapter?.hero, firstCity.hero, ...starts.slice(0, 3).map((x) => x.p.hero)].filter((x): x is string => !!x).slice(0, 4);
  // The country's own passages are told beside its print and its places.
  const pool = [c.hero, ...starts.map((x) => x.p.hero).filter((h) => !heroes.includes(h)), ...starts.map((x) => x.p.hero)];
  const told = [lead, ...paired].filter((x): x is P => !!x);
  const steps: StoryStep[] = told.map((x, i) => ({
    key: x.id,
    image: x.images?.[0] ?? pool[i % pool.length],
    content: (
      <div>
        <Passage p={x} refs={refs} />
        {seeAlso(x)}
      </div>
    ),
  }));

  return (
    <ThemeShell country={slug}>
      <main id="main" data-pagefind-body>
        <CinemaHero ids={heroes} kicker="Country" title={e.name} summary={c.summary} native={e.native} entry={e} trail={[{ href: "/", label: "Globe" }, { label: e.name }]} />

        <section aria-label="Key facts" className="relative isolate overflow-hidden pt-[16vh]">
          {themeFor(slug)?.native === "vertical" && e.native && (
            <p aria-hidden lang={lang} className="cine-kanji tategaki pointer-events-none absolute right-[2vw] top-[4vh] -z-10 font-display max-md:hidden" style={{ "--n": [...(e.native ?? "")].length } as React.CSSProperties}>
              {e.native}
            </p>
          )}
          <FactBand facts={c.facts} refs={refs} />
        </section>
        {orn?.seasons && <SeasonNow place={orn.capital.name} lat={orn.capital.lat} lng={orn.capital.lng} timeZone={orn.timeZone} />}

        <div className="country-rule" aria-hidden />
        <section aria-labelledby="regions-h" className="relative">
          <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-4 py-[12vh] md:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <AtlasMap
              mode="areas"
              label={`Map of ${e.name}. Open areas link to their page.`}
              bounds={c.regionsBounds}
              areas={{ url: c.regionsGeo, key: "region", open, labels, asPoints: c.regionsAsPoints }}
              className="h-[min(88vh,820px)] min-h-[420px]"
            />
            <div className="settle">
              <h2 id="regions-h" className="font-display text-4xl md:text-6xl">{c.regionsHeading}</h2>
              <p className="mt-5 max-w-[46ch] text-muted">{c.regionsNote}</p>
              <ul className="mt-10">
                {regions.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/${slug}/${r.slug}/`} className="press group flex items-baseline gap-4 py-3">
                      <span className="font-display text-4xl text-ink group-hover:text-accent-text md:text-5xl">{r.name}</span>
                      {r.native && <span className="font-display text-2xl text-accent" lang={lang}>{r.native}</span>}
                    </Link>
                  </li>
                ))}
                {c.pendingRegions.map((r) => (
                  <li key={r.geoKey} className="flex items-baseline gap-3 py-1.5 text-muted">
                    <span className="font-display text-xl">{r.name}</span>
                    {r.native && <span className="text-sm" lang={lang}>{r.native}</span>}
                    <span className="ml-auto text-[13px]">In research</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {c.chapters.length > 0 && (
          <section aria-labelledby="chapters-h" className="mx-auto max-w-[1400px] px-4 pb-[12vh] md:px-8">
            <h2 id="chapters-h" className="settle font-display text-4xl md:text-6xl">Know {e.name}</h2>
            <ul className={`mt-12 grid gap-8 ${c.chapters.length > 1 ? "lg:grid-cols-2" : ""}`}>
              {c.chapters.map((ch) => {
                const m = media(ch.hero);
                return (
                  <li key={ch.slug} className="settle">
                    <Link href={`/${slug}/topics/${ch.slug}/`} className="press zoom group relative block overflow-hidden">
                      <img src={imgSrc(m, 1920)} srcSet={imgSrcSet(m)} sizes="(min-width:1024px) 90vw, 100vw" width={m.width} height={m.height} alt={m.alt} loading="lazy" decoding="async" className="photo aspect-[4/3] w-full object-cover md:aspect-[21/9]" />
                      <div className="tile-scrim-side absolute inset-0" aria-hidden />
                      <div className="absolute inset-y-0 left-0 flex max-w-[40rem] flex-col justify-end gap-3 p-6 text-[#f3ece0] md:p-12">
                        <h3 className="font-display text-3xl md:text-5xl">{ch.title}</h3>
                        {ch.native && <p className="order-first font-display text-5xl text-[#f08068] md:text-7xl" lang={lang} aria-hidden>{ch.native}</p>}
                        <p className="text-[15px] leading-snug text-[#e1d9cb] md:text-lg">{ch.summary}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section aria-labelledby="start-h" className="mx-auto max-w-[1400px] px-4 pb-[12vh] md:px-8">
          <h2 id="start-h" className="settle font-display text-4xl md:text-6xl">
            Start in <Link href={cityPath(slug, firstCity.slug).href} className="underline decoration-line underline-offset-8 hover:decoration-current">{firstCity.name}</Link>
          </h2>
          <div className="mt-12">
            <Collage lang={lang} items={starts.slice(0, 6).map(({ p, href }) => ({ href, image: p.hero, title: p.name, kicker: p.kind, native: p.native, summary: p.summary }))} />
          </div>
          {starts.length > 6 && (
            <p className="mt-10">
              <Link href={cityPath(slug, firstCity.slug).href} className="font-medium text-accent-text underline underline-offset-4">
                All {starts.length} places in {firstCity.name}
              </Link>
            </p>
          )}
        </section>

        {orn?.omikuji && (
          <Omikuji
            lots={regions.flatMap((r) => r.cities.flatMap((cs) => getCity(slug, cs)!.places.map((ps) => getPlace(slug, ps)!).map((pl) => ({ href: placePath(slug, pl.slug).href, name: pl.name, native: pl.native, kind: pl.kind }))))}
          />
        )}

        <div className="country-rule" aria-hidden />
        <Story steps={steps} label={`About ${e.name}`} />

        <section id="history" aria-labelledby="history-h" className="scroll-mt-16 py-[12vh]">
          <div className="settle mx-auto max-w-[1400px] px-4 md:px-8">
            <h2 id="history-h" className="font-display text-4xl md:text-6xl">{c.timeline.title}</h2>
            <p className="mt-5 max-w-[65ch] text-muted">
              {c.timeline.caveat}
              <Cite ids={c.timeline.cite} refs={refs} />
            </p>
          </div>
          <ol tabIndex={0} aria-label={`${c.timeline.title}, oldest first; scrolls sideways`} className="mt-12 flex snap-x snap-mandatory gap-px overflow-x-auto px-4 pb-6 md:px-8 [scrollbar-color:var(--accent)_transparent] [scrollbar-width:thin]">
            {c.timeline.periods.map((p) => (
              <li key={p.name} className="w-[15rem] shrink-0 snap-start border-l border-line px-6 py-2 md:w-[17rem]">
                {p.native && <span className="block font-display text-6xl leading-none text-accent md:text-7xl" lang={lang}>{p.native}</span>}
                <span className="mt-6 block font-display text-2xl">{p.name}</span>
                <span className="mt-1 block text-sm tabular-nums text-muted">{p.from === p.to ? p.from : `${p.from} to ${p.to}`}</span>
                {p.note && <span className="mt-3 block text-[15px] leading-snug text-muted">{p.note}</span>}
              </li>
            ))}
          </ol>
        </section>

        {banded.map((p) => (
          <section key={p.id} className="bg-band text-on-band">
            <div className="settle mx-auto grid max-w-[1400px] items-end gap-12 px-4 py-[12vh] md:px-8 lg:grid-cols-2 [&_.ref]:text-on-band [&_.ref]:opacity-80">
              <div>
                <Passage p={p} refs={refs} />
                {seeAlso(p)}
              </div>
              {p.figure && <Bars figure={p.figure} />}
            </div>
          </section>
        ))}

        {journey && (
          <section id={`journey-${journey.slug}`} aria-labelledby="journey-h" className="scroll-mt-16">
            <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-[14vh] md:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <div className="settle">
                <h2 id="journey-h" className="font-display text-4xl md:text-5xl">{journey.title}</h2>
                <p className="mt-4 max-w-[48ch] text-muted">{journey.summary}</p>
                <ol className="mt-10 space-y-8">
                  {stops.map((s, i) => {
                    const m = media(s.p.hero);
                    return (
                      <li key={s.place} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-5">
                        <Link href={s.href} className="zoom relative block overflow-hidden" tabIndex={-1} aria-hidden>
                          <img src={imgSrc(m, 330)} alt="" width={m.width} height={m.height} loading="lazy" className="photo aspect-square w-full object-cover" />
                          <span className="absolute left-1.5 top-1 font-display text-2xl text-[#f3ece0] [text-shadow:0_1px_6px_rgb(0_0_0/0.8)]">{i + 1}</span>
                        </Link>
                        <span>
                          <Link href={s.href} className="font-display text-2xl underline-offset-4 hover:underline">{s.p.name}</Link>
                          <span className="mt-1 block text-muted">{s.why}</span>
                        </span>
                      </li>
                    );
                  })}
                </ol>
                <p className="mt-10 border-t border-line pt-4 text-sm text-muted">{journey.limits}</p>
              </div>
              <AtlasMap
                mode="streets"
                label={`Street map with the ${WORDS[stops.length]?.toLowerCase() ?? stops.length} stops of the route`}
                bounds={boundsOf(stops.map((s) => s.p.where), 0.3, 0.008)}
                pins={stops.map((s, i) => ({ label: `${i + 1}. ${s.p.name}`, lng: s.p.where.lng, lat: s.p.where.lat, href: s.href }))}
                className="h-[min(80vh,720px)] min-h-[380px] lg:sticky lg:top-20"
              />
            </div>
          </section>
        )}

        <div className="mx-auto max-w-[1400px] space-y-12 border-t border-line px-4 py-16 md:px-8">
          <Gaps gaps={c.gaps} />
          <SourceList refs={refs} />
        </div>
      </main>
    </ThemeShell>
  );
}
