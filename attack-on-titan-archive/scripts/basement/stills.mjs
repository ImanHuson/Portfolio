// Renders the Basement's stills (the header and the no-JS / reduced-motion
// contact sheet) straight from the live scene's shader and camera path.
//   1. node scripts/basement/stills.mjs gen          (transpiles the scene to gen/)
//   2. serve the project, e.g. python3 -m http.server 8765 from attack-on-titan-archive/
//   3. node scripts/basement/stills.mjs render http://localhost:8765/scripts/basement/harness.html
// Step 3 needs playwright; run it from a directory where it is installed.
// Writes public/images/basement/descent-1..5.webp (via Pillow).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const [cmd, url] = process.argv.slice(2);
// progress points: the hatch, the door, the key in the lock, the desk, the books
const FRAMES = [0.1, 0.38, 0.51, 0.76, 0.91];

if (cmd === "gen") {
  const ts = createRequire(import.meta.url)(path.join(root, "node_modules/typescript"));
  fs.mkdirSync(path.join(here, "gen"), { recursive: true });
  for (const f of ["cellarPath", "cellarShader"]) {
    const src = fs.readFileSync(path.join(root, `components/three/basement/${f}.ts`), "utf8");
    const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
    fs.writeFileSync(path.join(here, "gen", `${f}.js`), out);
  }
} else if (cmd === "render") {
  // resolved from the working directory, so the project needs no playwright dependency
  const { chromium } = createRequire(path.join(process.cwd(), "noop.js"))("playwright");
  const b = await chromium.launch({
    executablePath: process.env.CHROME || "/opt/pw-browsers/chromium",
    args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
  const p = await b.newPage();
  await p.goto(url);
  await p.waitForFunction(() => window.ready === true, null, { timeout: 60000 });
  const dir = path.join(root, "public/images/basement");
  fs.mkdirSync(dir, { recursive: true });
  for (const [i, v] of FRAMES.entries()) {
    const data = await p.evaluate((v) => window.frame(v, 1280, 800), v);
    const png = path.join(here, "gen", `descent-${i + 1}.png`);
    fs.writeFileSync(png, Buffer.from(data.split(",")[1], "base64"));
    execFileSync("python3", ["-c", `from PIL import Image; Image.open(${JSON.stringify(png)}).convert("RGB").save(${JSON.stringify(path.join(dir, `descent-${i + 1}.webp`))}, quality=80, method=6)`]);
    console.log("frame", i + 1, "at", v);
  }
  await b.close();
} else {
  console.log("usage: stills.mjs gen | render <harness-url>");
}
