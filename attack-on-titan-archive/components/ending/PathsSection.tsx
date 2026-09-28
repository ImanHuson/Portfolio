"use client";

import dynamic from "next/dynamic";
import PinnedScene from "@/components/ending/PinnedScene";
import { PATHS_BEATS } from "@/lib/data/ending";

const PathsShot = dynamic(() => import("@/components/three/paths/PathsShot"), { ssr: false });

const STILLS = [
  { src: "/images/ending/paths-1.webp", beats: [0, 1] },
  { src: "/images/ending/paths-2.webp", beats: [2, 3] },
  { src: "/images/ending/paths-3.webp", beats: [4, 5] },
];

export default function PathsSection() {
  return <PinnedScene label="Paths" beats={PATHS_BEATS} Scene={PathsShot} stills={STILLS} height="h-[800vh]" />;
}
