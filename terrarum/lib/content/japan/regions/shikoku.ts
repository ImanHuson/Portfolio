import type { City, Place, Region } from "../../types";

/** Shikoku: Matsuyama and Takamatsu. */

export const region: Region = {
  slug: "shikoku",
  name: "Shikoku",
  native: "四国",
  hero: "ritsurin-island",
  geoKey: "shikoku",
  summary: "The island of the 88-temple pilgrimage: Matsuyama, with a castle on a hill in the middle of the city and the bathhouse of Dōgo Onsen, and Takamatsu, the Matsudaira lords’ port, with Ritsurin Garden.",
  definition: {
    id: "shikoku-definition",
    heading: "Where Shikoku ends",
    body: [
      "Shikoku is one of Japan’s main islands and, as a region, four prefectures: Tokushima, Kagawa, Ehime and Kōchi, which is how Natural Earth’s region field draws it. Kagawa, round Takamatsu, is the smallest of all 47 prefectures by area.",
    ],
    cite: ["natural-earth", "stat-handbook-2026"],
    status: "fact-checked",
  },
  facts: [
    { label: "Four prefectures", value: "About 3.5 million people", asOf: "2024 estimates", note: "Tokushima 685,000, Kagawa 917,000, Ehime 1,276,000, Kōchi 656,000", cite: ["stat-handbook-2026"] },
    { label: "Kagawa", value: "1,877 km², the smallest prefecture", cite: ["stat-handbook-2026"] },
    { label: "The pilgrimage", value: "88 temples across all four prefectures", cite: ["jta-r2-01920"] },
  ],
  cities: ["matsuyama", "takamatsu"],
  pendingCities: [],
  areasGeo: { url: "/data/jp-prefectures.json", key: "region", only: ["shikoku"], labelProp: "name" },
  bounds: [[132.0, 32.7], [134.9, 34.6]],
  gaps: [],
  status: "fact-checked",
};

