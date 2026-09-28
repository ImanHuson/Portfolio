"use client";

import { useEffect, useRef } from "react";
import { Camera, Renderer, Transform, Vec3, type Mesh } from "ogl";
import { ATMOS_UNIFORMS, SHADOW_UNIFORMS } from "./glsl";
import { createSky } from "./Sky";
import { createGround } from "./Ground";
import { createWall } from "./Wall";
import { createTown } from "./Town";
import { createTitan, createXrayTitan } from "./Titan";
import { createSteam } from "./Steam";
import { createXrayBackdrop } from "./Xray";
import { createTrees } from "./Trees";
import { createBirds } from "./Birds";
import { createLightning } from "./Lightning";
import { createPost } from "./Post";
import { terrainH } from "./terrain";
import { shotAt } from "./choreography";
import { lerp } from "@/lib/animation/tokens";
import { makeGovernor } from "./governor";

/**
 * Year 845, the opening shot. Pure ogl (this repo's proven WebGL path),
 * split into modules: Sky / Ground / Wall / Town / Titan / Steam / Xray /
 * choreography. Scroll progress arrives through a ref, never React state,
 * so scrubbing never re-renders React.
 *
 * `still` renders one composed frame and stops (reduced motion, poster).
 */
export default function WallShot({
  progress,
  still = false,
  stillAt = 0.705,
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
      return; // no WebGL: the composed CSS frame behind stays visible
    }
    const gl = renderer.gl;
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

    const titan = createTitan(gl, shared, { steps: small ? 64 : 96 });
    titan.program.uniforms.uCut.value = 100;
    titan.position.set(0, 0, -62.8);
    titan.rotation.x = 0.07; // leaning in, over the parapet
    titan.setParent(scene);

    // the ones that walk outside: skinned, far smaller, never "cut"
    const wanderers: Mesh[] = [];
    // the ones walking outside: 3-15 m, scattered over the hills, a few by the river
    const spots: [number, number, number, number][] = [
      [-24, -96, 0.22, 0.4], [34, -128, 0.3, -0.6], [-46, -140, 0.18, 1.2], [40, -150, 0.26, -1.4],
      [6, -175, 0.34, 0.2], [-14, -205, 0.24, 2.4], [58, -118, 0.16, -0.9], [-70, -110, 0.2, 0.7],
      [-102, -168, 0.45, 0.3], [22, -240, 0.5, -0.2], [-40, -262, 0.3, 1.8], [75, -210, 0.38, -2.2],
      // two close to where the camera ends up, so the last frame has a subject
      [-30, -128, 0.26, 2.6], [-58, -150, 0.2, 2.2],
    ];
    for (const [x, z, s, ry] of spots.slice(0, small ? 9 : 14)) {
      const m = createTitan(gl, shared, { skin: 1, steps: 48 });
      m.position.set(x, terrainH(x, z) - 0.05, z);
      m.scale.set(s);
      m.rotation.y = ry;
      m.setParent(scene);
      wanderers.push(m);
    }

    const steam = createSteam(gl, shared, small ? 700 : 1500, {
      origin: [0, 0, -62.8], spread: [1.25, 1.6, 0.9], size: 8, speed: 0.05, tint: [1.0, 0.97, 0.92],
    });
    steam.renderOrder = 10; // always over the body: the steam hides the forming edge
    steam.setParent(scene);
    const dust = createSteam(gl, shared, small ? 260 : 520, {
      origin: [gateXZ[0], 0, gateXZ[1]], spread: [3.5, 4.0, 3.5], size: 6, speed: 0.1, tint: [0.92, 0.86, 0.76],
    });
    dust.program.uniforms.uCeil.value = 0.4;
    dust.renderOrder = 10;
    dust.setParent(scene);

    // the pass through the Wall: its own scene and camera
    const xrayScene = new Transform();
    const xrayCam = new Camera(gl, { fov: 42, near: 0.05, far: 50 });
    const backdrop = createXrayBackdrop(gl);
    backdrop.renderOrder = -1;
    backdrop.setParent(xrayScene);
    const xrayTitan = createXrayTitan(gl);
    xrayTitan.mesh.setParent(xrayScene);

    let aspect = 1;
    function resize() {
      const w = host!.clientWidth;
      const h = host!.clientHeight;
      renderer.setSize(w, h);
      aspect = w / h;
      // portrait screens get a wider lens so the Titan still fits
      const fov = aspect < 0.8 ? 58 : aspect < 1.2 ? 48 : 38;
      camera.perspective({ aspect, fov });
      xrayCam.perspective({ aspect, fov: aspect < 0.8 ? 62 : 42 });
      backdrop.program.uniforms.uRes.value = [w, h];
      const px = (h * renderer.dpr) / (2 * Math.tan((fov * Math.PI) / 360));
      steam.program.uniforms.uPxScale.value = px * 0.06;
      birds.program.uniforms.uPx.value = px * 0.9;
      post.resize();
      dust.program.uniforms.uPxScale.value = px * 0.06;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const warm = { fog: [0.74, 0.69, 0.6], sun: [1.08, 0.9, 0.68], sky: [0.42, 0.46, 0.5], zen: [0.36, 0.42, 0.48] };
    const cold = { fog: [0.56, 0.58, 0.58], sun: [0.92, 0.84, 0.74], sky: [0.38, 0.42, 0.46], zen: [0.3, 0.36, 0.42] };
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

      shared.uTitanTop.value = Math.max(s.shadowTop, s.cut) * s.titanFade;
      titan.program.uniforms.uEyes.value = s.eyes;
      titan.program.uniforms.uFade.value = s.titanFade * s.present;
      titan.visible = s.present > 0.001 && s.titanFade > 0.001;

      // the body stands whole inside its steam; the column clears bottom-up
      steam.program.uniforms.uIntensity.value = s.steam * (1 + s.vanish * 1.5);
      steam.program.uniforms.uCeil.value = 6.7;
      steam.program.uniforms.uClear.value = s.vanish > 0.01 ? -1 : s.cut;
      steam.program.uniforms.uTime.value = t;
      steam.visible = s.steam > 0.001;
      dust.program.uniforms.uIntensity.value = s.dust * 1.4;
      dust.program.uniforms.uTime.value = t;
      dust.visible = s.dust > 0.001;
      ground.program.uniforms.uBreach.value = s.breach;
      wall.program.uniforms.uBreach.value = s.breach;

      // a heavy, swaying walk: bob on the step, sway between steps
      for (let i = 0; i < wanderers.length; i++) {
        const w = wanderers[i];
        const ph = t * (0.9 + (i % 3) * 0.15) + i * 1.7;
        w.rotation.z = Math.sin(ph) * 0.05;
        w.rotation.x = 0.04 + Math.abs(Math.sin(ph)) * 0.03;
      }

      birds.visible = s.birds > 0.01;
      birds.program.uniforms.uTime.value = t;
      birds.program.uniforms.uScatter.value = s.scatter;
      lightning.visible = s.bolt > 0.001;
      lightning.program.uniforms.uStrike.value = s.bolt * 3;
      // the bolt faces the camera around its vertical axis
      lightning.rotation.y = Math.atan2(camera.position.x - lightning.position.x, camera.position.z - lightning.position.z);

      const target = post.target();
      renderer.render({ scene, camera, target });

      if (s.xray > 0.001) {
        xrayTitan.uniforms.uXray.value = s.xray;
        backdrop.program.uniforms.uXray.value = Math.min(1, s.xray * 1.4);
        backdrop.program.uniforms.uTravel.value = s.xrayTravel * 0.6;
        const y = lerp(3.3, 5.35, s.xrayTravel);
        xrayCam.position.set(0.35 * Math.sin(s.xrayTravel * 2.4), y, aspect < 0.8 ? 3.4 : 2.5);
        xrayCam.lookAt([0, y + 0.1, 0]);
        renderer.render({ scene: xrayScene, camera: xrayCam, target, clear: false });
      }

      // where the sun is on screen, for the light shafts
      const sd = atmos.uSun.value as number[];
      sunWorld.set(camera.position.x + sd[0] * 1000, camera.position.y + sd[1] * 1000, camera.position.z + sd[2] * 1000);
      sunClip.copy(sunWorld).applyMatrix4(camera.viewMatrix);
      const facing = sunClip.z < 0 ? 1 : 0;
      sunClip.copy(sunWorld).applyMatrix4(camera.projectionViewMatrix);
      const su: [number, number] = [sunClip.x * 0.5 + 0.5, sunClip.y * 0.5 + 0.5];
      const onScreen = Math.max(0, 1 - Math.max(Math.abs(su[0] - 0.5), Math.abs(su[1] - 0.5)) * 1.1);
      post.render(renderer as never, su, s.rays * facing * Math.min(1, onScreen * 1.6 + 0.15) * (1 - s.xray), t);
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
