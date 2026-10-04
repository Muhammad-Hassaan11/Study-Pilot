---
id: 0003
title: Build initial guest planner
stage: green
date: 2026-10-04
surface: agent
model: GPT-6
feature: studypilot
branch: master
user: SUPREME TRADERS
command: Start building studypilot based on specs folder
labels: [implementation, foundation, planner, nextjs]
links:
  spec: specs/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - package.json
  - package-lock.json
  - tsconfig.json
  - next.config.ts
  - next-env.d.ts
  - .gitignore
  - src/lib/model.ts
  - src/lib/store.ts
  - src/app/api/workspace/route.ts
  - src/app/layout.tsx
  - src/app/[[...view]]/page.tsx
  - src/app/error.tsx
  - src/app/globals.css
  - src/components/workspace.tsx
  - specs/001-foundation/plan.md
  - specs/001-foundation/tasks.md
  - tests/planner.test.ts
  - tests/browser/planner.spec.ts
  - playwright.config.ts
  - README.md
tests:
  - npm.cmd test
  - npm.cmd run typecheck
  - npm.cmd run build
  - npx.cmd playwright test
  - Desktop and 320px mobile screenshot review
---

## Prompt

Start building studypilot based on specs folder 

## Response snapshot

Implemented an initial guest planner on stable Next.js 16.3.8: SQLite-backed guest identity, authorized writes, courses, recurring classes, deadlines, Overview, preferences, and explicit guest deletion. Added domain and browser tests and local running instructions. Google identity/linking, complete academic-period/occurrence editing, and later phases remain documented release gates.

## Outcome

- Impact: A runnable, empty-first guest planner with real server persistence.
- Tests: Four domain tests and four browser tests pass; TypeScript and production build verified. Browser tests cover failed-save draft retention, focus, reload, 320px layout, cross-origin rejection and account isolation.
- Files: Application, pinned dependency lock, implementation plan/tasks, tests and README.
- Next prompts: Complete foundation lifecycle/Google linking and planner academic periods plus dated occurrence editing.
- Reflection: Explicitly distinguish a useful development increment from full phase acceptance; no credentials or production hosting were assumed.

## Evaluation notes (flywheel)

- Failure modes observed: npm network queries required escalation; sandboxed tsx failed in the Windows user-info call and passed outside sandbox. Browser test label casing corrected. Native dialog initial focus repaired after browser evidence. PowerShell text encoding repaired and scanned for mojibake.
- Graders run and results: Domain tests PASS; browser tests PASS; typecheck PASS; production build PASS.
- Prompt variant: none.
- Next experiment: Academic period boundaries and stable dated recurrence revisions, with independent time fixtures.
