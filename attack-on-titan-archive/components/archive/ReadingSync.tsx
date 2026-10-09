"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { readStore } from "@/lib/readStore";

/** Opens the seals the reader has read past, on every page and whenever the
 * setting changes; marks the rest as ahead of them. Renders nothing. With JS
 * off nothing runs, so every seal stays shut. */
export default function ReadingSync() {
  const pathname = usePathname();
  const upTo = useSyncExternalStore(readStore.subscribe, readStore.getSnapshot, readStore.getServerSnapshot);
  useEffect(() => {
    document.querySelectorAll<HTMLDetailsElement>("details[data-ch]").forEach((el) => {
      const ch = Number(el.dataset.ch);
      el.open = ch <= upTo;
      el.dataset.ahead = ch > upTo ? "1" : "";
    });
  }, [pathname, upTo]);
  return null;
}
