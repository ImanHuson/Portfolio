// AOT-08 to AOT-10: the ending. Checked (via search) against the series
// wiki's Rumbling, Path, Ymir Fritz and final-chapter entries, and reports of
// the manga's and anime's end. These pages sit behind the ending gate, so
// nothing inside them is sealed again.

export const RUMBLING_BEATS: { at: number; until: number; text: string; big?: boolean }[] = [
  { at: 0.02, until: 0.075, text: "854. The sea off Paradis is quiet." },
  { at: 0.09, until: 0.15, text: "A sound comes first, from beyond the horizon." },
  { at: 0.18, until: 0.25, text: "One." },
  { at: 0.27, until: 0.33, text: "Then another." },
  { at: 0.36, until: 0.45, text: "Then dozens." },
  { at: 0.5, until: 0.64, text: "The Walls were made of them." },
  { at: 0.72, until: 0.9, text: "The Rumbling", big: true },
];

export const RUMBLING_FACTS = [
  "The three Walls were full of sleeping Colossal Titans, sixty metres tall. They were Karl Fritz's deterrent against the world.",
  "Eren used the Founding Titan, through contact with Zeke, who has royal blood, and set them walking.",
  "They crossed the sea to flatten the world beyond Paradis. About eight in ten people alive were killed before it was stopped.",
  "At Odiha, Hange Zoë held the first of them back long enough for the others to get away.",
  "It was stopped by what was left of the Survey Corps and of Marley's Warriors, fighting together.",
];

export const PATHS_BEATS: { at: number; until: number; text: string; big?: boolean }[] = [
  { at: 0.03, until: 0.16, text: "When Ymir Fritz died, she did not leave." },
  { at: 0.2, until: 0.34, text: "An endless desert, under stars." },
  { at: 0.38, until: 0.52, text: "At its centre, a pillar of light, branching into countless lines." },
  { at: 0.56, until: 0.7, text: "Every line reaches one of the Subjects of Ymir. Every living Eldian." },
  { at: 0.74, until: 0.88, text: "For two thousand years, a girl shaped the bodies of Titans out of sand." },
  { at: 0.9, until: 1.01, text: "Paths", big: true },
];

export const PATHS_FACTS = [
  "The Paths connect every Subject of Ymir to the Founder. Memories and power travel along them.",
  "Time does not pass there as it does outside. Past and future can touch.",
  "Whenever the power of the Titans was called on, Ymir built the body out of sand, however many years it took. She did it for two thousand years.",
];

export const END_FACTS = [
  "Mikasa ended it. Levi helped her, and Armin held Eren's Titan in place, and she killed him.",
  "Every Titan turned to dust. The people who had been made into Titans became human again. The power of the Titans left the world.",
  "Ymir had waited two thousand years. In Mikasa's choice she found the strength to let go.",
  "The last chapter is called “Toward the Tree on That Hill”. Mikasa sits by Eren's grave.",
];

export const PUBLICATION = [
  { what: "The manga", when: "Final chapter, 9 April 2021, in Bessatsu Shōnen Magazine." },
  { what: "The anime", when: "The final episode, November 2023." },
  { what: "THE LAST ATTACK", when: "The ending as a film, in Japanese cinemas from 8 November 2024." },
];

export const STATUS_LINES: [string, string][] = [
  ["Archive status", "Complete"],
  ["Canon", "Closed"],
  ["Memory", "Continues"],
];
