"use client";

import { useEffect, useRef } from "react";
import { Camera, Renderer, Transform } from "ogl";
import { createPlanet } from "./Planet";
import { createStars } from "./Stars";
import { createDust } from "./Dust";
import { createShaft } from "./Shaft";
import { shotAt } from "./choreography";

/**
 * The Mars descent. Pure ogl (this repo's proven WebGL path in this
 * environment), split into modules: Planet / Stars / Dust / Shaft /
 * choreography. Scroll progress arrives through a ref, never React state,
 * so scrubbing never re-renders React (the jitter lesson from
 * red-rising-archive).
 *
 * `still` renders a single composed frame and stops: used for
 * prefers-reduced-motion, where the planet is imagery, not motion.
 */
export default function MarsDescent({
  progress,
  still = false,
  stillAt = 0.42,
  className,
}: {
  progress?: React.RefObject<number>;
  still?: boolean;
  stillAt?: number;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const small = window.matchMedia("(max-width: 767px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5);

    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr, alpha: false, antialias: !small, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL: the CSS planet behind this canvas stays visible
    }
    const gl = renderer.gl;
    gl.clearColor(0.027, 0.027, 0.039, 1);
    gl.canvas.setAttribute("aria-hidden", "true");
    gl.canvas.style.display = "block";
    host.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 38, near: 0.05, far: 100 });
    const scene = new Transform();
    const planet = createPlanet(gl, small ? 96 : 160);
    planet.setParent(scene);
    const stars = createStars(gl, small ? 900 : 1800, dpr);
    stars.setParent(scene);

    const dustScene = new Transform();
    const dustCam = new Camera(gl, { fov: 60, near: 0.05, far: 50 });
    const dust = createDust(gl, small ? 260 : 600, dpr);
    dust.setParent(dustScene);

    const shaftScene = new Transform();
    const shaftCam = new Camera(gl);
    const shaft = createShaft(gl);
    shaft.setParent(shaftScene);

    function resize() {
      const w = host!.clientWidth;
      const h = host!.clientHeight;
      renderer.setSize(w, h);
      camera.perspective({ aspect: w / h });
      dustCam.perspective({ aspect: w / h });
      shaft.program.uniforms.uRes.value = [w, h];
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const start = performance.now();
    function frame(p: number, t: number) {
      const s = shotAt(p);
      camera.position.set(...s.cam);
      camera.lookAt(s.target);
      planet.rotation.y = s.spin + t * 0.02;
      planet.visible = s.planetFade > 0.002;
      planet.program.uniforms.uFade.value = s.planetFade;
      stars.program.uniforms.uFade.value = s.starFade;
      stars.program.uniforms.uTime.value = t;
      dust.program.uniforms.uIntensity.value = s.dust;
      dust.program.uniforms.uTravel.value = s.travel;
      dust.program.uniforms.uTime.value = t;
      shaft.program.uniforms.uMix.value = s.shaftMix;
      shaft.program.uniforms.uTravel.value = s.shaftTravel + t * 0.05 * s.shaftMix;
      shaft.program.uniforms.uLamp.value = s.lamp;

      renderer.render({ scene, camera });
      if (s.dust > 0.001) renderer.render({ scene: dustScene, camera: dustCam, clear: false });
      if (s.shaftMix > 0.001) renderer.render({ scene: shaftScene, camera: shaftCam, clear: false });
    }

    if (still) {
      frame(stillAt, 0);
      return () => {
        ro.disconnect();
        gl.canvas.remove();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }

    let raf: number | null = null;
    const loop = () => {
      frame(progress?.current ?? 0, (performance.now() - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    // Only render while on screen: the opening is a long pinned section,
    // and nothing below it should pay for a GPU loop it can't see.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && raf === null) loop();
      else if (!entry.isIntersecting && raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    });
    io.observe(host);
    frame(progress?.current ?? 0, 0);

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [progress, still, stillAt]);

  return <div ref={hostRef} className={className} />;
}
