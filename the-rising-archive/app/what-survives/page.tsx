import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/archive/Reveal";
import SpoilerGate from "@/components/archive/SpoilerGate";
import { SURVIVES } from "@/lib/data/ideas";

export const metadata: Metadata = {
  title: "What the war couldn’t kill",
  description: "The end of the archive: the things the war couldn’t kill.",
  alternates: { canonical: "./" },
};

// The archive ends here. Not with "buy the books".
export default function WhatSurvivesPage() {
  return (
    <article className="px-5 pt-[calc(var(--nav-h)+6rem)] pb-40 md:px-8 md:pt-[calc(var(--nav-h)+9rem)]">
      <div className="mx-auto max-w-[900px]">
        <h1 className="font-display text-h1 leading-[0.85] font-extrabold uppercase">
          The things the war <span className="text-red">couldn’t kill</span>
        </h1>
        <ol role="list" className="mt-20 space-y-10">
          {SURVIVES.map((s, i) => (
            <Reveal as="li" key={s.text} delay={0.02 * i}>
              <SpoilerGate book={s.book} compact>
                <p className={i === SURVIVES.length - 1 ? "font-serif text-h2 leading-tight text-bone italic" : "font-serif text-h3 leading-snug text-bone/90"}>{s.text}</p>
              </SpoilerGate>
            </Reveal>
          ))}
        </ol>
        <p className="mt-32 font-mono text-meta tracking-[0.22em] text-ash-2 uppercase">The archive ends here.</p>
        <div className="mt-6 flex flex-wrap gap-8 font-mono text-meta tracking-[0.2em] uppercase">
          <Link href="/" className="border-b border-red pb-1 hover:text-red">Back to the beginning</Link>
          <Link href="/sealed/" className="border-b border-line-strong pb-1 text-ash hover:text-bone">The sealed file</Link>
        </div>
      </div>
    </article>
  );
}
