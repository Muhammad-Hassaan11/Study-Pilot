# StudyPilot — Study Help Detailed Specification

**Version:** 1.0  
**Prepared:** October 3, 2026  
**Status:** Detailed product, design, and implementation specification; no implementation is claimed  
**Scope:** Slide uploads, short summaries, detailed summaries, practice quizzes, source references, and Ask AI  
**Suggested route:** `/study-help`  
**Product language:** English in version 1  
**Release position:** Later phase, after the core personal planner and project rooms are stable

---

## 1. Purpose and source of truth

Study Help turns a student's teaching slides into useful revision material: a short overview, a detailed explanation, and practice questions. It also prepares a question and selected context for a separate AI conversation.

This document follows actual visual inspection of all three Study Help previews:

1. [Short summary](05-slides-short-summary.png).
2. [Detailed summary](06-slides-detailed-summary.png).
3. [Ask AI](07-ask-ai.png).

It also uses `StudyPilot-Full-Spec.md` and the established [Overview specification](StudyPilot-Overview-Page-Spec.md). The previews contain fictional slide content. No real `Database Normalization.pdf` has been supplied or analyzed in this task; its title and slide references are design fixtures.

### 1.1 Decision precedence

1. Explicit user decisions govern the product.
2. The original product specification supplies confirmed scope.
3. The images supply visual direction and sample copy.
4. This document supplies proposed behavior where the source is incomplete.

The document distinguishes confirmed requirements, proposed defaults, and open decisions. It does not claim that upload processing, external integrations, or model-generated outputs are already operational.

### 1.2 Confirmed versus proposed

| Area | Confirmed requirement | Proposed implementation detail |
|---|---|---|
| Input | PPT or PDF slide analysis | Explicit supported-format allowlist and private upload workspace |
| Outputs | Short summary, detailed summary, practice quiz questions | Source-bound output versions, on-demand generation, clear review states |
| Ask AI | Open ChatGPT or Claude in a new tab; intended prefilling must be tested | Reviewable question/context plus copy-and-open fallback |
| Access | Free, same permissions for guests and Google users | Same configured feature entitlements and quota policy |
| Cost control | Per-student daily AI upload limit | Atomic quota reservation, bounded processing, reusable outputs |
| Source references | Visible in previews | References bound to actual file revision and validated page identifiers |
| Privacy | Personal data and private rooms protected | Personal Study Help documents private by default |
| Quiz UI | Not shown in a standalone preview | Proposed self-study question, answer, feedback, and review states |
| History/export | Not fully specified | Optional document history; Copy summary is core image behavior |

## 2. Image analysis: short summary

The 1536 × 1024 short-summary image shows a light desktop application with the familiar StudyPilot sidebar and Study help selected.

### 2.1 Observed layout

- Heading: Study help.
- Subtitle: Turn your slides into clear revision notes.
- Source-file card: Database Normalization.pdf; 12 slides; Uploaded just now.
- Actions: Replace file and Upload PPT or PDF.
- Left panel: Your slides, with four thumbnail previews.
- Main panel: Short summary / Detailed summary / Practice quiz tabs.
- Short summary selected, with The essentials heading and four numbered points.
- Slide-range chips next to points.
- Key takeaway panel: Think: one fact, one place.
- Small reminder to check original slides.
- Footer actions: Copy summary, Ask AI about this, Create practice quiz.
- A small Daily upload limit applies message.

### 2.2 Strengths

The document identity is visible while reading. A student can compare summary points with source thumbnails and move directly to a deeper explanation or quiz. The output is short enough to scan without competing with the navigation.

### 2.3 Missing functional details

The image does not define the upload chooser, supported file formats, processing stages, read failures, actual remaining quota, replacement behavior, citation interactions, or content versioning. Those states must be designed rather than inferred from a successful screenshot.

## 3. Image analysis: detailed summary

The detailed-summary preview retains the source-file header and three output tabs. It introduces a table of contents on the left, a central reading document, and a source-reference panel on the right.

### 3.1 Observed content

- Title: Database normalization.
- Caption: Detailed summary · Based on 12 slides.
- Contents: Why normalization matters, First normal form, Second normal form, Third normal form, Revision checklist.
- Numbered sections with paragraphs and source chips.
- A before/after example in a distinct box.
- Source reference: Slide 4 of 12, with previous/next buttons.
- Actions: Ask AI about this, Create practice quiz, Copy summary.
- Reminder that summaries can miss details.

### 3.2 Strengths

The contents list helps navigate a long explanation. The source preview gives students a way to inspect the underlying material without losing their reading position. Section-level actions can support a focused question rather than sending the entire deck to another service.

### 3.3 Missing functional details

The image does not say whether its worked example came from the source or was generated as an illustration. It does not define how a source chip selects the preview, how long summaries are handled, whether outputs remain available after replacement, or how partial extraction is disclosed.

The thumbnail and example are design illustrations, not evidence that the pictured definitions are complete or that a real source supports them.

## 4. Image analysis: Ask AI and cross-image corrections

### 4.1 Observed Ask AI flow

The Ask AI preview has an editable question, a source-context chip, an Include this summary excerpt checkbox, and a visible excerpt. It presents two actions in sequence:

1. Copy question + context.
2. Open ChatGPT or Open Claude in a new tab.

Suggested prompts are Explain it more simply, Give me a worked example, and Test my understanding. A small diagram explains that the conversation continues outside StudyPilot.

This is an external handoff screen, not an embedded assistant conversation. The user has not confirmed an alternative architecture with a chat model running inside StudyPilot.

### 4.2 Corrections and unresolved details

| Observation | Required treatment |
|---|---|
| Short view's slide 4 is Second normal form; detailed view's slide 4 is First normal form | All views must use the same canonical source page map |
| Citation ranges differ across the previews | Production references come from extracted page IDs, never copied from image text |
| PDF pages are labelled slides | Use Page for general PDFs; Slide for actual presentation slides, with explicit numbering |
| Both Replace file and Upload appear | Define replacing the current document separately from creating another document |
| Daily limit copy is vague | Show configured remaining allowance and exact next-reset information when available |
| Detailed example provenance is unclear | Label Source example versus Generated illustration |
| Practice quiz exists only as a tab/button | Define its full interaction and answer-review behavior |
| Ask AI provider buttons appear ready | Verify actual destinations during implementation; do not assume prefilling works |
| Include excerpt is preselected | Always make the exact outgoing content visible and editable before sharing |
| AI concept · Sample content appears | Keep this in demos; real product labels should identify actual AI-generated output and source |

No image establishes guaranteed accuracy, completed processing, verified citations, a real account with an external provider, or unlimited free AI use.

## 5. Product goals and boundaries

### 5.1 Questions the feature should answer

1. What are the main points in these slides?
2. Can I understand the same material in more detail?
3. Where does this explanation come from in my file?
4. Can I test my understanding before an assessment?
5. How can I ask a focused follow-up question?

