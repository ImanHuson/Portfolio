// The full relationship network (brief section 55): the twenty featured
// people and the links between them. Links come from the dossiers' own
// verified connections (people.ts, extended.ts, relationships.ts), plus a
// few checked for this map: Lysander kills Cassius and Atlas and accuses
// Diomedes of treason in Light Bringer; Diomedes refused to duel Cassius
// in the Raa blood feud because Cassius was a guest; Lysander's secret
// pact with Apollonius is in Dark Age; Darrow freed Apollonius from
// Deepgrave in Iron Gold. A link can change over the books: each stage
// carries the book that reveals it, and the map shows the latest stage
// the reader's clearance allows.

export type LinkKind = "family" | "friendship" | "mentorship" | "rivalry" | "romance" | "loyalty" | "betrayal" | "ideology";

export const KINDS: { key: LinkKind; label: string }[] = [
  { key: "family", label: "Family" },
  { key: "friendship", label: "Friendship" },
  { key: "mentorship", label: "Mentorship" },
  { key: "rivalry", label: "Rivalry" },
  { key: "romance", label: "Romance" },
  { key: "loyalty", label: "Loyalty" },
  { key: "betrayal", label: "Betrayal" },
  { key: "ideology", label: "Ideological conflict" },
];

export type Stage = { kind: LinkKind; book: number; note: string };
export type Link = { a: string; b: string; stages: Stage[] };

/** Node positions on a 1000 x 1000 board, placed by hand so the clusters
 * read: the Institute and the Howlers to the left, the Augustus circle
 * above, the Rim and the Raa to the right, the second trilogy's survivors
 * below. */
export const NODES: { slug: string; x: number; y: number }[] = [
  { slug: "darrow", x: 500, y: 470 },
  { slug: "sevro", x: 320, y: 360 },
  { slug: "virginia", x: 560, y: 230 },
  { slug: "the-jackal", x: 780, y: 150 },
  { slug: "pax", x: 390, y: 140 },
  { slug: "fitchner", x: 190, y: 220 },
  { slug: "victra", x: 130, y: 420 },
  { slug: "ragnar", x: 220, y: 570 },
  { slug: "orion", x: 400, y: 590 },
  { slug: "volga", x: 150, y: 740 },
  { slug: "ephraim", x: 290, y: 860 },
  { slug: "lyria", x: 420, y: 740 },
  { slug: "kavax", x: 510, y: 880 },
  { slug: "cassius", x: 620, y: 780 },
  { slug: "lysander", x: 700, y: 640 },
  { slug: "lorn", x: 820, y: 880 },
  { slug: "atlas", x: 740, y: 450 },
  { slug: "romulus", x: 860, y: 330 },
  { slug: "diomedes", x: 880, y: 560 },
  { slug: "apollonius", x: 890, y: 740 },
];

const s = (kind: LinkKind, book: number, note: string): Stage => ({ kind, book, note });

export const LINKS: Link[] = [
  { a: "darrow", b: "sevro", stages: [s("friendship", 1, "Howlers at the Institute, then brothers in everything but blood.")] },
  { a: "darrow", b: "virginia", stages: [s("romance", 1, "Rivals at the Institute, then something more."), s("romance", 4, "Married, with a son.")] },
  {
    a: "darrow",
    b: "cassius",
    stages: [
      s("friendship", 1, "Friends in House Mars."),
      s("betrayal", 2, "Cassius turns on him at the Triumph."),
      s("friendship", 3, "Blood, then forgiveness."),
    ],
  },
  { a: "darrow", b: "ragnar", stages: [s("friendship", 2, "Trust across a divide the Society built on purpose.")] },
  { a: "darrow", b: "fitchner", stages: [s("mentorship", 1, "His Proctor at the Institute."), s("mentorship", 2, "Revealed as Ares, the man who made him.")] },
  { a: "darrow", b: "the-jackal", stages: [s("rivalry", 1, "Enemies from the Institute on.")] },
  { a: "darrow", b: "pax", stages: [s("family", 4, "Father and son.")] },
  { a: "darrow", b: "lysander", stages: [s("ideology", 4, "Two opposing visions of what civilization is for.")] },
  { a: "darrow", b: "atlas", stages: [s("rivalry", 5, "Enemies across the war for Mercury.")] },
  { a: "darrow", b: "victra", stages: [s("friendship", 2, "A friend, then family by choice.")] },
  { a: "darrow", b: "lorn", stages: [s("mentorship", 2, "He learns the razor from the old master, in secret.")] },
  { a: "darrow", b: "orion", stages: [s("loyalty", 2, "He made her a captain; she flies for him.")] },
  { a: "darrow", b: "romulus", stages: [s("ideology", 3, "A wary alliance between two ideas of order.")] },
  { a: "darrow", b: "apollonius", stages: [s("rivalry", 4, "Freed from Deepgrave to be used, with a bomb in his head.")] },
  { a: "virginia", b: "pax", stages: [s("family", 4, "Mother and son.")] },
  { a: "virginia", b: "the-jackal", stages: [s("family", 1, "Brother and sister.")] },
  { a: "victra", b: "sevro", stages: [s("romance", 3, "She proposes; he says yes."), s("romance", 4, "Married, with three daughters.")] },
  { a: "lyria", b: "volga", stages: [s("friendship", 4, "Friends.")] },
  { a: "lyria", b: "ephraim", stages: [s("betrayal", 4, "A friend who was using her.")] },
  { a: "ephraim", b: "volga", stages: [s("family", 4, "Found family. He calls her Snowball.")] },
  { a: "lyria", b: "kavax", stages: [s("loyalty", 4, "She pulls him out of the water; he takes her into his household.")] },
  { a: "lyria", b: "sevro", stages: [s("loyalty", 5, "He brings her into the Howlers.")] },
  { a: "cassius", b: "diomedes", stages: [s("rivalry", 4, "A Raa blood feud. Diomedes refuses to duel a guest.")] },
  { a: "lysander", b: "cassius", stages: [s("mentorship", 4, "Cassius raised him in exile."), s("betrayal", 6, "Lysander kills him.")] },
  { a: "lysander", b: "diomedes", stages: [s("friendship", 4, "Friends in the Rim."), s("betrayal", 6, "Lysander accuses him of treason.")] },
  { a: "lysander", b: "romulus", stages: [s("ideology", 4, "The Sovereign of the Rim warns him.")] },
  { a: "lysander", b: "atlas", stages: [s("ideology", 5, "On the same side, never on the same terms."), s("betrayal", 6, "Lysander kills him.")] },
  { a: "lysander", b: "apollonius", stages: [s("loyalty", 5, "A secret pact: the Society restored, his betrayers delivered.")] },
  { a: "lysander", b: "lorn", stages: [s("family", 4, "Grandfather and grandson.")] },
  { a: "romulus", b: "diomedes", stages: [s("family", 4, "Father and son.")] },
  { a: "romulus", b: "atlas", stages: [s("family", 4, "Brothers.")] },
  { a: "fitchner", b: "sevro", stages: [s("family", 1, "Father and son.")] },
  { a: "ragnar", b: "sevro", stages: [s("friendship", 2, "Brothers in arms.")] },
  { a: "ragnar", b: "volga", stages: [s("family", 5, "The father she never knew.")] },
  { a: "orion", b: "atlas", stages: [s("rivalry", 5, "Her torturer.")] },
];

export const linkStage = (l: Link, clearance: number) => {
  const open = l.stages.filter((st) => st.book <= clearance);
  return open.length ? open[open.length - 1] : null;
};
export const linkBook = (l: Link) => Math.min(...l.stages.map((st) => st.book));
