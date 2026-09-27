import type { Register } from "@/lib/data/people";

// The brief's colour semantics, made typographic so they apply everywhere a
// name appears, not improvised per component:
//   red  -> the industrial display face: rebellion, the mines.
//   gold -> the Roman serif: old money, political power. Rendered in bone,
//           with gold kept to a hairline accent, so gold stays expensive.
//   rim  -> cool off-white, spaced caps: distance, silence, the Rim.
//   none -> plain sans: Pax, born without a Color, sits outside both.
export const NAME_CLASS: Record<Register, string> = {
  red: "font-display font-extrabold uppercase tracking-tight",
  gold: "font-serif font-medium tracking-tight",
  rim: "font-display font-semibold uppercase tracking-[0.06em] text-rim",
  none: "font-sans font-semibold tracking-tight",
};

export const ACCENT_CLASS: Record<Register, string> = {
  red: "text-red",
  gold: "text-gold",
  rim: "text-rim-dim",
  none: "text-ash",
};

export const RULE_CLASS: Record<Register, string> = {
  red: "bg-red",
  gold: "bg-gold",
  rim: "bg-rim-dim",
  none: "bg-ash",
};
