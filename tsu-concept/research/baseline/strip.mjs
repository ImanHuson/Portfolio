// Remove page screenshots from the saved Lighthouse JSON before committing:
// they show TSU's photos (people's faces) and add most of the file size.
// Usage: node strip.mjs   (rewrites raw/*.json.gz in place; idempotent)
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { gunzipSync, gzipSync } from "node:zlib";

const dir = new URL("./raw/", import.meta.url);
const DROP = ["final-screenshot", "screenshot-thumbnails", "full-page-screenshot"];
let n = 0;
for (const f of readdirSync(dir).filter((f) => f.endsWith(".json.gz"))) {
  const lr = JSON.parse(gunzipSync(readFileSync(new URL(f, dir))));
  for (const k of DROP) delete lr.audits?.[k];
  delete lr.fullPageScreenshot;
  // element screenshots referenced from audit details
  JSON.stringify(lr, (key, v) => (v && typeof v === "object" && "screenshot" in v ? (delete v.screenshot, v) : v));
  writeFileSync(new URL(f, dir), gzipSync(JSON.stringify(lr), { level: 9 }));
  n++;
}
console.log("STRIPPED", n);
