// Section backgrounds from the Cleveland Museum of Art's Open Access
// collection (CC0, public domain), graded by scripts/bg/sourced.py. CC0 asks
// for no credit; the archive gives one anyway, under each section.

export const BG = {
  soldiers: { src: "/images/bg/soldiers.webp", credit: "Winslow Homer, A Bivouac Fire on the Potomac, 1861" },
  titans: { src: "/images/bg/titans.webp", credit: "Agostino Veneziano, Skeletons, 1518" },
  liberio: { src: "/images/bg/liberio.webp", credit: "Frank Meadow Sutcliffe, Harbor Scene, c. 1880" },
  forest: { src: "/images/bg/forest.webp", credit: "Constant Alexandre Famin, The Forest of Fontainebleau, c. 1874" },
  memorial: { src: "/images/bg/memorial.webp", credit: "George N. Barnard, Battlefield of New Hope Church, Georgia, 1865–66" },
  archive: { src: "/images/bg/archive.webp", credit: "Giovanni Battista Nolli, La Pianta Grande di Roma, 1748 (shown in negative)" },
} as const;

export const BG_SOURCE = "Cleveland Museum of Art, Open Access (CC0)";
