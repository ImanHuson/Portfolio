"use client";

import { useEffect, useRef } from "react";
import { Camera, Renderer, Transform, Vec3 } from "ogl";
import { ATMOS_UNIFORMS, SHADOW_UNIFORMS } from "./glsl";
import { createSky } from "./Sky";
import { createGround } from "./Ground";
import { createWall } from "./Wall";
import { createTown } from "./Town";
import { createSteam } from "./Steam";
import { createTrees } from "./Trees";
import { createBirds } from "./Birds";
import { createLightning } from "./Lightning";
import { createPost } from "./Post";
import { shotAt } from "./choreography";
import { lerp } from "@/lib/animation/tokens";
import { isSoftwareGL, makeGovernor } from "./governor";

/**
 * Year 845, the opening shot. Pure ogl (this repo's proven WebGL path),
 * split into modules: Sky / Ground / Wall / Town / Steam / Lightning /
 * choreography. The Titan is never shown: the lightning, the steam column
 * climbing past the Wall, the shadow over the district and the gate are
 * how it arrives. Scroll progress arrives through a ref, never React state,
 * so scrubbing never re-renders React.
 *
 * `still` renders one composed frame and stops (reduced motion, poster).
 */
export default function WallShot({
  progress,
  still = false,
  stillAt = 0.68,
  className,
  onReady,
  onTooSlow,
}: {
  progress?: React.RefObject<number>;
  still?: boolean;
  stillAt?: number;
  className?: string;
  onReady?: () => void;
  /** called once if frames stay slow even at the lowest resolution */
  onTooSlow?: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const small = window.matchMedia("(max-width: 767px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5);

    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr, alpha: false, antialias: !small, powerPreference: "high-performance", preserveDrawingBuffer: still });
    } catch {
      // no WebGL at all: the section shows its stills
      onTooSlow?.();
      return;
    }
    const gl = renderer.gl;
    if (!still && isSoftwareGL(gl)) {
      // a software rasteriser cannot run this scene: stills, before the reader has scrolled
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      onTooSlow?.();
      return;
    }
    gl.clearColor(0.043, 0.047, 0.039, 1);
    gl.canvas.setAttribute("aria-hidden", "true");
    gl.canvas.style.display = "block";
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    host.appendChild(gl.canvas);

    const atmos = ATMOS_UNIFORMS();
    const shared = { ...atmos, ...SHADOW_UNIFORMS() };

    const camera = new Camera(gl, { fov: 38, near: 0.25, far: 2600 });
    const scene = new Transform();

    const sky = createSky(gl, atmos);
    sky.setParent(scene);
    const gateAngle = Math.atan2(-59.46, -8);
    const gateXZ: [number, number] = [Math.cos(gateAngle) * 60.6, Math.sin(gateAngle) * 60.6];
    const ground = createGround(gl, shared, gateXZ);
    ground.setParent(scene);
    const wall = createWall(gl, shared, gateAngle, small ? 384 : 768);
    wall.setParent(scene);
    const town = createTown(gl, shared, small ? 0.6 : 1);
    town.setParent(scene);
    const trees = createTrees(gl, shared, small ? 4000 : 11000);
    trees.setParent(scene);
    const birds = createBirds(gl, small ? 36 : 70);
    birds.setParent(scene);
    const lightning = createLightning(gl);
    lightning.position.set(0, 30, -63.5);
    lightning.setParent(scene);
    const post = createPost(gl);

    // the column: rises out of the fields beyond the south Wall to well over its
    // top, backlit by the low sun (the only sign of what is standing in it)
    const steam = createSteam(gl, shared, small ? 1200 : 2600, {
      origin: [0, 0, -63.2], spread: [2.3, 3.2, 1.7], size: 7.5, speed: 0.045, tint: [1.0, 0.99, 0.97],
    });
    steam.renderOrder = 10;
    steam.setParent(scene);
    const dust = createSteam(gl, shared, small ? 600 : 1300, {
      origin: [gateXZ[0], 0, gateXZ[1]], spread: [4.5, 5.0, 4.5], size: 6.5, speed: 0.1, tint: [0.92, 0.86, 0.76],
    });
    dust.program.uniforms.uCeil.value = 0.4;
    dust.renderOrder = 10;
    dust.setParent(scene);

    let aspect = 1;
    function resize() {
      const w = host!.clientWidth;
      const h = host!.clientHeight;
      renderer.setSize(w, h);
      aspect = w / h;
      // portrait screens get a wider lens so the column still fits
      const fov = aspect < 0.8 ? 58 : aspect < 1.2 ? 48 : 38;
      camera.perspective({ aspect, fov });
      const px = (h * renderer.dpr) / (2 * Math.tan((fov * Math.PI) / 360));
      steam.program.uniforms.uPxScale.value = px * 0.06;
      birds.program.uniforms.uPx.value = px * 0.9;
      post.resize();
      dust.program.uniforms.uPxScale.value = px * 0.06;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // a clear morning (canon: the attack came out of a blue sky): warm sun, blue
    // zenith, golden haze low down; the valley at the end turns cooler
    const warm = { fog: [0.8, 0.72, 0.6], sun: [1.32, 1.0, 0.66], sky: [0.36, 0.46, 0.62], zen: [0.2, 0.36, 0.64] };
    const cold = { fog: [0.6, 0.67, 0.74], sun: [1.08, 0.94, 0.78], sky: [0.36, 0.45, 0.6], zen: [0.22, 0.36, 0.6] };
    const mix3 = (a: number[], b: number[], t: number) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

    const start = performance.now();
    const sunWorld = new Vec3();
    const sunClip = new Vec3();
    function frame(p: number, t: number) {
      const s = shotAt(p, t);
      shared.uTime.value = t;
      camera.position.set(...s.cam);
      // portrait screens can't hold an off-centre composition: aim closer to centre
      camera.lookAt(aspect < 0.8 ? [s.tgt[0] * 0.3, s.tgt[1], s.tgt[2]] : s.tgt);
      sky.position.copy(camera.position);

      atmos.uExposure.value = s.exposure;
      atmos.uFogColor.value = mix3(warm.fog, cold.fog, s.out);
      atmos.uSunColor.value = mix3(warm.sun, cold.sun, s.out);
      atmos.uSkyColor.value = mix3(warm.sky, cold.sky, s.out);
      sky.program.uniforms.uZenith.value = mix3(warm.zen, cold.zen, s.out);
      sky.program.uniforms.uTime.value = t;

      // the shadow of something taller than the Wall, thrown across the district
      shared.uTitanTop.value = s.shadowTop;

      // the column climbs as it thickens, then bursts and thins out
      steam.program.uniforms.uIntensity.value = s.steam * (1 + s.vanish * 1.5);
      steam.program.uniforms.uCeil.value = 2.5 + 7.5 * s.rise;
      steam.program.uniforms.uClear.value = -1;
      steam.program.uniforms.uTime.value = t;
      steam.visible = s.steam > 0.001;
      dust.program.uniforms.uIntensity.value = s.dust * 2.0;
      dust.program.uniforms.uTime.value = t;
      dust.visible = s.dust > 0.001;
      ground.program.uniforms.uBreach.value = s.breach;
      wall.program.uniforms.uBreach.value = s.breach;

      birds.visible = s.birds > 0.01;
      birds.program.uniforms.uTime.value = t;
      birds.program.uniforms.uScatter.value = s.scatter;
      lightning.visible = s.bolt > 0.001;
      lightning.program.uniforms.uStrike.value = s.bolt * 3;
      // the bolt faces the camera around its vertical axis
      lightning.rotation.y = Math.atan2(camera.position.x - lightning.position.x, camera.position.z - lightning.position.z);

      const target = post.target();
      renderer.render({ scene, camera, target });

      // where the sun is on screen, for the light shafts
      const sd = atmos.uSun.value as number[];
      sunWorld.set(camera.position.x + sd[0] * 1000, camera.position.y + sd[1] * 1000, camera.position.z + sd[2] * 1000);
      sunClip.copy(sunWorld).applyMatrix4(camera.viewMatrix);
      const facing = sunClip.z < 0 ? 1 : 0;
      sunClip.copy(sunWorld).applyMatrix4(camera.projectionViewMatrix);
      const su: [number, number] = [sunClip.x * 0.5 + 0.5, sunClip.y * 0.5 + 0.5];
      const onScreen = Math.max(0, 1 - Math.max(Math.abs(su[0] - 0.5), Math.abs(su[1] - 0.5)) * 1.1);
      post.render(renderer as never, su, s.rays * facing * Math.min(1, onScreen * 1.6 + 0.15), t);
    }

    if (still) {
      frame(stillAt, 4);
      onReady?.();
      return () => {
        ro.disconnect();
        gl.canvas.remove();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }

    let raf: number | null = null;
    // the heaviest scene on the site: lower the resolution on slow devices,
    // and hand over to the rendered stills if even that is not enough
    const gov = makeGovernor({
      start,
      scale: renderer.dpr,
      floor: 0.5,
      apply: (sc) => {
        renderer.dpr = sc;
        resize();
      },
      onTooSlow,
    });
    const loop = () => {
      const now = performance.now();
      gov.tick(now);
      frame(progress?.current ?? 0, (now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    // only render while on screen: the opening is a long sticky section
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && raf === null) {
        gov.rest(performance.now());
        loop();
      }
      else if (!entry.isIntersecting && raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    });
    io.observe(host);
    frame(progress?.current ?? 0, 0);
    onReady?.();

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [progress, still, stillAt, onReady, onTooSlow]);

  return <div ref={hostRef} className={className} />;
}
