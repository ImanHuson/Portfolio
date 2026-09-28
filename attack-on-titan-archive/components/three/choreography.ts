import { lerp, range, smoothstep } from "@/lib/animation/tokens";

// The opening, as a shot list keyed to scroll progress p (0..1). Every
// move has a job; nothing moves just to prove the page has 3D in it.
//
//   0.00-0.10  the Wall, close and dim, under the place card. It fills the frame.
//   0.10-0.30  RISE: the Wall shrinks, the district and the fields appear.
//   0.30-0.44  HOLD, high. Birds over the roofs, cloud shadows. Then
//              lightning beyond the Wall, the birds scatter, and a long
//              shadow is thrown across the district.
//   0.44-0.61  DOWN onto the parapet, facing out, then up the steam column
//              as it climbs past the Wall's top, backlit by the sun. Nothing
//              is shown standing in it; the report gives its height.
//   0.61-0.63  The kick. The gate goes; the frame shakes; dust.
//   0.64-0.72  TITLE, pulled back: the Wall, the column, the dust at the gate.
//   0.72-0.80  The column bursts and thins. Up over the Wall.
//   0.80-1.00  OUT: hills, forest, the river, the world past the Walls.

type V3 = [number, number, number];
type Key = { p: number; cam: V3; tgt: V3 };

const KEYS: Key[] = [
  { p: 0.0, cam: [1.4, 3.1, -52.5], tgt: [0.8, 3.7, -61] },
  { p: 0.1, cam: [1.4, 3.3, -52.3], tgt: [0.8, 3.8, -61] },
  { p: 0.3, cam: [11, 30, 14], tgt: [0, 0, -34] },
  // hold high, turning slowly toward the south wall as the bolt lands
  { p: 0.44, cam: [8.5, 29, 12], tgt: [-1, 2, -48] },
  // onto the parapet, a way along the Wall from it: the foot of the steam first
  { p: 0.5, cam: [15, 6.0, -57.6], tgt: [0, 2.6, -63.2] },
  // then up the column as it climbs past the Wall, into the sun
  { p: 0.56, cam: [13.8, 5.9, -57.8], tgt: [0, 4.8, -63.3] },
  { p: 0.61, cam: [12.6, 5.8, -57.6], tgt: [0, 6.2, -63.4] },
  { p: 0.64, cam: [12.2, 5.85, -57.4], tgt: [-1, 5.8, -63.4] },
  // pull back and up: the Wall, the column, the dust at the gate
  { p: 0.72, cam: [22, 9.5, -44], tgt: [-3, 4.6, -63] },
  // over the Wall
  { p: 0.8, cam: [2.4, 8.6, -62.4], tgt: [-18, 4.5, -95] },
  { p: 1.0, cam: [-40, 9.5, -100], tgt: [-112, 0.5, -205] }, // down the river valley
];

function camAt(p: number) {
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const t = smoothstep(range(p, a.p, b.p));
  const mix = (x: V3, y: V3): V3 => [lerp(x[0], y[0], t), lerp(x[1], y[1], t), lerp(x[2], y[2], t)];
  return { cam: mix(a.cam, b.cam), tgt: mix(a.tgt, b.tgt) };
}

export type Shot = ReturnType<typeof shotAt>;

export function shotAt(p: number, t = 0) {
  const { cam, tgt } = camAt(p);
  // the kick: a short decaying shake
  const kick = range(p, 0.614, 0.64);
  const shake = kick > 0 && kick < 1 ? Math.sin(t * 60) * 0.06 * (1 - kick) : 0;
  const bolt = range(p, 0.402, 0.406) * (1 - range(p, 0.406, 0.418));
  return {
    cam: [cam[0] + shake, cam[1] + shake * 0.6, cam[2]] as V3,
    tgt,
    exposure: 0.5 + 0.5 * smoothstep(range(p, 0.02, 0.12)) + bolt * 0.9 + range(p, 0.614, 0.618) * (1 - range(p, 0.618, 0.63)) * 0.35,
    bolt,
    // the shadow is thrown the moment it stands; it sweeps over the district
    shadowTop: smoothstep(range(p, 0.408, 0.44)) * 6.2 * (1 - smoothstep(range(p, 0.72, 0.76))),
    steam: smoothstep(range(p, 0.404, 0.43)) * (1 - smoothstep(range(p, 0.76, 0.84))),
    rise: smoothstep(range(p, 0.404, 0.61)),
    vanish: smoothstep(range(p, 0.715, 0.77)),
    breach: smoothstep(range(p, 0.616, 0.628)),
    dust: smoothstep(range(p, 0.616, 0.65)) * (1 - smoothstep(range(p, 0.72, 0.8))),
    birds: 1 - smoothstep(range(p, 0.5, 0.56)),
    scatter: smoothstep(range(p, 0.406, 0.48)),
    rays: 0.35 + 0.65 * smoothstep(range(p, 0.84, 0.95)) + smoothstep(range(p, 0.404, 0.45)) * 0.6 * (1 - smoothstep(range(p, 0.74, 0.8))),
    out: smoothstep(range(p, 0.86, 0.95)),
  };
}

/** Altitude above the district floor, in metres (1 unit = 10 m). */
export const altitudeAt = (p: number) => Math.round(camAt(p).cam[1] * 10);
