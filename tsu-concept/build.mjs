// Builds the TSU concept from content/*.json into dist/. Plain Node, no dependencies.
// Usage: node build.mjs   (BUILD_DATE=YYYY-MM-DD overrides "today" for the date-dependent parts)
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from "node:fs";

const here = (p) => new URL(p, import.meta.url);
const json = (p) => JSON.parse(readFileSync(here(p), "utf8"));
const site = json("content/site.json");
const ann = json("content/announcements.json");
const cal = json("content/calendar.json");
const adm = json("content/admissions.json");
const ccs = json("content/ccs.json");
const base = json("research/baseline/summary.json");
const after = existsSync(here("research/after/summary.json")) ? json("research/after/summary.json") : null;

const manila = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit" });
const TODAY = process.env.BUILD_DATE || manila.format(new Date());

const clip = (t) => esc(String(t).replace(/[\s.,;:]+$/, "")) + "…";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const ymd = (iso) => iso.split("-").map(Number);
const fmtDate = (iso) => { const [y, m, d] = ymd(iso); return `${MONTHS[m - 1]} ${d}, ${y}`; };
const fmtRange = (s, e, short = false) => {
  const M = (m) => (short ? MONTHS[m - 1].slice(0, 3) : MONTHS[m - 1]);
  const [y1, m1, d1] = ymd(s);
  if (!e || e === s) return `${M(m1)} ${d1}, ${y1}`;
  const [y2, m2, d2] = ymd(e);
  if (y1 === y2 && m1 === m2) return `${M(m1)} ${d1} to ${d2}, ${y1}`;
  if (y1 === y2) return `${M(m1)} ${d1} to ${M(m2)} ${d2}, ${y1}`;
  return `${M(m1)} ${d1}, ${y1} to ${M(m2)} ${d2}, ${y2}`;
};
const monthKey = (iso) => { const [y, m] = ymd(iso); return `${MONTHS[m - 1]} ${y}`; };

const icon = (name, label) => {
  const svg = readFileSync(here(`src/icons/${name}.svg`), "utf8").trim();
  return svg.replace("<svg ", `<svg class="icon" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true" focusable="false"'} `);
};
const ext = (href, text, cls = "") =>
  `<a href="${esc(href)}"${cls ? ` class="${cls}"` : ""}>${text}<span class="visually-hidden"> (on ${esc(new URL(href).host)})</span></a>`;
const source = (href, label = "tsu.edu.ph") => `<p class="meta">Source: <a href="${esc(href)}">${esc(label)}</a>, read ${esc(site.fetched)}.</p>`;

const KIND_LABEL = { class: "Class schedule change", admission: "Admissions, enrollment and scholarships", general: "Other news" };

// ---------- layout ----------
function page({ path, title, desc, nav, body }) {
  const depth = path.split("/").filter(Boolean).length;
  const r = "../".repeat(depth);
  const navItems = site.nav.map((n) => `<li><a href="${r}${n.href}"${nav === n.href ? ' aria-current="page"' : ""}>${esc(n.label)}</a></li>`).join("");
  const gov = site.government.map((g) => `<li><a href="${esc(g.href)}">${esc(g.label)}</a></li>`).join("");
  const hours = site.contact.hours.map(([d, h]) => `<dt>${esc(d)}</dt><dd>${esc(h)}</dd>`).join("");
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(title)} | TSU website concept (unofficial)</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#18181b" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0c0c0e" media="(prefers-color-scheme: dark)">
<link rel="preload" href="${r}fonts/public-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${r}styles.css">
<link rel="icon" href="${r}favicon.svg" type="image/svg+xml">
<script src="${r}app.js" defer></script>
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
<div class="concept" role="note"><div class="wrap"><p><strong>Unofficial design concept</strong> by ${esc(site.author)}. Not affiliated with or endorsed by Tarlac State University. <a href="${r}case-study/">Read the case study</a> or go to the <a href="${esc(site.realSite)}">official site</a>.</p></div></div>
<div class="gov"><div class="wrap"><a href="https://www.gov.ph" translate="no">GOV.PH</a><span class="pst" data-pst hidden></span></div></div>
<header class="site-header">
  <div class="wrap">
    <a class="wordmark" href="${r}" translate="no">${esc(site.name)}</a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">${icon("list")}<span data-label>Menu</span></button>
    <nav class="nav" id="site-nav" aria-label="Main"><ul>${navItems}</ul></nav>
  </div>
