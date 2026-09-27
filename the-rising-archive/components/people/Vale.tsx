"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useArchive } from "@/components/providers/ArchiveProvider";
import { VALE, type Memorial } from "@/lib/data/vale";
import { BOOK_TITLES } from "@/lib/data/spoilers";
import { cn } from "@/lib/utils";

// Deterministic placement: the same stars in the same places on every visit,
// loosely clustered by the book in which each person died (earlier deaths
// sit higher, like older light).
function placement(i: number, m: Memorial) {
  const golden = 0.61803398875;
  const x = 10 + ((i * golden * 100 + m.book * 13) % 80);
  const y = 12 + ((m.book - 1) / 5) * 66 + ((i * 37) % 11) - 5;
  return { x, y };
}

export default function Vale() {
  const { clearance, openClearance } = useArchive();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<Memorial | null>(null);
  const stars = useMemo(() => VALE.map((m, i) => ({ m, ...placement(i, m) })), []);
  const known = open ? clearance >= open.book : false;

  return (
    <>
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[1400px] overflow-hidden border border-line bg-[#040406] md:aspect-[16/9]">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: Array.from({ length: 40 }, (_, k) => {
              const x = (k * 53) % 100;
              const y = (k * 31 + 7) % 100;
              return `radial-gradient(1px 1px at ${x}% ${y}%, rgba(233,228,218,${0.15 + ((k * 7) % 5) / 20}), transparent)`;
            }).join(","),
          }}
        />
        <ul className="absolute inset-0" role="list" aria-label="The dead">
          {stars.map(({ m, x, y }, i) => {
            const named = clearance >= m.book;
            return (
              <li key={m.slug} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
                <button
                  type="button"
                  onClick={() => setOpen(m)}
                  className="group flex flex-col items-center gap-2 p-2"
                  aria-label={named ? `${m.name}, ${BOOK_TITLES[m.book]}` : `A sealed star from ${BOOK_TITLES[m.book]}`}
                >
                  <motion.span
                    aria-hidden
                    className={cn("block size-2 rounded-full", named ? "bg-bone" : "bg-ash-2")}
                    style={{ boxShadow: named ? "0 0 14px 3px rgba(233,228,218,0.35)" : "none" }}
                    animate={reduce ? undefined : { opacity: [0.55, 1, 0.55] }}
                    transition={{ duration: 3 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                  />
                  <span
                    className={cn(
                      "font-serif text-sm whitespace-nowrap italic transition-opacity md:text-base",
                      named ? "text-bone/70 group-hover:text-bone group-focus-visible:text-bone" : "text-ash-2 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
                    )}
                  >
                    {named ? m.name : "Sealed"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent
          data-lenis-prevent
          showCloseButton
          className="h-[100dvh] max-h-none w-screen max-w-none translate-x-[-50%] translate-y-[-50%] overflow-y-auto border-0 bg-[#030304] p-6 sm:max-w-none md:p-16"
        >
          {open && (
            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduce ? 0 : 1.2, delay: reduce ? 0 : 0.6 }}
              className="mx-auto flex min-h-full max-w-3xl flex-col justify-center py-10"
            >
              {known ? (
                <>
                  <DialogDescription className="font-mono text-meta tracking-[0.22em] text-ash-2 uppercase">
                    {open.color}
                    {open.house ? `, ${open.house}` : ""}. {BOOK_TITLES[open.book]}.
                  </DialogDescription>
                  <DialogTitle className="mt-6 font-serif text-h1 leading-[0.95] font-medium text-bone italic">{open.name}</DialogTitle>
                  <p className="mt-8 text-lede text-ash">{open.how}</p>
                  <dl className="mt-12 grid gap-8 border-t border-line pt-10 md:grid-cols-2">
                    <div>
                      <dt className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Who they left behind</dt>
                      <dd className="mt-2 text-bone/90">{open.leftBehind}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">What they changed</dt>
                      <dd className="mt-2 text-bone/90">{open.changed}</dd>
                    </div>
                  </dl>
                  <p className="mt-14 border-l-2 border-red pl-6 font-serif text-h3 leading-snug text-bone italic">{open.meaning}</p>
                </>
              ) : (
                <>
                  <DialogTitle className="font-display text-h2 font-bold text-ash-2 uppercase">A sealed star</DialogTitle>
                  <DialogDescription className="mt-6 max-w-[44ch] text-lede text-ash">
                    This death happens in {BOOK_TITLES[open.book]}. Your clearance keeps it sealed.
                  </DialogDescription>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(null);
                      openClearance();
                    }}
                    className="mt-10 self-start border-b border-red pb-1 font-mono text-meta tracking-[0.2em] uppercase hover:text-red"
                  >
                    Change clearance
                  </button>
                </>
              )}
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
