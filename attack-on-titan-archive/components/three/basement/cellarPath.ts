// The descent, as a function of scroll progress 0..1: camera keyframes (a
// Catmull-Rom path through them) and the scene's moving parts. Beats line up
// with DESCENT in lib/data/basement.ts.

type V3 = [number, number, number];
type Key = { t: number; pos: V3; look: V3 };

const KEYS: Key[] = [
  { t: 0.0, pos: [0.0, 1.55, 0.95], look: [0.0, -1.0, -1.0] }, // above the ruin, looking down the hatch
  { t: 0.14, pos: [0.0, 0.55, -0.1], look: [0.0, -1.6, -2.3] }, // at the lip of the hatch
  { t: 0.3, pos: [0.0, -0.45, -1.6], look: [0.0, -2.1, -3.9] }, // on the stair, in the shaft of light
  { t: 0.44, pos: [0.0, -1.5, -3.3], look: [0.08, -2.05, -4.5] }, // the foot of the stair, the door ahead
  { t: 0.5, pos: [0.22, -1.92, -4.08], look: [0.3, -1.97, -4.5] }, // close on the lock
  { t: 0.575, pos: [0.2, -1.9, -4.04], look: [0.3, -1.97, -4.5] }, // hold: the key does not turn
  { t: 0.64, pos: [0.0, -1.62, -4.2], look: [0.25, -2.05, -6.8] }, // the door gives
  { t: 0.73, pos: [0.25, -1.5, -5.7], look: [0.8, -2.25, -8.9] }, // into the room, the desk ahead
  { t: 0.82, pos: [0.78, -1.58, -7.75], look: [0.8, -2.36, -8.95] }, // at the desk
  { t: 0.9, pos: [0.8, -1.55, -7.85], look: [0.8, -2.47, -8.5] }, // looking into the drawer
  { t: 1.0, pos: [0.8, -1.62, -7.95], look: [0.8, -2.48, -8.5] },
];

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function catmull(p0: number, p1: number, p2: number, p3: number, t: number) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

function along(p: number, key: "pos" | "look"): V3 {
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].t) i++;
  const a = KEYS[Math.max(0, i - 1)][key];
  const b = KEYS[i][key];
  const c = KEYS[i + 1][key];
  const d = KEYS[Math.min(KEYS.length - 1, i + 2)][key];
  // ease within each segment so the camera settles on every beat
  const raw = clamp01((p - KEYS[i].t) / (KEYS[i + 1].t - KEYS[i].t));
  const u = raw * raw * (3 - 2 * raw);
  return [catmull(a[0], b[0], c[0], d[0], u), catmull(a[1], b[1], c[1], d[1], u), catmull(a[2], b[2], c[2], d[2], u)];
}

export type CellarState = {
  pos: V3;
  look: V3;
  door: number;
  drawer: number;
  books: number;
  white: number;
  lantern: number;
  keyIn: number;
  keyTurn: number;
};

// the key: in, two attempts to turn that stop short, out
const TURN: [number, number][] = [
  [0.5, 0], [0.508, -0.5], [0.512, -0.42], [0.516, -0.52], [0.524, 0], [0.535, 0], [0.545, -0.6], [0.553, 0],
];
function turnAt(p: number) {
  if (p <= TURN[0][0] || p >= TURN[TURN.length - 1][0]) return 0;
  let i = 0;
  while (p > TURN[i + 1][0]) i++;
  const [t0, v0] = TURN[i];
  const [t1, v1] = TURN[i + 1];
  const u = (p - t0) / (t1 - t0);
  return v0 + (v1 - v0) * (u * u * (3 - 2 * u));
}

export function cellarAt(p: number, time = 0): CellarState {
  const pos = along(p, "pos");
  const look = along(p, "look");
  // the door is forced: a short, hard shake as it gives
  const hitA = 0.585;
  const hit = p > hitA && p < hitA + 0.03 ? Math.exp(-(p - hitA) * 90) : 0;
  pos[0] += Math.sin(time * 61) * 0.02 * hit;
  pos[1] += Math.sin(time * 47 + 1) * 0.02 * hit;
  return {
    pos,
    look,
    door: smooth(hitA, hitA + 0.035, p),
    drawer: smooth(0.8, 0.84, p),
    books: smooth(0.865, 0.9, p),
    white: smooth(0.94, 1.0, p),
    // no lantern above ground; lit as the camera drops into the hatch
    lantern: smooth(0.06, 0.2, p),
    keyIn: p < 0.56 ? smooth(0.455, 0.49, p) : 1 - smooth(0.56, 0.578, p),
    keyTurn: turnAt(p),
  };
}
