import type { Metadata } from "next";
import Link from "next/link";
import Plate from "@/components/archive/Plate";
import Reveal from "@/components/archive/Reveal";
import { AUTHOR } from "@/lib/data/author";
import { BOOKS } from "@/lib/data/books";

export const metadata: Metadata = {
  title: "The Author",
  description: "Pierce Brown, the man who built Mars: the origin of the story, the books, the comics, and where to find him.",
  alternates: { canonical: "./" },
};

export default function AuthorPage() {
  return (
    <article>
      <header className="px-5 pt-[calc(var(--nav-h)+5rem)] pb-16 md:px-8 md:pt-[calc(var(--nav-h)+7rem)]">
        <div className="mx-auto max-w-[1400px]">
          <nav aria-label="Breadcrumb" className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">
            <Link href="/" className="hover:text-bone">Archive</Link>
            <span aria-hidden> / </span>
            <span>The Author</span>
          </nav>
          <p className="mt-10 font-mono text-meta tracking-[0.3em] text-red uppercase">{AUTHOR.name}</p>
          <h1 className="mt-4 font-display text-colossal leading-[0.8] font-extrabold tracking-tight uppercase">
            The man who <span className="text-red">built Mars</span>
          </h1>
        </div>
      </header>

      <section aria-labelledby="origin" className="border-t border-line px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[3fr_9fr]">
          <h2 id="origin" className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase md:pt-2">The origin of the story</h2>
          <div className="max-w-[60ch] space-y-6">
            <p className="text-lede text-bone">{AUTHOR.born}</p>
            {AUTHOR.lines.map((l, i) => (
              <Reveal key={l}>
                <p className={i === AUTHOR.lines.length - 1 ? "font-display text-h2 font-bold uppercase" : "text-lede text-bone/80"}>{l}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="books" className="border-t border-line px-5 py-20 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <h2 id="books" className="font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">The books</h2>
          <ol role="list" className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {BOOKS.map((b) => (
              <li key={b.slug}>
                <Link href={`/story/books/${b.slug}/`} className="group block">
                  <Plate src={`/images/books/${b.slug}.webp`} alt={`Archive plate for ${b.title}.`} width={900} height={1350} className="transition-transform duration-500 group-hover:-translate-y-1" sizes="(min-width: 1024px) 16vw, 45vw" />
                  <span className="mt-3 block font-mono text-meta tracking-[0.16em] text-ash uppercase group-hover:text-bone">{b.published}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-label="More" className="border-t border-line px-5 py-20 md:px-8">
        <ul role="list" className="mx-auto grid max-w-[1400px] gap-px bg-line md:grid-cols-3">
          <li className="bg-void">
            <Link href="/author/sons-of-ares/" className="group block h-full p-8 transition-colors hover:bg-void-2 md:p-10">
              <span className="font-display text-h3 font-bold uppercase group-hover:text-red">The comics</span>
              <span className="mt-2 block text-ash">Sons of Ares: the revolution’s origin, with Fitchner at its centre.</span>
            </Link>
          </li>
          <li className="bg-void">
            <Link href="/author/sources/" className="group block h-full p-8 transition-colors hover:bg-void-2 md:p-10">
              <span className="font-display text-h3 font-bold uppercase group-hover:text-red">Official sources</span>
              <span className="mt-2 block text-ash">Where the author’s notes, interviews and news actually live.</span>
            </Link>
          </li>
          <li className="bg-void">
            <Link href="/fandom/" className="group block h-full p-8 transition-colors hover:bg-void-2 md:p-10">
              <span className="font-display text-h3 font-bold uppercase group-hover:text-red">The fandom</span>
              <span className="mt-2 block text-ash">The arguments his books started.</span>
            </Link>
          </li>
        </ul>
      </section>
    </article>
  );
}
