/**
 * Runs `start` once, when `el` comes within `margin` of the viewport (or at
 * once where IntersectionObserver is missing). Maps use it so MapLibre's
 * ~800 KB chunk loads only when a map is about to be seen: Lighthouse
 * measured ~3.4 s of mobile scripting on a city page whose map is far below
 * the fold. Returns a cleanup that cancels a start that hasn't happened.
 */
export function whenNear(el: Element | null, start: () => void, margin = "800px"): () => void {
  if (!el) return () => {};
  if (typeof IntersectionObserver === "undefined") {
    start();
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        start();
      }
    },
    { rootMargin: margin },
  );
  io.observe(el);
  return () => io.disconnect();
}
