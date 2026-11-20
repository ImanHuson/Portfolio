# Information architecture: tsu.edu.ph as of 20 Nov 2026

Source: one fetch each of the homepage, `/announcements/`, the four pages of `/announcements/2026-announcements/`, `/academics/colleges/` and the Academic Calendar page (saved locally as `*.html`; gitignored, not republished). The tree comes from `extract.py` → `ia.json`; the rest was read from the saved HTML.

## The navigation

| Menu | Shown on phones | Links | Notes |
|---|---|---|---|
| Top bar (`navbarTop`): GOV.PH, Data Privacy Office, Transparency Seal, Citizen's Charter, Bid Notices, Publications, ANBC 2026, Contact Us, Downloads, Career Portal, Careers @TSU, SDG | **No** (`is-hidden-mobile`) | 12 | The government-required links are hidden on phones here. They do appear again further down the page, so they are still reachable. |
| Main menu (`navbarMain`) | Yes, behind a burger | 91 across 7 menus | Below |

Main menu, top level → column groups (link counts):

- **About** (top-level link goes to `/`) → General Information 9, Others 1, Featured 4, Latest Articles 6 (**20**)
- **Admissions** → Getting Admitted 8, Online Services 1 (**9**)
- **Administration** → Offices 6, Other Information 1 (**7**)
- **Academics** → Offices 6, Other Information 6, Events & Activities 1, Portals 2 (**15**)
- **Research & Extension** (top-level link is `#`) → Offices 8, Publications & News Letters 4, Events & Activities **0** (**12**)
- **Planning & Quality Assurance** (top-level link is `#`) → Offices 4, Other Information 3, Environmental Policies 8 (**15**)
- **Portals** (top-level link goes to `/`) → Student 5, Faculty 4, Employee 4, Others **0** (**13**)

103 header links in total, plus two empty column headings ("Events & Activities", "Others").

## Where the top student tasks live

| Task | Path today | Notes |
|---|---|---|
| Today's class-mode notice (suspension, asynchronous, flexible learning) | Home → scroll to the Announcements block → item. Older: Home → More Announcements → 2026 Announcements → page 1–4 → item | **Announcements are not in the main menu.** The archive is grouped by year, not by type: class-mode notices (`conduct-of-asynchronous-classes-…`, `lifting-of-the-flexible-learning-week-…`) sit between congratulation posts and event notices. Several list links are image-only with no text. **14 of the 61 announcements posted in 2026 are class-mode changes** (online, asynchronous, flexible learning, back to face-to-face), counted from the headings of all four list pages. |
| Freshman admission requirements | Admissions → Getting Admitted → Freshmen Students | Reachable; the CAT online application is a separate link under "Online Services". |
| Academic calendar | Academics → Other Information → Academic Calendar | **The page's newest calendars are for 2023–2024.** The current "Collegiate calendar for the academic year 2026-2027" is posted only as an announcement, on page 2 of the 2026 list. Someone who follows the menu finds an out-of-date calendar. |
| Student portal | Portals → Student → Student Portal | Fine on desktop. On phones: burger → Portals → Student Portal. |
| A college's programmes | Academics → Colleges → College of Computer Studies | 11 colleges and schools listed. The college pages have no `<h1>` (see the accessibility audit). |

## Structural findings from the HTML (to confirm in the audit)

- `<html>` has no `lang` attribute (screen readers guess the language).
- The homepage has **no `<h1>`** and only two `<h2>`s.
- Both menu burgers are `<a role="button">` with no `href` and no `tabindex`. **Confirmed in a browser:** at phone width, 60 presses of Tab never reach the menu button and `focus()` on it does nothing; a tap opens it. Keyboard users on a narrow or zoomed screen can't open the main menu.
- Top-level menu items "About", "Portals" link to `/` and "Research & Extension", "Planning & Quality Assurance" link to `#`: clicking the label doesn't open a section page.
- The dropdown panels are fixed at `max-height:400px; overflow:auto`, so long menus scroll inside the panel.
- 38 `<img>` on the homepage, 16 of them without useful `alt` text.
- The library portal is linked once over `https` and once over plain `http`.
- Typo on the archive page: "2019 Annoucements".

## What the rebuild changes (draft, to test with the task test)

1. The Academic Calendar page shows the current year first, with past years below.
2. Urgent class-mode notices get their own top slot on the home page and their own filter ("Class schedule changes") in Announcements, dated and with an expiry, separate from news and congratulations.
3. Announcements and the Academic Calendar go into the main menu.
4. Portals are one row of plain outbound links, visible without opening a menu.
5. Every top-level label opens a real section page.
6. Government links (Transparency Seal, Citizen's Charter, Data Privacy Notice, Bid Notices, GOV.PH) stay, in the footer on every screen size.
