/** The tree on the hill: a deterministic branching drawn as SVG strokes, so it
 * renders with JS off and draws itself once (CSS, not under reduced motion). */
function branches() {
  const out: { d: string; w: number; depth: number }[] = [];
  let seed = 139;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  function grow(x: number, y: number, ang: number, len: number, w: number, depth: number) {
    if (depth > 9 || len < 3) return;
    const bend = (rnd() - 0.5) * 0.35;
    const x2 = x + Math.cos(ang) * len;
    const y2 = y - Math.sin(ang) * len;
    const cx = x + Math.cos(ang + bend) * len * 0.5;
    const cy = y - Math.sin(ang + bend) * len * 0.5;
    out.push({ d: `M${x.toFixed(1)} ${y.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`, w, depth });
    const n = depth < 2 ? 2 : rnd() < 0.3 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const spread = 0.35 + rnd() * 0.35;
      const a = ang + (i - (n - 1) / 2) * spread + (rnd() - 0.5) * 0.25;
      // the crown spreads wide and flattens, like a broad old tree
      const flat = a + (Math.PI / 2 - a) * -0.12;
      grow(x2, y2, flat, len * (0.72 + rnd() * 0.1), w * 0.68, depth + 1);
    }
  }
  grow(500, 520, Math.PI / 2 + 0.03, 110, 16, 0);
  return out;
}

const BRANCHES = branches();

export default function Tree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1000 600" className={className} role="img" aria-label="A single tree on a hill, in the dark.">
      <path d="M0 600 Q 280 548 500 522 T 1000 574 L1000 600 Z" fill="#0d0e0c" />
      <path d="M0 600 Q 280 548 500 522 T 1000 574" fill="none" stroke="#3a3b35" strokeWidth="1.2" />
      <g fill="none" stroke="#2c2d28" strokeLinecap="round">
        {BRANCHES.map((b, i) => (
          <path
            key={i}
            d={b.d}
            strokeWidth={Math.max(0.6, b.w)}
            pathLength={1}
            className="tree-branch"
            style={{ animationDelay: `${1.2 + b.depth * 0.45}s` }}
          />
        ))}
      </g>
    </svg>
  );
}