### 5.2 Included scope

Private document upload, extraction, source preview, generated short and detailed summaries, source-linked practice questions, copying output, external Ask AI preparation, usage-limit states, and clear failures/recovery.

### 5.3 Excluded from the initial scope

- Searching public notes or other students' private documents.
- A public study-document library.
- Automatic import of all project-room files or chat messages.
- Automatic external AI submission of grades, attendance, or room data.
- Guaranteed correct answers, official marks, or predicted exam questions.
- Changing the student's GPA or attendance from a practice result.
- Real-time lecture transcription, audio/video upload, or web scraping.
- Cloud-drive/LMS integrations unless separately added.
- Embedded ChatGPT/Claude chat, saved external chat history, or external-account management.
- Native presentation editing or writing back into the uploaded original.
- Paid tiers, advertisements, or a premium unlock when the free limit is reached.

Timetable/datesheet photo scanning remains a separate later feature with its own reviewed import flow. It is not implemented by uploading a timetable into the slide-summary screen.

## 6. Users, entry points, and privacy model

Guests and Google users can access the same Study Help functions when the feature is released. Guest status must not create a different quality tier or force sign-in to finish an otherwise permitted operation.

### 6.1 Entry points

- Study help in the main navigation.
- Study from your slides card on Overview.
- A saved personal document, if document history is implemented.
- A summary's Ask AI about this action.

The initial route without a document opens the upload/empty state. A document route checks ownership before revealing filename, thumbnails, summaries, or quiz data.

### 6.2 Personal by default

Uploading to Study Help does not share the document with a project room or the forum. Room members do not gain access because they attend the same course. A later explicit Share to room action would require its own permissions, confirmation, and attribution rules.

Choosing a course label for personal organization is optional. It does not let the AI inspect every record associated with that course.

### 6.3 Guest continuity

Keep the established guest recovery warning truthful to the actual storage implementation. Linking a guest to Google should preserve owned documents, generated outputs, and quiz attempts that remain within the retention policy. Do not reset quotas or duplicate documents during identity linking.

## 7. Application structure and navigation

### 7.1 Suggested route model

| Route concept | Purpose |
|---|---|
| `/study-help` | Upload entry and optional recent documents |
| `/study-help/:documentId?view=short` | Short summary workspace |
| `/study-help/:documentId?view=detailed` | Detailed summary workspace |
| `/study-help/:documentId?view=quiz` | Practice quiz workspace |
| `/study-help/ask?document=:documentId` | Question preparation with selected context |

These routes are proposals. A specific document revision/output version must be resolvable even if not exposed as a long URL. Do not place private excerpts or signed storage URLs into routine navigation query strings.

### 7.2 Shared workspace header

Show document title/filename, supported source type, page/slide count, processing/coverage state, and source revision. Provide Replace file and a separate Upload another file action to avoid ambiguity.

The output tabs preserve reading position where practical. Switching to a tab with an existing valid output loads it without regenerating or consuming another document slot. Switching to a not-yet-generated output shows an explicit Generate action or clearly explained first-generation transition.

### 7.3 Action destinations

- Copy summary copies the currently displayed output version.
- Ask AI uses the current section or reviewed selection, not an invisible global context.
- Create practice quiz opens the quiz setup for the current document revision.
- Clicking a source reference opens the matching page in the source panel.
- Replacing the source does not silently attach old output to a new file.

## 8. Upload entry screen

### 8.1 Empty-state content

Show a readable upload panel with a file chooser and optional drag-and-drop. Suggested copy: “Upload your lecture slides to create summaries and practice questions.” Show the actual supported formats and limits beside the control.

Include three concise descriptions: Short summary for quick revision, Detailed summary for explanation, and Practice quiz for self-testing. Do not show fabricated summaries before a real or explicitly selected demo file exists.

### 8.2 Upload form

| Field/control | Behavior |
|---|---|
| File | Required; one document per operation in the initial release |
| Display title | Optional; defaults to a sanitized filename |
| Course | Optional personal organization label |
| File details | Type, byte size, and count after validation |
| Processing notice | Explain that document content will be processed to generate study material |
| Start action | Explicit upload/process action with quota availability |

The existing user request to process a chosen file is sufficient authorization for the product's stated processing flow; do not add repetitive confirmation dialogs. Make the action's purpose and any relevant source-processing scope visible before starting.

### 8.3 Selection and cancellation

Selecting a file previews metadata before processing. The user can remove it or choose another. Cancelling before processing starts should release any reserved capacity. Cancelling after processing starts follows the job-state rules and must not claim all provider work was stopped if it was already sent.

## 9. Supported files and proposed limits

The source specification says PPT or PDF; implementation must explicitly resolve modern PPTX and legacy PPT support.

### 9.1 Format policy

- PDF support is required for the described initial Study Help release.
- PPTX is the proposed first supported PowerPoint format.
- Legacy `.ppt` requires an actual tested conversion path; if unavailable, show “Export as PDF or PPTX” and do not advertise `.ppt` as accepted.
- Macro-enabled presentations, archives, executables, video/audio files, and arbitrary document URLs are outside the initial allowlist.
- Validate actual file content as well as extension and declared type.
- Do not execute macros, embedded programs, actions, or external content while processing a presentation.

### 9.2 Concrete proposed defaults for review

| Limit | Proposed default | Status |
|---|---|---|
| File size | 10,000,000 bytes per document | Study Help proposal, not inherited from room Library |
| Document length | 50 pages/slides per source revision | Proposal to bound processing |
| Daily new document allowance | 3 accepted document revisions per account/day | Proposal; daily limiting itself is confirmed |
| Concurrent active processing | 1 document processing job per account | Proposal |
| Initial quiz size | 5 questions; user may request up to 10 | Proposal; reduce when source is insufficient |

These values are not live service limits or user-confirmed policies. Keep them configurable and validate feasibility before launch. If a deployed value differs, update the UI and tests together. No paid upgrade is introduced by this proposal.

### 9.3 Unsupported and oversized inputs

Reject unsupported formats, corrupted files, encrypted/password-protected documents without a supported unlock flow, and over-limit inputs with a specific reason. Do not consume a completed-document quota slot for a validation rejection.

If a document exceeds the page limit, the simplest initial behavior is to ask for a smaller export. Do not silently process only the first 50 pages while claiming the whole file was analyzed. An explicit page-selection flow can be added later if needed.

## 10. Processing lifecycle and honest progress

### 10.1 Suggested stages

```text
Selected → Validating → Uploading → Queued → Extracting
         → Source ready → Generating requested output → Validating output → Ready

Alternate outcomes: Rejected / Needs review / Partial / Failed / Cancelled
```

Source readiness and individual output readiness are separate. The short summary may be ready while the detailed summary and quiz have not been requested.

### 10.2 Progress presentation

Show measurable upload progress during byte transfer. For model generation, use stage labels and elapsed time rather than an invented percentage or guaranteed countdown.

