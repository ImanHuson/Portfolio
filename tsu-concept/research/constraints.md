# Constraints the rebuild must respect

Two kinds: what a Philippine state university's website is expected to carry (so the concept is something TSU could actually adopt), and what the concept itself may and may not do (so it stays legal and honest). Each line says where it comes from and how sure we are.

## 1. Government-website elements TSU already carries (keep all of them)

Checked on tsu.edu.ph on 20 Nov 2026 (`ia/home-2026-11-20.html`).

| Element | On TSU today | Basis | Concept does |
|---|---|---|---|
| GOV.PH link in a top bar | Yes: top bar, GOV.PH seal image (no `alt`), hidden on phones | Government Website Template (GWT): top bar with a GOVPH link. iGovPhil's own reference template ([gwt-static](https://github.com/iGovPhil/gwt-static), GPL-3.0) has it. DICT's guidelines name SUCs among the agencies the template is promoted to; [ICT MC 2015-001](https://dev.lawyerly.ph/laws/70583) requires it for sites on the government hosting service. | Keeps a top bar with a text "GOV.PH" link on every screen size. **No seal image** (see section 2). |
| Transparency Seal | Yes: top bar, home card, footer link and image | Transparency Seal page, linked from home. *To verify: the source requirement (DBM / General Appropriations Act).* | Link in header utilities and footer, as text. |
| Citizen's Charter | Yes: top bar, footer | *To verify: Anti-Red Tape law (RA 11032) requirement.* | Footer link. |
| Freedom of Information (FOI) portal | Yes: home card, footer | FOI for the executive branch (EO No. 2, s. 2016). | Footer link. |
| Data Privacy Notice / Data Privacy Office | Yes: top bar, footer | RA 10173 (Data Privacy Act). | Footer link. |
| Bid notices | Yes: top bar, footer | Procurement transparency. | Footer link. |
| Philippine Standard Time (PST) | Yes: footer widget from `gwhs.i.gov.ph/pst/gwtpst.js`, loaded with a cache-busting timestamp on every visit | GWT ("Added PST and Transparency Seal", gwt-static changelog 2016-03-04). | A small clock computed in the browser (`Asia/Manila`). The case study notes that production would keep the official source. |
| Bagong Pilipinas logo | Yes: footer image | *To verify: national branding circular.* | Not shown (it's a government mark); the case study says the real site would keep it. |
| Office address, phone, office hours | Yes: footer | Citizen-facing contact info. | Kept, copied verbatim with a source link. (Today: Mon closed, Tue–Fri 7:00 AM–6:00 PM.) |

## 2. Accessibility standard

- [DICT MC 004-17](https://legaldex.com/laws/prescribing-the-philippine-web-accessibility-policy-and-adopting-for-this) adopts **WCAG 2.0 AA** for national government websites ([PWAG](https://www.pwag.org/category/resources/philippine-laws-on-accessibility)).
- The concept targets **WCAG 2.2 AA**, which includes every 2.0 AA requirement, so it meets the local rule and the current international one.

## 3. What the concept may and may not use

| Rule | Why |
|---|---|
| Banner on every page: "Unofficial design concept by Iman Kasim. Not affiliated with or endorsed by Tarlac State University." Plus `<meta name="robots" content="noindex">`. | Avoids confusion with the real site; it's standard practice for unofficial redesigns ([Framer trademark guidelines](https://www.framer.com/ja/legal/trademark-guidelines/1.0), [Figma forum](https://forum.figma.com/ask-the-community-7/should-i-be-worried-about-copyright-when-creating-a-free-educational-design-website-based-on-existing-apps-and-websites-49060)). |
| **No TSU logo or seal, no GOV.PH seal, no Bagong Pilipinas or Transparency Seal images.** Text only. | Seals and logos are what make a copy look official. The national seal and arms are also restricted by the Flag and Heraldic Code (RA 8491). |
| **No login, password or payment forms.** Portals are plain links to the real `*.tsu.edu.ph` addresses. | A lookalike university page with a login form is a phishing page, whatever the intent. |
| Public TSU text may be reused, quoted with a link to its page. **No ads, no sale, no paid use.** | No copyright subsists in government works, but exploiting them for profit needs the agency's prior approval (RA 8293 Sec. 176; [summary](https://en.wikipedia.org/wiki/Copyright_law_of_the_Philippines), [ACCRALAW](https://accralaw.com/?p=7188)). |
| **No names, faces, emails or phone numbers of individual staff, faculty or students.** Officials by title only. News items keep their headline and date; photos are replaced. Photos of people are licence-free (CC0) stock only, captioned "Stock photo... Not TSU students.", and never of other universities' campuses (that would pass another school off as TSU). Added 20 Nov 2026 at the user's request. | RA 10173: identifiable names and photos are personal data, and consent is the default before posting them ([UP Diliman DPO opinion](https://privacy.upd.edu.ph/wp-content/uploads/2022/05/DPO-Opinion-20-15-Announcement-on-Graduates.pdf)). The university-wide phone number and address are institutional, not personal. |
| Don't copy TSU's HTML, CSS or JS, or the GWT template's code. | TSU's front end is its own work; gwt-static is GPL-3.0. The concept is written from scratch. |
| Crawl only the pages in scope, under 1 request a second, with a normal browser user agent. | Courtesy. `robots.txt` has no `Disallow` lines (comments only), checked 20 Nov 2026. |
| Respectful tone: measure problems, never mock the team; name the constraints we can't see (CMS, staffing, procurement, approvals). | The main reason unsolicited redesigns get dismissed ([The problem with unsolicited redesigns](https://medium.com/swlh/the-problem-with-unsolicited-redesigns-5c6d230354ed), [Creative Bloq](https://www.creativebloq.com/netmag/whats-point-unsolicited-redesigns-21410573)). |

## 4. What the real site runs on (so the case study doesn't overclaim)

- The site runs on the **Umbraco** CMS with a theme called Amplify: media paths are Umbraco's `/media/<id>/` format, the theme's background is literally `/media/4donicrn/amplify-umbraco-theme-pattern.png`, and the markup uses the Bulma CSS framework's classes (`navbar`, `is-hidden-mobile`, `columns`).
- The concept is a static front end only. Its content sits in data files laid out like CMS fields, so the case study can show how it would map back to Umbraco document types. It does not claim to replace the CMS.

## Open items to verify before publishing the case study

- The exact legal basis for the Transparency Seal, Citizen's Charter and Bagong Pilipinas logo requirements (marked *to verify* above).
- The current version of the GWT guidelines (the 2014 v1.6 PDF copy couldn't be downloaded from here).
