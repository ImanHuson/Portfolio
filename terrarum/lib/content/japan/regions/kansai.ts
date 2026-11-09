import type { City, Place, Region } from "../../types";

/** Kansai: Kyoto, Nara, Osaka, Himeji and Kōyasan. */

export const region: Region = 
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
  };

export const cities: City[] = [
  {
    slug: "kyoto",
    kind: "city",
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
    panoramas: [],
    places: ["nishiki-market", "kiyomizu-dera", "fushimi-inari-taisha", "kinkaku-ji"],
    nearby: [],
    gaps: [
      { topic: "Neighbourhoods and everyday life", why: "Gion, the machiya townhouses and the Kamo River are not yet researched." },
      { topic: "Fourteen of the seventeen World Heritage monuments", why: "Only Kiyomizu-dera has a page." },
    ],
    status: "fact-checked",
  },
];


export const places: Place[] = [
  {
    slug: "kinkaku-ji",
    name: "Kinkaku-ji",
    native: "金閣寺",
    kind: "Zen temple",
    where: { lat: 35.0395, lng: 135.7295, ref: "OpenStreetMap way 98115917" },
    summary: "A shogun’s retirement villa turned Zen temple, its pavilion covered in gold leaf above a garden pond in Kyoto’s northwest.",
    matters:
      "The Golden Pavilion is what is left of the palace from which Ashikaga Yoshimitsu ran Japan at the height of his power, and its three storeys stack three ways of building on top of one another. It burned in 1950 and was rebuilt to the same design, which is part of its story too.",
    facts: [
      { label: "Official name", value: "Rokuon-ji (鹿苑寺), after Yoshimitsu’s posthumous name", cite: ["kinkaku-about"] },
      { label: "Belongs to", value: "The Shōkoku-ji branch of Rinzai Zen", cite: ["kinkaku-about", "jpsearch-kinkaku"] },
      { label: "Grounds", value: "About 132,000 m², of which the garden takes 92,400 m²", cite: ["kinkaku-guide"] },
      { label: "Protected as", value: "Special Historic Site and Special Scenic Spot (the garden); World Heritage since 1994", cite: ["jpsearch-kinkaku", "kinkaku-about"] },
      { label: "Getting round", value: "Wheelchair-accessible as far as the pavilion; steps after it", cite: ["kinkaku-faq"] },
    ],
    passages: [
      {
        id: "kinkaku-villa",
        heading: "A shogun’s villa first",
        body: [
          "In the 1220s the court noble Saionji Kintsune built a villa and clan temple here, at the foot of the Kitayama hills. It fell into ruin after the Kamakura government collapsed, and in 1397 the third Ashikaga shogun, Yoshimitsu, took the site over and rebuilt it as his Kitayama palace.",
          "Yoshimitsu had handed the title of shogun to his nine-year-old son in 1394 and taken Buddhist orders the next year, but he kept power. He moved the business of government to Kitayama, received envoys of the Ming emperor there and built up a large collection of Chinese works of art, the start of what is called Kitayama culture. In 1408 Emperor Go-Komatsu came on a state visit. Yoshimitsu died that year, and his son turned the palace into a Zen temple, as his father had asked.",
        ],
        cite: ["kinkaku-about", "jpsearch-kinkaku"],
        images: ["kinkaku-yoshimitsu"],
        status: "fact-checked",
      },
      {
        id: "kinkaku-three-storeys",
        heading: "Three storeys, three ways of building",
        body: [
          "The pavilion is a relic hall, built to keep relics of the Buddha. Each floor is in a different style. The ground floor, Hōsui-in, follows shinden-zukuri, the palace architecture of the Heian court. The middle floor, Chōon-dō, is in the style of a samurai house of the Kamakura period. The top floor, Kukkyō-chō, is built like a Chinese Zen temple.",
          "The upper two floors are lacquered and covered in pure gold leaf; the roof is laid with thin shingles of sawara cypress and topped by a phoenix. In Yoshimitsu’s day the ground floor held a statue of the Buddha with two attendants, the middle floor an image of Kannon, and the top floor the relics.",
        ],
        cite: ["kinkaku-guide", "kinkaku-about"],
        images: ["kinkaku-gilded"],
        status: "fact-checked",
      },
      {
        id: "kinkaku-fire",
        heading: "Burned in 1950, built again in 1955",
        body: [
          "Most of the palace buildings were lost in the Ōnin War of 1467 to 1477, but the pavilion survived, and between 1904 and 1906 it was taken apart and repaired. In 1950 a student monk of the temple set it on fire. The building burned to the ground, and a statue of Yoshimitsu inside it, a National Treasure, was lost with it. The phoenix had already been taken down and survives.",
          "The pavilion was rebuilt to the same design in 1955, working from the records of the Meiji-period repair, and in 1987 the lacquer and gold leaf were renewed and the ceiling painting and a statue of Yoshimitsu restored. Yukio Mishima drew on the arson for his novel The Temple of the Golden Pavilion.",
        ],
        cite: ["jpsearch-kinkaku", "kyotodesign-kinkaku", "kinkaku-guide"],
        status: "fact-checked",
      },
      {
        id: "kinkaku-garden",
        heading: "The garden around the mirror pond",
        body: [
          "Kyōko-chi, the mirror pond, covers about 6,600 m² and holds islands of different sizes and named stones. Uphill, water drops 2.3 metres over Ryūmon Falls onto a stone set at an angle, a carp climbing the falls in the Chinese story of the carp that became a dragon.",
          "Higher still is Sekka-tei, a small teahouse made in the Edo period, when the declining pavilion and its garden were being restored, at the request of the tea master Kanamori Sōwa for Emperor Go-Mizunoo. Its name refers to the setting sun over the pavilion, which is at its best from here. The hall of Fudō-dō keeps a stone statue of Fudō Myōō that is shown only at Setsubun and on 16 August.",
        ],
        cite: ["kinkaku-guide"],
        status: "fact-checked",
      },
    ],
    hero: "kinkaku-pond",
    gallery: ["kinkaku-path", "kinkaku-pines", "kinkaku-hojo-doors", "kinkaku-gravel", "kinkaku-sekkatei", "kinkaku-ema", "kinkaku-fudodo", "kinkaku-snow", "kinkaku-autumn"],
    panoramas: [],
    tour: { url: "https://www.shokoku-ji.jp/vr/kinkakuji/", label: "Walk the grounds in the temple’s own 360° tour", by: "Shōkoku-ji" },
    related: ["ryoan-ji", "arashiyama"],
    gaps: [],
    status: "fact-checked",
  },
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
    panoramas: [],
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
      { topic: "The Otowa waterfall today and the temple’s annual rites", why: "Not yet researched." },
    ],
    status: "fact-checked",
  },
];
