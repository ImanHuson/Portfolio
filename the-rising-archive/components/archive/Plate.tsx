import Image from "next/image";
import { cn } from "@/lib/utils";

// Static export + basePath: next/image does not prefix public paths, so we do.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** An archive plate: one of the images in /public/images. The book covers
 * are the publisher's, the portraits credited fan art, and every other
 * plate is listed with its source in lib/data/credits.ts. */
export default function Plate({
  src,
  alt,
  width = 900,
  height = 900,
  className,
  priority = false,
  sizes = "(min-width: 768px) 40vw, 100vw",
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={`${BASE}${src}`}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={cn("h-auto w-full bg-void-2", className)}
    />
  );
}
