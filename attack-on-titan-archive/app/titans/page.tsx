import type { Metadata } from "next";
import ChapterHeader from "@/components/typography/ChapterHeader";
import NextChapter from "@/components/typography/NextChapter";
import { asset } from "@/lib/utils";
import TitanGrid from "@/components/titans/TitanGrid";
import { INHERITANCE, ORIGIN, TITANS } from "@/lib/data/titans";

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
      <section aria-label="The Nine Titans" className="px-4 pb-24 md:px-8">
        <TitanGrid />
      </section>

      {/* to scale, against the Wall */}
      <section aria-labelledby="scale-title" className="border-t border-line bg-[radial-gradient(ellipse_at_50%_100%,rgba(138,116,100,0.16),transparent_60%)] px-4 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-[1500px]">
          <h2 id="scale-title" className="font-display text-h2 leading-tight font-bold text-paper">
            To scale
          </h2>
          <p className="mt-4 max-w-[56ch] text-ash">Every Titan at its recorded height, against the fifty metres of a Wall. Only one of them could look over it.</p>
          <figure className="mt-14">
            <div className="relative h-[min(64vh,560px)] overflow-hidden border-b border-paper/40">
              <div aria-hidden className="absolute inset-x-0 border-t border-dashed border-flare/70" style={{ bottom: `${(WALL / MAX) * 100}%` }}>
                <span className="absolute -top-6 left-0 font-mono text-meta tracking-[0.12em] text-alert">WALL, 50 M</span>
              </div>
              <div className="absolute inset-0 flex items-end justify-around gap-1">
                {TITANS.map((t) => {
                  // silhouettes from the render frames: 7.3 render units tall, feet 2.6% up from the bottom
                  const h = ((t.height / MAX) * 7.3) / t.localHeight;
                  return (
                    <div key={t.slug} className="relative flex h-full flex-1 items-end justify-center">
                      <img
                        src={asset(`/images/titans/${t.slug}-sil.webp`)}
                        alt=""
                        width={300}
                        height={600}
                        loading="lazy"
                        className="w-auto max-w-none"
                        style={{ height: `${h * 100}%`, marginBottom: `-${h * 2.6}%` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <figcaption className="mt-3 grid grid-cols-9 gap-1 text-center font-mono text-meta tracking-[0.08em] text-ash md:text-meta">
              {TITANS.map((t) => (
                <span key={t.slug}>
                  <span className="hidden md:inline">{t.name.replace(" Titan", "")} </span>
                  {t.height} m
                </span>
              ))}
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="rules-title" className="border-t border-line px-4 py-24 md:px-8 md:py-32">
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
