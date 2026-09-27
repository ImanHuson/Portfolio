// The Artifact Vault. Details from the Red Rising Wiki (via search) and the
// books; `book` gates anything that spoils.
export type Artifact = {
  slug: string;
  name: string;
  line: string;
  plate: string;
  body: { text: string; book: number }[];
  reading?: boolean; // archivist's reading, not a sourced description
};

export const VAULT: Artifact[] = [
  {
    slug: "razor",
    name: "Razors",
    line: "The weapon that turns Gold combat into ritualized murder.",
    plate: "/images/vault/razor.webp",
    body: [
      { text: "About two metres long. It switches from a rigid blade to a whip and back on a dime, and can pierce a battleship’s hull.", book: 0 },
      { text: "Lorn au Arcos’s Willow Way is a whole philosophy of fighting with one: fluid, reactive, using the opponent’s own movement against them.", book: 2 },
    ],
  },
  {
    slug: "starshell",
    name: "StarShells",
    line: "Personal war machines.",
    plate: "/images/vault/starshell.webp",
    body: [
      { text: "Twelve-foot mechanized armour with a pulseShield, a railgun and a particle cannon. A single soldier becomes a vehicle.", book: 0 },
    ],
  },
  {
    slug: "dreadnought",
    name: "Dreadnoughts",
    line: "The industrial scale of the war.",
    plate: "/images/vault/dreadnought.webp",
    body: [
      { text: "The Pax, formerly the Vanguard, was a five-kilometre dreadnought and Darrow’s flagship.", book: 3 },
      { text: "It was destroyed at the Battle of Ilium, on purpose: part of Darrow’s plan to board a bigger ship.", book: 3 },
    ],
  },
  {
    slug: "starship",
    name: "Starships",
    line: "The actual connective tissue of the Solar System.",
    plate: "/images/vault/starship.webp",
    body: [
      { text: "The MoonBreaker Morning Star, three times the girth of the Pax, was built as Octavia’s birthday gift to her grandson Lysander.", book: 3 },
      { text: "Seized by Darrow at Ilium and renamed, at Sefi’s suggestion, for the star Obsidian travellers steer by across the winter ice.", book: 3 },
    ],
  },
  {
    slug: "minds-eye",
    name: "The Mind’s Eye",
    line: "Not a superpower. A discipline. A way of seeing.",
    plate: "/images/vault/minds-eye.webp",
    body: [
      { text: "A technique kept secret, which seems to give its user near-supernatural perception and thought.", book: 4 },
      { text: "Only two users are confirmed: Octavia au Lune and Lysander au Lune.", book: 5 },
    ],
  },
  {
    slug: "carving",
    name: "Carvings",
    line: "The physical transformation required to make Darrow possible.",
    plate: "/images/vault/carving.webp",
    body: [
      { text: "Carvers, Violets, reshape bodies. The Sons of Ares bring Darrow to one, Mickey, who remakes a Red into a Gold.", book: 1 },
    ],
  },
  {
    slug: "psychospike",
    name: "PsychoSpikes",
    line: "One of the saga’s most horrifying intersections of technology and intimacy.",
    plate: "/images/vault/psychospike.webp",
    body: [
      { text: "A silver device implanted at the back of the skull, able to view, edit and erase a person’s memories.", book: 6 },
      { text: "Developed by Virginia and a team of Green hackers from the Pandemonium Chair, over seven years.", book: 6 },
    ],
  },
  {
    slug: "holotech",
    name: "Holotech",
    line: "How the Republic and the Society communicate, govern and manipulate.",
    plate: "/images/vault/holotech.webp",
    reading: true,
    body: [
      { text: "The Society governs by spectacle. What one Color is shown about another, and when, is as much a weapon as a razor. The Republic inherits the same machinery, and the same temptation.", book: 0 },
    ],
  },
];

// Smaller instruments, text only.
export const INSTRUMENTS: { name: string; text: string; book: number }[] = [
  { name: "pulseFist", text: "A gauntlet that fires blasts of pulse energy, hot enough to melt ice and pulverise stone.", book: 1 },
  { name: "gravBoots", text: "Boots that let the wearer hover and fly. Each weighs around nine kilos and locks to the leg with three latches.", book: 1 },
];
