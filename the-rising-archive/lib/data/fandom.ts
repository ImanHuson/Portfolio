// The Fandom. Arguments are reader positions, not canon claims, and are
// stamped that way. Quotes are short and verified; anything longer becomes a
// memory fragment with a citation instead of reproduced text.

export type Argument = { q: string; book: number; yes: string; no: string };

export const ARGUMENTS: Argument[] = [
  { q: "Was Cassius always capable of redemption?", book: 3, yes: "The honour was always real. It only needed something worth being loyal to.", no: "Redemption is a reading. What he did was done, and the books never pretend otherwise." },
  { q: "Is Lysander a tragic character, or a tyrant in the making?", book: 4, yes: "Tragic: a good mind raised inside a bad idea, trying to be kind in the only language he was given.", no: "A tyrant: kindness in service of hierarchy is still hierarchy." },
  { q: "Did Darrow become what Eo hated?", book: 3, yes: "He learned the Golds’ language so well that he started thinking in it.", no: "He carried the war so that other people wouldn’t have to. Eo asked for more than survival, and he gave more than that." },
  { q: "Is Mustang the true political protagonist?", book: 3, yes: "Darrow wins the war. Virginia is the one who has to govern after it.", no: "The saga is told through Darrow’s eyes for a reason: the war is the story." },
  { q: "Who understands Atlas best?", book: 5, yes: "The people he fooled, which is why he keeps a shelf of them.", no: "No one, and that is the point of him." },
  { q: "Is Apollonius terrifying or hilarious?", book: 4, yes: "Terrifying: the theatre is a weapon.", no: "Hilarious: and that is exactly why he is terrifying." },
  { q: "What does the Republic actually represent?", book: 4, yes: "A promise worth the cost.", no: "A compromise that kept too much of the thing it replaced." },
  { q: "Who deserves the title of best duelist?", book: 2, yes: "Lorn au Arcos, who wrote the Willow Way.", no: "His students, who took it further than he did." },
  { q: "Which death hurt the most?", book: 1, yes: "The first one, because it is why the saga exists.", no: "A later one, because by then you knew exactly what was being lost." },
  { q: "Who would you trust with an Iron Rain?", book: 2, yes: "Sevro.", no: "Anyone but Sevro." },
];

// Questions carried into Red God. Not theories: open questions the published
// books leave, so nothing here claims to know the ending.
export const OPEN_QUESTIONS: string[] = [
  "Does Darrow get to live, after the Reaper wins?",
  "What does Lysander build, and what does it cost?",
  "Can the Republic survive winning?",
  "What is left of the Society when there is nothing left to defend?",
];

export const CHORUS: { name: string; note: string; book: number }[] = [
  { name: "Sevro", note: "The most common answer to “favourite character.”", book: 1 },
  { name: "Darrow", note: "Admired more than loved, some readers say. They’re here for his friends.", book: 1 },
  { name: "Cassius", note: "Mixed, and passionately so.", book: 1 },
  { name: "Mustang", note: "Well loved, and argued over as a politician.", book: 1 },
  { name: "Victra", note: "Well loved.", book: 2 },
  { name: "Ephraim", note: "Divisive. His choices make people angry, which is the point.", book: 4 },
  { name: "Lysander", note: "The most divided of all: praised as a point of view, disliked as a person.", book: 4 },
];