Useful labels include “Reading your slides”, “Preparing your short summary”, and “Checking slide references”. A checking label must correspond to real checks; it must not imply human fact verification.

If processing continues after navigation, explain where the result can be found. If the current architecture cannot persist background jobs, say so before implying the tab can be closed safely.

### 10.3 Resuming and cancellation

Use durable job identities and idempotent requests. Reloading or retrying should attach to the same valid job when appropriate. Cancellation stops further publication and pending downstream work; stale results must not reappear after a successful delete/cancel request.

## 11. Extraction, OCR, and source coverage

### 11.1 Source representation

Preserve the file revision, ordered pages/slides, extracted text, supported visual descriptions, and any reading-quality flags. Every generated output must know which source revision it used.

Use one-based page/slide labels for users and a consistent internal mapping. A PDF handout containing four slides per page has PDF pages unless per-slide segmentation is actually implemented. Do not call twelve PDF pages forty-eight slides without a reliable mapping.

### 11.2 Text and visual handling

Text-based PDFs and PPTX content can provide extractable text. Scanned pages require a supported OCR/vision path. Diagrams, equations, tables, and code need representations that preserve relevant relationships; a text-only extraction may miss their meaning.

If the pipeline cannot reliably read a diagram or formula, mark the affected page/section and direct the student to the source. Do not invent an explanation of unreadable visuals.

### 11.3 Speaker notes and hidden content

Proposed default: analyze visible slides only. Speaker notes and hidden slides are not included unless explicitly supported and disclosed. Do not silently treat comments, metadata, or embedded objects as teaching content.

### 11.4 Coverage states

| State | Meaning | UI treatment |
|---|---|---|
| Complete readable coverage | All intended pages were read sufficiently for the requested output | Show processed page count |
| Partial | Some pages were unreadable, omitted by explicit selection, or unsupported | Show affected pages and scope of summary |
| Insufficient content | Too little readable material for a useful output | Offer replacement or different export |
| Extraction failure | Processing could not obtain usable content | Clear failure and retry/replacement action |

“Based on 12 slides” is appropriate only when all twelve are genuinely included. If ten are processed, say “Based on 10 of 12 pages” and identify the exceptions.

## 12. Generation grounding and output contract

### 12.1 Source-first behavior

Generate short summaries, detailed summaries, and quiz questions from the extracted source representation. Do not create the detailed summary solely by expanding the short summary; that can magnify omissions or errors.

The default is summarization of the uploaded material, not independent web research. Broader explanations, if enabled, must be labelled as supplemental and must not receive fabricated source-slide citations.

### 12.2 Proposed structured output

```text
documentId, sourceRevision, outputType, outputVersion
title, generatedAt, coverage
sections[]:
  sectionId, heading, contentBlocks[]
  references[]: canonical source page IDs
  provenance: source paraphrase / source example / generated illustration
  limitations[]
keyTakeaways[]
validationState
```

For quizzes, use a separate schema with questions, options, correct-answer keys, explanations, source references, and versioned scoring configuration.

### 12.3 Validation before publishing

- Valid structured output with required fields.
- All references belong to the current document revision and valid page range.
- No missing or duplicated section IDs that break navigation.
- Quiz questions have valid answer structure.
- No truncation presented as a complete response.
- Coverage claims match actual processed input.
- Unsafe markup is not directly inserted into the page.

Schema and range checks cannot prove semantic accuracy. Add source-alignment evaluation during quality testing and expose a way to report inaccurate output. Never label a response Verified merely because its JSON parsed or page numbers exist.

## 13. Short summary specification

### 13.1 Purpose

Help the student identify the central ideas quickly. Keep the original subject terminology where useful and explain abbreviations when supported by the source.

### 13.2 Proposed content structure

- Document/topic title.
- Optional one-sentence overview.
- Usually 4–8 concise key points, adjusted to source complexity.
- Source references for each substantive point or tightly related group.
- One brief takeaway if it adds value.
- Coverage/limitation note where needed.

For an ordinary 12-slide teaching deck, a proposed target is approximately 150–300 words. This is a design guideline, not a guarantee or a reason to invent filler. A sparse deck may need fewer points; a dense deck may need an explicit concise selection of core concepts.

### 13.3 Behavior

Clicking a point's source chip selects the relevant page(s) in the source panel. Copy summary copies the visible validated summary version with readable headings and references. Ask AI about this can target the whole short summary after preview or a selected point.

If there is insufficient readable source content, show that limitation rather than generating generic subject notes that appear to summarize the file.

### 13.4 Quality expectations

Preserve important qualifiers, units, conditions, and distinctions. Do not turn a cautious source statement into an absolute rule. Do not infer that a topic is exam-important merely because it appears often.

The screenshot's normalization content is sample copy, not a formal textbook source. Real generated definitions should follow the uploaded material and make any simplification explicit.

## 14. Detailed summary specification

### 14.1 Purpose

Provide a readable explanation of the source material with enough structure for revision. The detailed view should add explanation and organization, not simply repeat the short summary with more words.

### 14.2 Reading structure

- Title and source coverage.
- Table of contents generated from stable section IDs.
- Sections following the teaching sequence or a clearly related conceptual order.
- Definitions, relationships, processes, or formulas where present in the source.
- Source examples with references.
- Optional clearly labelled generated illustrations.
- A revision checklist based on the covered material.

For a normal 12-slide deck, a proposed 600–1,200-word range is a starting design target. Adjust for source density and processing limits. Do not promise every slide receives a fixed paragraph or fabricate detail to reach a length.

### 14.3 Contents navigation

Clicking an entry scrolls to or opens the corresponding section, with focus handled accessibly. Highlight the currently viewed section without causing focus jumps during ordinary scrolling. On mobile, use a collapsible contents control.

### 14.4 Source and generated examples

Use distinct labels:

- **From your slides:** a paraphrase or example actually present in the source.
- **Illustrative example:** an added explanation designed to help understanding.

An illustrative example can cite the underlying concept's source, but it must not claim the exact example appeared on that page. Unsupported external facts must not be disguised as source content.

### 14.5 Formulas, code, and tables

Preserve formatting and units. If a formula cannot be read reliably, show a source link and a localized limitation. Do not render guessed mathematical symbols as a confident equation. Code examples should be text-safe and must never execute merely by being displayed.

## 15. Source viewer and reference interactions

### 15.1 Short-view source rail

Show a scrollable or paginated list of thumbnails with page numbers and optional extracted titles. Load thumbnails on demand. A twelve-page document must not be represented as only four available pages because the screenshot shows four previews.

### 15.2 Detailed-view source panel

Show the selected page number, thumbnail/preview, previous/next controls, and an Expand source action. Ensure full-size content can be read when a small thumbnail is insufficient.

When a citation references multiple pages, allow the student to step through that ordered set and show which pages are associated with the section. Preserve the summary's reading position.

### 15.3 Reference integrity

