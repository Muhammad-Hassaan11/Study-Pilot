# StudyPilot — Attendance and GPA Planner Detailed Specification

**Version:** 1.0  
**Prepared:** October 3, 2026  
**Status:** Detailed design and implementation specification; no implementation is claimed  
**Scope:** Attendance tracking, shortage predictions, university grading rules, course targets, and semester GPA planning  
**Suggested routes:** `/attendance` and `/gpa-planner`  
**Product language:** English in version 1  
**Audience:** Product owner, designer, frontend/backend developers, and tester

---

## 1. Purpose and source precedence

This document follows an actual inspection of [the Attendance / GPA Planner image](03-progress-planner.png), a reread of `StudyPilot-Full-Spec.md`, and review of the corresponding calculations in [the Overview specification](StudyPilot-Overview-Page-Spec.md).

The goal is to turn the image's academic-progress concept into a precise, usable feature specification. Students should understand their recorded attendance, how many future classes affect their requirement, which course grades remain achievable, and how their university's grade points contribute to semester GPA.

The user's confirmed decision is central: **students enter their university's fixed marks ranges, grade labels, and grade points themselves**. The app must not infer a university's rules from its name or substitute a generic grading table.

### 1.1 Order of authority

1. Explicit user decisions, including fixed marks ranges.
2. The original product specification's confirmed requirements.
3. Previously documented behavior, unless this document explicitly refines a detail.
4. The generated image as visual direction, not a source of mathematical truth.
5. Proposed defaults in this document where the source leaves implementation open.

This task creates a specification only. It does not alter the original source file, implement the website, or certify any institution's grading or attendance policy.

### 1.2 Confirmed and proposed behavior

| Area | Confirmed | Proposed detail supplied here |
|---|---|---|
| Personal access | Google and guest students have equal permissions | Same planning features with account-specific data |
| Attendance | Attended/missed, editable course requirement, shortage prediction | Dated session records, incomplete-history state, precise thresholds |
| Grade mapping | Student-defined fixed marks ranges | Continuous percentage intervals with explicit rounding policy |
| Grading scale | Percentage, 4.0, 10-point, or custom | No arithmetic conversion between unrelated scales |
| Course planning | Earned marks, remaining marks, target requirements | Weighted assessment breakdown and transparent calculations |
| GPA | Target GPA and credit-aware planning | Separate final, partial, and scenario values |
| Study advice | Rule-based tips | Explain the data behind each suggestion |
| Historical records | Not fully defined | Version grading rules and preserve completed-course snapshots |
| Advanced what-if tools | Not explicitly specified | Optional enhancement, distinct from saved actual results |

## 2. Image analysis

The inspected image is a 1536 × 1024 desktop concept titled “Your academic progress”. It places Attendance and GPA planner side by side and includes one Today's classes card.

### 2.1 Visible elements

| Region | Observed content |
|---|---|
| Header | StudyPilot, broad search, notification bell, Sara Ahmed profile |
| Sidebar | Overview, Timetable, Attendance selected, GPA planner, Project rooms, Subject Q&A, Settings |
| Page heading | Your academic progress; Track your attendance and plan your grades, all in one place |
| Page controls | Attendance and GPA planner tabs, Attendance underlined |
| Attendance card | Default requirement 75%, three course rows and prediction text |
| Calculus II | 18 of 20 attended; 90%; On track; can miss 4 classes |
| Database Systems | 14 of 18 attended; 78%; Close to limit; can miss 0 classes |
| Physics | 12 of 18 attended; 67%; Below requirement; attend next 6 classes |
| Daily class | Calculus II, 10:00–11:00, Engineering B, Room 201; Attended/Missed buttons |
| GPA card | 4.0 GPA selector, target GPA 3.50, Course planner and Course targets sub-tabs |
| Selected course | Calculus II; course target 80% |
| Prediction | Need 73.3% on remaining work; 44 of remaining 60 marks |
| Grade chart | Segments labelled 36 earned, 44 needed, 20 buffer |
| Grading note | Grade boundaries are set by you |
| Tip | Start with Calculus revision this week |

### 2.2 Useful design choices

- Attendance rows combine a percentage with an action-oriented prediction.
- The course requirement is visible rather than assumed to be universal.
- GPA and course-percentage targets are presented separately.
- The selected course is explicit.
- A student can mark a class without leaving the academic-progress area.
- The screen has clear card boundaries and readable status labels.

### 2.3 Corrections required before implementation

| Image issue | Required correction |
|---|---|
| Calculus shows 90%, but its fill stops near the 75% marker | Render fill width from the actual ratio: 90% of the track |
| Other attendance bars also have approximate geometry | Use calculated dimensions and one common 0–100% scale |
| 36 earned + 44 needed + 20 buffer ignores lost marks | Represent 4 already-lost points separately; future surplus above target is 16 |
| 73.3% is rounded down from the actual required average | Show an approximation or a conservatively rounded minimum, not a false sufficient score |
| University grade table is not visible | Add a clear grading-system name, validity state, and Edit grading system entry |
| Missing assessment input details | Provide score, maximum marks, weight, and ungraded-state entry |
| No credit-hour input or semester calculation shown | Define a course-credit table and credit-weighted GPA |
| Active Attendance tab still shows full GPA content | Define genuine page navigation; do not hide a route mismatch behind decoration |
| Inner Course planner/Course targets labels are vague | Use clear destinations: selected course planner and semester targets |
| Default attendance field has no visible save/scope explanation | Explain future-course default versus current-course overrides |
| Search across courses, tasks, and rooms is shown | Omit broad search unless a complete authorized search feature exists |
| Date is an unrelated 2025 sample | Use real local date in the product and a consistent 2026 fixture in tests |
| Room/time differs from the Overview sample | Do not infer multiple real schedules from generated mockup details |

The document preserves the visual style while correcting these semantic and mathematical issues. The original image is not edited by this task.

## 3. User goals and scope boundaries

### 3.1 Attendance goals

1. See attendance for each course with the underlying counts.
2. Record or correct the attendance of a specific class occurrence.
3. Understand whether a course is below or close to its requirement.
4. See the effect of the next attended or missed class.
5. Recover missing records without silently treating them as absences.

### 3.2 GPA goals

1. Enter the university's fixed grade mapping once and reuse it.
2. Record assessment results with the correct weights.
3. Select a course grade or percentage target.
4. See the marks needed on remaining work, with assumptions explained.
5. Calculate credit-weighted semester GPA from complete data.
6. Explore future grades without changing actual earned results.

### 3.3 Non-goals

- Official transcript generation or university eligibility certification.
- Relative grading, class curves, percentile ranking, or cohort comparison.
- Automatic portal imports or institution-specific rules guessed from university name.
- Teacher approval, class representative controls, or attendance tracking of other students.
- Location, camera, biometric, or device-presence verification of attendance.
- Automatic grade penalties for attendance shortages unless explicitly modeled later.
- Automatic prediction of likely scores from past performance.
- Degree-audit, repeated-course replacement, or cumulative GPA rules in the initial scope.
- AI-generated attendance or grade calculations where deterministic arithmetic suffices.

