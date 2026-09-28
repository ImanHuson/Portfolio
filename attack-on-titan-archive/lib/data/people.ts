// Personnel files. Every factual line here was checked against sources
// (wiki pages via search, see CLAUDE.md) before it was written; where a detail
// could not be pinned down (an exact birth year, a hometown's name), it was
// left out rather than guessed. "Belief" lines are the archive's reading of a
// character, written as interpretation, not quotation.
//
// Six layers per file, from the brief: identity, history, relationships,
// belief, transformation, legacy. The last two spoil the ending and are
// sealed on the page behind a native <details>.

export type Tag = "military" | "titan" | "marley" | "royal" | "family" | "ideology" | "survivor";

export const TAGS: { id: Tag; label: string }[] = [
  { id: "military", label: "Military" },
  { id: "titan", label: "Titan" },
  { id: "marley", label: "Marley" },
  { id: "royal", label: "Royal" },
  { id: "family", label: "Family" },
  { id: "ideology", label: "Ideology" },
  { id: "survivor", label: "Survivor" },
];

export type Person = {
  slug: string;
  name: string;
  word: string; // the brief's one-word reading
  file: string; // archive number
  origin: string;
  unit: string;
  titan?: string;
  status: "Survived" | "Deceased" | "Killed in action";
  statusNote?: string;
  tags: Tag[];
  identity: string;
  history: string;
  relationships: string;
  belief: string;
  transformation: string;
  legacy: string;
};

