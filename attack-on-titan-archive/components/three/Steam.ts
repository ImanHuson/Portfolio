import { Geometry, Mesh, Program, type OGLRenderingContext } from "ogl";
import { ATMOS, NOISE } from "./glsl";

// Steam and dust as soft point sprites. Each particle loops on its own
// clock (rise, spread, fade), so an emitter costs one draw call and no CPU
// work per frame. Titans run hot: this is the Colossal's signature, and
// also the dust the gate throws up when it falls.

const vertex = /* glsl */ `
attribute vec4 seed;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 uOrigin;
uniform vec3 uSpread;     // radius x, rise height, radius z
uniform float uTime;
uniform float uSpeed;
uniform float uSize;
uniform float uIntensity;
uniform float uCeil;      // emit across this height
uniform float uClear;     // below this height the column has cleared (-1: no clearing)
uniform float uPxScale;
varying float vAlpha;
varying vec3 vWorld;
varying float vLife;
varying float vSeed;
void main() {
  vSeed = seed.y;
  float life = fract(uTime * uSpeed * (0.6 + 0.8 * seed.w) + seed.x);
  float a = seed.y * 6.2831;
  float r = sqrt(seed.z);
  float y0 = seed.w * uCeil;
  vec3 p = uOrigin + vec3(cos(a) * r * uSpread.x * (0.6 + life), y0 + life * uSpread.y, sin(a) * r * uSpread.z * (0.6 + life));
  p.x += life * life * 1.2;                     // drift downwind
  p.y += life * 0.0;
  vec4 mv = viewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float size = uSize * (0.4 + life * 1.6);
  gl_PointSize = size * uPxScale / max(-mv.z, 0.1);
  vAlpha = uIntensity * smoothstep(0.0, 0.15, life) * (1.0 - smoothstep(0.55, 1.0, life));
  // the clearing column: particles born below the clear line are gone, except
  // a few loose wisps that keep rising off the hot body
  if (uClear > -0.5) vAlpha *= seed.x < 0.22 ? 0.45 : smoothstep(uClear - 0.25, uClear + 0.45, y0);
  vWorld = p;
  vLife = life;
}
`;

const fragment = /* glsl */ `
precision highp float;
${ATMOS}
${NOISE}
uniform vec3 cameraPosition;
uniform vec3 uTint;
varying float vSeed;
varying float vAlpha;
varying vec3 vWorld;
varying float vLife;
void main() {
  // a billow, not a disc: noise eats into the edge, so each puff has a torn outline
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float n = fbm2(gl_PointCoord * 2.6 + vSeed * 17.0);
  float dens = smoothstep(0.0, 0.32, (0.46 - d) + (n - 0.5) * 0.6);
  if (dens * vAlpha < 0.004) discard;
  // backlit: thin edges catch the sun (a silver lining when looking toward it),
  // the dense core stays in its own shadow
  vec3 V = normalize(vWorld - cameraPosition);
  float back = pow(max(dot(V, normalize(uSun)), 0.0), 3.0);
  float thin = 1.0 - smoothstep(0.0, 0.6, dens);
  // steam is white: a cool grey core in its own shadow, sunlit edges
  vec3 core = uTint * (vec3(0.74, 0.77, 0.82) * 0.9 + uSkyColor * 0.35 + uSunColor * 0.18) * mix(0.7, 1.0, vLife);
  vec3 lit = uTint * (uSunColor * (0.8 + 1.8 * back) + vec3(0.2));
  vec3 col = mix(core, lit, clamp(thin * 0.85 + 0.2 + (1.0 - vLife) * 0.25, 0.0, 1.0));
  float dist = length(cameraPosition - vWorld);
  gl_FragColor = vec4(grade(applyFog(col, dist, vWorld.y)), min(dens * vAlpha * 0.42, 0.92));
}
`;

export function createSteam(
  gl: OGLRenderingContext,
  shared: Record<string, { value: unknown }>,
  count: number,
  opts: { origin: [number, number, number]; spread: [number, number, number]; size: number; speed: number; tint: [number, number, number] },
) {
  const seed = new Float32Array(count * 4);
  for (let i = 0; i < seed.length; i++) seed[i] = Math.random();
  const geometry = new Geometry(gl, { seed: { size: 4, data: seed } });
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      ...shared,
      uOrigin: { value: opts.origin },
      uSpread: { value: opts.spread },
      uTime: { value: 0 },
      uSpeed: { value: opts.speed },
      uSize: { value: opts.size },
      uIntensity: { value: 0 },
      uCeil: { value: 6 },
      uClear: { value: -1 },
      uPxScale: { value: 600 },
      uTint: { value: opts.tint },
    },
    transparent: true,
    depthWrite: false,
  });
  return new Mesh(gl, { mode: gl.POINTS, geometry, program, frustumCulled: false });
}
