# Feature Specification: Phase 6 — Subject Q&A and Notifications

**Feature Branch**: Not created; documentation on `master`.  
**Created**: 2026-10-03  
**Status**: Draft proposed detail; community operations require review before launch.  
**Input**: Overview §§15/29 and project-room reminder/reporting requirements.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ask and answer a subject question (Priority: P1)

A named student finds a subject, asks a question and responds constructively to peers.

**Why this priority**: The source confirms subject help without competitive ranking.
**Independent Test**: Two named accounts use one subject and question without rooms or AI.

**Acceptance Scenarios**:

1. **Given** a guest without a name, **When** posting, **Then** name entry precedes posting
   and the same posting permissions as a Google user apply.
2. **Given** a peer answer, **When** the asker marks the question solved, **Then** Solved
   appears; another student cannot change that status.
3. **Given** a report, **When** submitted, **Then** a stored receipt appears without granting
   the reporter deletion powers or falsely claiming moderation is complete.

### User Story 2 - Manage reminders without losing core access (Priority: P1)

A student reads in-app alerts and optionally enables supported browser notifications.

**Why this priority**: Denied browser permission must never break planning or collaboration.
**Independent Test**: Schedule, reschedule and cancel a reminder; test allowed/denied permission.

**Acceptance Scenarios**:

1. **Given** denied browser permission, **When** a reminder is due, **Then** its in-app alert
   remains available and permission prompts do not repeat automatically.
2. **Given** a departed room member, **When** a future reminder is dispatched, **Then** no
   room title or private content reaches that former member.
3. **Given** an alert already delivered, **When** a delivery retry occurs, **Then** it remains
   one notification with consistent read state.

### Edge Cases

Empty subjects; unsafe post text; duplicate submission; deleted/unavailable question;
concurrent answers; author account deletion; inaccessible notification destination;
expired browser permission; unsupported browser; app closed; timezone change; reminder edited
after initial delivery; shared device notification privacy.

## Requirements *(mandatory)*

### Functional Requirements

- **P06-FR-001**: Provide subject list, question list, question detail and answer submission;
  allow all named guest/Google students to participate with identical permissions.
- **P06-FR-002**: Proposed initial visibility is the signed-in student community, including
  guests; no public search indexing, institution membership inference or private-room import.
- **P06-FR-003**: Proposed question fields are subject, trimmed title and body; answer has
  body and parent question. Initial limits are title 160, question 10,000 and answer 10,000
  characters, with field feedback. Plain text with safe links is sufficient; attachments deferred.
- **P06-FR-004**: Show author display name, posting time, answer count and Open/Solved;
  order questions newest first with stable ties and paginate. Optional local search must
  clearly name its subject scope. Do not implement votes, rankings, points or badges.
- **P06-FR-005**: Only the asker may mark solved/reopen. Proposed solve operation changes
  question state without implying instructor validation or selecting a ranked best answer.
- **P06-FR-006**: Duplicate-safe posting retains drafts on failure; safe rendering prevents
  executable content. Authors cannot rewrite peers' posts. Ordinary post editing/deletion
  is deferred until an explicit policy; mandated account/moderation removal still applies.
- **P06-FR-007**: Show forum rules and reporting on questions/answers; persist target, reason,
  reporter and receipt. A named operational owner and response workflow gate public posting.
- **P06-FR-008**: Released Overview may show an entry card and the student's latest question
  title/answer count/status; no infinite feed or popularity metric.
- **P06-FR-009**: In-app alerts have recipient, source event/revision, due time, read state
  and authorized destination. Read/unread counters use the same accessible-alert set.
- **P06-FR-010**: Proposed personal deadline and room reminder defaults alert at event time;
  future advance offsets require explicit settings. Browser delivery is opt-in from Settings.
- **P06-FR-011**: Explain supported browser delivery conditions, allow disabling, and fall
  back to in-app alerts when denied/unavailable. No closed-site guarantee without verification.
- **P06-FR-012**: Reschedules invalidate old pending alerts, cancellations prevent future
  delivery, and retries deduplicate by recipient/event revision. Recheck membership on delivery.
- **P06-FR-013**: Proposed browser payload uses generic reminder text with an authorized
  destination instead of exposing private room titles on a lock screen. Exact private details
  become available only after opening and authorization.
- **P06-FR-014**: Opening an unavailable target gives a neutral explanation; account change
  invalidates the former account's active notification association. Apply CQ-01–CQ-07.

### Key Entities

Subject classifies questions without implying a course's private records. Question owns
author/title/body/solved state; answer belongs to a question. Report preserves a moderation
target. Notification links a recipient and event revision to delivery/read state. Preferences
express channel consent; browser permission is distinct from in-app eligibility.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **P06-SC-001**: All nonauthor solved-state attempts are denied; every accepted duplicate
  posting or notification retry yields one canonical record.
- **P06-SC-002**: At least 9/10 testers post a question and find a reply within two minutes
  after content is available, without interpreting any UI as ranking or voting.
- **P06-SC-003**: Every denied/unsupported-notification fixture retains core app and in-app
  alert access; rescheduled/cancelled/departed-member cases have zero obsolete deliveries.
- **P06-SC-004**: Online in-app reminders become visible within one minute of due time in
  at least 95/100 measurement cases; reconnect shows missed applicable alerts once.

## Dependencies, Assumptions and Phase Exit

Depends on 1–2 and Phase 5 for room alerts. Confirmed scope is Q&A, names, no voting, only
asker solves, reporting, and optional browser alerts. Visibility, taxonomy, field limits,
ordering, generic browser payload and exact reminder timing above are proposed defaults
because a standalone forum source was not supplied. Confirm these and report operations
before public release. No student moderator role, reputation, email/SMS/calendar delivery,
or unverified background notification promise is included.
