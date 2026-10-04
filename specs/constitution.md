<!--
Sync Impact Report
Version: unratified placeholder template -> 1.0.0 (initial constitution).
Principles: six unnamed template slots replaced by eight StudyPilot principles.
Added: product scope, latest-stable Next.js constraint, phase release gates, governance.
Removed: illustrative library/CLI rules that were template examples, not project policy.
Updated: .specify/memory/constitution.md (exact mirror), plan-template.md,
spec-template.md, tasks-template.md, and Chatgpt.md constitution references.
Reviewed: .chatgpt/commands/sp.constitution.md and sp.specify.md.
.specify/templates/commands/ does not exist; supplied commands remain unchanged.
Deferred: operational decisions are recorded in specs/spec.md; no template placeholders remain.
Scope override: user requested documentation in specs only; no feature branch, application
scaffolding, implementation plan, or executable task list is created. Supporting SpecKit
memory/template synchronization and prompt records follow the supplied command guidance.
-->

# StudyPilot Constitution

## Core Principles

### I. Student Value and Equal Access

StudyPilot MUST serve students through personal planning and private group collaboration.
Guest and Google accounts MUST have identical released feature permissions and configured
usage allowances. The product MUST NOT introduce teacher, class-representative, institutional
administrator, premium, advertising, voting, reputation, or leaderboard features under this
scope. A room creator's Leader label MUST NOT confer exclusive ordinary editing rights.
An operational report-handling function is separate from student-facing roles.

### II. Personal Privacy and Explicit Sharing

Personal courses, attendance, grades, documents, and drafts MUST remain account-scoped.
Room content, files, history, and live updates MUST require current membership. Every
protected read and mutation MUST enforce authorization outside the user interface.
Caches, drafts, and background operations MUST respect identity changes and access loss.
External AI handoff MUST expose the exact selected text before the student copies or opens
it; unrelated personal and room records MUST NOT be silently added. Uploaded instructions
and generated text MUST remain untrusted content, never operational authority.

### III. Deterministic and Explainable Academic Results

Attendance and grades MUST use testable deterministic rules shared across all views.
Students MUST supply their fixed university grade boundaries, points, and applicable
rounding policy. The app MUST NOT infer rules from university names or convert unrelated
scales arithmetically. Unknown scores, credits, and records MUST remain unknown rather than
becoming zero. Final, partial, target, and hypothetical values MUST be labelled distinctly.
Display rounding MUST NOT change eligibility. Historical results MUST identify their rule
version, and rule changes MUST NOT silently rewrite past results or earned marks.

### IV. Honest State and Recoverable Work

The interface MUST distinguish loading, empty, partial, invalid, stale, failed, and saved
states. Retries MUST NOT duplicate attendance, tasks, messages, pins, joins, or usage charges.
Shared edits MUST detect stale changes; drafts MUST survive recoverable failures without
claiming persistence. Deletion and cancellation MUST prevent late work from recreating
removed data. Shared changes MUST retain trustworthy actor/time history and honor the
published recovery policy. An unresolved retention or permission policy MUST gate the
affected capability rather than become an invented promise.

### V. Accessible and Responsive Everyday Use

Every released journey MUST work on a phone and by keyboard. Essential content MUST reflow
at 320 CSS pixels without page-level horizontal overflow; large tables may scroll within
labelled containers. Status MUST have text equivalents, focus MUST remain visible, forms
MUST have permanent labels, and dialogs MUST manage focus. Common touch actions MUST target
44 by 44 CSS pixels. Light, dark, and system appearance, text enlargement, and reduced motion
MUST be respected. No required action may depend solely on hover, dragging, or color.

### VI. Source-Grounded and Bounded Study Help

Generated study material MUST identify its source revision, coverage, output version, and
valid source references. Partial extraction MUST be visible; examples added by generation
MUST be distinguished from source examples. Structural validation MUST NOT be described as
semantic verification. Quizzes MUST remain self-study and MUST NOT alter academic records.
Daily usage reservations, retries, regeneration, file limits, and processing concurrency
MUST be bounded. Existing valid outputs MUST remain readable when a new operation fails or
the daily allowance is exhausted. No unlimited-free-provider assumption is permitted.

### VII. Specifications Before Implementation

