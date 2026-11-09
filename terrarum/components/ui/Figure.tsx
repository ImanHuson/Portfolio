import { asset, imgSrc, imgSrcSet, media } from "@/lib/content/media";

/** An image with its credit always attached: creator, licence, source. */
export function Figure({
  id,
  className = "",
  imgClassName = "",
  sizes = "100vw",
  priority = false,
  caption,
  credit = "below",
}: {
  id: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  caption?: string;
  credit?: "below" | "none";
}) {
  const m = media(id);
  const isPhoto = m.kind === "photo";
  return (
    <figure className={className}>
      <img
        src={imgSrc(m, 1280)}
        srcSet={imgSrcSet(m)}
        sizes={sizes}
        width={m.width}
        height={m.height}
        alt={m.alt}
        data-fallback={m.fallback ? asset(m.fallback) : undefined}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={`${isPhoto ? "photo" : ""} ${imgClassName}`}
      />
      {credit === "below" && (
        <figcaption className="mt-2 text-[13px] leading-snug text-muted" data-pagefind-ignore>
          {caption && <span className="text-ink">{caption} </span>}
          <Credit id={id} />
        </figcaption>
      )}
    </figure>
  );
}

export function Credit({ id }: { id: string }) {
  const m = media(id);
  return (
    <span>
      {m.kind === "artwork" ? (
        <>
          <a href={m.sourceUrl} className="underline decoration-line underline-offset-2 hover:decoration-current">
            <cite className="not-italic">{m.title}</cite>
          </a>
          , {m.creator}, {m.date}. {m.repository}, {m.license}.
        </>
      ) : (
        <>
          <a href={m.sourceUrl} className="underline decoration-line underline-offset-2 hover:decoration-current">
            {m.kind === "panorama" ? "360° photo" : "Photo"}
          </a>{" "}
          by {m.creator},{" "}
          <a href={m.licenseUrl} className="underline decoration-line underline-offset-2 hover:decoration-current">
            {m.license}
          </a>
          {m.modified ? ` (${m.modified.toLowerCase()})` : ""}.
        </>
      )}
    </span>
  );
}
