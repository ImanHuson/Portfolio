"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SpoilerGate from "@/components/archive/SpoilerGate";
import Stamp from "@/components/archive/Stamp";
import { TIMELINE, type TimelineNode } from "@/lib/data/timeline";
import { cssEase, duration, prefersReducedMotion } from "@/lib/animation/tokens";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">{label}</dt>
      <dd className="mt-1 text-bone/90">{children}</dd>
    </div>
  );
}

function NodeBody({ node }: { node: TimelineNode }) {
  return (
    <dl className="grid gap-6 pt-6 pb-2 md:grid-cols-2">
      <div className="md:col-span-2">
        <p className="max-w-[62ch] text-lede text-bone">{node.summary}</p>
      </div>
      {node.where && <Field label="Where">{node.where}</Field>}
      {node.participants && <Field label="Participants">{node.participants.join(", ")}</Field>}
      {node.consequences && <Field label="Consequences">{node.consequences}</Field>}
      {node.dead && <Field label="The dead">{node.dead.join(", ")}</Field>}
      {node.related?.people && <Field label="Related people">{node.related.people.join(", ")}</Field>}
      {node.related?.books && <Field label="Related">{node.related.books.join(", ")}</Field>}
    </dl>
  );
}

export default function Timeline() {
  const [open, setOpen] = useState<string | null>("eo");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-spine-fill]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 60%", end: "bottom 60%", scrub: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} className="relative mx-auto max-w-[1100px]" role="list">
      <span aria-hidden className="absolute top-3 bottom-3 left-[11px] w-px bg-line-strong md:left-[139px]" />
      <span
        aria-hidden
        data-spine-fill
        className="absolute top-3 bottom-3 left-[11px] w-px origin-top bg-red md:left-[139px]"
      />
      {TIMELINE.map((node) => {
        const isOpen = open === node.slug;
        const sealed = node.status === "sealed";
        return (
          <li key={node.slug} className="relative grid gap-2 pb-10 pl-10 md:grid-cols-[120px_1fr] md:gap-10 md:pl-0">
            <span className="font-mono text-meta leading-7 tracking-[0.14em] text-ash uppercase md:text-right">{node.when}</span>
            <span
              aria-hidden
              className={cn(
                "absolute top-2 left-[6px] size-[11px] rounded-full border md:left-[134px]",
                sealed ? "border-red bg-void" : isOpen ? "border-red bg-red" : "border-line-strong bg-void",
              )}
            />
            <div className="md:pl-6">
              {sealed ? (
                <div>
                  <p className="font-display text-h3 leading-none font-bold text-ash-2 uppercase">{node.title}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Stamp kind="sealed" />
                    <span className="font-serif text-lg text-ash italic">{node.summary}</span>
                  </div>
                </div>
              ) : (
                <>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`node-${node.slug}`}
                      onClick={() => setOpen(isOpen ? null : node.slug)}
                      className={cn(
                        "text-left font-display text-h3 leading-none font-bold uppercase transition-colors",
                        isOpen ? "text-bone" : "text-bone/70 hover:text-bone",
                      )}
                    >
                      {node.title}
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`node-${node.slug}`}
                        key="body"
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: duration.ui, ease: cssEase.out }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2">
                          <SpoilerGate book={node.book} compact>
                            <NodeBody node={node} />
                          </SpoilerGate>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
