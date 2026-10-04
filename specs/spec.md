# Feature Specification: StudyPilot Phased Product

**Feature Branch**: Documentation on existing `master`; no feature branch created.  
**Created**: 2026-10-03  
**Status**: Draft specifications ready for phase planning; launch decisions remain explicit.  
**Input**: Read `project_specs/`, follow the supplied constitution/specification commands,
write detailed phased specifications, and build later on the latest Next.js version.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Plan my study day (Priority: P1)

A student enters as a guest or with Google, adds one course, class time, and deadline,
then sees the next class and urgent work without completing every setup screen.

**Why this priority**: A useful daily planner is the minimum independent product value.
**Independent Test**: Use an empty account, save one course/session/deadline, reopen the app,
and find the correct next class and pending item.

**Acceptance Scenarios**:

1. **Given** a new guest, **When** they save study data, **Then** real data replaces empty
   prompts and persists under their identity without a Google-only feature lock.
2. **Given** a failed deadline save, **When** the student retries, **Then** their draft remains
   and exactly one item is saved; the pending counter matches its list.

### User Story 2 - Understand academic progress (Priority: P1)

A student records attendance and weighted marks using their own university rules and
understands the actions required to reach a course target.

**Why this priority**: Incorrect attendance and grades undermine the product's core value.
**Independent Test**: Run the attendance, weighted-mark, and semester-GPA fixtures in Phases
3–4 with no room or AI data.

**Acceptance Scenarios**:

1. **Given** 12 attended of 18 recorded classes and 75% required, **When** progress is shown,
   **Then** six consecutive attendances are required, qualified by record completeness.
2. **Given** earned contribution 36, remaining weight 60, and raw target 80, **When** planning,
   **Then** the exact requirement is 44/60 and a sufficient two-decimal minimum is 73.34%.
3. **Given** missing credits, **When** semester results appear, **Then** a complete GPA is
   withheld and any partial value explicitly states coverage.

### User Story 3 - Complete a private group project (Priority: P1)

Students join through invitation, share responsibility for tasks and resources, coordinate
practice, and see recoverable, attributed changes.

**Why this priority**: Collaboration is the second core product pillar.
**Independent Test**: Two accounts join one room and exercise its board, chat, Library,
reminders, and recovery without personal academic records.

**Acceptance Scenarios**:

1. **Given** a named guest joins a room, **When** editing another member's task, **Then** the
   edit is allowed and attributed without requiring a Leader role.
2. **Given** a nonmember knows a room identifier, **When** requesting content, **Then** no
   tasks, names, files, activity, or messages are disclosed.

### User Story 4 - Get subject help and revise from slides (Priority: P2)

Students ask classmates, read grounded study notes, practise with quizzes, and deliberately
prepare a question for an external AI service.

**Why this priority**: These improve an already usable planner and collaboration product.
**Independent Test**: Use a named account, a subject question, and an authored source document;
verify citations, quiz scoring, and the exact copied handoff payload.

**Acceptance Scenarios**:

1. **Given** an unanswered subject question, **When** a peer replies, **Then** its author may
   mark it solved without votes, reputation, or a public ranking.
2. **Given** a partially readable file, **When** a summary appears, **Then** coverage identifies
   missing pages and no question relies on their unreadable content.
3. **Given** an unchecked excerpt option, **When** a question is copied, **Then** the excerpt
   is absent and opening a provider does not claim the question was sent.

### Edge Cases

All phase edge cases are release requirements: empty accounts; expired sessions; identity
link conflicts; duplicate and stale writes; zero denominators; grade boundaries; concurrent
tenth-member joins; source replacement; cancellation with late results; and quotas crossing
midnight. Partial failure MUST remain local to the affected feature.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The product MUST offer personal planning and private student collaboration with
  guest/Google feature parity and no institutional or premium roles.
- **FR-002**: Every released phase MUST meet its detailed requirements and common quality
  contract below. Phase requirements use unique `P01-FR-001` style identifiers.
- **FR-003**: Overview MUST aggregate authorized canonical data from released modules only;
  summaries MUST match their full views after a successful change.
- **FR-004**: Grade mapping MUST be student-configured, attendance explicitly recorded, and
  calculations distinguish unknown, actual, partial, target, and scenario values.
- **FR-005**: Rooms MUST remain invite-only, capped at ten current members, and equally editable
  for shared work. Leader is attribution, not a permission tier.
- **FR-006**: AI documents MUST remain private and source/version-bound; external question
  preparation MUST reveal exactly what will be copied or shared.
- **FR-007**: The application MUST implement the phase order and dependencies below. Later
  features MUST NOT block a working earlier milestone or appear as dead controls.
- **FR-008**: All source acceptance criteria applicable to a shipped capability MUST remain
  binding; a condensed phase requirement does not discard an edge case in the source.

### Key Entities

