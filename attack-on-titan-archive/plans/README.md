# Animation plans (emil-improve-animations audit, commit e07f0a1)

| # | Title | Severity | Status |
|---|---|---|---|
| 001 | Titan "enter" transition: ease-out, ~520 ms, full only once per session | HIGH | DONE |
| 002 | Mirror pair tabs: jump, don't scrub back | HIGH | DONE |
| 003 | Hover motion on images: transform/opacity only | MEDIUM | DONE |
| 004 | UI durations into budget (hover line, header hide) | MEDIUM | DONE |
| 005 | Reduced motion keeps feedback; hover movement gated; press transition | MEDIUM | DONE |
| 006 | Ending file content fades in on open (missed opportunity) | LOW | DONE |

Order: 004 first (adds the token others use), then 001, 002, 003, 005, 006. No other dependencies.
Tokens (app/globals.css): `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`.