</header>
<main id="main" tabindex="-1">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <section aria-labelledby="f-gov"><h2 id="f-gov">Government links</h2><ul>${gov}</ul></section>
    <section aria-labelledby="f-contact"><h2 id="f-contact">Contact</h2>
      <p>${esc(site.contact.address)}<br><a href="${site.contact.phoneHref}">${esc(site.contact.phone)}</a><br><a href="mailto:${site.contact.email}">${esc(site.contact.email)}</a></p>
    </section>
    <section aria-labelledby="f-hours"><h2 id="f-hours">Office hours</h2><dl>${hours}</dl></section>
    <p class="foot-note">This is an unofficial design concept by ${esc(site.author)}, a BSCS student, made for a portfolio. It is not affiliated with or endorsed by Tarlac State University. Content was copied from <a href="${esc(site.realSite)}">tsu.edu.ph</a> on ${esc(site.fetched)} and links back to it; it may be out of date. <a href="${r}case-study/">How and why this was made</a>.</p>
  </div>
</footer>
</body>
</html>
`;
  // Typographic apostrophes in visible text and attribute values (attributes are double-quoted, so this is safe)
  const typeset = html.replace(/(?<=[A-Za-z])'(?=[A-Za-z])/g, "\u2019");
  const file = here(`dist/${path}index.html`);
  mkdirSync(new URL(".", file), { recursive: true });
  writeFileSync(file, typeset);
  return r;
}

const band = (h1, lede, crumbs = "", extra = "") =>
  `<div class="band"><div class="wrap">${crumbs}<h1>${h1}</h1>${lede ? `<p class="lede">${lede}</p>` : ""}${extra}</div></div>`;
const crumb = (r, items) => `<nav class="crumbs" aria-label="Breadcrumb">${items.map(([t, h]) => `<a href="${r}${h}">${esc(t)}</a>`).join(" / ")}</nav>`;

const annItem = (a, { showKind = true, level = "h3" } = {}) => `<li class="ann" data-kind="${a.kind}">
  ${showKind ? `<span class="kind" data-kind="${a.kind}">${KIND_LABEL[a.kind]}</span>` : ""}
  <${level}>${ext(a.source, esc(a.title))}</${level}>
  <span class="meta"><time datetime="${a.date}">${fmtDate(a.date)}</time></span>
  ${a.excerpt && a.kind !== "general" ? `<p>${clip(a.excerpt)}</p>` : ""}
</li>`;

// ---------- calendar helpers ----------
const allEvents = cal.terms.flatMap((t) => t.events.map((e) => ({ ...e, term: t.name })))
  .sort((a, b) => (a.start + (a.end || a.start)).localeCompare(b.start + (b.end || b.start)));
const upcoming = (from, n) => allEvents.filter((e) => (e.end || e.start) >= from).slice(0, n);
const upItem = (e) => {
  const now = e.start <= TODAY;
  return `<li class="${now ? "is-now" : ""}"><time datetime="${e.start}">${fmtRange(e.start, e.end, true)}</time><span>${esc(e.what)}${now ? '<span class="tag">Now</span>' : ""}</span></li>`;
};

// ---------- pages ----------
rmSync(here("dist"), { recursive: true, force: true });
mkdirSync(here("dist"), { recursive: true });
cpSync(here("src/fonts"), here("dist/fonts"), { recursive: true });
cpSync(here("src/styles.css"), here("dist/styles.css"));
cpSync(here("src/app.js"), here("dist/app.js"));
writeFileSync(here("dist/favicon.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#800000"/><rect x="6" y="22" width="20" height="4" fill="#ffc632"/></svg>`);

const classItems = ann.items.filter((a) => a.kind === "class");
const latestClass = classItems[0];

