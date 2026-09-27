import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PageHeader({
  trail,
  title,
  lede,
  children,
  className,
  tone = "red",
}: {
  trail?: { href: string; label: string }[];
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  tone?: "red" | "gold" | "rim";
}) {
  return (
    <header className={cn("relative px-5 pt-[calc(var(--nav-h)+5rem)] pb-16 md:px-8 md:pt-[calc(var(--nav-h)+7rem)] md:pb-24", className)}>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-[70vh]",
          tone === "red" && "bg-[radial-gradient(ellipse_70%_60%_at_20%_0%,rgba(122,15,23,0.28),transparent_70%)]",
          tone === "gold" && "bg-[radial-gradient(ellipse_70%_60%_at_20%_0%,rgba(140,116,70,0.2),transparent_70%)]",
          tone === "rim" && "bg-[radial-gradient(ellipse_70%_60%_at_20%_0%,rgba(170,178,186,0.14),transparent_70%)]",
        )}
      />
      <div className="relative mx-auto max-w-[1400px]">
        {trail && (
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap gap-2 font-mono text-meta tracking-[0.18em] text-ash-2 uppercase">
              {trail.map((t, i) => (
                <li key={t.href} className="flex gap-2">
                  <Link href={t.href} className="hover:text-bone">
                    {t.label}
                  </Link>
                  {i < trail.length - 1 && <span aria-hidden>/</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="mt-6 max-w-[18ch] font-display text-h1 leading-[0.85] font-extrabold tracking-tight uppercase">
          {title}
        </h1>
        {lede && <p className="mt-8 max-w-[52ch] text-lede text-ash">{lede}</p>}
        {children}
      </div>
    </header>
  );
}
