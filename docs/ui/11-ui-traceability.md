# UI Traceability

## Document Control

| Field | Value |
|---|---|
| Project | Law Firm Website & Management System |
| Document | UI Traceability |
| Document ID | `UI-TRACE-11` |
| Version | 1.0 |
| Status | Draft — Phase 2 baseline |
| Effective date | 2026-08-12 |
| Upstream | All of `01`–`10` in `docs/ui/`; `01`–`06` in `docs/` |
| Decision register | [assumptions-open-questions.md](assumptions-open-questions.md) |

## Record of Changes

| Date | Change type | In charge | Description |
|---|---|---|---|
| 2026-08-12 | Added | Phase 2 Agent | Built the full BRD→FR→UC→US→AC→Flow→Screen→Wireframe→State→Component trace and ran the orphan/gap analysis. |

## 1. Purpose

This document traces every functional requirement down to the UI artifact that realizes it, and traces every UI artifact back up to a business justification. It identifies gaps rather than silently resolving them.

## 2. Traceability Matrix

| FR | UC | US | AC | User Flow (§ in `02-user-flows.md`) | Screen(s) | Wireframe archetype (`04-wireframes.md`) | Component(s) |
|---|---|---|---|---|---|---|---|
| `FR-AUTH-001` | `UC-AUTH-001` | `US-AUTH-001` | `AC-AUTH-001` | §4 Authentication | `AUTH-001` | Auth form | `CMP-FRM-001`, `CMP-FND-001`, `CMP-FDB-001` |
| `FR-AUTH-002` | `UC-AUTH-003` | `US-AUTH-003` | `AC-AUTH-003` | §4 Authentication | Internal account menu (`CMP-NAV-004`) | — (menu action, no dedicated screen) | `CMP-NAV-004` |
| `FR-AUTH-003` | `UC-AUTH-002` | `US-AUTH-002` | `AC-AUTH-002` | §4 Authentication | Background session behavior; `AUTH-001` on failure | — (non-visual until failure) | — |
| `FR-AUTH-004` | `UC-AUTH-004` | `US-AUTH-004` | `AC-AUTH-004` | §4 Authentication | `AUTH-005`, all internal screens (cross-cutting) | Auth form (denial variant) | `CMP-FDB-001` |
| `FR-USER-001` | `UC-USER-001`, `UC-USER-002` | `US-USER-001`, `US-USER-002` | `AC-USER-001`, `AC-USER-002` | (not separately diagrammed — internal CRUD) | `USER-001`, `USER-002` | Internal list / Internal form | `CMP-FRM-001`–`003`, `CMP-FDB-006` |
| `FR-USER-002` | `UC-USER-003` | `US-USER-003` | `AC-USER-003` | (not separately diagrammed) | `USER-001` | Internal list (mutation) | `CMP-FDB-006` |
| `FR-USER-003` | `UC-USER-001`, `UC-USER-002` | `US-USER-001`, `US-USER-002` | `AC-USER-001`, `AC-USER-002` | (not separately diagrammed) | `USER-002` | Internal form | `CMP-FRM-003` |
| `FR-LAW-001` | `UC-LAW-001` | `US-LAW-001` | `AC-LAW-001` | (not separately diagrammed) | `LAW-001`, `LAW-002` | Internal list / Internal form | `CMP-FRM-007` (portrait), `CMP-BIZ-001` |
| `FR-LAW-002` | `UC-LAW-001`, `UC-LAW-002`, `UC-WEB-003` | `US-LAW-001`, `US-LAW-002`, `US-WEB-003` | `AC-LAW-001`, `AC-LAW-002`, `AC-WEB-003` | — | `LAW-002`, `PUB-002`, `PUB-003` | Internal form / Public listing / Public detail | `CMP-BIZ-001` |
| `FR-LEAD-001` | `UC-LEAD-001` | `US-LEAD-001` | `AC-LEAD-001` | §2 Public Lead Journey | `PUB-011`, `PUB-012` | Public lead-capture form | `CMP-FRM-001/002/004`, `CMP-FDB-001` |
| `FR-LEAD-002` | `UC-LEAD-005` | `US-LEAD-005` | `AC-LEAD-005` | (internal intake, not separately diagrammed) | `LEAD-001` (New Lead action) | Internal list (create action) | `CMP-FRM-001/003` |
| `FR-LEAD-003` | `UC-LEAD-002`, `UC-LEAD-003` | `US-LEAD-002`, `US-LEAD-003` | `AC-LEAD-002`, `AC-LEAD-003` | §6 Lead Management Journey | `LEAD-001`, `LEAD-002` | Internal list / Internal detail | `CMP-BIZ-004/005`, `CMP-FRM-003` |
| `FR-LEAD-004` | `UC-LEAD-004`, `UC-CASE-001` | `US-LEAD-004`, `US-CASE-001` | `AC-LEAD-004`, `AC-CASE-001` | §6 Lead Management Journey | `LEAD-002` | Internal detail (mutation) | `CMP-BIZ-005`, `CMP-FDB-006` |
| `FR-APP-001` | `UC-APP-001` | `US-APP-001` | `AC-APP-001` | §7 Appointment Journey | `APP-001`, `APP-002` | Internal list / Internal form | `CMP-FRM-003/006` |
| `FR-APP-002` | `UC-APP-001`, `UC-APP-002` | `US-APP-001`, `US-APP-002` | `AC-APP-001`, `AC-APP-002` | §7 Appointment Journey | `APP-001`, `APP-002` | Internal list / Internal form | `CMP-BIZ-006` |
| `FR-CASE-001` | `UC-CASE-001` | `US-CASE-001` | `AC-CASE-001` | §8 Case Journey | `LEAD-002` (trigger), `CASE-002` (result) | Internal detail (mutation) | `CMP-FDB-006` |
| `FR-CASE-002` | `UC-CASE-002`, `UC-CASE-003` | `US-CASE-002`, `US-CASE-003` | `AC-CASE-002`, `AC-CASE-003` | §8 Case Journey | `CASE-001`, `CASE-002` | Internal list / Internal detail | `CMP-BIZ-007`, `CMP-FND-005` |
| `FR-CASE-003` | `UC-CASE-002` | `US-CASE-002` | `AC-CASE-002` | §8 Case Journey | `CASE-002` | Internal detail | `CMP-BIZ-007` |
| `FR-DOC-001` | `UC-DOC-001`, `UC-DOC-003` | `US-DOC-001`, `US-DOC-003` | `AC-DOC-001`, `AC-DOC-003` | §9 Document Journey | `LEAD-002`, `CASE-002` (embedded panel) | Internal detail (upload) | `CMP-FRM-007` |
| `FR-DOC-002` | `UC-DOC-002` | `US-DOC-002` | `AC-DOC-002` | §9 Document Journey | `LEAD-002`, `CASE-002` | Internal detail (download) | `CMP-BIZ-008` |
| `FR-DOC-003` | `UC-DOC-003` | `US-DOC-003` | `AC-DOC-003` | §9 Document Journey | `CASE-002` | Internal detail (lifecycle, `TBD`) | `CMP-BIZ-008` |
| `FR-CMS-001` | `UC-CMS-003`, `UC-WEB-002` | `US-CMS-003`, `US-WEB-002` | `AC-CMS-003`, `AC-WEB-002` | §10 CMS Journey | `CMS-001`, `CMS-002`, `PUB-004`–`PUB-006` | Content editor / Public listing / Public detail | `CMP-BIZ-002`, `CMP-BIZ-012` |
| `FR-CMS-002` | `UC-CMS-001` | `US-CMS-001` | `AC-CMS-001` | §10 CMS Journey | `CMS-003`, `CMS-004`, `PUB-009`, `PUB-010` | Content editor / Public listing / Public detail | `CMP-BIZ-012` |
| `FR-CMS-003` | `UC-CMS-002` | `US-CMS-002` | `AC-CMS-002` | §10 CMS Journey | `CMS-005`, `CMS-006`, `PUB-007`, `PUB-008` | Content editor / Public listing / Public detail | `CMP-BIZ-003`, `CMP-BIZ-012` |
| `FR-SEO-001` | `UC-SEO-001`, `UC-CMS-001`, `UC-CMS-003` | `US-SEO-001` | `AC-SEO-001` | §10 CMS Journey | `SEO-001` (embedded in `CMS-002`/`004`/`006`) | Content editor (SEO tab) | `CMP-BIZ-012` |
| `FR-SEO-002` | `UC-SEO-002` | `US-SEO-002` | `AC-SEO-002` | §10 CMS Journey | `PUB-009`, `PUB-010` (and other public detail pages) | Public detail (metadata only, non-visual) | — |
| `FR-WEB-001` | `UC-WEB-001`, `UC-WEB-002` | `US-WEB-001` | `AC-WEB-001` | §2, §3 | `PUB-001`–`PUB-011` | Public marketing / listing / detail | `CMP-NAV-001/002` |
| `FR-WEB-002` | `UC-LAW-002`, `UC-SEO-002`, `UC-WEB-001`–`003` | `US-WEB-002`, `US-WEB-003`, `US-LAW-002` | `AC-WEB-002`, `AC-WEB-003`, `AC-LAW-002` | §2, §3 | `PUB-002`–`PUB-010` | Public listing / detail | `CMP-BIZ-001/002/003` |
| `FR-WEB-003` | `UC-WEB-001`, `UC-WEB-004` | `US-WEB-004` | `AC-WEB-004` | §3 Contact Journey | All `PUB-*`, `PUB-011` | Public marketing (floating widget) | `CMP-BIZ-011` |
| `FR-WEB-004` | `UC-WEB-002`, `UC-WEB-003` | `US-WEB-001` | `AC-WEB-001` | §2 | `PUB-001` | Public marketing | `CMP-BIZ-001/002/003` |
| `FR-DASH-001` | `UC-DASH-001` | `US-DASH-001` | `AC-DASH-001` | (not separately diagrammed) | `DASH-001` | Internal summary | — (stat tile, not separately catalogued as a business component) |
| `FR-NOTI-001` | `UC-NOTI-001`, `UC-LEAD-001`, `UC-LEAD-005` | `US-NOTI-001` | `AC-NOTI-001` | §2 (trigger), embedded everywhere | `NOTI-001` | Global embedded panel | `CMP-BIZ-009` |
| `FR-AUDIT-001` | `UC-AUDIT-001`, `UC-DOC-003`, `UC-CMS-002` | `US-AUDIT-001` | `AC-AUDIT-001` | (system-assisted, non-visual capture) | `AUDIT-002` (read surface) | Internal read-only detail | `CMP-BIZ-010` |
| `FR-AUDIT-002` | `UC-AUDIT-002` | `US-AUDIT-002` | `AC-AUDIT-002` | (not separately diagrammed) | `AUDIT-001`, `AUDIT-002` | Internal list / read-only detail | `CMP-BIZ-010` |

