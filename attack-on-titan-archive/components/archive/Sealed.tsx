import { cn } from "@/lib/utils";

/** A sealed passage: a native <details>, so it opens with JS off and needs no
 * state. Closed, it reads as a redaction bar with a stamp; open, as the file. */
export default function Sealed({
  label = "Sealed: spoils later chapters",
  children,
  className,
  onPaper = false,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
  /** on a paper document the label is inked in blood, not lit pink */
  onPaper?: boolean;
}) {
  return (
    <details className={cn("sealed group", className)}>
      <summary className="flex cursor-pointer list-none items-center gap-4 py-2 [&::-webkit-details-marker]:hidden">
        <span aria-hidden className="block h-4 min-w-12 flex-1 bg-ink/90 shadow-[inset_0_0_0_1px_rgba(216,208,184,0.12)] group-open:hidden" />
        <span className={cn("font-mono text-meta tracking-[0.14em] uppercase underline underline-offset-4 group-open:hidden", onPaper ? "font-medium text-blood decoration-blood/50" : "text-[#d98b82] decoration-[#d98b82]/40")}>
          {label}
        </span>
        <span className={cn("hidden font-mono text-meta tracking-[0.14em] uppercase group-open:inline", onPaper ? "text-ink/60" : "text-ash")}>Reseal</span>
      </summary>
      <div className="pt-2">{children}</div>
    </details>
  );
}
