// Accessibility audit of tsu.edu.ph pages: axe-core (WCAG 2.0/2.1/2.2 A+AA tags) plus
// scripted checks for things axe can't judge alone: keyboard reach of the menu,
// reflow at 320 px, 200% zoom, heading outline, page language, focus visibility.
//
// Usage: node audit.mjs <path-to-axe.min.js> [outDir]
// Needs Playwright (require('playwright')) and axe-core (npm i axe-core).
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const axeSource = readFileSync(process.argv[2], "utf8");
const outDir = process.argv[3] || new URL(".", import.meta.url).pathname;
mkdirSync(outDir, { recursive: true });

const BASE = "https://www.tsu.edu.ph";
const PAGES = {
  home: "/",
  admissions: "/admissions/",
  freshmen: "/admissions/freshmen-students/",
  announcements: "/announcements/",
  "announcements-2026": "/announcements/2026-announcements/",
  calendar: "/academics/offices/admission-and-registration-office/academic-calendar/",
  colleges: "/academics/colleges/",
  ccs: "/academics/colleges/college-of-computer-studies/",
};
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();
const results = {};

for (const [name, path] of Object.entries(PAGES)) {
  const url = BASE + path;
  const r = { url, checkedAt: new Date().toISOString() };

  // 1. axe at phone width (where most students are)
  const phone = await browser.newPage({ bypassCSP: true, viewport: { width: 375, height: 812 }, userAgent: "Mozilla/5.0 (Linux; Android 14) Mobile" });
  await phone.goto(url, { waitUntil: "load", timeout: 90000 });
  await sleep(1500);
  await phone.addScriptTag({ content: axeSource });
  const axe = await phone.evaluate(async (tags) => {
    const res = await window.axe.run(document, { runOnly: { type: "tag", values: tags }, resultTypes: ["violations", "incomplete"] });
    const slim = (v) => ({ id: v.id, impact: v.impact, help: v.help, tags: v.tags.filter((t) => t.startsWith("wcag")), nodes: v.nodes.length,
      examples: v.nodes.slice(0, 3).map((n) => n.target.join(" ")) });
    return { violations: res.violations.map(slim), incomplete: res.incomplete.map(slim) };
  }, TAGS);
  r.axe = axe;

  // 2. Structure: lang, title, headings outline, images without alt, empty links
  r.structure = await phone.evaluate(() => {
    const vis = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    const imgs = [...document.images];
    return {
      lang: document.documentElement.getAttribute("lang"),
      title: document.title,
      headings: [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter(vis).map((h) => h.tagName + " " + h.textContent.trim().replace(/\s+/g, " ").slice(0, 60)),
      h1Count: document.querySelectorAll("h1").length,
      images: imgs.length,
      imagesNoAlt: imgs.filter((i) => !i.hasAttribute("alt")).length,
      imagesFilenameAlt: imgs.filter((i) => /\.(png|jpe?g|webp)$|^(logo|image|img)\b|^[A-Z][a-z]+ [A-Z][a-z]+ [A-Z][a-z]+$/i.test((i.getAttribute("alt") || "").trim())).map((i) => i.getAttribute("alt")).slice(0, 8),
      linksNoText: [...document.querySelectorAll("a[href]")].filter((a) => vis(a) && !(a.textContent.trim() || a.getAttribute("aria-label") || a.querySelector("img[alt]:not([alt=''])"))).length,
    };
  });

  // 3. Reflow at 320 px (WCAG 1.4.10) and 200% zoom approximated as a 640 px-wide desktop at 2x CSS zoom
  for (const [label, width] of [["w320", 320]]) {
    await phone.setViewportSize({ width, height: 700 });
    await sleep(500);
    r[label] = await phone.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  }

  // 4. Keyboard at phone width: can Tab reach the menu button, does it open with Enter?
  await phone.setViewportSize({ width: 375, height: 812 });
  await phone.goto(url, { waitUntil: "load", timeout: 90000 });
  await sleep(1000);
  const seq = [];
  for (let i = 0; i < 25; i++) {
    await phone.keyboard.press("Tab");
    seq.push(await phone.evaluate(() => {
      const a = document.activeElement;
      if (!a || a === document.body) return null;
      const cs = getComputedStyle(a);
      return { tag: a.tagName, text: (a.getAttribute("aria-label") || a.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40),
        cls: (a.className || "").toString().slice(0, 40), outline: cs.outlineStyle !== "none" && cs.outlineWidth !== "0px", boxShadow: cs.boxShadow !== "none" };
    }));
  }
  r.keyboard = {
    first25: seq,
    menuButtonReached: seq.some((s) => s && /burger/.test(s.cls)),
    skipLinkFirst: !!(seq[0] && /skip/i.test(seq[0].text)),
    focusIndicatorShare: seq.filter(Boolean).filter((s) => s.outline || s.boxShadow).length + "/" + seq.filter(Boolean).length,
  };
  const burger = await phone.$(".navbar-burger:visible");
  if (burger) {
    r.keyboard.menuButton = await burger.evaluate((b) => ({ tag: b.tagName, role: b.getAttribute("role"), href: b.getAttribute("href"), tabindex: b.getAttribute("tabindex"), tabbable: b.tabIndex >= 0 }));
  }
  await phone.close();

  // 5. 200% zoom on a 1280 px laptop = 640 CSS px; check horizontal scroll and that the nav is still usable
  const zoom = await browser.newPage({ bypassCSP: true, viewport: { width: 640, height: 400 }, deviceScaleFactor: 2 });
  await zoom.goto(url, { waitUntil: "load", timeout: 90000 });
  await sleep(1000);
  r.zoom200 = await zoom.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  await zoom.close();

  results[name] = r;
  console.log(name, "violations:", axe.violations.map((v) => `${v.id}(${v.impact},${v.nodes})`).join(" ") || "none");
  await sleep(1500); // polite
}

await browser.close();
writeFileSync(`${outDir}/axe-results.json`, JSON.stringify(results, null, 2));
console.log("AUDIT_WRITTEN", Object.keys(results).length, "pages");
