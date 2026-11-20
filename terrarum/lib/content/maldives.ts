import { countryEntry } from "./countries";
import type { City, Country, Place, Region } from "./types";

/**
 * The Maldives: the second open country (Milestone 3). Written from the
 * sources each passage cites, read in November 2026; research trail in
 * research/countries/maldives/. The resorts are part of the story (one in ten
 * residents lives on one) but not the subject: this slice is Malé and the
 * atoll around it.
 */

export const maldives: Country = {
  entry: countryEntry("maldives")!,
  summary: "About 1,200 coral islands strung along a ridge in the Indian Ocean, most of them barely a metre or two above the sea.",
  facts: [
    { label: "Where", value: "A double chain of atolls on a submarine ridge 960 km long, running north to south in the Indian Ocean", cite: ["loc-maldives"] },
    { label: "Islands", value: "About 1,200, averaging 1 to 2 km² each", cite: ["loc-maldives"] },
    { label: "Height", value: "Islands lie 1 to 1.5 m above mean sea level; the highest about 3 m", cite: ["loc-maldives"] },
    { label: "Population", value: "515,132: 382,639 Maldivians and 132,493 foreign residents", asOf: "2022 census", cite: ["mbs-census-2022"] },
    { label: "Where people live", value: "About 41% in the Malé area, 46% on the other inhabited islands, 10% on resorts, 3% on industrial islands", asOf: "2022 census", cite: ["mbs-census-2022"] },
    { label: "Language", value: "Dhivehi, written in Thaana, right to left", cite: ["loc-maldives"] },
  ],
  hero: "mv-dhoni",
  card: "mv-male",
  regionsGeo: "/data/mv-atolls.json",
  regionsBounds: [[71.6, -1.0], [74.6, 7.4]],
  regionsAsPoints: true,
  regionsHeading: "Nineteen atolls and two cities, one open",
  regionsNote:
    "The map shows the administrative atolls, which group the natural ones; Malé and Addu are governed as cities. Kaafu, the atoll around the capital, is researched.",
  regions: ["kaafu"],
  pendingRegions: [
    { geoKey: "haa-alifu", name: "Haa Alifu" },
    { geoKey: "addu", name: "Addu" },
    { geoKey: "alifu-alifu", name: "Alifu Alifu" },
    { geoKey: "baa", name: "Baa" },
    { geoKey: "laamu", name: "Laamu" },
    { geoKey: "gaafu-dhaalu", name: "Gaafu Dhaalu" },
  ],
  passages: [
    {
      id: "atolls",
      heading: "Islands on rings of coral",
      body: [
        "Most atolls are a large ring-shaped reef carrying many small islands, sitting on top of a submarine ridge that rises steeply from the deep Indian Ocean. The islands average one or two square kilometres, and lie only a metre or so above the sea.",
        "The word atoll itself comes from Dhivehi, the language of these islands: it is the one word Dhivehi has given to the rest of the world.",
      ],
      cite: ["loc-maldives"],
      status: "fact-checked",
    },
    {
      id: "fish",
      heading: "Fish before resorts",
      body: [
        "Skipjack tuna, kalhubilamas in Dhivehi, makes up 65 to 75 percent of the catch, and most of it is caught with poles and lines, using live bait taken from the lagoons and reefs. Fishers once went out for a single day; the mechanised masdhoni boats now often stay out two or three days. In 2008 the fleet counted 979 vessels, 867 of them pole-and-line masdhoni.",
        "Dried and smoked skipjack, known as Maldive fish, is exported to Sri Lanka. Tourism has grown fast, and one resident in ten now lives on a resort island, but in 2009 fishing was still a source of income for about a fifth of the population.",
      ],
      cite: ["fao-maldives-2009", "mbs-census-2022"],
      status: "fact-checked",
      seeAlso: { place: "male-fish-market", label: "Go to Malé Fish Market" },
    },
    {
      id: "faith",
      heading: "Buddhist, then Muslim",
      body: [
        "For centuries the islands followed Theravada Buddhism, which came from Ceylon, today's Sri Lanka; Western study of that era's ruins began with H. C. P. Bell, a British official from Ceylon who was shipwrecked here in 1879. In 1153 the last Buddhist king converted to Islam, and Maldivians count that year as the cornerstone of their history.",
        "A long line of sultans followed, and sometimes sultanas. The North African traveller Ibn Battutah lived on the islands in the 1340s.",
      ],
      cite: ["loc-maldives"],
      status: "fact-checked",
      seeAlso: { place: "hukuru-miskiy", label: "Go to the Old Friday Mosque" },
    },
    {
      id: "script",
      heading: "A script of its own",
      body: [
        "Dhivehi grew from Elu, an archaic form of Sinhalese, and is spoken across the atolls, with marked dialects in the four southernmost. Its numbers from one to twelve are of Sinhalese origin.",
        "It is written in Thaana, a script invented on the islands, which runs from right to left. Its twenty-four letters begin with nine shaped from the Arabic numerals.",
      ],
      cite: ["loc-maldives"],
      status: "fact-checked",
    },
  ],
  timeline: {
    title: "Buddhist kings to a republic",
    cite: ["loc-maldives"],
    caveat:
      "These dates come from the Library of Congress country study, written in the 1990s; the history before 1153 rests mostly on archaeology. Later events are not yet researched.",
    periods: [
      { name: "Buddhist Maldives", from: "early centuries CE", to: "1153", start: 0, end: 1153, note: "Theravada Buddhism, from Ceylon, is the islands' faith." },
      { name: "Islam and the sultans", from: "1153", to: "1153", start: 1153, end: 1153, note: "The last Buddhist king converts; a line of sultans, and sometimes sultanas, follows." },
      { name: "Ibn Battutah", from: "1340s", to: "1340s", start: 1340, end: 1349, note: "The North African traveller lives on the islands." },
      { name: "Portuguese occupation", from: "1558", to: "1573", start: 1558, end: 1573, note: "The only break in the islands' independence, governed from Goa." },
      { name: "British protectorate", from: "1887", to: "1965", start: 1887, end: 1965, note: "An 1887 agreement gives Britain control of external relations and defence." },
      { name: "Independence", from: "1965", to: "present", start: 1965, end: 2026, note: "" },
    ],
  },
  chapters: [],
  journeys: [
    {
      slug: "a-morning-in-male",
      title: "A morning in Malé: market and mosque",
      summary: "Two places a short walk apart: where the catch comes in, and the coral stone mosque the city has prayed in since 1658.",
      stops: [
        { place: "male-fish-market", why: "Start on the waterfront, where the tuna the country lives on is cut and sold." },
        { place: "hukuru-miskiy", why: "Walk inland to the Old Friday Mosque, built of carved coral in 1658." },
      ],
      limits: "A suggested order on foot, not a timetable. Visiting rules for the mosque are not researched here; check locally.",
    },
  ],
  gaps: [
    { topic: "The other atolls", why: "Only Kaafu and Malé are researched." },
    { topic: "Island life outside Malé", why: "Daily life on the inhabited islands, and the resorts as places of work, are not yet researched." },
    { topic: "Music, crafts and food beyond fish", why: "Bodu beru drumming, lacquerwork and Maldivian cooking are not yet sourced." },
    { topic: "The sea and the future", why: "Sea-level and climate research is not yet sourced to current studies." },
    { topic: "Recent history", why: "The republic, politics and events since 1965 are not researched." },
  ],
};

