"use client";

import { cn } from "@/lib/utils";

/*
 * The gear as an engineering plate: a rear elevation of a soldier wearing it,
 * in line, the way a workshop would draw it. Parts are groups that can be
 * picked out (the rest dims) and pulled apart along their own directions
 * (`explode`, 0..1, applied as SVG transforms). No dimensions are given: the
 * story never states them. The drawing is the archive's schematic, not a
 * copy of any official design sheet.
 */

type Side = -1 | 1;
const INK = "#e6dfc8";

// how far each part travels when the gear is taken apart: [dx, dy] for the left side (right is mirrored)
const APART: Record<string, [number, number]> = {
  harness: [0, 0],
  unit: [0, 95],
  anchors: [-40, -30],
  boxes: [-95, 45],
  canisters: [-120, -25],
  grips: [-70, -45],
  blades: [-95, 70],
  spears: [40, 30],
};

/** a part, moved along its own direction as the gear comes apart (the right
 * side is drawn inside a mirrored group, so the mirror flips it for us) */
function Part({ id, active, explode, children }: { id: string; active: string | null; explode: number; side?: Side; children: React.ReactNode }) {
  const [dx, dy] = APART[id];
  const x = dx * explode;
  const y = dy * explode;
  return (
    <g
      data-part={id}
      className="odm-part"
      transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
      opacity={active && active !== id ? 0.22 : 1}
      stroke={active === id ? "var(--flare)" : INK}
    >
      {children}
    </g>
  );
}

/** one side of the gear, drawn for the left and mirrored for the right */
function Sided({ children }: { children: (s: Side) => React.ReactNode }) {
  return (
    <>
      <g>{children(-1)}</g>
      <g transform="translate(1000 0) scale(-1 1)">{children(1)}</g>
    </>
  );
}

