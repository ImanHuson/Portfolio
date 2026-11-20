"use client";

import { Shuffle } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

/** "Take me somewhere": a random place among the ones that are researched. */
export function RandomPlace({ hrefs, className = "" }: { hrefs: string[]; className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      data-js-only
      onClick={() => router.push(hrefs[Math.floor(Math.random() * hrefs.length)])}
      className={`press inline-flex items-center gap-2 border border-current px-4 py-2.5 font-medium ${className}`}
    >
      <Shuffle size={18} aria-hidden />
      Take me somewhere
    </button>
  );
}
