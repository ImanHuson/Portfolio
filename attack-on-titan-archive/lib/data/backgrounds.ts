// Every image behind the archive's sections and scroll scenes. CC0 (public
// domain) images from the Cleveland Museum of Art's Open Access collection,
// plus two anime frames the user supplied; graded by scripts/bg/sourced.py.
// CC0 asks for no credit; the archive gives one anyway, under each section.

const b = (name: string, credit: string) => ({ src: `/images/bg/${name}.webp`, credit });

export const BG = {
  soldiers: b("soldiers", "Winslow Homer, A Bivouac Fire on the Potomac, 1861"),
  titans: b("titans", "Agostino Veneziano, Skeletons, 1518"),
  liberio: b("liberio", "Frank Meadow Sutcliffe, Harbor Scene, c. 1880"),
  forest: b("forest", "Constant Alexandre Famin, The Forest of Fontainebleau, c. 1874"),
  memorial: b("memorial", "George N. Barnard, Battlefield of New Hope Church, Georgia, 1865–66"),
  archive: b("archive", "Giovanni Battista Nolli, La Pianta Grande di Roma, 1748 (in negative)"),
  city: b("city", "Jacopo de' Barbari, View of Venice, 1500"),
  cityInk: b("city-ink", "Jacopo de' Barbari, View of Venice, 1500 (in negative)"),
  rampart: b("rampart", "Samuel Bourne, Delhi, the Kashmir Gate, 1863–70"),
  townGate: b("town-gate", "Wenceslaus Hollar, Moated Town Gate, 1676 (in negative)"),
  burning: b("burning", "J. M. W. Turner, The Burning of the Houses of Lords and Commons, 1835"),
  fort: b("fort", "Photoglob Co., Agra. The Fort, 1890"),
  colossi: b("colossi", "Antonio Beato, The Colossi of Memnon, Thebes, c. 1860s"),
  colossiPair: b("colossi-pair", "Henri Béchard, Thebes, The Colossi of Memnon, 1870s"),
  sea: b("sea", "Winslow Homer, Early Morning After a Storm at Sea, 1900–03"),
  prisonStair: b("prison-stair", "Giovanni Battista Piranesi, The Prisons, plate XII, 1745–50"),
  prisonPlatform: b("prison-platform", "Giovanni Battista Piranesi, The Prisons, plate X, 1749–50"),
  siegeRight: b("siege-right", "Albrecht Dürer, Siege of a Fortress, 1527 (in negative)"),
  siegeLeft: b("siege-left", "Albrecht Dürer, Siege of a Fortress, 1527 (in negative)"),
  dunesNight: b("dunes-night", "Timothy H. O'Sullivan, Sand Dunes, Carson Desert, Nevada, 1867 (printed as night)"),
  dunes: b("dunes", "Timothy H. O'Sullivan, Sand Dunes, Carson Desert, Nevada, 1867"),
  simoom: b("simoom", "Louis Haghe after David Roberts, Approach of the Simoon, 1849 (detail)"),
  stillLife: b("still-life", "William Michael Harnett, Memento Mori, “To This Favour”, 1879"),
  candle: b("candle", "Anna Dorothea Therbusch, A Scientist Seated at a Desk by Candlelight, 1755"),
} as const;

export const BG_SOURCE = "Cleveland Museum of Art, Open Access (CC0)";

/** The user's frames: shown in scenes, credited like the portraits. */
export const FRAME_CREDIT = "Attack on Titan (anime), © Hajime Isayama, Kodansha / Attack on Titan Production Committee";
export const FRAMES = {
  colossal: "/images/bg/colossal-wall.webp",
  founding: "/images/bg/rumbling-founding.webp",
  foundingHaze: "/images/bg/rumbling-founding-haze.webp",
};