## 4. Navigation and screen structure

### 4.1 Recommended interpretation of the combined image

Treat the image as a combined design preview of two closely related views. Recommended functional design: retain separate Attendance and GPA planner routes in the shared academic-progress shell, with the selected route showing the full corresponding workspace.

The top Attendance / GPA planner controls navigate between those views and reflect the sidebar selection. Do not display both full views under a tab whose semantics say only one is selected. If a combined Academic progress dashboard is later preferred, make that a separate explicit view with section links rather than false tabs.

### 4.2 Attendance view

```text
Academic progress / Attendance
Semester selector                     Attendance settings
Summary: below requirement / close to limit / unmarked sessions
Course attendance list with counts, requirement, bar, prediction
Today's classes and quick attendance controls
Selected course history / corrections / next-class explanation
```

### 4.3 GPA planner view

```text
Academic progress / GPA planner
Semester selector           Saved university grading system
Target semester GPA         Calculation coverage/status
Course planner | Semester targets
Selected course / course credits / target grade or percentage
Assessment breakdown / earned and remaining contribution
Required score / achievable range / accurate chart
Semester course table / weighted GPA or scenario total
```

These layouts are proposed expansions of the visible cards. Exact route names and panel placement can change without changing calculation rules.

### 4.4 Shared shell

Use the established navigation and profile controls. Preserve a guest warning where applicable. Broad application search is not necessary to deliver these pages; local course selection/search can be implemented independently.

Provide direct links from Overview alerts to the relevant course and view. Return navigation should preserve selected semester and course without carrying one user's selection into another account.

## 5. First use and progressive setup

Do not fill a new account with the screenshot's example courses. Provide real empty states and a short setup checklist.

### 5.1 Attendance setup

1. Add a course.
2. Add its class schedule or a dated occurrence.
3. Set the required attendance percentage.
4. Record attended or missed classes.

Attendance works even when grading settings are incomplete. A student should not need to enter GPA information merely to mark a class.

### 5.2 GPA setup

1. Choose the academic scale and enter fixed grade boundaries.
2. Add or select courses in the semester.
3. Enter course credit hours when GPA calculation is required.
4. Enter assessment structure and available scores.
5. Set semester and/or course targets.

Until these dependencies exist, show exactly what is missing. Missing values are not equivalent to zero scores, zero credits, or failed grades.

### 5.3 Sample data

A separate demo may show the complete fixture in this document with a persistent Sample data label. Demo values must never be silently merged into a student's actual academic records.

## 6. Semester and course context

The original high-level schema lacks a full semester model. A semester identifier or equivalent grouping is required before claiming a semester GPA. Proposed fields are name, start/end dates, and associated course instances.

Courses are instances in a particular academic period, not only reusable names. Retaking Calculus in another period must not accidentally combine attendance or marks with a prior course instance.

| Course property | Attendance use | GPA use |
|---|---|---|
| Name/code | Course identification | Course identification |
| Schedule/room | Class occurrences | Not needed for calculation |
| Required attendance | Course threshold | Does not automatically change grade |
| Credits | Not used in session-count attendance | Required for credit-weighted GPA |
| Grade-system version | Not used for attendance | Maps scores to grade points |
| Assessment breakdown | Not used for attendance | Produces weighted final percentage |
| Course target | Not used for attendance | Required score calculation |

The university name is descriptive free text. It does not supply or verify the settings.

## 7. Attendance settings and rule scope

### 7.1 Default versus course override

The visible Default requirement field becomes a saved preference. Proposed behavior: use it when a new course is created, with an independent editable requirement stored on each course.

Changing the default does not silently rewrite every existing course. Offer a separate reviewed “Apply to selected courses” action if bulk changes are implemented. Explain affected courses before committing.

### 7.2 Validation

- Required percentage must be a finite numeric value between 0 and 100 inclusive.
- Proposed precision: up to two decimal places; store exact decimal values.
- Empty is an unset requirement, not zero.
- Each course displays its effective saved threshold.
- Saving a new threshold recalculates warnings immediately after success.
- A failed save preserves the previous valid threshold and the student's input draft.

The initial predictor treats each counted class equally. Some institutions count hours or separate lectures/labs. Do not claim this simple model supports those policies automatically. Such courses require a clearly supported alternative model or an explicit unsupported-policy notice.

## 8. Class occurrences and attendance records

A repeating timetable slot is not itself an attendance record. Attendance belongs to a dated occurrence of that slot.

### 8.1 Identity and states

Use a stable occurrence ID or unique combination of course/session/date. Two classes of the same course on one day must remain distinct. Use the course's study timezone when identifying a local date.

Record states:

- **Attended:** explicitly marked present.
- **Missed:** explicitly marked absent.
- **Unmarked:** no decision recorded yet; not included in the recorded ratio.

Cancellation is a session-lifecycle exception, not a third attendance result in the source's two-state model. If supported, cancelled/non-held sessions are excluded. Future sessions are not part of the current attendance denominator.

### 8.2 Editing schedule and records

Editing a recurring timetable must not delete historical attendance or move it to a different date. Schedule changes affect future occurrences unless the student intentionally corrects a specific past occurrence.

Delete or cancellation of a past counted session requires a clear correction flow. Recalculate affected summaries and preserve enough revision information for the student to understand the change.

### 8.3 Existing attendance at first use

A student may begin using StudyPilot mid-semester. Proposed options are entering individual historical sessions or an explicit opening balance: attended and missed counts up to a cut-off date.

Opening-balance import is an optional extension, not an existing capability. If implemented, label its provenance and prevent detailed records in the same date range from being counted twice. Never silently initialize attended counts from the timetable.

## 9. Marking and correcting attendance

### 9.1 Today's classes card

Show the local date, course name, start/end time, room, and current recording state. The user can mark a class that has started or ended; future classes remain disabled for recording in the standard flow.

The source image's date and room are illustrative. Production reads the saved occurrence, not text copied from the mockup.

### 9.2 Controls

- Attended and Missed are mutually exclusive values for the occurrence.
- Selecting a value saves one record, then updates related counts and predictions.
- Selecting the other value changes that record rather than inserting another.
- Provide a deliberate “Clear record” correction to return to Unmarked.
- Show saving, saved, and failed states.
- Retry safely without duplicate counts.
- Provide an Undo opportunity or accessible history correction screen.

Clear record means “not recorded”, not “excused”. The application must not invent an institution's excused-absence policy.

### 9.3 History view

For a selected course, list dated sessions with time, result, and edit controls. Filters may include All, Attended, Missed, and Unmarked. Display incomplete-history warnings when known held sessions remain unmarked.

Do not publicly expose this personal history to room members, even if they share the same course name.

## 10. Attendance summary and warning states

### 10.1 Row contents

Each course row contains course name, attended/recorded counts, percentage, required percentage, proportional bar, textual state, prediction, and a link to history. Proposed display precision is one decimal place when needed, such as 77.8%.

### 10.2 State definitions

Let `p` be the exact recorded attendance percentage and `q` the required percentage:

- Below requirement when `p < q`.
- Close to limit when `q <= p <= q + 5`.
- On track when `p > q + 5`.
- No recorded data when the recorded denominator is zero.
- Requirement not set when `q` is missing.

