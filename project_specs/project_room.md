# StudyPilot — Project Room Detailed Specification

**Version:** 1.0  
**Prepared:** October 3, 2026  
**Status:** Design and implementation specification; no implementation is claimed  
**Page:** Individual private project room  
**Suggested route:** `/rooms/:roomId`  
**Product language:** English in version 1  
**Audience:** Product owner, designer, frontend developer, backend developer, and tester

---

## 1. Purpose, sources, and decision status

This document specifies the private project workspace shown in the StudyPilot project-room preview. It follows an actual visual inspection of [the project-room image](02-project-room.png), a reread of `StudyPilot-Full-Spec.md`, and the established Overview-page specification.

The page helps a student group organize tasks, keep a final deadline visible, share files and notes, coordinate presentation practice, and discuss the project in one place. Its core promise is shared accountability without giving the creator exclusive control of ordinary project work.

The document covers the visible Board screen and the Library, Reminders, Activity, contribution, membership, and chat behavior needed to make that screen functional. It also covers creating and joining rooms because those flows determine access to this page.

### 1.1 Source precedence

1. Explicit user decisions take precedence over document assumptions.
2. The original product specification defines confirmed room requirements.
3. The image supplies visual direction and sample content, not proof that features exist.
4. This document supplies proposed implementation defaults where details are missing.

The recent decision about student-configured fixed grading ranges applies to personal academic planning. Room members must not inherit another member's university grading settings, and grades do not determine project permissions.

### 1.2 How to interpret this specification

**Confirmed** means stated in the original product requirements or subsequent conversation. **Proposed** means a concrete recommended default that makes implementation reviewable. **Open decision** means the source is unresolved or contradictory; the affected capability must not ship with an invented permission policy.

| Topic | Status | Direction |
|---|---|---|
| Private invitation-based rooms | Confirmed | No public discovery or room search |
| Guest and Google parity | Confirmed | Same room capabilities after joining |
| Leader label | Confirmed | Creator identification, not an ordinary editing privilege |
| Shared tasks, deadlines, reminders, files, links, notes | Confirmed | Every current member can contribute and edit |
| Room size | Confirmed target | 2–10 participants; one-person setup state proposed |
| Leader removing another member | Conflicting/open | Original removal clause conflicts with display-only authority |
| Contribution view | Confirmed | Tasks completed per member; placement and attribution proposed |
| Task drag-and-drop | Proposed enhancement | Explicit status controls remain mandatory |
| Message edit/delete rights | Open | Equal shared-content editing does not automatically authorize rewriting others' chat |
| Post-deadline archiving/deletion | Open | No automatic lifecycle change based only on time |
| Library retention | Open | No invented indefinite or semester-end retention promise |

## 2. Image inspection and findings

The inspected image is a 1536 × 1024 landscape desktop concept. It shows the Board tab of a populated room, not a complete design of every tab or mobile layout.

### 2.1 Elements actually visible

| Area | Observed content | Interpretation |
|---|---|---|
| Application header | StudyPilot, sample-data label, search field, Sara Ahmed profile | Shared application shell |
| Sidebar | Overview, Timetable, Attendance, GPA planner, Project rooms, Subject Q&A, Settings | Project rooms selected |
| Breadcrumb | Project rooms / Campus Sustainability | Back path to joined rooms |
| Room identity | Campus Sustainability; Environmental Studies | Room name and subject |
| Privacy and sharing | Invite only badge; Copy invite link button | Private membership model |
| Members | Sara Ahmed, Ali Khan, Maya Chen, Omar Hassan | Four current participants |
| Leader | Sara Ahmed has the Leader badge | Creator label |
| Permission label | Everyone can edit with a chevron | Ambiguous dropdown affordance |
| Deadline strip | Final submission · Oct 9; 4 days left | Persistent room deadline |
| Progress | 3 of 6 tasks done; 50% teal bar | Count-based progress |
| Tabs | Board, Library, Reminders, Activity | Board selected |
| Task columns | To do (2), Doing (1), Done (3) | Three fixed statuses |
| Task cards | Title, owner, date, menu | Compact shared work items |
| Chat | Room chat, three named messages, timestamps, composer | Room-scoped conversation |
| Chat attachments | Research sources link card; Build slides task card | Shared-resource and task references |
| Pin control | Pin to Library under Maya's message | Preserve a useful message in shared resources |
| Bottom previews | Next reminder and Library (3) | Quick access without leaving Board |

### 2.2 What works well in the image

- The room name, deadline, and progress are visible before detailed tasks.
- Owners are visible on individual task cards rather than hidden in a detail dialog.
- The three status columns make unfinished work easy to distinguish.
- Practice appears as a first-class reminder, matching the problem of unprepared presentations.
- Library rows include who added an item and when, making ownership and provenance visible.
- Chat remains close to the task board, reducing navigation during collaboration.
- The invitation action is easy to find.

### 2.3 Gaps and corrections for the functional design

| Observation | Required clarification or proposed correction |
|---|---|
| Everyone can edit has a dropdown arrow | Make it an explanatory label/popover, not an unapproved permissions editor |
| Top search says Search across your study space | Global search is not confirmed; omit it unless separately implemented and authorized |
| Done cards show dates without a prefix | Label Due or Completed explicitly; these are different fields |
| To do and Doing both use an empty circle | Add a textual status control in detail view; do not imply identical state |
| Contribution view is absent | Add a compact Contributions control next to progress or in the members area |
| Create/edit task form is not shown | Define a full accessible form and save/error states |
| Library management/report actions are not explicit | Provide add, edit, delete, restore, and report flows as applicable |
| Room settings and leave action are not shown | Add a room menu with only authorized actions |
| No empty, offline, loading, or failure states | Specify each rather than treating a blank panel as no content |
| Fixed desktop chat width is narrow | Adapt to a drawer or dedicated mobile view at smaller widths |
| Avatar photos repeat similar faces | Treat them as illustrative; production uses real available avatars or initials |

No image detail establishes online presence, read receipts, video calls, AI chat, task priorities, subtasks, or file-version history. Those features are not silently added by this specification.

## 3. Goals and boundaries

### 3.1 Questions the room should answer

