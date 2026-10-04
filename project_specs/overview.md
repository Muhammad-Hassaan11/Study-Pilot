# StudyPilot — Overview Page Specification

**Version:** 1.0  
**Prepared:** October 3, 2026  
**Status:** Detailed design and implementation specification; not an implemented feature  
**Page:** Overview / student home dashboard  
**Suggested route:** `/overview`  
**Product language:** English in version 1  
**Audience:** Product owner, designer, frontend developer, backend developer, and tester

---

## 1. Purpose and source of truth

This document defines the StudyPilot Overview page: the first useful screen a student sees after entering the website as a guest or signing in with Google. It specifies the page layout, content, interactions, calculations, responsive behavior, data dependencies, error states, and acceptance criteria.

It is based on `StudyPilot-Full-Spec.md`, the design previews created in this conversation, and the subsequent confirmed requirement that students enter their university's **fixed marks-to-grade ranges and grade points** themselves.

The original product specification is product context, not an instruction to implement every feature in this task. This deliverable documents one page and its dependencies. It does not claim the website, integrations, or calculations are already built.

### 1.1 Decision precedence

1. The user's confirmed decisions take precedence: grading uses fixed marks ranges configured by the student.
2. The original product specification supplies the product scope and permissions.
3. This document proposes concrete page behavior where the original specification is silent.
4. Generated screenshots illustrate visual direction. Sample names, dates, numerical bars, or extra controls in those images are not authoritative business rules.

### 1.2 Confirmed requirements and proposed defaults

| Area | Confirmed requirement | Proposed implementation default in this document |
|---|---|---|
| Audience | Students only | One common Overview for every student |
| Access | Google and guest users have equal feature permissions | Guest status changes the account banner, not available tools |
| Grading | Student-defined fixed marks ranges and grade points | Store ordered percentage thresholds; derive non-overlapping ranges |
| Attendance | Editable requirement per course and recovery predictions | Use only explicitly recorded held sessions; distinguish unmarked sessions |
| Projects | Private invite-only rooms, equal editing permissions | Overview shows up to two relevant rooms |
| Forum | Subject Q&A, no voting or rankings | Add a compact entry card when the forum phase launches |
| AI | Later-phase summaries, quizzes, and external Ask AI links | Hide unavailable modules; use copy-and-open fallback until prefilling is verified |
| Layout | Responsive website, light and dark themes | Desktop sidebar, mobile bottom navigation, ordered card layout |

Limits, breakpoints, routes, sort orders, and terminology described as proposed defaults are reviewable design decisions. They should not be mistaken for additional confirmed user requests.

## 2. Product role of the Overview

StudyPilot helps students manage their own studies and finish group projects. The Overview should answer five questions quickly:

1. What class is next, and where is it?
2. What must I finish soon or have already missed?
3. Is any course's attendance close to or below its requirement?
4. What is happening in my project groups?
5. What should I study next to reach my grade target?

The page is a working dashboard rather than a marketing homepage. It summarizes information and offers useful actions without forcing the student to open every feature separately.

### 2.1 Primary outcomes

- Identify the next class, its start time, and its room from the first screen.
- See urgent work with a clear deadline and course label.
- Record attendance for an eligible class without leaving the page.
- Open the relevant project room directly.
- Understand when grades cannot yet be calculated and how to complete setup.
- Use the page successfully on a phone browser.

### 2.2 Explicit exclusions

- Teacher, class representative, university administrator, or institutional dashboards.
- University portal or LMS synchronization.
- Public room discovery, student search, or campus service listings.
- Paid tiers, advertisements, premium locks, or payment controls.
- Forum rankings, reputation points, upvotes, or competitive student leaderboards.
- Full room chat embedded in the Overview.
- A full timetable editor, gradebook, or file library inside a dashboard card.
- Relative grading or automatic inference of university grade boundaries.
- An embedded ChatGPT or Claude conversation unless separately approved as a product change.

## 3. Users, entry points, and account states

### 3.1 Supported user states

| State | Overview behavior |
|---|---|
| First-time guest | Show useful setup prompts and the guest data warning |
| Returning guest | Show existing personal data and accessible rooms with the same actions as a Google user |
| New Google user | Show setup prompts if no study data exists |
| Returning Google user | Show the populated dashboard |
| Guest upgrading to Google | Preserve the existing identity's data and memberships through the account-linking flow |
| Expired or invalid session | Show a session recovery screen; do not display another user's cached data |

A missing display name must be collected before the student uses project rooms or the forum. Real names are expected under the product policy; the UI must not claim that a name has been verified.

### 3.2 Entry points

- Successful Google sign-in.
- Successful guest entry.
- Selecting Overview in the desktop sidebar.
- Selecting Home in the mobile navigation.
- Opening a saved Overview URL with a valid session.
- Returning from an add-course, add-deadline, or Settings flow.

An invite link is a special entry path: retain the intended room destination through authentication. Do not redirect a student to the Overview and lose the invitation context.

## 4. Information hierarchy

The visual order should follow urgency and daily usefulness, rather than giving all features equal space.

