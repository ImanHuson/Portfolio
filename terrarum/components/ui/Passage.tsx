import type { Refs } from "@/lib/content";
import type { Passage as P } from "@/lib/content/types";
import { Cite } from "./Refs";

export function Passage({ p, refs, level = 2 }: { p: P; refs: Refs; level?: 2 | 3 }) {
  const H = level === 2 ? "h2" : "h3";
  return (
    <section id={p.id} className="scroll-mt-24">
      <H className={`font-display ${level === 2 ? "text-3xl md:text-4xl" : "text-2xl"} leading-tight tracking-tight`}>{p.heading}</H>
      <div className="mt-4 max-w-[65ch] space-y-4 text-[17px] leading-relaxed">
        {p.body.map((para, i) => (
          <p key={i}>
            {para}
            {i === p.body.length - 1 && <Cite ids={p.cite} refs={refs} />}
          </p>
        ))}
      </div>
    </section>
  );
}

/** A plain proportional comparison: values as lengths, no tracks, no chart chrome.
 * `compact` puts label, bar and value on one row, for figures beside long text. */
export function Bars({ figure, compact = false }: { figure: NonNullable<P["figure"]>; compact?: boolean }) {
  const max = Math.max(...figure.rows.map((r) => r.value));
  if (compact)
    return (
      <figure>
        <dl className="space-y-3">
          {figure.rows.map((r) => (
            <div key={r.label} className="grid grid-cols-[minmax(6rem,9rem)_minmax(0,1fr)] items-center gap-x-4 gap-y-1">
              <dt className="text-sm">{r.label}</dt>
              <dd className="flex items-center gap-3">
                <span className="block h-2 bg-accent" style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }} aria-hidden />
                <span className="shrink-0 text-sm">{r.display}</span>
              </dd>
            </div>
          ))}
        </dl>
        <figcaption className="mt-4 text-[13px] leading-snug text-muted">{figure.caption}</figcaption>
      </figure>
    );
  return (
    <figure>
      <dl className="space-y-5">
        {figure.rows.map((r) => (
          <div key={r.label}>
            <dt className="flex items-baseline justify-between gap-4 text-sm opacity-80">
              <span>{r.label}</span>
            </dt>
            <dd className="mt-1">
              <span className="block font-display text-2xl md:text-3xl">{r.display}</span>
              <span className="mt-2 block h-1.5 bg-accent" style={{ width: `${(r.value / max) * 100}%` }} aria-hidden />
            </dd>
          </div>
        ))}
      </dl>
      <figcaption className="mt-5 text-[13px] opacity-75">{figure.caption}</figcaption>
    </figure>
  );
}
