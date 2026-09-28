import { asset, cn } from "@/lib/utils";

/** One Titan's 24-frame turntable, as a CSS sprite: no JS, no GPU at runtime. */
export default function Turntable({ slug, small = false, className, style }: { slug: string; small?: boolean; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden
      className={cn("turntable aspect-[1/2]", className)}
      style={{ backgroundImage: `url(${asset(`/images/titans/${slug}${small ? "-sm" : ""}.webp`)})`, ...style }}
    />
  );
}
