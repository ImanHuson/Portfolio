// The six published books. Verified against sources (see CLAUDE.md for the
// fact-check notes): publication years; point-of-view narrators (Iron Gold is
// Darrow / Lyria / Ephraim / Lysander. Virginia is NOT a narrator until Dark
// Age, a correction to the build brief); settings. Narrative copy is the
// archive’s own framing, not publisher text.
//
// Spoiler model: `premise` is safe for a reader who has finished the PREVIOUS
// book (clearance n-1). `chapters` is gated behind finishing THIS book (n).

export type Book = {
  n: 1 | 2 | 3 | 4 | 5 | 6;
  numeral: string;
  slug: string;
  title: string;
  subtitle: string;
  published: number;
  narrators: string[];
  settings: string[];
  premise: string[];
  chapters: string[][];
  closing: string;
  themes: string[];
  memories: string[];
};

export const BOOKS: Book[] = [
  {
    n: 1,
    numeral: "I",
    slug: "red-rising",
    title: "Red Rising",
    subtitle: "The end of the world he knew",
    published: 2014,
    narrators: ["Darrow"],
    settings: ["Lykos, Mars", "Yorkton, Mars", "The Institute"],
    premise: [
      "Mars. A mining colony. A young Red who has never seen the sky.",
      "Darrow’s life is small because the Society has made it small. He digs. He loves Eo. He dreams of a future he has never been allowed to see.",
    ],
    chapters: [
      [
        "Then Eo dies.",
        "She sings a song the Golds have banned, and ArchGovernor Nero au Augustus has her hanged for it while Darrow watches. Her last words are an instruction: break the chains.",
      ],
      [
        "Darrow discovers that the future he was promised already exists.",
        "The surface is green. Humanity has conquered the Solar System. The Reds are not preparing Mars for anyone. They are slaves maintaining a lie.",
      ],
      [
        "So the Sons of Ares make him into something the Society was never supposed to create: a Red inside a Gold.",
        "In Yorkton, a Violet carver named Mickey rebuilds his body. Then Darrow enters the Institute, and the Passage begins.",
        "Friendships become rivalries. Children become commanders. The game becomes war.",
      ],
    ],
    closing:
      "The first terrible lesson of revolution: to destroy a world, you may have to become fluent in the language of the people who built it.",
    themes: ["Sacrifice", "Identity", "Class", "Love", "Rage", "Transformation", "Survival"],
    memories: [
      "The Laurel",
      "Eo’s song",
      "The carving",
      "The Passage",
      "House Mars",
      "Mustang",
      "Sevro",
      "Cassius",
      "Pax au Telemanus",
      "The Jackal",
      "The Proctors",
    ],
  },
  {
    n: 2,
    numeral: "II",
    slug: "golden-son",
    title: "Golden Son",
    subtitle: "The rise of the Reaper",
    published: 2015,
    narrators: ["Darrow"],
    settings: ["Mars", "Luna"],
    premise: [
      "Darrow has survived the Institute. Now he has to survive the real world.",
      "The Institute taught him how to conquer a castle. The Society teaches him how to conquer a civilization.",
    ],
    chapters: [
      [
        "Gold politics are more dangerous than swords, because everyone smiles before they stab you.",
        "House Augustus. House Bellona. The Sovereign. The Moon Lords. The Olympic Knights. The Sons of Ares. And Darrow, still secretly a Red, standing in the middle of all of them.",
      ],
      [
        "At the Gala on Luna he walks to the Bellona table and challenges Cassius. He wins easily; the old Rage Knight Lorn au Arcos has been training him. Mustang stops the killing blow. The duel was never about Cassius. It was built to start a Gold civil war, and it does.",
      ],
      [
        "This is where the revolution stops being an infiltration and becomes a war. The Iron Rain descends on Mars.",
        "Then comes the Triumph meant to crown him. Roque poisons him. The Jackal’s strike massacres the hall. Lorn dies. Nero dies by his own son’s hand. Ares is already dead, and it was Cassius who killed him.",
      ],
    ],
    closing: "Victory can cost almost as much as defeat. Sometimes it costs more.",
    themes: ["Ambition", "Friendship", "Betrayal", "War", "Political power", "Reputation", "Revenge"],
    memories: [
      "The Gala on Luna",
      "The duel with Cassius",
      "Lorn’s training",
      "The Iron Rain",
      "Ragnar",
      "Roque",
      "The Triumph",
    ],
  },
  {
    n: 3,
    numeral: "III",
    slug: "morning-star",
    title: "Morning Star",
    subtitle: "The Rising",
    published: 2016,
    narrators: ["Darrow"],
    settings: ["Mars", "The Rim", "Luna"],
    premise: [
      "Darrow has been broken. The Society thinks the Reaper is finished.",
      "They are wrong.",
    ],
    chapters: [
      [
        "The rebellion has grown beyond one man. Sevro has become Ares. Mustang has become a political force of her own. Ragnar finds a freedom his people were never supposed to know existed, and fights for it until Aja au Grimmus cuts him down. He asks Darrow to finish it. Darrow does.",
      ],
      [
        "Cassius has to decide what honor means when the people who taught it to him are monsters. Roque chooses his own ending rather than surrender. The Jackal remains the Jackal.",
      ],
      [
        "On Luna the old order falls. Darrow kills the Sovereign. The Jackal is taken alive, and later hanged.",
        "And Darrow finally understands that revolution is not only the tearing down of a world. Someone has to build the next one.",
      ],
    ],
    closing: "The book about hope surviving long enough to become responsibility.",
    themes: ["Freedom", "Loyalty", "Forgiveness", "Brotherhood", "Sacrifice", "Hope", "Liberation"],
    memories: [
      "The rescue",
      "The Howlers",
      "The Obsidians",
      "Ragnar’s last fight",
      "Roque’s end",
      "Cassius’s choice",
      "The Fall of Luna",
    ],
  },
  {
    n: 4,
    numeral: "IV",
    slug: "iron-gold",
    title: "Iron Gold",
    subtitle: "The cost of victory",
    published: 2018,
    narrators: ["Darrow", "Lyria", "Ephraim", "Lysander"],
    settings: ["Luna", "Mars", "The Belt", "Mercury"],
    premise: [
      "Ten years. That is the distance between the Fall of Luna and this book.",
      "The revolution won. The war did not end.",
    ],
    chapters: [
      [
        "Darrow is no longer simply the rebel. He is a husband. A father. A military commander. A symbol. And sometimes symbols become prisons.",
      ],
      [
        "For the first time the story is not only his. Four lives show what the Republic looks like from different sides:",
        "Darrow, still fighting the war. Lyria, a Red the liberation was supposed to save, living in conditions worse than the ones Darrow grew up in. Ephraim, a former soldier turned thief. Lysander, the old Sovereign’s grandson, drifting through the Belt with Cassius as his guardian.",
      ],
      [
        "Around them: Virginia and the Senate. Pax. The Howlers. The Rim. The Society Remnant. The people who were liberated, and the people who learned that liberation did not automatically make their lives better.",
      ],
    ],
    closing: "The question the first trilogy could postpone: what happens after you win?",
    themes: ["Consequences", "Trauma", "Parenthood", "Political instability", "Generational change", "Disillusionment", "Legacy"],
    memories: ["Ten years later", "The Senate", "Lyria", "Ephraim’s heist", "Lysander and Cassius in the Belt", "Mercury"],
  },
  {
    n: 5,
    numeral: "V",
    slug: "dark-age",
    title: "Dark Age",
    subtitle: "The world burns",
    published: 2019,
    narrators: ["Darrow", "Virginia", "Lysander", "Ephraim", "Lyria"],
    settings: ["Mercury", "Luna", "Mars"],
    premise: [
      "Mercury. Mars. Luna. The Republic fractures.",
      "Virginia takes up the story for the first time, holding a government together while the Reaper fights on a planet most people have only seen in reports.",
    ],
    chapters: [
      [
        "Lysander returns to the center of history. Darrow becomes a myth large enough to crush the man beneath it. In Heliopolis, the war becomes industrial. Brutal. Personal.",
      ],
      [
        "The characters are no longer playing at war. They are living inside it. Harmony’s Red Hand kills Sevro and Victra’s newborn son. Ephraim, broken and half-blind, dies in the act that finally makes him worth something, and Volsung Fá tells him so.",
      ],
      [
        "The heroic language of revolution collides with the machinery of war. Children inherit wars they did not start. Old ideologies put on new uniforms.",
      ],
    ],
    closing: "The people who survive begin to wonder whether survival itself is enough.",
    themes: ["Brutality", "Trauma", "Ideology", "Survival", "Civilization", "Myth", "Moral exhaustion"],
    memories: ["The siege of Heliopolis", "Virginia’s first chapters", "Harmony’s Red Hand", "Ulysses", "Ephraim’s last act", "Volsung Fá"],
  },
  {
    n: 6,
    numeral: "VI",
    slug: "light-bringer",
    title: "Light Bringer",
    subtitle: "The way home",
    published: 2023,
    narrators: ["Darrow", "Lyria", "Virginia", "Lysander"],
    settings: ["Mars", "Phobos"],
    premise: [
      "Mercury is lost. Darrow is far from home. Mars is under siege.",
      "The Republic is wounded, and Lysander carries the Society toward the future he believes it deserves.",
    ],
    chapters: [
      [
        "Somewhere between the battlefield and home, Darrow begins to confront the question he has spent six books avoiding: who is Darrow when he is not fighting?",
      ],
      [
        "Light Bringer is smaller in some ways. More intimate. It remembers that underneath fleets and empires are friendships. Brothers. Wives. Children. Old promises. Old grief.",
      ],
      [
        "And Cassius au Bellona, son of Tiberius, son of Julia, brother of Darrow, runs forward in dead armor and names himself one last time. His honor remains.",
      ],
    ],
    closing: "The war is still enormous. The heart of the story is not.",
    themes: ["Redemption", "Friendship", "Brotherhood", "Grief", "Hope", "Legacy", "Transformation"],
    memories: ["Mars under siege", "The Battle for Phobos", "The way home", "Cassius’s last charge"],
  },
];

export const getBook = (slug: string) => BOOKS.find((b) => b.slug === slug);
