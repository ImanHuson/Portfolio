// Realism kit for the archive's level-2 renders: procedural PBR surfaces
// (albedo, roughness and normal maps generated in JS as DataTextures),
// a tabletop that falls away into the dark, soft-shadowed studio light,
// and a capture that also writes a linear depth pass, so post.py can add
// depth of field, bloom, grade and grain. No textures from anywhere else.
import fs from 'fs';
import { PNG } from 'pngjs';
import { THREE, seededRandom } from './pipeline.mjs';
import { STUDIO_GLSL } from './kit.mjs';

// ---------- fast tiling value noise (256 lattice) ----------
const L = 256;
const LAT = new Float32Array(L * L);
for (let i = 0; i < L * L; i++) LAT[i] = seededRandom(i * 1.731 + 0.37);
// Periodic: the lattice wraps every px, py cells (integers), so a texture
// built from u, v in [0, 1) at integer frequencies tiles without seams.
function n2(x, y, px = 256, py = 256) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const m = (a, p) => ((a % p) + p) % p & 255;
  const x0 = m(xi, px), y0 = m(yi, py), x1 = m(xi + 1, px), y1 = m(yi + 1, py);
  const a = LAT[y0 * L + x0], b = LAT[y0 * L + x1], c = LAT[y1 * L + x0], d = LAT[y1 * L + x1];
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
// fbm over u, v in [0, 1) at integer base frequencies fx, fy: seamless.
export function fbm2(u, v, fx, fy = fx, oct = 5) {
  let a = 0.5, f = 1, t = 0, n = 0;
  for (let i = 0; i < oct; i++) {
    const px = Math.max(1, Math.round(fx * f)), py = Math.max(1, Math.round(fy * f));
    t += a * n2(u * px + i * 17, v * py + i * 9, px, py); n += a; f *= 2; a *= 0.5;
  }
  return t / n;
}
export const ridge = (u, v, fx, fy = fx, oct = 5) => 1 - Math.abs(fbm2(u, v, fx, fy, oct) * 2 - 1);
const g1 = (u, v, f) => n2(u * f, v * f, f, f);
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };
export const lerp = (a, b, t) => a + (b - a) * t;
export const mixc = (a, b, t) => a.map((v, i) => v + (b[i] - v) * clamp(t));

// ---------- surfaces ----------
// fn(u, v) -> { c: [r,g,b] 0-255 sRGB, r: roughness 0-1, h: height 0-1 }
function dataTex(data, size, srgb, repeat) {
  const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}
export function surface(fn, { size = 1024, repeat = [1, 1], bump = 2.0 } = {}) {
  const alb = new Uint8Array(size * size * 4), rgh = new Uint8Array(size * size * 4), nrm = new Uint8Array(size * size * 4);
  const H = new Float32Array(size * size);
  for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) {
    const s = fn(i / size, j / size);
    const k = j * size + i;
    alb[k * 4] = s.c[0]; alb[k * 4 + 1] = s.c[1]; alb[k * 4 + 2] = s.c[2]; alb[k * 4 + 3] = 255;
    const r = Math.round(clamp(s.r) * 255); rgh[k * 4] = r; rgh[k * 4 + 1] = r; rgh[k * 4 + 2] = r; rgh[k * 4 + 3] = 255;
    H[k] = s.h ?? 0.5;
  }
  for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) {
    const at = (x, y) => H[((y + size) % size) * size + ((x + size) % size)];
    const dx = (at(i + 1, j) - at(i - 1, j)) * bump * size / 1024, dy = (at(i, j + 1) - at(i, j - 1)) * bump * size / 1024;
    const len = Math.hypot(dx, dy, 1), k = (j * size + i) * 4;
    nrm[k] = Math.round((-dx / len * 0.5 + 0.5) * 255); nrm[k + 1] = Math.round((-dy / len * 0.5 + 0.5) * 255); nrm[k + 2] = Math.round((1 / len * 0.5 + 0.5) * 255); nrm[k + 3] = 255;
  }
  return { map: dataTex(alb, size, true, repeat), roughnessMap: dataTex(rgh, size, false, repeat), normalMap: dataTex(nrm, size, false, repeat) };
}