All 34 FRS requirements are represented above; none are orphaned from a UI artifact.

## 3. Gap Analysis

### 3.1 Requirements with No Screen

**None.** Every `FR-*` maps to at least one screen or an explicitly non-visual capability (`FR-AUTH-002`/`003` are background session behavior; `FR-SEO-002` is metadata-only; `FR-AUDIT-001` is system-assisted capture with no independent input UI, consistent with its FRS "Related UI: No independent input UI" specification).

### 3.2 Screens with No Upstream Requirement

**None.** Every screen in `03-screen-inventory.md` cites at least one `FR-*`. `AUTH-002`–`AUTH-004` are the one exception and are explicitly marked PROPOSED with no `FR-*` citation, by design — they are flagged, not silently included as if traceable.

### 3.3 Actions with No Acceptance Criteria

| Action | Screen | Issue |
|---|---|---|
| "New Lead" internal intake action | `LEAD-001` | Covered by `AC-LEAD-005` at the Use Case level, but no AC scenario exercises the action from the list-screen entry point specifically — same requirement, screen-level scenario not yet written. Not a blocker; recorded for Phase 3 test-case authoring. |
| CMS "Save Draft" (non-publish) | `CMS-002`/`004`/`006` | Acceptance Criteria (`AC-CMS-001`–`003`) test only the publish scenario; no AC scenario exists for saving a non-public draft. Recorded as a coverage gap, not invented here. |
| Case "Add Activity" | `CASE-002` | `AC-CASE-002` Scenario 18.1 covers this at the Use Case level; screen-level empty/validation-error sub-cases are not separately enumerated in Phase 1. Covered structurally by `05-wireframe-states.md` §3 (generic Form states). |
| Notification "mark as read" | `NOTI-001` | No AC exists because the read/unread retention model itself is `UI-OQ-014` (unresolved) — this is expected, not a defect. |

