// Shared scene kit for The Red Rising Archive renders.
// Palette matches the site tokens: void #07070a, red #c41e2a, mars #b5452a,
// gold #c8a96a, rim (cool white) #eef0f2.
import { THREE, seededRandom } from './pipeline.mjs';

export const C = {
  void: 0x07070a, void2: 0x0d0d11, red: 0xc41e2a, redDeep: 0x7a0f17,
  mars: 0xb5452a, gold: 0xc8a96a, goldDim: 0x8c7446, rim: 0xeef0f2, bone: 0xe9e4da,
};

// ---------- noise (value noise fbm, deterministic) ----------
function hash3(x, y, z, s = 1) {
  return seededRandom(x * 127.1 + y * 311.7 + z * 74.7 + s * 17.3);
}
function vnoise(x, y, z, s) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const l = (a, b, t) => a + (b - a) * t;
  const c = (dx, dy, dz) => hash3(xi + dx, yi + dy, zi + dz, s);
  return l(
    l(l(c(0, 0, 0), c(1, 0, 0), u), l(c(0, 1, 0), c(1, 1, 0), u), v),
    l(l(c(0, 0, 1), c(1, 0, 1), u), l(c(0, 1, 1), c(1, 1, 1), u), v),
    w,
  );
}
export function fbm(x, y, z, oct = 5, s = 1) {
  let a = 0.5, f = 1, t = 0;
  for (let i = 0; i < oct; i++) { t += a * vnoise(x * f, y * f, z * f, s); f *= 2.03; a *= 0.5; }
  return t;
}

// Equirectangular planet texture from a colour function of (noise, lat, lon).
export function planetTexture(fn, { w = 1024, h = 512, scale = 3, seed = 1, oct = 6 } = {}) {
  const data = new Uint8Array(w * h * 4);
  for (let j = 0; j < h; j++) {
    const lat = (j / (h - 1) - 0.5) * Math.PI;
    for (let i = 0; i < w; i++) {
      const lon = (i / w) * Math.PI * 2;
      const x = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat), z = Math.cos(lat) * Math.sin(lon);
      const n = fbm(x * scale + 10, y * scale + 10, z * scale + 10, oct, seed);
      const [r, g, b] = fn(n, lat, lon, x, y, z);
      const k = (j * w + i) * 4;
      data[k] = r; data[k + 1] = g; data[k + 2] = b; data[k + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}
export const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * Math.max(0, Math.min(1, t))));
export const ss = (e0, e1, x) => { const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };

// ---------- stage pieces ----------
export function darkStage(scene, { bg = C.void, fog = 0.03 } = {}) {
  scene.background = new THREE.Color(bg);
  if (fog) scene.fog = new THREE.FogExp2(bg, fog);
}

// Gradient backdrop sphere with an optional coloured halo behind the hero.
export function backdrop(scene, { top = 0x0d0d11, bottom = 0x050506, halo = null, haloPos = [0, 1.2, -6], haloSize = 7, haloOpacity = 0.35 } = {}) {
  const geo = new THREE.SphereGeometry(60, 32, 16);
  const cols = [];
  const pos = geo.attributes.position;
  const ct = new THREE.Color(top), cb = new THREE.Color(bottom);
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getY(i) / 60 + 1) / 2;
    const c = cb.clone().lerp(ct, Math.pow(t, 1.4));
    cols.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  scene.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false })));
  if (halo !== null) scene.add(glowDisc(halo, haloSize, haloOpacity, haloPos));
}

// Additive radial glow sprite (plane with a radial falloff texture).
let _glowTex;
function glowTexture() {
  if (_glowTex) return _glowTex;
  const n = 256, d = new Uint8Array(n * n * 4);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const dx = i / (n - 1) - 0.5, dy = j / (n - 1) - 0.5;
    const r = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 2);
    const a = Math.pow(1 - r, 2.6);
    const k = (j * n + i) * 4; d[k] = d[k + 1] = d[k + 2] = 255; d[k + 3] = Math.round(a * 255);
  }
  _glowTex = new THREE.DataTexture(d, n, n, THREE.RGBAFormat); _glowTex.needsUpdate = true;
  return _glowTex;
}
export function glowDisc(color, size, opacity, [x, y, z]) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({ map: glowTexture(), color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }),
  );
  m.position.set(x, y, z);
  return m;
}

