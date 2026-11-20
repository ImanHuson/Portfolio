// Browser checks on the built concept. Needs a server on BASE (default http://localhost:8790/)
// serving dist/, Playwright, and axe-core (AXE=path/to/axe.min.js).
// Usage: AXE=... node qa/a11y.mjs   -> prints "A11Y OK" only if everything passes.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const BASE = process.env.BASE || "http://localhost:8790/";
const axe = readFileSync(process.env.AXE, "utf8");
const PAGES = ["", "calendar/", "announcements/", "admissions/", "admissions/freshmen/", "colleges/computer-studies/", "case-study/"];
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const problems = [];
const b = await chromium.launch();

for (const scheme of ["light", "dark"]) {
  const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, colorScheme: scheme });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => problems.push(`script error: ${e}`));
  for (const pg of PAGES) {
    await p.goto(BASE + pg, { waitUntil: "networkidle" });
    await p.addScriptTag({ content: axe });
    const v = await p.evaluate(async (tags) => (await window.axe.run(document, { runOnly: { type: "tag", values: tags } })).violations
      .map((x) => `${x.id} (${x.nodes.length}): ${x.nodes[0].target.join(" ")}`), TAGS);
    v.forEach((x) => problems.push(`${scheme} /${pg} axe ${x}`));
    for (const [w, label] of [[320, "320px"]]) {
      await p.setViewportSize({ width: w, height: 700 });
      const o = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (o > 0) problems.push(`/${pg} overflows ${o}px at ${label}`);
      await p.setViewportSize({ width: 375, height: 812 });
    }
  }
  await ctx.close();
}

// 200% zoom on a 1280 px screen = 640 CSS px
{
  const ctx = await b.newContext({ viewport: { width: 640, height: 400 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  for (const pg of PAGES) {
    await p.goto(BASE + pg, { waitUntil: "networkidle" });
    const o = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (o > 0) problems.push(`/${pg} overflows ${o}px at 200% zoom`);
  }
  await ctx.close();
}

// Keyboard: Tab reaches the menu button within a few presses, Enter opens it, Escape closes it
{
  const ctx = await b.newContext({ viewport: { width: 375, height: 812 } });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: "networkidle" });
  let n = 0;
  for (; n < 12; n++) { await p.keyboard.press("Tab"); if (await p.evaluate(() => document.activeElement?.classList.contains("menu-toggle"))) break; }
  if (n === 12) problems.push("menu button not reachable by Tab in 12 presses");
  await p.keyboard.press("Enter");
  const open = await p.evaluate(() => getComputedStyle(document.getElementById("site-nav")).display !== "none" && document.querySelector(".menu-toggle").getAttribute("aria-expanded") === "true");
  if (!open) problems.push("Enter on menu button did not open the menu");
  await p.keyboard.press("Escape");
  const closed = await p.evaluate(() => getComputedStyle(document.getElementById("site-nav")).display === "none" && document.activeElement?.classList.contains("menu-toggle"));
  if (!closed) problems.push("Escape did not close the menu and return focus");
  const firstTab = await (async () => { await p.goto(BASE); await p.keyboard.press("Tab"); return p.evaluate(() => document.activeElement?.className); })();
  if (firstTab !== "skip-link") problems.push(`first Tab lands on ${firstTab}, not the skip link`);
  await ctx.close();
}

// JS off: menu visible, filter works through CSS :has()
{
  const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(BASE + "announcements/");
  const navShown = await p.evaluate(() => getComputedStyle(document.getElementById("site-nav")).display !== "none");
  if (!navShown) problems.push("no-JS: nav hidden");
  const visible = () => p.evaluate(() => [...document.querySelectorAll(".ann")].filter((e) => e.offsetParent !== null).length);
  const all = await visible();
  await p.check("#f-class");
  const cls = await visible();
  await p.check("#f-admission");
  const adm = await visible();
  if (!(all === 54 && cls === 14 && adm === 7)) problems.push(`no-JS filter counts all=${all} class=${cls} admission=${adm} (want 54/14/7)`);
  await ctx.close();
}

// ?type=class preselects with JS
{
  const p = await b.newPage();
  await p.goto(BASE + "announcements/?type=class", { waitUntil: "networkidle" });
  const t = await p.textContent("[data-count]");
  if (!/Showing 14 /.test(t)) problems.push(`?type=class shows "${t}"`);
  await p.close();
}

await b.close();
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
console.log("A11Y OK");
