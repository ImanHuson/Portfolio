import { countryEntry } from "./countries";
import type { City, Country, Place, Region } from "./types";

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
  regions: ["kansai"],
  pendingRegions: [
    { geoKey: "hokkaido", name: "Hokkaido", native: "北海道" },
    { geoKey: "tohoku", name: "Tōhoku", native: "東北" },
    { geoKey: "kanto", name: "Kantō", native: "関東" },
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
      limits: "A suggested order, not a timed itinerary: it gives no opening hours, fares or travel times, which change and are not tracked here. Only Nishiki Market has a 360° view.",
    },
  ],
  gaps: [
    { topic: "Seven of eight regions", why: "Only Kansai is researched. The others show on the map but have no pages yet." },
    { topic: "Writing systems and the history of Japanese", why: "Not yet sourced well enough to publish." },
    { topic: "Contemporary life, work and cities", why: "No researched content yet; Tokyo has no page." },
    { topic: "Video", why: "No authorised embed has been verified yet (see ASSET_GAPS.md)." },
  ],
};

export const regions: Region[] = [
  {
    slug: "kansai",
    name: "Kansai",
    native: "関西",
    geoKey: "kansai",
    summary: "The old heartland of the imperial court, around Kyoto, Osaka, Nara and Kobe.",
    definition: {
      id: "kansai-definition",
      heading: "Where Kansai ends",
      body: [
        "Kansai, also called Kinki, is a regional name, not a unit of government; Japan is governed through its 47 prefectures. The map follows Natural Earth’s region field, which puts seven prefectures in Kinki: Kyoto, Osaka, Hyōgo, Nara, Shiga, Wakayama and Mie. Other definitions draw the edge differently.",
      ],
      cite: ["natural-earth", "stat-handbook-2026"],
      status: "fact-checked",
    },
    facts: [
      { label: "Kinki major metropolitan area", value: "19.2 million people", asOf: "2020 census", note: "The statistical area around Osaka, Sakai, Kyoto and Kobe, not the whole region", cite: ["stat-handbook-2026"] },
      { label: "Kyoto City", value: "1,464,000 people", asOf: "2020 census", cite: ["stat-handbook-2026"] },
    ],
    cities: ["kyoto"],
    pendingCities: [{ name: "Osaka", native: "大阪" }, { name: "Nara", native: "奈良" }, { name: "Kobe", native: "神戸" }, { name: "Ōtsu", native: "大津" }, { name: "Uji", native: "宇治" }],
    areasGeo: { url: "/data/jp-prefectures.json", key: "region", only: ["kansai"], labelProp: "name" },
    bounds: [[134.2, 33.4], [137.0, 35.8]],
    gaps: [
      { topic: "Official definitions compared", why: "How the Union of Kansai Governments and national ministries define the region is not yet researched." },
      { topic: "Osaka, Nara, Kobe and the countryside", why: "Listed, not yet researched." },
    ],
    status: "fact-checked",
  },
];

