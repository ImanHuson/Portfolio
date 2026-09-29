"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Plate from "@/components/archive/Plate";
import SpoilerGate from "@/components/archive/SpoilerGate";
import { prefersReducedMotion } from "@/lib/animation/tokens";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STAGES = [
  {
    word: "A movement",
    plate: "/images/rising/movement.webp",
    alt: "Washington Crossing the Delaware: a boat of rebels crossing a frozen river.",
    book: 1,
    lines: [
      "It starts before Darrow. A Gold named Fitchner au Barca loves a Red woman, Bryn of Cryssos. The Society executes her for it. He answers by building the Sons of Ares.",
      "Decades later his people find a grieving Helldiver in Lykos, take him to a carver in Yorkton, and make a Red into a Gold.",
    ],
  },
  {
    word: "A war",
    plate: "/images/rising/war.webp",
    alt: "The Battle of Vercellae: cavalry in the crush of a battle.",
    book: 2,
    lines: [
      "A duel at a gala on Luna is built to split the Golds against each other, and it does. Then soldiers fall on Mars from orbit in the Iron Rain.",
      "The infiltration is over. The Triumph that follows shows what the old order does when it is cornered.",
    ],
  },
  {
    word: "A myth",
    plate: "/images/rising/myth.webp",
    alt: "The Harvesters: reapers with scythes in a golden field.",
    book: 3,
    lines: [
      "The Reaper. The Morning Star. A name bigger than the man, carried by Obsidians who were bred to be weapons and chose freedom instead.",
      "Myths win wars. They are harder to put down once the war is over.",
    ],
  },
  {
    word: "A government",
    plate: "/images/rising/government.webp",
    alt: "The Death of Socrates: a state executes its own philosopher.",
    book: 3,
    lines: [
      "November 743 PCE: Luna falls. The Solar Republic is founded, with Virginia au Augustus as Sovereign.",
      "Then ten more years of war, against a Society that refused to stay dead.",
    ],
  },
];

export default function RisingStack() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-stage]");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const st = { trigger: next, start: "top bottom", end: "top top", scrub: true };
        gsap.to(card.querySelector("[data-face]"), { scale: 0.92, ease: "none", scrollTrigger: st });
        gsap.to(card.querySelector("[data-dim]"), { opacity: 0.6, ease: "none", scrollTrigger: { ...st } });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative">
      {STAGES.map((s) => (
        <section
          key={s.word}
          data-stage
          aria-label={s.word}
          className="sticky top-[var(--nav-h)] flex min-h-[calc(100dvh-var(--nav-h))] items-center px-5 md:px-8"
        >
          <div
            data-face
            className="relative mx-auto w-full max-w-[1400px] origin-top overflow-hidden border border-line bg-void-2 p-8 md:p-16"
            style={{ boxShadow: "0 -30px 60px rgba(7,7,10,0.9)" }}
          >
            <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-[60%] md:block">
              <Plate src={s.plate} alt="" width={1600} height={900} className="h-full object-cover" sizes="60vw" />
              <div className="absolute inset-0 bg-gradient-to-r from-void-2 via-void-2/50 to-transparent" />
            </div>
            <Plate src={s.plate} alt={s.alt} width={1600} height={900} className="mb-8 aspect-video object-cover md:hidden" sizes="100vw" />
            <div data-dim aria-hidden className="pointer-events-none absolute inset-0 z-10 bg-void opacity-0" />
            <h2 className="relative font-display text-[clamp(2.4rem,12vw,11rem)] leading-[0.8] font-extrabold tracking-tight uppercase">
              {s.word.split(" ")[0]} <span className="text-red">{s.word.split(" ")[1]}</span>
            </h2>
            <SpoilerGate book={s.book} className="relative mt-10 max-w-[62ch]">
              <div className="max-w-[62ch] space-y-5 pt-2">
                {s.lines.map((l, j) => (
                  <p key={j} className="text-lede text-bone/85">
                    {l}
                  </p>
                ))}
              </div>
            </SpoilerGate>
          </div>
        </section>
      ))}
    </div>
  );
}
