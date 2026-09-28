import { Mesh, Plane, Program, type OGLRenderingContext } from "ogl";
import { NOISE } from "./glsl";

// The transformation strike: a jagged bolt from the sky to the ground beyond
// the Wall, drawn in the fragment shader on a tall camera-facing quad.
// Additive, so it only ever adds light.

const vertex = /* glsl */ `
attribute vec3 position;
attribute vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const fragment = /* glsl */ `
precision highp float;
${NOISE}
uniform float uStrike;
uniform float uSeed;
varying vec2 vUv;
float bolt(vec2 uv, float seed, float width) {
  float y = uv.y;
  float x = 0.5 + (fbm2(vec2(y * 6.0, seed)) - 0.5) * 0.55 + (noise2(vec2(y * 40.0, seed * 3.0)) - 0.5) * 0.05;
  x += (1.0 - y) * 0.0;
  float d = abs(uv.x - x);
  return width / (d + width * 0.6);
}
void main() {
  if (uStrike <= 0.001) discard;
  float core = bolt(vUv, uSeed, 0.004);
  // a branch forking off the upper half
  float branch = bolt(vec2(vUv.x + (vUv.y - 0.55) * 0.35, vUv.y), uSeed + 7.0, 0.0025) * smoothstep(0.35, 0.6, vUv.y);
  float glow = core * 0.35 + branch * 0.25;
  float c = clamp(core * 0.9 + branch * 0.6, 0.0, 6.0);
  vec3 col = vec3(1.0, 0.95, 0.86) * c + vec3(0.9, 0.7, 0.5) * glow * 0.4;
  col *= uStrike * smoothstep(0.0, 0.03, vUv.y);
  gl_FragColor = vec4(col, 1.0);
}
`;

export function createLightning(gl: OGLRenderingContext) {
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: { uStrike: { value: 0 }, uSeed: { value: 3.7 } },
    transparent: true,
    depthWrite: false,
    cullFace: false,
  });
  program.setBlendFunc(gl.ONE, gl.ONE);
  const mesh = new Mesh(gl, { geometry: new Plane(gl, { width: 1, height: 1 }), program });
  mesh.scale.set(14, 60, 1);
  mesh.renderOrder = 20;
  return mesh;
}
