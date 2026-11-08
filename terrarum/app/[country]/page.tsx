import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AtlasMap } from "@/components/map/AtlasMap";
import { Crumbs } from "@/components/ui/Crumbs";
import { Facts } from "@/components/ui/Facts";
import { Figure } from "@/components/ui/Figure";
import { Gaps } from "@/components/ui/Gaps";
import { Bars, Passage } from "@/components/ui/Passage";
import { PlaceCard } from "@/components/ui/PlaceCard";
import { Cite, SourceList } from "@/components/ui/Refs";
import { ThemeShell } from "@/components/ui/ThemeShell";
import { getCountry, getPlace, getRegion, makeRefs, openCountrySlugs, placePath } from "@/lib/content";

export const dynamicParams = false;
export function generateStaticParams() {
  return openCountrySlugs().map((country) => ({ country }));
}

export async function generateMetadata({ params }: PageProps<"/[country]">): Promise<Metadata> {
  const c = getCountry((await params).country)!;
  return { title: c.entry.name, description: c.summary };
}

export default async function CountryPage({ params }: PageProps<"/[country]">) {
  const { country: slug } = await params;
  const c = getCountry(slug);
  if (!c) notFound();
  const regions = c.regions.map((r) => getRegion(slug, r)!);
  const pass = Object.fromEntries(c.passages.map((p) => [p.id, p]));
  const journey = c.journeys[0];
  const refs = makeRefs([...c.facts.map((f) => f.cite), ...c.passages.map((p) => p.cite), c.timeline.cite]);
  const open: Record<string, string> = Object.fromEntries(regions.map((r) => [r.geoKey, `/${slug}/${r.slug}/`]));
  const labels: Record<string, string> = Object.fromEntries([
    ...regions.map((r) => [r.geoKey, r.name] as const),
    ...c.pendingRegions.map((r) => [r.geoKey, r.name] as const),
  ]);
  const stops = journey.stops.map((s) => ({ ...s, p: getPlace(slug, s.place)!, href: placePath(slug, s.place).href }));

  return (
    <ThemeShell country={slug}>
      <main id="main">
        {/* Arrival: an Edo print, the name written as it is written there. */}
        <section className="mx-auto grid max-w-[1400px] gap-8 px-4 pb-16 pt-8 md:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:pt-12">
          <Figure id={c.hero} priority sizes="(min-width:1024px) 58vw, 100vw" className="enter" imgClassName="w-full" />
          <div className="flex gap-6 md:gap-10">
            <p className="tategaki enter-2 font-display text-6xl text-accent md:text-8xl" lang="ja" aria-hidden>
              {c.entry.native}
            </p>
            <div className="enter-3 flex flex-col justify-end">
              <Crumbs trail={[{ href: "/", label: "Globe" }, { label: c.entry.name }]} />
              <h1 className="mt-4 font-display text-5xl leading-none tracking-tight md:text-7xl">{c.entry.name}</h1>
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
              label={`Map of the regions of ${c.entry.name}. Open regions link to their page.`}
              bounds={[[127, 25.5], [146, 45.6]]}
              areas={{ url: c.regionsGeo, key: "region", open, labels }}
              className="h-[min(78vh,720px)] min-h-[420px]"
            />
            <div>
              <h2 id="regions-h" className="font-display text-3xl md:text-4xl">Eight regions, one open</h2>
              <p className="mt-4 max-w-[48ch] text-muted">
                Japan&rsquo;s regions are a convention, not a level of government. Kansai is researched; the others are on the map and
                waiting.
              </p>
              <ul className="mt-8 border-t border-line">
                {regions.map((r) => (
                  <li key={r.slug} className="border-b border-line">
                    <Link href={`/${slug}/${r.slug}/`} className="press flex items-baseline justify-between gap-4 py-4 hover:text-accent-text">
                      <span className="font-display text-2xl">
                        {r.name} <span className="text-base text-muted" lang="ja">{r.native}</span>
                      </span>
                      <span className="text-sm text-accent-text">Open</span>
                    </Link>
                  </li>
                ))}
                {c.pendingRegions.map((r) => (
                  <li key={r.geoKey} className="flex items-baseline justify-between gap-4 border-b border-line py-3 text-muted">
                    <span>
                      {r.name} <span className="text-sm" lang="ja">{r.native}</span>
                    </span>
                    <span className="text-sm">In research</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section aria-labelledby="start-h" className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
          <h2 id="start-h" className="font-display text-3xl md:text-4xl">Start in Kyoto</h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <PlaceCard place={stops[2].p} href={stops[2].href} size="lg" />
            <div className="grid gap-10">
              <PlaceCard place={stops[0].p} href={stops[0].href} />
              <PlaceCard place={stops[1].p} href={stops[1].href} />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1400px] px-4 pb-20 md:px-8">
          <Passage p={pass.land} refs={refs} />
        </div>

        <section id="history" aria-labelledby="history-h" className="scroll-mt-16 border-t border-line">
          <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
            <h2 id="history-h" className="font-display text-3xl md:text-4xl">From the Jōmon to Reiwa</h2>
            <p className="mt-4 max-w-[65ch] text-muted">
              {c.timeline.caveat}
              <Cite ids={c.timeline.cite} refs={refs} />
            </p>
            <ol className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {c.timeline.periods.map((p) => (
                <li key={p.name} className="grid grid-cols-[3.2rem_minmax(0,1fr)] gap-3 border-t border-line py-5">
                  <span className="font-display text-2xl leading-none text-accent" lang="ja">{p.native}</span>
                  <span>
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="font-display text-xl">{p.name}</span>
                      <span className="text-sm tabular-nums text-muted">{p.from} to {p.to}</span>
                    </span>
                    {p.note && <span className="mt-1 block text-[15px] text-muted">{p.note}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-band text-on-band">
          <div className="mx-auto grid max-w-[1400px] items-end gap-12 px-4 py-20 md:px-8 lg:grid-cols-2 [&_.ref]:text-on-band [&_.ref]:opacity-80">
            <Passage p={pass.belief} refs={refs} />
            {pass.belief.figure && <Bars figure={pass.belief.figure} />}
          </div>
        </section>

        <section className="mx-auto grid max-w-[1400px] gap-12 px-4 py-20 md:px-8 lg:grid-cols-2">
          <div>
            <Passage p={pass.food} refs={refs} />
            <Link href={stops[0].href} className="mt-6 inline-block font-medium text-accent-text underline underline-offset-4">
              Go to Nishiki Market
            </Link>
          </div>
          <Passage p={pass.language} refs={refs} />
        </section>

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
              label="Street map of Kyoto with the three stops of the route"
              bounds={[[135.745, 34.955], [135.8, 35.015]]}
              pins={stops.map((s, i) => ({ label: `${i + 1}. ${s.p.name}`, lng: s.p.where.lng, lat: s.p.where.lat, href: s.href }))}
              className="h-[min(70vh,640px)] min-h-[380px]"
            />
          </div>
        </section>

        <div className="mx-auto max-w-[1400px] space-y-12 px-4 py-16 md:px-8">
          <Gaps gaps={c.gaps} />
          <SourceList refs={refs} />
        </div>
      </main>
    </ThemeShell>
  );
}
