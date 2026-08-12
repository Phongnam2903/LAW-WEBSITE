# Prototype Flows

## Document Control

| Field | Value |
|---|---|
| Project | Law Firm Website & Management System |
| Document | Prototype Flows |
| Document ID | `UI-PROTO-10` |
| Version | 1.0 |
| Status | Draft — Phase 2 baseline |
| Effective date | 2026-08-12 |
| Upstream | [02-user-flows.md](02-user-flows.md), [03-screen-inventory.md](03-screen-inventory.md), [05-wireframe-states.md](05-wireframe-states.md) |
| Decision register | [assumptions-open-questions.md](assumptions-open-questions.md) |

## Record of Changes

| Date | Change type | In charge | Description |
|---|---|---|---|
| 2026-08-12 | Added | Phase 2 Agent | Defined interaction prototypes for every critical business journey, including decision points and error end states. |

## 1. Purpose

This document specifies interaction-level prototypes — the exact click/tap-by-click path, decision points, and every terminal state (success and error) — for the journeys with the highest business consequence. Each prototype is implementable as a clickable prototype (e.g., in Figma) directly from this specification without further design decisions, other than the visual values still marked PROPOSED/TBD elsewhere.

## 2. `PROTO-001` — Public Conversion (Homepage → Consultation → Confirmation)

- **Goal**: Convert an anonymous visitor into a centralized `WEBSITE` Lead.
- **Actor**: Guest.
- **Starting screen**: `PUB-001` Home.
- **Steps**:
  1. Guest lands on `PUB-001`; Hero CTA is visible above the fold.
  2. Guest taps/clicks the primary CTA.
  3. `PUB-012` Consultation Form opens (modal on `PUB-001`, full section on `PUB-011`).
  4. Guest completes Name, Phone, Legal Issue (Email optional per `UI-OQ-008`).
  5. Guest checks the consent checkbox.
  6. Guest taps Submit.
  7. Client-side validation runs; anti-abuse (reCAPTCHA v3) evaluates in the background.
  8. On pass, the system creates a Lead (`source=WEBSITE`, `status=NEW`) and triggers `FR-NOTI-001`.
  9. Confirmation state replaces the form.
- **Decision points**:
  - Step 4–5: any required field missing/invalid → Validation Error state (`05-wireframe-states.md` §3), Guest corrects and resubmits.
  - Step 7: anti-abuse check fails → generic Server Error state, no Lead created, Guest may retry.
  - Step 8: server-side validation fails (e.g., malformed data despite client checks) → Server Error state, form retains input.
- **Success end state**: Public acknowledgement/confirmation message; Lead exists with `status=NEW`; authorized staff receive a real-time notification.
- **Error end states**: Validation Error (recoverable, same screen); Anti-abuse/Server Error (recoverable, same screen, generic message, no internal detail disclosed).
- **Related screens**: `PUB-001`, `PUB-006` (alternate entry), `PUB-011`, `PUB-012`.
- **Related User Stories**: `US-LEAD-001`, `US-WEB-001`, `US-WEB-004`.
- **Related ACs**: `AC-LEAD-001` (Scenarios 10.1, 10.2).

## 3. `PROTO-002` — Lead Operations (Dashboard → Lead List → Lead Detail → Assign → Appointment)

- **Goal**: Take a newly arrived Lead from unassigned to a scheduled first appointment.
- **Actor**: `LEGAL_ASSISTANT`.
- **Starting screen**: `DASH-001`.
- **Steps**:
  1. Actor logs in (`PROTO-005`), lands on `DASH-001`.
  2. Actor sees "New Leads Today" stat tile or a `NOTI-001` notification and clicks through to `LEAD-001`.
  3. Actor opens the unassigned Lead → `LEAD-002`.
  4. Actor reads contact info and legal-issue description.
  5. Actor clicks "Assign" → selects an eligible `LAWYER` from the assignee list.
  6. System saves the assignment; assignee becomes visible to permitted users.
  7. Actor adds a follow-up note documenting first contact.
  8. Actor clicks "Schedule Appointment" → `APP-002` opens pre-linked to this Lead.
  9. Actor selects type (`ONLINE`/`OFFLINE`/`PHONE_CALL`), sets a future date/time, saves.
  10. Appointment is created with status `PENDING`; actor returns to `LEAD-002`, which now lists the linked appointment.
  11. Actor updates Lead status `NEW → CONTACTED`.
- **Decision points**:
  - Step 5: no eligible assignee available/visible → assignment blocked, actor escalates outside the system (not modeled).
  - Step 9: past date selected → Validation Error (`AC-APP-001` Scenario 15.2), actor corrects.
  - Step 11: status transition attempted out of the confirmed positive order → rejected with explanation (`AC-LEAD-004` Scenario 13.2 pattern).
