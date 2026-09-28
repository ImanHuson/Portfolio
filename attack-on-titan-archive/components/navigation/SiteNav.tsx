import Link from "next/link";
import SoundToggle from "@/components/archive/SoundToggle";

/** The archive's letterhead. Military register: one line, 60px, no menu
 * theatre. The page is the navigation; this is the file's header strip. */
export default function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--nav-h)] border-b border-paper/10 bg-base/70 backdrop-blur-[2px]">
      <nav aria-label="Primary" className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-6 px-4 md:px-8">
        <Link href="/" className="flex items-baseline gap-3 font-military text-[0.95rem] font-semibold tracking-[0.28em] text-paper uppercase">
          <span>AoT Archive</span>
          <span className="hidden font-mono text-[0.68rem] font-normal tracking-[0.12em] text-ash sm:inline">FILE 845-SH</span>
        </Link>
        <div className="flex items-center gap-5 md:gap-8">
          <Link
            href="/#index"
            className="py-2 font-military text-[0.85rem] tracking-[0.24em] text-paper/80 uppercase transition-colors hover:text-paper"
          >
            Index
          </Link>
          <SoundToggle />
        </div>
      </nav>
    </header>
  );
}
