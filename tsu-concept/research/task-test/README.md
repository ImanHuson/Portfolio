# Task test: script for 5 classmates

About 10 minutes per person. Run it on **their own phone**, on mobile data if possible (that is how most students reach the site). You run it twice: now on the real tsu.edu.ph, and later on the concept, with the same people if you can.

## Before you start (read this out)

> "I'm testing a website, not you. There are no wrong answers. I'll ask you to find five things on the Tarlac State University website, and I'll time it and count your taps. Please think out loud. I won't record your name, your face or your voice, only the times, the tap counts and what you say about the site. You can stop at any time. Is that OK?"

Only continue on a clear yes. Write a participant code (P1–P5), never a name.

## Setup

- Open a new browser tab on **https://www.tsu.edu.ph/** and hand over the phone.
- Start a stopwatch when you finish reading each task. Stop it when they say "found it" and show you the right page, or after **2 minutes** (mark it "gave up").
- Count every tap that changes what's on screen (menu opens, links, back). Scrolling isn't a tap.
- Don't help. If they ask, say "What would you try?"
- Use Google only if they ask for it and say they would do that normally; note it.

## The five tasks (read exactly, in a different order for each person)

| # | Say | Counts as found |
|---|---|---|
| T1 | "Classes might be changed this week. Find the latest notice about class schedules, like online or asynchronous classes." | The most recent class-mode announcement page |
| T2 | "A cousin wants to enrol as a freshman next year. Find what documents they need." | The Freshmen Students admissions page with the requirement list |
| T3 | "Find when this semester's final exams are." | The 2026–2027 collegiate calendar. On 20 Nov 2026 it was only an announcement ("Collegiate calendar for the academic year 2026-2027"); the Academic Calendar page itself stopped at 2023–2024. Opening the old calendar counts as `wrong-page`. |
| T4 | "Go to the page where you log in to the student portal. Don't log in." | student.tsu.edu.ph login screen |
| T5 | "Find the list of programmes offered by the College of Computer Studies." | The CCS page listing its programmes |

Order to use: P1 T1–T5, P2 T2-T3-T4-T5-T1, P3 T3-T4-T5-T1-T2, P4 T4-T5-T1-T2-T3, P5 T5-T1-T2-T3-T4. Rotating stops the last task always benefiting from practice.

## After the five tasks, ask

1. "What do you usually go to the TSU website for?"
2. "Where do you normally hear about class suspensions or schedule changes first?" (Facebook page, group chat, teacher, website…)
3. "Which of the five was hardest? Why?"
4. "If you could change one thing on the site, what would it be?"

## Record it in `results.csv`

One row per person per task. Don't write names.

```
participant,round,task,order,seconds,taps,result,notes
P1,before,T1,1,48,3,found,"scrolled past news first"
```

- `round`: `before` (real site) or `after` (concept)
- `result`: `found`, `wrong-page` or `gave-up`
- Put the answers to the four questions in `notes.md`, by participant code.

## Privacy

Five people is a small study. Report medians and quotes without anything that could identify someone (no section, no year level, no "my blockmate who…").