// Home
page({
  path: "", title: "Home", nav: "",
  desc: "Unofficial concept: Tarlac State University's class notices, academic calendar, admissions and portals, fast on a phone.",
  body: `${band(esc(site.name), "Class notices, the academic calendar, admissions and student services, in one place.", "", `
  <ul class="tasks" aria-label="Top tasks">
    <li><a href="announcements/?type=class"><span class="t">Class schedule changes<span>Latest posted ${fmtDate(latestClass.date)}</span></span>${icon("arrow-right")}</a></li>
    <li><a href="calendar/"><span class="t">Academic calendar 2026-2027<span>Enrollment, exams and breaks</span></span>${icon("arrow-right")}</a></li>
    <li><a href="admissions/"><span class="t">Admissions<span>Freshmen, transferees, graduate and law</span></span>${icon("arrow-right")}</a></li>
    <li><a href="https://student.tsu.edu.ph"><span class="t">Student portal<span>Opens student.tsu.edu.ph</span></span>${icon("arrow-up-right")}</a></li>
  </ul>`)}
<div class="section"><div class="wrap now-grid">
  <section class="panel" aria-labelledby="h-coming">
    <h2 id="h-coming">${icon("calendar-blank")}Coming up</h2>
    <ol class="upcoming" data-upcoming data-built="${TODAY}" data-src="calendar/events.json">${upcoming(TODAY, 5).map(upItem).join("")}</ol>
    <p><a href="calendar/">Full calendar for 2026-2027</a></p>
  </section>
  <section class="panel alert" aria-labelledby="h-class">
    <h2 id="h-class">${icon("warning-circle")}Latest class schedule change</h2>
    <p><strong>${ext(latestClass.source, esc(latestClass.title))}</strong><br><span class="meta">Posted <time datetime="${latestClass.date}">${fmtDate(latestClass.date)}</time></span></p>
    <p>${clip(latestClass.excerpt)}</p>
    <p><a href="announcements/?type=class">All ${classItems.length} class schedule changes this year</a></p>
  </section>
</div></div>
<div class="section"><div class="wrap">
  <h2>Latest announcements</h2>
  <ul class="ann-list">${ann.items.slice(0, 5).map((a) => annItem(a)).join("")}</ul>
  <p class="more"><a href="announcements/">All announcements</a></p>
</div></div>
<div class="section"><div class="wrap cols-2">
  <section aria-labelledby="h-portals">
    <h2 id="h-portals">Portals</h2>
    <p class="portal-note">These open TSU's own systems. This concept never asks you to sign in.</p>
    <ul class="link-rows">${site.portals.map((p) => `<li>${ext(p.href, `<span class="t">${esc(p.label)}<span class="sub">${esc(new URL(p.href).host)}</span></span>` + icon("arrow-up-right"))}</li>`).join("")}</ul>
  </section>
  <section aria-labelledby="h-campus">
    <h2 id="h-campus">Six campuses</h2>
    <ul class="campuses">${site.campuses.names.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
    ${source(site.campuses.source, "TSU home page campus banner")}
  </section>
</div></div>`,
});

// Calendar events for the home page's client-side refresh
mkdirSync(here("dist/calendar"), { recursive: true });
writeFileSync(here("dist/calendar/events.json"), JSON.stringify(allEvents.map((e) => ({ start: e.start, end: e.end, what: e.what, when: fmtRange(e.start, e.end, true) }))));

// Calendar
page({
  path: "calendar/", title: "Academic calendar 2026-2027", nav: "calendar/",
  desc: "TSU's collegiate academic calendar for 2026-2027 as text: enrollment, classes, exams and breaks for both semesters and midyear.",
  body: `${band("Academic calendar 2026-2027", `Collegiate calendar from the ${esc(cal.issuer)}. Events happening today are marked.`, "",
    `<nav aria-label="Terms on this page"><ul class="jump">${cal.terms.map((t) => `<li><a href="#${t.id}">${esc(t.name)}</a></li>`).join("")}</ul></nav>`)}
<div class="section"><div class="wrap">
${cal.terms.map((t) => `<section class="term" id="${t.id}">
  <div class="scroll-x" tabindex="0" role="region" aria-label="${esc(t.name)}"><table class="cal">
    <caption>${esc(t.name)}</caption>
    <thead><tr><th scope="col">Date</th><th scope="col">What happens</th></tr></thead>
    <tbody>${t.events.map((e) => {
      const end = e.end || e.start, now = e.start <= TODAY && TODAY <= end, past = end < TODAY;
      return `<tr data-start="${e.start}"${e.end ? ` data-end="${e.end}"` : ""} class="${[e.key && "key", now && "is-now", past && "is-past"].filter(Boolean).join(" ")}"><th scope="row"><time datetime="${e.start}">${fmtRange(e.start, e.end, true)}</time></th><td>${esc(e.what)}<span class="tag"${now ? "" : " hidden"}>Now</span></td></tr>`;
    }).join("")}</tbody>
  </table></div>
</section>`).join("")}
  <section class="inset" aria-labelledby="h-notes"><h2 id="h-notes" class="visually-hidden">Notes</h2>
    <ul class="notes">${cal.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
  </section>
  <p class="meta">${esc(cal.sourceNote)} Source: <a href="${esc(cal.source)}">Collegiate calendar for the academic year 2026-2027</a>, read ${esc(site.fetched)}. Calendars for 2021 to 2024 are on <a href="${esc(cal.olderCalendars)}">TSU's Academic Calendar page</a>.</p>
</div></div>`,
});