| Priority | Content | Reason |
|---|---|---|
| 1 | Next/current class and overdue or soon-due work | Immediate action |
| 2 | Today's schedule and attendance warnings | Avoid missed classes and shortages |
| 3 | Project rooms and upcoming group reminders | Keep shared work moving |
| 4 | Academic target summary and study suggestion | Support revision planning |
| 5 | Forum and study-help entry points | Optional deeper work |

Avoid a large decorative hero, motivational carousel, unrelated quote, or excessive statistics that push useful content below the fold.

## 5. Page structure and navigation

### 5.1 Desktop structure

Suggested wide-screen arrangement:

```text
+-------------------+---------------------------------------------------------+
| StudyPilot         | Greeting / date / add action / alerts / profile         |
|                   +--------------------------------+------------+-----------+
| Overview          | Next or current class          | Due soon   | Projects  |
| Timetable         +-------------------+-------------------+-----------------+
| Attendance        | Today's schedule  | Upcoming deadlines| Attendance      |
| GPA planner       +-------------------+-------------------+-----------------+
| Project rooms     | Project room previews and next practice reminder        |
| Subject Q&A*      +-------------------------------+-------------------------+
| Study help*       | Academic target summary       | Study suggestion        |
| Settings          +-------------------------------+-------------------------+
|                   | Forum / study help entry cards when available*         |
|                   | Guest data warning when applicable                     |
+-------------------+---------------------------------------------------------+
```

`*` Later-phase destinations appear only when the corresponding feature is available. The diagram shows logical grouping; it does not prescribe rigid pixel positions.

### 5.2 Suggested navigation destinations

| Label | Suggested destination | Expected content |
|---|---|---|
| Overview | `/overview` | This page |
| Timetable | `/timetable` | Weekly and daily timetable |
| Attendance | `/attendance` | Course attendance records and predictions |
| GPA planner | `/gpa-planner` | Course marks, targets, and credit-weighted GPA |
| Project rooms | `/rooms` | Rooms the student belongs to |
| Subject Q&A | `/questions` | Subjects, questions, and answers |
| Study help | `/study-help` | Slide summaries, quizzes, and Ask AI entry points |
| Settings | `/settings` | Profile, grading rules, reminders, appearance, account |

These are route proposals, not an existing routing contract. Preserve active navigation state and browser Back behavior.

### 5.3 Header

The header contains a short greeting, the current local date, a clear Add action, an in-app alerts button, and a profile menu.

- Use a name only if available; otherwise show “Welcome to StudyPilot.”
- Suggested greetings: “Good morning, Sara”, “Good afternoon, Sara”, and “Good evening, Sara”.
- Use the student's configured timezone for date and time calculations.
- Profile menu links to Settings and the relevant account action.
- Avoid global search in the first release unless a complete, permission-aware search feature exists.
- The Add menu contains “Course” and “Deadline”. Create-room actions belong in the project section as well.

## 6. First-use and incomplete-setup experience

A new user should see an honest empty dashboard rather than fabricated classes, grades, or projects.

### 6.1 Setup checklist

Show a compact, dismissible “Set up your study space” card when important setup is incomplete:

1. Add your first course.
2. Add class times and room details.
3. Set your university grading system.
4. Set your attendance requirement and academic target.
5. Add your first deadline.

The order is a recommendation, not a forced wizard. A student can join a project room or use available forum features without finishing personal planner setup.

### 6.2 Grading setup prompt

If the grading system is missing, show “Add your university's grading ranges to plan your grades” with “Set grading system”. Do not substitute a default university scale or calculate GPA using guessed boundaries.

If courses have missing credits, the timetable and attendance features still work. Explain which GPA calculation is unavailable and offer “Add credit hours”.

### 6.3 Progressive setup

Do not require the student to enter the entire semester before using the page. One course with one class time should produce a meaningful schedule. One deadline should populate the deadline card immediately after a successful save.

## 7. Next/current class card

### 7.1 Required content

- State label: “Next class” or “Class in progress”.
- Course name and optional course code.
- Start and end time.
- Room, or “Room not added”.
- Relative time such as “Starts in 25 min”.
- Action to open the class or timetable.

### 7.2 Selection logic

1. Expand recurring class sessions into dated occurrences in the student's study timezone.
2. Exclude known cancelled or non-held occurrences if exceptions are supported.
3. Prefer a currently running occurrence: `start <= now < end`.
4. Otherwise select the earliest future occurrence within the next seven calendar days.
5. Label tomorrow or the weekday explicitly if the class is not today.
6. If multiple classes overlap, show a conflict indicator and a route to review the timetable. Do not silently hide the conflict.

If term dates or timetable exceptions are not available in the first release, make this limitation clear in timetable setup; do not infer public holidays worldwide.

### 7.3 States

| Condition | Copy / action |
|---|---|
| Upcoming today | “Starts in 25 min” |
| Currently running | “In progress · ends at 11:30” |
| Next occurrence tomorrow | “Tomorrow · 09:00” |
| No remaining class today, another upcoming | “No more classes today” followed by the next scheduled class |
| No upcoming occurrence in seven days | “No upcoming classes this week” |
| No timetable entered | “Add your timetable to see your next class” |
| Data could not load | “Couldn't load your next class” with Retry |

