---
name: design-md-reference
description: Pull a real brand's DESIGN.md (colors, type scale, spacing, components) from VoltAgent/awesome-design-md to use as a reference when styling UI. Use when the user says "make it feel like Linear/Stripe/Vercel/etc.", asks for a design system to borrow from, or wants concrete tokens instead of vibes.
---

# DESIGN.md reference library

Source: https://github.com/VoltAgent/awesome-design-md (MIT, VoltAgent). Files are fetched on demand rather than vendored — the full set is ~2.8 MB and this repo is one HTML page.

## How to use

1. Pick the brand slug(s) that match the direction the user wants. Available slugs:

   airbnb, airtable, apple, binance, bmw, bmw-m, bugatti, cal, claude, clay, clickhouse, cohere, coinbase, composio, cursor, dell-1996, elevenlabs, expo, ferrari, figma, framer, hashicorp, hp, ibm, intercom, kraken, lamborghini, linear.app, lovable, mastercard, meta, minimax, mintlify, miro, mistral.ai, mongodb, nike, nintendo-2001, notion, nvidia, ollama, opencode.ai, pinterest, playstation, posthog, raycast, renault, replicate, resend, revolut, runwayml, sanity, sentry, shopify, slack, spacex, spotify, starbucks, stripe, supabase, superhuman, tesla, theverge, together.ai, uber, vercel, vodafone, voltagent, warp, webflow, wired, wise, x.ai, zapier

2. Fetch the file:

   ```
   https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/<slug>/DESIGN.md
   ```

   Use WebFetch, or `curl -sSL <url>` via Bash if WebFetch is unavailable.

3. Extract tokens (palette, type stack and scale, radii, spacing, shadows, motion) and map them onto the existing CSS custom properties in `Iman_Kasim_Portfolio.html` instead of adding a parallel set.

## Rules

- These are references, not templates. A personal portfolio that is a pixel-copy of Stripe or Apple reads as derivative — borrow structure and discipline (scale ratios, spacing rhythm, restraint), not brand colors or logos.
- Never copy a brand's logo, wordmark, or trademarked assets.
- Pair with `design-taste-frontend` for direction and `web-design-guidelines` for the audit afterwards.
