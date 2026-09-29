"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useArchive } from "@/components/providers/ArchiveProvider";
import { CLEARANCE_LEVELS } from "@/lib/data/spoilers";

/** At low clearance a page can be mostly sealed bars, which reads as empty.
 * This says so plainly, counts what is sealed, and offers the two real
 * choices: unseal this page only, or change clearance. It sits in the empty
 * band under the header at the top of the page and scrolls away with it:
 * as a fixed pill it covered text and sealed rows on nearly every page. */
export default function SealedNotice() {
  const pathname = usePathname();
  const { clearance, known, openClearance } = useArchive();
  const [count, setCount] = useState(0);
  const [dismissed, setDismissed] = useState<string | null>(null);

  useEffect(() => {
    const recount = () => setCount(document.querySelectorAll("main details.spoiler:not([open])").length);
    const t = window.setTimeout(recount, 400);
    const onToggle = () => window.requestAnimationFrame(recount);
    document.addEventListener("toggle", onToggle, true);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("toggle", onToggle, true);
    };
  }, [pathname, clearance]);

  if (!known || count < 3 || dismissed === pathname) return null;
  const lvl = CLEARANCE_LEVELS.find((l) => l.value === clearance);

  return (
    <aside
      aria-label="Sealed passages on this page"
      className="absolute top-[calc(var(--nav-h)+0.75rem)] right-5 z-30 flex max-w-[calc(100vw-2.5rem)] items-center gap-x-2.5 border border-line-strong bg-void-2/90 py-0.5 pr-0.5 pl-3 font-mono text-meta tracking-[0.08em] whitespace-nowrap text-ash uppercase sm:tracking-[0.14em] md:right-8 md:gap-x-4"
    >
      <span>
        <span className="text-bone">{count}</span> sealed<span className="hidden sm:inline"> here ({lvl?.short})</span>
      </span>
      <button
        type="button"
        onClick={() => document.querySelectorAll<HTMLDetailsElement>("main details.spoiler").forEach((d) => (d.open = true))}
        className="py-1.5 text-bone underline decoration-red underline-offset-4 hover:text-red"
      >
        Unseal<span className="hidden sm:inline"> this page</span>
      </button>
      <button type="button" onClick={openClearance} className="py-1.5 hover:text-bone">
        Clearance
      </button>
      <button type="button" aria-label="Dismiss" onClick={() => setDismissed(pathname)} className="flex size-8 items-center justify-center text-ash hover:text-bone">
        <X className="size-3.5" strokeWidth={1.5} />
      </button>
    </aside>
  );
}
