import { Box, Mesh, Program, type OGLRenderingContext } from "ogl";
import { ATMOS, NOISE, SHADOWS } from "./glsl";

// Shiganshina's roofs: a few thousand gabled houses in ONE instanced draw
// call. The gable is made in the vertex shader by pinching a two-storey
// box's top row to the ridge line.

const vertex = /* glsl */ `
attribute vec3 position;
attribute vec3 normal;
attribute vec4 aPlace;   // x, z, rotation, seed
attribute vec3 aSize;    // width, height, depth
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vRoof;
varying float vSeed;
void main() {
  vec3 p = position;
  vRoof = position.y;
  vec3 n = normal;
  float roof = step(0.01, p.y);           // upper half = roof
  if (p.y > 0.49) p.x = 0.0;              // ridge
  // roof slope normals for the side faces' upper half
  if (roof > 0.5 && abs(n.x) > 0.5) n = normalize(vec3(sign(n.x) * aSize.y * 0.5, aSize.x * 0.5, 0.0));
  vec3 s = p * aSize;
  s.y += aSize.y * 0.5;                   // sit on the ground
  float c = cos(aPlace.z), si = sin(aPlace.z);
  vec3 w = vec3(c * s.x + si * s.z, s.y, -si * s.x + c * s.z) + vec3(aPlace.x, 0.0, aPlace.y);
  vNormal = vec3(c * n.x + si * n.z, n.y, -si * n.x + c * n.z);
  vWorld = w;
  vSeed = aPlace.w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}
`;

const fragment = /* glsl */ `
precision highp float;
${ATMOS}
${NOISE}
${SHADOWS}
uniform vec3 cameraPosition;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vRoof;
varying float vSeed;
void main() {
  vec3 N = normalize(vNormal);
  vec3 wallCol = mix(vec3(0.76, 0.70, 0.58), vec3(0.6, 0.53, 0.43), fract(vSeed * 7.13));
  vec3 roofCol = vSeed < 0.55 ? vec3(0.47, 0.25, 0.17) : (vSeed < 0.8 ? vec3(0.55, 0.36, 0.22) : vec3(0.31, 0.31, 0.33));
  roofCol *= 0.85 + 0.25 * noise2(vWorld.xz * 11.0 + vSeed * 40.0);
  vec3 col = mix(wallCol, roofCol, step(0.0, vRoof));
  col *= mix(0.6, 1.0, smoothstep(0.0, 0.35, vWorld.y));   // contact darkening
  float shade = min(wallShadow(vWorld), titanShadow(vWorld));
  float diff = max(dot(N, normalize(uSun)), 0.0);
  col *= uSunColor * diff * 1.9 * shade + uSkyColor * (0.45 + 0.35 * N.y);
  float dist = length(cameraPosition - vWorld);
  gl_FragColor = vec4(grade(applyFog(col, dist, vWorld.y)), 1.0);
}
`;

function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createTown(gl: OGLRenderingContext, shared: Record<string, { value: unknown }>, density: number) {
  const rand = mulberry(845);
  const place: number[] = [];
  const size: number[] = [];
  const step = 1.7 / Math.sqrt(density);
  for (let x = -57; x <= 57; x += step)
    for (let z = -57; z <= 57; z += step) {
      const jx = x + (rand() - 0.5) * step * 0.5;
      const jz = z + (rand() - 0.5) * step * 0.5;
      const r = Math.hypot(jx, jz);
      if (r > 56.5 || r < 6.5) continue;
      if (Math.abs(r - 19) < 1.3 || Math.abs(r - 38) < 1.3) continue; // ring roads
      const a = Math.atan2(jz, jx);
      const spoke = Math.abs(((a / (Math.PI * 2)) * 12 + 0.5) % 1 - 0.5) * (Math.PI * 2 / 12) * r;
      if (spoke < 1.1) continue; // radial streets
      if (rand() < 0.12) continue; // yards, gardens
      const w = 0.8 + rand() * 0.6;
      const d = 0.7 + rand() * 0.5;
      const h = 0.55 + rand() * 0.55 + (r < 14 ? 0.35 : 0);
      place.push(jx, jz, -a + (rand() - 0.5) * 0.25, rand());
      size.push(w, h, d);
    }
  const geometry = new Box(gl, { width: 1, height: 1, depth: 1, heightSegments: 2 });
  geometry.addAttribute("aPlace", { instanced: 1, size: 4, data: new Float32Array(place) });
  geometry.addAttribute("aSize", { instanced: 1, size: 3, data: new Float32Array(size) });
  const program = new Program(gl, { vertex, fragment, uniforms: { ...shared }, cullFace: false });
  return new Mesh(gl, { geometry, program, frustumCulled: false });
}
