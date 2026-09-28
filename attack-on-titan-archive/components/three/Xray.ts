import { Mesh, Program, Triangle, type OGLRenderingContext } from "ogl";
import { NOISE } from "./glsl";

// Backdrop for the pass through the Wall: the stone seen from inside, as
// film negative. Void, faint block courses, scan lines. Alpha-blended over
// the normal render, so at uXray = 1 it covers the world completely.

const vertex = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = /* glsl */ `
precision highp float;
${NOISE}
uniform float uXray;
uniform float uTravel;
uniform vec2 uRes;
varying vec2 vUv;
void main() {
  vec2 p = vUv * uRes / uRes.y;
  p.y += uTravel;
  float rowH = 0.085;
  float row = floor(p.y / rowH);
  float off = hash2(vec2(row, 3.0)) * 0.3;
  float bw = 0.19 + 0.06 * hash2(vec2(row, 7.0));
  vec2 f = vec2(fract((p.x + off) / bw), fract(p.y / rowH));
  float line = 1.0 - smoothstep(0.0, 0.035, min(min(f.x, 1.0 - f.x) * bw / rowH, min(f.y, 1.0 - f.y)));
  vec3 col = vec3(0.012, 0.012, 0.011);
  col += vec3(0.5, 0.49, 0.44) * line * 0.09 * (0.6 + 0.8 * noise2(p * 14.0));
  col += vec3(0.02) * noise2(vUv * uRes * 0.5);
  float vig = smoothstep(1.25, 0.35, length(vUv - 0.5) * 1.6);
  col *= vig;
  gl_FragColor = vec4(col, uXray);
}
`;

export function createXrayBackdrop(gl: OGLRenderingContext) {
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: { uXray: { value: 0 }, uTravel: { value: 0 }, uRes: { value: [1, 1] } },
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  return new Mesh(gl, { geometry: new Triangle(gl), program });
}
