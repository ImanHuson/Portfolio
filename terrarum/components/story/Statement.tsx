import type { Refs } from "@/lib/content";
import type { Fact } from "@/lib/content/types";
import { Cite } from "@/components/ui/Refs";

/**
 * One idea, set large: why a place matters, as a single editorial line. Where
 * the country sets names vertically, the native name stands behind it,
 * enormous and faint, as a typographic image on the dark ground.
 */
export function Statement({ label, text, id, watermark, lang }: { label: string; text: string; id: string; watermark?: string; lang?: string }) {
  return (
    <section aria-labelledby={id} className="relative isolate overflow-hidden">
      {watermark && (
        <p aria-hidden lang={lang} className="cine-kanji tategaki pointer-events-none absolute right-[2vw] top-[6vh] -z-10 font-display max-md:text-[clamp(5rem,38vw,9rem)] max-md:opacity-10" style={{ "--n": [...(watermark ?? "")].length } as React.CSSProperties}>
          {watermark}
        </p>
      )}
      <div className="settle mx-auto max-w-[1100px] px-4 py-[16vh] md:px-8">
        <h2 id={id} className="text-sm font-medium tracking-wide text-accent-text">{label}</h2>
        <p className="mt-6 font-display text-3xl leading-[1.25] md:text-5xl md:leading-[1.2]">{text}</p>
      </div>
    </section>
  );
}

/** Key facts as a band of large figures, ruled like a temple notice board. */
export function FactBand({ facts, refs }: { facts: Fact[]; refs: Refs }) {
  return (
    <dl className="settle mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)] gap-y-10 px-4 pb-[12vh] sm:grid-cols-2 md:px-8 lg:grid-cols-3">
      {facts.map((f) => (
        <div key={f.label} className="fact-rule border-l border-line pl-5 pr-4">
          <dt className="text-sm text-muted">{f.label}</dt>
          <dd className="mt-3 font-display text-xl leading-snug md:text-2xl">
            {f.value}
            <Cite ids={f.cite} refs={refs} />
            {(f.asOf || f.note) && (
              <span className="mt-2 block font-sans text-[13px] leading-snug text-muted">
                {[f.asOf && `As of ${f.asOf}`, f.note].filter(Boolean).join(". ")}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
