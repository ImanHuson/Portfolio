// A frame-time governor for the heavy scenes: judged on time, not frame
// counts (a device at one frame a second would take minutes to trip a
// counter). If the smoothed frame time stays over ~34 ms, it lowers the
// resolution a step at a time; still that slow at the floor for 3 s more, it
// gives up and calls onTooSlow, and the section swaps in its stills.

export function makeGovernor({
  start,
  scale,
  floor,
  apply,
  onTooSlow,
}: {
  start: number;
  scale: number;
  floor: number;
  apply: (scale: number) => void;
  onTooSlow?: () => void;
}) {
  let ema = 20;
  let last = start;
  let lastAdjust = start + 1000; // ignore the first second (shader compile)
  let gaveUp = false;
  return {
    /** call once per drawn frame */
    tick(now: number) {
      const dt = now - last;
      last = now;
      ema = ema * 0.85 + dt * 0.15;
      if (now - lastAdjust > 1500 && ema > 34) {
        if (scale > floor) {
          scale = Math.max(floor, scale * 0.75);
          apply(scale);
          lastAdjust = now;
          ema = 24;
        } else if (!gaveUp && onTooSlow && now - lastAdjust > 3000) {
          gaveUp = true;
          onTooSlow();
        }
      }
    },
    /** call when frames were skipped (off screen, hidden tab), so the gap is not counted */
    rest(now: number) {
      last = now;
    },
  };
}
