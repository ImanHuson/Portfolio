// Darrow at the center. Mustang and Virginia are ONE person: the build brief
// listed them as two separate relationships, which any reader of the books
// would catch. Each arc step carries the book that reveals it.

export type ArcStep = { label: string; book: number };

export type Bond = {
  slug: string;
  name: string;
  kind: string;
  register: "red" | "gold" | "rim" | "none" | "obsidian";
  firstBook: number;
  arc: ArcStep[];
  note: string;
  noteBook: number;
  dossier?: string; // slug in PEOPLE, if they have a full dossier
};

export const BONDS: Bond[] = [
  {
    slug: "eo",
    name: "Eo",
    kind: "Love",
    register: "red",
    firstBook: 1,
    arc: [
      { label: "Marriage in Lykos", book: 1 },
      { label: "The song", book: 1 },
      { label: "The gallows", book: 1 },
      { label: "The reason", book: 1 },
    ],
    note: "She is dead before the story really begins, and she is the reason for all of it. Every later love in Darrow’s life is measured against a girl who asked him to live for more.",
    noteBook: 1,
  },
  {
    slug: "virginia",
    name: "Virginia (Mustang)",
    kind: "Partner",
    register: "gold",
    firstBook: 1,
    arc: [
      { label: "Rival Primus", book: 1 },
      { label: "Ally", book: 1 },
      { label: "The Gala", book: 2 },
      { label: "Sovereign", book: 3 },
      { label: "Wife", book: 4 },
      { label: "Pax’s mother", book: 4 },
    ],
    note: "Love and intellectual equality in one person. She is the one who keeps asking what they are actually building, and he needs her to.",
    noteBook: 3,
    dossier: "virginia",
  },
  {
    slug: "sevro",
    name: "Sevro",
    kind: "Brother",
    register: "red",
    firstBook: 1,
    arc: [
      { label: "The Goblin at the Institute", book: 1 },
      { label: "Howler", book: 1 },
      { label: "Ares", book: 3 },
      { label: "Grief", book: 5 },
      { label: "Brother", book: 6 },
    ],
    note: "Two men who built a revolution together and repeatedly hurt each other, because neither knows how to stop carrying the war home.",
    noteBook: 5,
    dossier: "sevro",
  },
  {
    slug: "cassius",
    name: "Cassius",
    kind: "Friend, enemy, brother",
    register: "gold",
    firstBook: 1,
    arc: [
      { label: "Friendship", book: 1 },
      { label: "Julian", book: 1 },
      { label: "The Gala", book: 2 },
      { label: "Betrayal", book: 2 },
      { label: "Bellona", book: 3 },
      { label: "Forgiveness", book: 3 },
      { label: "Brotherhood", book: 4 },
      { label: "My honor remains.", book: 6 },
    ],
    note: "That is far more Red Rising than another paragraph saying their relationship is complicated.",
    noteBook: 1,
    dossier: "cassius",
  },
  {
    slug: "ragnar",
    name: "Ragnar Volarus",
    kind: "Trust",
    register: "obsidian",
    firstBook: 2,
    arc: [
      { label: "Obsidian", book: 2 },
      { label: "Friend", book: 2 },
      { label: "Freedom", book: 3 },
      { label: "Aja", book: 3 },
      { label: "Mercy", book: 3 },
    ],
    note: "Trust across a divide the Society manufactured on purpose. When Aja wounds him beyond saving, he asks Darrow to end it, and Darrow does.",
    noteBook: 3,
  },
  {
    slug: "roque",
    name: "Roque au Fabii",
    kind: "Fracture",
    register: "gold",
    firstBook: 1,
    arc: [
      { label: "Poet", book: 1 },
      { label: "Friend", book: 1 },
      { label: "Poison", book: 2 },
      { label: "Enemy", book: 3 },
      { label: "Refusal", book: 3 },
    ],
    note: "Friendship broken by an idea of order. Roque poisons Darrow at the Triumph, and when he is finally beaten he would rather die than be captured.",
    noteBook: 3,
  },
  {
    slug: "the-jackal",
    name: "The Jackal",
    kind: "Rival",
    register: "gold",
    firstBook: 1,
    arc: [
      { label: "The Institute", book: 1 },
      { label: "Pax au Telemanus", book: 1 },
      { label: "The Triumph", book: 2 },
      { label: "The table", book: 3 },
      { label: "The rope", book: 3 },
    ],
    note: "Darrow’s mirror if the revolution had been about power instead of freedom.",
    noteBook: 3,
    dossier: "the-jackal",
  },
  {
    slug: "fitchner",
    name: "Fitchner au Barca",
    kind: "Mentor",
    register: "gold",
    firstBook: 1,
    arc: [
      { label: "Proctor of Mars", book: 1 },
      { label: "Ares", book: 2 },
      { label: "Killed by Cassius", book: 2 },
    ],
    note: "The Gold who loved a Red, lost her, and built the rebellion that found Darrow.",
    noteBook: 2,
  },
  {
    slug: "pax",
    name: "Pax",
    kind: "Son",
    register: "none",
    firstBook: 4,
    arc: [
      { label: "Absence", book: 4 },
      { label: "The Reaper", book: 4 },
      { label: "Dad", book: 6 },
    ],
    note: "The life Darrow is fighting to preserve, and the life his fighting keeps him out of.",
    noteBook: 4,
    dossier: "pax",
  },
  {
    slug: "ephraim",
    name: "Ephraim",
    kind: "Reluctant parallel",
    register: "none",
    firstBook: 4,
    arc: [
      { label: "Soldier", book: 4 },
      { label: "Thief", book: 4 },
      { label: "Worthy", book: 5 },
    ],
    note: "A veteran of the same war who came out of it believing in nothing, and found something worth dying for anyway.",
    noteBook: 5,
  },
  {
    slug: "lysander",
    name: "Lysander",
    kind: "Opposition",
    register: "gold",
    firstBook: 4,
    arc: [
      { label: "The heir", book: 4 },
      { label: "Exile", book: 4 },
      { label: "Return", book: 5 },
      { label: "The Society’s future", book: 6 },
    ],
    note: "Two men looking at the same civilization and reaching opposite conclusions.",
    noteBook: 4,
    dossier: "lysander",
  },
];
