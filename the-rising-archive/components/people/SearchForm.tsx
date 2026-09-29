// A plain GET form into the cast page's search, so it works with JS off:
// the browser simply opens /people/cast/?q=... with the full cast listed.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function SearchForm() {
  return (
    <form role="search" action={`${BASE}/people/cast/`} method="get" className="px-5 pb-12 md:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-end gap-4">
        <label className="min-w-0 flex-1 basis-72">
          <span className="font-mono text-meta tracking-[0.2em] text-ash uppercase">Search the archive</span>
          <input
            type="search"
            name="q"
            placeholder="Obsidian, Philosophy, House Raa…"
            autoComplete="off"
            className="mt-2 block w-full border-b border-line-strong bg-transparent py-2 font-serif text-xl text-bone italic placeholder:text-ash-2 focus:border-red focus:outline-none"
          />
        </label>
        <button type="submit" className="min-h-11 border border-red px-5 font-mono text-meta tracking-[0.2em] text-bone uppercase hover:bg-red/15">
          Search
        </button>
      </div>
    </form>
  );
}