- References bind to a specific file revision, not just a filename.
- A replaced file with the same name gets a different revision if its content changes.
- Page indices must map to the same canonical page across summary, detailed view, quiz, and Ask AI context.
- Missing thumbnails do not justify fabricated page content; show a preview error while preserving any valid text.
- A reference should support the associated claim; a nearby page number is not sufficient.

The cross-image slide-4 mismatch is a concrete acceptance test: a single source revision cannot show two different slide-4 thumbnails in different tabs.

## 16. Practice quiz setup

The source confirms practice questions, but there is no standalone quiz screenshot. This section is a proposed interaction design that fits the existing Practice quiz tab.

### 16.1 Setup controls

- Current document and processed scope.
- Number of questions: proposed default five, maximum ten.
- Optional focus on the current section if sufficient source material exists.
- Generate practice quiz action with processing and quota feedback.

Use multiple-choice questions as the proposed initial format. Short-answer self-check can follow, but automated grading of open responses is not required for this first release.

### 16.2 Question-generation requirements

- Questions assess concepts supported by the processed source.
- A question has one unambiguously correct option in the initial single-choice model.
- Distractors are plausible but not trickily indistinguishable under the source wording.
- Explanations show why the correct option is appropriate.
- Every question has a relevant source reference.
- No answer depends on an unreadable page or unprovided outside fact.
- Avoid duplicate questions and simply reworded copies of the same prompt.
- Do not claim the questions match the university's upcoming examination.

If only three defensible questions can be generated, return three with an explanation instead of padding to five. If the material cannot support a useful quiz, say so.

## 17. Quiz taking, feedback, and review

### 17.1 Question screen

Show Question X of N, the prompt, radio-style options, Check answer, and Next. Include Back where revisiting is supported. A student can skip a question without an answer being fabricated.

Proposed initial behavior is immediate feedback after Check answer, because this is self-study. Until that action, the correct answer and explanation should not be visually revealed. This is a usability convention, not secure examination proctoring.

### 17.2 Feedback

Display Correct or Not quite, the correct answer, a concise explanation, and source links. Use respectful language. Provide Ask AI about this question only with a reviewed question/explanation excerpt.

Do not automatically award course marks, modify a GPA prediction, mark a university assignment done, or report a quiz score to a project group.

### 17.3 Result summary

Show total questions, correct, incorrect, and unanswered counts. Proposed score is:

```text
Practice score percentage = 100 × correct / total questions
Unanswered questions contribute zero to this practice score.
```

For five questions with three correct, one incorrect, and one unanswered, show 3/5 and 60%, plus the breakdown. Do not display 75% by silently excluding the unanswered question. If an Answered-only accuracy metric is ever added, label its different denominator explicitly.

Before completion, show progress rather than presenting a partial result as final. With no valid questions, show no score; never divide by zero.

### 17.4 Retry and persistence

- Retry the same quiz creates a new attempt against the same immutable question version and need not call AI.
- Generate another quiz is a new output operation with budget rules.
- Shuffling must preserve the correct option IDs; answer keys must not depend on display position.
- A quiz attempt remains bound to the document/output version used when it began.
- Source replacement does not silently change questions halfway through an attempt.

Long-term attempt history is optional. If not implemented, state the session scope rather than promising saved progress indefinitely.

## 18. Quiz errors and disputed answers

Provide Report an issue on a question or explanation. Capture the relevant output version, question ID, and a short reason. Do not tell the student the model is necessarily correct because an answer key exists.

If a question is later found invalid, do not silently rewrite an existing attempt's historical score. Either retain it with an issue flag or apply an explicit documented correction policy. The simplest first release is to flag the issue and create a corrected new quiz version.

If generation fails validation because options are missing, the answer ID is invalid, or references are unavailable, retry within a bounded budget or show an error. Do not publish a partially malformed question as a finished exercise.

Repeated generation must not produce unbounded provider work. Retry limits and regeneration budgets are distinct from the daily upload allowance.

## 19. Ask AI purpose and context selection

Ask AI prepares a useful prompt and deliberately hands it to another service. StudyPilot does not host that external conversation in the currently specified design.

### 19.1 Entry context

An Ask AI action records:

- Source document/revision, when applicable.
- Output type and version.
- Selected section, key point, or quiz item.
- The exact excerpt proposed for sharing.

Do not automatically include the entire document, grading system, attendance history, profile details, room messages, or unrelated summaries.

### 19.2 Composer

Show an editable question textarea and a source chip. Include this summary excerpt controls whether the visible context is included. A preview displays the complete assembled payload, including any document title or references that will be copied.

Proposed defaults for review: question up to 4,000 characters; excerpt up to 8,000 characters. If a selection is longer, ask the student to shorten/select content. Never silently truncate a formula or qualification while displaying the original full selection as if it will all be sent.

### 19.3 Suggested prompts

The three image suggestions insert editable text, not immediate external requests:

- Explain it more simply.
- Give me a worked example.
- Test my understanding.

The student can revise or clear the suggestion. Selecting a card should not overwrite a substantial existing draft without an Undo or explicit replace action.

## 20. Ask AI copy-and-open flow

### 20.1 Default supported design

1. Student reviews the question and selected context.
2. Copy question + context copies exactly the previewed payload.
3. Show Question copied on success, or a manual-copy fallback.
4. Student chooses Open ChatGPT or Open Claude.
5. Open the configured, verified provider destination in a new tab.
6. The student pastes the question and continues there.

Opening a provider must not silently auto-submit the user's text. Copying does not prove the external conversation began, and StudyPilot should not show Message sent merely because the clipboard operation succeeded.

### 20.2 Copy failure and stale copy

If clipboard access fails, show a selectable plain-text payload. If the question/context changes after copying, mark the prepared copy as out of date and offer Copy updated question. Do not claim the clipboard automatically followed edits.

### 20.3 Prefilled links

The original specification intends prefilled external questions but explicitly requires link-format testing. Treat prefilling as an optional enhancement until verified for the chosen provider, browser, and payload size.

Do not invent URL parameters or assume a provider supports them. If a verified prefill mode is introduced, show the payload before navigation, avoid automatically submitting it, handle length/encoding limits, and retain the copy-and-open fallback.

This document does not assert current provider capabilities or prices. External account requirements, availability, and usage limits are outside StudyPilot's control and must be verified when implementing the integration.

### 20.4 What returns to StudyPilot

The app does not automatically receive external replies, transcripts, or completion events. Returning to StudyPilot restores the user's draft and reading context, not a fabricated completed chat. Any future import of an external answer is a separate feature.

## 21. Upload quotas, generation budgets, and reset rules

The confirmed requirement is a daily per-student AI upload limit. A complete cost-control design also needs page/byte limits, generation limits, and failure throttles; upload count alone does not bound total AI work.

### 21.1 Define the quota unit

Proposed unit: one accepted new **document revision** activated for Study Help processing. One revision can produce a short summary, detailed summary, and initial quiz under configured operation budgets.

