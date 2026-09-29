// "Search the archive" (brief section 58): name, Color, House, trait,
// theme, book and role, across the twenty featured people and the cast.
// Search must not spoil: a field is searchable only once the reader's
// clearance covers the book that reveals it, and names follow the same
// cover rule as everywhere else (Mustang, the Jackal, Pax).
import { CAST } from "@/lib/data/cast";
import { EXTENDED } from "@/lib/data/extended";
import { PEOPLE, shownAs } from "@/lib/data/people";
import { BOOK_TITLES } from "@/lib/data/spoilers";
import { themesOf } from "@/lib/data/themes";

type G = string | { t: string; book: number };

/** Profiles for the Ten, whose dossiers are shaped differently from the
 * extended ten's. Traits and keywords are the archive's reading. */
const TEN: Record<string, { house: G[]; role: G[]; traits: string[]; keywords: G[] }> = {
  darrow: { house: ["Lykos", "House Mars"], role: ["Helldiver", "Reaper", "Rebel"], traits: ["Driven", "Loyal", "Relentless", "Guilty"], keywords: ["Red", "Rebellion", "Mines", "Carving", { t: "Sons of Ares", book: 1 }, { t: "Rising", book: 3 }] },
  virginia: { house: ["House Minerva", { t: "House Augustus", book: 1 }], role: ["Primus", { t: "Sovereign", book: 3 }], traits: ["Brilliant", "Principled", "Guarded"], keywords: ["Institute", "Politics", "Power"] },
  cassius: { house: ["House Bellona"], role: ["Soldier", "Knight"], traits: ["Honorable", "Proud", "Grieving"], keywords: ["Honor", "Blade", { t: "Julian", book: 1 }] },
  sevro: { house: ["House Mars", { t: "House Barca", book: 1 }], role: ["Howler", { t: "Ares", book: 3 }], traits: ["Feral", "Loyal", "Funny", "Grieving"], keywords: ["Howlers", "Goblin", "Wolf", "Rebellion"] },
  pax: { house: [{ t: "House Augustus", book: 4 }], role: ["Son", "Heir"], traits: ["Curious", "Kind", "Young"], keywords: ["Luna", "Family"] },
  diomedes: { house: ["House Raa"], role: ["Storm Knight"], traits: ["Honorable", "Austere", "Reserved"], keywords: ["Rim", "Olympic Knights", "Philosophy", "Honor"] },
  atlas: { house: ["House Raa"], role: ["Fear Knight"], traits: ["Patient", "Cold", "Clever"], keywords: ["Rim", "Olympic Knights", "Gorgons", "Fear"] },
  lysander: { house: ["House Lune"], role: ["Heir", "Exile"], traits: ["Brilliant", "Idealistic", "Ambitious"], keywords: ["Luna", "Philosophy", "Civilization"] },
  victra: { house: ["House Julii", { t: "House Barca", book: 3 }], role: ["Warrior", "Heiress"], traits: ["Loyal", "Blunt", "Fearless", "Independent"], keywords: ["Iron", "Julii", "Mars"] },
  "the-jackal": { house: ["House Pluto", { t: "House Augustus", book: 1 }], role: ["Primus", "Politician"], traits: ["Cunning", "Cruel", "Wounded"], keywords: ["Power", "Politics", "Institute"] },
};

/** Keywords for the extended ten that the brief's examples expect. */
const EXTRA: Record<string, string[]> = {
  lorn: ["Philosophy", "Willow Way", "Razor"],
  romulus: ["Philosophy", "Rim"],
  fitchner: ["Rebellion", "Ares", "Sons of Ares", "Proctor"],
  ragnar: ["Rebellion", "Stained", "Valkyrie"],
  orion: ["Pilot", "Ships", "Space"],
  kavax: ["Sophocles", "Fox", "Bear"],
  lyria: ["Mines", "Lagalos"],
  volga: ["Snowball", "Ice"],
  ephraim: ["Freelancer", "Thief"],
  apollonius: ["Minotaur", "Deepgrave", "Violin", "Valii-Rath"],
};

export type Hit = { key: string; href: string; name: string; meta: string; kind: "featured" | "cast"; match?: string; firstBook: number };

type Field = { label: string; text: string };

const open = (g: G, c: number) => (typeof g === "string" ? g : g.book <= c ? g.t : null);

