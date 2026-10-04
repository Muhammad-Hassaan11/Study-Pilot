# Feature Specification: Phase 1 — Foundation and Accounts

**Feature Branch**: Not created; documentation on `master`.  
**Created**: 2026-10-03  
**Status**: Draft; account lifecycle decisions are launch gates.  
**Input**: Overview account states, guest parity, settings, privacy and responsive shell.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enter my study space (Priority: P1)

A student continues as a guest or signs in with Google and reaches an honest empty home.

**Why this priority**: All saved personal and shared work needs a stable identity.
**Independent Test**: Create each account type without courses and compare available actions.

**Acceptance Scenarios**:

1. **Given** no session, **When** guest entry succeeds, **Then** a persistent guest identity
   opens Overview with setup prompts and an accurate recovery warning.
2. **Given** a room invite, **When** authentication completes, **Then** its destination is
   retained; authentication alone does not join the room.
3. **Given** expired credentials, **When** reopening a protected view, **Then** recovery is
   offered without flashing previous or another student's protected data.

### User Story 2 - Personalize without compulsory setup (Priority: P1)

A student sets a display name, study timezone and appearance while retaining access to
tools that do not require grading or a complete semester.

**Why this priority**: International dates and readable navigation affect every journey.
**Independent Test**: Save preferences, reload, and change theme and timezone on a phone.

**Acceptance Scenarios**:

1. **Given** incomplete academic setup, **When** opening available tools, **Then** relevant
   setup prompts appear without a compulsory whole-semester wizard.
2. **Given** a missing name, **When** attempting room/forum participation, **Then** name
   collection precedes participation; the name is not described as identity-verified.
3. **Given** a failed settings save, **When** returning to the form, **Then** the draft and
   last saved value remain distinguishable.

### User Story 3 - Keep control of my account (Priority: P1)

A guest links Google without losing work; any student can sign out or request deletion.

**Why this priority**: Account changes must not lose or leak saved work.
**Independent Test**: Link a populated test guest, simulate a conflict, then switch accounts.

**Acceptance Scenarios**:

1. **Given** guest records, **When** linking succeeds, **Then** ownership, membership,
   authored work, and usage identity remain associated once.
2. **Given** Google already belongs to another account, **When** linking encounters a
   conflict, **Then** neither account is silently merged, cleared, or overwritten.
3. **Given** confirmed account deletion, **When** removal progresses, **Then** access is
   revoked and status follows the published deletion policy, including shared-content rules.

### Edge Cases

Cancelled Google sign-in; unavailable identity service; blocked storage; lost guest session;
duplicate display names; link retry; account switch in another tab; ambiguous local timezone;
long names; browser Back after sign-out; interrupted deletion. None may disclose cached data.

## Requirements *(mandatory)*

### Functional Requirements

- **P01-FR-001**: Offer Google and guest entry with equal released permissions and allowances.
- **P01-FR-002**: Persist identity continuity across a supported browser restart and explain
  the actual guest recovery limitations before claiming cross-device safety.
- **P01-FR-003**: Show setup/empty states; sample data may appear only in a labelled separate demo.
- **P01-FR-004**: Collect a trimmed nonempty display name before social participation;
  duplicate names are allowed and never used as identity-merge keys.
- **P01-FR-005**: Save name, optional descriptive university, timezone, and light/dark/system
  appearance. University text must not select an authoritative grade table.
- **P01-FR-006**: Navigation must expose only released destinations; preserve active view,
  browser Back, and intended protected destinations through authentication.
- **P01-FR-007**: Provide Settings/profile access on all screen sizes and a persistent place
  to find the guest recovery notice after any dismissible banner is closed.
- **P01-FR-008**: Link through verified account ownership, preserving records and quota
  identity; retries must be idempotent and linking failures must preserve guest access.
- **P01-FR-009**: An existing-account conflict must explain safe recovery; no automatic
  content merge is part of this phase. The supported resolution must be documented prelaunch.
- **P01-FR-010**: Sign-out, expiry, account switching, and deletion must clear or isolate
  protected visible data, caches, and drafts. All protected operations check current identity.
- **P01-FR-011**: Account deletion requires deliberate confirmation explaining personal and
  shared-data effects; show pending/completed/failed accurately and prevent late recreation.
- **P01-FR-012**: Match guest copy to actual storage. The source's “saved on this device”
  wording must be corrected if records are remote but recovery depends on the device session.
- **P01-FR-013**: Apply CQ-01–CQ-07 from the [product specification](../spec.md), including
  labelled errors, keyboard support, 320-pixel reflow and persistent appearance.

### Key Entities

- **Student identity**: Stable owner of private records and memberships; may be guest or linked.
- **Profile/preferences**: Display name, university text, timezone, appearance and setup state.
- **Link operation**: Original identity, target account association, progress/conflict outcome.
- **Deletion request**: Scope, confirmed intent, lifecycle and published retention obligations.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **P01-SC-001**: At least 9/10 testers reach a usable empty Overview through guest entry
  within one minute without assistance.
- **P01-SC-002**: All parity, failed-link, successful-link and identity-switch fixtures
  preserve correct ownership and expose zero previous-account private records.
- **P01-SC-003**: All saved preferences survive reload; every essential shell action works
  by keyboard, at 320 CSS pixels, and with enlarged text.

## Dependencies, Assumptions and Phase Exit

No earlier phase required. Apply source OV-01–03, OV-24–32 as relevant. Proposed account
conflict behavior is preserve-and-recover, not merge. Public release requires resolved guest
storage wording, linking recovery, and account deletion/retention policy from the decision
register. Exit evidence includes session recovery, ownership denial, deletion, and responsive
review. Database/authentication service choices belong to later technical planning.
