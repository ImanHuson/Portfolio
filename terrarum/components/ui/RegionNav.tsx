import Link from "next/link";
import type { Region } from "@/lib/content/types";

/**
 * All of a country's regions in order (north to south for Japan), so a reader on one region can
 * go straight to another without climbing back to the country page. The strip scrolls sideways
 * on phones; the current region is marked for screen readers as well as by colour.
 */
export function RegionNav({ country, countryName, regions, current, lang }: { country: string; countryName: string; regions: Region[]; current: string; lang?: string }) {
  return (
    <nav aria-label={`Regions of ${countryName}`} className="border-y border-line bg-band/60">
      <ol className="region-strip mx-auto flex max-w-[1400px] gap-1 overflow-x-auto px-4 py-3 md:px-8">
        {regions.map((r, i) => {
          const here = r.slug === current;
          return (
            <li key={r.slug} className="shrink-0">
              <Link
                href={`/${country}/${r.slug}/`}
                aria-current={here ? "page" : undefined}
                className={`press flex min-h-11 items-baseline gap-2 rounded-sm px-3 py-2 transition-colors ${here ? "bg-accent/15 text-ink" : "text-muted hover:bg-ink/5 hover:text-ink"}`}
              >
                <span className="text-[13px] tabular-nums opacity-70">{i + 1}</span>
                <span className={here ? "font-semibold" : ""}>{r.name}</span>
                {r.native && (
                  <span lang={lang} className="text-[13px] opacity-80">
                    {r.native}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** The regions on either side of this one, for the foot of a region page. */
export function RegionNeighbours({ country, regions, current, direction }: { country: string; regions: Region[]; current: string; direction: [string, string] }) {
  const i = regions.findIndex((r) => r.slug === current);
  const prev = regions[i - 1];
  const next = regions[i + 1];
  if (!prev && !next) return null;
  return (
    <nav aria-label="Neighbouring regions" className="mx-auto grid max-w-[1400px] gap-4 px-4 pb-[10vh] md:grid-cols-2 md:px-8">
      {prev ? (
        <Link href={`/${country}/${prev.slug}/`} className="press group block border-t border-line pt-5">
          <span className="text-sm text-muted">← {direction[0]}</span>
          <span className="mt-1 block font-display text-3xl group-hover:text-accent-text md:text-4xl">{prev.name}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={`/${country}/${next.slug}/`} className="press group block border-t border-line pt-5 md:text-right">
          <span className="text-sm text-muted">{direction[1]} →</span>
          <span className="mt-1 block font-display text-3xl group-hover:text-accent-text md:text-4xl">{next.name}</span>
        </Link>
      )}
    </nav>
  );
}
