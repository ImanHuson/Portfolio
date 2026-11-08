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

/** A plain proportional comparison: values as lengths, no tracks, no chart chrome. */
export function Bars({ figure }: { figure: NonNullable<P["figure"]> }) {
  const max = Math.max(...figure.rows.map((r) => r.value));
  return (
    <figure>
      <dl className="space-y-5">
        {figure.rows.map((r) => (
          <div key={r.label}>
            <dt className="flex items-baseline justify-between gap-4 text-sm opacity-80">
              <span>{r.label}</span>
            </dt>
            <dd className="mt-1">
              <span className="block font-display text-2xl tabular-nums md:text-3xl">{r.display}</span>
              <span className="mt-2 block h-1.5 bg-accent" style={{ width: `${(r.value / max) * 100}%` }} aria-hidden />
            </dd>
          </div>
        ))}
      </dl>
      <figcaption className="mt-5 text-[13px] opacity-75">{figure.caption}</figcaption>
    </figure>
  );
}
