import type { Refs } from "@/lib/content";
import type { Fact } from "@/lib/content/types";
import { Cite } from "./Refs";

/** Key facts as a definition list: label, value, date where it changes. */
export function Facts({ facts, refs, className = "" }: { facts: Fact[]; refs: Refs; className?: string }) {
  return (
    <dl className={`grid gap-x-8 gap-y-5 sm:grid-cols-2 ${className}`}>
      {facts.map((f) => (
        <div key={f.label} className="border-t border-line pt-3">
          <dt className="text-sm text-muted">{f.label}</dt>
          <dd className="mt-1 text-[17px] leading-snug">
            {f.value}
            <Cite ids={f.cite} refs={refs} />
            {(f.asOf || f.note) && (
              <span className="mt-1 block text-[13px] text-muted">
                {[f.asOf && `As of ${f.asOf}`, f.note].filter(Boolean).join(". ")}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
