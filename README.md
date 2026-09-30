# HSC Study Tracker

An offline-first, mobile-friendly Bangladesh HSC study tracker and planner. It replaces a paper study-time log with fast digital entry, structured syllabus selection, planning, progress tracking, history, backup/restore, analytics, and browser reminders.

## Features

- Daily study log: date, subject, paper, chapter, start/end time, automatic duration, optional topic.
- Searchable dependent syllabus pickers for Physics, Chemistry, Biology, and Higher Mathematics, with separate 1st/2nd Papers.
- Planning: date + structured syllabus target + free-text topic + progress + reminder.
- Planning ↔ Daily Log linking by **date + subject + paper + chapter**; topic text never needs to match.
- Progress controls at 0/25/50/75/100%; 100% is shown as completed.
- Dashboard, study history with filters/sorting, subject-time analytics, edit/delete flows.
- IndexedDB persistence with a small localStorage fallback.
- JSON backup/restore and CSV study-history export.
- Light/dark theme.
- PWA manifest + service worker for offline app-shell caching.
- Responsive mobile/tablet/desktop layouts and accessible native form controls plus keyboard-focusable searchable pickers.

## Technology

React 19, TypeScript 7, Vite 8, Lucide React. No application backend is required.

The current package versions were pinned after checking their published npm versions in September 2026.

## Local development

Requires a current Node.js release compatible with Vite 8.

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

The Vite base is relative, so the same build works at the local root or at a GitHub Pages repository path such as `/daily/`.

## GitHub Pages

A workflow is included at `.github/workflows/deploy.yml`.

1. In the repository, open **Settings → Pages**.
2. Select **GitHub Actions** as the source if GitHub has not already configured it.
3. Push to `main`; the workflow installs dependencies, runs the production build and publishes `dist/`.

Expected project URL:

`https://<username>.github.io/daily/`

## Data storage and privacy

Core records are stored locally in the browser using IndexedDB. The application does not send study records to a backend or third-party analytics service. Clearing browser/site data can remove the local database, so regular JSON backups are recommended.

## Backup / restore

Use **Settings → Backup & restore** to export JSON. Import validates the backup shape and record fields before replacing or merging local data. Study history can also be exported as CSV.

## Notifications

Reminder settings are stored with each plan. The app requests browser Notification permission and checks due reminders while the app is running in the active browser/PWA context.

An ordinary static web application cannot guarantee arbitrary notification delivery after every browser/device has been fully terminated, and mobile browser behavior varies. The UI therefore does not claim guaranteed background delivery. The hourly option means hourly reminders **while the app can run the reminder check**.

## Architecture

```
src/
  components/      reusable fields and UI
  data/            centralized HSC syllabus
  lib/             persistence and backup logic
  pages/           dashboard, log, planning, history, progress, settings
  App.tsx          app shell/navigation/reminder coordinator
```

The syllabus is ID-based so session/plan records do not duplicate chapter strings unnecessarily.

## Syllabus sources

The centralized syllabus was built against the Bangladesh National Curriculum and Textbook Board (NCTB) higher-secondary curriculum/syllabus resources and cross-checked against Bangladesh HSC textbook-aligned chapter lists. The primary official references are:

- NCTB: [Higher Secondary Curriculum](https://nctb.gov.bd/site/files/e977a7e5-be01-4c42-99ac-bc966d334ae7/%E0%A6%89%E0%A6%9A%E0%A7%8D%E0%A6%9A-%E0%A6%AE%E0%A6%BE%E0%A6%A7%E0%A7%8D%E0%A6%AF%E0%A6%AE%E0%A6%BF%E0%A6%95)
- NCTB: [SSC & HSC syllabus page](https://nctb.gov.bd/site/page/9a90c854-ce5f-4d77-9915-1ecd0953079d/SSC-%26-HSC-Syllabus)
- NCTB: [2024–25 higher-secondary textbook list](https://nctb.gov.bd/pages/static-pages/6922dbf9933eb65569e0dc01)

When NCTB publishes a revised curriculum, update only `src/data/syllabus.ts`; the UI and data model consume the centralized IDs.

## Notes

No fake study records are seeded on startup. A student starts with an empty local workspace.

Because this repository is private, GitHub Pages availability also depends on the repository/account Pages permissions and settings.
