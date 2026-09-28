"use client";

import { useRef, useState } from "react";
import { FoxIcon, FoxRunIcon } from "@/components/people/icons";

/** Kavax's fox. A fan easter egg: the tooltip on hover or focus, and a fox
 * trotting once across the bottom of the screen (never under reduced motion). */
export default function Sophocles() {
  const [trot, setTrot] = useState(false);
  const done = useRef(false);
  const go = () => {
    if (done.current) return;
    done.current = true;
    setTrot(true);
  };
  return (
    <div className="flex items-center gap-5">
      <span className="group relative inline-flex">
        <button
          type="button"
          aria-label="Sophocles, the Telemanus fox"
          aria-describedby="sophocles-tip"
          onMouseEnter={go}
          onFocus={go}
          onClick={go}
          className="flex size-12 items-center justify-center border border-line-strong text-gold transition-colors hover:border-gold"
        >
          <FoxIcon className="w-7" />
        </button>
        <span
          id="sophocles-tip"
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-0 z-10 mb-5 w-max max-w-[15rem] border border-line-strong bg-void-2 px-3 py-2 font-serif text-bone italic opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
        >
          You thought we’d forget the real mastermind?
        </span>
      </span>
      <div>
        <p className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Companion</p>
        <p className="mt-1 font-display text-2xl font-bold uppercase">Sophocles</p>
        <p className="mt-1 text-sm text-ash">The Telemanus fox, cloned twenty-four times over.</p>
      </div>
      {trot && (
        <span aria-hidden className="fox-trot text-gold" onAnimationEnd={() => setTrot(false)}>
          <FoxRunIcon className="w-14" />
        </span>
      )}
    </div>
  );
}
