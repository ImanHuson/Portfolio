import type { Metadata } from "next";
import NextChapter from "@/components/typography/NextChapter";
import EndingGate from "@/components/ending/EndingGate";
import PathsSection from "@/components/ending/PathsSection";
import EndingHeader from "@/components/ending/EndingHeader";
import { PATHS_FACTS } from "@/lib/data/ending";
import SectionBackdrop from "@/components/archive/SectionBackdrop";

export const metadata: Metadata = {
  title: "Paths",
  description: "AOT-09. Part of the ending. This file opens only on request.",
  alternates: { canonical: "./" },
};

export default function Paths() {
  return (
    <EndingGate id="AOT-09" title="Paths">
      <EndingHeader id="AOT-09" image="/images/bg/paths.webp" contain lede="Where every Subject of Ymir is connected: a desert under stars, and a column of light that branches out to every one of them." />
      <PathsSection />
      <section aria-labelledby="paths-record" className="relative isolate bg-void px-4 py-24 md:px-8 md:py-32">
        <SectionBackdrop src="/images/bg/paths.webp" contain strength={0.5} />
        <div className="mx-auto max-w-[900px]">
          <h2 id="paths-record" className="font-mono text-meta tracking-[0.24em] text-ash uppercase">
            The record
          </h2>
          <ol className="mt-10 grid gap-8">
            {PATHS_FACTS.map((f) => (
              <li key={f} className="border-l border-paper/20 pl-6 text-lede leading-relaxed text-paper/80">
                {f}
              </li>
            ))}
          </ol>
        </div>
      </section>
      <NextChapter current="AOT-09" />
    </EndingGate>
  );
}
