import type { Metadata } from "next";
import ChapterHeader from "@/components/typography/ChapterHeader";
import { BG } from "@/lib/data/backgrounds";
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
        image={BG.scoutsShiganshina.src}
        credit={BG.scoutsShiganshina.credit}
        imagePosition="50% 50%"
        title="The War"
        lede="Five battles inside the Walls in a single year, two more across the sea, the gear that let people fight at all, and what it cost."
      />
      <BattleSection />
      <OdmSection />
      <Memorial />
      <NextChapter current="AOT-07" />
    </>
  );
}
