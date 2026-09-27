// Scene registry. Usage (from the level-2 skill's workdir, after its
// scripts/setup.sh, with kit.mjs and this file copied in):
//   xvfb-run -a node scenes.mjs <name> [outDir]
import { THREE, createRenderer, captureFrame, addStudioEnvironment, seededRandom } from './pipeline.mjs';
import {
  C, fbm, planetTexture, mix, ss, darkStage, backdrop, glowDisc, archiveLights, plinth, stars,
  atmosphere, metal, matte, glow, lathe, shapeFrom, cam,
} from './kit.mjs';

const OUT = process.argv[3] || './renders';
const S = {};

// ============================== PLACES ==============================
function planetScene({ tex, radius = 1.6, atmo = null, atmoS = 1.0, light = [-5, 1.2, 2.2], lightI = 3.4, extras, camPos = [0, 0.15, 8.2], look = [0, 0, 0], exposure = 1.05, rough = 0.95, starSeed = 3, rot = -0.6 }) {
  return (R) => {
    const scene = new THREE.Scene();
    darkStage(scene, { fog: 0 });
    stars(scene, { seed: starSeed, size: 0.07, opacity: 0.7 });
    const p = new THREE.Mesh(new THREE.SphereGeometry(radius, 160, 120), new THREE.MeshStandardMaterial({ map: tex, roughness: rough, metalness: 0 }));
    p.rotation.y = rot; p.rotation.z = 0.12;
    scene.add(p);
    if (atmo) scene.add(atmosphere(radius, atmo, atmoS, light));
    scene.add(new THREE.AmbientLight(0xffffff, 0.02));
    const sun = new THREE.DirectionalLight(0xfff1e0, lightI); sun.position.set(...light); scene.add(sun);
    if (extras) extras(scene, p);
    return { scene, camera: cam(R.W, R.H, camPos, look, 32), exposure };
  };
}

S['place-mars'] = planetScene({
  tex: planetTexture((n, lat) => {
    const base = mix([112, 44, 24], [176, 88, 48], ss(0.32, 0.72, n));
    const dark = mix(base, [58, 24, 16], 0.85 * ss(0.5, 0.64, fbm(lat * 3, n * 4, 1, 3, 9)));
    const cap = ss(1.25, 1.42, Math.abs(lat));
    return mix(dark, [236, 228, 220], cap);
  }, { scale: 3.4, seed: 2, oct: 7 }),
  atmo: 0xd0704a, atmoS: 0.45,
});
S['place-luna'] = planetScene({
  tex: planetTexture((n, lat, lon, x, y, z) => {
    let c = mix([88, 88, 92], [182, 180, 176], ss(0.3, 0.72, n));
    const mare = ss(0.55, 0.6, fbm(x * 1.4 + 3, y * 1.4, z * 1.4, 3, 5));
    c = mix(c, [58, 58, 62], mare * 0.8);
    // city lights on the night side read as the Society's seat of power
    return c;
  }, { scale: 4, seed: 4 }),
  extras: (scene, p) => {
    // a scatter of lit cities: tiny emissive points on the dark limb
    const pos = [];
    for (let i = 0; i < 420; i++) {
      const u = seededRandom(i * 3.1), v = seededRandom(i * 7.7);
      const th = u * Math.PI * 2, ph = Math.acos(2 * v - 1);
      const x = Math.sin(ph) * Math.cos(th), y = Math.cos(ph), z = Math.sin(ph) * Math.sin(th);
      if (x > -0.1) continue; // only on the side away from the sun
      pos.push(x * 1.603, y * 1.603, z * 1.603);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xe8c890, size: 0.022, transparent: true, opacity: 0.9 }));
    pts.rotation.copy(p.rotation); scene.add(pts);
  },
  light: [-5, 1.0, 0.6], lightI: 3.0, starSeed: 11,
});
S['place-earth'] = planetScene({
  tex: planetTexture((n, lat) => {
    const land = ss(0.52, 0.545, n);
    let c = mix([6, 18, 38], [14, 36, 62], ss(0.2, 0.5, n));
    c = mix(c, mix([44, 54, 34], [112, 96, 70], ss(0.56, 0.78, n)), land);
    const ice = ss(1.18, 1.34, Math.abs(lat));
    return mix(c, [230, 236, 240], ice);
  }, { scale: 2.6, seed: 7, oct: 7 }),
  atmo: 0x6fa6ff, atmoS: 0.9,
  extras: (scene, p) => {
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.625, 128, 96), new THREE.MeshStandardMaterial({
      alphaMap: planetTexture((n) => { const a = Math.round(255 * ss(0.52, 0.72, n)); return [a, a, a]; }, { scale: 4.5, seed: 21 }),
      color: 0xffffff, transparent: true, depthWrite: false, roughness: 1,
    }));
    clouds.rotation.copy(p.rotation); scene.add(clouds);
  },
  starSeed: 17,
});
S['place-mercury'] = planetScene({
  tex: planetTexture((n) => mix([70, 62, 58], [168, 150, 136], ss(0.28, 0.75, n)), { scale: 5, seed: 12 }),
  light: [-5, 0.6, 1.5], lightI: 5.0, exposure: 1.1,
  extras: (scene) => {
    // the sun, enormous and close
    scene.add(glowDisc(0xffb070, 16, 0.55, [-7, 1.2, -9]));
    scene.add(glowDisc(0xfff0d0, 5, 0.9, [-7, 1.2, -9]));
  },
  starSeed: 23,
});
S['place-venus'] = planetScene({
  tex: planetTexture((n, lat, lon) => {
    const band = 0.5 + 0.5 * Math.sin(lat * 7 + n * 5);
    return mix([176, 128, 64], [232, 204, 150], band * 0.7 + n * 0.3);
  }, { scale: 2.2, seed: 31, oct: 4 }),
  atmo: 0xf2c67a, atmoS: 0.7, starSeed: 29, exposure: 0.95,
});
S['place-io'] = (R) => {
  const scene = new THREE.Scene();
  darkStage(scene, { fog: 0 });
  stars(scene, { seed: 41 });
  // Jupiter behind, huge and banded
  const jt = planetTexture((n, lat) => {
    const b = Math.sin(lat * 18 + n * 3.5);
    return mix([96, 74, 58], [168, 150, 128], 0.5 + 0.5 * b);
  }, { scale: 2, seed: 43, oct: 4 });
  const jup = new THREE.Mesh(new THREE.SphereGeometry(6, 128, 96), new THREE.MeshStandardMaterial({ map: jt, roughness: 1 }));
  jup.position.set(5.5, 3.2, -16); jup.rotation.z = 0.05; scene.add(jup);
  const io = new THREE.Mesh(new THREE.SphereGeometry(1.25, 128, 96), new THREE.MeshStandardMaterial({
    map: planetTexture((n) => {
      let c = mix([150, 128, 52], [206, 186, 112], ss(0.3, 0.7, n));
      c = mix(c, [128, 74, 38], 0.7 * ss(0.64, 0.68, n));
      return mix(c, [52, 38, 28], 0.8 * ss(0.71, 0.73, n));
    }, { scale: 5, seed: 47 }), roughness: 1,
  }));
  io.position.set(-0.6, -0.4, 0); scene.add(io);
  scene.add(new THREE.AmbientLight(0xffffff, 0.03));
  const sun = new THREE.DirectionalLight(0xfff1e0, 3.4); sun.position.set(-5, 1.5, 1.2); scene.add(sun);
  return { scene, camera: cam(R.W, R.H, [0, 0, 6.5], [0.3, 0.3, 0], 34), exposure: 1.0 };
};