Opening a saved result, switching tabs, copying, preparing an external question, or retrying the same saved quiz attempt does not consume another document slot. A different source revision generally does. Reusing an identical previously processed file within the same account should use existing output where valid rather than pretending it is new work.

### 21.2 Reservation and commit

Proposed accounting:

1. Validate basic input and available quota.
2. Reserve a slot atomically before accepting processing.
3. Commit the document slot when the first usable validated output is published.
4. Release the slot on validation failure, cancellation before useful output, or unrecoverable failure without usable output.
5. Preserve separate attempt/rate/compute limits so repeated refunded failures cannot trigger unlimited work.

If short summary succeeds but detailed summary later fails, the document slot remains committed. Retry only the failed operation under its retry budget. Never charge the document quota twice for the same idempotent job.

This accounting is a proposal. Its exact support depends on the chosen processing system and must be implemented transactionally, not inferred from browser state.

### 21.3 Daily window

Proposed default: a fixed UTC daily window, with the next reset shown in the student's local timezone. Changing the profile timezone does not reset the allowance. The UI should show an exact local reset date/time in addition to friendly text such as Try again tomorrow.

A job reserves a particular window's capacity; crossing midnight does not reassign the reservation to a second window or double-charge. Guest-to-Google linking must preserve usage identity.

### 21.4 Additional generation bounds

Configure maximum processing pages, supported output lengths, per-output retry count, regeneration limits, per-account concurrency, and service-wide budget controls. If a budget prevents detailed generation after a short result exists, explain the specific limit and retain the available output.

Guest accounts can be recreated; do not claim that an anonymous identity alone enforces a perfect per-human daily quota. Abuse controls should preserve ordinary guest usability and should not treat shared university networks as proof of abuse by one person.

## 22. Reusing, regenerating, and replacing outputs

### 22.1 Reuse

Once a validated output exists for a source revision and supported configuration, navigation should load it rather than call a model again. Keep the short, detailed, and quiz output states independent.

### 22.2 Regeneration

Regenerate is an explicit action, not a side effect of reload or tab switching. Show any applicable remaining generation allowance. Save a new output version while preserving the currently readable version until the new one succeeds, subject to retention policy.

Do not erase a good summary merely because a replacement generation failed. Display which version is currently shown and when it was generated.

### 22.3 Replace file

Replace file creates a new source revision. Show the selected filename and explain that summaries/quiz references will be generated from the new file. The old source and output must not be relabelled as if they came from the replacement.

A draft question or quiz attempt tied to the old revision remains explicitly old-version or is ended through a clear action. Retain or delete old revision history according to a documented storage policy; do not promise permanent version history by default.

### 22.4 Upload another file

Create a separate personal document. Do not overwrite the current document implicitly. A recent-document list is optional, but navigation must give the student a reliable way to access any processing result the UI promised would remain available.

## 23. Copying, exports, and editable notes

### 23.1 Copy summary

Copy the active validated summary with headings, readable lists, and human-readable page references. Do not include hidden instructions, private storage URLs, backend identifiers, or unrelated personal data.

If only a section is copied, label the action Copy section. For an incomplete/partial summary, preserve its coverage note in the copied text where practical so the limitation is not lost.

### 23.2 Exports

PDF, DOCX, Markdown download, and sharing directly to a room are optional extensions, not established by the previews. Do not display functional-looking export buttons unless the corresponding artifact flow exists.

### 23.3 Editing generated text

The source does not require a rich summary editor. Proposed initial behavior is to preserve generated output as a versioned result and allow copying for personal use. If editable personal notes are added, keep them separate from the source-grounded output and show who changed them.

Editing a summary must not silently preserve old “source-supported” labels for newly inserted claims.

## 24. Accuracy, uncertainty, and source conflicts

### 24.1 Practical quality rules

- Preserve technical qualifiers, definitions, units, signs, and exception conditions.
- Do not omit a negation or present a contrast as equivalence.
- Preserve the order of a process when order matters.
- Distinguish source paraphrase, added illustration, and uncertainty.
- Do not state that a claim appears on a specific slide without checking that association.
- Do not produce precise confidence percentages without a validated method.

### 24.2 Conflicting or incorrect source material

If two pages appear contradictory, identify the conflict with both references rather than merging them into a confident rule. If a possible source error is noticed, separate “The slides state…” from “This may need checking”; do not silently rewrite the source and call it a summary.

The app does not replace a course instructor or textbook. Keep the small reminder shown in the images, but tie prominent warnings to actual limitations rather than surrounding every paragraph with generic disclaimers.

### 24.3 Corrections and reports

Provide Report an issue for summaries or sections. Record output version, relevant source references, and optional user explanation. A report receipt is not a promise that the content was reviewed or corrected immediately.

Who reviews these reports and how corrected versions are distributed must be defined operationally. A Report button without persisted feedback is not a finished feature.

## 25. Document instructions are content, not app commands

Uploaded material may contain imperative text, embedded links, exercises, speaker notes, or instructions addressed to an AI. Those are source content to analyze, not authority to change StudyPilot's behavior.

The processing design must not follow document text that asks it to reveal secrets, send files elsewhere, change grading rules, ignore application constraints, or operate on another user's data. Summarizing a slide containing an instruction is different from executing it.

Processing should use only the selected source and authorized job context. Do not give an extraction/generation step access to unrelated room files, account records, browser sessions, or external-action tools merely because the document asks for them.

Displayed output must be safely rendered. Document links and generated code are content; they do not run automatically. This is a concrete boundary for an upload-driven feature, not a new approval step for normal study use.

## 26. Privacy, storage, and deletion

### 26.1 Protected data

Protect originals, extracted text, rendered thumbnails, outputs, quizzes, attempts, and Ask AI drafts under the owning account. Guessing a document ID must not reveal filename or content.

Source files and previews should use private storage access. If signed links are used, keep them short-lived and recognize their revocation limits; do not imply a copied download link instantly disappears when a user signs out.

### 26.2 Processing disclosure

Before processing, provide concise truthful information that document content is used by the configured AI processing service. Do not claim zero retention, no training use, or a particular geographic storage location without verifying the chosen provider and deployment configuration.

The external Ask AI flow shares only the reviewed payload through the chosen user action. It is separate from the service that generates summaries within StudyPilot.

### 26.3 Delete document

Deleting a personal document should remove or schedule deletion of its source revisions, extracted data, thumbnails, outputs, quiz versions, and associated attempts according to the published retention policy. Cancel active jobs and prevent late results from recreating deleted records.

Ask AI drafts that contain deleted document excerpts must follow the chosen deletion policy rather than silently retaining full copied content indefinitely. The app cannot retract content the user already pasted into an external service; do not claim it can.

### 26.4 Storage duration

The original specification does not define Study Help retention. Choose and publish an actual retention policy before promising saved history. Automatic cleanup must be communicated before it removes a result a student expects to keep. Do not infer the room Library's unresolved semester-retention policy as the rule for personal AI documents.

