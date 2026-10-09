"use client";

import PinnedScene, { type Shot } from "@/components/ending/PinnedScene";
import { PATHS_BEATS } from "@/lib/data/ending";
import { BG, BG_SOURCE } from "@/lib/data/backgrounds";

// a moonlit desert (O'Sullivan's Carson Desert, turned to night), then the
// user's own painting of the tree of light, held, then pulled away from
const SHOTS: Shot[] = [
  { src: BG.dunesNight.src, at: 0, until: 1, from: { s: 1.35, y: 6 }, to: { s: 1.05, y: 0 }, position: "50% 60%" },
  { src: "/images/bg/paths.webp", alt: "A tree of glowing gold and teal threads rising out of the dark.", at: 0.36, until: 1, from: { s: 1.3, y: 14 }, to: { s: 1, y: 0 }, position: "50% 40%", contain: true },
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
      credit={`${BG.dunes.credit}, printed as night (${BG_SOURCE}). The tree: the reader's own artwork.`}
    />
  );
}
