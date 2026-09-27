import { lerp, range, smoothstep } from "@/lib/animation/tokens";

// The descent, as a shot list keyed to scroll progress p (0..1):
//   0.00-0.30  black. Heartbeat, 736 PCE, Mars, Lykos, the two lines.
//   0.30-0.45  REVEAL: Mars fades up out of the dark, distant.
//   0.45-0.66  TRAVEL: the camera pushes in toward the upper limb, into dust.
//   0.60-0.72  DESCENT: the surface gives way to the shaft. Down.
//   0.80-0.90  ARRIVAL: the shaft slows, the lamps dim.
//   0.86-1.00  TITLE.
// Every move has a job: the push-in says "this is a real place", the shaft
// says "and this is where the Reds were kept". No move exists just to prove
// the page has 3D in it.

export type Shot = {
  cam: [number, number, number];
  target: [number, number, number];
  planetFade: number;
  starFade: number;
  dust: number;
  travel: number;
  shaftMix: number;
  shaftTravel: number;
  lamp: number;
  spin: number;
};

export function shotAt(p: number): Shot {
  const reveal = smoothstep(range(p, 0.3, 0.45));
  const push = smoothstep(range(p, 0.45, 0.66));
  const descend = smoothstep(range(p, 0.6, 0.72));
  const arrive = smoothstep(range(p, 0.8, 0.92));

  const z = lerp(lerp(7.2, 5.4, reveal), 1.55, push);
  const y = lerp(lerp(0.55, 0.28, reveal), 0.92, push);
  const ty = lerp(0, 0.86, push);

  return {
    cam: [0, y, z],
    target: [0, ty, 0],
    planetFade: reveal * (1 - descend),
    starFade: reveal * (1 - descend * 0.9),
    dust: smoothstep(range(p, 0.42, 0.6)) * (1 - arrive),
    travel: push * 14 + descend * 30 + smoothstep(range(p, 0.72, 0.86)) * 24,
    shaftMix: descend,
    shaftTravel: descend * 5 + smoothstep(range(p, 0.72, 0.86)) * 9 + arrive * 1.2,
    lamp: lerp(1, 0.25, arrive),
    spin: p * 0.9,
  };
}