// ============================== RELICS (people) ==============================
// Every relic sits on the same dark plinth under the same archive lighting,
// so the ten read as one set of museum objects.
function relic(build, { camPos = [0, 1.9, 6.4], look = [0, 0.75, 0], halo = C.red, haloOpacity = 0.28, lights = {}, exposure = 1.18, fov = 30, plinthColor = 0x111114 } = {}) {
  return (R) => {
    const scene = new THREE.Scene();
    darkStage(scene, { fog: 0.075 });
    backdrop(scene, { halo, haloPos: [0, 1.4, -5], haloSize: 8, haloOpacity });
    archiveLights(scene, lights);
    plinth(scene, { color: plinthColor });
    const g = new THREE.Group(); scene.add(g);
    build(g, scene);
    g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    return { scene, camera: cam(R.W, R.H, camPos, look, fov), exposure };
  };
}

// Darrow: a clawDrill tooth, worn smooth.
S['relic-darrow'] = relic((g) => {
  const tooth = new THREE.Mesh(lathe([[0, 2.2], [0.08, 2.05], [0.22, 1.7], [0.38, 1.2], [0.5, 0.7], [0.56, 0.3], [0.58, 0.05], [0, 0]]), metal(0x77706a, 0.5));
  tooth.rotation.z = -0.32; tooth.position.set(0.2, 0.25, 0); g.add(tooth);
  // worn bands near the base
  for (let i = 0; i < 3; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.58 - i * 0.04, 0.025, 12, 96), metal(0x5a4a3a, 0.6)); r.rotation.x = Math.PI / 2; r.position.y = 0.12 + i * 0.12; tooth.add(r); }
  // red Martian dust on the plinth
  const dust = new THREE.Mesh(new THREE.CircleGeometry(2.2, 96), new THREE.MeshStandardMaterial({ map: planetTexture((n) => { const t = ss(0.45, 0.62, n); return mix([16, 8, 7], [74, 30, 18], t); }, { w: 512, h: 512, scale: 14, seed: 5 }), roughness: 1 }));
  dust.rotation.x = -Math.PI / 2; dust.position.y = 0.005; g.add(dust);
});

// Virginia: a chessboard with pieces removed.
function chessPiece(kind, mat) {
  const prof = kind === 'king'
    ? [[0, 1.05], [0.07, 1.05], [0.07, 0.95], [0.16, 0.9], [0.12, 0.72], [0.09, 0.45], [0.16, 0.3], [0.2, 0.12], [0.24, 0.04], [0.24, 0], [0, 0]]
    : kind === 'queen'
      ? [[0, 0.95], [0.1, 0.92], [0.16, 0.82], [0.1, 0.7], [0.08, 0.42], [0.15, 0.28], [0.2, 0.1], [0.23, 0.03], [0.23, 0], [0, 0]]
      : [[0, 0.55], [0.1, 0.52], [0.12, 0.44], [0.07, 0.36], [0.07, 0.22], [0.15, 0.1], [0.18, 0.03], [0.18, 0], [0, 0]];
  return new THREE.Mesh(lathe(prof, 48), mat);
}
function chessBoard(g, { missing = [] } = {}) {
  const board = new THREE.Group();
  const light = matte(0xcfc6b4, 0.35, { metalness: 0.1 }), dark = matte(0x1a1a1e, 0.3, { metalness: 0.2 });
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 0.4), (i + j) % 2 ? dark : light);
    t.position.set((i - 3.5) * 0.4, 0.04, (j - 3.5) * 0.4); board.add(t);
  }
  const edge = new THREE.Mesh(new THREE.BoxGeometry(3.45, 0.1, 3.45), metal(C.goldDim, 0.35)); edge.position.y = 0.02; board.add(edge);
  g.add(board);
  return board;
}
S['relic-virginia'] = relic((g) => {
  chessBoard(g);
  const gold = metal(C.gold, 0.22), ink = metal(0x2a2a30, 0.35);
  const place = (k, m, i, j) => { const p = chessPiece(k, m); p.position.set((i - 3.5) * 0.4, 0.08, (j - 3.5) * 0.4); g.add(p); };
  place('king', gold, 4, 5); place('queen', gold, 3, 5); place('pawn', gold, 2, 4); place('pawn', gold, 5, 3);
  place('king', ink, 4, 1); place('pawn', ink, 3, 2); place('pawn', ink, 6, 2);
}, { camPos: [2.6, 3.6, 5.2], look: [0, 0.2, 0], halo: C.gold, haloOpacity: 0.22 });

// Cassius: a broken razor laid beside an untouched glass of wine.
S['relic-cassius'] = relic((g) => {
  const blade = new THREE.MeshStandardMaterial({ color: 0x8e949c, metalness: 0.6, roughness: 0.25 });
  const b1 = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.03, 0.14), blade); b1.position.set(-0.55, 0.12, 0.55); b1.rotation.set(0, 0.25, 0.08); g.add(b1);
  const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.03, 0.14), blade); b2.position.set(0.75, 0.05, 0.95); b2.rotation.set(0.1, -0.5, 0); g.add(b2);
  const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.55, 24), metal(C.gold, 0.3)); hilt.rotation.z = Math.PI / 2; hilt.rotation.y = 0.25; hilt.position.set(-1.62, 0.2, 0.28); g.add(hilt);
  const glass = new THREE.Mesh(lathe([[0, 0], [0.32, 0], [0.34, 0.02], [0.05, 0.08], [0.04, 0.7], [0.3, 0.95], [0.34, 1.45], [0.33, 1.46], [0.29, 0.97], [0.0, 0.76]], 96),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.04, transparent: true, opacity: 0.28, envMapIntensity: 1.6, clearcoat: 1 }));
  glass.position.set(0.55, 0, -0.35); glass.material.depthWrite = false; glass.renderOrder = 2; g.add(glass);
  const wine = new THREE.Mesh(lathe([[0, 0.8], [0.26, 0.97], [0.3, 1.18], [0, 1.18]], 96), new THREE.MeshStandardMaterial({ color: 0x6a0a14, roughness: 0.15, emissive: 0x2a0205, emissiveIntensity: 1 }));
  wine.renderOrder = 1;
  wine.position.copy(glass.position); g.add(wine);
}, { camPos: [0.3, 1.35, 4.6], look: [0, 0.5, 0.2], halo: 0xeef0f2, haloOpacity: 0.12 });

