# Wireframe States

## Document Control

| Field | Value |
|---|---|
| Project | Law Firm Website & Management System |
| Document | Wireframe States |
| Document ID | `UI-STATE-05` |
| Version | 1.0 |
| Status | Draft — Phase 2 baseline |
| Effective date | 2026-08-12 |
| Upstream | [03-screen-inventory.md](03-screen-inventory.md), [04-wireframes.md](04-wireframes.md) |
| Decision register | [assumptions-open-questions.md](assumptions-open-questions.md) |

## Record of Changes

| Date | Change type | In charge | Description |
|---|---|---|---|
| 2026-08-12 | Added | Phase 2 Agent | Defined non-happy-path states for every applicable screen category, each mapped to a Screen ID. |

## 1. Purpose

This document defines the required states — beyond the happy path — for every screen category identified in `03-screen-inventory.md`: Data Pages, Forms, Authentication, File Upload, and Mutations. Every state below is mapped to the Screen ID(s) it applies to so no screen ships with only a "loaded, everything works" design.

## 2. Data Page States

Applies to every listing/detail screen that loads server data: `PUB-002`, `PUB-003`, `PUB-004`–`PUB-010`, `DASH-001`, `LEAD-001`, `LEAD-002`, `APP-001`, `APP-002`, `CASE-001`, `CASE-002`, `LAW-001`, `LAW-002`, `USER-001`, `USER-002`, `CMS-001`–`CMS-006`, `AUDIT-001`, `AUDIT-002`.

| State | Description | Screen ID applicability | Notes |
|---|---|---|---|
| Initial | Route entered, request not yet dispatched. | All listed | Renders skeleton/placeholder layout, not a blank white screen. |
| Loading | Request in flight. | All listed | Skeleton rows for lists (`LEAD-001`, `CASE-001`, `USER-001`, `AUDIT-001`, `CMS-*` lists); skeleton blocks for detail pages (`LEAD-002`, `CASE-002`). Public pages use skeleton/shimmer, not spinners, to avoid layout shift (`NFR-PERF-001`). |
| Loaded | Data returned successfully. | All listed | Baseline state shown in `04-wireframes.md`. |
| Empty | Query succeeded but returned zero records (e.g., no Leads exist at all). | `LEAD-001`, `APP-001`, `CASE-001`, `USER-001`, `CMS-001`/`003`/`005`, `AUDIT-001`, `PUB-002`, `PUB-007`, `PUB-009` | Uses `EmptyState` component with a call to action where relevant (e.g., "New Lead" on `LEAD-001`; nothing actionable on public listings). |
| Error | Request failed (network/server). | All listed | `Alert` with a retry action; never a raw stack trace or technical error string (`NFR-ERR-001`). |
| Filtered | A filter/search is applied and returns ≥1 result. | `LEAD-001`, `APP-001`, `CASE-001`, `USER-001`, `CMS-001`/`003`/`005`, `AUDIT-001` | Active filter chips shown with a "clear filters" affordance. |
| No Search Results | A filter/search is applied and returns zero results. | Same as Filtered | Distinct from Empty — copy reads "No results match your filters" with a "clear filters" action, not "no Leads exist." |
| Pagination | Result set spans multiple pages. | `LEAD-001`, `APP-001`, `CASE-001`, `USER-001`, `CMS-001`/`003`/`005`, `AUDIT-001`, `PUB-009` | Page controls disabled at first/last page; current page indicated. |
| Permission Denied | Actor lacks record-scope or role permission for the requested record. | `LEAD-002`, `CASE-002`, `USER-001`/`002`, `LAW-001`/`002`, `AUDIT-001`/`002`, `CMS-*` | Redirects to `AUTH-005` (Unauthorized) rather than rendering a partially populated page; never discloses that the record exists if the actor has no scope to know that (`NFR-PRIV-001`). |

## 3. Form States

Applies to every screen with a submittable form: `PUB-012`, `AUTH-001`, `AUTH-002`–`AUTH-004` (PROPOSED), `LEAD-002` (inline note/status/assign forms), `APP-002`, `CASE-002` (inline activity form), `LAW-002`, `USER-002`, `CMS-002`/`004`/`006`.