// A dielectric material from a surface.
// `specular` < 1 dims the glancing sheen (MeshPhysicalMaterial).
export function pbr(surf, { normal = 1, specular = 1, ...extra } = {}) {
  const Mat = specular !== 1 ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial;
  const m = new Mat({ ...surf, roughness: 1, metalness: 0, normalScale: new THREE.Vector2(normal, normal), ...extra });
  if (specular !== 1) m.specularIntensity = specular;
  return m;
}
// A metal from a surface, reflecting the analytic studio (see kit.metal):
// here the reflection blur follows the roughness map, so wear reads.
export function metalS(surf, { tint = 0xffffff, normal = 1, envI = 1.4, ...extra } = {}) {
  const m = new THREE.MeshStandardMaterial({ ...surf, color: tint, roughness: 1, metalness: 1, normalScale: new THREE.Vector2(normal, normal), ...extra });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uEnvI = { value: envI };
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + STUDIO_GLSL)
      .replace('#include <output_fragment>', `
        vec3 rraV = normalize(vViewPosition);
        vec3 rraR = inverseTransformDirection(reflect(-rraV, normal), viewMatrix);
        float rraNV = clamp(dot(normal, rraV), 0.0, 1.0);
        vec3 rraF = diffuseColor.rgb + (1.0 - diffuseColor.rgb) * pow(1.0 - rraNV, 5.0);
        outgoingLight += rraStudio(rraR, clamp(roughnessFactor, 0.08, 1.0)) * rraF * uEnvI;
        #include <output_fragment>`);
  };
  m.customProgramCacheKey = () => 'rra-metal-s';
  return m;
}

