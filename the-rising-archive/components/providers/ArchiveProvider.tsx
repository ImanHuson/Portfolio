"use client";

import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import type { Clearance } from "@/lib/data/spoilers";
import { clearanceStore } from "@/lib/clearanceStore";
import { sound } from "@/lib/audio/engine";
import ClearanceDialog from "@/components/archive/ClearanceDialog";

type ArchiveState = {
  clearance: Clearance;
  known: boolean; // has the reader told us how far they’ve read?
  setClearance: (c: Clearance) => void;
  openClearance: () => void;
  soundOn: boolean;
  toggleSound: () => void;
  cue: (c: "heartbeat" | "strike" | "seal" | "howl") => void;
};

const Ctx = createContext<ArchiveState | null>(null);

export function useArchive() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useArchive must be used inside ArchiveProvider");
  return v;
}

export default function ArchiveProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const stored = useSyncExternalStore(clearanceStore.subscribe, clearanceStore.getSnapshot, clearanceStore.getServerSnapshot);
  const clearance = (stored === null ? 0 : Number(stored)) as Clearance;
  const known = stored !== null;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  // First visit to any page except the opening sequence: ask how far the
  // reader has read. The opening itself stays uninterrupted.
  useEffect(() => {
    if (known || pathname === "/") return;
    const id = window.setTimeout(() => setDialogOpen(true), 600);
    return () => window.clearTimeout(id);
  }, [known, pathname]);

  const setClearance = useCallback((c: Clearance) => clearanceStore.set(c), []);

  const toggleSound = useCallback(() => {
    if (sound.enabled) {
      sound.disable();
      setSoundOn(false);
    } else {
      void sound.enable().then(() => setSoundOn(true));
    }
  }, []);

  const cue = useCallback((c: "heartbeat" | "strike" | "seal" | "howl") => sound.play(c), []);

  return (
    <Ctx.Provider
      value={{
        clearance,
        known,
        setClearance,
        openClearance: () => setDialogOpen(true),
        soundOn,
        toggleSound,
        cue,
      }}
    >
      {children}
      <ClearanceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        value={clearance}
        onChoose={(c) => {
          setClearance(c);
          setDialogOpen(false);
        }}
      />
    </Ctx.Provider>
  );
}
