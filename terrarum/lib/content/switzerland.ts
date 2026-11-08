import { countryEntry } from "./countries";
import type { City, Country, Place, Region } from "./types";

/**
 * Switzerland: opened with the Maldives for Milestone 3 (an Alpine federation
 * of cantons against an atoll nation tests the model hardest). Every passage
 * is written from the sources it cites, most of them federal and cantonal
 * documents; research trail in research/countries/switzerland/.
 */

export const switzerland: Country = {
  entry: countryEntry("switzerland")!,
  summary: "A confederation of 26 cantons and four national languages, whose parliament and government sit in Bern.",
  facts: [
    { label: "Made up of", value: "The people and 26 cantons, each named in the constitution", cite: ["ch-constitution"] },
    { label: "National languages", value: "German, French, Italian and Romansh", cite: ["ch-constitution"] },
    { label: "Official languages", value: "German, French and Italian; Romansh with Romansh speakers", cite: ["ch-constitution"] },
    { label: "Population", value: "9,127,100 permanent residents", asOf: "31 December 2025", cite: ["ch-population-2025"] },
    { label: "Ageing", value: "People aged 65 or over now outnumber those under 20", asOf: "2025", cite: ["ch-population-2025"] },
    { label: "Seat of government", value: "Bern, set by federal law; the constitution names no capital", cite: ["ch-constitution"] },
  ],
  hero: "ch-palace-eiger",
  card: "ch-bern-hero",
  regionsGeo: "/data/ch-cantons.json",
  regionsBounds: [[5.9, 45.8], [10.5, 47.85]],
  regionsHeading: "Twenty-six cantons, one open",
  regionsNote: "The cantons are the units the constitution builds the country from, each with its own constitution. Bern is researched.",
  regions: ["canton-of-bern"],
  pendingRegions: [
    { geoKey: "zh", name: "Zürich" },
    { geoKey: "ge", name: "Geneva" },
    { geoKey: "vs", name: "Valais" },
    { geoKey: "gr", name: "Graubünden" },
    { geoKey: "ti", name: "Ticino" },
    { geoKey: "lu", name: "Lucerne" },
  ],
  passages: [
    {
      id: "languages",
      heading: "Four languages, three official",
      body: [
        "Article 4 of the federal constitution names four national languages: German, French, Italian and Romansh. Three are official languages of the Confederation; Romansh is official too when the authorities deal with people who speak it.",
        "English is not among them. The English constitution quoted on this page is a translation with no legal force; only the official-language texts count.",
      ],
      cite: ["ch-constitution"],
      status: "fact-checked",
    },
    {
      id: "capital",
      heading: "A seat, not a capital",
      body: [
        "The constitution lists the cantons that, with the people, form the Confederation, and names no capital at all. Federal law does the work instead: the Parliament Act says the Federal Assembly meets in Bern, and the government's organisation act makes the City of Bern the official seat of the Federal Council.",
      ],
      cite: ["ch-constitution"],
      status: "fact-checked",
      seeAlso: { place: "federal-palace", label: "Go to the Federal Palace" },
    },
    {
      id: "ageing",
      heading: "Older than it was",
      body: [
        "At the end of 2025 Switzerland had 9,127,100 permanent residents, 0.8 percent more than a year before, a slower rise as fewer people arrived and more left. For the first time, people aged 65 or over outnumbered those under 20.",
      ],
      cite: ["ch-population-2025"],
      status: "fact-checked",
    },
  ],
  timeline: {
    title: "Bern and the federal state, in dates",
    cite: ["swissinfo-bern", "parlament-building", "ch-constitution"],
    caveat:
      "A history of Switzerland as a whole is not yet researched. These are the dates the Bern pages rest on, from the city's history and the parliament's own account of its building.",
    periods: [
      { name: "Bern founded", from: "1191", to: "1191", start: 1191, end: 1191, note: "By Berthold V of Zähringen, on a loop of the Aare." },
      { name: "The Zytglogge", from: "1218", to: "1220", start: 1218, end: 1220, note: "The tower that later carries the city's clock." },
      { name: "The great fire", from: "1405", to: "1405", start: 1405, end: 1405, note: "About two thirds of the wooden houses burn; the town is rebuilt in sandstone, with arcades." },
      { name: "Bundes-Rathaus", from: "1852", to: "1857", start: 1852, end: 1857, note: "The former federal town hall, today Bundeshaus West." },
      { name: "Bundeshaus Ost", from: "1888", to: "1892", start: 1888, end: 1892, note: "The second wing." },
      { name: "Parliament Building", from: "1902", to: "1902", start: 1902, end: 1902, note: "Inaugurated on 1 April 1902 between the two wings." },
      { name: "World Heritage", from: "1983", to: "1983", start: 1983, end: 1983, note: "Bern's Old City joins UNESCO's list." },
      { name: "Today's constitution", from: "1999", to: "1999", start: 1999, end: 1999, note: "The Federal Constitution of 18 April 1999." },
    ],
  },
  journeys: [
    {
      slug: "a-walk-through-bern",
      title: "Under the arcades: clock tower to parliament",
      summary: "A short walk through the Old City, from the medieval clock tower to the building that houses the Swiss parliament.",
      stops: [
        { place: "zytglogge", why: "Start under the tower, ideally just before the hour, when the figures move." },
        { place: "federal-palace", why: "Walk west under the arcades to the domed Parliament Building on the Bundesplatz." },
      ],
      limits: "A suggested walk, not a timed tour. Opening and tour times for both buildings change and are not tracked here.",
    },
  ],
  gaps: [
    { topic: "The other 25 cantons", why: "Only Bern is researched." },
    { topic: "A history of Switzerland", why: "The Confederation's history before 1848, and since, is not yet researched." },
    { topic: "The Alps themselves", why: "Mountains, railways and alpine villages have no pages yet." },
    { topic: "Food, music and everyday life", why: "Not yet researched." },
  ],
};