Every phase MUST define prioritized user journeys, testable requirements, entities,
edge cases, dependencies, measurable outcomes, and release exclusions. Confirmed source
requirements, adopted working defaults, and unresolved launch decisions MUST be labelled.
Source screenshots and fixtures MUST NOT be treated as saved user data or proof of working
features. Implementation plans and tasks MUST follow specification review; this request
produces specifications only. Features absent from a release MUST not appear as working
navigation or controls. Changes to scope MUST update affected specifications and acceptance
criteria before their implementation is declared complete.

### VIII. Evidence-Based Quality and Sustainable Operation

Release evidence MUST include arithmetic boundary tests, cross-account and cross-room
denial checks, persistence/retry/conflict checks, accessible end-to-end journeys, and
representative mobile measurements relevant to the phase. AI phases additionally MUST
include source-alignment review using real controlled documents. Tests MUST use independent
expected outcomes, not merely duplicate production formulas. Failures MUST be diagnosable
without recording private grades, messages, document contents, invite secrets, or credentials
in ordinary logs. A phase MUST NOT be declared released from screenshots or mock interactions.

## Product and Technology Constraints

- The application MUST be a responsive English-language website built on the latest stable
  Next.js release available when implementation begins. Stable means a production release,
  not canary, beta, or release candidate. Record and lock the exact resolved version.
- On 2026-10-03, the official [release listing](https://nextjs.org/blog) and
  [September security release](https://nextjs.org/blog/september-2026-security-release)
  identify Next.js 16.3.8 as the current Active LTS release. This is a dated baseline, not
  permission to skip checking for a newer stable patch before scaffolding or release.
- App Router is the proposed routing baseline, following the official
  [installation guidance](https://nextjs.org/docs/app/getting-started/installation).
  Runtime, language tooling, data store, identity provider integration, file storage,
  hosting, and generation services are decisions for technical planning, not silently
  selected by these product specifications.
- Protected rendering and mutations MUST uphold the same ownership rules regardless of
  framework rendering or caching choices. Privileged credentials MUST remain server-side.
- Personal planning MUST function without forum or AI services. Rooms MUST remain private
  and invitation-based, with at most ten active members and a permitted one-person setup.
- Room Library files MUST respect the documented 10 MB limit; Study Help limits are a
  separate configurable policy. No payments or upsells are part of exhaustion handling.
- Institutional portal sync, native apps, embedded external chat, public room discovery,
  advanced grading exceptions, and automatic submission are outside the defined releases.

## Development Workflow and Release Gates

1. Read this constitution, the product specification, and the affected phase specification.
2. Confirm source traceability, adopted defaults, and any blocking operational decisions.
3. During later planning, record exact dependency versions and validate service capabilities.
4. Implement the independently testable journeys only within the phase's stated scope.
5. Verify that saved data, denied access, failed operations, and mathematical boundaries
   produce the specified outcomes. Include relevant mobile and keyboard review.
6. Record evidence against requirement and acceptance IDs. A failed privacy, arithmetic,
   data-loss, or essential accessibility check blocks the affected release.
7. Enable navigation only when the underlying released capability passes its gate.

The first personal-planner milestone comprises Phases 1–4. Collaborative MVP adds Phase 5.
Community and browser notifications follow in Phase 6; document study tools follow in
Phases 7–8. Every phase has its own quality gate; reliability is not deferred to the end.

## Governance

This is the initial adopted project constitution, version 1.0.0. Explicit user instructions
take precedence. Otherwise this constitution governs phase specifications and subsequent
plans; confirmed source requirements outrank proposed defaults. A conflict MUST be recorded
and resolved in the affected documents rather than silently implemented.

The canonical user-facing file is `specs/constitution.md`.
`.specify/memory/constitution.md` MUST remain an exact mirror for SpecKit commands.
Amendments MUST state the reason, affected principles, impacted phases/templates, and any
migration or acceptance changes. The project owner approves changes to product scope or
constitutional guarantees; routine clarifications may be documented within existing scope.

Use semantic versioning: MAJOR for incompatible principle changes/removals, MINOR for new
principles or materially expanded obligations, PATCH for clarification without changed
obligations. Update the amendment date and Sync Impact Report with every amendment.
Review constitution compliance when approving specifications, plans, and releases. Any
exception MUST name its scope, rationale, owner, and expiry or resolution condition.

**Version**: 1.0.0 | **Ratified**: 2026-10-03 | **Last Amended**: 2026-10-03
