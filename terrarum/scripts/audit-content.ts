/**
 * Content audit: checks a country's data against its scope file
 * (research/countries/<slug>/scope.json) and the brief's content system
 * (lib/content/brief.ts). Prints a success token per check, or FAIL lines and
 * exits 1. Run: npx tsx scripts/audit-content.ts <country> <check...>
 *   checks: scope chapters cities places cites pano all
 */
import fs from "node:fs";
import path from "node:path";
import { CHAPTER_TOPICS, CITY_TOPICS, SIDES } from "../lib/content/brief";
import { getCity, getCountry, getPlace, getRegion } from "../lib/content/index";
import { MEDIA } from "../lib/content/media";
import { SOURCES } from "../lib/content/sources";
import type { Passage } from "../lib/content/types";

const [country, ...asked] = process.argv.slice(2);
const checks = asked.includes("all") ? ["scope", "chapters", "cities", "places", "cites", "pano"] : asked;
const scope = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "research", "countries", country, "scope.json"), "utf8"));
const c = getCountry(country);
const fails: string[] = [];
const fail = (m: string) => fails.push(m);
const media = new Map(MEDIA.map((m) => [m.id, m]));
const sources = new Set(SOURCES.map((s) => s.id));

const regionSlugs = Object.keys(scope.regions);
const citySlugs = regionSlugs.flatMap((r) => Object.keys(scope.regions[r]));
const placeSlugs = regionSlugs.flatMap((r) => Object.values(scope.regions[r] as Record<string, string[]>).flat());

const ok = (token: string, before: number) => {
  if (fails.length === before) console.log(token);
};

if (!c) {
  console.log(`FAIL: ${country} is not open`);
  process.exit(1);
}

