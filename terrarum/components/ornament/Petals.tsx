"use client";

import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  z: number; // depth: 0.5 far .. 1.2 near (size and speed)
  spin: number;
  flip: number;
  vs: number;
  vf: number;
  drift: number;
}

// Fewer on a phone, where every petal crosses a line of text.
const count = () => (window.innerWidth < 768 ? 9 : 22);

/**
 * Cherry petals that drift across the page while the reader scrolls, then
 * fade and stop when scrolling stops, so nothing hangs still over the text.
 * One canvas, drawn only while there is motion; nothing under reduced motion.
 */
export function Petals() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0;
    let h = 0;
    let dpr = 1;
    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    };
    size();
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const petals: Petal[] = Array.from({ length: count() }, () => ({ x: rnd(0, 1), y: rnd(-0.2, 1), z: rnd(0.5, 1.2), spin: rnd(0, 6.28), flip: rnd(0, 6.28), vs: rnd(-0.6, 0.6), vf: rnd(1, 2.4), drift: rnd(0.2, 0.9) }));

    // A cherry petal: rounded, with the notch at its tip that cherry petals have.
    const shape = new Path2D("M0,-10 C6,-9 9,-3 8,3 C7,8 3,11 0,9 C-3,11 -7,8 -8,3 C-9,-3 -6,-9 0,-10 Z M0,9 L-1.6,12 L0,10.6 L1.6,12 Z");
    let alpha = 0;
    let energy = 0; // scroll energy: rises with scrolling, decays when still
    let lastY = window.scrollY;
    let last = performance.now();
    let raf = 0;

    const frame = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      const sy = window.scrollY;
      const dy = sy - lastY;
      lastY = sy;
      energy = Math.min(1, energy * Math.pow(0.12, dt) + Math.abs(dy) / 260);
      const target = energy > 0.04 ? 1 : 0;
      alpha += (target - alpha) * Math.min(1, dt * (target ? 5 : 1.6));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const p of petals) {
        // Falling and drifting, carried against the scroll direction like air past a moving reader.
        p.y += (0.05 * p.z * energy + 0.012 * p.z) * dt * 6 - (dy / h) * 0.35 * p.z;
        p.x += (p.drift * 0.04 * energy + Math.sin(p.flip) * 0.006) * dt * 6;
        p.spin += p.vs * dt * (0.6 + energy * 2);
        p.flip += p.vf * dt * (0.5 + energy * 2.5);
        if (p.y > 1.1) { p.y = -0.08; p.x = rnd(-0.1, 0.9); }
        if (p.y < -0.12) { p.y = 1.08; p.x = rnd(0, 1); }
        if (p.x > 1.08) p.x = -0.06;
        const px = p.x * w;
        const py = p.y * h;
        const s = 0.9 * p.z;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(p.spin);
        ctx.scale(s * Math.cos(p.flip), s);
        const g = ctx.createLinearGradient(0, -10, 0, 11);
        g.addColorStop(0, `rgba(255,236,240,${0.95 * alpha})`);
        g.addColorStop(1, `rgba(240,170,190,${0.85 * alpha})`);
        ctx.fillStyle = g;
        ctx.fill(shape);
        ctx.restore();
      }
      // Keep drawing only while something is visible or moving.
      if (alpha > 0.01 || energy > 0.01) raf = requestAnimationFrame(frame);
      else {
        ctx.clearRect(0, 0, w, h);
        raf = 0;
      }
    };
    const wake = () => {
      if (!raf && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", size);
    return () => {
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", size);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} className="petals" aria-hidden data-petals />;
}