export const cities: City[] = [
  {
    slug: "matsuyama",
    kind: "city",
    name: "Matsuyama",
    native: "松山",
    where: { lat: 33.8395, lng: 132.7654, ref: "OpenStreetMap relation 4050217 (Matsuyama City)" },
    summary: "Ehime’s capital, built round a castle on a hill in its centre, with a hot spring said to be the oldest in Japan on its edge.",
    facts: [
      { label: "Castle keep", value: "Rebuilt 1854, one of twelve surviving keeps built before the modern era", cite: ["matsuyama-castle-city"] },
      { label: "Citrus", value: "More than 30 kinds grown in the city", cite: ["matsuyama-food"] },
      { label: "Ehime Prefecture", value: "1,276,000 people", asOf: "2024 estimate", cite: ["stat-handbook-2026"] },
    ],
    passages: [
      {
        id: "matsuyama-castle-hill",
        heading: "A castle in the middle of the city",
        covers: ["geography", "history", "architecture"],
        body: [
          "What sets Matsuyama apart is that its castle still stands in the middle of it, on Mount Katsuyama, 132 metres high, with the shopping streets and government offices spread round its foot. It was built about 400 years ago. Only twelve castle keeps built before the modern era survive in Japan, and Matsuyama’s is one of them; the present keep was rebuilt in 1854. With its gates and turrets, 21 of its buildings are Important Cultural Properties.",
          "From the keep the view runs over the city to the Seto Inland Sea and the mountains of Shikoku. A ropeway and a single-seat chairlift run most of the way up; about 200 cherry trees fill the main enclosure in early April.",
        ],
        cite: ["matsuyama-castle-city"],
        images: ["matsuyama-castle"],
        status: "fact-checked",
      },
      {
        id: "matsuyama-botchan",
        heading: "Botchan’s town",
        covers: ["identity", "life"],
        body: [
          "The novelist Natsume Sōseki was posted to Matsuyama in 1895, and that October he is said to have used a private room at the Dōgo Onsen bathhouse with the poet Masaoka Shiki. The bathhouse still quotes the hero of his novel Botchan: “I always bathed in the Jōtō bath.”",
          "Dōgo is not only for visitors. Some local people come to the bathhouse almost every day, as they would to any public bath.",
        ],
        cite: ["dogo-honkan"],
        images: ["matsuyama-station"],
        places: ["dogo-onsen-honkan"],
        status: "fact-checked",
      },
      {
        id: "matsuyama-food",
        heading: "Sea bream, citrus and three-coloured dumplings",
        covers: ["food", "differences"],
        body: [
          "The city calls itself a citrus kingdom and grows more than 30 kinds, sold fresh and as juice, jelly and ice cream along the shopping arcades. Taimeshi is a whole sea bream from the Inland Sea, grilled and cooked with the rice, then flaked through it. Botchan dango, rice dumplings coloured with green tea, egg and red bean, are served at the Dōgo bathhouse; Matsuyama tart is said to come from a recipe a lord of Matsuyama brought back from Nagasaki in the Edo period.",
          "Its everyday dishes are its own too: nabeyaki udon, soft noodles in a sweet broth, first made in Matsuyama soon after the war, and Mitsuhama-yaki, an okonomiyaki packed with noodles and cabbage, made at more than twenty shops in the port of Mitsuhama.",
        ],
        cite: ["matsuyama-food"],
        status: "fact-checked",
      },
    ],
    hero: "matsuyama-castle-hill",
    panoramas: [],
    places: ["dogo-onsen-honkan", "ishite-ji"],
    nearby: ["takamatsu", "hiroshima"],
    gaps: [],
    status: "fact-checked",
  },
  {
    slug: "takamatsu",
    kind: "city",
    name: "Takamatsu",
    native: "高松",
    where: { lat: 34.3426, lng: 134.0465, ref: "OpenStreetMap relation 4051287 (Takamatsu City)" },
    summary: "Kagawa’s capital and port on the Seto Inland Sea, the Matsudaira lords’ castle town, and the home of Sanuki udon.",
    facts: [
      { label: "Ritsurin Garden", value: "Begun 1642", cite: ["jta-r2-01858"] },
      { label: "Bonsai", value: "About 80% of Japan’s miniature pines are grown here", cite: ["jta-r2-01862"] },
      { label: "Kagawa Prefecture", value: "917,000 people, on the smallest area of any prefecture", asOf: "2024 estimate", cite: ["stat-handbook-2026"] },
    ],
    passages: [
      {
        id: "takamatsu-castle",
        heading: "A castle with the sea in its moat",
        covers: ["geography", "history", "architecture"],
        body: [
          "Takamatsu Castle stood by the port, the headquarters of the Matsudaira lords who ruled the area through the Edo period. The sixteenth-century castle was rebuilt and much enlarged in the 1640s, and what survives dates from then: the Tsukimi turret, the Mizunote gate, stone walls and a moat whose water comes from the Seto Inland Sea. Boats take visitors round the inner moat, and the site of the keep, opened in 2013 after years of excavation, looks out over the city to the islands.",
          "In the same park stands the Hiunkaku, a mansion built in 1917 for the Matsudaira family, Japanese in style with Western building methods, now an Important Cultural Property.",
        ],
        cite: ["jta-r2-01861"],
        images: ["takamatsu-castle"],
        status: "fact-checked",
      },
      {
        id: "takamatsu-udon",
        heading: "Udon country",
        covers: ["food", "identity", "life"],
        body: [
          "Kagawa is said to eat more udon per person than anywhere in Japan, and Sanuki udon, named after the province, is the first meal most visitors sit down to. The ingredients were all to hand: good flour, iriko dried sardines for the broth, salt from salt works favoured by the dry climate, and soy sauce from the island of Shōdoshima. The noodles are thick and chewy, eaten hot in broth or cold with a dipping sauce, and the dough was traditionally trodden underfoot.",
          "Kagawa is where self-service udon began, and the shops are busiest from early morning to lunchtime, when people of every age stop in for a quick bowl. Legend credits the noodles to the monk Kūkai, a native of the province.",
        ],
        cite: ["jta-h30-01110", "jta-r2-01903"],
        images: ["takamatsu-udon"],
        status: "fact-checked",
      },
      {
        id: "takamatsu-pilgrims",
        heading: "Pines, pilgrims and a dry climate",
        covers: ["differences", "life"],
        body: [
          "The warm, dry climate that suits salt works also suits pines. About 60 nurseries in Kokubunji and Kinashi grow about 80% of Japan’s bonsai pines, some since the early nineteenth century, from the black pines that grow along the Inland Sea shores.",
          "The pilgrimage to 88 temples round Shikoku, which by legend follows the monk Kūkai and has been walked for more than a thousand years, passes through all four prefectures, Kagawa among them. People along the route still offer pilgrims food, drink, small gifts or a bed for the night, and the pilgrimage is open to anyone, whatever their beliefs.",
        ],
        cite: ["jta-r2-01862", "jta-r2-01908", "jta-r2-01920"],
        images: ["takamatsu-henro"],
        status: "fact-checked",
      },
    ],
    hero: "takamatsu-castle",
    panoramas: [],
    places: ["ritsurin-garden"],
    nearby: ["matsuyama", "hiroshima"],
    gaps: [],
    status: "fact-checked",
  },
];

