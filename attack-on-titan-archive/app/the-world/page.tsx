import type { Metadata } from "next";
import Link from "next/link";
import ChapterHeader from "@/components/typography/ChapterHeader";
import NextChapter from "@/components/typography/NextChapter";
import Sealed from "@/components/archive/Sealed";
import OneIsland from "@/components/world/OneIsland";
import Mirror from "@/components/world/Mirror";
import SectionBackdrop from "@/components/archive/SectionBackdrop";
import { BG } from "@/lib/data/backgrounds";
import {
  FILE_HEAD,
  HISTORY,
  INTERNMENT,
  WARRIORS,
  WARRIOR_FILES,
} from "@/lib/data/world";
import { asset } from "@/lib/utils";

export const metadata: Metadata = {
  title: "The World",
  description:
    "Paradis is one island. Across the sea: Marley, the Eldian internment zones, the Warrior program, the mission of 845, and Eren and Reiner side by side.",
  alternates: { canonical: "./" },
};

const INK = "text-[#141412]";
const STAMP = "text-[#8f1d16] border-[#8f1d16]";

function Part({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={`part-${n}`}
      className="border-t border-[#141412]/20 py-16 md:py-20"
    >
      <div className="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,8fr)] md:gap-16">
        <div>
          <p className="font-mono text-meta tracking-[0.2em] text-[#141412]/55 uppercase">
            Part {n}
          </p>
          <h3
            id={`part-${n}`}
            className="mt-2 font-military text-h3 font-bold tracking-[0.06em] uppercase"
          >
            {title}
          </h3>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

function Entry({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 border-b border-dashed border-[#141412]/20 py-5 first:pt-0 last:border-b-0 md:grid-cols-[11rem_1fr] md:gap-8">
      <p className="font-mono text-meta tracking-[0.12em] text-[#141412]/60 uppercase">
        {label}
      </p>
      <div className="max-w-[60ch] text-[1.05rem] leading-relaxed text-[#141412]/90">
        {children}
      </div>
    </div>
  );
}

export default function TheWorld() {
  return (
    <>
      <ChapterHeader
        id="AOT-06"
        image={BG.sea.src}
        credit={BG.sea.credit}
        imagePosition="50% 50%"
        title="The World"
        lede="Grisha's books said it plainly: the Walls were never the edge of the world. This is what lies past them, and what it calls the people inside."
      />

      <OneIsland />

      {/* A Marleyan file, laid on the same dark desk as everything else: the register
          changes inside the document, never the page around it. */}
      <div className="relative isolate px-3 pt-24 pb-28 md:px-16 md:pt-40 md:pb-44 xl:px-24">
        <SectionBackdrop src={BG.liberio.src} credit={BG.liberio.credit} position="60% 50%" strength={0.38} />
        <div className={`file-sheet mx-auto max-w-[1400px] ${INK}`}>
          <div className="sticky top-[var(--nav-h)] z-20 border-b border-[#141412]/25 bg-[#cfccc4]/95 px-4 backdrop-blur-[2px] md:px-8">
            <ul className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-6 gap-y-1 py-2 font-mono text-meta tracking-[0.18em] uppercase md:text-meta">
              {FILE_HEAD.map((h, i) => (
                <li
                  key={h}
                  className={
                    i === FILE_HEAD.length - 1
                      ? "font-bold text-[#8f1d16]"
                      : "text-[#141412]/75"
                  }
                >
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="mx-auto max-w-[1400px] px-4 md:px-8">
            <header className="relative py-20 md:py-28">
              <p className="font-mono text-meta tracking-[0.2em] text-[#141412]/60 uppercase">
                File MI / 854 / ELD
              </p>
              <h2 className="mt-4 font-military text-[clamp(2.4rem,1.2rem+5vw,6rem)] leading-[0.92] font-bold tracking-[0.02em] uppercase">
                Subject:
                <br />
                the Eldian question
              </h2>
              <p className="mt-8 max-w-[52ch] text-lede leading-relaxed text-[#141412]/80">
                Filed from the other side of the sea. The people inside the
                Walls were never told any of it.
              </p>
              <p
                aria-hidden
                className={`absolute top-16 right-0 hidden rotate-[-8deg] border-4 px-4 py-2 font-military text-[2.2rem] font-bold tracking-[0.2em] uppercase opacity-80 md:block ${STAMP}`}
              >
                Restricted
              </p>
            </header>

            <Part n="I" title="History, as filed">
              {HISTORY.map((h) => (
                <Entry key={h.label} label={h.label}>
                  <p>{h.text}</p>
                  {h.sealed && (
                    <Sealed
                      label="Sealed: the king's pact"
                      onPaper
                      className="mt-3"
                    >
                      <p className="pt-1">{h.sealed}</p>
                    </Sealed>
                  )}
                </Entry>
              ))}
            </Part>

            <Part n="II" title="Internment">
              {INTERNMENT.map((h) => (
                <Entry key={h.label} label={h.label}>
                  <p>{h.text}</p>
                </Entry>
              ))}
              <div
                className="mt-10 flex flex-wrap gap-6"
                aria-label="The two armbands"
              >
                {[
                  { c: "#d9b23a", t: "Eldian" },
                  { c: "#9d2a22", t: "Honorary Marleyan" },
                ].map((a) => (
                  <figure key={a.t} className="w-56">
                    <div
                      className="h-14 shadow-[inset_0_-8px_14px_rgba(0,0,0,0.25),inset_0_6px_8px_rgba(255,255,255,0.2)]"
                      style={{ background: a.c }}
                    >
                      <div
                        aria-hidden
                        className="mx-2 h-full border-x border-dashed border-black/25"
                      />
                    </div>
                    <figcaption className="mt-2 font-mono text-meta tracking-[0.14em] text-[#141412]/70 uppercase">
                      {a.t} armband
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Part>

            <Part n="III" title="The Warrior program">
              <Entry label="830">
                <p>{WARRIORS.program}</p>
              </Entry>
              <Entry label="845">
                <p>{WARRIORS.mission}</p>
              </Entry>
              <Entry label="Losses">
                <p>{WARRIORS.marcel}</p>
              </Entry>
              <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
                {WARRIOR_FILES.map((w) => (
                  <li key={w.slug}>
                    <Link href={`/soldiers/${w.slug}/`} className="group block">
                      <div className="flex aspect-[4/5] items-end justify-center bg-[#141412] p-3 transition-colors group-hover:bg-[#23231f]">
                        <img
                          src={asset(`/images/personnel/${w.slug}.webp`)}
                          alt=""
                          width={800}
                          height={900}
                          loading="lazy"
                          className="max-h-full w-auto object-contain grayscale transition-[filter] duration-300 group-hover:grayscale-0"
                        />
                      </div>
                      <p className="mt-3 font-military text-[1.05rem] font-bold tracking-[0.06em] uppercase underline-offset-4 group-hover:underline">
                        {w.name}
                      </p>
                      <p className="mt-1 text-[0.9rem] text-[#141412]/75">
                        {w.note}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </Part>

            <Part n="IV" title="Fort Slava, 854">
              <Entry label="The front">
                <p>{WARRIORS.war}</p>
              </Entry>
            </Part>
            <div className="h-16" />
          </div>
        </div>
      </div>

      <Mirror />

      <NextChapter current="AOT-06" />
    </>
  );
}
