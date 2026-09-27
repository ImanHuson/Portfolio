import { Geometry, Mesh, Program, type OGLRenderingContext } from "ogl";

const vertex = /* glsl */ `
attribute vec3 position;
attribute float aSize;
attribute float aSeed;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uDpr;
varying float vTwinkle;
void main() {
  vTwinkle = 0.65 + 0.35 * sin(uTime * (0.6 + aSeed) + aSeed * 40.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uDpr;
}
`;

const fragment = /* glsl */ `
precision highp float;
uniform float uFade;
varying float vTwinkle;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vec3(0.92, 0.9, 0.86) * a * vTwinkle * uFade, 1.0);
}
`;

export function createStars(gl: OGLRenderingContext, count: number, dpr: number) {
  const position = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const u = Math.random() * 2 - 1;
    const t = Math.random() * Math.PI * 2;
    const r = 40;
    const s = Math.sqrt(1 - u * u);
    position.set([r * s * Math.cos(t), r * u, r * s * Math.sin(t)], i * 3);
    size[i] = Math.random() < 0.06 ? 2.4 : 0.8 + Math.random() * 1.1;
    seed[i] = Math.random();
  }
  const geometry = new Geometry(gl, {
    position: { size: 3, data: position },
    aSize: { size: 1, data: size },
    aSeed: { size: 1, data: seed },
  });
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: { uTime: { value: 0 }, uFade: { value: 0 }, uDpr: { value: dpr } },
    transparent: true,
    depthWrite: false,
  });
  program.setBlendFunc(gl.ONE, gl.ONE);
  return new Mesh(gl, { mode: gl.POINTS, geometry, program });
}
