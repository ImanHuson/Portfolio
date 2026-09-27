"use client";

import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import FaceCard from "@/components/people/FaceCard";
import { useArchive } from "@/components/providers/ArchiveProvider";
import { LENSES, PEOPLE, type LensKey } from "@/lib/data/people";
import { BOOK_TITLES } from "@/lib/data/spoilers";
import { cn } from "@/lib/utils";

// Bento with exact cell count: 16 cells on a 4-column grid, no empty cells.
// Darrow 2x2, Virginia 2x1, Apollonius 2x1, the Jackal 2x1, six singles.
const SPAN: Record<string, string> = {
  darrow: "md:col-span-2 md:row-span-2 md:min-h-[38rem]",
  virginia: "md:col-span-2",
  apollonius: "md:col-span-2",
  "the-jackal": "md:col-span-2",
};

// The earliest book after which any lens opens (Darrow, Virginia, the Jackal).
const FIRST_LENS_BOOK = Math.min(...PEOPLE.map((p) => p.lensBook));

export default function TenFaces() {
  const { clearance, openClearance } = useArchive();
  const [lens, setLens] = useState<LensKey>("person");
  const active = LENSES.find((l) => l.key === lens)!;
  const readable = PEOPLE.filter((p) => clearance >= p.lensBook).length;
  const locked = readable === 0;

  const clearanceButton = (label: string) => (
    <button
      type="button"
      data-js-only
      onClick={openClearance}
      className="font-mono text-meta tracking-[0.16em] whitespace-nowrap text-bone uppercase underline decoration-red underline-offset-4 hover:text-red"
    >
      {label}
    </button>
  );

  return (
    <div>
      <div
        className={cn(
          "z-20 -mx-5 border-y border-line bg-void/90 px-5 py-3 backdrop-blur md:-mx-8 md:px-8",
          // A bar with nothing to switch shouldn't follow the reader down the page.
          !locked && "sticky top-[var(--nav-h)]",
        )}
      >
        <div className="mx-auto max-w-[1400px]">
          {locked ? (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 py-1">
              <p className="max-w-[70ch] text-sm text-ash">
                <span className="text-bone">Six ways to compare all ten side by side</span>: who they are, what they believe, what they
                fight with, who they love, what broke them, what they leave. Each one spoils the story, so they open once you’ve read{" "}
                <span className="text-bone">{BOOK_TITLES[FIRST_LENS_BOOK]}</span>.
              </p>
              {clearanceButton("Tell the archive how far you’ve read")}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <span aria-hidden className="hidden shrink-0 font-mono text-meta tracking-[0.18em] text-ash-2 uppercase sm:inline">
                  Compare all ten by
                </span>
                {/* One scrollable row on phones instead of three wrapped rows
                    eating the screen under a sticky bar. */}
                <div className="-mx-5 min-w-0 flex-1 overflow-x-auto px-5 [mask-image:linear-gradient(to_right,transparent,#000_1.25rem,#000_calc(100%-2.5rem),transparent)] [scrollbar-width:none] sm:mx-0 sm:px-0 sm:[mask-image:none] [&::-webkit-scrollbar]:hidden">
                  <ToggleGroup
                    type="single"
                    value={lens}
                    onValueChange={(v) => v && setLens(v as LensKey)}
                    aria-label="Compare all ten by"
                    className="flex-nowrap gap-1"
                    spacing={1}
                  >
                    {LENSES.map((l) => (
                      <ToggleGroupItem
                        key={l.key}
                        value={l.key}
                        className="h-10 shrink-0 border border-line px-3 font-mono text-meta tracking-[0.14em] whitespace-nowrap text-ash uppercase hover:border-line-strong hover:text-bone data-[state=on]:border-red data-[state=on]:bg-red/10 data-[state=on]:text-bone md:h-9"
                      >
                        {l.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <p aria-live="polite" className="text-sm text-bone/85">
                  <span className="font-serif text-base italic">{active.ask}</span>{" "}
                  <span className="text-ash-2">Every card below answers it.</span>
                </p>
                {readable < PEOPLE.length && (
                  <p className="flex flex-wrap items-baseline gap-x-3 text-sm text-ash-2">
                    <span>
                      Open on {readable} of {PEOPLE.length} at your clearance.
                    </span>
                    {clearanceButton("Change")}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mx-auto mt-10 grid max-w-[1400px] gap-px bg-line md:grid-cols-4">
        {PEOPLE.map((p) => (
          <FaceCard key={p.slug} person={p} lens={lens} lensesLocked={locked} className={SPAN[p.slug]} />
        ))}
      </div>
    </div>
  );
}
