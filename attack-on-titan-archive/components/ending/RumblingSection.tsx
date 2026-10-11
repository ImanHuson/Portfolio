"use client";

import PinnedScene, { type Shot } from "@/components/ending/PinnedScene";
import { RUMBLING_BEATS } from "@/lib/data/ending";
import { BG, GEN_CREDIT, HERO } from "@/lib/data/backgrounds";

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

// the quiet sea with steam on the horizon; the Walls' Titans waking; the line
// on the march; the Rumbling arriving over the clouds
const SHOTS: Shot[] = [
  { ...HERO.sea, at: 0, until: 0.34, from: { s: 1.05 }, to: { s: 1.22, y: -2 }, position: "50% 50%" },
  { src: BG.titansBegin.src, at: 0.32, until: 0.5, from: { s: 1.4, y: 6 }, to: { s: 1.08 }, position: "50% 55%" },
  { ...HERO.march, at: 0.49, until: 0.7, from: { s: 1.05 }, to: { s: 1.3, y: -4 }, position: "50% 50%" },
  { ...HERO.clouds, at: 0.68, until: 1, from: { s: 1.15, x: -2 }, to: { s: 1 }, position: "50% 50%" },
];

export default function RumblingSection() {
  return (
    <PinnedScene
      label="The Rumbling"
      beats={RUMBLING_BEATS}
      shots={SHOTS}
      hud={hud}
      height="h-[800vh]"
      credit={`Paintings: ${GEN_CREDIT}s.`}
    />
  );
}
