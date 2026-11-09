import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AtlasMap } from "@/components/map/AtlasMap";
import { CinemaHero } from "@/components/story/CinemaHero";
import { Collage } from "@/components/story/Collage";
import { FactBand } from "@/components/story/Statement";
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

  const lang = c.entry.nativeLang?.split(" ")[0];

  return (
    <ThemeShell country={country}>
      <main id="main" data-pagefind-body>
        <CinemaHero
          ids={cities.map((x) => x.hero)}
          kicker={`Region of ${c.entry.name}`}
          title={r.name}
          summary={r.summary}
          native={r.native}
          entry={c.entry}
          trail={[{ href: "/", label: "Globe" }, { href: `/${country}/`, label: c.entry.name }, { label: r.name }]}
        />

        <section aria-label="Key facts" className="pt-[12vh]">
          <FactBand facts={r.facts} refs={refs} />
        </section>

        <section aria-labelledby="cities-h" className="mx-auto max-w-[1400px] px-4 pb-[12vh] md:px-8">
          <h2 id="cities-h" className="settle font-display text-4xl md:text-6xl">{cities.length === 1 ? "One city" : `${cities.length} cities`} to enter</h2>
          <div className="mt-12">
            <Collage lang={lang} items={cities.map((city) => ({ href: cityPath(country, city.slug).href, image: city.hero, title: city.name, native: city.native, summary: city.summary }))} />
          </div>
          {r.pendingCities.length > 0 && (
            <div className="mt-16 max-w-[40rem]">
              <h3 className="text-sm text-muted">Not researched yet</h3>
              <ul className="mt-3">
                {r.pendingCities.map((p) => (
                  <li key={p.name} className="flex justify-between border-t border-line py-3 text-muted">
                    <span>{p.name}</span>
                    {p.native && <span lang={lang}>{p.native}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <div className="country-rule" aria-hidden />
        <section className="settle mx-auto grid max-w-[1400px] items-center gap-12 px-4 py-[12vh] md:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <AtlasMap
            mode="areas"
            label={`Map of ${r.name}, with ${cities.map((x) => x.name).join(" and ")} marked`}
            bounds={r.bounds}
            areas={{ ...r.areasGeo, open: {} }}
            pins={cities.map((city) => ({ label: city.name, native: city.native, nativeLang: lang, lng: city.where.lng, lat: city.where.lat, href: cityPath(country, city.slug).href, current: true }))}
            className="h-[min(80vh,720px)] min-h-[380px]"
          />
          <div>
            <Passage p={r.definition} refs={refs} />
            {r.image && <Figure id={r.image} sizes="(min-width:1024px) 40vw, 100vw" className="mt-10" imgClassName="w-full" />}
          </div>
        </section>

        <div className="mx-auto max-w-[1400px] space-y-12 border-t border-line px-4 py-16 md:px-8">
          <Gaps gaps={r.gaps} />
          <SourceList refs={refs} />
        </div>
      </main>
    </ThemeShell>
  );
}
