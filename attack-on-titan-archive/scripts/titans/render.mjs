// Renders each Titan's front view and x-ray plate from render.html in
// headless Chromium, as PNGs in a work dir; sprite.py then turns them into
// the scale-strip silhouette and the x-ray. (The 3D models themselves are no
// longer shown: the Titans are specimen plates, scripts/titans/plates.py.)
//   node render.mjs <url-of-render.html> <outdir> [forms...]
// Run it from a directory where `playwright` is installed, with the project
// served over HTTP so render.html loads.
import { chromium } from "playwright";
import fs from "node:fs";
const [url, out, ...rest] = process.argv.slice(2);
const forms = rest.filter((r) => !r.startsWith("--")).map(Number);
const list = forms.length ? forms : [0, 1, 2, 3, 4, 5, 6, 7, 8];
const FRAMES = 1; // front view only
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await b.newPage();
page.on("pageerror", (e) => console.error("PAGEERROR", e.message));
await page.goto(url);
await page.waitForFunction(() => window.ready === true, null, { timeout: 120000 });
const save = (name, data) => fs.writeFileSync(`${out}/${name}.png`, Buffer.from(data.split(",")[1], "base64"));
for (const f of list) {
  for (let i = 0; i < FRAMES; i++) {
    const a = (i / FRAMES) * Math.PI * 2;
    save(`t${f}_${String(i).padStart(2, "0")}`, await page.evaluate(([f, a]) => window.frame(f, a, 425, 850, 0), [f, a]));
  }
  save(`x${f}`, await page.evaluate((f) => window.frame(f, 0, 600, 1200, 1), f));
  console.log("form", f, "done");
}
await b.close();