1. What are we submitting, and when?
2. Which tasks remain, and who owns each one?
3. Where are the latest shared files, links, and notes?
4. When will we meet or practise?
5. What changed, and who changed it?
6. What do my teammates need me to see or do?

### 3.2 Included scope

Room creation and invitation, membership-aware access, task board, task ownership and dates, final deadline, task-count progress, contribution counts, room text chat, message-to-task links, pinned messages, shared Library, reminders, activity history, and responsive access.

### 3.3 Excluded scope

- Public room listings, discovery, or searching for people.
- Teacher, CR, university administrator, or paid account roles.
- Built-in voice/video meetings or screen sharing.
- Automatic university assignment submission.
- AI reading all room content or replying as a room member.
- Forum-style voting, reputation scores, or competitive leaderboards.
- Task effort scoring, time tracking, dependencies, and nested subtasks in the first version.
- Guaranteed browser notifications when the website is closed.
- Enterprise permission roles or a permissions matrix editable by the Leader.

## 4. Application shell and room layout

### 4.1 Wide desktop layout

```text
+----------------+------------------------------------------------------------+
| StudyPilot     | Application header / profile                              |
|                +------------------------------------------------------------+
| Navigation     | Breadcrumb                                                 |
|                | Room name / subject / Invite only / Copy invite link       |
| Project rooms  | Member chips / Leader label / Everyone can edit            |
| selected       | Final deadline / countdown / task progress / contributions |
|                +----------------------------------------+-------------------+
|                | Board / Library / Reminders / Activity | Room chat         |
|                +------------+------------+--------------+                   |
|                | To do      | Doing      | Done         | Messages          |
|                |            |            |              | Task/resource     |
|                | Task cards with owner, deadline, menu  | references        |
|                +-------------------+--------------------+                   |
|                | Next reminder     | Library preview    | Composer          |
+----------------+-------------------+--------------------+-------------------+
```

The screenshot uses a roughly 210 px sidebar, a flexible main workspace, and a roughly 320 px chat panel. These are reference proportions, not rigid widths. The layout must adapt when names or translations of browser-native UI increase text size, even though product copy is English in v1.

### 4.2 Shared room header

Keep name, subject, membership context, privacy, and final deadline accessible across the room's main tabs. Large desktop header elements may become compact on scroll; avoid stacking so many sticky bars that they consume the mobile viewport.

Suggested routes are `/rooms/:roomId?tab=board`, `?tab=library`, `?tab=reminders`, and `?tab=activity`. Chat and task/resource detail links should preserve the room and intended destination through sign-in. Exact routing is an implementation choice.

### 4.3 Tab behavior

- Board is the default for a new room visit without a deep link.
- Tab switching preserves unsent chat text within the same room/session.
- Browser Back returns to the prior meaningful view.
- A direct task link opens that task after membership is checked.
- A deleted or inaccessible target gets a clear state, not a silent redirect to unrelated content.
- The Library and Reminders preview cards below Board are not duplicated inside their full tabs.

## 5. Creating a room

Any guest or Google student can create a room after supplying a display name.

### 5.1 Creation form

| Field | Requirement | Proposed validation |
|---|---|---|
| Room name | Required | Trimmed, 1–100 characters |
| Subject | Required | Free text or existing subject choice; no university dependency |
| Final deadline | Required | Date, time, and visible timezone |

Do not require a course from the student's personal planner: a shared project may include students with different courses, universities, or schedules.

The creator becomes a member and receives the Leader label in one atomic operation with room creation. If any part fails, do not leave an inaccessible orphan room or invite link.

### 5.2 One-person setup state

The original target is 2–10 members, but creation necessarily begins with one person. Proposed resolution: permit a temporary one-member room with “Invite a teammate to get started”. The creator can prepare tasks and resources before another member joins. The maximum of ten must always be enforced.

This is a documented interpretation, not a change to the intended group size. Do not require a second person's account to create the workspace.

## 6. Invitation and joining

### 6.1 Copy invite link

All current members may copy the invitation link under the equal-participation model. Copying is a local clipboard action, not an automatic message to anyone.

- Success: show “Invite link copied”.
- Clipboard unavailable: show a selectable link with manual-copy instructions.
- Nonmember access: do not disclose the invitation token from an ordinary room URL.
- The student decides where to share it, for example in their existing WhatsApp group.

### 6.2 Join flow

1. Open a valid invitation URL.
2. Show a minimal invitation preview, proposed to include room name and subject only.
3. Sign in with Google or continue as a guest if necessary.
4. Collect the student's display name if missing.
5. Show an explicit Join room action.
6. Validate the invitation and membership capacity on the server.
7. Add the membership once and open the intended room view.

The minimal pre-join preview is a proposed disclosure policy. It must not expose tasks, member lists, files, messages, or private reminders before membership exists.

### 6.3 Membership capacity and invitation states

| Condition | Behavior |
|---|---|
| Already a member | Open the room; do not create another membership |
| Valid invitation, fewer than ten members | Allow explicit joining |
| Two users race for the last place | At most one succeeds; the other sees Room is full |
| Invalid or revoked invitation | Explain that the link cannot be used |
| Full room | Preserve existing content; offer to return to joined rooms |
| Session interrupted during join | Preserve invite destination; retry safely |

Invitation tokens should be unguessable. Rotation/revocation is a useful proposed control, but who may perform it must follow an explicit policy. Do not grant it to the Leader merely because the badge is present. Possession of an invitation does not provide general read access before joining.

## 7. Membership, names, and permissions

### 7.1 Member display

Show member names with avatars when available and initials otherwise. For more members than fit comfortably, show a “+N” control opening the full roster. Duplicate display names must remain distinguishable through avatars and stable account references in data; do not require names to be globally unique.

The Leader badge identifies the creator. It does not imply attendance supervision, grading authority, ownership of teammates' work, or exclusive edit rights.

### 7.2 Permission matrix

