# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Scanference is a client-side only web application for QR code scanning at Granada Conference 2026, branded with Acorn Technology theming. Core concept:

- Users pick their name from a pre-loaded attendee list (`public/attendees.json`) on first visit
- The name is stored in `localStorage` and rendered as a QR code on the home page
- Users open their camera to scan another attendee's QR code
- The app fetches `public/lookup.json` and looks up the key `"${myName}+${scannedName}"` — returning a predefined text string
- No backend — all logic runs in the browser

## Commands

```bash
npm install       # install dependencies
npm run dev       # start dev server at http://localhost:5173/scanference/
npm run build     # type-check + build to dist/
npm run preview   # preview the production build locally
npm run lint      # run ESLint
```

## Architecture

```
src/
├── App.tsx                  # react-router-dom routes: / and /scan
├── main.tsx                 # MUI ThemeProvider + BrowserRouter (basename="/scanference")
├── hooks/
│   ├── useUserName.ts       # get-or-set name in localStorage (active)
│   └── useUserId.ts         # legacy UUID-based hook (unused)
└── pages/
    ├── HomePage.tsx         # name picker + QR code display; navigates to /scan
    └── ScanPage.tsx         # react-zxing camera scanner; fetches lookup.json on match

public/
├── attendees.json           # list of attendee names shown in the name picker
├── lookup.json              # static lookup table: { "nameA+nameB": "text", ... }
├── logo.png                 # Acorn Technology logo (white, shown top of pages)
└── acorn_monster_ny.svg     # decorative background illustration
```

## Theming

- MUI theme in `src/main.tsx`
- Primary colour: `#e91e8c` (hot pink/magenta)
- Body background: `acorn_monster_ny.svg` top-right + pink-to-white gradient
- Picker page: logo centered at top, full size
- QR page: logo fixed top-left, ~2/3 size

## Lookup Table

Edit `public/lookup.json` to define pairings before each deployment:

```json
{
  "Alice Smith+Bob Jones": "Alice and Bob should connect!",
  "Bob Jones+Alice Smith": "Bob scanned Alice — she wrote the keynote paper."
}
```

Keys are directional: `scanner_name+scanned_name`. Both directions must be added separately if needed.

## Attendee List

Edit `public/attendees.json` before each event:

```json
["Alice Smith", "Bob Jones", "Carol White"]
```

## Design & Architecture Decisions

Document decisions here so they are available across sessions. Add new entries when a non-obvious choice is made.

| Decision | Choice | Rationale |
|---|---|---|
| Language | TypeScript for all `src/` code | Type safety; enforced by `tsc` in the build step |
| Node scripts (`scripts/`) | Plain JavaScript (`.js`) | No `ts-node`/`tsx` in the project; scripts are simple one-offs and not compiled by Vite/tsc |
| Identity | Name string (not UUID) | Names are more human-friendly at a conference; names are picked from a pre-vetted list so collisions are avoided |
| QR code value | Attendee name string | Keeps QR codes human-readable and debuggable |
| Lookup key format | `"scanner+scanned"` (directional) | Allows different messages depending on who scanned whom |
| No backend | Static JSON files | Simplest possible deployment; no server costs or auth needed for a one-day event |
| UI library | MUI (Material UI) | Already in place from initial commit |
| Routing | react-router-dom with basename `/scanference/` | Matches GitHub Pages sub-path deployment |

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) triggers on push to `main`:
1. Builds with `npm run build`
2. Deploys `dist/` to GitHub Pages via `actions/deploy-pages`

**Required GitHub repo settings** before first deploy:
- Settings → Pages → Source: set to **GitHub Actions**
- The `vite.config.ts` base is hardcoded to `/scanference/` — update it if the repo is renamed.
