# Granada Conference 2026 — Scanference

A client-side only QR code networking game built for Granada Conference 2026, branded with Acorn Technology theming.

## The Game

Each attendee gets a personal QR code (their name). Every pair of attendees shares a unique trivia question and a secret keyword answer. The goal is to find and match with as many people as possible.

### Rules

1. **Find someone** — scan their QR code with your camera (**Scan Someone**), or select their name from the **Look Up** page if you don't have camera access.
2. **Answer the question** — a trivia question appears (e.g. *"East, west, south and ____?"*). Type your answer.
3. **Score a point** — if the answer is correct you earn **+1 point** and that person is marked as **Done** for you.
4. **Wrong answer?** — you can keep trying, no penalty.
5. **Already matched?** — if you've already answered a pair, the app tells you and no extra points are awarded.
6. **Both directions** — each person must independently answer to earn their own point. Scanning someone gets you your point; they need to scan you back (or look up your name) to earn theirs.
7. **Score is personal** — points and completed matches are saved in `localStorage` per user name on your device. Switching to a different name loads that person's score.

### Lookup data format

Each pair has one entry in `public/lookup.json`:

```json
{
  "Alice Smith+Bob Jones": {
    "topic": "East, west, south and ____?",
    "keyword": "North"
  }
}
```

- **topic** — the question shown when the pair is scanned
- **keyword** — the correct answer (checked case-insensitively)
- Key order doesn't matter — the app tries both `A+B` and `B+A` at runtime

---

## Setup before an event

1. Populate `public/attendees.json` with the list of attendee names:
   ```json
   ["Alice Smith", "Bob Jones", "Carol White"]
   ```

2. Run the generator to create one unique question per pair:
   ```bash
   npm run generate-lookup
   ```
   This writes placeholder `topic`/`keyword` entries for every pair into `public/lookup.json`. The question bank in `scripts/generate-lookup.js` is shuffled randomly each run.

3. Edit `public/lookup.json` to customise any topics or keywords you want personalised.

4. Deploy — GitHub Actions builds and publishes to GitHub Pages on every push to `main`.

---

## Commands

```bash
npm install            # install dependencies
npm run dev            # start dev server at http://localhost:5173/scanference/
npm run build          # type-check + build to dist/
npm run preview        # preview the production build locally
npm run lint           # run ESLint
npm run generate-lookup  # generate lookup.json from attendees.json
```

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) triggers on push to `main`:
1. Builds with `npm run build`
2. Deploys `dist/` to GitHub Pages via `actions/deploy-pages`

**Required GitHub repo settings** before first deploy:
- Settings → Pages → Source: set to **GitHub Actions**
- The `vite.config.ts` base is hardcoded to `/scanference/` — update if the repo is renamed.