The Overview never marks a class attended automatically merely because the student opened the website.

## 8. Summary counters

Keep counters limited to two or three useful values. The proposed first release uses:

- **Due in 7 days:** pending personal deadlines from now through the next seven days.
- **Overdue:** pending personal deadlines with a due time earlier than now; only render prominently when nonzero.
- **Project rooms:** number of rooms the student currently belongs to and can access.

Use “Project rooms” rather than “Active projects” until room completion/archive states are defined. A room's final deadline passing does not prove that the room is complete.

Counters and their linked lists must use the same filters. Do not double-count project-room deadlines as personal assignments unless a deliberate link between records exists.

## 9. Today's schedule

### 9.1 Row content

Each class row shows start/end time, course name, room, and a textual state such as Upcoming, In progress, or Finished. Course color is supplemental identification, never the only identifier.

Show up to four rows initially, with “View today's timetable” for more. Sort by start time, then course name and a stable identifier for ties.

The MVP schedule shows saved class occurrences. Personal study-session scheduling was visible in a concept image but is not a confirmed data feature; omit it unless separately implemented. Project practice sessions appear in the project section.

### 9.2 Quick attendance

For a class that has started or finished, provide “Attended” and “Missed” when the record is unmarked. Future classes cannot be recorded prematurely through the Overview.

- A selected state is visibly and programmatically identifiable.
- A student can correct an entry; updating replaces the existing record for that occurrence.
- A save updates the related attendance card and warning count.
- A failed save rolls back the optimistic state and shows a retryable error.
- Repeated clicks must not create duplicate attendance records.
- An unmarked class stays unmarked; it is not automatically treated as missed.

The two-state attended/missed model comes from the original product specification. Excused absence, partial attendance, and cancellation policies need an explicit later model if required.

## 10. Upcoming and overdue deadlines

### 10.1 Supported items

Personal assignments, quizzes, exams, and projects use the original item model: title, course, type, deadline, status, and optional notes.

Provide filter chips “All”, “Assignments”, “Quizzes”, “Exams”, and “Projects”. Classes are in Today's schedule rather than mixed into the deadline list. This is a proposed page-level presentation choice.

### 10.2 Row content and actions

- Title and course label.
- Type label or accessible icon.
- Relative deadline and an accessible exact date/time.
- Pending/done control.
- Row action to view or edit details.

Clicking a completion control should not also trigger row navigation. After successful completion, remove the item from the pending list and provide a short Undo opportunity. The full planner retains completed items.

### 10.3 Sorting and limits

Show a distinct overdue group before future items. Proposed default: up to three overdue rows and five future rows, with “View all” and the hidden item count where appropriate. Sort overdue rows oldest first, and future rows earliest first.

Overdue items never disappear because they are old. “No deadlines” is shown only after a successful empty response; a request failure gets an error state.

### 10.4 Deadline boundaries

- `due_at < now` and pending: overdue.
- `due_at = now` and pending: due now.
- `0 < due_at - now <= 24 hours`: due soon.
- A done item is not overdue, even if its due time has passed.
- Display whole days or hours without creating false precision; show “Less than 1 hour” near the deadline.
- Refresh relative labels at least once per minute while visible and immediately after returning to the tab.

If the form accepts a date without a time, require the product to define a date-only policy. Recommended default: show an explicit editable 23:59 time in the selected timezone, rather than silently storing midnight.

### 10.5 Add deadline flow

Open a focused form with title, course, type, due date/time, and optional notes. Validate required fields and preserve entered values on save failure. Saving a past due date is allowed with a clear “This deadline is already overdue” explanation. On success, update the list and related counters without a full-page reload.

## 11. Attendance summary and shortage predictor

### 11.1 Presentation

Show the most concerning courses first, up to three initially. Each row includes the course name, attended/recorded counts, current percentage, required percentage, state label, and a meaningful prediction.

Suggested order: below requirement; within five percentage points above or equal to requirement; remaining courses. Within a group, sort by the lowest margin above the requirement.

Use three states:

- **Below requirement:** current percentage is lower than the course requirement.
- **Close to limit:** current percentage is at the requirement or no more than five percentage points above it.
- **On track:** more than five percentage points above the requirement.

Use the precise underlying ratio for state selection. Rounded display values must not decide eligibility.

### 11.2 Calculation definitions

Let `A` be attended recorded sessions, `M` missed recorded sessions, `T = A + M`, and `r` the required percentage divided by 100.

```text
Current attendance percentage = 100 × A / T

Consecutive future misses allowed = floor(A / r - T)
  Applicable when T > 0, 0 < r <= 1, and A / T >= r.

Consecutive future attendances needed = ceil((r × T - A) / (1 - r))
  Applicable when T > 0, 0 < r < 1, and A / T < r.
```

Clamp tiny floating-point errors at exact boundaries and avoid negative displayed counts. The formula assumes each future class counts equally and no other attendance changes occur.

### 11.3 Worked examples

| Course | Recorded attendance | Required | Correct Overview output |
|---|---|---|---|
| Calculus II | 18 of 20 | 75% | 90%; can miss the next 4 classes and remain at 75% |
| Database Systems | 14 of 18 | 75% | 77.8%; close to limit; cannot miss the next class and stay above the requirement |
| Physics | 12 of 18 | 75% | 66.7%; attend the next 6 classes in a row to recover |