| Action | Current member | Leader distinction | Nonmember |
|---|---|---|---|
| Read room content | Yes | None | No |
| Add/edit tasks and status | Yes | None | No |
| Assign tasks to room members | Yes | None | No |
| Add/edit reminders | Yes | None | No |
| Add/edit shared files, links, notes | Yes | None | No |
| Pin a room message to Library | Yes | None | No |
| Read activity and contributions | Yes | None | No |
| Send a room message | Yes | None | No |
| Copy invite link | Proposed yes | None | No |
| Edit room name/subject/final deadline | Proposed yes, with history | None | No |
| Delete/restore shared work | Proposed yes with soft deletion | None | No |
| Leave the room | Yes, subject to last-member policy | No automatic override | Not applicable |
| Remove another member | Open decision | No unilateral power assumed | No |
| Archive/delete the entire room | Open decision | No unilateral power assumed | No |
| Edit/delete another author's chat | Not granted by default | None | No |

“Everyone can edit” should open a brief explanatory popover: “All room members can edit shared tasks, reminders and Library items. Changes appear in Activity.” It should not look like a role-switching menu.

### 7.3 Leaving and lost access

Leaving requires a deliberate action with a clear explanation that room access will end. Proposed handling: incomplete tasks owned by the departing member become unassigned, and the reassignment is logged. Completed contributions retain a historical attribution subject to the account-deletion policy.

The original specification does not define what happens when the creator or final member leaves. Decide ownership-label continuity and orphan-room retention before shipping those cases. The absence of a Leader must not disable ordinary members' shared editing.

If membership is removed or revoked, stop room subscriptions, clear visible private content, and reject future reads/writes. Never rely only on hiding controls in the browser.

## 8. Final deadline and room progress

### 8.1 Deadline strip

Display “Final submission”, the exact date, a relative countdown, and access to the precise time and timezone. The screenshot's “Oct 9 · 4 days left” is a compact summary, not a substitute for a saved due time.

Proposed states:

- More than a day away: “4 days left”, with exact deadline available.
- Less than a day: hours remaining.
- Less than an hour: minutes or “Less than 1 hour”.
- At the deadline: “Due now”.
- After the deadline: “Deadline passed”, while retaining editable work unless a separate room lifecycle rule exists.

Changing the final deadline is a shared, logged change. It does not silently move every task deadline or practice reminder. Warn about tasks/reminders now later than final submission and let members resolve them.

### 8.2 Task progress

```text
total = number of non-deleted room tasks
done = number of non-deleted room tasks whose status is Done
progress = 100 × done / total, when total > 0
```

Show the count and percentage together: “3 of 6 tasks done · 50%”. A no-task room displays “No tasks yet” rather than suggesting work is complete. Reopening, deleting, restoring, or adding tasks recalculates both numbers.

Progress is based on task count. It does not claim that six tasks have equal effort or that the group has submitted its work. A 100% board must not automatically mark a project submitted or archive it.

## 9. Task board

### 9.1 Columns and counts

The fixed columns are To do, Doing, and Done. Column headings show counts of non-deleted tasks in the current board filter; overall room progress remains based on all tasks and is labelled accordingly if filters are active.

Each column has an Add task control. Creating from a column preselects that status, although To do is the default for the general Add task action. Empty columns show a brief neutral message and an add control.

### 9.2 Card content

Every card shows title, owner or Unassigned, deadline, status context, and a menu. Completed cards should show “Completed Oct 4” when that is a completion date; if a due date is shown, prefix it “Due”.

Keep long titles readable across two or more lines. A full title remains available in task details without requiring hover. Card menus must be keyboard-accessible and must not cause accidental card navigation.

### 9.3 Task detail form

| Field | Requirement | Proposed behavior |
|---|---|---|
| Title | Required | Trimmed, 1–160 characters |
| Owner | Assignment supported | One current member; Unassigned is a proposed valid intermediate state |
| Deadline | Required in source | Exact date/time with timezone |
| Status | Required | To do, Doing, Done |

The original task fields do not include priorities, subtasks, effort estimates, or attachments. Those are not required merely because many task apps have them. A linked chat message or Library item can supply context without expanding the first-release task form.

If a task deadline is later than final submission, show a warning and require an intentional save; it may represent post-submission follow-up. Do not silently change dates. Past deadlines may also be saved with an overdue warning.

### 9.4 Assignment semantics

One task has one accountable owner in the initial design. Assignment does not restrict who can edit or complete it. Any member may move a teammate's task, with the actor recorded in Activity.

Owner choices are scoped to the current room. A personal contact list or user search cannot be used to assign a nonmember. Former members may appear as historical attribution, but not as new assignment targets.

## 10. Task interactions and concurrency

### 10.1 Status changes

Provide an explicit status selector inside task details and/or the card menu. Optional desktop drag-and-drop calls the same underlying operation. Keyboard and mobile users must be able to perform every transition without dragging.

Allowed transitions include To do → Doing, Doing → Done, To do → Done, and reopening Done into either unfinished state. Record the old status, new status, actor, and time.

Completing sets completion metadata. Reopening removes the task from current completed counts while retaining the historical completion event. Moving a card should update its column count and the progress strip consistently.

### 10.2 Ordering and filters

Proposed default ordering: unfinished tasks by earliest due time; Done tasks by most recent completion. Use a stable ID to break ties. Do not promise custom ordering unless a persistent rank field is implemented.

Optional first-release filters are All tasks and Assigned to me. Search and filter state should not imply missing tasks were deleted. If filters are added, display “Showing your tasks” clearly and preserve global progress semantics.

### 10.3 Save behavior

- Disable duplicate submissions while saving the same operation.
- Use a stable client operation ID so retries cannot duplicate tasks or changes.
- Optimistic movement is acceptable if failures restore the previous state visibly.
- A field edit should not overwrite unrelated fields changed by another member.
- Detect stale versions and show the latest value when the same field was edited concurrently.
- If a task was deleted while open, prevent saving edits as an accidental recreation.

### 10.4 Delete and restore

The original risk plan calls for soft deletion and history. Proposed behavior: any member can delete shared tasks through a deliberate action, and eligible deleted tasks can be restored from Activity or a recovery view.

Deleting removes a task from board counts and progress. Restoring returns its retained status and recalculates derived values. If its owner is no longer a member, restore as Unassigned. Record both actions.

Retention duration is open. Do not promise a recovery window until it is configured and communicated. Deleted records must still be protected by membership checks.

## 11. Contribution view

The contribution view is required by the source but absent from the screenshot. Add a “Contributions” button beside progress or within the member roster; it opens a panel without creating a competitive leaderboard.

