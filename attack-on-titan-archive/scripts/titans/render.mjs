// Renders each Titan's 24-frame turntable from render.html in headless
// Chromium and writes PNG frames to a work dir; sprite.py assembles them.
//   node scripts/titans/render.mjs <url-of-render.html> <outdir> [forms...] [--preview]
import { chromium } from "playwright";
import fs from "node:fs";
const [url, out, ...rest] = process.argv.slice(2);
const preview = rest.includes("--preview");
const forms = rest.filter((r) => !r.startsWith("--")).map(Number);
const list = forms.length ? forms : [0, 1, 2, 3, 4, 5, 6, 7, 8];
const FRAMES = preview ? 4 : 24;
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await b.newPage();
page.on("pageerror", (e) => console.error("PAGEERROR", e.message));
await page.goto(url);
await page.waitForFunction(() => window.ready === true);
for (const f of list) {
  for (let i = 0; i < FRAMES; i++) {
    const a = (i / FRAMES) * Math.PI * 2;
    const data = await page.evaluate(([f, a]) => window.frame(f, a, 600, 1200), [f, a]);
    fs.writeFileSync(`${out}/t${f}_${String(i).padStart(2, "0")}.png`, Buffer.from(data.split(",")[1], "base64"));
  }
  console.log("form", f, "done");
}
await b.close();
