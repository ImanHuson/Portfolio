import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AtlasMap } from "@/components/map/AtlasMap";
import { Crumbs } from "@/components/ui/Crumbs";
import { Facts } from "@/components/ui/Facts";
import { Figure } from "@/components/ui/Figure";
import { Gaps } from "@/components/ui/Gaps";
import { NativeName } from "@/components/ui/NativeName";
import { Bars, Passage } from "@/components/ui/Passage";
import { PlaceCard } from "@/components/ui/PlaceCard";
import { Cite, SourceList } from "@/components/ui/Refs";
import { ThemeShell } from "@/components/ui/ThemeShell";
import { cityPath, getCity, getCountry, getPlace, getRegion, makeRefs, openCountrySlugs, placePath } from "@/lib/content";
import type { Passage as P } from "@/lib/content/types";
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
  const regions = c.regions.map((r) => getRegion(slug, r)!);
  const firstCity = getCity(slug, regions[0].cities[0])!;
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

  return (
    <ThemeShell country={slug}>
      <main id="main" data-pagefind-body>
        <section className="mx-auto grid max-w-[1400px] gap-8 px-4 pb-16 pt-8 md:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:pt-12">
          <Figure id={c.hero} priority sizes="(min-width:1024px) 58vw, 100vw" className="enter" imgClassName="w-full" />
          <div className={`flex gap-6 md:gap-10 ${themeFor(slug)?.native === "vertical" ? "" : "flex-col justify-between"}`}>
            <NativeName text={e.native} entry={e} className="enter-2" />
            <div className="enter-3 flex min-w-0 flex-col justify-end">
              <Crumbs trail={[{ href: "/", label: "Globe" }, { label: e.name }]} />
              <h1 className="mt-4 font-display text-5xl leading-none tracking-tight md:text-6xl xl:text-7xl">{e.name}</h1>
              <p className="mt-5 max-w-[38ch] text-lg">{c.summary}</p>
            </div>
          </div>
        </section>

        <section aria-label="Key facts" className="mx-auto max-w-[1400px] px-4 pb-20 md:px-8">
          <Facts facts={c.facts} refs={refs} className="lg:grid-cols-4" />
        </section>

        <section aria-labelledby="regions-h" className="border-y border-line bg-surface">
          <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 md:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
            <AtlasMap
              mode="areas"
              label={`Map of ${e.name}. Open areas link to their page.`}
              bounds={c.regionsBounds}
              areas={{ url: c.regionsGeo, key: "region", open, labels, asPoints: c.regionsAsPoints }}
              className="h-[min(78vh,720px)] min-h-[420px]"
            />
            <div>
              <h2 id="regions-h" className="font-display text-3xl md:text-4xl">{c.regionsHeading}</h2>
              <p className="mt-4 max-w-[48ch] text-muted">{c.regionsNote}</p>
              <ul className="mt-8 border-t border-line">
                {regions.map((r) => (
                  <li key={r.slug} className="border-b border-line">
                    <Link href={`/${slug}/${r.slug}/`} className="press flex items-baseline justify-between gap-4 py-4 hover:text-accent-text">
                      <span className="font-display text-2xl">
                        {r.name} {r.native && <span className="text-base text-muted" lang={e.nativeLang?.split(" ")[0]}>{r.native}</span>}
                      </span>
                      <span className="text-sm text-accent-text">Open</span>
                    </Link>
                  </li>
                ))}
                {c.pendingRegions.map((r) => (
                  <li key={r.geoKey} className="flex items-baseline justify-between gap-4 border-b border-line py-3 text-muted">
                    <span>
                      {r.name} {r.native && <span className="text-sm" lang={e.nativeLang?.split(" ")[0]}>{r.native}</span>}
                    </span>
                    <span className="text-sm">In research</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section aria-labelledby="start-h" className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
          <h2 id="start-h" className="font-display text-3xl md:text-4xl">
            Start in <Link href={cityPath(slug, firstCity.slug).href} className="underline decoration-line underline-offset-8 hover:decoration-current">{firstCity.name}</Link>
          </h2>
          {starts.length >= 3 ? (
            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
              <PlaceCard lang={lang} place={starts[starts.length - 1].p} href={starts[starts.length - 1].href} size="lg" />
              <div className="grid gap-10">
                {starts.slice(0, -1).map((s) => <PlaceCard lang={lang} key={s.p.slug} place={s.p} href={s.href} />)}
              </div>
            </div>
          ) : (
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              {starts.map((s) => <PlaceCard lang={lang} key={s.p.slug} place={s.p} href={s.href} size="lg" />)}
            </div>
          )}
        </section>

        {lead && (
          <div className="mx-auto max-w-[1400px] px-4 pb-20 md:px-8">
            <Passage p={lead} refs={refs} />
            {seeAlso(lead)}
          </div>
        )}

        <section id="history" aria-labelledby="history-h" className="scroll-mt-16 border-t border-line">
          <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
            <h2 id="history-h" className="font-display text-3xl md:text-4xl">{c.timeline.title}</h2>
            <p className="mt-4 max-w-[65ch] text-muted">
              {c.timeline.caveat}
              <Cite ids={c.timeline.cite} refs={refs} />
            </p>
            <ol className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {c.timeline.periods.map((p) => (
                <li key={p.name} className={`grid gap-3 border-t border-line py-5 ${p.native ? "grid-cols-[3.2rem_minmax(0,1fr)]" : "grid-cols-[minmax(0,1fr)]"}`}>
                  {p.native && <span className="font-display text-2xl leading-none text-accent" lang={e.nativeLang?.split(" ")[0]}>{p.native}</span>}
                  <span>
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="font-display text-xl">{p.name}</span>
                      <span className="text-sm tabular-nums text-muted">{p.from === p.to ? p.from : `${p.from} to ${p.to}`}</span>
                    </span>
                    {p.note && <span className="mt-1 block text-[15px] text-muted">{p.note}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {banded.map((p) => (
          <section key={p.id} className="bg-band text-on-band">
            <div className="mx-auto grid max-w-[1400px] items-end gap-12 px-4 py-20 md:px-8 lg:grid-cols-2 [&_.ref]:text-on-band [&_.ref]:opacity-80">
              <div>
                <Passage p={p} refs={refs} />
                {seeAlso(p)}
              </div>
              {p.figure && <Bars figure={p.figure} />}
            </div>
          </section>
        ))}

        {paired.length > 0 && (
          <section className="mx-auto grid max-w-[1400px] gap-x-12 gap-y-16 px-4 py-20 md:px-8 lg:grid-cols-2">
            {paired.map((p) => (
              <div key={p.id}>
                <Passage p={p} refs={refs} />
                {seeAlso(p)}
              </div>
            ))}
          </section>
        )}

        {journey && (
          <section id={`journey-${journey.slug}`} aria-labelledby="journey-h" className="scroll-mt-16 border-t border-line bg-surface">
            <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-20 md:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <div>
                <h2 id="journey-h" className="font-display text-3xl md:text-4xl">{journey.title}</h2>
                <p className="mt-4 max-w-[48ch] text-muted">{journey.summary}</p>
                <ol className="mt-8 space-y-6">
                  {stops.map((s, i) => (
                    <li key={s.place} className="grid grid-cols-[2.5rem_minmax(0,1fr)]">
                      <span className="font-display text-3xl leading-none text-accent tabular-nums">{i + 1}</span>
                      <span>
                        <Link href={s.href} className="font-display text-xl underline-offset-4 hover:underline">{s.p.name}</Link>
                        <span className="mt-1 block text-muted">{s.why}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="mt-8 border-t border-line pt-4 text-sm text-muted">{journey.limits}</p>
              </div>
              <AtlasMap
                mode="streets"
                label={`Street map with the ${WORDS[stops.length]?.toLowerCase() ?? stops.length} stops of the route`}
                bounds={boundsOf(stops.map((s) => s.p.where), 0.3, 0.008)}
                pins={stops.map((s, i) => ({ label: `${i + 1}. ${s.p.name}`, lng: s.p.where.lng, lat: s.p.where.lat, href: s.href }))}
                className="h-[min(70vh,640px)] min-h-[380px]"
              />
            </div>
          </section>
        )}

        <div className="mx-auto max-w-[1400px] space-y-12 px-4 py-16 md:px-8">
          <Gaps gaps={c.gaps} />
          <SourceList refs={refs} />
        </div>
      </main>
    </ThemeShell>
  );
}