// Sevro: a crown he doesn't want, knocked into the dirt beside a wolf pelt.
S['relic-sevro'] = relic((g) => {
  const pelt = new THREE.Mesh(new THREE.SphereGeometry(1.5, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2), matte(0x1d1a17, 1));
  pelt.scale.set(1, 0.18, 0.8); pelt.position.set(-0.3, 0, -0.2); g.add(pelt);
  const pos = pelt.geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) { const n = fbm(pos.getX(i) * 3, pos.getY(i) * 3, pos.getZ(i) * 3, 3, 5); pos.setY(i, pos.getY(i) * (0.6 + n)); }
  pelt.geometry.computeVertexNormals();
  const crown = new THREE.Group();
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.28, 96, 1, true), metal(C.gold, 0.28)); band.material.side = THREE.DoubleSide; crown.add(band);
  for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2; const sp = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.36, 12), metal(C.gold, 0.28)); sp.position.set(Math.cos(a) * 0.55, 0.3, Math.sin(a) * 0.55); crown.add(sp); }
  crown.rotation.z = 1.25; crown.rotation.y = 0.4; crown.position.set(0.9, 0.5, 0.5); g.add(crown);
}, { halo: C.red, haloOpacity: 0.3 });

// Pax: a hoverbike he had to build himself.
S['relic-pax'] = relic((g) => {
  const bike = new THREE.Group();
  const prof = shapeFrom([[-1.25, 0.05], [1.15, 0.0], [1.35, 0.18], [1.1, 0.42], [0.55, 0.5], [0.25, 0.72], [-0.3, 0.62], [-0.85, 0.66], [-1.3, 0.42]]);
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(prof, { depth: 0.46, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 4, curveSegments: 12 }), metal(0x5d6268, 0.45));
  body.position.z = -0.23; bike.add(body);
  // mismatched salvage panels: he built it from what he had
  [[0.35, 0.25, 0.3, 0.55, 0xa35a2a], [-0.7, 0.25, 0.3, 0.45, 0x4d5a3e], [0.2, 0.25, -0.3, 0.7, 0x8a7a5a]].forEach(([x, y, z, w, c]) => { const p = new THREE.Mesh(new THREE.BoxGeometry(w, 0.24, 0.02), matte(c, 0.6)); p.position.set(x, y, z); bike.add(p); });
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.1, 0.4), matte(0x2a1c14, 0.7)); seat.position.set(-0.45, 0.72, 0); bike.add(seat);
  const bars = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 12), metal(0x9aa0a6, 0.3)); bars.rotation.x = Math.PI / 2; bars.position.set(0.5, 0.8, 0); bike.add(bars);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35, 12), metal(0x9aa0a6, 0.3)); stem.position.set(0.45, 0.62, 0); stem.rotation.z = 0.35; bike.add(stem);
  [-0.85, 0.8].forEach((x) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.07, 16, 64), metal(0x3b3f45, 0.4)); ring.rotation.x = Math.PI / 2; ring.position.set(x, -0.08, 0); bike.add(ring);
    const core = new THREE.Mesh(new THREE.CircleGeometry(0.25, 48), glow(0x8fd0ff, 3.5)); core.rotation.x = Math.PI / 2; core.position.set(x, -0.12, 0); bike.add(core);
  });
  bike.position.y = 0.75; bike.rotation.y = -0.55; g.add(bike);
  const pool = glowDisc(0x8fd0ff, 3.2, 0.3, [0, 0.02, 0]); pool.rotation.x = -Math.PI / 2; g.add(pool);
}, { halo: 0x8fd0ff, haloOpacity: 0.1, lights: { red: 0x8fd0ff, redI: 1.0 }, camPos: [0, 1.8, 6.4], look: [0, 0.8, 0] });

// Diomedes: a storm cloak, alive with cloud and lightning.
S['relic-diomedes'] = relic((g, scene) => {
  const cloud = matte(0x30343c, 1);
  for (let i = 0; i < 220; i++) {
    const a = seededRandom(i * 1.7) * Math.PI * 2, r = Math.pow(seededRandom(i * 3.1), 0.6) * 1.5, h = 1.5 + (seededRandom(i * 5.3) - 0.5) * 0.9 * (1.4 - r / 1.5);
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16 + seededRandom(i * 7.1) * 0.26, 2), cloud);
    m.position.set(Math.cos(a) * r, h, Math.sin(a) * r * 0.55); g.add(m);
  }
  const bolt = (pts, w) => new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.0), 80, w, 6), glow(0xeaf2ff, 8));
  g.add(bolt([[0.15, 1.2, 0.7], [0.32, 0.95, 0.72], [0.1, 0.72, 0.75], [0.36, 0.45, 0.74], [0.18, 0.2, 0.72], [0.3, 0.0, 0.7]], 0.022));
  g.add(bolt([[0.32, 0.95, 0.72], [0.62, 0.8, 0.7], [0.7, 0.6, 0.68]], 0.012));
  g.add(bolt([[-0.7, 1.3, 0.6], [-0.85, 1.05, 0.62], [-0.62, 0.86, 0.64]], 0.012));
  const inner = new THREE.PointLight(0xcfe0ff, 30, 4, 2); inner.position.set(0.1, 1.45, 0.3); scene.add(inner);
  const strike = new THREE.PointLight(0xeaf2ff, 18, 3, 2); strike.position.set(0.3, 0.2, 1.0); scene.add(strike);
  g.add(glowDisc(0xdfe8ff, 2.2, 0.45, [0.25, 0.05, 0.8]));
}, { halo: 0x9fb4d8, haloOpacity: 0.16, lights: { red: 0x9fb4d8, redI: 1.2, key: 0xcfd8ff, keyI: 0.9 }, camPos: [0, 1.5, 6.6], look: [0, 1.0, 0], exposure: 1.1 });

// Atlas: a shelf of carved totems, each one a person who fooled him.
S['relic-atlas'] = relic((g) => {
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.08, 0.7), matte(0x2a211a, 0.7)); shelf.position.y = 1.1; g.add(shelf);
  const shelf2 = shelf.clone(); shelf2.position.y = 0.0; g.add(shelf2);
  const wood = [0x6b5236, 0x7d6143, 0x5a4430, 0x8a6e4e];
  for (let i = 0; i < 7; i++) {
    const h = 0.55 + seededRandom(i * 4.1) * 0.35;
    const prof = [[0, h], [0.07, h - 0.02], [0.1, h - 0.12], [0.07, h - 0.2], [0.11, h * 0.55], [0.09, 0.12], [0.12, 0.02], [0.12, 0], [0, 0]];
    const t = new THREE.Mesh(lathe(prof, 32), matte(wood[i % 4], 0.8)); t.position.set(-1.35 + i * 0.45, 1.14, 0); g.add(t);
  }
  // one space left empty, waiting
  const tag = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.01, 0.1), matte(0xeef0f2, 0.5)); tag.position.set(1.8, 1.15, 0.2); g.add(tag);
}, { halo: 0xdfe8ff, haloOpacity: 0.1, lights: { red: 0xdfe8ff, redI: 1.0, keyI: 1.6 }, camPos: [0.4, 1.9, 5.8], look: [0.2, 1.1, 0] });

