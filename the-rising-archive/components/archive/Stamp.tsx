import { cn } from "@/lib/utils";

// The archive’s "scars": honest markers instead of pretending every page is
// complete. Used sparingly, where the uncertainty is real.
const STAMPS = {
  unknown: "Unknown",
  disputed: "Disputed",
  unconfirmed: "The author has not confirmed this",
  argued: "Fans still argue about this",
  reading: "Archivist’s reading",
  sealed: "Archive sealed",
} as const;

export type StampKind = keyof typeof STAMPS;

export default function Stamp({ kind, className }: { kind: StampKind; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 font-mono text-meta tracking-[0.2em] uppercase",
        kind === "sealed" || kind === "disputed" ? "border-red/70 text-red" : "border-line-strong text-ash",
        className,
      )}
    >
      {STAMPS[kind]}
    </span>
  );
}
