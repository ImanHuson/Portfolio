import Reveal from "@/components/archive/Reveal";
import { cn } from "@/lib/utils";

// The archive’s thesis, told as beats rather than a wall of text. Lines
// marked `strong` carry the turn of the story and get display weight.
const BEATS: { text: string; strong?: boolean; red?: boolean }[] = [
  { text: "The Society called itself civilization." },
  { text: "It divided humanity by Color, engineered people for their assigned purposes, gave Gold the right to rule, and taught everyone beneath them that the hierarchy was simply the natural order of things." },
  { text: "Then Darrow learned the truth.", strong: true },
  { text: "He was a Red. A Helldiver of Lykos. He had spent his life believing that Reds were sacrificing themselves underground so that humanity could one day live beneath the stars." },
  { text: "The lie was almost perfect.", strong: true },
  { text: "Humanity had already reached the stars. The Reds had simply been left behind." },
  { text: "His wife Eo died for the truth. Darrow lived for it.", strong: true, red: true },
  { text: "What began as one miner’s grief became the Rising. The Rising became a war. And the war became something much harder: a civilization trying to decide what should replace the civilization it destroyed." },
  { text: "The Republic won battles. It did not win peace.", strong: true },
  { text: "Ten years after the Fall of Luna, the old world is still alive in its survivors, its institutions, its children, its armies and its ideas." },
  { text: "This archive follows those survivors. Not just the Reaper. Not just the Sovereign. Not just the Golds. The people caught between them." },
];

export default function Welcome() {
  return (
    <section aria-labelledby="welcome-title" className="relative border-t border-line px-5 py-28 md:px-8 md:py-40">
      <div className="mx-auto grid max-w-[1400px] gap-16 md:grid-cols-[5fr_7fr]">
        <div className="md:sticky md:top-[calc(var(--nav-h)+4rem)] md:self-start">
          <h2 id="welcome-title" className="font-display text-h2 leading-[0.9] font-bold tracking-tight uppercase">
            Welcome to the Solar System.
          </h2>
          <p className="mt-6 max-w-[36ch] text-ash">
            Six published novels. One unfinished revolution. A solar system full of ghosts.
          </p>
        </div>
        <ol className="grid gap-10 md:gap-14" role="list">
          {BEATS.map((b, i) => (
            <Reveal as="li" key={i} className="max-w-[58ch]">
              <p
                className={cn(
                  b.strong ? "font-display text-h3 leading-tight font-semibold uppercase" : "text-lede leading-relaxed text-bone/85",
                  b.red && "text-red",
                )}
              >
                {b.text}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
