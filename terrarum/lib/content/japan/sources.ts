import type { Source } from "../types";

/**
 * Japan's references beyond the founding set in ../sources.ts. Each was read
 * for the claims that cite it; `notes` records what it supports and how far
 * to trust it. Grouped by the page that uses them.
 */
const A = "2026-11-09";

export const JAPAN_SOURCES: Source[] = [
  // Land and nature
  {
    id: "moe-nps-overview",
    title: "Overview of National Parks",
    publisher: "Ministry of the Environment, Japan",
    url: "https://www.env.go.jp/en/nature/nps/park/parks/index.html",
    accessed: A,
    type: "official",
    notes: "All 35 national parks with date first designated, area and prefectures. Setonaikai appears under three regions; counted once.",
  },
  {
    id: "moe-nps-site",
    title: "National Parks of Japan (official site)",
    publisher: "Ministry of the Environment, Japan",
    url: "https://www.japan.travel/national-parks/",
    accessed: A,
    type: "official",
    notes: "The ministry's national parks site (hosted on the national tourism organisation's domain): 35 national parks; 111 active volcanoes, many inside them.",
  },
  {
    id: "jma-typhoon",
    title: "台風の平年値 (Typhoon normals)",
    publisher: "Japan Meteorological Agency",
    url: "https://www.data.jma.go.jp/typhoon/statistics/average/average.html",
    accessed: A,
    type: "government-statistics",
    notes: "1991-2020 averages: 25.1 typhoons form a year (most in August, 5.7), 11.7 come within 300 km of a weather station in Japan, 3.0 make landfall on Hokkaido, Honshu, Shikoku or Kyushu (as JMA defines landfall).",
  },
  {
    id: "gsi-islands",
    title: "我が国の島を数えました (We counted Japan's islands), press release and FAQ",
    publisher: "Geospatial Information Authority of Japan",
    url: "https://www.gsi.go.jp/kihonjohochousa/pressrelease20230228.html",
    published: "28 February 2023",
    accessed: A,
    type: "official",
    notes: "14,125 islands, counted from the 120,729 land areas on the Digital Japan Basic Map (January 2022): naturally formed, at least 0.1 km round, the criterion of the Japan Coast Guard's 1987 count of 6,852. The difference comes from more detailed maps, not new islands; area and territory are unchanged. FAQ: https://www.gsi.go.jp/kihonjohochousa/islands_FAQ.html. Read through a fetch tool: this build machine cannot open gsi.go.jp directly (legacy TLS).",
  },
  {
    id: "gsi-islands-pref",
    title: "資料３ 我が国の島の数一覧（全国及び都道府県別） (Islands by prefecture)",
    publisher: "Geospatial Information Authority of Japan",
    url: "https://www.gsi.go.jp/common/000247634.pdf",
    published: "February 2023",
    accessed: A,
    type: "government-statistics",
    notes: "Islands per prefecture: Nagasaki 1,479, Hokkaido 1,473, Kagoshima 1,256, Iwate 861, Okinawa 691; nine prefectures have none.",
  },
  {
    id: "cbd-jp",
    title: "Japan: Country Profile",
    publisher: "Secretariat of the Convention on Biological Diversity",
    url: "https://www.cbd.int/countries/profile/?country=jp",
    accessed: A,
    type: "official",
    notes: "Summarises Japan's national reports; its figures date from the early 2010s (Red List 2007-2012). Supports: over 90,000 known species, endemism (about 40% of land mammals and vascular plants, 60% of reptiles, 80% of amphibians), 50 of 127 marine mammals, 21 endemic mammals in the Ryukyus with 19 on the Red List, satochi-satoyama about 40% of the land.",
  },
  {
    id: "hlj-biodiv",
    title: "Japan's Biodiversity (Highlighting Japan, April 2020)",
    publisher: "Government of Japan (Cabinet Office, Public Relations)",
    url: "https://gov-online.go.jp/eng/publicity/book/hlj/html/202004/202004_01_en.html",
    published: "April 2020",
    accessed: A,
    type: "official",
    notes: "Interview with the Ministry of the Environment: subarctic to subtropical range, endemic Japanese macaque (the only wild monkeys in a developed country), satoyama, Asian fawnlily, Aso grassland burning, Shiretoko's sea eagles, brown bears and orcas.",
  },
  // Kinkaku-ji
  {
    id: "kinkaku-about",
    title: "Kinkaku-ji: About",
    publisher: "Shōkoku-ji (Rinzai Zen, Shōkoku-ji branch)",
    url: "https://www.shokoku-ji.jp/en/kinkakuji/about/",
    accessed: A,
    type: "official",
    notes: "The temple's own history: Saionji villa, Yoshimitsu's Kitayama palace, the pavilion's three images, conversion to Rokuon-ji, Ōnin War, Edo and Meiji periods, first public opening in 1894, World Heritage 1994.",
  },
  {
    id: "kinkaku-guide",
    title: "Kinkaku-ji: Guide",
    publisher: "Shōkoku-ji",
    url: "https://www.shokoku-ji.jp/en/kinkakuji/guide/",
    accessed: A,
    type: "official",
    notes: "Building by building: the three storeys and their styles, gold leaf, cypress shingles, phoenix, 1987 renewal; garden and pond areas; Ryūmon Falls; Sekka-tei; Fudō-dō. Links the temple's own 360° tour.",
  },
  {
    id: "kinkaku-faq",
    title: "Kinkaku-ji: FAQ",
    publisher: "Shōkoku-ji",
    url: "https://www.shokoku-ji.jp/en/kinkakuji/faq/",
    accessed: A,
    type: "official",
    notes: "Access: the path is wheelchair-accessible as far as the pavilion; the garden beyond has steps.",
  },
  {
    id: "jpsearch-kinkaku",
    title: "Kinkaku Temple",
    publisher: "Japan Search (National Diet Library)",
    url: "https://jpsearch.go.jp/en/gallery/ndl-O31NgKVpBxFGaG",
    accessed: A,
    type: "official",
    notes: "Government cultural-heritage portal. Supports 1397 takeover, conversion after 1408, Ōnin War losses, 1904-06 restoration, 1950 arson and 1955 rebuilding to the same design, Mishima's novel, Special Historic Site and Special Scenic Spot, World Heritage 1994.",
  },
  {
    id: "kyotodesign-kinkaku",
    title: "金閣寺（鹿苑寺）",
    publisher: "KYOTOdesign (Kyoto tourism information)",
    url: "https://kyoto-design.jp/spot/2715?lang=en",
    accessed: A,
    type: "secondary",
    notes: "Secondary; used only where it adds detail the official sources agree with: the statue of Yoshimitsu lost in the 1950 fire, the phoenix removed before the fire and surviving, the 1955 rebuilding from Meiji-era repair records.",
  },
];
