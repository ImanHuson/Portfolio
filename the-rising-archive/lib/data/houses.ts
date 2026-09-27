// The houses as sealed political dossiers. Mottos, sigils, seats and family
// relationships were checked (Red Rising Wiki via search, and the older
// red-rising-archive's verified data). Every member line carries the book
// that makes it safe to read. Where a sigil or motto couldn't be confirmed,
// the field is left empty and the page says so instead of inventing heraldry.

export type HouseMember = { name: string; note: string; book: number; fate?: { text: string; book: number } };
export type Artifact = { title: string; body: string; book: number };

export type House = {
  slug: string;
  name: string;
  motto?: string;
  mottoEn?: string;
  sigil?: string;
  seat: string;
  plate: string;
  lede: string[];
  members: HouseMember[];
  artifacts?: Artifact[];
  essay?: { question: string; body: string[]; book: number };
};

export const HOUSES: House[] = [
  {
    slug: "augustus",
    name: "House Augustus",
    motto: "Hic Sunt Leones",
    mottoEn: "Here Be Lions",
    sigil: "A golden lion on red",
    seat: "Mars. The ArchGovernor’s house.",
    plate: "/images/houses/augustus.webp",
    lede: [
      "Mars. Power. Ambition.",
      "One of the central political dynasties of the saga. Its history becomes inseparable from the transformation of Mars itself.",
    ],
    members: [
      { name: "Nero au Augustus", note: "ArchGovernor of Mars. Father of Virginia and Adrius.", book: 1, fate: { text: "Shot by his own son at the end of Golden Son.", book: 2 } },
      { name: "Virginia au Augustus", note: "Called Mustang. Nero’s daughter.", book: 1, fate: { text: "Sovereign of the Solar Republic.", book: 4 } },
      { name: "Adrius au Augustus", note: "The Jackal. Virginia’s twin.", book: 1, fate: { text: "Taken alive at the Fall of Luna, and later hanged.", book: 3 } },
      { name: "Darrow", note: "Nero’s Lancer, and after the Lion’s Rain, his adopted son.", book: 2, fate: { text: "Husband of Virginia.", book: 4 } },
      { name: "Pax au Augustus", note: "Son of Darrow and Virginia, named for Pax au Telemanus.", book: 4 },
    ],
    artifacts: [
      { title: "The Augustus seal", body: "The lion on red. Rendered for this archive; not the published heraldry.", book: 0 },
      { title: "Nero’s political history", body: "The ArchGovernor who ordered Eo hanged, and who ran Mars as a board he intended to win.", book: 1 },
      { title: "Adrius’s psychological profile", body: "He paid Karnus au Bellona to kill Claudius, his father’s favourite child. When Nero disowned him, he shot him.", book: 2 },
      { title: "Darrow’s transformation", body: "A Red carved into a Gold, taken into the house of the man who hanged his wife.", book: 2 },
      { title: "Virginia’s succession", body: "The daughter who chose to be neither her father nor her brother, and ended up governing what was left.", book: 4 },
      { title: "Pax’s inheritance", body: "A Red father’s name, a Gold mother’s house, and a war that was supposed to be over before he was born.", book: 4 },
    ],
  },
  {
    slug: "bellona",
    name: "House Bellona",
    motto: "Alis Aquilae",
    mottoEn: "On Eagle’s Wings",
    sigil: "An eagle",
    seat: "Mars. Augustus’s great rival.",
    plate: "/images/houses/bellona.webp",
    lede: [
      "A family defined by pride, military prestige, and its old rivalry with Augustus.",
      "Not simply “the enemy house.” This is the family Cassius was born into, which is what makes it matter.",
    ],
    members: [
      { name: "Cassius au Bellona", note: "Son of Tiberius and Julia. Julian’s twin.", book: 1 },
      { name: "Julian au Bellona", note: "Cassius’s twin brother.", book: 1, fate: { text: "Killed by Darrow in the Passage.", book: 1 } },
      { name: "Tiberius au Bellona", note: "Primus of the house. Governor of Olympia, Imperator of the Sixth Fleet.", book: 2 },
      { name: "Julia au Bellona", note: "Tiberius’s wife. Mother of Karnus, Julian and Cassius.", book: 2 },
      { name: "Karnus au Bellona", note: "The eldest son.", book: 2, fate: { text: "The hand Adrius paid to kill Claudius au Augustus.", book: 2 } },
    ],
  },
  {
    slug: "lune",
    name: "House Lune",
    motto: "Lux ex Tenebris",
    mottoEn: "Light from Darkness",
    seat: "Luna. The Sovereign’s house, and the seat of the old Society.",
    plate: "/images/houses/lune.webp",
    lede: [
      "One of the oldest houses in the Society, tracing itself back to the Society’s founder.",
      "The old Sovereign’s house.",
    ],
    members: [
      { name: "Silenius au Lune", note: "Founder of the Society. The house’s origin.", book: 0 },
      { name: "Octavia au Lune", note: "Sovereign of the Society.", book: 2, fate: { text: "Stabbed by Darrow in her own bunker at the Fall of Luna.", book: 3 } },
      { name: "Ovidius au Lune", note: "Octavia’s father.", book: 4 },
      { name: "Anastasia au Lune", note: "Octavia’s daughter. Wife of Brutus au Arcos, mother of Lysander.", book: 4 },
      { name: "Lysander au Lune", note: "Octavia’s grandson. The heir to a house that no longer rules.", book: 4 },
    ],
    essay: {
      question: "What does “light from darkness” mean when the darkness is your own civilization?",
      body: [
        "Every house motto is a boast. Lune’s is also a theory of history: that order is the light, and everything outside it is the dark it rescued people from.",
        "The saga keeps turning the motto over. To the Golds of Luna, the Society is the light. To a Red in Lykos, the Society is the dark. Lysander inherits the motto and has to decide which of those readings he believes, and the books do not make that choice easy for him or for the reader.",
      ],
      book: 4,
    },
  },
  {
    slug: "telemanus",
    name: "House Telemanus",
    sigil: "A red fox",
    seat: "Mars, seated at Zephyria, with an estate on Earth.",
    plate: "/images/houses/telemanus.webp",
    lede: [
      "The house that makes “Gold” feel different.",
      "Bannermen of Augustus. A family whose warmth makes the brutality of the rest of the Society more obvious.",
    ],
    members: [
      { name: "Kavax au Telemanus", note: "Primus of the house. Foster father to Virginia.", book: 2, fate: { text: "His spine broken by Apollonius at the Battle of Phobos.", book: 6 } },
      { name: "Niobe au Telemanus", note: "Kavax’s wife.", book: 2 },
      { name: "Daxo au Telemanus", note: "The eldest son.", book: 2, fate: { text: "Killed on the Day of Red Doves, when the Senate was stormed.", book: 6 } },
      { name: "Pax au Telemanus", note: "Son of Kavax and Niobe.", book: 1, fate: { text: "Killed by the Jackal at the Institute.", book: 1 } },
      { name: "Thraxa au Telemanus", note: "The Hammer. The youngest daughter.", book: 3, fate: { text: "Lost an arm in a duel with the last Fury.", book: 6 } },
      { name: "Xana au Telemanus", note: "A daughter of Kavax and Niobe.", book: 2 },
    ],
  },
  {
    slug: "raa",
    name: "House Raa",
    motto: "Pulvis et umbra sumus",
    mottoEn: "We are but dust and shadow",
    seat: "Io, Jupiter’s innermost moon. The Rim.",
    plate: "/images/houses/raa.webp",
    lede: [
      "The ruling house of Io, and one of the most prominent houses of the Rim.",
      "Proof that the Solar System isn’t culturally uniform. The Rim remembers the Society differently, and its first family is full of competing ideas about honour, independence and survival.",
    ],
    members: [
      { name: "Romulus au Raa", note: "Head of the house.", book: 3 },
      { name: "Dido au Raa", note: "Romulus’s wife.", book: 4 },
      { name: "Aeneas au Raa", note: "Romulus’s eldest son.", book: 3, fate: { text: "Killed at the Battle of Ilium.", book: 3 } },
      { name: "Diomedes au Raa", note: "The Storm Knight. Heir after his brother’s death.", book: 4 },
      { name: "Seraphina au Raa", note: "Second daughter of Romulus and Dido.", book: 5 },
      { name: "Atlas au Raa", note: "Romulus’s younger brother. Sent to the Core at ten.", book: 4 },
    ],
  },
];

// House Raa's family tree, for the genealogy view. `book` gates each node.
export type TreeNode = { name: string; note?: string; book: number; children?: TreeNode[] };
export const RAA_TREE: TreeNode = {
  name: "Revus and Gaia au Raa",
  book: 5,
  children: [
    {
      name: "Romulus au Raa",
      note: "married Dido",
      book: 3,
      children: [
        { name: "Aeneas", note: "killed at Ilium", book: 3 },
        { name: "Diomedes", note: "the Storm Knight", book: 4 },
        { name: "Seraphina", book: 5 },
      ],
    },
    { name: "Atlas au Raa", note: "second son, born 705 PCE", book: 5 },
  ],
};

export const getHouse = (slug: string) => HOUSES.find((h) => h.slug === slug);