export const regions: Region[] = [
  {
    slug: "kaafu",
    name: "Kaafu",
    geoKey: "kaafu",
    summary: "The atoll around the capital, home to more people than any other, with more foreign residents than Maldivians because of its resort and industrial islands.",
    definition: {
      id: "kaafu-definition",
      heading: "An atoll, and a city inside it",
      body: [
        "The government groups the natural atolls into administrative ones, and Kaafu is the one around the capital. Malé lies inside it but is governed and counted separately: the census reports the Malé area on its own, apart from the administrative islands.",
        "Leave Malé out and Kaafu still has more residents than any other atoll, 42,677 in 2022. Foreigners outnumber Maldivians there, 22,864 to 19,813, because of the resort and industrial islands.",
      ],
      cite: ["loc-maldives", "mbs-census-2022", "mbs-migration-2022", "natural-earth"],
      status: "fact-checked",
    },
    facts: [
      { label: "Residents, without Malé", value: "42,677, the most of any atoll", asOf: "2022 census", cite: ["mbs-migration-2022"] },
      { label: "Of them", value: "22,864 foreign residents and 19,813 Maldivians", asOf: "2022 census", cite: ["mbs-migration-2022"] },
      { label: "Malé, counted on its own", value: "210,053 people, foreigners included", asOf: "2022 census", cite: ["mbs-migration-2022"] },
    ],
    cities: ["male"],
    pendingCities: [{ name: "Hulhumalé" }, { name: "Villimalé" }],
    areasGeo: { url: "/data/mv-atolls.json", key: "region", only: ["kaafu", "male"], labelProp: "name" },
    bounds: [[73.2, 3.75], [73.85, 4.75]],
    gaps: [
      { topic: "Kaafu's islands one by one", why: "Hulhumalé, Villimalé and the inhabited islands are listed, not yet researched." },
      { topic: "How the resorts work", why: "Employment and ownership on the resort islands are not yet sourced." },
    ],
    status: "fact-checked",
  },
];

