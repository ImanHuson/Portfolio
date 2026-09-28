import { Box, Mat4, Mesh, Program, type OGLRenderingContext } from "ogl";
import { ATMOS, NOISE, SHADOWS } from "./glsl";

// The Colossal-type Titan: a 60 m (6 unit) raymarched signed-distance
// body inside a proxy box. Smooth unions blend the muscle masses the way
// ellipsoids never could. It is a generic flayed giant read through steam
// and backlight (heavy brow, lipless jaw, exposed teeth), not a copy of
// the anime's character design.
//
// Two materials:
//   flesh  striated exposed muscle, revealed bottom-up by a cut plane with
//          a hot edge (the body forming inside its own steam)
//   xray   film-negative volume render of the same body plus its skeleton,
//          for the pass through the Wall

const SDF = /* glsl */ `
float smin(float a, float b, float k) { float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }
float smax(float a, float b, float k) { return -smin(-a, -b, k); }
float sdCap(vec3 p, vec3 a, vec3 b, float r) { vec3 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h) - r; }
float sdEll(vec3 p, vec3 r) { float k0 = length(p / r); float k1 = length(p / (r * r)); return k0 * (k0 - 1.0) / k1; }

float grinArc(vec3 p, float r, float h, float depth, float spread) {
  vec3 c = p - vec3(0.0, 5.34, 0.07);
  float a = atan(c.x, c.z);
  float rr = length(c.xz);
  float d = length(vec2((rr - r) / depth, (c.y) / h)) - 1.0;
  d *= min(depth, h);
  return max(d, (abs(a) - spread) * rr);
}
// the grin: a band of teeth wrapping the front of the jaw, cheek to cheek
float teethSdf(vec3 p) { return grinArc(p, 0.245, 0.06, 0.028, 1.05); }

float headSdf(vec3 p, vec3 q) {
  float h = sdEll(p - vec3(0.0, 5.66, -0.02), vec3(0.29, 0.34, 0.33));          // cranium
  h = smin(h, sdEll(p - vec3(0.0, 5.72, 0.2), vec3(0.28, 0.07, 0.13)), 0.06);   // brow ridge
  h = smin(h, sdEll(p - vec3(0.0, 5.33, 0.06), vec3(0.23, 0.21, 0.25)), 0.08);   // long jaw
  h = smin(h, sdCap(q, vec3(0.2, 5.52, 0.12), vec3(0.17, 5.26, 0.2), 0.04), 0.03); // cheek muscle, no skin
  h = smin(h, sdEll(q - vec3(0.19, 5.48, 0.14), vec3(0.1, 0.12, 0.15)), 0.05);  // cheekbones
  h = smax(h, -sdEll(q - vec3(0.11, 5.58, 0.34), vec3(0.075, 0.05, 0.09)), 0.03); // sockets
  h = smax(h, -grinArc(p, 0.28, 0.075, 0.08, 1.12), 0.015);                      // lipless: the jaw is open to the teeth
  return h;
}

float bodySdf(vec3 p) {
  vec3 q = vec3(abs(p.x), p.y, p.z);
  float d = sdEll(p - vec3(0.0, 3.12, 0.0), vec3(0.5, 0.3, 0.32));                   // pelvis
  d = smin(d, sdCap(p, vec3(0.0, 3.2, 0.0), vec3(0.0, 3.85, 0.02), 0.29), 0.15);     // gaunt gut
  d = smin(d, sdEll(p - vec3(0.0, 4.28, 0.0), vec3(0.6, 0.56, 0.4)), 0.2);           // ribcage
  d = smin(d, sdEll(q - vec3(0.28, 4.45, 0.2), vec3(0.3, 0.2, 0.17)), 0.1);          // pectorals
  d = smin(d, sdEll(q - vec3(0.72, 4.64, 0.0), vec3(0.27, 0.24, 0.27)), 0.12);       // deltoids
  d = smin(d, sdCap(q, vec3(0.55, 4.78, -0.06), vec3(0.0, 5.05, -0.06), 0.16), 0.12); // trapezius
  d = smin(d, sdCap(p, vec3(0.0, 4.85, 0.0), vec3(0.0, 5.3, 0.06), 0.17), 0.1);      // neck
  d = smin(d, sdCap(q, vec3(0.8, 4.55, 0.0), vec3(0.97, 3.6, 0.06), 0.21), 0.08);    // upper arm
  d = smin(d, sdCap(q, vec3(0.97, 3.6, 0.06), vec3(1.02, 2.6, 0.22), 0.165), 0.12);   // forearm
  d = smin(d, sdEll(q - vec3(1.01, 2.36, 0.25), vec3(0.09, 0.21, 0.13)), 0.05);      // hand
  d = smin(d, sdCap(q, vec3(0.3, 3.0, 0.0), vec3(0.33, 1.72, 0.08), 0.24), 0.12);    // thigh
  d = smin(d, sdCap(q, vec3(0.33, 1.72, 0.08), vec3(0.35, 0.22, -0.02), 0.16), 0.12); // shin
  d = smin(d, sdEll(q - vec3(0.36, 0.1, 0.14), vec3(0.16, 0.1, 0.32)), 0.06);        // foot
  // definition: neck cords, collarbones, rib grooves on the flanks
  d = smin(d, sdCap(q, vec3(0.15, 5.38, -0.02), vec3(0.04, 4.82, 0.22), 0.04), 0.08);
  d = smin(d, sdCap(q, vec3(0.06, 4.82, 0.23), vec3(0.6, 4.86, 0.03), 0.032), 0.08);
  float flank = smoothstep(0.3, 0.5, q.x) * (1.0 - smoothstep(0.56, 0.64, q.x)) * smoothstep(3.75, 4.0, p.y) * (1.0 - smoothstep(4.5, 4.65, p.y));
  d += 0.014 * flank * sin(p.y * 31.0);
  d = smin(d, headSdf(p, q), 0.1);
  return d;
}

`;