// Archive lighting: warm key, red kicker, cool rim. Values tuned for ACES 1.1-1.3.
export function archiveLights(scene, { key = 0xffe3c8, keyI = 2.2, red = C.red, redI = 2.4, rim = 0xdfe8ff, rimI = 1.6, amb = 0.12 } = {}) {
  scene.add(new THREE.AmbientLight(0xffffff, amb));
  scene.add(new THREE.HemisphereLight(0xfff2e0, 0x140e0c, 0.45));
  const k = new THREE.DirectionalLight(key, keyI); k.position.set(4, 7, 5); k.castShadow = true;
  k.shadow.mapSize.set(2048, 2048); k.shadow.radius = 6;
  Object.assign(k.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 0.5, far: 30 });
  scene.add(k);
  const r = new THREE.DirectionalLight(red, redI); r.position.set(-6, 2.5, -4); scene.add(r);
  const c = new THREE.DirectionalLight(rim, rimI); c.position.set(6, 3.5, -6); scene.add(c);
  return { key: k, red: r, rim: c };
}

// Dark plinth floor with a soft contact shadow receiver.
export function plinth(scene, { y = 0, radius = 3, color = 0x121216, rough = 0.55, metal = 0.35 } = {}) {
  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius * 1.02, 0.35, 96),
    new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal }),
  );
  top.position.y = y - 0.175; top.receiveShadow = true; scene.add(top);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(40, 64), new THREE.MeshStandardMaterial({ color: 0x030304, roughness: 1 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = y - 0.35; floor.receiveShadow = true; scene.add(floor);
  return top;
}

export function stars(scene, { count = 1400, radius = 45, seed = 3, size = 0.09, opacity = 0.85 } = {}) {
  const pos = [];
  for (let i = 0; i < count; i++) {
    const u = seededRandom(seed + i * 1.1), v = seededRandom(seed + i * 2.3);
    const th = u * Math.PI * 2, ph = Math.acos(2 * v - 1);
    pos.push(radius * Math.sin(ph) * Math.cos(th), radius * Math.cos(ph), radius * Math.sin(ph) * Math.sin(th));
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size, sizeAttenuation: true, transparent: true, opacity, fog: false })));
}

// Atmosphere: front-side fresnel limb glow, weighted toward the lit side,
// plus a faint outer halo. No hard ring.
export function atmosphere(radius, color, strength = 1.0, lightDir = [-1, 0.3, 0.4]) {
  const g = new THREE.Group();
  const ld = new THREE.Vector3(...lightDir).normalize();
  const mk = (r, side, powK, s) => new THREE.Mesh(new THREE.SphereGeometry(radius * r, 128, 96), new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uS: { value: s }, uL: { value: ld }, uP: { value: powK } },
    vertexShader: `varying vec3 vN; varying vec3 vW; varying vec3 vV; void main(){ vec4 wp = modelMatrix*vec4(position,1.0); vW = normalize(mat3(modelMatrix)*normal); vec4 mv = viewMatrix*wp; vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uS; uniform vec3 uL; uniform float uP; varying vec3 vN; varying vec3 vW; varying vec3 vV; void main(){ float d = abs(dot(vN, vV)); float f = uP > 4.0 ? pow(smoothstep(0.0, 0.36, d), 2.0) * (1.0 - smoothstep(0.34, 0.42, d)) : pow(1.0 - d, uP); float lit = smoothstep(-0.35, 0.6, dot(vW, uL)); float a = f * lit * uS; gl_FragColor = vec4(uColor * a, a); }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side,
  }));
  g.add(mk(1.012, THREE.FrontSide, 3.2, strength));
  g.add(mk(1.07, THREE.BackSide, 5.0, strength * 0.9));
  return g;
}

// No env reflections in this container (PMREM needs half-float textures that
// the source-built headless-gl lacks), so metals are satin: partly diffuse,
// lit directly. Fully metallic materials would render black.
export const metal = (color, rough = 0.3) => new THREE.MeshStandardMaterial({ color, metalness: 0.55, roughness: Math.max(rough, 0.22) });
export const matte = (color, rough = 0.8, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, ...extra });
export const glow = (color, i = 2.5) => new THREE.MeshStandardMaterial({ color: 0x000000, emissive: color, emissiveIntensity: i });

export function lathe(profile, seg = 96) {
  // LatheGeometry's normals face outward only when the profile runs bottom-up.
  if (profile[0][1] > profile[profile.length - 1][1]) profile = [...profile].reverse();
  return new THREE.LatheGeometry(profile.map(([x, y]) => new THREE.Vector2(x, y)), seg);
}
export function shapeFrom(points) {
  const s = new THREE.Shape();
  points.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  s.closePath();
  return s;
}
export function cam(aspectW, aspectH, pos, look = [0, 0, 0], fov = 32) {
  const c = new THREE.PerspectiveCamera(fov, aspectW / aspectH, 0.1, 200);
  c.position.set(...pos); c.lookAt(...look);
  return c;
}
