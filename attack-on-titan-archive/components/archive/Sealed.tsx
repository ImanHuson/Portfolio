import { cn } from "@/lib/utils";
import { chapterNumber } from "@/lib/readStore";

/** A sealed passage: a native <details>, so it opens with JS off and needs no
 * state. Closed, it is a marked strip that says what is behind it and invites
 * the reader to open it; open, the passage reads as part of the file. */
export default function Sealed({
  label = "Sealed: spoils later chapters",
  children,
  className,
  onPaper = false,
  chapter,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
  /** on a paper document the strip is inked, not lit */
  onPaper?: boolean;
  /** the chapter that reveals it ("AOT-06"): the reader's "open seals up to" setting opens it */
  chapter?: string;
}) {
  const what = label.replace(/^sealed:\s*/i, "");
  return (
    <details data-ch={chapter ? chapterNumber(chapter) : undefined} className={cn("sealed group", className)}>
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center gap-3 border border-dashed px-4 py-3 transition-colors group-open:border-transparent group-open:hover:border-transparent group-open:hover:bg-transparent group-open:px-0 group-open:py-1 [&::-webkit-details-marker]:hidden",
          onPaper ? "border-ink/35 hover:border-ink/70 hover:bg-ink/[0.04]" : "border-paper/25 hover:border-paper/60 hover:bg-paper/[0.03]",
        )}
      >
        <span className={cn("font-military text-[0.95rem] font-semibold tracking-[0.14em] uppercase group-open:hidden", onPaper ? "text-blood" : "text-alert")}>Sealed</span>
        <span className={cn("min-w-0 flex-1 text-[0.95rem] leading-snug group-open:hidden", onPaper ? "text-ink/80" : "text-paper/80")}>{what}
          {chapter && <span className="ahead-note hidden text-ash"> · past where you&apos;ve read ({chapter})</span>}
        </span>
        <span className={cn("shrink-0 font-mono text-meta group-open:hidden", onPaper ? "text-ink/60" : "text-ash")}>Open</span>
        <span className={cn("hidden font-mono text-meta group-open:inline", onPaper ? "text-ink/60" : "text-ash")}>Reseal</span>
      </summary>
      <div className="pt-2">{children}</div>
    </details>
  );
}
