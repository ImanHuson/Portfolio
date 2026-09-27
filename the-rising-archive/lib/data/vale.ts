// The Vale: the Red afterlife, and this archive’s memorial. Every death here
// is verified (who, which book, how). Ages are deliberately omitted: the
// sources don’t fix most of them, and a memorial full of "unknown" is noise.
// Not sensationalized. The "how" is one plain sentence.

export type Memorial = {
  slug: string;
  name: string;
  color: string;
  house?: string;
  book: number;
  how: string;
  leftBehind: string;
  changed: string;
  meaning: string;
};

export const VALE: Memorial[] = [
  {
    slug: "eo",
    name: "Eo",
    color: "Red",
    house: "Lykos",
    book: 1,
    how: "Hanged on the ArchGovernor’s order for singing the forbidden song.",
    leftBehind: "Darrow. Her family in Lykos.",
    changed: "Everything that follows.",
    meaning: "The first line of the war. She asked him to break the chains, and he tried for six books.",
  },
  {
    slug: "julian",
    name: "Julian au Bellona",
    color: "Gold",
    house: "Bellona",
    book: 1,
    how: "Killed by Darrow in the Passage.",
    leftBehind: "His brother, Cassius.",
    changed: "Cassius’s life. And, through Cassius, Darrow’s.",
    meaning: "The Society’s first lesson to its children: kill someone, and become worthy.",
  },
  {
    slug: "pax-au-telemanus",
    name: "Pax au Telemanus",
    color: "Gold",
    house: "Telemanus",
    book: 1,
    how: "Stabbed by the Jackal while shielding Darrow with his own body.",
    leftBehind: "House Telemanus. Mustang’s house at the Institute.",
    changed: "Darrow’s son carries his name.",
    meaning: "Proof that some Golds were worth saving, given by one who did the saving.",
  },
  {
    slug: "fitchner",
    name: "Fitchner au Barca",
    color: "Gold",
    house: "Barca",
    book: 2,
    how: "Killed by Cassius au Bellona in 742 PCE.",
    leftBehind: "Sevro.",
    changed: "The Sons of Ares lose their founder. Sevro inherits his war.",
    meaning: "Ares was a Gold all along, and he started the rebellion because he loved a Red.",
  },
  {
    slug: "lorn",
    name: "Lorn au Arcos",
    color: "Gold",
    house: "Arcos",
    book: 2,
    how: "Killed at the Triumph by Lilath and the Jackal.",
    leftBehind: "The students he trained, Darrow among them.",
    changed: "The Rage Knight’s way of honor dies with him in the Society’s halls.",
    meaning: "A good man inside a bad system, caught in its machinery at the very end.",
  },
  {
    slug: "nero",
    name: "Nero au Augustus",
    color: "Gold",
    house: "Augustus",
    book: 2,
    how: "Executed at the Triumph by his son Adrius.",
    leftBehind: "Virginia. The Jackal.",
    changed: "House Augustus passes into worse hands before it passes into better ones.",
    meaning: "The ArchGovernor who hanged Eo, killed by the child he taught to be exactly like him.",
  },
  {
    slug: "ragnar",
    name: "Ragnar Volarus",
    color: "Obsidian",
    book: 3,
    how: "Killed in combat by Aja au Grimmus.",
    leftBehind: "His sister, Sefi. His people.",
    changed: "The Obsidians’ path out of the Society’s lies.",
    meaning: "He refused to die the way his people were taught to. That refusal was the point.",
  },
  {
    slug: "roque",
    name: "Roque au Fabii",
    color: "Gold",
    house: "Fabii",
    book: 3,
    how: "Took his own life rather than be captured.",
    leftBehind: "Former friends who never stopped being hurt by him.",
    changed: "The last of the Institute’s poets.",
    meaning: "He chose order over his friends, and then chose death over surrender.",
  },
  {
    slug: "octavia",
    name: "Octavia au Lune",
    color: "Gold",
    house: "Lune",
    book: 3,
    how: "Killed by Darrow at the Fall of Luna.",
    leftBehind: "Lysander.",
    changed: "The Society loses its Sovereign. The Rising ends.",
    meaning: "The old order had a face. Darrow ended it inside her own bunker.",
  },
  {
    slug: "the-jackal",
    name: "Adrius au Augustus",
    color: "Gold",
    house: "Augustus",
    book: 3,
    how: "Taken alive at the Fall of Luna, and later hanged.",
    leftBehind: "His sister, Virginia.",
    changed: "The first trilogy’s villain is gone. His damage is not.",
    meaning: "The Society’s purest product, ended at the end of a rope, the way it ended Eo.",
  },
  {
    slug: "ulysses",
    name: "Ulysses au Barca",
    color: "Gold",
    house: "Barca",
    book: 5,
    how: "Killed as a newborn by Harmony’s Red Hand.",
    leftBehind: "Sevro. Victra. His sisters.",
    changed: "Sevro’s war becomes something he will never stop carrying.",
    meaning: "The revolution’s own children were not safe from the revolution.",
  },
  {
    slug: "ephraim",
    name: "Ephraim ti Horn",
    color: "Gray",
    book: 5,
    how: "Killed by Volsung Fá after his last act, and called worthy.",
    leftBehind: "Volga. The people he meant to save.",
    changed: "A thief who stopped believing in anything died believing in something.",
    meaning: "Redemption is not always survival.",
  },
  {
    slug: "cassius",
    name: "Cassius au Bellona",
    color: "Gold",
    house: "Bellona",
    book: 6,
    how: "Charged forward in dead armor, naming himself one last time.",
    leftBehind: "Darrow. Lysander.",
    changed: "The Morning Knight becomes a memory.",
    meaning: "Son of Tiberius, son of Julia, brother of Darrow. His honor remains.",
  },
];
