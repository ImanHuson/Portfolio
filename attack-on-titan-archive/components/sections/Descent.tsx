"use client";

import PinnedScene, { type Shot } from "@/components/ending/PinnedScene";
import { DESCENT } from "@/lib/data/basement";
import { BG, FRAME_CREDIT } from "@/lib/data/backgrounds";

// The way down, in the anime's own frames: Shiganshina from the Wall in 850,
// the key Eren has carried since 845, the cellar door it does not open, Levi's
// kick, the study by lamplight, and what was under the false bottom.
const SHOTS: Shot[] = [
  { src: BG.wallTop.src, at: 0, until: 0.3, from: { s: 1.3, y: 4 }, to: { s: 1.08, y: -2 }, position: "50% 60%" },
  { src: BG.grishaKey.src, at: 0.3, until: 0.47, from: { s: 1.05 }, to: { s: 1.25, x: 3 }, position: "60% 55%" },
  { src: BG.keyDoor.src, at: 0.46, until: 0.58, from: { s: 1.2, x: -4 }, to: { s: 1.05 }, position: "45% 50%" },
  { src: BG.leviDoor.src, at: 0.57, until: 0.69, from: { s: 1.25 }, to: { s: 1.05, y: 3 }, position: "50% 50%" },
  { src: BG.basementRoom.src, at: 0.68, until: 0.86, from: { s: 1.05 }, to: { s: 1.3, x: 6 }, position: "35% 55%" },
  { src: BG.threeBooks.src, at: 0.84, until: 1, from: { s: 1.35, y: 4 }, to: { s: 1.08 }, position: "50% 55%" },
];

export default function Descent() {
  return (
    <div id="descent" className="scroll-mt-[var(--nav-h)]">
      <PinnedScene label="The descent" beats={DESCENT} shots={SHOTS} height="h-[700vh]" credit={`Frames: ${FRAME_CREDIT}.`} />
    </div>
  );
}