| Domain | Entities and relationships |
|---|---|
| Identity | Student, guest/linked account identity, profile, preferences, account deletion request |
| Planning | Student-owned academic period, course instance, recurring session, dated occurrence, deadline |
| Academic progress | Occurrence attendance, grading-system version, weighted assessment, target, final result |
| Collaboration | Room, membership, invitation, task, message, Library item, reminder, activity, report |
| Community | Subject, question, answer, solved state, report, notification and read state |
| Study Help | Document, source revision/page, processing job, output version, reservation, issue report |
| Practice and handoff | Quiz version, attempt, stable answer identity, selected excerpt and Ask AI draft |

These are business concepts, not a database schema or API contract. Identical course names
do not imply shared personal data. References MUST preserve ownership and same-room/source
relationships. Deletion and retention apply to derived artifacts as well as originals.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 9 of 10 representative student testers can enter, save one course,
  one class, and one deadline, then identify the next class within five minutes without help.
- **SC-002**: Every arithmetic fixture and boundary case in Phases 3–4 produces the stated
  result; dashboard and detailed-view values agree in all integration cases.
- **SC-003**: All tested cross-account and cross-room read/write attempts are denied with
  no private content disclosed; guest and Google parity cases all pass.
- **SC-004**: All retry, tenth-member race, pin duplication, stale edit, and late-result
  deletion scenarios preserve the defined counts and data invariants.
- **SC-005**: All essential journeys complete by keyboard and at 320 CSS pixels with 200%
  text enlargement; no essential control is lost in either theme.
- **SC-006**: Overview becomes usable within three seconds in at least 95 of 100 navigations
  on the measurement profile below; Phase 5 applies the same target to the initial room.
- **SC-007**: Every published AI-output reference in the controlled fixture suite targets
  a real page of the correct revision. Human review finds no unsupported substantive claim
  or answer-key error in the release fixture outputs; failures require repair and reevaluation.
- **SC-008**: A five-question attempt with three correct, one incorrect, and one skipped
  reports 3/5, 60%, and that exact breakdown; retries do not consume a new document slot.

Targets are acceptance goals, not achieved measurements. Proposed reproducible profile:
390 CSS-pixel phone viewport, 4x CPU slowdown, 1.6 Mbps download, 750 Kbps upload, 150 ms
latency; record actual browser/device and cold versus return-navigation results separately.
Use eight courses, fifty planner items, ten joined rooms, and a semester of attendance.
Room tests use ten members, 100 tasks, 200 Library items, and 3,000 historical messages.
These are test datasets, not account limits.

## Sources and Interpretation

| Supplied source | Primary coverage | Binding source acceptance IDs |
|---|---|---|
| [Overview](../project_specs/overview.md) | Phases 1–2 and cross-module cards | OV-01–OV-32 |
| [Attendance and GPA](../project_specs/attendence-gpa.md) | Phases 3–4 | AG-01–AG-70, conditional enhancements noted below |
| [Project room](../project_specs/project_room.md) | Phase 5 and reminder delivery | PR-01–PR-54 |
| [Study Help](../project_specs/study-help.md) | Phases 7–8 | SH-01–SH-72 |

The referenced original `StudyPilot-Full-Spec.md` and screenshot files are not present in
the supplied directory. This specification relies on the four supplied documents, not on
independent inspection of those missing artifacts. Source examples remain fixtures.
Detailed academic rules refine older Overview shorthand: preserve historical rule versions,
use exact threshold comparisons, and show 36 earned + 44 needed + 16 capacity + 4 lost.

## Phases and Dependencies

| Phase | Specification | Depends on | Independently demonstrable outcome |
|---|---|---|---|
| 1 | [Foundation and accounts](001-foundation/spec.md) | None | Guest/Google entry, preferences, identity protection |
| 2 | [Planner and Overview](002-planner-overview/spec.md) | 1 | Saved classes/deadlines and useful daily home |
| 3 | [Attendance](003-attendance/spec.md) | 1–2 | Correct dated records and shortage predictions |
| 4 | [Grading and GPA](004-grading-gpa/spec.md) | 1–2 | Custom grade rules, weighted marks, targets and GPA |
| 5 | [Private project rooms](005-project-rooms/spec.md) | 1; 2 for Overview integration | Complete private group workflow |
| 6 | [Community and notifications](006-community-notifications/spec.md) | 1–2, 5 for room alerts | Subject help and opt-in browser alerts |
| 7 | [Study documents and summaries](007-study-summaries/spec.md) | 1; release after 1–5 are stable | Private source-grounded revision workspace |
| 8 | [Practice quizzes and Ask AI](008-practice-ask-ai/spec.md) | 7 | Source-linked practice and reviewed external handoff |

Phase numbers indicate delivery order, not automatic permission to build. Phase 4 can be
tested independently of attendance once courses exist; rooms do not require a personal
course. Phase 6 is not a technical prerequisite for AI. Release milestones: personal MVP
after 1–4, collaborative MVP after 5, community increment after 6, Study Help after 7–8.

## Common Quality Contract

- **CQ-01 Ownership**: Deny unauthorized reads/mutations, files, live updates, and derived
  previews; clear identity-scoped visible content and drafts on account change.
