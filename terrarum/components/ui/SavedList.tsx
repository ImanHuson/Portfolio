"use client";

import Link from "next/link";
import { removeSaved, useSaved } from "@/lib/savedStore";

export function SavedList() {
  const saved = useSaved();
  return (
    <>
      <noscript>
        <p className="mt-10 text-muted">Saved places need JavaScript.</p>
      </noscript>
      {saved.length === 0 ? (
        <p className="mt-10 text-muted" data-js-only>
          Nothing saved yet. Every place and city has a <span className="text-ink">Save this place</span> button under its name.{" "}
          <Link href="/" className="text-ink underline underline-offset-2">Back to the globe</Link>
        </p>
      ) : (
        <ul className="mt-10 grid gap-x-10 md:grid-cols-2">
          {saved.map((s) => (
            <li key={s.href} className="flex items-baseline justify-between gap-4 border-t border-line py-4">
              <span className="min-w-0">
                <Link href={s.href} className="text-lg font-medium underline-offset-4 hover:underline">{s.title}</Link>
                <span className="block text-sm text-muted">{s.kind}</span>
              </span>
              <button type="button" onClick={() => removeSaved(s.href)} className="press shrink-0 text-sm text-muted underline underline-offset-2 hover:text-ink">
                Remove<span className="sr-only"> {s.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
