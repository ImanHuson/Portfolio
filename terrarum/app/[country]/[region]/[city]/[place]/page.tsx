import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AtlasMap } from "@/components/map/AtlasMap";
import { Panorama } from "@/components/pano/Panorama";
import { Crumbs } from "@/components/ui/Crumbs";
import { Facts } from "@/components/ui/Facts";
import { Gallery } from "@/components/ui/Gallery";
import { Credit, Figure } from "@/components/ui/Figure";
import { Gaps } from "@/components/ui/Gaps";
import { NativeName } from "@/components/ui/NativeName";
import { Passage } from "@/components/ui/Passage";
import { PlaceCard } from "@/components/ui/PlaceCard";
import { SaveButton } from "@/components/ui/SaveButton";
import { SourceList } from "@/components/ui/Refs";
import { ThemeShell } from "@/components/ui/ThemeShell";
import { allStaticParams, getCity, getCountry, getPlace, getRegion, makeRefs, placePath } from "@/lib/content";
import { imgSrc, media } from "@/lib/content/media";

export const dynamicParams = false;
export function generateStaticParams() {
  return allStaticParams().places;
}

export async function generateMetadata({ params }: PageProps<"/[country]/[region]/[city]/[place]">): Promise<Metadata> {
  const { country, place } = await params;
  const p = getPlace(country, place)!;
  const hero = media(p.hero);
  return {
    title: `${p.name}, ${getCity(country, placePath(country, place).city.slug)!.name}`,
    description: p.summary,
    openGraph: { images: [{ url: hero.remote ? imgSrc(hero, 1280) : `.${hero.src}`, alt: hero.alt }] },
  };
}

export default async function PlacePage({ params }: PageProps<"/[country]/[region]/[city]/[place]">) {
  const { country, region, city, place } = await params;
  const c = getCountry(country);
  const r = getRegion(country, region);
  const ci = getCity(country, city);
  const p = getPlace(country, place);
  if (!c || !r || !ci || !p || !ci.places.includes(p.slug)) notFound();
  const refs = makeRefs([...p.facts.map((f) => f.cite), ...p.passages.map((x) => x.cite)]);
  // Links to places not built yet are skipped here; the content audit fails on them.
  const related = p.related.filter((s) => getPlace(country, s)).map((s) => ({ p: getPlace(country, s)!, href: placePath(country, s).href }));
  const pano = p.panoramas[0];
  const lang = c.entry.nativeLang?.split(" ")[0];

  return (
    <ThemeShell country={country}>
      <main id="main" data-pagefind-body>
        <section className="mx-auto max-w-[1400px] px-4 pt-8 md:px-8 lg:pt-10">
          <Crumbs
            trail={[
              { href: "/", label: "Globe" },
              { href: `/${country}/`, label: c.entry.name },
              { href: `/${country}/${region}/`, label: r.name },
              { href: `/${country}/${region}/${city}/`, label: ci.name },
              { label: p.name },
            ]}
          />
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
            <Figure id={p.hero} priority sizes="(min-width:1024px) 66vw, 100vw" className="enter" imgClassName="aspect-[3/2] w-full object-cover" />
            <div className="flex gap-6 lg:flex-col lg:gap-8">
              <NativeName text={p.native} entry={c.entry} size="md" className="enter-2" />
              <div className="enter-3 self-end lg:self-start">
                <p className="text-sm text-muted">{p.kind}</p>
                <h1 className="mt-2 font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">{p.name}</h1>
                <p className="mt-4 text-lg">{p.summary}</p>
                <div className="mt-5">
                  <SaveButton href={`/${country}/${region}/${city}/${place}/`} title={p.name} kind={`${p.kind}, ${ci.name}`} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="matters-h" className="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 md:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <h2 id="matters-h" className="text-sm text-muted">Why it matters</h2>
            <p className="mt-3 font-display text-2xl leading-snug md:text-3xl">{p.matters}</p>
          </div>
          <Facts facts={p.facts} refs={refs} />
        </section>

        <section aria-label={`About ${p.name}`} className="border-t border-line">
          <div className="mx-auto max-w-[1400px] space-y-20 px-4 py-20 md:px-8">
            {p.passages.map((x) => (
              <div key={x.id} className="grid items-start gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
                <Passage p={x} refs={refs} />
                {x.images?.[0] && <Figure id={x.images[0]} sizes="(min-width:1024px) 30vw, 100vw" className="lg:mt-14" imgClassName="w-full" />}
              </div>
            ))}
          </div>
        </section>

        <Gallery ids={p.gallery.filter((id) => !p.passages.some((x) => x.images?.includes(id)))} name={p.name} headingId="sides-h" tour={p.tour} />

        {pano && (
          <section aria-labelledby="look-h" className="border-t border-line bg-band text-on-band">
            <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
              <h2 id="look-h" className="font-display text-3xl md:text-4xl">Look around: {pano.title}</h2>
              <p className="mt-3 max-w-[60ch] opacity-80">{pano.description}</p>
              <div className="mt-8">
                <Panorama src={imgSrc(media(pano.media))} title={pano.title} yaw={pano.yaw} haov={pano.haov} vaov={pano.vaov} alt={media(pano.media).alt} />
                <p className="mt-2 text-[13px] opacity-75"><Credit id={pano.media} /></p>
              </div>
            </div>
          </section>
        )}

        <section aria-labelledby="where-h" className="mx-auto grid max-w-[1400px] gap-10 px-4 py-20 md:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <AtlasMap
            mode="streets"
            label={`Street map around ${p.name}`}
            bounds={[[p.where.lng - 0.012, p.where.lat - 0.008], [p.where.lng + 0.012, p.where.lat + 0.008]]}
            pins={[{ label: p.name, lng: p.where.lng, lat: p.where.lat, current: true }]}
            className="h-[min(60vh,520px)] min-h-[320px]"
          />
          <div>
            <h2 id="where-h" className="font-display text-3xl">Where it is</h2>
            <p className="mt-3 text-muted">
              {Math.abs(p.where.lat).toFixed(4)}° {p.where.lat >= 0 ? "N" : "S"}, {Math.abs(p.where.lng).toFixed(4)}° {p.where.lng >= 0 ? "E" : "W"}. Position from {p.where.ref}.
            </p>
            <p className="mt-6 text-sm">
              <Link href={`/${country}/${region}/${city}/`} className="underline underline-offset-4">All of {ci.name} on one map</Link>
            </p>
          </div>
        </section>

        <section aria-labelledby="next-h" className="border-t border-line">
          <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
            <h2 id="next-h" className="font-display text-3xl md:text-4xl">Next, in {ci.name}</h2>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              {related.map(({ p: rp, href }) => (
                <PlaceCard lang={lang} key={rp.slug} place={rp} href={href} />
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1400px] space-y-12 px-4 py-16 md:px-8">
          <Gaps gaps={p.gaps} />
          <SourceList refs={refs} />
        </div>
      </main>
    </ThemeShell>
  );
}
