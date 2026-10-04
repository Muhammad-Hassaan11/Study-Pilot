# Feature Specification: Phase 3 — Attendance and Shortage Predictions

**Feature Branch**: Not created; documentation on `master`.  
**Created**: 2026-10-03  
**Status**: Draft.  
**Input**: Attendance source §§5–14, 28–39 and Overview attendance contract.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Record and correct a class (Priority: P1)

A student marks a started class Attended or Missed and can correct or clear that record.

**Why this priority**: Reliable recorded sessions are the basis of every prediction.
**Independent Test**: Use two same-course occurrences on one day, mark one and reload.

**Acceptance Scenarios**:

1. **Given** a started unmarked occurrence, **When** Attended is submitted twice, **Then**
   exactly one result is counted and the other same-day occurrence stays unmarked.
2. **Given** a Missed result, **When** corrected to Attended then cleared, **Then** counts
   first change in place and then return to unmarked, never to an excused absence.
3. **Given** a future occurrence, **When** attempting ordinary attendance marking, **Then**
   the action is unavailable and no result is saved.

### User Story 2 - Understand my attendance risk (Priority: P1)

A student sees underlying counts, their configured requirement, and mathematically correct
immediate miss/recovery advice qualified by missing history.

**Why this priority**: A rounded number must not produce false eligibility advice.
**Independent Test**: Use the fixture table below independent of GPA or room data.

**Acceptance Scenarios**:

1. **Given** 18/20 and 75% required, **When** the row renders, **Then** it shows 90%, a
   proportional 90% fill, a 75% marker, and four immediate misses allowed.
2. **Given** 12/18 with two known unmarked past classes, **When** reviewing advice, **Then**
   six consecutive attendances are needed based on recorded classes and incompleteness is clear.
3. **Given** 100% required and a prior miss, **When** predicting, **Then** no finite recovery
   is claimed and no infinity/invalid numeric value is displayed.

### User Story 3 - Set course-specific requirements (Priority: P2)

A student chooses a default for new courses and adjusts individual course requirements.

**Why this priority**: Requirements differ across courses and institutions.
**Independent Test**: Change the default with two existing courses, then add a third.

**Acceptance Scenarios**:

1. **Given** saved existing thresholds, **When** the default changes, **Then** only the new
   course inherits it and prior thresholds remain unchanged.
2. **Given** a blank requirement, **When** predictions are requested, **Then** setup is
   requested instead of treating blank as a 0% rule.

### Edge Cases

Zero records; zero minimum; 100% minimum; all missed; exactly at requirement or five points
above; ratio rounding to a threshold from below; unknown remaining semester; cancelled
sessions; stale corrections; course recurrence edits; future-record rejection outside the UI.

## Requirements *(mandatory)*

### Functional Requirements

- **P03-FR-001**: Provide an Attendance workspace with academic-period selection, course
  counts/risk rows, today's eligible classes, history and settings.
- **P03-FR-002**: One student may have at most one attendance result per dated occurrence;
  explicitly recorded Attended/Missed are the only counted states.
- **P03-FR-003**: Unmarked, future and cancelled/non-held occurrences are excluded from
  current ratio; known unmarked past occurrences produce a separate completeness warning.
- **P03-FR-004**: Started/past occurrences can be marked, corrected or cleared with visible
  save feedback; failed saves retain canonical prior values and support duplicate-safe retry.
- **P03-FR-005**: Requirement must be finite 0–100 inclusive, up to two decimal places;
  unset differs from zero. Saved default affects new courses only, absent reviewed bulk edit.
- **P03-FR-006**: History shows date/time/status with All/Attended/Missed/Unmarked filters;
  recurrence changes must not reassign existing history to another occurrence.
- **P03-FR-007**: Compute recorded percentage as 100*A/T, T=A+M, only when T>0.
  Use exact comparisons for risk: below when p<q; close when q<=p<=q+5; otherwise on track.
- **P03-FR-008**: For T>0 and 0<r<=1 with A/T>=r, immediate miss allowance is
  floor(A/r-T). Verify A/(T+B)>=r and A/(T+B+1)<r; never round genuinely failing ratios up.
- **P03-FR-009**: For T>0, 0<r<1 and A/T<r, consecutive recovery is
  ceil((r*T-A)/(1-r)). Verify the recovery threshold and one-fewer-class failure.
- **P03-FR-010**: With zero records show No attendance recorded; q=0 shows No minimum;
  q=100 with a miss shows no finite recovery. Missing/invalid threshold suppresses prediction.
- **P03-FR-011**: Explain equal-session weighting, consecutive-next-class assumptions and
  recorded-history limits. Do not present advice as university permission or certification.
- **P03-FR-012**: Show counts, percentage, threshold marker, textual state, prediction and
  history link; all bars share 0–100 geometry. Sort lowest-margin risks first.
- **P03-FR-013**: Overview and Attendance must display identical saved counts and advice;
  neither requires grading setup. Attendance must not alter academic marks or room access.
- **P03-FR-014**: Apply CQ-01–CQ-07, including personal ownership, multi-tab conflict
  handling, keyboard correction and chart text equivalents.

### Key Entities

Course instance owns a saved requirement. Preference supplies a new-course default. Dated
occurrence identifies a specific class; attendance result records its student's explicit
state and revision. Risk summary derives from recorded counts and completeness.

### Calculation Acceptance Fixtures

| Attended | Missed | Requirement | Required result |
|---|---|---|---|
| 18 | 2 | 75% | 90%; allowance 4 |
| 14 | 4 | 75% | 77.777…%; close; allowance 0 |
| 12 | 6 | 75% | 66.666…%; recovery 6 |
| 3 | 1 | 75% | At threshold; close; allowance 0 |
| 4 | 1 | 75% | 80%; still close |
| 0 | 3 | 75% | Recovery 9 |
| 0 | 0 | 100% | No records; no eligibility verdict |
| 5 | 0 | 100% | Allowance 0 |
| 4 | 1 | 100% | No finite recovery |

For the dated Calculus fixture, recording today's class changes 18/20 to 19/21 and allowance
stays four; correcting to Missed changes it to 18/21 and allowance becomes three.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **P03-SC-001**: All fixture results and threshold inequalities pass independent checks.
- **P03-SC-002**: All duplicate/correction/clear/history-preservation cases maintain exactly
  one result per occurrence and identical Overview/detail counts.
- **P03-SC-003**: At least 9/10 testers record and correct a class in under 30 seconds each.
- **P03-SC-004**: Every incomplete-history fixture discloses its recorded and unmarked counts.

## Dependencies, Assumptions and Phase Exit

Depends on 1–2. Covers AG-01, AG-03–23, AG-25, AG-61–68 as applicable and OV-10–15.
Default precision and simple equal-session model are adopted. Contact hours, excused/partial
attendance, opening-balance imports, and remaining-semester scenarios are deferred; unknown
term end must never be interpreted as zero future classes. Exit requires independent numeric
verification, persisted correction tests, denial checks, and visual geometry review.