const SKELETON = /* glsl */ `
float skelSdf(vec3 p) {
  vec3 q = vec3(abs(p.x), p.y, p.z);
  float d = sdCap(p, vec3(0.0, 3.05, -0.2), vec3(0.0, 5.25, -0.1), 0.045 + 0.012 * sin(p.y * 70.0)); // spine
  for (int i = 0; i < 10; i++) {                                                             // ribs
    float fi = float(i);
    float ax = 0.52 - abs(fi - 3.5) * 0.028;
    float az = 0.36 - abs(fi - 3.5) * 0.012;
    float y = 4.7 - fi * 0.1 - 0.16 * (p.z / az);
    vec2 e = vec2(p.x / ax, (p.z + 0.02) / az);
    float r = (length(e) - 1.0) * min(ax, az);
    float rib = length(vec2(r, (p.y - y) * 1.3)) - 0.022;
    rib = max(rib, 0.1 - length(vec2(p.x * 3.0, max(p.z - 0.2, 0.0))));  // sternum gap
    d = min(d, rib);
  }
  d = min(d, sdCap(p, vec3(0.0, 4.64, 0.36), vec3(0.0, 4.05, 0.37), 0.03));               // sternum
  d = min(d, sdCap(q, vec3(0.05, 4.8, 0.24), vec3(0.64, 4.84, 0.02), 0.03));               // clavicles
  d = min(d, abs(headSdf(p, q)) - 0.014);                                                  // skull
  d = min(d, teethSdf(p));
  d = min(d, max(abs(sdEll(p - vec3(0.0, 3.1, 0.0), vec3(0.42, 0.22, 0.25))) - 0.02, p.y - 3.18)); // pelvis
  d = min(d, sdCap(q, vec3(0.8, 4.55, 0.0), vec3(0.95, 3.6, 0.06), 0.045));               // humerus
  d = min(d, sdCap(q, vec3(0.93, 3.6, 0.06), vec3(0.98, 2.6, 0.22), 0.028));              // radius
  d = min(d, sdCap(q, vec3(0.99, 3.6, 0.02), vec3(1.04, 2.6, 0.18), 0.026));              // ulna
  d = min(d, sdCap(q, vec3(0.3, 3.0, 0.0), vec3(0.33, 1.72, 0.08), 0.05));                // femur
  d = min(d, sdCap(q, vec3(0.33, 1.72, 0.08), vec3(0.35, 0.22, -0.02), 0.04));            // tibia
  return d;
}
`;

// proxy box, in titan-local space: feet at y = 0, facing +z
const BOX = { w: 2.7, h: 6.4, d: 1.5, cy: 3.05 };

const vertex = /* glsl */ `
attribute vec3 position;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
varying vec3 vLocal;
void main() {
  vLocal = position + vec3(0.0, ${BOX.cy.toFixed(2)}, 0.0);
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vLocal, 1.0);
}
`;