Incomplete history is an additional flag, not an attendance percentage. Show “Based on 18 recorded classes; 2 past classes unmarked”, for example.

Use exact values for comparisons. A value that visually rounds to 75.0% can still be below a 75% requirement; display sufficient precision or a clear “Below 75%” label in that case.

### 10.3 Ordering

Proposed default: below requirement first, then close to limit, then on track, with incomplete/unset cases clearly discoverable. Within a risk group, sort by margin to requirement and stable course name/ID. Offer an alphabetical sort if needed, without changing calculation logic.

## 11. Attendance calculation contract

Let:

- `A` = explicitly attended counted sessions.
- `M` = explicitly missed counted sessions.
- `T = A + M` = recorded counted sessions.
- `q` = required attendance percentage.
- `r = q / 100` = required fraction.

All counts are nonnegative integers. The following equations assume equal-weight sessions and unchanged attendance rules.

```text
Recorded attendance percentage = 100 × A / T, for T > 0

Consecutive next classes that can be missed while retaining the requirement:
B = floor(A / r - T)
Applicable when T > 0, 0 < r <= 1, and A / T >= r.

Consecutive next classes that must be attended to recover:
K = ceil((r × T - A) / (1 - r))
Applicable when T > 0, 0 < r < 1, and A / T < r.
```

After calculation, verify the boundary inequalities rather than trusting floating-point rounding. For allowance `B`, `A / (T+B) >= r` and, absent a separate semester cap, `A / (T+B+1) < r`. For recovery `K`, `(A+K)/(T+K) >= r` and the same expression with `K-1` remains below `r`.

Use exact decimal/rational arithmetic or tested equivalent numeric handling. A blanket arbitrary epsilon must not make genuinely below-threshold attendance count as passing.

### 11.1 What these predictions mean

“Can miss 4 classes” means the next four classes could all be missed while the recorded ratio remains at or above the requirement. It is not a total lifetime allowance, an official permission, or an end-of-semester prediction.

“Attend the next 6 classes” means six consecutive attended sessions recover the recorded ratio if no extra misses or record corrections occur. Missing a class during that sequence recalculates the requirement.

### 11.2 Incomplete history

If past sessions are unmarked, label predictions “Based on recorded classes” and provide a correction action. The app cannot determine the official ratio until records are complete. Do not automatically add unmarked sessions to `M`.

## 12. Worked attendance examples and edge cases

| Case | Input | Expected result |
|---|---|---|
| Calculus II | A=18, M=2, q=75 | 90%; B=4; 18/24=75% after four misses |
| Database Systems | A=14, M=4, q=75 | 77.777…%; B=0; one miss gives 14/19=73.684…% |
| Physics | A=12, M=6, q=75 | 66.666…%; K=6; 18/24=75% after six attendances |
| At threshold | A=3, M=1, q=75 | 75%; close to limit; B=0 |
| At upper warning boundary | A=4, M=1, q=75 | 80%; still close to limit under inclusive 5-point rule |
| No records | A=0, M=0 | No attendance recorded; no division |
| No minimum | q=0 | No minimum attendance requirement; no infinity output |
| Perfect requirement, perfect record | A=5, M=0, q=100 | 100%; next miss would violate requirement; B=0 |
| Perfect requirement with a miss | A=4, M=1, q=100 | No finite number of future attendances restores exactly 100% |
| All missed so far | A=0, M=3, q=75 | K=9; 9/12=75% |

With no records, a course requiring 100% should still show the no-records state, not an invented eligibility result.

If requirement is missing or invalid, suppress prediction and explain what to set. A 0% requirement may be valid as an explicit no-minimum setting, but it must not be the default interpretation of a blank field.

## 13. Remaining-semester feasibility and what-if attendance

These features require known remaining held sessions and are proposed enhancements beyond the basic predictor.

### 13.1 Recovery before semester end

Let `R` be the number of known remaining counted sessions. Best possible final attendance is:

```text
Best final attendance = 100 × (A + R) / (T + R)
```

If the recovery count `K` exceeds `R`, explain that the configured requirement cannot be reached within those known remaining sessions. Unknown term dates do not mean zero remaining classes.

Example: Physics has 12/18 and only four sessions remain. Attending all gives 16/22 ≈ 72.73%, below 75%. With six remaining, attending all gives exactly 75%.

### 13.2 Distinguish immediate and end-of-semester allowance

The basic `B` predicts consecutive immediate misses. If all `R` remaining sessions are known and the student attends every one except `X`, the end-of-semester condition is different:

```text
X <= A + R - r × (T + R)
```

Only show a bounded integer allowance if the final target is feasible, clamp it to `[0, R]`, and clearly label its “attend all others” assumption. Do not replace the basic predictor with this different quantity without explaining it.

### 13.3 Scenario controls

Optional controls such as “If I attend the next class” or “If I miss the next class” operate on temporary values. They do not create attendance records. Provide Reset and a persistent Scenario label.

## 14. Correct attendance visualization

Each course track represents 0–100%, its fill is the exact attendance fraction, and the threshold marker is positioned at the saved requirement. All rows use the same scale.

For the image fixture:

- Calculus fill ends at 90%; marker at 75%.
- Database Systems fill ends at approximately 77.78%; marker at 75%.
- Physics fill ends at approximately 66.67%; marker at 75%.

A label above or beside the bar provides exact counts. Do not create a short attractive bar that contradicts the number. For zero records, render an empty/non-numeric state, not a 0% progress value.

Text and icons communicate risk independently of teal, amber, or red. Tooltips may explain the prediction, but all essential information must remain available to touch and keyboard users.

## 15. University grading-system editor

This is a required dependency of GPA planning. It lives in Settings and is accessible directly from the GPA planner through “Edit grading system”.

### 15.1 Required configuration

| Field | Purpose |
|---|---|
| System name | Student-recognizable name, e.g. My university grading |
| Academic scale | Percentage, 4.0 GPA, 10-point, or custom |
| Maximum grade points | Valid upper bound for grade-point values |
| Grade label per row | A, A−, B+, or institution-specific text |
| Marks boundary/range | Fixed normalized percentage band |
| Grade points per row | Numeric points used for GPA |
| Marks rounding policy | Whether final marks are rounded before grade mapping |

Grade labels and points are entered by the student. A 10-point system is not automatically derived by multiplying a 4.0 scale by 2.5. Different systems may use different boundaries and point assignments.

### 15.2 Percentage-only use

If the student chooses percentage-only planning without grade points, course percentage targets still work. Do not label a percentage average as GPA. Credit-weighted GPA stays unavailable until a complete grade-point mapping is provided.

### 15.3 Editing experience

Provide Add grade, edit row, remove row, preview ranges, and Save grading system. Show a complete range preview before use. Draft edits do not affect live calculations until a valid save succeeds.

Allow the student to start from a clearly labelled example, but require review. Never silently declare the example to be their university's table.

## 16. Grade intervals, decimal marks, and validation

### 16.1 Recommended representation

