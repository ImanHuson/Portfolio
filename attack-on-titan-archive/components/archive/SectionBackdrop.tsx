import { asset, cn } from "@/lib/utils";
import { BG_SOURCE } from "@/lib/data/backgrounds";

/**
 * A section's own ground: an image that stays in view while the reader
 * scrolls through the section (sticky inside the section's box), darkened so
 * the text over it keeps its contrast, and faded into the page at the
 * section's top and bottom so sections never meet on a hard edge.
 *
 * It answers the scroll: as the section passes, the image drifts and settles
 * from a slight push-in to rest (`.bd-move`, a CSS scroll-driven animation on
 * transform only, so it runs on the compositor and never costs a frame;
 * `BackdropMotion` drives the same motion where CSS can't). Reduced motion
 * leaves it still. The parent section must be `relative isolate`.
 */
export default function SectionBackdrop({
  src,
  position = "50% 50%",
  strength = 0.32,
  contain = false,
  credit,
  className,
}: {
  src: string;
  position?: string;
  /** how much of the image shows through, 0..1 */
  strength?: number;
  /** a portrait image on wide screens: full height, centred, edges into black */
  contain?: boolean;
  /** what the image is, shown small at the section's foot */
  credit?: string;
  className?: string;
}) {
  return (
    <>
      <div aria-hidden data-backdrop className={cn("bd pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden" style={{ opacity: strength }}>
          <img
            src={asset(src)}
            alt=""
            loading="lazy"
            decoding="async"
            className={cn(
              "bd-move size-full object-cover",
              // portrait art on a wide screen: its own width, centred, sides feathered into the page
              contain && "md:mx-auto md:w-auto md:max-w-none md:[mask-image:linear-gradient(90deg,transparent,#000_24%,#000_76%,transparent)]",
            )}
            style={{ objectPosition: position }}
          />
        </div>
        {/* keeps text over it readable: darker toward the left, where the copy sits */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,12,10,0.5),rgba(11,12,10,0.1)_60%,rgba(11,12,10,0.3))]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-base to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-base to-transparent" />
      </div>
      {credit && (
        <p className="absolute right-4 bottom-3 z-10 max-w-[calc(100%-2rem)] text-right font-mono text-meta text-ash/80 md:right-8">
          Behind this section: {credit}. {BG_SOURCE}.
        </p>
      )}
    </>
  );
}
