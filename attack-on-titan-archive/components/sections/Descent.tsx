"use client";

import PinnedScene, { type Shot } from "@/components/ending/PinnedScene";
import { DESCENT } from "@/lib/data/basement";
import { BG, BG_SOURCE } from "@/lib/data/backgrounds";

// Down into the cellar, told in prints: Piranesi's Prisons for the stair and
// the dark below (plate XII, then plate X as the door gives), a desk by
// candlelight for Grisha's study, Harnett's still life of old books for what
// was under the false bottom.
const SHOTS: Shot[] = [
  { src: BG.prisonStair.src, at: 0, until: 0.3, from: { s: 1.5, y: 12 }, to: { s: 1.2, y: -6 }, position: "45% 30%" },
  { src: BG.prisonStair.src, at: 0.3, until: 0.5, from: { s: 1.8, x: 10, y: -4 }, to: { s: 2.2, x: 14, y: -12 }, position: "60% 70%" },
  { src: BG.prisonPlatform.src, at: 0.5, until: 0.7, from: { s: 1.15 }, to: { s: 1.45, y: -6 }, position: "50% 55%" },
  { src: BG.candle.src, at: 0.68, until: 0.86, from: { s: 1.05 }, to: { s: 1.3, x: -6 }, position: "70% 50%" },
  { src: BG.stillLife.src, at: 0.84, until: 1, from: { s: 1.35, x: -4 }, to: { s: 1.08 }, position: "45% 60%" },
];

export default function Descent() {
  return (
    <div id="descent" className="scroll-mt-[var(--nav-h)]">
      <PinnedScene
        label="The descent"
        beats={DESCENT}
        shots={SHOTS}
        height="h-[700vh]"
        credit={`${BG.prisonStair.credit}; plate X; ${BG.candle.credit}; ${BG.stillLife.credit} (${BG_SOURCE}).`}
      />
    </div>
  );
}
