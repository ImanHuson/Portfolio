"use client";

import { BookmarkSimple } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import { toggleSaved, useSaved } from "@/lib/savedStore";

/**
 * Save a place to this browser. Where the country stamps what you keep (Japan:
 * a hanko, as a temple stamps a goshuin book), saving presses the place's name
 * as a red seal.
 */
export function SaveButton({ href, title, kind, seal }: { href: string; title: string; kind: string; seal?: string }) {
  const saved = useSaved().some((s) => s.href === href);
  const [pressed, setPressed] = useState(0);
  return (
    <span className="inline-flex items-center gap-4" data-js-only>
      <button
        type="button"
        aria-pressed={saved}
        onClick={() => {
          toggleSaved({ href, title, kind, seal });
          if (!saved) setPressed(Date.now());
        }}
        className={`press inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium ${seal ? "glass rounded-full" : "border border-line hover:border-ink"}`}
      >
        <BookmarkSimple size={16} weight={saved ? "fill" : "regular"} aria-hidden className={saved && !seal ? "text-accent" : ""} />
        {saved ? "Saved" : "Save this place"}
      </button>
      {saved && seal && (
        <span key={pressed} lang="ja" aria-hidden data-hanko data-press={pressed ? "" : undefined} className="hanko">
          {seal}
        </span>
      )}
      {saved && (
        <Link href="/saved/" className="text-sm underline underline-offset-2 opacity-80 hover:opacity-100">
          {seal ? "Your stamp book" : "Your saved places"}
        </Link>
      )}
    </span>
  );
}
