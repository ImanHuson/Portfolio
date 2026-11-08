"use client";

import { BookmarkSimple } from "@phosphor-icons/react";
import Link from "next/link";
import { toggleSaved, useSaved } from "@/lib/savedStore";

export function SaveButton({ href, title, kind }: { href: string; title: string; kind: string }) {
  const saved = useSaved().some((s) => s.href === href);
  return (
    <span className="inline-flex items-center gap-3" data-js-only>
      <button
        type="button"
        aria-pressed={saved}
        onClick={() => toggleSaved({ href, title, kind })}
        className="press inline-flex items-center gap-2 border border-line px-3 py-2 text-sm font-medium hover:border-ink"
      >
        <BookmarkSimple size={16} weight={saved ? "fill" : "regular"} aria-hidden className={saved ? "text-accent" : ""} />
        {saved ? "Saved" : "Save this place"}
      </button>
      {saved && (
        <Link href="/saved/" className="text-sm text-muted underline underline-offset-2 hover:text-ink">
          Your saved places
        </Link>
      )}
    </span>
  );
}
