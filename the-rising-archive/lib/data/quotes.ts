// Quotations. Only short lines that fan quote archives (redrisingquotes.com,
// Goodreads) agree on, with the speaker and, where it could be pinned, the
// book and chapter. Where only the trilogy could be pinned, the site says so
// rather than guessing a book. Each line is sealed at the book it comes from
// (or the latest book it could come from). Primary texts could not be opened
// from this archive's build environment, so treat these as quoted-by-readers,
// not checked against the page.

export type SagaQuote = {
  text: string;
  who: string;
  where: string;
  book: number;
  note?: string;
  /** A spoiler-safe speaker name, shown even while the line is sealed. */
  speaker?: string;
};

/** One line per member of the Ten Faces, keyed by person slug. */
export const TEN_QUOTES: Record<string, SagaQuote> = {
  darrow: { text: "I would have lived in peace. But my enemies brought me war.", who: "Darrow", where: "Red Rising, the opening line", book: 0 },
  virginia: { text: "You are the wolf that howls and bites. I am the mustang that nuzzles the hand.", who: "Virginia, to Darrow", where: "Red Rising", book: 1 },
  cassius: { text: "My honor remains.", who: "Cassius au Bellona", where: "Light Bringer", book: 6 },
  sevro: { text: "Don’t worry, I wouldn’t fit in your skin.", who: "Sevro, to Darrow, wearing a wolf pelt", where: "Red Rising", book: 1 },
  pax: { text: "I am the son of the Morning Star. The flesh and blood of the man who broke your chains.", who: "Pax", where: "The second trilogy", book: 6 },
  diomedes: { text: "A man is nothing before the storm.", who: "Diomedes au Raa", where: "The second trilogy", book: 5 },
  atlas: { text: "I fear a man who believes in good. For he can excuse any evil.", who: "Atlas au Raa", where: "Dark Age, chapter 17", book: 5 },
  lysander: { text: "I was named for a contradiction: a Spartan general who had the mind of an Athenian.", who: "Lysander au Lune", where: "Iron Gold", book: 4 },
  victra: { text: "I’m a Julii. Cold runneth through my veins.", who: "Victra", where: "The first trilogy", book: 3 },
  "the-jackal": { text: "What does it say about me that my greatest enemy knows me better than any friend?", who: "Adrius au Augustus", where: "Morning Star", book: 3 },
};

/** The saga's lines that stayed with readers. Chosen by the archive. */
export const BEST_LINES: SagaQuote[] = [
  { text: "I would have lived in peace. But my enemies brought me war.", who: "Darrow", where: "Red Rising, the opening line", book: 0, speaker: "Darrow" },
  { text: "Then you must live for more.", who: "Eo, to Darrow", where: "Red Rising", book: 1, speaker: "Eo" },
  { text: "A fool pulls the leaves. A brute chips the trunk. A sage digs the roots.", who: "Lorn au Arcos", where: "Golden Son", book: 2, speaker: "Lorn au Arcos" },
  { text: "My wife called me Fitchner. But the Golds made me Ares.", who: "Fitchner au Barca", where: "Golden Son", book: 2, speaker: "Fitchner au Barca" },
  { text: "Honor is not what you say. It is not what you read. Honor is what you do.", who: "Romulus au Raa", where: "Morning Star", book: 3, speaker: "Romulus au Raa" },
  { text: "What does it say about me that my greatest enemy knows me better than any friend?", who: "Adrius au Augustus", where: "Morning Star", book: 3, speaker: "The Jackal" },
  { text: "Yield I do not, for a man cannot yield to a dog.", who: "Ragnar Volarus", where: "The first trilogy", book: 3, speaker: "Ragnar Volarus" },
  { text: "You are a world entire. You are grand and lovely.", who: "Ephraim ti Horn, to Lyria", where: "Iron Gold", book: 4, speaker: "Ephraim ti Horn" },
  { text: "I fear a man who believes in good. For he can excuse any evil.", who: "Atlas au Raa", where: "Dark Age, chapter 17", book: 5, speaker: "Atlas au Raa" },
  { text: "My honor remains.", who: "Cassius au Bellona", where: "Light Bringer", book: 6, speaker: "Cassius au Bellona" },
];
