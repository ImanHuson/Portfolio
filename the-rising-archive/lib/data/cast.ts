// The complete cast (brief section 61): compact entries, not dossiers.
// Only people who could be verified are here. Checked against the site's
// own verified data and WebSearch (Fandom and Wikipedia can't be fetched
// directly from this build). Cut, and why:
// - Pallas au Raa: no source could be found for this name.
// - Tactus: sources disagree on his House; left out rather than guessed.
// - "Ragnar's family": Sefi is the one verified, named member here.
// Entries say who someone is when first met. Nothing here gives a fate.
// Each line is sealed at `book`, the first significant appearance.

export type CastEntry = {
  slug: string;
  name: string;
  color: string;
  role: string;
  book: number;
  line: string;
  related: string[]; // featured-people slugs or cast slugs
  keywords?: string[];
};

export const CAST: CastEntry[] = [
  { slug: "eo", name: "Eo of Lykos", color: "Red", role: "Singer, wife", book: 1, line: "Darrow’s wife, and the song he carries through everything after.", related: ["darrow"], keywords: ["Lykos", "mines", "song"] },
  { slug: "kieran", name: "Kieran of Lykos", color: "Red", role: "Miner", book: 1, line: "Darrow’s older brother, a miner of Lykos.", related: ["darrow"], keywords: ["Lykos", "mines", "family"] },
  { slug: "dancer", name: "Dancer", color: "Red", role: "Son of Ares", book: 1, line: "The Son of Ares who brings Darrow out of the mines and into the plan.", related: ["darrow", "fitchner"], keywords: ["Sons of Ares", "rebellion"] },
  { slug: "mickey", name: "Mickey", color: "Violet", role: "Carver", book: 1, line: "The Violet carver in Yorkton who remakes Darrow’s body as a Gold.", related: ["darrow"], keywords: ["carving", "Yorkton"] },
  { slug: "roque", name: "Roque au Fabii", color: "Gold", role: "Poet, soldier", book: 1, line: "A poet among killers, and one of Darrow’s first friends at the Institute.", related: ["darrow", "virginia"], keywords: ["Institute", "House Mars", "poetry"] },
  { slug: "clown", name: "Clown", color: "Gold", role: "Howler", book: 1, line: "One of the original Howlers of House Mars.", related: ["sevro", "pebble"], keywords: ["Howlers", "Institute", "House Mars"] },
  { slug: "pebble", name: "Pebble", color: "Gold", role: "Howler", book: 1, line: "One of the original Howlers of House Mars.", related: ["sevro", "clown"], keywords: ["Howlers", "Institute", "House Mars"] },
  { slug: "harpy", name: "Harpy (Daria)", color: "Gold", role: "Howler", book: 1, line: "Drafted into House Ceres at the Institute, and an early Howler.", related: ["sevro"], keywords: ["Howlers", "Institute", "House Ceres"] },
  { slug: "antonia", name: "Antonia au Severus-Julii", color: "Gold", role: "Heir, rival", book: 2, line: "Victra’s half-sister, and her enemy.", related: ["victra"], keywords: ["House Julii", "family"] },
  { slug: "octavia", name: "Octavia au Lune", color: "Gold", role: "Sovereign", book: 2, line: "The Sovereign of the Society, ruling from Luna.", related: ["aja"], keywords: ["Luna", "power", "Society"] },
  { slug: "aja", name: "Aja au Grimmus", color: "Gold", role: "Protean Knight", book: 2, line: "The Protean Knight: Octavia’s chief bodyguard, and one of Lorn’s last students.", related: ["octavia", "lorn"], keywords: ["Olympic Knights", "Willow Way", "House Grimmus"] },
  { slug: "daxo", name: "Daxo au Telemanus", color: "Gold", role: "Heir of Telemanus", book: 2, line: "Son and heir of Kavax and Niobe of House Telemanus.", related: ["kavax"], keywords: ["House Telemanus", "family"] },
  { slug: "thraxa", name: "Thraxa au Telemanus", color: "Gold", role: "Warrior", book: 3, line: "A daughter of Kavax and Niobe, called the Hammer.", related: ["kavax", "daxo"], keywords: ["House Telemanus", "family"] },
  { slug: "sefi", name: "Sefi the Quiet", color: "Obsidian", role: "Warrior", book: 3, line: "Ragnar’s sister, called the Quiet.", related: ["ragnar", "volga"], keywords: ["Obsidian", "Valkyrie", "family"] },
  { slug: "quicksilver", name: "Quicksilver (Regulus ag Sun)", color: "Silver", role: "Industrialist", book: 3, line: "The richest man in the Society: a Silver of Earth, head of Sun Industries.", related: ["darrow"], keywords: ["Earth", "Sun Industries", "money"] },
  { slug: "holiday", name: "Holiday ti Nakamura", color: "Gray", role: "Soldier", book: 3, line: "A Gray soldier at Darrow’s side, and Trigg’s sister.", related: ["trigg", "darrow"], keywords: ["Gray", "soldier", "family"] },
  { slug: "trigg", name: "Trigg ti Nakamura", color: "Gray", role: "Soldier", book: 3, line: "A Gray soldier at Darrow’s side, and Holiday’s brother.", related: ["holiday", "darrow"], keywords: ["Gray", "soldier", "family"] },
  { slug: "pytha", name: "Pytha xe Virgus", color: "Blue", role: "Pilot", book: 4, line: "A Blue pilot, once of House Bellona’s fleet, who flies Cassius and Lysander.", related: ["cassius", "lysander"], keywords: ["pilot", "Archimedes", "exile"] },
  { slug: "alexandar", name: "Alexandar au Arcos", color: "Gold", role: "Heir of Arcos, lancer", book: 4, line: "Lorn’s eldest grandson and heir of House Arcos, and one of Darrow’s lancers.", related: ["lorn", "darrow", "lysander"], keywords: ["House Arcos", "Willow Way", "family"] },
  { slug: "tongueless", name: "Tongueless", color: "Obsidian", role: "Former prison guard", book: 4, line: "An Obsidian found in Deepgrave with his tongue cut out, who joins Darrow’s crew.", related: ["darrow"], keywords: ["Obsidian", "Deepgrave"] },
  { slug: "dido", name: "Dido au Raa", color: "Gold", role: "Rim noble", book: 4, line: "Romulus’s wife, mother of Diomedes and Seraphina.", related: ["romulus", "diomedes", "seraphina"], keywords: ["House Raa", "Rim", "family"] },
  { slug: "seraphina", name: "Seraphina au Raa", color: "Gold", role: "Rim soldier", book: 4, line: "Daughter of Romulus and Dido, a soldier of the Rim.", related: ["romulus", "dido", "diomedes"], keywords: ["House Raa", "Rim", "family"] },
  { slug: "electra", name: "Electra au Barca", color: "Gold", role: "Daughter", book: 4, line: "Sevro and Victra’s eldest daughter.", related: ["sevro", "victra"], keywords: ["House Barca", "family"] },
  { slug: "atalantia", name: "Atalantia au Grimmus", color: "Gold", role: "Society commander", book: 5, line: "Aja’s sister, a daughter of the Ash Lord, and a leader of the Society Remnant.", related: ["aja"], keywords: ["House Grimmus", "Society", "power"] },
  { slug: "ajax", name: "Ajax au Grimmus", color: "Gold", role: "Storm Knight", book: 5, line: "The Society’s Storm Knight, Aja’s son.", related: ["aja", "atalantia"], keywords: ["Olympic Knights", "House Grimmus"] },
  { slug: "glirastes", name: "Glirastes", color: "Orange", role: "Master Maker", book: 5, line: "The Master Maker of Mercury, the Society’s most famous artificer.", related: ["darrow", "lysander"], keywords: ["Mercury", "Maker", "Orange"] },
  { slug: "cicero", name: "Cicero au Votum", color: "Gold", role: "Heir of Votum", book: 5, line: "Heir of House Votum, the ruling family of Mercury.", related: [], keywords: ["Mercury", "House Votum"] },
];

export const getCast = (slug: string) => CAST.find((c) => c.slug === slug);