// ---------- surface recipes ----------
// All frequencies are integers so every surface tiles cleanly. `seed`
// shifts the pattern by whole lattice cells.
const nc = (u, v, f, o = 4, seed = 0) => fbm2(u + seed / f, v, f, f, o);
export const S = {
  // Oiled walnut, grain running along u.
  walnut: ({ tone = [58, 36, 24], dark = [22, 13, 9], seed = 0, rough = 0.62 } = {}) => (u, v) => {
    const w = nc(u, v, 2, 4, seed) * 1.6;
    const grain = fbm2(u + seed / 2, v + w * 0.02, 2, 140, 5);
    const ring = Math.pow(0.5 + 0.5 * Math.sin((v * 34 + w * 2.2 + grain * 0.9) * Math.PI * 2 / 2), 3);
    const pores = smooth(0.78, 0.9, n2(u * 512 + seed, v * 48, 512, 48));
    const t = clamp(ring * 0.5 + grain * 0.6 - pores * 0.08);
    return { c: mixc(dark, tone, t), r: rough + (1 - t) * 0.15 + pores * 0.1, h: t * 0.5 + grain * 0.3 - pores * 0.05 };
  },
  // Slate / basalt slab with fine grit and faint veins.
  slate: ({ base = [28, 28, 32], light = [58, 56, 60], seed = 0 } = {}) => (u, v) => {
    const n = nc(u, v, 6, 5, seed), g = g1(u, v, 512), vein = smooth(0.94, 1, ridge(u + seed / 3, v, 3, 3, 5));
    const t = clamp(n * 0.8 + g * 0.2);
    return { c: mixc(mixc(base, light, t * 0.7), [120, 116, 110], vein * 0.35), r: 0.6 + g * 0.3 - vein * 0.15, h: n * 0.7 + g * 0.04 };
  },
  // Brushed metal with handling scratches and grime in the low spots.
  brushed: ({ c = [200, 200, 205], grime = 0.25, seed = 0, rough = 0.28 } = {}) => (u, v) => {
    const streak = fbm2(u, v, 2, 400, 3);
    const blot = nc(u, v, 5, 5, seed);
    let sc = 0;
    for (let i = 0; i < 26; i++) {
      const a = seededRandom(i * 3 + seed) * Math.PI, cx = seededRandom(i * 7 + seed), cy = seededRandom(i * 11 + seed);
      const d = Math.abs((u - cx) * Math.sin(a) - (v - cy) * Math.cos(a)), along = Math.abs((u - cx) * Math.cos(a) + (v - cy) * Math.sin(a));
      if (d < 0.0012 && along < 0.08 + seededRandom(i) * 0.15) sc = 1;
    }
    const dirt = smooth(0.55, 0.8, blot) * grime;
    return { c: mixc(c.map((x) => x * (0.9 + streak * 0.12)), [60, 52, 44], dirt), r: rough + streak * 0.12 + dirt * 0.4 - sc * 0.1, h: 0.5 + streak * 0.08 - sc * 0.3 };
  },
  // Gold: polished, with soft wear and darkened recesses.
  gold: ({ seed = 0, rough = 0.2 } = {}) => (u, v) => {
    const n = nc(u, v, 8, 5, seed), f = g1(u, v, 512);
    return { c: mixc([255, 196, 110], [180, 128, 60], smooth(0.45, 0.75, n) * 0.6), r: rough + n * 0.18 + f * 0.05, h: n * 0.4 + f * 0.02 };
  },
  // Pitted iron with rust.
  iron: ({ seed = 0, rust = 0.5 } = {}) => (u, v) => {
    const n = nc(u, v, 7, 5, seed), p = g1(u, v, 256), r = smooth(0.5, 0.75, nc(u, v, 4, 5, seed + 5)) * rust;
    return { c: mixc([74, 70, 66].map((x) => x * (0.8 + n * 0.4)), [110, 50, 26], r), r: 0.5 + r * 0.4 + p * 0.1, h: n * 0.5 - smooth(0.8, 0.9, p) * 0.12 + r * 0.2 };
  },
  // Leather: pebbled grain, worn lighter on the high points.
  leather: ({ c = [70, 30, 20], seed = 0 } = {}) => (u, v) => {
    const cell = ridge(u + seed / 60, v, 60, 60, 3), n = nc(u, v, 5, 4, seed);
    return { c: mixc(c.map((x) => x * 0.6), c.map((x) => Math.min(255, x * 1.4)), cell * 0.6 + n * 0.3), r: 0.55 + (1 - cell) * 0.3, h: cell };
  },
  // Woven cloth.
  cloth: ({ c = [90, 26, 30], seed = 0, weave = 280 } = {}) => (u, v) => {
    const a = u * weave, b = v * weave;
    const wx = 0.5 + 0.5 * Math.sin(a * Math.PI * 2), wy = 0.5 + 0.5 * Math.sin(b * Math.PI * 2);
    const over = (Math.floor(a * 2) + Math.floor(b * 2)) % 2 ? wx : wy;
    const n = nc(u, v, 6, 4, seed);
    return { c: c.map((x) => x * (0.7 + over * 0.35 + n * 0.2)), r: 0.85, h: over * 0.7 + n * 0.3 };
  },
  // Old paper.
  paper: ({ seed = 0 } = {}) => (u, v) => {
    const n = nc(u, v, 6, 5, seed), f = g1(u, v, 512);
    return { c: mixc([214, 200, 172], [160, 132, 96], smooth(0.5, 0.9, n) * 0.7), r: 0.9, h: f * 0.05 + n * 0.3 };
  },
  // Bone / ivory / fang.
  bone: ({ seed = 0 } = {}) => (u, v) => {
    const n = nc(u, v, 5, 5, seed), s = fbm2(u, v, 4, 80, 4);
    return { c: mixc([226, 214, 190], [150, 128, 96], smooth(0.4, 0.8, n) * 0.6 + s * 0.15), r: 0.4 + n * 0.3, h: s * 0.5 + n * 0.3 };
  },
  // Rough stone (granite).
  stone: ({ c = [96, 88, 82], seed = 0 } = {}) => (u, v) => {
    const n = nc(u, v, 9, 6, seed), g = g1(u, v, 512);
    return { c: c.map((x) => x * (0.65 + n * 0.55 + g * 0.1)), r: 0.8 + g * 0.15, h: n * 0.6 + g * 0.04 };
  },
  // Red Martian dust / regolith.
  dust: ({ c = [120, 48, 26], seed = 0 } = {}) => (u, v) => {
    const n = nc(u, v, 12, 6, seed), g = g1(u, v, 512), rip = 0.5 + 0.5 * Math.sin((u * 40 + n * 6) * Math.PI);
    return { c: c.map((x) => x * (0.6 + n * 0.6 + g * 0.15)), r: 0.95, h: n * 0.5 + rip * 0.15 + g * 0.05 };
  },
  // Snow.
  snow: ({ seed = 0 } = {}) => (u, v) => {
    const n = nc(u, v, 5, 6, seed), g = g1(u, v, 512);
    return { c: [228, 232, 238].map((x) => x * (0.85 + n * 0.15)), r: 0.6 - g * 0.3, h: n * 0.8 + g * 0.03 };
  },
};

