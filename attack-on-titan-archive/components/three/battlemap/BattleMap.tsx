"use client";

import { useEffect, useRef } from "react";
import { Camera, Cylinder, Geometry, Mesh, Plane, Program, Renderer, Transform, Vec3 } from "ogl";
import { BATTLES, WALL_KM, type Side } from "@/lib/data/war";

/** 1 unit = 100 km. Angles clockwise from north; north is -z. */
export const KM = 0.01;
export function sitePos(deg: number, km: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [Math.sin(a) * km * KM, -Math.cos(a) * km * KM];
}

// one height function, used by the terrain shader and to seat things on it
const H_GLSL = /* glsl */ `
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ s += a * noise(p); p = p * 2.03 + 11.7; a *= 0.5; } return s; }
float heightAt(vec2 p){
  // gentle country inside the Walls, rougher beyond them; illustrative only
  float r = length(p);
  float rough = smoothstep(4.6, 6.2, r);
  return (fbm(p * 0.55) - 0.45) * (0.35 + 0.6 * rough);
}`;

const terrainVertex = /* glsl */ `
attribute vec3 position;
attribute vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec2 vP;
varying float vH;
${H_GLSL}
void main(){
  vec2 p = position.xy;
  float h = heightAt(p);
  vP = p;
  vH = h;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p.x, h, p.y, 1.0);
}`;

const terrainFragment = /* glsl */ `
precision highp float;
varying vec2 vP;
varying float vH;
uniform vec3 uFocus;
uniform float uFocusR;
${H_GLSL}
void main(){
  float e = 0.03;
  float hx = heightAt(vP + vec2(e, 0.0)) - heightAt(vP - vec2(e, 0.0));
  float hz = heightAt(vP + vec2(0.0, e)) - heightAt(vP - vec2(0.0, e));
  vec3 n = normalize(vec3(-hx, 2.0 * e, -hz));
  float shade = clamp(dot(n, normalize(vec3(-0.6, 0.8, -0.3))), 0.0, 1.0);
  float r = length(vP);
  // land colour: muted, darker outside the Walls
  vec3 c = mix(vec3(0.13, 0.14, 0.11), vec3(0.2, 0.21, 0.17), smoothstep(-0.2, 0.25, vH));
  c *= mix(1.0, 0.7, smoothstep(4.8, 5.4, r));
  c *= 0.55 + 0.75 * shade;
  // contour lines every 25 "metres" of the illustrative relief
  float k = vH * 40.0;
  float line = smoothstep(0.43, 0.48, abs(fract(k) - 0.5));
  c = mix(c, vec3(0.62, 0.58, 0.48), line * 0.18);
  // the lost ring between Maria and Rose, faintly hatched
  float ring = step(3.8, r) * step(r, 4.8);
  float hatch = step(0.82, fract((vP.x + vP.y) * 6.0));
  c = mix(c, vec3(0.35, 0.12, 0.1), ring * hatch * 0.35);
  // focus: a warm pool of light on the battle
  float f = 1.0 - smoothstep(0.0, uFocusR, length(vP - uFocus.xz));
  c += vec3(0.25, 0.12, 0.06) * f * uFocus.y;
  // fade the map's edge into the page
  float edge = smoothstep(7.5, 6.2, r);
  gl_FragColor = vec4(c * edge + vec3(0.043, 0.047, 0.039) * (1.0 - edge), 1.0);
}`;

