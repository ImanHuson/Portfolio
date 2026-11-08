import type { Metadata } from "next";
import { RANKING, RANKING_CAVEATS, RANKING_SOURCES } from "@/lib/content/expansion";

export const metadata: Metadata = {
  title: "How this is made",
  description: "How Terrarum researches countries, checks facts and licences, and decides which country opens next.",
};

const STEPS = [
  ["Research", "Each country, city and place is researched on its own, from the institutions closest to it: the shrine's own history, the national statistics office, the museum that holds the print."],
  ["Write", "Text is written from those sources, in plain words, and every factual passage links to what supports it."],
  ["Check", "Each claim is re-read against its source. Lines that went further than the source says are cut, not softened. Figures that change carry the date they describe."],
  ["Publish, or say what is missing", "Pages list what they do not cover yet. A smaller page that is right beats a longer one that guesses."],
];

export default function MethodPage() {
  return (
    <main id="main" className="mx-auto max-w-[1400px] px-4 py-14 md:px-8">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">How this is made</h1>
      <p className="mt-4 max-w-[62ch] text-lg text-muted">
        Terrarum is for people who would like to see the world and cannot easily go. That only works if what it shows is real.
      </p>

      <p className="mt-4 max-w-[62ch] text-muted">
        The name comes from <cite>Theatrum Orbis Terrarum</cite>, the &ldquo;Theatre of the World&rdquo; Abraham Ortelius published in Antwerp in
        1570: the first modern atlas, maps of one size arranged by continent and region, with a description on the back of each (
        <a href="https://blogs.loc.gov/maps/2020/04/ortelius-a-legendary-mapmaker/" className="underline underline-offset-2">Library of Congress</a>).
      </p>

      <section aria-labelledby="research-h" className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <h2 id="research-h" className="text-2xl font-semibold">Research and checking</h2>
        <ol className="grid gap-x-10 sm:grid-cols-2">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="border-t border-line py-5">
              <p className="font-medium"><span className="mr-2 tabular-nums text-muted">{i + 1}</span>{t}</p>
              <p className="mt-2 text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="images-h" className="mt-20 grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <h2 id="images-h" className="text-2xl font-semibold">Images and 360° views</h2>
        <div className="max-w-[65ch] space-y-4 text-[17px]">
          <p>
            Photographs come from Wikimedia Commons and Flickr under Creative Commons licences, found through Openverse. Each one was checked
            for its licence, credited to the person who took it and linked to where it is published. Historical prints come from the Cleveland
            Museum of Art&rsquo;s public-domain collection.
          </p>
          <p>
            Every image is searched for first, in open collections. A 360° view appears where a real, openly licensed panorama exists, as at
            Nishiki Tenmangū, Kyoto Station and the Malé fish market. Where none exists, an AI-generated impression may be added later, and it is
            always labelled as one: nothing generated is passed off as a photograph.
          </p>
        </div>
      </section>

      <section id="expansion" aria-labelledby="expansion-h" className="mt-20 scroll-mt-20">
        <h2 id="expansion-h" className="text-2xl font-semibold">Which country opens next</h2>
        <p className="mt-3 max-w-[65ch] text-muted">
          The first eleven countries were chosen by hand and open in that order. After them, countries are added in batches of five to ten.
          A batch is chosen for what there is to explore, the places, history and culture, with international tourist arrivals as a guide
          rather than a strict ranking. The figures below come from compilations of UN Tourism&rsquo;s 2024 data.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-[15px]">
            <caption className="sr-only">International tourist arrivals, 2024, and whether each country is in Terrarum</caption>
            <thead className="text-sm text-muted">
              <tr className="border-b border-line">
                <th scope="col" className="py-3 pr-4 font-normal">Rank</th>
                <th scope="col" className="py-3 pr-4 font-normal">Country</th>
                <th scope="col" className="py-3 pr-4 font-normal">Arrivals, 2024</th>
                <th scope="col" className="py-3 pr-4 font-normal">In Terrarum</th>
                <th scope="col" className="py-3 font-normal">Note</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {RANKING.map((r) => (
                <tr key={r.country} className="border-b border-line align-top">
                  <td className="py-3 pr-4">{r.rank}</td>
                  <td className="py-3 pr-4 font-medium">{r.country}</td>
                  <td className="py-3 pr-4">{r.arrivals}</td>
                  <td className="py-3 pr-4">{r.inTerrarum === "founding" ? "Founding collection" : r.inTerrarum === "next" ? "Next to open" : "Later"}</td>
                  <td className="py-3 text-muted">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-6 max-w-[70ch] list-disc space-y-2 pl-5 text-sm text-muted">
          {RANKING_CAVEATS.map((c) => <li key={c}>{c}</li>)}
        </ul>
        <h3 className="mt-8 text-sm font-medium">Where the figures come from</h3>
        <ul className="mt-2 space-y-2 text-sm">
          {RANKING_SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} className="underline underline-offset-2">{s.title}</a> <span className="text-muted">{s.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tech-h" className="mt-20 grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <h2 id="tech-h" className="text-2xl font-semibold">How it is built</h2>
        <div className="max-w-[65ch] space-y-4 text-[17px]">
          <p>
            A static site: every page is built ahead of time, so it loads fast and reads without JavaScript. The globe and maps use MapLibre with
            map data from Natural Earth and OpenStreetMap; the 360° viewer is Pannellum. Search runs in your browser over an index built with the
            site. There are no accounts and nothing about you is stored.
          </p>
          <p>
            Each country has its own look, defined as data (colours for light and dark, a typeface, a texture, how photographs are treated), so a
            new country is new content and a new theme, not a new website.
          </p>
        </div>
      </section>
    </main>
  );
}
