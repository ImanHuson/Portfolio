// Median of the Lighthouse runs in raw/*.json.gz -> summary.json + a markdown table on stdout.
// Usage: node summarize.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";

const dir = new URL("./raw/", import.meta.url);
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const pages = {};

for (const f of readdirSync(dir).filter((f) => f.endsWith(".json.gz")).sort()) {
  const name = f.replace(/-\d+\.json\.gz$/, "");
  const lr = JSON.parse(gunzipSync(readFileSync(new URL(f, dir))));
  if (lr.runtimeError) { console.error(f, "runtimeError", lr.runtimeError.code); continue; }
  const c = lr.categories, a = lr.audits;
  const run = {
    performance: c.performance.score * 100,
    accessibility: c.accessibility.score * 100,
    bestPractices: c["best-practices"].score * 100,
    seo: c.seo.score * 100,
    lcpMs: a["largest-contentful-paint"].numericValue,
    fcpMs: a["first-contentful-paint"].numericValue,
    cls: a["cumulative-layout-shift"].numericValue,
    tbtMs: a["total-blocking-time"].numericValue,
    bytes: a["total-byte-weight"].numericValue,
    requests: a["network-requests"].details?.items?.length ?? null,
  };
  (pages[name] ??= { url: lr.finalDisplayedUrl || lr.finalUrl, lighthouse: lr.lighthouseVersion, runs: [] }).runs.push(run);
}

const keys = ["performance", "accessibility", "bestPractices", "seo", "lcpMs", "fcpMs", "cls", "tbtMs", "bytes", "requests"];
for (const p of Object.values(pages)) {
  p.median = Object.fromEntries(keys.map((k) => [k, median(p.runs.map((r) => r[k]))]));
  p.n = p.runs.length;
}
writeFileSync(new URL("./summary.json", import.meta.url), JSON.stringify(pages, null, 2));

const fmt = (m) => [Math.round(m.performance), Math.round(m.accessibility), Math.round(m.bestPractices), Math.round(m.seo),
  (m.lcpMs / 1000).toFixed(1) + " s", m.cls.toFixed(3), Math.round(m.tbtMs) + " ms", (m.bytes / 1024 / 1024).toFixed(2) + " MB", m.requests];
console.log("| Page | Runs | Perf | A11y | Best pr. | SEO | LCP | CLS | TBT | Weight | Requests |");
console.log("|---|---|---|---|---|---|---|---|---|---|---|");
for (const [name, p] of Object.entries(pages)) console.log(`| ${name} | ${p.n} | ${fmt(p.median).join(" | ")} |`);
console.log("SUMMARY_WRITTEN", Object.keys(pages).length, "pages", Object.values(pages).reduce((s, p) => s + p.n, 0), "runs");
