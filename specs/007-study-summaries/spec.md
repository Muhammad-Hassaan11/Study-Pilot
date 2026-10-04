# Feature Specification: Phase 7 — Study Documents and Grounded Summaries

**Feature Branch**: Not created; documentation on `master`.  
**Created**: 2026-10-03  
**Status**: Draft; provider, limits, retention and output evaluation gate launch.  
**Input**: Study Help upload, extraction, summaries, source viewer and lifecycle requirements.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Upload a private readable source (Priority: P1)

A student chooses a supported document, understands limits and processing, and opens real pages.

**Why this priority**: Grounded output requires genuine source content and truthful coverage.
**Independent Test**: Upload controlled text, partially readable, corrupt and oversized files.

**Acceptance Scenarios**:

1. **Given** a supported valid PDF, **When** explicitly starting processing, **Then** actual
   transfer progress and extraction stages lead to the correct ordered source pages.
2. **Given** unreadable pages, **When** extraction ends, **Then** coverage identifies them
   and no complete-file claim or invented page content appears.
3. **Given** a guessed document identifier from another account, **When** requested, **Then**
   no filename, preview, extracted text, output or operation is accessible.

### User Story 2 - Read and verify short and detailed notes (Priority: P1)

A student reads concise or detailed material, follows a citation to its actual page and copies it.

**Why this priority**: Traceability makes generated material reviewable and useful for study.
**Independent Test**: Use an authored 12-page teaching deck with known assertions and page map.

**Acceptance Scenarios**:

1. **Given** short output for revision A, **When** opening a reference to page 4 in either
   summary view, **Then** both show the identical page 4 of revision A.
2. **Given** a generated illustrative example, **When** displayed, **Then** it is labelled
   separately from examples actually found in the source.
3. **Given** short output exists but detailed generation fails, **When** returning to Short,
   **Then** the saved output remains readable without a new upload charge.
4. **Given** denied clipboard permission, **When** copying, **Then** a selectable plain-text
   fallback includes the displayed output and coverage note.

### User Story 3 - Manage usage, replacement and deletion (Priority: P1)

A student reuses saved output, understands quota resets and deliberately replaces or deletes files.

**Why this priority**: Cost and lifecycle controls must not corrupt sources or erase valid work.
**Independent Test**: Race for the final allowance, replace a same-name file, delete an active job.

**Acceptance Scenarios**:

1. **Given** one available daily slot and concurrent starts, **When** reserving, **Then**
   usage never oversubscribes and each accepted revision is charged at most once.
2. **Given** a same-filename replacement with different content, **When** processing,
   **Then** a new revision exists and old references are not rebound to it.
3. **Given** deletion during generation, **When** a late result arrives, **Then** the
   document and its output are not recreated.
4. **Given** exhausted allowance, **When** opening saved notes, **Then** reading and copying
   still work and the exact local reset time is shown for new processing.

### Edge Cases

Spoofed file type; unsupported legacy PPT; password protection; scanned pages without OCR;
multi-slide PDF handouts; hidden slides/notes; unreadable formula; contradictory sources;
provider outage versus quota exhaustion; invalid citation; partial generation; cancellation
after provider work started; midnight crossing; guest linking; regeneration failure; unsafe
markup; source text instructing the application to expose other users' data.

## Requirements *(mandatory)*

### Functional Requirements

- **P07-FR-001**: Study Help is personal and later-phase, with equal guest/Google entitlements;
  no upload is automatically shared with a room/forum or given unrelated academic context.
- **P07-FR-002**: File selection previews metadata, optional title/course, actual supported
  formats/limits and processing notice before explicit start. One file per operation.
- **P07-FR-003**: PDF is required and PPTX the proposed presentation format. Legacy PPT may
  ship only with verified conversion; otherwise instruct export to PDF/PPTX. Reject unsafe,
  unsupported, corrupt or encrypted files without a supported unlock flow.
- **P07-FR-004**: Validate actual content and byte/page limits beyond the file extension.
  Proposed limits: 10,000,000 bytes, 50 pages/slides, one active document job/account.
  Oversized documents require smaller export, never silent first-N-page truncation.
- **P07-FR-005**: Show Selected/Validating/Uploading/Queued/Extracting/Source ready/Generating/
  Validating output/Ready and truthful Rejected/Partial/Failed/Cancelled outcomes. Byte progress
  may be measured; generation shows stages/elapsed time, not fabricated percentages or ETAs.
- **P07-FR-006**: Source revision preserves ordered canonical pages and quality flags; PDF
  uses Page and presentations Slide. Handout segmentation must not be falsely claimed.
- **P07-FR-007**: Default scope is visible slides; notes/hidden slides/embedded content are
  excluded unless explicitly supported and disclosed. Never execute presentation programs.
- **P07-FR-008**: Report complete/partial/insufficient coverage with exact affected pages;
  unsupported scans, visuals or formulas get local limitations and source access.
