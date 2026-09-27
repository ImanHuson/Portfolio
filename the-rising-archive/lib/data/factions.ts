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
  alias?: string;
  first?: string;
  book: number; // when this person is safe to name as a Howler
  weapon?: { text: string; book: number };
  loyalty: { text: string; book: number };
  fate?: { text: string; book: number; state: "lit" | "crossed" | "memorial" };
  pup?: boolean; // Darrow's lancers: attached to the Howlers, never full members
};

export const HOWLERS: Howler[] = [
  { name: "Sevro", first: "Red Rising, the Institute", book: 1, loyalty: { text: "The pack’s leader. To Darrow, first and always.", book: 1 } },
  { name: "Screwface", alias: "Horatius au Savag", first: "Red Rising, the Institute", book: 1, loyalty: { text: "Defected from the Society to the Sons of Ares.", book: 3 }, fate: { text: "Deep cover inside the Society Remnant when the sequel series opens.", book: 4, state: "lit" } },
  { name: "Pebble", first: "Red Rising, the Institute", book: 1, loyalty: { text: "Defected to the Sons of Ares with Clown.", book: 3 }, fate: { text: "Married to Clown.", book: 4, state: "lit" } },
  { name: "Clown", first: "Red Rising, the Institute", book: 1, loyalty: { text: "Defected to the Sons of Ares with Pebble.", book: 3 }, fate: { text: "Married to Pebble.", book: 4, state: "lit" } },
  { name: "Thistle", first: "Red Rising, the Institute", book: 1, loyalty: { text: "Went over to the Jackal’s Boneriders.", book: 2 }, fate: { text: "Helped coordinate the massacre at the Triumph. She did not join the Rising.", book: 2, state: "crossed" } },
  { name: "Weed", first: "Red Rising, the Institute", book: 1, loyalty: { text: "A Howler to the end.", book: 1 }, fate: { text: "Killed in the Lion’s Rain, when an EMP cut the power to his gravBoots over a river.", book: 2, state: "memorial" } },
  { name: "Victra", alias: "Victra au Julii, later au Barca", first: "Golden Son", book: 3, loyalty: { text: "To Darrow, and to Sevro, whom she marries.", book: 4 } },
  { name: "Holiday", alias: "Holiday ti Nakamura", book: 3, loyalty: { text: "A Gray legionnaire of Legio XIII Dracones, secretly working for the Sons of Ares.", book: 3 }, fate: { text: "Later Virginia’s Dux.", book: 4, state: "lit" } },
  { name: "Thraxa", alias: "Thraxa au Telemanus, the Hammer", first: "Morning Star", book: 4, weapon: { text: "A hammer she calls Wee Lass.", book: 5 }, loyalty: { text: "To Darrow, and to her family.", book: 4 }, fate: { text: "Loses an arm in a duel with the last Fury, and keeps fighting.", book: 6, state: "lit" } },
  { name: "Colloway", alias: "Colloway xe Char", book: 5, weapon: { text: "Warlock Squadron, which he leads.", book: 5 }, loyalty: { text: "A Blue pirate turned war hero, and the Republic’s favourite pilot.", book: 5 } },
  { name: "Alexandar", alias: "Alexandar au Arcos, callsign Pup One", book: 5, pup: true, loyalty: { text: "Lorn’s eldest grandson, and Darrow’s ArchLancer. He met Darrow as a boy training in the Willow Way.", book: 5 } },
  { name: "Rhonna", alias: "Rhonna of Lykos, callsign Pup Two", book: 5, pup: true, loyalty: { text: "Darrow’s niece, Kieran’s daughter, and his lancer from 752.", book: 5 }, fate: { text: "Lost in the fall of Heliopolis.", book: 5, state: "memorial" } },
];

// Also on the roll, named without detail: the archive found membership but
// nothing it could verify beyond that.
export const HOWLERS_ALSO: { name: string; book: number }[] = [
  { name: "Min-Min", book: 4 },
  { name: "Winkle", book: 5 },
  { name: "Kieran of Lykos", book: 5 },
  { name: "Milia au Trachus", book: 5 },
  { name: "Marbles", book: 5 },
  { name: "Felix au Daan", book: 5 },
  { name: "Valdir", book: 5 },
  { name: "Lyria of Lagalos", book: 6 },
];

// Olympic Knights. The Society has twelve seats; ten titles are named here,
// and details are marked "unknown" where the archive couldn't confirm them.
export type Knight = { title: string; armour?: string; holder?: { text: string; book: number }; note?: { text: string; book: number }; disputed?: boolean };

export const KNIGHTS: Knight[] = [
  { title: "Morning Knight", armour: "White armour, the helm crested by a rising golden sun.", holder: { text: "Marcus au Crusus held it before the war. Cassius would carry the title later.", book: 3 } },
  { title: "Rage Knight", armour: "Dark red armour, a helm shaped like a laughing wolf’s head.", holder: { text: "Lorn au Arcos, long before the saga, and the creator of the Willow Way.", book: 2 } },
  { title: "Protean Knight", armour: "Gold and midnight blue, emblazoned with blue sea serpents.", holder: { text: "Aja au Grimmus, Octavia’s chief bodyguard and one of Lorn’s last students.", book: 2 } },
  { title: "Storm Knight", holder: { text: "Ajax au Grimmus, for the Society Remnant. The Rim has its own Storm Knight in Diomedes au Raa.", book: 5 } },
  { title: "Fear Knight", holder: { text: "Atlas au Raa.", book: 4 } },
  { title: "Love Knight", holder: { text: "Kalindora au San, who petitioned Octavia to take the seat when her father retired.", book: 5 }, note: { text: "Poisoned by Atalantia au Grimmus while her wounds from the Long Night were treated. The seat stood empty after her.", book: 6 } },
  { title: "Wind Knight" },
  { title: "Hearth Knight" },
  { title: "Truth Knight" },
  { title: "Joy Knight" },
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