// Lysander: a pristine portrait with a hairline fracture.
S['relic-lysander'] = relic((g) => {
  const frame = new THREE.Group();
  const fm = metal(C.gold, 0.25);
  [[0, 1.32, 2.3, 0.14], [0, -1.32, 2.3, 0.14], [1.08, 0, 0.14, 2.78], [-1.08, 0, 0.14, 2.78]].forEach(([x, y, w, h]) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.12), fm); b.position.set(x, y, 0); frame.add(b); });
  const canvas = new THREE.Mesh(new THREE.PlaneGeometry(2.02, 2.5), matte(0xe9e6df, 0.6)); frame.add(canvas);
  // the fracture: one thin dark line, nothing more
  const crack = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[0.25, 1.25, 0.01], [0.21, 1.02, 0.01], [0.27, 0.86, 0.01], [0.2, 0.62, 0.01], [0.24, 0.48, 0.01]].map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0), 64, 0.0035, 6), matte(0x151515, 0.9));
  frame.add(crack);
  frame.position.y = 1.5; frame.rotation.y = -0.18; g.add(frame);
}, { halo: 0xeef0f2, haloOpacity: 0.14, camPos: [0, 1.6, 6.2], look: [0, 1.45, 0] });

// Apollonius: gold horns on red velvet, one spotlight.
S['relic-apollonius'] = relic((g, scene) => {
  const velvet = new THREE.Mesh(new THREE.CylinderGeometry(2.9, 2.9, 0.06, 96), matte(0x4a0810, 1)); velvet.position.y = 0.03; g.add(velvet);
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.95, 1.1), matte(0x16110f, 0.35, { metalness: 0.2 })); base.position.y = 0.53; g.add(base);
  const horn = (sgn) => new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[sgn * 0.12, 1.02, 0], [sgn * 0.7, 1.12, 0.1], [sgn * 1.25, 1.45, 0.2], [sgn * 1.4, 1.95, 0.15], [sgn * 1.2, 2.4, 0.3]].map((p) => new THREE.Vector3(...p))), 96, 0.12, 24), metal(C.gold, 0.18));
  const hl = horn(-1), hr = horn(1);
  // taper the horns toward the tips
  [hl, hr].forEach((h) => { const p = h.geometry.attributes.position; const path = h.geometry.parameters.path; for (let i = 0; i < p.count; i++) { const seg = Math.floor(i / 25) / 96; const c = path.getPointAt(Math.min(1, seg)); const v = new THREE.Vector3(p.getX(i), p.getY(i), p.getZ(i)).sub(c).multiplyScalar(1 - seg * 0.85).add(c); p.setXYZ(i, v.x, v.y, v.z); } h.geometry.computeVertexNormals(); g.add(h); });
  const spot = new THREE.SpotLight(0xffe2b0, 60, 14, 0.32, 0.5); spot.position.set(0, 7, 1.5); spot.target.position.set(0, 1.2, 0); spot.castShadow = true; scene.add(spot, spot.target);
}, { halo: C.redDeep, haloOpacity: 0.3, lights: { keyI: 0.5, redI: 1.8, rimI: 0.8 }, camPos: [0, 1.9, 6.6], look: [0, 1.35, 0] });

// The Jackal: a king swept off the board.
S['relic-the-jackal'] = relic((g) => {
  const board = chessBoard(g); board.rotation.y = 0.2;
  const ink = metal(0x2a2a30, 0.35), gold = metal(C.gold, 0.22);
  const k = chessPiece('king', gold); k.rotation.z = Math.PI / 2; k.rotation.y = 0.9; k.position.set(1.95, 0.24, 1.45); g.add(k);
  [[1, 2, gold], [5, 5, ink], [3, 6, ink]].forEach(([i, j, m]) => { const p = chessPiece('pawn', m); p.position.set((i - 3.5) * 0.4, 0.08, (j - 3.5) * 0.4); p.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.2); g.add(p); });
}, { camPos: [3.4, 2.6, 4.6], look: [0.6, 0.2, 0.4], halo: 0xeef0f2, haloOpacity: 0.1, lights: { keyI: 1.8, key: 0xdfe8ff } });

// ============================== HOUSE SEALS ==============================
function starPoly(n, ro, ri, rot = 0) { const pts = []; for (let i = 0; i < n * 2; i++) { const r = i % 2 ? ri : ro; const a = rot + (i / (n * 2)) * Math.PI * 2; pts.push([Math.cos(a) * r, Math.sin(a) * r]); } return pts; }
function sealScene(emblem, { disc = 0x6e1016, rimCol = C.gold, emblemCol = C.gold, halo = C.red, haloOpacity = 0.22 } = {}) {
  return relic((g) => {
    const seal = new THREE.Group();
    const d = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.16, 128), matte(disc, 0.5, { metalness: 0.3 })); d.rotation.x = Math.PI / 2; seal.add(d);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.08, 24, 128), metal(rimCol, 0.3)); seal.add(ring);
    const inner = new THREE.Mesh(new THREE.TorusGeometry(1.16, 0.025, 12, 128), metal(rimCol, 0.3)); inner.position.z = 0.08; seal.add(inner);
    const mat = metal(emblemCol, 0.28);
    emblem(seal, mat);
    seal.position.y = 1.42; seal.rotation.y = -0.32; seal.rotation.x = -0.05; g.add(seal);
  }, { camPos: [0, 1.5, 6.0], look: [0, 1.4, 0], halo, haloOpacity });
}
const ext = (shape, depth, z = 0.08) => { const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2, curveSegments: 24 }); const m = new THREE.Mesh(geo); m.position.z = z; return m; };
const withMat = (m, mat) => { m.material = mat; return m; };

// Augustus: a golden lion on red. Stylised: sunburst mane around a head.
S['seal-augustus'] = sealScene((seal, mat) => {
  seal.add(withMat(ext(shapeFrom(starPoly(18, 0.98, 0.78, 0.1)), 0.06), mat));
  const face = shapeFrom([[0, 0.62], [0.36, 0.42], [0.42, 0.02], [0.24, -0.38], [0.12, -0.62], [-0.12, -0.62], [-0.24, -0.38], [-0.42, 0.02], [-0.36, 0.42]]);
  seal.add(withMat(ext(face, 0.1, 0.14), matte(0x6e1016, 0.5, { metalness: 0.3 })));
  const face2 = shapeFrom([[0, 0.5], [0.28, 0.34], [0.33, 0.02], [0.18, -0.3], [0.09, -0.5], [-0.09, -0.5], [-0.18, -0.3], [-0.33, 0.02], [-0.28, 0.34]]);
  seal.add(withMat(ext(face2, 0.06, 0.26), mat));
  [-0.13, 0.13].forEach((x) => { const e = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.035, 0.03), matte(0x2a0508)); e.position.set(x, 0.08, 0.36); e.rotation.z = x > 0 ? -0.3 : 0.3; seal.add(e); });
}, { disc: 0x6e1016 });

