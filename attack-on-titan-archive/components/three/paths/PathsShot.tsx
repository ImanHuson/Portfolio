"use client";

import { useEffect, useRef } from "react";
import { Camera, Geometry, Mesh, Program, Renderer, Transform, Triangle, Vec3 } from "ogl";
import { isSoftwareGL, makeGovernor } from "@/components/three/governor";

// Paths: an endless desert under stars, and at its centre a pillar of light
// that branches into countless lines, one for every Subject of Ymir. A small
// figure at its foot. Units are arbitrary; the pillar stands at the origin.

const bgVertex = /* glsl */ `attribute vec2 position; varying vec2 vUv; void main(){ vUv = position * 0.5 + 0.5; gl_Position = vec4(position, 0.0, 1.0); }`;
const bgFragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform vec3 uCamPos;
uniform vec3 uCamLook;
uniform float uFov;
uniform float uTime;
uniform float uGlow;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float hash3(vec3 p){ p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
float dunes(vec2 p){ return noise(p * 0.02) * 3.0 + noise(p * 0.07 + 3.0) * 0.8 + abs(sin(p.x * 0.35 + noise(p * 0.1) * 4.0)) * 0.12; }
void main(){
  vec2 uv = (vUv * uRes - 0.5 * uRes) / uRes.y;
  vec3 ro = uCamPos;
  vec3 fw = normalize(uCamLook - ro);
  vec3 rt = normalize(cross(fw, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(rt, fw);
  vec3 rd = normalize(fw * (1.0 / tan(uFov * 0.5)) + uv.x * rt + uv.y * up);
  vec3 col;
  if (rd.y > 0.0){
    // stars: a cell grid on the direction, one star per cell at most
    vec3 d = rd * 260.0;
    vec3 cell = floor(d);
    float h = hash3(cell);
    float star = h > 0.965 ? smoothstep(0.5, 0.0, length(fract(d) - 0.5)) * (h - 0.965) * 30.0 : 0.0;
    float tw = 0.7 + 0.3 * sin(uTime * 2.0 + h * 60.0);
    col = mix(vec3(0.0035, 0.0045, 0.009), vec3(0.0006, 0.0008, 0.002), smoothstep(0.0, 0.6, rd.y)) + vec3(0.85, 0.9, 1.0) * star * tw * smoothstep(0.0, 0.08, rd.y);
  } else {
    // the sand: march a heightfield coarsely, then light it by the pillar
    float t = (ro.y - 0.0) / max(-rd.y, 1e-3);
    t = min(t, 900.0);
    vec3 p = ro + rd * t;
    float e = 0.3;
    float hC = dunes(p.xz);
    vec3 n = normalize(vec3(hC - dunes(p.xz + vec2(e, 0.0)), e, hC - dunes(p.xz + vec2(0.0, e))));
    vec3 L = normalize(vec3(0.0, 12.0, 0.0) - p);
    float dist = length(p.xz);
    float lit = max(dot(n, L), 0.0) * (6.0 / (1.0 + dist * 0.05));
    vec3 sand = vec3(0.35, 0.33, 0.3);
    col = sand * (0.002 + lit * 0.05 * uGlow) + vec3(0.001, 0.0012, 0.002);
    col += vec3(0.5, 0.7, 1.0) * 0.06 * exp(-dist * 0.1) * uGlow;
    float fog = 1.0 - exp(-t * 0.006);
    col = mix(col, vec3(0.0035, 0.0045, 0.009), fog);
  }
  // the glow of the pillar in the air around it
  vec3 toP = vec3(0.0, 20.0, 0.0) - ro;
  float along = dot(toP, rd);
  vec3 closest = ro + rd * max(along, 0.0);
  float dx = length(closest.xz);
  col += vec3(0.55, 0.75, 1.0) * (exp(-dx * 1.2) * 0.3 + exp(-dx * 0.15) * 0.025) * uGlow * step(0.0, closest.y) * step(closest.y, 44.0);
  col = col / (col + 0.6) * 1.2;
  col = pow(col, vec3(0.4545));
  col += (hash(vUv * uRes + fract(uTime) * 57.0) - 0.5) * 0.018;
  gl_FragColor = vec4(col, 1.0);
}`;

const lineVertex = /* glsl */ `
attribute vec3 position;
attribute float depth;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uReveal;
uniform vec2 uOffset; // in pixels: the same lines drawn a few times, nudged, to make them glow
uniform vec2 uRes;
varying float vA;
void main(){
  vA = clamp((uReveal * 9.0 - depth), 0.0, 1.0) * (1.0 - depth * 0.075);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position.xy += uOffset / uRes * 2.0 * gl_Position.w;
}`;
const lineFragment = /* glsl */ `
precision highp float;
uniform float uGain;
varying float vA;
void main(){ gl_FragColor = vec4(vec3(0.62, 0.8, 1.0) * vA * uGain, 1.0); }`;

// core, a 1px ring, then a faint 3px halo: webgl draws lines 1px wide at most
const GLOW: [number, number, number][] = [
  [0, 0, 0.95],
  [1, 0, 0.32], [-1, 0, 0.32], [0, 1, 0.32], [0, -1, 0.32],
  [2.5, 0, 0.09], [-2.5, 0, 0.09], [0, 2.5, 0.09], [0, -2.5, 0.09], [1.8, 1.8, 0.07], [-1.8, -1.8, 0.07], [1.8, -1.8, 0.07], [-1.8, 1.8, 0.07],
];

const pointVertex = /* glsl */ `
attribute vec3 position;
attribute float seed;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
varying float vA;
void main(){
  vec3 p = position;
  p.y = mod(position.y + uTime * (0.4 + seed * 0.8), 60.0);
  p.x += sin(uTime * 0.3 + seed * 20.0) * 0.8;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = (1.5 + seed * 2.5) * 60.0 / -mv.z;
  vA = (1.0 - p.y / 60.0) * (0.4 + 0.6 * seed);
  gl_Position = projectionMatrix * mv;
}`;
const pointFragment = /* glsl */ `
precision highp float;
varying float vA;
void main(){ float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(vec3(0.7, 0.85, 1.0) * smoothstep(0.5, 0.0, d) * vA, 1.0); }`;

// the figure at the foot of the pillar: a small silhouette on a camera-facing quad
const figVertex = /* glsl */ `
attribute vec2 position;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 uCamPos;
varying vec2 vQ;
void main(){
  vec3 base = vec3(2.2, 0.0, 3.0);
  vec3 toCam = uCamPos - base; toCam.y = 0.0;
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), normalize(toCam)));
  vec3 w = base + right * position.x * 0.9 + vec3(0.0, position.y * 1.5, 0.0);
  vQ = vec2(position.x * 0.6, position.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}`;
const figFragment = /* glsl */ `
precision highp float;
varying vec2 vQ;
float cap(vec2 p, vec2 a, vec2 b, float r){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h) - r; }
void main(){
  vec2 q = vQ;
  // a girl, kneeling at her work, head bowed
  float d = cap(q, vec2(0.0, 0.18), vec2(0.03, 0.5), 0.1);
  d = min(d, length(q - vec2(0.08, 0.62)) - 0.075);
  d = min(d, cap(q, vec2(-0.05, 0.08), vec2(0.14, 0.06), 0.07));
  d = min(d, cap(q, vec2(0.05, 0.45), vec2(0.2, 0.2), 0.035));
  float a = smoothstep(0.012, -0.012, d);
  float rim = smoothstep(-0.03, 0.0, d) * a;
  gl_FragColor = vec4(mix(vec3(0.01), vec3(0.4, 0.55, 0.75), rim * 0.6), a);
}`;

/** The branches: a pillar, nine limbs, then recursive splitting into fine lines. */
function buildTree() {
  const pos: number[] = [];
  const dep: number[] = [];
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const seg = (a: Vec3, b: Vec3, d: number) => {
    pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
    dep.push(d, d + 1);
  };
  function grow(from: Vec3, dir: Vec3, len: number, depth: number) {
    if (depth > 8) return;
    const to = new Vec3().copy(dir).scale(len).add(from);
    // a gentle wobble along the way
    const mid = new Vec3().copy(from).add(to).scale(0.5).add(new Vec3((rnd() - 0.5) * len * 0.15, (rnd() - 0.5) * len * 0.1, (rnd() - 0.5) * len * 0.15));
    seg(from, mid, depth);
    seg(mid, to, depth + 0.5);
    const kids = depth < 3 ? 3 : 2;
    for (let k = 0; k < kids; k++) {
      const nd = new Vec3(dir.x + (rnd() - 0.5) * 0.9, dir.y * 0.85 + (rnd() - 0.2) * 0.25, dir.z + (rnd() - 0.5) * 0.9).normalize();
      grow(to, nd, len * (0.68 + rnd() * 0.12), depth + 1);
    }
  }
  const top = new Vec3(0, 42, 0);
  seg(new Vec3(0, 0, 0), top, 0);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + rnd() * 0.3;
    grow(top, new Vec3(Math.cos(a) * 0.7, 0.75, Math.sin(a) * 0.7).normalize(), 22, 1);
  }
  return { pos: new Float32Array(pos), dep: new Float32Array(dep) };
}

/** Camera along the scroll: falling out of the dark, onto the sand, toward the pillar, then up. */
function pathsAt(p: number) {
  const c = (x: number) => Math.min(1, Math.max(0, x));
  const e = (x: number) => x * x * (3 - 2 * x);
  const fall = e(c(p / 0.3));
  const walk = e(c((p - 0.3) / 0.5));
  const look = e(c((p - 0.78) / 0.2));
  const pos = new Vec3(0, 160 - fall * 158 + look * 0.5, 170 - walk * 125 - look * 20);
  const tgt = new Vec3(0, 20 - fall * 2 + walk * 26 + look * 60, -40 + fall * 40);
  return { pos, tgt, glow: 0.35 + 0.65 * c((p - 0.12) / 0.3), reveal: c((p - 0.3) / 0.35) };
}

export default function PathsShot({ progress, className, onTooSlow }: { progress: React.RefObject<number>; className?: string; onTooSlow?: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const small = window.matchMedia("(max-width: 767px)").matches;
    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5), antialias: true });
    } catch {
      // no WebGL at all: the section shows its stills
      onTooSlow?.();
      return;
    }
    const gl = renderer.gl;
    if (isSoftwareGL(gl)) {
      // a software rasteriser cannot run this scene: stills, before the reader has scrolled
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      onTooSlow?.();
      return;
    }
    gl.canvas.setAttribute("aria-hidden", "true");
    Object.assign(gl.canvas.style, { display: "block", width: "100%", height: "100%" });
    host.appendChild(gl.canvas);
    const camera = new Camera(gl, { fov: 40, near: 0.1, far: 2000 });
    const FOV = (40 * Math.PI) / 180;
    const scene = new Transform();
    const additive = () => {
      return { transparent: true, depthTest: false, depthWrite: false } as const;
    };

    const bg = new Mesh(gl, {
      geometry: new Triangle(gl),
      program: new Program(gl, {
        vertex: bgVertex,
        fragment: bgFragment,
        depthTest: false,
        depthWrite: false,
        uniforms: { uRes: { value: [1, 1] }, uCamPos: { value: new Vec3() }, uCamLook: { value: new Vec3() }, uFov: { value: FOV }, uTime: { value: 0 }, uGlow: { value: 0 } },
      }),
    });
    bg.frustumCulled = false;
    bg.setParent(scene);

    const tree = buildTree();
    const treeGeo = new Geometry(gl, { position: { size: 3, data: tree.pos }, depth: { size: 1, data: tree.dep } });
    const reveal = { value: 0 };
    const lineRes = { value: [1, 1] };
    const lineMeshes = GLOW.map(([ox, oy, gain]) => {
      const m = new Mesh(gl, {
        mode: gl.LINES,
        geometry: treeGeo,
        program: new Program(gl, {
          vertex: lineVertex,
          fragment: lineFragment,
          ...additive(),
          uniforms: { uReveal: reveal, uRes: lineRes, uOffset: { value: [ox, oy] }, uGain: { value: gain } },
        }),
      });
      m.program.setBlendFunc(gl.ONE, gl.ONE);
      m.frustumCulled = false;
      m.renderOrder = 1;
      m.setParent(scene);
      return m;
    });
    void lineMeshes;

    const N = small ? 500 : 1200;
    const pp = new Float32Array(N * 3);
    const ps = new Float32Array(N);
    let sd = 3;
    const r = () => ((sd = (sd * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < N; i++) {
      const a = r() * Math.PI * 2;
      const rad = Math.sqrt(r()) * 70;
      pp.set([Math.cos(a) * rad, r() * 60, Math.sin(a) * rad], i * 3);
      ps[i] = r();
    }
    const motes = new Mesh(gl, {
      mode: gl.POINTS,
      geometry: new Geometry(gl, { position: { size: 3, data: pp }, seed: { size: 1, data: ps } }),
      program: new Program(gl, { vertex: pointVertex, fragment: pointFragment, ...additive(), uniforms: { uTime: { value: 0 } } }),
    });
    motes.program.setBlendFunc(gl.ONE, gl.ONE);
    motes.frustumCulled = false;
    motes.renderOrder = 2;
    motes.setParent(scene);

    const fig = new Mesh(gl, {
      geometry: new Geometry(gl, { position: { size: 2, data: new Float32Array([-0.5, 0, 0.5, 0, 0.5, 1, -0.5, 0, 0.5, 1, -0.5, 1]) } }),
      program: new Program(gl, { vertex: figVertex, fragment: figFragment, transparent: true, depthTest: false, depthWrite: false, cullFace: null, uniforms: { uCamPos: { value: new Vec3() } } }),
    });
    fig.frustumCulled = false;
    fig.renderOrder = 3;
    fig.setParent(scene);

    function resize() {
      renderer.setSize(host!.clientWidth, host!.clientHeight);
      camera.perspective({ aspect: host!.clientWidth / Math.max(1, host!.clientHeight) });
      bg.program.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height];
      // glow offsets are in CSS pixels, so the halo is the same width at any resolution
      lineRes.value = [host!.clientWidth, host!.clientHeight];
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    let visible = true;
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(host);
    let raf = 0;
    const t0 = performance.now();
    const gov = makeGovernor({
      start: t0,
      scale: renderer.dpr,
      floor: 0.5,
      apply: (sc) => {
        renderer.dpr = sc;
        resize();
      },
      onTooSlow,
    });
    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) {
        gov.rest(now);
        return;
      }
      gov.tick(now);
      const t = (now - t0) / 1000;
      const s = pathsAt(progress.current ?? 0);
      camera.position.copy(s.pos);
      camera.lookAt(s.tgt);
      const u = bg.program.uniforms;
      u.uCamPos.value.copy(s.pos);
      u.uCamLook.value.copy(s.tgt);
      u.uTime.value = t;
      u.uGlow.value = s.glow;
      reveal.value = s.reveal;
      motes.program.uniforms.uTime.value = t;
      fig.program.uniforms.uCamPos.value.copy(s.pos);
      renderer.render({ scene, camera });
    }
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      gl.canvas.remove();
    };
  }, [progress, onTooSlow]);
  return <div ref={hostRef} className={className} />;
}