export const cities: City[] = [
  {
    slug: "kyoto",
    name: "Kyoto",
    native: "京都",
    where: { lat: 35.0116, lng: 135.7681, ref: "central Kyoto, map label position" },
    summary: "Japan’s capital for more than a thousand years, from 794 to 1869, and still a working city of about 1.46 million.",
    facts: [
      { label: "Founded", value: "794, as Heian-kyō, by Emperor Kanmu", cite: ["nippon-kyoto-millennium"] },
      { label: "Capital until", value: "1869, when Emperor Meiji moved east to Tokyo", cite: ["nippon-kyoto-millennium"] },
      { label: "Population", value: "1,464,000", asOf: "2020 census", cite: ["stat-handbook-2026"] },
      { label: "Climate", value: "August averages a high of 33.7 °C, January a low of 1.5 °C; 1,523 mm of rain a year", note: "Climate normals", cite: ["stat-handbook-2026"] },
      { label: "World Heritage", value: "17 monuments in Kyoto, Uji and Ōtsu, inscribed in December 1994", cite: ["kyoto-city-heritage", "unesco-688"] },
    ],
    passages: [
      {
        id: "grid",
        heading: "A capital drawn on a grid",
        body: [
          "Emperor Kanmu ordered the capital moved here in 794 and had it laid out on the model of Chinese capitals such as Chang’an and Luoyang: an 84-metre avenue, Suzaku-ōji, ran north to south, with streets in a symmetrical grid on either side.",
          "Its name, Heian-kyō, means capital of peace and tranquillity. It rarely had either. The Ōnin War of 1467 to 1477 was fought in its streets and opened a century of civil war; Fushimi Inari’s buildings were among those burned.",
        ],
        cite: ["nippon-kyoto-millennium", "inari-spots"],
        status: "fact-checked",
      },
      {
        id: "court",
        heading: "The court stayed, the power moved",
        body: [
          "Shoguns set up governments in Kamakura and later in Edo, but the imperial court stayed in Kyoto, and much of the country’s political and cultural life with it, until 1869.",
        ],
        cite: ["nippon-kyoto-millennium", "columbia-afe-timeline"],
        status: "fact-checked",
      },
      {
        id: "heritage",
        heading: "Seventeen monuments, not the whole city",
        body: [
          "The World Heritage listing covers 17 properties: 13 Buddhist temples, three Shinto shrines and Nijō Castle, spread across Kyoto, Uji and Ōtsu. Only buildings and gardens with Japan’s highest protection were eligible.",
          "Kiyomizu-dera is one of them. Fushimi Inari Taisha and Nishiki Market are not, which says more about the rules of the listing than about either place.",
        ],
        cite: ["kyoto-city-heritage"],
        status: "fact-checked",
      },
    ],
    hero: "kyoto-yasaka",
    artwork: "cma-gion",
    panoramas: [
      {
        id: "kyoto-station-plaza",
        media: "pano-kyoto-station",
        title: "Kyoto Station, the bus plaza",
        yaw: 40,
        description: "The plaza in front of Kyoto Station, where most visitors first arrive. An older photograph; the licence metadata does not record when it was taken.",
      },
    ],
    places: ["nishiki-market", "kiyomizu-dera", "fushimi-inari-taisha"],
    gaps: [
      { topic: "Neighbourhoods and everyday life", why: "Gion, the machiya townhouses and the Kamo River are not yet researched." },
      { topic: "Fourteen of the seventeen World Heritage monuments", why: "Only Kiyomizu-dera has a page." },
    ],
    status: "fact-checked",
  },
];

