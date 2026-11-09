import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { SIDES, type Side } from "@/lib/content/brief";
import { asset, imgSrc, imgSrcSet, media } from "@/lib/content/media";
import { GalleryViewer, type GalleryItem } from "./GalleryViewer";

const ORDER = Object.keys(SIDES) as Side[];

/**
 * Every side of a place: its photographs in the order a visit runs (the way
 * in, outside, inside, up close, the grounds, around it, the view, people,
 * other seasons, after dark, from above, the past). Each photo is captioned
 * with the side it shows and credited in full; selecting one opens a viewer.
 */
export function Gallery({ ids, name, headingId, tour, layout = "wall" }: { ids: string[]; name: string; headingId: string; tour?: { url: string; label: string; by: string }; layout?: "wall" | "emaki" }) {
  const items: GalleryItem[] = ids
    .map((id) => media(id))
    .sort((a, b) => ORDER.indexOf(a.side ?? "detail") - ORDER.indexOf(b.side ?? "detail"))
    .map((m) => ({
      id: m.id,
      src: imgSrc(m, 960),
      srcSet: imgSrcSet(m),
      large: imgSrc(m, 1920),
      fallback: m.fallback ? asset(m.fallback) : undefined,
      w: m.width,
      h: m.height,
      alt: m.alt,
      side: m.side ? SIDES[m.side] : "",
      credit: {
        what: m.kind === "artwork" ? m.title : "Photo",
        creator: m.creator,
        date: m.kind === "artwork" ? m.date : undefined,
        license: m.license,
        licenseUrl: m.licenseUrl,
        sourceUrl: m.sourceUrl,
      },
    }));
  const sides = new Set(items.map((i) => i.side)).size;
  return (
    <section aria-labelledby={headingId} className="border-t border-line">
      <div className="country-rule" aria-hidden />
      <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
        <h2 id={headingId} className="font-display text-3xl md:text-4xl">
          Every side of {name}
        </h2>
        <p className="mt-3 max-w-[60ch] text-muted">
          {items.length} photographs from {sides} angles, in the order a visit runs. Select one to see it large.
        </p>
        {tour && (
          <p className="mt-5">
            <a href={tour.url} className="press inline-flex items-center gap-2 border border-line px-4 py-2.5 font-medium hover:border-accent hover:text-accent-text">
              {tour.label}
              <ArrowSquareOut size={16} aria-hidden />
              <span className="sr-only">(opens {tour.by}’s website)</span>
            </a>
          </p>
        )}
        <GalleryViewer items={items} layout={layout} />
      </div>
    </section>
  );
}
