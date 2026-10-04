# Feature Specification: Phase 4 — Fixed Grading and GPA Planning

**Feature Branch**: Not created; documentation on `master`.  
**Created**: 2026-10-03  
**Status**: Draft.  
**Input**: Attendance/GPA source §§15–39 and Overview academic target requirements.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enter my university's grading rules (Priority: P1)

A student creates a complete fixed marks-to-grade and grade-point mapping with an explicit
rounding policy, previews it and saves a version.

**Why this priority**: A scale maximum alone cannot determine an institutional grade.
**Independent Test**: Enter the source's labelled example table and test decimal boundaries.

**Acceptance Scenarios**:

1. **Given** no rules, **When** grade/GPA planning opens, **Then** setup is offered without
   assuming a university table; percentage-only planning remains possible.
2. **Given** duplicate thresholds or uncovered marks, **When** saving, **Then** the invalid
   table stays a draft with field-specific corrections and does not replace valid rules.
3. **Given** completed historical results, **When** saving new rules for selected active
   courses, **Then** historical results keep their old version unless explicitly remapped.

### User Story 2 - Find what I need on remaining work (Priority: P1)

A student enters weighted assessment results and chooses a grade or raw percentage target.

**Why this priority**: Students need achievable, correctly rounded planning advice.
**Independent Test**: Enter quiz 18/20 at 20%, midterm 45/50 at 20%, final ungraded at 60%.

**Acceptance Scenarios**:

1. **Given** that fixture and raw target 80, **When** planning, **Then** earned=36,
   remaining=60, lost=4, maximum=96 and needed=44 weighted points.
2. **Given** whole-mark final out of 100, **When** showing an actionable minimum, **Then**
   74/100 is required, producing 80.4; 73.3 is not shown as sufficient.
3. **Given** blank versus explicit zero score, **When** saving, **Then** blank stays ungraded
   while zero counts as a scored result with lost contribution.

### User Story 3 - Review my semester GPA honestly (Priority: P1)

A student sees credit-weighted final or explicitly partial GPA and compares a separate goal.

**Why this priority**: An unweighted or incomplete aggregate can mislead decisions.
**Independent Test**: Use three completed results with different credit weights.

**Acceptance Scenarios**:

1. **Given** points/credits 4/3, 3/4 and 3.67/2, **When** aggregated, **Then** GPA is
   31.34/9 = 3.482222… and displays 3.48.
2. **Given** one missing credit, **When** reviewing results, **Then** no credit is invented
   and partial coverage lists the excluded course and reason.
3. **Given** raw GPA 3.496 and raw target 3.50, **When** displayed to two decimals,
   **Then** the target is not falsely declared achieved.

### Edge Cases

Exact grade boundaries/100%; negative/nonfinite values; invalid maxima; weights above/below
100; grade scale change; rounding inverse; removed target grade; no scored work; no remaining
work; impossible target; unsupported institutional hurdle; incompatible scales; stale edits.

## Requirements *(mandatory)*

### Functional Requirements

- **P04-FR-001**: Settings must support named grade systems with percentage/4.0/10/custom
  scale, maximum points, unique nonempty grade labels, boundaries, points and rounding policy.
- **P04-FR-002**: Bands cover 0–100 exactly once; use lower-inclusive/upper-exclusive bands
  except top includes 100. Points must be finite within the scale and nondecreasing with marks.
- **P04-FR-003**: Examples require explicit review and sample labelling; university name and
  scale selection must not infer rules or convert 4-point results into a 10-point scale.
- **P04-FR-004**: Percentage-only planning works without grade points; GPA remains unavailable.
  Default mapping policy is unrounded marks; any supported alternative must have tested
  forward mapping and target inversion. Otherwise withhold a definitive minimum.
- **P04-FR-005**: Save rules as versions, preview affected active courses, preserve raw scores,
  and require deliberate historical remapping. Unsaved rule drafts do not affect saved results.
- **P04-FR-006**: Assessment rows require title/type, positive maximum, positive weight and
  scored/ungraded state; score is blank or finite 0–maximum. Allowed score increment is
  explicit when a discrete minimum is shown. Due date is independent of score state.