export const places: Place[] = [
  {
    slug: "nishiki-market",
    name: "Nishiki Market",
    native: "錦市場",
    kind: "Market street",
    where: { lat: 35.0050244, lng: 135.7655699, ref: "OpenStreetMap way 772134672" },
    summary: "A covered street of about 390 metres in central Kyoto, lined with food shops, known as Kyoto’s kitchen.",
    matters:
      "It is where the city’s ingredients have been bought and sold for four hundred years, and where you can see what Kyoto actually eats.",
    facts: [
      { label: "On record since", value: "1615, when the Edo shogunate recognised it as one of Kyoto’s three fish wholesalers", cite: ["nishiki-history"] },
      { label: "Older than the record", value: "A market here in the Heian period (794-1185) is estimated, not documented", cite: ["nishiki-history"] },
      { label: "Size", value: "About 390 m from east to west, 3.3 to 5 m wide", cite: ["nishiki-history"] },
      { label: "Groundwater", value: "15 to 18 °C all year, called Nishiki no mizu", cite: ["nishiki-history"] },
      { label: "Street", value: "Nishikikōji-dōri, Nakagyō Ward", cite: ["osm"] },
    ],
    passages: [
      {
        id: "water",
        heading: "Why a market grew here",
        body: [
          "The answer is under the street. Cold groundwater, steady at 15 to 18 °C, kept fish and fowl fresh, and each shop once had its own well, deep enough to climb down into, that served as its refrigerator. The street was also central, and close enough to the Imperial Palace for deliveries.",
        ],
        cite: ["nishiki-history"],
        status: "fact-checked",
      },
      {
        id: "stalls",
        heading: "What it sells",
        body: [
          "Kyoto vegetables, freshwater fish from Lake Biwa, hamo (pike conger), guji (tilefish), yuba (the skin lifted from heated soy milk) and fu (wheat gluten), among much else. The same ingredients go to the city’s formal restaurants and into obanzai, everyday Kyoto home cooking.",
          "At the end of the year the street fills so tightly before New Year that moving along it is an effort, and that crowd is a Kyoto tradition in itself.",
        ],
        cite: ["nishiki-history"],
        status: "fact-checked",
      },
      {
        id: "jakuchu",
        heading: "A painter from the greengrocers",
        body: [
          "Itō Jakuchū (1716-1800), the Edo painter of vividly detailed plants and animals, was born here to a family of greengrocery wholesalers; a monument near the west entrance marks the site. Turnips, daikon radishes, lotus roots and squashes, a greengrocer’s stock, fill his paintings, Vegetable Nirvana among them.",
          "Between 1771 and 1774 a dispute threatened the market’s business. Jakuchū, then head of the district, set his painting aside to settle it, and the market association calls him a key person in its survival.",
        ],
        cite: ["nishiki-history"],
        status: "fact-checked",
      },
      {
        id: "names",
        heading: "The street’s old names",
        body: [
          "In the Heian period the lane was called Gusoku Kōji, from the armour (gusoku) courtiers took off on their way in and out of the palace. For a time the similar-sounding kuso, dung, stuck to it instead. It has been Nishiki, brocade, since.",
        ],
        cite: ["nishiki-history"],
        status: "fact-checked",
      },
    ],
    hero: "nishiki-tsukemono",
    gallery: ["nishiki-ignis", "nishiki-kintoki", "nishiki-hirousu", "nishiki-tofu", "nishiki-tenmangu", "nishiki-1"],
    panoramas: [
      {
        id: "nishiki-tenmangu-gate",
        media: "pano-nishiki-tenmangu",
        title: "The gate of Nishiki Tenmangū",
        yaw: -60,
        description:
          "Standing in the gateway of Nishiki Tenmangū, a small shrine at the east end of the market: the shrine on one side, a covered shopping arcade on the other. Drag to look round.",
      },
    ],
    related: ["kiyomizu-dera", "fushimi-inari-taisha"],
    gaps: [
      { topic: "Shop numbers and opening hours", why: "They change and are not tracked here." },
      { topic: "Traders’ own voices", why: "No first-hand account or interview has been sourced." },
    ],
    status: "fact-checked",
  },
  {
    slug: "fushimi-inari-taisha",
    name: "Fushimi Inari Taisha",
    native: "伏見稲荷大社",
    kind: "Shinto shrine and sacred mountain",
    where: { lat: 34.9670758, lng: 135.7725433, ref: "OpenStreetMap node 10964856510 (Rōmon gate)" },
    summary: "The head shrine of Inari, set at the foot of a 233-metre mountain whose paths run under about ten thousand vermilion gates.",
    matters:
      "Some thirty thousand Inari shrines across Japan are affiliated to this one, and the whole mountain behind it is the shrine’s precinct.",
    facts: [
      { label: "Head shrine of", value: "Some 30,000 Inari shrines across Japan", cite: ["inari-about"] },
      { label: "Enshrined", value: "711, by the shrine’s account and the traditional calendar", cite: ["inari-about", "inari-history"] },
      { label: "Inariyama", value: "233 m, the southernmost of the 36 Higashiyama peaks", cite: ["inari-spots"] },
      { label: "Torii", value: "Around 10,000, of all sizes", cite: ["inari-faq"] },
      { label: "Precinct", value: "About 870,000 m², most of it the mountain", cite: ["inari-faq"] },
      { label: "World Heritage", value: "Not one of Kyoto’s 17 listed monuments", cite: ["kyoto-city-heritage"] },
    ],
    passages: [
      {
        id: "origin",
        heading: "A rice cake, a swan, a mountain",
        body: [
          "The shrine’s own history begins with a story from the Yamashirokoku Fudoki, an early provincial record: Irogu no Hatanokimi shot at a rice cake, which turned into a swan and flew to a peak of the mountain, where rice grew. Ina means rice, and the name Inari is traced to that event.",
          "By the same account, the deity was enshrined on the mountain’s three peaks in 711, on the first Day of the Horse of the second month. The shrine notes that the faith may be older still.",
        ],
        cite: ["inari-history", "inari-about"],
        status: "fact-checked",
      },
      {
        id: "gates",
        heading: "Why so many gates",
        body: [
          "A torii given to the shrine stands for a prayer passing from a person to the deity, in hope or in thanks. Giving them had become widespread by the start of the Edo period, which the shrine dates to 1603, and today around ten thousand line the mountain paths.",
          "The vermilion is a pigment of mercury and red earth, used since ancient times to protect wood. The shrine reads meaning into the colour too: the word ake can mean red, dawn or light.",
        ],
        cite: ["inari-faq", "inari-spots"],
        status: "fact-checked",
      },
      {
        id: "foxes",
        heading: "The foxes are messengers",
        body: [
          "There are fox statues here, one of them pictured below, but Inari is not a fox. The shrine describes foxes as the deity’s messengers, invisible like the deity itself and called byakko-san, white foxes; not the foxes that live on the mountain.",
        ],
        cite: ["inari-faq"],
        status: "fact-checked",
      },
      {
        id: "rebuilt",
        heading: "Burned and rebuilt",
        body: [
          "Every building on and below the mountain burned in 1468, in the Ōnin War. The main shrine was rebuilt in 1499 and still stands. The main gate is said to have been paid for by Toyotomi Hideyoshi in 1589, after he pledged it for his mother’s recovery. The story was doubted until repairs uncovered an ink inscription dated that very year.",
          "Climbing here has a long history of its own: the Heian court writer Sei Shōnagon recorded in The Pillow Book of how exhausting the walk up to the shrine buildings was.",
        ],
        cite: ["inari-spots", "inari-history"],
        status: "fact-checked",
      },
    ],
    hero: "inari-lantern",
    gallery: ["inari-curve", "inari-inscribed", "inari-fox", "inari-senbon"],
    panoramas: [],
    related: ["kiyomizu-dera", "nishiki-market"],
    gaps: [
      { topic: "360° view", why: "No openly licensed panorama of the shrine was found. Listed in ASSET_GAPS.md." },
      { topic: "Festivals and the shrine’s year", why: "The rite calendar is published by the shrine but not yet researched." },
    ],
    status: "fact-checked",
  },
  {
    slug: "kiyomizu-dera",
    name: "Kiyomizu-dera",
    native: "清水寺",
    kind: "Buddhist temple",
    where: { lat: 34.994303, lng: 135.7844389, ref: "OpenStreetMap way 336641107" },
    summary: "A temple halfway up Mt Otowa in Kyoto’s eastern hills, its main hall fronted by a wooden stage nearly 13 metres above the slope.",
    matters:
      "Founded in 778 and burned more than ten times, it has always been rebuilt by the people who come to it, and its stage gave Japanese an everyday phrase.",
    facts: [
      { label: "Founded", value: "778", cite: ["kiyomizu-learn"] },
      { label: "Main Hall", value: "Rebuilt in 1633 with the help of shogun Tokugawa Iemitsu; a National Treasure", cite: ["ndl-kiyomizu"] },
      { label: "Stage", value: "Nearly 13 m high; about 200 m² of hinoki (Japanese cypress) boards", cite: ["kiyomizu-learn", "ndl-kiyomizu"] },
      { label: "Grounds", value: "130,000 m², with about thirty buildings", cite: ["kiyomizu-learn"] },
      { label: "World Heritage", value: "One of the 17 Historic Monuments of Ancient Kyoto", cite: ["kyoto-city-heritage"] },
    ],
    passages: [
      {
        id: "founding",
        heading: "A spring on Mt Otowa",
        body: [
          "The temple tells its founding this way. A monk named Kenshin, practising in Nara, was told in a dream to go north. On Mt Otowa he found a clear waterfall, and the hermit Gyōei living beside it. Two years later the warrior Sakanoue no Tamuramaro came to the mountain to hunt deer, met Kenshin at the waterfall, and with his wife built a temple there.",
          "The temple is dedicated to Kannon, the bodhisattva of great mercy and compassion; its principal image has eleven faces and forty-two arms.",
        ],
        cite: ["kiyomizu-learn", "kiyomizu-home"],
        status: "fact-checked",
      },
      {
        id: "stage",
        heading: "A stage built like scaffolding",
        body: [
          "The main hall stands on a steep cliff. Its pillars and cross-rails work like scaffolding, and the frame holds so firmly that it is highly resistant to earthquakes even on that slope. The stage in front was laid with over 166 new hinoki boards in a restoration that ran twelve years from 2008.",
          "It was built for performances offered to Kannon: court music, Noh, Kyōgen and Kabuki. “To jump off the stage of Kiyomizu” means, in Japanese, to take the plunge on a bold decision.",
        ],
        cite: ["kiyomizu-learn"],
        status: "fact-checked",
      },
      {
        id: "fires",
        heading: "Burned more than ten times",
        body: [
          "Fire has destroyed most of the buildings more than ten times since the founding, and each time the temple’s followers paid to rebuild. The present main hall dates from 1633, rebuilt with the shogun Tokugawa Iemitsu’s support.",
        ],
        cite: ["kiyomizu-learn", "ndl-kiyomizu"],
        status: "fact-checked",
      },
    ],
    hero: "kiyo-hero",
    gallery: ["kiyo-otowa", "kiyo-stage", "kiyo-niomon", "kiyo-06"],
    panoramas: [],
    related: ["fushimi-inari-taisha", "nishiki-market"],
    gaps: [
      { topic: "360° view", why: "No openly licensed panorama of the temple was found. Listed in ASSET_GAPS.md." },
      { topic: "The Otowa waterfall today and the temple’s annual rites", why: "Not yet researched." },
    ],
    status: "fact-checked",
  },
];
