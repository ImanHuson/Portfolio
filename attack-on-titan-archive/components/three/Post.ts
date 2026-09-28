import { Mesh, Program, RenderTarget, Triangle, type OGLRenderingContext } from "ogl";
import { NOISE } from "./glsl";

// Post-processing, two cheap passes (GPU Gems 3's "volumetric light
// scattering as a post-process", screen-space version):
//   rays     half-res: march from each pixel toward the sun's screen position,
//            accumulating only what is bright (the sky). Steam, the Wall and
//            the Titan are dark, so they cut shafts into the light.
//   final    scene + rays, then vignette, film grain and a slight edge
//            chromatic split. The look of a print, not a game.

const vertex = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

const rays = /* glsl */ `
precision highp float;
uniform sampler2D tScene;
uniform vec2 uSunUv;
uniform float uThreshold;
varying vec2 vUv;
void main() {
  vec2 delta = (uSunUv - vUv) / 48.0;
  vec2 uv = vUv;
  float illum = 1.0;
  vec3 acc = vec3(0.0);
  for (int i = 0; i < 48; i++) {
    uv += delta;
    vec3 c = texture2D(tScene, clamp(uv, 0.001, 0.999)).rgb;
    float l = dot(c, vec3(0.299, 0.587, 0.114));
    acc += c * smoothstep(uThreshold, uThreshold + 0.18, l) * illum;
    illum *= 0.965;
  }
  gl_FragColor = vec4(acc / 48.0, 1.0);
}
`;

const final = /* glsl */ `
precision highp float;
${NOISE}
uniform sampler2D tScene;
uniform sampler2D tRays;
uniform float uRays;
uniform float uTime;
uniform vec2 uRes;
varying vec2 vUv;
void main() {
  vec2 c = vUv - 0.5;
  float edge = dot(c, c);
  // a hair of chromatic split toward the corners, like an old lens
  vec2 ca = c * edge * 0.012;
  // render targets lose the canvas MSAA: a small luma-edge blend (FXAA-lite)
  vec2 px = 1.0 / uRes;
  vec3 m = texture2D(tScene, vUv).rgb;
  vec3 n = texture2D(tScene, vUv + vec2(0.0, px.y)).rgb;
  vec3 s = texture2D(tScene, vUv - vec2(0.0, px.y)).rgb;
  vec3 e = texture2D(tScene, vUv + vec2(px.x, 0.0)).rgb;
  vec3 w = texture2D(tScene, vUv - vec2(px.x, 0.0)).rgb;
  vec3 L = vec3(0.299, 0.587, 0.114);
  float lm = dot(m, L);
  float range = max(max(dot(n, L), dot(s, L)), max(dot(e, L), dot(w, L))) - min(min(dot(n, L), dot(s, L)), min(dot(e, L), dot(w, L)));
  vec3 col = mix(m, (n + s + e + w + m) / 5.0, smoothstep(0.04, 0.2, range) * 0.75);
  col.r = mix(col.r, texture2D(tScene, vUv + ca).r, 0.6);
  col.b = mix(col.b, texture2D(tScene, vUv - ca).b, 0.6);
  col += texture2D(tRays, vUv).rgb * uRays * vec3(1.0, 0.93, 0.8);
  col *= 1.0 - smoothstep(0.18, 0.72, edge * 1.6) * 0.55;               // vignette
  float g = hash2(vUv * uRes + fract(uTime * 7.0) * 100.0) - 0.5;
  col += g * 0.035;                                                       // grain
  gl_FragColor = vec4(col, 1.0);
}
`;

export function createPost(gl: OGLRenderingContext) {
  // stencil: true is deliberate. ogl's plain depth attachment is 16-bit, which
  // z-fights across a 3 km scene (the Wall striped, the land lost behind the
  // sky). A depth-stencil attachment is 24-bit depth.
  let scene = new RenderTarget(gl, { stencil: true });
  let half = new RenderTarget(gl, { width: Math.max(1, gl.canvas.width / 2), height: Math.max(1, gl.canvas.height / 2), depth: false });
  const tri = new Triangle(gl);
  const rayProg = new Program(gl, {
    vertex,
    fragment: rays,
    uniforms: { tScene: { value: scene.texture }, uSunUv: { value: [0.5, 0.8] }, uThreshold: { value: 0.62 } },
    depthTest: false,
    depthWrite: false,
  });
  const finalProg = new Program(gl, {
    vertex,
    fragment: final,
    uniforms: {
      tScene: { value: scene.texture },
      tRays: { value: half.texture },
      uRays: { value: 1 },
      uTime: { value: 0 },
      uRes: { value: [gl.canvas.width, gl.canvas.height] },
    },
    depthTest: false,
    depthWrite: false,
  });
  const rayMesh = new Mesh(gl, { geometry: tri, program: rayProg });
  const finalMesh = new Mesh(gl, { geometry: tri, program: finalProg });

  return {
    target: () => scene,
    resize() {
      const w = gl.canvas.width;
      const h = gl.canvas.height;
      scene = new RenderTarget(gl, { width: w, height: h, stencil: true });
      half = new RenderTarget(gl, { width: Math.max(1, Math.floor(w / 2)), height: Math.max(1, Math.floor(h / 2)), depth: false });
      rayProg.uniforms.tScene.value = scene.texture;
      finalProg.uniforms.tScene.value = scene.texture;
      finalProg.uniforms.tRays.value = half.texture;
      finalProg.uniforms.uRes.value = [w, h];
    },
    /** composite to screen. sunUv: the sun's position in screen UV; rays: strength */
    render(renderer: { render: (o: { scene: Mesh; target?: RenderTarget; clear?: boolean }) => void }, sunUv: [number, number], strength: number, time: number) {
      rayProg.uniforms.uSunUv.value = sunUv;
      finalProg.uniforms.uRays.value = strength;
      finalProg.uniforms.uTime.value = time;
      if (strength > 0.01) renderer.render({ scene: rayMesh, target: half });
      else finalProg.uniforms.uRays.value = 0;
      renderer.render({ scene: finalMesh });
    },
  };
}
