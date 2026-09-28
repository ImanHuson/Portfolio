"use client";

import { useRef } from "react";
import { useArchive } from "@/components/providers/ArchiveProvider";

/** Lorn's plate: one distant howl the first time you hover it, and only if
 * the reader has switched sound on. */
export default function HowlPlate({ children }: { children: React.ReactNode }) {
  const { cue } = useArchive();
  const done = useRef(false);
  return (
    <div
      onMouseEnter={() => {
        if (done.current) return;
        done.current = true;
        cue("howl");
      }}
    >
      {children}
    </div>
  );
}
