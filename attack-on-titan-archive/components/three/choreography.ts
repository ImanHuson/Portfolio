import { lerp, range, smoothstep } from "@/lib/animation/tokens";

// The opening, as a shot list keyed to scroll progress p (0..1). Every
// move has a job; nothing moves just to prove the page has 3D in it.
//
//   0.00-0.10  black, then the Wall, close. It fills the frame.
//   0.10-0.30  RISE: the Wall shrinks, the district and the fields appear.
//   0.30-0.40  HOLD. A shadow crosses the fields and climbs the Wall.
//   0.40-0.64  DOWN onto the parapet. The Titan forms bottom-up in its
//              own steam: foot, torso, face. The camera tilts with it
//              until they are eye to eye. Then the flash; the gate goes.
//   0.64-0.72  TITLE, pulled back: the head over the Wall.
//   0.72-0.77  It is gone in steam. Down to the foot of the Wall.
//   0.77-0.87  THROUGH the Wall: the stone as x-ray, and what is inside it.
//   0.87-1.00  OUT: the world beyond, and the things walking in it.

type V3 = [number, number, number];
type Key = { p: number; cam: V3; tgt: V3 };

const KEYS: Key[] = [
  { p: 0.0, cam: [1.4, 3.1, -52.5], tgt: [0.8, 3.7, -61] },
  { p: 0.1, cam: [1.4, 3.3, -52.3], tgt: [0.8, 3.8, -61] },
  { p: 0.3, cam: [11, 30, 14], tgt: [0, 0, -34] },
  { p: 0.4, cam: [9.5, 31.5, 17], tgt: [-1, 0, -42] },
  // onto the parapet: looking down at the feet as the body forms
  { p: 0.47, cam: [5.4, 6.8, -60.5], tgt: [0, 0.6, -65] },
  { p: 0.55, cam: [4.4, 6.0, -60.5], tgt: [0, 3.2, -65] },
  // eye to eye
  { p: 0.61, cam: [3.4, 5.55, -60.5], tgt: [0, 5.5, -65] },
  { p: 0.64, cam: [3.0, 5.5, -60.5], tgt: [0, 5.52, -65] },
  // pull back and up: the head over the Wall, the district it is looking at
  { p: 0.72, cam: [7.2, 6.7, -53.5], tgt: [-5.2, 5.3, -64] },
  { p: 0.775, cam: [0, 2.6, -56.5], tgt: [0, 2.6, -70] },
  { p: 0.87, cam: [0, 2.6, -61.2], tgt: [0, 2.6, -80] },
  { p: 1.0, cam: [0, 7.5, -90], tgt: [0, 3.5, -210] },
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

export function shotAt(p: number) {
  const { cam, tgt } = camAt(p);
  const flash = range(p, 0.614, 0.62) * (1 - range(p, 0.62, 0.645));
  const out = smoothstep(range(p, 0.86, 0.95));
  return {
    cam,
    tgt,
    exposure: smoothstep(range(p, 0.035, 0.12)) + flash * 2.2,
    shadowTop: smoothstep(range(p, 0.31, 0.4)) * 6.2 * (1 - smoothstep(range(p, 0.72, 0.76))),
    cut: smoothstep(range(p, 0.44, 0.6)) * 6.9, // the steam column's clear line
    present: smoothstep(range(p, 0.4, 0.43)),
    steam: smoothstep(range(p, 0.34, 0.41)) * (1 - smoothstep(range(p, 0.75, 0.82))),
    eyes: smoothstep(range(p, 0.6, 0.612)),
    titanFade: 1 - smoothstep(range(p, 0.72, 0.765)),
    vanish: smoothstep(range(p, 0.715, 0.77)), // steam surge as it goes
    breach: smoothstep(range(p, 0.618, 0.63)),
    dust: smoothstep(range(p, 0.618, 0.65)) * (1 - smoothstep(range(p, 0.7, 0.78))),
    xray: smoothstep(range(p, 0.772, 0.792)) * (1 - smoothstep(range(p, 0.85, 0.868))),
    xrayTravel: range(p, 0.772, 0.868),
    out,
  };
}

/** Altitude above the district floor, in metres (1 unit = 10 m). */
export const altitudeAt = (p: number) => Math.round(camAt(p).cam[1] * 10);
