# Phase 2 Assumptions and Open Questions

## Document Control

| Field | Value |
|---|---|
| Project | Law Firm Website & Management System |
| Register version | 1.0 |
| Status | Active |
| Last updated | 2026-08-12 |
| Business authority | [../01-brd.md](../01-brd.md) |
| Phase 1 register | [../assumptions-open-questions.md](../assumptions-open-questions.md) |

This register records unresolved UI/UX and frontend-planning decisions discovered while producing Phase 2 artifacts. It does not resolve them silently; each affected Phase 2 artifact marks the affected content `PROPOSED` or `TBD` and cites the relevant ID here. Many `UI-OQ` items are the UI-facing consequence of an already-open Phase 1 `OQ-*`; those are cross-referenced rather than duplicated as new business decisions.

## 1. Open Questions

| ID | Priority | Question / decision required | Affects | Related Phase 1 OQ | Required before |
|---|---|---|---|---|---|
| `UI-OQ-001` | High | What is the final approved brand color palette (exact HEX values for Navy, Charcoal, White, and the Gold/Bordeaux accent)? | `06-design-system.md`, `09-high-fidelity-ui-spec.md` | — (BRD §10.1 sets direction only) | High-fidelity visual design and frontend theming |
| `UI-OQ-002` | Medium | Is an approved firm logo available, and in what formats (SVG preferred)? | `06-design-system.md`, `07-component-inventory.md` (Header/Footer) | — | High-fidelity UI spec |
| `UI-OQ-003` | Medium | Will real lawyer/office photography be supplied, or should imagery direction assume professional stock photography? | `09-high-fidelity-ui-spec.md`, `LawyerCard`/`Hero` components | — | High-fidelity UI spec |
| `UI-OQ-004` | Low | Is a firm-wide, cross-case Document Library screen wanted, or does Document management remain embedded only within Case Detail and Lead Detail (current Phase 2 assumption, consistent with FRS "Related UI" scoping)? | `01-information-architecture.md` §5.1, `03-screen-inventory.md` | — | Screen inventory finalization |
| `UI-OQ-005` | Medium | Which languages/localization rules apply to the public website and internal workspace (Vietnamese only, English only, or bilingual)? | All content-bearing screens; `08-responsive-strategy.md` | `OQ-25` | High-fidelity UI spec and content authoring |
| `UI-OQ-006` | Medium | Are the mobile/tablet/desktop reference widths (375/768/1440px) approved as binding CSS breakpoints, or design references only? | `08-responsive-strategy.md` | `OQ-28` | Frontend implementation (Phase 3+) |
| `UI-OQ-007` | Medium | What is the final approved urgent-consultation CTA wording (English and/or Vietnamese)? | `PUB-001` Home wireframe, `10-prototype-flows.md` | `OQ-18` | High-fidelity UI spec |
| `UI-OQ-008` | High | What is the exact public consultation form field set, validation rules, and consent/privacy-notice presentation? | `04-wireframes.md` (`PUB-012`), `05-wireframe-states.md` | `OQ-20`, `OQ-12` | Wireframe finalization for the consultation form |
| `UI-OQ-009` | Medium | Which dashboard widgets/metrics are visible to which role (`LAWYER`, `LEGAL_ASSISTANT`, `CONTENT_CREATOR`) beyond the confirmed `SUPER_ADMIN` full view? | `03-screen-inventory.md` (`DASH-001`), `09-high-fidelity-ui-spec.md` | `OQ-22`, `OQ-04` | High-fidelity Dashboard spec |
| `UI-OQ-010` | Medium | What draft/review/publish/unpublish/archive states and role ownership apply to CMS content (Services, Blog, Case Studies), and how should each state render in the editor UI? | `05-wireframe-states.md` (CMS screens), `07-component-inventory.md` | `OQ-21`, `OQ-14` | CMS wireframe-state finalization |
| `UI-OQ-011` | Medium | Is password/credential recovery (Forgot Password → Verification Code → Reset Password) in scope for MVP, and if so, what is the verification mechanism (email link, OTP, other)? | `01-information-architecture.md` §4 (`AUTH-002`–`AUTH-004`), `02-user-flows.md`, `05-wireframe-states.md` | `OQ-23` | Authentication flow finalization |
| `UI-OQ-012` | High | What accessibility conformance standard and level (e.g., WCAG 2.1 AA) must the public and internal interfaces meet? | `06-design-system.md` §Accessibility, `11-ui-traceability.md` | `OQ-27` | Final accessibility validation |
| `UI-OQ-013` | Low | Should the Appointments screen offer a calendar/timeline view in addition to a list, or is a list sufficient for MVP? | `03-screen-inventory.md` (`APP-001`), `04-wireframes.md` | `OQ-16` | Appointment wireframe finalization |
| `UI-OQ-014` | Medium | Which roles receive the real-time new-Lead notification, and should the Notification Center retain read/unread history or show only a live toast? | `07-component-inventory.md` (`NotificationItem`), `05-wireframe-states.md` | `OQ-09`, `OQ-04` | Notification Center UI finalization |
| `UI-OQ-015` | High | What is the final Case status set (beyond the confirmed Lead-to-Case conversion event), and what status badges/transitions should `CASE-002` display? | `03-screen-inventory.md` (`CASE-002`), `05-wireframe-states.md`, `07-component-inventory.md` (`CaseSummary`) | `OQ-03` | Case Detail wireframe and state finalization |

## 2. Decision Recording Procedure

When an answer is approved:

1. record the decision, decision date, and approving authority against the question;
2. update every affected Phase 2 artifact (and the linked Phase 1 document if the decision also resolves the cross-referenced `OQ-*`);
3. update `11-ui-traceability.md` to remove the item from the unresolved list; and
4. retain the question ID so historical references remain stable.

## 3. Non-Issues (Resolved by Phase 1 Baseline)

These are not open UI questions because Phase 1 already resolves them:

- Public navigation set (BRD §10) — fixed; no additional top-level public page may be added without a BRD change.
- Confirmed roles (`SUPER_ADMIN`, `LAWYER`, `LEGAL_ASSISTANT`, `CONTENT_CREATOR`) and Guest — fixed; no additional role may be introduced in UI artifacts.
- Lead sources, Lead statuses, Appointment statuses/types, supported document types/size — fixed controlled values; UI components must use these exact values and no others.