export const cities: City[] = [
  {
    slug: "male",
    kind: "city",
    name: "Malé",
    native: "މާލެ",
    where: { lat: 4.1779879, lng: 73.5107387, ref: "OpenStreetMap relation 6599336" },
    summary: "The capital, where four in ten of the country's people live, counting the islands around it.",
    facts: [
      { label: "Population", value: "210,053, foreigners included", asOf: "2022 census", cite: ["mbs-migration-2022"] },
      { label: "Share of the country", value: "About 41% live in the Malé area: Malé, Hulhumalé, Villimalé and Hulhulé", asOf: "2022 census", cite: ["mbs-census-2022"] },
      { label: "Growth", value: "About 4% a year over seven years, mostly from foreign residents (9% a year)", asOf: "2022 census", cite: ["mbs-migration-2022"] },
      { label: "Wards", value: "Henveiru, Galolhu, Machchangoalhi and Maafannu", cite: ["mbs-migration-2022"] },
    ],
    passages: [
      {
        id: "city",
        heading: "A capital on one island",
        body: [
          "Malé, with its four wards, keeps growing: about four percent a year over the seven years to 2022, almost all of it foreign residents, while the number of Maldivians in the wards fell slightly. On any given day about 1,800 more people are in Malé than live there.",
        ],
        cite: ["mbs-migration-2022"],
        status: "fact-checked",
      },
      {
        id: "water",
        heading: "Fresh water under salt",
        body: [
          "Fresh water on these islands lies in thin lenses under the ground. By the 1990s the lens under Malé was shrinking fast, and salt seeping in was already killing mango trees on the island.",
        ],
        cite: ["loc-maldives"],
        status: "fact-checked",
      },
      {
        id: "mosques",
        heading: "Coral and concrete",
        body: [
          "Two mosques show the city's two ages. The Old Friday Mosque of 1658 is built of carved coral blocks; its successor, the Grand Friday Mosque, opened in 1984 and is the largest mosque in the country.",
        ],
        cite: ["visitmaldives-mosques"],
        status: "fact-checked",
      },
    ],
    hero: "mv-male",
    artwork: "mv-male-detail",
    panoramas: [],
    places: ["male-fish-market", "hukuru-miskiy"],
    nearby: [],
    gaps: [
      { topic: "Hulhumalé and the land reclaimed for it", why: "Not yet researched." },
      { topic: "The Grand Friday Mosque and the National Museum", why: "Not yet researched." },
    ],
    status: "fact-checked",
  },
];

