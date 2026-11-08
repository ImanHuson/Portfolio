import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { AtlasMap } from "@/components/map/AtlasMap";
import { Crumbs } from "@/components/ui/Crumbs";
import { Facts } from "@/components/ui/Facts";
import { Figure } from "@/components/ui/Figure";
import { Gaps } from "@/components/ui/Gaps";
import { Passage } from "@/components/ui/Passage";
import { SourceList } from "@/components/ui/Refs";
import { ThemeShell } from "@/components/ui/ThemeShell";
import { allStaticParams, cityPath, getCity, getCountry, getRegion, makeRefs } from "@/lib/content";

export const dynamicParams = false;
export function generateStaticParams() {
  return allStaticParams().regions;
}

export async function generateMetadata({ params }: PageProps<"/[country]/[region]">): Promise<Metadata> {
  const { country, region } = await params;
  const r = getRegion(country, region)!;
  return { title: `${r.name}, ${getCountry(country)!.entry.name}`, description: r.summary };
}

export default async function RegionPage({ params }: PageProps<"/[country]/[region]">) {
  const { country, region } = await params;
  const c = getCountry(country);
  const r = getRegion(country, region);
  if (!c || !r) notFound();
  const cities = r.cities.map((s) => getCity(country, s)!);
  const refs = makeRefs([...r.facts.map((f) => f.cite), r.definition.cite]);

  return (
    <ThemeShell country={country}>
      <main id="main">
        <section className="mx-auto grid max-w-[1400px] gap-10 px-4 pb-16 pt-8 md:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:pt-12">
          <div className="flex gap-6">
            <p className="tategaki enter font-display text-6xl text-accent md:text-7xl" lang="ja" aria-hidden>{r.native}</p>
            <div className="enter-2 flex flex-col justify-end">
              <Crumbs trail={[{ href: "/", label: "Globe" }, { href: `/${country}/`, label: c.entry.name }, { label: r.name }]} />
              <h1 className="mt-4 font-display text-5xl leading-none tracking-tight md:text-7xl">{r.name}</h1>
              <p className="mt-5 max-w-[40ch] text-lg">{r.summary}</p>
            </div>
          </div>
          <AtlasMap
            mode="areas"
            label={`Map of the prefectures of ${r.name}, with Kyoto marked`}
            bounds={[[134.2, 33.4], [137.0, 35.8]]}
            areas={{ url: "/data/jp-prefectures.json", key: "region", only: [r.geoKey], open: {}, labelProp: "name" }}
            pins={cities.map((city) => ({ label: city.name, native: city.native, lng: city.where.lng, lat: city.where.lat, href: cityPath(country, city.slug).href, current: true }))}
            className="enter-3 h-[min(70vh,620px)] min-h-[380px]"
          />
        </section>

        <section className="mx-auto grid max-w-[1400px] gap-12 px-4 pb-20 md:px-8 lg:grid-cols-2">
          <Passage p={r.definition} refs={refs} />
          <Facts facts={r.facts} refs={refs} className="sm:grid-cols-1 self-end" />
        </section>

        <section aria-labelledby="cities-h" className="border-t border-line bg-surface">
          <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
            <h2 id="cities-h" className="font-display text-3xl md:text-4xl">Cities</h2>
            <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
              {cities.map((city) => (
                <Link key={city.slug} href={cityPath(country, city.slug).href} className="lift press zoom group grid gap-6 md:grid-cols-2">
                  <div className="overflow-hidden">
                    <Figure id={city.hero} credit="none" sizes="(min-width:768px) 33vw, 100vw" imgClassName="aspect-[4/5] w-full object-cover" />
                  </div>
                  <div className="self-end">
                    <h3 className="font-display text-4xl">
                      {city.name} <span className="text-2xl text-muted" lang="ja">{city.native}</span>
                    </h3>
                    <p className="mt-3 text-muted">{city.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-2 font-medium text-accent-text group-hover:underline">
                      Enter {city.name} <ArrowRight size={16} aria-hidden />
                    </span>
                  </div>
                </Link>
              ))}
              <div>
                <h3 className="text-sm text-muted">Not researched yet</h3>
                <ul className="mt-3">
                  {r.pendingCities.map((p) => (
                    <li key={p.name} className="flex justify-between border-t border-line py-3 text-muted">
                      <span>{p.name}</span>
                      <span lang="ja">{p.native}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1400px] space-y-12 px-4 py-16 md:px-8">
          <Gaps gaps={r.gaps} />
          <SourceList refs={refs} />
        </div>
      </main>
    </ThemeShell>
  );
}
