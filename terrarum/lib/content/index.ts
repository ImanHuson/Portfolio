import { COUNTRIES } from "./countries";
import * as JP from "./japan";
import * as MV from "./maldives";
import * as CH from "./switzerland";
import { source } from "./sources";
import type { City, Country, Place, Region, Source } from "./types";

/** Lookup layer. Pages ask here; adding a country means registering it below. */
const COUNTRY_DATA: Record<string, { country: Country; regions: Region[]; cities: City[]; places: Place[] }> = {
  japan: { country: JP.japan, regions: JP.regions, cities: JP.cities, places: JP.places },
  maldives: { country: MV.maldives, regions: MV.regions, cities: MV.cities, places: MV.places },
  switzerland: { country: CH.switzerland, regions: CH.regions, cities: CH.cities, places: CH.places },
};

export const openCountrySlugs = () => Object.keys(COUNTRY_DATA);
export const allPlaceSlugs = (c: string) => COUNTRY_DATA[c]?.places.map((p) => p.slug) ?? [];
export const getCountry = (slug: string) => COUNTRY_DATA[slug]?.country;
export const getRegion = (c: string, r: string) => COUNTRY_DATA[c]?.regions.find((x) => x.slug === r);
export const getCity = (c: string, s: string) => COUNTRY_DATA[c]?.cities.find((x) => x.slug === s);
export const getPlace = (c: string, s: string) => COUNTRY_DATA[c]?.places.find((x) => x.slug === s);

/** The region and city a place belongs to (one level of nesting each). */
export function placePath(c: string, placeSlug: string) {
  const d = COUNTRY_DATA[c];
  const city = d.cities.find((x) => x.places.includes(placeSlug))!;
  const region = d.regions.find((x) => x.cities.includes(city.slug))!;
  return { region, city, href: `/${c}/${region.slug}/${city.slug}/${placeSlug}/` };
}

export function cityPath(c: string, citySlug: string) {
  const region = COUNTRY_DATA[c].regions.find((x) => x.cities.includes(citySlug))!;
  return { region, href: `/${c}/${region.slug}/${citySlug}/` };
}

export function allStaticParams() {
  const out = { regions: [] as { country: string; region: string }[], cities: [] as { country: string; region: string; city: string }[], places: [] as { country: string; region: string; city: string; place: string }[] };
  for (const [country, d] of Object.entries(COUNTRY_DATA)) {
    for (const r of d.regions) {
      out.regions.push({ country, region: r.slug });
      for (const cs of r.cities) {
        out.cities.push({ country, region: r.slug, city: cs });
        const city = d.cities.find((x) => x.slug === cs)!;
        for (const p of city.places) out.places.push({ country, region: r.slug, city: cs, place: p });
      }
    }
  }
  return out;
}

/** Numbered references for one page, in the order claims cite them. */
export function makeRefs(cites: string[][]) {
  const order: string[] = [];
  for (const list of cites) for (const id of list) if (!order.includes(id)) order.push(id);
  const list: Source[] = order.map(source);
  return { list, n: (id: string) => order.indexOf(id) + 1 };
}
export type Refs = ReturnType<typeof makeRefs>;

export interface SearchItem {
  title: string;
  native?: string;
  kind: string;
  href: string;
  /** Extra words that should find this item. */
  terms: string;
  status: "open" | "in-research";
}

/** Static search index: places, cities, regions, countries, topics. */
export function searchIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  for (const e of COUNTRIES) {
    items.push({ title: e.name, native: e.native, kind: "Country", href: e.status === "open" ? `/${e.slug}/` : `/#country-${e.slug}`, terms: e.researchNote, status: e.status });
  }
  for (const [c, d] of Object.entries(COUNTRY_DATA)) {
    for (const r of d.regions) items.push({ title: r.name, native: r.native, kind: `Region of ${d.country.entry.name}`, href: `/${c}/${r.slug}/`, terms: `${r.summary} kinki`, status: "open" });
    for (const city of d.cities) items.push({ title: city.name, native: city.native, kind: "City", href: cityPath(c, city.slug).href, terms: `${city.summary} ${city.passages.map((p) => p.heading).join(" ")}`, status: "open" });
    for (const p of d.places) items.push({ title: p.name, native: p.native, kind: p.kind, href: placePath(c, p.slug).href, terms: `${p.summary} ${p.passages.map((x) => x.heading + " " + x.body.join(" ")).join(" ")}`, status: "open" });
    for (const p of d.country.passages) items.push({ title: p.heading, kind: `Topic in ${d.country.entry.name}`, href: `/${c}/#${p.id}`, terms: p.body.join(" "), status: "open" });
    items.push({ title: `History of ${d.country.entry.name}`, kind: "Timeline", href: `/${c}/#history`, terms: d.country.timeline.periods.map((x) => x.name).join(" "), status: "open" });
    for (const j of d.country.journeys) items.push({ title: j.title, kind: "Journey", href: `/${c}/#journey-${j.slug}`, terms: j.summary, status: "open" });
  }
  return items;
}
