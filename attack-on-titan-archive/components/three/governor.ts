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
  // ?gl=force (QA, rendering stills): never hand over to the stills
  let gaveUp = typeof location !== "undefined" && new URLSearchParams(location.search).get("gl") === "force";
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

/**
 * True when the context runs on a software rasteriser (SwiftShader, llvmpipe,
 * Microsoft Basic Render). Those cannot hold the heavy scenes at a readable
 * frame rate, so the section goes straight to its stills at load time, before
 * the reader has scrolled, instead of failing ten seconds in. `?gl=force` in
 * the URL skips the check (for rendering stills and QA on such machines).
 */
export function isSoftwareGL(gl: WebGLRenderingContext | WebGL2RenderingContext) {
  if (typeof location !== "undefined" && new URLSearchParams(location.search).get("gl") === "force") return false;
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const name = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
}
