"use client";

import { BATTLES, SIDE_CSS, WALL_KM } from "@/lib/data/war";
import { cn } from "@/lib/utils";

/*
 * The war room's map: an engraved plate, not a rendered landscape. The three
 * Walls at the story's radii (km), the districts as bulges where the story
 * puts them, the ring lost in 845 hatched, a faint relief of contour lines
 * (illustrative, and the page says so). Choosing a battle zooms the plate
 * toward it (one CSS transform, transitioned) and draws the forces converging
 * as schematic arrows. Markers counter-scale so they stay the same size.
 */

const M = WALL_KM.maria, R = WALL_KM.rose, S = WALL_KM.sina;
const VB = 600; // the viewBox runs -VB..VB

export const pt = (deg: number, km: number) => {
  const a = (deg * Math.PI) / 180;
  return [Math.sin(a) * km, -Math.cos(a) * km] as const;
};

// deterministic relief: wobbling rings, like a survey's contour lines
function contour(r: number, seed: number) {
  const n = 96;
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const w = Math.sin(a * 3 + seed) * 9 + Math.sin(a * 7 + seed * 2.1) * 5 + Math.sin(a * 13 + seed * 0.7) * 2.5;
    const rr = r + w;
    d += `${i ? "L" : "M"}${(Math.sin(a) * rr).toFixed(1)} ${(-Math.cos(a) * rr).toFixed(1)}`;
  }
  return d + "Z";
}
const CONTOURS = Array.from({ length: 22 }, (_, i) => contour(40 + i * 25, i * 1.37));

// districts that bulge out of their Wall: [angle, Wall radius, name]
const DISTRICTS: [number, number, string][] = [
  [180, M, "Shiganshina"],
  [180, R, "Trost"],
  [90, R, "Karanes"],
  [90, S, "Stohess"],
];
const bulge = (deg: number, r: number) => {
  const [x0, y0] = pt(deg - 4.5, r);
  const [x1, y1] = pt(deg + 4.5, r);
  return `M${x0} ${y0} A 34 34 0 0 0 ${x1} ${y1}`;
};

/** where to put a marker, in % of the square plate */
const pct = (v: number) => `${((v + VB) / (2 * VB)) * 100}%`;

