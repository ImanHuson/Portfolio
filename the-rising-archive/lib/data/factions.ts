// Factions, each with its own visual language on the page. Sources: Red Rising
// Wiki (via search), the Sons of Ares comic listing, and the published books.

export type Faction = {
  slug: string;
  name: string;
  creed: string;
  voice: "gold" | "red" | "display" | "rim";
  body: { text: string; book: number }[];
};

export const FACTIONS: Faction[] = [
  {
    slug: "society",
    name: "The Society",
    creed: "Order through hierarchy.",
    voice: "gold",
    body: [
      { text: "Gold believes civilization requires rulers. The Society is that belief built into law, into biology, and into fourteen Colors that are told from birth what they are for.", book: 0 },
      { text: "It does not end when its Sovereign dies. What survives the Fall of Luna keeps fighting as the Society Remnant.", book: 4 },
    ],
  },
  {
    slug: "sons-of-ares",
    name: "The Sons of Ares",
    creed: "Freedom through revolution.",
    voice: "red",
    body: [
      { text: "A resistance movement working inside the Society. It finds Darrow, and it makes him possible.", book: 1 },
      { text: "The official comics tell its founding, and Fitchner au Barca’s part in it.", book: 0 },
      { text: "It becomes something much larger than the organization that created Darrow.", book: 3 },
    ],
  },
  {
    slug: "the-rising",
    name: "The Rising",
    creed: "Not an organization.",
    voice: "display",
    body: [
      { text: "A movement. A war. A myth. And eventually, a government.", book: 3 },
    ],
  },
  {
    slug: "republic",
    name: "The Solar Republic",
    creed: "Can revolution become government without becoming the thing it replaced?",
    voice: "rim",
    body: [
      { text: "The state the Rising builds from the ruins, with a Senate and a Sovereign, Virginia au Augustus. Ten years later it is still at war, and still arguing with itself about what it is for.", book: 4 },
    ],
  },
];

// The Howlers, as a living roster. Only facts that were verified are listed;
// fields the archive couldn't confirm are left out rather than invented.
export type Howler = {
  name: string;
  first: string;
  loyalty: { text: string; book: number };
  fate?: { text: string; book: number; state: "lit" | "crossed" | "memorial" };
};

export const HOWLERS: Howler[] = [
  { name: "Sevro", first: "Red Rising, the Institute", loyalty: { text: "The pack’s leader. To Darrow, first and always.", book: 1 } },
  { name: "Screwface", first: "Red Rising, the Institute", loyalty: { text: "Defected from the Society to the Sons of Ares.", book: 3 }, fate: { text: "Deep cover inside the Society Remnant when the sequel series opens.", book: 4, state: "lit" } },
  { name: "Pebble", first: "Red Rising, the Institute", loyalty: { text: "Defected to the Sons of Ares with Clown.", book: 3 }, fate: { text: "Married to Clown.", book: 4, state: "lit" } },
  { name: "Clown", first: "Red Rising, the Institute", loyalty: { text: "Defected to the Sons of Ares with Pebble.", book: 3 }, fate: { text: "Married to Pebble.", book: 4, state: "lit" } },
  { name: "Thistle", first: "Red Rising, the Institute", loyalty: { text: "Went over to the Jackal’s Boneriders.", book: 2 }, fate: { text: "Helped coordinate the massacre at the Triumph. She did not join the Rising.", book: 2, state: "crossed" } },
  { name: "Weed", first: "Red Rising, the Institute", loyalty: { text: "A Howler to the end.", book: 1 }, fate: { text: "Killed in the Lion’s Rain, when an EMP cut the power to his gravBoots over a river.", book: 2, state: "memorial" } },
];

// Olympic Knights: twelve seats in the Society. Details are left as
// "unknown" where the archive couldn't confirm them.
export type Knight = { title: string; armour?: string; holder?: { text: string; book: number }; note?: { text: string; book: number }; disputed?: boolean };

export const KNIGHTS: Knight[] = [
  { title: "Rage Knight", armour: "Dark red armour, a helm shaped like a laughing wolf’s head.", holder: { text: "Lorn au Arcos, long before the saga, and the creator of the Willow Way.", book: 2 } },
  { title: "Morning Knight", armour: "White armour, the helm crested by a rising golden sun.", holder: { text: "Marcus au Crusus held it before the war. Cassius would carry the title later.", book: 3 } },
  { title: "Protean Knight", armour: "Gold and midnight blue, emblazoned with blue sea serpents.", holder: { text: "Aja au Grimmus, Octavia’s chief bodyguard and one of Lorn’s last students.", book: 2 } },
  { title: "Storm Knight", holder: { text: "Ajax au Grimmus, for the Society Remnant. The Rim has its own Storm Knight in Diomedes au Raa.", book: 5 } },
  { title: "Fear Knight", holder: { text: "Atlas au Raa.", book: 4 } },
  { title: "Shadow Knight", note: { text: "A thirteenth seat mentioned in Iron Gold. Its canonical status has been questioned.", book: 4 }, disputed: true },
];

// Ascomanni: an intelligence file, not an encyclopedia entry. Redacted
// lines unlock with clearance.
export const ASCOMANNI: { text: string; book: number }[] = [
  { text: "Origin: descendants of Obsidians who escaped the Society’s purge after the Dark Revolt.", book: 5 },
  { text: "Territory: the Kuiper Belt, far past any Society patrol.", book: 5 },
  { text: "Conduct: raiders. Reports describe cannibalism, and hulls decorated with the bodies of the people they took.", book: 5 },
  { text: "Leadership: the tribes unified under a warlord called Volsung Fá, on the promise of a holy war.", book: 5 },
  { text: "Volsung Fá is an alias. The man is Vagnar Hefga, an Obsidian agent sent into the Belt on Atlas au Raa’s plan to turn the Ascomanni into a weapon for the Society.", book: 6 },
  { text: "Vagnar Hefga is Ragnar Volarus’s father.", book: 6 },
];
