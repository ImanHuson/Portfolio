import type { Metadata } from "next";
import ChapterHeader from "@/components/typography/ChapterHeader";
import NextChapter from "@/components/typography/NextChapter";
import { asset } from "@/lib/utils";
import TitanGrid from "@/components/titans/TitanGrid";
import { INHERITANCE, ORIGIN, TITANS } from "@/lib/data/titans";
import SectionBackdrop from "@/components/archive/SectionBackdrop";
import { BG } from "@/lib/data/backgrounds";

export const metadata: Metadata = {
  title: "The Titans",
  description: "The Nine Titans: the Founding, Attack, Colossal, Armored, Female, Beast, Jaw, Cart and War Hammer, their powers, holders and heights, to scale.",
  alternates: { canonical: "./" },
};

const WALL = 50; // metres
const MAX = 60;

export default function Titans() {
  return (
    <>
      <ChapterHeader
        id="AOT-04"
        image="/images/heads/titans.webp"
        imagePosition="55% 35%"
        title="The Titans"
        lede="Nine inheritances, handed down by being eaten. Nine specimen plates; open one to read its file."
      />

      {/* the monumental archive: nine columns, one per Titan */}
      <section aria-label="The Nine Titans" className="relative isolate px-4 pb-24 md:px-8">
        <SectionBackdrop src={BG.colossi.src} credit={BG.colossi.credit} position="50% 60%" strength={0.24} />
        <TitanGrid />
      </section>

      {/* to scale, against the Wall */}
      <section aria-labelledby="scale-title" className="relative isolate border-t border-line px-4 py-24 md:px-8 md:py-32">
        <SectionBackdrop src={BG.fort.src} credit={BG.fort.credit} position="50% 30%" strength={0.28} />
        <div className="mx-auto max-w-[1500px]">
          <h2 id="scale-title" className="font-display text-h2 leading-tight font-bold text-paper">
            To scale
          </h2>
          <p className="mt-4 max-w-[56ch] text-ash">Every Titan at its recorded height, against the fifty metres of a Wall: each bar is that Titan&apos;s height, filled with its own frame. Only one of them could look over it.</p>
          <figure className="mt-14">
            <div className="relative h-[min(64vh,560px)] overflow-hidden border-b border-paper/40">
              <div aria-hidden className="absolute inset-x-0 border-t border-dashed border-flare/70" style={{ bottom: `${(WALL / MAX) * 100}%` }}>
                <span className="absolute -top-6 left-0 font-mono text-meta tracking-[0.12em] text-alert">WALL, 50 M</span>
              </div>
              <div className="absolute inset-0 flex items-end justify-around gap-1">
                {TITANS.map((t) => (
                  // each Titan as a bar of its recorded height, filled with its own specimen frame
                  <div key={t.slug} className="relative flex h-full flex-1 items-end justify-center">
                    <div className="relative w-[78%] max-w-[120px] overflow-hidden border-x border-t border-paper/50" style={{ height: `${(t.height / MAX) * 100}%` }}>
                      <img
                        src={asset(`/images/titans/${t.slug}-col.webp`)}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 size-full object-cover object-top opacity-80"
                      />
                      <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-base/70 to-transparent" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <figcaption className="mt-3 grid grid-cols-9 gap-1 text-center font-mono text-meta whitespace-nowrap text-ash md:tracking-[0.08em]">
              {TITANS.map((t) => (
                <span key={t.slug} className="min-w-0">
                  <span className="hidden md:inline">{t.name.replace(" Titan", "")} </span>
                  {t.height}<span className="hidden sm:inline">&nbsp;m</span>
                </span>
              ))}
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="rules-title" className="relative isolate border-t border-line px-4 py-24 md:px-8 md:py-32">
        <SectionBackdrop src={BG.titans.src} credit={BG.titans.credit} position="55% 40%" strength={0.3} />
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-2">
          <h2 id="rules-title" className="font-display text-h2 leading-tight font-bold text-paper">
            How a Titan is inherited
          </h2>
          <div className="grid gap-6 text-lede leading-relaxed text-paper/80">
            <p>{ORIGIN}</p>
            <p>{INHERITANCE}</p>
          </div>
        </div>
      </section>

      <NextChapter current="AOT-04" />
    </>
  );
}