The prediction is based on recorded attendance and is not a recommendation to skip class. It is not a guarantee of end-of-semester eligibility.

### 11.4 Edge cases

- `T = 0`: show “No attendance recorded”; do not show 0%.
- Missing required percentage: show “Set attendance requirement”.
- Requirement 100% with a prior miss: show “100% cannot be recovered with the current records”; there is no finite recovery count.
- Requirement 0%: show “No minimum attendance requirement”; do not divide by zero or show an infinite allowance.
- Unmarked held sessions: show a “Records incomplete” indicator and qualify predictions as based on recorded classes.
- Known remaining semester classes fewer than the recovery count: explain that the requirement cannot be reached within those remaining sessions.
- Unknown remaining semester count: do not claim recovery before semester end.

Progress bars must proportionally represent the displayed value and mark the actual course requirement at the correct position.

## 12. Academic target and fixed grading system

### 12.1 Confirmed grading behavior

Every student enters their own university's fixed marks ranges, grade labels, and grade points in Settings. Selecting a scale such as 4.0 GPA alone is insufficient. The Overview and GPA planner must use the saved mapping.

No common university table should be silently prefilled as authoritative. A sample may be offered only when clearly labelled and reviewed by the student.

### 12.2 Settings dependency

The grading-system editor must support:

- A name for the student's grading system.
- Maximum GPA/grade-point value appropriate to the selected scale.
- Grade rows with a label, marks boundary, and grade points.
- Adding, editing, and removing grade rows.
- Validation for overlaps, uncovered ranges, invalid numbers, and out-of-range grade points.
- A clear rounding policy for marks before grade mapping.
- A preview of the resulting ranges before saving.

Recommended representation: normalize course marks to percentages, store ordered lower thresholds, and derive upper bounds from the next threshold. Ranges are lower-inclusive and upper-exclusive except the highest range, which includes 100. This avoids a gap such as 84.5 between integer-looking ranges 80–84 and 85–100.

Example display only:

| Percentage range | Grade | Grade points |
|---|---|---|
| 85 to 100 inclusive | A | 4.00 |
| 80 to less than 85 | A− | 3.67 |
| 75 to less than 80 | B+ | 3.33 |
| 70 to less than 75 | B | 3.00 |
| 65 to less than 70 | C+ | 2.50 |
| 60 to less than 65 | C | 2.00 |
| 50 to less than 60 | D | 1.00 |
| 0 to less than 50 | F | 0.00 |

This is a complete illustrative table, not a statement about the student's actual university. If their institution rounds marks before mapping grades, that policy must be captured explicitly; otherwise use unrounded values for mapping.

### 12.3 Overview card content

Use the card title “Academic target” and show:

- The student's target, for example “Target semester GPA: 3.50 / 4.00”.
- The configured grading-system name or “Custom university scale”.
- A course needing attention, when sufficient assessment data exists.
- A direct link to the GPA planner.
- A setup or missing-data message instead of a misleading calculated value.

Do not present an in-progress average as the final GPA. Use explicit labels such as “GPA from completed courses” or “Projected GPA” only when those quantities can actually be calculated.

### 12.4 Course target calculation

Normalize weighted assessments into percentage points toward the final course score. Let `E` be percentage points already earned, `W` the remaining assessment weight in percentage points, and `G` the percentage threshold for the student's chosen grade.

```text
Percentage needed on remaining work = 100 × (G - E) / W
```

Example: earned `36` final-score points, remaining weight `60`, chosen target threshold `80`. The student needs `44` of the remaining `60` points, or approximately `73.33%` on that work.

For a displayed actionable minimum, round conservatively upward at the chosen precision; `73.34%` at two decimal places avoids implying that a slightly lower score is sufficient. Keep the exact ratio internally.

| Condition | Output |
|---|---|
| `E >= G` | “Already safe for this target”, assuming valid nonnegative remaining weights |
| `0 < needed <= 100` | “Need X% on remaining work” |
| `needed > 100` | “Target out of reach with remaining marks” and a link to review achievable grades |
| `W = 0` | Show the final mapped grade if complete; never divide by zero |
| Missing weights or scores | “Add assessment details to calculate your target” |
| Invalid total weights | Explain the problem in the planner; suppress predictions |

Earned scores must not be averaged without respecting assessment weights. A 10-mark quiz and a 100-mark final are not automatically equal contributions.

### 12.5 Semester GPA

```text
Semester GPA = sum(course grade points × course credits) / sum(course credits)
```

Use positive valid credits and the student's saved grading table. Do not assume equal credits when they are missing. A partial GPA must clearly identify its coverage and exclusions. A complete semester GPA requires all included courses to have the necessary final data.

A semester target does not uniquely determine a required grade in every course. The app must not invent per-course requirements without an explicit allocation method or student-selected course targets. The Overview can show the semester target and a separately configured course target together.

Changing grading boundaries requires recalculation of affected grade predictions. Preserve earned marks; do not rewrite raw scores to fit the new scale.

## 13. Project room previews

### 13.1 Purpose and selection