// Bellona: an eagle, wings spread.
S['seal-bellona'] = sealScene((seal, mat) => {
  const wing = (sgn) => shapeFrom([[0.08 * sgn, 0.2], [0.95 * sgn, 0.55], [0.9 * sgn, 0.38], [0.78 * sgn, 0.3], [0.8 * sgn, 0.16], [0.64 * sgn, 0.1], [0.66 * sgn, -0.04], [0.5 * sgn, -0.08], [0.1 * sgn, -0.1]]);
  seal.add(withMat(ext(wing(1), 0.08), mat)); seal.add(withMat(ext(wing(-1), 0.08), mat));
  seal.add(withMat(ext(shapeFrom([[0, 0.5], [0.13, 0.38], [0.1, -0.25], [0.2, -0.6], [0, -0.48], [-0.2, -0.6], [-0.1, -0.25], [-0.13, 0.38]]), 0.12), mat));
  seal.add(withMat(ext(shapeFrom([[0, 0.66], [0.12, 0.52], [0.06, 0.46], [-0.1, 0.5]]), 0.12), mat));
}, { disc: 0x1c1d22, halo: 0xdfe8ff, haloOpacity: 0.12 });

// Lune: light from darkness. A crescent.
S['seal-lune'] = sealScene((seal, mat) => {
  const R0 = 0.8, cx = 0.3, cy = 0.12, R1 = 0.66, pts = [];
  for (let i = 0; i <= 360; i++) { const a = (i / 360) * Math.PI * 2; const x = Math.cos(a) * R0, y = Math.sin(a) * R0; if (Math.hypot(x - cx, y - cy) > R1) pts.push([x, y]); }
  const first = Math.atan2(pts[0][1] - cy, pts[0][0] - cx), last = Math.atan2(pts[pts.length - 1][1] - cy, pts[pts.length - 1][0] - cx);
  // walk the inner circle back from the last outer point to the first
  let a0 = last, a1 = first; while (a1 > a0) a1 -= Math.PI * 2;
  for (let i = 1; i < 120; i++) { const a = a0 + ((a1 - a0) * i) / 120; const x = cx + Math.cos(a) * R1, y = cy + Math.sin(a) * R1; if (Math.hypot(x, y) < R0) pts.push([x, y]); }
  seal.add(withMat(ext(shapeFrom(pts), 0.1), mat));
  for (let i = 0; i < 5; i++) { const st = new THREE.Mesh(new THREE.ExtrudeGeometry(shapeFrom(starPoly(4, 0.07, 0.025)), { depth: 0.04, bevelEnabled: false })); st.material = mat; st.position.set(0.35 + (i % 3) * 0.2, -0.1 + i * 0.13, 0.1); seal.add(st); }
}, { disc: 0x0c0c12, rimCol: 0xc9ccd2, emblemCol: 0xdfe3e8, halo: 0xdfe8ff, haloOpacity: 0.14 });

// Telemanus: a red fox.
S['seal-telemanus'] = sealScene((seal, mat) => {
  const head = shapeFrom([[-0.62, 0.5], [-0.36, 0.2], [0, 0.26], [0.36, 0.2], [0.62, 0.5], [0.52, -0.05], [0.28, -0.3], [0, -0.66], [-0.28, -0.3], [-0.52, -0.05]]);
  seal.add(withMat(ext(head, 0.1), matte(0xb04a1e, 0.45, { metalness: 0.35 })));
  const mask = shapeFrom([[0, 0.12], [0.22, -0.22], [0, -0.58], [-0.22, -0.22]]);
  seal.add(withMat(ext(mask, 0.05, 0.2), matte(0xe9e4da, 0.5)));
  [-0.2, 0.2].forEach((x) => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), matte(0x111111)); e.position.set(x, 0.02, 0.22); seal.add(e); });
}, { disc: 0x8c7446, rimCol: 0xc8a96a });

// Raa: no verified sigil, so the archive marks it with Io and Jupiter's orbit.
S['seal-raa'] = sealScene((seal, mat) => {
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.03, 16, 128), mat); orbit.position.z = 0.12; orbit.scale.y = 0.42; orbit.rotation.z = 0.35; seal.add(orbit);
  const planet = new THREE.Mesh(new THREE.SphereGeometry(0.34, 48, 32), mat); planet.position.z = 0.16; seal.add(planet);
  const io = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 16), matte(0xd6c060, 0.5)); io.position.set(0.62, 0.23, 0.2); seal.add(io);
}, { disc: 0x14181e, rimCol: 0xaab2ba, emblemCol: 0xdfe3e8, halo: 0x9fb4d8, haloOpacity: 0.14 });

// ============================== ARTIFACT VAULT ==============================
S['tech-razor'] = relic((g) => {
  const blade = new THREE.Shape(); blade.moveTo(0, 0); blade.quadraticCurveTo(1.4, 0.35, 2.6, 1.2); blade.lineTo(2.62, 1.26); blade.quadraticCurveTo(1.4, 0.45, 0, 0.1); blade.closePath();
  const b = new THREE.Mesh(new THREE.ExtrudeGeometry(blade, { depth: 0.02, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.01, bevelSegments: 2, curveSegments: 48 }), new THREE.MeshStandardMaterial({ color: 0xc9ced6, metalness: 0.65, roughness: 0.18 }));
  const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.6, 32), metal(0x2a2a30, 0.4)); hilt.rotation.z = Math.PI / 2 + 0.2; hilt.position.set(-0.3, 0.0, 0.01);
  const guard = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.025, 12, 48), metal(C.gold, 0.3)); guard.rotation.y = Math.PI / 2; guard.position.set(0.02, 0.05, 0.01);
  const r = new THREE.Group(); r.add(b, hilt, guard); r.position.set(-1.0, 0.8, 0); r.rotation.set(0.2, -0.3, 0.05); r.scale.setScalar(0.8); g.add(r);
}, { halo: 0xeef0f2, haloOpacity: 0.12, camPos: [0, 1.6, 6.0], look: [0, 1.3, 0] });

