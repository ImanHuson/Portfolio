"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Globe, type GlobeCountry } from "./Globe";

/** The globe plus the panel that answers "what did I just pick?". */
export function HomeGlobe({ countries }: { countries: GlobeCountry[] }) {
  const [picked, setPicked] = useState<string | null>(null);
  const onSelect = useCallback((slug: string | null) => setPicked(slug), []);
  const c = countries.find((x) => x.slug === picked);
  return (
    <div className="relative h-full w-full">
      <Globe countries={countries} onSelect={onSelect} />
      <div aria-live="polite" className="pointer-events-none absolute inset-x-3 bottom-3 flex justify-start md:inset-x-6 md:bottom-6">
        {c && !c.open && (
          <div className="pointer-events-auto max-w-sm border border-[#2a313a] bg-[#0d1014]/95 p-4 text-sm">
            <p className="font-semibold text-[#e8e4dc]">{c.name} is still being researched</p>
            <p className="mt-1 text-[#9aa1a8]">{c.note}</p>
            <p className="mt-3 flex gap-4">
              <Link href="/method/#expansion" className="text-[#e2b45a] underline underline-offset-2">How countries open</Link>
              <button type="button" onClick={() => setPicked(null)} className="text-[#9aa1a8] underline underline-offset-2">Close</button>
            </p>
          </div>
        )}
        {c && c.open && (
          <p className="border border-[#2a313a] bg-[#0d1014]/95 px-4 py-3 text-sm text-[#e8e4dc]">Entering {c.name}…</p>
        )}
      </div>
    </div>
  );
}