Use ordered lower percentage thresholds. Derive each upper boundary from the next grade's lower threshold. Intervals are lower-inclusive and upper-exclusive, except the top interval includes 100.

This avoids ambiguity such as integer-looking 80–84 and 85–100 ranges leaving 84.5 uncovered. A UI may show familiar whole-number labels only if the decimal/rounding policy makes their meaning unambiguous.

### 16.2 Complete example, not the user's actual table

| Raw percentage with no pre-mapping rounding | Grade | Points |
|---|---|---|
| 85 ≤ score ≤ 100 | A | 4.00 |
| 80 ≤ score < 85 | A− | 3.67 |
| 75 ≤ score < 80 | B+ | 3.33 |
| 70 ≤ score < 75 | B | 3.00 |
| 65 ≤ score < 70 | C+ | 2.50 |
| 60 ≤ score < 65 | C | 2.00 |
| 50 ≤ score < 60 | D | 1.00 |
| 0 ≤ score < 50 | F | 0.00 |

### 16.3 Validation rules

- Cover 0 through 100 exactly once.
- No overlapping intervals or duplicate thresholds.
- No missing lower-end or top-end coverage.
- Boundaries and points must be finite numbers.
- Every grade label is nonempty; proposed default requires unique labels.
- Points must fall within the configured scale.
- For this first-release fixed numeric model, points must not decrease as score rises; equal points across adjacent bands are allowed.
- Reject unsupported nonnumeric states such as Incomplete or Withdrawn as ordinary grade-point rows; model those separately if added later.

If a university policy does not fit these assumptions, explain the limitation rather than storing an invalid approximation. The product's international intent does not mean every special grading policy is already supported.

## 17. Rounding and grading-system versions

### 17.1 Separate three rounding decisions

1. **Calculation precision:** retain sufficient precision for weighted arithmetic.
2. **Institutional mapping policy:** optionally transform the final percentage before choosing a grade band.
3. **Display formatting:** show a readable number without changing eligibility or target achievement.

Proposed default when the student has not specified institutional rounding is no rounding before grade mapping. Display formatting must not silently become the university policy.

Example: 79.95 maps to B+ under the example table with no pre-mapping rounding. Under an explicitly configured nearest-whole-number half-up policy, it maps to 80 and A−. These are different rules.

### 17.2 Grade target versus raw percentage target

If a student selects a target grade, use the lowest raw final score that satisfies the configured mapping policy. Under half-up rounding to whole numbers, A− starting at mapped 80 may become reachable from raw 79.5.

If the student instead enters a raw percentage target of 80%, it remains 80%; do not silently reduce it to 79.5. Explain which target is being calculated.

Only support rounding policies with tested forward and inverse behavior. If a policy cannot be inverted for target planning, show the mapping result but withhold a definitive minimum-score recommendation rather than guessing.

### 17.3 Versioning and historical results

Proposed design: save grading-system versions and bind course results to the version used. Editing rules creates a reviewed change; let the student choose which active courses use it. Completed historical results should not silently change after a new semester's rules are entered.

Show a preview of affected grades before a bulk remap. Preserve raw scores and previous rule versions needed to explain results. Retention after account deletion remains governed by the account policy, not indefinite history.

This refines the Overview's recalculation rule: affected active calculations update after a valid save, while historical results require explicit remapping.

## 18. Assessment entry and earned marks

The image lacks the score-entry model needed to produce its numbers. Define assessment rows for each course.

| Field | Required behavior |
|---|---|
| Title | Recognizable label, such as Midterm or Final exam |
| Type | Quiz, assignment, exam, project, or another supported label |
| Maximum raw marks | Positive numeric value |
| Earned raw marks | Blank until a score is known; explicit zero is valid |
| Weight | Percentage-point contribution to final course score |
| Score state | Scored or ungraded; scheduled/past date does not itself establish a score |
| Date | Optional planning context, distinct from score state |

Proposed default: individual weighted assessment rows. Aggregated categories are possible only with an explicit category calculation method; do not accidentally weight a category and all of its children again.

### 18.1 Validation

- Maximum marks greater than zero.
- Earned marks between zero and maximum for the basic model.
- Assessment weights positive and, in a complete model, sum to 100 exactly under supported decimal precision.
- No bonus/extra-credit behavior unless separately modeled.
- Missing scores remain unknown, not zero.
- A missed exam becomes zero only after the student explicitly records that result.
- Assignment completion in the planner does not automatically produce an academic score.

Draft assessment structures may total less than or more than 100 while being edited, but definitive target predictions remain unavailable until the structure is valid. Show the current total and missing/excess weight.

### 18.2 Prevent double counting

If an assessment is linked to a planner deadline, the score record remains a separate academic entity with one canonical identity. Do not sum it once as a deadline and again as an assessment. Project-room task completion likewise does not award personal marks automatically.

## 19. Weighted course calculation

For each scored assessment `i`, let `s_i` be earned raw marks, `m_i` maximum raw marks, and `w_i` its percentage-point weight toward the final course score.

```text
Contribution_i = (s_i / m_i) × w_i
E = sum of contributions from scored assessments
C = sum of weights of scored assessments
W = sum of weights of ungraded assessments
For a complete valid model: C + W = 100
Lost so far L = C - E
Possible final raw percentage range = [E, E + W]
```

Here, `E` is earned percentage points toward the final course result. It is not the same as the average percentage on work graded so far, which would be `100 × E / C` when `C > 0`.

### 19.1 Screenshot fixture reconstruction

| Assessment | Earned/max | Weight | Final-score contribution |
|---|---|---|---|
| Quiz work | 18/20 | 20% | 18 points |
| Midterm | 45/50 | 20% | 18 points |
| Final exam | Ungraded, out of 100 | 60% | Unknown |

Thus `E=36`, `C=40`, `W=60`, and `L=4`. The student has 90% on graded work so far, 36 secured points toward the final result, and a possible final raw score from 36 to 96.

Do not call 36% the student's current performance average without clarifying that it is secured final-score contribution. Do not claim 100 remains achievable after four final-score points have already been lost.

## 20. Selecting course and semester targets

### 20.1 Course target

Support selecting a grade from the saved university table and, optionally, switching to an explicit percentage target. Display the linked grade points and effective threshold when a grade is selected.

Example: “Target A− · 3.67 points · at least 80%” under the illustrative no-rounding table. Editing the grade mapping must not leave a stale target label paired with a new threshold.

Validate percentage targets within 0–100 and grade targets against the active grading-system version. Preserve raw user choices separately from derived thresholds.

### 20.2 Semester target

The visible 3.50 target is a **semester GPA goal**, not a course percentage. Label it Target semester GPA and include the scale maximum. Reject values outside the configured numeric scale.

A semester target does not uniquely imply “80% in every course”. A student may reach it through different combinations of course points and credits. Do not allocate required course grades automatically without a separately specified strategy.

### 20.3 Target persistence

Save targets deliberately, show save feedback, and keep scenario experiments separate. Changing a target does not change earned marks, attendance, or official grades.

## 21. Remaining-work requirement calculation

Let `G` be the required raw final percentage for the selected target after resolving any explicitly supported grade-rounding policy. With valid `E` and `W`:

