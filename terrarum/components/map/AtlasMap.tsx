"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Map as MLMap, Marker, LngLatBoundsLike, StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export interface MapPin {
  label: string;
  native?: string;
  nativeLang?: string;
  lng: number;
  lat: number;
  href?: string;
  current?: boolean;
}

export interface AreaLayer {
  /** GeoJSON under public/, e.g. /data/jp-regions.json */
  url: string;
  /** Feature property that names an area. */
  key: string;
  /** Only show areas whose key is in this list (all when omitted). */
  only?: string[];
  /** Areas that are open, with where they lead. */
  open: Record<string, string>;
  /** Labels to place at each area's centre, by key. */
  labels?: Record<string, string>;
  /** Or: label every feature with this property. */
  labelProp?: string;
  /** Also mark each area with a dot (for islands too small to see or click). */
  asPoints?: boolean;
}

type Props = {
  /** "areas": local shapes only, no tiles. "streets": OpenFreeMap vector tiles. */
  mode: "areas" | "streets";
  bounds: [[number, number], [number, number]];
  pins?: MapPin[];
  areas?: AreaLayer;
  label: string;
  className?: string;
};

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || undefined;
}

/** Centre of the largest ring's bounding box: good enough for a label. */
function labelPoint(geom: GeoJSON.Geometry): [number, number] {
  const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.type === "MultiPolygon" ? geom.coordinates : [];
  let best: number[][] = [];
  let bestArea = -1;
  for (const p of polys) {
    const ring = p[0];
    const xs = ring.map((c) => c[0]);
    const ys = ring.map((c) => c[1]);
    const a = (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
    if (a > bestArea) {
      bestArea = a;
      best = ring;
    }
  }
  const xs = best.map((c) => c[0]);
  const ys = best.map((c) => c[1]);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
}

/**
 * One map component for every level below the globe. Area maps draw local
 * GeoJSON (no third-party tiles); street maps use OpenFreeMap's free vector
 * tiles of OpenStreetMap data. Pins are real links, and every page also lists
 * them in plain HTML next to the map.
 */
export function AtlasMap({ mode, bounds, pins = [], areas, label, className = "" }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let map: MLMap | undefined;
    let disposed = false;
    const markers: Marker[] = [];
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    (async () => {
      const ml = (await import("maplibre-gl")).default;
      if (disposed || !host.current) return;
      const scope = host.current;
      const read = (n: string) => getComputedStyle(scope).getPropertyValue(n).trim() || cssVar(n) || "#888";
      const accent = read("--accent");
      const ink = read("--ink");
      const line = read("--line");
      const surface = read("--surface");
      const bg = read("--bg");

      let style: string | StyleSpecification;
      if (mode === "streets") {
        style = `https://tiles.openfreemap.org/styles/${dark ? "dark" : "positron"}`;
      } else {
        style = {
          version: 8,
          sources: {},
          layers: [{ id: "sea", type: "background", paint: { "background-color": bg } }],
        };
      }
      try {
        map = new ml.Map({
          container: scope,
          style,
          bounds: bounds as LngLatBoundsLike,
          fitBoundsOptions: { padding: 24 },
          attributionControl: { compact: true },
          dragRotate: false,
          pitchWithRotate: false,
          cooperativeGestures: true,
        });
        map.touchZoomRotate.disableRotation();
        map.addControl(new ml.NavigationControl({ showCompass: false }), "top-right");
        map.on("error", (e) => console.warn("map:", e.error?.message));

        map.once("load", async () => {
          if (disposed || !map) return;
          if (areas) {
            const geo = (await (await fetch(`${BASE}${areas.url}`)).json()) as GeoJSON.FeatureCollection;
            if (areas.only) geo.features = geo.features.filter((f) => areas.only!.includes(String(f.properties?.[areas.key])));
            geo.features.forEach((f, i) => (f.id = i));
            const openKeys = Object.keys(areas.open);
            map.addSource("areas", { type: "geojson", data: geo });
            map.addLayer({
              id: "areas-fill",
              type: "fill",
              source: "areas",
              paint: {
                "fill-color": ["case", ["in", ["get", areas.key], ["literal", openKeys]], accent, areas.only ? line : surface],
                "fill-opacity": [
                  "case",
                  ["boolean", ["feature-state", "hover"], false],
                  0.95,
                  ["in", ["get", areas.key], ["literal", openKeys]],
                  0.75,
                  0.9,
                ],
              },
            });
            map.addLayer({ id: "areas-line", type: "line", source: "areas", paint: { "line-color": areas.only ? bg : line, "line-width": areas.only ? 1.5 : 1 } });
            if (areas.asPoints) {
              map.addSource("area-points", {
                type: "geojson",
                data: {
                  type: "FeatureCollection",
                  features: geo.features.map((f) => ({ type: "Feature", properties: f.properties, geometry: { type: "Point", coordinates: labelPoint(f.geometry) } })),
                },
              });
              map.addLayer({
                id: "area-points",
                type: "circle",
                source: "area-points",
                paint: {
                  "circle-radius": ["case", ["in", ["get", areas.key], ["literal", openKeys]], 9, 6],
                  "circle-color": ["case", ["in", ["get", areas.key], ["literal", openKeys]], accent, surface],
                  "circle-stroke-color": ["case", ["in", ["get", areas.key], ["literal", openKeys]], bg, line],
                  "circle-stroke-width": 2,
                },
              });
              map.on("click", "area-points", (e) => {
                const href = areas.open[String(e.features?.[0]?.properties?.[areas.key])];
                if (href) router.push(href);
              });
              map.on("mouseenter", "area-points", (e) => {
                if (areas.open[String(e.features?.[0]?.properties?.[areas.key])]) map!.getCanvas().style.cursor = "pointer";
              });
              map.on("mouseleave", "area-points", () => (map!.getCanvas().style.cursor = ""));
            }
            let hovered: number | undefined;
            map.on("mousemove", "areas-fill", (e) => {
              const f = e.features?.[0];
              const id = f?.id as number | undefined;
              if (id !== hovered) {
                if (hovered !== undefined) map!.setFeatureState({ source: "areas", id: hovered }, { hover: false });
                hovered = id;
                if (id !== undefined) map!.setFeatureState({ source: "areas", id }, { hover: true });
              }
              map!.getCanvas().style.cursor = f && areas.open[String(f.properties?.[areas.key])] ? "pointer" : "";
            });
            map.on("mouseleave", "areas-fill", () => {
              if (hovered !== undefined) map!.setFeatureState({ source: "areas", id: hovered }, { hover: false });
              hovered = undefined;
              map!.getCanvas().style.cursor = "";
            });
            map.on("click", "areas-fill", (e) => {
              const href = areas.open[String(e.features?.[0]?.properties?.[areas.key])];
              if (href) router.push(href);
            });
            if (areas.labels || areas.labelProp) {
              const seen = new Set<string>();
              for (const f of geo.features) {
                const k = areas.labelProp ? String(f.properties?.[areas.labelProp]) : String(f.properties?.[areas.key]);
                const text = areas.labelProp ? k : areas.labels![k];
                if (!text || seen.has(k)) continue;
                seen.add(k);
                const el = document.createElement("span");
                el.className = "area-label";
                el.dataset.open = String(!!areas.open[k]);
                el.textContent = text;
                el.setAttribute("aria-hidden", "true");
                // With dots drawn, sit the label above its dot instead of on it.
                const opts = areas.asPoints ? { element: el, anchor: "bottom" as const, offset: [0, -11] as [number, number] } : { element: el };
                markers.push(new ml.Marker(opts).setLngLat(labelPoint(f.geometry)).addTo(map));
              }
            }
          }
          for (const p of pins) {
            const el = document.createElement(p.href ? "a" : "span");
            el.className = "map-pin";
            el.dataset.current = String(!!p.current);
            if (p.href && el instanceof HTMLAnchorElement) {
              el.href = `${BASE}${p.href}`;
              el.addEventListener("click", (ev) => {
                ev.preventDefault();
                router.push(p.href!);
              });
            }
            el.innerHTML = `<span class="map-pin-dot" aria-hidden="true"></span><span class="map-pin-label">${p.label}${p.native ? ` <span lang="${p.nativeLang ?? ""}">${p.native}</span>` : ""}</span>`;
            markers.push(new ml.Marker({ element: el, anchor: "left" }).setLngLat([p.lng, p.lat]).addTo(map));
          }
          map.getContainer().style.setProperty("--pin-ink", ink);
        });
      } catch (err) {
        console.warn("map unavailable:", err);
        if (!disposed) setFailed(true);
      }
    })();

    return () => {
      disposed = true;
      markers.forEach((m) => m.remove());
      map?.remove();
    };
  }, [mode, bounds, pins, areas, router]);

  return (
    <div className={`relative overflow-hidden border border-line bg-surface ${className}`}>
      <div ref={host} className="absolute inset-0" style={{ position: "absolute", inset: 0 }} role="region" aria-label={label} />
      {failed && <p className="absolute inset-4 text-sm text-muted">The map could not be drawn on this device. The places are listed beside it.</p>}
      <noscript>
        <p className="absolute inset-4 text-sm text-muted">The map needs JavaScript. The places are listed beside it.</p>
      </noscript>
    </div>
  );
}
