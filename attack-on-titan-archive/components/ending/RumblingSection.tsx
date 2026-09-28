"use client";

import dynamic from "next/dynamic";
import PinnedScene from "@/components/ending/PinnedScene";
import { RUMBLING_BEATS } from "@/lib/data/ending";
import { rumblingAt } from "@/components/three/rumbling/rumbling";

const RumblingShot = dynamic(() => import("@/components/three/rumbling/RumblingShot"), { ssr: false });

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

function hud(p: number): string[] {
  if (p > 0.7) return [];
  const n = Math.floor(rumblingAt(p).count * (p < 0.46 ? 1 : 30));
  const bad = Math.max(0, (p - 0.47) / 0.2);
  const salt = Math.floor(p * 60); // changes in steps, so it flickers rather than crawls
  const count = p < 0.5 ? String(n).padStart(4, "0") : bad > 0.55 ? "????" : String(n).padStart(4, "0");
  return [
    "Obs. post, coast of Paradis",
    "Year 854",
    `Titans observed ${count}`,
    "Height est. 60 m",
    `Bearing ${p < 0.55 ? "270" : String(Math.floor((salt * 37) % 360)).padStart(3, "0")}`,
  ].map((l, i) => corrupt(l, bad, salt + i));
}

const STILLS = [
  { src: "/images/ending/rumbling-1.webp", beats: [0, 1, 2] },
  { src: "/images/ending/rumbling-2.webp", beats: [3, 4] },
  { src: "/images/ending/rumbling-3.webp", beats: [5, 6] },
];

export default function RumblingSection() {
  return <PinnedScene label="The Rumbling" beats={RUMBLING_BEATS} Scene={RumblingShot} stills={STILLS} hud={hud} height="h-[900vh]" />;
}
