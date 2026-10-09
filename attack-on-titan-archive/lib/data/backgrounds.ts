// Every image behind the archive's sections and scroll scenes: frames from
// the Attack on Titan anime, taken from the Attack on Titan Wiki's file pages
// and graded by scripts/bg/sourced.py (same fair-use call as the portraits and
// Titan plates). Each section names its frame; the rights line is FRAME_CREDIT.

export const FRAME_CREDIT = "Attack on Titan (anime), © Hajime Isayama, Kodansha / Attack on Titan Production Committee";

const f = (name: string, scene: string) => ({ src: `/images/bg/aot-${name}.webp`, credit: `${scene}. ${FRAME_CREDIT}` });

export const BG = {
  shiganshina845: f("shiganshina-845", "Colossal Titan looming over Shiganshina"),
  shiganshina: f("shiganshina", "Shiganshina in anime"),
  wallTop: f("wall-top", "Return to Shiganshina District"),
  trostAerial: f("trost-aerial", "Trost anime"),
  refugees: f("refugees", "Refugees evacuating to Wall Sina"),
  titansField: f("titans-field", "Titans appear inside Wall Rose"),
  colossalBreach: f("colossal-breach", "The Colossal Titan appears to breach the Wall"),
  ymirDevil: f("ymir-devil", "Ymir Fritz and the Devil of All Earth"),
  scoutsRide: f("scouts-ride", "Scout Regiment rides to rescue Eren"),
  surveyCorps: f("survey-corps", "New Survey Corps members"),
  wings: f("wings", "Reclaiming Wall Maria"),
  basementRoom: f("basement-room", "Anime basement"),
  basementSearch: f("basement-search", "Eren searching the basement"),
  threeBooks: f("three-books", "The three books in the basement"),
  grishaKey: f("grisha-key", "Grisha key"),
  keyDoor: f("key-door", "Eren uses the basement's key"),
  leviDoor: f("levi-door", "Levi kicks the door open"),
  ocean: f("ocean", "Season 3 fourth key visual (landscape)"),
  liberioCity: f("liberio-city", "Liberio City"),
  marleyMap: f("marley-map", "Marley territory flipped vertically"),
  oldMap: f("old-map", "Marley territory (Anime)"),
  trostFormation: f("trost-formation", "The Garrison's formation during the battle of Trost"),
  scoutsShiganshina: f("scouts-shiganshina", "The Scouts reach Shiganshina"),
  odmFlight: f("odm-flight", "Eren masters using ODM gear"),
  aftermath: f("aftermath", "The devastating results of the operation to retake Wall Maria"),
  odmCase: f("odm-case", "Omni-directional mobility gear"),
  stohess: f("stohess", "Stohess anime"),
  wallTown: f("wall-town", "Eren and Armin talk to each other through the Paths"),
  wallSea: f("wall-sea", "The Wall Titans' path"),
  titansBegin: f("titans-begin", "The Wall Titans begin to march"),
  titansMarch: f("titans-march", "The Wall Titans march"),
  rumblingMarley: f("rumbling-marley", "The Rumbling arrives in Marley"),
  titansMarching: f("titans-marching", "The Wall Titans marching"),
  wallTitan: f("wall-titan", "A Wall Titan is uncovered"),
  pathsStars: f("paths-stars", "Paths (Anime)"),
  ymirMolding: f("ymir-molding", "Ymir molding the Wall Titans"),
  grave: f("grave", "Mikasa sits by Eren's grave"),
  threeSea: f("three-sea", "Eren, Armin, and Mikasa at the sea"),
} as const;

/** The user's own frames and painting. */
export const FRAMES = {
  colossal: "/images/bg/colossal-wall.webp",
  paths: "/images/bg/paths.webp",
};