for (const check of checks) {
  const before = fails.length;
  if (check === "scope") {
    const regions = c.regions;
    for (const r of regionSlugs) {
      const reg = getRegion(country, r);
      if (!reg || !regions.includes(r)) { fail(`region ${r} not open`); continue; }
      for (const ci of Object.keys(scope.regions[r])) {
        if (!reg.cities.includes(ci) || !getCity(country, ci)) { fail(`city ${r}/${ci} missing`); continue; }
        for (const p of scope.regions[r][ci] as string[]) {
          if (!getCity(country, ci)!.places.includes(p) || !getPlace(country, p)) fail(`place ${ci}/${p} missing`);
        }
      }
    }
    if (c.pendingRegions.length) fail(`regions still pending: ${c.pendingRegions.map((r) => r.geoKey).join(", ")}`);
    for (const ch of scope.chapters) if (!c.chapters.find((x) => x.slug === ch)) fail(`chapter ${ch} missing`);
    ok("SCOPE-OK", before);
  } else if (check === "chapters") {
    for (const want of scope.chapters as string[]) if (!c.chapters.find((x) => x.slug === want)) fail(`chapter ${want} missing`);
    for (const ch of c.chapters) {
      const want = Object.keys(CHAPTER_TOPICS[ch.slug].topics);
      const covered = new Set(ch.passages.flatMap((p) => p.covers ?? []));
      const na = new Map((ch.notApplicable ?? []).map((n) => [n.topic, n.why]));
      for (const t of want) {
        if (!covered.has(t) && !(na.get(t) ?? "").trim()) fail(`chapter ${ch.slug}: topic ${t} neither covered nor explained`);
      }
      for (const t of covered) if (!want.includes(t)) fail(`chapter ${ch.slug}: unknown topic ${t}`);
      if (!media.has(ch.hero)) fail(`chapter ${ch.slug}: hero ${ch.hero} missing`);
      for (const p of ch.passages) for (const im of p.images ?? []) if (!media.has(im)) fail(`chapter ${ch.slug}/${p.id}: image ${im} missing`);
      const words = ch.passages.flatMap((p) => p.body).join(" ").split(/\s+/).length;
      if (words < 900) fail(`chapter ${ch.slug}: only ${words} words`);
    }
    ok("CHAPTERS-OK", before);
  } else if (check === "cities") {
    for (const slug of citySlugs) {
      const ci = getCity(country, slug);
      if (!ci) { fail(`city ${slug} missing`); continue; }
      const covered = new Set(ci.passages.flatMap((p) => p.covers ?? []));
      const na = new Map((ci.notApplicable ?? []).map((n) => [n.topic, n.why]));
      for (const t of Object.keys(CITY_TOPICS)) if (!covered.has(t) && !(na.get(t) ?? "").trim()) fail(`city ${slug}: topic ${t} neither covered nor explained`);
      if (ci.nearby.length < 2) fail(`city ${slug}: fewer than 2 nearby`);
      for (const n of ci.nearby) if (!getPlace(country, n) && !getCity(country, n)) fail(`city ${slug}: nearby ${n} unknown`);
      if (!media.has(ci.hero)) fail(`city ${slug}: hero missing`);
      if (ci.gaps.length) fail(`city ${slug}: open gaps ${ci.gaps.map((g) => g.topic).join("; ")}`);
    }
    ok("CITIES-OK", before);
  } else if (check === "places") {
    for (const slug of placeSlugs) {
      const p = getPlace(country, slug);
      if (!p) { fail(`place ${slug} missing`); continue; }
      if (!p.matters.trim()) fail(`place ${slug}: no why-it-matters`);
      if (p.passages.length < 2) fail(`place ${slug}: fewer than 2 passages`);
      const imgs = [p.hero, ...p.gallery, ...p.passages.flatMap((x) => x.images ?? [])].filter((id, i, a) => a.indexOf(id) === i);
      if (imgs.length < scope.minImagesPerPlace) fail(`place ${slug}: ${imgs.length} images, need ${scope.minImagesPerPlace}`);
      const sides = new Set<string>();
      for (const id of imgs) {
        const m = media.get(id);
        if (!m) { fail(`place ${slug}: image ${id} missing`); continue; }
        if (!m.alt || m.alt.length < 25) fail(`place ${slug}: image ${id} alt too thin`);
        if (!m.license || !m.licenseUrl || !m.sourceUrl || !m.creator) fail(`place ${slug}: image ${id} attribution incomplete`);
        if (m.side) sides.add(m.side);
        if (m.side && !(m.side in SIDES)) fail(`place ${slug}: image ${id} unknown side ${m.side}`);
      }
      if (sides.size < scope.minSidesPerPlace) fail(`place ${slug}: shows ${sides.size} sides (${[...sides].join(",")}), need ${scope.minSidesPerPlace}`);
      if (p.related.length < 2) fail(`place ${slug}: fewer than 2 related`);
      for (const r of p.related) if (!getPlace(country, r)) fail(`place ${slug}: related ${r} does not exist`);
      if (p.gaps.length) fail(`place ${slug}: open gaps ${p.gaps.map((g) => g.topic).join("; ")}`);
    }
    ok("PLACES-OK", before);
  } else if (check === "cites") {
    // Checks whatever exists; "scope" reports what is still missing.
    const passages: Passage[] = [
      ...c.passages,
      ...c.chapters.flatMap((ch) => ch.passages),
      ...regionSlugs.flatMap((r) => { const g = getRegion(country, r); return g ? [g.definition] : []; }),
      ...c.regions.flatMap((r) => getRegion(country, r)?.cities ?? []).flatMap((s) => getCity(country, s)?.passages ?? []),
      ...c.regions.flatMap((r) => getRegion(country, r)?.cities ?? []).flatMap((s) => getCity(country, s)?.places ?? []).flatMap((s) => getPlace(country, s)?.passages ?? []),
    ];
    const facts = [
      ...c.facts,
      ...c.chapters.flatMap((ch) => ch.facts ?? []),
      ...regionSlugs.flatMap((r) => getRegion(country, r)?.facts ?? []),
      ...citySlugs.flatMap((s) => getCity(country, s)?.facts ?? []),
      ...placeSlugs.flatMap((s) => getPlace(country, s)?.facts ?? []),
    ];
    for (const p of passages) {
      if (!p.cite.length) fail(`passage ${p.id}: no citation`);
      for (const s of p.cite) if (!sources.has(s)) fail(`passage ${p.id}: unknown source ${s}`);
      if (!["fact-checked", "approved", "published"].includes(p.status)) fail(`passage ${p.id}: status ${p.status}`);
    }
    for (const f of facts) {
      if (!f.cite.length) fail(`fact ${f.label}: no citation`);
      for (const s of f.cite) if (!sources.has(s)) fail(`fact ${f.label}: unknown source ${s}`);
    }
    for (const s of SOURCES) if (!/^https?:\/\//.test(s.url) || !s.accessed) fail(`source ${s.id}: url or accessed date missing`);
    ok("CITES-OK", before);
  } else if (check === "pano") {
    for (const m of MEDIA) if (m.kind === "panorama" && m.width < 6000) fail(`panorama ${m.id} only ${m.width}px wide`);
    ok("PANO-OK", before);
  } else {
    fail(`unknown check ${check}`);
  }
}

for (const f of fails.slice(0, 80)) console.log("FAIL: " + f);
if (fails.length > 80) console.log(`FAIL: …and ${fails.length - 80} more`);
process.exit(fails.length ? 1 : 0);
