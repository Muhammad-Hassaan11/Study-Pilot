# Feature Specification: Phase 5 — Private Project Rooms

**Feature Branch**: Not created; documentation on `master`.  
**Created**: 2026-10-03  
**Status**: Draft; membership lifecycle, recovery and report operations gate launch.  
**Input**: Project-room specification and Overview room previews.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and join an equal-permission room (Priority: P1)

A named student creates a private project, copies its invite and teammates explicitly join.

**Why this priority**: Membership is the boundary for all collaboration.
**Independent Test**: Create a one-person room, join through a guest invitation, test capacity.

**Acceptance Scenarios**:

1. **Given** valid name, subject and final deadline, **When** creating, **Then** room and
   creator membership exist together, with a display-only Leader label and invite action.
2. **Given** an invitation before sign-in, **When** a named student chooses Join, **Then**
   one membership is created and the intended room opens; existing members are not duplicated.
3. **Given** nine members and two concurrent joins, **When** both attempt the last slot,
   **Then** exactly one can join and total membership never exceeds ten.
4. **Given** an ordinary room URL without membership, **When** opened, **Then** private
   content and invite token remain undisclosed.

### User Story 2 - Coordinate and recover shared tasks (Priority: P1)

Members assign work, change status, inspect progress/contributions, and recover eligible deletions.

**Why this priority**: Shared accountability is the primary room outcome.
**Independent Test**: Use six tasks, three Done, and complete another person's assignment.

**Acceptance Scenarios**:

1. **Given** six active tasks with three Done, **When** viewed, **Then** progress is 3/6,
   50%; reopening one gives 2/6 without erasing historical activity.
2. **Given** Ali owns a task, **When** Sara completes it, **Then** Ali receives the completed
   assigned-task credit and Sara is the actor in Activity.
3. **Given** a deleted task and eligible recovery window, **When** restored twice, **Then**
   one task returns, with its retained status and an unassigned owner if the owner departed.
4. **Given** stale edits to the same field, **When** saving, **Then** current content and the
   local draft can be reviewed rather than silently overwriting another member.

### User Story 3 - Discuss and preserve project knowledge (Priority: P1)

Members exchange messages and authorized references, then pin useful messages or add resources.

**Why this priority**: Context and files must stay beside the work they support.
**Independent Test**: Send/retry a message, pin concurrently, upload a file, edit a shared note.

**Acceptance Scenarios**:

1. **Given** a failed message send, **When** retried, **Then** text persists and one canonical
   message appears with correct author/time.
2. **Given** two members pin the same message, **When** both save, **Then** one active Library
   pin exists with original-author and pinning attribution; task progress stays unchanged.
3. **Given** a file exactly 10,000,000 bytes of an allowed type, **When** upload completes,
   **Then** a ready private item appears; oversized or spoofed input is rejected.
4. **Given** reading older chat, **When** new messages arrive, **Then** reading position stays
   stable and a New messages control appears.

### User Story 4 - Schedule practice and inspect changes (Priority: P2)

Members save structured reminders, receive in-app alerts and inspect attributable activity.

**Why this priority**: Group coordination must survive chat ambiguity and accidental changes.
**Independent Test**: Create, reschedule and cancel one practice reminder across two accounts.

**Acceptance Scenarios**:

1. **Given** a practice time, **When** saved, **Then** the full list, nearest preview and
   Overview reference the same event; a casual chat statement alone creates no reminder.
2. **Given** a rescheduled event, **When** the old time arrives, **Then** obsolete alerts
   are not delivered and departed members receive no future private notification.
3. **Given** a saved shared mutation, **When** Activity opens, **Then** the trusted actor,
   change and time appear and members cannot rewrite the audit history.

### Edge Cases

Invalid/full/revoked invite; interrupted join; departed owner; creator or last-member exit;
task deleted during editing; task after final deadline; no tasks; 100% progress after due
date; interrupted upload; unsafe link; pin source removed; same-name members; lost live
events; stale note; access revoked while viewing or downloading; expired recovery window.

## Requirements *(mandatory)*

### Functional Requirements

- **P05-FR-001**: Room creation requires trimmed name 1–100 characters, subject and exact
  final deadline/timezone; a personal course is not required. Room plus creator membership
  is atomic. One-member setup is allowed; intended groups are 2–10.
- **P05-FR-002**: Room discovery is invitation-only. Current members may copy the invite;
  clipboard failure offers a selectable fallback. The app does not send invitations itself.
- **P05-FR-003**: A valid invite may reveal only room name/subject before joining. Joining
  requires a session, name, explicit action, current validity and capacity checks.
- **P05-FR-004**: Enforce current membership for content, files, activity and live updates;
  referenced tasks/resources/messages must belong to that same room.
- **P05-FR-005**: Every current member may edit shared tasks, room details/deadline, Library
  items and reminders, and delete/restore eligible shared items. Leader grants no extra rights.
- **P05-FR-006**: Do not expose member removal, invite rotation or room archive/delete until
  policy is specified. Leaving must explain loss of access; incomplete assigned tasks become
  unassigned with history. Creator/final-member handling is a launch decision, not an inferred privilege.
- **P05-FR-007**: Board, Library, Reminders and Activity share room identity/deadline context;
  deep links check membership and report inaccessible/deleted targets without leaking details.