## 27. Loading, partial, empty, and failure states

| State | Required UI |
|---|---|
| No document | Upload panel and clear supported formats |
| File selected | Metadata and explicit start/cancel actions |
| Validating | Clear stage; no fake summary |
| Uploading | Measurable upload progress |
| Queued/extracting | Stage label and cancellation behavior |
| Source ready, no output requested | Source preview and Generate action |
| Short ready, detailed not generated | Short remains usable; detailed tab explains next action |
| Partial extraction | Processed coverage and affected pages |
| Unreadable document | Specific reason and replacement/export suggestion |
| Output validation failure | No malformed finished result; bounded retry |
| Daily allowance exhausted | Remaining allowance/reset time; saved results still usable |
| Service temporarily unavailable | Explain temporary failure; do not claim user exhausted quota |
| Clipboard denied | Manual copy fallback |
| External tab blocked | Visible provider link/open action |
| Offline | Last loaded content with freshness indication; writes/generation not falsely saved |
| Document deleted or inaccessible | Neutral unavailability state, no content leak |

Keep failures local where possible. A failed quiz must not blank an already successful summary. Loading skeletons should match final layout to avoid major movement.

## 28. Mobile and tablet design

The three inspected images are desktop views. Do not compress their multi-column layouts into an unreadable mobile grid.

### 28.1 Short summary on mobile

- Compact document header with overflow actions.
- Readable three-tab output selector, with clear selected state.
- Summary content as the primary column.
- Sources button opens a page drawer or full-screen source view.
- Copy, Ask AI, and Quiz actions remain reachable without covering text.

### 28.2 Detailed summary on mobile

- Collapsible In this summary contents.
- Single-column reading document.
- Source chips open an overlay/detail route and return to the same reading position.
- Formulas/tables can use contained horizontal scrolling when unavoidable, with visible context.
- Do not keep a full desktop sidebar or thumbnail panel permanently alongside the text.

### 28.3 Quiz and Ask AI on mobile

Quiz options are large touch targets; Check answer and Next remain visible after the keyboard is dismissed if a text field exists. Ask AI stacks question, excerpt preview, copy action, and provider choices vertically.

Do not open a provider tab merely by focusing a suggestion. Preserve edits if a user returns from another tab. Test clipboard fallback on supported phone browsers during implementation.

Suggested breakpoints are 1200 px for wide multi-column presentation and 768 px for the single-column mobile mode, subject to content testing. Avoid page-level horizontal overflow at 320 px.

## 29. Accessibility and visual consistency

Keep the established white/off-white surfaces, navy headings, indigo primary actions, restrained borders, rounded cards, and generous reading spacing. Generated content needs readable typography more than decorative graphics.

- Use semantic headings and stable section anchors.
- Tabs and source navigation work by keyboard with visible focus.
- File upload has an accessible chooser; drag-and-drop is optional.
- Quiz options are labelled form controls, not color-only cards.
- Correct/incorrect feedback is readable without red/green perception.
- Provide text alternatives for source thumbnails and meaningful extracted text where available.
- Do not call an OCR transcript a perfect accessible equivalent if it is incomplete.
- Announce processing-stage changes sparingly, not every token or elapsed second.
- Preserve focus after a source overlay or copy fallback closes.
- Support text enlargement, reduced motion, and deliberate dark-theme contrast.

Show mathematically or semantically important content in text alongside any chart/image. Formal accessibility compliance must be verified during implementation rather than inferred from mockups.

## 30. Data model and object relationships

The original high-level schema does not include AI document processing entities. The following are conceptual additions, not existing tables.

| Entity | Purpose and key information |
|---|---|
| Study document | Owner, display title, optional course, current revision, lifecycle |
| Source revision | Original file identity, private storage key, digest, format, bytes, ordered source count |
| Source page | Revision, canonical page ID/index, extracted content, thumbnail, quality flags |
| Processing job | Owner/revision, requested operation, state, idempotency key, retry/cancel state |
| Generated output | Revision, type, version, structured content, references, coverage, validation state |
| Quiz definition | Source/output version, immutable question IDs, answer structure, explanation/references |
| Quiz attempt | Owner, quiz version, answers, checked states, score/breakdown, timestamps |
| Ask AI draft | Owner, question, selected excerpt, provenance, draft version |
| Usage reservation | Account, daily window, document revision, reserved/committed/released state |
| Generation budget record | Operation identity, bounded attempts/usage independent of document count |
| Output issue report | Owner/reporter, output/question/section ID, reason, handling status |

### 30.1 Relationship rules

- A source page belongs to exactly one source revision.
- Output references may only target pages in that output's source revision.
- An attempt refers to one immutable quiz version.
- A draft excerpt records its source/version but sends only the visible prepared text.
- Replacing a document does not rewrite old source IDs in existing output.
- Deletes and late job writes must respect a durable deletion/cancellation state.
- Usage events are idempotent and account-scoped.

Avoid storing only a single summary string and filename. That is insufficient for reliable citations, replacement, retries, quiz attempts, and deletion.

## 31. Processing and API behavior

Suggested operations include Validate upload, Create upload session, Start processing, Read job state, Cancel job, Fetch source page, Generate output, Fetch output, Generate quiz, Save attempt, Prepare question, Copy payload locally, Replace revision, and Delete document.

For every protected operation:

1. Resolve the current account, including anonymous guest identity.
2. Check ownership and allowed lifecycle state.
3. Validate file/input/output relationships.
4. Reserve relevant quota or generation budget atomically where needed.
5. Perform the bounded requested work.
6. Publish only a validated result tied to the correct revision.
7. Return truthful job/output state.

The browser must not hold privileged provider credentials. Document extraction and generation workers should have only the access needed for the selected job. Model output does not authorize new backend operations.

Job events may update the UI in real time, but reconnect should reconcile canonical state. Do not assume every event arrived or that a browser timeout means the server stopped processing.

## 32. Performance, reliability, and cost controls

The first release should prioritize a fast readable workspace and trustworthy results over showing all thumbnails or generating every output at once.

- Extract once per valid source revision where reusable.
- Generate only the requested output, with clear state for unrequested tabs.
- Lazy-load source thumbnails and large page previews.
- Reuse saved validated results on refresh/navigation.
- Limit context, page count, output size, retries, concurrency, and regeneration.
- Do not automatically regenerate a quiz on every retry attempt.
- Cache only within correct account/revision boundaries; no private cross-user response cache leaks.
- Bound queues and provide a clear temporary-unavailable state under service pressure.
- Clean up failed upload artifacts and abandoned jobs without deleting valid saved outputs.

Do not promise a fixed generation time from static images. Establish measured timings for representative text PDFs, scanned PDFs, and supported presentations before publishing performance claims.

The free-first goal does not prove AI processing is costless. External handoff can avoid hosting the external conversation, while in-app slide processing still needs a defined funded or supported service path. This specification does not assume an unlimited free model provider.

