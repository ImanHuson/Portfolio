// The people relic plates, rebuilt with the realism kit (real.mjs):
// textured materials, bevelled models, a real tabletop, soft shadows,
// depth of field and bloom in post.py.
//
//   xvfb-run -a node relics.mjs <name> <outDir>
//   python3 post.py <outDir>/<name> public/images/people/<slug>.webp
import { THREE, createRenderer, seededRandom } from './pipeline.mjs';
import { glowDisc, puff, lathe, shapeFrom } from './kit.mjs';
import { S as SURF, surface, pbr, metalS, studio, bevelBox, captureWithDepth } from './real.mjs';

const R = {};
const cam = (W, H, pos, look, fov = 24) => { const c = new THREE.PerspectiveCamera(fov, W / H, 0.1, 60); c.position.set(...pos); c.lookAt(...look); return c; };
const shadows = (g) => g.traverse((o) => { if (o.isMesh && !o.material.transparent) { o.castShadow = true; o.receiveShadow = true; } });

// A straight razor-sword blade: long, tapered, with a bevelled edge so the
// light runs along it.
function bladeGeo(len = 2.3, w = 0.075, t = 0.018) {
  const s = shapeFrom([[0, -w / 2], [len * 0.82, -w / 2], [len, 0], [len * 0.82, w / 2], [0, w / 2]]);
  const g = new THREE.ExtrudeGeometry(s, { depth: t * 0.2, bevelEnabled: true, bevelThickness: t * 0.4, bevelSize: w * 0.28, bevelSegments: 4, curveSegments: 2 });
  g.translate(0, 0, -t * 0.1);
  return g;
}

// Lorn: a razor at rest on an old wooden stand, winter light through stone.
R['lorn'] = (W, H) => {
  const scene = new THREE.Scene();
  const { key } = studio(scene, { floor: SURF.walnut({ tone: [62, 38, 24], dark: [14, 9, 6], seed: 3, rough: 0.85 }), repeat: [2.2, 2.2], keyPos: [-1.5, 4.2, 4.2], keyI: 6, keyColor: 0xffe2c4, fog: 0.08, redI: 0.9, amb: 0.0, hemi: 0.03, rimI: 2.6 });
  key.target.position.set(0, 0.6, 0); key.angle = 0.42; key.penumbra = 1;
  // A dark stone wall far behind, catching the cold window light.
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(16, 8), pbr(surface(SURF.slate({ base: [26, 26, 28], light: [48, 48, 52], seed: 2 }), { repeat: [3, 1.5], bump: 1 }), { normal: 0.8 }));
  wall.position.set(0, 3.5, -7); wall.receiveShadow = true; scene.add(wall);
  const win = new THREE.SpotLight(0xc8dcff, 22, 14, 0.3, 0.9, 1.4); win.position.set(-4, 3.2, -1.5); win.target.position.set(0.2, 0.6, 0.2);
  win.castShadow = true; win.shadow.mapSize.set(2048, 2048); win.shadow.radius = 3; scene.add(win, win.target);

  const g = new THREE.Group(); scene.add(g);
  const wood = pbr(surface(SURF.walnut({ tone: [110, 66, 38], dark: [36, 20, 12], seed: 9, rough: 0.55 }), { repeat: [0.9, 0.9], bump: 1 }), { normal: 0.3 });
  const base = new THREE.Mesh(bevelBox(2.6, 0.12, 0.5, 0.025), wood); base.position.y = 0.06; g.add(base);
  for (const x of [-0.85, 0.85]) {
    const up = new THREE.Mesh(bevelBox(0.14, 0.62, 0.22, 0.02), wood); up.position.set(x, 0.43, 0); g.add(up);
  }
  const steel = metalS(surface(SURF.brushed({ c: [212, 214, 220], grime: 0.15, seed: 4, rough: 0.14 }), { repeat: [1, 1] }), { envI: 1.7, normal: 0.3 });
  const blade = new THREE.Mesh(bladeGeo(2.15, 0.08, 0.02), steel); blade.rotation.x = Math.PI / 2 - 0.12; blade.position.set(-0.78, 0.8, 0); g.add(blade);
  const gold = metalS(surface(SURF.gold({ seed: 2 }), {}), { envI: 1.5, normal: 0.4 });
  const guard = new THREE.Mesh(bevelBox(0.06, 0.05, 0.3, 0.012), gold); guard.position.set(-0.8, 0.8, 0); g.add(guard);
  const leather = pbr(surface(SURF.leather({ c: [52, 26, 20], seed: 1 }), { repeat: [2, 1], bump: 1 }), { normal: 0.8 });
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.04, 0.5, 40), leather); grip.rotation.z = Math.PI / 2; grip.position.set(-1.08, 0.8, 0); g.add(grip);
  for (const x of [-0.84, -1.32]) { const f = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.04, 40), gold); f.rotation.z = Math.PI / 2; f.position.set(x, 0.8, 0); g.add(f); }
  const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.06, 40, 24), gold); pommel.position.set(-1.39, 0.8, 0); g.add(pommel);
  g.rotation.y = -0.5; g.position.set(0.1, 0, 0.1);
  shadows(g);
  const camera = cam(W, H, [2.6, 1.55, 5.6], [-0.05, 0.55, 0], 24);
  return { scene, camera, exposure: 1.1, meta: { focus: camera.position.distanceTo(new THREE.Vector3(-0.2, 0.8, 0.3)), aperture: 18, bloom: 0.25 } };
};

// ------------------------------------------------------------------ run
const name = process.argv[2], out = process.argv[3] || './renders';
if (!R[name]) { console.error('unknown relic', name, Object.keys(R).join(' ')); process.exit(1); }
const r = createRenderer('1:1', { ss: 2 });
const built = R[name](r.W, r.H);
r.renderer.toneMappingExposure = built.exposure ?? 1.15;
await captureWithDepth({ ...r, scene: built.scene, camera: built.camera, outBase: `${out}/${name}`, meta: built.meta });
console.log('DONE', name);
