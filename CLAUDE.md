# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Scanference is a client-side only QR code networking game for Granada Conference 2026, branded with Acorn Technology theming. No backend — all state lives in the browser.

## Game Rules

Each attendee has a personal QR code (their name). Every pair of attendees shares a unique trivia question (`topic`) and secret answer (`keyword`).

1. Scan someone's QR code (or select their name from the dropdown) → see the topic question
2. Type the correct answer → earn **+1 point**, that person is marked **Done** for you
3. Wrong answer → try again (no penalty)
4. Already matched → no extra points awarded
5. Both people must answer independently to earn their own point
6. Score and completed pairs are stored in `localStorage` per device

## Commands

```bash
npm install              # install dependencies
npm run dev              # start dev server at http://localhost:5173/scanference/
npm run build            # type-check + build to dist/
npm run preview          # preview the production build locally
npm run lint             # run ESLint
npm run generate-lookup  # generate lookup.json from attendees.json
```

## Architecture

```
src/
├── App.tsx                    # react-router-dom routes: /, /scan, /lookup
├── main.tsx                   # MUI ThemeProvider + BrowserRouter (basename="/scanference")
├── hooks/
│   ├── useUserName.ts         # get-or-set name in localStorage
│   ├── useAttendees.ts        # fetch public/attendees.json
│   ├── useScore.ts            # per-user score + completed pairs in localStorage
│   └── useUserId.ts           # legacy UUID hook (unused, kept for reference)
└── pages/
    ├── HomePage.tsx           # name picker + QR code display + score summary
    ├── ScanPage.tsx           # camera scanner + answer input dialog
    └── LookupPage.tsx         # manual name lookup + answer input dialog (no camera)

public/
├── attendees.json             # list of attendee names shown in the name picker
├── lookup.json                # { "nameA+nameB": { topic, keyword }, ... }
├── logo.png                   # Acorn Technology logo (white)
└── acorn_monster_ny.svg       # decorative background illustration

scripts/
└── generate-lookup.js         # generates lookup.json from attendees.json
```

## Lookup Table Format

```json
{
  "Alice Smith+Bob Jones": {
    "topic": "East, west, south and ____?",
    "keyword": "North"
  }
}
```

- One entry per pair (not directional) — app tries both `A+B` and `B+A` at runtime
- `keyword` is checked case-insensitively
- Run `npm run generate-lookup` to regenerate from the question bank in `scripts/generate-lookup.js`

## Theming

- MUI theme defined in `src/main.tsx`
- Primary colour: `#e91e8c` (hot pink/magenta)
- Body background: `acorn_monster_ny.svg` top-right + pink-to-white diagonal gradient
- Picker page: logo centered at top, full size (56px)
- QR page: logo fixed top-left, 2/3 size (37px)

## Design & Architecture Decisions

Document decisions here so they are available across sessions. Add new entries when a non-obvious choice is made.

| Decision | Choice | Rationale |
|---|---|---|
| Language | TypeScript for all `src/` code | Type safety; enforced by `tsc` in the build step |
| Node scripts (`scripts/`) | Plain JavaScript (`.js`) | No `ts-node`/`tsx` in the project; scripts are simple one-offs not compiled by Vite/tsc |
| Identity | Name string (not UUID) | Names are human-friendly; picked from a pre-vetted list so collisions are avoided |
| QR code value | Attendee name string | Keeps QR codes human-readable and debuggable |
| Lookup key format | `"personA+personB"` (one entry per pair) | Direction doesn't matter; app tries both orderings at runtime |
| Scoring | `localStorage` only, per-user (keyed by name) | No backend needed; scores are personal/informal for a one-day event; switching user reloads the correct score |
| Answer checking | Case-insensitive string match | Simple and forgiving for a conference game |
| No backend | Static JSON files | Simplest possible deployment; no server costs or auth needed |
| UI library | MUI (Material UI) | Already in place from initial commit |
| Routing | react-router-dom with basename `/scanference/` | Matches GitHub Pages sub-path deployment |
| Dev server redirect | Custom Vite middleware: `/` → `/scanference/` | Prevents "configured with a public base URL" error on refresh in dev |
| Lookup page | Separate `/lookup` route with Autocomplete | Keeps ScanPage focused on camera; users without camera can still play |
| Autocomplete keyboard | `readOnly` on input | Suppresses mobile keyboard; user picks from list, not free text |

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) triggers on push to `main`:
1. Builds with `npm run build`
2. Deploys `dist/` to GitHub Pages via `actions/deploy-pages`

**Required GitHub repo settings** before first deploy:
- Settings → Pages → Source: set to **GitHub Actions**
- The `vite.config.ts` base is hardcoded to `/scanference/` — update it if the repo is renamed.
