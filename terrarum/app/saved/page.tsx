import type { Metadata } from "next";
import { SavedList } from "@/components/ui/SavedList";

export const metadata: Metadata = { title: "Saved places", description: "Places you saved, kept in this browser only." };

export default function SavedPage() {
  return (
    <main id="main" className="mx-auto max-w-[1400px] px-4 py-14 md:px-8">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Saved places</h1>
      <p className="mt-4 max-w-[60ch] text-muted">
        Kept in this browser only: there are no accounts and nothing is sent anywhere. Clearing your browser data clears this list.
      </p>
      <SavedList />
    </main>
  );
}
