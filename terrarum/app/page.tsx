import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { HomeGlobe } from "@/components/globe/HomeGlobe";
import { Figure } from "@/components/ui/Figure";
import { RandomPlace } from "@/components/ui/RandomPlace";
import { COUNTRIES } from "@/lib/content/countries";
import { getCountry, placePath, getPlace, openCountrySlugs } from "@/lib/content";
import { MEDIA } from "@/lib/content/media";
import { SOURCES } from "@/lib/content/sources";
import { globeAccent } from "@/lib/themes";

export default function Home() {
  const globe = COUNTRIES.map((c) => ({
    slug: c.slug,
    name: c.name,
    isoN: c.isoN,
    lat: c.marker.lat,
    lng: c.marker.lng,
    open: c.status === "open",
    accent: globeAccent(c.slug),
    note: c.researchNote,
  }));
  const japan = getCountry("japan")!;
  const journey = japan.journeys[0];
  const placeHrefs = openCountrySlugs().flatMap((c) =>
    ["nishiki-market", "kiyomizu-dera", "fushimi-inari-taisha"].filter((p) => getPlace(c, p)).map((p) => placePath(c, p).href),
  );
  const inResearch = COUNTRIES.filter((c) => c.status !== "open");
  const photos = MEDIA.filter((m) => m.kind !== "artwork").length;

  return (
    <main id="main">
      <section className="mx-auto grid max-w-[1400px] items-center gap-6 px-4 pb-8 pt-8 md:px-8 lg:min-h-[calc(100dvh-3.5rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:pt-4">
        <div className="max-w-xl">
          <h1 className="enter text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
            See the world from where you are.
          </h1>
          <p className="enter-2 mt-5 max-w-[42ch] text-lg text-muted">
            Turn the globe, choose a country and walk its real places, with every fact traced to its source.
          </p>
          <div className="enter-3 mt-8 flex flex-wrap gap-3">
            <Link href="/japan/" className="press inline-flex items-center gap-2 bg-accent px-5 py-3 font-semibold text-on-accent">
              Enter Japan <ArrowRight size={18} aria-hidden />
            </Link>
            <Link href="#countries" className="press inline-flex items-center gap-2 border border-line px-5 py-3 font-medium hover:border-ink">
              All eleven countries
            </Link>
          </div>
        </div>
        <div className="relative -mx-4 h-[60vh] min-h-[360px] md:mx-0 lg:h-[min(82dvh,820px)]">
          <HomeGlobe countries={globe} />
        </div>
      </section>

      <section id="countries" aria-labelledby="countries-h" className="scroll-mt-16 border-t border-line">
        <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
          <h2 id="countries-h" className="text-3xl font-semibold tracking-tight md:text-4xl">Eleven countries to begin with</h2>
          <p className="mt-3 max-w-[60ch] text-muted">
            One is open. The rest open one at a time, each only once its own research is done; after these eleven, the order follows
            international tourist arrivals.
          </p>
          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <Link href="/japan/" className="lift press zoom group block">
              <div className="overflow-hidden">
                <Figure id="kyoto-yasaka" credit="none" sizes="(min-width:1024px) 58vw, 100vw" imgClassName="aspect-[16/10] w-full object-cover" />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="text-2xl font-semibold">
                  Japan <span className="ml-1 font-normal text-muted" lang="ja">日本</span>
                </h3>
                <span className="text-sm text-accent">Open</span>
              </div>
              <p className="mt-2 max-w-[56ch] text-muted">{japan.summary}</p>
              <p className="mt-3 inline-flex items-center gap-2 font-medium group-hover:underline">
                Enter Japan <ArrowRight size={16} aria-hidden />
              </p>
            </Link>
            <div>
              <h3 className="text-sm font-medium text-muted">In research</h3>
              <ul className="mt-3 grid grid-cols-2 gap-x-6">
                {inResearch.map((c) => (
                  <li key={c.slug} id={`country-${c.slug}`} className="flex items-center gap-3 border-t border-line py-3 scroll-mt-24">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2" style={{ borderColor: globeAccent(c.slug) }} aria-hidden />
                    <span>{c.name}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted">
                Each has a research dossier but no published pages yet.{" "}
                <Link href="/method/#expansion" className="text-ink underline underline-offset-2">How the order is decided</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="journey-h" className="bg-band text-on-band">
        <div className="mx-auto grid max-w-[1400px] items-end gap-10 px-4 py-20 md:px-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
          <Figure id="inari-lantern" credit="below" sizes="(min-width:1024px) 50vw, 100vw" imgClassName="aspect-[4/3] w-full object-cover" />
          <div>
            <h2 id="journey-h" className="text-3xl font-semibold tracking-tight md:text-4xl">{journey.title}</h2>
            <p className="mt-4 max-w-[48ch] text-lg opacity-80">{journey.summary}</p>
            <ol className="mt-8 space-y-4">
              {journey.stops.map((s, i) => {
                const p = getPlace("japan", s.place)!;
                return (
                  <li key={s.place} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-2">
                    <span className="tabular-nums opacity-60">{i + 1}</span>
                    <Link href={placePath("japan", s.place).href} className="font-medium underline-offset-4 hover:underline">
                      {p.name}
                    </Link>
                  </li>
                );
              })}
            </ol>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/japan/#journey-a-day-in-kyoto" className="press inline-flex items-center gap-2 bg-accent px-5 py-3 font-semibold text-on-accent">
                Follow the route <ArrowRight size={18} aria-hidden />
              </Link>
              <RandomPlace hrefs={placeHrefs} />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="made-h" className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <h2 id="made-h" className="text-3xl font-semibold tracking-tight md:text-4xl">Smaller, but true</h2>
            <p className="mt-4 max-w-[60ch] text-lg text-muted">
              Facts come from the places themselves, governments and universities, and are linked where they appear. Photographs are
              openly licensed and credited to the people who took them. Where nothing reliable exists yet, the page says so.
            </p>
            <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/method/" className="underline underline-offset-4">How this is made</Link>
              <Link href="/sources/" className="underline underline-offset-4">Every source and credit</Link>
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-8 self-end md:gap-12">
            <div><dt className="text-sm text-muted">Sources</dt><dd className="text-4xl font-semibold tabular-nums">{SOURCES.length}</dd></div>
            <div><dt className="text-sm text-muted">Licensed photos</dt><dd className="text-4xl font-semibold tabular-nums">{photos}</dd></div>
            <div><dt className="text-sm text-muted">Countries open</dt><dd className="text-4xl font-semibold tabular-nums">{openCountrySlugs().length}<span className="text-xl text-muted">/{COUNTRIES.length}</span></dd></div>
          </dl>
        </div>
      </section>
    </main>
  );
}
