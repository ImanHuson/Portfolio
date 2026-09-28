import { Geometry, Mesh, Program, type OGLRenderingContext } from "ogl";

// A loose flock circling over the district: "distant birds" from the brief,
// seen as well as heard. Each bird is one point sprite drawn as a flapping V.

const vertex = /* glsl */ `
attribute vec4 seed;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uPx;
uniform float uScatter;   // 0 calm circling, 1 fleeing the Titan
varying float vFlap;
varying float vAlpha;
void main() {
  float t = uTime * (0.05 + 0.03 * seed.x) + seed.y * 6.2831;
  float rad = 14.0 + seed.z * 22.0;
  vec3 p = vec3(cos(t) * rad, 14.0 + seed.w * 9.0 + sin(t * 3.0 + seed.x * 9.0) * 0.8, sin(t) * rad * 0.7 - 18.0);
  // scatter: the flock breaks and flies away north, away from the Wall
  p += uScatter * vec3((seed.x - 0.5) * 40.0, 8.0 * seed.y, 60.0 + seed.z * 50.0);
  vec4 mv = viewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uPx / max(-mv.z, 1.0);
  vFlap = sin(uTime * (7.0 + seed.x * 4.0) + seed.y * 40.0);
  vAlpha = 1.0 - uScatter * 0.6;
}
`;

const fragment = /* glsl */ `
precision highp float;
varying float vFlap;
varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  c.y = -c.y;
  // two wings from the centre, their angle driven by the flap
  float lift = 0.15 + 0.35 * vFlap;
  float wing = abs(c.y - abs(c.x) * lift) - 0.07 * (1.0 - abs(c.x));
  float body = 1.0 - smoothstep(0.0, 0.06, wing);
  body *= step(abs(c.x), 0.95);
  if (body * vAlpha < 0.05) discard;
  gl_FragColor = vec4(vec3(0.09, 0.09, 0.08), body * vAlpha * 0.85);
}
`;

export function createBirds(gl: OGLRenderingContext, count: number) {
  const seed = new Float32Array(count * 4);
  for (let i = 0; i < seed.length; i++) seed[i] = Math.random();
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: { uTime: { value: 0 }, uPx: { value: 400 }, uScatter: { value: 0 } },
    transparent: true,
    depthWrite: false,
  });
  return new Mesh(gl, { mode: gl.POINTS, geometry: new Geometry(gl, { seed: { size: 4, data: seed } }), program, frustumCulled: false });
}