| State | Description | Screen ID applicability | Notes |
|---|---|---|---|
| Idle | Form rendered, no user interaction yet. | All listed | Fields show placeholders/labels only; submit enabled or disabled per required-field completeness. |
| Editing | User has focused/typed in at least one field. | All listed | Field-level validation may run on blur; submit button state updates live. |
| Validation Error | Client-side validation fails on blur or submit attempt. | All listed | Inline error text under the offending field(s); focus moves to the first invalid field on submit attempt. |
| Submitting | Form submitted, awaiting server response. | All listed | Submit button shows a loading indicator and is disabled to prevent double-submit. |
| Server Error | Server rejects the submission (validation, conflict, authorization, or unexpected failure). | All listed | Page/modal-level `Alert` above the form; field values are preserved, never cleared. |
| Success | Server confirms the submission. | All listed | `PUB-012`: acknowledgement state replaces the form (see §4). Internal forms: success `Toast` + navigation back to the parent list/detail, or in-place confirmation for inline forms (notes, activities). |

### 3.1 Special case — `PUB-012` Consultation Form

| Sub-state | Description |
|---|---|
| Anti-abuse Failed | reCAPTCHA v3 (or equivalent) verification fails; treated as a Server Error variant — generic failure message, no Lead is created, no indication given that anti-abuse (rather than validation) was the cause, to avoid coaching automated abuse. |
| Duplicate (if approved) | Not modeled — duplicate-Lead handling is `OQ-06`; until resolved, every valid, anti-abuse-passed submission is treated as Success. |

## 4. Authentication States

Applies to `AUTH-001` and, if implemented, `AUTH-002`–`AUTH-004` (PROPOSED); also governs session behavior across every internal screen.

| State | Description | Screen ID applicability | Notes |
|---|---|---|---|
| Idle | Login form rendered, no submission yet. | `AUTH-001` | |
| Submitting | Credentials submitted, awaiting verification. | `AUTH-001` | Submit button disabled with loading indicator. |
| Invalid Credentials | Username/password do not match. | `AUTH-001` | Generic message ("Invalid email or password") — must not reveal which field was wrong (`AC-AUTH-001` Scenario 1.2). |
| Locked / Disabled | Account is deactivated. | `AUTH-001` | Distinct message ("This account is disabled") per `AC-AUTH-001` Scenario 1.3; exact lockout-after-N-attempts behavior is `TBD` (`OQ-23`). |
| Unauthorized | Authenticated but insufficient role/record permission for a requested internal page/action. | Any internal screen (surfaces as `AUTH-005`) | Distinct from Invalid Credentials — the session is valid, only the specific action/page is denied. |
| Session Expired | A previously valid session's token has expired and refresh fails. | Any internal screen | User is redirected to `AUTH-001` with a "your session expired, please log in again" message; unsaved form state is not silently discarded — an in-progress form should warn before redirecting where feasible. |

## 5. File Upload States

Applies to the Documents panel embedded in `LEAD-002` and `CASE-002`, and to portrait/media upload in `LAW-002` and `CMS-002`/`004`/`006`.

| State | Description | Screen ID applicability | Notes |
|---|---|---|---|
| Idle | No file selected. | `LEAD-002`, `CASE-002`, `LAW-002`, `CMS-002`/`004`/`006` | Upload control shows drop-zone/"choose file" affordance. |
| Selected | File chosen, not yet uploaded. | Same | Filename/size shown with a "remove" affordance before committing. |
| Uploading | Upload in progress. | Same | Progress indicator; cancel affordance where feasible. |
| Success | Upload completed and the file is privately stored. | Same | New `DocumentItem` appears in the list (documents) or preview updates (portrait/media). |
| Invalid Type | Selected file is not PDF/DOCX/JPG/PNG (documents) or not an accepted image type (portrait/media). | Same | Inline error before any network call is made, per `AC-DOC-001` Scenario 20.3. |
| File Too Large | File exceeds 20 MB (documents). | `LEAD-002`, `CASE-002` | Inline error ("File size exceeds 20MB limit") per `AC-DOC-001` Scenario 20.2, checked client-side before upload where possible. |
| Network Error | Upload fails mid-transfer or the request times out. | Same | Retry affordance; no partial/corrupt file is represented as successfully stored. |
| Permission Denied | Actor lacks authorization to upload/associate the file with this Case/Lead. | `LEAD-002`, `CASE-002` | Upload control disabled or hidden per role/record scope rather than allowed to fail late. |

## 6. Mutation States

Applies to any state-changing action that is not a full form submission: Lead status change, Lead assignment, Lead-to-Case conversion, Appointment status change, Case lawyer assignment, User activate/deactivate, CMS publish/unpublish.

