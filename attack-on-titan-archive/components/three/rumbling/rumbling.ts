// The Rumbling: a quiet sea at dusk, and a line of Colossal Titans wading
// out of the haze. Units: 1 = 10 m (a Titan is 6 units, 60 m).
//  - sea + sky: one full-screen pass (a plane intersection per pixel)
//  - Titans: one instanced draw of camera-facing quads, each shading an
//    analytic 2D silhouette (backlit: dark body, warm rim, heat haze), so
//    thousands cost one draw call. Legs below the waterline are cut.

export const seaVertex = /* glsl */ `
attribute vec2 position;
varying vec2 vUv;
void main(){ vUv = position * 0.5 + 0.5; gl_Position = vec4(position, 0.0, 1.0); }`;

export const SKY_GLSL = /* glsl */ `
uniform float uDark;
const vec3 SUN = normalize(vec3(0.0, 0.035, -1.0));
vec3 tonemap(vec3 x){ x *= 1.1; x = clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); return pow(x, vec3(0.4545)); }
vec3 skyCol(vec3 rd){
  float h = max(rd.y, 0.0);
  vec3 zen = mix(vec3(0.006, 0.007, 0.01), vec3(0.002, 0.002, 0.003), uDark);
  vec3 hor = mix(vec3(0.1, 0.05, 0.028), vec3(0.025, 0.016, 0.012), uDark);
  vec3 c = mix(hor, zen, pow(h, 0.45));
  float s = max(dot(rd, SUN), 0.0);
  c += vec3(1.0, 0.45, 0.2) * (pow(s, 1800.0) * 1.2 + pow(s, 200.0) * 0.08 + pow(s, 20.0) * 0.02) * (1.0 - 0.75 * uDark);
  return c;
}`;

