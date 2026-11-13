import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AtlasMap } from "@/components/map/AtlasMap";
import { Panorama } from "@/components/pano/Panorama";
import { CinemaHero } from "@/components/story/CinemaHero";
import { Collage } from "@/components/story/Collage";
import { FactBand } from "@/components/story/Statement";
import { Story, type StoryStep } from "@/components/story/Story";
import { Credit } from "@/components/ui/Figure";
import { SeasonNow } from "@/components/ornament/SeasonNow";
import { Gaps } from "@/components/ui/Gaps";
import { Passage } from "@/components/ui/Passage";
import { SaveButton } from "@/components/ui/SaveButton";
import { SourceList } from "@/components/ui/Refs";
import { ThemeShell } from "@/components/ui/ThemeShell";
import { allStaticParams, cityPath, getCity, getCountry, getPlace, getRegion, makeRefs, placePath } from "@/lib/content";
import { imgSrc, media } from "@/lib/content/media";
import { boundsOf } from "@/lib/geo";
import { themeFor } from "@/lib/themes";

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
  const orn = themeFor(country)?.ornament;
  const nearby = ci.nearby.flatMap((n) => {
    const nc = getCity(country, n);
    if (nc) return [{ href: cityPath(country, n).href, name: nc.name, hero: nc.hero, summary: nc.summary }];
    const np = getPlace(country, n);
    return np ? [{ href: placePath(country, n).href, name: np.name, hero: np.hero, summary: np.summary }] : [];
  });
  const pano = ci.panoramas[0];

  // Each passage is told beside a photograph: its own, else a place's, else the city's print.
  const used = new Set<string>(ci.passages.flatMap((x) => x.images ?? []));
  const pool = places.map(({ p }) => p.hero).filter((id) => !used.has(id));
  const steps: StoryStep[] = ci.passages.map((x, i) => {
    // The city's print opens its story, as it did beside the first passage.
    const image = x.images?.[0] ?? (i === 0 && ci.artwork && !used.has(ci.artwork) ? ci.artwork : undefined) ?? pool.shift() ?? ci.hero;
    used.add(image);
    const links = (x.places ?? []).filter((s) => getPlace(country, s)).map((s) => ({ pl: getPlace(country, s)!, href: placePath(country, s).href }));
    return {
      key: x.id,
      image,
      content: (
        <div>
          <Passage p={x} refs={refs} />
          {links.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {links.map(({ pl, href }) => (
                <li key={pl.slug}>
                  <Link href={href} className="font-medium text-accent-text underline decoration-line underline-offset-4 hover:decoration-current">{pl.name}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ),
    };
  });

  return (
    <ThemeShell country={country}>
      <main id="main" data-pagefind-body>
        <CinemaHero
          ids={[ci.hero, ...places.slice(0, 3).map(({ p }) => p.hero)]}
          kicker={`${r.name}, ${c.entry.name}`}
          title={ci.name}
          summary={ci.summary}
          native={ci.native}
          entry={c.entry}
          trail={[{ href: "/", label: "Globe" }, { href: `/${country}/`, label: c.entry.name }, { href: `/${country}/${region}/`, label: r.name }, { label: ci.name }]}
        >
          <SaveButton href={`/${country}/${region}/${city}/`} title={ci.name} kind={`City, ${c.entry.name}`} seal={orn?.hanko ? ci.native : undefined} />
        </CinemaHero>

        <section aria-label="Key facts" className="relative isolate overflow-hidden pt-[16vh]">
          {themeFor(country)?.native === "vertical" && ci.native && (
            <p aria-hidden lang={lang} className="cine-kanji tategaki pointer-events-none absolute right-[2vw] top-[4vh] -z-10 font-display max-md:hidden" style={{ "--n": [...ci.native].length } as React.CSSProperties}>
              {ci.native}
            </p>
          )}
          <FactBand facts={ci.facts} refs={refs} />
        </section>
        {orn?.seasons && <SeasonNow place={ci.name} lat={ci.where.lat} lng={ci.where.lng} timeZone={orn.timeZone} />}

        <section aria-labelledby="places-h" className="mx-auto max-w-[1400px] px-4 pb-[12vh] md:px-8">
          <h2 id="places-h" className="settle font-display text-4xl md:text-6xl">{places.length} places in {ci.name}</h2>
          <div className="mt-12">
            <Collage lang={lang} items={places.map(({ p, href }) => ({ href, image: p.hero, title: p.name, kicker: p.kind, native: p.native, summary: p.summary }))} />
          </div>
          <AtlasMap
            mode="streets"
            label={`Street map of ${ci.name} with its places`}
            bounds={boundsOf(places.map(({ p }) => p.where), 0.3, 0.008)}
            pins={places.map(({ p, href }) => ({ label: p.name, lng: p.where.lng, lat: p.where.lat, href }))}
            className="mt-[12vh] h-[min(80vh,720px)] min-h-[360px]"
          />
        </section>

        <div className="country-rule" aria-hidden />
        <Story steps={steps} label={`About ${ci.name}`} flip />

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

        {nearby.length > 0 && (
          <section aria-labelledby="nearby-h" className="mx-auto max-w-[1400px] px-4 py-[14vh] md:px-8">
            <h2 id="nearby-h" className="settle font-display text-3xl md:text-5xl">Nearby</h2>
            <div className="mt-10">
              <Collage lang={lang} items={nearby.map((n) => ({ href: n.href, image: n.hero, title: n.name, summary: n.summary }))} />
            </div>
          </section>
        )}

        <div className="mx-auto max-w-[1400px] space-y-12 border-t border-line px-4 py-16 md:px-8">
          <Gaps gaps={ci.gaps} />
          <SourceList refs={refs} />
        </div>
      </main>
    </ThemeShell>
  );
}
