import Link from "next/link";
import { Search } from "./Search";
import type { SearchItem } from "@/lib/content";

/** Always the atlas palette, whatever country is below it: the way home. */
export function SiteHeader({ index }: { index: SearchItem[] }) {
  return (
    <header
      className="sticky top-0 z-40 border-b border-[#2a313a] bg-[#0d1014]/92 text-[#e8e4dc] backdrop-blur"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4 md:px-8">
        <Link href="/" className="press flex items-baseline gap-2 font-semibold tracking-tight">
          <span className="text-lg">Terrarum</span>
          <span className="hidden text-sm font-normal text-[#9aa1a8] sm:inline">the world, from where you are</span>
        </Link>
        <nav aria-label="Main" className="-mr-2 ml-auto flex items-center text-sm sm:gap-1">
          <Link href="/#countries" className="rounded-sm px-2 py-2 text-[#c9c4bb] hover:text-white sm:px-3">Countries</Link>
          <Link href="/sources/" className="rounded-sm px-2 py-2 text-[#c9c4bb] hover:text-white sm:px-3">Sources</Link>
          <Search index={index} />
        </nav>
      </div>
    </header>
  );
}