- **P05-FR-008**: Tasks require title 1–160 characters, due time and status To do/Doing/Done;
  one current member or Unassigned is the owner. Nonowners in the room can edit/complete.
- **P05-FR-009**: All status transitions including reopening are supported through explicit
  keyboard/touch controls. Dragging is optional. Counts match active filters; total room
  progress remains labelled and independent of filters.
- **P05-FR-010**: Unfinished tasks order by due time and Done tasks by latest completion,
  with stable tie-breaking. Past or post-submission deadlines require a visible warning and
  intentional save, never automatic rescheduling of tasks/reminders.
- **P05-FR-011**: Progress=100*Done/nondeleted total; empty shows No tasks yet. A passed
  deadline or 100% progress never submits work, archives the room, or removes access.
- **P05-FR-012**: Contribution counts use currently Done/nondeleted tasks and capture owner
  at latest completion; actor is separate. Reopening/deletion removes current credit; restore
  retains it. Later owner edits do not rewrite credit. Show Unassigned/former members separately.
- **P05-FR-013**: Changes preserve actor/time and version; retry-safe operations prevent
  duplicate tasks. Stale edits preserve drafts; saving a deleted task cannot recreate it.
- **P05-FR-014**: Soft deletion excludes items from counts; restore is offered only within
  the configured disclosed window and while data/file bytes exist. Retention is a launch gate.
- **P05-FR-015**: Chat is live, plain text with safe links, proposed maximum 4,000 characters;
  whitespace-only sends fail. Show pending/sent/failed and deduplicate retry/reconnect.
- **P05-FR-016**: Paginate chronological history with canonical timestamp/stable tie order;
  preserve history position and per-room drafts. Initial chat has no ordinary edit/delete,
  typing, presence, read receipts or reactions. Moderation/deletion policy still applies.
- **P05-FR-017**: Messages may reference one same-room task and a Library item. References
  resolve current authorized titles/status; deleted targets show unavailable, never another room.
- **P05-FR-018**: Pinning creates one active Library note per source message, with original
  author/time, pinning actor/time and reference. Editable commentary is separate from quotes.
  Removing a pin does not remove chat; mandated source removal propagates to retained snapshots.
- **P05-FR-019**: Library supports files, HTTP/HTTPS links and plain-text notes; show title,
  type, original author/date and last editor/time. Search titles, link URLs and note bodies
  within the room, not document contents. Board previews latest three and total count.
- **P05-FR-020**: File cap is 10,000,000 bytes; proposed allowlist PDF/PNG/JPEG/WebP/DOCX/XLSX/PPTX.
  Validate actual content, show transfer/cancel/failure, and expose Ready only after storage
  and metadata agree. Private retrieval rechecks membership; short-lived issued links have
  disclosed revocation limits. File replacement records attribution and does not imply versions.
- **P05-FR-021**: Report on shared resources must persist a reason and receipt to a real
  operator process; reporters gain no moderation powers or fabricated resolution claim.
- **P05-FR-022**: Reminders support Task/Practice session/Meeting/Submission, title/timezone,
  optional same-room task and notes/location/safe link. Everyone may create/edit/cancel.
- **P05-FR-023**: Separate Upcoming and Past reminders; nearest noncancelled upcoming event
  appears in previews. Proposed baseline notification is in-app at event time, once per current
  member/event revision; rescheduling/cancellation invalidates obsolete pending delivery.
- **P05-FR-024**: Activity records creation, membership changes, shared edits, status,
  deletions/restores, file replacement and pins, with trustworthy actor/target/time; ordinary
  messages and clipboard/view actions do not create duplicate activity noise.
- **P05-FR-025**: Reconnect reconciles authoritative records and counts; access loss ends live
  updates and clears private content. Chat/library failure does not blank functioning sections.
- **P05-FR-026**: On mobile, use a status-selected vertical task list and separate chat view;
  keyboard must not hide composer/actions. Apply all common quality requirements.

### Key Entities

Room owns membership/invitation and shared deadline. Task records owner, status, due time,
revision, completion actor/credited owner and deletion state. Message has author/text and
same-room references. Library item has subtype/file/link/note data and pin provenance.
Reminder has type, time and revision. Activity is attributable immutable change history.
Notification records per-member delivery/read state; report captures target and operator status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **P05-SC-001**: All PR-01–PR-54 applicable acceptance cases pass, including capacity,
  duplicate pin, cross-room denial, revoked access and recovery cases.
- **P05-SC-002**: In at least 95 of 100 supported online test updates, a second member sees
  accepted task/chat changes within two seconds; reconnect always reconciles final state.
- **P05-SC-003**: The 100-task/200-resource/3,000-message room becomes usable within three
  seconds in at least 95 of 100 runs on the product measurement profile.
- **P05-SC-004**: At least 9/10 testers can join, assign work, share a resource and schedule
  practice within five minutes, without requiring creator intervention.

## Dependencies, Assumptions and Phase Exit

Depends on 1 and integrates with 2; academic setup is not required. All source PR criteria
remain binding for shipped controls. One-member setup, owner-at-completion credit, unassigned
tasks, immutable ordinary chat and declared file allowlist are adopted working defaults.
Resolve lifecycle, finite recovery, attribution/deletion and report handling before launch.
Browser notifications follow Phase 6; in-app alerts are required here. No public discovery,
video calls, task effort scoring, automatic submission or AI room participant.
