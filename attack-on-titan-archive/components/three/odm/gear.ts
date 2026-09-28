// The omni-directional mobility gear, built from primitives in ogl. Metres,
// y up, the wearer faces +z, the belt at y = 0. Each part is a Transform
// group with a direction it moves in when the model is taken apart.
// It is a readable reconstruction of the parts the story describes (unit,
// spools, turbine, anchors, canisters, blade boxes, grips, blades, Thunder
// Spears), not a copy of any studio's model sheet.

import { Box, Cylinder, Geometry, Mesh, Path, Program, Sphere, Torus, Transform, Tube, Vec3, type OGLRenderingContext } from "ogl";

export const vertex = /* glsl */ `
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform mat4 modelViewMatrix;
varying vec3 vN;
varying vec3 vW;
varying vec2 vUv;
void main(){
  vUv = uv;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

// lit by an analytic studio: a soft sky, a key softbox, a cool rim; metals
// sample it along the reflection vector (no environment texture needed)
export const fragment = /* glsl */ `
precision highp float;
uniform vec3 uColor;
uniform float uMetal;
uniform float uRough;
uniform float uHighlight;
uniform float uOpacity;
uniform float uGhost;
uniform vec3 uCamPos;
uniform float uLeather; // 1 on straps: grain, worn edges, a line of stitching each side
varying vec3 vN;
varying vec3 vW;
varying vec2 vUv;
float h3(vec3 p){ p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float n3(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z); }
vec3 studio(vec3 d){
  float sky = 0.5 + 0.5 * d.y;
  vec3 c = mix(vec3(0.05, 0.05, 0.05), vec3(0.42, 0.41, 0.38), sky);
  c += vec3(2.4, 2.25, 2.0) * smoothstep(0.86, 0.97, dot(d, normalize(vec3(-0.5, 0.65, 0.55))));
  c += vec3(0.9, 1.0, 1.15) * smoothstep(0.9, 0.98, dot(d, normalize(vec3(0.7, 0.3, -0.65))));
  return c;
}
void main(){
  vec3 n = normalize(vN);
  vec3 v = normalize(uCamPos - vW);
  if (uGhost > 0.5){
    // the wearer: a faint rim, nothing else
    float rim = pow(1.0 - abs(dot(n, v)), 1.8);
    gl_FragColor = vec4(vec3(0.6, 0.58, 0.54) * (0.1 + rim), (0.16 + rim * 0.7) * uOpacity);
    return;
  }
  vec3 key = normalize(vec3(-0.5, 0.65, 0.55));
  float diff = max(dot(n, key), 0.0) * 0.85 + 0.15;
  vec3 r = reflect(-v, n);

  float fres = 0.04 + 0.96 * pow(1.0 - max(dot(n, v), 0.0), 5.0);
  vec3 albedo = uColor;
  float rough = uRough;
  if (uLeather > 0.5){
    float grain = n3(vW * 180.0) * 0.6 + n3(vW * 45.0) * 0.4;
    albedo *= 0.78 + 0.42 * grain;
    // worn, darker edges; a light burnish down the middle
    float across = abs(vUv.y - 0.5) * 2.0;
    albedo *= mix(1.08, 0.72, smoothstep(0.6, 1.0, across));
    // stitching: a dashed pale line just inside each edge
    float row = smoothstep(0.05, 0.0, abs(across - 0.72));
    float dash = step(0.45, fract(vUv.x * 1.0));
    albedo = mix(albedo, vec3(0.62, 0.55, 0.42), row * dash * 0.85);
    rough = mix(0.55, 0.8, grain);
  }
  vec3 base = albedo * diff;
  vec3 env = studio(normalize(mix(r, n, rough)));
  vec3 col = mix(base + env * fres * (1.0 - rough) * 0.6, albedo * env * 0.9, uMetal);
  col += vec3(0.95, 0.55, 0.3) * uHighlight * (0.25 + 0.5 * pow(1.0 - max(dot(n, v), 0.0), 2.0));
  col = col / (col + 0.8) * 1.5;
  gl_FragColor = vec4(pow(col, vec3(0.4545)), uOpacity);
}`;

type Mat = { color: [number, number, number]; metal: number; rough: number };
const STEEL: Mat = { color: [0.62, 0.63, 0.64], metal: 1, rough: 0.28 };
const DARK_STEEL: Mat = { color: [0.3, 0.31, 0.32], metal: 1, rough: 0.35 };
const PAINT: Mat = { color: [0.46, 0.47, 0.45], metal: 0.6, rough: 0.45 };
const LEATHER: Mat = { color: [0.17, 0.095, 0.05], metal: 0, rough: 0.7 };
const GRIP: Mat = { color: [0.09, 0.09, 0.09], metal: 0.2, rough: 0.6 };
const BRASS: Mat = { color: [0.55, 0.42, 0.2], metal: 1, rough: 0.3 };

export type Part = {
  id: string;
  group: Transform;
  /** left (-x), centre and right (+x) pieces: the left one explodes mirrored */
  sides: { left: Transform; centre: Transform; right: Transform };
  /** direction and distance (m) the part moves when fully exploded */
  explode: Vec3;
  meshes: Mesh[];
  /** local point the label is pinned to */
  anchor: Vec3;
};

export function makeProgram(gl: OGLRenderingContext, m: Mat, extra: Partial<{ ghost: boolean; leather: boolean }> = {}) {
  return new Program(gl, {
    vertex,
    fragment,
    transparent: true,
    depthWrite: !extra.ghost,
    cullFace: extra.ghost ? null : gl.BACK,
    uniforms: {
      uColor: { value: m.color },
      uMetal: { value: m.metal },
      uRough: { value: m.rough },
      uHighlight: { value: 0 },
      uOpacity: { value: 1 },
      uGhost: { value: extra.ghost ? 1 : 0 },
      uCamPos: { value: new Vec3() },
      uLeather: { value: extra.leather ? 1 : 0 },
    },
  });
}

export function buildGear(gl: OGLRenderingContext) {
  const root = new Transform();
  const parts: Part[] = [];
  const all: Mesh[] = [];

  function part(id: string, explode: [number, number, number], anchor: [number, number, number]) {
    const group = new Transform();
    group.setParent(root);
    const sides = { left: new Transform(), centre: new Transform(), right: new Transform() };
    for (const t of Object.values(sides)) t.setParent(group);
    const p: Part = { id, group, sides, explode: new Vec3(...explode), meshes: [], anchor: new Vec3(...anchor) };
    parts.push(p);
    return p;
  }
  function add(p: Part, geo: Geometry, m: Mat, pos: [number, number, number], rot: [number, number, number] = [0, 0, 0], scale: [number, number, number] = [1, 1, 1]) {
    const mesh = new Mesh(gl, { geometry: geo, program: makeProgram(gl, m, { leather: m === LEATHER }) });
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    mesh.scale.set(...scale);
    // a piece belongs to the side it sits on; straps built in place (at the origin) go by their bounds
    const x = pos[0] !== 0 ? pos[0] : (() => {
      geo.computeBoundingBox?.();
      const b = geo.bounds;
      return b ? (b.min.x + b.max.x) / 2 : 0;
    })();
    mesh.setParent(x < -0.02 ? p.sides.left : x > 0.02 ? p.sides.right : p.sides.centre);
    p.meshes.push(mesh);
    all.push(mesh);
    return mesh;
  }
  const cyl = (r: number, h: number, seg = 20) => new Cylinder(gl, { radiusTop: r, radiusBottom: r, height: h, radialSegments: seg });
  const box = (w: number, h: number, d: number) => new Box(gl, { width: w, height: h, depth: d });
  // a smooth strap through the points: Catmull-Rom, written as Bezier segments for ogl's Path
  const tube = (pts: [number, number, number][], r: number) => {
    const P = pts.map((p) => new Vec3(...p));
    const path = new Path();
    path.moveTo(P[0]);
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      const c1 = new Vec3().sub(p2, p0).scale(1 / 6).add(p1);
      const c2 = new Vec3().sub(p3, p1).scale(-1 / 6).add(p2);
      path.bezierCurveTo(c1, c2, p2);
    }
    return new Tube(gl, { path, radius: r, tubularSegments: 48, radialSegments: 8 });
  };
  const HALF = Math.PI / 2;

  // a flat leather strap along a polyline: width across the body's surface,
  // a little thickness, uv.x in stitch lengths (one per 12 mm), uv.y across
  function strap(points: Vec3[], width: number, thick: number, axis: (p: Vec3) => Vec3, closed = false) {
    const n = points.length;
    const pos: number[] = [];
    const nor: number[] = [];
    const uvs: number[] = [];
    const idx: number[] = [];
    let len = 0;
    const frames = points.map((p, i) => {
      const a = points[closed ? (i - 1 + n) % n : Math.max(0, i - 1)];
      const b = points[closed ? (i + 1) % n : Math.min(n - 1, i + 1)];
      const t = new Vec3().sub(b, a).normalize();
      // out: away from the limb or torso the strap wraps
      const out = new Vec3().sub(p, axis(p));
      out.sub(new Vec3().copy(t).scale(out.dot(t))).normalize();
      const across = new Vec3().cross(t, out).normalize();
      if (i > 0) len += p.distance(points[i - 1]);
      return { p, out, across, u: len / 0.012 };
    });
    if (closed) frames.push({ ...frames[0], u: (len + points[n - 1].distance(points[0])) / 0.012 });
    // four faces: outer, inner, two edges
    const faces: [number, number, number][] = [
      [1, 0, 0], // outer: +out, edges ±across
      [-1, 0, 0], // inner
      [0, 1, 0], // edge +across
      [0, -1, 0], // edge -across
    ];
    for (const [fo, fa] of faces) {
      const base = pos.length / 3;
      for (const f of frames) {
        for (const side of [-1, 1]) {
          let px: Vec3;
          let nn: Vec3;
          if (fo !== 0) {
            px = new Vec3().copy(f.p).add(new Vec3().copy(f.out).scale((fo * thick) / 2)).add(new Vec3().copy(f.across).scale((side * width) / 2));
            nn = new Vec3().copy(f.out).scale(fo);
          } else {
            px = new Vec3().copy(f.p).add(new Vec3().copy(f.across).scale((fa * width) / 2)).add(new Vec3().copy(f.out).scale((side * thick) / 2));
            nn = new Vec3().copy(f.across).scale(fa);
          }
          pos.push(px.x, px.y, px.z);
          nor.push(nn.x, nn.y, nn.z);
          uvs.push(f.u, fo !== 0 ? (side + 1) / 2 : 0.5);
        }
      }
      for (let i = 0; i < frames.length - 1; i++) {
        const a = base + i * 2;
        // wind so the face points along its normal
        if (fo > 0 || fa > 0) idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
        else idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
    }
    return new Geometry(gl, {
      position: { size: 3, data: new Float32Array(pos) },
      normal: { size: 3, data: new Float32Array(nor) },
      uv: { size: 2, data: new Float32Array(uvs) },
      index: { data: new Uint16Array(idx) },
    });
  }
  const ellipse = (cx: number, cy: number, cz: number, rx: number, rz: number, seg = 48) =>
    Array.from({ length: seg }, (_, i) => {
      const a = (i / seg) * Math.PI * 2;
      return new Vec3(cx + Math.cos(a) * rx, cy, cz + Math.sin(a) * rz);
    });
  const catmull = (pts: [number, number, number][], per = 14) => {
    const P = pts.map((p) => new Vec3(...p));
    const out: Vec3[] = [];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      for (let k = 0; k < per; k++) {
        const t = k / per, t2 = t * t, t3 = t2 * t;
        const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
        out.push(new Vec3(f(p0.x, p1.x, p2.x, p3.x), f(p0.y, p1.y, p2.y, p3.y), f(p0.z, p1.z, p2.z, p3.z)));
      }
    }
    out.push(P[P.length - 1]);
    return out;
  };
  const torsoAxis = (p: Vec3) => new Vec3(0, p.y, 0);
  const thighAxis = (s: number) => (p: Vec3) => new Vec3(s * 0.095, p.y, 0.01);

  // ---- harness: flat leather straps that follow the body, with brass buckles
  const harness = part("harness", [0, 0, 0], [0, 0.0, 0.16]);
  add(harness, strap(ellipse(0, 0, 0, 0.178, 0.138), 0.045, 0.006, torsoAxis, true), LEATHER, [0, 0, 0]);
  add(harness, strap(ellipse(0, 0.36, 0, 0.165, 0.122), 0.032, 0.005, torsoAxis, true), LEATHER, [0, 0, 0]);
  for (const s of [-1, 1]) {
    // thigh loops, with the strap down the front of each thigh from the belt
    add(harness, strap(ellipse(s * 0.095, -0.27, 0.01, 0.083, 0.083, 36), 0.034, 0.006, thighAxis(s), true), LEATHER, [0, 0, 0]);
    add(harness, strap(catmull([[s * 0.065, -0.01, 0.135], [s * 0.085, -0.14, 0.11], [s * 0.095, -0.27, 0.095]], 10), 0.028, 0.005, thighAxis(s)), LEATHER, [0, 0, 0]);
    // shoulder straps: front of the belt, over the collarbone, down the back
    add(harness, strap(catmull([[s * 0.075, 0.0, 0.138], [s * 0.095, 0.22, 0.14], [s * 0.11, 0.45, 0.1], [s * 0.12, 0.56, 0.0], [s * 0.1, 0.42, -0.11], [s * 0.075, 0.0, -0.138]], 12), 0.03, 0.005, torsoAxis), LEATHER, [0, 0, 0]);
    // buckles on the thigh loops and where the shoulder straps meet the chest band
    add(harness, box(0.03, 0.036, 0.008), BRASS, [s * 0.095, -0.27, 0.098]);
    add(harness, box(0.026, 0.03, 0.008), BRASS, [s * 0.1, 0.36, 0.126]);
  }
  add(harness, box(0.052, 0.05, 0.01), BRASS, [0, 0, 0.142]);
  add(harness, box(0.036, 0.034, 0.012), STEEL, [0, 0, 0.146]);

  // ---- main unit at the back of the belt: body, two spools, the turbine
  const unit = part("unit", [0, 0.04, -0.34], [0, 0.03, -0.2]);
  add(unit, box(0.15, 0.09, 0.07), DARK_STEEL, [0, -0.02, -0.175]);
  for (const s of [-1, 1]) add(unit, cyl(0.042, 0.03, 28), STEEL, [s * 0.058, -0.02, -0.2], [0, 0, HALF]);
  for (const [bx, by] of [[-0.06, 0.02], [0.06, 0.02], [-0.06, -0.06], [0.06, -0.06]])
    add(unit, new Sphere(gl, { radius: 0.006, widthSegments: 8, heightSegments: 6 }), STEEL, [bx, by, -0.139]);
  const turbine = new Transform();
  turbine.position.set(0, -0.02, -0.228);
  turbine.setParent(unit.sides.centre);
  add(unit, cyl(0.03, 0.012, 24), STEEL, [0, -0.02, -0.222], [HALF, 0, 0]);
  const blades: Mesh[] = [];
  for (let i = 0; i < 5; i++) {
    const b = new Mesh(gl, { geometry: box(0.012, 0.05, 0.004), program: makeProgram(gl, STEEL) });
    b.position.set(Math.cos((i / 5) * Math.PI * 2) * 0.02, Math.sin((i / 5) * Math.PI * 2) * 0.02, 0);
    b.rotation.z = (i / 5) * Math.PI * 2 + 0.4;
    b.setParent(turbine);
    unit.meshes.push(b);
    all.push(b);
    blades.push(b);
  }

  // ---- anchors, on short barrels either side of the unit, pointing out and forward
  const anchors = part("anchors", [0, 0.1, 0.05], [0.16, -0.02, -0.1]);
  const anchorHeads: Transform[] = [];
  for (const s of [-1, 1]) {
    const mount = new Transform();
    mount.position.set(s * 0.1, -0.02, -0.13);
    mount.rotation.y = s * 0.9;
    mount.setParent(s < 0 ? anchors.sides.left : anchors.sides.right);
    const barrel = new Mesh(gl, { geometry: cyl(0.016, 0.07), program: makeProgram(gl, DARK_STEEL) });
    barrel.rotation.x = HALF;
    barrel.setParent(mount);
    const head = new Transform();
    head.position.set(0, 0, 0.05);
    head.setParent(mount);
    const tip = new Mesh(gl, { geometry: new Cylinder(gl, { radiusTop: 0, radiusBottom: 0.014, height: 0.04, radialSegments: 12 }), program: makeProgram(gl, STEEL) });
    tip.rotation.x = HALF;
    tip.position.z = 0.02;
    tip.setParent(head);
    for (let k = 0; k < 3; k++) {
      const prong = new Mesh(gl, { geometry: box(0.004, 0.004, 0.03), program: makeProgram(gl, STEEL) });
      const a = (k / 3) * Math.PI * 2;
      prong.position.set(Math.cos(a) * 0.012, Math.sin(a) * 0.012, 0.005);
      prong.rotation.set(-Math.sin(a) * 0.5, Math.cos(a) * 0.5, 0);
      prong.setParent(head);
      anchors.meshes.push(prong);
      all.push(prong);
    }
    anchors.meshes.push(barrel, tip);
    all.push(barrel, tip);
    anchorHeads.push(head);
  }

  // ---- blade boxes at the hips, running back along the thighs
  const boxes = part("boxes", [0.26, -0.12, 0], [0.21, -0.14, -0.05]);
  // a point on a box that is tilted 0.18 rad about x around its centre
  const tilt = (c: [number, number, number], local: [number, number, number]): [number, number, number] => {
    const [x, y, z] = local, a = 0.18;
    return [c[0] + x, c[1] + y * Math.cos(a) - z * Math.sin(a), c[2] + y * Math.sin(a) + z * Math.cos(a)];
  };
  for (const s of [-1, 1]) {
    const c: [number, number, number] = [s * 0.215, -0.14, -0.06];
    add(boxes, box(0.075, 0.12, 0.56), PAINT, c, [0.18, 0, 0]);
    add(boxes, box(0.08, 0.02, 0.57), DARK_STEEL, tilt(c, [0, 0.065, -0.01]), [0.18, 0, 0]);
    // end plates, the front one slotted where the blades go in
    add(boxes, box(0.082, 0.126, 0.012), DARK_STEEL, tilt(c, [0, 0, 0.283]), [0.18, 0, 0]);
    add(boxes, box(0.082, 0.126, 0.012), DARK_STEEL, tilt(c, [0, 0, -0.283]), [0.18, 0, 0]);
    for (const k of [-1, 1]) add(boxes, box(0.05, 0.006, 0.004), GRIP, tilt(c, [0, k * 0.022, 0.29]), [0.18, 0, 0]);
    // rivets along the outer face
    for (let i = 0; i < 6; i++) {
      for (const yy of [-0.045, 0.045]) add(boxes, new Sphere(gl, { radius: 0.0045, widthSegments: 8, heightSegments: 6 }), STEEL, tilt(c, [s * 0.038, yy, -0.25 + i * 0.1]));
    }
  }

  // ---- gas canisters on top of the boxes
  const canisters = part("canisters", [0.22, 0.3, -0.05], [0.215, -0.03, -0.1]);
  for (const s of [-1, 1]) {
    add(canisters, cyl(0.028, 0.46, 24), STEEL, [s * 0.215, -0.035, -0.09], [HALF + 0.18, 0, 0]);
    add(canisters, new Sphere(gl, { radius: 0.028, widthSegments: 16, heightSegments: 10 }), STEEL, [s * 0.215, -0.075, 0.137]);
    add(canisters, cyl(0.012, 0.04), BRASS, [s * 0.215, 0.006, -0.31], [HALF + 0.18, 0, 0]);
    // retaining bands, and the gas line back to the unit
    const dir: [number, number, number] = [0, -Math.sin(0.18), Math.cos(0.18)];
    for (const t of [-0.15, 0.12]) {
      add(canisters, new Torus(gl, { radius: 0.029, tube: 0.0035, radialSegments: 6, tubularSegments: 24 }), DARK_STEEL, [s * 0.215, -0.035 + dir[1] * t, -0.09 + dir[2] * t], [0.18, 0, 0]);
    }
    add(canisters, tube([[s * 0.215, 0.004, -0.33], [s * 0.19, 0.0, -0.36], [s * 0.1, -0.02, -0.26], [s * 0.07, -0.02, -0.2]], 0.005), DARK_STEEL, [0, 0, 0]);
  }

  // ---- grips with triggers, held low at the sides; the blades run forward from them
  const grips = part("grips", [0.2, 0.05, 0.3], [0.33, -0.03, 0.13]);
  const blades2 = part("blades", [0.25, 0, 0.55], [0.34, -0.1, 0.55]);
  const spears = part("spears", [0.15, 0.35, 0.35], [0.33, 0.06, 0.35]);
  for (const s of [-1, 1]) {
    add(grips, cyl(0.019, 0.13), GRIP, [s * 0.33, -0.04, 0.12], [0.35, 0, 0]);
    add(grips, box(0.03, 0.045, 0.06), DARK_STEEL, [s * 0.33, 0.01, 0.15]);
    add(grips, box(0.008, 0.035, 0.012), BRASS, [s * 0.33, -0.035, 0.155]);
    // trigger guard, pommel, and the lock that takes the blade
    add(grips, new Torus(gl, { radius: 0.022, tube: 0.003, radialSegments: 6, tubularSegments: 16, arc: Math.PI }), DARK_STEEL, [s * 0.33, -0.03, 0.14], [0, HALF, Math.PI]);
    add(grips, new Sphere(gl, { radius: 0.017, widthSegments: 12, heightSegments: 8 }), DARK_STEEL, [s * 0.33, -0.1, 0.1]);
    add(grips, box(0.03, 0.02, 0.03), STEEL, [s * 0.33, 0.012, 0.19]);
    // the cable from grip to unit
    add(grips, tube([[s * 0.33, 0.0, 0.1], [s * 0.3, -0.05, -0.05], [s * 0.18, -0.03, -0.16], [s * 0.07, -0.02, -0.18]], 0.004), GRIP, [0, 0, 0]);
    add(blades2, box(0.006, 0.035, 0.85), STEEL, [s * 0.33, 0.0, 0.6], [0.08, 0, 0]);
    // Thunder Spear: shaft, warhead, fins, mounted over the grip
    add(spears, cyl(0.014, 0.42), DARK_STEEL, [s * 0.33, 0.07, 0.3], [HALF, 0, 0]);
    add(spears, new Cylinder(gl, { radiusTop: 0, radiusBottom: 0.024, height: 0.09, radialSegments: 16 }), BRASS, [s * 0.33, 0.07, 0.55], [HALF, 0, 0]);
    add(spears, cyl(0.024, 0.05), BRASS, [s * 0.33, 0.07, 0.49], [HALF, 0, 0]);
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI * 2;
      add(spears, box(0.002, 0.03, 0.05), DARK_STEEL, [s * 0.33 + Math.cos(a) * 0.02, 0.07 + Math.sin(a) * 0.02, 0.1], [0, 0, a]);
    }
  }

  // ---- the wearer: a faint figure, so the gear reads as worn
  const ghost = new Transform();
  ghost.setParent(root);
  const ghostMeshes: Mesh[] = [];
  const g = (geo: Geometry, pos: [number, number, number], rot: [number, number, number] = [0, 0, 0], sc: [number, number, number] = [1, 1, 1]) => {
    const m = new Mesh(gl, { geometry: geo, program: makeProgram(gl, LEATHER, { ghost: true }) });
    m.position.set(...pos);
    m.rotation.set(...rot);
    m.scale.set(...sc);
    m.setParent(ghost);
    ghostMeshes.push(m);
  };
  g(new Sphere(gl, { radius: 1, widthSegments: 24, heightSegments: 16 }), [0, 0.3, 0], [0, 0, 0], [0.17, 0.36, 0.12]);
  g(new Sphere(gl, { radius: 0.11, widthSegments: 20, heightSegments: 14 }), [0, 0.8, 0.01]);
  for (const s of [-1, 1]) {
    g(cyl(0.075, 0.85, 16), [s * 0.095, -0.45, 0.01]);
    g(tube([[s * 0.19, 0.52, 0], [s * 0.26, 0.3, 0.03], [s * 0.31, 0.08, 0.08], [s * 0.33, -0.03, 0.12]], 0.045), [0, 0, 0]);
  }

  // the wires, shown during the movement demo
  const wires: Mesh[] = [];
  for (let i = 0; i < 2; i++) {
    const w = new Mesh(gl, { geometry: cyl(0.009, 1, 6), program: makeProgram(gl, { color: [0.85, 0.85, 0.85], metal: 1, rough: 0.2 }) });
    w.visible = false;
    w.setParent(root);
    wires.push(w);
  }

  return { root, parts, all, ghost, ghostMeshes, turbine, anchorHeads, wires, blades };
}
