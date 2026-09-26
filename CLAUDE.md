# Portfolio

Single-file static site: `Iman_Kasim_Portfolio.html` (inline CSS/JS, Google Fonts). `KASIM_ImanHuson_BSCS-3B_cpu_scheduling.py` is a standalone coursework script, not part of the site.

## Design tooling (project skills in `.claude/skills/`)

| Skill | Use it for | Source |
|---|---|---|
| `design-taste-frontend` | Design direction for the portfolio; anti-template rules and pre-flight checklist | Leonxlnx/taste-skill (MIT) |
| `image-to-code` | Generate a design image, then implement it. Needs an image-generation tool — Claude Code has none built in, so this only works with one connected | Leonxlnx/taste-skill (MIT) |
| `design-md-reference` | Fetch a real brand's DESIGN.md tokens as reference | VoltAgent/awesome-design-md (MIT) |
| `web-design-guidelines` | Audit the HTML against Vercel's Web Interface Guidelines (`file:line` findings) | vercel-labs/agent-skills (MIT) |
| `playwright-cli` | Open the page in a real browser, screenshot, click through, check console | microsoft/playwright-cli (Apache-2.0) |

Suggested loop: direction (`design-taste-frontend`, optionally `design-md-reference`) → edit HTML → verify with `playwright-cli` screenshots at 375px and 1440px → audit with `web-design-guidelines`.

## Running playwright-cli

```bash
npm install -g @playwright/cli@latest
python3 -m http.server 8765 &          # file:// URLs are blocked by default
playwright-cli open http://localhost:8765/Iman_Kasim_Portfolio.html
playwright-cli screenshot
```

`.playwright/cli.config.json` selects Chromium. In Claude Code on the web, the bundled Playwright expects a newer Chromium than the one pre-installed, so also run `export PLAYWRIGHT_MCP_EXECUTABLE_PATH=/opt/pw-browsers/chromium` (don't run `playwright install`). Locally, run `playwright-cli install-browser chromium` once instead.
