// Run from any directory with the static build served at http://localhost:8790/Portfolio/terrarum
// (e.g. a folder holding Portfolio/terrarum -> terrarum/out, served by python3 -m http.server 8790).
// Needs playwright. routes.txt and baseline-japan.json sit beside this file; re-record the baseline
// with record-baseline.js before a change that should not lose content.
// Gate checks for the Japan redesign (gates/redesign.md). Each mode prints a
// success token only after every assertion passes; failures list what failed.
// Needs the local server: python3 -m http.server 8790 in scratchpad/site.
const { chromium } = require('playwright');
const fs = require('fs');
const B = 'http://localhost:8790/Portfolio/terrarum';
const ROUTES = fs.readFileSync(__dirname + '/routes.txt', 'utf8').split('\n').filter(Boolean);
const PLACES = ROUTES.filter((r) => r.split('/').filter(Boolean).length === 4 && !r.includes('/topics/'));
const CITIES = ROUTES.filter((r) => r.split('/').filter(Boolean).length === 3 && !r.includes('/topics/'));
const CHAPTERS = ROUTES.filter((r) => r.includes('/topics/'));
const CONTROL = '/maldives/kaafu/male/hukuru-miskiy/';
const mode = process.argv[2];
const fails = [];
const fail = (m) => fails.push(m);

async function page(b, opts = {}) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  return [ctx, await ctx.newPage()];
}
const settle = (p, ms = 1200) => p.waitForTimeout(ms);

async function hero(b) {
  for (const [w, h] of [[1440, 900], [375, 812]]) {
    const [ctx, p] = await page(b, { viewport: { width: w, height: h } });
    for (const r of ROUTES) {
      await p.goto(B + r); await settle(p, 1500);
      const m = await p.evaluate(() => {
        const s = document.querySelector('main > [data-hero]:first-child');
        if (!s) return { ok: false, why: 'no hero first in main' };
        const rh = s.getBoundingClientRect().height;
        const img = [...s.querySelectorAll('img')].find((i) => i.getBoundingClientRect().width >= innerWidth * 0.98 && i.complete && i.naturalWidth > 0);
        return { ok: rh >= innerHeight * 0.95 && !!img, why: `height ${Math.round(rh)}/${innerHeight}, fullWidthLoadedImg ${!!img}` };
      });
      if (!m.ok) fail(`${w} ${r}: ${m.why}`);
    }
    await ctx.close();
  }
  return 'HERO-OK';
}

const lum = (rgb) => {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
};
const parse = (s) => (s.match(/[\d.]+/g) || []).map(Number);