function fieldsFor(clearance: number): { hit: Omit<Hit, "match">; fields: Field[] }[] {
  const out: { hit: Omit<Hit, "match">; fields: Field[] }[] = [];

  for (const p of PEOPLE) {
    const pr = TEN[p.slug];
    const known = clearance >= p.firstBook;
    const name = shownAs(p, clearance).name;
    const fields: Field[] = [
      { label: "Name", text: name },
      { label: "Color", text: p.color },
      { label: "Book", text: `First met in ${BOOK_TITLES[p.firstBook]}` },
      ...pr.house.map((h) => open(h, clearance)).filter(Boolean).map((t) => ({ label: "House", text: t! })),
    ];
    if (known) {
      fields.push(
        ...pr.role.map((r) => open(r, clearance)).filter(Boolean).map((t) => ({ label: "Role", text: t! })),
        ...pr.traits.map((t) => ({ label: "Trait", text: t })),
        ...pr.keywords.map((k) => open(k, clearance)).filter(Boolean).map((t) => ({ label: "Keyword", text: t! })),
        ...themesOf(p.slug, clearance).map((t) => ({ label: "Theme", text: t })),
      );
    }
    out.push({ hit: { key: p.slug, href: `/people/${p.slug}/`, name, meta: `${p.color} · The Ten Faces`, kind: "featured", firstBook: p.firstBook }, fields });
  }

  for (const p of EXTENDED) {
    const known = clearance >= p.firstBook;
    const fields: Field[] = [
      { label: "Name", text: p.name },
      { label: "Color", text: p.color },
      { label: "House", text: p.origin },
      { label: "Book", text: `First met in ${BOOK_TITLES[p.firstBook]}` },
    ];
    if (known) {
      fields.push(
        { label: "Role", text: p.role },
        ...p.traits.map((t) => ({ label: "Trait", text: t })),
        ...p.themes.map((t) => ({ label: "Theme", text: t })),
        ...p.categories.map((t) => ({ label: "Theme", text: t })),
        ...themesOf(p.slug, clearance).map((t) => ({ label: "Theme", text: t })),
        ...(EXTRA[p.slug] ?? []).map((t) => ({ label: "Keyword", text: t })),
      );
    }
    out.push({ hit: { key: p.slug, href: `/people/${p.slug}/`, name: p.name, meta: `${p.color} · The ones who deserve a place`, kind: "featured", firstBook: p.firstBook }, fields });
  }

  for (const c of CAST) {
    const known = clearance >= c.book;
    const fields: Field[] = [
      { label: "Name", text: c.name },
      { label: "Color", text: c.color },
      { label: "Book", text: `First met in ${BOOK_TITLES[c.book]}` },
    ];
    if (known) fields.push({ label: "Role", text: c.role }, ...(c.keywords ?? []).map((k) => ({ label: "Keyword", text: k })));
    out.push({ hit: { key: c.slug, href: `/people/cast/#${c.slug}`, name: c.name, meta: `${c.color} · Complete cast`, kind: "cast", firstBook: c.book }, fields });
  }
  return out;
}

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ’']/g, "");

/** Every entry matching every word of the query, best matches first:
 * a name match ranks above a Color match, above everything else. */
export function searchArchive(query: string, clearance: number): Hit[] {
  const words = norm(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const rank: Record<string, number> = { Name: 0, Color: 1, House: 2, Role: 3, Theme: 4, Trait: 5, Keyword: 6, Book: 7 };
  const hits: (Hit & { score: number })[] = [];
  for (const { hit, fields } of fieldsFor(clearance)) {
    let best: Field | null = null;
    let ok = true;
    for (const w of words) {
      const f = fields.filter((x) => norm(x.text).includes(w)).sort((a, b) => rank[a.label] - rank[b.label])[0];
      if (!f) { ok = false; break; }
      if (!best || rank[f.label] < rank[best.label]) best = f;
    }
    if (ok && best) hits.push({ ...hit, match: best.label === "Name" ? undefined : `${best.label}: ${best.text}`, score: rank[best.label] * 10 + (hit.kind === "cast" ? 1 : 0) });
  }
  return hits.sort((a, b) => a.score - b.score || a.firstBook - b.firstBook);
}

export const SEARCH_EXAMPLES = ["Obsidian", "Philosophy", "Rebellion", "House Raa", "Golden Son", "Loyal"];
