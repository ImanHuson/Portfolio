// AOT-06, The World. Every line was checked (via search, against the series
// wiki's entries for Eldia, Karl Fritz, the Great Titan War, Liberio, the
// Warriors, the Paradis Island Operation, Fort Slava and the Marley Mid-East
// War, and character pages). Season 4 Part 2 and later is sealed.

/** The pull-back: from the Walls to the island to the world. */
export const PULLBACK: { at: number; until: number; text: string; big?: boolean }[] = [
  { at: 0.02, until: 0.2, text: "For a hundred years, this was the whole world: three Walls." },
  { at: 0.26, until: 0.46, text: "The Walls stand on an island. The world outside calls it Paradis." },
  { at: 0.52, until: 0.72, text: "Across the sea is a continent, and a nation called Marley." },
  { at: 0.8, until: 1.01, text: "You thought you were looking at the whole world. You were looking at one island.", big: true },
];

export const MAP_NOTE =
  "Coastlines: our own world, flipped north to south. The author has said he made the world of the story a mirror image of ours; Paradis sits where Madagascar is, and Marley's continent is Africa, upside down. Only Paradis and the Marleyan mainland are marked. The Walls are drawn as a mark, not to scale: at the story's own figures Wall Maria is 960 km across, wider than an island of this shape, and the series never reconciles the two.";

export const FILE_HEAD = ["Marleyan Archive", "Military Intelligence", "Subject: Eldian question", "Access: restricted"];

/** The Eldian question, as a Marleyan file would set it out. */
export const HISTORY: { label: string; text: string; sealed?: string }[] = [
  {
    label: "Origin",
    text: "Ymir Fritz gained the power of the Titans. With it, the Eldian Empire conquered Marley and held the continent for some 1,700 years.",
  },
  {
    label: "The Great Titan War",
    text: "Civil war broke out among the Eldian houses that held the Nine Titans. The 145th King, Karl Fritz, turned his back on the fighting.",
  },
  {
    label: "The retreat",
    text: "Karl Fritz took the royal family and many Eldians to the island of Paradis, raised the Walls, and used the Founding Titan to erase the memory of the outside world from most of the people inside.",
    sealed: "He had conspired in secret with the Tybur family, holders of the War Hammer Titan, who then sided with Marley against the other Eldian houses.",
  },
  {
    label: "Marley",
    text: "Marley took seven of the Nine Titans and turned the war.",
  },
];

export const INTERNMENT: { label: string; text: string }[] = [
  {
    label: "The zones",
    text: "Eldians who stayed on the continent live in internment zones. In the city of Liberio, the zone is ringed by a wall taller than any building inside it, and Public Security guards decide who goes in and out.",
  },
  {
    label: "The armband",
    text: "Every Eldian must wear a yellow armband. They may not go beyond the zone without permission.",
  },
  {
    label: "Paradise",
    text: "Eldians convicted of crimes against Marley are taken to the coast of Paradis and turned into Pure Titans. That is what Marley calls sending someone to Paradise.",
  },
  {
    label: "Devils",
    text: "Marley teaches, and much of the world believes, that the Eldians are devils. The ones on the island most of all.",
  },
];

export const WARRIORS = {
  program:
    "In 830, Marley asked Eldians to offer their children as Warrior candidates. The few chosen inherit one of Marley's Titans; they and their families are made Honorary Marleyans, with better treatment and a red armband.",
  mission:
    "In 845, Marley sent four Warriors to Paradis to take the Founding Titan from the royal family: Bertholdt Hoover, the Colossal Titan; Reiner Braun, the Armored Titan; Annie Leonhart, the Female Titan; and Marcel Galliard, the Jaw Titan.",
  marcel: "Before they reached the Walls, a Titan caught Reiner. Marcel pushed him clear and was eaten in his place. The other three went on.",
  war: "When the mission failed, Marley fought the Mid-East Allied Forces for four years. At Fort Slava, in 854, anti-Titan artillery could kill a Titan with one shot, and the Allied battleships' shells mauled the Armored Titan. Marley won with airships and the Beast Titan.",
};

/** People in the file, linked to their dossiers (portraits exist for these). */
export const WARRIOR_FILES = [
  { slug: "reiner", name: "Reiner Braun", note: "Armored Titan. Sent in 845." },
  { slug: "annie", name: "Annie Leonhart", note: "Female Titan. Sent in 845." },
  { slug: "zeke", name: "Zeke Yeager", note: "Beast Titan. Warrior chief." },
  { slug: "gabi", name: "Gabi Braun", note: "Warrior candidate, 854. Reiner's cousin." },
];

export type MirrorStage = { stage: string; left: string; right: string; leftSealed?: string; rightSealed?: string };

/** Eren / Reiner. Both sides of each stage are verified; the ending is sealed. */
export const MIRROR: { left: string; right: string; leftSlug: string; rightSlug: string; stages: MirrorStage[] } = {
  left: "Eren",
  right: "Reiner",
  leftSlug: "eren",
  rightSlug: "reiner",
  stages: [
    {
      stage: "Child",
      left: "Shiganshina, inside Wall Maria. He wants to see the world beyond the Walls.",
      right: "Liberio, inside the internment zone. His father is Marleyan and may not see him.",
    },
    {
      stage: "Training",
      left: "The 104th Cadet Corps. He graduates fifth.",
      right: "The weakest of the Warrior candidates. Later, in the 104th, he graduates second.",
    },
    {
      stage: "Inheritance",
      left: "His father makes him a Titan the night Shiganshina falls.",
      right: "Chosen for the Armored Titan, and told it was not for his ability.",
    },
    {
      stage: "First kill",
      left: "At nine, he kills the traffickers who took Mikasa.",
      right: "At the Walls, in 845, the Armored Titan breaks the inner gate. Wall Maria falls.",
    },
    {
      stage: "War",
      left: "Trost, the forest, Stohess, Shiganshina.",
      right: "Shiganshina again, then four years on Marley's front, to Fort Slava.",
    },
    {
      stage: "Home destroyed",
      left: "Shiganshina, 845, by the Colossal and Armored Titans.",
      right: "Liberio, 854.",
      rightSealed: "By Eren.",
    },
    {
      stage: "Isolation",
      left: "He goes to Marley alone, as a wounded Eldian soldier called Kruger.",
      right: "A soldier to the 104th he betrayed, a devil to Marley, a Warrior to his own people.",
    },
    {
      stage: "Choice",
      left: "Sealed.",
      right: "Sealed.",
      leftSealed: "He sets off the Rumbling.",
      rightSealed: "He joins his old enemies to stop it.",
    },
  ],
};