export const places: Place[] = [
  {
    slug: "hukuru-miskiy",
    name: "Hukuru Miskiy",
    native: "ހުކުރު މިސްކިތް",
    kind: "Mosque (the Old Friday Mosque)",
    where: { lat: 4.1780133, lng: 73.5123892, ref: "OpenStreetMap way 1317932599" },
    summary: "Malé's Friday mosque of 1658, built of interlocking carved coral blocks, with a cemetery of sultans beside it.",
    matters:
      "It is one of only six coral stone mosques left in the country, and the project that documents them calls it the biggest and one of the finest coral stone buildings in the world.",
    facts: [
      { label: "Completed", value: "1658, after two years' work, under Sultan Ibrahim Iskandhar I", cite: ["visitmaldives-mosques", "coral-stone-mosques"] },
      { label: "Replaced", value: "The mosque built in 1153 by the first Muslim sultan", cite: ["coral-stone-mosques"] },
      { label: "Built of", value: "Interlocking coral stone blocks, carved, set without mortar on a carved plinth", cite: ["coral-stone-mosques", "visitmaldives-mosques"] },
      { label: "Coral stone mosques left", value: "Six in the whole country", cite: ["visitmaldives-mosques"] },
      { label: "UNESCO", value: "Its cemetery has been on the World Heritage tentative list since 2013", cite: ["visitmaldives-mosques"] },
      { label: "Still", value: "A working mosque", cite: ["coral-stone-mosques"] },
    ],
    passages: [
      {
        id: "coral",
        heading: "Built from the reef",
        body: [
          "Coral stone building flourished in the Maldives from the middle of the seventeenth century to the early nineteenth, after mosques of wood, coconut and palm leaf. Here the walls, columns, beams, doors and roof are coral stone joined dry, each block cut to lock into the next, on a plinth carved with ornament.",
        ],
        cite: ["visitmaldives-mosques", "coral-stone-mosques"],
        status: "fact-checked",
      },
      {
        id: "inside",
        heading: "Lacquer and wood inside",
        body: [
          "The plan is a hall of columns: two prayer halls, six antechambers called fenda, and rooms for the sultan and his guards. Overhead is a coffered ceiling with one large recessed panel and ten smaller ones, held off the beams by turned and lacquered supports. The interior is known for its lacquer work and woodcarving.",
        ],
        cite: ["coral-stone-mosques", "visitmaldives-mosques"],
        status: "fact-checked",
      },
      {
        id: "cemetery",
        heading: "Rounded for women, pointed for men",
        body: [
          "Beside the mosque is a seventeenth-century cemetery of carved coral tombs and gravestones. A rounded top marks a woman's grave and a pointed top a man's; gilded inscriptions mark royalty. Sultans, princes and other dignitaries are buried here, and the stonework is counted the finest collection in the country.",
        ],
        cite: ["visitmaldives-mosques", "coral-stone-mosques"],
        status: "fact-checked",
      },
      {
        id: "compound",
        heading: "Minaret, wells and a sundial",
        body: [
          "The compound keeps a large drum-shaped minaret of plastered coral stone bound with metal bands, three coral stone wells with stepping stones leading to the entrances, and a sundial. The mosque itself is in its original condition apart from a corrugated metal roof covering and the floor covering; the original gateway and part of the old cemetery are gone.",
        ],
        cite: ["coral-stone-mosques"],
        status: "fact-checked",
      },
    ],
    hero: "mv-mosque-ext",
    gallery: ["mv-mosque-ext2", "mv-mosque-hall", "mv-mosque-cemetery", "mv-mosque-cemetery2", "mv-mosque-window"],
    panoramas: [],
    related: ["male-fish-market"],
    gaps: [
      { topic: "Visiting", why: "Opening times and rules for visitors are not researched." },
      { topic: "The other five coral stone mosques", why: "Not yet researched." },
    ],
    status: "fact-checked",
  },
  {
    slug: "male-fish-market",
    name: "Malé Fish Market",
    kind: "Market",
    where: { lat: 4.1798183, lng: 73.5095729, ref: "OpenStreetMap way 649533152" },
    summary: "The capital's fish market on the waterfront, where the catch is cleaned and sold.",
    matters:
      "Fishing was still an income for about a fifth of the population in 2009, and this is where the capital buys the catch.",
    facts: [
      { label: "Main fish", value: "Skipjack tuna (kalhubilamas), 65 to 75% of the national catch; yellowfin 10 to 17%", asOf: "2009", cite: ["fao-maldives-2009"] },
      { label: "Caught by", value: "Pole and line, with live bait from the lagoons and reefs", cite: ["fao-maldives-2009"] },
      { label: "Fishers", value: "About 14,000 full time", asOf: "2009", cite: ["fao-maldives-2009"] },
      { label: "How fish are sold", value: "No auction centres; small markets where the boats land", asOf: "2009", cite: ["fao-maldives-2009"] },
      { label: "Where", value: "On the Malé waterfront, in Maafannu", cite: ["osm"] },
    ],
    passages: [
      {
        id: "one-by-one",
        heading: "Poles, lines and live bait",
        body: [
          "Pole-and-line fishing needs plenty of live bait, which the crews catch first in the lagoons and on the reefs. Most trips used to last a single day; modern masdhoni with sonar, fish finders and hydraulic line haulers often stay out two or three.",
        ],
        cite: ["fao-maldives-2009"],
        status: "fact-checked",
      },
      {
        id: "maldive-fish",
        heading: "Maldive fish",
        body: [
          "Not all of the catch is eaten fresh. Skipjack dried and smoked by small processors, known as Maldive fish, is a long-standing export to Sri Lanka; frozen skipjack goes mainly to Thailand, and canned to Germany and the United Kingdom.",
        ],
        cite: ["fao-maldives-2009"],
        status: "fact-checked",
      },
    ],
    hero: "mv-fishmonger",
    gallery: ["mv-dhoni"],
    panoramas: [],
    related: ["hukuru-miskiy"],
    gaps: [
      { topic: "The market's own history", why: "When it was built and how it is run are not yet sourced; this page is about the fishery it serves." },
      { topic: "Current fishery figures", why: "The fishery numbers here are from 2008-09." },
    ],
    status: "fact-checked",
  },
];
