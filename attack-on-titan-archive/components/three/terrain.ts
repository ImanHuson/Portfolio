// One height function, written twice (GLSL + JS) so the ground mesh, the
// trees and the walking Titans agree exactly on where the land is. Sums of
// sines rather than noise, because they are bit-for-bit reproducible in both.
// Flat inside and near the Wall (the district and its farmland were levelled),
// rolling hills further out, a river valley cut through them.

export const RIVER = /* glsl */ `
float riverX(float z) { return -95.0 + 38.0 * sin(z * 0.0105) + 14.0 * sin(z * 0.031 + 1.3); }
`;

export const HEIGHT = /* glsl */ `
${RIVER}
float terrainH(vec2 p) {
  float r = length(p);
  float hills = sin(p.x * 0.011) * cos(p.y * 0.013) * 7.0
              + sin(p.x * 0.027 + p.y * 0.019) * 3.2
              + sin(p.y * 0.0052 + 0.7) * 5.0
              + sin((p.x - p.y) * 0.041) * 1.2;
  hills = hills + 6.0;
  float mask = smoothstep(95.0, 230.0, r);
  float h = hills * mask;
  float rd = abs(p.x - riverX(p.y));
  h = mix(h - 1.6, h, smoothstep(9.0, 26.0, rd));
  return h * smoothstep(80.0, 110.0, r) + min(0.0, h) * (1.0 - smoothstep(80.0, 110.0, r));
}
`;

export const riverX = (z: number) => -95 + 38 * Math.sin(z * 0.0105) + 14 * Math.sin(z * 0.031 + 1.3);

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

export function terrainH(x: number, z: number) {
  const r = Math.hypot(x, z);
  let hills =
    Math.sin(x * 0.011) * Math.cos(z * 0.013) * 7 +
    Math.sin(x * 0.027 + z * 0.019) * 3.2 +
    Math.sin(z * 0.0052 + 0.7) * 5 +
    Math.sin((x - z) * 0.041) * 1.2;
  hills += 6;
  let h = hills * smooth(95, 230, r);
  const rd = Math.abs(x - riverX(z));
  h = h - 1.6 + 1.6 * smooth(9, 26, rd);
  return h * smooth(80, 110, r) + Math.min(0, h) * (1 - smooth(80, 110, r));
}
