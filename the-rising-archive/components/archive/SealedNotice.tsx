"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useArchive } from "@/components/providers/ArchiveProvider";
import { CLEARANCE_LEVELS } from "@/lib/data/spoilers";

/** At low clearance a page can be mostly sealed bars, which reads as empty.
 * This says so plainly, counts what is sealed, and offers the two real
 * choices: unseal this page only, or change clearance. */
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
      className="fixed right-4 bottom-4 z-30 flex max-w-[calc(100vw-2rem)] flex-wrap items-center gap-x-4 gap-y-2 border border-line-strong bg-void-2/95 py-2.5 pr-2 pl-4 font-mono text-[0.68rem] tracking-[0.16em] text-ash uppercase shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-md"
    >
      <span>
        <span className="text-bone">{count}</span> sealed here <span className="text-ash-2">({lvl?.short})</span>
      </span>
      <button
        type="button"
        onClick={() => document.querySelectorAll<HTMLDetailsElement>("main details.spoiler").forEach((d) => (d.open = true))}
        className="text-bone underline decoration-red underline-offset-4 hover:text-red"
      >
        Unseal this page
      </button>
      <button type="button" onClick={openClearance} className="hover:text-bone">
        Clearance
      </button>
      <button type="button" aria-label="Dismiss" onClick={() => setDismissed(pathname)} className="flex size-7 items-center justify-center text-ash-2 hover:text-bone">
        <X className="size-3.5" strokeWidth={1.5} />
      </button>
    </aside>
  );
}
