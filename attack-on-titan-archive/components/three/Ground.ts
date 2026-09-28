import { Mesh, Plane, Program, type OGLRenderingContext } from "ogl";
import { ATMOS, NOISE, SHADOWS } from "./glsl";
import { HEIGHT, RIVER } from "./terrain";

// The land: packed earth and streets inside the Wall, a patchwork of
// fields outside it, open grassland beyond. One quad, all shading
// procedural in world space. Shadows of the Wall and the Titan are analytic.

const vertex = /* glsl */ `
attribute vec3 position;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
varying vec3 vWorld;
varying vec3 vNormal;
${HEIGHT}
void main() {
  // the plane is built in xz; displace by the shared terrain height
  vec2 p = position.xz;
  float h = terrainH(p);
  float e = 1.5;
  vNormal = normalize(vec3(terrainH(p - vec2(e, 0.0)) - terrainH(p + vec2(e, 0.0)), 2.0 * e, terrainH(p - vec2(0.0, e)) - terrainH(p + vec2(0.0, e))));
  vWorld = vec3(p.x, h, p.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
`;

const fragment = /* glsl */ `
precision highp float;
${ATMOS}
${NOISE}
${SHADOWS}
uniform vec3 cameraPosition;
uniform vec2 uGate;       // gate position on the ground (xz)
uniform float uBreach;    // 0..1: rubble spill after the gate falls
varying vec3 vWorld;
varying vec3 vNormal;
${RIVER}

vec3 fields(vec2 p) {
  // rotate the patchwork per region so it doesn't read as a grid
  float region = floor(noise2(p * 0.012) * 4.0);
  float a = region * 0.7 + 0.3;
  mat2 R = mat2(cos(a), -sin(a), sin(a), cos(a));
  vec2 q = R * p;
  vec2 cell = floor(q / vec2(11.0, 7.0));
  vec2 f = fract(q / vec2(11.0, 7.0));
  float h = hash2(cell + region * 17.0);
  vec3 col;
  if (h < 0.28) col = vec3(0.35, 0.40, 0.21);        // pasture
  else if (h < 0.5) col = vec3(0.60, 0.52, 0.29);    // ripe grain
  else if (h < 0.7) col = vec3(0.41, 0.32, 0.23);    // ploughed
  else if (h < 0.86) col = vec3(0.47, 0.47, 0.26);   // young crop
  else col = vec3(0.69, 0.62, 0.40);                 // stubble
  float furrow = sin((f.x * 11.0 + h * 3.0) * 6.2831 * 1.6) * 0.5 + 0.5;
  col *= 0.9 + 0.12 * furrow * step(0.5, h) * step(h, 0.86);
  float hedge = 1.0 - smoothstep(0.0, 0.035, min(min(f.x, 1.0 - f.x) * 1.6, min(f.y, 1.0 - f.y)));
  col = mix(col, vec3(0.16, 0.19, 0.11), hedge * 0.8);
  col *= 0.88 + 0.24 * noise2(p * 0.9);
  return col;
}

void main() {
  vec2 p = vWorld.xz;
  float r = length(p);
  vec3 col;

  if (r < uWallR) {
    // inside: packed earth, radial streets and two ring roads
    col = vec3(0.40, 0.36, 0.30) * (0.85 + 0.25 * noise2(p * 1.7));
    float ang = atan(p.y, p.x);
    float spoke = abs(fract(ang / 6.2831 * 12.0 + 0.5) - 0.5) * 6.2831 / 12.0 * r;
    float street = 1.0 - smoothstep(0.35, 0.7, spoke);
    street = max(street, 1.0 - smoothstep(0.5, 0.9, abs(r - 19.0)));
    street = max(street, 1.0 - smoothstep(0.5, 0.9, abs(r - 38.0)));
    street = max(street, 1.0 - smoothstep(4.5, 5.5, r));
    col = mix(col, vec3(0.55, 0.51, 0.44), street * 0.8);
  } else if (r < 330.0) {
    col = fields(p);
    col = mix(col, vec3(0.42, 0.45, 0.28) * (0.85 + 0.3 * fbm2(p * 0.05)), smoothstep(230.0, 330.0, r));
    // the road out of the gate
    float road = 1.0 - smoothstep(0.6, 1.1, abs(p.x - uGate.x + sin(p.y * 0.03) * 3.0 * smoothstep(-62.0, -120.0, p.y)));
    road *= step(p.y, uGate.y);
    col = mix(col, vec3(0.56, 0.5, 0.4), road * 0.85);
  } else {
    col = vec3(0.42, 0.45, 0.28) * (0.85 + 0.3 * fbm2(p * 0.03));
  }

  // grime where the ground meets the Wall
  col *= mix(0.62, 1.0, smoothstep(0.4, 2.5, abs(r - uWallR)));
  // rubble spilled from the breached gate
  float rub = uBreach * (1.0 - smoothstep(0.0, 7.0, length(p - uGate - vec2(0.0, 1.5))));
  col = mix(col, vec3(0.55, 0.52, 0.46) * (0.7 + 0.5 * noise2(p * 6.0)), rub * 0.9);

  // slopes read as grass, whatever the field pattern says
  vec3 N = normalize(vNormal);
  col = mix(col, vec3(0.3, 0.36, 0.2) * (0.8 + 0.3 * noise2(p * 0.3)), smoothstep(0.93, 0.8, N.y) * 0.7);

  vec3 P = vWorld;
  float shade = min(wallShadow(P), titanShadow(P)) * cloudShadow(p);
  float diff = max(dot(N, normalize(uSun)), 0.0);
  vec3 light = uSunColor * diff * 1.9 * shade + uSkyColor * (0.45 + 0.15 * N.y);
  col *= light;

  // the river: sky in the water, the sun's glint on it
  float rd = abs(p.x - riverX(p.y));
  float water = (1.0 - smoothstep(6.5, 8.0, rd)) * step(uWallR + 8.0, r);
  if (water > 0.0) {
    vec3 V = normalize(cameraPosition - vWorld);
    vec3 R = reflect(-V, vec3(0.0, 1.0, 0.0));
    float glint = pow(max(dot(R, normalize(uSun)), 0.0), 180.0) * 6.0;
    float ripple = 0.85 + 0.15 * noise2(p * vec2(0.8, 3.0) + uTime * 0.4);
    vec3 wcol = mix(uFogColor * 0.55, uSkyColor * 1.1, pow(1.0 - max(V.y, 0.0), 3.0)) * ripple + uSunColor * glint * shade;
    col = mix(col, wcol, water);
    col = mix(col, vec3(0.28, 0.26, 0.2) * light, (1.0 - smoothstep(7.8, 9.5, rd)) * (1.0 - water) * step(uWallR + 8.0, r));
  }

  float dist = length(cameraPosition - vWorld);
  gl_FragColor = vec4(grade(applyFog(col, dist, vWorld.y)), 1.0);
}
`;

export function createGround(gl: OGLRenderingContext, shared: Record<string, { value: unknown }>, gate: [number, number]) {
  // built directly in xz (no rotation), dense enough near the centre for the hills
  const geometry = new Plane(gl, { width: 2600, height: 2600, widthSegments: 320, heightSegments: 320 });
  const pos = geometry.attributes.position.data as Float32Array;
  for (let i = 0; i < pos.length; i += 3) {
    const x = pos[i], y = pos[i + 1];
    pos[i] = x;
    pos[i + 1] = 0;
    pos[i + 2] = -y;
  }
  // ogl uploaded the buffer at construction: flag the rewrite for re-upload
  geometry.attributes.position.needsUpdate = true;
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: { ...shared, uGate: { value: gate }, uBreach: { value: 0 } },
    cullFace: false,
  });
  return new Mesh(gl, { geometry, program, frustumCulled: false });
}
