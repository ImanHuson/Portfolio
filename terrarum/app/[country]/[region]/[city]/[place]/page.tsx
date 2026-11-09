import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AtlasMap } from "@/components/map/AtlasMap";
import { Panorama } from "@/components/pano/Panorama";
import { CinemaHero } from "@/components/story/CinemaHero";
import { Collage } from "@/components/story/Collage";
import { FactBand, Statement } from "@/components/story/Statement";
import { Story, type StoryStep } from "@/components/story/Story";
import { Gallery } from "@/components/ui/Gallery";
import { Credit } from "@/components/ui/Figure";
import { Gaps } from "@/components/ui/Gaps";
import { Passage } from "@/components/ui/Passage";
import { SaveButton } from "@/components/ui/SaveButton";
import { SourceList } from "@/components/ui/Refs";
import { ThemeShell } from "@/components/ui/ThemeShell";
import { allStaticParams, getCity, getCountry, getPlace, getRegion, makeRefs, placePath } from "@/lib/content";
import { imgSrc, media } from "@/lib/content/media";
import { themeFor } from "@/lib/themes";

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

  // The story pairs each passage with a photograph: its own if it has one,
  // otherwise the next unused photograph of the place, in visit order.
  const used = new Set(p.passages.flatMap((x) => x.images ?? []));
  const pool = p.gallery.filter((id) => !used.has(id));
  const steps: StoryStep[] = p.passages.map((x) => {
    const own = x.images?.[0];
    const image = own ?? pool.shift() ?? p.hero;
    used.add(image);
    return { key: x.id, image, content: <Passage p={x} refs={refs} /> };
  });
  // The gallery keeps every side of the place, including photographs the story also uses.
  const galleryIds = p.gallery.filter((id) => !p.passages.some((x) => x.images?.includes(id)));

  return (
    <ThemeShell country={country}>
      <main id="main" data-pagefind-body>
        <CinemaHero
          ids={[p.hero]}
          kicker={p.kind}
          title={p.name}
          summary={p.summary}
          native={p.native}
          entry={c.entry}
          trail={[
            { href: "/", label: "Globe" },
            { href: `/${country}/`, label: c.entry.name },
            { href: `/${country}/${region}/`, label: r.name },
            { href: `/${country}/${region}/${city}/`, label: ci.name },
            { label: p.name },
          ]}
        >
          <SaveButton href={`/${country}/${region}/${city}/${place}/`} title={p.name} kind={`${p.kind}, ${ci.name}`} />
        </CinemaHero>

        <Statement id="matters-h" label="Why it matters" text={p.matters} watermark={themeFor(country)?.native === "vertical" ? p.native : undefined} lang={lang} />
        <FactBand facts={p.facts} refs={refs} />

        <div className="country-rule" aria-hidden />
        <Story steps={steps} label={`About ${p.name}`} />

        <Gallery ids={galleryIds} name={p.name} headingId="sides-h" tour={p.tour} layout={themeFor(country)?.gallery} />

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

        <section aria-labelledby="where-h" className="settle mx-auto grid max-w-[1400px] items-end gap-10 px-4 py-[14vh] md:px-8 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
          <AtlasMap
            mode="streets"
            label={`Street map around ${p.name}`}
            bounds={[[p.where.lng - 0.012, p.where.lat - 0.008], [p.where.lng + 0.012, p.where.lat + 0.008]]}
            pins={[{ label: p.name, lng: p.where.lng, lat: p.where.lat, current: true }]}
            className="h-[min(72vh,640px)] min-h-[340px]"
          />
          <div>
            <h2 id="where-h" className="font-display text-3xl md:text-5xl">Where it is</h2>
            <p className="mt-4 text-muted">
              {Math.abs(p.where.lat).toFixed(4)}° {p.where.lat >= 0 ? "N" : "S"}, {Math.abs(p.where.lng).toFixed(4)}° {p.where.lng >= 0 ? "E" : "W"}. Position from {p.where.ref}.
            </p>
            <p className="mt-6 text-sm">
              <Link href={`/${country}/${region}/${city}/`} className="underline underline-offset-4 hover:text-accent-text">All of {ci.name} on one map</Link>
            </p>
          </div>
        </section>

        {related.length > 0 && (
          <section aria-labelledby="next-h" className="mx-auto max-w-[1400px] px-4 pb-[14vh] md:px-8">
            <h2 id="next-h" className="settle font-display text-3xl md:text-5xl">Next, in {ci.name}</h2>
            <div className="mt-10">
              <Collage lang={lang} items={related.map(({ p: rp, href }) => ({ href, image: rp.hero, title: rp.name, kicker: rp.kind, native: rp.native, summary: rp.summary }))} />
            </div>
          </section>
        )}

        <div className="mx-auto max-w-[1400px] space-y-12 border-t border-line px-4 py-16 md:px-8">
          <Gaps gaps={p.gaps} />
          <SourceList refs={refs} />
        </div>
      </main>
    </ThemeShell>
  );
}
