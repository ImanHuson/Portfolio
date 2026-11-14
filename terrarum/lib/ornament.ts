/**
 * Japan's ornaments: the cloth of a real scroll mounting from the Cleveland
 * Museum of Art's open collection (CC0), cut by scripts/media/ink.py, and the
 * season names. Decoration is taken from real Japanese art, never invented
 * motifs, and credited on /sources/. (Sekka's seasonal prints and cut-out
 * branches were tried and removed, Nov 2026: they looked pasted on.)
 */
export interface Artwork {
  title: string;
  artist: string;
  date: string;
  medium: string;
  url: string;
  license: "CC0 1.0";
}

export const ARTWORKS: Record<string, Artwork> = {
  takao: { title: "Autumn in Takao", artist: "Kiyohara Yukinobu (1643–1682)", date: "late 1600s", medium: "hanging scroll, ink and colour on silk (its mounting cloth dresses the gallery)", url: "https://clevelandart.org/art/1991.55", license: "CC0 1.0" },
};

export type Season = "spring" | "summer" | "autumn" | "winter";

export interface SeasonLook {
  ja: string;
  en: string;
  /** What the season is known for. */
  sign: string;
}

export const SEASONS: Record<Season, SeasonLook> = {
  spring: {
    ja: "春",
    en: "Spring",
    sign: "cherry blossom",
  },
  summer: {
    ja: "夏",
    en: "Summer",
    sign: "morning glories",
  },
  autumn: {
    ja: "秋",
    en: "Autumn",
    sign: "red maple leaves",
  },
  winter: {
    ja: "冬",
    en: "Winter",
    sign: "plum blossom",
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

/** The cloth of a real scroll mounting, used to mount photographs. */
export const MOUNT = { brocade: "/media/ink/brocade.webp", side: "/media/ink/brocade-side.webp", ichimonji: "/media/ink/ichimonji.webp", from: "takao" as const };