Show private group work the student is already authorized to access. Proposed limit: two room cards, prioritizing rooms with overdue assigned work, then the nearest upcoming final deadline. Provide “View all rooms”.

Each room card contains:

- Room name and subject.
- Final deadline with relative and exact time.
- Member count and a few initials avatars.
- Task progress as both a count and a bar.
- The student's nearest pending assigned task, if any.
- The next group reminder, including practice sessions.
- “Open room”.

### 13.2 Progress rules

```text
Task completion percentage = 100 × done tasks / all non-deleted tasks
```

Show “3 of 6 tasks done” beside a 50% bar. If there are no tasks, show “No tasks yet” rather than 0% completion of an undefined total. Task count progress does not measure effort or time contributed.

The Leader label is informational and must not imply privileged editing rights on the Overview. All room members retain the original equal permissions.

### 13.3 Room actions and empty states

- “Create room” opens the room creation form.
- Joining occurs only through an invite link; no public room search is offered.
- Empty copy: “Keep your group tasks, files and deadlines together.”
- An upcoming practice reminder opens the room's reminder view.
- If access is revoked while the page is open, remove the room's data and show a neutral access message.
- Do not automatically delete or archive a room merely because its deadline has passed; the original specification leaves lifecycle policy undecided.

## 14. Rule-based study suggestion

Show at most one useful suggestion, tied to known data, when this phase is available. It must be transparent and deterministic rather than labelled as AI.

Suggested priority:

1. An overdue item that still needs action.
2. An assessment due within 24 hours.
3. An attendance recovery need.
4. A demanding, valid course grade target.
5. A general study tip when no specific signal exists.

Examples include “Your database assignment is due tomorrow” and “Physics needs six consecutive attended classes to reach your requirement.” Each suggestion links to the relevant item or planner.

Avoid shaming language or claims that the app knows the student's ability, health, or future outcome. Do not display a grade-based suggestion when its grading rules or assessment data are missing.

## 15. Subject Q&A entry card — later phase

Once the forum is available, show a compact “Ask your classmates” card linking to Subject Q&A. An optional preview of the student's own latest question can show its title, answer count, and Open/Solved state.

- No rankings, votes, points, popularity labels, or competitive badges.
- Use real display names under the product policy.
- Question detail retains reporting and forum rules.
- Only the asker may mark their question solved.
- Keep the Overview focused on study planning; do not add an infinite forum feed.
- A guest without a name enters their name before posting.

## 16. Study help and Ask AI entry card — later phase

The original plan places AI features after the core planner and rooms are stable. Their absence should not block the Overview release.

### 16.1 Slide study help

When enabled, show a “Study from your slides” entry card with “Upload PPT or PDF”. It leads to the Study help page, where the student can choose Short summary, Detailed summary, or Practice quiz.

Do not place a full document viewer or long summary on the Overview. A small link to a recent processed document may be added only if document history is implemented.

The Study help flow must expose upload/processing/failure/quota states. If an upload quota is exhausted, keep the rest of the Overview usable and show when uploads can resume. Exact file limits and daily quotas remain implementation decisions; the room Library's 10 MB rule does not automatically define AI upload limits.

### 16.2 Ask AI

The currently specified design prepares a question and opens ChatGPT or Claude in a new tab. Prefilled external links are an intended convenience that must be verified before release. A copy-question-and-context action followed by an external link is the fallback design.

- State clearly when a link opens another service.
- Let the student inspect and choose the text to share.
- Do not automatically include private room content or personal academic records.
- Do not claim the external conversation is embedded in StudyPilot.
- Do not claim a prefilled link works without verifying it during implementation.

The user has not yet confirmed whether they want a different, fully embedded AI chat architecture. That remains an open product decision and must not be silently introduced by the Overview design.

## 17. Guest data notice and account upgrade

Show the original required warning to guests:

> Your data is saved on this device. Sign in with Google to keep it safe.

Provide “Sign in with Google” and, if dismissal is supported, keep a persistent account entry where the warning can be found again. Do not repeatedly interrupt ordinary study actions with a modal.

The implementation must reconcile this wording with the actual guest storage model. The original technical plan uses anonymous accounts with backend records; “saved on this device” may describe recovery dependence rather than literal local-only storage. Keep public copy truthful and review it if storage behavior differs.

Account linking should preserve courses, deadlines, attendance, grading settings, room membership, and authored content. Do not clear guest data before upgrade succeeds. Existing-account conflicts require a defined recovery or merge flow; do not silently discard either account's data.

## 18. Responsive behavior

Breakpoints below are suggested implementation defaults, not device restrictions.

| Width | Layout |
|---|---|
| 1200 px and above | Expanded sidebar, multi-column dashboard |
| 768–1199 px | Compact navigation and two-column cards where readable |
| Below 768 px | Single-column cards, mobile navigation, touch-first actions |

### 18.1 Mobile content order

1. Compact header and any essential account/setup notice.
2. Current/next class.
3. Overdue and nearest deadlines.
4. Today's schedule.
5. Attendance warnings.
6. Project rooms and next reminder.
7. Academic target and study suggestion.
8. Available Q&A and Study help entry cards.