// Corinthian-style helm: a lathe shell with a glowing T-slit. Reads as armour
// at any size, and suits the Golds' Greco-Roman iconography.
function facetedHelm(scale, shellMat, trimMat, visorMat) {
  const helm = new THREE.Group();
  const shell = new THREE.Mesh(lathe([[0, 1.05], [0.34, 1.0], [0.62, 0.82], [0.76, 0.5], [0.8, 0.1], [0.78, -0.35], [0.7, -0.72], [0.6, -0.95], [0.56, -1.0]], 96), shellMat);
  shell.scale.set(1, 1, 1.12); helm.add(shell);
  const eye = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.045, 0.2), visorMat); eye.position.set(0, 0.12, 0.78); helm.add(eye);
  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.8, 0.2), visorMat); nose.position.set(0, -0.3, 0.8); helm.add(nose);
  const brow = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.035, 12, 96, Math.PI), trimMat); brow.rotation.x = -Math.PI / 2 + 0.05; brow.position.y = 0.3; brow.scale.set(1, 1.12, 1); helm.add(brow);
  helm.scale.setScalar(scale);
  return helm;
}
S['tech-starshell'] = relic((g) => {
  const helm = facetedHelm(0.95, new THREE.MeshStandardMaterial({ color: 0x3a3c42, metalness: 0.5, roughness: 0.32 }), metal(C.gold, 0.3), glow(C.red, 2.2));
  helm.position.y = 1.35; helm.rotation.y = -0.5; g.add(helm);
}, { camPos: [0.3, 1.45, 5.0], look: [0, 1.25, 0], lights: { keyI: 0.35, redI: 2.8, rimI: 2.2 }, haloOpacity: 0.2 });
S['tech-dreadnought'] = (R) => {
  const scene = new THREE.Scene(); darkStage(scene, { fog: 0 }); stars(scene, { seed: 61, size: 0.07, opacity: 0.8 });
  const mars = new THREE.Mesh(new THREE.SphereGeometry(10, 160, 120), new THREE.MeshStandardMaterial({ map: planetTexture((n) => mix([96, 38, 20], [168, 84, 46], ss(0.35, 0.7, n)), { scale: 3, seed: 2 }), roughness: 1 }));
  mars.position.set(0, -11.2, -4); scene.add(mars); scene.add(atmosphere(10, 0xd0704a, 0.5, [-3, 2, 1]));
  const ship = new THREE.Group(); const hull = metal(0x3a3d43, 0.45);
  const wedge = new THREE.Mesh(new THREE.ExtrudeGeometry(shapeFrom([[3.2, 0], [-2.2, 0.95], [-2.4, 0.6], [-2.4, -0.6], [-2.2, -0.95]]), { depth: 0.35, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 2 }), hull);
  wedge.rotation.x = -Math.PI / 2; ship.add(wedge);
  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 0.5), hull); tower.position.set(-1.6, 0.55, 0); ship.add(tower);
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.9), hull); bridge.position.set(-1.6, 0.84, 0); ship.add(bridge);
  for (let i = 0; i < 70; i++) { const w = 0.08 + seededRandom(i) * 0.25; const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05 + seededRandom(i * 2) * 0.12, w), metal(0x3c3f45, 0.5)); const x = -2.2 + seededRandom(i * 3) * 4.6; const half = 0.95 * (1 - (x + 2.2) / 5.4); b.position.set(x, 0.4, (seededRandom(i * 5) - 0.5) * 1.6 * half); ship.add(b); }
  for (let i = 0; i < 3; i++) { const e = new THREE.Mesh(new THREE.CircleGeometry(0.16, 24), glow(0x9fd0ff, 6)); e.rotation.y = -Math.PI / 2; e.position.set(-2.46, 0.17, -0.45 + i * 0.45); ship.add(e); ship.add(glowDisc(0x9fd0ff, 1.0, 0.5, [-2.6, 0.17, -0.45 + i * 0.45])); }
  for (let i = 0; i < 50; i++) { const w = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.015, 0.01), glow(0xffd9a0, 3)); const x = -2.1 + seededRandom(i * 7) * 4.5; w.position.set(x, 0.2, 0.96 * (1 - (x + 2.2) / 5.4) + 0.02); ship.add(w); }
  ship.position.set(0.2, 0.6, 0); ship.rotation.set(0.25, -0.6, 0.12); ship.scale.setScalar(0.95); scene.add(ship);
  scene.add(new THREE.AmbientLight(0xffffff, 0.05));
  const sun = new THREE.DirectionalLight(0xfff1e0, 3); sun.position.set(-3, 2, 1); scene.add(sun);
  const bounce = new THREE.DirectionalLight(0xd0704a, 0.8); bounce.position.set(0, -3, 1); scene.add(bounce);
  return { scene, camera: cam(R.W, R.H, [0, 1, 8], [0, 0.2, 0], 34), exposure: 1.1 };
};

S['tech-starship'] = (R) => {
  const scene = new THREE.Scene(); darkStage(scene, { fog: 0 }); stars(scene, { seed: 71, count: 2200, size: 0.07 });
  const ship = new THREE.Group(); const hull = metal(0x5a5f66, 0.4), dark = metal(0x2c2f34, 0.5);
  // long needle hull: tapered prow, broad engine section
  const body = new THREE.Mesh(lathe([[0, 3.2], [0.12, 2.6], [0.26, 1.6], [0.34, 0.2], [0.42, -0.6], [0.46, -1.2], [0.4, -1.35], [0, -1.35]], 8), hull);
  body.rotation.z = -Math.PI / 2; body.scale.set(1, 1, 0.55); ship.add(body);
  const spine = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.12, 0.08), dark); spine.position.set(-0.1, 0.3, 0); ship.add(spine);
  [-1, 1].forEach((sg) => {
    const fin = new THREE.Mesh(new THREE.ExtrudeGeometry(shapeFrom([[0, 0], [-0.9, 0.0], [-1.25, 0.55], [-0.6, 0.18]]), { depth: 0.04, bevelEnabled: false }), dark);
    fin.rotation.x = sg > 0 ? Math.PI / 2 : -Math.PI / 2; fin.position.set(0.1, 0, sg * 0.18); ship.add(fin);
  });
  for (let i = 0; i < 36; i++) { const w = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.018, 0.01), glow(0xffd9a0, 3)); const x = -0.9 + i * 0.07; const r = 0.3 * (1 - Math.max(0, x - 0.2) / 3.2); w.position.set(x, 0.02, r * 0.55 + 0.005); ship.add(w); }
  [-0.16, 0.16].forEach((z) => {
    const e = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 0.35, 24), dark); e.rotation.z = Math.PI / 2; e.position.set(-1.45, -0.02, z); ship.add(e);
    const f = new THREE.Mesh(new THREE.CircleGeometry(0.12, 24), glow(0xffb070, 6)); f.rotation.y = -Math.PI / 2; f.position.set(-1.63, -0.02, z); ship.add(f);
    ship.add(glowDisc(0xffb070, 1.1, 0.55, [-1.75, -0.02, z]));
  });
  const trail = glowDisc(0xff8a50, 3.2, 0.18, [-2.6, -0.02, 0]); trail.scale.set(1.6, 0.25, 1); ship.add(trail);
  ship.rotation.set(0.25, 0.55, -0.12); ship.position.set(0.3, 0, 0); scene.add(ship);
  scene.add(new THREE.AmbientLight(0xffffff, 0.05));
  const sun = new THREE.DirectionalLight(0xfff1e0, 2.6); sun.position.set(3, 4, 3); scene.add(sun);
  const rimL = new THREE.DirectionalLight(C.red, 2.2); rimL.position.set(-4, -1, -3); scene.add(rimL);
  const cool = new THREE.DirectionalLight(0x9fb4d8, 0.8); cool.position.set(-2, 3, 4); scene.add(cool);
  return { scene, camera: cam(R.W, R.H, [0, 0.9, 5.6], [0, 0, 0], 38), exposure: 1.1 };
};

