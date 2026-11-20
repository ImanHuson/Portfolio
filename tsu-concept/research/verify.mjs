// Checks that each research-phase deliverable exists and is complete.
// Usage: node tsu-concept/research/verify.mjs <baseline|a11y|ia|tasktest|constraints|readme>
// Prints "<NAME> OK" only when every assertion for that part passes; exits 1 otherwise.
import { existsSync, readFileSync, readdirSync } from "node:fs";

const here = (p) => new URL(p, import.meta.url);
const fail = (m) => { console.error("FAIL:", m); process.exit(1); };
const need = (cond, m) => { if (!cond) fail(m); };
const read = (p) => { need(existsSync(here(p)), `missing ${p}`); return readFileSync(here(p), "utf8"); };
const PAGES = ["home", "admissions", "announcements", "calendar", "colleges"];

const checks = {
  baseline() {
    const raw = readdirSync(here("baseline/raw/")).filter((f) => f.endsWith(".json.gz"));
    for (const p of PAGES) need(raw.filter((f) => f.startsWith(p + "-")).length === 5, `${p}: need 5 gz runs`);
    const s = JSON.parse(read("baseline/summary.json"));
    for (const p of PAGES) {
      need(s[p]?.n === 5, `${p}: summary n != 5`);
      for (const k of ["performance", "accessibility", "seo", "lcpMs", "cls", "bytes", "requests"]) need(Number.isFinite(s[p].median[k]), `${p}.${k} not numeric`);
    }
    // every median quoted in the README table must equal summary.json
    const md = read("README.md");
    for (const p of PAGES) {
      const m = s[p].median;
      const row = md.split("\n").find((l) => l.startsWith(`| ${p} |`));
      need(row, `README has no row for ${p}`);
      for (const v of [Math.round(m.performance), Math.round(m.accessibility), (m.lcpMs / 1000).toFixed(1) + " s", (m.bytes / 1024 / 1024).toFixed(2) + " MB"])
        need(row.includes(String(v)), `README row ${p} missing ${v}`);
    }
  },
  a11y() {
    const r = JSON.parse(read("a11y/axe-results.json"));
    for (const p of ["home", "admissions", "freshmen", "announcements", "announcements-2026", "calendar", "colleges", "ccs"]) {
      need(r[p]?.axe && Array.isArray(r[p].axe.violations), `${p}: no axe result`);
      need(r[p].structure && r[p].keyboard && r[p].w320 && r[p].zoom200, `${p}: scripted checks missing`);
    }
    const md = read("a11y/README.md");
    for (const h of ["Keyboard", "Headings", "Images", "Contrast", "320", "200%", "Language"]) need(md.includes(h), `a11y README lacks section ${h}`);
  },
  ia() {
    const j = JSON.parse(read("ia/ia.json"));
    need(j.length === 2 && j[1].items.length >= 7, "nav tree incomplete");
    const md = read("ia/README.md");
    for (const t of ["Academic Calendar", "Announcements", "Student Portal", "Freshmen"]) need(md.includes(t), `IA README lacks ${t}`);
  },
  tasktest() {
    const md = read("task-test/README.md");
    for (const t of ["T1", "T2", "T3", "T4", "T5"]) need(md.includes(t), `task-test lacks ${t}`);
    need(/never a name/.test(md) && /Is that OK\?/.test(md), "consent or anonymity wording missing");
    need(read("task-test/results.csv").startsWith("participant,round,task,order,seconds,taps,result,notes"), "results.csv header wrong");
  },
  constraints() {
    const md = read("constraints.md");
    for (const t of ["Transparency Seal", "Citizen's Charter", "FOI", "Data Privacy", "Philippine Standard Time", "WCAG 2.2 AA", "RA 8293", "RA 10173", "login", "noindex"]) need(md.includes(t), `constraints lacks ${t}`);
  },
  readme() {
    const md = read("README.md");
    for (const t of ["Baseline", "Accessibility", "Navigation", "Task test", "Constraints", "What this changes in the brief"]) need(md.includes(t), `README lacks ${t}`);
  },
};

const which = process.argv[2];
need(checks[which], `unknown part ${which}`);
checks[which]();
console.log(`${which.toUpperCase()} OK`);
