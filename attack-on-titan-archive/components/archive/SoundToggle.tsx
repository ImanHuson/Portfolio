"use client";

import { useSyncExternalStore } from "react";
import { sound } from "@/lib/audio/engine";

/** Off by default. Sound starts only on this click (browsers block
 * autoplay, and nobody should be ambushed by audio). */
export default function SoundToggle() {
  const on = useSyncExternalStore(sound.subscribe, sound.getSnapshot, () => false);
  return (
    <button
      type="button"
      data-js-only
      aria-pressed={on}
      aria-label="Sound"
      onClick={() => void sound.toggle()}
      className="group flex items-center gap-2 py-2 font-military text-[0.85rem] tracking-[0.14em] whitespace-nowrap text-paper/80 sm:tracking-[0.24em] uppercase transition-colors hover:text-paper"
    >
      <span aria-hidden className="flex h-3 items-end gap-[2px]">
        {[0.5, 1, 0.7].map((h, i) => (
          <span
            key={i}
            className={on ? "w-[2px] bg-paper motion-safe:animate-pulse" : "w-[2px] bg-ash-2"}
            style={{ height: `${h * 100}%`, animationDelay: `${i * 160}ms` }}
          />
        ))}
      </span>
      <span className="sr-only sm:not-sr-only">Sound {on ? "on" : "off"}</span>
    </button>
  );
}