### 11.1 Proposed attribution definition

Show “Completed assigned tasks” per member. Credit is captured for the assigned owner at the latest transition into Done; record the person who clicked Done separately as the completion actor.

This distinction matters when Sara marks Ali's task complete after a group review. Ali remains the credited owner; Activity states that Sara changed the status. An unassigned completed task belongs in an Unassigned bucket, not to an arbitrary clicker.

This attribution rule is proposed because the original specification says only “tasks completed per member”. If the product chooses actor-based attribution instead, change the label and tests consistently.

### 11.2 Counting rules

- Count currently Done, non-deleted tasks.
- Reopened and deleted tasks do not count in current totals.
- A later owner change on a completed task does not silently rewrite prior contribution credit.
- If reopened and completed again, capture the new completion ownership context.
- A restore retains its captured credit unless the task is completed anew.
- Show former-member attribution separately where allowed; do not reassign historical credit to a current member.
- Do not rank members by count or imply count equals work quality, time, or effort.

For the screenshot fixture, current contribution counts are Maya Chen: 1, Ali Khan: 1, Omar Hassan: 1, Sara Ahmed: 0. Their total is three, matching the progress strip.

## 12. Room chat layout and message behavior

### 12.1 Desktop panel

The right panel contains a title, scrollable chronological message list, and a composer anchored within the panel. Names and timestamps remain visible for each message or clearly associated message group.

Use avatars or initials without implying online status. Presence dots, typing indicators, read receipts, reactions, and threaded replies are not confirmed first-release requirements.

### 12.2 Sending text

Messages are plain text with safe link rendering. Proposed limit: 4,000 characters per message, enforced consistently in client and server. Reject whitespace-only messages without sending.

- On desktop, Enter may send and Shift+Enter creates a newline; state this accessibly.
- On touch devices, keep an explicit Send button and allow normal text entry.
- After sending, show pending, sent, or failed state.
- Retrying a failed message uses the same operation identity to avoid duplicates.
- Preserve unsent text when switching room tabs; do not leak it into another room.
- Use canonical server ordering with a stable ID as a timestamp tie-breaker.

### 12.3 Scrolling and history

If the student is near the bottom, new messages may scroll into view. If reading older history, preserve their position and show a “New messages” control. Loading older messages must not jump the current viewport.

Use bounded pagination; do not fetch the entire room history on initial load. A reconnect retrieves missed messages and deduplicates existing ones.

### 12.4 Message modification policy

The original document does not define message editing/deletion. Proposed MVP default: no edit/delete controls until an author/moderation policy is chosen. Do not allow any member to rewrite another member's words by interpreting “Everyone can edit” too broadly.

Reporting harmful shared content still needs a defined response process. Account deletion and moderation may require content removal under a separate documented policy; immutable ordinary chat controls do not override that policy.

## 13. Linking chat to tasks and Library items

### 13.1 Task links

The screenshot shows a Build slides task reference inside Sara's message. Model this as a same-room task ID, not a copied title alone. Clicking it opens that task while retaining chat context.

One task link per message is sufficient for the original `task_id` model. A later multi-link extension requires a deliberate schema change.

The displayed task title/status should reflect current authorized task data. The original message body remains the author's text. If the task is deleted, show “Task unavailable” or an authorized deleted-task state; do not open another room's record by ID.

### 13.2 Library references

The Research sources card in Maya's message should reference an actual Library item where possible. Show its title and type. Clicking a link item follows the external-link flow; clicking a note or file opens the authorized item viewer.

Resource links and message pins are separate operations: linking an existing item in chat does not automatically create a duplicate Library item.

## 14. Pinning messages to the Library

Any current member can pin a room message. The result must preserve provenance: original author and timestamp, who pinned it, when it was pinned, and the source message reference.

### 14.1 Proposed pin flow

1. Choose Pin to Library on a message.
2. Review an optional editable title, prefilled from a short excerpt.
3. Save a Library note of subtype Pinned message, containing a snapshot/reference.
4. Show “Pinned to Library” and a direct link.
5. Update Library count and Activity once.

Prevent duplicate active pins for the same source message in the same room, including concurrent requests. If an already-pinned message is pinned again, open or identify the existing item. If the prior pin is soft-deleted, offer restoration when allowed.

### 14.2 Attribution and later changes

Editing the Library title does not change the chat author or timestamp. If shared notes can add commentary around a pin, visually separate commentary from the original quoted content.

Deleting the Library pin does not delete the chat message. If source content is removed through account deletion or moderation, retained pin snapshots must follow that removal policy; they must not become a way to preserve content that should have been removed.

## 15. Library preview and full Library tab

### 15.1 Preview on Board

Show the latest three available Library items and a total count. Each row includes type icon, title, original added-by attribution, added date, and a menu. The screenshot's three example types are link, PDF file, and note.

“View all” opens the Library tab. An empty preview says “Keep files, links and notes together” with an Add item action. Loading or failure must not be presented as an empty library.

### 15.2 Full Library tab

The full tab contains room-scoped search, optional type filters All / Files / Links / Notes, an Add item menu, and a list with author/date metadata. Search is confirmed for the Library; it does not imply global room or application search.

Proposed searchable fields: title, link URL, and plain-text note body. Searching inside uploaded document contents is excluded unless text extraction is deliberately implemented. Label the search scope accurately.

### 15.3 File upload

- Maximum: **10 MB per file**, as specified in the original document.
- Proposed exact interpretation: 10,000,000 bytes, stated consistently in UI and validation.
- Proposed initial allowed set: PDF, PNG, JPEG, WebP, DOCX, XLSX, and PPTX.
- Legacy Office formats, macro-enabled files, archives, executable files, and SVG are excluded from this proposed initial allowlist pending explicit support.
- Validate size and actual file characteristics server-side as well as in the browser.
- Show upload progress, cancel, success, and failure states.
- Do not create a ready Library row before storage and metadata are consistent.
- A retry should not create duplicate resources or orphaned storage objects.
- Display original filename, type, size, and upload attribution in detail view.

Use a private storage model. Downloads and previews require current membership. If time-limited download URLs are used, their short validity and revocation limitations must be understood; do not claim an already-issued URL vanishes immediately after membership changes.

