"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { reducedMotionStore } from "@/lib/animation/tokens";
import { DESCENT } from "@/lib/data/basement";
import { asset, cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CellarShot = dynamic(() => import("@/components/three/basement/CellarShot"), { ssr: false });

/** Frames rendered from the scene, for JS off and reduced motion: the descent
 * as a contact sheet, each frame with its beat. */
const FRAMES = [
  { src: "/images/basement/descent-1.webp", beats: [0, 1] },
  { src: "/images/basement/descent-2.webp", beats: [2] },
  { src: "/images/basement/descent-3.webp", beats: [3, 4] },
  { src: "/images/basement/descent-4.webp", beats: [5, 6] },
  { src: "/images/basement/descent-5.webp", beats: [7] },
];

function Beat({ i, className }: { i: number; className?: string }) {
  const b = DESCENT[i];
  return (
    <div className={className}>
      {b.kicker && <p className="font-mono text-meta tracking-[0.24em] text-paper/60 uppercase">{b.kicker}</p>}
      <p className="mt-2 font-serif text-lede leading-snug text-paper italic">{b.text}</p>
    </div>
  );
}

function ContactSheet() {
  return (
    <section id="descent" aria-label="The descent" className="scroll-mt-[var(--nav-h)] bg-void px-4 py-20 md:px-8 md:py-28">
      <ol className="mx-auto grid max-w-[1400px] gap-x-6 gap-y-14 md:grid-cols-2">
        {FRAMES.map((f, k) => (
          <li key={f.src} className={cn(k === 0 && "md:col-span-2")}>
            <img src={asset(f.src)} alt="" width={1280} height={800} loading="lazy" className="w-full" />
            <p className="mt-3 font-mono text-meta tracking-[0.2em] text-ash-2">FRAME {String(k + 1).padStart(2, "0")}</p>
            {f.beats.map((i) => (
              <Beat key={i} i={i} className="mt-3 max-w-[46ch]" />
            ))}
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function Descent() {
  const mode = useSyncExternalStore(
    reducedMotionStore.subscribe,
    () => (reducedMotionStore.getSnapshot() ? "still" : "cinematic"),
    () => "static" as const,
  );
  const hostRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  // a device too slow for the live scene gets the contact sheet instead
  const [tooSlow, setTooSlow] = useState(false);
  const onTooSlow = useCallback(() => setTooSlow(true), []);
  // the stills are far shorter than the pinned scene: keep the reader at the descent
  useEffect(() => {
    if (tooSlow) document.getElementById("descent")?.scrollIntoView({ block: "start" });
  }, [tooSlow]);

  useGSAP(
    () => {
      if (mode !== "cinematic" || tooSlow || !hostRef.current) return;
      const q = gsap.utils.selector(hostRef);
      gsap.set(q("[data-beat]"), { autoAlpha: 0, y: 10 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hostRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (self) => {
            progress.current = self.progress;
          },
        },
      });

      DESCENT.forEach((b, i) => {
        tl.to(q(`[data-beat='${i}']`), { autoAlpha: 1, y: 0, duration: 0.015 }, b.at).to(q(`[data-beat='${i}']`), { autoAlpha: 0, duration: 0.012 }, b.until);
      });

      tl.to({}, { duration: 0.01 }, 0.99);
    },
    { dependencies: [mode, tooSlow], scope: hostRef },
  );

  if (mode !== "cinematic" || tooSlow) return <ContactSheet />;

  return (
    <section ref={hostRef} id="descent" aria-label="The descent" className="relative h-[900vh] bg-void">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <CellarShot progress={progress} onTooSlow={onTooSlow} className="absolute inset-0" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(2,2,2,0.55)_100%)]" />

        {DESCENT.map((_, i) => (
          <div key={i} className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-16 md:px-8 md:pb-14">
              <div data-beat={i} className="mx-auto max-w-[1400px]">
              <Beat i={i} className="max-w-[40ch] [text-shadow:0_1px_18px_rgba(0,0,0,0.9)]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
