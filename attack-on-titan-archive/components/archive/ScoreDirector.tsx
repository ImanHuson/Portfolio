"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { chapterFor } from "@/lib/data/chapters";
import { sound } from "@/lib/audio/engine";
import type { Mood } from "@/lib/audio/score";

const ACT_MOOD: Record<string, Mood> = { Humanity: "humanity", Truth: "truth", Freedom: "freedom" };

/** Tells the score which act the reader is in. Renders nothing. */
export default function ScoreDirector() {
  const pathname = usePathname();
  useEffect(() => {
    const c = chapterFor(pathname);
    const mood: Mood = c?.id === "AOT-09" ? "paths" : (c && ACT_MOOD[c.act]) || "humanity";
    sound.setMood(mood);
  }, [pathname]);
  return null;
}