### 15.4 Links

Required: title and valid HTTP/HTTPS URL. Disallow executable or local-file URL schemes. External links open with clear affordances and do not receive private tokens or room content automatically. A rich URL preview is optional, not required.

### 15.5 Notes

Required: title and body. Proposed initial editor is plain text with basic line breaks; rich HTML is unnecessary. Every note shows original author/date and, when edited, last editor/time.

All members may edit shared notes. Concurrent edits need version conflict handling; do not silently overwrite another member's newly saved text.

### 15.6 Shared editing, deletion, and reporting

Any current member may edit shared item metadata under the equal-permissions requirement. Replacing a file is a deliberate edit with replacement attribution and an activity entry; if recoverable file versions are not supported, explain that before replacement rather than implying version history exists.

Soft-delete items and support restoration within the chosen recovery policy. Storage cleanup must not purge bytes before a promised restore window ends. Conversely, no indefinite retention promise is made here.

Each shared item has Report with a short reason form and a receipt state. Reporting does not itself give the reporting student moderator powers. Who receives and resolves reports remains an implementation dependency.

## 16. Reminders and presentation practice

### 16.1 Next reminder preview

On Board, display the nearest upcoming noncancelled reminder. Include type, title, exact local date/time, and a brief note when supplied. The image's example is Presentation practice · Thu, 6 PM.

A plain chat statement such as “Let's practise Thursday” does not create a reminder automatically. A member must save a structured reminder so all members receive the intended notification.

### 16.2 Reminder form

| Field | Requirement |
|---|---|
| Type | Task, Practice session, Meeting, Submission |
| Title | Required |
| Date/time | Required with visible timezone |
| Related task | Optional, same room only |
| Notes/location/link | Proposed optional plain text or safe URL |

Any member can add/edit reminders. Record the creator and last editor. Warn for reminders after final submission or in the past; do not silently discard them or alter their times.

### 16.3 Reminder list and notification behavior

The full tab separates Upcoming and Past, ordered by scheduled time. Proposed cancellation preserves a history entry while removing the reminder from upcoming previews.

All current members receive the room's in-app reminder notifications. Browser notifications remain opt-in and depend on actual delivery support. Denied browser permission does not remove in-app reminders or block room use.

Changing a reminder should invalidate obsolete pending delivery jobs. Use a reminder revision or equivalent identity to avoid sending both old and updated times. Membership must be checked when determining recipients; a departed member must not receive future room content.

The exact advance-alert timing is a product default to define. Do not assume browser permissions alone guarantee notifications while the site is closed. No email, SMS, or calendar integration is promised by this screen.

## 17. Activity history and recovery

Activity is a chronological record of important shared changes. Show actor, action, target, and time; provide details for meaningful field changes.

Examples: “Ali Khan added Write introduction”, “Sara Ahmed moved Build slides to Doing”, “Maya Chen pinned a message to Library”, and “Omar Hassan changed the final deadline”.

### 17.1 Events to record

- Room creation and supported room-detail changes.
- Member joining and leaving; policy-authorized removal if later implemented.
- Task creation, assignment, deadline/status changes, deletion, and restoration.
- Library addition, edit, replacement, deletion, restoration, and message pinning.
- Reminder creation, time changes, and cancellation.

Ordinary chat messages remain in Chat rather than filling Activity with duplicate message events. Clipboard copying, file viewing, and room viewing are not automatically activity events.

### 17.2 Integrity and recovery

Create the shared mutation and its activity record atomically where possible. Members can edit shared work but cannot rewrite the audit record of who changed it. Actor identity and event time come from trusted session/server context.

History is not a backup by itself. Restoration requires retained data or versions, and the UI must only offer restoration when those exist. An old delete event must not offer Restore when the item has already been restored, purged, or made unavailable by policy.

Activity can reveal private content in titles and change summaries; it requires the same room authorization as other room data. Account deletion and moderation may require redaction rather than indefinite identity retention.

## 18. Mobile and tablet behavior

The image is a desktop reference. A mobile room must not squeeze three columns plus chat into the viewport.

### 18.1 Proposed responsive modes

| Width | Behavior |
|---|---|
| 1280 px and above | Three-column Board with persistent right chat |
| 900–1279 px | Compact shell; chat opens in a drawer; Board gets remaining width |
| Below 900 px | Single-column room workspace with dedicated Chat view/drawer |

Adjust these thresholds after testing real content; they are proposed defaults.

### 18.2 Mobile structure

1. Compact back link and room title.
2. Deadline/progress summary.
3. Members/invite controls in a collapsible area.
4. Board / Library / Reminders / Activity navigation.
5. On Board, a To do / Doing / Done status selector with counts and a vertical card list.
6. A prominent Chat button with unread count only if read-state tracking exists.

Chat opens as a focused room view with a Back control. Avoid a bottom composer hidden behind the virtual keyboard or application navigation. Preserve the student's scroll position and draft when closing chat.

### 18.3 Interaction requirements

- Move tasks through explicit menus, not drag-only interaction.
- Provide comfortable touch targets, approximately 44 × 44 CSS pixels for common actions.
- Keep menus and confirmation dialogs inside the viewport.
- No page-level horizontal scrolling at a 320 px viewport.
- Allow long room names and member names to wrap or open a full-text detail.
- Keep final deadline context available without repeating a large desktop header.

## 19. Visual design and accessibility

Follow the image's off-white canvas, white cards, navy typography, indigo controls, teal completion, and light amber/blue/teal column backgrounds. Use subtle borders and restrained shadows.

Suggested tokens remain consistent with the Overview: primary `#4338CA`, main text `#14213D`, background `#F7F8FC`, and 12–16 px card radii. These are design proposals, not verified contrast results.

- Pair status colors with text and icons.
- Expose tabs, menus, dialogs, progress, and form errors accessibly.
- Use a labelled progress value and a textual completed/total count.
- Keep focus visible; restore focus after dialogs close.
- Announce successful saves and failures without reading every background room update.
- Do not force screen-reader announcements for all live chat messages while the student is working elsewhere.
- Support keyboard alternatives for drag-and-drop and pinning.
- Respect reduced-motion preferences and enlarged text.
- Build a deliberate dark palette; do not invert screenshots mechanically.

