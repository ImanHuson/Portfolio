"use client";

import PinnedScene, { type Shot } from "@/components/ending/PinnedScene";
import { RUMBLING_BEATS } from "@/lib/data/ending";
import { BG, BG_SOURCE, FRAMES, FRAME_CREDIT } from "@/lib/data/backgrounds";

const GLYPHS = "░▒▓█/\\|_#?";
/** the observation post's report, falling apart as the count climbs */
function corrupt(text: string, amount: number, salt: number) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const h = Math.abs(Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453) % 1;
    if (text[i] === " ") out += " ";
    else if (h < amount * 0.55) out += "";
    else if (h < amount) out += GLYPHS[Math.floor(h * 97) % GLYPHS.length];
    else out += text[i];
  }
  return out;
}

/** how many the post has counted: one, then two, then dozens, then too many */
const counted = (p: number) => (p < 0.18 ? 0 : p < 0.27 ? 1 : p < 0.36 ? 2 : p < 0.5 ? Math.round(12 + (p - 0.36) * 400) : Math.round(70 + (p - 0.5) * 9000));

function hud(p: number): string[] {
  if (p > 0.7) return [];
  const bad = Math.max(0, (p - 0.47) / 0.2);
  const salt = Math.floor(p * 60); // changes in steps, so it flickers rather than crawls
  const count = bad > 0.55 ? "????" : String(counted(p)).padStart(4, "0");
  return [
    "Obs. post, coast of Paradis",
    "Year 854",
    `Titans observed ${count}`,
    "Height est. 60 m",
    `Bearing ${p < 0.55 ? "270" : String(Math.floor((salt * 37) % 360)).padStart(3, "0")}`,
  ].map((l, i) => corrupt(l, bad, salt + i));
}

// the quiet sea; the first shapes on the horizon (the Colossi of Memnon); the
// form at the head of them, from the anime; the storm of sand that follows
const SHOTS: Shot[] = [
  { src: BG.sea.src, at: 0, until: 0.34, from: { s: 1.05 }, to: { s: 1.25, x: -3, y: -2 }, position: "50% 40%" },
  { src: BG.colossi.src, at: 0.32, until: 0.5, from: { s: 1.5, y: 8 }, to: { s: 1.1, y: 0 }, position: "35% 60%" },
  { src: FRAMES.foundingHaze, at: 0.49, until: 0.7, from: { s: 1.1 }, to: { s: 1.25 } },
  { src: FRAMES.founding, alt: "Eren's Titan form at the start of the Rumbling, its ribs bare, in a haze of steam.", at: 0.49, until: 0.7, from: { s: 0.9 }, to: { s: 1.08 }, framed: true },
  { src: BG.simoom.src, at: 0.68, until: 1, from: { s: 1.3, y: 4 }, to: { s: 1.05 }, position: "60% 55%" },
];

export default function RumblingSection() {
  return (
    <PinnedScene
      label="The Rumbling"
      beats={RUMBLING_BEATS}
      shots={SHOTS}
      hud={hud}
      height="h-[800vh]"
      credit={`${BG.sea.credit}; ${BG.colossi.credit}; ${BG.simoom.credit} (${BG_SOURCE}). Frame: ${FRAME_CREDIT}.`}
    />
  );
}