- **P04-FR-007**: Complete weights must total 100 exactly at supported precision. Incomplete
  drafts show missing/excess weight and suppress definitive predictions. Deadline completion
  and room progress never create assessment scores; linked assessment identity is counted once.
- **P04-FR-008**: Calculate contribution=(score/max)*weight; E=sum scored contributions;
  C=sum scored weights; W=sum ungraded weights; L=C-E; valid C+W=100; achievable range E..E+W.
- **P04-FR-009**: Distinguish secured final-score contribution E from graded-work average
  100*E/C. Pending results are not failed grades even after exam time has passed.
- **P04-FR-010**: Course targets support a saved grade or raw percentage 0–100; semester
  target is separately within the GPA scale. Never invent per-course targets from one GPA goal.
- **P04-FR-011**: Grade targets use the lowest raw score satisfying configured mapping;
  an explicit raw 80% target stays 80 even if half-up rounding makes a grade reachable at 79.5.
- **P04-FR-012**: For valid W>0 and G>E, required remaining average=100*(G-E)/W. E>=G
  gives a qualified safe state; G-E>W gives unreachable; W=0 gives final result, never division.
- **P04-FR-013**: Sufficient displayed minima round upward; with a sole remaining assessment
  honor permitted mark increments. Multiple remaining assessments yield an aggregate weighted
  condition, not arbitrarily assigned individual minima.
- **P04-FR-014**: Charts preserve earned, needed, remaining surplus and already-lost values;
  fixture segments are 36/44/16/4. Safe/unreachable cases have no negative segments.
- **P04-FR-015**: Final mapping shows raw result, mapped result if different, grade, points
  and rule version; incomplete results are never presented as final grades.
- **P04-FR-016**: GPA=sum(points*credits)/sum(credits), using valid positive credits and
  compatible scales. Missing/unsupported course types have visible exclusion reasons.
- **P04-FR-017**: Label Final semester GPA only with complete intended coverage; otherwise
  GPA from completed courses with counts/credits. Goals and hypothetical values remain separate.
- **P04-FR-018**: Use full precision for target comparison unless an explicit institutional
  GPA rounding rule governs achievement. No display-formatting shortcuts.
- **P04-FR-019**: Course planner and semester-target table must show selected course, credits,
  targets, attainable requirement and missing-data causes; saved corrections update Overview.
- **P04-FR-020**: Unsupported bonus marks, category aggregation, penalties, minimum-component
  rules or special course inclusion policies must not receive unconditional safe/GPA claims.
- **P04-FR-021**: Apply CQ-01–CQ-07, including separate route selection, labelled units,
  accessible charts, private results, stale-edit protection and guest continuity.

### Key Entities

Grade-system version contains scale/bands/policy. Course references its chosen version and
credits. Weighted assessment holds raw score or unknown plus maximum/weight. Target records
raw-versus-grade intent. Final result binds marks to their rule version. Semester aggregate
records calculation kind and coverage rather than replacing source results.

### Boundary Acceptance Fixtures

Under the source example: 84.5 -> A−; 100 -> A; 79.95 -> B+ without rounding or A− under
explicit half-up whole rounding. Target 97 with E=36/W=60 is unreachable by one weighted
point. With no graded work E=0/W=100, no failed final grade is inferred. Institutional
exceptions are not assumed absent when the student declares they apply.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **P04-SC-001**: All supplied weighted, boundary, rounding, whole-mark and credit fixtures
  pass independent expected-value checks, with consistent chart totals.
- **P04-SC-002**: Every missing-rule/score/weight/credit fixture explains its blocker without
  a fabricated final value; Overview and detailed results agree in all saved-change cases.
- **P04-SC-003**: At least 9/10 testers can identify required remaining work and whether a
  displayed GPA is final or partial within one minute after setup.

## Dependencies, Assumptions and Phase Exit

Depends on 1–2, not on room/AI services. Source AG-02, AG-27–59, AG-61–69 and OV-16–20 apply.
Versioned fixed monotone bands and individual weighted assessments are adopted defaults.
No category hierarchy, cumulative-degree GPA, repeated-course replacement, or optimizer.
Scenario tools/bounds are deferred; if added, AG-60/70 become required. Exit requires numeric
and round-trip persistence evidence, invalid-input review, and protected-data checks.
