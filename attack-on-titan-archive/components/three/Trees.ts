import { Cylinder, Geometry, Mesh, Program, type OGLRenderingContext } from "ogl";
import { ATMOS, NOISE, SHADOWS } from "./glsl";
import { riverX, terrainH } from "./terrain";

// Forests beyond the Wall: thousands of conifers in ONE instanced draw call,
// clustered into woods (not sprinkled evenly), lining the river, sitting on
// the same terrain height the ground uses.

const vertex = /* glsl */ `
attribute vec3 position;
attribute vec3 normal;
attribute vec4 aTree;   // x, y, z, scale
attribute float aSeed;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vSeed;
varying float vH;
void main() {
  vec3 p = position * vec3(aTree.w * 0.42, aTree.w, aTree.w * 0.42);
  vWorld = p + aTree.xyz + vec3(0.0, aTree.w * 0.5, 0.0);
  vNormal = normalize(normal + vec3(0.0, 0.35, 0.0));
  vSeed = aSeed;
  vH = position.y + 0.5;
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
`;

const fragment = /* glsl */ `
precision highp float;
${ATMOS}
${NOISE}
${SHADOWS}
uniform vec3 cameraPosition;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vSeed;
varying float vH;
void main() {
  vec3 N = normalize(vNormal);
  vec3 col = mix(vec3(0.1, 0.16, 0.09), vec3(0.2, 0.26, 0.13), vSeed);
  col *= 0.6 + 0.5 * vH;                              // darker toward the trunk
  float diff = max(dot(N, normalize(uSun)), 0.0);
  float shade = cloudShadow(vWorld.xz) * titanShadow(vWorld);
  col *= uSunColor * diff * 1.5 * shade + uSkyColor * 0.5;
  float dist = length(cameraPosition - vWorld);
  gl_FragColor = vec4(grade(applyFog(col, dist, vWorld.y)), 1.0);
}
`;

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

// cheap deterministic "forestness": where woods are allowed to grow
const woods = (x: number, z: number) =>
  Math.sin(x * 0.019 + 1.1) * Math.cos(z * 0.017 - 0.4) + 0.6 * Math.sin((x + z) * 0.008 + 2.0);

export function createTrees(gl: OGLRenderingContext, shared: Record<string, { value: unknown }>, count: number) {
  const rand = rng(1066);
  const tree: number[] = [];
  const seed: number[] = [];
  let tries = 0;
  while (tree.length / 4 < count && tries < count * 40) {
    tries++;
    const a = rand() * Math.PI * 2;
    const r = 88 + Math.pow(rand(), 1.1) * 380;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const rd = Math.abs(x - riverX(z));
    if (rd < 11) continue; // not in the water, nor on its banks
    const riverside = rd < 16 ? 0.9 : 0;
    if (woods(x, z) < 0.3 && rand() > riverside) continue;
    if (Math.abs(x + 8) < 5 && z < -60) continue; // keep the road clear
    const s = 1.2 + rand() * 1.6; // 12-28 m conifers
    tree.push(x, terrainH(x, z), z, s);
    seed.push(rand());
  }
  const base = new Cylinder(gl, { radiusTop: 0, radiusBottom: 0.5, height: 1, radialSegments: 6, heightSegments: 1, openEnded: true });
  const geometry = new Geometry(gl, {
    position: { size: 3, data: base.attributes.position.data },
    normal: { size: 3, data: base.attributes.normal.data },
    index: { data: base.attributes.index.data },
    aTree: { instanced: 1, size: 4, data: new Float32Array(tree) },
    aSeed: { instanced: 1, size: 1, data: new Float32Array(seed) },
  });
  const program = new Program(gl, { vertex, fragment, uniforms: { ...shared }, cullFace: false });
  return new Mesh(gl, { geometry, program, frustumCulled: false });
}