## 33. Consistent demonstration fixture

Use one deliberately authored 12-page teaching deck for design and acceptance review. Its content must actually exist before validating generated summaries. The following is a proposed fixture plan, not a recovered source file from the images.

### 33.1 Canonical page map

| Page | Intended fixture content |
|---|---|
| 1 | Title and learning goals |
| 2 | Why repeated data can cause problems |
| 3 | Examples of update/insert/delete anomalies |
| 4 | First normal form: introduced concepts and assumptions |
| 5 | First normal form worked example |
| 6 | Composite keys and dependency vocabulary |
| 7 | Second normal form explanation |
| 8 | Second normal form worked example |
| 9 | Third normal form explanation |
| 10 | Third normal form worked example |
| 11 | Comparing the three stages |
| 12 | Revision checklist |

This map intentionally resolves the images' inconsistent slide 4. Both views must show the same actual page 4 once the fixture file is authored. Subject-matter review should check teaching definitions; a generated mockup is not authoritative course content.

### 33.2 Expected short/detailed alignment

- Introductory rationale cites pages 2–3.
- First-normal-form material cites pages 4–5.
- Second-normal-form material cites pages 6–8 as relevant to the particular claim.
- Third-normal-form material cites pages 9–10.
- Comparison/revision content cites pages 11–12.

Do not use every broad range for every point. References should identify the actual supporting page(s).

### 33.3 Ask AI fixture

Question: “Explain second normal form in simple words. Use a student-and-courses example, then ask me one practice question.”

The included excerpt is a reviewed selection from the fixture's generated detailed section. The preview shows the exact text and any source title included. Clearing Include excerpt removes that text from the assembled copy payload. No GPA, attendance, room, or profile data is included.

### 33.4 Quiz fixture

Use five stable question IDs with known answer IDs and source references. A test attempt with three correct, one incorrect, and one unanswered yields 3/5, 60%, and the explicit breakdown. A shuffled display must preserve those results.

### 33.5 Limit fixture

Under the proposed three-document daily allowance, two committed revisions plus one active reservation leave zero immediately available slots. Releasing the reservation restores one available slot; committing it keeps availability at zero. Reopening either saved summary leaves these counts unchanged.

## 34. End-to-end user flows

### Flow A — First short summary

1. Student opens Study Help and chooses a supported slide file.
2. The app validates format, size, quota, and source count.
3. Student sees honest upload/extraction stages.
4. Short summary generation uses the extracted current revision.
5. Validated output appears with coverage and source links.
6. Student opens a referenced page and copies the summary.

### Flow B — Move into detailed study

1. Student selects Detailed summary for the same source revision.
2. Existing output loads or generation is explicitly started.
3. Student navigates sections through the contents.
4. A source chip selects the matching page in the right panel.
5. Generated illustrations are visibly distinguished from source examples.
6. Returning to Short summary preserves its existing version and does not consume another upload.

### Flow C — Practise and review

1. Student chooses Create practice quiz.
2. The app generates a supported number of source-grounded questions.
3. Student selects and checks answers, skipping one if desired.
4. Explanations link back to the relevant source.
5. Results show total/correct/incorrect/unanswered counts consistently.
6. Retrying the same quiz creates a new attempt without a new generation call.

### Flow D — Ask an external AI

1. Student chooses Ask AI about a selected section.
2. Student edits the question and reviews included context.
3. Student copies exactly the previewed payload.
4. Student opens a configured provider in a new tab and pastes the question.
5. StudyPilot makes no claim that the external conversation completed.
6. Returning restores the student's reading/draft context.

### Flow E — Unreadable page

1. Extraction finds a page that cannot be interpreted reliably.
2. The app identifies its page number and limits output coverage.
3. Supported pages can produce a clearly partial summary if useful.
4. Questions do not rely on the unreadable content.
5. Student can upload a clearer export as a new revision.

### Flow F — Daily allowance exhausted

1. Student attempts another new document after the configured allowance is used/reserved.
2. The app explains the limit and exact next-reset time.
3. Saved outputs, Copy summary, and external question preparation remain usable.
4. No paid upsell or forced sign-in tier is introduced.

### Flow G — Replace or delete

1. Student replaces the current source deliberately.
2. A new revision starts with distinct processing/output states.
3. Old references and quiz attempts are not relabelled as new-file results.
4. If the document is deleted, active jobs are cancelled/tombstoned.
5. Late provider results cannot recreate visible deleted content.

## 35. Acceptance criteria

