"use client";

import Link from "next/link";
import { useRef, useState } from "react";

export interface Lot {
  href: string;
  name: string;
  native?: string;
  kind: string;
}

/**
 * Omikuji, the fortune slips offered at most shrines in Japan (Japan Tourism
 * Agency text for Meiji Jingu), as a way into a random place: shake the box and
 * a slip unrolls with a place written on it. The slip says it is a game.
 */
const SOURCE = "https://www.mlit.go.jp/tagengo-db/en/H30-00533.html";
export function Omikuji({ lots }: { lots: Lot[] }) {
  const [drawn, setDrawn] = useState<{ lot: Lot; n: number } | null>(null);
  const [shaking, setShaking] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const draw = () => {
    if (shaking) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setDrawn(null);
    setShaking(true);
    setTimeout(
      () => {
        setShaking(false);
        setDrawn({ lot: lots[Math.floor(Math.random() * lots.length)], n: Date.now() });
      },
      reduce ? 0 : 500,
    );
  };

  return (
    <section aria-labelledby="omikuji-h" className="mx-auto max-w-[1400px] px-4 py-[12vh] md:px-8" data-js-only>
      <div className="grid items-start gap-10 md:grid-cols-[auto_minmax(0,1fr)]">
        <div ref={box} className="omikuji-box mx-auto md:mx-0" data-shake={shaking ? "" : undefined} aria-hidden />
        <div>
          <h2 id="omikuji-h" className="font-display text-3xl md:text-5xl">Draw an omikuji</h2>
          <p className="mt-3 max-w-[52ch] text-muted">
            Most shrines in Japan offer omikuji, paper slips with a fortune written on them, from very good luck to very bad. Here the slip holds a place to go next.
          </p>
          <button type="button" onClick={draw} disabled={shaking} className="press glass mt-6 inline-flex items-center gap-3 rounded-full px-6 py-3 font-medium disabled:opacity-60">
            {drawn ? "Draw again" : "Shake the box"}
          </button>
          <div aria-live="polite" className="mt-8">
            {drawn && (
              <div key={drawn.n} className="omikuji-slip grid max-w-[30rem] grid-cols-[auto_minmax(0,1fr)] gap-6 p-6">
                {drawn.lot.native ? (
                  <p lang="ja" aria-hidden className="tategaki text-5xl text-[#b5241b]">{drawn.lot.native}</p>
                ) : (
                  <span />
                )}
                <div>
                  <p className="text-sm text-[#5a5248]">Your slip reads</p>
                  <p className="mt-2 font-display text-3xl leading-tight">{drawn.lot.name}</p>
                  <p className="mt-1 text-sm text-[#5a5248]">{drawn.lot.kind}</p>
                  <Link href={drawn.lot.href} className="mt-4 inline-block font-medium text-[#9e2016] underline underline-offset-4">
                    Go there
                  </Link>
                  <p className="mt-4 text-[13px] text-[#6b6358]">
                    A game, not a fortune. About omikuji: <a href={SOURCE} className="underline underline-offset-2">Japan Tourism Agency</a>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
