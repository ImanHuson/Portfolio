"use client";

import { useRef, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { reducedMotionStore } from "@/lib/animation/tokens";
import { MAP } from "@/lib/data/worldMap";
import { MAP_NOTE, PULLBACK } from "@/lib/data/world";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const [PX, PY] = MAP.paradisAt;
// the three Walls, as a mark: radii in the story's own ratio (250 / 380 / 480)
const WALLS = [480, 380, 250].map((r) => (r / 480) * 13);

type Label = { id: string; text: string; at: [number, number]; from: number; anchor?: "start" };
const LABELS: Label[] = [
  // starts just past the east coast (the island's widest point), so it never sits on the land
  { id: "paradis", text: "Paradis", at: [MAP.paradisEnds[0][0] + 2, PY - 4] as [number, number], from: 0.26, anchor: "start" as const },
  { id: "sea", text: "The sea", at: MAP.seaAt as [number, number], from: 0.5 },
  { id: "marley", text: "Marley", at: MAP.mainlandAt as [number, number], from: 0.56 },
];

/** The map itself: the flipped coastlines, a faint graticule, the Walls mark. */
function WorldSvg({ svgRef, className }: { svgRef?: React.Ref<SVGSVGElement>; className?: string }) {
  const grid = [];
  for (let x = 0; x <= MAP.w; x += 100) grid.push(<line key={`x${x}`} x1={x} y1={0} x2={x} y2={MAP.h} vectorEffect="non-scaling-stroke" />);
  for (let y = 0; y <= MAP.h; y += 95) grid.push(<line key={`y${y}`} x1={0} y1={y} x2={MAP.w} y2={y} vectorEffect="non-scaling-stroke" />);
  return (
    <svg ref={svgRef} viewBox={`0 0 ${MAP.w} ${MAP.h}`} preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        {/* the coastline data is a rectangle: feather its edges into the sea */}
        <filter id="feather" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="28" />
        </filter>
        <mask id="dataEdge" maskUnits="userSpaceOnUse" x={-200} y={-200} width={MAP.w + 400} height={MAP.h + 400}>
          <rect x={50} y={50} width={MAP.w - 100} height={MAP.h - 100} fill="#fff" filter="url(#feather)" />
        </mask>
      </defs>
      <rect x={-4000} y={-4000} width={9000} height={9000} fill="#0c0e0d" />
      <g stroke="#d8d0b8" strokeOpacity="0.06">{grid}</g>
      <path d={MAP.land} mask="url(#dataEdge)" fill="#23241f" stroke="#a39c87" strokeOpacity="0.55" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path d={MAP.paradis} fill="#3a3a31" stroke="#e6e0ce" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      <g fill="none" stroke="#e6e0ce" vectorEffect="non-scaling-stroke">
        {WALLS.map((r, i) => (
          <circle key={r} cx={PX} cy={PY} r={r} strokeWidth={i === 0 ? 1.4 : 1} strokeOpacity={0.9 - i * 0.15} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}

function StaticWorld() {
  return (
    <section aria-labelledby="world-title" className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <h2 id="world-title" className="sr-only">
          One island
        </h2>
        <div className="relative">
          <WorldSvg className="aspect-[1000/760] w-full" />
          {LABELS.map((l) => (
            <span
              key={l.id}
              className={cn(
                "absolute -translate-y-1/2 font-military text-meta tracking-[0.3em] text-paper/85 uppercase md:text-[0.95rem]",
                l.anchor === "start" ? "pl-2" : "-translate-x-1/2",
              )}
              style={{ left: `${(l.at[0] / MAP.w) * 100}%`, top: `${(l.at[1] / MAP.h) * 100}%` }}
            >
              {l.text}
            </span>
          ))}
        </div>
        <div className="mt-10 grid max-w-[60ch] gap-3 font-serif text-lede leading-snug text-paper/90 italic">
          {PULLBACK.map((b) => (
            <p key={b.text}>{b.text}</p>
          ))}
        </div>
        <p className="mt-8 max-w-[70ch] text-[0.85rem] leading-relaxed text-ash">{MAP_NOTE}</p>
      </div>
    </section>
  );
}

// the camera: log-scaled width, centre gliding from the Walls to the middle of the map
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => x * x * (3 - 2 * x);
function viewAt(p: number, aspect: number) {
  // landscape: the whole map; portrait: the island and the near coast, or it all shrinks to a strip
  const portrait = aspect < 1;
  const fitAll = portrait ? 600 : Math.max(MAP.w, MAP.h * aspect);
  const endC = portrait ? [540, 430] : [MAP.w / 2, MAP.h / 2]; // portrait: land in the upper half, the line below it
  const keys = [
    { t: 0.0, w: 34, c: [PX, PY] },
    { t: 0.2, w: 40, c: [PX, PY] },
    { t: 0.45, w: 190, c: [PX - 10, PY + 10] },
    { t: 0.72, w: 560, c: [540, 300] },
    { t: 0.92, w: fitAll, c: endC },
    { t: 1.0, w: fitAll, c: endC },
  ];
  let i = 0;
  while (i < keys.length - 2 && p > keys[i + 1].t) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const u = ease(clamp01((p - a.t) / (b.t - a.t)));
  const w = a.w * Math.pow(b.w / a.w, u);
  const cx = a.c[0] + (b.c[0] - a.c[0]) * u;
  const cy = a.c[1] + (b.c[1] - a.c[1]) * u;
  const h = w / aspect;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

export default function OneIsland() {
  const mode = useSyncExternalStore(
    reducedMotionStore.subscribe,
    () => (reducedMotionStore.getSnapshot() ? "still" : "cinematic"),
    () => "static" as const,
  );
  const hostRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const labelRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  useGSAP(
    () => {
      if (mode !== "cinematic" || !hostRef.current) return;
      const q = gsap.utils.selector(hostRef);
      gsap.set(q("[data-beat]"), { autoAlpha: 0, y: 10 });

      const place = (p: number) => {
        const svg = svgRef.current;
        if (!svg) return;
        const rw = svg.clientWidth || 1;
        const rh = svg.clientHeight || 1;
        const v = viewAt(p, rw / rh);
        svg.setAttribute("viewBox", `${v.x} ${v.y} ${v.w} ${v.h}`);
        for (const l of LABELS) {
          const el = labelRefs.current[l.id];
          if (!el) continue;
          el.style.left = `${((l.at[0] - v.x) / v.w) * rw}px`;
          el.style.top = `${((l.at[1] - v.y) / v.h) * rh}px`;
          el.style.opacity = String(clamp01((p - l.from) / 0.06));
        }
      };
      place(0);

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hostRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (self) => place(self.progress),
          onRefresh: (self) => place(self.progress),
        },
      });
      PULLBACK.forEach((b, i) => {
        tl.to(q(`[data-beat='${i}']`), { autoAlpha: 1, y: 0, duration: 0.03 }, b.at);
        if (b.until < 1) tl.to(q(`[data-beat='${i}']`), { autoAlpha: 0, duration: 0.03 }, b.until);
      });
      tl.to({}, { duration: 0.01 }, 0.99);
    },
    { dependencies: [mode], scope: hostRef },
  );

  if (mode !== "cinematic") return <StaticWorld />;

  return (
    <section ref={hostRef} aria-labelledby="world-title" className="relative h-[600vh]">
      <h2 id="world-title" className="sr-only">
        One island
      </h2>
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <WorldSvg svgRef={svgRef} className="absolute inset-0 size-full" />
        {LABELS.map((l) => (
          <span
            key={l.id}
            ref={(el) => {
              labelRefs.current[l.id] = el;
            }}
            className={cn(
              "pointer-events-none absolute -translate-y-1/2 font-military text-[0.85rem] tracking-[0.35em] text-paper/90 uppercase opacity-0 md:text-[1rem]",
              l.anchor === "start" ? "pl-2.5" : "-translate-x-1/2",
              // on the narrowest screens the channel is too thin for two labels
              l.id === "sea" && "max-[420px]:hidden",
            )}
          >
            {l.text}
          </span>
        ))}
        {PULLBACK.map((b, i) => (
          <div
            key={b.text}
            className={cn("pointer-events-none absolute inset-x-0 px-4 md:px-8", b.big ? "bottom-[9%] sm:bottom-[14%]" : "bottom-0 pb-16 md:pb-14")}
          >
            <div className="mx-auto max-w-[1400px]">
              <p
                data-beat={i}
                className={cn(
                  "[text-shadow:0_1px_20px_rgba(0,0,0,0.95)]",
                  b.big
                    ? "mx-auto max-w-[22ch] text-center font-display text-[1.55rem] leading-tight font-bold text-paper sm:text-h2"
                    : "max-w-[40ch] font-serif text-lede leading-snug text-paper/90 italic",
                )}
              >
                {b.text}
              </p>
            </div>
          </div>
        ))}
        <p className="absolute top-[calc(var(--nav-h)+1rem)] right-4 max-w-[34ch] text-right text-meta leading-snug text-ash md:right-8">
          Coastlines of our world, flipped north to south. The Walls are a mark, not to scale.
        </p>
      </div>
    </section>
  );
}
