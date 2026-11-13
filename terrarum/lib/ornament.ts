/**
 * Japan's ornaments: paintings and prints from the Cleveland Museum of Art's
 * open collection (CC0), cut from their paper by scripts/media/ink.py. They
 * are decoration taken from real Japanese art, never from invented motifs,
 * and every one is credited on /sources/.
 */
export interface Artwork {
  title: string;
  artist: string;
  date: string;
  medium: string;
  url: string;
  license: "CC0 1.0";
}

const SEKKA = "Kamisaka Sekka (1866–1942)";
const MOMO = "Flowers of a Hundred Worlds (Momoyogusa)";

export const ARTWORKS: Record<string, Artwork> = {
  willowCherry: { title: `${MOMO}: Willow and Cherry`, artist: SEKKA, date: "1909–10", medium: "colour woodblock print with gold and silver", url: "https://clevelandart.org/art/1988.23.2.2", license: "CC0 1.0" },
  morningGlories: { title: `${MOMO}: Morning Glories`, artist: SEKKA, date: "1909–10", medium: "colour woodblock print with gold and silver", url: "https://clevelandart.org/art/1988.23.1.15", license: "CC0 1.0" },
  lateAutumn: { title: `${MOMO}: Late Autumn`, artist: SEKKA, date: "1909–10", medium: "colour woodblock print with gold and silver", url: "https://clevelandart.org/art/1988.23.3.17", license: "CC0 1.0" },
  plum: { title: `${MOMO}: Plum`, artist: SEKKA, date: "1909–10", medium: "colour woodblock print with gold and silver", url: "https://clevelandart.org/art/1988.23.2.6", license: "CC0 1.0" },
  takao: { title: "Autumn in Takao", artist: "Kiyohara Yukinobu (1643–1682)", date: "late 1600s", medium: "hanging scroll, ink and colour on silk", url: "https://clevelandart.org/art/1991.55", license: "CC0 1.0" },
  korinPlum: { title: "Plum Tree", artist: "Ogata Kōrin (1658–1716)", date: "c. 1700", medium: "hanging scroll, ink on silk", url: "https://clevelandart.org/art/1983.10", license: "CC0 1.0" },
};

export type Season = "spring" | "summer" | "autumn" | "winter";

export interface SeasonLook {
  ja: string;
  en: string;
  /** What the season is known for, shown beside its plate. */
  sign: string;
  /** The cut-out branch (public/media/ink/<season>.webp) and its source. */
  branch: { file: string; from: keyof typeof ARTWORKS; alt: string };
  /** The full plate (public/media/ink/<season>-plate.webp) and its source. */
  plate: { file: string; from: keyof typeof ARTWORKS; alt: string };
}

export const SEASONS: Record<Season, SeasonLook> = {
  spring: {
    ja: "春",
    en: "Spring",
    sign: "cherry blossom",
    branch: { file: "/media/ink/spring.webp", from: "willowCherry", alt: "Cherry boughs in flower among willow fronds" },
    plate: { file: "/media/ink/spring-plate.webp", from: "willowCherry", alt: "Kamisaka Sekka's print of a willow hanging over a cherry in flower" },
  },
  summer: {
    ja: "夏",
    en: "Summer",
    sign: "morning glories",
    branch: { file: "/media/ink/summer.webp", from: "morningGlories", alt: "Blue morning glories climbing between bamboo poles" },
    plate: { file: "/media/ink/summer-plate.webp", from: "morningGlories", alt: "Kamisaka Sekka's print of morning glories on a bamboo fence" },
  },
  autumn: {
    ja: "秋",
    en: "Autumn",
    sign: "red maple leaves",
    branch: { file: "/media/ink/autumn.webp", from: "takao", alt: "A red maple branch with a poem slip hung on it" },
    plate: { file: "/media/ink/autumn-plate.webp", from: "lateAutumn", alt: "Kamisaka Sekka's print of red maples and fallen leaves by a stream" },
  },
  winter: {
    ja: "冬",
    en: "Winter",
    sign: "plum blossom",
    branch: { file: "/media/ink/winter.webp", from: "korinPlum", alt: "An ink-painted plum branch in flower, drawn in pale ink" },
    plate: { file: "/media/ink/winter-plate.webp", from: "plum", alt: "Kamisaka Sekka's print of a dark plum trunk with white blossoms" },
  },
};

/** The season in a place right now, from the month in that place's time zone. */
export function seasonOf(date: Date, timeZone: string): Season {
  const m = Number(new Intl.DateTimeFormat("en-GB", { month: "numeric", timeZone }).format(date));
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "autumn";
  return "winter";
}

/** The year-round signature: yozakura, cherry at night. */
export const SIGNATURE = { file: "/media/ink/yozakura.webp", from: "willowCherry" as const };

/** The cloth of a real scroll mounting, used to mount photographs. */
export const MOUNT = { brocade: "/media/ink/brocade.webp", side: "/media/ink/brocade-side.webp", ichimonji: "/media/ink/ichimonji.webp", from: "takao" as const };