// Announcements
const counts = { all: ann.items.length, class: 0, admission: 0, general: 0 };
ann.items.forEach((a) => counts[a.kind]++);
const byMonth = [];
for (const a of ann.items) { const k = monthKey(a.date); let g = byMonth.find((x) => x.k === k); if (!g) byMonth.push((g = { k, items: [] })); g.items.push(a); }
page({
  path: "announcements/", title: "Announcements", nav: "announcements/",
  desc: "Every announcement Tarlac State University posted in 2026, newest first, with a filter for class schedule changes.",
  body: `${band("Announcements", "Everything TSU posted in 2026, newest first. Class schedule changes have their own filter.")}
<div class="section"><div class="wrap">
  <fieldset class="filter">
    <legend>Show</legend>
    <div class="opts">
      <label><input type="radio" name="type" id="f-all" value="all" checked> All (${counts.all})</label>
      <label><input type="radio" name="type" id="f-class" value="class"> Class schedule changes (${counts.class})</label>
      <label><input type="radio" name="type" id="f-admission" value="admission"> Admissions, enrollment and scholarships (${counts.admission})</label>
      <label><input type="radio" name="type" id="f-general" value="general"> Other news (${counts.general})</label>
    </div>
  </fieldset>
  <p class="ann-count" data-count aria-live="polite"></p>
  ${byMonth.map((g) => `<section class="month" aria-labelledby="m-${g.k.replace(" ", "-")}"><h2 id="m-${g.k.replace(" ", "-")}">${g.k}</h2><ul class="ann-list">${g.items.map((a) => annItem(a)).join("")}</ul></section>`).join("")}
  <div class="inset">
    <p>${ann.leftOut} posts that name individual people are left out of this concept to follow the Data Privacy Act. They are on <a href="https://www.tsu.edu.ph/announcements/2026-announcements/">tsu.edu.ph</a>, along with announcements from 2019 to 2025.</p>
  </div>
  ${source("https://www.tsu.edu.ph/announcements/2026-announcements/", "2026 Announcements on tsu.edu.ph")}
</div></div>`,
});

// Admissions
const admNotices = ann.items.filter((a) => a.kind === "admission");
page({
  path: "admissions/", title: "Admissions", nav: "admissions/",
  desc: "How to apply to Tarlac State University: freshmen, transferees, shifters, graduate, law and foreign students.",
  body: `${band("Admissions", "Choose how you are applying. Each type has its own requirements.")}
<div class="section"><div class="wrap cols-2">
  <section aria-labelledby="h-types">
    <h2 id="h-types">Who are you applying as?</h2>
    <ul class="link-rows">${adm.types.map((t) => `<li>${t.here
      ? `<a href="${t.here.replace("admissions/", "")}"><span class="t">${esc(t.label)}<span class="sub">${esc(t.summary)}</span></span>${icon("arrow-right")}</a>`
      : ext(t.source, `<span class="t">${esc(t.label)}<span class="sub">${esc(t.summary)} On tsu.edu.ph.</span></span>${icon("arrow-up-right")}`)}</li>`).join("")}</ul>
  </section>
  <section aria-labelledby="h-notices">
    <h2 id="h-notices">Admission notices</h2>
    <ul class="ann-list">${admNotices.map((a) => annItem(a, { showKind: false })).join("")}</ul>
  </section>
</div>
<div class="wrap">${source(adm.source, "Admissions on tsu.edu.ph")}</div></div>`,
});

