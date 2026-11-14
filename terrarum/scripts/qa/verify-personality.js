// Gate checks for the Japan personality round (brush type, glass, sakura, the
// hanging-scroll gallery, hanko and omikuji, live data, sound). Each mode prints
// a success token only after every assertion passes; failures list what failed.
// Needs playwright and the static build served at http://localhost:8790/Portfolio/terrarum
// (a folder holding Portfolio/terrarum -> terrarum/out, served by python3 -m http.server 8790).
// `sound` also needs ffprobe.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const B = 'http://localhost:8790/Portfolio/terrarum';
const ROUTES = fs.readFileSync(__dirname + '/routes.txt', 'utf8').split('\n').filter(Boolean);
const JAPAN = ROUTES.filter((r) => r.startsWith('/japan/'));
const PLACES = JAPAN.filter((r) => r.split('/').filter(Boolean).length === 4 && !r.includes('/topics/'));
const KINKAKU = '/japan/kansai/kyoto/kinkaku-ji/';
const CONTROL = '/maldives/kaafu/male/hukuru-miskiy/';
const OUT = path.resolve(__dirname, '../../out');
const mode = process.argv[2];
const fails = [];
const fail = (m) => fails.push(m);
const wait = (p, ms = 1200) => p.waitForTimeout(ms);

async function open(b, opts = {}) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  return [ctx, await ctx.newPage()];
}
async function scrollBy(p, px, steps = 8) {
  for (let i = 0; i < steps; i++) { await p.mouse.wheel(0, px / steps); await p.waitForTimeout(40); }
}

async function brush(b) {
  const [ctx, p] = await open(b);
  for (const r of JAPAN) {
    await p.goto(B + r); await wait(p, 900);
    const m = await p.evaluate(() => {
      const vis = (e) => { const s = getComputedStyle(e); const rc = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && rc.width > 0 && rc.height > 0; };
      const ja = [...document.querySelectorAll('[lang="ja"]')].filter(vis).filter((e) => e.textContent.trim());
      const badJa = ja.filter((e) => { const s = getComputedStyle(e); return !/Yuji Syuku/i.test(s.fontFamily) || !/sumi/.test(s.filter); }).map((e) => e.textContent.trim().slice(0, 12));
      const en = [...document.querySelectorAll('h1, h2')].filter(vis).filter((e) => !e.closest('[lang="ja"]'));
      const badEn = en.filter((e) => /Yuji Syuku/i.test(getComputedStyle(e).fontFamily.split(',')[0])).map((e) => e.textContent.trim().slice(0, 20));
      return { n: ja.length, badJa, badEn };
    });
    if (m.n === 0) fail(`${r}: no visible Japanese text`);
    if (m.badJa.length) fail(`${r}: Japanese not brushed: ${m.badJa.join(' | ')}`);
    if (m.badEn.length) fail(`${r}: English heading in brush: ${m.badEn.join(' | ')}`);
  }
  // The face must actually load, not just be named.
  await p.goto(B + KINKAKU); await wait(p, 1500);
  const loaded = await p.evaluate(async () => { await document.fonts.ready; return [...document.fonts].some((f) => /Yuji Syuku/i.test(f.family) && f.status === 'loaded'); });
  if (!loaded) fail('Yuji Syuku never loaded');
  await ctx.close();
  return `${JAPAN.length} Japan routes`;
}

