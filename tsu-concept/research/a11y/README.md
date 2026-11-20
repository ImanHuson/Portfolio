# Accessibility audit: tsu.edu.ph, 20 Nov 2026

**What was run:** `audit.mjs` (results in `axe-results.json`) on 8 pages: home, Admissions, Freshmen Students, Announcements, 2026 Announcements, Academic Calendar, Colleges, College of Computer Studies.
- axe-core 4.10.2 at phone width (375 px), WCAG 2.0, 2.1 and 2.2 A and AA rules. TSU's Content Security Policy blocks injected scripts, so the audit browser bypassed it for its own copy of axe.
- Scripted checks: page language, heading outline, images, keyboard Tab order, reflow at 320 px, and 200% zoom (a 1280 px laptop zoomed to 200% = 640 CSS px).
- The phone menu was then checked by hand in the browser.

Automated tools find roughly a third to a half of real accessibility problems. A screen-reader pass (TalkBack on Android, NVDA on Windows) is still to do.

## axe results

Every page fails the same four rules; the home page adds two more.

| Rule | WCAG | Impact | Pages (elements) | What it means here |
|---|---|---|---|---|
| `meta-viewport` | 1.4.4 Resize text (AA) | critical | all 8 | The viewport tag is `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no`, so **pinch-zoom is switched off** on phones. People with low vision can't enlarge the text. |
| `html-has-lang` | 3.1.1 Language of page (A) | serious | all 8 | `<html>` has no `lang`, so screen readers guess the language and may read English with the wrong voice. |
| `button-name` | 4.1.2 Name, role, value (A) | critical | all 8 (home: 15) | On every page one button has no text; on the home page the image slider adds 14 more (its arrows and dots). A screen reader announces them as just "button". |
| `color-contrast` | 1.4.3 Contrast (AA) | serious | all 8 (2026 Announcements: 3) | The "PST Source" link in the footer on every page, plus grey text on announcement cards. |
| `link-name` | 2.4.4 Link purpose, 4.1.2 (A) | serious | home (20), Academic Calendar (15) | Home: the slider's slides are links with `href=""`, `target="_blank"` and no text. The slides are image banners; their text (exam results, notices) isn't available to screen-reader users. |
| `target-size` | 2.5.8 Target size (AA, new in 2.2) | serious | home (12) | Slider dots and arrows are smaller than 24×24 px with no spacing. |

## Keyboard

- **The phone menu can't be opened with a keyboard.** The menu button is an `<a role="button">` with no `href` or `tabindex`. At 375 px wide, 60 presses of Tab never reached it, and calling `focus()` on it did nothing. A tap or click opens it. This affects anyone who navigates by keyboard (or switch device) on a narrow window or a zoomed laptop screen. WCAG 2.1.1 Keyboard (A).
- No "skip to content" link (WCAG 2.4.1 Bypass blocks, A). On desktop about 100 header links come before the page content.
- Focus indicator: the first 25 focused elements on each page all showed the browser's default outline. This passes 2.4.7 for those elements.

## Headings

- **No `<h1>`** on the home page, Colleges or College of Computer Studies.
- Levels are skipped: the home page jumps to `<h4>` card titles with only two `<h2>`s; the footer uses `<h5>` for "Quick Links", "Contact Details" and others on every page.
- The heading outline doesn't describe the page, so screen-reader users who jump by heading (the most common way to scan a page) get a poor map. WCAG 1.3.1 Info and relationships (A), 2.4.6 Headings and labels (AA).

## Images

- The GOV.PH seal in the top bar has **no `alt`** at all, on every page.
- Home page: 40 images, 17 with empty `alt=""`, which is correct for decoration. News images reuse the headline as `alt`, which is acceptable but redundant next to the headline.
- The logo's `alt` is the file label "Logo Header Light" instead of "Tarlac State University".
- The real problem is the slider banners (see `link-name`): they are images of text with no text alternative. WCAG 1.1.1 Non-text content (A).

## Contrast

Covered by axe above: the PST source link on every page and grey date or meta text on announcement cards. axe also left 2 home-page elements as "needs review" (text over images), so a manual check of the slider text is still to do.

## Reflow at 320 px

- **Admissions overflows**: the page is 843 px wide at a 320 px viewport, so the reader has to scroll sideways. One `<div>` is 831 px wide. WCAG 1.4.10 Reflow (AA).
- The home page is 365 px wide at 320 px: a smaller overflow, still a fail.
- The other six pages reflow correctly.

## 200% zoom

- At 640 CSS px (a 1280 px laptop at 200%) Admissions is again 843 px wide. The other seven pages fit.
- Together with the disabled pinch-zoom on phones, low-vision readers have no good way to enlarge the Admissions page.

## Language

`<html>` has no `lang` on any page (see `html-has-lang`). The content is in English, so the fix is `lang="en"`, with `lang="fil"` on any Filipino passages.

## Summary for the case study

Nine problems, in order of how many students they affect:

1. Pinch-zoom disabled on every page.
2. Phone menu unreachable by keyboard.
3. No page language.
4. Unnamed buttons (and 14 more in the home slider).
5. Slider banners that are images of text with no text alternative.
6. No `<h1>` and skipped heading levels.
7. Admissions page overflows at 320 px and 200% zoom.
8. Low-contrast text in the footer and on announcement cards.
9. Small slider controls.

All nine are fixable in the front-end templates without changing the CMS, which is the point to make to TSU.
