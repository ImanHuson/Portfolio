import { countryEntry } from "../countries";
import type { Country } from "../types";
import { chapters } from "./chapters";

/**
 * Japan: the first open country. Every passage here was written from the
 * sources it cites (lib/content/sources.ts), read in November 2026; the
 * research notes behind it are in research/countries/japan/.
 */

export const japan: Country = {
  entry: countryEntry("japan")!,
  summary:
    "An island country off the eastern edge of Asia: five main islands and more than 14,000 smaller ones, three quarters of it mountain and hill.",
  facts: [
    { label: "Where", value: "About 20° to 45° N and 123° to 154° E, off the eastern seaboard of Eurasia", cite: ["stat-handbook-2026"] },
    { label: "Main islands", value: "Hokkaido, Honshu, Shikoku, Kyushu and Okinawa, with more than 14,000 smaller islands", cite: ["stat-handbook-2026"] },
    { label: "Area", value: "377,980 km²", asOf: "January 2026", cite: ["stat-handbook-2026"] },
    { label: "Terrain", value: "Mountains and hills cover about three quarters of the land", cite: ["stat-handbook-2026"] },
    { label: "Population", value: "123.80 million", asOf: "2024", cite: ["stat-handbook-2026"] },
    { label: "Prefectures", value: "47", cite: ["stat-handbook-2026"] },
    { label: "Foreign visitors", value: "42.68 million in 2025 (provisional), up from 36.87 million in 2024", asOf: "2025", cite: ["stat-handbook-2026"] },
  ],
  hero: "cma-shono",
  card: "kyoto-yasaka",
  regionsGeo: "/data/jp-regions.json",
  regionsBounds: [[127, 25.5], [146, 45.6]],
  regionsHeading: "Eight regions, one open",
  regionsNote: "Japan’s regions are a convention, not a level of government. Kansai is researched; the others are on the map and waiting.",
  regions: ["kanto", "kansai"],
  // Kyoto is the deepest city so far and the slice the brief asked for first.
  startCity: "kyoto",
  pendingRegions: [
    { geoKey: "hokkaido", name: "Hokkaido", native: "北海道" },
    { geoKey: "tohoku", name: "Tōhoku", native: "東北" },
    { geoKey: "chubu", name: "Chūbu", native: "中部" },
    { geoKey: "chugoku", name: "Chūgoku", native: "中国" },
    { geoKey: "shikoku", name: "Shikoku", native: "四国" },
    { geoKey: "kyushu", name: "Kyūshū and Okinawa", native: "九州・沖縄" },
  ],
  passages: [
    {
      id: "land",
      heading: "A long, steep archipelago",
      body: [
        "The islands run in a crescent from northeast to southwest, separated from the continent by the Sea of Japan. They sit on one of the world’s youngest mobile belts, which is why earthquakes are frequent and active volcanoes are common.",
        "Steep mountains cut by ravines take up most of the land, so people, farms and cities crowd onto the plains and the hills between them.",
      ],
      cite: ["stat-handbook-2026"],
      status: "fact-checked",
    },
    {
      id: "belief",
      heading: "Two faiths, counted twice",
      body: [
        "Buddhism reached Japan from the continent around the sixth century and mixed with Shinto, the older local faith, for more than a thousand years, until the Meiji government ordered the two separated in the late nineteenth century.",
        "Official counts reflect that history. At the end of 2016 the Agency for Cultural Affairs’ yearbook recorded 84.7 million Shinto and 87.7 million Buddhist adherents, 182.2 million in all, in a country of about 126 million people. Religious bodies report their own numbers and define “adherent” as they choose, and many households belong to a shrine and a temple at once. The figures describe membership rolls, not what any one person believes.",
      ],
      cite: ["nippon-adherents", "bunka-religious-juridical"],
      status: "fact-checked",
      figure: {
        caption: "Religious adherents reported to the Agency for Cultural Affairs at the end of 2016, against Japan’s population.",
        rows: [
          { label: "Shinto adherents", value: 84.7, display: "84.7 million" },
          { label: "Buddhist adherents", value: 87.7, display: "87.7 million" },
          { label: "All adherents, every faith", value: 182.2, display: "182.2 million" },
          { label: "People in Japan", value: 126, display: "about 126 million" },
        ],
      },
    },
    {
      id: "food",
      heading: "Washoku, a way of eating",
      body: [
        "Washoku, the traditional dietary culture of Japan, is on UNESCO’s list of intangible cultural heritage, one of 23 Japanese entries as of December 2025, alongside Noh, Bunraku, Kabuki and sake-making with koji mould.",
        "In Kyoto, Nishiki Market is where the city’s restaurants and home cooks have bought seasonal ingredients for four centuries.",
      ],
      cite: ["stat-handbook-2026", "nishiki-history"],
      status: "fact-checked",
      seeAlso: { place: "nishiki-market", label: "Go to Nishiki Market" },
    },
    {
      id: "language",
      heading: "More than one language",
      body: [
        "Japanese is not the archipelago’s only language. UNESCO’s Atlas of the World’s Languages in Danger lists eight endangered languages in Japan, among them Ainu, Hachijō and several Ryukyuan languages of the southern islands.",
        "Ainu, the language of the Indigenous Ainu people of Hokkaido and the far north, is the only one rated critically endangered: its youngest speakers are grandparents, who use it partially and rarely.",
      ],
      cite: ["japantimes-ainu", "ninjal-endangered"],
      status: "fact-checked",
    },
  ],
  timeline: {
    title: "From the Jōmon to Reiwa",
    cite: ["columbia-afe-timeline", "nippon-kyoto-millennium"],
    caveat:
      "Period names and dates are conventions historians use, and they disagree, most of all before about 600 CE. Columbia’s timeline, used here, ends the Nara period in 814; most references end it in 794, when the court moved to Heian-kyō (Kyoto), and so does this page.",
    periods: [
      { name: "Jōmon", native: "縄文", from: "prehistory", to: "c. 300 BCE", start: -1400, end: -300, note: "Hunter-gatherer culture named for its hand-made, cord-marked pottery. Its start is dated very differently by different sources." },
      { name: "Yayoi", native: "弥生", from: "c. 300 BCE", to: "c. 300 CE", start: -300, end: 250, note: "Farming society using metal and wheel-turned pottery." },
      { name: "Kofun", native: "古墳", from: "250", to: "538", start: 250, end: 538, note: "Great earthen burial mounds and clay haniwa figures; the Yamato clan emerges, whose rulers began the imperial line." },
      { name: "Asuka", native: "飛鳥", from: "538", to: "710", start: 538, end: 710, note: "Buddhism arrives; the Taika Reform of 645 reorganises government on Chinese models." },
      { name: "Nara", native: "奈良", from: "710", to: "794", start: 710, end: 794, note: "The first permanent capital, at Nara." },
      { name: "Heian", native: "平安", from: "794", to: "1185", start: 794, end: 1185, note: "Court culture flowers in the new capital, Heian-kyō: poetry, diaries, The Tale of Genji." },
      { name: "Kamakura", native: "鎌倉", from: "1185", to: "1333", start: 1185, end: 1333, note: "Military rule begins; the shoguns govern from Kamakura while the court stays in Kyoto." },
      { name: "Muromachi", native: "室町", from: "1336", to: "1573", start: 1336, end: 1573, note: "A warrior government based in Kyoto’s Muromachi district; Zen-influenced arts; long civil wars." },
      { name: "Unification", native: "安土桃山", from: "1568", to: "1598", start: 1573, end: 1600, note: "The country is reunified by force. Also called Azuchi-Momoyama." },
      { name: "Edo", native: "江戸", from: "1600", to: "1867", start: 1600, end: 1868, note: "Tokugawa rule from Edo (Tokyo); two and a half centuries of peace and a vigorous urban culture." },
      { name: "Meiji", native: "明治", from: "1868", to: "1912", start: 1868, end: 1912, note: "Rapid modernisation. In 1869 the emperor moves to Tokyo and Kyoto stops being the capital." },
      { name: "Taishō", native: "大正", from: "1912", to: "1926", start: 1912, end: 1926, note: "" },
      { name: "Shōwa", native: "昭和", from: "1926", to: "1989", start: 1926, end: 1989, note: "" },
      { name: "Heisei", native: "平成", from: "1989", to: "2019", start: 1989, end: 2019, note: "" },
      { name: "Reiwa", native: "令和", from: "2019", to: "present", start: 2019, end: 2026, note: "" },
    ],
  },
  chapters,
  journeys: [
    {
      slug: "a-day-in-kyoto",
      title: "Market, temple, mountain: a day in Kyoto",
      summary: "Three places that show three sides of the old capital: what it eats, how it prays, and the mountain it climbs.",
      stops: [
        { place: "nishiki-market", why: "Start where the city shops: the narrow covered street that has fed Kyoto’s kitchens since at least 1615." },
        { place: "kiyomizu-dera", why: "Cross to the eastern hills for the temple whose wooden stage hangs over the slope of Mt Otowa." },
        { place: "fushimi-inari-taisha", why: "End in the south, walking up Inariyama through the vermilion gates." },
      ],
      limits: "A suggested order, not a timed itinerary: it gives no opening hours, fares or travel times, which change and are not tracked here.",
    },
  ],
  gaps: [
    { topic: "Seven of eight regions", why: "Only Kansai is researched. The others show on the map but have no pages yet." },
    { topic: "Writing systems and the history of Japanese", why: "Not yet sourced well enough to publish." },
    { topic: "Contemporary life, work and cities", why: "No researched content yet; Tokyo has no page." },
    { topic: "Video", why: "No authorised embed has been verified yet (see ASSET_GAPS.md)." },
  ],
};

