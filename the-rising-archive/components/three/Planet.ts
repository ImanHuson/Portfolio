import { Mesh, Program, Sphere, type OGLRenderingContext } from "ogl";
import { NOISE } from "./glsl";

// Procedural Mars: fbm terrain in object space (no seams, no textures to
// download), a rust colour ramp, polar ice, a hard terminator and a thin
// dust atmosphere on the lit limb.

const vertex = /* glsl */ `
attribute vec3 position;
attribute vec3 normal;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec3 vObjNormal;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;
void main() {
  vObjNormal = normal;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragment = /* glsl */ `
precision highp float;
uniform vec3 cameraPosition;
uniform vec3 uLight;
uniform float uFade;
uniform vec3 uBg;
varying vec3 vObjNormal;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;
${NOISE}
void main() {
  vec3 n = normalize(vObjNormal);
  float h = fbm3(n * 3.2);
  float detail = fbm3(n * 14.0);
  float crater = smoothstep(0.62, 0.7, noise3(n * 9.0)) * 0.35;

  vec3 deep  = vec3(0.16, 0.05, 0.03);
  vec3 rust  = vec3(0.52, 0.17, 0.08);
  vec3 ochre = vec3(0.71, 0.36, 0.20);
  vec3 dust  = vec3(0.80, 0.55, 0.38);
  vec3 col = mix(deep, rust, smoothstep(0.30, 0.52, h));
  col = mix(col, ochre, smoothstep(0.50, 0.70, h + detail * 0.15));
  col = mix(col, dust, smoothstep(0.66, 0.85, detail) * 0.35);
  col *= 1.0 - crater;

  float ice = smoothstep(0.86, 0.93, abs(n.y) + (detail - 0.5) * 0.12);
  col = mix(col, vec3(0.86, 0.84, 0.8), ice);

  vec3 N = normalize(vWorldNormal);
  vec3 L = normalize(uLight);
  vec3 V = normalize(cameraPosition - vWorldPos);
  float diff = max(dot(N, L), 0.0);
  float terminator = smoothstep(-0.08, 0.25, dot(N, L));
  vec3 lit = col * (0.04 + 1.15 * diff) * terminator;

  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  vec3 atmo = vec3(0.85, 0.42, 0.22) * fres * (0.25 + 0.9 * terminator);

  gl_FragColor = vec4(mix(uBg, lit + atmo, uFade), 1.0);
}
`;

export function createPlanet(gl: OGLRenderingContext, segments: number) {
  const geometry = new Sphere(gl, { radius: 1, widthSegments: segments, heightSegments: Math.round(segments / 2) });
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uLight: { value: [-1.2, 0.6, 1.0] },
      uFade: { value: 0 },
      uBg: { value: [0.027, 0.027, 0.039] },
    },
  });
  return new Mesh(gl, { geometry, program });
}
