// AOT-07, The War. Checked (via search) against the series wiki's entries
// for each battle, the districts, the omni-directional mobility gear, the
// Thunder Spear, and each person on the memorial. Positions on the battle
// map are schematic: the districts sit where the story puts them (Trost and
// Shiganshina south, Karanes east of Wall Rose, Stohess east of Wall Sina),
// but the story gives no survey of the land, so the terrain is illustrative,
// and Utgard Castle and the Forest of Giant Trees are placed approximately.

export type Side = "titan" | "scout" | "garrison" | "marley";
/** The site has one accent: Titans carry it; the human sides are told apart by value on the paper scale, and are named in every key. */
export const SIDE_CSS: Record<Side, string> = { titan: "#e0685c", scout: "#d8d0b8", garrison: "#a39c87", marley: "#7f7a6b" };

export type Battle = {
  id: string;
  year: number;
  name: string;
  /** schematic position on the Walls map: angle in degrees clockwise from north, radius in km */
  at: { deg: number; km: number };
  approx?: boolean;
  summary: string;
  beats: string[];
  sealed?: string;
  /** schematic movement: who converges on the site */
  forces: { side: Side; label: string }[];
};

// Walls at the story's own radii (km)
export const WALL_KM = { sina: 250, rose: 380, maria: 480 };

export const BATTLES: Battle[] = [
  {
    id: "trost",
    year: 850,
    name: "Trost District",
    at: { deg: 180, km: WALL_KM.rose },
    summary: "Five years after Shiganshina, the Colossal Titan appears again and kicks in the outer gate of Trost, on the southern edge of Wall Rose.",
    beats: [
      "The Titans pour in; the new cadets of the 104th are thrown into the defence.",
      "Eren is eaten, and comes out of the Titan that ate him as a Titan himself.",
      "He carries a boulder to the breach and seals the gate. For the first time, humanity takes ground back from the Titans.",
    ],
    forces: [
      { side: "titan", label: "Titans" },
      { side: "garrison", label: "Garrison and cadets" },
    ],
  },
  {
    id: "forest",
    year: 850,
    name: "The 57th Expedition",
    at: { deg: 128, km: 445 },
    approx: true,
    summary: "With Trost's gate sealed, the Survey Corps rides out from Karanes, on the eastern edge of Wall Rose, to plot a new route to Shiganshina.",
    beats: [
      "The Female Titan tears through the formation, looking for Eren.",
      "In the Forest of Giant Trees she is caught in a trap, and gets away.",
      "In the forest she kills Levi's squad: Petra, Oluo, Eld and Gunther.",
    ],
    forces: [
      { side: "titan", label: "The Female Titan" },
      { side: "scout", label: "Survey Corps" },
    ],
  },
  {
    id: "stohess",
    year: 850,
    name: "Stohess District",
    at: { deg: 90, km: WALL_KM.sina },
    summary: "Back inside the Walls, the Survey Corps sets a trap in Stohess, on the eastern edge of Wall Sina, for a Military Police soldier it suspects: Annie Leonhart.",
    beats: [
      "Annie transforms in the streets, and the Female Titan and Eren fight through the district.",
      "Beaten, she seals herself in crystal.",
    ],
    forces: [
      { side: "titan", label: "The Female Titan" },
      { side: "scout", label: "Survey Corps" },
    ],
  },
  {
    id: "utgard",
    year: 850,
    name: "Utgard Castle",
    at: { deg: 250, km: 355 },
    approx: true,
    summary: "Titans appear inside Wall Rose. Soldiers of the Survey Corps shelter in Utgard, an abandoned castle near the Wall, and Titans attack it by night.",
    beats: [
      "Ymir transforms to save Historia and the others.",
      "The Beast Titan hurls chunks of stone at the tower. Lynne and Henning are killed; Nanaba and Gelgar fight until their gas and blades run out.",
    ],
    forces: [
      { side: "titan", label: "Titans" },
      { side: "scout", label: "Survey Corps" },
    ],
  },
  {
    id: "shiganshina",
    year: 850,
    name: "Shiganshina District",
    at: { deg: 180, km: WALL_KM.maria },
    summary: "The Survey Corps goes back to Shiganshina to retake Wall Maria and reach the basement.",
    beats: [
      "Thunder Spears, built by Hange's engineers for the purpose, blow through the Armored Titan's armour.",
      "Erwin leads a last charge at the Beast Titan, knowing it is suicide, so Levi can reach it.",
      "The Colossal Titan's blast burns the district. Armin draws its heat so Eren can strike.",
      "Of the Survey Corps who rode to Shiganshina, nine came back.",
    ],
    forces: [
      { side: "titan", label: "Colossal, Armored and Beast Titans" },
      { side: "scout", label: "Survey Corps" },
    ],
  },
];

/** Across the sea: not on the map of the Walls. */
export const MAINLAND = [
  {
    id: "slava",
    year: 854,
    name: "Fort Slava",
    text: "The last battle of Marley's four-year war with the Mid-East Allied Forces. Anti-Titan artillery could kill a Titan with one shot; the Allied battleships mauled the Armored Titan. Marley won with airships and the Beast Titan.",
  },
  {
    id: "liberio",
    year: 854,
    name: "Liberio",
    text: "At a festival in Liberio, Willy Tybur declares war on Paradis before the world. Eren, hidden in the internment zone, transforms beneath the stage and kills him. The Survey Corps strikes from the rooftops and the air; Eren fights the War Hammer Titan and takes its power.",
    sealed: "On the airship out, Gabi Braun shoots Sasha Braus.",
  },
];

