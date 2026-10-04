# Feature Specification: Phase 2 — Personal Planner and Overview

**Feature Branch**: Not created; documentation on `master`.  
**Created**: 2026-10-03  
**Status**: Draft.  
**Input**: Overview specification and academic period/course requirements.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Build a useful timetable (Priority: P1)

A student saves one course and class time, then sees today's timetable and their next class.

**Why this priority**: The home screen must immediately answer where and when to attend.
**Independent Test**: Save one recurring class and inspect today, tomorrow, and term end.

**Acceptance Scenarios**:

1. **Given** a Monday 10:00–11:30 class in B-204, **When** local time is Monday 09:35,
   **Then** the class starts in 25 minutes and identifies its room.
2. **Given** two overlapping classes, **When** either is current, **Then** a conflict indicator
   exposes both through timetable review rather than silently hiding one.
3. **Given** a recurrence edit, **When** its future times change, **Then** historical dated
   occurrences and attendance are preserved.

### User Story 2 - Keep deadlines visible (Priority: P1)

A student adds, edits, completes and reopens personal work without losing overdue items.

**Why this priority**: Urgent work must remain actionable and counts trustworthy.
**Independent Test**: Use past, due-now, future and completed deadlines for one course.

**Acceptance Scenarios**:

1. **Given** an overdue pending assignment, **When** Overview loads, **Then** it appears
   before upcoming items and retains its exact date/time.
2. **Given** a done toggle, **When** save succeeds, **Then** pending list and counters update
   together and the full planner retains the item with a reopen/Undo action.
3. **Given** save failure, **When** completing or adding an item, **Then** prior saved state
   remains visible and retry does not create a duplicate.

### User Story 3 - See one reliable daily overview (Priority: P1)

A student sees classes, deadlines and the summaries of available later modules in urgency order.

**Why this priority**: Aggregation saves navigation while preserving module independence.
**Independent Test**: Populate planner data and make one summary unavailable.

**Acceptance Scenarios**:

1. **Given** room summaries fail, **When** personal timetable loads, **Then** the timetable
   remains usable and the room section offers its own retry.
2. **Given** no grading setup, **When** the academic card is available, **Then** it directs
   setup without guessing GPA; unavailable feature cards remain absent.

### Edge Cases

Two same-course sessions on one day; no classes in seven days; unknown term end; cancelled
occurrence; daylight-saving gap/overlap; local midnight; timezone change; long titles;
deadline exactly now; completed old work; deleted course with dependent records; empty versus
failed list; page resume after a long absence. No inferred public holidays or missed grades.

## Requirements *(mandatory)*

### Functional Requirements

- **P02-FR-001**: Students must create/edit academic periods and course instances with name,
  optional code/color, room/schedule and optional credits; grading is not required for planning.
- **P02-FR-002**: Periods have a name and optional explicit boundaries. Retaken courses remain
  separate instances. Unknown boundaries must not imply a known remaining-session count.
- **P02-FR-003**: Support weekly recurring slots with weekday, local start/end, timezone and
  room; validate end after start. Proposed first version rejects overnight slots with guidance
  to split them. Identify each dated occurrence separately, including same-day duplicates.
- **P02-FR-004**: Timetable must offer daily/weekly review, conflict visibility and direct
  editing. Future cancellation/rescheduling is explicit and must not rewrite recorded history.
- **P02-FR-005**: Proposed course removal policy is archive from active planning while retaining
  linked records; permanent destruction belongs to the account/data removal policy.
- **P02-FR-006**: Deadlines require title, owned course, type (assignment, quiz, exam, project),
  due date/time and pending/done state; notes are optional. Past dates are allowed with warning.
- **P02-FR-007**: A date-only selection exposes editable 23:59 in the selected timezone.
  Invalid/nonexistent times require correction and ambiguous times require an explicit choice.
- **P02-FR-008**: Editing/completing/reopening updates one canonical deadline; completion
  never records a score or changes room-task status. Preserve full completed-item access.
- **P02-FR-009**: Select current occurrence using start <= now < end, otherwise earliest
  future within seven calendar days; exclude cancelled occurrences and label tomorrow/weekday.
- **P02-FR-010**: Show today's first four classes sorted by time/name/stable identity with
  View all; show time, room or missing-room label, and Upcoming/In progress/Finished.
- **P02-FR-011**: When Phase 3 ships, quick attendance must use its eligible-occurrence rules
  and update the same saved record and summaries; never auto-mark on visiting Overview.
- **P02-FR-012**: Show overdue pending items oldest first (initial three), then upcoming
  earliest first (initial five), with hidden counts/View all and type filters.
- **P02-FR-013**: Overdue means due < now and pending; due = now is Due now; next 24 hours
  is Due soon. “Due in 7 days” includes pending times from now through seven days inclusive.
  Counters and lists must use identical filters; personal and room deadlines remain distinct.
- **P02-FR-014**: Released attendance preview shows up to three highest-risk courses;
  released room preview up to two rooms ordered by overdue assigned work then nearest final
  deadline; academic target identifies setup, coverage and result type.
- **P02-FR-015**: Room previews show authorized name, subject, deadline, member count,
  done/total count, own nearest unfinished task and next reminder; revoked rooms disappear.
- **P02-FR-016**: Rule-based Overview suggestion shows at most one fact-linked item in order:
  overdue work, assessment within 24 hours, attendance recovery, demanding valid target,
  general tip. Academic-page setup tips may prioritize missing inputs instead. Neither is AI.
- **P02-FR-017**: Refresh countdowns at least every minute while visible, and date-sensitive
  views on focus/local midnight. Changing display timezone preserves deadline instants.
- **P02-FR-018**: Follow CQ-01–CQ-07; mobile order prioritizes next class, urgent work,
  today's schedule, attendance, projects, academic target, and later study/community entries.

### Key Entities

Academic period groups owned course instances. Recurring sessions produce stable dated
occurrences. Personal deadline carries type, due instant, status and notes. Overview summaries
are derived views, not alternative attendance/grade/task records. Preferences supply timezone.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **P02-SC-001**: The product's five-minute first-use and three-second Overview goals pass
  on the defined test profile and dataset.
- **P02-SC-002**: All time-boundary, counter/list, completion retry, and recurrence-history
  cases produce consistent results before and after reload.
- **P02-SC-003**: At least 9/10 testers find their next class and nearest urgent deadline
  within 20 seconds of viewing a populated home.

## Dependencies, Assumptions and Phase Exit

Depends on Phase 1. Source OV-04–09, OV-24–29 and source §§5–10/18–25 govern baseline;
OV-10–23 integrate when Phases 3–5 ship. Weekly recurrence, course archiving and explicit
exceptions are adopted supporting defaults. No LMS import, personal study-session scheduling,
global search, offline mutation queue or image scanning. Exit requires persisted planner
flows, independent card failures, time-boundary review and mobile measurements.
