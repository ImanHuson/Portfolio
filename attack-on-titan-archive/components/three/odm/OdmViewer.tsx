"use client";

import { useEffect, useRef } from "react";
import { Camera, Cylinder, Mat4, Mesh, Quat, Renderer, Transform, Vec3 } from "ogl";
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

    // two trees for the anchors to bite into, only during the demo
    const trees: Mesh[] = [];
    for (const s of [-1, 1]) {
      const t = new Mesh(gl, { geometry: new Cylinder(gl, { radiusTop: 0.12, radiusBottom: 0.16, height: 6, radialSegments: 20 }), program: makeProgram(gl, { color: [0.2, 0.14, 0.09], metal: 0, rough: 0.8 }) });
      t.position.set(s * 1.9, 1.4, 3.4);
      t.program.uniforms.uOpacity.value = 0;
      t.setParent(scene);
      trees.push(t);
    }
    const targets = [new Vec3(-1.78, 1.9, 3.32), new Vec3(1.78, 2.05, 3.32)];

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
    const DEMO = 5.2; // seconds

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

      // ---- the movement demo: fire, reel, release
      let fly = 0;
      let wiresOn = false;
      let reach = 0; // 0 in the barrel .. 1 at the tree
      if (demoStart >= 0) {
        const t = now - demoStart;
        if (t > DEMO) demoStart = -1;
        const fireIn = ease(clamp01(t / 0.6));
        const reel = ease(clamp01((t - 0.9) / 1.8));
        const out = ease(clamp01((t - 3.0) / 0.5));
        const back = ease(clamp01((t - 3.6) / 1.4));
        reach = fireIn * (1 - out);
        wiresOn = t < 3.5;
        fly = reel * (1 - back);
        for (const tr of trees) tr.program.uniforms.uOpacity.value = Math.min(fireIn, 1 - back) * 0.9;
        gear.turbine.rotation.z += 0.1 + 0.9 * (reel > 0 && reel < 1 ? 1 : 0);
      } else {
        for (const tr of trees) tr.program.uniforms.uOpacity.value = 0;
        gear.turbine.rotation.z += reduced ? 0 : 0.02;
      }
      // the body is pulled toward the anchors, rising in an arc
      gear.root.position.set(0, fly * 0.95 + Math.sin(fly * Math.PI) * 0.25, fly * 1.85);
      gear.root.rotation.x = -fly * 0.35;

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
      for (const m of gear.ghostMeshes) m.program.uniforms.uOpacity.value = 0.95 * (1 - clamp01(explode * 1.6)) * (1 - fly * 0.6);

      // anchors: aim at the trees and fly out along their wires. ogl's lookAt
      // works in the parent's space and turns +z (the barrel) to the target.
      gear.anchorHeads.forEach((head, i) => {
        const mount = head.parent!;
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
        w.visible = wiresOn && reach > 0.02;
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
      const d = dist + fly * 2.6 + ease(clamp01(explode)) * 0.9;
      camera.position.set(center.x + follow.x * 0.6 + cx * d, center.y + follow.y * 0.6 + cy * d, center.z + follow.z * 0.6 + cz * d);
      tmp.set(center.x + follow.x * 0.6, center.y + follow.y * 0.6, center.z + follow.z * 0.6);
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
