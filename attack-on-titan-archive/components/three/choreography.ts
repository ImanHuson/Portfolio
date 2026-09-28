import { lerp, range, smoothstep } from "@/lib/animation/tokens";

// The opening, as a shot list keyed to scroll progress p (0..1). Every
// move has a job; nothing moves just to prove the page has 3D in it.
//
//   0.00-0.10  black, then the Wall, close. It fills the frame.
//   0.10-0.30  RISE: the Wall shrinks, the district and the fields appear.
//   0.30-0.44  HOLD, high. Birds over the roofs, cloud shadows. Then
//              lightning beyond the Wall (a Titan shifter transforms), a
//              column of steam, and a long shadow thrown across the district.
//   0.44-0.60  DOWN onto the parapet. The steam clears bottom-up: foot,
//              torso, face. The camera tilts with it until they are eye to eye.
//   0.61-0.63  The kick. The gate goes; the frame shakes.
//   0.64-0.72  TITLE, pulled back: the head over the Wall.
//   0.72-0.77  It is gone in steam. Down to the foot of the Wall.
//   0.77-0.87  THROUGH the Wall: the stone as x-ray, and what is inside it.
//   0.87-1.00  OUT: hills, forest, a river, and the things walking in it.

type V3 = [number, number, number];
type Key = { p: number; cam: V3; tgt: V3 };

const KEYS: Key[] = [
  { p: 0.0, cam: [1.4, 3.1, -52.5], tgt: [0.8, 3.7, -61] },
  { p: 0.1, cam: [1.4, 3.3, -52.3], tgt: [0.8, 3.8, -61] },
  { p: 0.3, cam: [11, 30, 14], tgt: [0, 0, -34] },
  // hold high, turning slowly toward the south wall as the bolt lands
  { p: 0.44, cam: [8.5, 29, 12], tgt: [-1, 2, -48] },
  // onto the parapet: looking down at the feet as the steam clears
  { p: 0.5, cam: [5.2, 6.9, -60.35], tgt: [0, 0.8, -62.8] },
  { p: 0.56, cam: [4.6, 6.2, -59.6], tgt: [0, 3.4, -62.8] },
  // eye to eye
  { p: 0.61, cam: [3.6, 5.6, -58.9], tgt: [0, 5.45, -62.8] },
  { p: 0.64, cam: [3.3, 5.55, -58.6], tgt: [0, 5.45, -62.8] },
  // pull back and up: the head over the Wall, the district it is looking at
  { p: 0.72, cam: [7.2, 6.7, -52.5], tgt: [-5.2, 5.3, -63] },
  { p: 0.775, cam: [0, 2.6, -56.5], tgt: [0, 2.6, -70] },
  { p: 0.87, cam: [0, 2.6, -61.2], tgt: [0, 2.6, -80] },
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
    exposure: smoothstep(range(p, 0.035, 0.12)) + bolt * 0.9 + range(p, 0.614, 0.618) * (1 - range(p, 0.618, 0.63)) * 0.35,
    bolt,
    // the shadow is thrown the moment it stands; it sweeps over the district
    shadowTop: smoothstep(range(p, 0.408, 0.44)) * 6.2 * (1 - smoothstep(range(p, 0.72, 0.76))),
    cut: smoothstep(range(p, 0.5, 0.6)) * 6.9, // the steam column's clear line
    present: smoothstep(range(p, 0.404, 0.41)),
    steam: smoothstep(range(p, 0.404, 0.43)) * (1 - smoothstep(range(p, 0.75, 0.82))),
    eyes: smoothstep(range(p, 0.6, 0.612)),
    titanFade: 1 - smoothstep(range(p, 0.72, 0.765)),
    vanish: smoothstep(range(p, 0.715, 0.77)),
    breach: smoothstep(range(p, 0.616, 0.628)),
    dust: smoothstep(range(p, 0.616, 0.65)) * (1 - smoothstep(range(p, 0.7, 0.78))),
    birds: 1 - smoothstep(range(p, 0.5, 0.56)),
    scatter: smoothstep(range(p, 0.406, 0.48)),
    rays: (1 - smoothstep(range(p, 0.77, 0.79))) * (0.35 + 0.65 * smoothstep(range(p, 0.87, 0.95))) + smoothstep(range(p, 0.404, 0.45)) * 0.5 * (1 - smoothstep(range(p, 0.72, 0.77))),
    xray: smoothstep(range(p, 0.772, 0.792)) * (1 - smoothstep(range(p, 0.85, 0.868))),
    xrayTravel: range(p, 0.772, 0.868),
    out: smoothstep(range(p, 0.86, 0.95)),
  };
}

/** Altitude above the district floor, in metres (1 unit = 10 m). */
export const altitudeAt = (p: number) => Math.round(camAt(p).cam[1] * 10);
