"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import { fragment, vertex } from "./cellarShader";
import { cellarAt } from "./cellarPath";

/**
 * The descent into the Yeager cellar: one raymarched full-screen pass (see
 * cellarShader). Scroll progress arrives through a ref, never React state.
 * Draws only while on screen, and lowers its own resolution when frames run
 * long, because the cost is per pixel.
 */
export default function CellarShot({
  progress,
  className,
  onTooSlow,
}: {
  progress: React.RefObject<number>;
  className?: string;
  /** called once if frames stay slow even at the lowest resolution: show the stills instead */
  onTooSlow?: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const small = window.matchMedia("(max-width: 767px)").matches;
    let scale = Math.min(window.devicePixelRatio || 1, small ? 0.75 : 1);

    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr: scale, alpha: false, antialias: false, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL: the section's dark ground and the text beats remain
    }
    const gl = renderer.gl;
    gl.clearColor(0.02, 0.02, 0.02, 1);
    gl.canvas.setAttribute("aria-hidden", "true");
    Object.assign(gl.canvas.style, { display: "block", width: "100%", height: "100%" });
    host.appendChild(gl.canvas);

    const program = new Program(gl, {
      vertex,
      fragment,
      depthTest: false,
      uniforms: {
        uRes: { value: [1, 1] },
        uCamPos: { value: [0, 0, 0] },
        uCamLook: { value: [0, 0, -1] },
        uFov: { value: 1.05 },
        uTime: { value: 0 },
        uDoor: { value: 0 },
        uDrawer: { value: 0 },
        uBooks: { value: 0 },
        uWhite: { value: 0 },
        uLantern: { value: 0 },
        uSteps: { value: small ? 80 : 110 },
        uKeyIn: { value: 0 },
        uKeyTurn: { value: 0 },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    function resize() {
      renderer.dpr = scale;
      renderer.setSize(host!.clientWidth, host!.clientHeight);
      program.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height];
      // a wider field on portrait screens, so the stair still fits
      const aspect = host!.clientWidth / Math.max(1, host!.clientHeight);
      program.uniforms.uFov.value = aspect < 0.8 ? 1.3 : 1.05;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(host);

    let raf = 0;
    let lastT = performance.now();
    const start = lastT;
    // adaptive resolution, judged on time, not frame counts: a device at one
    // frame a second would need minutes to trip a counter
    let ema = 20; // smoothed frame time, ms
    let lastAdjust = start + 1000; // ignore the first second (shader compile)
    let gaveUp = false;
    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) {
        lastT = now;
        return;
      }
      const dt = now - lastT;
      lastT = now;
      ema = ema * 0.85 + dt * 0.15;
      if (now - lastAdjust > 1500 && ema > 34) {
        if (scale > 0.45) {
          scale = Math.max(0.45, scale * 0.75);
          resize();
          lastAdjust = now;
          ema = 24;
        } else if (!gaveUp && onTooSlow && now - lastAdjust > 3000) {
          // too slow even at the floor: hand over to the stills
          gaveUp = true;
          onTooSlow();
        }
      }
      const t = (now - start) / 1000;
      const s = cellarAt(progress.current ?? 0, t);
      const u = program.uniforms;
      u.uCamPos.value = s.pos;
      u.uCamLook.value = s.look;
      u.uTime.value = t;
      u.uDoor.value = s.door;
      u.uDrawer.value = s.drawer;
      u.uBooks.value = s.books;
      u.uWhite.value = s.white;
      u.uLantern.value = s.lantern;
      u.uKeyIn.value = s.keyIn;
      u.uKeyTurn.value = s.keyTurn;
      renderer.render({ scene: mesh });
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
