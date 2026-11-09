"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MLMap, LngLatBoundsLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { NationalPark } from "@/lib/content/japan/data/parks";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Japan's national parks by prefecture: the map shades each prefecture by how
 * many parks reach into it, and a prefecture chosen on the map or from the
 * list filters the parks beside it. A timeline marks when each was designated.
 * Parks are not drawn as points: most have no boundary in open map data, and a
 * single dot would misplace parks that span mountains, coasts and islands.
 */
export function ParksExplorer({ parks, prefectures, source }: { parks: NationalPark[]; prefectures: { iso: string; name: string }[]; source: string }) {
  const host = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const [sel, setSel] = useState<string>("");
  const [mapOk, setMapOk] = useState(true);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of parks) for (const iso of p.prefectures) c[iso] = (c[iso] ?? 0) + 1;
    return c;
  }, [parks]);
  const shown = sel ? parks.filter((p) => p.prefectures.includes(sel)) : parks;
  const nameOf = (iso: string) => prefectures.find((p) => p.iso === iso)?.name ?? iso;
  const none = prefectures.filter((p) => !counts[p.iso]).map((p) => p.name);
  const y0 = 1934;
  const y1 = 2024;

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        const ml = (await import("maplibre-gl")).default;
        if (disposed || !host.current) return;
        const read = (n: string) => getComputedStyle(host.current!).getPropertyValue(n).trim() || "#888";
        const map = new ml.Map({
          container: host.current,
          style: { version: 8, sources: {}, layers: [{ id: "sea", type: "background", paint: { "background-color": read("--bg") } }] },
          bounds: [[122.8, 24], [146.2, 45.6]] as LngLatBoundsLike,
          fitBoundsOptions: { padding: 16 },
          attributionControl: { compact: true },
          dragRotate: false,
          cooperativeGestures: true,
        });
        mapRef.current = map;
        map.touchZoomRotate.disableRotation();
        map.once("load", async () => {
          const geo = (await (await fetch(`${BASE}/data/jp-prefectures.json`)).json()) as GeoJSON.FeatureCollection;
          geo.features.forEach((f, i) => {
            f.id = i;
            f.properties = { ...f.properties, parks: counts[String(f.properties?.iso)] ?? 0 };
          });
          map.addSource("pref", { type: "geojson", data: geo });
          map.addLayer({
            id: "pref-fill",
            type: "fill",
            source: "pref",
            paint: {
              "fill-color": ["case", [">", ["get", "parks"], 0], read("--accent"), read("--surface")],
              "fill-opacity": ["interpolate", ["linear"], ["get", "parks"], 0, 0.9, 1, 0.3, 3, 0.6, 7, 0.95],
            },
          });
          map.addLayer({ id: "pref-line", type: "line", source: "pref", paint: { "line-color": read("--bg"), "line-width": 1 } });
          map.addLayer({ id: "pref-sel", type: "line", source: "pref", filter: ["==", ["get", "iso"], ""], paint: { "line-color": read("--ink"), "line-width": 2.5 } });
          map.on("click", "pref-fill", (e) => setSel(String(e.features?.[0]?.properties?.iso ?? "")));
          map.on("mouseenter", "pref-fill", () => (map.getCanvas().style.cursor = "pointer"));
          map.on("mouseleave", "pref-fill", () => (map.getCanvas().style.cursor = ""));
        });
        map.on("error", () => setMapOk(false));
      } catch {
        setMapOk(false);
      }
    })();
    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [counts]);

  useEffect(() => {
    const map = mapRef.current;
    if (map?.getLayer("pref-sel")) map.setFilter("pref-sel", ["==", ["get", "iso"], sel]);
  }, [sel]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
      <div>
        {mapOk ? (
          <div ref={host} style={{ position: "relative" }} className="h-[min(70vh,600px)] min-h-[380px] w-full" role="region" aria-label="Map of Japan's prefectures shaded by number of national parks. Choose a prefecture on the map or from the list." />
        ) : (
          <p className="text-muted">The map could not load; the list beside it has every park.</p>
        )}
        <p className="mt-3 text-[13px] text-muted">
          Darker means more national parks reach into that prefecture. Parks are not drawn as points: many cross several prefectures and the sea. {source}
        </p>
      </div>
      <div>
        <label htmlFor="park-pref" className="block text-sm font-medium">Prefecture</label>
        <select
          id="park-pref"
          value={sel}
          onChange={(e) => setSel(e.target.value)}
          className="mt-2 w-full border border-line bg-bg px-3 py-2 text-ink"
        >
          <option value="">All of Japan ({parks.length} parks)</option>
          {prefectures.map((p) => (
            <option key={p.iso} value={p.iso}>
              {p.name} ({counts[p.iso] ?? 0})
            </option>
          ))}
        </select>

        <svg viewBox="0 0 400 46" className="mt-6 w-full" aria-hidden>
          <line x1="8" x2="392" y1="22" y2="22" stroke="var(--line)" />
          {parks.map((p) => {
            const yr = Number(p.designated.slice(0, 4));
            const cx = 8 + ((yr - y0) / (y1 - y0)) * 384;
            const on = !sel || p.prefectures.includes(sel);
            return <circle key={p.name} cx={cx} cy="22" r={on ? 5 : 3} fill={on ? "var(--accent)" : "var(--line)"} opacity={on ? 0.85 : 1} />;
          })}
          <text x="8" y="44" fontSize="11" fill="var(--muted)">1934</text>
          <text x="392" y="44" fontSize="11" fill="var(--muted)" textAnchor="end">2024</text>
        </svg>

        <p className="mt-4 text-sm" aria-live="polite">
          {sel ? `${shown.length} national park${shown.length === 1 ? "" : "s"} reach into ${nameOf(sel)}.` : `All ${parks.length}, oldest first.`}
          {sel && !shown.length ? " None of the 35 does." : ""}
        </p>
        <ol className="mt-3 max-h-[440px] divide-y divide-line overflow-y-auto border-y border-line">
          {shown.map((p) => (
            <li key={p.name} className="flex items-baseline justify-between gap-4 py-2.5">
              <span>
                <span className="font-medium">{p.name}</span>
                <span className="block text-[13px] text-muted">{p.prefectures.map(nameOf).join(", ")}</span>
              </span>
              <span className="shrink-0 text-right text-sm tabular-nums">
                {p.designated.slice(0, 4)}
                <span className="block text-[13px] text-muted">
                  {Math.round(p.areaHa / 100).toLocaleString("en")} km²{p.landOnly ? " of land" : ""}
                </span>
              </span>
            </li>
          ))}
        </ol>
        {!sel && <p className="mt-3 text-[13px] text-muted">No national park reaches into {none.join(", ")}.</p>}
      </div>
    </div>
  );
}