Use bottom navigation Home, Planner, Rooms, and Q&A once the forum is available. Before then, omit or replace the unavailable destination deliberately; do not ship a dead tab. Settings is accessible from the profile menu.

Do not use horizontal card carousels for essential deadlines or warnings. Prevent page-level horizontal scrolling at a 320 px viewport. Reserve space beneath the content for bottom navigation and device safe areas.

### 18.2 Touch and small-screen interactions

- Target approximately 44 × 44 CSS pixels for frequent touch controls.
- Open forms as readable full-height sheets or dedicated pages on narrow screens.
- Keep labels visible above fields; placeholder text does not replace labels.
- Allow long course names to wrap and preserve access to their full text.
- Avoid hover-only menus and tooltips.

## 19. Visual design direction

Continue the established StudyPilot preview style: quiet off-white page background, white cards, deep navy text, indigo primary actions, teal success cues, amber warnings, and restrained red for overdue or below-requirement states.

Suggested design tokens for review:

| Token | Proposed value |
|---|---|
| Page background | `#F7F8FC` |
| Card surface | `#FFFFFF` |
| Main text | `#14213D` |
| Secondary text | `#526079` |
| Primary action | `#4338CA` |
| Success text | `#087F6B` |
| Warning text | `#92400E` |
| Danger text | `#B42318` |
| Border | `#DCE2EE` |
| Card radius | 12–16 px |
| Base spacing step | 4 px, with common 8/12/16/24/32 px gaps |

These are visual proposals, not verified contrast results. Validate actual foreground/background combinations during implementation. Use a 16 px body-text baseline, clear section titles, and limited font weights. Avoid gradients behind dense information.

Dark theme uses dark surfaces, readable neutral text, and adapted semantic colors; it must not simply invert the light theme. Theme selection persists through Settings and should respect a selected System preference.

## 20. Accessibility requirements

- Provide one page-level heading and semantic section headings.
- Use real links for navigation and buttons for actions.
- Make all controls operable by keyboard with a visible focus indicator.
- Label icons, completion controls, theme choices, and attendance actions accessibly.
- Pair status colors with readable text or icons.
- Announce save success/failure without unexpectedly moving focus.
- Move focus into an opened dialog and return it to the triggering control on close.
- Respect reduced-motion preferences.
- Support text enlargement and reflow without losing actions.
- Keep exact due dates available without requiring hover.
- Avoid repeated screen-reader announcements on every countdown refresh.

These are product acceptance requirements. Formal accessibility conformance, if claimed publicly later, needs its own audit.

## 21. Data contract and derived values

### 21.1 Existing source entities

| Source | Overview usage |
|---|---|
| `profiles` | Display name, guest state, university, target |
| `courses` | Course labels, credits, attendance requirement, assessment configuration |
| `class_sessions` | Recurring timetable definitions |
| `attendance_logs` | Recorded attendance counts and latest occurrence status |
| `items` | Pending personal deadlines and completion actions |
| `rooms` / `room_members` | Authorized room list and final deadlines |
| `room_tasks` | Progress and own pending tasks |
| `room_reminders` | Next meeting or presentation practice |
| `questions` / `answers` | Optional later forum preview |

### 21.2 Additional data needed or clarified

The original model is intentionally high level. Implementation needs to define these fields or supporting records:

- User study timezone and theme preference.
- Custom grading system with boundaries, grade points, maximum scale, and rounding policy.
- Per-course target grade when course-specific predictions are shown.
- Weighted assessment entries or an equivalent validated earned/remaining representation.
- A dated class-occurrence identity for attendance, unique per course session and date.
- Semester/course active dates or an explicit absence of term filtering.
- Notification preferences and in-app alert read state.
- Optional timetable exceptions if cancellation/rescheduling is supported.

These are required dependencies for the described behavior, not claims that those database tables already exist. Choose concrete schema names during implementation.

### 21.3 Suggested Overview response shape

```text
profileSummary
setupStatus
nextClass
todayOccurrences[]
deadlineSummary { dueSoonCount, overdueCount }
overdueItems[]
upcomingItems[]
attendanceSummaries[]
academicTargetSummary
roomSummaries[]
studySuggestion
featureAvailability
freshness { generatedAt, timezone }
```

Derived results should include missing-data reasons where useful. Counts and lists should share canonical calculation logic rather than separate implementations that drift apart.

## 22. Time handling and freshness

- Store actual timestamped deadlines consistently and render in the student's study timezone.
- Keep recurring timetable definitions tied to their intended local timezone, rather than naïvely repeating a UTC time through daylight-saving changes.
- Show timezone context when editing deadlines that affect students in different regions.
- Define Today by local calendar boundaries, not by subtracting a fixed 24 hours.
- Recompute date-sensitive sections after local midnight and when returning to the tab.
- Changing timezone refreshes schedule selection, countdowns, and exact dates without rewriting the underlying deadline instant.

Room time changes should come from canonical shared data. A countdown reaching zero changes its display state; it does not delete work or mark a project done.

## 23. Loading, empty, offline, and error states

### 23.1 Section independence

Cards should load and fail independently where practical. A room-service error must not blank the student's personal timetable. Use skeletons matching final card dimensions to reduce layout movement.

