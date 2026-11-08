# Alternatives to the brief's server stack

GitHub Pages serves static files: no database, no server code, nowhere to keep a secret key. The brief's stack (PostgreSQL, Supabase, server-side search, accounts, an AI companion) assumed a server. These are the replacements, what each costs, and whether it is built.

| Need (brief) | Replacement | Cost | Status |
|---|---|---|---|
| Database-backed search | **Pagefind**: indexes the exported HTML after `next build` (`package.json` build script) and searches it in the browser, loading only the index chunks a query needs | Free, MIT | **Built.** `components/ui/Search.tsx`; country names (including countries still in research) come from a small static index alongside it |
| Bookmarks, saved places, collections without an account | **localStorage** in the reader's browser (`lib/savedStore.ts`, `/saved/`) | Free | **Built.** Per browser; nothing leaves the device |
| Accounts and syncing saved places across devices | **Supabase from the browser**: its anon key is designed to be public, and row-level security policies decide what each signed-in user can read and write, so a static site can talk to it directly | Free tier (needs a Supabase project) | Not built. Needs the user's Supabase project URL and anon key. Only worth it if cross-device sync is wanted |
| AI cultural companion (needs a secret API key) | **A Cloudflare Worker** holding the key, calling Workers AI (free daily allowance) and answering only from passages Pagefind finds, with their citations. Static page → Worker → model; the key never reaches the browser | Free within Cloudflare's daily allowance; stop at the limit, no upgrade | Not built. `CF_ACCOUNT_ID` and `CF_API_TOKEN` are empty in this environment, and the token would need Workers deploy rights. Until then, search returns the cited passages themselves, which is the honest core of the companion |
| Editorial CMS with review states | Content stays as typed data in the repo; every passage carries a review status; changes go through commits. **Decap CMS** (Git-based, free) can add an editing UI over the same files later | Free | Data model built; UI not needed yet |
| Street-level imagery (Google Street View is paid and forbids storing imagery) | **Mapillary** (free account, token) for embeds; **Panoramax** (open, federated, CC BY-SA street imagery, strong in France); openly licensed 360° photos from Commons and Flickr via Openverse in **Pannellum** | Free | Pannellum built; Mapillary needs a token; Panoramax to evaluate when France opens |
| Maps | **MapLibre** with local Natural Earth shapes and **OpenFreeMap** street tiles (free, no key) | Free | Built |
| Video | `youtube-nocookie.com` embeds from official channels | Free | Not built: no embed verified yet |
