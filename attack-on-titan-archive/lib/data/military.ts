// The military inside the Walls, branch by branch, and Marley's Warriors.
// Checked for this page: the three branches and the Training Corps; the
// Garrison as the largest branch, defending the Walls; the Survey Corps as
// the branch that goes beyond them, with the highest death rate; only the top
// ten graduates of a class may join the Military Police; Keith Shadis as the
// 12th Survey Corps commander, Erwin's predecessor, later head instructor of
// the Training Corps; Dot Pixis commanding the Garrison of the south; Nile Dok
// commanding the Military Police. The emblems are named, not drawn (they are
// the show's own marks). Other lines repeat the dossiers (lib/data/people.ts).

export type Branch = {
  id: string;
  name: string;
  emblem: string;
  role: string;
  joins: string;
  command: { name: string; note: string; slug?: string; sealed?: boolean }[];
  members: string[]; // dossier slugs
  record: string;
  sealed?: { label: string; text: string };
};

export const BRANCHES: Branch[] = [
  {
    id: "training",
    name: "Training Corps",
    emblem: "Two crossed swords",
    role: "Three years of training before a cadet chooses a branch. The 104th, Southern Division, enlisted in 847.",
    joins: "Any recruit of age. Graduation ranks the class; the ranking decides who may join the Military Police.",
    command: [{ name: "Keith Shadis", note: "Head instructor of the 104th; before that, 12th commander of the Survey Corps" }],
    members: ["eren", "mikasa", "armin", "jean", "sasha", "connie", "reiner", "annie", "historia", "ymir"],
    record: "Of the 104th's top ten, only Annie applied to the Military Police; Marco died at Trost before choosing; the rest joined the Survey Corps.",
  },
  {
    id: "garrison",
    name: "Garrison",
    emblem: "Roses",
    role: "The largest branch. Mans the Walls and the gates, keeps the districts, and is the first line when a Titan comes.",
    joins: "Most graduates: the Survey Corps dies too often and the Military Police takes only ten.",
    command: [{ name: "Dot Pixis", note: "Commander of the Garrison in the southern territory" }],
    members: [],
    record: "Trost, 850: the Garrison and the cadets lose 207 dead or missing holding the district until the gate is sealed.",
  },
  {
    id: "police",
    name: "Military Police",
    emblem: "A unicorn",
    role: "Keeps order inside Wall Sina and guards the King, as far from the Titans as a soldier can be.",
    joins: "Only the top ten graduates of a class, if they choose it.",
    command: [{ name: "Nile Dok", note: "Commander of the Military Police" }],
    members: ["annie"],
    record: "Its Interior Police kept a squad for the King's quieter work: the Anti-Personnel Control Squad.",
  },
  {
    id: "survey",
    name: "Survey Corps",
    emblem: "The Wings of Freedom",
    role: "The only branch that goes beyond the Walls: expeditions into Titan territory to take back land and learn what the Titans are. The highest death rate in the military.",
    joins: "Volunteers. Its oath: dedicate your hearts.",
    command: [
      { name: "Keith Shadis", note: "12th commander. The only one to step down alive" },
      { name: "Erwin Smith", note: "13th commander", slug: "erwin" },
      { name: "Hange Zoë", note: "14th commander", slug: "hange" },
      { name: "Armin Arlert", note: "15th commander", slug: "armin", sealed: true },
    ],
    members: ["erwin", "levi", "hange", "eren", "mikasa", "armin", "jean", "sasha", "connie", "historia"],
    record: "Shiganshina, 850: the Corps goes back for the district and the cellar. Only nine come back.",
  },
  {
    id: "warriors",
    name: "Marley's Warriors",
    emblem: "The red armband of an honorary Marleyan",
    role: "Eldian children from the internment zones, trained by Marley to inherit its Titans and fight its wars.",
    joins: "Chosen candidates, from 830. The few who inherit a Titan, and their families, become honorary Marleyans.",
    command: [{ name: "Zeke Yeager", note: "War Chief", slug: "zeke", sealed: true }],
    members: [],
    record: "Fort Slava, 854: the last battle of Marley's four-year war with the Mid-East Allied Forces.",
    sealed: { label: "who the Warriors were", text: "In 845 Marley sent four of them to Paradis: Bertholdt, Reiner, Annie and Marcel. Their files are in the archive." },
  },
];