## 20. Loading, empty, failure, and offline states

| Area/state | Expected behavior |
|---|---|
| Initial authorization | Neutral loading shell; no private data flashes |
| Board loading | Stable column/card skeletons |
| Room has no tasks | No tasks yet, Add task, no invalid progress |
| Empty chat | Invite the group to begin the conversation |
| Empty Library | Add file, link, or note |
| No reminders | Suggest scheduling presentation practice |
| Activity empty | No changes yet; not an error |
| Partial service failure | Keep working sections visible; offer local Retry |
| Lost connection | Show reconnecting/offline state; do not label pending edits saved |
| Failed message | Keep text with Retry; do not create duplicate sends |
| Failed upload | Keep useful form state and a clear retry path |
| Permission lost | Clear private data and leave the room view |
| Deleted deep-link target | Explain unavailability with a safe return to the room |

Offline editing/queuing is not an MVP promise. If not implemented, disable writes while offline and preserve unsent local text safely within the active account/session. Clear or isolate drafts when the user changes account.

## 21. Real-time synchronization

Room chat is explicitly real-time. Proposed extension: live task changes, progress, Library items, reminders, and membership updates so participants see a consistent workspace.

### 21.1 Synchronization rules

- Establish subscriptions only after current membership is verified.
- Scope all channels and updates to the room.
- Apply records using canonical IDs and versions, deduplicating local optimistic writes.
- Reconcile from authoritative data after reconnect; do not assume every event arrived.
- Derive counts from consistent data or refresh aggregates after changes.
- Do not insert a raw event payload into another room's cache.
- Stop subscriptions on room exit, sign-out, or access loss.

### 21.2 Editing conflicts

Use version checks or equivalent conflict protection for forms. If another member changes the field currently being edited, preserve the local draft and explain that newer data exists. The student can review and intentionally retry; silent overwrites are unacceptable for shared notes or deadline changes.

Concurrent task status changes may resolve to the latest accepted server operation, but the client must show the canonical result and retain accurate history. Mutation order and displayed message order must not depend on unreliable client clocks.

## 22. Data model and required extensions

The original schema is a high-level starting point. Suggested additions below support the specified behavior; they are not claims about existing tables.

| Entity | Original purpose | Fields/constraints to clarify or add |
|---|---|---|
| `rooms` | Name, subject, deadline, creator, invite | Timezone context, version, update timestamps; lifecycle only after policy decision |
| `room_members` | Membership and display role | Unique room/user pair, joined time, departure handling |
| `room_tasks` | Title, owner, deadline, status | Version, creator/editor, completion actor/time/credited owner, soft-delete metadata |
| `room_reminders` | Type, title, time, creator | Optional task reference, notes, revision, cancellation metadata |
| `room_messages` | Text, author, time, task link | Stable client operation ID; optional resource reference; removal policy fields if needed |
| `room_library` | File/link/note and attribution | Storage key or URL/body, size/type, version, last editor, source message, soft deletion |
| `room_activity` | Actor/action/time | Target type/ID, structured change summary, trusted timestamp |
| Notification/read state | Not fully modeled | Per-member in-app delivery/read state, deduplication keys |

Do not use one ambiguous `url_or_path` field for every Library subtype without validation. A note needs body content; a file needs a private storage reference; a link needs a validated external URL.

The original `pinned` boolean alone cannot fully describe who pinned a message, its Library item, or concurrent duplicate prevention. Prefer the Library relationship as the canonical association, with any boolean treated as derived or kept transactionally consistent.

### 22.1 Integrity constraints

- Referenced task, resource, and message IDs must belong to the same room as the parent record.
- New task owners must be current members of that room.
- At most ten active memberships, enforced safely under concurrent joins.
- One membership per room/user.
- Valid task status and reminder type enums.
- Unique active source-message pin association per room.
- Unique operation identities for retryable creates/messages where appropriate.
- File size/type policy enforced outside the browser as well.

## 23. Operations and authorization contract

Suggested operations include Load room summary, List tasks, Create/update task, Change task status, Delete/restore task, List/send messages, Pin message, List/add/edit Library item, Start/complete upload, Create/edit/cancel reminder, List activity, Join room, and Leave room.

For every operation:

1. Resolve the authenticated or anonymous session identity.
2. Check current membership or the specific invitation-join authorization.
3. Validate payload and same-room relationships.
4. Apply permitted mutation with concurrency safeguards.
5. Record activity when required.
6. Return the canonical result and updated revision.
7. Publish only authorized real-time updates.

The invitation landing page is a narrow exception for the deliberately limited preview. Ordinary room endpoints never treat knowledge of a room ID or invite token as full membership.

Do not expose privileged backend keys in the client. Data-layer policies, storage access, and real-time channels all need consistent membership enforcement. This document defines the behavior; implementation should verify provider-specific capabilities rather than assuming they work automatically.

## 24. Timezones and date formatting

Store deadline and reminder instants consistently and display them in the viewer's selected timezone. When scheduling shared events, expose the chosen timezone so “Thursday at 6” is not ambiguous across countries.

Use absolute dates alongside relative summaries where needed. Date-only task entries require an explicit time policy; recommended default is a visible editable 23:59 rather than silently selecting midnight.

Refresh countdowns at least once per minute while visible and on tab focus. Local midnight changes date labels. Daylight-saving transitions require valid date/time handling, including ambiguous or nonexistent local times during scheduling.

Display chat times in the viewer's timezone with day separators. Source timestamps stay canonical. Activity and completion dates must not be inferred from a message's text.

## 25. Data retention, deletion, and reporting boundaries

The original product promises account deletion and personal-data removal while also requiring shared attribution and activity. That interaction must be resolved deliberately before release.

Open policy questions include whether shared authored content is deleted, anonymized, or retained with identity removed; how Library file cleanup works; how pinned copies follow removals; and how departed-member contributions are labelled.

Similarly, room closure and semester-end file cleanup are unresolved. Do not auto-delete data after final submission. Do not advertise permanent storage. Soft deletion is a recovery mechanism within the chosen policy, not a reason to retain personal information indefinitely.

Reporting shared items requires a real intake and response process. A Report button that only changes its own label without saving a report is not functional. The absence of student admin accounts does not by itself define how product operators handle abuse reports.

