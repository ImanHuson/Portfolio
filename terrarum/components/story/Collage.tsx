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

/** Frame shape per span on wide screens (w / h); tablets use 4:3 and phones 4:5,
 * so a phone tile is tall enough that the name's band covers well under half of it. */
const FRAME: Record<number, number> = { 4: 4 / 5, 5: 5 / 6, 7: 7 / 6, 12: 21 / 9 };
const FRAME_CLASS: Record<number, string> = { 4: "lg:aspect-[4/5]", 5: "lg:aspect-[5/6]", 7: "lg:aspect-[7/6]", 12: "lg:aspect-[21/9]" };
/** Tile width on wide screens, as a share of the viewport. */
const LG_VW: Record<number, number> = { 4: 32, 5: 40, 7: 58, 12: 100 };
/** The photo is this much taller than its frame, so it can drift inside it. */
const OVER = 1.16;

/** `sizes` for a photo drawn to cover an oversized box: when the frame is
 * narrower than the photo, it is drawn wider than the tile, so ask for that. */
function tileSizes(aspect: number, span: number) {
  const w = (vw: number, frame: number) => `${Math.ceil(vw * Math.max(1, (OVER * aspect) / frame))}vw`;
  return `(min-width:1024px) ${w(LG_VW[span], FRAME[span])}, (min-width:768px) ${w(50, 4 / 3)}, ${w(100, 4 / 5)}`;
}

/**
 * Places to go, as an asymmetric collage of photographs. Rows alternate
 * wide-narrow, narrow-wide and three across; narrow tiles beside a wide one
 * drop a little, so the rows never line up like a grid of cards.
 *
 * The photograph stays clear: only its name sits on it, on a band sized to the
 * name itself (darkened behind the words, fading out 5rem above them); the
 * summary is set below, on the page. The
 * photo is taller than its frame and drifts through it as the page scrolls.
 */
export function Collage({ items, lang }: { items: CollageItem[]; lang?: string }) {
  if (!items.length) return null;
  const s = spans(items.length);
  return (
    <ul className="grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-12 md:grid-cols-2 md:gap-x-8 lg:grid-cols-12">
      {items.map((it, i) => {
        const m = media(it.image);
        const span = s[i];
        const wide = span >= 7;
        const drop = span === 5 && i % 2 === 1 ? "lg:mt-[10vh]" : "";
        return (
          <li key={it.href} className={`settle ${COL[span]} ${drop} ${span === 12 || (i === items.length - 1 && items.length % 2 === 1) ? "md:col-span-2" : ""}`}>
            <Link href={it.href} className="press zoom tile group block">
              <div className={`tile-frame relative aspect-[4/5] overflow-clip md:aspect-[4/3] ${FRAME_CLASS[span]}`}>
                <img
                  src={imgSrc(m, wide ? 1920 : 1280)}
                  srcSet={imgSrcSet(m)}
                  sizes={tileSizes(m.width / m.height, span)}
                  width={m.width}
                  height={m.height}
                  alt={m.alt}
                  data-fallback={m.fallback ? asset(m.fallback) : undefined}
                  loading="lazy"
                  decoding="async"
                  className="photo tile-img absolute inset-x-0 top-[-8%] h-[116%] w-full object-cover"
                  style={m.focus ? { objectPosition: m.focus } : undefined}
                />
                <div className="tile-text absolute inset-x-0 bottom-0 isolate p-5 text-[#f3ece0] md:p-7">
                  <div className="tile-band absolute inset-x-0 -bottom-px -top-20 -z-10" aria-hidden />
                  {it.kicker && <p className="photo-label text-sm">{it.kicker}</p>}
                  <h3 className={`mt-1 font-display leading-tight ${wide ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"}`}>
                    {it.title}
                    {it.native && (
                      <span className="ml-3 inline-block text-[0.6em] text-[#ece4d4]" lang={lang}>
                        {it.native}
                      </span>
                    )}
                  </h3>
                </div>
              </div>
              {it.summary && <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-muted transition-colors group-hover:text-ink">{it.summary}</p>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
