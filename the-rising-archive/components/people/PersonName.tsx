"use client";

import { useArchive } from "@/components/providers/ArchiveProvider";
import { shownAs, type Person } from "@/lib/data/people";

/** A character's name or epithet, held back to a cover until the reader's
 * clearance covers the reveal. Server and no-JS render the safe cover. */
export default function PersonName({ person, part = "name" }: { person: Person; part?: "name" | "epithet" }) {
  const { clearance } = useArchive();
  return <>{shownAs(person, clearance)[part]}</>;
}
