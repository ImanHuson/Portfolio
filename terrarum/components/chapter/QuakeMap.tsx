"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MLMap, LngLatBoundsLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const FEED = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
// Japan and its seas: wide enough for the trenches off the Pacific coast.
const BOX = { w: 122, e: 154, s: 20, n: 46.5 };

interface Quake {
  id: string;
  mag: number;
  place: string;
  time: number;
  lng: number;
  lat: number;
  depth: number;
  url: string;
}

/**
 * Earthquakes of magnitude 2.5 and above in and around Japan over the last
 * seven days, live from the US Geological Survey's public feed (public
 * domain, updated every few minutes). Circles grow with magnitude; the list
 * holds the latest. If the feed cannot be reached, the map says so.
 */
export function QuakeMap() {
  const host = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const [quakes, setQuakes] = useState<Quake[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [updated, setUpdated] = useState<number | null>(null);

  useEffect(() => {
    const ctl = new AbortController();
    fetch(FEED, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: GeoJSON.FeatureCollection & { metadata: { generated: number } }) => {
        const q = d.features
          .map((f) => {
            const [lng, lat, depth] = (f.geometry as GeoJSON.Point).coordinates;
            const p = f.properties as { mag: number; place: string; time: number; url: string };
            return { id: String(f.id), mag: p.mag, place: p.place, time: p.time, lng, lat, depth, url: p.url };
          })
          .filter((x) => x.lng >= BOX.w && x.lng <= BOX.e && x.lat >= BOX.s && x.lat <= BOX.n)
          .sort((a, b) => b.time - a.time);
        setQuakes(q);
        setUpdated(d.metadata.generated);
      })
      .catch(() => {
        if (!ctl.signal.aborted) setFailed(true);
      });
    return () => ctl.abort();
  }, []);

  useEffect(() => {
    if (!quakes || !host.current) return;
    let disposed = false;
    (async () => {
      const ml = (await import("maplibre-gl")).default;
      if (disposed || !host.current) return;
      const read = (n: string) => getComputedStyle(host.current!).getPropertyValue(n).trim() || "#888";
      const map = new ml.Map({
        container: host.current,
        style: { version: 8, sources: {}, layers: [{ id: "sea", type: "background", paint: { "background-color": read("--bg") } }] },
        bounds: [[BOX.w, BOX.s], [BOX.e, BOX.n]] as LngLatBoundsLike,
        fitBoundsOptions: { padding: 12 },
        attributionControl: { compact: true, customAttribution: "Earthquakes: USGS" },
        dragRotate: false,
        cooperativeGestures: true,
      });
      mapRef.current = map;
      map.touchZoomRotate.disableRotation();
      map.once("load", async () => {
        const geo = await (await fetch(`${BASE}/data/jp-prefectures.json`)).json();
        map.addSource("pref", { type: "geojson", data: geo });
        map.addLayer({ id: "land", type: "fill", source: "pref", paint: { "fill-color": read("--surface"), "fill-opacity": 0.95 } });
        map.addLayer({ id: "coast", type: "line", source: "pref", paint: { "line-color": read("--line"), "line-width": 0.8 } });
        map.addSource("q", {
          type: "geojson",
          data: { type: "FeatureCollection", features: quakes.map((q) => ({ type: "Feature", geometry: { type: "Point", coordinates: [q.lng, q.lat] }, properties: { mag: q.mag, age: Date.now() - q.time } })) },
        });
        map.addLayer({
          id: "q",
          type: "circle",
          source: "q",
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["get", "mag"], 2.5, 3, 5, 9, 7, 22],
            "circle-color": read("--accent"),
            // The last day burns brightest.
            "circle-opacity": ["interpolate", ["linear"], ["get", "age"], 0, 0.85, 86400000, 0.55, 604800000, 0.25],
            "circle-stroke-color": read("--ink"),
            "circle-stroke-width": 0.6,
          },
        });
      });
    })();
    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [quakes]);

  const fmt = (t: number) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tokyo" }).format(t);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" data-quakes>
      <div>
        {failed ? (
          <p className="border border-line p-6 text-muted" data-quakes-failed>
            The USGS earthquake feed could not be reached just now, so the live map is empty. The feed is public and updates every few minutes; try again later.
          </p>
        ) : (
          <div ref={host} style={{ position: "relative" }} className="h-[min(72vh,620px)] min-h-[380px] w-full bg-surface" role="region" aria-label="Map of earthquakes of magnitude 2.5 and above around Japan in the last seven days" />
        )}
        <p className="mt-3 text-[13px] text-muted">
          Live: earthquakes of magnitude 2.5 and above in and around Japan in the last seven days, from the US Geological Survey (public domain).{" "}
          {updated && <span data-quakes-updated>Updated {fmt(updated)}, Japan time.</span>} Larger circles are stronger; the brightest are from the last day. For warnings, follow the Japan Meteorological Agency, not this map.
        </p>
      </div>
      <div>
        <p className="font-display text-5xl tabular-nums" aria-live="polite">
          {quakes ? quakes.length : failed ? "?" : "…"}
        </p>
        <p className="mt-1 text-sm text-muted">earthquakes of magnitude 2.5 or more this week</p>
        {quakes && quakes.length > 0 && (
          <ol className="mt-6 divide-y divide-line border-y border-line">
            {quakes.slice(0, 6).map((q) => (
              <li key={q.id} className="flex items-baseline justify-between gap-4 py-2.5">
                <span className="min-w-0">
                  <a href={q.url} className="underline decoration-line underline-offset-2 hover:decoration-current">{q.place}</a>
                  <span className="block text-[13px] text-muted">{fmt(q.time)}, {Math.round(q.depth)} km deep</span>
                </span>
                <span className="shrink-0 font-display text-2xl tabular-nums">{q.mag.toFixed(1)}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
