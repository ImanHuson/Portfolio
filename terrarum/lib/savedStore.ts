"use client";

import { useSyncExternalStore } from "react";

/**
 * Saved places, kept in this browser only (localStorage). It stands in for the
 * accounts and collections the brief describes, which need a server this
 * static site does not have. Nothing leaves the reader's device.
 */
export interface Saved {
  href: string;
  title: string;
  kind: string;
  savedAt: string;
}

const KEY = "terrarum-saved";
const listeners = new Set<() => void>();
let cache: Saved[] | null = null;
const EMPTY: Saved[] = [];

function read(): Saved[] {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? "[]") as Saved[];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: Saved[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked: keep the in-memory list for this visit.
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export function useSaved() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function toggleSaved(item: Omit<Saved, "savedAt">) {
  const list = read();
  write(list.some((s) => s.href === item.href) ? list.filter((s) => s.href !== item.href) : [{ ...item, savedAt: new Date().toISOString() }, ...list]);
}

export function removeSaved(href: string) {
  write(read().filter((s) => s.href !== href));
}