- **CQ-02 Persistence**: Label saving/saved/failed accurately; retry once logically, retain
  drafts on failure, reconcile on reconnect, and detect stale overwrites.
- **CQ-03 States**: Every collection distinguishes loading, empty, failed, partial, stale,
  and denied states. Offline writes are disabled with retained safe drafts in initial scope.
- **CQ-04 Time**: Use the selected study timezone for local dates and recurring classes;
  retain absolute deadline instants, expose timezone in shared scheduling, handle ambiguous
  or nonexistent local times explicitly, and refresh time-sensitive views on focus/midnight.
- **CQ-05 Accessibility**: Meet Constitution V; also preserve browser Back, reading position,
  accessible exact dates, and dialog focus. Never announce every countdown tick.
- **CQ-06 Honesty**: No fabricated account data, fake progress, false notifications, invisible
  provider sharing, premature completion claims, or promises of unsupported history.
- **CQ-07 Verification**: Each phase must demonstrate its stories, source acceptance cases,
  error states, relevant security and concurrency checks, and measurable outcomes.

## Assumptions and Adopted Working Defaults

These are explicit proposals for later implementation, not claims of additional user approval.
They can be amended with corresponding tests before building the affected behavior.

- English v1; light/dark/system theme; quiet off-white/navy/indigo visual direction described
  in the sources. Validate colors rather than treating the suggested palette as audited.
- Separate Attendance and GPA workspaces; academic periods group course instances.
- Date-only deadlines show an editable 23:59 time. Recurrence stays in its study timezone.
- Default attendance applies to newly created courses only; exact per-course override.
- Grading uses continuous lower-inclusive percentage bands and no mapping-rounding unless
  the student selects a supported policy. Completed historical results are version-bound.
- One-member room setup, unassigned tasks, owner-at-completion contribution credit, and
  immutable ordinary chat are the initial room defaults.
- Initial room formats: PDF, PNG, JPEG, WebP, DOCX, XLSX, PPTX; maximum 10,000,000 bytes.
- Study Help proposed limits: 10,000,000 bytes, 50 pages/slides, three accepted source
  revisions per UTC day, one active document job/account; quiz default five, maximum ten.
- Forum detail is inferred from Overview, not a supplied standalone forum specification.
  Phase 6 explicitly marks its additional behavior as a proposed bounded baseline.

## Decisions Required Before Affected Releases

| Decision | Release gate | Interim behavior and resolution evidence |
|---|---|---|
| Guest storage and existing-Google-account linking conflict | 1 | Preserve both identities; no automatic merge; document recovery/link flow and truthful notice |
| Account deletion, shared attribution, retained copies and purge duration | 1 before public data collection; extend in 5/7 | Publish actual policy, cover backups and derivatives, verify removal; no indefinite-storage claim |
| Member removal, invite rotation, creator/final-member departure, room closure | 5 | No Leader privilege inferred; omit removal/rotation/archive controls; last-member exit needs explicit lifecycle policy |
| Recovery duration and abuse-report operator/process | 5; extend 6–8 | Choose a finite communicated restore window and real report intake; block affected release until operational |
| Supported institutional exceptions | 3–4 when requested | Support equal-session attendance and simple fixed weighted grades only; explain unsupported policies |
| Forum subject taxonomy, visibility and moderation process | 6 | Proposed signed-in-student community, including guests; validate before public posting |
| Reminder timing and closed-site browser delivery | 6 | In-app baseline at event time; browser behavior described only after verified delivery tests |
| Extraction/model service, data handling, formats and operational budget | 7 | No live AI launch until tested and funded; scan/PPT limitations remain explicit |
| Study Help retention, retry and regeneration limits | 7–8 | Configure/publish actual limits; preserve source bindings and existing usable outputs |
| External provider destinations and optional prefilling | 8 | Copy-and-open default; no invented prefill parameters or automatic send |

These are launch constraints with bounded interim behavior, not unresolved core user-story
questions. They do not prevent creating these specifications. Resolving them must precede
the affected implementation promise; a checklist pass is not deployment approval.

## Explicitly Deferred Extensions

Timetable/datesheet photo import requires its own reviewed extraction specification; it
must not silently save recognized events. Also deferred: opening attendance balances,
attendance end-of-term feasibility/what-if (AG-24–26), GPA scenarios/bounds (AG-60/70),
saved scenario optimization, bonus/category/hurdle grading, additional file formats,
document exports, explicit room sharing of AI documents, global search, and external
calendar/email integration. Add dedicated specs before claiming these capabilities.
Core wording about unknown remaining sessions and scenario distinctions remains required
even while those optional tools are absent.

## Specification Scope and Workflow

Read [the constitution](constitution.md), this product scope, then the affected phase.
Each phase includes a separate requirements checklist. These files describe WHAT and WHY;
they do not choose database tables, APIs, hosting, packages, or implementation tasks.
The requested latest-stable Next.js constraint is recorded in the constitution, separately
from technology-independent user outcomes. The supplied command's branch-creation workflow
is intentionally not run for this documentation-only request. The current branch stays
`master`; phase directory numbers are document organization, not claims of created branches.
