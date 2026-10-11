// Every image behind the archive's sections and scroll scenes is the
// archive's own AI-generated painting, made by scripts/gen/generate.py on
// Cloudflare Workers AI inside its free daily allowance (FLUX.1 schnell for
// section grounds, Leonardo Phoenix for the scenes), upscaled and graded
// locally. One art direction for all of them; none copies a frame, a
// character's likeness or the series' emblems. They replaced anime frames.

export const GEN_CREDIT = "The archive's AI-generated painting";
const SCHNELL = "FLUX.1 schnell";
const PHOENIX = "Leonardo Phoenix";

const g = (name: string, what: string) => ({
  src: `/images/gen/${name}.webp`,
  credit: `${what}. ${GEN_CREDIT} (${SCHNELL})`,
});

export const BG = {
  shiganshina845: g("shiganshina845", "Steam over the Wall above the district"),
  shiganshina: g("shiganshina", "A district inside the Wall, from above"),
  wallTop: g("wallTop", "On top of the Wall"),
  trostAerial: g("trostAerial", "A city of the Walls, from above"),
  refugees: g("refugees", "Refugees at the inner gate"),
  titansField: g("titansField", "Titans in the fog"),
  colossalBreach: g("colossalBreach", "The gate broken in"),
  ymirDevil: g("ymirDevil", "The tree in the forest"),
  scoutsRide: g("scoutsRide", "The Survey Corps riding out"),
  surveyCorps: g("surveyCorps", "Soldiers on the Wall at dawn"),
  wings: g("wings", "Flight among the giant trees"),
  basementRoom: g("basementRoom", "The cellar by lamplight"),
  basementSearch: g("basementSearch", "The cellar searched"),
  threeBooks: g("threeBooks", "Three books"),
  grishaKey: g("grishaKey", "The key"),
  keyDoor: g("keyDoor", "The cellar door"),
  leviDoor: g("leviDoor", "The door broken in"),
  ocean: g("ocean", "The sea"),
  liberioCity: g("liberioCity", "A Marleyan city at night"),
  marleyMap: g("marleyMap", "A sea chart"),
  oldMap: g("oldMap", "A cartographer's desk"),
  trostFormation: g("trostFormation", "Cannon on the Wall above a burning city"),
  scoutsShiganshina: g("scoutsShiganshina", "Riders above the ruined district"),
  odmFlight: g("odmFlight", "Flight over the rooftops"),
  aftermath: g("aftermath", "After the battle"),
  odmCase: g("odmCase", "The armoury bench"),
  stohess: g("stohess", "A city of the interior, broken"),
  wallTown: g("wallTown", "The hill and the tree"),
  wallSea: g("wallSea", "The Wall coming apart"),
  titansBegin: g("titansBegin", "The Walls' Titans waking"),
  titansMarch: g("titansMarch", "The march"),
  rumblingMarley: g("rumblingMarley", "The march through a city"),
  titansMarching: g("titansMarching", "The march by night"),
  wallTitan: g("wallTitan", "A face in the Wall"),
  pathsStars: g("pathsStars", "The tree of light"),
  ymirMolding: g("ymirMolding", "Shaping them out of sand"),
  grave: g("grave", "A grave under the tree"),
  threeSea: g("threeSea", "Three at the sea"),
} as const;

/** The scenes' paintings, with depth maps for parallax. Each arrives on the
 * day the free allowance makes it; until it is in READY its scene uses the
 * section painting named in `fallback` (flat). */
const h = (name: string, what: string, fallback: keyof typeof BG) => ({
  src: `/images/gen/hero-${name}.webp`,
  depth: `/images/gen/hero-${name}-depth.webp`,
  credit: `${what}. ${GEN_CREDIT} (${PHOENIX})`,
  fallback,
});

const READY = new Set<string>([]);

const HERO_LIST = {
  city: h("city", "The Wall from above", "shiganshina"),
  rampart: h("rampart", "On the Wall, lightning on the plain", "wallTop"),
  colossal: h("colossal", "Over the Wall, in the steam", "shiganshina845"),
  stair: h("stair", "The cellar stair", "keyDoor"),
  study: h("study", "The study under the house", "basementRoom"),
  sea: h("sea", "Steam on the horizon", "ocean"),
  march: h("march", "The line on the march", "titansMarch"),
  clouds: h("clouds", "Over the clouds", "rumblingMarley"),
  desert: h("desert", "The desert under the stars", "pathsStars"),
};

/** whether a scene's own painting has been made yet */
export const heroReady = (k: keyof typeof HERO_LIST) => READY.has(k);

export type Scene = { src: string; depth?: string; credit: string };

/** a scene's painting: the depth-mapped hero once it exists, else its flat fallback */
export const HERO = Object.fromEntries(
  Object.entries(HERO_LIST).map(([k, v]) => [k, READY.has(k) ? { src: v.src, depth: v.depth, credit: v.credit } : BG[v.fallback]]),
) as Record<keyof typeof HERO_LIST, Scene>;

/** The user's own frame and painting. */
export const FRAMES = {
  colossal: "/images/bg/colossal-wall.webp",
  paths: "/images/bg/paths.webp",
};
