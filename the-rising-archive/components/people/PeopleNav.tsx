import Link from "next/link";

// The People branch's own map. Anchors on this page, links to the rest.
const LINKS: { href: string; label: string; hash?: boolean }[] = [
  { href: "#ten", label: "Ten faces", hash: true },
  { href: "#extended", label: "The ones who deserve a place", hash: true },
  { href: "/people/relationships/", label: "The Constellation" },
  { href: "/people/the-vale/", label: "The Vale" },
  { href: "/fandom/quotes/", label: "Quotes" },
  { href: "/story/timeline/", label: "Moments" },
];

export default function PeopleNav() {
  return (
    <nav aria-label="The People" className="px-5 pb-10 md:px-8">
      <ul role="list" className="mx-auto flex max-w-[1400px] flex-wrap gap-x-6 gap-y-3 border-t border-line pt-5">
        {LINKS.map((l) => (
          <li key={l.href}>
            {l.hash ? (
              <a href={l.href} className="inline-block py-1 font-mono text-meta tracking-[0.18em] text-ash uppercase hover:text-bone">
                {l.label}
              </a>
            ) : (
              <Link href={l.href} className="inline-block py-1 font-mono text-meta tracking-[0.18em] text-ash uppercase hover:text-bone">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
