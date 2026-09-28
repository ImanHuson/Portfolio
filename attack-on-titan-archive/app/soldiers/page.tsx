import type { Metadata } from "next";
import ChapterHeader from "@/components/typography/ChapterHeader";
import NextChapter from "@/components/typography/NextChapter";
import PersonnelDesk from "@/components/soldiers/PersonnelDesk";

export const metadata: Metadata = {
  title: "The Soldiers",
  description: "Sixteen personnel files: the 104th Cadet Corps, the Survey Corps, and the Warriors of Marley, each recovered as a different kind of record.",
  alternates: { canonical: "./" },
};

export default function Soldiers() {
  return (
    <>
      <ChapterHeader
        id="AOT-03"
        title="The Soldiers"
        trail={[{ href: "/the-fall/", label: "AOT-02" }]}
        lede="Sixteen files, recovered in whatever state they survived: a burned print, a clipped photograph, a page from a notebook, a poster. Open one."
      />
      <section aria-label="Personnel files" className="px-4 pb-28 md:px-8 md:pb-40">
        <div className="mx-auto max-w-[1400px]">
          <PersonnelDesk />
          <p className="mt-20 max-w-[70ch] text-[0.85rem] text-ash-2">
            Images: Attack on Titan (anime), &copy; Hajime Isayama, Kodansha / Attack on Titan Production Committee, used for
            identification and commentary. Levi&apos;s file uses fan art by an artist this archive could not identify.
          </p>
        </div>
      </section>
      <NextChapter href="/titans/" id="AOT-04" title="The Titans" line="Nine inheritances, handed down by being eaten, from the Founding to the War Hammer." />
    </>
  );
}
