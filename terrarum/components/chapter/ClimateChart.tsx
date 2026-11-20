"use client";

import { useState } from "react";
import type { ClimateNormals } from "@/lib/content/japan/data/climate";

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Monthly climate normals for one station at a time, on a scale shared by all
 * stations so that switching compares them honestly: rain as bars (right
 * axis), the band between mean daily low and high as a filled area (left).
 */
export function ClimateChart({ stations, source }: { stations: ClimateNormals[]; source: string }) {
  const [at, setAt] = useState(stations.findIndex((s) => s.station === "Tokyo"));
  const s = stations[at];
  const W = 720;
  const H = 300;
  const pad = { l: 44, r: 64, t: 16, b: 34 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const tMin = -10;
  const tMax = 35;
  const pMax = 600;
  const x = (m: number) => pad.l + (iw / 12) * (m + 0.5);
  const yT = (t: number) => pad.t + ih * (1 - (t - tMin) / (tMax - tMin));
  const yP = (p: number) => pad.t + ih * (1 - p / pMax);
  const band = [...s.high.map((t, m) => `${x(m)},${yT(t)}`), ...[...s.low].reverse().map((t, i) => `${x(11 - i)},${yT(t)}`)].join(" ");
  const bw = iw / 12 - 10;

  return (
    <figure className="max-w-[760px]">
      <div role="group" aria-label="Choose a city" className="flex flex-wrap gap-2">
        {stations.map((st, i) => (
          <button
            key={st.station}
            type="button"
            aria-pressed={i === at}
            onClick={() => setAt(i)}
            className={`press border px-3 py-1.5 text-sm ${i === at ? "border-accent bg-accent text-on-accent" : "border-line hover:border-accent"}`}
          >
            {st.station}
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 w-full" role="img" aria-label={`${s.station}: mean daily high ${Math.max(...s.high)}°C in the warmest month and low ${Math.min(...s.low)}°C in the coldest; ${s.annual.precip.toLocaleString("en")} mm of rain and snow a year, most in ${MONTH_NAMES[s.precip.indexOf(Math.max(...s.precip))]}.`}>
        {[-10, 0, 10, 20, 30].map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={yT(t)} y2={yT(t)} stroke="var(--line)" strokeWidth={t === 0 ? 1.2 : 0.6} />
            <text x={pad.l - 8} y={yT(t) + 4} textAnchor="end" fontSize="12" fill="var(--muted)">{t}°</text>
          </g>
        ))}
        {[0, 200, 400, 600].map((p) => (
          <text key={p} x={W - pad.r + 8} y={yP(p) + 4} fontSize="12" fill="var(--muted)">{p === 600 ? "600 mm" : p}</text>
        ))}
        {s.precip.map((p, m) => (
          <rect key={m} x={x(m) - bw / 2} y={yP(p)} width={bw} height={yP(0) - yP(p)} fill="var(--accent)" opacity="0.22" className="clim-bar" />
        ))}
        <polygon points={band} fill="var(--accent)" opacity="0.35" className="clim-band" />
        <polyline points={s.high.map((t, m) => `${x(m)},${yT(t)}`).join(" ")} fill="none" stroke="var(--accent)" strokeWidth="2.5" />
        <polyline points={s.low.map((t, m) => `${x(m)},${yT(t)}`).join(" ")} fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="4 4" />
        {MONTHS.map((m, i) => (
          <text key={i} x={x(i)} y={H - 10} textAnchor="middle" fontSize="12" fill="var(--muted)">{m}</text>
        ))}
      </svg>
      <figcaption className="mt-3 text-[13px] leading-snug text-muted">
        <span className="text-ink">{s.station}</span>, 1991-2020 normals: the filled band runs from the mean daily low (dashed) to the mean daily high; bars are monthly precipitation, rain and snow together, on the right-hand scale. Every city uses the same scales. Year: {s.annual.low}° to {s.annual.high}°, {s.annual.precip.toLocaleString("en")} mm. {source}
      </figcaption>
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-medium">The numbers for {s.station}</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-right tabular-nums">
            <thead>
              <tr className="text-muted">
                <th className="py-1 pr-3 text-left font-normal" scope="col">Month</th>
                {MONTH_NAMES.map((m) => (
                  <th key={m} className="px-1 font-normal" scope="col">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["High °C", s.high],
                  ["Low °C", s.low],
                  ["Precip. mm", s.precip],
                ] as const
              ).map(([label, row]) => (
                <tr key={label} className="border-t border-line">
                  <th scope="row" className="py-1 pr-3 text-left font-normal">{label}</th>
                  {row.map((v, i) => (
                    <td key={i} className="px-1">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
