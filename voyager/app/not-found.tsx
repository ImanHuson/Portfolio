import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-[1400px] px-4 py-24 md:px-8">
      <h1 className="text-4xl font-semibold tracking-tight">Off the map</h1>
      <p className="mt-4 max-w-[50ch] text-muted">There is no page here. It may be a place that is still being researched.</p>
      <p className="mt-8"><Link href="/" className="bg-accent px-5 py-3 font-semibold text-on-accent">Back to the globe</Link></p>
    </main>
  );
}
