/**
 * Country visual identities, kept apart from content and logic. A theme is
 * data: colour tokens (both colour schemes), a display face, an image
 * treatment, a motif and how motion behaves. Pages read `data-theme` and the
 * CSS custom properties written from here; no component branches on country.
 *
 * Only a country with researched content gets a full theme. The others carry
 * an accent for the globe and are marked `draft`: their identity is designed
 * when their research is, from what that research finds, not guessed now.
 */

export type DisplayFace = "atlas" | "mincho" | "bricolage" | "archivo";

export interface Tokens {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  line: string;
  accent: string;
  /** Accent when used as small text (must pass AA on bg). */
  accentText: string;
  /** Text on an accent fill. */
  onAccent: string;
  /** A deep band colour for full-bleed interludes. */
  band: string;
  onBand: string;
}

export interface Theme {
  id: string;
  status: "designed" | "draft";
  /** Why these choices, in a sentence. Shown nowhere; kept for the next designer. */
  rationale: string;
  light: Tokens;
  dark: Tokens;
  display: DisplayFace;
  /** CSS filter applied to documentary photographs in this country. */
  photo: string;
  /** Background texture: a fixed, non-scrolling layer. */
  motif: "none" | "washi" | "tide" | "grid";
  /** How native names are set: vertically (Japanese), inline in their own
   * direction (Thaana, right to left), or as a stack of several languages. */
  native: "vertical" | "inline" | "stack";
  /** How a place's photographs are laid out: a hand-scroll strip read right
   * to left like an emakimono, or the shared masonry wall. */
  gallery: "emaki" | "wall";
  /** Section headings' accent: a brush stroke drawn under them, or none. */
  heading: "brush" | "plain";
  /** Hero composition for the country page. */
  hero: "print-left-vertical-name" | "default";
  motion: { enter: "rise" | "ink"; durationMs: number };
  /** Accent used for this country's marker on the globe. */
  globe: string;
}

const ATLAS_DARK: Tokens = {
  bg: "#0d1014",
  surface: "#151a20",
  ink: "#e8e4dc",
  muted: "#9aa1a8",
  line: "#2a313a",
  accent: "#e2b45a",
  accentText: "#e2b45a",
  onAccent: "#14110b",
  band: "#11161c",
  onBand: "#e8e4dc",
};

/** The platform itself: a night-side atlas. The globe reads best on dark. */
export const ATLAS: Theme = {
  id: "atlas",
  status: "designed",
  rationale: "Night-side globe and lamplight amber; neutral so each country's own palette reads as arriving somewhere.",
  light: ATLAS_DARK,
  dark: ATLAS_DARK,
  display: "atlas",
  photo: "none",
  motif: "none",
  native: "inline",
  gallery: "wall",
  heading: "plain",
  hero: "default",
  motion: { enter: "rise", durationMs: 520 },
  globe: "#e2b45a",
};

