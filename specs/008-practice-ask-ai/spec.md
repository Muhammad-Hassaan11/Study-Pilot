# Feature Specification: Phase 8 — Practice Quizzes and External Ask AI

**Feature Branch**: Not created; documentation on `master`.  
**Created**: 2026-10-03  
**Status**: Draft; provider destinations and generation limits require verification.  
**Input**: Study Help quiz, review, issue reporting and copy-and-open handoff requirements.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Practise from my own source (Priority: P1)

A student generates a small source-grounded quiz, checks answers and reviews an honest score.

**Why this priority**: Practice should deepen understanding without inventing exam authority.
**Independent Test**: Use a five-question fixture with known answers and references.

**Acceptance Scenarios**:

1. **Given** a readable source, **When** requesting five questions but only three are
   defensible, **Then** three valid questions or an insufficient-content state appear, not filler.
2. **Given** three correct, one incorrect and one skipped, **When** finishing, **Then**
   results show 3/5, 60%, and the exact breakdown.
3. **Given** unchecked options, **When** reading a question, **Then** answers/explanations
   remain unrevealed until Check answer; later feedback links to the supporting source.

### User Story 2 - Retry and report without rewriting history (Priority: P1)

A student retries the same quiz and flags questionable material tied to its exact version.

**Why this priority**: Stable questions and attribution make practice results interpretable.
**Independent Test**: Shuffle options, retry, replace source and report an answer issue.

**Acceptance Scenarios**:

1. **Given** the same quiz, **When** retried with shuffled display, **Then** stable option
   identities preserve scoring, a new attempt is created and no regeneration/upload charge occurs.
2. **Given** source replacement mid-attempt, **When** continuing, **Then** the attempt remains
   tied to the original source/quiz version with an old-version indication.
3. **Given** a disputed answer report, **When** corrected later, **Then** a new quiz version
   does not silently rewrite the old attempt's score.

### User Story 3 - Prepare a deliberate external AI question (Priority: P1)

A student selects a source section, edits a question, reviews the complete outgoing payload,
copies it and opens ChatGPT or Claude in another tab.

**Why this priority**: External help must share only the context the student chose.
**Independent Test**: Toggle excerpts, edit after copying, block clipboard, return from provider.

**Acceptance Scenarios**:

1. **Given** Include excerpt is unchecked, **When** copying, **Then** copied text exactly
   matches the preview and contains no excerpt, private grades or room content.
2. **Given** the question changes after copying, **When** viewing the composer, **Then**
   copied state is marked stale and Copy updated question is offered.
3. **Given** a provider is opened, **When** returning, **Then** reading/draft context is
   restored without claiming an external message was sent or importing an invented reply.

### Edge Cases

Zero valid questions; invalid answer key; duplicate questions; unreadable supporting page;
skipped answers; stale attempt write; source deletion; failed regeneration; long context;
suggested prompt overwriting a draft; clipboard denial; blocked new tab; changed provider
URL; unavailable external account; draft left over from another identity.

## Requirements *(mandatory)*

### Functional Requirements

- **P08-FR-001**: Quiz setup shows source revision/coverage and proposed count five, maximum
  ten; optional section focus requires enough material. Generation is explicit and budgeted.
- **P08-FR-002**: Initial format is single-choice multiple choice with one unambiguous
  correct answer, stable question/option IDs, explanation and supporting source references.
- **P08-FR-003**: Publish only valid nonduplicative source-answerable questions; no unreadable
  or unprovided facts, invalid answer keys, or claims to predict university examination questions.
- **P08-FR-004**: Show question number, labelled choices, Check answer, Next and review/back;
  allow skipping. Reveal correctness and explanation only after checking, without implying
  examination-grade anti-cheating protection.
- **P08-FR-005**: Final score=100*correct/total; skipped contributes zero. Show total, correct,
  incorrect and unanswered. Before finish show progress; total zero yields no numeric score.
