import Link from "next/link";

export function Crumbs({ trail }: { trail: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {trail.map((t, i) => (
          <li key={t.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {t.href ? (
              <Link href={t.href} className="inline-block py-1 hover:text-ink underline-offset-2 hover:underline">{t.label}</Link>
            ) : (
              <span aria-current="page" className="text-ink">{t.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
