// Lighthouse 12 mobile, 5 runs per page, same settings as research/baseline/run.sh.
// Usage: BASE=http://localhost:8790/ OUT=research/after-local node qa/lh-check.mjs
// Writes OUT/raw/*.json.gz (screenshots stripped) and OUT/summary.json; prints "LIGHTHOUSE OK" only if
// every page's median is >= 95 in performance, accessibility, best practices and SEO (SEO without the
// deliberate noindex audit, which must keep failing), LCP < 2.5 s, CLS < 0.1, and home < 500 KB.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { gzipSync, gunzipSync } from "node:zlib";

const BASE = process.env.BASE || "http://localhost:8790/";
const OUT = new URL(`../${process.env.OUT || "research/after-local"}/`, import.meta.url);
const RUNS = Number(process.env.RUNS || 5);
const PAGES = { home: "", admissions: "admissions/", announcements: "announcements/", calendar: "calendar/" };
const chrome = execFileSync("bash", ["-c", "ls -d /opt/pw-browsers/chromium*/chrome-linux*/chrome | head -1"]).toString().trim();
mkdirSync(new URL("raw/", OUT), { recursive: true });

for (const [name, path] of Object.entries(PAGES)) for (let i = 1; i <= RUNS; i++) {
  const f = new URL(`raw/${name}-${i}.json.gz`, OUT);
  if (existsSync(f)) continue;
  const tmp = `/tmp/lh-${process.pid}.json`;
  execFileSync("npx", ["-y", "lighthouse@12", BASE + path, "--quiet", "--form-factor=mobile",
    "--chrome-flags=--headless=new --no-sandbox", "--output=json", `--output-path=${tmp}`], { env: { ...process.env, CHROME_PATH: chrome }, stdio: "ignore", timeout: 240000 });
  const lr = JSON.parse(readFileSync(tmp, "utf8"));
  for (const k of ["final-screenshot", "screenshot-thumbnails", "full-page-screenshot"]) delete lr.audits?.[k];
  delete lr.fullPageScreenshot;
  writeFileSync(f, gzipSync(JSON.stringify(lr), { level: 9 }));
  console.error(`${name} run ${i} done`);
}

const median = (xs) => { const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const out = { _base: BASE, _measured: new Date().toISOString().slice(0, 10) };
const bad = [];
for (const name of Object.keys(PAGES)) {
  const runs = readdirSync(new URL("raw/", OUT)).filter((f) => f.startsWith(name + "-")).map((f) => {
    const lr = JSON.parse(gunzipSync(readFileSync(new URL(`raw/${f}`, OUT))));
    const c = lr.categories, a = lr.audits;
    // SEO without "is-crawlable": the concept is noindex on purpose (it must never be mistaken for the real site)
    const w = c.seo.auditRefs.filter((r) => r.weight > 0 && r.id !== "is-crawlable");
    const seoNoIdx = 100 * w.reduce((s, r) => s + r.weight * (a[r.id].score ?? 1), 0) / w.reduce((s, r) => s + r.weight, 0);
    return { seoExclNoindex: seoNoIdx, noindexHeld: a["is-crawlable"].score === 0 ? 1 : 0, performance: c.performance.score * 100, accessibility: c.accessibility.score * 100, bestPractices: c["best-practices"].score * 100, seo: c.seo.score * 100,
      lcpMs: a["largest-contentful-paint"].numericValue, cls: a["cumulative-layout-shift"].numericValue, tbtMs: a["total-blocking-time"].numericValue,
      bytes: a["total-byte-weight"].numericValue, requests: a["network-requests"].details?.items?.length ?? null };
  });
  const m = Object.fromEntries(Object.keys(runs[0]).map((k) => [k, median(runs.map((r) => r[k]))]));
  out[name] = { n: runs.length, median: m, runs };
  if (m.noindexHeld !== 1) bad.push(`${name} is indexable: noindex missing`);
  for (const k of ["performance", "accessibility", "bestPractices", "seoExclNoindex"]) if (m[k] < 95) bad.push(`${name} ${k} ${m[k]}`);
  if (m.lcpMs >= 2500) bad.push(`${name} LCP ${m.lcpMs}`);
  if (m.cls >= 0.1) bad.push(`${name} CLS ${m.cls}`);
  console.log(`${name}: perf ${m.performance} a11y ${m.accessibility} bp ${m.bestPractices} seo ${m.seo} (${m.seoExclNoindex.toFixed(0)} without the noindex audit) LCP ${(m.lcpMs / 1000).toFixed(2)}s CLS ${m.cls.toFixed(3)} ${(m.bytes / 1024).toFixed(0)}KB ${m.requests} req`);
}
if (out.home.median.bytes >= 500 * 1024) bad.push(`home ${out.home.median.bytes} bytes`);
writeFileSync(new URL("summary.json", OUT), JSON.stringify(out, null, 2));
if (bad.length) { console.error("FAIL:", bad.join("; ")); process.exit(1); }
console.log("LIGHTHOUSE OK");