| State | Expected behavior |
|---|---|
| Loading | Stable skeleton, no false zero counts |
| Successful empty result | Helpful empty copy and a relevant creation action |
| Partial data | Show available data with explicit missing fields |
| Recoverable failure | Local error message and Retry |
| Previously loaded but stale | Keep last known data with a “Last updated” indication |
| Offline | Show connection status; do not claim unsaved changes were saved |
| Permission removed | Remove restricted content immediately after detection |
| Invalid session | Offer session recovery and clear user-scoped visible data |

Offline mutation queuing is not an MVP promise. If not implemented, disable writes with a clear explanation and preserve form input where safe.

### 23.2 Suggested empty-state copy

| Section | Copy | Action |
|---|---|---|
| Timetable | “Your next class will appear here.” | Add course |
| Deadlines | “No upcoming deadlines added.” | Add deadline |
| Attendance | “Mark your first class to track attendance.” | Open timetable |
| Academic target | “Set your grading system to plan your grades.” | Set grading system |
| Project rooms | “Start a shared space for your next group project.” | Create room |
| Forum | “Ask a subject question or help a classmate.” | Open Subject Q&A |

Do not show “Everything is on track” when the app lacks the data to make that statement.

## 24. Security and privacy behavior

- Personal planner data must be scoped to the current student at the data-access layer.
- Room summaries require current room membership; hiding a card in the interface is not sufficient authorization.
- Scope caches by user identity and clear them on sign-out or identity change.
- Avoid loading full room messages or private files just to display a progress card.
- Do not expose invite tokens unnecessarily in Overview responses.
- Handle text as untrusted user content; render names, notes, and titles safely.
- Link guest and Google identities through a deliberate account flow, not by matching names.
- Account deletion belongs in Settings with its own explicit confirmation flow.
- Any optional analytics should avoid recording document text, grades, private task titles, or room messages.

## 25. Performance expectations

The original product target is a usable home screen within three seconds on an average phone connection. This is a target to measure, not a guarantee established by the mockup.

Implementation should prioritize the header, next class, and nearest deadlines; load less urgent previews afterward if needed. Query aggregate room progress without fetching entire chats or libraries. Avoid starting AI processing from dashboard load.

Measure the target against a documented mobile device/network profile and a realistically populated student account. Record both initial navigation and return navigation behavior. Do not claim the target passes without measurement.

Suggested acceptance dataset: eight courses, fifty pending/completed personal items, ten joined rooms, and a semester of attendance logs. These are test fixtures, not product caps.

## 26. Example populated Overview fixture

Use one consistent scenario for design review and acceptance testing:

- Student: Sara Ahmed, guest account.
- Local time: Monday, October 5, 2026, 09:35 in the fixture's configured timezone.
- Next class: Calculus II, 10:00–11:30, Room B-204; starts in 25 minutes.
- Later class: Database Systems, 13:00–14:30, Room C-101.
- Database schema assignment: Tuesday, October 6, 2026, 05:35; due in 20 hours.
- Calculus quiz: Wednesday, October 7, 2026, 10:00.
- Personal ICT presentation deadline: Friday, October 9, 2026, 14:00.
- Attendance: Calculus 18/20; Databases 14/18; Physics 12/18; all require 75%.
- Campus Sustainability room: six tasks, three done, four members.
- Room practice: Thursday, October 8, 2026, 18:00.
- Room final submission: Friday, October 9, 2026, 17:00.
- Target semester GPA: 3.50 on the student's configured 4.0 scale.
- Calculus course target: 80%; earned 36 final-score points; remaining weight 60.

The presentation's personal deadline and the room submission deadline are separate records in this fixture. Do not assume they are duplicates merely because both are project-related.

## 27. Main interaction flows

### Flow A — New guest builds a useful dashboard

1. Student enters as a guest.
2. Overview shows setup prompts and the guest warning.
3. Student adds a course and its class time.
4. Today's schedule and Next class update after save.
5. Student adds a deadline.
6. The deadline list and counters update.
7. Student configures grading ranges when ready; until then, GPA predictions remain unavailable.

### Flow B — Student records attendance

1. An eligible class row shows Attended and Missed.
2. Student selects Attended.
3. The action saves once for that occurrence.
4. Attendance ratio, status, and prediction refresh.
5. Student can correct the selection without creating a second record.

### Flow C — Student finishes an assignment

1. Student locates a deadline in the Overview.
2. Student marks it done.
3. The pending list and counts update after a successful write.
4. A short Undo option allows correction.
5. The item remains available in the full planner's completed view.

### Flow D — Student prepares for group practice

1. A room preview shows the next practice reminder.
2. Student opens that room.
3. The room displays the relevant reminder and shared tasks.
4. Changes in the room are reflected when Overview refreshes.

### Flow E — Student edits university grading rules

1. Student opens Settings from the academic target card.
2. Student edits fixed marks boundaries and grade points.
3. Invalid overlaps or uncovered ranges prevent a valid grading save.
4. After a valid save, course grade predictions and applicable GPA values recalculate.
5. Returning to Overview shows updated predictions without altering earned marks.

### Flow F — Student uses later study help

