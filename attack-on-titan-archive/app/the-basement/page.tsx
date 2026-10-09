import type { Metadata } from "next";
import ChapterHeader from "@/components/typography/ChapterHeader";
import { BG } from "@/lib/data/backgrounds";
import NextChapter from "@/components/typography/NextChapter";
import Sealed from "@/components/archive/Sealed";
import Descent from "@/components/sections/Descent";
import { BOOKS, KEY_845, KEY_845_SEALED, PHOTOGRAPH } from "@/lib/data/basement";
import { asset } from "@/lib/utils";
import SectionBackdrop from "@/components/archive/SectionBackdrop";

export const metadata: Metadata = {
  title: "The Basement",
  description:
    "Shiganshina, 850: the Yeager cellar, a key that did not fit its door, three books under a false bottom, and one photograph.",
  alternates: { canonical: "./" },
};

const ROMAN = ["I", "II", "III"];

export default function TheBasement() {
  return (
    <>
      <ChapterHeader
        id="AOT-05"
        title="The Basement"
        image={BG.basementRoom.src}
        credit={BG.basementRoom.credit}
        imagePosition="50% 45%"
        lede="Five years after the fall, the Survey Corps is back in Shiganshina. Under the ruins of the Yeager house is the cellar Grisha never let his son see."
      />

      <Descent />

      {/* The print and the books: paper objects on the same dark ground as the rest of the archive. */}
      <div>
        <section aria-labelledby="photo-title" className="relative isolate px-4 pt-24 pb-20 md:px-8 md:pt-32 md:pb-28">
          <SectionBackdrop src={BG.basementSearch.src} credit={BG.basementSearch.credit} position="60% 50%" strength={0.3} />
          <div className="mx-auto grid max-w-[1400px] items-start gap-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
              <h2 id="photo-title" className="font-display text-h2 leading-[1.02] font-bold text-paper">
                Light, burned onto paper.
              </h2>
              <div className="mt-8 grid max-w-[52ch] gap-5 text-lede leading-relaxed text-paper/85">
                <p>{PHOTOGRAPH.found}</p>
                <p>Nothing inside the Walls could make an image like it. On the back, Grisha had written what it was, and where he came from.</p>
                <Sealed label="Sealed: who is in it">
                  <p className="pt-1">{PHOTOGRAPH.who}</p>
                </Sealed>
              </div>
            </div>

            <figure>
              <div className="relative mx-auto max-w-[480px]">
                {/* the front: the print Eren holds */}
                <img
                  src={asset("/images/basement/photograph.webp")}
                  alt="A sepia studio photograph: a man in a dark suit stands beside a woman seated in a winged armchair, with a small boy on her lap, in front of a drawn curtain."
                  width={822}
                  height={1052}
                  loading="lazy"
                  className="relative z-10 w-[88%] rotate-[1.6deg] shadow-[0_2px_0_rgba(0,0,0,0.3),0_30px_60px_-20px_rgba(0,0,0,0.8)]"
                />
                {/* the back, tucked under it: where the message is */}
                <div className="paper relative -mt-14 ml-auto w-[92%] -rotate-[1.2deg] px-8 pt-20 pb-10 md:px-10 md:pb-12">
                  <div aria-hidden className="absolute inset-3 border border-ink/10" />
                  <p className="font-mono text-meta tracking-[0.2em] text-ink/60 uppercase">Reverse</p>
                  <div className="mt-5 grid gap-3 font-serif text-[1.3rem] leading-snug text-ink/90 italic md:text-[1.45rem]">
                    {PHOTOGRAPH.back.map((l) => (
                      <p key={l}>{l}</p>
                    ))}
                  </div>
                </div>
              </div>
              <figcaption className="mx-auto mt-5 grid max-w-[480px] gap-1 text-[0.875rem] text-ash">
                <span>{PHOTOGRAPH.backNote}</span>
                <span>{PHOTOGRAPH.credit}</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section aria-labelledby="books-title" className="relative isolate border-t border-line px-4 py-20 md:px-8 md:py-28">
          <SectionBackdrop src={BG.threeBooks.src} credit={BG.threeBooks.credit} position="60% 55%" strength={0.32} />
          <div className="mx-auto grid max-w-[1400px] gap-14 md:grid-cols-2">
            <div>
              <h2 id="books-title" className="font-display text-h2 leading-[1.02] font-bold text-paper">
                Three books
              </h2>
              <div className="mt-8 grid max-w-[48ch] gap-5 text-lede leading-relaxed text-paper/85">
                <p>{BOOKS.preserved}</p>
                <p>{BOOKS.contents}</p>
              </div>
            </div>
            {/* three spines on the desk */}
            <ol aria-label="The three books" className="flex items-end justify-center gap-3 md:justify-start md:gap-4">
              {ROMAN.map((r, i) => (
                <li
                  key={r}
                  className="flex w-[4.5rem] flex-col items-center justify-between py-5 shadow-[inset_-6px_0_10px_rgba(0,0,0,0.35),inset_4px_0_6px_rgba(255,255,255,0.06)] md:w-24"
                  style={{
                    height: `${[17, 18.5, 16.25][i]}rem`,
                    background: ["#3d1511", "#1f2419", "#3a2716"][i],
                  }}
                >
                  <span aria-hidden className="block h-px w-3/4 bg-paper-dim/40" />
                  <span className="font-display text-h3 font-bold text-paper-dim">
                    <span className="sr-only">Book </span>
                    {r}
                  </span>
                  <span aria-hidden className="block h-px w-3/4 bg-paper-dim/40" />
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>

      <section aria-labelledby="key-title" className="relative isolate px-4 py-24 md:px-8 md:py-32">
        <SectionBackdrop src={BG.grishaKey.src} credit={BG.grishaKey.credit} position="50% 50%" strength={0.24} />
        <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] md:gap-20">
          <div>
            <h2 id="key-title" className="font-display text-h2 leading-tight font-bold text-paper">
              Where the key came from
            </h2>
          </div>
          <div className="grid max-w-[56ch] gap-5 text-lede leading-relaxed text-paper/80">
            <p>{KEY_845}</p>
            <Sealed label="Sealed: what happened next">
              <p className="pt-1">{KEY_845_SEALED}</p>
            </Sealed>
          </div>
        </div>
      </section>

      <NextChapter current="AOT-05" />
    </>
  );
}
