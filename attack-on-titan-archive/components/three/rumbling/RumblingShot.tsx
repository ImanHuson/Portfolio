"use client";

import { useEffect, useRef } from "react";
import { Camera, Geometry, Mesh, Program, Renderer, Transform, Triangle, Vec3 } from "ogl";
import { layout, rumblingAt, seaFragment, seaVertex, titanFragment, titanVertex } from "./rumbling";

export default function RumblingShot({ progress, className }: { progress: React.RefObject<number>; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const small = window.matchMedia("(max-width: 767px)").matches;
    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5), antialias: !small });
    } catch {
      return;
    }
    const gl = renderer.gl;
    gl.canvas.setAttribute("aria-hidden", "true");
    Object.assign(gl.canvas.style, { display: "block", width: "100%", height: "100%" });
    host.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 32, near: 0.5, far: 3000 });
    const FOV = (32 * Math.PI) / 180;
    const scene = new Transform();

    const shared = { uDark: { value: 0 }, uTime: { value: 0 } };
    const sea = new Mesh(gl, {
      geometry: new Triangle(gl),
      program: new Program(gl, {
        vertex: seaVertex,
        fragment: seaFragment,
        depthTest: false,
        depthWrite: false,
        uniforms: { ...shared, uRes: { value: [1, 1] }, uCamPos: { value: new Vec3() }, uCamLook: { value: new Vec3() }, uFov: { value: FOV } },
      }),
    });
    sea.frustumCulled = false;
    sea.renderOrder = -1;
    sea.setParent(scene);

    const items = layout(small ? 1100 : 2400);
    const offset = new Float32Array(items.length * 3);
    const params = new Float32Array(items.length * 3);
    items.forEach((t, i) => {
      offset.set([t.x, -1.6, t.z], i * 3);
      params.set([t.h, t.phase, t.order], i * 3);
    });
    const quad = new Float32Array([-0.5, 0, 0.5, 0, 0.5, 1, -0.5, 0, 0.5, 1, -0.5, 1]);
    const titans = new Mesh(gl, {
      geometry: new Geometry(gl, {
        position: { size: 2, data: quad },
        offset: { instanced: 1, size: 3, data: offset },
        params: { instanced: 1, size: 3, data: params },
      }),
      program: new Program(gl, {
        vertex: titanVertex,
        fragment: titanFragment,
        transparent: true,
        depthWrite: false,
        cullFace: null,
        uniforms: { ...shared, uCamPos: { value: new Vec3() }, uCount: { value: 0 } },
      }),
    });
    titans.frustumCulled = false;
    titans.setParent(scene);

    function resize() {
      renderer.setSize(host!.clientWidth, host!.clientHeight);
      camera.perspective({ aspect: host!.clientWidth / Math.max(1, host!.clientHeight) });
      sea.program.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height];
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
      const s = rumblingAt(progress.current ?? 0);
      shared.uTime.value = (now - t0) / 1000;
      shared.uDark.value = s.dark;
      camera.position.set(...s.pos);
      camera.lookAt(new Vec3(...s.look));
      sea.program.uniforms.uCamPos.value.set(...s.pos);
      sea.program.uniforms.uCamLook.value.set(...s.look);
      titans.program.uniforms.uCamPos.value.set(...s.pos);
      titans.program.uniforms.uCount.value = s.count;
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
  }, [progress]);

  return <div ref={hostRef} className={className} />;
}
