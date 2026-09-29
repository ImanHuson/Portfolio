import type { Metadata } from "next";
import Link from "next/link";
import SpoilerGate from "@/components/archive/SpoilerGate";
import Stamp from "@/components/archive/Stamp";

export const metadata: Metadata = {
  title: "VII. Red God",
  description: "The sealed file. Red God, the final Red Rising novel, is still being written; there is no confirmed publication date.",
  alternates: { canonical: "./" },
};

const LINES = [
  "The Republic is wounded.",
  "The Society is not dead.",
  "Darrow is still fighting.",
  "Lysander is still moving.",
  "Old debts remain unpaid.",
  "Old promises remain.",
];

export default function SealedPage() {
  return (
    <article className="relative min-h-[100svh] overflow-hidden px-5 pt-[calc(var(--nav-h)+5rem)] pb-32 font-mono md:px-8 md:pt-[calc(var(--nav-h)+7rem)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(233,228,218,0.02)_3px,rgba(233,228,218,0.02)_4px)]" />
      <div className="relative mx-auto max-w-[900px]">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-4 text-meta tracking-[0.22em] text-ash-2 uppercase">
          <span>Archive file VII</span>
          <span className="text-red">Status: incomplete</span>
        </div>
        <h1 className="mt-12 font-display text-colossal leading-[0.8] font-extrabold tracking-tight text-bone uppercase">
          VII <span className="block text-red">Red God</span>
        </h1>
        <p className="mt-10 text-meta tracking-[0.2em] text-ash uppercase">The final archive remains sealed.</p>

        <SpoilerGate book={6} className="mt-14">
          <ul role="list" className="mt-14 space-y-4 text-lg text-bone/85 md:text-xl">
            {LINES.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </SpoilerGate>

        <p className="mt-14 max-w-[52ch] font-serif text-h3 leading-snug text-bone italic">
          And somewhere beyond the last published page is the ending. We don’t know it yet. So this page stays unfinished.
        </p>

        <div className="mt-16 flex flex-wrap gap-3">
          <Stamp kind="sealed" />
          <span className="inline-flex items-center border border-red/70 px-2 py-0.5 text-meta tracking-[0.2em] text-red uppercase">Access denied</span>
          <span className="inline-flex items-center border border-line-strong px-2 py-0.5 text-meta tracking-[0.2em] text-ash uppercase">Waiting for author</span>
        </div>

        <section aria-labelledby="status" className="mt-20 border-t border-line pt-8 text-sm leading-relaxed text-ash">
          <h2 id="status" className="text-meta tracking-[0.22em] text-ash-2 uppercase">What is actually known, as of September 2026</h2>
          <ul role="list" className="mt-4 space-y-3 font-sans">
            <li>Light Bringer (2023) is still the sixth and latest published book.</li>
            <li>Red God has no publisher-confirmed release date.</li>
            <li>In a March 2026 interview, Pierce Brown said he was still writing it, that the manuscript had passed 1,000 pages, and that it could be split into two books.</li>
          </ul>
          <p className="mt-6 font-sans">
            Anything more specific you read elsewhere is a rumour until the publisher says otherwise.{" "}
            <Link href="/author/sources/" className="text-bone underline decoration-line-strong underline-offset-4 hover:text-red">
              Official sources
            </Link>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
