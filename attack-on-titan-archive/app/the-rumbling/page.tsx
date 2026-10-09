import type { Metadata } from "next";
import NextChapter from "@/components/typography/NextChapter";
import EndingGate from "@/components/ending/EndingGate";
import RumblingSection from "@/components/ending/RumblingSection";
import EndingHeader from "@/components/ending/EndingHeader";
import { RUMBLING_FACTS } from "@/lib/data/ending";
import SectionBackdrop from "@/components/archive/SectionBackdrop";
import { BG } from "@/lib/data/backgrounds";

export const metadata: Metadata = {
  title: "The Rumbling",
  description: "AOT-08. The ending of the story begins here. This file opens only on request.",
  alternates: { canonical: "./" },
};

export default function TheRumbling() {
  return (
    <EndingGate id="AOT-08" title="The Rumbling">
      <EndingHeader id="AOT-08" image={BG.wallTitan.src} lede="The Walls were never only walls. This is the file where they wake. Scroll slowly: it starts quiet." />
      <RumblingSection />
      <section aria-labelledby="rumbling-record" className="relative isolate bg-void px-4 py-24 md:px-8 md:py-32">
        <SectionBackdrop src={BG.titansMarching.src} credit={BG.titansMarching.credit} position="50% 45%" strength={0.34} />
        <div className="mx-auto max-w-[900px]">
          <h2 id="rumbling-record" className="font-mono text-meta tracking-[0.24em] text-ash uppercase">
            The record
          </h2>
          <ol className="mt-10 grid gap-8">
            {RUMBLING_FACTS.map((f) => (
              <li key={f} className="border-l border-paper/20 pl-6 text-lede leading-relaxed text-paper/80">
                {f}
              </li>
            ))}
          </ol>
        </div>
      </section>
      <NextChapter current="AOT-08" />
    </EndingGate>
  );
}