## 26. Performance and cost considerations

Keep the room useful on a phone and within the free-first product approach. Exact provider limits or costs are not asserted here.

- Load room identity, deadline, members, and the first board data promptly.
- Paginate message history, activity, and long Library lists.
- Avoid downloading file contents simply to render Library rows.
- Reuse one room subscription strategy rather than subscribing separately for every card.
- Unsubscribe hidden/abandoned room sessions appropriately.
- Load file previews only on demand.
- Compute counts with bounded queries or maintained aggregates that can be reconciled.
- Avoid polling that repeatedly downloads unchanged room histories.

Proposed test target: the initial room workspace becomes usable within approximately three seconds on a documented representative phone/network profile. This extends the original home-screen target as a proposal, not a measured result.

Test with ten members, one hundred tasks, two hundred Library records, and several thousand historical messages. These are stress-test fixtures, not new product caps.

## 27. Consistent screenshot fixture

Use this fixture to reproduce the inspected room while removing ambiguous dates. It is illustrative data, not the user's actual class project.

### 27.1 Room and clock

- Room: Campus Sustainability.
- Subject: Environmental Studies.
- Creator/Leader: Sara Ahmed.
- Other members: Ali Khan, Maya Chen, Omar Hassan.
- Reference time: Monday, October 5, 2026, 12:30 in the fixture timezone.
- Final submission: Friday, October 9, 2026, 17:00 in the same timezone.
- Compact countdown: approximately four days left; exact date/time available.
- Progress: three of six tasks done, 50%.

This fixture is later in the same sample day than the Overview fixture's 09:35 clock. The image's 12:17 chat message therefore already exists when the room is viewed.

### 27.2 Tasks

| Task | Owner | Status | Explicit date meaning |
|---|---|---|---|
| Write introduction | Ali Khan | To do | Due Oct 6, 17:00 |
| Prepare speaker notes | Omar Hassan | To do | Due Oct 7, 17:00 |
| Build slides | Sara Ahmed | Doing | Due Oct 8, 17:00 |
| Collect sources | Maya Chen | Done | Completed Oct 4; retain its separate original due date |
| Survey classmates | Ali Khan | Done | Completed Oct 3; retain its separate original due date |
| Outline report | Omar Hassan | Done | Completed Oct 2; retain its separate original due date |

### 27.3 Resources and reminder

| Item | Type | Added by | Added date |
|---|---|---|---|
| Research sources | Link | Maya Chen | Oct 2 |
| Survey results.pdf | File | Ali Khan | Oct 3 |
| Presentation outline | Note | Omar Hassan | Oct 1 |

Next reminder: Presentation practice, Thursday, October 8, 2026, 18:00. Note: “Practise the full presentation as a group.”

### 27.4 Chat

| Time | Author | Message | Reference |
|---|---|---|---|
| 10:24 | Maya Chen | The sources are in the Library. | Research sources Library item |
| 11:02 | Sara Ahmed | Let's practise on Thursday at 6. | Build slides task, matching the screenshot |
| 12:17 | Ali Khan | I'll finish the introduction tomorrow. | No required linked object |

The structured practice reminder exists independently from the chat message. Pinning Maya's message should add one Library note, changing the Library count from three to four without changing task progress.

## 28. End-to-end interaction flows

### Flow A — Create and invite

1. Student enters room name, subject, and final deadline.
2. Room and creator membership save together.
3. Board opens in a one-member setup state.
4. Student copies the invitation link and shares it themselves.
5. A teammate signs in or enters as a named guest, then explicitly joins.
6. Member count updates and both can edit shared work.

### Flow B — Assign and complete work

1. Maya creates a task in To do and assigns Ali.
2. Ali opens the task and moves it to Doing.
3. Sara marks it Done after a group review.
4. Board counts and progress update for connected members.
5. Contribution credit belongs to Ali under the proposed owner-at-completion rule.
6. Activity records Sara as the status-change actor.

### Flow C — Preserve useful chat

1. A member sends a useful explanation or resource message.
2. Another member chooses Pin to Library.
3. A single attributed Library note is created.
4. Clicking the pin opens the Library item and preserves access to the source context.
5. Repeating the pin action does not create duplicates.

### Flow D — Plan presentation practice

1. Any member creates a Practice session reminder.
2. The time is displayed with timezone context.
3. The nearest reminder appears below Board and in Overview room summaries.
4. Current members receive the applicable in-app notifications.
5. Changing the practice time updates the saved reminder and prevents obsolete scheduled alerts.

### Flow E — Recover accidental deletion

1. A member deletes a task through its menu.
2. The task disappears from Board and counts recalculate.
3. Activity identifies the deletion and actor.
4. An authorized member restores it within the supported retention policy.
5. The task returns once, with valid ownership and consistent progress.

### Flow F — Handle concurrent edits

1. Sara and Maya open the same note.
2. Sara saves a change.
3. Maya attempts to save her earlier version.
4. The app preserves Maya's draft and shows a conflict with current content.
5. Maya reviews and intentionally applies a new change; Sara's text is not silently lost.

### Flow G — Continue on a phone

1. Student opens a room invitation or saved room link.
2. The compact header shows deadline and progress.
3. Student selects Doing and opens their task.
4. Student changes its status using an accessible menu.
5. Student opens Chat, sends a message, and returns to the prior Board position.

## 29. Acceptance criteria