- **P08-FR-006**: Retry same quiz creates a new attempt against the immutable quiz version
  without generation. Generate another is separately budgeted. Shuffling never changes keys.
- **P08-FR-007**: Retain source/output binding through replacement; invalid-question reports
  target exact versions. Corrections create a new version or explicit issue annotation,
  never silent historical rescoring. Attempt retention follows the published Phase 7 policy.
- **P08-FR-008**: Practice results must not change personal scores, GPA, attendance,
  assignment completion, or room progress and are not shared with a group automatically.
- **P08-FR-009**: Ask AI opens an editable question with selected summary/section/quiz context
  and provenance; it must not silently select the entire document or unrelated student data.
- **P08-FR-010**: Provide Include excerpt and a complete assembled payload preview, including
  any title/reference. Proposed limits: question 4,000 and excerpt 8,000 characters. Oversize
  payload requires visible shortening/selection; no hidden truncation.
- **P08-FR-011**: Explain more simply/Worked example/Test understanding suggestions insert
  editable text only; replacing substantial drafts requires explicit replace or usable Undo.
- **P08-FR-012**: Copy exactly the current preview. Clipboard failure offers selectable text;
  subsequent edits mark the copied state out of date. Success means copied, not externally sent.
- **P08-FR-013**: Open verified ChatGPT/Claude destinations in a new tab through a user action;
  preserve the draft and reading state. Blocked tabs provide a visible usable destination link.
- **P08-FR-014**: Copy-and-open is the baseline. Prefilling is optional and requires verified
  provider support, payload visibility, encoding/length checks, no automatic submission and
  fallback. Never invent external query parameters or imply provider access is unlimited.
- **P08-FR-015**: Do not receive or fabricate external conversation history or completion.
  Return restores local context only; external replies are outside this feature.
- **P08-FR-016**: Quota-zero accounts retain saved quiz attempts, same-quiz retry and local
  external-question preparation; new generation respects Phase 7 budgets and truthful failures.
- **P08-FR-017**: Deleting a source/account handles copied-context drafts and dependent
  attempts per policy; content already pasted to an external service cannot be recalled by
  StudyPilot. Scope drafts to identity and clear/isolate on account switch.
- **P08-FR-018**: Apply CQ-01–CQ-07, including source-bound issue receipts, keyboard options,
  mobile feedback/composer reflow and local failure that preserves valid summary content.

### Key Entities

Quiz definition contains immutable source/output binding, question IDs, options and keys.
Attempt owns selected answers/checked states and score breakdown. Issue report identifies
question/version. Ask AI draft contains question, explicitly selected excerpt, provenance,
include flag and draft/copy state. External provider destination is configuration, not a
stored external conversation or claim of successful submission.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **P08-SC-001**: All controlled scoring, skipped-answer, shuffled-ID and immutable-version
  cases pass; quiz changes produce zero academic-record mutations.
- **P08-SC-002**: Every fixture copy is identical to its visible assembled preview; unchecked
  excerpts and unrelated private records never appear in the copied payload.
- **P08-SC-003**: At least 9/10 testers complete quiz review and identify its supporting
  source, then prepare/copy an external question without assistance within five minutes.
- **P08-SC-004**: All clipboard/tab failure and return-navigation cases preserve recoverable
  drafts and avoid false sent/replied claims; all published fixture questions pass human
  source-answerability review as well as structural validation.

## Dependencies, Assumptions and Phase Exit

Depends on Phase 7's source mapping, privacy, outputs, quotas and retention. Covers
SH-34–51 and quiz-specific SH-52–72. Adopt single-choice questions, immediate feedback after
checking and immutable versions. Provider destinations and supported browsers must be tested
at implementation time; external service pricing/prefill support is not asserted here.
No embedded AI chat, open-answer automatic grading, proctoring, external reply import,
official marks or paid quota unlock. Exit requires real generated-output review and actual
browser handoff/fallback checks, not only static UI demonstrations.
