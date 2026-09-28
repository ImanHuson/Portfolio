import SpoilerGate from "@/components/archive/SpoilerGate";
import type { SagaQuote } from "@/lib/data/quotes";
import { cn } from "@/lib/utils";

/** A short quotation, sealed at the book it comes from. */
export default function QuoteFigure({ q, size = "lg", className }: { q: SagaQuote; size?: "lg" | "md"; className?: string }) {
  return (
    <SpoilerGate book={q.book} compact className={className}>
      <figure>
        <blockquote className={cn("max-w-[34ch] font-serif text-bone italic", size === "lg" ? "text-h2" : "text-2xl md:text-3xl", "leading-tight")}>
          “{q.text}”
        </blockquote>
        <figcaption className="mt-4 font-mono text-meta tracking-[0.18em] text-ash uppercase">
          {q.who}, <span className="text-ash-2">{q.where}</span>
        </figcaption>
        {q.note && <p className="mt-2 text-sm text-ash-2">{q.note}</p>}
      </figure>
    </SpoilerGate>
  );
}