| ID | Scenario | Required result |
|---|---|---|
| PR-01 | Guest creates a room | Same supported room capabilities as Google student |
| PR-02 | Creation succeeds | Room and creator membership both exist; Leader label visible |
| PR-03 | New room has one member | Setup state explains inviting a teammate |
| PR-04 | Valid invitation opened without session | Authentication preserves intended destination |
| PR-05 | Joining without display name | Name collected before membership participation |
| PR-06 | Existing member opens invitation | No duplicate membership |
| PR-07 | Two joins compete for tenth slot | Membership never exceeds ten |
| PR-08 | Nonmember knows room ID | No private room content or mutations allowed |
| PR-09 | Clipboard copying fails | Usable manual-copy fallback |
| PR-10 | Member edits another member's task | Allowed, with correct actor in Activity |
| PR-11 | Leader badge inspected | No unapproved privilege follows from badge |
| PR-12 | Everyone can edit opened | Explanation shown, not an invented role editor |
| PR-13 | Board fixture loads | To do 2, Doing 1, Done 3; 50% progress |
| PR-14 | Room contains no tasks | No tasks yet; no divide-by-zero or 100% claim |
| PR-15 | One of three done tasks reopened | Two of six done; proportional progress |
| PR-16 | New task saved twice due to retry | One task created |
| PR-17 | Owner belongs to another room | Assignment rejected |
| PR-18 | Status changed without drag | Full transition is accessible by keyboard/touch |
| PR-19 | Task date exceeds final deadline | Warning shown; no silent date rewrite |
| PR-20 | Another member edits same task field | Conflict/latest-state handling prevents silent stale overwrite |
| PR-21 | Task deleted while detail is open | Later save does not recreate it accidentally |
| PR-22 | Deleted task restored | One valid task restored; counts and attribution consistent |
| PR-23 | Sara completes Ali's task | Proposed contribution credits Ali; Activity records Sara |
| PR-24 | Task owner changes after completion | Prior credit is not silently reassigned |
| PR-25 | New chat message arrives while reading history | Position retained; new-message control available |
| PR-26 | Message send fails and retries | Text retained; no duplicate canonical message |
| PR-27 | Message links task in another room | Reference rejected or inaccessible, without data leak |
| PR-28 | Message pin clicked concurrently | One active Library pin |
| PR-29 | Pin deleted from Library | Source chat message remains unless separately removed by policy |
| PR-30 | Library link clicked | Correct safe URL opens; no private context sent automatically |
| PR-31 | Allowed file exactly at configured limit | Accepted if all other validations pass |
| PR-32 | File exceeds 10,000,000 bytes | Rejected consistently under proposed byte definition |
| PR-33 | File type spoofed or unsupported | Rejected by trusted validation |
| PR-34 | File upload fails halfway | No ready phantom Library item; safe retry/cancel |
| PR-35 | Library search matches note body | Relevant room-scoped item returned |
| PR-36 | No document-text search implemented | UI does not promise searching inside PDFs/Office files |
| PR-37 | Note edited concurrently | Local draft preserved and conflict explained |
| PR-38 | Member creates practice reminder | Reminder appears in full list and nearest preview when applicable |
| PR-39 | Practice reminder rescheduled | Obsolete scheduled delivery invalidated |
| PR-40 | Browser notification permission denied | In-app reminders and room use remain available |
| PR-41 | Member departs before future reminder delivery | No future private notification sent to former member |
| PR-42 | Activity mutation logged | Correct trusted actor, target, action, and timestamp |
| PR-43 | Student tries to rewrite Activity | Denied |
| PR-44 | Network reconnects after missed events | Canonical state reconciles without duplicates |
| PR-45 | Access revoked while room open | Private view/subscriptions cleared; future writes denied |
| PR-46 | Final deadline passes | Clear overdue state; no automatic deletion or submission claim |
| PR-47 | Board reaches 100% | No automatic archive or university submission |
| PR-48 | Narrow phone with virtual keyboard | Chat composer and task controls remain usable |
| PR-49 | Keyboard-only use | Tabs, menus, forms, chat, pinning, and status changes work |
| PR-50 | Guest upgrades to Google | Existing memberships and authorship remain correctly associated |
| PR-51 | Room load fails | Failure distinguished from missing/empty room |
| PR-52 | Report submitted on shared item | Report persisted with receipt; no fake moderation outcome |
| PR-53 | Source message removed under deletion policy | Pinned snapshot follows the same required removal policy |
| PR-54 | Room details/deadline edited | All permitted members see updated state and history |

## 30. Suggested delivery sequence

### Stage 1 — Reviewable room demo

Implement the inspected Board layout with clearly labelled sample data, task detail forms, responsive navigation, and local interaction states. A demo must not claim real saved collaboration or successful invitation delivery.

### Stage 2 — Functional core

Add real sessions, room creation/joining, current-membership authorization, saved tasks, progress, Library storage, reminders, room chat, pinning, contribution attribution, and activity history. Verify concurrent joins, edits, and retries.

### Stage 3 — Reliability and recovery

Complete reconnect behavior, error states, soft-delete recovery within the selected retention policy, accessible keyboard/touch flows, account-linking behavior, report intake, and realistic mobile performance checks.

Browser notifications can follow in the planned notification phase. They must not delay a clear in-app reminder experience or be falsely advertised before supported delivery exists.

## 31. Open decisions to resolve before affected features ship

1. How can a member be removed when all members otherwise have equal permissions?
2. Who may rotate or revoke an invitation link?
3. What happens when the creator or final member leaves?
4. Can rooms be archived, reopened, or deleted, and by whom?
5. How long are soft-deleted tasks, notes, pins, and file bytes recoverable?
6. How do account deletion and moderation affect shared content, snapshots, and attribution?
7. Are chat messages editable/deletable, by whom, and for how long?
8. Is contribution credit based on task owner at completion, as proposed, or another explicit rule?
9. Which exact file types and byte interpretation of 10 MB will be published?
10. Which in-app reminder timings are default, and which browser delivery modes actually work?
11. Are unassigned tasks allowed, as proposed, or must an owner be selected at creation?
12. What operational process handles reports without adding student admin roles?

These decisions do not prevent using this document to design the core room. Unresolved privileges, retention promises, and lifecycle actions should remain absent or clearly gated until decided.

## 32. Definition of done

The room is ready when authorized guests and Google students can coordinate one project end to end: join by invitation, assign and complete tasks, share and retrieve resources, practise using reminders, chat in real time, pin useful messages, inspect contributions, and recover supported accidental deletions.

The image's visible structure should remain recognizable, while the functional page corrects ambiguous dates, provides the missing contribution view, explains equal permissions, and works on mobile. All applicable acceptance criteria must pass against actual saved data; static mockups alone do not establish completion.

Test with the screenshot fixture, a newly created one-member room, a full ten-member room, simultaneous edits, interrupted uploads/messages, revoked access, and cross-timezone reminders. Document any intentionally deferred capability rather than leaving a clickable placeholder that appears functional.
