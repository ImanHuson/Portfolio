import type { Metadata } from "next";
import ChapterHeader from "@/components/typography/ChapterHeader";
import { BG } from "@/lib/data/backgrounds";
import Timeline from "@/components/timeline/Timeline";
import NextChapter from "@/components/typography/NextChapter";
import SectionBackdrop from "@/components/archive/SectionBackdrop";

export const metadata: Metadata = {
  title: "Timeline",
  description: "The whole story on one line, from Ymir Fritz to the end. The ending stays sealed.",
  alternates: { canonical: "./" },
};

export default function TimelinePage() {
  return (
    <>
      <ChapterHeader
        id="The archive"
        title="Timeline"
        image={BG.townGate.src}
        credit={BG.townGate.credit}
        imagePosition="50% 45%"
        lede="Two thousand years, from a girl in a forest to a single tree. Each entry says where to read it in full; the ending stays sealed until you open it."
      />
      <section aria-label="Timeline" className="relative isolate py-16 md:py-24">
        <SectionBackdrop src={BG.cityInk.src} credit={BG.cityInk.credit} position="50% 50%" strength={0.2} />
        <Timeline />
      </section>
      <NextChapter current="" />
    </>
  );
}
