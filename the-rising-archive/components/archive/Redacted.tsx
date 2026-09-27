"use client";

import { useEffect, useRef } from "react";
import { useArchive } from "@/components/providers/ArchiveProvider";
import { BOOK_TITLES } from "@/lib/data/spoilers";
import { cn } from "@/lib/utils";

/** An intelligence-file redaction: a black bar until the reader's clearance
 * covers it. Native <details>, like SpoilerGate, so it still opens with JS off. */
export default function Redacted({ book, children, className }: { book: number; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const { clearance } = useArchive();
  useEffect(() => {
    if (ref.current && book <= clearance) ref.current.open = true;
  }, [book, clearance]);
  if (book <= 0) return <div className={className}>{children}</div>;
  return (
    <details ref={ref} className={cn("spoiler", className)}>
      <summary className="group flex min-h-7 cursor-pointer items-center gap-3">
        <span aria-hidden className="block h-4 flex-1 bg-bone/90 transition-colors group-hover:bg-red" />
        <span className="font-mono text-[0.65rem] tracking-[0.2em] text-ash-2 uppercase">
          Redacted to {BOOK_TITLES[book]}
        </span>
      </summary>
      {children}
    </details>
  );
}