async function glass(b) {
  const [ctx, p] = await open(b);
  for (const r of [KINKAKU, '/japan/', '/japan/kansai/kyoto/', '/japan/topics/land/']) {
    await p.goto(B + r); await wait(p, 900);
    const m = await p.evaluate(() => {
      const h = document.querySelector('header');
      const bf = getComputedStyle(h).backdropFilter || getComputedStyle(h).webkitBackdropFilter || '';
      const blurred = [...document.querySelectorAll('body *')].filter((e) => /blur/.test(getComputedStyle(e).backdropFilter || ''));
      const textOnGlass = blurred.filter((e) => e !== h && e.querySelector('p, li')).map((e) => e.className.toString().slice(0, 40));
      return { bf, textOnGlass };
    });
    if (!/blur/.test(m.bf)) fail(`${r}: header has no backdrop blur (${m.bf})`);
    if (m.textOnGlass.length) fail(`${r}: text blocks on glass: ${m.textOnGlass.join(' | ')}`);
  }
  await ctx.close();
  const css = fs.readdirSync(path.join(OUT, '_next/static/chunks')).filter((f) => f.endsWith('.css')).map((f) => fs.readFileSync(path.join(OUT, '_next/static/chunks', f), 'utf8')).join('');
  const rt = css.match(/@media \(prefers-reduced-transparency:\s*reduce\)\s*\{([^}]*\{[^}]*\})+/);
  if (!rt || !/backdrop-filter:\s*none/.test(rt[0])) fail('no reduced-transparency fallback without blur');
  // And under it, the header really loses the blur.
  const [c2, p2] = await open(b);
  const cdp = await c2.newCDPSession(p2);
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] });
  await p2.goto(B + KINKAKU); await wait(p2, 800);
  const bf2 = await p2.evaluate(() => getComputedStyle(document.querySelector('header')).backdropFilter);
  if (/blur/.test(bf2)) fail(`reduced transparency still blurs the header (${bf2})`);
  await c2.close();
  return 'header glass, fallback';
}

async function sakura(b) {
  const [ctx, p] = await open(b);
  for (const r of JAPAN) {
    await p.goto(B + r); await wait(p, 1000);
    // The hero branch was removed at the user's request (Nov 2026): no ornament over the opening photograph.
    const over = await p.evaluate(() => !!document.querySelector('[data-hero] [data-yozakura]'));
    if (over) fail(`${r}: ornament over the hero photograph`);
  }
  // Petals change as the page scrolls.
  await p.goto(B + KINKAKU); await wait(p, 1000);
  const shot = () => p.evaluate(() => { const c = document.querySelector('canvas.petals'); return c ? c.toDataURL() : null; });
  const a = await shot();
  if (!a) fail('no petal canvas');
  await scrollBy(p, 900); await wait(p, 150);
  const b1 = await shot();
  await scrollBy(p, 900); await wait(p, 150);
  const b2 = await shot();
  if (a && (b1 === a || b2 === b1)) fail('petal canvas does not change while scrolling');
  await ctx.close();
  // The season follows Japan's date; the strip carries no picture (prints were removed as pasted-on).
  // Each date's microseason is checked against the Nippon.com table: 地始凍 (12–16 Nov), 玄鳥至 (5–9 Apr), 鷹乃学習 (17–22 Jul), 款冬華 (20–24 Jan).
  for (const [iso, want, ja, kō] of [['2026-11-13T03:00:00Z', 'autumn', '秋', '地始凍'], ['2026-04-05T03:00:00Z', 'spring', '春', '玄鳥至'], ['2026-07-20T03:00:00Z', 'summer', '夏', '鷹乃学習'], ['2027-01-20T03:00:00Z', 'winter', '冬', '款冬華']]) {
    const [c, q] = await open(b);
    await q.clock.setFixedTime(new Date(iso));
    await q.goto(B + '/japan/kansai/kyoto/'); await wait(q, 1200);
    const m = await q.evaluate(() => { const s = document.querySelector('[data-season]'); const k = s && s.querySelector('[data-microseason] [lang="ja"]'); return s ? { season: s.dataset.season, text: s.textContent, imgs: s.querySelectorAll('img').length, ko: k && k.textContent.trim() } : null; });
    if (!m) fail(`${iso}: no season strip`);
    else {
      if (m.season !== want) fail(`${iso}: season ${m.season}, want ${want}`);
      if (!m.text.includes(ja)) fail(`${iso}: no ${ja}`);
      if (m.imgs) fail(`${iso}: the strip still shows ${m.imgs} image(s)`);
      if (!/Microseason \d+ of 72/.test(m.text)) fail(`${iso}: no microseason`);
      if (m.ko !== kō) fail(`${iso}: microseason ${m.ko}, want ${kō}`);
    }
    await c.close();
  }
  // Reduced motion: no petals.
  const [c3, p3] = await open(b, { reducedMotion: 'reduce' });
  await p3.goto(B + KINKAKU); await wait(p3, 800); await scrollBy(p3, 900); await wait(p3, 200);
  const rmPixels = await p3.evaluate(() => { const c = document.querySelector('canvas.petals'); if (!c || !c.width) return 0; const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i]) n++; return n; });
  if (rmPixels) fail(`reduced motion still draws ${rmPixels} petal pixels`);
  // Another country has none of it.
  await p3.goto(B + CONTROL); await wait(p3, 800);
  const ctl = await p3.evaluate(() => ({ y: !!document.querySelector('[data-yozakura]'), c: !!document.querySelector('canvas.petals'), s: !!document.querySelector('[data-season]') }));
  if (ctl.c || ctl.s) fail(`Maldives carries Japan ornament ${JSON.stringify(ctl)}`);
  await c3.close();
  return `${JAPAN.length} routes, 4 seasons`;
}