- **P07-FR-009**: Short and detailed output each derive from the source, not merely from
  expanding short text. Preserve qualifiers, negation, units and process order; identify
  conflicting source statements rather than merging them into a false certainty.
- **P07-FR-010**: Short output has title, concise main points, supporting references,
  optional takeaway and coverage. Proposed 4–8 points/150–300 words for a normal 12-page deck
  is guidance; no filler to meet a count.
- **P07-FR-011**: Detailed output includes stable contents navigation, explanatory sections,
  relevant definitions/processes/formulas, source examples and revision checklist; proposed
  600–1,200 words for the same deck is guidance. Added illustrations are clearly labelled.
- **P07-FR-012**: All finished output has source revision, output version, coverage and
  validation state. Validate reference IDs, structure and completeness before publishing;
  syntactic correctness is never described as verified subject accuracy.
- **P07-FR-013**: Source viewer supports all included pages, previous/next/expand and ordered
  citation page sets; maintain reading position. Missing preview gives local error, not fake image.
- **P07-FR-014**: Copy active summary/section with readable headings and references, preserve
  partial-coverage notes, and exclude internal storage URLs, secrets and unrelated records.
- **P07-FR-015**: Reopening an existing valid output does not regenerate it; missing tabs
  show explicit Generate actions. Regeneration is bounded and explicit; prior valid output
  remains until new output succeeds, with versions identified.
- **P07-FR-016**: Proposed allowance is three accepted new source revisions per UTC day;
  atomically reserve before work, commit at first usable validated output, release on failure
  or cancellation without usable output. Separate attempt/compute budgets bound refunded work.
- **P07-FR-017**: One revision may serve short/detailed/initial quiz under generation budgets.
  Reads, copying and same-quiz retry consume no new document slot. Account-scoped identical
  source reuse avoids redundant work; no private cross-user reuse leak.
- **P07-FR-018**: Reservation stays in its original day across midnight; show exact reset
  in local time. Timezone changes/guest linking must not reset usage or double-charge.
  Anonymous accounts do not constitute perfect per-human anti-abuse enforcement.
- **P07-FR-019**: Replace creates a new source revision; Upload another creates a distinct
  document. Existing output/attempt/draft references keep the old version or clearly end;
  no filename-based relabelling. Disclose retained-history duration before promising it.
- **P07-FR-020**: Reload/retry resumes the existing job when appropriate. Cancellation stops
  later publication without falsely claiming already-started provider work never happened.
- **P07-FR-021**: Document deletion covers originals, revisions, extracted text, thumbnails,
  outputs, related quizzes/attempts/drafts under published policy; stop active jobs and block
  late writes. Cleanup must not erase still-promised results without notice.
- **P07-FR-022**: Output/section issue reporting persists exact version/reference and reason
  to a real process. Receipt does not mean review or correction has occurred.
- **P07-FR-023**: Uploaded instructions/model outputs are content only: no unrelated account
  access, app commands, automatic external sending or executable rendering.
- **P07-FR-024**: Disclose actual processing service handling before use; no unverified
  no-retention/training/region guarantees. Publish feasible operational limits before launch.
- **P07-FR-025**: Source thumbnails load on demand; mobile prioritizes single-column reading
  with accessible source overlay/contents. Follow CQ-01–CQ-07 and keep module failures local.

### Key Entities

Owned Study document references a current source revision; revision owns ordered pages.
Processing job binds requested operation/revision and retry/cancellation state. Generated
output binds version/coverage/sections/references. Usage reservation binds account, UTC
window and reserved/committed/released state. Generation budget is independent of upload
count. Output issue report identifies exact version and disputed section.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **P07-SC-001**: All controlled output references resolve to real pages of the same source
  revision; zero structural-invalid outputs are published as finished.
- **P07-SC-002**: Human review of release fixtures finds no unsupported substantive claims,
  omitted critical qualifiers or mislabelled generated examples; failed outputs are corrected
  and reevaluated before release. Record reviewer and reviewed output versions.
- **P07-SC-003**: Every concurrent quota, midnight, linking, retry, cancellation and late-write
  case maintains correct usage and lifecycle; existing permitted output stays readable at zero quota.
- **P07-SC-004**: At least 9/10 testers locate a summary statement's actual source page and
  distinguish partial coverage within 30 seconds after output becomes ready.

## Dependencies, Assumptions and Phase Exit

Requires Phase 1 and follows stable 1–5 as a release policy; Phase 6 is independent. Applies
SH-01–33, SH-52–72 where relevant; quiz-specific parts follow Phase 8. Adopt the source's
proposed byte/page/quota defaults for review, not as proven affordable service limits.
Provider, OCR/PPTX support, retry/regeneration budgets, retention and issue handling must be
verified prelaunch. Evaluate actual text/PPTX/scanned/formula/conflict/sparse/adversarial
fixtures; the mentioned teaching deck must first be authored. No fake processing from screenshots.