1. Student opens Study help from its Overview entry card.
2. Student uploads slides and chooses a summary or quiz.
3. Student may prepare a follow-up question through Ask AI.
4. The selected external AI service opens in a new tab through the supported flow.
5. Returning to Overview preserves normal study planning state.

## 28. Acceptance criteria

| ID | Scenario | Required result |
|---|---|---|
| OV-01 | New user with no saved courses | No invented classes or marks; Add course is available |
| OV-02 | Guest and Google users with equivalent data | Same planner and room permissions |
| OV-03 | Missing display name, entering a room/forum | Name collection occurs before participation |
| OV-04 | Class starts in 25 minutes | Correct course, room, time, and countdown appear |
| OV-05 | Current class overlaps another | Conflict is visible and timetable review is available |
| OV-06 | No class today but class tomorrow | Tomorrow is explicitly labelled |
| OV-07 | Pending deadline is in the past | Item appears overdue with exact deadline accessible |
| OV-08 | Item marked done successfully | Item leaves pending list and counters agree |
| OV-09 | Completion save fails | UI restores prior state and explains failure |
| OV-10 | Attendance is 18/20, requirement 75% | 90% and allowance of four consecutive misses |
| OV-11 | Attendance is 14/18, requirement 75% | Close-to-limit state and zero immediate misses allowed |
| OV-12 | Attendance is 12/18, requirement 75% | Six consecutive attendances needed |
| OV-13 | No recorded attendance | No misleading 0% or shortage prediction |
| OV-14 | Requirement 100% with prior miss | No infinite/invalid numeric recovery output |
| OV-15 | Repeated attendance click | One record exists for the dated occurrence |
| OV-16 | Grading system missing | GPA setup prompt replaces calculated prediction |
| OV-17 | Decimal score at grade boundary | Correct mapping under the configured rounding policy |
| OV-18 | Grade rows overlap or leave a gap | Validation prevents use of an invalid mapping |
| OV-19 | Earned 36, remaining 60, target 80 | Exact need is 44/60; displayed minimum is not rounded down |
| OV-20 | Credits missing | Complete semester GPA is withheld or clearly qualified |
| OV-21 | Room has three of six tasks done | Count and bar both show 50% |
| OV-22 | Room has no tasks | “No tasks yet”; no divide-by-zero result |
| OV-23 | Student loses room membership | Private room data is no longer shown or retrievable |
| OV-24 | Forum/AI feature unavailable | No dead Overview cards or links |
| OV-25 | Browser notification permission denied | Core page remains usable and does not repeatedly prompt |
| OV-26 | Data request fails | Error is distinguished from a successful empty state |
| OV-27 | Local day changes or tab resumes | Today, countdowns, and next class refresh |
| OV-28 | Phone viewport and enlarged text | No essential action is clipped or hover-only |
| OV-29 | Keyboard-only navigation | Every action is reachable with visible focus |
| OV-30 | Guest links to Google | Existing personal data and memberships remain associated |
| OV-31 | Theme changes in Settings | Overview consistently reflects the saved preference |
| OV-32 | User switches or signs out | Previous user's cached personal/room data is not exposed |

## 29. Release boundaries and recommended order

### Core Overview release

- Session-aware shell and navigation.
- Guest warning and setup states.
- Next/current class and today's schedule.
- Personal deadlines with completion actions.
- Attendance summaries and validated predictions.
- University grading setup dependency and academic target summary.
- Authorized room previews and reminder links.
- Responsive light/dark layouts and accessible interactions.
- Loading, empty, failure, and missing-data states.

### Subsequent phases

- Subject Q&A entry card when the forum launches.
- Browser notification support through the reminder-settings flow.
- Rule-based personalized study suggestions.
- Timetable photo scanning through reviewed import forms.
- Slide short/detailed summaries, practice quizzes, and Ask AI handoff.

Do not render unfinished features as working simply to match a concept screenshot.

## 30. Open decisions before implementation

These do not prevent using this specification for design work, but should be resolved before the affected behavior ships:

1. The student's actual grade table and university rounding rules; no sample table is authoritative.
2. Whether grading rules can vary by course or academic year, beyond one student-level default.
3. How to retain historical grades if a student later changes their grading system.
4. The definition of semesters and course active dates in the data model.
5. Whether timetable cancellation, rescheduling, and excused attendance are supported initially.
6. Room completion/archive policy after final deadlines and removal policy for members.
7. Whether AI remains an external-chat handoff or is redesigned as an embedded conversation.
8. AI upload limits, processing history, and source-reference behavior.
9. Final route names, exact breakpoints, and validated design tokens.
10. Guest account-linking conflict behavior and guest-storage wording matched to implementation.

## 31. Definition of done

The Overview is ready for release when its shipped cards use real authorized student data, calculations follow the saved university rules, actions persist correctly, mobile and keyboard use work, failure states are clear, and the applicable acceptance criteria pass.

Verification should include the consistent populated fixture above, a completely empty account, an incomplete grading setup, a guest account, an access-revoked room, and simulated failed saves. Later-phase cards are required only when their underlying features are released.

The generated Overview image remains a visual reference. This specification supplies the behavior that a screenshot cannot define.
