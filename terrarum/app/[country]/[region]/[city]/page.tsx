import type { Metadata } from "next";
import Link from "next/link";
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
import { allStaticParams, cityPath, getCity, getCountry, getPlace, getRegion, makeRefs, placePath } from "@/lib/content";
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
  const WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
  const nearby = ci.nearby.flatMap((n) => {
    const nc = getCity(country, n);
    if (nc) return [{ href: cityPath(country, n).href, name: nc.name, hero: nc.hero, summary: nc.summary }];
    const np = getPlace(country, n);
    return np ? [{ href: placePath(country, n).href, name: np.name, hero: np.hero, summary: np.summary }] : [];
  });
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
            <AtlasMap
              mode="streets"
              label={`Street map of ${ci.name} with its places`}
              bounds={boundsOf(places.map(({ p }) => p.where), 0.3, 0.008)}
              pins={places.map(({ p, href }) => ({ label: p.name, lng: p.where.lng, lat: p.where.lat, href }))}
              className="mt-10 h-[min(62vh,560px)] min-h-[340px]"
            />
            <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {places.map(({ p, href }) => (
                <PlaceCard lang={lang} key={p.slug} place={p} href={href} />
              ))}
            </div>
          </div>
        </section>

        <div className="country-rule" aria-hidden />
        <section aria-labelledby="about-h" className="border-t border-line bg-surface">
          <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-20 md:px-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
            <nav aria-label={`About ${ci.name}`} className="lg:sticky lg:top-24 lg:self-start">
              <h2 id="about-h" className="font-display text-2xl">About {ci.name}</h2>
              <ol className="mt-4 hidden space-y-2.5 border-l border-line pl-4 text-sm lg:block">
                {ci.passages.map((x) => (
                  <li key={x.id}>
                    <a href={`#${x.id}`} className="text-muted hover:text-accent-text">{x.heading}</a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="space-y-20">
              {ci.passages.map((x, i) => {
                const pic = x.images?.[0] ?? (i === 0 ? ci.artwork : undefined);
                const links = (x.places ?? []).filter((s) => getPlace(country, s)).map((s) => ({ pl: getPlace(country, s)!, href: placePath(country, s).href }));
                return (
                  <div key={x.id} className="grid items-start gap-8 xl:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] xl:gap-12">
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
                    {pic && <Figure id={pic} sizes="(min-width:1280px) 28vw, 100vw" className="xl:mt-14" imgClassName="w-full" />}
                  </div>
                );
              })}
            </div>
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

        {nearby.length > 0 && (
          <section aria-labelledby="nearby-h" className="border-t border-line">
            <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
              <h2 id="nearby-h" className="font-display text-3xl md:text-4xl">Nearby</h2>
              <ul className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {nearby.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="lift press zoom group block">
                      <div className="overflow-hidden">
                        <Figure id={n.hero} credit="none" sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 100vw" imgClassName="aspect-[4/3] w-full object-cover" />
                      </div>
                      <p className="mt-3 font-display text-xl group-hover:text-accent-text">{n.name}</p>
                      <p className="mt-1 text-sm text-muted">{n.summary}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <div className="mx-auto max-w-[1400px] space-y-12 px-4 py-16 md:px-8">
          <Gaps gaps={ci.gaps} />
          <SourceList refs={refs} />
        </div>
      </main>
    </ThemeShell>
  );
}
