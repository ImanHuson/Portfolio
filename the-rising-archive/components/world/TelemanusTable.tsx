"use client";

import { useArchive } from "@/components/providers/ArchiveProvider";
import { cn } from "@/lib/utils";

type Seat = { name: string; dies?: number };

const SEATS: Seat[] = [
  { name: "Kavax" },
  { name: "Niobe" },
  { name: "Daxo", dies: 6 },
  { name: "Thraxa" },
  { name: "Xana" },
  { name: "Pax", dies: 1 },
  { name: "Virginia" },
];

/** The Telemanus Table: family names around a dining table. Characters who
 * have died (as far as the reader's clearance reaches) fade to silhouettes. */
export default function TelemanusTable() {
  const { clearance } = useArchive();
  return (
    <figure className="mx-auto max-w-[640px]">
      <div className="relative aspect-square">
        <div aria-hidden className="absolute inset-[22%] rounded-full border border-gold-dim/60 bg-[radial-gradient(circle,rgba(200,169,106,0.12),transparent_70%)]" />
        <div aria-hidden className="absolute inset-[30%] rounded-full border border-line" />
        <ul role="list" className="absolute inset-0">
          {SEATS.map((s, i) => {
            const a = (i / SEATS.length) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + Math.cos(a) * 40;
            const y = 50 + Math.sin(a) * 40;
            const gone = s.dies !== undefined && clearance >= s.dies;
            return (
              <li
                key={s.name}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <span aria-hidden className={cn("mx-auto mb-2 block size-3 rounded-full", gone ? "border border-ash-2" : "bg-gold")} />
                <span className={cn("font-serif text-xl md:text-2xl", gone ? "text-ash-2 italic opacity-50" : "text-bone")}>
                  {s.name}
                </span>
                {gone && <span className="sr-only"> (died)</span>}
              </li>
            );
          })}
        </ul>
        <p className="absolute inset-0 flex items-center justify-center text-center font-mono text-meta tracking-[0.2em] text-gold-dim uppercase">
          The Telemanus Table
        </p>
      </div>
      <figcaption className="mt-6 text-center text-sm text-ash">
        Seats fade for the dead, as far as your clearance reaches. Virginia sits here too: Kavax fostered her.
      </figcaption>
    </figure>
  );
}