- **Success end state**: Lead is assigned, has a follow-up note, has a `PENDING` Appointment linked, and status is `CONTACTED`.
- **Error end states**: Validation Error on Appointment date (recoverable); blocked status transition (recoverable, no state change).
- **Related screens**: `DASH-001`, `LEAD-001`, `LEAD-002`, `APP-002`, `NOTI-001`.
- **Related User Stories**: `US-LEAD-002`, `US-LEAD-003`, `US-LEAD-004`, `US-APP-001`, `US-NOTI-001`.
- **Related ACs**: `AC-LEAD-002`, `AC-LEAD-003`, `AC-LEAD-004`, `AC-APP-001`, `AC-NOTI-001`.

## 4. `PROTO-003` — Case Operations (Lead → Convert → Case Detail → Document)

- **Goal**: Convert a qualified Lead into a Case and attach the first document.
- **Actor**: Assigned `LAWYER` (conversion actor per `OQ-04`/`OQ-05` may also be `LEGAL_ASSISTANT`/`SUPER_ADMIN`; prototype assumes an actor with confirmed conversion authority).
- **Starting screen**: `LEAD-002`, with Lead status `QUALIFIED`.
- **Steps**:
  1. Actor opens `LEAD-002` for a `QUALIFIED` Lead; "Convert to Case" is enabled.
  2. Actor clicks "Convert to Case" → `ConfirmationDialog` opens, stating the consequence.
  3. Actor confirms.
  4. System creates the Case transactionally and sets Lead status to `CONVERTED` only on success.
  5. Actor is navigated to the new `CASE-002`.
  6. Actor assigns themselves/another lawyer (if not already carried over from the Lead assignment).
  7. Actor clicks "Upload" in the Documents panel, selects a PDF ≤ 20MB.
  8. System validates type/size client-side, then uploads.
  9. Document appears in the list with a UUID-based private storage reference.
  10. Actor adds an Activity entry noting the case was opened.
- **Decision points**:
  - Step 1: Lead status ≠ `QUALIFIED` → "Convert to Case" stays disabled with a tooltip (Blocked/Not-Qualified state, `05-wireframe-states.md` §6.1); this path terminates here.
  - Step 4: conversion fails server-side (validation/authorization/transaction failure) → Lead remains `QUALIFIED`, no Case is shown as created, `Alert` explains the failure (`NFR-REL-001`).
  - Step 8: file fails type/size check → Invalid Type / File Too Large state, actor reselects.
  - Step 8: upload fails mid-transfer → Network Error state, actor retries.
- **Success end state**: Case exists, linked to the originating Lead; Lead is `CONVERTED`; at least one lawyer is assigned; one document is stored privately; one activity entry exists.
- **Error end states**: Blocked (not qualified); Conversion Failure (Lead stays `QUALIFIED`, no Case); Upload Invalid Type/Too Large/Network Error (recoverable, Case unaffected).
- **Related screens**: `LEAD-002`, `CASE-002`.
- **Related User Stories**: `US-CASE-001`, `US-CASE-002`, `US-CASE-003`, `US-DOC-001`.
- **Related ACs**: `AC-CASE-001` (Scenarios 17.1, 17.2), `AC-CASE-002`, `AC-CASE-003`, `AC-DOC-001` (Scenarios 20.1–20.3).

## 5. `PROTO-004` — CMS Publish (Content List → Editor → SEO → Publish)

- **Goal**: Author and publish a Blog post with complete SEO metadata.
- **Actor**: `CONTENT_CREATOR`.
- **Starting screen**: `CMS-003` Blog CMS list.
- **Steps**:
  1. Actor clicks "New" on `CMS-003` → `CMS-004` opens in create mode, Content tab active.
  2. Actor writes title and body content.
  3. Actor switches to the SEO tab (`SEO-001`) and completes Meta Title, Meta Description, Canonical URL, Open Graph fields; SERP preview updates live.
  4. Actor clicks "Save Draft" to checkpoint work.
  5. Actor clicks "Publish".
  6. System validates required Content-tab fields; if the SEO tab has unresolved errors, its tab shows an error indicator.
  7. On success, the post becomes publicly eligible and appears on `PUB-009`/`PUB-010`.
- **Decision points**:
  - Step 6: required content field missing → Publish blocked, actor is routed to the offending tab via its error indicator.
  - Step 6: save/publish fails server-side (authorization, unexpected failure) → page-level `Alert`, draft is preserved, actor may retry.