const flatVertex = /* glsl */ `
attribute vec3 position;
attribute vec3 normal;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
varying vec3 vN;
void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const flatFragment = /* glsl */ `
precision highp float;
uniform vec3 uColor;
varying vec3 vN;
void main(){ float l = 0.55 + 0.45 * abs(vN.y) + 0.2 * abs(vN.x); gl_FragColor = vec4(uColor * l, 1.0); }`;

const pointsVertex = /* glsl */ `
attribute vec3 position;
attribute vec3 color;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uSize;
varying vec3 vC;
void main(){ vC = color; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = uSize / -mv.z; gl_Position = projectionMatrix * mv; }`;
const pointsFragment = /* glsl */ `
precision highp float;
varying vec3 vC;
void main(){ vec2 d = gl_PointCoord - 0.5; float a = 1.0 - smoothstep(0.35, 0.5, length(d)); if (a < 0.01) discard; gl_FragColor = vec4(vC, a); }`;

const SIDE_COLOR: Record<Side, [number, number, number]> = {
  titan: [0.88, 0.41, 0.36],
  scout: [0.85, 0.82, 0.72],
  garrison: [0.64, 0.61, 0.53],
  marley: [0.5, 0.48, 0.42],
};

export type MapApi = { focus: (id: string | null) => void };

const SHORT: Record<string, string> = { trost: "Trost", forest: "57th", stohess: "Stohess", utgard: "Utgard", shiganshina: "Shiganshina" };

export default function BattleMap({
  apiRef,
  reduced,
  className,
  onPick,
}: {
  apiRef: React.RefObject<MapApi | null>;
  reduced: boolean;
  className?: string;
  onPick: (id: string) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 1.75), antialias: true });
    } catch {
      return;
    }
    const gl = renderer.gl;
    gl.clearColor(0.043, 0.047, 0.039, 1);
    const canvas = gl.canvas;
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, { display: "block", width: "100%", height: "100%" });
    host.prepend(canvas);

    const camera = new Camera(gl, { fov: 32, near: 0.05, far: 60 });
    const scene = new Transform();

    // ---- terrain: a grid in the xz plane (the plane is built in xy; the shader maps y to z)
    const terrainProgram = new Program(gl, {
      vertex: terrainVertex,
      fragment: terrainFragment,
      // the grid is built facing +z and laid down in the shader, so it faces down: draw both sides
      cullFace: null,
      uniforms: { uFocus: { value: new Vec3(0, 0, 0) }, uFocusR: { value: 0.6 } },
    });
    const terrain = new Mesh(gl, { geometry: new Plane(gl, { width: 15, height: 15, widthSegments: 220, heightSegments: 220 }), program: terrainProgram });
    // the grid is flat in xy and lifted in the shader: its bounds would cull it wrongly
    terrain.frustumCulled = false;
    terrain.setParent(scene);

    // ---- the three Walls, and district bulges where the story places them
    // open rings: draw both faces, or the far side of each Wall vanishes
    const wallProgram = (c: [number, number, number]) => new Program(gl, { vertex: flatVertex, fragment: flatFragment, cullFace: null, uniforms: { uColor: { value: c } } });
    for (const km of [WALL_KM.sina, WALL_KM.rose, WALL_KM.maria]) {
      const w = new Mesh(gl, { geometry: new Cylinder(gl, { radiusTop: km * KM, radiusBottom: km * KM, height: 0.1, radialSegments: 160, openEnded: true }), program: wallProgram([0.78, 0.74, 0.64]) });
      w.position.y = 0.05;
      w.setParent(scene);
    }
    const districts: [number, number][] = [
      [180, WALL_KM.maria], // Shiganshina
      [180, WALL_KM.rose], // Trost
      [90, WALL_KM.rose], // Karanes
      [90, WALL_KM.sina], // Stohess
    ];
    for (const [deg, km] of districts) {
      const [x, z] = sitePos(deg, km);
      const d = new Mesh(gl, { geometry: new Cylinder(gl, { radiusTop: 0.2, radiusBottom: 0.2, height: 0.12, radialSegments: 32, thetaLength: Math.PI, openEnded: true }), program: wallProgram([0.78, 0.74, 0.64]) });
      d.position.set(x, 0.04, z);
      // the half-ring opens outward, away from the centre
      d.rotation.y = -((deg * Math.PI) / 180) + Math.PI / 2;
      d.setParent(scene);
    }

    // ---- forces: points that converge on the chosen battle
    const MAXP = 90;
    const pos = new Float32Array(MAXP * 3);
    const col = new Float32Array(MAXP * 3);
    const pgeo = new Geometry(gl, { position: { size: 3, data: pos }, color: { size: 3, data: col } });
    const points = new Mesh(gl, {
      mode: gl.POINTS,
      geometry: pgeo,
      program: new Program(gl, { vertex: pointsVertex, fragment: pointsFragment, transparent: true, depthTest: false, uniforms: { uSize: { value: 34 } } }),
    });
    points.frustumCulled = false;
    points.setParent(scene);
    type Tok = { side: Side; ang: number; r0: number; speed: number; phase: number };
    let tokens: Tok[] = [];
    let focusXZ: [number, number] = [0, 0];

    // ---- camera: strategic view, or a dive onto one battle
    const STRAT = { pos: new Vec3(0, 10.6, 10.2), look: new Vec3(0, 0, 1.1) };
    const cam = { pos: STRAT.pos.clone(), look: STRAT.look.clone() };
    const goal = { pos: STRAT.pos.clone(), look: STRAT.look.clone() };
    let focusAmt = 0;
    let focusGoal = 0;

    apiRef.current = {
      focus: (id) => {
        const b = BATTLES.find((x) => x.id === id);
        if (!b) {
          goal.pos.copy(STRAT.pos);
          goal.look.copy(STRAT.look);
          focusGoal = 0;
          tokens = [];
          return;
        }
        const [x, z] = sitePos(b.at.deg, b.at.km);
        focusXZ = [x, z];
        // come in from the map's centre side, low and close
        const out = new Vec3(x, 0, z).normalize();
        const back = out.len() > 0 ? out : new Vec3(0, 0, 1);
        goal.look.set(x, 0, z);
        goal.pos.set(x - back.x * 1.1 + 0.25, 1.35, z - back.z * 1.1 + 1.25);
        focusGoal = 1;
        tokens = [];
        b.forces.forEach((f, fi) => {
          const n = f.side === "titan" ? 32 : 24;
          for (let k = 0; k < n; k++) {
            tokens.push({
              side: f.side,
              // titans come from outside (away from the centre), defenders from inside
              ang: Math.atan2(back.z, back.x) + (f.side === "titan" ? 0 : Math.PI) + (Math.random() - 0.5) * 1.6 + fi * 0.2,
              r0: 0.45 + Math.random() * 0.5,
              speed: 0.08 + Math.random() * 0.1,
              phase: Math.random(),
            });
          }
        });
      },
    };

    function resize() {
      const w = host!.clientWidth;
      const h = host!.clientHeight;
      renderer.setSize(w, h);
      camera.perspective({ aspect: w / Math.max(1, h) });
      // portrait: stand further back so the whole of Wall Maria fits
      // portrait: far enough back that the width of Wall Maria (radius 4.8) fits the narrow horizontal field
      STRAT.pos.set(0, w / h < 0.9 ? 23.5 : 10.6, w / h < 0.9 ? 19.6 : 10.2);
      if (focusGoal === 0) {
        goal.pos.copy(STRAT.pos);
        // on load or resize, start framed: no fly-in from a stale position
        cam.pos.copy(STRAT.pos);
        cam.look.copy(STRAT.look);
      }
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(host);
    let raf = 0;
    const t0 = performance.now();

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      const t = (now - t0) / 1000;
      const k = reduced ? 1 : 0.06;
      cam.pos.lerp(goal.pos, k);
      cam.look.lerp(goal.look, k);
      // settle exactly, or the markers drift by fractions of a pixel forever
      if (cam.pos.distance(goal.pos) < 0.002 && cam.look.distance(goal.look) < 0.002) {
        cam.pos.copy(goal.pos);
        cam.look.copy(goal.look);
      }
      focusAmt += (focusGoal - focusAmt) * k;
      camera.position.copy(cam.pos);
      camera.lookAt(cam.look);
      terrainProgram.uniforms.uFocus.value.set(focusXZ[0], focusAmt, focusXZ[1]);

      // forces converge on the site, fade at the centre, and start again
      let i = 0;
      for (const tk of tokens) {
        if (i >= MAXP) break;
        const u = reduced ? 0.55 : (tk.phase + t * tk.speed) % 1;
        const r = tk.r0 * (1 - u) + 0.04;
        const wob = Math.sin(t * 2 + tk.phase * 20) * 0.03;
        pos[i * 3] = focusXZ[0] + Math.cos(tk.ang + wob) * r;
        pos[i * 3 + 1] = 0.18;
        pos[i * 3 + 2] = focusXZ[1] + Math.sin(tk.ang + wob) * r;
        const c = SIDE_COLOR[tk.side];
        const a = Math.min(1, u * 5) * Math.min(1, (1 - u) * 4) * focusAmt;
        col[i * 3] = c[0] * a;
        col[i * 3 + 1] = c[1] * a;
        col[i * 3 + 2] = c[2] * a;
        i++;
      }
      for (let j = i; j < MAXP; j++) {
        pos[j * 3 + 1] = -99;
        col[j * 3] = col[j * 3 + 1] = col[j * 3 + 2] = 0;
      }
      pgeo.attributes.position.needsUpdate = true;
      pgeo.attributes.color.needsUpdate = true;

      renderer.render({ scene, camera });

      // markers: real buttons, pinned to the map
      const w = host!.clientWidth;
      const h = host!.clientHeight;
      for (const b of BATTLES) {
        const el = markerRefs.current[b.id];
        if (!el) continue;
        const [x, z] = sitePos(b.at.deg, b.at.km);
        const v = new Vec3(x, 0.14, z);
        camera.project(v);
        const px = ((v.x + 1) / 2) * w;
        el.style.transform = `translate(${px}px, ${((1 - v.y) / 2) * h}px)`;
        el.style.visibility = v.z < 1 ? "visible" : "hidden";
        // a label reads leftward when it would not fit to the right
        el.dataset.side = px + el.offsetWidth > w - 6 ? "left" : "right";
      }
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      apiRef.current = null;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [apiRef, reduced]);

  return (
    <div ref={hostRef} className={className}>
      {BATTLES.map((b) => (
        <button
          key={b.id}
          type="button"
          ref={(el) => {
            markerRefs.current[b.id] = el;
          }}
          onClick={() => onPick(b.id)}
          aria-label={`${b.year} ${b.name}`}
          className="group absolute top-0 left-0 -mt-3 -ml-2 flex items-center gap-2 py-1 pr-2 text-left data-[side=left]:-translate-x-[calc(100%-1.25rem)] data-[side=left]:flex-row-reverse data-[side=left]:pr-0 data-[side=left]:pl-2"
        >
          <span className="relative block size-4 rounded-full border-2 border-alert bg-alert/30 transition-transform group-hover:scale-125 group-focus-visible:scale-125">
            <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-alert/40 motion-reduce:hidden" />
          </span>
          <span className="font-mono text-meta tracking-[0.12em] whitespace-nowrap text-paper uppercase [text-shadow:0_1px_6px_rgba(0,0,0,0.95)] md:text-meta">
            {/* small screens have no room for the full name on either side of a marker */}
            <span className="sm:hidden">{SHORT[b.id] ?? b.name}</span>
            <span className="hidden sm:inline">
              {b.year} {b.name}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
