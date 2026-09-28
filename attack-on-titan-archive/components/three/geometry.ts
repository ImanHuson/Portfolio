import { Geometry, type OGLRenderingContext } from "ogl";

// Geometry builders that aren't in ogl's box of primitives.

/** A ring wall: outer face, inner face and a flat walk on top. Centred on
 * the origin, radius measured to the wall's middle. */
export function ringWall(gl: OGLRenderingContext, radius: number, height: number, thickness: number, segments: number) {
  const position: number[] = [];
  const normal: number[] = [];
  const face: number[] = []; // 0 outer, 1 inner, 2 top
  const index: number[] = [];
  const ro = radius + thickness / 2;
  const ri = radius - thickness / 2;

  const strip = (r0: number, y0: number, r1: number, y1: number, nFn: (c: number, s: number) => number[], f: number, flip: boolean) => {
    const base = position.length / 3;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      const c = Math.cos(a), s = Math.sin(a);
      position.push(c * r0, y0, s * r0, c * r1, y1, s * r1);
      const n = nFn(c, s);
      normal.push(...n, ...n);
      face.push(f, f);
    }
    for (let i = 0; i < segments; i++) {
      const a = base + i * 2;
      if (flip) index.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      else index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  };
  strip(ro, 0, ro, height, (c, s) => [c, 0, s], 0, true);
  strip(ri, 0, ri, height, (c, s) => [-c, 0, -s], 1, false);
  strip(ri, height, ro, height, () => [0, 1, 0], 2, false);

  return new Geometry(gl, {
    position: { size: 3, data: new Float32Array(position) },
    normal: { size: 3, data: new Float32Array(normal) },
    face: { size: 1, data: new Float32Array(face) },
    index: { data: new Uint32Array(index) },
  });
}