export default function OdmPlate({ active, explode, className }: { active: string | null; explode: number; className?: string }) {
  const p = (id: string, s: Side, el: React.ReactNode) => (
    <Part id={id} active={active} explode={explode} side={s}>
      {el}
    </Part>
  );
  return (
    <svg viewBox="0 0 1000 720" className={cn("h-auto w-full", className)} role="img" aria-labelledby="odm-plate-title odm-plate-desc">
      <title id="odm-plate-title">Omni-directional mobility gear, rear elevation</title>
      <desc id="odm-plate-desc">
        A soldier seen from behind wearing the gear: harness straps over the chest and thighs, the main unit at the back of the
        belt with two wire spools, anchors fired out on wires to either side, blade boxes at both hips with gas canisters on top,
        grips in both hands with blades, and an inset of a Thunder Spear.
      </desc>
      <defs>
        <pattern id="odm-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={INK} strokeWidth="0.8" opacity="0.35" />
        </pattern>
        <pattern id="odm-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke={INK} strokeWidth="0.5" opacity="0.07" />
        </pattern>
        <marker id="odm-dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
          <circle cx="5" cy="5" r="4" fill={INK} />
        </marker>
      </defs>
      <rect width="1000" height="720" fill="url(#odm-grid)" />

      {/* the wearer, faint */}
      <g fill={INK} fillOpacity="0.045" stroke={INK} strokeOpacity="0.28" strokeWidth="1.2" strokeDasharray="5 4">
        <ellipse cx="500" cy="108" rx="36" ry="44" />
        <path d="M486 150 L486 172 L514 172 L514 150" fill="none" />
        <path d="M432 176 C 404 186 396 258 404 330 L 414 404 L 586 404 L 596 330 C 604 258 596 186 568 176 C 545 168 455 168 432 176 Z" />
        <path d="M432 180 C 400 196 358 238 312 286 L 298 300 L 312 314 L 328 300 C 368 262 402 232 426 216" />
        <path d="M568 180 C 600 196 642 238 688 286 L 702 300 L 688 314 L 672 300 C 632 262 598 232 574 216" />
        <path d="M418 404 L 404 640 L 446 640 L 492 410 Z" />
        <path d="M582 404 L 596 640 L 554 640 L 508 410 Z" />
      </g>

      <g fill="none" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        {/* A: harness, over the shoulders, round the chest, the belt, and the thighs */}
        <Part id="harness" active={active} explode={explode}>
          <path d="M448 178 L 548 300 M 552 178 L 452 300" />
          <path d="M412 296 C 450 306 550 306 588 296" />
          <rect x="410" y="384" width="180" height="18" rx="3" />
          <path d="M424 402 L 432 470 M 576 402 L 568 470" />
          <path d="M414 470 C 430 480 470 480 482 470 M 518 470 C 530 480 570 480 586 470" />
          <path d="M410 540 C 426 550 462 550 474 540 M 526 540 C 538 550 574 550 590 540" />
          {[448, 552].map((x) => (
            <rect key={x} x={x - 7} y="292" width="14" height="12" rx="2" />
          ))}
        </Part>

        {/* B: the main unit at the back of the belt: turbine, two wire spools */}
        <Part id="unit" active={active} explode={explode}>
          <rect x="440" y="392" width="120" height="58" rx="10" fill="#141511" />
          <rect x="440" y="392" width="120" height="58" rx="10" fill="url(#odm-hatch)" stroke="none" />
          <circle cx="470" cy="421" r="19" />
          <circle cx="470" cy="421" r="6" />
          <circle cx="530" cy="421" r="19" />
          <circle cx="530" cy="421" r="6" />
          <rect x="488" y="378" width="24" height="16" rx="3" fill="#141511" />
          <path d="M494 450 L 494 470 L 506 470 L 506 450" />
          <path d="M452 400 L 460 400 M 540 400 L 548 400" />
        </Part>

        <Sided>
          {(s) => (
            <>
              {/* C: anchors, fired out on their wires */}
              {p(
                "anchors",
                s,
                <>
                  <path d="M440 414 L 418 412" strokeWidth="5" />
                  <path d="M418 410 C 300 360 200 250 128 150" strokeWidth="1" strokeDasharray="2 5" />
                  <path d="M128 150 L 112 128 M 128 150 L 104 146 M 128 150 L 114 138" strokeWidth="2.4" />
                </>,
              )}
              {/* D: blade boxes at the hips */}
              {p(
                "boxes",
                s,
                <>
                  <path d="M296 452 L 410 470 L 404 512 L 290 494 Z" fill="#141511" />
                  <path d="M296 452 L 410 470 L 404 512 L 290 494 Z" fill="url(#odm-hatch)" stroke="none" />
                  <path d="M300 472 L 406 489" strokeWidth="1" opacity="0.7" />
                  {[310, 350, 390].map((x) => (
                    <circle key={x} cx={x} cy={457 + (x - 296) * 0.158} r="1.8" fill={INK} stroke="none" />
                  ))}
                </>,
              )}
              {/* E: gas canisters riding on top of the boxes */}
              {p(
                "canisters",
                s,
                <>
                  <path d="M300 432 L 404 448 C 412 449 414 464 406 466 L 302 450 C 292 449 292 431 300 432 Z" fill="#141511" />
                  <path d="M318 436 L 316 453 M 380 445 L 378 462" strokeWidth="1.2" />
                  <path d="M404 456 L 420 458" />
                </>,
              )}
              {/* F: grips and triggers, in the hands */}
              {p(
                "grips",
                s,
                <>
                  <rect x="290" y="282" width="18" height="44" rx="4" fill="#141511" transform="rotate(-20 299 304)" />
                  <path d="M312 296 C 320 300 318 310 310 312" />
                  <path d="M306 326 C 330 380 380 420 420 440" strokeWidth="1" strokeDasharray="2 4" opacity="0.7" />
                </>,
              )}
              {/* G: the blades */}
              {p("blades", s, <path d="M300 322 L 309 328 L 196 478 L 190 472 Z" fill="#141511" />)}
            </>
          )}
        </Sided>

        {/* H: a Thunder Spear, inset: a later weapon */}
        <Part id="spears" active={active} explode={explode}>
          <rect x="730" y="560" width="240" height="120" rx="2" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M760 620 L 900 620 M 900 612 L 940 620 L 900 628 Z M 772 612 L 772 628 M 790 610 L 790 630" />
          <text x="742" y="582" fontSize="13" fill={INK} stroke="none" fontFamily="var(--font-mono)" opacity="0.75">
            H · LATER (854)
          </text>
        </Part>
      </g>

      {/* part letters */}
      <g fontFamily="var(--font-mono)" fontSize="15" fill={INK} opacity="0.8">
        {[
          ["A", 600, 300, "harness"],
          ["B", 575, 470, "unit"],
          ["C", 150, 120, "anchors"],
          ["D", 268, 516, "boxes"],
          ["E", 270, 432, "canisters"],
          ["F", 276, 276, "grips"],
          ["G", 176, 496, "blades"],
        ].map(([l, x, y, id]) => {
          const [dx, dy] = APART[id as string];
          return (
            <text key={l} x={(x as number) + dx * explode} y={(y as number) + dy * explode} opacity={active && active !== id ? 0.3 : 1}>
              {l}
            </text>
          );
        })}
      </g>

      {/* the plate's title block */}
      <g fontFamily="var(--font-mono)" fill={INK} fontSize="13" opacity="0.7">
        <text x="30" y="40">PLATE VII · OMNI-DIRECTIONAL MOBILITY GEAR</text>
        <text x="30" y="60">REAR ELEVATION · SCHEMATIC · NOT TO SCALE</text>
      </g>
    </svg>
  );
}
