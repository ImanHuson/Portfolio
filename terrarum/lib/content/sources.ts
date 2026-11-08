import type { Source } from "./types";

/**
 * Every reference used on the site. Each was opened and read for the claims
 * that cite it (not taken from a search snippet). `notes` says what it
 * supports and where it needs care.
 */
const A = "2026-11-08";

export const SOURCES: Source[] = [
  // Japan, national
  {
    id: "stat-handbook-2026",
    title: "Statistical Handbook of Japan 2026",
    publisher: "Statistics Bureau of Japan, Ministry of Internal Affairs and Communications",
    url: "https://www.stat.go.jp/english/data/handbook/index.html",
    published: "September 2026",
    accessed: A,
    type: "government-statistics",
    notes:
      "Ch. 1 (land: 377,980 km², more than 14,000 smaller islands, mountains about three quarters of the area); Ch. 2 (population 123.80 million in 2024; Kyoto City 1,464 thousand at the 2020 census; Kinki major metropolitan area 19.2 million); climate normals for Kyoto; Ch. 9 (foreign visitors 36.87 million in 2024, 42.68 million in 2025, 2025 provisional); Ch. 16 (World Heritage list; Washoku on the UNESCO intangible heritage list).",
  },
  {
    id: "columbia-afe-timeline",
    title: "Japan: Timeline of Historical Periods",
    publisher: "Asia for Educators, Columbia University",
    url: "https://afe.easia.columbia.edu/timelines/japan_timeline.htm",
    accessed: A,
    type: "academic",
    notes:
      "Period names and conventional dates. Gives Nara as 710-814, where most references give 710-794 (the move to Heian-kyō); the site uses 794 and says so.",
  },
  {
    id: "nippon-kyoto-millennium",
    title: "Imperial City: Kyoto's Millennium as Japan's Capital",
    publisher: "Nippon.com (Nippon Communications Foundation)",
    url: "https://www.nippon.com/en/japan-topics/g00993/",
    accessed: A,
    type: "news",
    notes:
      "Founding of Heian-kyō by Emperor Kanmu in 794 on Chinese models; Ōnin War (1467-77) fought in its streets; Emperor Meiji's move to Tokyo in 1869.",
  },
  {
    id: "nippon-adherents",
    title: "Believe It or Not! Religious Adherents Outnumber People in Japan",
    publisher: "Nippon.com, from the Agency for Cultural Affairs' Religious Yearbook",
    url: "https://www.nippon.com/en/features/h00226/believe-it-or-not!-religious-adherents-outnumber-people-in-japan.html",
    accessed: A,
    type: "news",
    notes:
      "182.2 million adherents at end-2016 (84.7 million Shinto, 87.7 million Buddhist) against about 126 million people. Buddhism arrived from the continent around the sixth century; the two faiths intermingled for over a thousand years until the Meiji government ordered them separated. Yearbook counts are reported by religious bodies themselves, which define 'adherent' as they wish; many people are counted by both Shinto and Buddhist bodies. Figures are end-2016.",
  },
  {
    id: "bunka-religious-juridical",
    title: "Religious Juridical Persons and Administration of Religious Affairs",
    publisher: "Agency for Cultural Affairs, Government of Japan",
    url: "https://www.bunka.go.jp/english/policy/religious_institutions/",
    accessed: A,
    type: "official",
    notes: "How religious organisations are registered; the Religious Yearbook (Shūkyō Nenkan) is compiled from their own reports.",
  },
  {
    id: "ninjal-endangered",
    title: "Endangered Languages and Dialects in Japan",
    publisher: "National Institute for Japanese Language and Linguistics (NINJAL)",
    url: "https://www.ninjal.ac.jp/english/research/project-3/institute/endangered-languages/",
    accessed: A,
    type: "academic",
    notes: "NINJAL's research programme on the languages UNESCO lists as endangered in Japan.",
  },
  {
    id: "japantimes-ainu",
    title: "Efforts underway to save Ainu language and culture",
    publisher: "The Japan Times",
    url: "https://www.japantimes.co.jp/2022/02/21/special-supplements/efforts-underway-save-ainu-language-culture/",
    published: "2022-02-21",
    accessed: A,
    type: "news",
    notes: "Cites the third edition of UNESCO's Atlas of the World's Languages in Danger: eight endangered languages in Japan, including Ainu, Hachijō and several Ryukyuan languages; Ainu is the only one rated critically endangered.",
  },
  // Kyoto
  {
    id: "kyoto-city-heritage",
    title: "World Heritage: Historic Monuments of Ancient Kyoto",
    publisher: "City of Kyoto",
    url: "https://www2.city.kyoto.lg.jp/bunshi/bunkazai/sekaiisan-e.htm",
    accessed: A,
    type: "official",
    notes: "17 properties in Kyoto, Uji and Ōtsu, inscribed in December 1994 at the 18th session of the World Heritage Committee.",
  },
  {
    id: "unesco-688",
    title: "Historic Monuments of Ancient Kyoto (Kyoto, Uji and Otsu Cities)",
    publisher: "UNESCO World Heritage Centre",
    url: "https://whc.unesco.org/en/list/688/",
    accessed: A,
    type: "heritage-body",
    notes: "The listing itself. The page refused automated access from this build environment (HTTP 403); facts are taken from the City of Kyoto page above.",
  },
  // Places
  {
    id: "nishiki-history",
    title: "History of Nishiki Market",
    publisher: "Kyoto Nishiki Market Shopping Street Promotion Association",
    url: "https://kyoto-nishiki.or.jp/en/about",
    accessed: A,
    type: "official",
    notes:
      "1615 recognition by the Edo shogunate (one of three fish wholesalers); a Heian-period market estimated, not recorded; groundwater at 15-18 °C; about 390 m east-west, 3.3-5 m wide; Itō Jakuchū born here and his role in a 1771-74 dispute; role in the Gion Festival.",
  },
  {
    id: "inari-about",
    title: "Greetings from the Head Priest",
    publisher: "Fushimi Inari Taisha",
    url: "https://inari.jp/en/about/",
    accessed: A,
    type: "official",
    notes: "Some 30,000 Inari shrines in Japan; this is the head shrine; Inari Ōkami took up residence on the mountain in 711 by the traditional calendar.",
  },
  {
    id: "inari-history",
    title: "History",
    publisher: "Fushimi Inari Taisha",
    url: "https://inari.jp/en/history/",
    accessed: A,
    type: "official",
    notes: "Yamashirokoku Fudoki origin story and the Hata clan; Engishiki listing; Sei Shōnagon's climb; destruction in the Ōnin war and rebuilding in 1499. The shrine's own account of its origins.",
  },
  {
    id: "inari-faq",
    title: "FAQ",
    publisher: "Fushimi Inari Taisha",
    url: "https://inari.jp/en/faq/",
    accessed: A,
    type: "official",
    notes: "Foxes as unseen messengers (byakko-san), not the deity; torii as offerings since the start of the Edo period; around 10,000 torii; precinct about 870,000 m².",
  },
  {
    id: "inari-spots",
    title: "Precinct map: Inariyama, Main Gate, Main Shrine, Okusha Hōhaisho",
    publisher: "Fushimi Inari Taisha",
    url: "https://inari.jp/en/map/",
    accessed: A,
    type: "official",
    notes: "Inariyama 233 m, southernmost of the 36 Higashiyama peaks; Main Gate attributed to Toyotomi Hideyoshi, 1589, confirmed by an ink inscription found in repairs; main shrine rebuilt 1499.",
  },
  {
    id: "kiyomizu-learn",
    title: "Learn about Kiyomizu-dera",
    publisher: "Kiyomizu-dera Temple",
    url: "https://www.kiyomizudera.or.jp/en/learn/",
    accessed: A,
    type: "official",
    notes:
      "Founded 778; the founding story of Kenshin (Enchin) and Sakanoue no Tamuramaro; grounds of 130,000 m² with about thirty buildings and the National Treasure Main Hall; destroyed by fire more than ten times; the stage of over 166 hinoki boards, re-laid in a 12-year restoration from 2008, nearly 13 m high.",
  },
  {
    id: "kiyomizu-home",
    title: "Kiyomizu-dera Temple (home page)",
    publisher: "Kiyomizu-dera Temple",
    url: "https://www.kiyomizudera.or.jp/en/",
    accessed: A,
    type: "official",
    notes: "Kannon as a deity of great mercy and compassion; the principal image with eleven faces and forty-two arms, known as Kiyomizu Kannon-san.",
  },
  {
    id: "ndl-kiyomizu",
    title: "Kiyomizu-dera (Column: Kansai)",
    publisher: "National Diet Library, Japan",
    url: "https://ndl.go.jp/scenery/e/column/kansai/kiyomizudera.html",
    accessed: A,
    type: "official",
    notes: "Japanese-language page. The present Main Hall was rebuilt in 1633 (Kan'ei 10) with the help of shogun Tokugawa Iemitsu and is a National Treasure; hall about 18 m high, stage about 13 m; stage floor of hinoki from Kiso and Tenryū.",
  },
  // Media and geodata providers
  {
    id: "osm",
    title: "OpenStreetMap",
    publisher: "OpenStreetMap contributors",
    url: "https://www.openstreetmap.org/copyright",
    accessed: A,
    type: "dataset",
    notes: "Coordinates of places (looked up through Nominatim) and the street basemap, under the ODbL.",
  },
  {
    id: "natural-earth",
    title: "Natural Earth: Admin 0 countries (1:110m) and Admin 1 states/provinces (1:10m)",
    publisher: "Natural Earth",
    url: "https://www.naturalearthdata.com/",
    accessed: A,
    type: "dataset",
    notes: "Public domain. Country shapes for the globe; Japanese prefectures and their region field for the regions map (simplified).",
  },
];

export const SOURCE_BY_ID = new Map(SOURCES.map((s) => [s.id, s]));

export function source(id: string): Source {
  const s = SOURCE_BY_ID.get(id);
  if (!s) throw new Error(`Unknown source id: ${id}`);
  return s;
}
