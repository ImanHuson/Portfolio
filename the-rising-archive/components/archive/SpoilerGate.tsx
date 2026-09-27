"use client";

import { useEffect, useRef } from "react";
import { useArchive } from "@/components/providers/ArchiveProvider";
import { BOOK_TITLES } from "@/lib/data/spoilers";
import { cn } from "@/lib/utils";

/** A sealed passage. Native <details>, so it opens with JS disabled too.
 * JS only auto-opens it when the reader’s clearance already covers it;
 * it never forces anything closed. */
export default function SpoilerGate({
  book,
  children,
  className,
  compact = false,
}: {
  book: number;
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  const { clearance } = useArchive();

  useEffect(() => {
    if (ref.current && book <= clearance) ref.current.open = true;
  }, [book, clearance]);

  if (book <= 0) return <div className={className}>{children}</div>;

  return (
    <details ref={ref} className={cn("spoiler", className)} data-book={book}>
      <summary
        className={cn(
          "group flex items-center gap-3 border border-dashed border-line-strong text-ash transition-colors hover:border-red/70 hover:text-bone",
          compact ? "px-3 py-2 text-sm" : "px-4 py-4",
        )}
      >
        <span aria-hidden className="inline-block size-1.5 bg-red" />
        <span className="font-mono text-meta tracking-[0.18em] uppercase">
          Sealed. Contains {BOOK_TITLES[book]}.
        </span>
        <span className="ml-auto font-mono text-meta tracking-[0.18em] text-ash-2 uppercase group-hover:text-red">
          Open
        </span>
      </summary>
      {children}
    </details>
  );
}
