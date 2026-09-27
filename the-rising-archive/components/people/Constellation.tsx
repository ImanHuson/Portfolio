"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useArchive } from "@/components/providers/ArchiveProvider";
import { BONDS, type Bond } from "@/lib/data/relationships";
import { BOOK_TITLES } from "@/lib/data/spoilers";
import { cssEase } from "@/lib/animation/tokens";
import { cn } from "@/lib/utils";

const R = 0.37; // node ring radius, as a fraction of the square
const positions = BONDS.map((_, i) => {
  const a = -Math.PI / 2 + (i / BONDS.length) * Math.PI * 2;
  return { x: 0.5 + Math.cos(a) * R, y: 0.5 + Math.sin(a) * R };
});

const STROKE: Record<Bond["register"], string> = {
  red: "#c41e2a",
  gold: "#8c7446",
  rim: "#aab2ba",
  none: "#6b6862",
  obsidian: "#6b6862",
};

function Arc({ bond, clearance }: { bond: Bond; clearance: number }) {
  return (
    <ol className="mt-8 space-y-0" role="list">
      {bond.arc.map((step, i) => {
        const open = clearance >= step.book;
        return (
          <li key={step.label} className="relative pb-6 pl-7">
            {i < bond.arc.length - 1 && <span aria-hidden className="absolute top-3 bottom-0 left-[4px] w-px bg-line-strong" />}
            <span aria-hidden className={cn("absolute top-2 left-0 size-[9px] rounded-full", open ? "bg-red" : "border border-line-strong")} />
            {open ? (
              <span className={cn("font-display text-2xl font-semibold uppercase", step.label.endsWith(".") && "font-serif normal-case italic")}>
                {step.label}
              </span>
            ) : (
              <span className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Sealed until {BOOK_TITLES[step.book]}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function Constellation() {
  const { clearance } = useArchive();
  const reduce = useReducedMotion();
  const [sel, setSel] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSel(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const s = 1.55;
  const target = sel === null ? null : { x: (0.5 + positions[sel].x) / 2, y: (0.5 + positions[sel].y) / 2 };
  const bond = sel === null ? null : BONDS[sel];

  return (
    <div className="mx-auto grid max-w-[1400px] items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <div className="relative aspect-square w-full overflow-hidden border border-line bg-void">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 12% 18%, #e9e4da66, transparent), radial-gradient(1px 1px at 78% 12%, #e9e4da55, transparent), radial-gradient(1px 1px at 88% 64%, #e9e4da44, transparent), radial-gradient(1px 1px at 22% 82%, #e9e4da55, transparent), radial-gradient(1px 1px at 46% 36%, #e9e4da33, transparent), radial-gradient(1px 1px at 64% 88%, #e9e4da44, transparent), radial-gradient(1.5px 1.5px at 35% 60%, #c41e2a55, transparent)",
          }}
        />
        <motion.div
          className="absolute inset-0"
          animate={
            target
              ? { scale: s, x: `${s * (0.5 - target.x) * 100}%`, y: `${s * (0.5 - target.y) * 100}%` }
              : { scale: 1, x: "0%", y: "0%" }
          }
          transition={{ duration: reduce ? 0 : 0.9, ease: cssEase.cinematic }}
        >
          <svg aria-hidden viewBox="0 0 1000 1000" className="absolute inset-0 h-full w-full">
            {BONDS.map((b, i) => {
              const p = positions[i];
              const dim = sel !== null && sel !== i;
              return (
                <line
                  key={b.slug}
                  x1={500}
                  y1={500}
                  x2={p.x * 1000}
                  y2={p.y * 1000}
                  stroke={STROKE[b.register]}
                  strokeWidth={sel === i ? 2.5 : 1.25}
                  strokeDasharray={b.kind === "Fracture" || b.kind === "Rival" || b.kind === "Opposition" ? "6 8" : undefined}
                  opacity={dim ? 0.12 : clearance >= b.firstBook ? 0.75 : 0.25}
                  style={{ transition: "opacity 400ms, stroke-width 400ms" }}
                />
              );
            })}
          </svg>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <span aria-hidden className="mx-auto block size-4 bg-red shadow-[0_0_30px_8px_rgba(196,30,42,0.45)]" />
            <span className="mt-3 block font-display text-xl font-extrabold tracking-wide uppercase md:text-3xl">Darrow</span>
          </div>

          {BONDS.map((b, i) => {
            const p = positions[i];
            const known = clearance >= b.firstBook;
            return (
              <button
                key={b.slug}
                type="button"
                onClick={() => setSel(sel === i ? null : i)}
                aria-pressed={sel === i}
                aria-label={known ? `${b.name}: ${b.kind}` : `Sealed relationship from ${BOOK_TITLES[b.firstBook]}`}
                className={cn(
                  "group absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 text-center transition-opacity",
                  sel !== null && sel !== i && "opacity-30",
                )}
                style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mx-auto block size-2.5 rounded-full border transition-transform group-hover:scale-150",
                    known ? "border-bone bg-bone" : "border-ash-2",
                    sel === i && "border-red bg-red",
                  )}
                />
                <span className="mt-1.5 block font-display text-sm leading-none font-bold whitespace-nowrap uppercase md:text-base">
                  {known ? (
                    <>
                      <span className="md:hidden">{b.name.split(" ")[0]}</span>
                      <span className="hidden md:inline">{b.name}</span>
                    </>
                  ) : (
                    <span className="text-ash-2">Sealed</span>
                  )}
                </span>
                {known && (
                  <span className="mt-1 hidden font-mono text-[0.6rem] tracking-[0.16em] text-ash uppercase md:block">{b.kind}</span>
                )}
              </button>
            );
          })}
        </motion.div>
      </div>

      <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)]" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {bond ? (
            <motion.div
              key={bond.slug}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: cssEase.out }}
            >
              <p className="font-mono text-meta tracking-[0.2em] text-red uppercase">Darrow and</p>
              {clearance >= bond.firstBook ? (
                <>
                  <h2 className="mt-3 font-display text-h2 leading-[0.9] font-bold uppercase">{bond.name}</h2>
                  <p className="mt-2 font-serif text-2xl text-ash italic">{bond.kind}</p>
                  <Arc bond={bond} clearance={clearance} />
                  {clearance >= bond.noteBook ? (
                    <p className="mt-4 max-w-[48ch] text-lede text-bone/85">{bond.note}</p>
                  ) : (
                    <p className="mt-4 font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Reading sealed until {BOOK_TITLES[bond.noteBook]}</p>
                  )}
                  <div className="mt-10 flex flex-wrap gap-6">
                    {bond.dossier && (
                      <Link href={`/people/${bond.dossier}/`} className="border-b border-red pb-1 font-mono text-meta tracking-[0.2em] uppercase hover:text-red">
                        Open the dossier
                      </Link>
                    )}
                    <button type="button" onClick={() => setSel(null)} className="font-mono text-meta tracking-[0.2em] text-ash uppercase hover:text-bone">
                      Back to the constellation
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="mt-3 font-display text-h2 leading-[0.9] font-bold text-ash-2 uppercase">Sealed</h2>
                  <p className="mt-4 max-w-[44ch] text-ash">
                    This relationship begins in {BOOK_TITLES[bond.firstBook]}. Raise your clearance from the top bar to open it.
                  </p>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div key="idle" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="font-display text-h3 font-bold uppercase">Choose a line</h2>
              <p className="mt-4 max-w-[44ch] text-ash">
                Every relationship in the saga bends around one man. Pick anyone around him and the archive follows that line from its first scene to its last. Dashed lines broke.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
