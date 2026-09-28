// AOT-05, The Basement. Checked against episode summaries of "The Basement"
// (Season 3, episode 19; 56th overall) and the Basement entries of the
// series wiki, via search. The brief said "three photographs": canon has
// three books and one photograph, so that is what this chapter says.
// Grisha's note is paraphrased: its wording differs between translations.

/** Beats of the descent, keyed to scroll progress through the pinned shot. */
export const DESCENT: { at: number; until: number; kicker?: string; text: string }[] = [
  { at: 0.02, until: 0.13, kicker: "Shiganshina, 850", text: "The Yeager house is rubble. The way down is not." },
  { at: 0.17, until: 0.3, text: "Hange, Levi, Eren and Mikasa clear the debris from the hatch." },
  { at: 0.33, until: 0.44, kicker: "Five years", text: "Eren has worn the key since the night of the fall. His father told him never to let it out of his sight." },
  { at: 0.5, until: 0.56, text: "It does not fit." },
  { at: 0.585, until: 0.66, text: "Levi breaks the door down." },
  { at: 0.7, until: 0.78, text: "Mikasa finds a second keyhole, in Grisha's desk." },
  { at: 0.8, until: 0.85, text: "The key fits." },
  { at: 0.865, until: 0.93, text: "The drawer is empty. Under a false bottom: three books." },
];

export const KEY_845 =
  "The night Shiganshina fell, Grisha Yeager found his son, took him to a forest, and gave him the key he always carried. His instruction: retake Wall Maria, and go down to the basement.";
export const KEY_845_SEALED = "Grisha then turned Eren into a Titan, and Eren ate him. The key stayed.";

export const BOOKS = {
  preserved: "The books had been treated with peppermint oil and charcoal, against damp and insects.",
  contents:
    "They are Grisha's account of where he came from: a nation across the sea, where people like him lived under guard, and the truth of what the Titans are.",
};

export const PHOTOGRAPH = {
  found: "Inside the first book, a photograph: Grisha, a woman and a small boy, all in fine clothes.",
  who: "The woman is Dina, Grisha's first wife. The boy is their son, Zeke.",
  // paraphrase of the note on the back
  back: [
    "This is not a drawing.",
    "It is light from the people in it, burned onto special paper: a photograph.",
    "I came from outside the Walls.",
    "Humanity there is not extinct. It lives in comfort.",
  ],
  backNote: "Paraphrased. The wording differs between translations.",
};
