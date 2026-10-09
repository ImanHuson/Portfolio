---
name: polyhaven
description: Fetch free CC0 lighting (HDRIs), PBR material textures and ready-made 3D models (glTF) from Poly Haven and use them in ogl/WebGL scenes. Use whenever a 3D scene needs realistic lighting or reflections (metal, glass, stone looking real), a surface material (rock, wood, metal, fabric), or a real prop/object model (weapons, furniture, rocks, plants, tools) instead of a procedural or AI-generated one. Also use for a sky or environment backdrop. No API key, no cost.
---

# Poly Haven for ogl scenes

Poly Haven (polyhaven.com) has ~1,000 HDRIs, hundreds of PBR textures and ~520 models, all CC0. Its API needs no key; it's reachable from these containers. Lighting from a real HDRI is the single cheapest upgrade to a WebGL scene: it's what makes metal read as metal (this repo's earlier "satin metal looked like plastic" problem was a missing environment).

## Fetch

Run from the repo root (needs numpy + Pillow, both present here):

```bash
P=.claude/skills/polyhaven/scripts/polyhaven.py
python3 $P search --type hdris --category studio --limit 10   # or --query "sunset forest"
python3 $P search --type models --query "sword"               # props, furniture, rocks, plants...
python3 $P hdri studio_small_09 --res 2k --out <project>/public/env/
python3 $P texture rock_wall_08 --res 1k --maps diff,nor_gl,rough --out <project>/public/tex/
python3 $P model antique_katana_01 --res 1k --out <project>/public/models/
```

What each writes:
- `hdri`: `<id>-bg.webp` (tone-mapped equirect for a visible backdrop), `<id>-env-rgbm.png` (linear HDR as RGBM, ≤1024 px wide, for reflections), `<id>-diffuse-rgbm.png` (64×32 blurred, for ambient light). The 2k source is decoded and deleted; pass `--keep-hdr` to keep it. `--exposure` scales the backdrop only.
- `texture`: WebP maps named `<id>_<map>_<res>.webp`. Use `nor_gl` (OpenGL normals), not `nor_dx`.
- `model`: `<out>/<id>/` with the `.gltf`, `.bin` and `textures/`, at the chosen texture resolution.
- Always: `<out>/polyhaven-credits.json` (name, authors, page). **Credit Poly Haven on the site** (the API's terms require it; the assets are CC0): e.g. "Lighting and models: Poly Haven (CC0)" in the credits list each project already keeps.

## Budget (these are web pages)

- HDRI at `2k` is plenty; the env PNG is ~0.7–1.5 MB. Use `1k` on mobile-first pages.
- Models: check `polys=` in search; under ~20k triangles per hero prop is comfortable. Fetch textures at `1k` unless the object fills the screen.
- Don't ship the raw `.hdr`/`.exr`.

## Use in ogl

`references/ogl-viewer-example.html` is a complete, verified scene (rendered and screenshotted here): a glTF model with its own base/metal-roughness/normal maps, lit only by the HDRI, over the HDRI backdrop. The essentials:

1. **Load env textures** with `premultiplyAlpha: false` (RGBM stores data in alpha) and mipmaps on the specular one: `new Texture(gl, { generateMipmaps: true, minFilter: gl.LINEAR_MIPMAP_LINEAR, premultiplyAlpha: false })`.
2. **Shared GLSL** (WebGL2 / `#version 300 es`):
   ```glsl
   vec2 eq(vec3 d){ return vec2(atan(d.z, d.x)/(2.0*PI) + 0.5, acos(clamp(d.y,-1.0,1.0))/PI); }
   vec3 rgbm(vec4 c){ return c.rgb * c.a * 6.0; }
   ```
   Specular: `rgbm(textureLod(tEnv, eq(reflect(-v,n)), rough * 9.0)) * (f0*ab.x + ab.y)` with Karis's analytic env-BRDF for `ab`. Diffuse: `rgbm(texture(tIrr, eq(n))) * base * (1.0 - metal)`. Then ACES + gamma. The mip-as-roughness trick is approximate (a faint seam can show at the equirect wrap on very rough surfaces); it's the right cost/quality point for these sites.
3. **glTF in ogl**: `GLTFLoader.load(gl, url)` gives meshes with a placeholder `NormalProgram` and the material at `mesh.program.gltfMaterial` (`baseColorTexture.texture`, `metallicRoughnessTexture.texture` (G = roughness, B = metal), `normalTexture.texture`). Traverse the scene and replace each `program` with your own PBR program using those textures.
4. **Normal maps without tangents**: Poly Haven's glTFs ship `POSITION`, `NORMAL`, `TEXCOORD_0` only, so build the TBN from screen derivatives (`dFdx/dFdy` of position and uv), as the example does.
5. **Backdrop**: draw a full-screen triangle first, reconstructing the view ray from the inverse view-projection and sampling `<id>-bg.webp` with `eq()`; dim it so the model stays the subject.

Pair with this repo's rules: reduced motion and no-JS still need a still frame (render one from the scene and screenshot it), `ogl` RenderTargets need `stencil: true` for 24-bit depth on big scenes, and judge the result by screenshot, not by "it rendered".
