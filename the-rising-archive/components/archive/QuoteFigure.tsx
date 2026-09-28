import SpoilerGate from "@/components/archive/SpoilerGate";
import type { SagaQuote } from "@/lib/data/quotes";
import { cn } from "@/lib/utils";

/** A short quotation, sealed at the book it comes from. With `showSpeaker`,
 * a spoiler-safe speaker name stays visible while the line is sealed, so a
 * sealed list still reads as a list of quotes rather than a wall of seals. */
export default function QuoteFigure({
  q,
  size = "lg",
  showSpeaker = false,
  className,
}: {
  q: SagaQuote;
  size?: "lg" | "md";
  showSpeaker?: boolean;
  className?: string;
}) {
  const label = showSpeaker && q.speaker && q.book > 0;
  return (
    <div className={cn("quote-wrap", className)}>
      {label && (
        <p className="quote-label mb-3 font-serif text-2xl text-bone/80 italic">
          A line from {q.speaker}
        </p>
      )}
      <SpoilerGate book={q.book} compact>
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
    </div>
  );
}