```text
D = G - E
Required weighted average on remaining work = 100 × D / W
```

Use this equation only when `W > 0`, `D > 0`, and the data structure is valid. Required results refer to the weighted combination of remaining assessments, not necessarily the same raw percentage on every assessment.

### 21.1 Main states

| Condition | Display |
|---|---|
| Missing grading table for grade target | Set your university grading system |
| Invalid/incomplete assessment structure | Complete assessment details |
| `E >= G`, `W > 0` | Already safe for this target, under configured scoring assumptions |
| `0 < D <= W` | Need X% on remaining work |
| `D > W` | Target out of reach with remaining marks |
| `W = 0`, all results known | Final result and target met/not met |
| Pending result after an exam date | Awaiting result; do not mark score as zero |

“Already safe” assumes no negative marking, minimum-final-exam hurdle, mandatory component pass, later score reduction, or other unmodeled institutional rule. If such a rule applies, do not issue an unconditional safe verdict using this simple model.

### 21.2 Numerical example

For `G=80`, `E=36`, `W=60`, the student needs `D=44` final-score points from the remaining 60. Required average is `73.333333…%`.

Recommended copy: “Need at least 73.34% on remaining work” at two-decimal conservative precision, plus “44 of the remaining 60 weighted points”. An approximate “About 73.3%” may be used as explanatory text, but not as a claim that exactly 73.3% is sufficient.

### 21.3 Whole-mark constraints

If the only remaining assessment is out of 100 and accepts whole marks, the actual minimum is 74/100, not 73.34 marks. Compute the smallest permitted raw mark meeting the final-score target.

If marks can be awarded in half-mark or other increments, use that explicitly configured increment. With multiple remaining assessments, a required weighted average does not uniquely determine each individual score; show the aggregate condition unless the student enters a scenario.

## 22. Correct earned/needed chart

The image's 36 + 44 + 20 chart is numerically misleading because it treats already-lost marks as future room above the target.

### 22.1 Correct 100-point breakdown for the fixture

| Segment | Points | Meaning |
|---|---|---|
| Earned | 36 | Already secured toward final score |
| Needed from remaining work | 44 | Additional contribution needed to reach 80 |
| Remaining capacity above target | 16 | Further available contribution if more than the minimum is earned |
| Already lost | 4 | Completed-assessment points that cannot be earned later in this model |
| Total | 100 | Full course assessment weight |

An alternative clearer chart can show scored contribution versus remaining weight, with a separate target marker and maximum-achievable marker. Whichever design is chosen, preserve the same arithmetic and avoid the ambiguous label “20 marks buffer”.

### 22.2 General chart cases

- Achievable unmet target: `E + D + (W-D) + L = 100`.
- Already-safe target: show `E`, remaining capacity `W`, and lost `L`; no negative Needed segment.
- Unreachable target: show `E`, available `W`, lost `L`, and a separate target shortfall annotation; do not draw a negative surplus segment.
- No graded work: no lost points yet; all assessment weight is ungraded.
- Invalid assessment weights: no definitive 100-point chart until repaired.

Use percentage points in labels unless the course explicitly uses a total-raw-marks model where raw marks have the same meaning. Accessibility text should explain the chart without requiring color interpretation.

## 23. Final grade mapping and achievement states

When all assessments have valid final scores, calculate the raw final percentage, apply the configured institutional rounding policy if any, and select exactly one grade interval.

Show the calculation trail: raw final percentage, mapped percentage if different, grade, grade points, and grading-system version. A small details panel is sufficient; do not overload the main result card.

Example under no pre-mapping rounding: 80.0 → A− → 3.67 points. A result of 79.95 → B+ → 3.33 points in the same table, even if a one-decimal display would visually show 80.0. Display sufficient precision near boundaries to avoid that confusion.

For incomplete courses, grade labels derived from assumptions must say Projected or Scenario. The system must not present the grade mapped from `E` alone as a final grade while `W` remains unknown.

Attendance shortfalls may be displayed alongside course results but do not automatically change them. If an institution uses attendance as an exam eligibility rule, model that explicitly before making eligibility claims.

## 24. Credit-weighted semester GPA

### 24.1 Required data

Every included course requires valid positive credits and a compatible final or explicitly projected grade-point value. Support decimal credits if the institution uses them; do not assume all courses have three credits.

```text
Quality points for course j = gradePoints_j × credits_j
Semester GPA = sum(quality points) / sum(included credits)
```

The denominator must be greater than zero. Courses from incompatible GPA scales cannot be combined without an explicit conversion policy; do not invent one.

### 24.2 Worked example

| Course | Grade points | Credits | Quality points |
|---|---|---|---|
| Calculus II | 4.00 | 3 | 12.00 |
| Database Systems | 3.00 | 4 | 12.00 |
| Physics | 3.67 | 2 | 7.34 |
| Total | — | 9 | 31.34 |

Semester GPA is `31.34 / 9 = 3.482222…`, displayed as 3.48 at two decimals. A simple mean of course grade points is not the same quantity.

These are a separate completed-course GPA fixture. They are not claims that the in-progress screenshot courses already have those final results.

### 24.3 Missing credits and excluded courses

Do not default missing credits to one or three. If a course is excluded because data is missing, show coverage and the excluded course list. Example: “GPA from 2 of 3 completed courses; Physics credits missing”.

Pass/fail, noncredit, repeated, withdrawn, transferred, and incomplete courses require explicit institutional policy. Keep them outside a definitive GPA until a supported inclusion rule exists. Exclusion must be visible, not silent.

## 25. Final, partial, projected, and target GPA

Use distinct labels with clear meanings:

| Value | Definition |
|---|---|
| Target semester GPA | Student's goal, not a calculated achievement |
| Final semester GPA | All intended included courses have final results and valid credits |
| GPA from completed courses | Partial result with explicit coverage |
| Scenario GPA | Uses student-entered hypothetical future results |
| Possible GPA range | Bound under declared remaining-score and mapping assumptions |

Do not call a partial or hypothetical value simply “Your GPA” without qualification.

### 25.1 Target comparison and rounding

Use full calculation precision for comparisons unless the university specifies an institutional GPA-rounding rule that actually governs the target. Merely displaying two decimals must not decide achievement.

Example: a raw GPA of 3.496 may display as 3.50 but remains below a strict 3.50 raw target. Show a sufficiently precise explanation instead of an incorrect Target achieved state.

### 25.2 Possible GPA bounds

As a proposed enhancement, map each course's minimum `E` and maximum `E+W` final percentage through a valid monotone grade table, then weight those endpoints by credits. This produces bounds under the configured simple assessment model, not a prediction of likely outcomes.

If the maximum is below the semester target, explain the shortfall. If the target lies within the bounds, label it “Within the possible range”; discrete grade points and allowed score increments mean the interval does not prove every exact GPA value is achievable.

Do not claim to have found a combination of course results unless an actual scenario or tested allocation algorithm supports it.

## 26. Semester targets and optional what-if planning

The image's Course targets sub-tab is better defined as a Semester targets view: a table of courses, credits, chosen course targets, mapped points, and target/scenario contribution.

### 26.1 Table behavior