async function scroll(b) {
  const [ctx, p] = await open(b);
  for (const r of PLACES) {
    await p.goto(B + r); await wait(p, 700);
    const m = await p.evaluate(() => {
      const items = [...document.querySelectorAll('.scroll-item')];
      const mounted = items.filter((i) => i.querySelector('[data-mount] .kakejiku-roller') && getComputedStyle(i.querySelector('[data-mount]')).backgroundImage.includes('brocade'));
      return { n: items.length, mounted: mounted.length };
    });
    if (!m.n || m.mounted !== m.n) fail(`${r}: ${m.mounted}/${m.n} photos mounted`);
  }
  // Sway while the strip is dragged, settle after; the arrows unroll it to its end.
  await p.goto(B + KINKAKU); await wait(p, 1000);
  await p.evaluate(() => document.querySelector('[data-emaki]').scrollIntoView({ block: 'start' }));
  await wait(p, 800);
  const pt = await p.evaluate(() => { const r = document.querySelector('[data-emaki] .emaki img').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  let maxAngle = 0;
  await p.mouse.move(pt.x, pt.y); await p.mouse.down();
  for (let i = 1; i <= 12; i++) {
    await p.mouse.move(pt.x + i * 60, pt.y); await p.waitForTimeout(16);
    const a = await p.evaluate(() => Math.max(...[...document.querySelectorAll('[data-mount]')].map((e) => { const t = e.style.transform.match(/rotate\((-?[\d.]+)deg\)/); return t ? Math.abs(+t[1]) : 0; })));
    maxAngle = Math.max(maxAngle, a);
  }
  await p.mouse.up();
  if (maxAngle < 0.5) fail(`mounts never swayed (max ${maxAngle.toFixed(2)}°)`);
  await wait(p, 2500);
  const rest = await p.evaluate(() => Math.max(...[...document.querySelectorAll('[data-mount]')].map((e) => { const t = e.style.transform.match(/rotate\((-?[\d.]+)deg\)/); return t ? Math.abs(+t[1]) : 0; })));
  if (rest > 0.15) fail(`mounts did not settle (${rest.toFixed(2)}°)`);
  // Unroll to the end with the arrow: the last photo comes fully into view.
  for (let i = 0; i < 20; i++) { await p.getByRole('button', { name: 'Unroll further' }).click(); await p.waitForTimeout(250); }
  await wait(p, 900);
  const last = await p.evaluate(() => { const items = [...document.querySelectorAll('.scroll-item')]; const r = items[items.length - 1].getBoundingClientRect(); return { l: r.left, r: r.right, w: innerWidth }; });
  if (!(last.l >= -2 && last.r <= last.w + 2)) fail(`last scroll not fully shown at the end (${Math.round(last.l)}..${Math.round(last.r)} of ${last.w})`);
  await ctx.close();
  // Reduced motion: nothing sways or translates.
  const [c2, p2] = await open(b, { reducedMotion: 'reduce' });
  await p2.goto(B + KINKAKU); await wait(p2, 800);
  await p2.evaluate(() => document.querySelector('.scroll-item').scrollIntoView({ block: 'center' })); await wait(p2, 300);
  for (let i = 0; i < 8; i++) { await p2.mouse.wheel(0, 200); await p2.waitForTimeout(40); }
  const rm = await p2.evaluate(() => {
    const sway = [...document.querySelectorAll('[data-mount]')].some((e) => /rotate/.test(e.style.transform));
    const track = document.querySelector('.scroll-item').parentElement;
    return { sway, tf: getComputedStyle(track).transform };
  });
  if (rm.sway) fail('reduced motion: mounts sway');
  if (rm.tf !== 'none' && rm.tf !== 'matrix(1, 0, 0, 1, 0, 0)') fail(`reduced motion: track translated (${rm.tf})`);
  await c2.close();
  return `${PLACES.length} place galleries`;
}

async function objects(b) {
  const [ctx, p] = await open(b);
  await p.goto(B + KINKAKU); await wait(p, 900);
  await p.getByRole('button', { name: 'Save this place' }).first().click(); await wait(p, 500);
  const pressed = await p.getByRole('button', { name: 'Saved' }).first().getAttribute('aria-pressed').catch(() => null);
  const seal = await p.evaluate(() => { const h = document.querySelector('[data-hanko]'); if (!h) return null; const r = h.getBoundingClientRect(); return { text: h.textContent.trim(), w: r.width, bg: getComputedStyle(h).backgroundColor }; });
  if (pressed !== 'true') fail(`save button aria-pressed=${pressed}`);
  if (!seal || !seal.text || seal.w < 20) fail(`no visible hanko after saving (${JSON.stringify(seal)})`);
  await p.goto(B + '/saved/'); await wait(p, 900);
  const stamp = await p.evaluate(() => { const s = document.querySelector('[data-theme-stamps] .hanko'); return s ? { t: s.textContent.trim(), w: s.getBoundingClientRect().width } : null; });
  if (!stamp || !stamp.t || stamp.w < 60) fail(`saved page shows no stamp (${JSON.stringify(stamp)})`);
  // Omikuji: three draws, each slip links to a real Japan page.
  await p.goto(B + '/japan/'); await wait(p, 900);
  const draw = p.getByRole('button', { name: /Shake the box|Draw again/ });
  for (let i = 0; i < 3; i++) {
    await draw.click(); await wait(p, 1100);
    const href = await p.locator('.omikuji-slip a', { hasText: 'Go there' }).getAttribute('href').catch(() => null);
    if (!href || !href.includes('/japan/')) { fail(`draw ${i}: slip has no Japan link (${href})`); continue; }
    const res = await p.request.get(new URL(href, B + '/').toString());
    if (res.status() !== 200) fail(`draw ${i}: ${href} -> ${res.status()}`);
  }
  await ctx.close();
  return 'hanko, stamp book, omikuji x3';
}

async function live(b) {
  // Live feeds.
  const [ctx, p] = await open(b);
  await p.goto(B + '/japan/topics/land/'); await p.locator('[data-quakes]').scrollIntoViewIfNeeded();
  await p.waitForSelector('[data-quakes-updated], [data-quakes-failed]', { timeout: 30000 }).catch(() => {});
  const q = await p.evaluate(() => ({ up: document.querySelector('[data-quakes-updated]')?.textContent, failed: !!document.querySelector('[data-quakes-failed]'), canvas: !!document.querySelector('[data-quakes] canvas') }));
  if (!q.up) fail(`quake map: no updated time (failed=${q.failed})`);
  if (!q.canvas) fail('quake map: no map canvas');
  await p.goto(B + '/japan/kansai/kyoto/'); await wait(p, 2000);
  const now = await p.evaluate(() => { const s = document.querySelector('[data-season]'); return s ? s.textContent : ''; });
  const jpTime = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo' }).format(new Date());
  const [hh] = jpTime.split(':');
  if (!new RegExp(`${hh}:\\d\\d`).test(now)) fail(`Kyoto strip lacks Japan time ${jpTime}: ${now.slice(0, 120)}`);

  await ctx.close();
  // Blocked: honest failure states.
  const [c2, p2] = await open(b);
  await c2.route(/earthquake\.usgs\.gov|api\.open-meteo\.com/, (r) => r.abort());
  await p2.goto(B + '/japan/topics/land/'); await p2.locator('[data-quakes]').scrollIntoViewIfNeeded();
  const blocked = await p2.waitForSelector('[data-quakes-failed]', { timeout: 15000 }).then(() => true).catch(() => false);
  if (!blocked) fail('quake map: no failure note with USGS blocked');
  await p2.goto(B + '/japan/kansai/kyoto/'); await wait(p2, 2000);
  const w = await p2.evaluate(() => document.querySelector('[data-season]')?.textContent || '');
  // Weather that fails is left out quietly: the time and season still show, with no error text.
  const jt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', timeZone: 'Asia/Tokyo' }).format(new Date());
  if (!new RegExp(`${jt}:\\d\\d`).test(w)) fail(`Kyoto strip lost its time with Open-Meteo blocked: ${w.slice(0, 120)}`);
  if (/could not be reached|°C|Open-Meteo/.test(w)) fail(`Kyoto strip shows weather text with Open-Meteo blocked: ${w.slice(0, 120)}`);
  await c2.close();
  return `quakes ${q.up}`;
}

async function sound(b) {
  const src = fs.readFileSync(path.resolve(__dirname, '../../lib/content/sounds.ts'), 'utf8');
  const themes = fs.readFileSync(path.resolve(__dirname, '../../lib/themes.ts'), 'utf8');
  const files = [...src.matchAll(/file: "([^"]+)"/g)].map((m) => m[1]);
  for (const id of ['jp-koto', 'jp-shakuhachi']) if (!themes.includes(`"${id}"`)) fail(`Japan theme does not use ${id}`);
  const durs = [];
  for (const f of files) {
    const p = path.join(OUT, f);
    if (!fs.existsSync(p)) { fail(`missing ${f}`); continue; }
    const d = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]).toString().trim();
    if (!(d > 10)) fail(`${f}: duration ${d}`);
    durs.push(`${path.basename(f)} ${Math.round(d)}s`);
  }
  for (const m of src.matchAll(/license: "([^"]+)"/g)) if (!/^(CC BY|CC0|Public domain)/.test(m[1])) fail(`unexpected licence ${m[1]}`);
  const [ctx, p] = await open(b);
  await p.goto(B + '/sources/'); await wait(p, 600);
  const t = await p.evaluate(() => document.body.innerText);
  for (const want of ['Torsodog', 'Araki Kod', 'Shika no T']) if (!t.includes(want)) fail(`/sources/ lacks ${want}`);
  for (const f of files) { const r = await p.request.get(`${B}/${f}`); if (r.status() !== 200) fail(`${f} served ${r.status()}`); }
  await ctx.close();
  return durs.join(', ');
}

const MODES = { brush, glass, sakura, scroll, objects, live, sound };
(async () => {
  if (!MODES[mode]) { console.log('usage: verify-personality.js <' + Object.keys(MODES).join('|') + '>'); process.exit(2); }
  const b = await chromium.launch();
  let info = '';
  try { info = await MODES[mode](b); } catch (e) { fail(String(e.stack || e).slice(0, 400)); }
  await b.close();
  if (fails.length) { console.log(fails.join('\n')); console.log(`${mode.toUpperCase()}-FAIL`); process.exit(1); }
  console.log(info);
  console.log(`${mode.toUpperCase()}-OK`);
})();
