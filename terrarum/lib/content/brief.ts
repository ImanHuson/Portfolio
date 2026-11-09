/**
 * The brief's country content system (section 6), as data. Every chapter
 * passage says which of these topics it covers (`Passage.covers`); a topic a
 * country has no real content for is listed in the chapter's `notApplicable`
 * with the reason. scripts/audit-content.ts fails a chapter that leaves a
 * topic neither covered nor explained, so nothing is skipped quietly.
 */

export const CHAPTER_TOPICS = {
  land: {
    title: "Land and nature",
    topics: {
      location: "Geographic location",
      divisions: "Regions and administrative divisions",
      mountains: "Mountains and mountain ranges",
      waters: "Rivers and lakes",
      forests: "Forests and natural environments",
      coasts: "Coastlines and islands",
      climate: "Climate and seasons",
      wildlife: "Wildlife and ecosystems",
      protected: "National parks and protected areas",
      geology: "Geological features",
      landscapes: "Rural and urban landscapes",
    },
  },
  history: {
    title: "History",
    topics: {
      ancient: "Ancient civilisations",
      settlement: "Early settlements",
      periods: "Historical periods",
      states: "Empires and kingdoms",
      politics: "Political transformations",
      wars: "Wars and conflicts",
      trade: "Trade routes",
      exchange: "Cultural exchanges",
      colonial: "Colonial history",
      nation: "Independence and nation-building",
      modern: "Modern history",
      today: "Contemporary society",
    },
  },
  belief: {
    title: "Religion and belief",
    topics: {
      traditions: "Major religious traditions",
      local: "Indigenous and local belief systems",
      history: "Religious history",
      philosophy: "Philosophical traditions",
      sacred: "Sacred architecture",
      practice: "Religious practices",
      festivals: "Festivals and ceremonies",
      influence: "Historical influence on society",
      diversity: "Religious diversity",
    },
  },
  food: {
    title: "Food",
    topics: {
      dishes: "Traditional dishes",
      regional: "Regional cuisine and differences",
      street: "Street food",
      ingredients: "Local ingredients",
      history: "Food history",
      techniques: "Preparation techniques",
      customs: "Eating customs",
      festivals: "Festivals and food traditions",
      everyday: "Everyday food culture",
    },
  },
  life: {
    title: "Everyday life and customs",
    topics: {
      greetings: "Greetings and etiquette",
      social: "Social customs",
      family: "Family traditions",
      hospitality: "Hospitality",
      clothing: "Clothing",
      celebrations: "Celebrations and festivals",
      crafts: "Traditional crafts",
      community: "Community practices",
      work: "School and work life",
      transport: "Transportation",
      housing: "Housing",
      shopping: "Markets and shopping",
      urbanRural: "Urban and rural lifestyles",
      trends: "Contemporary cultural trends",
    },
  },
  art: {
    title: "Architecture and art",
    topics: {
      traditional: "Traditional architecture",
      religious: "Religious architecture",
      vernacular: "Vernacular architecture",
      palaces: "Palaces, castles and monuments",
      contemporary: "Contemporary architecture",
      painting: "Painting",
      sculpture: "Sculpture",
      ceramics: "Ceramics",
      textiles: "Textiles",
      calligraphy: "Calligraphy",
      photography: "Photography",
      design: "Design",
      crafts: "Crafts",
      public: "Public art",
    },
  },
  performance: {
    title: "Music, literature and performance",
    topics: {
      traditionalMusic: "Traditional music",
      contemporaryMusic: "Contemporary music",
      instruments: "Musical instruments",
      dance: "Dance",
      theatre: "Theatre",
      literature: "Literature",
      poetry: "Poetry",
      oral: "Oral traditions",
      film: "Film and cinema",
      industries: "Contemporary creative industries",
    },
  },
  language: {
    title: "Language",
    topics: {
      main: "Main languages",
      minority: "Regional and minority languages",
      writing: "Writing systems",
      expressions: "Common expressions",
      pronunciation: "Pronunciation",
      development: "Historical development",
      relationships: "Language relationships",
      diversity: "Linguistic diversity",
    },
  },
} as const;

export type ChapterSlug = keyof typeof CHAPTER_TOPICS;

/** Brief 6B: what every significant city, town or village is researched for. */
export const CITY_TOPICS = {
  geography: "Geography",
  history: "History",
  architecture: "Architecture",
  food: "Local food",
  identity: "Cultural identity",
  life: "Daily life",
  differences: "Regional differences",
} as const;
export type CityTopic = keyof typeof CITY_TOPICS;

/** Which side of a place a photograph shows; a place's gallery must show several. */
export const SIDES = {
  approach: "The way in",
  exterior: "From outside",
  interior: "Inside",
  detail: "Up close",
  grounds: "Grounds and gardens",
  surroundings: "Around it",
  view: "The view from it",
  people: "In use",
  season: "Another season",
  night: "After dark",
  aerial: "From above",
  history: "In the past",
} as const;
export type Side = keyof typeof SIDES;
