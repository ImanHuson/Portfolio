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
        <>
        {saved.some((s) => s.seal) && (
          <section aria-labelledby="stamps-h" className="mt-10" data-theme-stamps>
            <h2 id="stamps-h" className="font-display text-2xl">Stamp book</h2>
            <p className="mt-2 max-w-[60ch] text-muted">
              Temples and shrines across Japan issue goshuin: a large crimson seal with the site&rsquo;s name and the date brushed beside it, collected in a booklet called a goshuinch&#333;. Places you save in Japan get a seal here.{" "}
              <a href="https://www.mlit.go.jp/tagengo-db/en/R2-01621.html" className="underline decoration-line underline-offset-2 hover:decoration-current">About goshuin: Japan Tourism Agency</a>.
            </p>
            <ul className="mt-6 flex flex-wrap gap-6">
              {saved.filter((s) => s.seal).map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="group flex flex-col items-center gap-2 bg-[#f3ecdd] px-5 pb-3 pt-5 text-[#1d1a16] shadow-[0_10px_24px_rgb(0_0_0/0.35)]">
                    <span lang="ja" aria-hidden className="hanko" data-size="lg">{s.seal}</span>
                    <span className="text-sm font-medium group-hover:underline">{s.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
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
        </>
      )}
    </>
  );
}
