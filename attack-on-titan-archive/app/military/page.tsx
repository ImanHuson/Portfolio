import type { Metadata } from "next";
import ChapterHeader from "@/components/typography/ChapterHeader";
import NextChapter from "@/components/typography/NextChapter";
import SectionBackdrop from "@/components/archive/SectionBackdrop";
import Regiments from "@/components/military/Regiments";

export const metadata: Metadata = {
  title: "The Military",
  description: "The Training Corps, the Garrison, the Military Police, the Survey Corps, and Marley's Warriors: what each was for, who led it, who served.",
  alternates: { canonical: "./" },
};

export default function Military() {
  return (
    <>
      <ChapterHeader
        id="The archive"
        title="The Military"
        image="/images/heads/war.webp"
        imagePosition="50% 40%"
        lede="Three branches inside the Walls, the school that feeds them, and the army across the sea that trained children to break them."
      />
      <section aria-label="Regiment files" className="relative isolate px-4 py-20 md:px-8 md:py-28">
        <SectionBackdrop src="/images/heads/soldiers.webp" position="60% 30%" strength={0.16} />
        <Regiments />
        <p className="mx-auto mt-24 max-w-[1400px] text-[0.85rem] text-ash">
          The emblems are named, not drawn: they are the series&apos; own marks. Portraits: Attack on Titan (anime), &copy; Hajime Isayama, Kodansha /
          Attack on Titan Production Committee; Levi&apos;s file is fan art by an unidentified artist.
        </p>
      </section>
      <NextChapter current="" />
    </>
  );
}