export const seaFragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform vec3 uCamPos;
uniform vec3 uCamLook;
uniform float uFov;
uniform float uTime;
${SKY_GLSL}
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
float waves(vec2 p){
  float t = uTime * 0.25;
  return noise(p * 0.35 + vec2(t, t * 0.6)) * 0.6 + noise(p * 1.3 - vec2(t * 0.8, -t)) * 0.3 + noise(p * 4.0 + t) * 0.1;
}
void main(){
  vec2 uv = (vUv * uRes - 0.5 * uRes) / uRes.y;
  vec3 ro = uCamPos;
  vec3 fw = normalize(uCamLook - ro);
  vec3 rt = normalize(cross(fw, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(rt, fw);
  vec3 rd = normalize(fw * (1.0 / tan(uFov * 0.5)) + uv.x * rt + uv.y * up);
  vec3 col;
  if (rd.y < 0.0){
    float t = -ro.y / rd.y;
    vec3 p = ro + rd * t;
    float e = 0.08;
    float h0 = waves(p.xz);
    vec3 n = normalize(vec3(h0 - waves(p.xz + vec2(e, 0.0)), e * 3.0, h0 - waves(p.xz + vec2(0.0, e))));
    vec3 r = reflect(rd, n);
    r.y = abs(r.y);
    float fres = 0.02 + 0.98 * pow(1.0 - max(dot(-rd, n), 0.0), 5.0);
    vec3 deep = mix(vec3(0.02, 0.03, 0.035), vec3(0.01, 0.012, 0.014), uDark);
    col = mix(deep, skyCol(r), fres);
    float fog = 1.0 - exp(-t * 0.004);
    col = mix(col, skyCol(vec3(rd.x, 0.0, rd.z)), fog);
  } else {
    col = skyCol(rd);
  }
  col = tonemap(col);
  vec2 v = vUv - 0.5;
  col *= 1.0 - dot(v, v) * 0.8;
  col += (hash(vUv * uRes + fract(uTime) * 91.0) - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.0);
}`;

export const titanVertex = /* glsl */ `
attribute vec2 position;   // quad: x -0.5..0.5, y 0..1
attribute vec3 offset;     // feet on the sea bed
attribute vec3 params;     // height, walk phase, order of appearance
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 uCamPos;
uniform float uTime;
varying vec2 vQ;
varying float vY;
varying float vDist;
varying float vOrder;
varying float vPhase;
void main(){
  float H = params.x;
  // walk slowly toward the island
  vec3 base = offset + vec3(0.0, 0.0, uTime * 0.05);
  vec3 toCam = uCamPos - base; toCam.y = 0.0;
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), normalize(toCam)));
  float W = H * 0.62;
  vec3 world = base + right * position.x * W + vec3(0.0, position.y * H, 0.0);
  vQ = vec2(position.x * 0.62, position.y);
  vY = world.y;
  vDist = length(uCamPos - base);
  vOrder = params.z;
  vPhase = params.y;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}`;

export const titanFragment = /* glsl */ `
precision highp float;
varying vec2 vQ;
varying float vY;
varying float vDist;
varying float vOrder;
varying float vPhase;
uniform float uCount;
uniform float uTime;
${SKY_GLSL}
float cap(vec2 p, vec2 a, vec2 b, float r){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h) - r; }
float smin(float a, float b, float k){ float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }
float body2(vec2 q, float w){
  // a flayed giant, arms hanging, head a little forward
  float d = cap(q, vec2(0.0, 0.5), vec2(0.0, 0.76), 0.085);                         // torso
  d = smin(d, cap(q, vec2(-0.13, 0.78), vec2(0.13, 0.78), 0.05), 0.04);            // shoulders
  d = smin(d, length(q - vec2(0.012, 0.885)) - 0.058, 0.02);                        // head
  d = smin(d, cap(q, vec2(-0.03, 0.845), vec2(0.03, 0.845), 0.03), 0.015);        // neck
  d = min(d, cap(q, vec2(-0.06, 0.48), vec2(-0.07 + w, 0.02), 0.045));              // legs
  d = min(d, cap(q, vec2(0.06, 0.48), vec2(0.07 - w, 0.02), 0.045));
  d = smin(d, cap(q, vec2(-0.16, 0.77), vec2(-0.2 - w * 0.5, 0.42), 0.034), 0.02); // arms
  d = smin(d, cap(q, vec2(0.16, 0.77), vec2(0.2 + w * 0.5, 0.42), 0.034), 0.02);
  return d;
}
float hsh(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hsh(i), hsh(i + vec2(1, 0)), f.x), mix(hsh(i + vec2(0, 1)), hsh(i + vec2(1, 1)), f.x), f.y); }
void main(){
  if (vY < 0.0) discard; // below the waterline
  float vis = clamp(uCount - vOrder, 0.0, 1.0);
  if (vis <= 0.0) discard;
  vec2 q = vQ;
  float w = sin(uTime * 0.6 + vPhase * 6.283) * 0.035; // a slow stride
  float d = body2(q, w);
  // volume from the silhouette: the distance field's gradient is the surface
  // tilt and its depth inside gives a rounded bulge, so the body reads as a
  // form lit from behind, not a paper cut-out
  float e = 0.004;
  vec2 g = vec2(body2(q + vec2(e, 0.0), w) - body2(q - vec2(e, 0.0), w), body2(q + vec2(0.0, e), w) - body2(q - vec2(0.0, e), w)) / (2.0 * e);
  float inside = clamp(-d / 0.06, 0.0, 1.0);
  vec3 nrm = normalize(vec3(g * (1.0 - inside * 0.85), 0.35 + inside));
  float px = 0.004 + vDist * 0.00002;
  float body = smoothstep(px, -px, d);
  float haze = exp(-max(d, 0.0) * 26.0) * 0.14 * smoothstep(0.45, 0.95, q.y);     // heat rising off them
  // seen from above they stand against the water, so fade toward a sea-and-horizon tone, not the bright sky
  vec3 fogC = skyCol(normalize(vec3(0.0, 0.004, -1.0))) * 0.45;
  float fog = 1.0 - exp(-vDist * 0.0016);
  vec3 dark = vec3(0.002, 0.0018, 0.0018);
  // back light where the surface turns away from the viewer, a faint cool
  // fill from the sky above, and exposed muscle as vertical fibre; the detail
  // fades out with distance, where only the rimmed silhouette can be seen
  float back = pow(1.0 - nrm.z, 2.6); // tight: light only at the turning edges, the body stays dark
  float top = max(nrm.y, 0.0) * 0.35;
  float fibre = vnoise(vec2(q.x * 90.0, q.y * 9.0)) * 0.6 + vnoise(q * 30.0) * 0.4;
  vec3 lightC = vec3(0.34, 0.15, 0.06) * (1.0 - 0.6 * uDark);
  vec3 near = dark * (0.7 + 0.6 * fibre) + lightC * back * (0.5 + 0.5 * fibre) + vec3(0.02, 0.022, 0.03) * top;
  vec3 far = dark + lightC * smoothstep(-0.018, 0.0, d) * 0.6;
  vec3 c = mix(far, near, 1.0 - smoothstep(60.0, 180.0, vDist));
  c = mix(c, fogC, fog);
  vec3 hazeC = fogC;
  float a = max(body, haze * (1.0 - fog * 0.7));
  vec3 col = mix(hazeC, c, body / max(a, 1e-3));
  gl_FragColor = vec4(tonemap(col), a * vis);
}`;

/** Where they stand: one, then another, then dozens, then the line. Draw order is far to near. */
export function layout(total: number) {
  const items: { x: number; z: number; h: number; phase: number; order: number }[] = [];
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  items.push({ x: 6, z: -75, h: 6, phase: 0.1, order: 0 });
  items.push({ x: -24, z: -96, h: 6, phase: 0.6, order: 1 });
  for (let i = 0; i < 40; i++) items.push({ x: (rnd() - 0.5) * 180, z: -115 - rnd() * 60, h: 6, phase: rnd(), order: 2 + i * 0.35 });
  const rest = total - items.length;
  for (let i = 0; i < rest; i++) {
    const z = -170 - rnd() * 620;
    items.push({ x: (rnd() - 0.5) * (-z * 2.6), z, h: 6, phase: rnd(), order: 16 + (i / rest) * 90 });
  }
  items.sort((a, b) => a.z - b.z);
  return items;
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => x * x * (3 - 2 * x);

/** Camera and scene state along the scroll. */
export function rumblingAt(p: number) {
  const up = ease(clamp01((p - 0.5) / 0.3));
  const pos: [number, number, number] = [0, 1.1 + up * 34, 6 + up * 55];
  const look: [number, number, number] = [0, 1.6 - up * 6, -120 - up * 180];
  // the count of Titans: 0, then 1, then 2, then dozens, then all of them
  const count =
    p < 0.16 ? 0 :
    p < 0.26 ? ease(clamp01((p - 0.16) / 0.06)) :
    p < 0.34 ? 1 + ease(clamp01((p - 0.26) / 0.05)) :
    p < 0.46 ? 2 + ease(clamp01((p - 0.34) / 0.12)) * 14 :
    16 + ease(clamp01((p - 0.46) / 0.3)) * 92;
  const dark = clamp01((p - 0.04) / 0.5) * 0.6 + clamp01((p - 0.84) / 0.14) * 0.4;
  return { pos, look, count, dark };
}
