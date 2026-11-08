import type { Refs } from "@/lib/content";

/** Superscript links to the numbered source list at the foot of the page. */
export function Cite({ ids, refs }: { ids: string[]; refs: Refs }) {
  return (
    <>
      {ids.map((id) => (
        <a key={id} href={`#ref-${id}`} className="ref" aria-label={`Source ${refs.n(id)}`}>
          [{refs.n(id)}]
        </a>
      ))}
    </>
  );
}

export function SourceList({ refs, title = "Sources" }: { refs: Refs; title?: string }) {
  return (
    <section aria-labelledby="sources-h" className="border-t border-line pt-10">
      <h2 id="sources-h" className="font-display text-2xl">{title}</h2>
      <ol className="mt-6 grid gap-x-10 gap-y-4 text-sm md:grid-cols-2">
        {refs.list.map((s, i) => (
          <li key={s.id} id={`ref-${s.id}`} className="grid grid-cols-[2.2rem_minmax(0,1fr)] scroll-mt-24">
            <span className="tabular-nums text-muted">{i + 1}.</span>
            <span>
              <a href={s.url} className="underline decoration-line underline-offset-2 hover:decoration-current">{s.title}</a>
              <span className="text-muted">. {s.publisher}{s.published ? `, ${s.published}` : ""}. Read {s.accessed}.</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
