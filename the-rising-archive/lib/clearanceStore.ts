import { STORAGE_KEY } from "@/lib/data/spoilers";

// External store for the reader's clearance, read via useSyncExternalStore
// (SSR-safe, no setState-in-effect). An in-memory cache keeps the choice for
// the session even where localStorage throws (private mode, blocked storage).
let cache: string | null | undefined;
const listeners = new Set<() => void>();

function read(): string | null {
  if (cache === undefined) {
    try {
      cache = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      cache = null;
    }
  }
  return cache;
}

export const clearanceStore = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        cache = e.newValue;
        cb();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(cb);
      window.removeEventListener("storage", onStorage);
    };
  },
  getSnapshot: read,
  getServerSnapshot: (): string | null => null,
  set(value: number) {
    cache = String(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, cache);
    } catch {
      /* per-reader convenience only */
    }
    listeners.forEach((l) => l());
  },
};

const RM = "(prefers-reduced-motion: reduce)";
export const reducedMotionStore = {
  subscribe(cb: () => void) {
    const mq = window.matchMedia(RM);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  },
  getSnapshot: () => window.matchMedia(RM).matches,
};