const flesh = /* glsl */ `
precision highp float;
${ATMOS}
${NOISE}
${SHADOWS}
${SDF}
uniform vec3 cameraPosition;
uniform mat4 modelMatrix;
uniform mat4 uInvModel;
uniform float uCut;
uniform float uEyes;
uniform float uFade;
uniform float uSkin;     // 0 = flayed Colossal, 1 = skinned (the ones walking outside)
uniform float uSteps;
varying vec3 vLocal;

float cutAt(vec3 p) { return uCut + 0.22 * (noise3(vec3(p.x * 7.0, 0.0, p.z * 7.0)) - 0.5); }
float map(vec3 p) { return max(min(bodySdf(p), teethSdf(p)), p.y - cutAt(p)); }
vec3 calcNormal(vec3 p) {
  const vec2 k = vec2(1.0, -1.0);
  float e = 0.004;
  return normalize(k.xyy * map(p + k.xyy * e) + k.yyx * map(p + k.yyx * e) + k.yxy * map(p + k.yxy * e) + k.xxx * map(p + k.xxx * e));
}

void main() {
  if (uFade <= 0.001) discard;
  vec3 ro = (uInvModel * vec4(cameraPosition, 1.0)).xyz;
  vec3 rd = normalize(vLocal - ro);
  float t = length(vLocal - ro);
  float tMax = t + 4.0;
  bool hit = false;
  vec3 p;
  for (int i = 0; i < 96; i++) {
    if (float(i) >= uSteps) break;
    p = ro + rd * t;
    float d = map(p);
    if (d < 0.0025 * (1.0 + t * 0.02)) { hit = true; break; }
    t += d * 0.9;
    if (t > tMax) break;
  }
  if (!hit) discard;

  vec3 n = calcNormal(p);
  vec3 N = normalize(mat3(modelMatrix) * n);
  vec3 world = (modelMatrix * vec4(p, 1.0)).xyz;
  vec3 V = normalize(cameraPosition - world);
  vec3 L = normalize(uSun);

  vec3 q = vec3(abs(p.x), p.y, p.z);
  float teeth = step(teethSdf(p), 0.003);
  float socket = 1.0 - smoothstep(0.0, 0.05, length((q - vec3(0.11, 5.58, 0.3)) / vec3(1.0, 0.8, 1.6)) - 0.06);
  float capEdge = 1.0 - smoothstep(0.0, 0.05, cutAt(p) - p.y);

  // exposed muscle: fibres stretched along the limbs (anisotropic noise, so
  // no aliasing bands), large masses varying in tone
  float fibre = noise3(vec3(p.x * 70.0, p.y * 5.0, p.z * 70.0)) * 2.0 - 1.0;
  float mass = fbm3(p * 2.2);
  vec3 muscle = mix(vec3(0.38, 0.07, 0.05), vec3(0.66, 0.26, 0.2), mass);
  muscle *= 0.86 + 0.2 * fibre;
  muscle = mix(muscle, vec3(0.7, 0.6, 0.5), 0.4 * smoothstep(0.6, 0.8, fbm3(p * vec3(6.0, 2.0, 6.0))));  // sinew
  vec3 skin = vec3(0.62, 0.5, 0.42) * (0.85 + 0.2 * noise3(p * 5.0));
  vec3 col = mix(muscle, skin, uSkin);
  // teeth: individual, with dark gaps and a seam between the rows
  float ta = atan(p.x, p.z - 0.07);
  float gaps = smoothstep(0.06, 0.2, abs(fract(ta / 0.13) - 0.5) * 2.0) * smoothstep(0.004, 0.012, abs(p.y - 5.34));
  col = mix(col, vec3(1.5, 1.42, 1.22) * (0.25 + 0.75 * gaps), teeth);  // pale enough to read in the shadowed face
  col *= mix(1.0, 0.12, socket);

  // fibre bump: wet muscle catches the light along its grain
  n = normalize(n + (1.0 - uSkin) * (1.0 - teeth) * 0.08 * vec3(fibre, 0.0, -fibre));
  N = normalize(mat3(modelMatrix) * n);

  // cheap AO from the SDF, a wrapped sun, a backlit rim and a wet sheen
  float ao = 0.0;
  for (int k = 1; k <= 4; k++) { float h = 0.04 * float(k); ao += (h - map(p + n * h)) / h; }
  ao = clamp(1.0 - ao * 0.22, 0.25, 1.0);
  float diff = max(dot(N, L), 0.0);
  float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0) * (0.25 + 1.6 * max(dot(-V, L), 0.0));
  float spec = pow(max(dot(N, normalize(L + V)), 0.0), 60.0) * (1.0 - uSkin) * (0.6 + 0.4 * fibre);
  float shade = wallShadow(world);
  vec3 lit = col * (uSunColor * diff * 1.6 * shade + uSkyColor * (0.2 + 0.2 * N.y) * mix(1.0, 2.0, uSkin)) * ao
    + uSunColor * (rim * 1.4 + spec * 0.5) * shade;

  // backlit flesh: light passing THROUGH thin parts (edges, fingers, jaw)
  // glows red. Fast translucency, after Barre-Brisebois & Bouchard (GDC 2011).
  vec3 Lt = normalize(L + N * 0.35);
  float trans = pow(clamp(dot(V, -Lt), 0.0, 1.0), 4.0) * (1.0 - ao * 0.55) * (1.0 - uSkin * 0.6);
  float thin = pow(1.0 - max(dot(N, V), 0.0), 1.5);
  lit += vec3(0.95, 0.22, 0.1) * uSunColor * trans * (0.35 + 1.4 * thin) * shade;

  // the forming edge smoulders under the steam
  float ember = 0.6 + 0.4 * noise3(p * 14.0);
  lit = mix(lit, vec3(0.9, 0.36, 0.16) * ember, capEdge * 0.85);
  // the eyes: a small hard glint deep in each socket, not a lamp
  float core = 1.0 - smoothstep(0.0, 0.028, length((q - vec3(0.11, 5.575, 0.31)) / vec3(1.0, 0.75, 1.5)));
  lit = mix(lit, vec3(1.0, 0.92, 0.78) * 1.8, core * uEyes);
                  // the forming edge is hot

  float dist = length(cameraPosition - world);
  gl_FragColor = vec4(grade(applyFog(lit, dist, world.y)), uFade);
}
`;

