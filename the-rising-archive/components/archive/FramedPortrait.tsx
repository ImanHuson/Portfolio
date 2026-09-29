import Plate from "@/components/archive/Plate";
import { PORTRAITS, portraitCredit } from "@/lib/data/portraits";
import { cn } from "@/lib/utils";

/** A character portrait in the archive's frame: a moulding in the
 * character's Color (gilt, rusted mine iron, black iron, gunmetal, steel,
 * pale Rim silver, plain wood for Pax), one burgundy mat for everyone, and
 * glass lit from above. `hero` adds the engraved plaque with the name and
 * the artist's credit; `thumb` uses the face crop and drops the mat.
 * Server-safe: no state, so it works with JS off. */
export default function FramedPortrait({
  slug,
  name,
  size = "card",
  priority = false,
  sizes,
  className,
  imgClassName,
}: {
  slug: string;
  name: string;
  size?: "hero" | "card" | "thumb";
  priority?: boolean;
  sizes?: string;
  className?: string;
  imgClassName?: string;
}) {
  const p = PORTRAITS[slug];
  if (!p) return null;
  const face = size === "thumb";
  const credit = portraitCredit(slug);
  return (
    <figure className={cn("pframe-wrap", className)} data-size={size}>
      <div className="pframe" data-frame={p.material}>
        <div className="pframe-mat">
          <div className="pframe-glass">
            <Plate
              src={`/images/portraits/${slug}${face ? "-face" : ""}.webp`}
              alt={size === "hero" ? `${name}: fan portrait. ${credit}.` : ""}
              width={face ? 320 : 960}
              height={face ? 400 : 1200}
              priority={priority}
              sizes={sizes ?? (face ? "96px" : "(min-width: 1024px) 30vw, 60vw")}
              className={cn("block aspect-[4/5] w-full object-cover", imgClassName)}
            />
          </div>
        </div>
      </div>
      {size === "hero" && (
        <figcaption className="pframe-plaque" data-frame={p.material}>
          <span className="pframe-plaque-name">{name}</span>
          <span className="pframe-plaque-credit">{credit}</span>
        </figcaption>
      )}
    </figure>
  );
}
