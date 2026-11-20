// Runs axe-core (WCAG 2.2 A/AA rules) on each URL in a real Chromium and prints
// violations grouped by rule. Exit 1 if any page has a serious or critical one.
// Usage: node axe.mjs [--all] <url> [url...]   (--all also fails on minor/moderate)
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const home = process.env.SITE_CHECK_HOME ?? path.join(os.homedir(), ".cache", "site-check");
const axeSrc = fs.readFileSync(path.join(home, "node_modules", "axe-core", "axe.min.js"), "utf8");
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const args = process.argv.slice(2);
const strict = args.includes("--all");
const urls = args.filter((a) => !a.startsWith("--"));
if (!urls.length) { console.error("usage: node axe.mjs [--all] <url...>"); process.exit(2); }

const exe = fs.existsSync("/opt/pw-browsers/chromium") ? { executablePath: "/opt/pw-browsers/chromium" } : {};
const browser = await chromium.launch({ ...exe, args: ["--no-sandbox"] });
let bad = 0;
for (const url of urls) {
  for (const width of [375, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(url, { waitUntil: "networkidle", timeout: 90000 }).catch(() => {});
    await page.addScriptTag({ content: axeSrc });
    const res = await page.evaluate(async () =>
      // eslint-disable-next-line no-undef
      axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } }),
    );
    const hits = res.violations.filter((v) => strict || v.impact === "serious" || v.impact === "critical");
    console.log(`${hits.length ? "FAIL" : "ok  "} ${width}px ${url}  (${res.violations.length} rules violated, ${res.passes.length} passed)`);
    for (const v of res.violations) {
      console.log(`   [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`);
      for (const n of v.nodes.slice(0, 3)) console.log(`      ${n.target.join(" ")}`);
    }
    if (hits.length) bad++;
    await page.close();
  }
}
await browser.close();
console.log(bad ? `AXE-FAIL ${bad}` : "AXE-OK");
process.exit(bad ? 1 : 0);