// ---------- the set ----------
// A tabletop that runs back into the dark, a warm key with soft shadow,
// a cool rim and a low red kicker from behind. Returns lights for tweaks.
export function studio(scene, { floor = S.walnut(), repeat = [3, 3], floorSize = 18, keyPos = [-3.2, 5.5, 3.2], keyI = 30, keyColor = 0xffe2c4, rimI = 2.2, redI = 1.6, fog = 0.11, amb = 0.06, hemi = 0.25, floorSpec = 0.35, bg = 0x07070a } = {}) {
  scene.background = new THREE.Color(bg);
  scene.fog = new THREE.FogExp2(bg, fog);
  const surf = surface(floor, { repeat, bump: 1.4 });
  const top = new THREE.Mesh(new THREE.PlaneGeometry(floorSize, floorSize), pbr(surf, { normal: 0.8, specular: floorSpec }));
  top.rotation.x = -Math.PI / 2; top.receiveShadow = true; scene.add(top);
  scene.add(new THREE.AmbientLight(0xffffff, amb));
  scene.add(new THREE.HemisphereLight(0xffeedd, 0x0a0806, hemi));
  const key = new THREE.SpotLight(keyColor, keyI, 30, 0.5, 0.85, 2);
  key.position.set(...keyPos); key.target.position.set(0, 0.4, 0);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 5; key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
  key.shadow.camera.near = 1; key.shadow.camera.far = 20;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0xdfe8ff, rimI); rim.position.set(4, 3.5, -5); scene.add(rim);
  const red = new THREE.DirectionalLight(0xc41e2a, redI); red.position.set(-5, 1.5, -4); scene.add(red);
  return { key, rim, red, top };
}

// Bevelled box (ExtrudeGeometry with bevel), centred.
export function bevelBox(w, h, d, bevel = 0.02, seg = 3) {
  const s = new THREE.Shape();
  const x = w / 2 - bevel, y = h / 2 - bevel;
  s.moveTo(-x, -y); s.lineTo(x, -y); s.lineTo(x, y); s.lineTo(-x, y); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: d - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: seg, curveSegments: 4 });
  g.translate(0, 0, -(d - bevel * 2) / 2);
  return g;
}

// ---------- capture: colour + linear depth ----------
function read(gl, W, H) {
  const px = new Uint8Array(W * H * 4);
  gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, px);
  return px;
}
export async function captureWithDepth({ renderer, glContext, scene, camera, W, H, outBase, meta = {} }) {
  renderer.shadowMap.type = THREE.PCFShadowMap; // radius-softened shadows
  renderer.render(scene, camera);
  const col = read(glContext, W, H);
  const png = new PNG({ width: W, height: H });
  for (let y = 0; y < H; y++) png.data.set(col.subarray((H - 1 - y) * W * 4, (H - y) * W * 4), y * W * 4);
  for (let i = 3; i < png.data.length; i += 4) png.data[i] = 255;
  fs.writeFileSync(`${outBase}.color.png`, PNG.sync.write(png));

  // Depth: only opaque surfaces; glows, sprites and particles don't focus.
  const hidden = [];
  scene.traverse((o) => { if ((o.isMesh || o.isPoints || o.isSprite) && (o.material?.transparent || o.isPoints || o.isSprite)) { if (o.visible) { o.visible = false; hidden.push(o); } } });
  const bg = scene.background, fog = scene.fog;
  scene.background = new THREE.Color(0xffffff); scene.fog = null;
  scene.overrideMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
  const tm = renderer.toneMapping; renderer.toneMapping = THREE.NoToneMapping;
  const cs = renderer.outputColorSpace; renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.render(scene, camera);
  const dp = read(glContext, W, H);
  scene.overrideMaterial = null; scene.background = bg; scene.fog = fog; renderer.toneMapping = tm; renderer.outputColorSpace = cs;
  hidden.forEach((o) => (o.visible = true));
  const n = camera.near, f = camera.far, z = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const k = ((H - 1 - y) * W + x) * 4;
    // RGBADepthPacking: each byte is component * 256/255 of a base-256 digit.
    const d = dp[k] / 256 / 16777216 + dp[k + 1] / 256 / 65536 + dp[k + 2] / 256 / 256 + dp[k + 3] / 256;
    z[y * W + x] = d >= 0.9999 ? f : (n * f) / (f - d * (f - n));
  }
  fs.writeFileSync(`${outBase}.depth.f32`, Buffer.from(z.buffer));
  fs.writeFileSync(`${outBase}.meta.json`, JSON.stringify({ W, H, near: n, far: f, ...meta }));
}
