import type { Metadata } from "next";
import { MEDIA, small } from "@/lib/content/media";
import { SOURCES } from "@/lib/content/sources";
import { SOUNDS } from "@/lib/content/sounds";

export const metadata: Metadata = { title: "Sources and credits", description: "Every reference and every image licence used on Terrarum." };

const TYPE: Record<string, string> = {
  official: "Official body",
  "government-statistics": "Government statistics",
  academic: "Academic",
  museum: "Museum",
  "heritage-body": "Heritage body",
  news: "News and features",
  reference: "Reference",
  secondary: "Secondary",
  dataset: "Dataset",
};

export default function SourcesPage() {
  return (
    <main id="main" className="mx-auto max-w-[1400px] px-4 py-14 md:px-8">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Sources and credits</h1>
      <p className="mt-4 max-w-[62ch] text-lg text-muted">
        Every reference the site cites, with what it was used for and how far to trust it, and every image with its creator and licence.
      </p>

      <section aria-labelledby="refs-h" className="mt-16">
        <h2 id="refs-h" className="text-2xl font-semibold">References ({SOURCES.length})</h2>
        <ul className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-x-12 break-words lg:grid-cols-2">
          {SOURCES.map((s) => (
            <li key={s.id} id={s.id} className="border-t border-line py-5 scroll-mt-20">
              <p className="text-sm text-muted">{TYPE[s.type]}</p>
              <p className="mt-1">
                <a href={s.url} className="font-medium underline decoration-line underline-offset-2 hover:decoration-current">{s.title}</a>
              </p>
              <p className="text-sm text-muted">{s.publisher}{s.published ? `, ${s.published}` : ""}. Read {s.accessed}.</p>
              {s.notes && <p className="mt-2 text-[15px]">{s.notes}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="media-h" className="mt-20">
        <h2 id="media-h" className="text-2xl font-semibold">Images ({MEDIA.length})</h2>
        <p className="mt-2 max-w-[62ch] text-muted">
          Each is published under the licence shown. Most are shown from Wikimedia Commons&rsquo; own thumbnail server at the size your screen needs, with a small copy kept here in case that server cannot be reached; the rest are hosted here as resized copies. Share-alike licences carry over to these copies.
        </p>
        <ul className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-10 break-words sm:grid-cols-2 lg:grid-cols-4">
          {MEDIA.map((m) => (
            <li key={m.id}>
              <img
                src={small(m)}
                alt={m.alt}
                width={m.width}
                height={m.height}
                loading="lazy"
                className="aspect-[4/3] w-full bg-surface object-cover"
              />
              <p className="mt-3 text-sm font-medium">{m.title}</p>
              <p className="text-sm text-muted">
                {m.creator}. <a href={m.sourceUrl} className="underline underline-offset-2">{m.repository}</a>,{" "}
                <a href={m.licenseUrl} className="underline underline-offset-2">{m.license}</a>.
                {m.modified ? ` ${m.modified}.` : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sound-h" id="sound" className="mt-20 max-w-[70ch] scroll-mt-20">
        <h2 id="sound-h" className="text-2xl font-semibold">Sound ({SOUNDS.length})</h2>
        <p className="mt-2 text-muted">
          Field recordings a country can play when you turn sound on in the header. Off unless you choose it. Each is a quiet mono copy, loudness evened out and faded at the ends.
        </p>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {SOUNDS.map((s) => (
            <li key={s.id} className="py-4">
              <p className="font-medium">{s.title}</p>
              <p className="text-sm text-muted">
                {s.creator}, {s.date}. <a href={s.sourceUrl} className="underline underline-offset-2">Wikimedia Commons</a>,{" "}
                <a href={s.licenseUrl} className="underline underline-offset-2">{s.license}</a>.
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="data-h" className="mt-20 max-w-[70ch]">
        <h2 id="data-h" className="text-2xl font-semibold">Maps and data</h2>
        <p className="mt-3 text-muted">
          Globe and region shapes: Natural Earth (public domain), simplified. Street maps: OpenFreeMap vector tiles, © OpenMapTiles, data
          © OpenStreetMap contributors (ODbL). Place coordinates: OpenStreetMap, looked up through Nominatim. 360° viewer: Pannellum (MIT).
          Map engine: MapLibre GL JS (BSD-3-Clause).
        </p>
      </section>
    </main>
  );
}