export const PEOPLE: Person[] = [
  {
    slug: "eren",
    name: "Eren Yeager",
    word: "Freedom",
    file: "SC-104-05",
    origin: "Shiganshina District, Wall Maria",
    unit: "104th Cadet Corps, then the Survey Corps",
    titan: "Attack Titan, Founding Titan",
    status: "Deceased",
    statusNote: "854",
    tags: ["military", "titan", "family", "ideology"],
    identity:
      "Son of Grisha and Carla Yeager, raised in Shiganshina. A boy who wanted to see what lay beyond the Walls, and could not stand being kept inside them.",
    history:
      "He watched his mother die the day Wall Maria fell in 845. He enlisted in the 104th Cadet Corps in 847, graduated fifth in 850, and chose the Survey Corps.",
    relationships:
      "Mikasa and Armin, his family in everything but blood. Grisha, whose memories he inherited. Zeke, the half-brother who meant to use him. Reiner, the enemy who turned out to be a mirror.",
    belief: "That freedom is worth any price, and that he was born into this world to take it back.",
    transformation:
      "His father gave him the Titan power in 845. The boy who swore to kill every Titan became the man who led the raid on Liberio, and then set the Rumbling walking.",
    legacy:
      "Killed by Mikasa in 854, which stopped the Rumbling and ended the power of the Titans. What he did is the question the story leaves behind.",
  },
  {
    slug: "mikasa",
    name: "Mikasa Ackerman",
    word: "Attachment",
    file: "SC-104-01",
    origin: "Mountain farmlands, southern Wall Maria",
    unit: "104th Cadet Corps, then the Survey Corps",
    status: "Survived",
    tags: ["military", "family", "survivor"],
    identity:
      "Daughter of an Ackerman father and a mother of the Azumabito clan. After her parents were killed, the Yeagers took her in.",
    history:
      "Traffickers murdered her parents in 844 and took her; Eren came for her. She graduated first of the 104th Cadet Corps in 850.",
    relationships: "Eren, above everything, and the scarf he wrapped around her. Armin. Levi, the other Ackerman.",
    belief: "That the people she loves are the whole world, and that she will stand between them and anything.",
    transformation: "In the end she chose to stop Eren herself.",
    legacy: "She survived. She buried Eren beneath the tree on the hill where the three of them used to rest as children.",
  },
  {
    slug: "armin",
    name: "Armin Arlert",
    word: "Curiosity",
    file: "SC-104-A",
    origin: "Shiganshina District, Wall Maria",
    unit: "104th Cadet Corps, then the Survey Corps; its 15th Commander",
    titan: "Colossal Titan",
    status: "Survived",
    tags: ["military", "titan", "survivor"],
    identity:
      "Raised by his grandfather, who kept a forbidden book about the world outside. He dreamed of seeing the sea before he dreamed of fighting.",
    history:
      "He escaped Shiganshina in 845. His grandfather was sent out in the 846 reclamation of Wall Maria and did not come back. He became the 104th's strategist.",
    relationships: "Eren and Mikasa. Erwin, whose life was weighed against his. Bertholdt, whose power he carries. Annie.",
    belief: "That talking is not weakness, and that understanding an enemy is where ending a war begins.",
    transformation:
      "In 850, dying on a Shiganshina rooftop, he was given the Titan serum instead of Erwin, by Levi's choice, and inherited the Colossal Titan from Bertholdt.",
    legacy: "Hange named him 15th Commander before they died. He survived the Rumbling and went back to the island to talk peace.",
  },
  {
    slug: "levi",
    name: "Levi Ackerman",
    word: "Duty",
    file: "SC-CPT-01",
    origin: "The Underground City, beneath the capital",
    unit: "Survey Corps, Captain",
    status: "Survived",
    statusNote: "gravely wounded",
    tags: ["military", "family", "survivor"],
    identity: "Called humanity's strongest soldier. An Ackerman, born and raised in the Underground City.",
    history:
      "His uncle Kenny raised him until he could fend for himself, then left. He was a thug in the Underground when Erwin Smith recruited him into the Survey Corps.",
    relationships: "Erwin, whose last order he carried. His squads, most of whom he outlived. Hange. Kenny.",
    belief: "That no one knows which choice they won't regret. You choose, and then you carry it.",
    transformation:
      "At Shiganshina in 850 he gave the serum to Armin instead of Erwin. In 854 he kept his promise and killed Zeke.",
    legacy: "He survived the war, badly wounded, one of the last of the old Survey Corps.",
  },
  {
    slug: "erwin",
    name: "Erwin Smith",
    word: "Truth",
    file: "SC-CMD-13",
    origin: "Within the Walls",
    unit: "Survey Corps, 13th Commander",
    status: "Killed in action",
    statusNote: "850",
    tags: ["military", "ideology"],
    identity: "The 13th Commander of the Survey Corps, and the son of a schoolteacher.",
    history:
      "As a boy he repeated his father's doubts about the official history in public. His father was killed for them. Erwin spent his life trying to prove those doubts true.",
    relationships: "Levi. Hange, who succeeded him. Every soldier he sent into a charge.",
    belief: "That the truth about the world was worth everything, including the soldiers he loved.",
    transformation:
      "At Shiganshina in 850 he led the recruits in a charge into the Beast Titan's barrage, knowing what it was, so that Levi could reach Zeke.",
    legacy: "He died in that charge without ever seeing the basement. Hange became the 14th Commander.",
  },
  {
    slug: "hange",
    name: "Hange Zoë",
    word: "Knowledge",
    file: "SC-CMD-14",
    origin: "Within the Walls",
    unit: "Survey Corps, Squad Leader, then 14th Commander",
    status: "Killed in action",
    statusNote: "854",
    tags: ["military", "ideology"],
    identity: "The Survey Corps' Titan researcher: a squad leader who wanted to understand the thing everyone else only wanted to kill.",
    history:
      "Hange studied Titans in the field and in captivity, and became the 14th Commander after Erwin's death, leading the Corps through the years of Marley.",
    relationships: "Levi. Erwin. Moblit, their aide. Armin, their chosen successor.",
    belief: "That anything, even a Titan, can be understood if you look closely enough and long enough.",
    transformation: "When Eren began the Rumbling, Hange led the alliance of former enemies that set out to stop him.",
    legacy:
      "They stayed behind to hold off the Colossal Titans so the flying boat could escape, and named Armin 15th Commander before they went.",
  },
  {
    slug: "jean",
    name: "Jean Kirstein",
    word: "Choice",
    file: "SC-104-06",
    origin: "Trost District, Wall Rose",
    unit: "104th Cadet Corps, then the Survey Corps",
    status: "Survived",
    tags: ["military", "survivor"],
    identity: "A boy from Trost who meant to join the Military Police and live safely in the interior.",
    history:
      "He graduated sixth of the 104th in 850. The death of his friend Marco in the Battle of Trost changed his mind, and he joined the Survey Corps.",
    relationships: "Marco. Eren, his rival. Mikasa. Connie and Sasha.",
    belief: "That the right thing is harder than the safe thing, and that he is the kind of person who can tell the difference.",
    transformation: "He became the one the others looked to. In the end he chose to stand against Eren.",
    legacy: "He survived the Rumbling and went back to the island to talk peace.",
  },
  {
    slug: "sasha",
    name: "Sasha Braus",
    word: "Humanity",
    file: "SC-104-09",
    origin: "A hunting village in the forests of Wall Rose",
    unit: "104th Cadet Corps, then the Survey Corps",
    status: "Killed in action",
    statusNote: "854",
    tags: ["military"],
    identity: "A hunter's daughter, famous in her class for eating a stolen potato in front of an instructor.",
    history: "She graduated ninth of the 104th in 850 and became one of the Survey Corps' best shots.",
    relationships: "Connie and Jean. Her father. Kaya, the girl she saved in 850. Niccolo, the Marleyan cook.",
    belief: "That a stranger is still someone worth saving.",
    transformation: "She fought in the raid on Liberio in 854.",
    legacy: "Gabi shot her aboard the airship leaving Liberio. Her last word was “meat.”",
  },
  {
    slug: "connie",
    name: "Connie Springer",
    word: "Home",
    file: "SC-104-08",
    origin: "Ragako, Wall Rose",
    unit: "104th Cadet Corps, then the Survey Corps",
    status: "Survived",
    tags: ["military", "survivor"],
    identity: "A boy from the village of Ragako, the loudest laugh in the 104th.",
    history:
      "He graduated eighth of the 104th in 850. That same year he found Ragako empty, and his mother turned into a Titan.",
    relationships: "Sasha and Jean. His mother.",
    belief: "That there must be a way to bring the people he lost back.",
    transformation: "He came close to feeding Falco to his mother to restore her, and stopped.",
    legacy: "He survived the Rumbling and went back to the island to talk peace.",
  },
  {
    slug: "reiner",
    name: "Reiner Braun",
    word: "Guilt",
    file: "MR-WAR-02",
    origin: "Liberio internment zone, Marley",
    unit: "Marleyan Warrior Unit; also the 104th Cadet Corps",
    titan: "Armored Titan",
    status: "Survived",
    tags: ["military", "titan", "marley", "survivor"],
    identity: "An Eldian from Liberio who became a Warrior so that he could be seen as a good one.",
    history:
      "He came to Paradis in 845 with the other Warriors and broke the inner gate of Wall Maria as the Armored Titan. Then he trained in the 104th beside the people he had wronged, and graduated second.",
    relationships: "Bertholdt and Annie. Eren. Gabi, his cousin. His mother.",
    belief: "Split between the soldier he pretended to be on the island and the Warrior he was sent to be.",
    transformation: "Back in Marley he carried what he had done like a weight. In the end he fought beside Paradis to stop Eren.",
    legacy: "He survived the Rumbling and went back to the island to talk peace.",
  },
  {
    slug: "annie",
    name: "Annie Leonhart",
    word: "Distance",
    file: "MR-WAR-04",
    origin: "Liberio internment zone, Marley",
    unit: "Marleyan Warrior Unit; also the 104th Cadet Corps and the Military Police",
    titan: "Female Titan",
    status: "Survived",
    tags: ["military", "titan", "marley", "survivor"],
    identity: "A Warrior trained to fight by her father, who wanted most of all to go home to him.",
    history:
      "She came to Paradis in 845, graduated fourth of the 104th and joined the Military Police. In 850 she was exposed as the Female Titan in Stohess and sealed herself in crystal.",
    relationships: "Her father. Armin. Reiner and Bertholdt.",
    belief: "That keeping her distance from everyone was the only way to keep her promise.",
    transformation: "She came out of the crystal in 854, as the Rumbling began.",
    legacy: "She survived the Rumbling.",
  },
  {
    slug: "historia",
    name: "Historia Reiss",
    word: "Identity",
    file: "SC-104-10",
    origin: "The Reiss estate, Wall Rose",
    unit: "104th Cadet Corps (as Krista Lenz), then the Survey Corps",
    status: "Survived",
    statusNote: "Queen",
    tags: ["military", "royal", "survivor"],
    identity: "The unwanted daughter of Rod Reiss, hidden in the 104th under the name Krista Lenz.",
    history:
      "She graduated tenth of the 104th in 850 under her false name. When the truth came out, she refused to become the Founding Titan's vessel and was crowned queen.",
    relationships: "Ymir. Her father Rod. Her half-sister Frieda. Eren.",
    belief: "That she could live for herself, not for the part other people wrote for her.",
    transformation: "As queen she turned a farm into a home for orphans.",
    legacy: "She survived as queen of Paradis.",
  },
  {
    slug: "ymir",
    name: "Ymir",
    word: "A second life",
    file: "SC-104-Y",
    origin: "Marley",
    unit: "104th Cadet Corps, then the Survey Corps",
    titan: "Jaw Titan",
    status: "Deceased",
    tags: ["military", "titan", "marley"],
    identity:
      "An orphan in Marley who was made the figurehead of a cult, then turned into a Titan and exiled to Paradis as punishment.",
    history:
      "She wandered outside the Walls as a Titan for about sixty years, until in 845 she ate Marcel Galliard and became human again. She joined the 104th alongside Historia.",
    relationships: "Historia. Reiner and Bertholdt.",
    belief: "That a person should live for themselves.",
    transformation: "In 850 she left with Reiner and Bertholdt for Marley, by her own choice.",
    legacy: "She gave herself up in Marley and was eaten by Porco Galliard, returning the Jaw Titan. She left Historia a letter.",
  },
  {
    slug: "zeke",
    name: "Zeke Yeager",
    word: "Escape",
    file: "MR-WAR-01",
    origin: "Liberio internment zone, Marley",
    unit: "Marleyan Warrior Unit, War Chief",
    titan: "Beast Titan",
    status: "Deceased",
    statusNote: "854",
    tags: ["military", "titan", "marley", "family", "ideology"],
    identity: "Son of Grisha Yeager and Dina Fritz; Eren's half-brother.",
    history:
      "As a child he reported his parents to the Marleyan authorities. He grew up to become the Beast Titan and the War Chief of Marley's Warriors.",
    relationships: "Grisha. Tom Ksaver, the mentor who taught him to play catch. Eren. Levi.",
    belief: "That the kindest thing for the Eldians would be never to have been born.",
    transformation: "He planned to use the Founding Titan to end the Eldian people without killing anyone living.",
    legacy: "In 854 he chose to help stop Eren, and Levi killed him.",
  },
  {
    slug: "gabi",
    name: "Gabi Braun",
    word: "Inheritance",
    file: "MR-CAN-01",
    origin: "Liberio internment zone, Marley",
    unit: "Marleyan Warrior candidate",
    status: "Survived",
    tags: ["military", "marley", "family", "survivor"],
    identity: "Reiner's cousin, the leading candidate to inherit the Armored Titan.",
    history:
      "She believed what Marley taught her, that the people on the island were devils. After the raid on Liberio she stowed away aboard the Survey Corps' airship.",
    relationships: "Falco. Reiner. Sasha, whom she killed, and Sasha's family, who took her in anyway.",
    belief: "At first, that the island was full of devils.",
    transformation: "Living among the people she had been taught to hate, she stopped believing it.",
    legacy: "She survived the Rumbling.",
  },
  {
    slug: "grisha",
    name: "Grisha Yeager",
    word: "Restoration",
    file: "SH-DOC-01",
    origin: "Liberio internment zone, Marley",
    unit: "Eldian Restorationists; later a doctor in Shiganshina",
    titan: "Attack Titan, Founding Titan",
    status: "Deceased",
    statusNote: "845",
    tags: ["titan", "marley", "family", "ideology"],
    identity: "A doctor in Shiganshina, the father of Zeke and of Eren.",
    history:
      "In Marley he fought for the Eldian Restorationists. Sent to Paradis, he carried the Attack Titan into the Walls, married Carla, and practised as a doctor.",
    relationships: "Dina and Zeke. Carla and Eren. Eren Kruger, the Owl.",
    belief: "That Eldia deserved to be restored.",
    transformation: "In 845 he took the Founding Titan from the Reiss family and gave both Titans to Eren.",
    legacy: "What he left in the basement: three books of his own writing, and one photograph.",
  },
];

export const getPerson = (slug: string) => PEOPLE.find((p) => p.slug === slug);
