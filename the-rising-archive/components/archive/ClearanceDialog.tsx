"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CLEARANCE_LEVELS, type Clearance } from "@/lib/data/spoilers";
import { cn } from "@/lib/utils";

export default function ClearanceDialog({
  open,
  onOpenChange,
  value,
  onChoose,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  value: Clearance;
  onChoose: (c: Clearance) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-lenis-prevent
        className="border-line-strong bg-void-2 p-8 sm:max-w-md"
      >
        <DialogHeader className="gap-3 text-left">
          <p className="font-mono text-meta tracking-[0.2em] text-red uppercase">Archive clearance</p>
          <DialogTitle className="font-display text-4xl leading-none font-bold tracking-tight uppercase">
            How far have you read?
          </DialogTitle>
          <DialogDescription className="text-ash">
            The archive hides anything past your clearance. You can open a sealed passage yourself at any time, or change this from the top bar.
          </DialogDescription>
        </DialogHeader>
        <ul className="mt-2 grid gap-1" role="list">
          {CLEARANCE_LEVELS.map((lvl) => (
            <li key={lvl.value}>
              <button
                type="button"
                onClick={() => onChoose(lvl.value)}
                aria-pressed={lvl.value === value}
                className={cn(
                  "group flex w-full items-baseline justify-between border border-transparent px-3 py-2.5 text-left transition-colors duration-[var(--dur-micro)]",
                  "hover:border-line-strong hover:bg-void-3",
                  lvl.value === value && "border-red/60 bg-void-3",
                )}
              >
                <span className="text-bone">{lvl.label}</span>
                <span className="font-mono text-meta text-ash-2 group-hover:text-ash">{lvl.short}</span>
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
