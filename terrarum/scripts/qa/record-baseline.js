// Records each Japan route's citable text (passage paragraphs, facts, headings) so the redesign can prove nothing was lost.
const { chromium } = require('playwright'); const fs = require('fs');
const B = 'http://localhost:8790/Portfolio/terrarum';
const routes = process.argv.slice(3); const out = process.argv[2];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ javaScriptEnabled: false });
  const res = {};
  for (const r of routes) {
    await p.goto(B + r);
    res[r] = await p.evaluate(() => {
      const main = document.querySelector('main') || document.body;
      const norm = s => s.replace(/\s+/g, ' ').trim();
      const paras = [...main.querySelectorAll('p, li, dd, h1, h2, h3, figcaption')].map(e => norm(e.textContent)).filter(t => t.length > 40);
      return [...new Set(paras)];
    });
  }
  fs.writeFileSync(out, JSON.stringify(res, null, 1)); console.log(Object.entries(res).map(([k,v]) => k+' '+v.length).join('\n'));
  await b.close();
})();
