// Static checks on tsu-concept/dist. Usage: node qa/check.mjs <pages|rules|gov|copy|data|all>
// Prints "<PART> OK" only when every assertion passes; exits 1 on the first failure.
import { readFileSync, existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");
const fail = (m) => { console.error("FAIL:", m); process.exit(1); };
const need = (c, m) => { if (!c) fail(m); };
const PAGES = ["", "calendar/", "announcements/", "admissions/", "admissions/freshmen/", "colleges/computer-studies/", "case-study/"];
const html = (p) => read(`dist/${p}index.html`);
// visible text: drop tags, scripts, styles, and attribute values
const text = (h) => h.replace(/<(script|style)[\s\S]*?<\/\1>/g, "").replace(/<[^>]+>/g, " ");

const parts = {
  pages() {
    for (const p of PAGES) need(existsSync(new URL(`dist/${p}index.html`, root)), `missing dist/${p}index.html`);
    need(existsSync(new URL("dist/calendar/events.json", root)), "missing events.json");
  },
  rules() {
    for (const p of PAGES) {
      const h = html(p);
      need(h.includes("Unofficial design concept") && h.includes("Not affiliated with or endorsed by Tarlac State University"), `${p}: banner`);
      need(/<meta name="robots" content="noindex/.test(h), `${p}: noindex`);
      need(/<html lang="en">/.test(h), `${p}: lang`);
      need((h.match(/<h1[\s>]/g) || []).length === 1, `${p}: h1 count`);
      need(/class="skip-link" href="#main"/.test(h) && /id="main"/.test(h), `${p}: skip link`);
      const vp = h.match(/<meta name="viewport" content="([^"]+)"/)?.[1] || "";
      need(vp && !/user-scalable=no|maximum-scale=1(\.0)?\b/.test(vp), `${p}: viewport blocks zoom (${vp})`);
      need(!/<img[^>]+(logo|seal)/i.test(h), `${p}: logo/seal image`);
      need(!/type="password"|autocomplete="cc-|<form[^>]+action=/i.test(h), `${p}: password/payment input or posting form`);
      need(!/<iframe|youtube\.com|googletagmanager|doubleclick/i.test(h), `${p}: third-party embed or tracker`);
    }
  },
  gov() {
    const labels = ["GOV.PH", "Transparency Seal", "Citizen's Charter", "Freedom of Information", "Data Privacy Notice", "Bid notices"];
    for (const p of PAGES) {
      const foot = html(p).split('<footer class="site-footer">')[1] || "";
      for (const l of labels) need(foot.includes(l) || foot.includes(l.replace("'", "\u2019")), `${p}: footer lacks ${l}`);
      if (p && p !== "case-study/") need(/Source: <a href="https:\/\/www\.tsu\.edu\.ph/.test(html(p)) || /Source: <a href="https:\/\/www.tsu.edu.ph/.test(html(p)), `${p}: no tsu.edu.ph source line`);
    }
  },
  copy() {
    const left = ["Banting", "Samson", "Dela Cruz", "Mendoza", "Agrupis", "Villanueva", "Jasper"];
    for (const p of PAGES) {
      const t = text(html(p));
      need(!/[—–]/.test(t), `${p}: em or en dash in visible text: ${(t.match(/.{30}[—–].{30}/) || [""])[0]}`);
      for (const n of left) need(!t.includes(n), `${p}: contains left-out name ${n}`);
    }
    // negative control: the checker must catch a dash and a name in a known-bad string
    need(/[—–]/.test("a — b") && "Hon. Banting".includes("Banting"), "control failed");
  },
  data() {
    const cal = JSON.parse(read("content/calendar.json"));
    const n = Object.fromEntries(cal.terms.map((t) => [t.id, t.events.length]));
    need(n.first === 23 && n.second === 20 && n.midyear === 19, `calendar counts ${JSON.stringify(n)} (cards: 23, 20, 19)`);
    for (const t of cal.terms) for (const e of t.events) need(!e.end || e.end >= e.start, `bad range ${e.start}..${e.end}`);
    const a = JSON.parse(read("content/announcements.json"));
    need(a.items.length === 54 && a.items.filter((i) => i.kind === "class").length === 14 && a.leftOut === 7, "announcement counts");
    const cnt = (html("announcements/").match(/<li class="ann"/g) || []).length;
    need(cnt === 54, `announcements page renders ${cnt}`);
  },
};

const want = process.argv[2];
const run = want === "all" ? Object.keys(parts) : [want];
for (const k of run) { need(parts[k], `unknown part ${k}`); parts[k](); console.log(`${k.toUpperCase()} OK`); }
