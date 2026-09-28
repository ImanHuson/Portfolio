// The Yeager cellar, raymarched in one fragment shader (a full-screen
// triangle): a hatch in the ruined floor, a wooden stair down, a door with an
// iron lock, and Grisha's room with the desk. Light is a daylight shaft through
// the hatch (analytic: a point is sunlit if its ray to the sun passes through
// the hatch opening, so no shadow march) plus the lantern the camera carries.
// Units are metres. The stair runs down toward -z.

export const vertex = /* glsl */ `
attribute vec2 position;
varying vec2 vUv;
void main(){ vUv = position * 0.5 + 0.5; gl_Position = vec4(position, 0.0, 1.0); }
`;

export const fragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform vec3 uCamPos;
uniform vec3 uCamLook;
uniform float uFov;
uniform float uTime;
uniform float uDoor;    // 0 closed .. 1 open
uniform float uDrawer;  // 0 shut .. 1 pulled out
uniform float uBooks;   // 0 hidden under the false bottom .. 1 lifted
uniform float uWhite;   // fade to the photographic white at the end
uniform float uLantern; // lantern strength
uniform float uSteps;
uniform float uKeyIn;   // 0 out of shot .. 1 fully in the lock
uniform float uKeyTurn; // radians about its own shaft

#define WOOD 1.0
#define STONE 2.0
#define IRON 3.0
#define DIRT 4.0
#define BOOK 5.0
#define RUBBLE 6.0
#define GLASS 7.0
#define PAGE 8.0
#define PLASTER 9.0
#define BRASS 10.0

const vec3 SUN = normalize(vec3(0.22, 1.0, 0.42));
const float RISE = 0.2143;
const float RUN = 0.3;
const float FLOOR = -3.0;
const float CEIL = 0.05;

