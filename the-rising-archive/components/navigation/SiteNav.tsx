"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useArchive } from "@/components/providers/ArchiveProvider";
import { CLEARANCE_LEVELS } from "@/lib/data/spoilers";
import { cn } from "@/lib/utils";

export const BRANCHES = [
  { href: "/story/", label: "Story", full: "The Story" },
  { href: "/people/", label: "People", full: "The People" },
  { href: "/world/", label: "World", full: "The World" },
  { href: "/ideas/", label: "Ideas", full: "The Ideas" },
  { href: "/fandom/", label: "Fandom", full: "The Fandom" },
  { href: "/author/", label: "Author", full: "The Author" },
  { href: "/sealed/", label: "Sealed", full: "The Sealed File" },
];

function Controls({ stacked = false }: { stacked?: boolean }) {
  const { clearance, known, openClearance, soundOn, toggleSound } = useArchive();
  const lvl = CLEARANCE_LEVELS.find((l) => l.value === clearance);
  return (
    // data-js-only: hidden by a <noscript> style in the layout, since neither
    // control can do anything without JavaScript.
    <div data-js-only className={cn("flex gap-5", stacked ? "flex-col items-start" : "items-center")}>
      <button
        type="button"
        onClick={openClearance}
        className="text-left font-mono text-meta tracking-[0.16em] text-ash uppercase transition-colors hover:text-bone"
      >
        Clearance: <span className={known ? "text-bone" : "text-red"}>{known ? lvl?.short : "Unset"}</span>
      </button>
      <label className="flex cursor-pointer items-center gap-2 font-mono text-meta tracking-[0.16em] text-ash uppercase">
        <Switch checked={soundOn} onCheckedChange={toggleSound} aria-label="Ambient sound" />
        Sound
      </label>
    </div>
  );
}

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => pathname.startsWith(href.replace(/\/$/, ""));

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-[var(--nav-h)] border-b border-line/70 bg-void/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1400px] items-center gap-8 px-5 md:px-8">
        <Link href="/" className="font-display text-lg leading-none font-bold tracking-[0.08em] text-bone uppercase">
          The Red Rising Archive
        </Link>
        <nav aria-label="Archive" className="hidden xl:block">
          <ul className="flex gap-6">
            {BRANCHES.map((b) => (
              <li key={b.href}>
                <Link
                  href={b.href}
                  aria-current={isActive(b.href) ? "page" : undefined}
                  className={cn(
                    "relative py-1 font-mono text-meta tracking-[0.18em] uppercase transition-colors",
                    isActive(b.href) ? "text-bone" : b.href === "/sealed/" ? "text-red/80 hover:text-red" : "text-ash hover:text-bone",
                  )}
                >
                  {b.label}
                  {isActive(b.href) && <span className="absolute inset-x-0 -bottom-1 h-px bg-red" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto hidden xl:block">
          <Controls />
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="ml-auto flex size-10 items-center justify-center border border-line text-bone xl:hidden"
            aria-label="Open archive menu"
          >
            <Menu className="size-4" strokeWidth={1.5} />
          </SheetTrigger>
          <SheetContent side="right" className="border-line bg-void-2 p-8" data-lenis-prevent>
            <SheetTitle className="font-display text-2xl font-bold tracking-wide uppercase">The Archive</SheetTitle>
            <ul className="mt-6 grid gap-3">
              <li>
                <Link href="/" onClick={() => setOpen(false)} className="font-display text-3xl uppercase">
                  Opening
                </Link>
              </li>
              {BRANCHES.map((b) => (
                <li key={b.href}>
                  <Link href={b.href} onClick={() => setOpen(false)} className="font-display text-3xl uppercase">
                    {b.full}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-10 border-t border-line pt-6">
              <Controls stacked />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
