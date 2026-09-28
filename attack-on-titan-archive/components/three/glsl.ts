// Shared GLSL. Noise is sampled in 3D/2D world space (no UVs, no textures
// to download). Fog and sun live here so every material agrees on the
// atmosphere: one light, one haze, one world.

export const NOISE = /* glsl */ `
float hash3(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float hash2(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise3(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash3(i + vec3(0,0,0)), hash3(i + vec3(1,0,0)), f.x),
        mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x),
        mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y),
    f.z);
}
float noise2(vec2 x) {
  vec2 i = floor(x);
  vec2 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash2(i), hash2(i + vec2(1,0)), f.x), mix(hash2(i + vec2(0,1)), hash2(i + vec2(1,1)), f.x), f.y);
}
float fbm2(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise2(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}
float fbm3(vec3 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise3(p); p = p * 2.02 + vec3(1.7, 9.2, 3.1); a *= 0.5; }
  return v;
}
`;

/** Uniforms every lit material shares (see atmosphere in WallShot). */
export const ATMOS = /* glsl */ `
uniform vec3 uSun;        // direction TO the sun, normalized
uniform vec3 uSunColor;
uniform vec3 uSkyColor;   // ambient from above
uniform vec3 uFogColor;
uniform float uFogDensity;
uniform float uExposure;
vec3 applyFog(vec3 col, float dist, float height) {
  // height fog: thicker near the ground, thinner up high
  float h = exp(-max(height, 0.0) * 0.045);
  float f = 1.0 - exp(-dist * uFogDensity * (0.55 + 0.9 * h));
  return mix(col, uFogColor, clamp(f, 0.0, 1.0));
}
vec3 grade(vec3 c) {
  c *= uExposure;
  c = c / (1.0 + c * 0.35);           // soft shoulder, keeps highlights paper, not white
  float l = dot(c, vec3(0.299, 0.587, 0.114));
  c = mix(vec3(l), c, 0.86);          // archive desaturation
  return c;
}
`;

export const ATMOS_UNIFORMS = () => ({
  uSun: { value: [0.24, 0.3, -0.92] },
  uSunColor: { value: [1.08, 0.9, 0.68] },
  uSkyColor: { value: [0.42, 0.46, 0.5] },
  uFogColor: { value: [0.7, 0.66, 0.58] },
  uFogDensity: { value: 0.0036 },
  uExposure: { value: 1.0 },
});

/** Analytic shadows: no shadow maps (cheap on every GPU). The Wall is a
 * ring, the Titan is a vertical capsule; both are ray-tested toward the sun. */
export const SHADOWS = /* glsl */ `
uniform float uWallR;
uniform float uWallH;
uniform vec3 uTitanPos;
uniform float uTitanTop;
uniform float uTitanW;
uniform float uTime;
// drifting cloud shadows: the one thing that makes a still landscape feel like weather
float cloudShadow(vec2 p) {
  float c = fbm2(p * 0.006 + vec2(uTime * 0.012, uTime * 0.004));
  return 1.0 - 0.42 * smoothstep(0.5, 0.72, c);
}
float wallShadow(vec3 p) {
  vec2 s = normalize(uSun.xz);
  float tanE = uSun.y / length(uSun.xz);
  vec2 q = p.xz;
  float b = dot(q, s);
  float c = dot(q, q) - uWallR * uWallR;
  float disc = b * b - c;
  if (disc < 0.0) return 1.0;
  float sq = sqrt(disc);
  float t = (c < 0.0) ? (-b + sq) : (-b - sq);
  if (t < 0.05) return 1.0;
  float h = p.y + t * tanE;
  return smoothstep(uWallH - 0.3, uWallH + 0.3, h);
}
float titanShadow(vec3 p) {
  if (uTitanTop <= 0.01) return 1.0;
  vec2 s = normalize(uSun.xz);
  float tanE = uSun.y / length(uSun.xz);
  vec2 d = uTitanPos.xz - p.xz;
  float t = dot(d, s);
  if (t < 0.0) return 1.0;
  float perp = length(d - s * t);
  float h = p.y + t * tanE;
  float w = uTitanW * mix(1.0, 0.45, smoothstep(4.7, 5.2, h)); // head is narrower than the shoulders
  float body = 1.0 - smoothstep(w * 0.55, w, perp);
  float under = 1.0 - smoothstep(uTitanTop - 0.35, uTitanTop, h);
  return 1.0 - body * under * 0.82;
}
`;

export const SHADOW_UNIFORMS = () => ({
  uWallR: { value: 60 },
  uWallH: { value: 5 },
  uTitanPos: { value: [0, 0, -62.8] },
  uTitanTop: { value: 0 },
  uTitanW: { value: 1.9 }, // body plus its steam: the shadow must read from 300 m up
  uTime: { value: 0 },
});
