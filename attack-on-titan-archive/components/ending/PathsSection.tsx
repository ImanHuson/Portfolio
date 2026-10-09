"use client";

import PinnedScene, { type Shot } from "@/components/ending/PinnedScene";
import { PATHS_BEATS } from "@/lib/data/ending";
import { BG, FRAMES, FRAME_CREDIT } from "@/lib/data/backgrounds";

// the anime's Paths: the stars and the branching light, then the reader's own
// painting of the tree, then Ymir in the sand, shaping the Wall Titans
const SHOTS: Shot[] = [
  { src: BG.pathsStars.src, at: 0, until: 0.4, from: { s: 1.3, y: 6 }, to: { s: 1.05 }, position: "50% 50%" },
  { src: FRAMES.paths, alt: "A tree of glowing gold and teal threads rising out of the dark.", at: 0.36, until: 0.74, from: { s: 1.3, y: 14 }, to: { s: 1, y: 0 }, position: "50% 40%", contain: true },
  { src: BG.ymirMolding.src, at: 0.72, until: 1, from: { s: 1.3, y: 4 }, to: { s: 1.06 }, position: "45% 55%" },
];

/** stars and rising motes over the desert: a few dozen dots, transform and opacity only */
function Motes() {
  return (
    <div aria-hidden className="paths-motes pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 28 }, (_, i) => {
        const h = (n: number) => Math.abs(Math.sin((i + 1) * n) * 9973) % 1;
        return (
          <span
            key={i}
            style={{
              left: `${h(12.9) * 100}%`,
              bottom: `${h(7.3) * 30}%`,
              animationDelay: `${-h(3.1) * 14}s`,
              animationDuration: `${10 + h(5.7) * 10}s`,
              width: h(2.2) > 0.7 ? 3 : 2,
              height: h(2.2) > 0.7 ? 3 : 2,
            }}
          />
        );
      })}
    </div>
  );
}

export default function PathsSection() {
  return (
    <PinnedScene
      label="Paths"
      beats={PATHS_BEATS}
      shots={SHOTS}
      overlay={<Motes />}
      height="h-[700vh]"
      credit={`Frames: ${FRAME_CREDIT}. The tree: the reader's own artwork.`}
    />
  );
}
