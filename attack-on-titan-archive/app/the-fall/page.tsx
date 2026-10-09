import type { Metadata } from "next";
import ChapterHeader from "@/components/typography/ChapterHeader";
import { BG } from "@/lib/data/backgrounds";
import NextChapter from "@/components/typography/NextChapter";
import WallsMap from "@/components/archive/WallsMap";
import Sealed from "@/components/archive/Sealed";
import SectionBackdrop from "@/components/archive/SectionBackdrop";

export const metadata: Metadata = {
  title: "The Fall",
  description: "845 to 847: the breach of Shiganshina, the loss of Wall Maria, the evacuation, and the reclamation that sent 250,000 people out.",
  alternates: { canonical: "./" },
};

// Only verified facts (see CLAUDE.md, fact-checking). The one late reveal is sealed.
const LEDGER: { year: string; title: string; body: React.ReactNode; sealed?: React.ReactNode }[] = [
  {
    year: "845",
    title: "The outer gate",
    body: "The Colossal Titan appeared beyond Shiganshina's wall, sixty metres tall, and kicked in the outer gate. Through the hole, Titans walked into the district.",
  },
  {
    year: "845",
    title: "The house on the street",
    body: "Carla Yeager was pinned under the wreck of her house. Hannes of the Garrison carried Eren and Mikasa away, and a smiling Titan took her while they watched.",
    sealed: "The Smiling Titan was Dina Fritz, Grisha Yeager's first wife, turned into a Titan in Marley and left on the island.",
  },
  {
    year: "845",
    title: "The inner gate",
    body: "The Armored Titan broke through the inner gate of Wall Maria. The Wall was given up. Everyone who could run retreated behind Wall Rose.",
  },
  {
    year: "845",
    title: "The boats",
    body: "The survivors were taken out by boat. On one of them, Eren swore to wipe every Titan off the face of the earth.",
  },
  {
    year: "846",
    title: "The refugees",
    body: "Wall Rose could not feed everyone who had come through its gates. With Wall Maria's farmland gone, food ran short.",
  },
  {
    year: "846",
    title: "The reclamation",
    body: "The royal government sent 250,000 people, a fifth of the remaining population, to retake Wall Maria. About a hundred came back. Armin's grandfather was not one of them.",
  },
  {
    year: "847",
    title: "The enlistment",
    body: "Eren, Mikasa and Armin enlisted in the 104th Cadet Corps. Three years of training followed.",
  },
];

export default function TheFall() {
  return (
    <>
      <ChapterHeader
        id="AOT-02"
        title="The Fall"
        image={BG.shiganshina845.src}
        credit={BG.shiganshina845.credit}
        imagePosition="50% 40%"
        lede="In one day in 845 the outer Wall failed, and with it more than a third of the land humanity had left."
      />

      <section aria-label="The record, 845 to 847" className="relative isolate px-4 py-24 md:px-8 md:py-32">
        <SectionBackdrop src={BG.shiganshina.src} credit={BG.shiganshina.credit} position="50% 40%" strength={0.3} />
        <ol className="mx-auto max-w-[1400px]">
          {LEDGER.map((e, i) => {
            const first = i === 0 || LEDGER[i - 1].year !== e.year;
            return (
              <li key={e.title} className="grid gap-x-10 border-t border-line py-10 md:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] md:py-14">
                <div className="md:sticky md:top-[calc(var(--nav-h)+2rem)] md:self-start">
                  {first ? (
                    <p className="font-display text-h2 leading-none font-semibold text-paper">{e.year}</p>
                  ) : (
                    <p aria-hidden className="hidden font-display text-h2 leading-none font-semibold text-paper/15 md:block">
                      {e.year}
                    </p>
                  )}
                </div>
                <div className="mt-4 md:mt-0">
                  <h2 className="font-military text-h3 font-semibold tracking-[0.1em] text-paper uppercase">{e.title}</h2>
                  <p className="mt-4 max-w-[60ch] text-lede leading-relaxed text-paper/80">{e.body}</p>
                  {e.sealed && (
                    <Sealed className="mt-6 max-w-[60ch]" label="Sealed: who the Smiling Titan was">
                      <p className="border-l-2 border-flare/70 pl-4 text-paper/85">{e.sealed}</p>
                    </Sealed>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="land-title" className="relative isolate border-t border-line px-4 py-24 md:px-8 md:py-32">
        <SectionBackdrop src={BG.trostAerial.src} credit={BG.trostAerial.credit} position="50% 50%" strength={0.22} />
        <div className="mx-auto grid max-w-[1400px] items-center gap-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <WallsMap className="mx-auto w-full max-w-[640px]" />
          <div>
            <h2 id="land-title" className="font-display text-h2 leading-tight font-semibold text-paper">
              What was lost
            </h2>
            <dl className="mt-10 grid gap-8">
              {[
                ["480 km", "Wall Maria's radius. Wall Rose stands 100 km inside it."],
                ["250,000", "People sent out in 846 to retake Wall Maria."],
                ["About 100", "Of them, the number who came back."],
                ["One fifth", "Of the population left inside the Walls, spent on the reclamation."],
              ].map(([n, t]) => (
                <div key={n} className="border-t border-line pt-5">
                  <dt className="font-military text-h2 leading-none font-semibold text-paper">{n}</dt>
                  <dd className="mt-3 max-w-[40ch] text-ash">{t}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section aria-label="A note in the margin" className="relative isolate px-4 py-24 md:px-8 md:py-32">
        <SectionBackdrop src={BG.refugees.src} credit={BG.refugees.credit} position="50% 50%" strength={0.18} />
        <p className="mx-auto max-w-[30ch] text-center font-serif text-h3 leading-snug text-paper/90 italic">
          Inside the Walls, 845 was remembered as a catastrophe. The archive would later find that it had been a mission.
        </p>
      </section>

      <NextChapter current="AOT-02" />
    </>
  );
}
