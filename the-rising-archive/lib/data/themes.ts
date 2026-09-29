// The thematic matrix and the Circles (brief sections 53 and 54). Both are
// this archive's editorial reading, not canon, and the UI says so. The
// brief called the groupings "Constellations"; that name already belongs
// to the relationship map, so here they are Circles.
//
// A membership that would hint at a later event (who sacrifices what) is
// sealed at the book that shows it.

export const THEMES = ["Will", "Honor", "Loyalty", "Power", "Freedom", "Identity", "Family", "Revolution", "Tradition", "Survival", "Ideology", "Sacrifice"] as const;
export type Theme = (typeof THEMES)[number];

type Member = string | { slug: string; book: number };

export const MATRIX: Record<Theme, Member[]> = {
  Will: ["darrow", "virginia", "sevro", "victra", "lyria", "apollonius", "the-jackal"],
  Honor: ["cassius", "diomedes", "lorn", "romulus", "ragnar", "kavax"],
  Loyalty: ["sevro", "victra", "ragnar", "kavax", "volga", "orion", "ephraim"],
  Power: ["virginia", "the-jackal", "lysander", "atlas", "romulus", "apollonius"],
  Freedom: ["darrow", "ragnar", "lyria", "volga", "fitchner", "sevro"],
  Identity: ["victra", "lyria", "volga", "darrow", "lysander", "pax"],
  Family: ["kavax", "pax", "virginia", "romulus", "fitchner", "volga", "victra", "sevro"],
  Revolution: ["darrow", "fitchner", "sevro", "lyria", "orion"],
  Tradition: ["lorn", "romulus", "diomedes", "cassius", "lysander"],
  Survival: ["lyria", "ephraim", "volga", "victra"],
  Ideology: ["lysander", "romulus", "darrow", "the-jackal", "atlas", "diomedes"],
  Sacrifice: [
    { slug: "darrow", book: 1 },
    { slug: "fitchner", book: 2 },
    { slug: "ragnar", book: 3 },
    { slug: "cassius", book: 6 },
  ],
};

export const memberSlug = (m: Member) => (typeof m === "string" ? m : m.slug);
export const memberBook = (m: Member) => (typeof m === "string" ? 0 : m.book);

/** The themes a person carries at this clearance. */
export function themesOf(slug: string, clearance: number): Theme[] {
  return THEMES.filter((t) => MATRIX[t].some((m) => memberSlug(m) === slug && memberBook(m) <= clearance));
}

export type Circle = { name: string; theme: string; members: string[]; note: string };

export const CIRCLES: Circle[] = [
  { name: "The Reapers", theme: "Rebellion · Sacrifice · Strength", members: ["darrow", "sevro", "fitchner", "ragnar", "lorn"], note: "The people who made the Reaper, and the ones who fought beside him." },
  { name: "The Sovereigns", theme: "Power · Governance · Ideology", members: ["virginia", "lysander", "the-jackal", "romulus", "atlas"], note: "Rulers and would-be rulers. Not all of them wear a crown; all of them want to decide what order is." },
  { name: "The Knights", theme: "Honor · Discipline · Tradition", members: ["cassius", "diomedes", "lorn"], note: "The code of the blade, and what it costs to keep it." },
  { name: "The Survivors", theme: "Trauma · Identity · Survival", members: ["lyria", "volga", "ephraim", "victra"], note: "The people who inherit the war, and carry it." },
  { name: "The Wildcards", theme: "Unpredictability · Potential · Individuality", members: ["apollonius", "kavax", "orion", "pax"], note: "The ones nobody could quite predict." },
];