export default function WarMap({ picked, onPick, className }: { picked: string | null; onPick: (id: string | null) => void; className?: string }) {
  const b = BATTLES.find((x) => x.id === picked);
  const [fx, fy] = b ? pt(b.at.deg, b.at.km) : [0, 0];
  const z = b ? 2.6 : 1;
  // zoom toward the site: translate so it lands at the centre, in % of the plate
  const tx = b ? (-fx / (2 * VB)) * 100 * z : 0;
  const ty = b ? (-fy / (2 * VB)) * 100 * z : 0;

  return (
    <div className={cn("relative overflow-hidden bg-[#0d0e0b]", className)}>
      <div
        className="war-plate absolute inset-0 m-auto aspect-square max-h-full max-w-full"
        style={{ "--z": z, "--tx": `${tx}%`, "--ty": `${ty}%` } as React.CSSProperties}
      >
        <svg viewBox={`${-VB} ${-VB} ${VB * 2} ${VB * 2}`} className="absolute inset-0 size-full" role="img" aria-labelledby="war-map-title">
          <title id="war-map-title">The Walls, with the battles of 850 marked</title>
          <defs>
            <pattern id="war-lost" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
              <line x1="0" y1="0" x2="0" y2="10" stroke="var(--flare)" strokeWidth="1.6" opacity="0.55" />
            </pattern>
            <radialGradient id="war-ground">
              <stop offset="0" stopColor="#23241e" />
              <stop offset="0.85" stopColor="#171813" />
              <stop offset="1" stopColor="#0d0e0b" />
            </radialGradient>
            <marker id="war-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="context-stroke" />
            </marker>
          </defs>
          <circle r={VB} fill="url(#war-ground)" />
          {/* relief, illustrative */}
          <g fill="none" stroke="#d8d0b8" strokeWidth="0.7" opacity="0.09">
            {CONTOURS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          {/* rivers, illustrative */}
          <g fill="none" stroke="#8fa3a8" strokeWidth="2" opacity="0.28" strokeLinecap="round">
            <path d="M-560 -120 C -420 -60, -300 -140, -180 -40 S 40 60, 120 10 S 330 -90, 560 -20" />
            <path d="M-80 560 C -60 420, 40 360, 20 240 S -40 120, 10 30" />
          </g>
          {/* the ring lost in 845 */}
          <path d={`M ${-M} 0 A ${M} ${M} 0 1 0 ${M} 0 A ${M} ${M} 0 1 0 ${-M} 0 Z M ${-R} 0 A ${R} ${R} 0 1 1 ${R} 0 A ${R} ${R} 0 1 1 ${-R} 0 Z`} fill="url(#war-lost)" fillRule="evenodd" />
          {/* the Walls: a heavy line with a crenellated inner edge */}
          {[M, R, S].map((r) => (
            <g key={r}>
              <circle r={r} fill="none" stroke="#e6dfc8" strokeWidth={r === M ? 3.2 : 2.6} />
              <circle r={r - 6} fill="none" stroke="#e6dfc8" strokeWidth="5" strokeDasharray="1.6 7" opacity="0.6" />
            </g>
          ))}
          {DISTRICTS.map(([deg, r, name]) => (
            <path key={name} d={bulge(deg, r)} fill="#1c1d18" stroke="#e6dfc8" strokeWidth="2.6" />
          ))}
          <g fontFamily="var(--font-military)" fontWeight="600" letterSpacing="5" fill="#e6dfc8" fontSize="26" textAnchor="middle" opacity="0.85">
            <text y={-M + 30}>WALL MARIA</text>
            <text y={-R + 30}>WALL ROSE</text>
            <text y={-S + 30}>WALL SINA</text>
          </g>
          <g fontFamily="var(--font-mono)" fill="#e6dfc8" fontSize="22" opacity="0.7" textAnchor="middle">
            {DISTRICTS.map(([deg, r, name]) => {
              // east districts are labelled above their bulge, clear of the battle markers
              const [x, y] = deg === 90 ? pt(deg, r + 18) : pt(deg, r + 58);
              return (
                <text key={name} x={x} y={deg === 90 ? y - 34 : y + 8}>
                  {name.toUpperCase()}
                </text>
              );
            })}
          </g>
          {/* compass and scale */}
          <g transform="translate(470 -470)" stroke="#e6dfc8" fill="none" opacity="0.6">
            <circle r="34" strokeWidth="1" />
            <path d="M0 -44 L7 0 L0 44 L-7 0 Z" fill="#e6dfc8" fillOpacity="0.15" />
            <text y="-52" textAnchor="middle" fontSize="16" fill="#e6dfc8" stroke="none" fontFamily="var(--font-military)">
              N
            </text>
          </g>
          <g fontFamily="var(--font-mono)" fill="#e6dfc8" fontSize="20" opacity="0.6">
            <line x1="-560" y1="560" x2="-460" y2="560" stroke="#e6dfc8" strokeWidth="2" />
            <text x="-560" y="584">0</text>
            <text x="-470" y="584">100 KM</text>
          </g>
          {/* forces converging on the chosen site, schematic */}
          {b &&
            b.forces.map((f, i) => {
              const a = ((i / b.forces.length) * 360 + 30) * (Math.PI / 180);
              const sx = fx + Math.cos(a) * 120, sy = fy + Math.sin(a) * 120;
              const ex = fx + Math.cos(a) * 18, ey = fy + Math.sin(a) * 18;
              return (
                <path
                  key={b.id + f.label}
                  className="war-force"
                  d={`M${sx} ${sy} Q ${(sx + ex) / 2 + Math.sin(a) * 30} ${(sy + ey) / 2 - Math.cos(a) * 30} ${ex} ${ey}`}
                  fill="none"
                  stroke={SIDE_CSS[f.side]}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  markerEnd="url(#war-head)"
                  pathLength={1}
                />
              );
            })}
        </svg>
        {BATTLES.map((x) => {
          const [mx, my] = pt(x.at.deg, x.at.km);
          const on = x.id === picked;
          const left = mx > 300; // near the plate's right edge: the label goes to the left of the marker
          return (
            <button
              key={x.id}
              type="button"
              onClick={() => onPick(on ? null : x.id)}
              aria-pressed={on}
              aria-label={`${x.name}, ${x.year}`}
              className={cn("war-marker group absolute flex items-center gap-2", left && "war-marker-left flex-row-reverse")}
              style={{ left: pct(mx), top: pct(my) }}
            >
              <span className={cn("block size-3.5 rotate-45 border-2 transition-colors", on ? "border-paper bg-flare" : "border-flare bg-base group-hover:bg-flare")} />
              <span className={cn("bg-base/80 px-1.5 py-0.5 font-mono text-meta whitespace-nowrap text-paper transition-opacity", picked && !on && "opacity-40")}>
                {x.name.replace(" District", "")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