| State | Description | Screen ID applicability | Notes |
|---|---|---|---|
| Confirmation | A destructive or high-consequence action prompts explicit confirmation before executing. | `LEAD-002` (Convert to Case, per `AC-CASE-001`), `APP-002` (Cancel), `USER-001` (Deactivate, per `AC-USER-003`), `CMS-002`/`004`/`006` (Publish/Unpublish), `CASE-002` (reassign/remove lawyer) | Uses `ConfirmationDialog`; states the consequence in plain language (e.g., "This will create a new Case and cannot be undone"). |
| Pending | Action confirmed, awaiting server response. | Same set | Dialog/control shows a loading indicator; underlying record is not optimistically changed until success, given `NFR-REL-001`'s no-false-success requirement. |
| Success | Server confirms the mutation. | Same set | `Toast`/inline confirmation; dependent UI updates (e.g., status badge, Lead list row) reflect the new state immediately. |
| Failure | Server rejects or fails to complete the mutation. | Same set | Dialog remains open (or reopens) with an inline error; the prior state is visibly unchanged, consistent with `NFR-REL-001` (no partial Lead-to-Case outcomes). |

### 6.1 Special case — Lead-to-Case Conversion (`LEAD-002` → `CASE-002`)

| Sub-state | Description |
|---|---|
| Blocked (Not Qualified) | "Convert to Case" is disabled with a tooltip when Lead status ≠ `QUALIFIED`, per `AC-CASE-001` Scenario 17.2 — this is a distinct state from Confirmation/Pending/Success/Failure and is the default state for any non-`QUALIFIED` Lead. |
| Success | Case created, Lead atomically set to `CONVERTED`; user is navigated to the new `CASE-002`. |
| Failure | No Case is represented as created and the Lead remains `QUALIFIED` — the UI must never show a "converting…" state that resolves into an inconsistent status badge. |

## 7. State Coverage Summary

| Screen ID | Data Page states | Form states | Auth states | Upload states | Mutation states |
|---|---|---|---|---|---|
| `PUB-002`, `PUB-004`–`PUB-010` | ✓ | — | — | — | — |
| `PUB-003` | ✓ | — | — | — | — |
| `PUB-012` | — | ✓ (+ anti-abuse) | — | — | — |
| `AUTH-001` | — | ✓ | ✓ | — | — |
| `AUTH-002`–`004` (PROPOSED) | — | ✓ | ✓ | — | — |
| `DASH-001` | ✓ | — | — | — | — |
| `LEAD-001` | ✓ | — | — | — | — |
| `LEAD-002` | ✓ | ✓ | ✓ (Unauthorized) | ✓ | ✓ (+ conversion sub-states) |
| `APP-001` | ✓ | — | — | — | — |
| `APP-002` | ✓ | ✓ | — | — | ✓ |
| `CASE-001` | ✓ | — | — | — | — |
| `CASE-002` | ✓ | ✓ | ✓ (Unauthorized) | ✓ | ✓ |
| `LAW-001` | ✓ | — | — | — | — |
| `LAW-002` | ✓ | ✓ | — | ✓ | — |
| `USER-001` | ✓ | — | — | — | ✓ (activate/deactivate) |
| `USER-002` | ✓ | ✓ | — | — | — |
| `CMS-001`/`003`/`005` | ✓ | — | — | — | — |
| `CMS-002`/`004`/`006` | ✓ | ✓ | — | ✓ | ✓ (publish) |
| `AUDIT-001`/`002` | ✓ | — | — | — | — |
| `NOTI-001` | ✓ (loading/empty/error only) | — | — | — | — |

## 8. Validation Record

- Every state category from the master template (Data Pages, Forms, Authentication, File Upload, Mutations) is defined and mapped to at least one Screen ID.
- Empty vs. No Search Results is explicitly distinguished for every filterable list, preventing a common UX defect.
- No state invents business behavior beyond Phase 1: duplicate-Lead handling, account lockout thresholds, and Case status transitions are explicitly marked as deferred to their governing `OQ-*`.
- `NFR-REL-001` (no false-success, no partial Lead-to-Case outcomes) is directly reflected in the Mutation and Conversion states.
- `NFR-ERR-001` (no stack traces/technical detail in errors) is directly reflected in every Error/Server Error state.

**Validation status:** Passed 2026-08-12.
