// The master timeline: the whole story in order, from Ymir Fritz to the end.
// Every line repeats a fact already checked for its chapter (see that
// chapter's data file), or was checked for this page (the Great Titan War,
// c. 743; Eldia's rule of some 1,700 years). Anything the chapters seal is
// sealed here too, under the chapter that reveals it.

export type Era = { id: string; name: string; span: string };
export type Event = {
  era: string;
  when: string; // as the archive dates it
  title: string;
  text: string;
  chapter: string; // AOT-0X, where to read it in full
  href: string;
  sealed?: string; // a spoiling line, behind a seal
  seal?: string; // what the seal hides, said without spoiling it
};

export const ERAS: Era[] = [
  { id: "ancient", name: "Before the Walls", span: "c. 2,000 years" },
  { id: "walls", name: "The Walls", span: "c. 743 to 845" },
  { id: "fall", name: "The Fall", span: "845 to 847" },
  { id: "war", name: "Inside the Walls", span: "850" },
  { id: "end", name: "Across the sea", span: "854 and after" },
];

export const EVENTS: Event[] = [
  {
    era: "ancient",
    when: "c. 2,000 years ago",
    title: "Ymir Fritz",
    text: "A girl gains the power of the Titans. Thirteen years later she dies, and the power splits into nine.",
    chapter: "AOT-04",
    href: "/titans/",
  },
  {
    era: "ancient",
    when: "c. 1,700 years",
    title: "The Eldian Empire",
    text: "With the Titans, Eldia conquers Marley and holds the continent for some 1,700 years.",
    chapter: "AOT-06",
    href: "/the-world/",
  },
  {
    era: "walls",
    when: "c. 743",
    title: "The Great Titan War",
    text: "Civil war among the Eldian houses that hold the Nine Titans. The 145th King, Karl Fritz, turns his back on it.",
    chapter: "AOT-06",
    href: "/the-world/",
  },
  {
    era: "walls",
    when: "After the war",
    title: "Three Walls",
    text: "The King takes the royal family and many Eldians to the island of Paradis, raises three Walls, and erases his people's memory of everything before them.",
    chapter: "AOT-06",
    href: "/the-world/",
    sealed: "The Walls are made of Colossal Titans, standing shoulder to shoulder, asleep.",
    seal: "what the Walls are made of",
  },
  {
    era: "walls",
    when: "830",
    title: "The Warrior program",
    text: "Marley asks Eldian children inside its internment zones to train as Warriors, to inherit its Titans.",
    chapter: "AOT-06",
    href: "/the-world/",
  },
  {
    era: "fall",
    when: "845",
    title: "Shiganshina",
    text: "A Titan sixty metres tall looks over Wall Maria and kicks in the outer gate. The Armored Titan breaks the inner gate. Wall Maria falls.",
    chapter: "AOT-01",
    href: "/",
  },
  {
    era: "fall",
    when: "846",
    title: "The reclamation",
    text: "The royal government sends 250,000 people, a fifth of the remaining population, to retake Wall Maria. About a hundred come back.",
    chapter: "AOT-02",
    href: "/the-fall/",
  },
  {
    era: "fall",
    when: "847",
    title: "The 104th",
    text: "Eren, Mikasa and Armin enlist in the 104th Cadet Corps. Three years of training follow.",
    chapter: "AOT-02",
    href: "/the-fall/",
  },
  {
    era: "war",
    when: "850",
    title: "Trost",
    text: "Five years later, the Colossal Titan kicks in the gate of Trost. The Garrison and the cadets lose 207 dead or missing.",
    chapter: "AOT-07",
    href: "/the-war/",
  },
  {
    era: "war",
    when: "850",
    title: "The 57th Expedition",
    text: "The Survey Corps rides out beyond the Walls, and the Female Titan comes for them in the forest.",
    chapter: "AOT-07",
    href: "/the-war/",
  },
  {
    era: "war",
    when: "850",
    title: "Return to Shiganshina",
    text: "The Survey Corps goes back to take the district, and the cellar under the Yeager house.",
    chapter: "AOT-05",
    href: "/the-basement/",
    sealed: "Only nine of them come back. In the cellar: three books, one photograph, and the truth about the world outside.",
    seal: "who comes back, and what is in the cellar",
  },
  {
    era: "end",
    when: "854",
    title: "Fort Slava",
    text: "The last battle of Marley's four-year war with the Mid-East Allied Forces.",
    chapter: "AOT-07",
    href: "/the-war/",
  },
  {
    era: "end",
    when: "854",
    title: "Liberio",
    text: "At a festival in Marley, a Tybur declares war on Paradis before the world.",
    chapter: "AOT-07",
    href: "/the-war/",
    sealed: "Eren, hidden in the internment zone, transforms beneath the stage.",
    seal: "who is beneath the stage",
  },
  {
    era: "end",
    when: "854",
    title: "The Rumbling",
    text: "The ending begins.",
    chapter: "AOT-08",
    href: "/the-rumbling/",
    sealed: "The Walls wake, and walk. About eight in ten people alive are killed before it is stopped.",
    seal: "what the Rumbling is, and what it costs",
  },
  {
    era: "end",
    when: "After",
    title: "The End",
    text: "A single tree.",
    chapter: "AOT-10",
    href: "/the-end/",
    sealed: "Mikasa ends it. The power of the Titans leaves the world.",
    seal: "how it ends",
  },
];
