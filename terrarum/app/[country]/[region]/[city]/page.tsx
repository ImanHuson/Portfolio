import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AtlasMap } from "@/components/map/AtlasMap";
import { Panorama } from "@/components/pano/Panorama";
import { Crumbs } from "@/components/ui/Crumbs";
import { Facts } from "@/components/ui/Facts";
import { Credit, Figure } from "@/components/ui/Figure";
import { Gaps } from "@/components/ui/Gaps";
import { Passage } from "@/components/ui/Passage";
import { PlaceCard } from "@/components/ui/PlaceCard";
import { SourceList } from "@/components/ui/Refs";
import { ThemeShell } from "@/components/ui/ThemeShell";
import { allStaticParams, getCity, getCountry, getPlace, getRegion, makeRefs, placePath } from "@/lib/content";
import { media } from "@/lib/content/media";

export const dynamicParams = false;
export function generateStaticParams() {
  return allStaticParams().cities;
}

export async function generateMetadata({ params }: PageProps<"/[country]/[region]/[city]">): Promise<Metadata> {
  const { country, city } = await params;
  const ci = getCity(country, city)!;
  return { title: `${ci.name}, ${getCountry(country)!.entry.name}`, description: ci.summary };
}

export default async function CityPage({ params }: PageProps<"/[country]/[region]/[city]">) {
  const { country, region, city } = await params;
  const c = getCountry(country);
  const r = getRegion(country, region);
  const ci = getCity(country, city);
  if (!c || !r || !ci) notFound();
  const places = ci.places.map((s) => ({ p: getPlace(country, s)!, href: placePath(country, s).href }));
  const refs = makeRefs([...ci.facts.map((f) => f.cite), ...ci.passages.map((p) => p.cite)]);
  const [grid, court, heritage] = ci.passages;
  const pano = ci.panoramas[0];

  return (
    <ThemeShell country={country}>
      <main id="main">
        <section className="relative">
          <div className="mx-auto grid max-w-[1400px] gap-8 px-4 pt-8 md:px-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:pt-12">
            <div className="order-2 flex gap-6 lg:order-1">
              <p className="tategaki enter font-display text-6xl text-accent md:text-8xl" lang="ja" aria-hidden>{ci.native}</p>
              <div className="enter-2 flex flex-col justify-end">
                <Crumbs trail={[{ href: "/", label: "Globe" }, { href: `/${country}/`, label: c.entry.name }, { href: `/${country}/${region}/`, label: r.name }, { label: ci.name }]} />
                <h1 className="mt-4 font-display text-5xl leading-none tracking-tight md:text-7xl">{ci.name}</h1>
                <p className="mt-5 max-w-[34ch] text-lg">{ci.summary}</p>
              </div>
            </div>
            <Figure id={ci.hero} priority sizes="(min-width:1024px) 66vw, 100vw" className="enter order-1 lg:order-2" imgClassName="aspect-[3/2] w-full object-cover" />
          </div>
        </section>

        <section aria-label="Key facts" className="mx-auto max-w-[1400px] px-4 py-16 md:px-8">
          <Facts facts={ci.facts} refs={refs} className="lg:grid-cols-5" />
        </section>

        <section aria-labelledby="places-h" className="border-t border-line">
          <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
            <h2 id="places-h" className="font-display text-3xl md:text-4xl">Three places in Kyoto</h2>
            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <div className="grid content-start gap-10">
                {places.map(({ p, href }) => (
                  <PlaceCard key={p.slug} place={p} href={href} />
                )).slice(0, 2)}
              </div>
              <div className="grid content-start gap-6">
                <AtlasMap
                  mode="streets"
                  label={`Street map of ${ci.name} with its researched places`}
                  bounds={[[135.745, 34.955], [135.8, 35.015]]}
                  pins={places.map(({ p, href }) => ({ label: p.name, lng: p.where.lng, lat: p.where.lat, href }))}
                  className="h-[min(70vh,600px)] min-h-[360px]"
                />
                <PlaceCard place={places[2].p} href={places[2].href} />
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-surface">
          <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-20 md:px-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
            <div className="space-y-14">
              <Passage p={grid} refs={refs} />
              <Passage p={court} refs={refs} />
            </div>
            {ci.artwork && <Figure id={ci.artwork} sizes="(min-width:1024px) 40vw, 100vw" imgClassName="w-full" className="self-start" />}
          </div>
        </section>

        {pano && (
          <section aria-labelledby="pano-h" className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
            <h2 id="pano-h" className="font-display text-3xl md:text-4xl">Arriving: {pano.title}</h2>
            <p className="mt-3 max-w-[60ch] text-muted">{pano.description}</p>
            <div className="mt-8">
              <Panorama src={media(pano.media).src} title={pano.title} yaw={pano.yaw} alt={media(pano.media).alt} />
              <p className="mt-2 text-[13px] text-muted"><Credit id={pano.media} /></p>
            </div>
          </section>
        )}

        <div className="mx-auto max-w-[1400px] px-4 pb-20 md:px-8">
          <Passage p={heritage} refs={refs} />
        </div>

        <div className="mx-auto max-w-[1400px] space-y-12 px-4 py-16 md:px-8">
          <Gaps gaps={ci.gaps} />
          <SourceList refs={refs} />
        </div>
      </main>
    </ThemeShell>
  );
}