export const regions: Region[] = [
  {
    slug: "canton-of-bern",
    name: "Canton of Bern",
    native: "Bern / Berne",
    geoKey: "be",
    summary: "A bilingual canton of 335 municipalities, from the French-speaking Bernese Jura to the 4,274 m Finsteraarhorn.",
    definition: {
      id: "bern-definition",
      heading: "German and French, by region",
      body: [
        "Bern is one of the 26 cantons the federal constitution names, and has a constitution of its own. Article 6 makes German and French its languages, and says where each is used: French in the administrative region of the Bernese Jura, both in Seeland and the district of Biel/Bienne, and German everywhere else.",
      ],
      cite: ["ch-constitution", "be-constitution"],
      status: "fact-checked",
    },
    facts: [
      { label: "Population", value: "1,071,216", asOf: "end of 2024", cite: ["be-kennzahlen-2024"] },
      { label: "Municipalities", value: "335, from Bern (137,995 people) to Rebévelier (32)", asOf: "2024", cite: ["be-kennzahlen-2024"] },
      { label: "Area", value: "5,958 km²: 42.9% farmland, 32.2% forest, 7.5% built on", cite: ["be-kennzahlen-2024"] },
      { label: "Highest and lowest", value: "Finsteraarhorn, 4,274 m; Wynau, 401.5 m", cite: ["be-kennzahlen-2024"] },
    ],
    cities: ["bern"],
    pendingCities: [{ name: "Biel/Bienne" }, { name: "Thun" }, { name: "Interlaken" }],
    areasGeo: { url: "/data/ch-cantons.json", key: "region", only: ["be"], labelProp: "name" },
    bounds: [[6.85, 46.3], [8.5, 47.4]],
    image: "ch-finster",
    gaps: [
      { topic: "The Bernese Oberland and the Jura", why: "The mountain and Jura regions are on the map but not yet researched." },
      { topic: "The canton's history", why: "Not yet researched." },
    ],
    status: "fact-checked",
  },
];

export const cities: City[] = [
  {
    slug: "bern",
    name: "Bern",
    where: { lat: 46.948, lng: 7.4474, ref: "Old City, map label position" },
    summary: "The federal city: a medieval town in a loop of the Aare, where the Swiss parliament and government sit.",
    facts: [
      { label: "Founded", value: "1191, by Berthold V of Zähringen", cite: ["swissinfo-bern"] },
      { label: "Population", value: "137,995", asOf: "2024", cite: ["be-kennzahlen-2024"] },
      { label: "Seat of", value: "The Federal Assembly and the Federal Council", cite: ["ch-constitution"] },
      { label: "World Heritage", value: "The Old City, since 1983", cite: ["swissinfo-bern"] },
      { label: "Arcades", value: "About 6 km of them", cite: ["swissinfo-bern"] },
    ],
    passages: [
      {
        id: "loop",
        heading: "A town in a river loop",
        body: [
          "Berthold V of Zähringen founded Bern in 1191 on a peninsula in a loop of the River Aare, which wraps around the old town. It was laid out to a twelfth-century plan and has been adapted ever since.",
          "The first houses were wooden. A fire in 1405 destroyed about two thirds of them, and the town was rebuilt in sandstone; the arcades that line its streets date from then.",
        ],
        cite: ["swissinfo-bern"],
        status: "fact-checked",
      },
      {
        id: "arcades",
        heading: "Six kilometres of arcades",
        body: [
          "The arcades run along both sides of the streets for about six kilometres. Albert Einstein, newly arrived in 1902, wrote to Mileva Marić that you could walk from one end of the city to the other in the worst rain practically without getting wet.",
          "Along the streets stand eleven fountains from the sixteenth century, ten of them with their original Renaissance figures.",
        ],
        cite: ["swissinfo-bern"],
        status: "fact-checked",
      },
      {
        id: "heritage",
        heading: "On the World Heritage list since 1983",
        body: [
          "UNESCO listed the Old City in 1983 for the coherence of its plan over the centuries. Swissinfo reports it is the only Swiss World Heritage site whose loss UNESCO has called irreparable for the world.",
        ],
        cite: ["swissinfo-bern"],
        status: "fact-checked",
      },
    ],
    hero: "ch-bern-hero",
    artwork: "ch-bern-aare",
    panoramas: [],
    places: ["zytglogge", "federal-palace"],
    gaps: [
      { topic: "The Minster, the bear park and the Aare", why: "Not yet researched." },
      { topic: "Einstein in Bern", why: "His years here (1902-09) deserve a page; not yet sourced beyond the letter quoted." },
    ],
    status: "fact-checked",
  },
];

