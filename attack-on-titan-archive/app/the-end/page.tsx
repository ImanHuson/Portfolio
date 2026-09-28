import type { Metadata } from "next";
import Link from "next/link";
import EndingGate from "@/components/ending/EndingGate";
import Tree from "@/components/ending/Tree";
import { END_FACTS, PUBLICATION, STATUS_LINES } from "@/lib/data/ending";

export const metadata: Metadata = {
  title: "The End",
  description: "AOT-10. The end of the story, and of the archive. This file opens only on request.",
  alternates: { canonical: "./" },
};

const d = (s: number) => ({ animationDelay: `${s}s` });

export default function TheEnd() {
  return (
    <EndingGate id="AOT-10" title="The End">
      {/* no interface: black, a tree, and the lines */}
      <section aria-label="The end" className="relative flex min-h-[100dvh] flex-col items-center justify-end overflow-hidden bg-void px-4 pb-10">
        <Tree className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[1400px]" />
        <div className="relative z-10 mb-[38vh] text-center font-display text-paper md:mb-[30vh]">
          <p className="end-line text-[clamp(1.8rem,1rem+3vw,3.6rem)] leading-tight font-bold" style={d(7)}>
            The story ended.
          </p>
          <p className="end-line mt-4 text-[clamp(1.8rem,1rem+3vw,3.6rem)] leading-tight font-bold text-paper/80" style={d(10)}>
            The questions did not.
          </p>
        </div>
      </section>

      <section aria-labelledby="status-title" className="bg-void px-4 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-[640px]">
          <h2 id="status-title" className="sr-only">
            Archive status
          </h2>
          <dl className="grid gap-5 font-mono text-[0.95rem] tracking-[0.24em] uppercase md:text-[1.05rem]">
            {STATUS_LINES.map(([k, v]) => (
              <div key={k} className="grid grid-cols-2 gap-6 border-b border-paper/10 pb-4">
                <dt className="text-ash">{k}</dt>
                <dd className="text-paper">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="end-record" className="bg-void px-4 pb-24 md:px-8 md:pb-32">
        <div className="mx-auto grid max-w-[900px] gap-16">
          <div>
            <h2 id="end-record" className="font-mono text-meta tracking-[0.24em] text-ash uppercase">
              The record
            </h2>
            <ol className="mt-10 grid gap-8">
              {END_FACTS.map((f) => (
                <li key={f} className="border-l border-paper/20 pl-6 text-lede leading-relaxed text-paper/80">
                  {f}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="font-mono text-meta tracking-[0.24em] text-ash uppercase">How it ended, on the page and on screen</h2>
            <dl className="mt-8 grid gap-4">
              {PUBLICATION.map((p) => (
                <div key={p.what} className="grid gap-1 md:grid-cols-[12rem_1fr] md:gap-8">
                  <dt className="font-military text-[1.05rem] tracking-[0.08em] text-paper uppercase">{p.what}</dt>
                  <dd className="text-paper/70">{p.when}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Link
            href="/#index"
            className="justify-self-start border border-paper/40 px-5 py-3 font-mono text-meta tracking-[0.2em] text-paper uppercase transition-colors hover:border-paper hover:bg-paper/5"
          >
            Return to the archive
          </Link>
        </div>
      </section>
    </EndingGate>
  );
}
