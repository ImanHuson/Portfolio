"use client";

import { useEffect, useRef } from "react";

/*
 * How a swing works, as a diagram: an anchor fired into a tree, the wire
 * reeled in so the wearer swings along an arc toward it, then released into
 * free flight and a landing. A simple model, labelled as one: a point mass,
 * one wire that only pulls, a fixed reel rate. Drawn once per frame while it
 * plays (about three seconds), on a handful of SVG attributes.
 */

const INK = "#e6dfc8";
const GROUND = 300;
const A = { x: 560, y: 70 }; // where the anchor bites
const START = { x: 120, y: 220 };

type State = { body: { x: number; y: number }; wire: number; label: string };

function at(t: number): State {
  // 0..0.18 the anchor flies; 0.18..0.62 reel and swing; 0.62..1 free flight
  if (t < 0.18) return { body: START, wire: t / 0.18, label: "Fire the anchor" };
  if (t < 0.62) {
    const k = (t - 0.18) / 0.44;
    const r0 = Math.hypot(START.x - A.x, START.y - A.y);
    const r = r0 * (1 - 0.55 * k); // the reel shortens the wire
    const a0 = Math.atan2(START.y - A.y, START.x - A.x);
    const a = a0 + (Math.PI / 2 - a0 + 0.55) * (k * k * (3 - 2 * k)); // swing down and through
    return { body: { x: A.x + Math.cos(a) * r, y: A.y + Math.sin(a) * r }, wire: 1, label: "Reel in, swing through" };
  }
  const k = (t - 0.62) / 0.38;
  const rel = at(0.6199).body;
  const vx = 360, vy = -260; // velocity at release, px per unit time
  return {
    body: { x: rel.x + vx * k, y: Math.min(GROUND - 8, rel.y + vy * k + 620 * k * k) },
    wire: 0,
    label: k < 0.8 ? "Release: free flight" : "Land",
  };
}

export default function OdmMotion({ play }: { play: number }) {
  const body = useRef<SVGCircleElement>(null);
  const wire = useRef<SVGLineElement>(null);
  const trail = useRef<SVGPolylineElement>(null);
  const label = useRef<SVGTextElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = (t: number) => {
      const s = at(t);
      body.current?.setAttribute("cx", String(s.body.x));
      body.current?.setAttribute("cy", String(s.body.y));
      const w = wire.current;
      if (w) {
        w.setAttribute("x1", String(s.body.x));
        w.setAttribute("y1", String(s.body.y));
        w.setAttribute("x2", String(s.body.x + (A.x - s.body.x) * s.wire));
        w.setAttribute("y2", String(s.body.y + (A.y - s.body.y) * s.wire));
        w.style.opacity = s.wire > 0 ? "1" : "0";
      }
      if (label.current) label.current.textContent = s.label;
    };
    // the whole path, faint, so a still diagram still explains it
    const pts = Array.from({ length: 60 }, (_, i) => at(i / 59).body).map((b) => `${b.x.toFixed(0)},${b.y.toFixed(0)}`);
    trail.current?.setAttribute("points", pts.join(" "));
    if (!play || reduce) {
      draw(play ? 0.62 : 0);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - t0) / 3200, 1);
      draw(t);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play]);

  return (
    <svg viewBox="0 0 900 330" className="h-auto w-full" role="img" aria-label="Diagram: the anchor bites a tree, the wire reels the wearer through an arc, then releases them into free flight and a landing.">
      <g stroke={INK} fill="none" strokeLinecap="round">
        <path d={`M0 ${GROUND} H900`} strokeWidth="1.2" opacity="0.5" />
        {[[100, 1], [560, 1.4], [820, 1]].map(([x, w]) => (
          <path key={x} d={`M${x} ${GROUND} L ${x - 4 * w} 20 M ${x + 14 * w} ${GROUND} L ${x + 10 * w} 20`} strokeWidth="1.4" opacity="0.55" />
        ))}
        <polyline ref={trail} strokeWidth="1" strokeDasharray="3 6" opacity="0.35" />
        <line ref={wire} strokeWidth="1.5" />
        <circle cx={A.x} cy={A.y} r="4" fill="var(--flare)" stroke="none" />
        <circle ref={body} r="9" fill="var(--flare)" stroke="none" cx={START.x} cy={START.y} />
      </g>
      <text ref={label} x="20" y="32" fill={INK} fontFamily="var(--font-mono)" fontSize="16" opacity="0.85">
        Fire the anchor
      </text>
      <text x="880" y="322" fill={INK} fontFamily="var(--font-mono)" fontSize="12" opacity="0.5" textAnchor="end">
        A SIMPLE MODEL, NOT THE STORY&apos;S PHYSICS
      </text>
    </svg>
  );
}
