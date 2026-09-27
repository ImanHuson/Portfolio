// The Ideas: each theme as a question. These pages are the archivist's
// reading (and are stamped as such). Plot references carry book gates.
export type Idea = {
  slug: string;
  name: string;
  question: string;
  plate: string;
  plateAlt: string;
  lines: { text: string; book: number }[];
  pairs?: { a: string; b: string; note: string; book: number }[];
};

export const IDEAS: Idea[] = [
  {
    slug: "freedom",
    name: "Freedom",
    question: "What happens when people who have been oppressed finally receive power?",
    plate: "/images/rising/movement.webp",
    plateAlt: "A cavern full of small red lamps, stretching into the dark.",
    lines: [
      { text: "It starts with Eo, who asks Darrow to live for more than survival, and pays for the asking.", book: 1 },
      { text: "The first trilogy is about getting free. The second is about what freedom is worth to a Red girl in a refugee camp ten years later. Lyria’s chapters in Iron Gold ask the question the Rising didn’t have time to.", book: 4 },
    ],
  },
  {
    slug: "power",
    name: "Power",
    question: "Is power inherently corrupting? Or does it simply reveal what people were already willing to do?",
    plate: "/images/houses/augustus.webp",
    plateAlt: "The Augustus seal: a gold sunburst lion on red.",
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
    plateAlt: "An empty senate hemicycle under a single light.",
    lines: [
      { text: "The Rising wins. That is where the hard part starts.", book: 3 },
      { text: "The Republic keeps the Senate, the fleets and the broadcasts. It has to decide how much else of the old world to keep, and every choice is someone else’s betrayal.", book: 4 },
    ],
  },
  {
    slug: "honor",
    name: "Honor",
    question: "Four people. Four completely different relationships with the same word.",
    plate: "/images/people/cassius.webp",
    plateAlt: "A broken razor beside an untouched glass of wine.",
    lines: [],
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
    plate: "/images/books/light-bringer.webp",
    plateAlt: "Book plate: light radiating from a single point.",
    lines: [],
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
    plate: "/images/people/pax.webp",
    plateAlt: "A hoverbike built from salvage, glowing blue underneath.",
    lines: [],
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