S['tech-minds-eye'] = relic((g) => {
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.28, 48, 32), glow(0xeef0f2, 3)); eye.position.y = 1.4; g.add(eye);
  g.add(glowDisc(0xdfe8ff, 2.2, 0.5, [0, 1.4, 0.3]));
  for (let i = 0; i < 6; i++) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.5 + i * 0.2, 0.006 + (i % 2) * 0.004, 8, 160), glow(0xdfe8ff, 1.2 - i * 0.12)); t.position.y = 1.4; t.rotation.set(Math.PI / 2 + (seededRandom(i) - 0.5) * 0.9, (seededRandom(i * 3) - 0.5) * 0.9, 0); g.add(t); }
}, { halo: 0x9fb4d8, haloOpacity: 0.14, lights: { red: 0x9fb4d8, redI: 0.6, keyI: 0.8 }, camPos: [0, 1.5, 5.2], look: [0, 1.35, 0] });

S['tech-carving'] = relic((g) => {
  const tray = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.06, 1.4), metal(0x4a4f56, 0.35)); tray.position.y = 0.05; g.add(tray);
  const lip = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.12, 0.05), metal(0x4a4f56, 0.35)); [-0.72, 0.72].forEach((z) => { const l = lip.clone(); l.position.set(0, 0.1, z); g.add(l); });
  for (let i = 0; i < 5; i++) {
    const tool = new THREE.Group();
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.0, 16), metal(0xb8bec6, 0.3)); handle.rotation.z = Math.PI / 2; tool.add(handle);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.28 - i * 0.03, 4), metal(0xdfe3e8, 0.22)); tip.rotation.z = -Math.PI / 2; tip.position.x = 0.62; tool.add(tip);
    tool.position.set(-0.1 + (i % 2) * 0.1, 0.12, -0.5 + i * 0.25); tool.rotation.y = (seededRandom(i) - 0.5) * 0.15; g.add(tool);
  }
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), new THREE.MeshStandardMaterial({ color: 0x7a0a12, roughness: 0.1 })); drop.scale.y = 0.4; drop.position.set(0.9, 0.09, 0.3); g.add(drop);
  const flake = new THREE.Mesh(new THREE.CircleGeometry(0.12, 6), metal(C.gold, 0.25)); flake.rotation.x = -Math.PI / 2; flake.position.set(1.0, 0.085, -0.2); g.add(flake);
}, { camPos: [0.9, 2.2, 3.6], look: [0.1, 0.1, 0], halo: 0xeef0f2, haloOpacity: 0.1 });

S['tech-psychospike'] = relic((g) => {
  const velvet = new THREE.Mesh(new THREE.CylinderGeometry(2.9, 2.9, 0.05, 96), matte(0x0b0b0e, 1)); velvet.position.y = 0.03; g.add(velvet);
  const spike = new THREE.Group(); const sil = new THREE.MeshStandardMaterial({ color: 0x9aa3ad, metalness: 0.6, roughness: 0.2 });
  [0.2, 0.3, 0.4].forEach((y) => { const r = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.012, 8, 48), metal(0x3a3f45, 0.3)); r.rotation.x = Math.PI / 2; r.position.y = y; spike.add(r); });
  const tipLight = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 8), glow(0x9fd0ff, 6)); tipLight.position.y = 0.64; spike.add(tipLight);
  spike.add(new THREE.Mesh(lathe([[0, 0], [0.09, 0.05], [0.1, 0.5], [0.07, 0.55], [0.07, 0.62], [0.1, 0.66], [0.1, 0.78], [0.05, 1.3], [0, 1.55]], 48), sil));
  spike.rotation.z = -1.35; spike.position.set(-0.7, 0.14, 0.2); g.add(spike);
}, { halo: 0xdfe8ff, haloOpacity: 0.1, lights: { red: 0xdfe8ff, redI: 0.9 }, camPos: [0.2, 1.4, 3.6], look: [0, 0.2, 0.1] });

S['tech-holotech'] = relic((g) => {
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 0.18, 64), metal(0x2c2e33, 0.4)); base.position.y = 0.09; g.add(base);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.4, 48), glow(0x9fd0ff, 2)); lens.rotation.x = -Math.PI / 2; lens.position.y = 0.185; g.add(lens);
  const globe = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.85, 2)), new THREE.LineBasicMaterial({ color: 0x9fd0ff, transparent: true, opacity: 0.8 }));
  globe.position.y = 1.45; g.add(globe);
  const beam = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.25, 64, 1, true), new THREE.MeshBasicMaterial({ color: 0x9fd0ff, transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false })); beam.position.y = 0.8; beam.rotation.x = Math.PI; g.add(beam);
  g.add(glowDisc(0x9fd0ff, 3, 0.25, [0, 1.45, 0]));
}, { halo: 0x9fd0ff, haloOpacity: 0.1, lights: { red: 0x9fd0ff, redI: 0.8, keyI: 0.8 }, camPos: [0, 1.5, 5.4], look: [0, 1.1, 0] });

// ============================== THE RISING (16:9) ==============================
function wideStage(scene, bg = C.void, fog = 0.06) { darkStage(scene, { bg, fog }); const f = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), matte(0x050404, 1)); f.rotation.x = -Math.PI / 2; scene.add(f); return f; }

S['rising-movement'] = (R) => {
  const scene = new THREE.Scene(); wideStage(scene, 0x07070a, 0.028);
  scene.add(new THREE.AmbientLight(0xffffff, 0.03));
  const lamp = new THREE.MeshBasicMaterial({ color: 0xff3a3a });
  const n = 900, pos = [];
  for (let i = 0; i < n; i++) { const t = Math.pow(seededRandom(i * 1.3), 0.7); const z = -6 - t * 70; const spread = 8 + t * 40; const x = (seededRandom(i * 2.7) - 0.5) * spread; pos.push([x, 0.8 + (seededRandom(i * 4.1) - 0.5) * 0.25, z]); }
  const inst = new THREE.InstancedMesh(new THREE.SphereGeometry(0.03, 8, 6), lamp, n); const m = new THREE.Matrix4();
  pos.forEach((p, i) => { m.makeTranslation(...p); inst.setMatrixAt(i, m); }); scene.add(inst);
  pos.slice(0, 60).forEach((p) => { const l = new THREE.PointLight(0xff3a3a, 1.2, 4, 2); l.position.set(...p); scene.add(l); });
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), matte(0x0c0a09, 1)); ceil.rotation.x = Math.PI / 2; ceil.position.y = 7; scene.add(ceil);
  scene.add(glowDisc(C.red, 30, 0.25, [0, 3, -60]));
  const walls = matte(0x1a1512, 1);
  [-1, 1].forEach((sg) => { for (let i = 0; i < 30; i++) { const w = new THREE.Mesh(new THREE.BoxGeometry(2, 4 + seededRandom(i) * 5, 4), walls); w.position.set(sg * (5 + i * 0.7 + seededRandom(i * 9) * 2), 2, -i * 4); w.rotation.y = seededRandom(i * 5) * 0.4; scene.add(w); } });
  return { scene, camera: cam(R.W, R.H, [0, 2.4, 2], [0, 1.0, -30], 46), exposure: 1.25 };
};