/** The gear, part by part. `explode` is the direction the part moves when the model is taken apart. */
export const ODM_PARTS: { id: string; name: string; text: string }[] = [
  { id: "harness", name: "Harness", text: "Straps around the legs, waist and chest hold the whole gear to the body." },
  { id: "unit", name: "Main unit", text: "Worn at the back of the belt: a small gas-driven turbine and two spools of wire, one for each anchor." },
  { id: "anchors", name: "Anchors", text: "Fired on their wires by gas, they bite into a wall, a tree or a Titan; the spools reel the soldier in." },
  { id: "boxes", name: "Blade boxes", text: "Worn at the hips. They hold the spare blades, and the gas canisters ride on top of them." },
  { id: "canisters", name: "Gas canisters", text: "Long, thin canisters on top of the blade boxes hold the gas that drives everything. At Utgard, Nanaba and Gelgar fought until theirs ran out." },
  { id: "grips", name: "Grips and triggers", text: "Two handles control the gear: triggers fire and reel the anchors and release the gas, and the same handles lock onto and release the blades." },
  { id: "blades", name: "Blades", text: "Replaceable blades of ultrahard steel, supple and strong enough to cut Titan flesh. Spares are carried in the boxes at the hips." },
  { id: "spears", name: "Thunder Spears", text: "A later weapon, built by Hange's engineers to beat the Armored Titan: an explosive spear, fired from a trigger in the handle, that bites into its target and then detonates." },
];

export type Fate = "KIA" | "MIA" | "UNKNOWN" | "SURVIVED";

/** Named members of the Survey Corps, as of the end of 850. Later fates are sealed. */
export const MEMORIAL: { name: string; fate: Fate; note: string; later?: string }[] = [
  { name: "Ilse Langnar", fate: "KIA", note: "Beyond the Walls. The year is not given. Her notebook recorded a Titan that spoke." },
  { name: "Petra Ral", fate: "KIA", note: "850. The 57th Expedition, the Female Titan." },
  { name: "Oluo Bozado", fate: "KIA", note: "850. The 57th Expedition, the Female Titan." },
  { name: "Eld Jinn", fate: "KIA", note: "850. The 57th Expedition, the Female Titan." },
  { name: "Gunther Schultz", fate: "KIA", note: "850. The 57th Expedition, the Female Titan." },
  { name: "Dieter Ness", fate: "KIA", note: "850. The 57th Expedition, the Female Titan." },
  { name: "Luke Siss", fate: "KIA", note: "850. The 57th Expedition, the Female Titan." },
  { name: "Mike Zacharias", fate: "KIA", note: "850. Inside Wall Rose, the Beast Titan's Titans." },
  { name: "Lynne", fate: "KIA", note: "850. Utgard Castle." },
  { name: "Henning", fate: "KIA", note: "850. Utgard Castle." },
  { name: "Nanaba", fate: "KIA", note: "850. Utgard Castle." },
  { name: "Gelgar", fate: "KIA", note: "850. Utgard Castle." },
  { name: "Nifa", fate: "KIA", note: "850. An ambush by the Interior Police's Anti-Personnel Control Squad." },
  { name: "Keiji", fate: "KIA", note: "850. The same ambush." },
  { name: "Abel", fate: "KIA", note: "850. The same ambush." },
  { name: "Moblit Berner", fate: "KIA", note: "850. Shiganshina. He pushed Hange clear of the Colossal Titan's blast." },
  { name: "Marlo Freudenberg", fate: "KIA", note: "850. Shiganshina, the charge at the Beast Titan." },
  { name: "Erwin Smith", fate: "KIA", note: "850. Shiganshina. Thirteenth commander; he led the charge." },
  { name: "Levi Ackerman", fate: "SURVIVED", note: "Shiganshina, 850." },
  { name: "Hange Zoë", fate: "SURVIVED", note: "Shiganshina, 850. Made fourteenth commander.", later: "Killed in 854, holding back the Rumbling so the others could get away." },
  { name: "Eren Yeager", fate: "SURVIVED", note: "Shiganshina, 850.", later: "Dies in 854, at the end." },
  { name: "Mikasa Ackerman", fate: "SURVIVED", note: "Shiganshina, 850." },
  { name: "Armin Arlert", fate: "SURVIVED", note: "Shiganshina, 850, with the Colossal Titan." },
  { name: "Jean Kirstein", fate: "SURVIVED", note: "Shiganshina, 850." },
  { name: "Connie Springer", fate: "SURVIVED", note: "Shiganshina, 850." },
  { name: "Sasha Braus", fate: "SURVIVED", note: "Shiganshina, 850.", later: "Killed in 854, on the airship out of Liberio." },
  { name: "Floch Forster", fate: "SURVIVED", note: "Shiganshina, 850. The only one of Erwin's charge to live.", later: "Killed in 854, at the port of Odiha." },
];

/** The 104th Cadet Corps at Trost, 850: cadets, not yet Survey Corps. The Garrison and the cadets lost 207 dead or missing there. */
export const MEMORIAL_104: { name: string; note: string; later?: string }[] = [
  { name: "Thomas Wagner", note: "Squad 34. Swallowed by an Abnormal as his squad watched." },
  { name: "Nack Tierce", note: "Squad 34." },
  { name: "Mylius Zeramuski", note: "Squad 34." },
  { name: "Mina Carolina", note: "Squad 34. A Titan caught her wire and threw her into a wall." },
  { name: "Marco Bott", note: "Found dead after the battle. Jean identified him.", later: "He overheard Reiner and Bertholdt. Reiner pinned him, Annie took his gear on Reiner's order, and they left him to a Titan." },
];
export const TROST_LOSS = "207 dead or missing, 897 wounded: the Garrison and the cadets together, at Trost.";

export const MEMORIAL_NOTE =
  "Named soldiers only, as the story names them; their fate as of the end of 850, with later deaths sealed. The rows without names stand for the soldiers the story never names. Their number here is not a count.";