| ID | Scenario | Required result |
|---|---|---|
| SH-01 | New user opens Study Help | Upload/empty state; no fake personal document |
| SH-02 | Guest and Google users | Same released feature permissions and configured quota policy |
| SH-03 | Nonowner guesses document ID | No filename, thumbnails, output, quiz, or mutation access |
| SH-04 | Supported PDF selected | Correct validation and processing path |
| SH-05 | Supported PPTX selected | Correct declared conversion/extraction path |
| SH-06 | Legacy PPT unsupported | Specific export guidance; UI does not advertise false support |
| SH-07 | File exceeds configured bytes | Rejected before useful processing; no completed-document charge |
| SH-08 | Too many pages | No silent truncation presented as complete analysis |
| SH-09 | Spoofed extension/corrupt input | Trusted validation rejects or handles safely |
| SH-10 | Password-protected input without unlock support | Specific failure/replacement guidance |
| SH-11 | Upload in progress | Measured byte progress, not fabricated AI completion percent |
| SH-12 | Generation ongoing | Honest stage label; no guaranteed unmeasured ETA |
| SH-13 | Retry/reload during job | Correct existing job reused or safely resumed |
| SH-14 | Cancel before useful output | State and quota reservation follow documented rules |
| SH-15 | Source has unreadable pages | Accurate partial coverage and page identification |
| SH-16 | Image-only source without supported OCR | No fabricated source summary |
| SH-17 | Diagram/formula unreadable | Local limitation with source access |
| SH-18 | Hidden slides/notes excluded by default | Coverage does not claim they were analyzed |
| SH-19 | PDF handout has multiple slides per page | Numbering accurately reflects supported page mapping |
| SH-20 | Short summary generated | Concise source-based points and appropriate references |
| SH-21 | Detailed summary generated | Uses source representation, not only expansion of short output |
| SH-22 | Added illustrative example | Clearly distinguished from an actual source example |
| SH-23 | Same revision page 4 opened in both views | Identical canonical page content |
| SH-24 | Output cites nonexistent page | Validation rejects/repairs before finished publication |
| SH-25 | Page exists but does not support a claim | Quality review/issue mechanism treats reference as incorrect |
| SH-26 | Summary truncated by generation limit | Not presented as complete |
| SH-27 | Click contents entry | Correct section and accessible focus/scroll behavior |
| SH-28 | Click multi-page source chip | Correct ordered page set with reading context preserved |
| SH-29 | Source preview fails but output exists | Local preview error; no invented thumbnail |
| SH-30 | Copy summary succeeds | Current output version and readable references copied |
| SH-31 | Clipboard denied | Usable manual-copy fallback |
| SH-32 | Existing output tab reopened | No unintended regeneration or extra upload charge |
| SH-33 | Only short output ready | Detailed/quiz states accurately separate |
| SH-34 | Requested quiz count exceeds defensible content | Fewer valid questions or insufficient-content state |
| SH-35 | Quiz answer key invalid | Malformed question not published as finished |
| SH-36 | Student has not checked an answer | No premature visible answer reveal |
| SH-37 | Three correct, one incorrect, one unanswered out of five | Score 3/5, 60%, explicit breakdown |
| SH-38 | No valid quiz questions | No division-by-zero or fake score |
| SH-39 | Quiz options shuffled | Stable IDs preserve correct answer mapping |
| SH-40 | Same quiz retried | New attempt, no unnecessary model generation |
| SH-41 | Quiz source replaced mid-attempt | Existing attempt remains bound to original version |
| SH-42 | Practice quiz completed | No GPA, attendance, or official course-mark mutation |
| SH-43 | Question issue reported | Persisted report tied to exact question/output version |
| SH-44 | Ask AI opened from a section | Only intended reviewed section context selected |
| SH-45 | Include excerpt unchecked | Excerpt absent from assembled/copied payload |
| SH-46 | Suggested prompt chosen | Editable draft, no automatic external submission |
| SH-47 | Question edited after copying | Copy state marked stale and update offered |
| SH-48 | Provider button used | New-tab handoff; no embedded-chat or sent-message claim |
| SH-49 | Prefill not verified/supported | Copy-and-open remains usable |
| SH-50 | Payload exceeds configured limit | Visible selection/shortening step, no hidden truncation |
| SH-51 | Return from external AI | Draft/context restored; no fabricated reply imported |
| SH-52 | Saved results viewed at quota zero | Existing permitted content remains usable |
| SH-53 | Concurrent new jobs compete for last slot | Atomic accounting prevents oversubscription |
| SH-54 | Validation/extraction fails without usable output | Reservation release follows policy; bounded attempt controls remain |
| SH-55 | Short succeeds, detailed fails | Document charged once; short preserved; failed operation retry bounded |
| SH-56 | Daily reset crossed mid-job | Reservation remains in original window; no double charge |
| SH-57 | User timezone changes | No quota reset exploit; reset display updates correctly |
| SH-58 | Guest links to Google | Owned content and usage accounting preserved |
| SH-59 | Identical saved source reused | Correct account-scoped reuse, no misleading duplicate job |
| SH-60 | Regeneration fails | Prior valid output remains readable and correctly versioned |
| SH-61 | Replacement keeps same filename | New content revision; old citations not silently rebound |
| SH-62 | Document deleted during generation | Late output cannot recreate deleted content |
| SH-63 | Account switched | Previous user's documents/drafts/caches not exposed |
| SH-64 | Uploaded slide contains app-control instructions | Treated as content; no unauthorized operations |
| SH-65 | Model returns unsafe markup | Safe rendering, no automatic execution |
| SH-66 | Data from room/GPA exists elsewhere in app | Not automatically added to AI job or external payload |
| SH-67 | Phone viewport | Readable single-column summaries and accessible sources/quiz/actions |
| SH-68 | Keyboard-only use | Upload, tabs, sources, questions, copy, and navigation operable |
| SH-69 | Temporary service outage | Distinguished from student quota exhaustion |
| SH-70 | Two source pages conflict | Conflict identified rather than silently merged |
| SH-71 | Personal document uploaded | Not publicly listed or shared to room/forum automatically |
| SH-72 | No retained-history implementation | UI makes no unsupported permanent-history promise |

## 36. Quality evaluation and representative test files

Before release, evaluate actual outputs against small controlled source documents and realistic teaching material. The image alone cannot establish generation quality.

Recommended fixtures:

- A clean text PDF with known definitions and page references.
- A supported PPTX with text, tables, diagrams, and a hidden slide to test scope.
- A scanned PDF with readable and unreadable pages.
- A document containing formulas, negative statements, and important exception clauses.
- A document with conflicting claims on separate pages.
- A very short deck that cannot support ten distinct questions.
- A page-limit/byte-limit boundary case.
- A filename-preserving replacement whose page content changes.
- A document containing instructions that must remain untrusted source text.
- A quiz with known stable option IDs and skipped-answer behavior.

Evaluate factual alignment, coverage, correct page attribution, preservation of qualifiers, helpfulness of the short/detailed distinction, question answerability, and absence of unsupported confidence claims.

Use knowledgeable human review for subject accuracy in test fixtures. Automated checks can verify structure, IDs, counts, lifecycle, permissions, and accounting, but they do not replace semantic review. This document proposes the evaluation plan; it does not claim those generated-output tests have already run.

## 37. Release sequence and open decisions

### 37.1 Recommended delivery sequence

1. Private upload, validation, extraction, source viewer, and honest job states.
2. Grounded short summary, references, copying, and usage accounting.
3. Detailed summary with contents, examples, and source synchronization.
4. Practice quiz generation, attempts, feedback, and source-linked review.
5. Ask AI question/context preparation and verified external handoff.
6. Optional retained history, exports, additional formats, and expanded scenarios after core reliability.

Study Help remains a later product phase. Its absence must not block working timetable, attendance, GPA, or project-room functionality.

### 37.2 Decisions to settle before affected behavior ships

- Actual AI/extraction service and verified data-processing behavior.
- Exact PDF/PPTX/PPT support, including scans, hidden slides, and speaker notes.
- Deployed byte, page, daily-document, generation, and concurrency limits.
- Final quota commit/refund semantics and operational budget limits.
- Document/output/attempt retention and cleanup policy.
- Whether to support partial output after unreadable pages or require replacement for particular cases.
- Whether generated illustrative examples are on by default.
- Whether open-response questions or long-term attempt history are included.
- Whether the user wants embedded AI chat instead of the currently specified external flow.
- Verified provider destinations and any supported question-prefilling behavior.
- Who handles inaccurate-output reports and how corrections are communicated.
- Whether explicit sharing/export to a project-room Library is a later feature.

Do not silently implement unresolved choices as if the screenshots confirmed them.

## 38. Definition of done

Study Help is ready when a student can upload a supported personal document, understand processing coverage, read a concise or detailed summary, inspect genuine source references, practise with valid questions, and prepare an external AI question with full visibility of the shared text.

The final product must correct the images' inconsistent slide mapping, distinguish generated examples from source content, implement honest quota and failure states, and work on a phone and by keyboard. Saved outputs must stay bound to their source revisions, and private data must remain private.

Applicable acceptance criteria must pass with actual processing and saved data. Provider handoff verification, source-alignment review, and operational limit decisions must be documented before claiming those capabilities are ready. Static images are design references, not evidence of a working or verified AI system.
