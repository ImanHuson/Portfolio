import Link from "next/link";
import { asset, cn } from "@/lib/utils";

/** The head of a chapter: breadcrumb, the archive number, the title in the
 * display serif, one line of lede. Optionally over a frame rendered from the
 * opening scene, so every chapter starts inside the same world. */
export default function ChapterHeader({
  id,
  title,
  lede,
  trail = [],
  image,
  imagePosition = "50% 50%",
}: {
  id: string;
  title: string;
  lede: React.ReactNode;
  trail?: { href: string; label: string }[];
  image?: string;
  imagePosition?: string;
}) {
  return (
    <header className={cn("relative overflow-hidden px-4 md:px-8", image ? "min-h-[88dvh] pt-[calc(var(--nav-h)+2rem)]" : "pt-[calc(var(--nav-h)+5rem)]")}>
      {image && (
        <>
          <img src={asset(image)} alt="" width={1680} height={1050} fetchPriority="high" className="absolute inset-0 size-full object-cover" style={{ objectPosition: imagePosition }} />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-base via-base/40 to-base/50" />
        </>
      )}
      <div className={cn("relative mx-auto flex max-w-[1400px] flex-col", image ? "min-h-[calc(88dvh-var(--nav-h)-2rem)] justify-end pb-16" : "pb-14")}>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-2 font-mono text-meta tracking-[0.16em] text-paper/60 uppercase">
            <li className="flex gap-2">
              <Link href="/#index" className="inline-block py-1 hover:text-paper">
                Index
              </Link>
              <span aria-hidden>/</span>
            </li>
            {trail.map((t) => (
              <li key={t.href} className="flex gap-2">
                <Link href={t.href} className="inline-block py-1 hover:text-paper">
                  {t.label}
                </Link>
                <span aria-hidden>/</span>
              </li>
            ))}
            <li className="py-1 text-paper/85">{id}</li>
          </ol>
        </nav>
        <h1 className="mt-6 font-display text-h1 leading-[0.92] font-extrabold text-paper uppercase">{title}</h1>
        <div className="mt-6 max-w-[52ch] font-serif text-lede leading-snug text-paper/85 italic">{lede}</div>
      </div>
    </header>
  );
}