// Freshmen
const f = adm.freshmen;
const cae = admNotices.find((a) => /CAE/.test(a.title));
page({
  path: "admissions/freshmen/", title: "Applying as a freshman", nav: "admissions/",
  desc: "Requirements and documents for new freshmen applying to Tarlac State University.",
  body: `${band("Applying as a freshman", "For students applying to college for the first time. New freshmen start in the first semester only.", crumb("../../", [["Admissions", "admissions/"]]))}
<div class="section"><div class="wrap">
  <h2>Apply online</h2>
  <p>Every freshman applicant takes the TSU College Admission Evaluation (TSU-CAE). Applications are online.</p>
  <p><a class="button" href="${esc(f.applyUrl)}">Open the TSU-CAE application${icon("arrow-up-right")}<span class="visually-hidden"> (on cat.tsu.edu.ph)</span></a></p>
  ${cae ? `<p class="meta">Latest notice: ${ext(cae.source, esc(cae.title))}, posted ${fmtDate(cae.date)}.</p>` : ""}
</div></div>
<div class="section"><div class="wrap cols-2">
  <section aria-labelledby="h-docs">
    <h2 id="h-docs">Documents to prepare</h2>
    <ul class="check">${f.documents.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
  </section>
  <section aria-labelledby="h-req">
    <h2 id="h-req">What you need to pass</h2>
    <ul class="check">${f.requirements.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
  </section>
</div></div>
<div class="section"><div class="wrap prose">
  <h2>Good to know</h2>
  <ul>${f.rules.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
  ${source(f.source, "Freshmen Students on tsu.edu.ph")}
</div></div>`,
});