S['rising-war'] = (R) => {
  const scene = new THREE.Scene(); darkStage(scene, { fog: 0 }); stars(scene, { seed: 81, size: 0.06 });
  const mars = new THREE.Mesh(new THREE.SphereGeometry(30, 200, 140), new THREE.MeshStandardMaterial({ map: planetTexture((n) => mix([90, 34, 18], [160, 76, 40], ss(0.35, 0.7, n)), { scale: 5, seed: 2 }), roughness: 1 }));
  mars.position.set(0, -31.5, -8); scene.add(mars); scene.add(atmosphere(30, 0xd0704a, 0.6, [0, 1, 0.2]));
  const n = 380; const mat = new THREE.MeshBasicMaterial({ color: 0xffb070 });
  const inst = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.012, 0.004, 1, 6), mat, n); const m = new THREE.Matrix4(); const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.25, 0, -0.35));
  for (let i = 0; i < n; i++) { const L = 0.6 + seededRandom(i * 3.3) * 1.8; m.compose(new THREE.Vector3((seededRandom(i) - 0.5) * 26, -0.6 + seededRandom(i * 1.9) * 9, -6 - seededRandom(i * 7.7) * 14), q, new THREE.Vector3(1, L, 1)); inst.setMatrixAt(i, m); }
  scene.add(inst);
  for (let i = 0; i < 60; i++) scene.add(glowDisc(0xffb070, 0.35, 0.6, [(seededRandom(i * 11) - 0.5) * 22, -0.2 + seededRandom(i * 13) * 7, -6 - seededRandom(i * 17) * 12]));
  scene.add(new THREE.AmbientLight(0xffffff, 0.03));
  const sun = new THREE.DirectionalLight(0xfff1e0, 2.4); sun.position.set(-4, 3, -2); scene.add(sun);
  return { scene, camera: cam(R.W, R.H, [0, 1.6, 9], [0, 1.6, -6], 40), exposure: 1.15 };
};

S['rising-myth'] = (R) => {
  const scene = new THREE.Scene(); wideStage(scene, 0x07070a, 0.05);
  scene.add(new THREE.AmbientLight(0xffffff, 0.02));
  const helm = facetedHelm(2.6, new THREE.MeshStandardMaterial({ color: 0x17171b, metalness: 0.45, roughness: 0.45 }), matte(0x1c1c20, 0.5, { metalness: 0.3 }), glow(C.red, 2.4));
  helm.position.set(0, 4.4, -9); helm.rotation.y = 0.0; scene.add(helm);
  scene.add(glowDisc(C.red, 26, 0.32, [0, 4.6, -14]));
  const back = new THREE.SpotLight(0xff3a2a, 70, 30, 0.22, 0.6); back.position.set(0, 10, -16); back.target.position.set(0, 4, -9); scene.add(back, back.target);
  const fill = new THREE.DirectionalLight(0x9fb4d8, 0.25); fill.position.set(3, 2, 5); scene.add(fill);
  const tiny = matte(0x050505, 1);
  for (let i = 0; i < 220; i++) { const h = 0.16 + seededRandom(i * 9) * 0.06; const p = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, h, 6), tiny); p.position.set((seededRandom(i) - 0.5) * 14, h / 2, -2 - seededRandom(i * 3) * 5); scene.add(p); }
  return { scene, camera: cam(R.W, R.H, [0, 1.0, 7], [0, 3, -6], 42), exposure: 1.2 };
};

S['rising-government'] = (R) => {
  const scene = new THREE.Scene(); wideStage(scene, 0x0b0c10, 0.03);
  scene.add(new THREE.AmbientLight(0xffffff, 0.04)); scene.add(new THREE.HemisphereLight(0xeef0f2, 0x0a0a0c, 0.2));
  const t0 = Math.PI * 0.55, tl = Math.PI * 0.9;
  for (let r = 0; r < 9; r++) {
    const rin = 4 + r * 1.1, h = 0.42, y = r * h;
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(rin, rin, h, 128, 1, true, t0, tl), matte(0x6e6a63, 0.85, { side: THREE.DoubleSide }));
    wall.position.y = y + h / 2; scene.add(wall);
    const tread = new THREE.Mesh(new THREE.RingGeometry(rin, rin + 1.1, 128, 1, 0, tl), matte(r % 2 ? 0x8e8a82 : 0x9a968d, 0.75, { side: THREE.DoubleSide }));
    tread.rotation.x = -Math.PI / 2; tread.rotation.z = t0 - Math.PI / 2; tread.position.y = y + h; scene.add(tread);
  }
  const floor = new THREE.Mesh(new THREE.CircleGeometry(3.4, 96), matte(0x1a1a1e, 0.3, { metalness: 0.3 })); floor.rotation.x = -Math.PI / 2; floor.position.y = 0.02; scene.add(floor);
  const spot = new THREE.SpotLight(0xeef0f2, 45, 30, 0.3, 0.6); spot.position.set(0, 14, 0); spot.target.position.set(0, 0, 0); spot.castShadow = true; scene.add(spot, spot.target);
  const pool = glowDisc(0xeef0f2, 5, 0.08, [0, 0.05, 0]); pool.rotation.x = -Math.PI / 2; scene.add(pool);
  const lec = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 0.35), matte(0x2a2a2e, 0.5)); lec.position.set(0, 0.45, -1.2); scene.add(lec);
  const key = new THREE.DirectionalLight(0xfff2e0, 1.2); key.position.set(-5, 8, 6); key.castShadow = true; scene.add(key);
  return { scene, camera: cam(R.W, R.H, [0, 3.2, 9.5], [0, 2.0, -3], 46), exposure: 0.95 };
};

// ============================== RUN ==============================
const name = process.argv[2];
const def = S[name];
if (!def) { console.error('unknown scene', name, Object.keys(S).join(' ')); process.exit(1); }
const aspect = def.aspect || (name.startsWith('rising-') || name.startsWith('wide-') ? '16:9' : '1:1');
const R = createRenderer(aspect, { exposure: 1.15 });
const built = def(R);
if (built.exposure) R.renderer.toneMappingExposure = built.exposure;
if (built.env) addStudioEnvironment(R.renderer, built.scene);
await captureFrame({ ...R, scene: built.scene, camera: built.camera, outPath: `${OUT}/${name}.png` });
console.log('DONE', name);
export { S };
