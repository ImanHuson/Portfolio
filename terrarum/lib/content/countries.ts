import type { CountryEntry } from "./types";

/**
 * The registry of countries the platform knows about. Order is the founding
 * collection as the user chose it; later entries come from the tourism
 * ranking in research/expansion.md, never by hand-picking.
 *
 * Markers sit on each capital (approximate, for placing a click target on the
 * globe, not a claim made on any page). Only `open` countries have pages.
 */
const capital = "capital city, approximate marker position";

export const COUNTRIES: CountryEntry[] = [
  { slug: "japan", name: "Japan", native: "日本", nativeLang: "ja", isoN: 392, marker: { lat: 35.68, lng: 139.69, ref: capital }, status: "open", collection: "founding", researchNote: "Open: Kansai, Kyoto and three Kyoto places are researched. Other regions are in research." },
  { slug: "maldives", name: "Maldives", native: "ދިވެހިރާއްޖެ", nativeLang: "dv", nativeDir: "rtl", isoN: 462, marker: { lat: 4.175, lng: 73.51, ref: capital }, status: "open", collection: "founding", researchNote: "Open: Kaafu, Malé, its Friday Mosque and fish market." },
  { slug: "switzerland", name: "Switzerland", native: "Schweiz / Suisse / Svizzera / Svizra", nativeLang: "de fr it rm", isoN: 756, marker: { lat: 46.948, lng: 7.447, ref: "Bern, seat of parliament and government (approximate marker)" }, status: "open", collection: "founding", researchNote: "Open: the Canton of Bern, Bern, the Zytglogge and the Federal Palace." },
  { slug: "saudi-arabia", name: "Saudi Arabia", isoN: 682, marker: { lat: 24.71, lng: 46.68, ref: capital }, status: "in-research", collection: "founding", researchNote: "Founding collection. Research dossier opened; no content published yet." },
  { slug: "china", name: "China", native: "中国", isoN: 156, marker: { lat: 39.9, lng: 116.41, ref: capital }, status: "in-research", collection: "founding", researchNote: "Founding collection. Research dossier opened; no content published yet." },
  { slug: "indonesia", name: "Indonesia", isoN: 360, marker: { lat: -6.2, lng: 106.85, ref: capital }, status: "in-research", collection: "founding", researchNote: "Founding collection. Research dossier opened; no content published yet." },
  { slug: "france", name: "France", isoN: 250, marker: { lat: 48.857, lng: 2.352, ref: capital }, status: "in-research", collection: "founding", researchNote: "Founding collection. Paris will be one destination among the regions, not the whole country." },
  { slug: "spain", name: "Spain", native: "España", isoN: 724, marker: { lat: 40.417, lng: -3.704, ref: capital }, status: "in-research", collection: "founding", researchNote: "Founding collection. Research dossier opened; no content published yet." },
  { slug: "italy", name: "Italy", native: "Italia", isoN: 380, marker: { lat: 41.9, lng: 12.5, ref: capital }, status: "in-research", collection: "founding", researchNote: "Founding collection. Research dossier opened; no content published yet." },
  { slug: "united-states", name: "United States", isoN: 840, marker: { lat: 38.9, lng: -77.04, ref: capital }, status: "in-research", collection: "founding", researchNote: "Founding collection. Research dossier opened; no content published yet." },
  { slug: "turkiye", name: "Türkiye", isoN: 792, marker: { lat: 39.93, lng: 32.86, ref: capital }, status: "in-research", collection: "founding", researchNote: "Founding collection. Research dossier opened; no content published yet." },
];

export const OPEN_COUNTRIES = COUNTRIES.filter((c) => c.status === "open");

export function countryEntry(slug: string) {
  return COUNTRIES.find((c) => c.slug === slug);
}
