# Granada Conference 2026 — Scanference

A client-side only QR code networking app built for Granada Conference 2026, branded with Acorn Technology theming.

## How it works

1. On first visit the user picks their name from a pre-loaded attendee list (`public/attendees.json`).
2. Their name is stored in `localStorage` and rendered as a QR code on the home page.
3. They tap **Scan Someone** and point their camera at another attendee's QR code.
4. The app looks up the key `"yourName+theirName"` in `public/lookup.json` and displays the result — a free-text string defined ahead of the event.
5. No backend — everything runs in the browser.

## Setup before an event

1. Populate `public/attendees.json` with the list of attendee names:
   ```json
   ["Alice Smith", "Bob Jones", "Carol White"]
   ```

2. Populate `public/lookup.json` with the desired pairings:
   ```json
   {
     "Alice Smith+Bob Jones": "Alice and Bob both work in ML — great intro!",
     "Bob Jones+Alice Smith": "Bob scanned Alice — she wrote the keynote paper."
   }
   ```
   Keys are directional (`scanner+scanned`). Add both directions if needed.

3. Deploy — GitHub Actions builds and publishes to GitHub Pages on every push to `main`.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start dev server at http://localhost:5173/scanference/
npm run build     # type-check + build to dist/
npm run preview   # preview the production build locally
npm run lint      # run ESLint
```

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) triggers on push to `main`:
1. Builds with `npm run build`
2. Deploys `dist/` to GitHub Pages via `actions/deploy-pages`

**Required GitHub repo settings** before first deploy:
- Settings → Pages → Source: set to **GitHub Actions**
- The `vite.config.ts` base is hardcoded to `/scanference/` — update if the repo is renamed.
