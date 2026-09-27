"use client";

import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import FaceCard from "@/components/people/FaceCard";
import { LENSES, PEOPLE, type LensKey } from "@/lib/data/people";

// Bento with exact cell count: 16 cells on a 4-column grid, no empty cells.
// Darrow 2x2, Virginia 2x1, Apollonius 2x1, the Jackal 2x1, six singles.
const SPAN: Record<string, string> = {
  darrow: "md:col-span-2 md:row-span-2 md:min-h-[38rem]",
  virginia: "md:col-span-2",
  apollonius: "md:col-span-2",
  "the-jackal": "md:col-span-2",
};

export default function TenFaces() {
  const [lens, setLens] = useState<LensKey>("person");

  return (
    <div>
      <div className="sticky top-[var(--nav-h)] z-20 -mx-5 border-y border-line bg-void/90 px-5 py-3 backdrop-blur md:-mx-8 md:px-8">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-4">
          <span className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">Read them as</span>
          <ToggleGroup
            type="single"
            value={lens}
            onValueChange={(v) => v && setLens(v as LensKey)}
            aria-label="Lens"
            className="flex-wrap gap-1"
            spacing={1}
          >
            {LENSES.map((l) => (
              <ToggleGroupItem
                key={l.key}
                value={l.key}
                className="h-8 border border-line px-3 font-mono text-meta tracking-[0.14em] text-ash uppercase data-[state=on]:border-red data-[state=on]:bg-transparent data-[state=on]:text-bone"
              >
                {l.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
      <div className="mx-auto mt-10 grid max-w-[1400px] gap-px bg-line md:grid-cols-4">
        {PEOPLE.map((p) => (
          <FaceCard key={p.slug} person={p} lens={lens} className={SPAN[p.slug]} />
        ))}
      </div>
    </div>
  );
}
