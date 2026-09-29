// The Ideas: each theme as a question. These pages are the archivist's
// reading (and are stamped as such). Plot references carry book gates.
export type Idea = {
  slug: string;
  name: string;
  question: string;
  plate: string;
  plateAlt: string;
  plateW?: number;
  plateH?: number;
  /** Show this character's framed portrait instead of the plate. */
  portrait?: { slug: string; name: string };
  lines: { text: string; book: number }[];
  pairs?: { a: string; b: string; note: string; book: number }[];
};

export const IDEAS: Idea[] = [
  {
    slug: "freedom",
    name: "Freedom",
    question: "What happens when people who have been oppressed finally receive power?",
    plate: "/images/rising/movement.webp",
    plateAlt: "Washington Crossing the Delaware: a boat of rebels crossing a frozen river.",
    lines: [
      { text: "The Society is built so that every Color knows its place and never leaves it. Freedom here isn’t one thing: it means something different to each Color, because each was made for a different cage.", book: 0 },
      { text: "It starts with Eo, who asks Darrow to live for more than survival, and pays for the asking.", book: 1 },
      { text: "The first trilogy is about getting free. The second is about what freedom is worth to a Red girl in a refugee camp ten years later. Lyria’s chapters in Iron Gold ask the question the Rising didn’t have time to.", book: 4 },
    ],
  },
  {
    slug: "power",
    name: "Power",
    question: "Is power inherently corrupting? Or does it simply reveal what people were already willing to do?",
    plate: "/images/houses/augustus.webp",
    plateAlt: "A marble lion, crouched to spring: the Augustus sign.",
    lines: [
      { text: "The archive’s answer is the Ten Faces: ten people, and ten different things power became in their hands.", book: 0 },
      { text: "Darrow wins a war by becoming the Reaper. The books that follow ask what the Reaper costs the man.", book: 3 },
    ],
  },
  {
    slug: "revolution",
    name: "Revolution",
    question: "When does liberation become government? And when does government become another hierarchy?",
    plate: "/images/rising/government.webp",
    plateAlt: "The Death of Socrates: a state executes its own philosopher.",
    lines: [
      { text: "Tearing a hierarchy down and deciding what to build in its place are two different problems, and the saga treats both of them as the story.", book: 0 },
      { text: "The Rising wins. That is where the hard part starts.", book: 3 },
      { text: "The Republic keeps the Senate, the fleets and the broadcasts. It has to decide how much else of the old world to keep, and every choice is someone else’s betrayal.", book: 4 },
    ],
  },
  {
    slug: "honor",
    name: "Honor",
    question: "Four people. Four completely different relationships with the same word.",
    plate: "/images/portraits/cassius.webp",
    plateAlt: "Cassius au Bellona, in fan art.",
    portrait: { slug: "cassius", name: "Cassius au Bellona" },
    lines: [
      { text: "Honor sounds like one word. In the Society it means something different to everyone who uses it: a family inheritance, a code of combat, a debt to a people, an argument for keeping everyone in their place. Four people below, four definitions.", book: 0 },
    ],
    pairs: [
      { a: "Cassius", b: "Honour as inheritance", note: "The thing he was raised on, and has to relearn after it is used against him.", book: 1 },
      { a: "Lorn", b: "Honour as refusal", note: "A legend of the razor who tried to step away from the Society’s violence.", book: 2 },
      { a: "Diomedes", b: "Honour as duty", note: "Owed to a people, not to a crown.", book: 4 },
      { a: "Lysander", b: "Honour as order", note: "The belief that a good hierarchy is itself a moral thing.", book: 4 },
    ],
  },
  {
    slug: "legacy",
    name: "Legacy",
    question: "Every generation inherits a different version of the same conflict.",
    plate: "/images/covers/light-bringer.webp",
    plateAlt: "The cover of Light Bringer.",
    plateW: 900,
    plateH: 1350,
    lines: [
      { text: "Legacy is what gets handed down whether anyone wants it or not: a name, a Color, a grudge, a dream. The saga keeps checking what each person was given, and what they chose to keep.", book: 0 },
    ],
    pairs: [
      { a: "Eo", b: "A dream", note: "That a life could be more than labour.", book: 1 },
      { a: "Darrow", b: "A war", note: "Fought to make the dream possible.", book: 3 },
      { a: "Virginia", b: "A Republic", note: "Built to hold what the war won.", book: 4 },
      { a: "Pax", b: "A generation", note: "Born after the victory, into the war that didn’t end.", book: 4 },
      { a: "Lysander", b: "An inheritance", note: "The old world’s heir, in the new world.", book: 4 },
    ],
  },
  {
    slug: "fatherhood",
    name: "Fatherhood",
    question: "The saga is quietly obsessed with what parents leave behind.",
    plate: "/images/portraits/pax.webp",
    plateAlt: "Pax, in fan art.",
    portrait: { slug: "pax", name: "Pax" },
    lines: [
      { text: "The saga keeps returning to what parents hand their children: a name, a cause, a debt, a way of seeing the world. Each pairing below is a parent, a child, and what passed between them.", book: 0 },
    ],
    pairs: [
      { a: "Fitchner", b: "Sevro", note: "A father his son thought didn’t care.", book: 1 },
      { a: "Nero", b: "Virginia and Adrius", note: "Two children, raised to win. One refused.", book: 2 },
      { a: "Darrow", b: "Pax", note: "The father who keeps leaving to make the world safe for the son.", book: 4 },
      { a: "Cassius", b: "Lysander", note: "A guardian raising the heir of the house he served.", book: 4 },
      { a: "Romulus", b: "Diomedes", note: "A father whose idea of the Rim is his son’s inheritance.", book: 4 },
      { a: "Atlas", b: "Ajax", note: "A son made by Octavia’s design, from Aja’s genes and his, and raised in his absence.", book: 6 },
    ],
  },
];

export const getIdea = (slug: string) => IDEAS.find((i) => i.slug === slug);

// The things the war couldn't kill. The archive ends here.
export const SURVIVES: { text: string; book: number }[] = [
  { text: "Eo’s dream.", book: 1 },
  { text: "Ragnar’s honour.", book: 2 },
  { text: "Cassius’s friendship.", book: 1 },
  { text: "Sevro’s loyalty.", book: 1 },
  { text: "Mustang’s belief in a Republic.", book: 3 },
  { text: "Pax’s curiosity.", book: 4 },
  { text: "Diomedes’s sense of duty.", book: 4 },
  { text: "Darrow’s love.", book: 1 },
  { text: "The Telemanus family.", book: 2 },
  { text: "The idea that the future can belong to people who haven’t been born yet.", book: 0 },
];