const xray = /* glsl */ `
precision highp float;
${NOISE}
${SDF}
${SKELETON}
uniform vec3 cameraPosition;
uniform mat4 uInvModel;
uniform float uXray;
varying vec3 vLocal;
void main() {
  vec3 ro = (uInvModel * vec4(cameraPosition, 1.0)).xyz;
  vec3 rd = normalize(vLocal - ro);
  float t = length(vLocal - ro);
  float body = 0.0;
  float bone = 0.0;
  float st = 0.03;
  for (int i = 0; i < 110; i++) {
    vec3 p = ro + rd * t;
    if (abs(p.x) > 1.4 || p.y < -0.1 || p.y > 6.3 || abs(p.z) > 0.8) break;
    float db = bodySdf(p);
    float ds = skelSdf(p);
    body += exp(-abs(db) * 28.0) * st;
    bone += exp(-max(ds, 0.0) * 55.0) * st;
    t += st;
  }
  float scan = 0.88 + 0.12 * sin(gl_FragCoord.y * 1.4);
  vec3 c = vec3(0.86, 0.84, 0.76) * (body * 1.1 + bone * 3.2) * scan * uXray;
  gl_FragColor = vec4(c, 1.0);
}
`;

type Uniforms = Record<string, { value: unknown }>;

export function createTitan(gl: OGLRenderingContext, shared: Uniforms, opts: { skin?: number; steps: number }) {
  const geometry = new Box(gl, { width: BOX.w, height: BOX.h, depth: BOX.d });
  const program = new Program(gl, {
    vertex,
    fragment: flesh,
    uniforms: {
      ...shared,
      uInvModel: { value: new Mat4() },
      uCut: { value: opts.skin ? 100 : 0 },
      uEyes: { value: 0 },
      uFade: { value: 1 },
      uSkin: { value: opts.skin ?? 0 },
      uSteps: { value: opts.steps },
    },
    transparent: true,
    depthWrite: false,
  });
  const mesh = new Mesh(gl, { geometry, program });
  // the raymarch needs the camera in titan space
  mesh.onBeforeRender(() => {
    (program.uniforms.uInvModel.value as Mat4).inverse(mesh.worldMatrix);
  });
  return mesh;
}

/** The body inside the stone, as film negative. Additive, no depth. */
export function createXrayTitan(gl: OGLRenderingContext) {
  const geometry = new Box(gl, { width: BOX.w, height: BOX.h, depth: BOX.d });
  const uniforms = { uXray: { value: 0 }, uInvModel: { value: new Mat4() } };
  const program = new Program(gl, { vertex, fragment: xray, uniforms, transparent: true, depthTest: false, depthWrite: false });
  program.setBlendFunc(gl.ONE, gl.ONE);
  const mesh = new Mesh(gl, { geometry, program });
  mesh.onBeforeRender(() => {
    uniforms.uInvModel.value.inverse(mesh.worldMatrix);
  });
  return { mesh, uniforms };
}