None of these represent a missing screen or a contradicted requirement; they are recorded as coverage notes for the Phase 3 test-planning stage.

### 3.4 States with No Business/Technical Justification

**None identified.** Every state in `05-wireframe-states.md` traces to either an explicit FRS/AC scenario (e.g., Invalid Type/Too Large from `AC-DOC-001`) or a general NFR obligation (`NFR-ERR-001` for Error states, `NFR-REL-001` for Mutation Failure states). No speculative state (e.g., no "Case Approved by Client" state) was introduced.

### 3.5 Duplicate Screens

**None.** `01-information-architecture.md` §5.1 explicitly avoided creating a duplicate/parallel Document Library screen; `04-wireframes.md` §1 explicitly maps structurally identical screens to a single archetype rather than duplicating specification content.

### 3.6 Permission Mismatches

| Item | Finding |
|---|---|
| `DASH-001` visibility for non-`SUPER_ADMIN` roles | Screen Inventory marks this `TBD` (`OQ-04`, `OQ-22`) rather than assuming all four roles see the same dashboard — consistent with FRS, which confirms only `SUPER_ADMIN` dashboard access. No mismatch; correctly flagged as unresolved rather than guessed. |
| `LAW-001`/`LAW-002` actor | FRS states "authorized internal user" without naming a specific role (`OQ-04`/`OQ-21`); the IA and Screen Inventory both carry this forward as `TBD` rather than assigning a specific role. No mismatch. |
| `CASE-002` edit authority for `SUPER_ADMIN` | FRS confirms `SUPER_ADMIN` view access but leaves edit authority open; Screen Inventory states this distinction explicitly (view confirmed, edit `TBD`) rather than collapsing it into a single "Permitted" statement. No mismatch. |
| Public vs. internal Document access | Verified consistent: no public screen ever lists or links a private Document; all Document UI is confined to `LEAD-002`/`CASE-002` behind record-scope checks, matching `SEC-04`/`NFR-FILE-001`. |

