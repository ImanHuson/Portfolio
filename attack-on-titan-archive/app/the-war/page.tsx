import type { Metadata } from "next";
import ChapterHeader from "@/components/typography/ChapterHeader";
import NextChapter from "@/components/typography/NextChapter";
import BattleSection from "@/components/war/BattleSection";
import OdmSection from "@/components/war/OdmSection";
import Memorial from "@/components/war/Memorial";

export const metadata: Metadata = {
  title: "The War",
  description:
    "The battles of 850 on a map of the Walls, Fort Slava and Liberio across the sea, the omni-directional mobility gear taken apart, and the Survey Corps memorial.",
  alternates: { canonical: "./" },
};

export default function TheWar() {
  return (
    <>
      <ChapterHeader
        id="AOT-07"
        title="The War"
        trail={[{ href: "/the-world/", label: "AOT-06" }]}
        lede="Five battles inside the Walls in a single year, two more across the sea, the gear that let people fight at all, and what it cost."
      />
      <BattleSection />
      <OdmSection />
      <Memorial />
      <NextChapter href="/the-rumbling/" id="AOT-08" title="The Rumbling" line="The ending begins here. The file opens only when you ask." />
    </>
  );
}