// Dave Hoskins' hash13: no visible lattice (a product-based hash left diagonal bands on the walls)
float hash(vec3 p){ p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float noise(vec3 x){
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++){ s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }

float sdBox(vec3 p, vec3 b){ vec3 q = abs(p) - b; return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0); }
float sdTorus(vec3 p, float R, float r){ vec2 q = vec2(length(p.xz) - R, p.y); return length(q) - r; }
float sdCap(vec3 p, vec3 a, vec3 b, float r){ vec3 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h) - r; }
float sdCyl(vec3 p, float r, float h){ vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h); return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)); }
vec2 U(vec2 a, vec2 b){ return a.x < b.x ? a : b; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

// ---------------------------------------------------------------- the stair
vec2 stairwell(vec3 p){
  // treads: check the tread under this point and its neighbours
  float i0 = clamp(floor(-p.z / RUN), 0.0, 13.0);
  float d = 1e5;
  for (int k = -1; k <= 1; k++){
    float i = clamp(i0 + float(k), 0.0, 13.0);
    float top = -(i + 1.0) * RISE;
    d = min(d, sdBox(p - vec3(0.0, top - 0.025, -(i + 0.5) * RUN), vec3(0.5, 0.025, RUN * 0.5 + 0.02)));
  }
  // two stringers along the slope
  vec3 q = p - vec3(0.0, -1.6, -2.1);
  q.yz = rot(-atan(RISE / RUN)) * q.yz;
  vec3 qx = vec3(abs(q.x) - 0.52, q.y, q.z);
  d = min(d, sdBox(qx, vec3(0.04, 0.12, 2.65)));
  vec2 r = vec2(d, WOOD);
  // side walls (stone), the back wall behind the top step
  float side = abs(p.x) - 0.62;
  float wallSlab = max(max(-side, side - 0.3), max(p.y - CEIL, -(p.y - FLOOR) - 0.1));
  wallSlab = max(wallSlab, max(p.z - 0.15, -(p.z + 4.55)));
  // plastered: a brick grid seen steeply down a stair converges into a diamond lattice
  r = U(r, vec2(wallSlab, PLASTER));
  float back = sdBox(p - vec3(0.0, -1.5, 0.3), vec3(0.95, 1.6, 0.15));
  r = U(r, vec2(back, STONE));
  // the landing at the foot
  r = U(r, vec2(sdBox(p - vec3(0.0, FLOOR - 0.1, -4.35), vec3(0.62, 0.1, 0.2)), DIRT));
  return r;
}

// ---------------------------------------------------------------- the ceiling slab with the hatch, the ruin above
vec2 slab(vec3 p){
  float s = sdBox(p - vec3(0.0, CEIL + 0.15, -4.0), vec3(3.2, 0.15, 5.8));
  float hole = sdBox(p - vec3(0.0, CEIL + 0.15, -0.55), vec3(0.55, 0.4, 0.55));
  s = max(s, -hole);
  vec2 r = vec2(s, RUBBLE);
  // charred beams and stones lying around the hatch
  vec3 b = p - vec3(-0.95, CEIL + 0.42, -0.4); b.xz = rot(0.35) * b.xz;
  r = U(r, vec2(sdBox(b, vec3(0.09, 0.09, 1.3)) - 0.01, WOOD));
  vec3 c = p - vec3(0.95, CEIL + 0.36, -0.9); c.xz = rot(-0.9) * c.xz; c.xy = rot(0.12) * c.xy;
  r = U(r, vec2(sdBox(c, vec3(0.08, 0.07, 1.0)) - 0.01, WOOD));
  r = U(r, vec2(sdBox(p - vec3(0.8, CEIL + 0.38, 0.35), vec3(0.2, 0.08, 0.16)) - 0.03, STONE));
  r = U(r, vec2(sdBox(p - vec3(-0.75, CEIL + 0.36, -1.35), vec3(0.14, 0.06, 0.12)) - 0.03, STONE));
  // joists under the ceiling of the room, running across
  if (p.z < -4.6){
    vec3 j = p; j.z = mod(j.z + 4.6, 0.9) - 0.45;
    r = U(r, vec2(sdBox(j - vec3(0.0, CEIL - 0.09, 0.0), vec3(3.0, 0.09, 0.07)), WOOD));
  }
  return r;
}

// ---------------------------------------------------------------- the door and its wall
vec2 door(vec3 p){
  // the wall between stair and room, with an opening
  float w = sdBox(p - vec3(0.0, -1.5, -4.62), vec3(3.2, 1.6, 0.12));
  w = max(w, -sdBox(p - vec3(0.0, -2.0, -4.62), vec3(0.46, 1.0, 0.3)));
  vec2 r = vec2(w, STONE);
  // the frame
  float fr = sdBox(p - vec3(0.0, -2.0, -4.49), vec3(0.54, 1.06, 0.035));
  fr = max(fr, -sdBox(p - vec3(0.0, -2.05, -4.49), vec3(0.46, 1.06, 0.2)));
  r = U(r, vec2(fr, WOOD));
  // the leaf, hinged on the left, swinging into the room
  vec3 q = p - vec3(-0.45, 0.0, -4.52);
  q.xz = rot(-uDoor * 1.75) * q.xz;
  float leaf = sdBox(q - vec3(0.45, -2.0, 0.0), vec3(0.445, 0.99, 0.03));
  r = U(r, vec2(leaf, WOOD));
  // two iron straps and the lock plate with its keyhole
  float straps = min(sdBox(q - vec3(0.42, -1.35, 0.034), vec3(0.4, 0.035, 0.008)), sdBox(q - vec3(0.42, -2.6, 0.034), vec3(0.4, 0.035, 0.008)));
  float plate = sdBox(q - vec3(0.75, -1.98, 0.036), vec3(0.06, 0.1, 0.01)) - 0.004;
  float hole = min(length(q.xy - vec2(0.75, -1.95)) - 0.012, sdBox(q - vec3(0.75, -1.985, 0.0), vec3(0.005, 0.025, 0.2)));
  plate = max(plate, -hole);
  r = U(r, vec2(min(straps, plate), IRON));
  // Eren's key: pushed along the keyhole's axis, turned about its own shaft
  if (uKeyIn > 0.001){
    vec3 k = q - vec3(0.75, -1.95, 0.046 + (1.0 - uKeyIn) * 0.16);
    k.xy = rot(uKeyTurn) * k.xy;
    float shank = sdCap(k, vec3(0.0, 0.0, -0.03), vec3(0.0, 0.0, 0.05), 0.0055);
    float collar = sdCap(k, vec3(0.0, 0.0, 0.045), vec3(0.0, 0.0, 0.056), 0.009);
    // the bow is a ring in the plane that holds the shaft: seen from the front it is nearly edge-on
    float bow = sdTorus((k - vec3(0.0, 0.0, 0.082)).yxz, 0.024, 0.0055);
    float key = min(min(shank, collar), bow);
    // the cord it hangs on, running up and back toward Eren
    r = U(r, vec2(key, BRASS));
    r = U(r, vec2(sdCap(k, vec3(0.0, 0.0, 0.107), vec3(0.03, 0.25, 0.45), 0.0018), DIRT)); // leather cord
  }
  return r;
}

// ---------------------------------------------------------------- Grisha's room
vec2 room(vec3 p){
  // the shell: floor, far wall, side walls
  float fl = p.y - FLOOR;
  vec2 r = vec2(fl, DIRT);
  r = U(r, vec2(3.0 - abs(p.x), STONE));
  r = U(r, vec2(p.z + 9.55, STONE));

  // the desk against the far wall
  vec3 d = p - vec3(0.8, 0.0, -9.1);
  float top = sdBox(d - vec3(0.0, -2.25, 0.0), vec3(0.7, 0.025, 0.36));
  vec3 l = vec3(abs(d.x) - 0.64, d.y + 2.64, abs(d.z) - 0.3);
  float legs = sdBox(l, vec3(0.03, 0.37, 0.03));
  // the drawer: a hollow box that slides out toward the room
  vec3 dr = d - vec3(0.0, -2.38, uDrawer * 0.5);
  float drawer = sdBox(dr, vec3(0.3, 0.075, 0.32));
  drawer = max(drawer, -sdBox(dr - vec3(0.0, 0.03, 0.0), vec3(0.28, 0.075, 0.3)));
  float front = sdBox(dr - vec3(0.0, 0.0, 0.33), vec3(0.32, 0.085, 0.015));
  float knob = length(dr - vec3(0.0, 0.0, 0.36)) - 0.02;
  // the false bottom: a board that lifts off, and the three books beneath it
  // lifted out and set aside, well out of shot
  vec3 bd = dr - vec3(uBooks * 1.3, -0.02 + uBooks * 0.3, 0.08);
  bd.xy = rot(uBooks * 0.7) * bd.xy;
  float board = sdBox(bd, vec3(0.27, 0.006, 0.22));
  r = U(r, vec2(min(min(top, legs), min(drawer, front)), WOOD));
  r = U(r, vec2(board, WOOD));
  r = U(r, vec2(knob, IRON));
  vec3 bk = dr - vec3(0.0, -0.045, 0.12);
  float books = 1e5;
  for (int i = 0; i < 3; i++){
    vec3 bq = bk - vec3(-0.17 + float(i) * 0.17, 0.0, -0.02 + float(i) * 0.03);
    bq.xz = rot(0.05 * float(i - 1)) * bq.xz;
    books = min(books, sdBox(bq, vec3(0.075, 0.016, 0.11)) - 0.004);
  }
  r = U(r, vec2(books, BOOK));
  // an inkwell and papers on the desk
  r = U(r, vec2(sdCyl(d - vec3(-0.45, -2.19, -0.12), 0.035, 0.035), GLASS));
  r = U(r, vec2(sdBox(d - vec3(0.2, -2.222, -0.08), vec3(0.2, 0.002, 0.14)), PAGE));
  // the chair, pushed back and to the side
  vec3 c = p - vec3(1.9, 0.0, -8.3); c.xz = rot(0.5) * c.xz;
  float seat = sdBox(c - vec3(0.0, -2.55, 0.0), vec3(0.22, 0.02, 0.22));
  float cl = sdBox(vec3(abs(c.x) - 0.19, c.y + 2.79, abs(c.z) - 0.19), vec3(0.02, 0.23, 0.02));
  float back = sdBox(c - vec3(0.0, -2.2, -0.2), vec3(0.22, 0.34, 0.02));
  r = U(r, vec2(min(seat, min(cl, back)), WOOD));

  // shelves along the left wall, with jars and bound books
  vec3 s = p - vec3(-2.78, 0.0, -7.0);
  float sh = 1e5;
  for (int i = 0; i < 3; i++){
    float y = -2.4 + float(i) * 0.6;
    sh = min(sh, sdBox(s - vec3(0.0, y, 0.0), vec3(0.2, 0.02, 1.6)));
  }
  sh = min(sh, sdBox(vec3(s.x, s.y + 1.9, abs(s.z) - 1.58), vec3(0.2, 1.1, 0.02)));
  r = U(r, vec2(sh, WOOD));
  vec3 j = s; j.z = mod(j.z + 1.5, 0.34) - 0.17;
  float jl = floor((s.z + 1.5) / 0.34);
  float rowY = -2.38 + 0.6 * mod(jl, 2.0);
  float jars = (abs(s.z) < 1.45) ? sdCyl(j - vec3(0.02, rowY + 0.09, 0.0), 0.06 + 0.02 * hash(vec3(jl)), 0.09) : 1e5;
  r = U(r, vec2(jars, GLASS));
  vec3 v = s - vec3(0.0, -1.2 + 0.13, 0.0); v.z = mod(v.z + 1.5, 0.07) - 0.035;
  float vi = floor((s.z + 1.5) / 0.07);
  float vols = (abs(s.z) < 1.3) ? sdBox(v, vec3(0.13, 0.11 + 0.03 * hash(vec3(vi, 2.0, 1.0)), 0.028)) : 1e5;
  r = U(r, vec2(vols, BOOK));
  return r;
}

vec2 map(vec3 p){
  vec2 r = slab(p);
  if (p.z > -4.9) r = U(r, stairwell(p));
  r = U(r, door(p));
  if (p.z < -4.3 && p.y < CEIL + 0.05) r = U(r, room(p));
  return r;
}

vec3 normalAt(vec3 p){
  vec2 e = vec2(0.0015, -0.0015);
  return normalize(e.xyy * map(p + e.xyy).x + e.yyx * map(p + e.yyx).x + e.yxy * map(p + e.yxy).x + e.xxx * map(p + e.xxx).x);
}

float ao(vec3 p, vec3 n){
  float o = 0.0, s = 1.0;
  for (int i = 1; i <= 4; i++){ float h = 0.03 * float(i * i); o += (h - map(p + n * h).x) * s; s *= 0.6; }
  return clamp(1.0 - 2.2 * o, 0.0, 1.0);
}

// daylight through the hatch: open sky above the slab, a shaft below it
float sunlit(vec3 p){
  if (p.y > CEIL + 0.28) return 1.0;
  float t = (CEIL + 0.3 - p.y) / SUN.y;
  vec3 q = p + SUN * t;
  vec2 h = vec2(abs(q.x), abs(q.z + 0.55));
  return smoothstep(0.03, -0.03, max(h.x - 0.55, h.y - 0.55));
}

vec3 albedo(vec3 p, vec3 n, float m){
  if (m == WOOD){
    // grain runs along the longest axis of most boards: approximate with the axis least aligned to the normal
    vec3 g = abs(n.y) > 0.5 ? p.zxy : p.yzx;
    float grain = fbm(vec3(g.x * 1.2, g.y * 26.0, g.z * 26.0));
    float plank = smoothstep(0.465, 0.49, abs(fract(g.y * 5.0) - 0.5));
    vec3 c = mix(vec3(0.085, 0.06, 0.04), vec3(0.21, 0.145, 0.09), grain * grain * 1.4);
    c *= 0.75 + 0.5 * fbm(p * 2.0); // uneven wear
    return c * (1.0 - 0.7 * plank);
  }
  if (m == STONE){
    // rough-cut foundation stone: warped joints and uneven blocks, so the
    // wall never reads as a tiled grid at a steep angle
    vec2 uv = abs(n.x) > 0.5 ? p.zy : p.xy;
    uv += (vec2(fbm(p * 3.1), fbm(p * 3.1 + 7.0)) - 0.5) * 0.09;
    uv.x += floor(uv.y / 0.3) * 0.23;
    vec2 cell = floor(uv / vec2(0.46, 0.3));
    vec2 f = fract(uv / vec2(0.46, 0.3));
    float edge = min(min(f.x, 1.0 - f.x) * 0.46, min(f.y, 1.0 - f.y) * 0.3);
    float mortar = smoothstep(0.045, 0.012, edge + (fbm(p * 14.0) - 0.5) * 0.03);
    float n1 = fbm(p * 5.0);
    float tone = 0.55 + 0.8 * hash(vec3(cell, 3.0));
    vec3 c = mix(vec3(0.1, 0.095, 0.085), vec3(0.22, 0.2, 0.17), n1) * tone;
    c *= 0.8 + 0.4 * fbm(p * 24.0); // pitting
    return mix(c, vec3(0.03, 0.028, 0.026), mortar);
  }
  if (m == PLASTER){
    // old lime plaster: stained, cracked, damp toward the treads, and fallen
    // away in patches to show the stone behind it
    float n1 = fbm(p * 2.2);
    vec3 c = vec3(0.3, 0.28, 0.245) * (0.55 + 0.6 * n1);
    float damp = smoothstep(0.9, -0.2, p.y + p.z * 0.71 + 0.35 + (fbm(p * 4.0) - 0.5) * 0.8);
    c *= 1.0 - 0.55 * damp;
    float crack = smoothstep(0.012, 0.0, abs(fbm(p * 3.3 + 5.0) - 0.5));
    c *= 1.0 - 0.6 * crack;
    float bare = smoothstep(0.66, 0.7, fbm(p * 1.4 + 9.0));
    vec3 stone = mix(vec3(0.09, 0.085, 0.075), vec3(0.18, 0.16, 0.14), fbm(p * 9.0));
    return mix(c * (0.85 + 0.3 * fbm(p * 30.0)), stone, bare);
  }
  if (m == BRASS) return vec3(0.3, 0.23, 0.12) * (0.75 + 0.5 * fbm(p * 90.0));
  if (m == IRON) return vec3(0.07, 0.065, 0.06) + 0.05 * fbm(p * 30.0);
  if (m == DIRT) return mix(vec3(0.06, 0.05, 0.04), vec3(0.15, 0.13, 0.1), fbm(p * 5.0));
  if (m == BOOK){
    // leather covers in three tones; the side faces show cream page edges
    // one tone per book: the drawer's three sit side by side in x, the shelf's in z
    float idx = p.x > 0.0 ? floor((p.x - 0.8 + 0.255) / 0.17) : floor((p.z + 8.5) / 0.07);
    float which = p.x > 0.0 ? idx / 3.0 + 0.1 : hash(vec3(idx, 4.0, 11.0));
    vec3 lea = which < 0.34 ? vec3(0.17, 0.05, 0.035) : which < 0.67 ? vec3(0.07, 0.085, 0.06) : vec3(0.13, 0.085, 0.05);
    lea *= 0.75 + 0.5 * fbm(p * 40.0);
    if (abs(n.y) < 0.5){
      float lines = 0.8 + 0.2 * sin(p.y * 900.0);
      return mix(lea, vec3(0.52, 0.47, 0.38) * lines, 0.8);
    }
    return lea;
  }
  if (m == RUBBLE){
    // what is left of the ground floor: charred boards, ash drifted over them
    float plank = smoothstep(0.44, 0.49, abs(fract(p.x * 5.5) - 0.5));
    float grain = fbm(vec3(p.x * 30.0, p.y, p.z * 1.5));
    vec3 wood = mix(vec3(0.05, 0.04, 0.03), vec3(0.14, 0.1, 0.07), grain) * (1.0 - 0.8 * plank);
    float ash = smoothstep(0.45, 0.75, fbm(p * 1.3 + 2.0));
    vec3 c = mix(wood, vec3(0.2, 0.19, 0.18) * (0.7 + 0.3 * fbm(p * 30.0)), ash);
    return c * (0.6 + 0.4 * fbm(p * 9.0));
  }
  if (m == GLASS) return vec3(0.18, 0.22, 0.2);
  return vec3(0.62, 0.57, 0.48); // PAGE
}

vec3 aces(vec3 x){ return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }

void main(){
  vec2 frag = vUv * uRes;
  vec2 uv = (frag - 0.5 * uRes) / uRes.y;
  vec3 ro = uCamPos;
  vec3 fw = normalize(uCamLook - ro);
  vec3 rt = normalize(cross(fw, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(rt, fw);
  vec3 rd = normalize(fw * (1.0 / tan(uFov * 0.5)) + uv.x * rt + uv.y * up);

  // the lantern the camera carries: low and to the right, flickering a little
  vec3 lamp = ro + rt * 0.28 - up * 0.22 + fw * 0.15;
  float flick = 0.92 + 0.08 * sin(uTime * 13.0) * sin(uTime * 7.3 + 1.0);
  vec3 lampCol = vec3(1.0, 0.66, 0.38) * 2.2 * uLantern * flick;

  float t = 0.02; vec2 h = vec2(0.0); bool hit = false;
  for (int i = 0; i < 128; i++){
    if (float(i) >= uSteps) break;
    h = map(ro + rd * t);
    if (h.x < 0.0008 * t){ hit = true; break; }
    t += h.x * 0.9;
    if (t > 18.0) break;
  }

  vec3 col;
  vec3 sunCol = vec3(0.86, 0.9, 1.0) * 1.5; // overcast daylight, cold against the lantern
  if (hit){
    vec3 p = ro + rd * t;
    vec3 n = normalAt(p);
    vec3 a = albedo(p, n, h.y);
    float occ = ao(p, n);
    float sl = sunlit(p + n * 0.01) * max(dot(n, SUN), 0.0);
    vec3 L = lamp - p; float ld = length(L); L /= ld;
    float lamb = max(dot(n, L), 0.0) / (1.0 + ld * ld * 1.1);
    float spec = pow(max(dot(reflect(-L, n), -rd), 0.0), h.y == BRASS ? 60.0 : h.y == IRON || h.y == GLASS ? 40.0 : 12.0) * (h.y == BRASS ? 2.5 : h.y == IRON || h.y == GLASS ? 0.6 : 0.08) / (1.0 + ld * ld);
    // bounce: the shaft lights the stair around it a little
    float bounce = 0.03 * exp(-length(p.xz - vec2(0.0, -1.6)) * 0.7) * step(-4.6, p.z);
    vec3 amb = vec3(0.012, 0.013, 0.015) * occ;
    col = a * (sunCol * sl + lampCol * lamb * 1.6 + amb + bounce * sunCol * occ) + lampCol * spec;
  } else {
    col = vec3(0.55, 0.6, 0.66) * 1.4 * step(0.0, rd.y); // sky, only ever seen through the hatch
  }

  // dust: sunlit motes in the shaft and a lantern haze, integrated along the ray
  float tmax = min(t, 10.0);
  float stepL = tmax / 22.0;
  vec3 fog = vec3(0.0);
  float jitter = hash(vec3(frag, uTime));
  for (int i = 0; i < 22; i++){
    vec3 q = ro + rd * (float(i) + jitter) * stepL;
    float dens = 0.35 + 0.65 * noise(q * 3.0 + vec3(0.0, uTime * 0.05, uTime * 0.03));
    float motes = smoothstep(0.9, 0.97, noise(q * 40.0 + vec3(uTime * 0.2, -uTime * 0.12, 0.0))) * 2.0;
    float shaft = q.y < CEIL + 0.28 ? sunlit(q) : 0.0;
    float ll = length(q - lamp);
    fog += (sunCol * shaft * (dens * 0.03 + motes * 0.05) + lampCol * 0.01 * dens / (1.0 + ll * ll * 4.0)) * stepL;
  }
  col += fog;

  col = aces(col * 0.9);
  col = pow(col, vec3(0.4545));
  // a cold, slightly desaturated print
  float g = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(col, vec3(g) * vec3(1.02, 1.0, 0.96), 0.3);
  col = smoothstep(0.0, 1.0, col * 1.05); // a touch of print contrast
  vec2 v = vUv - 0.5;
  col *= 1.0 - dot(v, v) * 0.9;
  col += (hash(vec3(frag, fract(uTime) * 91.0)) - 0.5) * 0.05;
  col = mix(col, vec3(0.93, 0.92, 0.9), uWhite);
  gl_FragColor = vec4(col, 1.0);
}
`;
