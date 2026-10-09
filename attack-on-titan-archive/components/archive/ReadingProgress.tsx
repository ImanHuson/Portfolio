"use client";

import { useSyncExternalStore } from "react";
import { CHAPTERS } from "@/lib/data/chapters";
import { readStore } from "@/lib/readStore";
import { cn } from "@/lib/utils";

/** "Open seals up to": the reader's own spoiler line. Needs JS, so it is
 * hidden with JS off (data-js-only), where every seal stays shut. */
export default function ReadingProgress({ className }: { className?: string }) {
  const upTo = useSyncExternalStore(readStore.subscribe, readStore.getSnapshot, readStore.getServerSnapshot);
  return (
    <label data-js-only className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
      <span className="font-military text-[0.95rem] font-semibold tracking-[0.14em] text-ash uppercase">Open seals up to</span>
      <select
        value={upTo}
        onChange={(e) => readStore.set(Number(e.target.value))}
        className="min-w-0 border border-line-strong bg-base px-3 py-2 font-mono text-meta text-paper transition-colors hover:border-paper/60"
      >
        <option value={0}>Nothing: keep every seal shut</option>
        {CHAPTERS.slice(1).map((c, i) => (
          <option key={c.id} value={i + 2}>
            {c.id} {c.title}
            {i + 2 === CHAPTERS.length ? " (everything)" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