export const places: Place[] = [
  {
    slug: "dogo-onsen-honkan",
    name: "Dōgo Onsen Honkan",
    native: "道後温泉本館",
    kind: "Public bathhouse",
    where: { lat: 33.8521, lng: 132.7864, ref: "OpenStreetMap way 235751036" },
    summary: "The wooden bathhouse of 1894 at a hot spring said to be the oldest in Japan, still a public bath where some local people come almost every day.",
    matters:
      "Dōgo is a working public bath that is also a monument: it was the first public bathhouse ever made an Important Cultural Property, it stayed open through six years of repairs, and some people from the town still come in almost every day.",
    facts: [
      { label: "Hot spring", value: "Said to be the oldest in Japan, with a history of about 3,000 years", cite: ["dogo-honkan"] },
      { label: "The honkan", value: "Rebuilt and completed in 1894", cite: ["dogo-about"] },
      { label: "Important Cultural Property", value: "December 1994, the first public bathhouse to be designated", cite: ["dogo-honkan"] },
      { label: "Repairs", value: "January 2019 to 20 December 2024, open throughout", cite: ["dogo-honkan"] },
    ],
    passages: [
      {
        id: "dogo-legends",
        heading: "An egret and two gods",
        body: [
          "Dōgo has two founding stories. In one, recorded in a collection of local lore completed in 1710, an egret with an injured leg kept coming to soak it in water gushing from the rocks until it healed; the people who saw it began to bathe there too. In the other, from the surviving fragments of the ancient gazetteer of Iyo province, the god Ōkuninushi carried the gravely ill Sukunahikona in the palm of his hand and bathed him in the spring; he recovered at once and danced on a stone to prove it, and the stone, Tama-no-ishi, is still kept beside the bathhouse.",
        ],
        cite: ["dogo-about"],
        images: ["dogo-above"],
        status: "fact-checked",
      },
      {
        id: "dogo-visitors",
        heading: "Princes, empresses and the Tale of Genji",
        body: [
          "Prince Shōtoku visited in 596 and was so taken with the scenery and the water that he had a monument raised on the hill of Yu-no-Oka; the camellias were in bloom, and he likened a hot spring that healed everyone alike to a Buddhist paradise. Empress Saimei and other members of the imperial family came after him. The Tale of Genji mentions “the bathtubs of Iyo”, and in Kyoto the phrase came to mean a great number of anything.",
        ],
        cite: ["dogo-about"],
        status: "fact-checked",
      },
      {
        id: "dogo-1894",
        heading: "Unrivalled in a hundred years",
        body: [
          "By the late nineteenth century the bathhouse had fallen into disrepair. Isaniwa Yukiya, who became the first mayor of Dōgo Yunomachi in 1890, rebuilt it on the principle that it would be worth something only if it were still unrivalled a hundred years on, and the work was finished in 1894. The time drum beaten there has sounded since then and is one of Japan’s 100 Soundscapes, and a white heron stands on the roof of its little turret, the Shinrōkaku.",
        ],
        cite: ["dogo-about", "dogo-honkan"],
        images: ["dogo-entrance", "dogo-shinrokaku"],
        status: "fact-checked",
      },
      {
        id: "dogo-botchan",
        heading: "Botchan’s bath",
        body: [
          "Natsume Sōseki, posted to Matsuyama in 1895, is said to have used a private room on the third floor with the poet Masaoka Shiki that October. The third-floor baths were once called Jōtō, upper class, and his novel Botchan has its hero say, “I always bathed in the Jōtō bath.” The room was named the Botchan-no-ma in 1966 by Sōseki’s son-in-law. Botchan dango, three-coloured rice dumplings, are served at the bathhouse.",
        ],
        cite: ["dogo-honkan", "matsuyama-food"],
        images: ["dogo-window"],
        status: "fact-checked",
      },
      {
        id: "dogo-repairs",
        heading: "Repaired without closing",
        body: [
          "In December 1994 the honkan became the first public bathhouse in Japan designated an Important Cultural Property. To pass it on, conservation repairs began in January 2019 with the baths kept open throughout; the whole building, rest rooms included, reopened on 11 July 2024 for the first time in five and a half years, and the work was finished on 20 December 2024. Local people still come in almost every day.",
        ],
        cite: ["dogo-honkan"],
        images: ["dogo-repairs"],
        status: "fact-checked",
      },
    ],
    hero: "dogo-dusk",
    gallery: ["dogo-entrance", "dogo-street", "dogo-shinrokaku", "dogo-window", "dogo-above", "dogo-repairs", "dogo-night"],
    panoramas: [],
    related: ["ishite-ji", "itsukushima-shrine"],
    gaps: [],
    status: "fact-checked",
  },
  {
    slug: "ishite-ji",
    name: "Ishite-ji",
    native: "石手寺",
    kind: "Buddhist temple",
    where: { lat: 33.8468, lng: 132.7964, ref: "OpenStreetMap node 3152608253" },
    summary: "Temple 51 of the Shikoku pilgrimage, near Dōgo Onsen, entered through a gate of 1318 that is a National Treasure.",
    matters:
      "Ishite-ji is where the Shikoku pilgrimage meets its own origin story: the temple is tied to Emon Saburō, said to be the first pilgrim, and it keeps one of the richest collections of cultural properties on the route, its Niō Gate of 1318 a National Treasure.",
    facts: [
      { label: "Pilgrimage", value: "Temple 51 of 88", cite: ["matsuyama-ishiteji"] },
      { label: "Niō Gate", value: "Built 1318; a National Treasure", cite: ["matsuyama-ishiteji", "qr-ishiteji"] },
      { label: "Bell", value: "Inscribed 1251, the oldest bronze bell in Ehime", cite: ["qr-ishiteji"] },
    ],
    passages: [
      {
        id: "ishite-pilgrimage",
        heading: "Temple 51",
        body: [
          "Shikoku has drawn pilgrims for more than a thousand years. By legend the monk Kūkai, born on the island, walked round it in the ninth century; the earliest records of pilgrims following him date from the twelfth, and the first mentions of 88 sites from the fifteenth. The route as it is walked today took shape in the Edo period, and it passes through all four prefectures.",
          "Ishite-ji is the 51st temple. It is known above all for its ties to Emon Saburō, who is said to have been the first pilgrim of all.",
        ],
        cite: ["jta-r2-01908", "jta-r2-01920", "matsuyama-ishiteji"],
        images: ["ishite-corridor"],
        status: "fact-checked",
      },
      {
        id: "ishite-founding",
        heading: "A founding in legends",
        body: [
          "By legend, in 728 a wealthy man of the province, Ochi Tamasumi, saw 25 bodhisattvas come down from the sky to this spot and built a hall here for the protection of the nation at Emperor Shōmu’s order; the next year the monk Gyōki founded a temple, Anyō-ji, around a figure of the healing Buddha he had carved himself. It took the name Ishite-ji in 892, from the legend of Emon Saburō’s rebirth.",
          "The ground itself may be older still: roof tiles dug up in the precinct suggest a temple stood here around 680, built in a style like Hōryū-ji’s.",
        ],
        cite: ["qr-ishiteji"],
        images: ["ishite-hondo"],
        status: "fact-checked",
      },
      {
        id: "ishite-buildings",
        heading: "A gate of 1318",
        body: [
          "The approach is a covered corridor lined with shops, many selling local products, and the eateries round the temple sell oyaki, grilled rice cakes that are the temple’s speciality. At its end the Niō Gate, built in 1318 and 7 metres high, is a National Treasure. Inside, the main hall, the three-storied pagoda, the bell tower and other buildings are Important Cultural Properties, and the bell, inscribed with a date of 1251, is the oldest bronze bell in Ehime.",
        ],
        cite: ["matsuyama-ishiteji", "qr-ishiteji"],
        images: ["ishite-pagoda", "ishite-grounds"],
        status: "fact-checked",
      },
    ],
    hero: "ishite-niomon",
    gallery: ["ishite-niomon-front", "ishite-corridor", "ishite-hondo", "ishite-pagoda", "ishite-grounds", "ishite-statue", "ishite-daishi"],
    panoramas: [],
    related: ["dogo-onsen-honkan", "horyu-ji"],
    gaps: [],
    status: "fact-checked",
  },
  {
    slug: "ritsurin-garden",
    name: "Ritsurin Garden",
    native: "栗林公園",
    kind: "Stroll garden",
    where: { lat: 34.3295, lng: 134.0439, ref: "OpenStreetMap way 60252671" },
    summary: "The Matsudaira lords’ stroll garden in Takamatsu, begun in 1642, with about 1,400 pines and a mountain borrowed as its backdrop.",
    matters:
      "Ritsurin is one of the best-preserved gardens of the Edo period: a lord’s private garden kept for more than two centuries, opened to everyone in 1875, and designed so that each turn of the path frames a new view, with a real mountain as part of the picture.",
    facts: [
      { label: "Begun", value: "1642", cite: ["jta-r2-01858"] },
      { label: "Opened to the public", value: "1875", cite: ["jta-r2-01858"] },
      { label: "Pines", value: "About 1,400", cite: ["jta-r2-01858", "jta-r2-01860"] },
    ],
    passages: [
      {
        id: "ritsurin-history",
        heading: "A lord’s garden for two centuries",
        body: [
          "The garden was part of the estate of the Matsudaira, lords of the Takamatsu domain, who inherited the site from the Ikoma family, earlier rulers of Sanuki. First built in 1642, it was kept and enjoyed by the Matsudaira for more than 200 years, until the Meiji Restoration of 1868 ended the domains. In 1875 it became a public park. It is now a symbol of Takamatsu, in two parts: the original lords’ South Garden and a North Garden laid out in the Meiji era.",
        ],
        cite: ["jta-r2-01858"],
        images: ["ritsurin-island"],
        status: "fact-checked",
      },
      {
        id: "ritsurin-shakkei",
        heading: "A borrowed mountain",
        body: [
          "It is a stroll garden, the kind high-ranking samurai favoured in the Edo period, built as a sequence of composed views seen one after another along the path, many of them over a pond or a small hill. It also borrows scenery from outside its walls, shakkei: Mount Shiun to the west seems from some angles to tower over the garden.",
          "One such view is from Hiraiho Hill, the garden’s highest point, shaped like Mount Fuji. It looks over the South Pond, the arched Engetsukyō bridge and the teahouse to the mountain behind, sometimes with an old-style pleasure boat crossing the water.",
        ],
        cite: ["jta-r2-01858", "jta-r2-01859"],
        images: ["ritsurin-engetsukyo", "ritsurin-boat"],
        status: "fact-checked",
      },
      {
        id: "ritsurin-kikugetsutei",
        heading: "Kikugetsutei",
        body: [
          "The teahouse Kikugetsutei, used by the lords of Takamatsu, dates from the early 1600s. It is open on all four sides so that it can be entered from any direction, and from its room nearest the South Pond the water seems, at the right angle, to lap right up to the floor, as if the room were floating. Its low ceiling and few walls keep it cool in summer.",
        ],
        cite: ["jta-r2-01859"],
        images: ["ritsurin-kikugetsutei"],
        status: "fact-checked",
      },
      {
        id: "ritsurin-pines",
        heading: "Fourteen hundred pines",
        body: [
          "Pines stand for long life, and the garden has nearly 1,400 of them, about a thousand tended regularly by its gardeners. Several were planted by members of the imperial family, one by Edward VIII of Britain on a visit as crown prince in 1922. Three are famous: the Tsurukamematsu, a black pine trained to look like a crane standing on a turtle, the turtle a mound of more than a hundred stones; the Hakomatsu, a row of pines clipped to read as one long box; and the Neagari Goyōmatsu by the teahouse, about 8 metres tall, which began as a bonsai the shogun Tokugawa Ienari gave the lord of Takamatsu in 1833. The lord had it taken out of its pot and planted in the garden.",
        ],
        cite: ["jta-r2-01860"],
        images: ["ritsurin-pines"],
        status: "fact-checked",
      },
    ],
    hero: "ritsurin-bridge-shiun",
    gallery: ["ritsurin-island", "ritsurin-engetsukyo", "ritsurin-kikugetsutei", "ritsurin-boat", "ritsurin-pines", "ritsurin-south-pond", "ritsurin-autumn"],
    panoramas: [],
    related: ["nijo-castle", "imperial-palace-east-gardens"],
    gaps: [],
    status: "fact-checked",
  },
];
