import Link from "next/link";
import SoundToggle from "@/components/archive/SoundToggle";
import ChapterMenu from "@/components/navigation/ChapterMenu";

/** The archive's letterhead: the name, every chapter one click away, and
 * where the reader is. One line, 60px. */
export default function SiteNav() {
  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 h-[var(--nav-h)] border-b border-paper/10 bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-3 px-4 sm:gap-6 md:px-8">
        <Link href="/" className="font-display text-[1.05rem] font-bold tracking-[0.08em] whitespace-nowrap text-paper">
          <span className="sm:hidden">AoT Archive</span>
          <span className="hidden sm:inline">Attack on Titan: The Archive</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
          <ChapterMenu />
          <SoundToggle />
        </div>
      </div>
      {/* how far through this file: CSS scroll-driven, so it costs no JS and simply isn't there where unsupported */}
      <span className="read-progress" aria-hidden />
    </header>
  );
}
