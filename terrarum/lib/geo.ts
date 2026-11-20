/** A map frame around some points, padded, never smaller than `min` degrees. */
export function boundsOf(points: { lat: number; lng: number }[], pad = 0.25, min = 0.01): [[number, number], [number, number]] {
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  let [w, e, s, n] = [Math.min(...lngs), Math.max(...lngs), Math.min(...lats), Math.max(...lats)];
  const dx = Math.max(e - w, min);
  const dy = Math.max(n - s, min);
  const cx = (w + e) / 2;
  const cy = (s + n) / 2;
  w = cx - (dx / 2) * (1 + pad * 2);
  e = cx + (dx / 2) * (1 + pad * 2);
  s = cy - (dy / 2) * (1 + pad * 2);
  n = cy + (dy / 2) * (1 + pad * 2);
  return [[w, s], [e, n]];
}
