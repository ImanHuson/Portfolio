"use client";

import { useEffect, useRef } from "react";
import { asset, cn } from "@/lib/utils";

/*
 * A painting with depth. The plain <img> is always there (server render, JS
 * off, reduced motion, no WebGL); on top, when it can, one full-frame WebGL
 * quad redraws it through its depth map, so near ground moves more than the
 * far sky: a camera moving through the picture rather than a picture sliding.
 *
 * The camera is three CSS custom properties on the root, so GSAP's scroll
 * timelines drive it like any other property (`gsap.to(el, { "--dx": 1 })`):
 *   --dx, --dy  sideways and vertical travel, -1..1
 *   --dz        push-in, 0..1: the near ground grows faster than the far
 * plus a small drift toward the pointer. It only draws when one of those
 * changes, so a still scene costs nothing. No library: ~150 lines of WebGL 1.
 */

const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = p * 0.5 + 0.5; v.y = 1.0 - v.y; gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `
precision mediump float;
uniform sampler2D img, dep;
uniform vec2 sc, of;      // cover fit: image uv = v * sc + of
uniform vec3 cam;         // travel x, y and push-in
uniform float amt, over;  // parallax strength, overscan so edges never show
varying vec2 v;
void main() {
  vec2 c = vec2(0.5);
  vec2 base = c + ((v * sc + of) - c) * (1.0 - over);
  vec2 p = base;
  // a few fixed-point steps: sample the depth where the ray actually lands
  for (int i = 0; i < 4; i++) {
    float d = texture2D(dep, p).r;
    p = c + (base - c) / (1.0 + d * cam.z * 0.12) + (d - 0.35) * cam.xy * amt;
  }
  gl_FragColor = texture2D(img, clamp(p, 0.001, 0.999));
}`;

/** a real GPU only: software rasterisers (SwiftShader, llvmpipe) draw this
 * full-screen pass on the CPU and stall scrolling, so they keep the <img>.
 * `?gl=force` skips the check for QA. */
const supportsGL = () => {
  try {
    if (location.search.includes("gl=force")) return true;
    const gl = document.createElement("canvas").getContext("webgl");
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const name = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software/i.test(name);
  } catch {
    return false;
  }
};

export default function DepthImage({
  src,
  depth,
  alt = "",
  position = "50% 50%",
  amount = 0.035,
  className,
  imgClassName,
  eager,
  ...rest
}: {
  src: string;
  depth: string;
  alt?: string;
  /** like object-position, as "x% y%" */
  position?: string;
  /** how far the near ground travels, in fractions of the frame */
  amount?: number;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current, canvas = canvasRef.current;
    if (!root || !canvas) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !supportsGL()) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: "high-performance" });
    if (!gl) return;

    const sh = (type: number, s: string) => {
      const o = gl.createShader(type)!;
      gl.shaderSource(o, s);
      gl.compileShader(o);
      return o;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const [uSc, uOf, uCam, uAmt, uOver] = ["sc", "of", "cam", "amt", "over"].map(u);
    gl.uniform1i(u("img"), 0);
    gl.uniform1i(u("dep"), 1);

    let alive = true;
    let size = { w: 1, h: 1 };
    let natural = { w: 1, h: 1 };
    let ready = 0;
    const tex = (unit: number, url: string, isImg: boolean) => {
      const t = gl.createTexture();
      const im = new Image();
      im.decoding = "async";
      im.onload = () => {
        if (!alive) return;
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        if (isImg) natural = { w: im.naturalWidth, h: im.naturalHeight };
        if (++ready === 2) {
          fit();
          dirty = true;
          kick();
        }
      };
      im.src = url;
    };
    tex(0, asset(src), true);
    tex(1, asset(depth), false);

    const [px, py] = position.split(" ").map((s) => parseFloat(s) / 100);
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const r = root.getBoundingClientRect();
      size = { w: Math.max(1, Math.round(r.width * dpr)), h: Math.max(1, Math.round(r.height * dpr)) };
      canvas.width = size.w;
      canvas.height = size.h;
      gl.viewport(0, 0, size.w, size.h);
      // object-fit: cover, with object-position
      const ia = natural.w / natural.h, ca = size.w / size.h;
      const sc = ia > ca ? [ca / ia, 1] : [1, ia / ca];
      gl.uniform2f(uSc, sc[0], sc[1]);
      gl.uniform2f(uOf, (1 - sc[0]) * (px || 0.5), (1 - sc[1]) * (py || 0.5));
      gl.uniform1f(uAmt, amount);
      gl.uniform1f(uOver, amount * 1.6);
      dirty = true;
    };

    // the camera: CSS variables (GSAP) plus a pointer drift, eased
    let dirty = true;
    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    const last = { x: NaN, y: NaN, z: NaN };
    const fine = matchMedia("(hover: hover)").matches;
    const onPtr = (e: PointerEvent) => {
      ptr.tx = (e.clientX / innerWidth - 0.5) * 2;
      ptr.ty = (e.clientY / innerHeight - 0.5) * 2;
      kick();
    };
    if (fine) addEventListener("pointermove", onPtr, { passive: true });

    let raf = 0, visible = false;
    // a slow GPU gives up and keeps the <img>: 8 slow frames (> 50 ms apart
    // while drawing back to back) among the first 90 drawn
    let prevDraw = 0, drawn = 0, slow = 0;
    const frame = (t: number) => {
      raf = 0;
      if (!alive || !visible || ready < 2) return;
      const st = root.style;
      const x = parseFloat(st.getPropertyValue("--dx")) || 0;
      const y = parseFloat(st.getPropertyValue("--dy")) || 0;
      const z = parseFloat(st.getPropertyValue("--dz")) || 0;
      ptr.x += (ptr.tx - ptr.x) * 0.06;
      ptr.y += (ptr.ty - ptr.y) * 0.06;
      const cx = x + ptr.x * 0.35, cy = y + ptr.y * 0.25;
      const moving = Math.abs(ptr.tx - ptr.x) > 0.002 || Math.abs(ptr.ty - ptr.y) > 0.002;
      if (dirty || cx !== last.x || cy !== last.y || z !== last.z) {
        gl.uniform3f(uCam, cx, cy, z);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        if (prevDraw && t - prevDraw < 200 && t - prevDraw > 50 && drawn < 90 && ++slow >= 8) {
          alive = false;
          delete root.dataset.depth;
          return;
        }
        prevDraw = t;
        drawn++;
        last.x = cx;
        last.y = cy;
        last.z = z;
        if (dirty) root.dataset.depth = "on"; // first frame drawn: the canvas covers the <img>
        dirty = false;
      }
      // keep going while the pointer eases; GSAP's writes wake us (below)
      if (moving) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      kick();
    });
    io.observe(root);
    const mo = new MutationObserver(kick);
    mo.observe(root, { attributes: true, attributeFilter: ["style"] });
    const ro = new ResizeObserver(() => ready === 2 && fit());
    ro.observe(root);
    canvas.addEventListener("webglcontextlost", () => {
      alive = false;
      delete root.dataset.depth;
    });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
      ro.disconnect();
      removeEventListener("pointermove", onPtr);
      delete root.dataset.depth;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [src, depth, position, amount]);

  return (
    <div ref={rootRef} className={cn("depth-image relative overflow-hidden", className)} {...rest}>
      <img
        src={asset(src)}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        decoding="async"
        className={cn("absolute inset-0 size-full object-cover", imgClassName)}
        style={{ objectPosition: position }}
      />
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full opacity-0 transition-opacity duration-300" />
    </div>
  );
}