async function atmos(b) {
  const [ctx, p] = await page(b);
  for (const r of ROUTES) {
    await p.goto(B + r);
    const m = await p.evaluate(() => {
      const a = document.querySelector('.atmos');
      const t = document.querySelector('[data-theme]');
      if (!a || !t) return null;
      const cs = getComputedStyle(a);
      return { pos: cs.position, bg: cs.backgroundImage, ground: getComputedStyle(t).backgroundColor };
    });
    if (!m) { fail(`${r}: no atmosphere layer`); continue; }
    const grads = (m.bg.match(/gradient\(/g) || []).length;
    const L = lum(parse(m.ground));
    if (m.pos !== 'fixed' || grads < 3 || L >= 0.08) fail(`${r}: position ${m.pos}, ${grads} gradients, ground luminance ${L.toFixed(3)}`);
  }
  await p.goto(B + CONTROL);
  if (await p.$('.atmos')) fail('control: Maldives page has the Japan atmosphere');
  await ctx.close();
  return 'ATMOS-OK';
}

async function kanji(b) {
  const [ctx, p] = await page(b);
  for (const r of [...PLACES, ...CITIES, ...CHAPTERS]) {
    await p.goto(B + r);
    const m = await p.evaluate(() => {
      const k = [...document.querySelectorAll('.cine-kanji[aria-hidden]')].filter((e) => getComputedStyle(e).display !== 'none');
      return k.map((e) => parseFloat(getComputedStyle(e).fontSize));
    });
    if (!m.length || Math.max(...m) < 120) fail(`${r}: kanji sizes ${JSON.stringify(m)}`);
  }
  await p.goto(B + CONTROL);
  if ((await p.$$('.cine-kanji')).length) fail('control: Maldives page has a kanji watermark');
  await ctx.close();
  return 'KANJI-OK';
}

async function story(b) {
  for (const w of [1440, 375]) {
    const [ctx, p] = await page(b, { viewport: { width: w, height: w === 1440 ? 900 : 812 } });
    for (const r of [...PLACES, ...CITIES, ...CHAPTERS]) {
      await p.goto(B + r);
      const m = await p.evaluate(() => [...document.querySelectorAll('[data-story]')].map((s) => {
        const media = s.querySelector('[data-story-media]');
        return { steps: s.querySelectorAll('[data-step]').length, frames: s.querySelectorAll('[data-frame]').length, pos: media && getComputedStyle(media).position, shown: !!(media && media.offsetParent) };
      }));
      if (!m.length) { fail(`${w} ${r}: no story`); continue; }
      for (const s of m) {
        if (s.steps < 1 || s.steps !== s.frames) fail(`${w} ${r}: steps ${s.steps} frames ${s.frames}`);
        if (w === 1440 && (s.pos !== 'sticky' || !s.shown)) fail(`${w} ${r}: media ${s.pos} shown ${s.shown}`);
        if (w === 375 && s.shown) fail(`${w} ${r}: pinned media shown on a phone`);
      }
    }
    await ctx.close();
  }
  return 'STORY-OK';
}

const tx = (p) => p.evaluate(() => { const t = document.querySelector('.scroll-track'); return t ? new DOMMatrix(getComputedStyle(t).transform).m41 : null; });

async function emaki(b) {
  const r = '/japan/kansai/kyoto/fushimi-inari-taisha/';
  // Wide: page scrolling passes over the strip (no pin, the strip does not move);
  // a mouse drag and the arrows move it, and a drag does not open a photograph.
  {
    const [ctx, p] = await page(b);
    await p.goto(B + r); await settle(p, 2000);
    const top = await p.evaluate(() => document.querySelector('[data-emaki]').getBoundingClientRect().top + scrollY);
    await p.evaluate((y) => scrollTo(0, y - 300), top); await settle(p, 600);
    const s0 = await p.evaluate(() => ({ y: scrollY, left: document.querySelector('[data-emaki] .emaki').scrollLeft }));
    const box = await p.evaluate(() => { const r = document.querySelector('[data-emaki] .emaki').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    await p.mouse.move(box.x, Math.min(box.y, 800));
    for (let i = 0; i < 10; i++) { await p.mouse.wheel(0, 200); await p.waitForTimeout(40); }
    await settle(p, 600);
    const s1 = await p.evaluate(() => ({ y: scrollY, left: document.querySelector('[data-emaki] .emaki').scrollLeft, pins: document.querySelectorAll('.pin-spacer').length }));
    if (s1.y - s0.y < 1500) fail(`1440: page did not scroll past the gallery (${s0.y} -> ${s1.y})`);
    if (s1.left !== s0.left) fail(`1440: vertical scrolling moved the strip (${s0.left} -> ${s1.left})`);
    if (s1.pins) fail('1440: the gallery is still pinned');
    await p.evaluate((y) => scrollTo(0, y - 100), top); await settle(p, 600);
    const v = await p.evaluate(() => { const r = document.querySelector('[data-emaki] .emaki img').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    const before = await p.evaluate(() => document.querySelector('[data-emaki] .emaki').scrollLeft);
    await p.mouse.move(v.x, v.y); await p.mouse.down();
    for (let i = 1; i <= 10; i++) { await p.mouse.move(v.x + i * 40, v.y); await p.waitForTimeout(16); }
    await p.mouse.up(); await settle(p, 400);
    const after = await p.evaluate(() => ({ left: document.querySelector('[data-emaki] .emaki').scrollLeft, open: !!document.querySelector('dialog[open]') }));
    if (Math.abs(after.left - before) < 300) fail(`1440: dragging moved the strip ${Math.abs(after.left - before)} px`);
    if (after.open) fail('1440: a drag opened the viewer');
    await p.getByRole('button', { name: 'Unroll further' }).click(); await settle(p, 900);
    const arrow = await p.evaluate(() => document.querySelector('[data-emaki] .emaki').scrollLeft);
    if (Math.abs(arrow - after.left) < 200) fail('1440: the arrow did not unroll the strip');
    console.log(`1440: page scrolled ${s1.y - s0.y} px past it with the strip still; drag moved ${Math.round(Math.abs(after.left - before))} px`);
    await ctx.close();
  }
  // Phone: a native sideways scroller, no transform.
  {
    const [ctx, p] = await page(b, { viewport: { width: 375, height: 812 } });
    await p.goto(B + r); await settle(p);
    const m = await p.evaluate(() => { const v = document.querySelector('[data-emaki] .emaki'); return { ov: getComputedStyle(v).overflowX, sw: v.scrollWidth, cw: v.clientWidth }; });
    if (m.ov !== 'auto' || m.sw <= m.cw) fail(`375: overflow-x ${m.ov}, ${m.sw} vs ${m.cw}`);
    if ((await tx(p)) !== 0) fail('375: track transformed');
    await ctx.close();
  }
  // Reduced motion: never transformed while scrolling through.
  {
    const [ctx, p] = await page(b, { reducedMotion: 'reduce' });
    await p.goto(B + r); await settle(p, 2000);
    let worst = 0;
    for (let i = 0; i < 60; i++) { await p.mouse.wheel(0, 400); await p.waitForTimeout(40); worst = Math.max(worst, Math.abs((await tx(p)) || 0)); }
    if (worst !== 0) fail(`reduced motion: track moved ${worst}`);
    await ctx.close();
  }
  return 'EMAKI-OK';
}

async function content(b) {
  const base = JSON.parse(fs.readFileSync(__dirname + '/baseline-japan.json', 'utf8'));
  const [ctx, p] = await page(b, { javaScriptEnabled: false });
  let total = 0;
  for (const [r, strings] of Object.entries(base)) {
    await p.goto(B + r);
    const text = await p.evaluate(() => (document.querySelector('main') || document.body).textContent.replace(/\s+/g, ' '));
    for (const s of strings) { total++; if (!text.includes(s)) fail(`${r}: missing "${s.slice(0, 90)}"`); }
  }
  console.log(`${total} baseline strings checked across ${Object.keys(base).length} routes`);
  await ctx.close();
  return 'CONTENT-OK';
}

async function nojs(b) {
  const [ctx, p] = await page(b, { javaScriptEnabled: false });
  let n = 0;
  for (const r of ROUTES) {
    await p.goto(B + r); await settle(p, 800);
    const m = await p.evaluate(() => {
      const bad = [];
      const ps = [...document.querySelectorAll('main section[id] p')];
      for (const el of ps) {
        let o = 1; for (let e = el; e; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity);
        const rc = el.getBoundingClientRect();
        if (o < 0.99 || rc.width === 0 || rc.height === 0) bad.push(el.textContent.slice(0, 50) + ` (opacity ${o.toFixed(2)})`);
      }
      const hero = document.querySelector('[data-hero] img');
      return { count: ps.length, bad, hero: !!(hero && hero.complete && hero.naturalWidth > 0) };
    });
    n += m.count;
    if (!m.count) fail(`${r}: no passage paragraphs found`);
    m.bad.forEach((x) => fail(`${r}: ${x}`));
    if (!m.hero) fail(`${r}: hero image missing without JS`);
  }
  console.log(`${n} passage paragraphs checked`);
  await ctx.close();
  return 'NOJS-OK';
}

async function rm(b) {
  const [ctx, p] = await page(b, { reducedMotion: 'reduce' });
  for (const r of ['/japan/', '/japan/kansai/kyoto/', '/japan/kansai/kyoto/kinkaku-ji/', '/japan/topics/land/', '/japan/kansai/']) {
    await p.goto(B + r); await settle(p, 1500);
    const before = await p.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').map((a) => a.animationName || a.constructor.name));
    for (let i = 0; i < 30; i++) { await p.mouse.wheel(0, 500); await p.waitForTimeout(30); }
    await settle(p, 600);
    const after = await p.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').map((a) => a.animationName || a.constructor.name));
    const moving = await p.evaluate(() => [...document.querySelectorAll('[data-pinned], .pin-spacer')].length);
    if (before.length || after.length) fail(`${r}: running animations ${JSON.stringify([...before, ...after])}`);
    if (moving) fail(`${r}: GSAP pin active under reduced motion`);
  }
  await ctx.close();
  return 'RM-OK';
}

async function contrast(b) {
  const [ctx, p] = await page(b);
  let checked = 0;
  for (const r of ROUTES) {
    await p.goto(B + r); await settle(p, 1200);
    const res = await p.evaluate(() => {
      const rgb = (s) => (s.match(/[\d.]+/g) || []).map(Number);
      const L = (c) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
      const ratio = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
      const over = (top, a, under) => top.map((c, i) => c * a + under[i] * (1 - a));
      const theme = document.querySelector('[data-theme]');
      const ground = rgb(getComputedStyle(theme).backgroundColor);
      // Worst case for the atmosphere: the indigo glow at its strongest over the ground.
      const glow = over([59, 79, 143], 0.34, ground);
      const SCRIM = [6, 8, 14];
      const out = [];
      const texts = [...document.querySelectorAll('main *')].filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && e.offsetParent && !e.closest('[aria-hidden="true"], .sr-only, .maplibregl-map, [data-map-mode]'));
      for (const el of texts) {
        const cs = getComputedStyle(el);
        const fg = rgb(cs.color);
        const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700;
        const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
        const rc = el.getBoundingClientRect();
        let bg;
        const hero = el.closest('[data-hero]');
        const tile = el.closest('a.zoom');
        const frame = el.closest('.story-frame');
        if (hero) {
          // Composite the hero's three scrims over a white photograph at the text's worst point.
          const hr = hero.getBoundingClientRect();
          const fromBottom = (hr.bottom - rc.top) / hr.height; // top edge of the text: least scrim
          const fromTop = (rc.top - hr.top) / hr.height;
          const fromLeft = (rc.right - hr.left) / hr.width; // right edge: least left scrim
          const stops = (t, s) => { for (let i = 1; i < s.length; i++) if (t <= s[i][0]) { const [t0, a0] = s[i - 1], [t1, a1] = s[i]; return a0 + (a1 - a0) * ((t - t0) / (t1 - t0)); } return s[s.length - 1][1]; };
          const aB = stops(fromBottom, [[0, 0.95], [0.35, 0.88], [0.6, 0.7], [0.85, 0], [1, 0]]);
          const aT = stops(fromTop, [[0, 0.72], [0.22, 0], [1, 0]]);
          const aL = stops(fromLeft, [[0, 0.55], [0.55, 0], [1, 0]]);
          bg = over(SCRIM, aL, over(SCRIM, aT, over(SCRIM, aB, [255, 255, 255])));
        } else if (tile) {
          const tr = tile.getBoundingClientRect();
          const fromBottom = (tr.bottom - rc.top) / tr.height;
          const fromLeft = (rc.right - tr.left) / tr.width;
          const stops = (t, s) => { for (let i = 1; i < s.length; i++) if (t <= s[i][0]) { const [t0, a0] = s[i - 1], [t1, a1] = s[i]; return a0 + (a1 - a0) * ((t - t0) / (t1 - t0)); } return s[s.length - 1][1]; };
          const side = tile.querySelector('.tile-scrim-side');
          const S = [[0, 0.92], [0.45, 0.8], [0.7, 0.45], [1, 0]];
          const a = side ? stops(fromLeft, S) : stops(fromBottom, S);
          bg = over(SCRIM, a, [255, 255, 255]);
        } else if (frame) {
          bg = over(SCRIM, 0.6, [255, 255, 255]);
        } else {
          // Walk up for an opaque background; otherwise the brightest point of the atmosphere.
          bg = null;
          for (let e = el; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c.length >= 3 && (c.length === 3 || c[3] > 0.9) && !e.matches('[data-theme]')) { bg = c.slice(0, 3); break; } if (e.matches('[data-theme]')) break; }
          bg = bg || glow;
        }
        const k = ratio(fg.slice(0, 3), bg);
        if (k < need) out.push(`${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 40)}" ${k.toFixed(2)} < ${need}`);
      }
      return { n: texts.length, out };
    });
    checked += res.n;
    res.out.forEach((x) => fail(`${r}: ${x}`));
  }
  console.log(`${checked} text elements checked`);
  await ctx.close();
  return 'CONTRAST-OK';
}

async function lcp(b) {
  for (const r of ['/japan/kansai/kyoto/kinkaku-ji/', '/japan/']) {
    const [ctx, p] = await page(b);
    const cdp = await ctx.newCDPSession(p);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await p.goto(B + r, { waitUntil: 'load' });
    await settle(p, 3000);
    const v = await p.evaluate(() => new Promise((res) => {
      let last = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) last = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      setTimeout(() => res(last), 500);
    }));
    console.log(`${r}: LCP ${Math.round(v)} ms`);
    if (!(v > 0 && v <= 2500)) fail(`${r}: LCP ${Math.round(v)} ms`);
    await ctx.close();
  }
  return 'LCP-OK';
}

(async () => {
  const b = await chromium.launch();
  const fn = { hero, atmos, kanji, story, emaki, content, nojs, rm, contrast, lcp }[mode];
  if (!fn) { console.log('usage: node verify-redesign.js <hero|atmos|kanji|story|emaki|content|nojs|rm|contrast|lcp>'); process.exit(2); }
  const token = await fn(b);
  await b.close();
  if (fails.length) { console.log(`FAIL (${fails.length})\n` + fails.slice(0, 60).join('\n')); process.exit(1); }
  console.log(token);
})();
