"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Map as MLMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export interface GlobeCountry {
  slug: string;
  name: string;
  isoN: number;
  lat: number;
  lng: number;
  open: boolean;
  accent: string;
  note: string;
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function graticule() {
  const lines: number[][][] = [];
  for (let lng = -180; lng <= 180; lng += 20) lines.push(Array.from({ length: 37 }, (_, i) => [lng, -90 + i * 5]));
  for (let lat = -60; lat <= 60; lat += 20) lines.push(Array.from({ length: 73 }, (_, i) => [-180 + i * 5, lat]));
  return { type: "FeatureCollection" as const, features: [{ type: "Feature" as const, properties: {}, geometry: { type: "MultiLineString" as const, coordinates: lines } }] };
}

/**
 * The home globe: MapLibre in globe projection, drawn from local data only
 * (Natural Earth shapes, no tile server). Countries in the collection are
 * tinted in their own accent and carry a real <button> marker, so the globe
 * works by keyboard and screen reader as well as by drag. Open countries fly
 * in and navigate; countries still in research say so and stay put.
 */
export function Globe({ countries, onSelect }: { countries: GlobeCountry[]; onSelect?: (slug: string | null) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  const select = useRef(onSelect);
  useEffect(() => {
    select.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    let map: MLMap | undefined;
    let raf = 0;
    let disposed = false;
    const markers: Marker[] = [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    (async () => {
      const ml = (await import("maplibre-gl")).default;
      if (disposed || !host.current) return;
      try {
        const tint: (string | number)[] = [];
        for (const c of countries) tint.push(String(c.isoN), c.accent);
        const isoList = countries.map((c) => String(c.isoN));
        const openList = countries.filter((c) => c.open).map((c) => String(c.isoN));
        // Size the globe to its box: diameter ≈ 512·2^z/π px at the equator.
        const box = Math.min(host.current.clientWidth, host.current.clientHeight);
        const fit = Math.log2(((box * 0.86) * Math.PI) / 512);
        map = new ml.Map({
          container: host.current,
          attributionControl: { compact: true, customAttribution: "Natural Earth" },
          center: [100, 22],
          zoom: fit,
          minZoom: 0.2,
          maxZoom: 5,
          dragRotate: false,
          pitchWithRotate: false,
          renderWorldCopies: false,
          // On touch screens one finger scrolls the page; two turn the globe.
          cooperativeGestures: window.matchMedia("(pointer: coarse)").matches,
          style: {
            version: 8,
            projection: { type: "globe" },
            sky: {
              "sky-color": "#0d1014",
              "horizon-color": "#1d3346",
              "fog-color": "#0d1014",
              "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 0, 1, 5, 1, 7, 0],
            },
            sources: {
              countries: { type: "geojson", data: `${BASE}/data/world-110m.json`, promoteId: "iso_n" },
              graticule: { type: "geojson", data: graticule() },
            },
            layers: [
              { id: "ocean", type: "background", paint: { "background-color": "#0e1d2a" } },
              { id: "graticule", type: "line", source: "graticule", paint: { "line-color": "#1d3346", "line-width": 0.6 } },
              {
                id: "land",
                type: "fill",
                source: "countries",
                paint: { "fill-color": ["case", ["boolean", ["feature-state", "hover"], false], "#3a4654", "#26303b"] },
              },
              {
                id: "collection",
                type: "fill",
                source: "countries",
                filter: ["in", ["get", "iso_n"], ["literal", isoList]],
                paint: {
                  "fill-color": ["match", ["get", "iso_n"], ...tint, "#ffffff"] as never,
                  // Open countries glow; ones still in research are only a tint.
                  "fill-opacity": [
                    "case",
                    ["boolean", ["feature-state", "hover"], false],
                    0.8,
                    ["in", ["get", "iso_n"], ["literal", openList]],
                    0.75,
                    0.22,
                  ],
                },
              },
              { id: "borders", type: "line", source: "countries", paint: { "line-color": "#46525f", "line-width": 0.6 } },
            ],
          },
        });
        map.on("error", (e) => console.warn("globe:", e.error?.message));
        map.keyboard.enable();

        // Country hover, for every country, so the land reads as touchable.
        let hovered: string | number | undefined;
        map.on("mousemove", "land", (e) => {
          const id = e.features?.[0]?.id;
          if (id === hovered) return;
          if (hovered !== undefined) map!.setFeatureState({ source: "countries", id: hovered }, { hover: false });
          hovered = id;
          if (id !== undefined) map!.setFeatureState({ source: "countries", id }, { hover: true });
          map!.getCanvas().style.cursor = id !== undefined && isoList.includes(String(id)) ? "pointer" : "";
        });
        map.on("mouseleave", "land", () => {
          if (hovered !== undefined) map!.setFeatureState({ source: "countries", id: hovered }, { hover: false });
          hovered = undefined;
          map!.getCanvas().style.cursor = "";
        });

        const enter = (c: GlobeCountry) => {
          stopSpin();
          select.current?.(c.slug);
          if (!c.open) {
            map!.easeTo({ center: [c.lng, c.lat], duration: reduce ? 0 : 900 });
            return;
          }
          if (reduce) return router.push(`/${c.slug}/`);
          map!.flyTo({ center: [c.lng, c.lat], zoom: 3.4, duration: 1400, essential: false });
          map!.once("moveend", () => router.push(`/${c.slug}/`));
        };

        map.on("click", "collection", (e) => {
          const id = String(e.features?.[0]?.properties?.iso_n);
          const c = countries.find((x) => String(x.isoN) === id);
          if (c) enter(c);
        });

        for (const c of countries) {
          const el = document.createElement("button");
          el.type = "button";
          el.className = "globe-marker";
          el.dataset.open = String(c.open);
          el.style.setProperty("--m", c.accent);
          el.setAttribute("aria-label", c.open ? `Enter ${c.name}` : `${c.name}: in research`);
          el.innerHTML = `<span class="globe-dot" aria-hidden="true"></span><span class="globe-label">${c.name}</span>`;
          el.addEventListener("click", (ev) => {
            ev.stopPropagation();
            enter(c);
          });
          el.addEventListener("focus", () => {
            stopSpin();
            map!.easeTo({ center: [c.lng, c.lat], duration: reduce ? 0 : 600 });
          });
          markers.push(new ml.Marker({ element: el, anchor: "left" }).setLngLat([c.lng, c.lat]).addTo(map));
        }

        // A slow drift until the reader touches the globe. Not under reduced motion.
        let spinning = !reduce;
        const stopSpin = () => {
          spinning = false;
        };
        const spin = () => {
          if (!map || disposed) return;
          if (spinning && !document.hidden) {
            const c = map.getCenter();
            map.setCenter([c.lng + 0.035, c.lat]);
          }
          raf = requestAnimationFrame(spin);
        };
        for (const ev of ["mousedown", "touchstart", "wheel", "keydown"] as const) host.current.addEventListener(ev, stopSpin, { passive: true });

        map.once("load", () => {
          if (disposed) return;
          setState("ready");
          if (!reduce) raf = requestAnimationFrame(spin);
        });
      } catch (err) {
        console.warn("globe unavailable:", err);
        if (!disposed) setState("failed");
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      markers.forEach((m) => m.remove());
      map?.remove();
    };
  }, [countries, router]);

  return (
    <div className="relative h-full w-full">
      {/* Shown until the live globe is ready, and all the time without JS or WebGL. */}
      {state !== "ready" && (
        <img
          src={`${BASE}/media/globe-poster.webp`}
          alt="The globe turned toward Asia, with Japan marked as open"
          width={900}
          height={900}
          fetchPriority="high"
          className="absolute inset-0 m-auto h-full max-h-full w-auto max-w-full object-contain"
        />
      )}
      <div
        ref={host}
        className="absolute inset-0"
        // MapLibre's own CSS sets position: relative on its container and,
        // being unlayered, beats the utility class; inline style wins.
        style={{ position: "absolute", inset: 0 }}
        role="application"
        aria-label="Interactive globe. Drag to turn, scroll or pinch to zoom; tab to the country markers."
        data-state={state}
      />
      {state === "failed" && (
        <p className="absolute inset-x-4 bottom-4 border border-line bg-surface p-3 text-sm text-muted">
          This device could not draw the 3D globe. Every country is listed below.
        </p>
      )}
    </div>
  );
}
