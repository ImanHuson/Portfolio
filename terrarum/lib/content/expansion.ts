/**
 * How countries are added. The founding eleven open in the user's order; after
 * them, batches of 5 to 10, chosen for what there is to explore (places,
 * history, culture) with international tourist arrivals as a guide, not a
 * strict ranking. Mirrors research/expansion.md.
 *
 * STATUS: provisional. UN Tourism's country table for 2024 could not be read
 * from this environment; the figures below come from secondary compilations
 * that cite it, and agree with each other on the order. Re-check against the
 * UN Tourism Data Dashboard before the next country is chosen.
 */
export interface Ranked {
  rank: number;
  country: string;
  arrivals: string;
  year: number;
  inTerrarum: "founding" | "next" | "later";
  note?: string;
}

export const RANKING_SOURCES = [
  { title: "UN Tourism: International tourist arrivals up 4% in 2025", url: "https://www.untourism.int/news/international-tourist-arrivals-up-4-in-2025-reflecting-strong-travel-demand-around-the-world", note: "Global totals only (1.52 billion in 2025, 1.4 billion in 2024); no country table." },
  { title: "Most visited countries in the world (2024 UN Tourism figures)", url: "https://countrypilot.info/geography-explained/most-visited-countries-in-the-world/", note: "Secondary compilation; France 102.0 m, Spain 93.8 m, United States 72.4 m." },
  { title: "Which countries have the most tourists in the world?", url: "https://letbloom.io/en/articles/countries-with-most-tourists", note: "Secondary compilation; ranks 6-10 and the China caveat." },
  { title: "The world's most visited countries", url: "https://www.worldatlas.com/travel/the-world-s-most-visited-countries-55939.html", note: "Secondary compilation; Türkiye 60.6 m, Italy 57.8 m." },
  { title: "Statistical Handbook of Japan 2026, ch. 9", url: "https://www.stat.go.jp/english/data/handbook/index.html", note: "Primary national figure for Japan: 36.87 million in 2024." },
];

export const RANKING: Ranked[] = [
  { rank: 1, country: "France", arrivals: "102.0 million", year: 2024, inTerrarum: "founding" },
  { rank: 2, country: "Spain", arrivals: "93.8 million", year: 2024, inTerrarum: "founding" },
  { rank: 3, country: "United States", arrivals: "72.4 million", year: 2024, inTerrarum: "founding", note: "Compilations differ between 72.3 and 73.4 million." },
  { rank: 4, country: "Türkiye", arrivals: "60.6 million", year: 2024, inTerrarum: "founding", note: "Türkiye's ministry reports over 62 million by counting citizens resident abroad; UN Tourism's figure does not." },
  { rank: 5, country: "Italy", arrivals: "57.8 million", year: 2024, inTerrarum: "founding" },
  { rank: 6, country: "Mexico", arrivals: "45.0 million", year: 2024, inTerrarum: "next" },
  { rank: 7, country: "United Kingdom", arrivals: "41.8 million", year: 2024, inTerrarum: "next" },
  { rank: 8, country: "Germany", arrivals: "37.5 million", year: 2024, inTerrarum: "next" },
  { rank: 9, country: "Japan", arrivals: "36.9 million", year: 2024, inTerrarum: "founding", note: "Japan's own statistics: 36.87 million." },
  { rank: 10, country: "Greece", arrivals: "36.0 million", year: 2024, inTerrarum: "later" },
  { rank: 11, country: "Thailand", arrivals: "not confirmed", year: 2024, inTerrarum: "later", note: "Ranked here by one compilation without a figure; needs the primary number." },
];

export const RANKING_CAVEATS = [
  "China sits in UN Tourism's top ten on an estimate; no comparable 2024 total was published, so it is left unranked here. It is in the founding collection either way.",
  "Saudi Arabia, the Maldives, Switzerland and Indonesia are in the founding collection by choice, not by rank.",
  "Countries count arrivals differently (border counts by residence or nationality, or hotel registrations). Small differences in rank are within that noise.",
];