- Select a course to open its detailed calculation.
- Edit credits where missing.
- Choose a course target grade using the saved mapping.
- Show required remaining average for each course when calculable.
- Mark unreachable targets distinctly.
- Do not silently replace an unreachable target; suggest the highest achievable grade for review.

### 26.2 What-if mode

If implemented, a Scenario toggle creates an isolated draft with estimated remaining scores or course grades. Show a persistent Scenario label and Reset. A scenario must not overwrite actual scores or attendance.

Example: increasing the expected final-exam score changes the projected Calculus grade and scenario GPA. It does not imply that the exam result has been received.

Saving a scenario or auto-allocating the easiest target combination is optional later scope. The core planner can deliver useful calculations without an optimizer or performance prediction model.

## 27. Study tips and alerts

The Study tip panel is rule-based. Tie each specific suggestion to a saved fact and link to its source course or assessment.

Proposed priority:

1. Missing data that prevents an important calculation.
2. A below-requirement attendance course.
3. A near-term assessment with a demanding but attainable target.
4. An unreachable target that needs review.
5. A general revision suggestion if no specific signal is available.

Examples: “Physics needs six consecutive attended classes to reach 75%, based on current records” and “Calculus needs 44 of the remaining 60 weighted points to reach your target”.

The image's “Start with Calculus revision this week” is acceptable only as a general tip or when prioritization data supports it. Do not imply Calculus is objectively the most urgent subject from the screenshot alone.

In-app warnings should update when scores or attendance are corrected. Avoid repeatedly pushing the same unchanged warning. Browser alerts remain opt-in later-phase behavior, not a prerequisite for basic calculations.

## 28. Save behavior, corrections, and data consistency

### 28.1 Persistence

Use clear Save controls for multi-field forms and visible saving feedback for quick attendance actions. Do not mix unsaved input with saved computed results without marking the result Preview.

On save success, recompute affected course summaries, semester aggregates, and Overview cards from the same canonical logic. On failure, preserve the input draft, retain the last saved result, and explain what did not save.

### 28.2 Multiple tabs and stale edits

Although these are personal records, a student may use multiple tabs/devices. Version or revision checks prevent a stale assessment form from silently overwriting newer scores or grade settings.

Attendance updates are idempotent per occurrence. Score changes update existing assessment records rather than adding another contribution. Derived totals are recomputed or reconciled after reconnect.

### 28.3 Corrections are not penalties

Changing a mistaken Missed to Attended, correcting a raw score, or fixing a grade boundary should update results transparently. Do not treat a correction as an academic event or penalty. Show last-updated details where helpful.

## 29. Loading, empty, invalid, and offline states

| State | Attendance behavior | GPA behavior |
|---|---|---|
| No courses | Add course prompt | Add course prompt |
| Course exists, no records | No attendance recorded | Add assessment structure |
| Requirement missing | Set course requirement | Unaffected unless other data missing |
| Grade table missing | Attendance still works | Set grading system for grade/GPA calculation |
| Scores ungraded | Unaffected | Awaiting results; no fake zeros |
| Invalid weights | Unaffected | Show total-weight error; no definitive prediction |
| Credits missing | Attendance still works | Course planning works; semester GPA incomplete |
| Data loading | Stable skeleton, not 0% | Stable skeleton, not 0.00 GPA |
| Request failed | Error and Retry | Error and Retry |
| Offline | Last known result with freshness label | Last known result with freshness label |
| Unsaved edit | Clearly indicated draft | Clearly indicated draft/preview |

Offline write queuing is not promised. If unsupported, disable saving while keeping safe local form input. Do not report a local draft as successfully saved to the account.

One failed section should not blank the other. An invalid GPA setup does not prevent attendance recording.

## 30. Responsive layout and accessibility

### 30.1 Responsive behavior

- Wide screens: selected page can use a main workspace plus a supporting explanation/summary panel.
- Tablet: collapse secondary detail before shrinking numeric fields into unreadable columns.
- Phone: stack course rows, prediction, chart, and entry form in a meaningful order.
- Use a course selector above the detail view; do not require horizontal navigation through many cards.
- Grade tables and assessment rows may become labelled cards on narrow screens.
- If a detailed numeric table scrolls horizontally, contain that scroll within the table and preserve labels; the entire page must not overflow.

Suggested breakpoints are 1200 and 768 px, subject to content testing. Keep usable output at a 320 px viewport and when text is enlarged.

### 30.2 Accessible numeric controls

- Permanent labels, units, and helpful errors for every percentage, raw-mark, weight, and credit input.
- Support decimal input without assuming the keypad or locale formatting establishes a different academic scale.
- Do not use color alone for Below requirement or Target out of reach.
- Provide text equivalents for chart segments, threshold markers, and scenario results.
- Make tab/page navigation, record correction, and row menus keyboard-operable.
- Announce save outcomes without re-reading every calculated field on every keystroke.
- Respect reduced motion and show visible focus.

### 30.3 Visual consistency

Keep the established off-white/white surfaces, navy text, indigo controls, teal success, and restrained amber/red warnings. Match the Overview's typography and spacing. Validate actual contrast during implementation; the generated image alone does not establish accessibility.

## 31. Time and academic-period rules

Use the student's configured study timezone for Today and local class occurrences. Store actual scheduled instants consistently where appropriate; repeating class definitions must preserve intended local times across daylight-saving changes.

A completed class must not be moved into a different day by converting a stored date incorrectly. A timezone setting change should not erase attendance or recreate duplicate sessions.

Term start/end dates constrain future-session feasibility only when explicitly known. A course with no term end has an unknown remaining count, not an infinite or zero count.

Assessment due dates and score states are independent. A deadline passing makes a task overdue; it does not prove the grade is zero or that the assessment weight has been forfeited.

## 32. Data model and integrity requirements

The original `marks_done` / `marks_remaining` fields are insufficiently precise on their own: they do not say whether values are raw marks, graded weights, earned contribution, or ungraded capacity. Replace ambiguous meanings with an explicit contract.

| Entity/concept | Needed information |
|---|---|
| Profile preferences | Scale, default attendance, target, timezone, theme |
| Academic period | Name, dates, course grouping |
| Course instance | Owner, period, credits, requirement, grading version, targets |
| Recurring session | Course, local weekday/time, timezone context |
| Dated occurrence | Stable identity, date/time, held/cancelled state if supported |
| Attendance record | Owner, occurrence, attended/missed value, revision |
| Grade-system version | Owner, scale maximum, interval rows, rounding policy, version |
| Assessment | Course, raw maximum, raw score/null, weight, score state, revision |
| Final course result | Raw percentage, mapped score, grade/points, grading version |
| Optional scenario | User/course/period context, hypothetical values, clear separation from actual records |

### 32.1 Integrity constraints

- One active attendance result per dated occurrence per student.
- Assessment/course/grade-system references must belong to the same authorized student or approved immutable system definition.
- No negative counts, invalid numeric values, or zero assessment denominators.
- Grade intervals cover the score domain exactly once.
- GPA credits are positive when included.
- A valid complete assessment structure has 100 total weight under exact supported precision.
- Scored zero is distinct from null/ungraded.
- Derived grade points always identify the rule version used.