// College of Computer Studies
const collegeHref = (n) => "https://www.tsu.edu.ph/academics/colleges/" + n.toLowerCase().replace(/ /g, "-") + "/";
page({
  path: "colleges/computer-studies/", title: ccs.name, nav: "colleges/computer-studies/",
  desc: "Programs and contact details of the College of Computer Studies, Tarlac State University.",
  body: `${band(esc(ccs.name), "Five undergraduate programs and one graduate program.", crumb("../../", [["Colleges", "colleges/computer-studies/#other"]]))}
<div class="section"><div class="wrap cols-2">
  ${ccs.programs.map((p) => `<section aria-labelledby="h-${p.level}"><h2 id="h-${p.level}">${esc(p.level)}</h2><ul class="check">${p.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></section>`).join("")}
</div></div>
<div class="section"><div class="wrap">
  <h2>Contact the college</h2>
  <p>${esc(ccs.contact.label)}<br><a href="mailto:${ccs.contact.email}">${esc(ccs.contact.email)}</a><br><a href="${ccs.contact.phoneHref}">${esc(ccs.contact.phone)}</a></p>
  ${source(ccs.source, "College of Computer Studies on tsu.edu.ph")}
</div></div>
<div class="section" id="other"><div class="wrap">
  <h2>Other colleges</h2>
  <p>Only this college is rebuilt in the concept. The others link to their pages on tsu.edu.ph.</p>
  <ul class="link-rows">${ccs.otherColleges.map((c) => `<li>${ext(collegeHref(c), esc(c) + icon("arrow-up-right"))}</li>`).join("")}</ul>
</div></div>`,
});

// Case study
const PAGES = [["home", "Home"], ["admissions", "Admissions"], ["announcements", "Announcements"], ["calendar", "Academic Calendar"], ["colleges", "Colleges"]];
const n = (v, d = 0) => (v == null ? "n/a" : Number(v).toFixed(d));
const row = (label, b, a) => `<tr><th scope="row">${label}</th>
  <td class="num">${n(b.performance)}</td><td class="num">${n(b.accessibility)}</td><td class="num">${(b.lcpMs / 1000).toFixed(1)} s</td><td class="num">${(b.bytes / 1048576).toFixed(2)} MB</td>
  <td class="num better">${a ? n(a.performance) : "pending"}</td><td class="num better">${a ? n(a.accessibility) : "pending"}</td><td class="num better">${a ? (a.lcpMs / 1000).toFixed(1) + " s" : "pending"}</td><td class="num better">${a ? (a.bytes / 1024).toFixed(0) + " KB" : "pending"}</td></tr>`;
const REPO = "https://github.com/ImanHuson/Portfolio/tree/main/tsu-concept";
page({
  path: "case-study/", title: "Case study", nav: "",
  desc: "How and why I rebuilt five pages of Tarlac State University's website as an unofficial concept, with before and after measurements.",
  body: `${band("Rebuilding the TSU website", `An unofficial concept by ${esc(site.author)}, a BSCS student at Tarlac State University. I measured the current site, found where students get stuck, and rebuilt the pages they use most.`)}
<div class="section"><div class="wrap prose">
  <h2>The problem</h2>
  <p>Students use the TSU website for a few things: class schedule changes, the academic calendar, admissions and the portals. On ${esc(site.fetched)} I measured it and walked those tasks myself. Five problems stood out.</p>
  <ul>
    <li><strong>The Academic Calendar page is out of date.</strong> Its newest calendars are for 2023-2024. This year's calendar exists only as three image posts inside an announcement, with no text version.</li>
    <li><strong>Class schedule changes are buried.</strong> 14 of the 61 announcements posted in 2026 are class changes (online, asynchronous, back to face-to-face). They sit between congratulations and event posts, in a year-by-year archive, and Announcements isn't in the main menu.</li>
    <li><strong>Phones can't zoom, and the phone menu can't be reached by keyboard.</strong> Pinch-zoom is switched off on every page, and the menu button can't take keyboard focus.</li>
    <li><strong>The pages are heavy.</strong> The home page is about 7 MB, mostly PNG banners. The Academic Calendar page loads a single 10.7 MB photo.</li>
    <li><strong>The slider hides its information.</strong> Its banners are images of text inside links with no text, so screen readers get nothing.</li>
  </ul>
</div></div>
<div class="section"><div class="wrap">
  <h2>Before and after</h2>
  <p>Lighthouse 12, mobile, median of 5 runs per page, the same settings for both sites. "After" is this concept.</p>
  <div class="scroll-x" tabindex="0" role="region" aria-label="Before and after measurements"><table class="data">
    <thead><tr><th scope="col">Page</th><th scope="col" class="num">Perf. before</th><th scope="col" class="num">Access. before</th><th scope="col" class="num">LCP before</th><th scope="col" class="num">Weight before</th><th scope="col" class="num">Perf. after</th><th scope="col" class="num">Access. after</th><th scope="col" class="num">LCP after</th><th scope="col" class="num">Weight after</th></tr></thead>
    <tbody>${PAGES.slice(0, 4).map(([k, label]) => row(label, base[k].median, after?.[k]?.median)).join("")}</tbody>
  </table></div>
  <p class="meta">Before: tsu.edu.ph on ${esc(site.fetched)}. After: ${after ? `this concept on GitHub Pages, ${esc(after._measured || "")}` : "measured after deployment"}. Measured from a cloud machine outside the Philippines with Lighthouse's simulated slow 4G, so absolute times differ from a phone in Tarlac. Both sites were measured the same way.</p>
</div></div>
<div class="section"><div class="wrap prose">
  <h2>What I changed, and why</h2>
  <ul>
    <li><strong>The calendar is text.</strong> I typed the three image posts into one table per term. Today's events are highlighted, and the home page lists what's coming up.</li>
    <li><strong>Class changes have their own lane.</strong> A filter in Announcements and a panel on the home page. The filter works without JavaScript.</li>
    <li><strong>Top tasks first.</strong> The home page opens with the four things students come for, instead of a slider.</li>
    <li><strong>No slider, no autoplay video.</strong> Notices that were images are text.</li>
    <li><strong>Zoom on, a real menu button, a skip link, one heading per page, the page language set.</strong> Each is a line or two in a page template, and together they decide whether a low-vision or keyboard user can use the site at all.</li>
    <li><strong>Light pages.</strong> One 27 KB font, a few KB of CSS and JavaScript, and no third-party scripts.</li>
  </ul>
  <h2>What I kept</h2>
  <p>Everything a Philippine government website is expected to carry: the GOV.PH link, Transparency Seal, Citizen's Charter, Freedom of Information, Data Privacy Notice, bid notices and Philippine Standard Time. TSU's maroon is the one accent colour.</p>
  <h2>Limits</h2>
  <ul>
    <li>This is a front end only. The real site runs on the Umbraco CMS; every change here could be made in its templates and content, but I haven't built that.</li>
    <li>Content is a copy from ${esc(site.fetched)}. Only five pages and one college are rebuilt.</li>
    <li>${ann.leftOut} announcements that name individual people are left out, to follow the Data Privacy Act.</li>
    <li>There are no photos yet. I'll add campus photos I take myself, without identifiable people.</li>
    <li>The task test with classmates hasn't been run yet, so this page doesn't claim students find things faster.</li>
  </ul>
  <h2>Rules I worked under</h2>
  <p>This is unofficial and labelled so on every page. It uses no TSU logo and no government seals, never asks anyone to sign in (portals are plain links to TSU), isn't indexed by search engines, and isn't monetised. Public TSU text is reused with a link to its source, which Philippine copyright law allows for government works used without profit (RA 8293, Section 176).</p>
  <p>The measurements, accessibility audit, navigation map and code are on <a href="${REPO}">GitHub</a>.</p>
</div></div>`,
});

console.log(`BUILT dist for ${TODAY}: home, calendar, announcements (${ann.items.length}), admissions, freshmen, computer-studies, case-study`);