- **Success end state**: Blog post is published; visible at `PUB-010`; SEO metadata renders in the page `<head>` and JSON-LD per `FR-SEO-002`.
- **Error end states**: Validation Error (blocked publish, recoverable); Server Error (draft preserved, recoverable).
- **Related screens**: `CMS-003`, `CMS-004`, `SEO-001`, `PUB-009`, `PUB-010`.
- **Related User Stories**: `US-CMS-001`, `US-SEO-001`, `US-SEO-002`.
- **Related ACs**: `AC-CMS-001`, `AC-SEO-001`, `AC-SEO-002`.

## 6. `PROTO-005` — Authentication (Login → Role-based Landing)

- **Goal**: Establish a role-scoped authenticated session.
- **Actor**: Any internal role.
- **Starting screen**: `AUTH-001`.
- **Steps**:
  1. Actor opens `/login`.
  2. Actor enters email and password.
  3. Actor submits.
  4. System validates credentials and account state.
  5. On success, JWT-based session is established; actor is redirected to `DASH-001`, sidebar filtered to the actor's role.
- **Decision points**:
  - Step 4: invalid credentials → Invalid Credentials state, generic message, same screen.
  - Step 4: account deactivated → Locked/Disabled state, distinct message, same screen.
  - Post-login: actor attempts a page/action outside role/record scope → routed to `AUTH-005`.
- **Success end state**: Authenticated session; `DASH-001` rendered with role-appropriate navigation.
- **Error end states**: Invalid Credentials (recoverable); Locked/Disabled (recoverable only via account-lifecycle action outside this flow, `OQ-23`); Unauthorized post-login (recoverable, return to a permitted page).
- **Related screens**: `AUTH-001`, `DASH-001`, `AUTH-005`.
- **Related User Stories**: `US-AUTH-001`, `US-AUTH-004`.
- **Related ACs**: `AC-AUTH-001` (Scenarios 1.1–1.3), `AC-AUTH-004`.

## 7. `PROTO-006` — Document Access (Case Detail → Download)

- **Goal**: Retrieve a private document without exposing it publicly.
- **Actor**: Assigned `LAWYER`.
- **Starting screen**: `CASE-002`.
- **Steps**:
  1. Actor opens an assigned Case → Documents panel lists permitted files.
  2. Actor clicks Download on a `DocumentItem`.
  3. System re-checks record-scope authorization.
  4. On success, a temporary access mechanism (e.g., presigned URL) is issued and the download begins.
- **Decision points**:
  - Step 3: actor is not assigned to this Case (e.g., reached via a stale/guessed link) → 403 Forbidden, no file disclosed (`AC-DOC-002` Scenario 21.2).
  - Step 4: temporary access has expired or storage fails → Network/Access Error state, actor retries from the panel (not from a stale link).
- **Success end state**: File downloads; access event is available for audit per `FR-AUDIT-001` where the action is covered by the approved audit-event catalog.
- **Error end states**: 403 Forbidden (terminal for this actor on this document); temporary Access/Network Error (recoverable, retry from `CASE-002`).
- **Related screens**: `CASE-002`.
- **Related User Stories**: `US-DOC-002`.
- **Related ACs**: `AC-DOC-002` (Scenarios 21.1, 21.2).

## 8. Prototype Coverage Summary

| Prototype | Journey | Actor | Critical? |
|---|---|---|---|
| `PROTO-001` | Public Conversion | Guest | Yes — primary business goal (`BO-02`) |
| `PROTO-002` | Lead Operations | `LEGAL_ASSISTANT` | Yes — core operational workflow |
| `PROTO-003` | Case Operations | `LAWYER` | Yes — core operational workflow, highest data-integrity risk (`NFR-REL-001`) |
| `PROTO-004` | CMS Publish | `CONTENT_CREATOR` | Yes — drives `BO-01` brand/SEO goals |
| `PROTO-005` | Authentication | Any internal role | Yes — gates every internal journey |
| `PROTO-006` | Document Access | `LAWYER` | Yes — highest confidentiality risk (`SEC-04`) |

## 9. Validation Record

- Every prototype specifies Prototype ID, Goal, Actor, Starting Screen, numbered Steps, explicit Decision Points, Success End State, and every Error End State — no happy-path-only flow.
- Every prototype traces to Screen IDs from `03-screen-inventory.md` and to User Stories/Acceptance Criteria from Phase 1.
- Error end states are drawn directly from `05-wireframe-states.md`, not invented ad hoc.
- `PROTO-003`'s Blocked/Conversion-Failure states directly enforce `NFR-REL-001` (no false-success, no partial Lead-to-Case outcome) at the interaction level.
- `PROTO-006`'s 403 end state directly enforces `NFR-FILE-001`/`SEC-04` (no unauthorized disclosure) at the interaction level.

**Validation status:** Passed 2026-08-12.
