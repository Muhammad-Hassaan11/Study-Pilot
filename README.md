# StudyPilot

A working guest-planner development milestone based on `specs/001-foundation` and `specs/002-planner-overview`. This is not yet the complete Phase 1–2 release.

## Run locally

Use Node.js 22.13 or newer (validated on Node 26.3.1) and a persistent local disk.

```powershell
npm.cmd ci
npm.cmd run dev
```

Open http://localhost:3000 and continue as a guest. Accounts start empty. In shells without PowerShell's npm script restriction, `npm` works in place of `npm.cmd`.

```powershell
npm.cmd test
npm.cmd run typecheck
npx.cmd playwright test
npm.cmd run build
npm.cmd start
```

Browser tests use installed Google Chrome and start the development server if needed. The tests create isolated guest accounts and use synthetic records. Do not point them at a real public workspace. Test screenshots and traces are ignored under `test-results/`.

## Implemented

- Responsive Overview, courses, timetable, deadlines, and settings routes, with browser navigation.
- Server-persisted guest sessions and honest recovery copy. No fabricated account records.
- Course creation/editing, optional credits and course color, archive/restore.
- Weekly recurring class creation, upcoming/today views, rooms, and overlap indicators.
- Deadline creation/editing, notes, type filters, completion and reopening. Dashboard counts derive from the same records.
- Profile, study timezone, and light/dark/system appearance.
- SQLite transactions, hashed opaque HttpOnly session tokens, account-scoped reads and writes, stale revision rejection, idempotent mutation retries, same-origin mutation checks.
- Failed-save drafts retained in open forms, native modal focus management, offline save prevention, cross-tab update/sign-out notifications.
- Explicit guest sign-out warning and confirmed immediate local workspace deletion.

Next.js **16.3.8** and React **19.3.0** were verified against npm's stable tags at implementation and locked exactly. App Router conventions were checked against [official installation guidance](https://nextjs.org/docs/app/getting-started/installation) and the installed Next.js documentation. Remaining package versions are pinned in `package.json` and `package-lock.json`.

## Storage and security boundaries

`src/lib/store.ts` uses Node's built-in SQLite support. The default database is `.data/studypilot.sqlite`, outside public assets and excluded from Git. Override `STUDYPILOT_DB_PATH` to choose another persistent path. WAL/SHM sidecars are part of live storage; use a proper SQLite backup procedure rather than copying only an active database file.

Records are on this server, not in browser local storage. The guest session cookie lasts up to one year. Losing the cookie or signing out makes that guest workspace inaccessible. Google linking/recovery is not implemented. Deleting the workspace removes its live database records and invalidates all its sessions; this development setup creates no application backups. SQLite deletion is logical deletion, not a promise of forensic disk erasure.

Production uses Secure cookies and therefore requires HTTPS. This single-process/local-disk architecture is not configured for ephemeral/serverless or horizontally scaled deployment. Production launch still requires request rate limits, storage quotas, operational monitoring, a backup/retention/purge policy, recovery decisions, and deployment-specific origin/proxy verification. Do not expose this preview as a public service yet.

## Verification and remaining release gates

Domain tests exercise account isolation, forged/invalid sessions, deletion, stale writes, idempotent retries, exact deadline boundaries, completion/reopening, DST gap/overlap rejection, weekly class selection, overlaps, and archiving. Browser tests cover real save/reload flows, settings persistence, mobile width, failure draft retention, dialog focus, cross-origin denial, and separate browser identities.

This increment intentionally leaves full phase gates open:

1. **Foundation:** Google OAuth and safe linking/conflict recovery; production account lifecycle/retention; full accessibility and representative user/performance measurements.
2. **Planner:** academic periods/boundaries; recurrence editing with preserved dated history; cancellation/rescheduling; explicit offset selection for ambiguous local times; complete offline/reconnect and concurrency acceptance suite. Ambiguous or nonexistent deadline times are rejected with correction guidance. Classes at DST transition gaps/overlaps show a warning instead of guessing an instant.
3. **Later phases:** attendance, grading/GPA, rooms, community, notifications, and study AI remain unimplemented and absent from navigation.

No phase is claimed released. The next development increment should complete the foundation identity/lifecycle gates and planner period/occurrence model before starting attendance or grading.
