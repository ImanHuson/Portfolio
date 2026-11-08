"use client";

import { useEffect, useRef, useState } from "react";
import "pannellum/build/pannellum.css";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export interface PanoProps {
  src: string;
  title: string;
  yaw: number;
  pitch?: number;
  hfov?: number;
  /** Partial panoramas (cylindrical strips): horizontal and vertical extent in degrees. */
  haov?: number;
  vaov?: number;
  alt: string;
}

type Viewer = { destroy(): void };
declare global {
  interface Window {
    pannellum?: { viewer(el: HTMLElement, cfg: Record<string, unknown>): Viewer };
  }
}

/**
 * A 360° photograph in Pannellum (MIT): drag or arrow keys to look, +/- to
 * zoom, fullscreen. Loaded only when the reader asks for it, so the page does
 * not pay for WebGL and a 1 MB panorama up front.
 */
export function Panorama({ src, title, yaw, pitch = 0, hfov = 100, haov, vaov, alt }: PanoProps) {
  const host = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!on || !host.current) return;
    let viewer: Viewer | undefined;
    let disposed = false;
    (async () => {
      try {
        // Pannellum is a classic script that sets window.pannellum.
        await import("pannellum/build/pannellum.js");
        if (disposed || !host.current || !window.pannellum) throw new Error("pannellum missing");
        viewer = window.pannellum.viewer(host.current, {
          type: "equirectangular",
          panorama: `${BASE}${src}`,
          autoLoad: true,
          yaw,
          pitch,
          hfov,
          minHfov: 60,
          maxHfov: vaov ? Math.min(110, vaov * 1.6) : 110,
          ...(haov ? { haov } : {}),
          ...(vaov ? { vaov, minPitch: -vaov / 2, maxPitch: vaov / 2, avoidShowingBackground: true } : {}),
          showZoomCtrl: true,
          showFullscreenCtrl: true,
          keyboardZoom: true,
          mouseZoom: false,
          compass: false,
          strings: { loadingLabel: "Loading the panorama…" },
        });
        host.current.querySelector("canvas")?.setAttribute("aria-hidden", "true");
      } catch (err) {
        console.warn("panorama:", err);
        if (!disposed) setFailed(true);
      }
    })();
    return () => {
      disposed = true;
      viewer?.destroy();
    };
  }, [on, src, yaw, pitch, hfov, haov, vaov]);

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-band text-on-band">
      {!on && (
        <>
          <img src={`${BASE}${src}`} alt={alt} width={1024} height={512} className="photo absolute inset-0 h-full w-full object-cover opacity-70" loading="lazy" />
          <button
            type="button"
            data-js-only
            onClick={() => setOn(true)}
            className="press absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent px-5 py-3 font-semibold text-on-accent"
          >
            Look around in 360°
          </button>
        </>
      )}
      {on && (
        <div
          ref={host}
          className="absolute inset-0"
          role="application"
          aria-label={`360° view: ${title}. Drag or use the arrow keys to look around, plus and minus to zoom.`}
          tabIndex={0}
        />
      )}
      {failed && <p className="absolute inset-x-4 bottom-4 bg-bg/90 p-3 text-sm">The 360° viewer could not start on this device. The flat image above shows the whole scene.</p>}
    </div>
  );
}
