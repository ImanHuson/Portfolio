"use client";

import Link from "next/link";
import Plate from "@/components/archive/Plate";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { LensKey, Person } from "@/lib/data/people";
import { useArchive } from "@/components/providers/ArchiveProvider";
import { ACCENT_CLASS, NAME_CLASS, RULE_CLASS } from "@/lib/registers";
import { cssEase, duration } from "@/lib/animation/tokens";
import { cn } from "@/lib/utils";

/** One face of power. Five of the ten carry an authored micro-interaction
 * from the brief (Darrow, Cassius, Lysander, Atlas, Apollonius); the rest
 * stay still on purpose. Everything that fires on hover also fires on
 * keyboard focus. */
export default function FaceCard({ person, lens, className }: { person: Person; lens: LensKey; className?: string }) {
  const { clearance } = useArchive();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [noticed, setNoticed] = useState(false);
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLAnchorElement>(null);

  const unlocked = clearance >= person.lensBook;
  // The title cycles leak later titles ("Father", "Morning Knight"), so they
  // only run once the reader’s clearance covers this character’s lenses.
  const hover = unlocked ? person.hover : undefined;

  // Darrow / Cassius: the title walks through who they became.
  useEffect(() => {
    if (!active || !hover) return;
    const id = window.setInterval(() => setCycle((c) => Math.min(c + 1, hover.length - 1)), 850);
    return () => window.clearInterval(id);
  }, [active, hover]);

  // Atlas: nothing happens. Then, 1.5 seconds later, it does.
  useEffect(() => {
    if (!active || person.slug !== "atlas") return;
    const id = window.setTimeout(() => setNoticed(true), 1500);
    return () => window.clearTimeout(id);
  }, [active, person.slug]);

  const enter = () => setActive(true);
  const leave = () => {
    setActive(false);
    setCycle(0);
    setNoticed(false);
  };

  const title = hover ? hover[cycle] : person.epithet;
  const isApollonius = person.slug === "apollonius";

  return (
    <Link
      ref={cardRef}
      href={`/people/${person.slug}/`}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
      onMouseMove={(e) => {
        if (!isApollonius || !cardRef.current) return;
        const r = cardRef.current.getBoundingClientRect();
        setSpot({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
      }}
      className={cn(
        "group relative flex min-h-[19rem] flex-col justify-between overflow-hidden bg-void p-7 transition-colors duration-300 hover:bg-void-2 focus-visible:bg-void-2 md:p-9",
        isApollonius && "transition-transform duration-500 hover:scale-[1.015] focus-visible:scale-[1.015]",
        className,
      )}
    >
      {isApollonius && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{
            background: `radial-gradient(circle 220px at ${spot.x}% ${spot.y}%, rgba(200,169,106,0.18), transparent 70%), linear-gradient(160deg, rgba(122,15,23,0.35), transparent 60%)`,
          }}
        />
      )}
      {person.slug === "lysander" && (
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <motion.path
            d="M62 0 L58 18 L64 31 L55 47 L61 60 L52 78 L57 100"
            fill="none"
            stroke="rgba(233,228,218,0.35)"
            strokeWidth="0.25"
            vectorEffect="non-scaling-stroke"
            initial={false}
            animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.9, ease: cssEase.out }}
          />
        </svg>
      )}

      <Plate
        src={`/images/people/${person.slug}.webp`}
        alt=""
        width={900}
        height={900}
        className="pointer-events-none absolute top-6 right-6 w-16 opacity-60 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 md:w-20"
        sizes="80px"
      />
      <div className="relative pr-20">
        <div className="flex items-center gap-3">
          <span aria-hidden className={cn("h-px w-8", RULE_CLASS[person.register])} />
          <span className={cn("font-mono text-meta tracking-[0.18em] uppercase", ACCENT_CLASS[person.register])}>
            {person.face}
          </span>
        </div>
        <h3 className={cn("mt-5 text-4xl leading-[0.95] md:text-5xl", NAME_CLASS[person.register])}>{person.name}</h3>
        <div className="mt-2 h-7 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={title}
              initial={reduce ? false : { y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? undefined : { y: -14, opacity: 0 }}
              transition={{ duration: duration.micro, ease: cssEase.out }}
              className={cn("text-ash", title === "My honor remains." && "font-serif text-lg text-bone italic")}
            >
              {title}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {person.slug === "darrow" && (
        <p className="relative my-10 hidden max-w-[16ch] font-display text-h2 leading-[0.95] font-bold text-bone/90 uppercase md:block">
          {person.question}
        </p>
      )}

      <div className="relative mt-8">
        {unlocked ? (
          <p className="max-w-[46ch] text-bone/85">{person.lenses[lens]}</p>
        ) : (
          <p className="font-mono text-meta tracking-[0.16em] text-ash-2 uppercase">
            Lens sealed past your clearance. Open the dossier to choose.
          </p>
        )}
        {isApollonius && (
          <p className="mt-4 font-display text-lg font-bold tracking-[0.2em] text-gold uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
            The Minotaur approaches.
          </p>
        )}
      </div>

      <AnimatePresence>
        {noticed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-x-0 bottom-0 bg-void-3/95 px-7 py-4 font-mono text-meta tracking-[0.22em] text-rim uppercase md:px-9"
            role="status"
          >
            You have been noticed.
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
