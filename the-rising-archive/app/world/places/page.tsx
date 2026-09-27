import type { Metadata } from "next";
import PageHeader from "@/components/typography/PageHeader";
import SolarMap from "@/components/world/SolarMap";
import { PLACES } from "@/lib/data/places";

export const metadata: Metadata = {
  title: "Places",
  description: "A map of the saga’s Solar System: Mercury, Venus, Earth, Luna, Mars, and Io and the Rim.",
  alternates: { canonical: "./" },
};

export default function PlacesPage() {
  return (
    <>
      <PageHeader
        trail={[{ href: "/", label: "Archive" }, { href: "/world/", label: "The World" }, { href: "/world/places/", label: "Places" }]}
        title="A solar system of grievances"
        lede="Every world in the saga carries a different memory of the Society. Choose one. The map isn’t to scale; the politics are."
      />
      <section aria-label="Solar System map" className="px-5 pb-28 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <SolarMap />
          <noscript>
            <ul className="mt-10 grid gap-6">
              {PLACES.map((p) => (
                <li key={p.slug}>
                  <h2 className="font-display text-2xl uppercase">{p.name}</h2>
                  <p className="text-ash">{p.lines[0].text}</p>
                </li>
              ))}
            </ul>
          </noscript>
        </div>
      </section>
    </>
  );
}
