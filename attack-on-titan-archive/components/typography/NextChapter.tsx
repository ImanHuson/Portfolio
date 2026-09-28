import Link from "next/link";

/** The page ends by handing the reader to the next file, like turning a leaf. */
export default function NextChapter({ href, id, title, line }: { href: string; id: string; title: string; line: string }) {
  return (
    <nav aria-label="Next chapter" className="border-t border-line px-4 py-20 md:px-8 md:py-28">
      <Link href={href} className="group mx-auto block max-w-[1400px]">
        <span className="font-mono text-meta tracking-[0.16em] text-ash uppercase">Next file {id}</span>
        <span className="mt-3 block font-display text-h2 leading-none font-extrabold text-paper uppercase transition-colors group-hover:text-wall">
          {title}
        </span>
        <span className="mt-4 block max-w-[48ch] text-ash">{line}</span>
      </Link>
    </nav>
  );
}
