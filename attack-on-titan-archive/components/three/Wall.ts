import { Mesh, Program, type OGLRenderingContext } from "ogl";
import { ATMOS, NOISE, SHADOWS } from "./glsl";
import { ringWall } from "./geometry";

// The Wall. Coursed limestone blocks, a century of weather running down
// its face, grime at the foot, and the district gate. Blocks are drawn in
// the shader from arc-length + height, so the ring needs no UVs.

const vertex = /* glsl */ `
attribute vec3 position;
attribute vec3 normal;
attribute float face;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vFace;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  vNormal = normal;
  vFace = face;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const fragment = /* glsl */ `
precision highp float;
${ATMOS}
${NOISE}
${SHADOWS}
uniform vec3 cameraPosition;
uniform float uGateAngle;
uniform float uBreach;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vFace;

void main() {
  vec3 N = normalize(vNormal);
  float ang = atan(vWorld.z, vWorld.x);
  float u = ang * uWallR;
  float y = vWorld.y;
  vec3 col;

  if (vFace > 1.5) {
    // walkway on top: worn flagstones
    col = vec3(0.66, 0.63, 0.55) * (0.8 + 0.3 * noise2(vWorld.xz * 4.0));
  } else {
    float rowH = 0.21;
    float row = floor(y / rowH);
    float off = hash2(vec2(row, 3.0)) * 0.6;
    float bw = 0.46 + 0.14 * hash2(vec2(row, 7.0));
    float bx = floor((u + off) / bw);
    vec2 f = vec2(fract((u + off) / bw), fract(y / rowH));
    float mortar = 1.0 - smoothstep(0.0, 0.05, min(min(f.x, 1.0 - f.x) * bw / rowH, min(f.y, 1.0 - f.y)));
    float tint = hash2(vec2(bx, row));
    col = mix(vec3(0.74, 0.70, 0.60), vec3(0.62, 0.58, 0.49), tint);   // limestone
    col *= 0.9 + 0.18 * noise2(vec2(u, y) * 3.0);
    col = mix(col, col * 0.55, mortar * 0.7);
    // weather: rain streaks run down from the top, grime climbs from the foot
    float streak = fbm2(vec2(u * 2.2, y * 0.25 + 3.0));
    col *= mix(1.0, 0.72, smoothstep(0.45, 0.8, streak) * smoothstep(0.0, 4.5, 5.0 - y + 1.0) * 0.8);
    col *= mix(0.55, 1.0, smoothstep(0.0, 1.4, y));
    col = mix(col, vec3(0.28, 0.31, 0.2), smoothstep(0.8, 0.0, y) * 0.45 * noise2(vec2(u, y) * 2.0));
    // top coping band
    col *= mix(1.0, 1.12, smoothstep(4.75, 4.85, y));

    // the gate: an arch on both faces
    float du = (ang - uGateAngle) * uWallR;
    float archW = 0.85;
    float arch = step(abs(du), archW) * step(y, 1.6 + sqrt(max(archW * archW - du * du, 0.0)) * 0.5);
    vec3 door = vec3(0.22, 0.16, 0.11) * (0.8 + 0.3 * noise2(vec2(du * 9.0, y * 2.0)));
    door *= 0.85 + 0.15 * step(0.5, fract(du * 3.0));
    col = mix(col, mix(door, vec3(0.02), uBreach), arch);
  }

  vec3 L = normalize(uSun);
  float diff = max(dot(N, L), 0.0);
  float shade = titanShadow(vWorld) * cloudShadow(vWorld.xz);
  vec3 light = uSunColor * diff * 2.0 * shade + uSkyColor * (0.5 + 0.35 * N.y);
  col *= light;

  float dist = length(cameraPosition - vWorld);
  gl_FragColor = vec4(grade(applyFog(col, dist, y)), 1.0);
}
`;

export function createWall(gl: OGLRenderingContext, shared: Record<string, { value: unknown }>, gateAngle: number, segments: number) {
  const geometry = ringWall(gl, 60, 5, 0.9, segments);
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: { ...shared, uGateAngle: { value: gateAngle }, uBreach: { value: 0 } },
    cullFace: false,
  });
  return new Mesh(gl, { geometry, program });
}
