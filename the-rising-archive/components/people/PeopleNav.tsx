import Link from "next/link";
import { cn } from "@/lib/utils";

// The People branch's own map (brief section 60), on every People page.
const LINKS: { href: string; label: string }[] = [
  { href: "/people/#ten", label: "Ten faces" },
  { href: "/people/#extended", label: "The ones who deserve a place" },
  { href: "/people/cast/", label: "Complete cast" },
  { href: "/people/relationships/", label: "Relationships" },
  { href: "/people/themes/", label: "Themes" },
  { href: "/fandom/quotes/", label: "Quotes" },
  { href: "/story/timeline/", label: "Moments" },
  { href: "/people/the-vale/", label: "The Vale" },
];

export default function PeopleNav({ current }: { current?: string }) {
  return (
    <nav aria-label="The People" className="px-5 pb-10 md:px-8">
      <ul role="list" className="mx-auto flex max-w-[1400px] flex-wrap gap-x-6 gap-y-3 border-t border-line pt-5">
        {LINKS.map((l) => {
          const here = l.href === current;
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={here ? "page" : undefined}
                className={cn(
                  "inline-block py-1 font-mono text-meta tracking-[0.18em] uppercase hover:text-bone",
                  here ? "border-b border-red text-bone" : "text-ash",
                )}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
