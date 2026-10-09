// How far the reader has read, by archive chapter: 0 = keep every seal shut,
// 10 = the end. Kept in this browser only. Seals that carry a chapter
// (data-ch, see Sealed) open up to it; later ones stay shut and say so.

const KEY = "aot-read";
const listeners = new Set<() => void>();

function read(): number {
  try {
    const n = Number(localStorage.getItem(KEY));
    return Number.isInteger(n) && n >= 0 && n <= 10 ? n : 0;
  } catch {
    return 0;
  }
}

export const readStore = {
  subscribe(fn: () => void) {
    listeners.add(fn);
    const onStorage = (e: StorageEvent) => e.key === KEY && fn();
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(fn);
      window.removeEventListener("storage", onStorage);
    };
  },
  getSnapshot: read,
  getServerSnapshot: () => 0,
  set(n: number) {
    try {
      localStorage.setItem(KEY, String(n));
    } catch {
      /* private mode: the choice lasts until the page closes */
    }
    listeners.forEach((fn) => fn());
  },
};

/** "AOT-06" -> 6 */
export const chapterNumber = (id: string) => Number(id.replace(/\D/g, "")) || 0;
