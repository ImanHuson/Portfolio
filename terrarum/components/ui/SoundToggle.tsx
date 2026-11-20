"use client";

import { SpeakerSimpleHigh, SpeakerSimpleSlash } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { sound, type Sound } from "@/lib/content/sounds";
import { THEMES } from "@/lib/themes";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const KEY = "terrarum-sound";
const LEVEL = 0.6;

/** The reader's choice, kept in this browser; "off" on the server and by default. */
const prefListeners = new Set<() => void>();
function readPref() {
  try {
    return localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
}
function writePref(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    // Not remembered; the in-memory listeners still update this visit.
  }
  memo = on;
  prefListeners.forEach((l) => l());
}
let memo: boolean | null = null;
const getPref = () => (memo ??= readPref());
const subscribePref = (l: () => void) => {
  prefListeners.add(l);
  return () => prefListeners.delete(l);
};

/** One audio element per recording, shared for the life of the page. */
const players = new Map<string, HTMLAudioElement>();
function player(s: Sound) {
  let a = players.get(s.id);
  if (!a) {
    a = new Audio(`${BASE}/${s.file}`);
    a.loop = s.loop;
    a.preload = "auto";
    players.set(s.id, a);
  }
  return a;
}

/** The bed for this page, from the theme of the country it belongs to. */
function bedFor(path: string): { bed?: Sound; greet?: Sound } {
  const theme = THEMES[path.split("/")[1] ?? ""];
  const b = theme?.sound?.beds.find((x) => path.startsWith(x.path));
  return { bed: b && sound(b.id), greet: theme?.sound?.greet ? sound(theme.sound.greet) : undefined };
}

/** Ramp an element's volume; resolves when done. iOS ignores volume, so the
 * files are already quiet and the ramp is only a nicety. */
function ramp(a: HTMLAudioElement, to: number, ms: number) {
  return new Promise<void>((done) => {
    const from = a.volume;
    const t0 = performance.now();
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      a.volume = from + (to - from) * k;
      if (k < 1) requestAnimationFrame(step);
      else done();
    };
    requestAnimationFrame(step);
  });
}

/**
 * A country's optional sound: field recordings of the place, off by default.
 * Shown only on pages whose country has sound; the choice is remembered in
 * this browser. A browser may refuse to start sound before the reader has
 * clicked anything; then the control simply stays off until they do.
 */
export function SoundToggle() {
  const path = usePathname();
  const { bed, greet } = bedFor(path);
  const pref = useSyncExternalStore(subscribePref, getPref, () => false);
  // Set when the browser refuses to start sound without a click first.
  const [blocked, setBlocked] = useState(false);
  const on = pref && !blocked;
  const playing = useRef<HTMLAudioElement | null>(null);

  // Keep the right bed playing for this page, crossfading on navigation.
  useEffect(() => {
    const want = on && bed ? player(bed) : null;
    const cur = playing.current;
    if (cur && cur !== want)
      ramp(cur, 0, 700).then(() => {
        if (playing.current !== cur) cur.pause();
      });
    if (want && want !== cur) {
      want.volume = 0;
      want
        .play()
        .then(() => ramp(want, LEVEL, 1200))
        .catch(() => setBlocked(true));
    }
    playing.current = want;
  }, [on, bed]);

  // Silence while the tab is hidden; resume when it returns.
  useEffect(() => {
    const vis = () => {
      const a = playing.current;
      if (!a) return;
      if (document.hidden) a.pause();
      else a.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, []);

  // Stop everything if the header ever unmounts.
  useEffect(() => () => players.forEach((a) => a.pause()), []);

  if (!bed) return null;

  const toggle = () => {
    const next = !on;
    setBlocked(false);
    writePref(next);
    if (!greet) return;
    const g = player(greet);
    if (next) {
      g.currentTime = 0;
      g.volume = LEVEL;
      g.play().catch(() => {});
    } else if (!g.paused) ramp(g, 0, 500).then(() => g.pause());
  };

  return (
    <span className="flex items-center" data-js-only>
      {on && (
        <Link
          href="/sources/#sound"
          className="mr-1 hidden max-w-[16rem] truncate rounded-sm px-2 py-2 text-[13px] text-[#9aa1a8] hover:text-white lg:inline"
          title={`${bed.title}. Recorded by ${bed.creator}, ${bed.license}.`}
        >
          {bed.short}
        </Link>
      )}
      <button
        type="button"
        aria-pressed={on}
        onClick={toggle}
        className="press flex items-center gap-2 rounded-sm px-1.5 py-2 text-[#c9c4bb] hover:text-white sm:px-3"
      >
        {on ? <SpeakerSimpleHigh size={18} aria-hidden /> : <SpeakerSimpleSlash size={18} aria-hidden />}
        <span className="hidden sm:inline">Sound</span>
        <span className="sr-only sm:hidden">Sound</span>
      </button>
    </span>
  );
}
