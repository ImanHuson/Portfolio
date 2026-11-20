# TSU concept: research phase

Research for an **unofficial** front-end rebuild concept of [tsu.edu.ph](https://www.tsu.edu.ph/), done before any design work. Everything here was measured from the live site on **20 November 2026**. It is not affiliated with or endorsed by Tarlac State University.

| Part | Folder | Status |
|---|---|---|
| Baseline (Lighthouse, 5 runs per page) | [`baseline/`](baseline/) | Done |
| Accessibility audit (axe + scripted checks) | [`a11y/`](a11y/) | Done |
| Navigation map | [`ia/`](ia/) | Done |
| Task test with 5 classmates | [`task-test/`](task-test/) | Kit ready; **waiting on Iman to run it** |
| Constraints (government elements, legal limits) | [`constraints.md`](constraints.md) | Done; 3 legal bases marked *to verify* |

## Baseline

| Page | Runs | Perf | A11y | Best pr. | SEO | LCP | CLS | TBT | Weight | Requests |
|---|---|---|---|---|---|---|---|---|---|---|
| admissions | 5 | 90 | 83 | 89 | 85 | 2.8 s | 0.000 | 189 ms | 0.90 MB | 32 |
| announcements | 5 | 89 | 83 | 89 | 85 | 2.6 s | 0.000 | 204 ms | 0.90 MB | 32 |
| calendar | 5 | 62 | 79 | 89 | 85 | 59.0 s | 0.000 | 372 ms | 11.64 MB | 34 |
| colleges | 5 | 69 | 85 | 86 | 85 | 11.7 s | 0.000 | 180 ms | 4.17 MB | 44 |
| home | 5 | 68 | 67 | 89 | 92 | 5.0 s | 0.017 | 172 ms | 6.98 MB | 94 |

Medians of 5 Lighthouse 12 mobile runs per page (raw runs in `baseline/raw/`, screenshots stripped; `baseline/summarize.mjs` recomputes the table).

- **Images are the problem, not code.** On the home page images were 5.2 MB of about 7 MB in the first run: banners served as PNG, the biggest 822 KB. Lighthouse estimates about 4 MB saved by modern formats and about 1.6 MB by sizing images to the screen. (All sizes here are MiB, as Lighthouse reports them.)
- **The Academic Calendar page loads one 10.7 MB photo** (`img_2964.jpg`, used as the header background) and nothing current: its newest calendars are 2023–2024. Its LCP was about 60 s in 3 runs and about 4 s in 2, so the 59.0 s median comes from a split result, not a steady one.
- **Colleges** loads a 1.55 MB banner PNG; LCP 10–15 s in every run.
- **The home page embeds YouTube eagerly**: 19 of its 94 requests go to YouTube, plus DoubleClick ad-tracking requests that the player brings with it, before anyone presses play.
- Admissions and Announcements are close to fine (performance 89–90).
- Run-to-run spread on the home page: performance 63–72, LCP 4.8–10.8 s.

**A correction to what Claude told Iman in chat before this phase:** a single run had shown the home page at performance 55 and LCP 18.0 s. The 5-run medians are 68 and 5.0 s. The single run was an outlier; use these numbers.

## Accessibility

Full write-up: [`a11y/README.md`](a11y/README.md). axe found the same four failures on all 8 pages checked, and scripted checks found more:

1. **Pinch-zoom is disabled** on every page (`user-scalable=no, maximum-scale=1.0`). WCAG 1.4.4.
2. **The phone menu can't be opened by keyboard**: the menu button can't receive focus. Confirmed by hand. WCAG 2.1.1.
3. No page language (`<html>` without `lang`). WCAG 3.1.1.
4. Unnamed buttons on every page, 15 on the home page (the slider's controls). WCAG 4.1.2.
5. The home slider's banners are images of text inside links with no text. 20 unnamed links. WCAG 1.1.1, 2.4.4.
6. No `<h1>` on home, Colleges or CCS; skipped heading levels everywhere.
7. Admissions is 843 px wide at a 320 px screen and at 200% zoom. WCAG 1.4.10.
8. Low-contrast text (footer "PST Source" link, grey card text). WCAG 1.4.3.
9. Slider controls under 24 px. WCAG 2.5.8.

Lighthouse accessibility scores: 67 (home) to 85 (Colleges).

**Another correction:** in chat Claude said 16 of 38 home-page images lacked useful alt text, based on a quick text search. The browser check shows 1 image with no `alt` (the GOV.PH seal) and 17 with an empty `alt`, which is correct for decorative images. The real image problem is the slider banners above.

## Navigation

Full map: [`ia/README.md`](ia/README.md), tree in `ia/ia.json`.

- 103 links in the header: 12 in a top bar that is **hidden on phones**, 91 in a 7-menu main menu.
- Two top-level labels lead to `#` and two to the home page instead of a section page; two column headings are empty.
- **Announcements aren't in the main menu**, and the archive is grouped by year, not by type. **14 of the 61 announcements in 2026 are class-mode changes** (online, asynchronous, flexible learning, back to face-to-face), mixed in with congratulations and event posts.
- **The Academic Calendar page is out of date.** Its newest calendars are 2023–2024; the 2026–2027 collegiate calendar exists only as an announcement on page 2 of the 2026 list.
- The site runs on Umbraco with the Amplify theme, so every fix proposed must be possible in templates and content, not a new platform.

## Task test

Not run yet. The script, the five tasks, the consent wording and the empty results sheet are in [`task-test/`](task-test/). Run it with 5 classmates on their own phones before the build, so the "before" numbers exist; the same tasks run again on the concept later.

## Constraints

Full list with sources: [`constraints.md`](constraints.md).

- **Keep** what TSU's site carries as a government site: GOV.PH link, Transparency Seal, Citizen's Charter, FOI portal, Data Privacy Notice, bid notices, Philippine Standard Time, address and office hours. All as text, no seals.
- **Standard:** WCAG 2.2 AA, which covers DICT MC 004-17's WCAG 2.0 AA.
- **Concept limits:** "unofficial concept" banner and `noindex` on every page; no TSU logo or any government seal; no login, password or payment forms (portals are plain links); TSU's public text reused only unmonetised and with source links (RA 8293 Sec. 176); no names, faces or contact details of individuals (RA 10173); no copied code.
- Three legal bases are marked *to verify* before the case study is published (Transparency Seal, Citizen's Charter, Bagong Pilipinas logo).

## What this changes in the brief

1. **Academic Calendar becomes a scope page.** It's the clearest failure found: the menu leads to a page whose newest calendar is 2023–2024, three academic years behind. The concept shows the current year first, past years below.
2. **Class-mode notices get their own lane.** A "Class schedule changes" filter in Announcements and a dated top slot on the home page with an expiry, because they are almost a quarter of 2026's announcements (14 of 61) and the most time-critical.
3. **No image slider.** It causes three of the nine accessibility failures (images of text, unnamed slide links, small controls) and most of a fourth (14 of the home page's 15 unnamed buttons). The heaviest home-page images are banner PNGs; which of them belong to the slider is still to confirm. Notices that are images today become text.
4. **YouTube becomes a click-to-play facade** (thumbnail and play button; the player and its trackers load only on click).
5. **Pinch-zoom on, `lang="en"`, a real `<h1>` per page, a keyboard-operable `<button>` for the menu, and a skip link.** These are cheap and they are the headline accessibility fixes.
6. **Image budget:** AVIF/WebP at the displayed size, nothing above 200 KB, and the home page under 500 KB on first load (it's about 7 MB today).
7. **Task T3 in the task test now checks the calendar problem directly**: opening the 2023–2024 calendar counts as a wrong page.

## Caveats

- Lighthouse ran in a cloud container (not in the Philippines) with Lighthouse's simulated mobile throttling (slow 4G, 4x CPU slowdown). Absolute times, especially server response, differ from what a student in Tarlac sees; the comparison that matters is concept vs. original measured the same way. Real-user numbers would need Chrome UX Report data or tests from a phone in the Philippines.
- One day's snapshot. Homepage banners and news change weekly, so page weight moves with them.
- The task test hasn't been run, so nothing here yet says how real students experience the site.
