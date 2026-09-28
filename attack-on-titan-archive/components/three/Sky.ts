import { Mesh, Program, Sphere, type OGLRenderingContext } from "ogl";
import { ATMOS, NOISE } from "./glsl";

// Sky dome that follows the camera. Harsh low sun, haze at the horizon,
// torn high cloud. Colour comes from the shared atmosphere uniforms.

const vertex = /* glsl */ `
attribute vec3 position;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const fragment = /* glsl */ `
precision highp float;
${ATMOS}
${NOISE}
uniform vec3 uZenith;
uniform float uCloud;
uniform float uTime;
varying vec3 vDir;
void main() {
  vec3 d = normalize(vDir);
  float up = clamp(d.y, -1.0, 1.0);
  vec3 sky = mix(uFogColor, uZenith, smoothstep(0.0, 0.55, up));
  float sd = max(dot(d, normalize(uSun)), 0.0);
  sky += uSunColor * (pow(sd, 6.0) * 0.35 + pow(sd, 64.0) * 0.8);
  sky += uSunColor * smoothstep(0.99988, 0.99994, sd) * 1.6;   // the disc itself
  if (up > 0.0) {
    vec2 cp = d.xz / (up + 0.12) * 1.4 + vec2(uTime * 0.004, 0.0);
    float c = smoothstep(0.52, 0.85, fbm2(cp)) * uCloud;
    vec3 ccol = mix(uFogColor * 1.08, uSunColor * 1.1, pow(sd, 3.0));
    sky = mix(sky, ccol, c * smoothstep(0.0, 0.18, up) * 0.75);
  }
  // far hills and forest on the horizon, lost in haze
  float az = atan(d.z, d.x);
  float ridge = 0.012 + 0.02 * fbm2(vec2(az * 3.0, 1.3)) + 0.01 * fbm2(vec2(az * 11.0, 4.1));
  sky = mix(sky, mix(uFogColor * 0.78, uFogColor * 0.9, smoothstep(-0.01, ridge, up)), (1.0 - smoothstep(ridge - 0.003, ridge, up)) * 0.85);
  sky = mix(sky, uFogColor * 0.92, smoothstep(0.0, -0.08, up));  // below the horizon: haze
  gl_FragColor = vec4(grade(sky), 1.0);
}
`;

export function createSky(gl: OGLRenderingContext, atmos: Record<string, { value: unknown }>) {
  const geometry = new Sphere(gl, { radius: 1400, widthSegments: 48, heightSegments: 24 });
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: { ...atmos, uZenith: { value: [0.36, 0.42, 0.48] }, uCloud: { value: 1 }, uTime: { value: 0 } },
    cullFace: gl.FRONT,
    depthWrite: false,
  });
  return new Mesh(gl, { geometry, program });
}
