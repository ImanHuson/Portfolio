import Link from "next/link";
import { asset, imgSrc, imgSrcSet, media } from "@/lib/content/media";

export interface CollageItem {
  href: string;
  image: string;
  title: string;
  kicker?: string;
  native?: string;
  summary?: string;
}

/** Row rhythm on a 12-column grid: wide and narrow, narrow and wide, then three. */
const RHYTHM = [[7, 5], [5, 7], [4, 4, 4]];

/** Column spans for n items: whole rows only, so no row is left with an empty cell. */
function spans(n: number): number[] {
  const out: number[] = [];
  let r = 0;
  while (out.length < n) {
    const left = n - out.length;
    const row = RHYTHM[r % RHYTHM.length];
    if (left >= row.length) out.push(...row);
    else out.push(...(left === 1 ? [12] : left === 2 ? [7, 5] : [4, 4, 4].slice(0, left)));
    r++;
  }
  return out;
}

const COL: Record<number, string> = { 4: "lg:col-span-4", 5: "lg:col-span-5", 6: "lg:col-span-6", 7: "lg:col-span-7", 12: "lg:col-span-12" };

/**
 * Places to go, as an asymmetric collage of photographs with their names laid
 * over them. Rows alternate wide-narrow, narrow-wide and three across; narrow
 * tiles beside a wide one drop a little, so the rows never line up like a grid
 * of cards.
 */
export function Collage({ items, lang }: { items: CollageItem[]; lang?: string }) {
  if (!items.length) return null;
  const s = spans(items.length);
  return (
    <ul className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-12">
      {items.map((it, i) => {
        const m = media(it.image);
        const span = s[i];
        const wide = span >= 7;
        const drop = span === 5 && i % 2 === 1 ? "lg:mt-[10vh]" : "";
        return (
          <li key={it.href} className={`settle ${COL[span]} ${drop} ${span === 12 || (i === items.length - 1 && items.length % 2 === 1) ? "md:col-span-2" : ""}`}>
            <Link href={it.href} className="press zoom group relative block overflow-hidden">
              <img
                src={imgSrc(m, wide ? 1920 : 1280)}
                srcSet={imgSrcSet(m)}
                sizes={wide ? "(min-width:1024px) 58vw, (min-width:768px) 50vw, 100vw" : "(min-width:1024px) 40vw, (min-width:768px) 50vw, 100vw"}
                width={m.width}
                height={m.height}
                alt={m.alt}
                data-fallback={m.fallback ? asset(m.fallback) : undefined}
                loading="lazy"
                decoding="async"
                className={`photo w-full object-cover ${span === 12 ? "aspect-[4/3] lg:aspect-[21/9]" : wide ? "aspect-[4/3] lg:aspect-[7/6]" : span === 5 ? "aspect-[4/3] lg:aspect-[5/6]" : "aspect-[4/3] lg:aspect-[4/5]"}`}
              />
              <div className="tile-scrim absolute inset-0" aria-hidden />
              <div className="absolute inset-x-0 bottom-0 p-5 text-[#f3ece0] md:p-7">
                {it.kicker && <p className="photo-label text-sm">{it.kicker}</p>}
                <h3 className={`mt-1 font-display leading-tight ${wide ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"}`}>
                  {it.title}
                  {it.native && (
                    <span className="ml-3 inline-block text-[0.6em] text-[#ece4d4]" lang={lang}>
                      {it.native}
                    </span>
                  )}
                </h3>
                {it.summary && <p className="mt-2 max-w-[46ch] text-[15px] leading-snug text-[#e1d9cb]">{it.summary}</p>}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
