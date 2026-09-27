import { Geometry, Mesh, Program, type OGLRenderingContext } from "ogl";

// Dust that streams past the camera during the descent. Rendered in its own
// camera space (a fixed camera at the origin), so it always surrounds the
// viewer regardless of where the main camera has travelled.

const vertex = /* glsl */ `
attribute vec3 position;
attribute float aSeed;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTravel;
uniform float uTime;
uniform float uDpr;
varying float vAlpha;
void main() {
  vec3 p = position;
  float range = 12.0;
  p.z = mod(p.z + uTravel * (0.8 + aSeed * 0.6) + uTime * 0.15, range) - range;
  p.x += sin(uTime * 0.3 + aSeed * 20.0) * 0.08;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = -mv.z;
  gl_PointSize = clamp(9.0 / depth, 0.5, 7.0) * uDpr;
  vAlpha = smoothstep(12.0, 6.0, depth) * smoothstep(0.2, 1.2, depth);
}
`;

const fragment = /* glsl */ `
precision highp float;
uniform float uIntensity;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d) * vAlpha * uIntensity;
  gl_FragColor = vec4(vec3(0.82, 0.5, 0.32) * a, 1.0);
}
`;

export function createDust(gl: OGLRenderingContext, count: number, dpr: number) {
  const position = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    position.set([(Math.random() - 0.5) * 7, (Math.random() - 0.5) * 4.5, -Math.random() * 12], i * 3);
    seed[i] = Math.random();
  }
  const geometry = new Geometry(gl, {
    position: { size: 3, data: position },
    aSeed: { size: 1, data: seed },
  });
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTravel: { value: 0 },
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uDpr: { value: dpr },
    },
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  program.setBlendFunc(gl.ONE, gl.ONE);
  return new Mesh(gl, { mode: gl.POINTS, geometry, program });
}
