import { Mesh, Program, Triangle, type OGLRenderingContext } from "ogl";
import { NOISE } from "./glsl";

// The mine shaft: a full-screen tunnel. Depth is 1/r, rock is 3D fbm sampled
// on (cos a, sin a, depth) so the wall has no seam. Lamps are bands of warm
// light at regular depths, as in the Lykos shafts. Blended over the planet
// as the camera goes "down, down, down".

const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `
precision highp float;
uniform float uTravel;
uniform float uMix;
uniform float uLamp;
uniform vec2 uRes;
varying vec2 vUv;
${NOISE}
void main() {
  vec2 p = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 2.0;
  float r = length(p);
  float a = atan(p.y, p.x);
  float depth = 0.55 / max(r, 0.02) + uTravel;
  // rock: strata streaked along the shaft (depth stretched), plus chisel grain
  vec3 q = vec3(cos(a) * 2.2, sin(a) * 2.2, depth * 0.55);
  float rock = fbm3(q * 2.4);
  float strata = fbm3(vec3(cos(a) * 6.0, sin(a) * 6.0, depth * 0.12));
  float grain = noise3(vec3(cos(a) * 30.0, sin(a) * 30.0, depth * 3.0));
  vec3 wall = mix(vec3(0.05, 0.018, 0.014), vec3(0.42, 0.15, 0.07), rock * 0.75 + strata * 0.45);
  wall *= 0.6 + 0.55 * grain;

  // work lamps: discrete lights bolted to the wall at fixed angles, every few
  // meters of depth, not full rings. Each casts a pool on the rock around it.
  float seg = floor(depth * 0.5);
  float along = fract(depth * 0.5);
  float lampAngle = hash3(vec3(seg, 3.1, 7.7)) * 6.2831853;
  float ang = abs(atan(sin(a - lampAngle), cos(a - lampAngle)));
  float core = smoothstep(0.1, 0.0, abs(along - 0.5)) * smoothstep(0.22, 0.0, ang);
  float pool = smoothstep(0.45, 0.0, abs(along - 0.5)) * smoothstep(1.4, 0.0, ang);
  wall *= 0.6 + 1.2 * pool * uLamp;
  wall += vec3(1.0, 0.62, 0.28) * core * 1.6 * uLamp;

  // the far end falls into black; near walls are brighter
  float fog = smoothstep(0.03, 0.9, r);
  vec3 col = wall * fog;
  col *= smoothstep(1.7, 0.35, r);

  gl_FragColor = vec4(col * uMix, uMix);
}
`;

export function createShaft(gl: OGLRenderingContext) {
  const geometry = new Triangle(gl);
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTravel: { value: 0 },
      uMix: { value: 0 },
      uLamp: { value: 1 },
      uRes: { value: [1, 1] },
    },
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  // premultiplied: color already scaled by uMix
  program.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  return new Mesh(gl, { geometry, program });
}