No unresolved permission contradiction was found between the BRD/FRS actor boundaries and any Phase 2 artifact.

## 4. Coverage Statistics

| Metric | Count |
|---|---:|
| Total FRS requirements (`FR-*`) | 34 |
| FRS requirements with a UI artifact | 34 (100%) |
| Total screens | 38 |
| Screens with upstream FR/UC/US/AC traceability | 34 confirmed + 4 PROPOSED (no traceability by design) |
| Total user flows | 9 (§2–§10 of `02-user-flows.md`) |
| Total wireframe archetypes | 12 |
| Total wireframe states defined | 5 categories, 30+ discrete states across `05-wireframe-states.md` |
| Total reusable components | 38 |
| Total prototypes | 6 |
| Open `UI-OQ-*` items affecting UI scope | 15 |

## 5. Validation Record

- Every `FR-*` from `02-frs.md` appears in the matrix (§2); count matches the FRS's own inventory of 34.
- No orphan screens, no orphan requirements, no duplicate screens, no unjustified states, and no unresolved permission contradiction were found (§3).
- All discovered coverage gaps (§3.3) are recorded as forward notes for Phase 3 test planning, not silently resolved or ignored.
- Terminology (roles, statuses, sources) is consistent with `01-brd.md` §9 throughout every artifact referenced.

**Validation status:** Passed 2026-08-12.