export const THEMES: Record<string, Theme> = {
  japan: {
    id: "japan",
    status: "designed",
    rationale:
      "Washi-toned ground, sumi-indigo ink and shu vermilion (the lacquer red of shrine gates, which Fushimi Inari's own site explains as mercury-and-earth pigment). Mincho display type, the Japanese book face descended from Ming woodblock lettering. Place names set vertically, as they are on signs and in print. Photos slightly cooled and held back; the Edo woodblock prints carry the colour. Galleries unroll as a hand-scroll (emakimono), read right to left; section rules are seigaiha, the overlapping-wave pattern; headings take a short vermilion brush stroke drawn in as they come into view; pages arrive the way ink soaks into paper.",
    light: {
      bg: "#f1ede4",
      surface: "#e8e2d5",
      ink: "#1c2333",
      muted: "#555c6b",
      line: "#cfc7b6",
      accent: "#c23b2a",
      accentText: "#a8301f",
      onAccent: "#fbf7ef",
      band: "#1d2a4a",
      onBand: "#efe9dc",
    },
    dark: {
      bg: "#11151f",
      surface: "#181e2b",
      ink: "#ebe5d8",
      muted: "#a3a8b4",
      line: "#2c3446",
      accent: "#e0573f",
      accentText: "#ef7a63",
      onAccent: "#140c09",
      band: "#1b2747",
      onBand: "#efe9dc",
    },
    display: "mincho",
    photo: "saturate(0.92) contrast(1.03)",
    motif: "washi",
    native: "vertical",
    gallery: "emaki",
    heading: "brush",
    hero: "print-left-vertical-name",
    motion: { enter: "ink", durationMs: 620 },
    globe: "#e0573f",
  },
  maldives: {
    id: "maldives",
    status: "designed",
    rationale:
      "Lagoon-white ground and reef-deep ink, with a coral accent: the islands are built of coral, and so is Malé's Friday Mosque. The native name is set in Thaana, right to left, as the Library of Congress study describes the script. A rounded, open grotesque (Bricolage) for display, nothing like Japan's book face. Faint horizontal tide lines instead of paper grain; photographs left bright and clear.",
    light: {
      bg: "#eef4f3",
      surface: "#e1ecea",
      ink: "#0d2a33",
      muted: "#47606a",
      line: "#c3d6d4",
      accent: "#b8452f",
      accentText: "#a83d28",
      onAccent: "#fff8f2",
      band: "#0b3c4c",
      onBand: "#e9f4f2",
    },
    dark: {
      bg: "#081d24",
      surface: "#0e2a33",
      ink: "#e3f0ee",
      muted: "#9db6bc",
      line: "#1f4450",
      accent: "#ef7458",
      accentText: "#f2896f",
      onAccent: "#1a0904",
      band: "#0b3c4c",
      onBand: "#e9f4f2",
    },
    display: "bricolage",
    photo: "saturate(1.04)",
    motif: "tide",
    native: "inline",
    gallery: "wall",
    heading: "plain",
    hero: "default",
    motion: { enter: "rise", durationMs: 560 },
    globe: "#3fb6b0",
  },
  switzerland: {
    id: "switzerland",
    status: "designed",
    rationale:
      "Swiss Style typography (the International Typographic Style grew up in Basel and Zurich): a tight grotesque (Archivo), flush-left text on a visible grid, near-white ground, black ink and the federal red as the one accent. The four official names are stacked, because the constitution gives the country four national languages. Photographs kept crisp and neutral.",
    light: {
      bg: "#f5f5f3",
      surface: "#ebebe8",
      ink: "#141414",
      muted: "#555553",
      line: "#d2d2ce",
      accent: "#d52b1e",
      accentText: "#b8231a",
      onAccent: "#ffffff",
      band: "#1d2a33",
      onBand: "#f1f1ee",
    },
    dark: {
      bg: "#121314",
      surface: "#1b1d1f",
      ink: "#ededea",
      muted: "#a4a6a8",
      line: "#2e3134",
      accent: "#d52b1e",
      accentText: "#f2685c",
      onAccent: "#ffffff",
      band: "#1d2a33",
      onBand: "#f1f1ee",
    },
    display: "archivo",
    photo: "contrast(1.02)",
    motif: "grid",
    native: "stack",
    gallery: "wall",
    heading: "plain",
    hero: "default",
    motion: { enter: "rise", durationMs: 420 },
    globe: "#e8473b",
  },
};

/** Globe accents for countries whose theme is not designed yet. */
const DRAFT_ACCENTS: Record<string, string> = {
  "saudi-arabia": "#c9a76b",
  china: "#c8514a",
  indonesia: "#d08a4a",
  france: "#8aa0c8",
  spain: "#d2774e",
  italy: "#c69b7b",
  "united-states": "#a4b07c",
  turkiye: "#5d8fc9",
};

export function themeFor(slug: string): Theme | undefined {
  return THEMES[slug];
}

export function globeAccent(slug: string): string {
  return THEMES[slug]?.globe ?? DRAFT_ACCENTS[slug] ?? ATLAS.globe;
}

function vars(t: Tokens, prefix: string) {
  return Object.fromEntries(Object.entries(t).map(([k, v]) => [`--${prefix}-${k}`, v]));
}

/** Inline style for a themed wrapper: both schemes as variables, CSS picks one. */
export function themeStyle(theme: Theme): React.CSSProperties {
  return {
    ...vars(theme.light, "l"),
    ...vars(theme.dark, "d"),
    "--photo-filter": theme.photo,
    "--enter-ms": `${theme.motion.durationMs}ms`,
  } as React.CSSProperties;
}
