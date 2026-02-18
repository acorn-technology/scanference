# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Scanference is a client-side only web application for QR code scanning at events/conferences. Core concept:

- Each user gets a unique UUID (stored in `localStorage`) rendered as a QR code on the home page
- Users open their camera to scan another user's QR code
- The app fetches `public/lookup.json` and looks up the key `"${myId}+${scannedId}"` — returning a predefined text string
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
│   └── useUserId.ts         # get-or-create UUID in localStorage
└── pages/
    ├── HomePage.tsx         # displays user's QR code; navigates to /scan
    └── ScanPage.tsx         # html5-qrcode camera scanner; fetches lookup.json on match

public/
└── lookup.json              # static lookup table: { "uuidA+uuidB": "text", ... }
```

## Lookup Table

Edit `public/lookup.json` to define pairings before each deployment:

```json
{
  "uuid-of-person-a+uuid-of-person-b": "Alice and Bob should connect!",
  "uuid-of-person-b+uuid-of-person-a": "Bob scanned Alice — she wrote the keynote paper."
}
```

Keys are directional: `scanner_uuid+scanned_uuid`. Both directions must be added separately if needed.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) triggers on push to `main`:
1. Builds with `npm run build`
2. Deploys `dist/` to GitHub Pages via `actions/deploy-pages`

**Required GitHub repo settings** before first deploy:
- Settings → Pages → Source: set to **GitHub Actions**
- The `vite.config.ts` base is hardcoded to `/scanference/` — update it if the repo is renamed.
