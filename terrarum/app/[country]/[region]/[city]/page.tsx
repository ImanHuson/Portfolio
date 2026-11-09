import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AtlasMap } from "@/components/map/AtlasMap";
import { Panorama } from "@/components/pano/Panorama";
import { Crumbs } from "@/components/ui/Crumbs";
import { Facts } from "@/components/ui/Facts";
import { Credit, Figure } from "@/components/ui/Figure";
import { Gaps } from "@/components/ui/Gaps";
import { NativeName } from "@/components/ui/NativeName";
import { Passage } from "@/components/ui/Passage";
import { PlaceCard } from "@/components/ui/PlaceCard";
import { SaveButton } from "@/components/ui/SaveButton";
import { SourceList } from "@/components/ui/Refs";
import { ThemeShell } from "@/components/ui/ThemeShell";
import { themeFor } from "@/lib/themes";
import { allStaticParams, getCity, getCountry, getPlace, getRegion, makeRefs, placePath } from "@/lib/content";
import { imgSrc, media } from "@/lib/content/media";
import { boundsOf } from "@/lib/geo";

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
  const lang = c.entry.nativeLang?.split(" ")[0];
  const head = ci.passages.slice(0, 2);
  const tail = ci.passages.slice(2);
  const WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six"];
  const pano = ci.panoramas[0];

  return (
    <ThemeShell country={country}>
      <main id="main" data-pagefind-body>
        <section className="relative">
          <div className="mx-auto grid max-w-[1400px] gap-8 px-4 pt-8 md:px-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:pt-12">
            <div className={`order-2 flex gap-6 lg:order-1 ${themeFor(country)?.native === "vertical" ? "" : "flex-col justify-between"}`}>
              <NativeName text={ci.native} entry={c.entry} className="enter" />
              <div className="enter-2 flex flex-col justify-end">
                <Crumbs trail={[{ href: "/", label: "Globe" }, { href: `/${country}/`, label: c.entry.name }, { href: `/${country}/${region}/`, label: r.name }, { label: ci.name }]} />
                <h1 className="mt-4 font-display text-5xl leading-none tracking-tight md:text-7xl">{ci.name}</h1>
                <p className="mt-5 max-w-[34ch] text-lg">{ci.summary}</p>
                <div className="mt-5">
                  <SaveButton href={`/${country}/${region}/${city}/`} title={ci.name} kind={`City, ${c.entry.name}`} />
                </div>
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
            <h2 id="places-h" className="font-display text-3xl md:text-4xl">{WORDS[places.length] ?? places.length} places in {ci.name}</h2>
            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <div className="grid content-start gap-10">
                {places.slice(0, places.length >= 3 ? 2 : 1).map(({ p, href }) => (
                  <PlaceCard lang={lang} key={p.slug} place={p} href={href} />
                ))}
              </div>
              <div className="grid content-start gap-6">
                <AtlasMap
                  mode="streets"
                  label={`Street map of ${ci.name} with its researched places`}
                  bounds={boundsOf(places.map(({ p }) => p.where), 0.3, 0.008)}
                  pins={places.map(({ p, href }) => ({ label: p.name, lng: p.where.lng, lat: p.where.lat, href }))}
                  className="h-[min(70vh,600px)] min-h-[360px]"
                />
                {places.slice(places.length >= 3 ? 2 : 1).map(({ p, href }) => (
                  <PlaceCard lang={lang} key={p.slug} place={p} href={href} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-surface">
          <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-20 md:px-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
            <div className="space-y-14">
              {head.map((x) => <Passage key={x.id} p={x} refs={refs} />)}
            </div>
            {ci.artwork && <Figure id={ci.artwork} sizes="(min-width:1024px) 40vw, 100vw" imgClassName="w-full" className="self-start" />}
          </div>
        </section>

        {pano && (
          <section aria-labelledby="pano-h" className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
            <h2 id="pano-h" className="font-display text-3xl md:text-4xl">Arriving: {pano.title}</h2>
            <p className="mt-3 max-w-[60ch] text-muted">{pano.description}</p>
            <div className="mt-8">
              <Panorama src={imgSrc(media(pano.media))} title={pano.title} yaw={pano.yaw} haov={pano.haov} vaov={pano.vaov} alt={media(pano.media).alt} />
              <p className="mt-2 text-[13px] text-muted"><Credit id={pano.media} /></p>
            </div>
          </section>
        )}

        <div className="mx-auto max-w-[1400px] px-4 pb-20 md:px-8">
          <div className="space-y-14">{tail.map((x) => <Passage key={x.id} p={x} refs={refs} />)}</div>
        </div>

        <div className="mx-auto max-w-[1400px] space-y-12 px-4 py-16 md:px-8">
          <Gaps gaps={ci.gaps} />
          <SourceList refs={refs} />
        </div>
      </main>
    </ThemeShell>
  );
}
