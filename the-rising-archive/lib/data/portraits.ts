// Character portraits: fan art the user supplied (September 2026), shown in
// the archive's frames. The user chose to use it after the trade-off was
// explained: the artists' permission was not asked, so every portrait is
// credited as the artist signed it, and any artist who asks will have their
// piece credited differently or taken down. Names below are only what the
// signatures show; where a signature is there but not legible, the credit
// says so instead of guessing. Crops and the light treatment are in
// scripts/art/portraits.py.

/** Frame material, by the character's Color (see `.pframe` in globals.css). */
export type FrameMaterial = "gold" | "red" | "obsidian" | "gray" | "blue" | "rim" | "none";

export type Portrait = {
  material: FrameMaterial;
  /** The artist as signed; null when unsigned or not legible. */
  artist: string | null;
  signed: boolean;
};

export const PORTRAITS: Record<string, Portrait> = {
  darrow: { material: "red", artist: null, signed: true },
  virginia: { material: "gold", artist: "LesyaBlackBird", signed: true },
  cassius: { material: "gold", artist: null, signed: true },
  sevro: { material: "gold", artist: null, signed: false },
  pax: { material: "none", artist: "@Anjens_", signed: true },
  diomedes: { material: "rim", artist: null, signed: true },
  atlas: { material: "rim", artist: null, signed: true },
  lysander: { material: "gold", artist: null, signed: false },
  victra: { material: "gold", artist: null, signed: false },
  "the-jackal": { material: "gold", artist: "ELDAN", signed: true },
  apollonius: { material: "gold", artist: "kookiesnmilk", signed: true },
  lyria: { material: "red", artist: "Karina Giada", signed: true },
  ephraim: { material: "gray", artist: null, signed: false },
  volga: { material: "obsidian", artist: null, signed: false },
  ragnar: { material: "obsidian", artist: null, signed: false },
  kavax: { material: "gold", artist: null, signed: false },
  fitchner: { material: "gold", artist: "ELDAN", signed: true },
  lorn: { material: "gold", artist: null, signed: false },
  orion: { material: "blue", artist: "Angela Tubbs", signed: true },
  romulus: { material: "rim", artist: "kookiesnmilk", signed: true },
  eo: { material: "red", artist: "Jenna", signed: true },
};

export const portraitCredit = (slug: string) => {
  const p = PORTRAITS[slug];
  if (!p) return "";
  if (p.artist) return `Fan art by ${p.artist}`;
  return p.signed ? "Fan art · signed, name not legible" : "Fan art · artist unidentified";
};
