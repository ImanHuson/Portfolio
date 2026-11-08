import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Figure } from "./Figure";
import type { Place } from "@/lib/content/types";

export function PlaceCard({ place, href, size = "md" }: { place: Place; href: string; size?: "lg" | "md" }) {
  return (
    <Link href={href} className="lift press zoom group block">
      <div className="overflow-hidden">
        <Figure
          id={place.hero}
          credit="none"
          sizes={size === "lg" ? "(min-width:1024px) 55vw, 100vw" : "(min-width:1024px) 30vw, 100vw"}
          imgClassName={`w-full object-cover ${size === "lg" ? "aspect-[4/3]" : "aspect-[16/10]"}`}
        />
      </div>
      <p className="mt-4 text-sm text-muted">{place.kind}</p>
      <h3 className={`font-display ${size === "lg" ? "text-3xl" : "text-2xl"} mt-1 leading-tight`}>
        {place.name}
        {place.native && <span className="ml-2 inline-block text-[0.7em] text-muted" lang="ja">{place.native}</span>}
      </h3>
      <p className="mt-2 max-w-[52ch] text-muted">{place.summary}</p>
      <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent-text group-hover:underline">
        Go there <ArrowRight size={14} aria-hidden />
      </span>
    </Link>
  );
}