export const places: Place[] = [
  {
    slug: "zytglogge",
    name: "Zytglogge",
    kind: "Clock tower",
    where: { lat: 46.9479474, lng: 7.4477951, ref: "OpenStreetMap way 39374439" },
    summary: "Bern's medieval clock tower, with a sixteenth-century movement that strikes the hours and sets a rooster crowing.",
    matters: "Built in the town's first decades, it still runs on a sixteenth-century clock movement, and every day crowds gather below it to watch the hour arrive.",
    facts: [
      { label: "Built", value: "1218 to 1220", cite: ["swissinfo-bern"] },
      { label: "Clock movement", value: "Sixteenth century", cite: ["swissinfo-bern"] },
      { label: "What it drives", value: "The bell striker, two clocks, the astronomical clock and mechanical figures", cite: ["swissinfo-bern"] },
      { label: "On the hour", value: "A rooster crows three times", cite: ["swissinfo-bern"] },
    ],
    passages: [
      {
        id: "tower",
        heading: "Built in the town's first decades",
        body: [
          "The tower was built between 1218 and 1220, less than thirty years after the town was founded. Every day it draws crowds who come to watch the clock at work.",
        ],
        cite: ["swissinfo-bern"],
        status: "fact-checked",
      },
      {
        id: "clock",
        heading: "The show on the hour",
        body: [
          "A sixteenth-century movement drives everything: the striker on the bell, two clocks, an astronomical clock and a set of mechanical figures. As the hour arrives, a rooster comes out and crows three times.",
        ],
        cite: ["swissinfo-bern"],
        status: "fact-checked",
      },
    ],
    hero: "ch-zyt-cc0",
    gallery: ["ch-kramgasse", "ch-zyt"],
    panoramas: [],
    related: ["federal-palace"],
    gaps: [
      { topic: "Who built the clock and how it works", why: "The makers and mechanism are not yet sourced." },
      { topic: "Tours inside", why: "Tour times are not tracked here." },
    ],
    status: "fact-checked",
  },
  {
    slug: "federal-palace",
    name: "Federal Palace",
    native: "Bundeshaus",
    kind: "Parliament building",
    where: { lat: 46.9464883, lng: 7.4443324, ref: "OpenStreetMap way 254958900" },
    summary: "The domed Parliament Building of 1902, where the Swiss Federal Assembly meets, built to hold the whole country in its stone.",
    matters:
      "Its architect set out to show all of Switzerland in one building, in stone from eleven cantons and work by craftsmen and artists from every region.",
    facts: [
      { label: "Inaugurated", value: "1 April 1902, by the United Federal Assembly", cite: ["parlament-building"] },
      { label: "Architect", value: "Hans Wilhelm Auer (1847-1906)", cite: ["parlament-building"] },
      { label: "Stone from", value: "Eleven cantons", cite: ["parlament-building"] },
      { label: "Art", value: "33 artists; 16.2% of the 7,198,000-franc cost", cite: ["parlament-building"] },
      { label: "Used by", value: "The Federal Assembly, which by law meets in Bern", cite: ["ch-constitution"] },
    ],
    passages: [
      {
        id: "keystone",
        heading: "The last stone of a federal palace",
        body: [
          "The Parliament Building was set between two older federal wings, Bundeshaus West of 1852 to 1857 and Bundeshaus Ost of 1888 to 1892, as the keystone of the whole complex. Its style is historicist: a rich mix of older styles and a great deal of decoration, typical of the late nineteenth century.",
        ],
        cite: ["parlament-building"],
        status: "fact-checked",
      },
      {
        id: "all-switzerland",
        heading: "All of Switzerland in one building",
        body: [
          "Hans Wilhelm Auer wanted the building to represent the whole country physically. Its stone comes from eleven cantons, and materials and craftsmen came from every region for the interior. A carved room by the woodcarving workshop of Brienz was shown at the 1900 World Exhibition in Paris.",
        ],
        cite: ["parlament-building"],
        status: "fact-checked",
      },
      {
        id: "art",
        heading: "Art as part of the budget",
        body: [
          "Thirty-three Swiss artists placed work in and on the building, and 16.2 percent of its 7,198,000-franc cost went on art: a share, the parliament's own account says, never matched by a public building since.",
        ],
        cite: ["parlament-building"],
        status: "fact-checked",
      },
    ],
    hero: "ch-palace-towers",
    gallery: ["ch-palace-square", "ch-landgemeinde", "ch-palace-eiger"],
    panoramas: [],
    related: ["zytglogge"],
    gaps: [
      { topic: "The chambers and how parliament works", why: "Not yet researched." },
      { topic: "Visiting", why: "Tour times are not tracked here." },
    ],
    status: "fact-checked",
  },
];