### 32.2 Suggested calculation response

```text
attendance:
  attended, missed, recorded, unmarkedKnown
  exactRatio, displayPercentage, requirement, warningState
  nextMissAllowance or recoveryCount
  assumptions, completeness, knownRemainingSessions

coursePlanning:
  earnedContribution, scoredWeight, remainingWeight, lostContribution
  rawTarget, targetKind, gradeSystemVersion
  requiredRemainingAverage, discreteMinimumIfApplicable
  achievableRawRange, resultState, missingDataReasons

semester:
  includedCourses, excludedCoursesWithReasons, includedCredits
  qualityPointTotal, exactGpa, displayGpa, calculationKind
  target, targetComparison, scenarioAssumptions
```

These are conceptual fields, not a provider-specific API. Frontend and backend should share or verify a single canonical calculation contract so Overview and detailed pages do not disagree.

## 33. Privacy, account behavior, and security

Attendance, academic marks, and grading preferences are private to the student. Project-room membership gives no access to these personal records. Do not disclose them through public URLs, shared room APIs, logs, or automatic external AI context.

Guest and Google users use the same authorized calculation flows. Guest-to-Google linking must preserve course instances, attendance, assessments, rules, targets, and versions. Matching display names is not a valid account merge strategy.

Validate mutations beyond the browser. Scope caches and drafts to account identity, and clear or isolate them on sign-out/account switch. Account deletion follows the existing promise to remove personal data; do not retain academic records indefinitely just to support version history.

The guest warning should truthfully explain recovery risk under the actual storage implementation. Anonymous backend records and literal device-only storage are not the same architecture.

## 34. Consistent design and calculation fixtures

### 34.1 Attendance fixture

- Student: Sara Ahmed.
- Reference date/time: Monday, October 5, 2026, 11:35 in the fixture timezone.
- Today's Calculus class: 10:00–11:30, Room B-204, matching the Overview course schedule.
- Calculus: 18 attended, 2 missed, 75% required.
- Databases: 14 attended, 4 missed, 75% required.
- Physics: 12 attended, 6 missed, 75% required.
- Counts are defined before recording today's unmarked Calculus occurrence; history must state its incompleteness until the student records it.

After marking that occurrence Attended, Calculus becomes 19/21 ≈ 90.476%, and immediate miss allowance remains four. Correcting it to Missed gives 18/21 ≈ 85.714%, and allowance becomes three.

This fixture intentionally corrects the generated image's unrelated 2025 date and inconsistent room/time labels.

### 34.2 In-progress course fixture

- Saved example grading table from Section 16; no pre-mapping rounding.
- Target semester GPA: 3.50 / 4.00.
- Calculus course target: raw 80%, equivalent to A− under that example table.
- Quiz 18/20 at 20%; midterm 45/50 at 20%; ungraded final out of 100 at 60%.
- Earned 36, remaining 60, lost 4, maximum final 96.
- Need 44 remaining weighted points; exact average 73.333…%; displayed minimum 73.34%.
- If final marks are whole numbers, minimum final score is 74/100, producing 80.4 overall.

### 34.3 Separate final-semester fixture

Use the three completed-course values in Section 24: 31.34 quality points across nine credits, yielding 3.482222… GPA. Do not combine that final-results scenario with the in-progress Calculus calculation as if both were simultaneously actual records.

## 35. End-to-end user flows

### Flow A — Start attendance tracking

1. Add a course and schedule.
2. Review the default requirement and save any course override.
3. Open today's eligible class.
4. Mark Attended or Missed.
5. See updated counts, proportional bar, warning, and prediction.
6. Correct the entry later if necessary without creating a second record.

### Flow B — Recover a shortage

1. Physics appears Below requirement.
2. Open the explanation showing 12/18 and the 75% threshold.
3. See the six-consecutive-attendance recovery calculation.
4. If known remaining sessions are only four, see that semester recovery is not feasible under current records.
5. Review missing/incorrect records or plan future attendance; the app does not fabricate corrections.

### Flow C — Enter university fixed grades

1. Open Set grading system.
2. Choose the scale and enter grade labels, thresholds, and points.
3. Choose the supported rounding policy or no pre-mapping rounding.
4. Resolve gaps, overlaps, or invalid points.
5. Preview decimal boundary examples and save.
6. Return to GPA planner with the correct named/versioned mapping.

### Flow D — Plan a course target

1. Select Calculus and enter the assessment structure.
2. Record known scores and leave pending results ungraded.
3. Select A− or explicitly enter an 80% target.
4. Read the required remaining average and exact weighted-point need.
5. Inspect whole-mark minimum when only one remaining assessment exists.
6. Open a temporary scenario if supported, without changing actual marks.

### Flow E — Review semester GPA

1. Add credits to every included course.
2. Review final results and their grade-system versions.
3. See weighted quality points and the semester aggregate.
4. If some results/credits are missing, see a qualified partial result and missing-data list.
5. Compare the correct calculation kind against the target using declared precision rules.

### Flow F — Correct grading rules

1. Edit the saved mapping in Settings.
2. Preview which active courses change.
3. Save a valid new version.
4. Recompute selected active-course predictions.
5. Preserve historical results unless explicitly remapped.
6. Overview and detailed planner display consistent updated values.

## 36. Acceptance criteria

