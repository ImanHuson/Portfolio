"use client";

import { useEffect, useRef } from "react";
import { Camera, Cylinder, Mat4, Mesh, Plane, Program, Quat, Renderer, Transform, Vec3 } from "ogl";
import { buildGear, makeProgram } from "./gear";

export type OdmApi = {
  setExplode: (t: number) => void;
  setActive: (id: string | null) => void;
  demo: () => void;
};

/**
 * The gear in 3D. Drag to turn it (on touch, a horizontal drag; vertical
 * swipes still scroll the page). Labels are HTML, pinned to parts by
 * projection each frame. State comes in through `apiRef`, never React
 * re-renders, so dragging and exploding never re-render the page.
 */
export default function OdmViewer({
  apiRef,
  labels,
  reduced,
  className,
  onReady,
}: {
  apiRef: React.RefObject<OdmApi | null>;
  labels: { id: string; name: string }[];
  reduced: boolean;
  className?: string;
  onReady?: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2), alpha: true, antialias: true, preserveDrawingBuffer: true });
    } catch {
      return;
    }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, { display: "block", width: "100%", height: "100%", touchAction: "pan-y", cursor: "grab" });
    host.prepend(canvas);

    const camera = new Camera(gl, { fov: 30, near: 0.05, far: 30 });
    const scene = new Transform();
    const gear = buildGear(gl);
    gear.root.setParent(scene);
    // wires are placed in world space (belt to anchor), so they must not ride on the moving body
    for (const w of gear.wires) w.setParent(scene);

    // two trees for the anchors to bite into, only during the demo
    const trees: Mesh[] = [];
    for (const s of [-1, 1]) {
      const t = new Mesh(gl, { geometry: new Cylinder(gl, { radiusTop: 0.28, radiusBottom: 0.4, height: 12, radialSegments: 24 }), program: makeProgram(gl, { color: [0.2, 0.14, 0.09], metal: 0, rough: 0.8 }) });
      t.position.set(s * 3.2, 5, 8);
      t.program.uniforms.uOpacity.value = 0;
      t.setParent(scene);
      trees.push(t);
    }
    // the ground, only during the demo: a faint surveyor's grid at the wearer's feet
    const ground = new Mesh(gl, {
      geometry: new Plane(gl, { width: 40, height: 40 }),
      program: new Program(gl, {
        transparent: true,
        depthWrite: false,
        cullFace: null,
        vertex: `attribute vec3 position; uniform mat4 modelMatrix; uniform mat4 viewMatrix; uniform mat4 projectionMatrix; varying vec3 vW;
          void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
        fragment: `precision highp float; uniform float uOpacity; uniform vec3 uShadow; varying vec3 vW;
          void main(){ vec2 g = abs(fract(vW.xz) - 0.5); float line = smoothstep(0.47, 0.5, max(g.x, g.y));
            float fade = 1.0 - smoothstep(4.0, 16.0, length(vW.xz - vec2(0.0, 4.0)));
            float shadow = (1.0 - smoothstep(0.0, 0.45, length(vW.xz - uShadow.xz))) * uShadow.y;
            gl_FragColor = vec4(vec3(0.8, 0.76, 0.66) * line, (line * 0.35 * fade + shadow * 0.55) * uOpacity); }`,
        uniforms: { uOpacity: { value: 0 }, uShadow: { value: new Vec3() } },
      }),
    });
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.95;
    ground.setParent(scene);
    // where the anchors bite: the near face of each trunk, 4.5 m up
    const targets = [new Vec3(-2.93, 4.5, 7.72), new Vec3(2.93, 4.7, 7.72)];

    // ---- camera orbit
    let yaw = -0.75;
    let pitch = 0.18;
    let dist = 3.2;
    const center = new Vec3(0, 0.05, 0.05);
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let idleSince = performance.now();
    function onDown(e: PointerEvent) {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.style.cursor = "grabbing";
      if (e.pointerType !== "touch") canvas.setPointerCapture(e.pointerId);
    }
    function onMove(e: PointerEvent) {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      yaw -= dx * 0.008;
      if (e.pointerType !== "touch") pitch = Math.min(1.1, Math.max(-0.6, pitch + dy * 0.006));
      idleSince = performance.now();
    }
    function onUp() {
      dragging = false;
      canvas.style.cursor = "grab";
      idleSince = performance.now();
    }
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    function resize() {
      const w = host!.clientWidth;
      const h = host!.clientHeight;
      renderer.setSize(w, h);
      camera.perspective({ aspect: w / Math.max(1, h) });
      // fit: portrait frames need to stand further back
      dist = w / h < 0.9 ? 4.3 : 3.0;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // ---- state driven from outside
    let explodeTarget = 0;
    let explode = 0;
    let active: string | null = null;
    let demoStart = -1;
    const DEMO = 7.5; // seconds, at half speed
    // ---- the simulation: the wearer as a point mass at the belt, two
    // inextensible wires that can only pull, reeled in at a fixed rate, a
    // little gas thrust while reeling, then release and free flight.
    const G = 9.81;
    const SLOW = 0.5; // shown at half speed
    const ANCHOR_SPEED = 45; // m/s
    const REEL = 7; // m/s
    const THRUST = 3; // m/s^2
    const sim = {
      P: new Vec3(),
      V: new Vec3(),
      simT: 0,
      hook: [0, 0], // 0..1 of the anchor's flight
      L: [0, 0], // wire lengths once attached
      attached: false,
      released: false,
      landedAt: -1,
    };
    const hookFrom = [new Vec3(-0.18, 0, -0.1), new Vec3(0.18, 0, -0.1)]; // barrels, relative to the belt
    function simReset() {
      sim.P.set(0, 0, 0);
      sim.V.set(0, 0, 0);
      sim.simT = 0;
      sim.hook = [0, 0];
      sim.L = [0, 0];
      sim.attached = false;
      sim.released = false;
      sim.landedAt = -1;
    }
    function simStep(dt: number) {
      sim.simT += dt;
      const t = sim.simT;
      // fire: the anchors fly out along straight lines
      for (let i = 0; i < 2; i++) {
        const from = new Vec3().copy(hookFrom[i]).add(sim.P);
        const dist = from.distance(targets[i]);
        sim.hook[i] = Math.min(1, sim.hook[i] + (ANCHOR_SPEED * dt) / Math.max(dist, 0.1));
      }
      if (!sim.attached && sim.hook[0] >= 1 && sim.hook[1] >= 1) {
        sim.attached = true;
        for (let i = 0; i < 2; i++) sim.L[i] = new Vec3().copy(hookFrom[i]).add(sim.P).distance(targets[i]);
      }
      // forces
      sim.V.y -= G * dt;
      if (sim.attached && !sim.released) {
        const mid = new Vec3().copy(targets[0]).add(targets[1]).scale(0.5);
        const dir = new Vec3().sub(mid, sim.P).normalize();
        sim.V.add(dir.scale(THRUST * dt));
        for (let i = 0; i < 2; i++) sim.L[i] = Math.max(0.6, sim.L[i] - REEL * dt);
      }
      sim.P.add(new Vec3().copy(sim.V).scale(dt));
      // wire constraints: pull only
      if (sim.attached && !sim.released) {
        for (let i = 0; i < 2; i++) {
          const a = targets[i];
          const d = new Vec3().sub(new Vec3().copy(hookFrom[i]).add(sim.P), a);
          const len = d.len();
          if (len > sim.L[i]) {
            d.scale(1 / len);
            sim.P.sub(new Vec3().copy(d).scale(len - sim.L[i]));
            const out = sim.V.dot(d);
            if (out > 0) sim.V.sub(new Vec3().copy(d).scale(out));
          }
        }
        // let go before hitting the trunks: close enough, or after 2.2 s
        const mid = new Vec3().copy(targets[0]).add(targets[1]).scale(0.5);
        if (sim.P.distance(mid) < 2.6 || t > 2.2) {
          sim.released = true;
          sim.V.y += 2.5; // a last kick of gas, up and over
        }
      }
      // the ground
      if (sim.P.y < 0) {
        sim.P.y = 0;
        if (sim.V.y < 0) sim.V.y = 0;
        sim.V.x *= 0.8;
        sim.V.z *= 0.8;
        if (sim.released && sim.landedAt < 0) sim.landedAt = t;
      }
    }

    apiRef.current = {
      setExplode: (t) => {
        explodeTarget = t;
        idleSince = performance.now();
      },
      setActive: (id) => {
        active = id;
        idleSince = performance.now();
      },
      demo: () => {
        explodeTarget = 0;
        demoStart = performance.now() / 1000;
      },
    };

    const tmp = new Vec3();
    const up = new Vec3(0, 1, 0);
    const q = new Quat();
    function placeWire(w: Mesh, a: Vec3, b: Vec3) {
      const d = new Vec3().sub(b, a);
      const len = d.len();
      w.position.copy(a).add(b).scale(0.5);
      w.scale.set(1, len, 1);
      d.normalize();
      // rotate +y onto d
      const axis = new Vec3().cross(up, d);
      const angle = Math.acos(Math.min(1, Math.max(-1, up.dot(d))));
      if (axis.len() < 1e-5) q.set(0, 0, 0, 1);
      else q.fromAxisAngle(axis.normalize(), angle);
      w.quaternion.copy(q);
    }

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(host);
    let readySent = false;
    const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
    const ease = (x: number) => x * x * (3 - 2 * x);

    function frame(nowMs: number) {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      const now = nowMs / 1000;
      explode += (explodeTarget - explode) * (reduced ? 1 : 0.12);

      // slow turn when nobody is touching it
      if (!reduced && !dragging && nowMs - idleSince > 4000 && demoStart < 0) yaw += 0.0025;

      // ---- the movement demo, simulated
      let fly = 0;
      let wiresOn = false;
      if (demoStart >= 0) {
        const t = now - demoStart;
        // run the simulation up to t (at half speed), in small fixed steps
        const target = t * SLOW;
        let n = 0;
        while (sim.simT < target && n++ < 200) simStep(1 / 240);
        const landedFor = sim.landedAt >= 0 ? sim.simT - sim.landedAt : 0;
        const fadeOut = clamp01((landedFor - 0.6) / 0.5);
        if (t > DEMO || fadeOut >= 1) {
          demoStart = -1;
          simReset();
        }
        wiresOn = !sim.released;
        fly = clamp01(sim.P.len() / 6);
        const treeA = Math.min(clamp01(t / 0.3), 1 - fadeOut) * 0.95;
        for (const tr of trees) tr.program.uniforms.uOpacity.value = treeA;
        ground.program.uniforms.uOpacity.value = treeA;
        ground.program.uniforms.uShadow.value.set(sim.P.x, 1 - clamp01(sim.P.y / 6), sim.P.z);
        gear.turbine.rotation.z += sim.attached && !sim.released ? 1.1 : 0.15;
        // lean into the pull, then level out in the air
        const pitch = sim.released ? Math.max(-0.2, -Math.atan2(sim.V.y, 6)) : -Math.min(0.5, sim.V.len() * 0.05);
        gear.root.rotation.x += (pitch - gear.root.rotation.x) * 0.1;
        gear.root.position.copy(sim.P);
        if (fadeOut > 0) gear.root.position.lerp(new Vec3(0, 0, 0), fadeOut);
      } else {
        for (const tr of trees) tr.program.uniforms.uOpacity.value = 0;
        ground.program.uniforms.uOpacity.value = 0;
        gear.turbine.rotation.z += reduced ? 0 : 0.02;
        gear.root.position.set(0, 0, 0);
        gear.root.rotation.x += (0 - gear.root.rotation.x) * 0.1;
      }

      // parts: explode offsets, highlight, dim the others when one is chosen
      for (const p of gear.parts) {
        const k = ease(clamp01(explode));
        p.sides.right.position.set(p.explode.x * k, p.explode.y * k, p.explode.z * k);
        p.sides.left.position.set(-p.explode.x * k, p.explode.y * k, p.explode.z * k);
        p.sides.centre.position.set(0, p.explode.y * k, p.explode.z * k);
        const on = active === p.id;
        for (const m of p.meshes) {
          m.program.uniforms.uHighlight.value = on ? 1 : 0;
          m.program.uniforms.uOpacity.value = active && !on ? 0.4 : 1;
        }
      }
      for (const m of gear.ghostMeshes) m.program.uniforms.uOpacity.value = 0.8 * (1 - clamp01(explode * 1.6)) * (1 - fly * 0.6);

      // anchors: aim at the trees and fly out along their wires. ogl's lookAt
      // works in the parent's space and turns +z (the barrel) to the target.
      gear.anchorHeads.forEach((head, i) => {
        const mount = head.parent!;
        const reach = demoStart >= 0 && !sim.released ? sim.hook[i] : 0;
        if (reach > 0) {
          mount.parent!.updateMatrixWorld();
          const inv = new Mat4().inverse(mount.parent!.worldMatrix);
          const local = new Vec3().copy(targets[i]).applyMatrix4(inv);
          mount.lookAt(local);
          head.position.set(0, 0, 0.05 + (local.distance(mount.position) - 0.05) * reach);
        } else {
          head.position.set(0, 0, 0.05);
          mount.rotation.set(0, (i === 0 ? -1 : 1) * 0.9, 0);
        }
      });
      gear.wires.forEach((w, i) => {
        w.visible = wiresOn && sim.hook[i] > 0.02;
        if (!w.visible) return;
        const mount = gear.anchorHeads[i].parent!;
        mount.updateMatrixWorld();
        const a = new Vec3(0, 0, 0).applyMatrix4(mount.worldMatrix);
        gear.anchorHeads[i].updateMatrixWorld();
        const b = new Vec3(0, 0, 0).applyMatrix4(gear.anchorHeads[i].worldMatrix);
        placeWire(w, a, b);
      });

      // during the demo the camera swings behind the wearer, looking where the anchors go
      if (demoStart >= 0) {
        const want = Math.PI + 0.45;
        const dy = ((want - yaw + Math.PI) % (Math.PI * 2)) - Math.PI;
        yaw += dy * 0.06;
        pitch += (0.28 - pitch) * 0.06;
      }
      // camera
      const cx = Math.cos(pitch) * Math.sin(yaw);
      const cy = Math.sin(pitch);
      const cz = Math.cos(pitch) * Math.cos(yaw);
      const follow = gear.root.position;
      const d = dist + fly * 2.2 + ease(clamp01(explode)) * 0.9;
      camera.position.set(center.x + follow.x * 0.85 + cx * d, center.y + follow.y * 0.85 + cy * d, center.z + follow.z * 0.85 + cz * d);
      tmp.set(center.x + follow.x * 0.85, center.y + follow.y * 0.85, center.z + follow.z * 0.85);
      camera.lookAt(tmp);
      scene.traverse((o) => {
        const m = o as Mesh;
        if (m.program?.uniforms?.uCamPos) m.program.uniforms.uCamPos.value = camera.position;
      });

      renderer.render({ scene, camera });

      // labels, pinned to their parts
      const w = host!.clientWidth;
      const h = host!.clientHeight;
      const showLabels = explode > 0.35 || !!active;
      for (const p of gear.parts) {
        const el = labelRefs.current[p.id];
        if (!el) continue;
        // labels pin to the right-hand piece (or the centre one for single parts)
        const g = p.anchor.x > 0.02 ? p.sides.right : p.sides.centre;
        g.updateMatrixWorld();
        const v = new Vec3().copy(p.anchor).applyMatrix4(g.worldMatrix);
        camera.project(v);
        const on = showLabels && (!active || active === p.id) && v.z < 1;
        el.style.opacity = on ? "1" : "0";
        el.style.transform = `translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * h}px)`;
      }
      if (!readySent) {
        readySent = true;
        onReady?.();
      }
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      apiRef.current = null;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [apiRef, reduced, onReady]);

  return (
    <div ref={hostRef} className={className}>
      {labels.map((l) => (
        <span
          key={l.id}
          ref={(el) => {
            labelRefs.current[l.id] = el;
          }}
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 font-mono text-[0.68rem] tracking-[0.12em] whitespace-nowrap text-paper uppercase opacity-0 transition-opacity duration-200 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]"
        >
          <span className="mr-1.5 inline-block size-1.5 -translate-y-px rounded-full bg-flare align-middle" />
          {l.name}
        </span>
      ))}
    </div>
  );
}
