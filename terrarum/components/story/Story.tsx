import { Credit } from "@/components/ui/Figure";
import { asset, imgSrc, imgSrcSet, media } from "@/lib/content/media";
import { StoryDriver } from "./StoryDriver";

export interface StoryStep {
  key: string;
  /** The photograph shown while this step is read. */
  image: string;
  content: React.ReactNode;
}

/**
 * Passages told beside a pinned photograph. On wide screens the photograph
 * stays in place while each step scrolls past, and changes to the step being
 * read; on narrow screens, and without JavaScript, each step carries its own
 * photograph above it, so nothing depends on the script.
 */
export function Story({ steps, label, flip = false }: { steps: StoryStep[]; label: string; flip?: boolean }) {
  if (!steps.length) return null;
  return (
    <section aria-label={label} data-story className="relative">
      <div className={`mx-auto grid max-w-[1600px] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <div className="relative hidden lg:block" aria-hidden>
          <div data-story-media className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden">
            {steps.map((s, i) => {
              const m = media(s.image);
              return (
                <figure key={s.key} data-frame={i} data-active={i === 0 ? "" : undefined} className="story-frame absolute inset-0">
                  <img
                    src={imgSrc(m, 1920)}
                    srcSet={imgSrcSet(m)}
                    sizes="60vw"
                    width={m.width}
                    height={m.height}
                    alt=""
                    data-fallback={m.fallback ? asset(m.fallback) : undefined}
                    loading="lazy"
                    decoding="async"
                    className={`h-full w-full ${m.kind === "artwork" ? "object-contain p-[6vh]" : "object-cover"} ${m.kind === "photo" ? "photo" : ""}`}
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgb(6_8_14/0.85)] to-transparent px-6 pb-4 pt-16 text-[12px] leading-snug text-[#d2cbbe]">
                    <Credit id={s.image} />
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
        <div className="px-4 md:px-8 lg:px-[5vw]">
          {steps.map((s, i) => {
            const m = media(s.image);
            return (
              <div key={s.key} data-step={i} data-active={i === 0 ? "" : undefined} className="story-step flex flex-col justify-center py-12 lg:min-h-[80svh] lg:py-[14vh]">
                <figure className="mb-8 lg:hidden">
                  <img
                    src={imgSrc(m, 1280)}
                    srcSet={imgSrcSet(m)}
                    sizes="100vw"
                    width={m.width}
                    height={m.height}
                    alt={m.alt}
                    data-fallback={m.fallback ? asset(m.fallback) : undefined}
                    loading="lazy"
                    decoding="async"
                    className={`w-full ${m.kind === "photo" ? "photo aspect-[4/3] object-cover" : ""}`}
                  />
                  <figcaption className="mt-2 text-[12px] leading-snug text-muted">
                    <Credit id={s.image} />
                  </figcaption>
                </figure>
                {s.content}
                {/* The pinned frame is decorative for screen readers; the photograph's description lives here. */}
                <p className="sr-only">Photograph: {m.alt}</p>
              </div>
            );
          })}
        </div>
      </div>
      <StoryDriver />
    </section>
  );
}