| ID | Scenario | Required result |
|---|---|---|
| AG-01 | Attendance route selected | Correct sidebar/navigation state and full Attendance workspace |
| AG-02 | GPA planner route selected | Correct GPA workspace; no false selected-tab state |
| AG-03 | Guest and Google accounts with equivalent data | Same attendance and GPA capabilities |
| AG-04 | New account | Empty/setup states, no mock courses inserted |
| AG-05 | Default attendance changed | Existing course requirements not silently overwritten |
| AG-06 | Course-specific requirement saved | Correct row and predictions update |
| AG-07 | Blank requirement | Unset state, not interpreted as 0% |
| AG-08 | Duplicate attendance submission | Exactly one result for the occurrence |
| AG-09 | Two same-course classes on one day | Distinct occurrence records |
| AG-10 | Missed corrected to Attended | Existing record changes; totals remain consistent |
| AG-11 | Record cleared | Returns to Unmarked, not excused or missed |
| AG-12 | Future class selected | Ordinary attendance marking unavailable |
| AG-13 | Timetable changed | Past attendance preserved correctly |
| AG-14 | A=18, M=2, requirement 75% | 90%, allowance four, fill width 90% |
| AG-15 | A=14, M=4, requirement 75% | Approximately 77.8%, close to limit, allowance zero |
| AG-16 | A=12, M=6, requirement 75% | Approximately 66.7%, six consecutive attendances required |
| AG-17 | A=3, M=1, requirement 75% | At limit, zero immediate misses allowed |
| AG-18 | Attendance exactly five points above requirement | Close to limit under specified inclusive boundary |
| AG-19 | Ratio rounds to threshold but is below it | Below-requirement state uses exact comparison |
| AG-20 | No records | No division, false 0%, or safe verdict |
| AG-21 | Requirement explicitly 0% | No minimum label; no infinite allowance |
| AG-22 | Requirement 100% with prior miss | No finite recovery claim |
| AG-23 | Known unmarked past sessions | Completeness flag and qualified prediction |
| AG-24 | Physics 12/18 with four remaining | Best final 16/22, target infeasible within known sessions |
| AG-25 | Remaining sessions unknown | No invented semester-feasibility result |
| AG-26 | Attendance scenario changed | Actual records untouched |
| AG-27 | Grade table absent | Attendance works; grade/GPA setup action shown |
| AG-28 | Grade intervals overlap or leave a gap | Invalid mapping cannot become active |
| AG-29 | Score exactly at a threshold | Correct lower-inclusive band selected |
| AG-30 | Score 84.5 under example table | A−, no uncovered decimal gap |
| AG-31 | Score 100 | Top grade selected correctly |
| AG-32 | Score 79.95, no pre-mapping rounding | B+ under example table |
| AG-33 | Score 79.95, explicit half-up whole rounding | A− under example table |
| AG-34 | Raw percentage target 80 with grade rounding enabled | Raw target remains 80, not silently reduced |
| AG-35 | GPA scale changed from 4.0 to 10-point | No automatic multiplication/conversion of old results |
| AG-36 | Invalid grade points or nonfinite value | Save rejected with field-specific feedback |
| AG-37 | Grade system version updated | Selected active results change; history not silently remapped |
| AG-38 | Assessment score blank | Ungraded, not zero |
| AG-39 | Assessment explicit zero | Zero contribution counted as scored work |
| AG-40 | Assessment deadline passes | No automatic score or grade penalty |
| AG-41 | Weights do not total 100 | Clear structure error; no definitive target prediction |
| AG-42 | Maximum raw marks is zero | Invalid denominator rejected |
| AG-43 | Earned marks exceed maximum in basic model | Rejected unless supported extra-credit rules exist |
| AG-44 | Quiz 18/20 at 20%, midterm 45/50 at 20% | Earned contribution 36, scored weight 40 |
| AG-45 | E=36, W=60, target 80 | Need 44 weighted points; exact average 73.333…% |
| AG-46 | Required average shown as sufficient minimum | Conservative precision, e.g. 73.34%, not 73.3% |
| AG-47 | Sole final out of 100, whole marks only | Minimum 74/100; final score 80.4 |
| AG-48 | Screenshot chart fixture rendered | Segments 36 earned, 44 needed, 16 capacity, 4 lost |
| AG-49 | Maximum score for E=36, W=60 | 96, not 100 |
| AG-50 | E already meets target, W positive | Safe state qualified by configured scoring assumptions |
| AG-51 | E=36, W=60, target 97 | Out of reach; need 61 points but only 60 available |
| AG-52 | W=0 with complete data | Final mapped grade; no division by zero |
| AG-53 | No graded assessments but valid structure | E=0, W=100; no invented failed final grade |
| AG-54 | Multiple remaining assessments | Aggregate weighted requirement, not arbitrary individual scores |
| AG-55 | Credits missing | No invented equal-credit semester GPA |
| AG-56 | Final GPA fixture from Section 24 | 31.34/9 = 3.482222…, displayed 3.48 |
| AG-57 | Raw GPA 3.496 and strict target 3.50 | No false target-achieved state from display rounding |
| AG-58 | Incomplete semester | Qualified partial/scenario label and coverage |
| AG-59 | Incompatible scales across courses | No unsupported aggregate GPA |
| AG-60 | Scenario scores adjusted | Actual earned marks and final results unchanged |
| AG-61 | Save fails | Draft retained; saved result remains identifiable |
| AG-62 | Multiple-tab stale edit | Conflict protection prevents silent overwrite |
| AG-63 | Account switches/signs out | Prior personal data/cache not exposed |
| AG-64 | Room teammate requests personal marks | Access denied |
| AG-65 | Guest upgrades to Google | Attendance, assessment, grading, and target records preserved |
| AG-66 | Phone and enlarged text | Essential numbers, labels, and controls usable |
| AG-67 | Keyboard-only interaction | Forms, navigation, corrections, and scenarios accessible |
| AG-68 | Calculator result appears in Overview | Same canonical value and rule version as detailed page |
| AG-69 | Unsupported institutional hurdle rule applies | No unconditional safe/eligibility claim from simple model |
| AG-70 | Grade points are discrete within possible GPA bounds | Range is not presented as proof every exact GPA is attainable |

## 37. Verification strategy and performance

These calculations materially affect student planning, so meaningful automated verification is required in implementation. Use independent expected values and boundary cases, not tests that only reproduce the same formula implementation.

Recommended checks:

- Attendance allowance/recovery against their defining inequalities.
- No-record, zero-requirement, and 100%-requirement cases.
- Exact grade boundaries, decimal gaps, rounding-policy inverses, and scale validation.
- Weighted assessments with unequal raw maxima and unequal weights.
- Whole/half-mark feasibility for a single remaining assessment.
- Credit-weighted GPA with missing/excluded courses and display-boundary cases.
- Persistence, duplicate prevention, stale updates, guest linking, and cross-account isolation.
- Visual checks proving bar widths and chart segments match numeric labels.

Calculations should remain responsive while entering a realistic semester's data. Use local draft previews only with clear unsaved-state labels; saved outputs remain consistent with trusted validation. Do not fetch entire room histories or run AI services to render these pages.

The original three-second home-screen target is not a measured result for these views. Establish a representative phone/network test and record actual load and input-response behavior before making performance claims.

## 38. Open decisions before affected features ship

1. The student's actual university grade table and supported rounding policy.
2. Whether grading systems vary by course, semester, or academic year.
3. Whether lectures and labs count equally or need separate attendance requirements.
4. How cancellations, excused absences, partial attendance, and contact hours should work if required.
5. Whether mid-semester opening-balance attendance import is included initially.
6. How historical grades are frozen or explicitly remapped after rule changes.
7. Whether category-level grading, bonus marks, dropped quizzes, penalties, or component pass hurdles must be supported.
8. Which raw-mark increments are allowed on assessments.
9. Inclusion rules for noncredit, repeated, pass/fail, withdrawn, or transferred courses.
10. Whether the proposed what-if mode and GPA bounds ship with the initial planner.
11. Whether a combined academic-progress dashboard is desired in addition to the two focused routes.
12. How semester dates and known remaining class counts are entered and maintained.

These are explicit boundaries, not reasons to guess institutional policy. Implement the supported fixed-rule model honestly and qualify results when required data is missing.

## 39. Definition of done

Attendance is complete when students can record and correct dated classes, inspect their course history, see accurate proportional bars, and understand mathematically correct predictions with complete-data qualifications.

GPA planning is complete when students can save their own fixed grade mapping, enter weighted assessments and credits, distinguish actual from hypothetical results, calculate course targets and semester GPA accurately, and trace outputs back to saved inputs and rule versions.

The final interface should retain the image's clear visual style while correcting its chart geometry, lost-mark breakdown, ambiguous rounded minimum, and missing configuration controls. Applicable acceptance criteria must pass using actual saved data, not only screenshot examples.
