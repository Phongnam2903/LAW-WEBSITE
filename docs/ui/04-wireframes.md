# Low-Fidelity Wireframes

## Document Control

| Field | Value |
|---|---|
| Project | Law Firm Website & Management System |
| Document | Low-Fidelity Wireframes |
| Document ID | `UI-WF-04` |
| Version | 1.0 |
| Status | Draft — Phase 2 baseline |
| Effective date | 2026-08-12 |
| Upstream | [03-screen-inventory.md](03-screen-inventory.md) |
| Decision register | [assumptions-open-questions.md](assumptions-open-questions.md) |

## Record of Changes

| Date | Change type | In charge | Description |
|---|---|---|---|
| 2026-08-12 | Added | Phase 2 Agent | Created low-fidelity ASCII/Markdown wireframes for one representative screen per structural archetype, plus every business-critical screen. |

## 1. Approach

Graphical wireframing tools are not available in this environment, so every wireframe is expressed as an ASCII layout diagram plus a structured specification (layout regions, content hierarchy, components, actions, navigation, required data, validation/error/empty-state placement, mobile considerations, upstream references). Wireframes deliberately omit final colors, imagery, and decorative styling — those belong to `09-high-fidelity-ui-spec.md`.

Rather than drawing all 38 screens (many of which are structurally identical), this document wireframes one representative screen per **structural archetype** in full, then maps every remaining screen to the archetype it reuses. This follows the instruction to prefer one screen with meaningful states over duplicate screens.

| Archetype | Wireframed exemplar | Other screens reusing this archetype |
|---|---|---|
| Public marketing/landing page | `PUB-001` Home | `PUB-004`/`PUB-005` (segment intro + card grid variant) |
| Public listing page | `PUB-002` Lawyers | `PUB-007` Case Studies, `PUB-009` Legal Insights |
| Public detail page | `PUB-006` Service Detail | `PUB-003` Lawyer Detail, `PUB-008` Case Study Detail, `PUB-010` Blog Detail |
| Public lead-capture form | `PUB-012` Consultation Form | — (single instance, embedded/CTA-surfaced) |
| Auth form | `AUTH-001` Login | `AUTH-002`–`AUTH-004` (PROPOSED) |
| Internal record list | `LEAD-001` Leads | `APP-001`, `CASE-001`, `LAW-001`, `USER-001`, `CMS-001`/`CMS-003`/`CMS-005`, `AUDIT-001` |
| Internal record detail (workspace) | `LEAD-002` Lead Detail | `CASE-002` Case Detail (wireframed separately due to added Documents/Activity complexity) |
| Internal record form/editor | `USER-002` User Editor | `LAW-002`, `APP-002` |
| Internal content editor with panel/tabs | `CMS-002` Service Content Editor (incl. `SEO-001`) | `CMS-004`, `CMS-006` |
| Internal read-only detail | `AUDIT-002` Audit Event Detail | — |
| Internal summary/aggregation | `DASH-001` Dashboard | — |
| Global embedded panel | `NOTI-001` Notification Center | — |

## 2. `PUB-001` — Home (Public Marketing/Landing Archetype)

```
┌─────────────────────────────────────────────────────────┐
│ [Logo]   Home  Lawyers  Services ▾  Case Studies  Insights  Contact   [Consult ▸]│
├─────────────────────────────────────────────────────────┤
│                      HERO REGION                        │
│   Headline (litigation-focused, OQ-18 pending)           │
│   Subtext                                                │
│   [ Primary CTA: Get Urgent Case Assessment ]            │
│   (authentic firm/team image — right or background)      │
├─────────────────────────────────────────────────────────┤
│  PRACTICE AREAS                                          │
│  [Card] [Card] [Card] [Card]   (Criminal / Civil / ...)  │
├─────────────────────────────────────────────────────────┤
│  OUR ADVOCATES                                           │
│  [Portrait+Name] [Portrait+Name] [Portrait+Name]  [See all →]│
├─────────────────────────────────────────────────────────┤
│  LITIGATION PROCESS                                      │
│  (1) Case Assessment → (2) Legal Strategy →              │
│  (3) Negotiation/Pre-litigation → (4) Court Litigation   │
├─────────────────────────────────────────────────────────┤
│  CASE STUDY HIGHLIGHTS                                   │
│  [Card] [Card] [Card]                          [See all →]│
├─────────────────────────────────────────────────────────┤
│ FOOTER: firm info · nav · Zalo/Messenger/hotline · legal │
└─────────────────────────────────────────────────────────┘
                                       [●Zalo][●FB][●Call]  ← floating widget, fixed bottom-right
```

- **Layout regions**: Global header/nav, Hero, Practice Areas, Our Advocates, Litigation Process, Case Study Highlights, Footer, persistent floating contact widget.
- **Content hierarchy**: Hero CTA is the single highest-priority action on the page; section order follows the BRD narrative (authority → services → people → process → proof).
- **Components**: `Header`, `Button` (primary CTA), `ServiceCard`, `LawyerCard`, process step indicator, `CaseStudyCard`, `FloatingContactWidget`, `Footer`.
- **Actions**: Primary — open Consultation form. Secondary — navigate to any section's "see all."
- **Navigation**: Global header present on all public pages; floating widget persists on scroll.
- **Required data**: Hero content, featured Services, published Lawyers subset, 4 process steps, featured Case Studies — all sourced from CMS-managed content.
- **Validation placement**: N/A (no form on this screen besides the CTA trigger).
- **Error placement**: If a content section has no eligible data, the section is omitted rather than shown empty (see `05-wireframe-states.md`).
- **Empty-state placement**: Section-level omission, not a page-level empty state.
- **Mobile considerations**: Header collapses to a hamburger menu; Hero CTA remains above the fold; floating widget shrinks to icon-only and must never cover the CTA or footer contact info (`NFR-A11Y-001`, `NFR-RWD-001`).
- **Upstream**: `FR-WEB-004`, `FR-WEB-001`, `WEB-01`–`WEB-04`, `UC-WEB-001`–`UC-WEB-003`.

## 3. `PUB-002` — Lawyers (Public Listing Archetype)

```
┌─────────────────────────────────────────────────────────┐
│ [Header/Nav — same as PUB-001]                           │
├─────────────────────────────────────────────────────────┤
│  Page title: "Our Advocates"                              │
│  Intro paragraph                                          │
├─────────────────────────────────────────────────────────┤
│  [LawyerCard]  [LawyerCard]  [LawyerCard]                 │
│  [LawyerCard]  [LawyerCard]  [LawyerCard]                 │
│  (grid, 3-col desktop / 1-col mobile)                     │
├─────────────────────────────────────────────────────────┤
│  [Footer]                                                  │
└─────────────────────────────────────────────────────────┘
```

- **Layout regions**: Header/nav, page intro, card grid, Footer.
- **Content hierarchy**: Grid is the primary content; no filter/sort is confirmed as required (kept minimal per FRS).
- **Components**: `Header`, `LawyerCard` (portrait, name, title, specialization tag), `EmptyState`, `Footer`.
- **Actions**: Primary — select a card to open `PUB-003`.
- **Navigation**: Breadcrumb optional; back to Home via header logo.
- **Required data**: All publicly eligible Lawyer Profiles.
- **Validation placement**: N/A.
- **Error placement**: N/A (read-only page); a failed content fetch shows a page-level error state (see `05-wireframe-states.md`).
- **Empty-state placement**: Full-width `EmptyState` in place of the grid if zero profiles are published.
- **Mobile considerations**: Grid collapses to a single column; cards remain tap-target sized (≥44px).
- **Upstream**: `FR-WEB-002`, `FR-WEB-004`, `UC-WEB-003`, `US-WEB-003`, `AC-WEB-003`.

## 4. `PUB-006` — Service Detail (Public Detail Archetype)

```
┌─────────────────────────────────────────────────────────┐
│ [Header/Nav]                                              │
├─────────────────────────────────────────────────────────┤
│ Breadcrumb: Home / Services / {Service Name}              │
│ H1: Service Title                                          │
│ Body: full description                                     │
├─────────────────────────────────────────────────────────┤
│ LITIGATION PROCESS (if applicable to this service)         │
│ (1)→(2)→(3)→(4)                                             │
├─────────────────────────────────────────────────────────┤
│ RELATED CASE STUDIES        RELATED LAWYERS                │
│ [Card][Card]                [LawyerCard][LawyerCard]       │
├─────────────────────────────────────────────────────────┤
│ [ CTA band: Get a Case Assessment ]                        │
├─────────────────────────────────────────────────────────┤
│ [Footer]                                                    │
└─────────────────────────────────────────────────────────┘
```

- **Layout regions**: Header/nav, breadcrumb + title/body, process explainer, two related-content columns (stack on mobile), CTA band, Footer.
- **Content hierarchy**: Description first, process second, related-content and CTA reinforce conversion.
- **Components**: `Header`, breadcrumb, process indicator, `CaseStudyCard`, `LawyerCard`, CTA `Button`, `Footer`.
- **Actions**: Primary — open Consultation form via CTA band. Secondary — visit related Case Study/Lawyer.
- **Navigation**: Breadcrumb back to the parent Services listing.
- **Required data**: One published Service item; zero or more related Case Studies/Lawyers.
- **Validation placement**: N/A.
- **Error placement**: Unpublished/unknown slug → standard public 404, no internal information disclosed.
- **Empty-state placement**: Related-content columns omitted individually if empty.
- **Mobile considerations**: Two related-content columns stack vertically; CTA band remains full-width and easily tappable.
- **Upstream**: `FR-WEB-002`, `FR-WEB-004`, `FR-CMS-001`, `UC-WEB-002`, `US-WEB-002`, `AC-WEB-002`.

## 5. `PUB-012` — Consultation / Emergency Lead Form (Public Lead-capture Archetype)

```
┌─────────────────────────────────────────────────────────┐
│ Form title: "Request a Confidential Case Assessment"       │
├─────────────────────────────────────────────────────────┤
│ Full Name*        [_______________________]               │
│ Phone*            [_______________________]               │
│ Email              [_______________________]               │
│ Legal Issue*       [ multiline text area          ]        │
│                     [                             ]        │
│ ( ) Consent/privacy-notice checkbox* — text TBD OQ-12       │
│ [reCAPTCHA v3 badge — invisible, footer notice]             │
│                                                              │
│              [        Submit Request        ]               │
└─────────────────────────────────────────────────────────┘
```

- **Layout regions**: Single-column form, embedded in `PUB-011` (Contact) and reachable as a modal/CTA target from `PUB-001`/`PUB-006`/floating widget.
- **Content hierarchy**: Required-field asterisks first-class; consent checkbox is a hard gate, not decorative; submit button is the sole primary action.
- **Components**: `Input`, `Textarea`, `Checkbox` (consent), reCAPTCHA control, `Button`, `Alert`/`ValidationMessage`.
- **Actions**: Primary — submit. Secondary (if modal) — dismiss/close.
- **Navigation**: If reached via modal, closing returns to the originating page without loss of scroll position.
- **Required data**: Name, phone, (optional) email, issue description, consent — exact set is `UI-OQ-008`/`OQ-20`.
- **Validation placement**: Inline, below each field, on blur and on submit attempt; consent checkbox shows an inline error if unchecked at submit.
- **Error placement**: Page/modal-level `Alert` above the form for server-side/anti-abuse failures; field-level errors stay inline.
- **Empty-state placement**: N/A (form always renders with empty inputs on first load).
- **Mobile considerations**: Full-width fields, large tap targets, sticky submit button on small viewports so it is reachable without excessive scrolling; must not be obstructed by the floating contact widget.
- **Upstream**: `FR-LEAD-001`, `FR-NOTI-001`, `UC-LEAD-001`, `US-LEAD-001`, `AC-LEAD-001`.

## 6. `AUTH-001` — Login (Auth Form Archetype)

```
┌───────────────────────────────┐
│           [Logo]               │
│   Sign in to the Workspace     │
├───────────────────────────────┤
│  Email        [____________]   │
│  Password     [____________]   │
│  [ ] Forgot password? (PROPOSED)│
│                                 │
│        [   Log In   ]          │
│  (error banner appears here)   │
└───────────────────────────────┘
```

- **Layout regions**: Centered single card on a neutral background; no global public header/footer (isolated authentication context).
- **Content hierarchy**: Credential fields, then submit; recovery link is secondary and visually subordinate.
- **Components**: `Input` (email), `Input` (password, masked with reveal toggle), `Button`, `Alert`.
- **Actions**: Primary — submit credentials. Secondary — Forgot Password (PROPOSED).
- **Navigation**: Successful login redirects to `DASH-001`.
- **Required data**: Credentials per approved policy (`OQ-23`).
- **Validation placement**: Inline field-level (required, format) before submit; server-rejection banner above the form after submit.
- **Error placement**: Generic `Alert` banner ("Invalid email or password") — must not indicate which field was wrong (`AC-AUTH-001`).
- **Empty-state placement**: N/A.
- **Mobile considerations**: Card becomes full-bleed with safe padding; virtual-keyboard-aware layout (submit button stays reachable).
- **Upstream**: `FR-AUTH-001`, `UC-AUTH-001`, `US-AUTH-001`, `AC-AUTH-001`.

## 7. `DASH-001` — Dashboard (Internal Summary Archetype)

```
┌─────────────────────────────────────────────────────────┐
│ [Sidebar]│ Topbar: [Search] [Notification bell] [Avatar▾] │
│  Dashboard│─────────────────────────────────────────────│
│  Leads    │  Welcome, {name} ({role})                    │
│  Apps     │  ┌────────┐┌────────┐┌────────┐┌────────┐    │
│  Cases    │  │Active  ││Open    ││Upcoming││New Leads│    │
│  Lawyers  │  │Leads   ││Cases   ││Appts   ││Today    │    │
│  Users*   │  │  24    ││  9     ││  5     ││  3      │    │
│  Content  │  └────────┘└────────┘└────────┘└────────┘    │
│  Audit*   │  ─────────────────────────────────────────── │
│           │  Recent Activity                              │
│  * SUPER_ │  • Lead #123 assigned to Lawyer A — 2h ago    │
│    ADMIN  │  • Case #45 status updated — 4h ago           │
│    only   │  ─────────────────────────────────────────── │
│           │  Quick links: [View Leads] [View Cases]       │
└─────────────────────────────────────────────────────────┘
```

- **Layout regions**: Persistent sidebar (role-filtered nav), topbar (search, `NOTI-001` entry, account menu), stat-tile row, recent-activity feed, quick links.
- **Content hierarchy**: Stat tiles first (glanceable KPIs), then activity feed, then navigation shortcuts.
- **Components**: `Sidebar`, `Header` (internal), stat tile, activity list item, `Button` (quick link), `NotificationItem` (bell dropdown).
- **Actions**: Primary — navigate to a module via stat tile or quick link.
- **Navigation**: Sidebar is the primary internal navigation, present on every internal screen.
- **Required data**: Aggregated counts and recent events scoped to the actor's permitted records; exact KPI set is `OQ-22`/`UI-OQ-009`.
- **Validation placement**: N/A.
- **Error placement**: Page-level `Alert` if aggregation fails to load; individual tiles show a retry affordance.
- **Empty-state placement**: Per-tile "—" or "0" with no error; activity feed shows an `EmptyState` if no recent events.
- **Mobile considerations**: Sidebar collapses to a slide-out drawer; stat tiles stack 2-up then 1-up; topbar keeps search/notification/avatar accessible.
- **Upstream**: `FR-DASH-001`, `UC-DASH-001`, `US-DASH-001`, `AC-DASH-001`.

## 8. `LEAD-001` — Leads (Internal Record List Archetype)

```
┌─────────────────────────────────────────────────────────┐
│ [Sidebar] │ Leads                        [+ New Lead]     │
│           │ [Status ▾][Source ▾][Assignee ▾][Search____]  │
│           │ ┌───────────────────────────────────────────┐│
│           │ │Name      Source  Status      Assignee  ...││
│           │ │J. Nguyen WEBSITE [●NEW]       —         >  ││
│           │ │T. Le     ZALO    [●QUALIFIED] Lawyer A  >  ││
│           │ │...                                          ││
│           │ └───────────────────────────────────────────┘│
│           │ [ ‹ Prev  1 2 3  Next › ]                      │
└─────────────────────────────────────────────────────────┘
```

- **Layout regions**: Sidebar, page header with primary action, filter bar, data table, pagination.
- **Content hierarchy**: Filters above the table; `LeadStatusBadge` gives at-a-glance status; row click opens detail.
- **Components**: `Sidebar`, filter `Select`s, `Input` (search), data table, `LeadStatusBadge`, `Pagination`, `Button` ("New Lead").
- **Actions**: Primary — open a row (`LEAD-002`); create new Lead.
- **Navigation**: Row click → `LEAD-002`; "New Lead" → internal intake form (modal or `LEAD-002` in create mode).
- **Required data**: Leads scoped to actor's permission, with source/status/assignee/created-date columns.
- **Validation placement**: N/A on the list itself; the "New Lead" form follows the form-archetype validation pattern.
- **Error placement**: Page-level `Alert` if the list fails to load, with retry.
- **Empty-state placement**: Full-width `EmptyState` inside the table region when zero results match filters, distinguishing "no Leads at all" vs. "no results for this filter" (see `05-wireframe-states.md`).
- **Mobile considerations**: Table collapses to a stacked card list (one Lead per card: name, status badge, source, assignee); filter bar collapses into a single "Filters" sheet trigger.
- **Upstream**: `FR-LEAD-003`, `FR-LEAD-002`, `UC-LEAD-002`, `UC-LEAD-005`, `US-LEAD-002`, `US-LEAD-005`, `AC-LEAD-002`, `AC-LEAD-005`.

**Reused by**: `APP-001`, `CASE-001`, `LAW-001`, `USER-001`, `CMS-001`/`CMS-003`/`CMS-005`, `AUDIT-001` — each substitutes its own columns and status vocabulary (Appointment status/type, Case status, publish state, active/inactive, role) but keeps the same filter-bar + table + pagination + row-click structure.

## 9. `LEAD-002` — Lead Detail (Internal Record Detail Archetype)

```
┌─────────────────────────────────────────────────────────┐
│ [Sidebar] │ ‹ Back to Leads                                │
│           │ J. Nguyen                    [●QUALIFIED]      │
│           │ Source: WEBSITE · Created: 2026-08-10          │
│           │ [Assign ▾] [Change Status ▾] [Convert to Case] │
│           │─────────────────────────────────────────────── │
│           │ Contact: phone, email                          │
│           │ Legal Issue: full description                  │
│           │─────────────────────────────────────────────── │
│           │ Follow-up Notes                [+ Add Note]    │
│           │  • 2026-08-11 — Called, discussed timeline (A) │
│           │─────────────────────────────────────────────── │
│           │ Appointments               [+ Schedule]        │
│           │  • 2026-08-15 10:00 ONLINE [CONFIRMED]          │
│           │─────────────────────────────────────────────── │
│           │ Pre-litigation Documents    [+ Upload]          │
│           │  • intake-form.pdf  2.1MB   [Download]          │
└─────────────────────────────────────────────────────────┘
```

- **Layout regions**: Sidebar, back-navigation, record header (identity + status + primary actions), contact/issue panel, follow-up notes panel, linked-Appointments panel, linked-Documents panel.
- **Content hierarchy**: Status and primary actions in the header are always visible; supporting panels are ordered by workflow frequency (notes → appointments → documents).
- **Components**: `LeadStatusBadge`, `Button` group (Assign/Status/Convert), note list item, `AppointmentCard` (compact), `DocumentItem`, `ConfirmationDialog` (for status change and conversion).
- **Actions**: Primary — change status, assign, convert to Case. Secondary — add note, schedule appointment, upload document.
- **Navigation**: Back link to `LEAD-001`; "Convert to Case" navigates to `CASE-002` on success.
- **Required data**: One Lead's full record, assignable users, linked appointments/documents.
- **Validation placement**: Inline within each panel's inline form (e.g., note textarea requires non-empty content); "Convert to Case" is disabled (not hidden) with an explanatory tooltip when status ≠ `QUALIFIED`.
- **Error placement**: `ConfirmationDialog` surfaces failure inline without closing; panel-level `Alert` for load failures.
- **Empty-state placement**: Each panel (notes/appointments/documents) shows its own compact `EmptyState` line ("No follow-up notes yet").
- **Mobile considerations**: Header actions collapse into an overflow (`⋯`) menu beyond the primary one; panels stack full-width; sticky mini-header keeps status visible while scrolling.
- **Upstream**: `FR-LEAD-003`, `FR-LEAD-004`, `FR-CASE-001`, `UC-LEAD-002`–`UC-LEAD-004`, `UC-CASE-001`, `US-LEAD-002`–`US-LEAD-004`, `US-CASE-001`, `AC-LEAD-002`–`AC-LEAD-004`, `AC-CASE-001`.

## 10. `CASE-002` — Case Detail (Extended Record Detail — Documents + Activity)

```
┌─────────────────────────────────────────────────────────┐
│ [Sidebar] │ ‹ Back to Cases                                │
│           │ Case: Nguyen v. ABC Corp        [Status: TBD]  │
│           │ Opened: 2026-08-05 · From Lead #123             │
│           │ [Add Activity] [Assign Lawyer] [Schedule Appt] │
│           │─────────────────────────────────────────────── │
│           │ Assigned Lawyers: [Lawyer A] [Lawyer B] [+]     │
│           │─────────────────────────────────────────────── │
│           │ Activity Timeline                                │
│           │  • 2026-08-12 — Filed motion (Lawyer A)          │
│           │  • 2026-08-06 — Case opened (System)             │
│           │─────────────────────────────────────────────── │
│           │ Appointments                    [+ Schedule]     │
│           │─────────────────────────────────────────────── │
│           │ Documents                       [+ Upload]       │
│           │  • contract.pdf   1.4MB    [Download]            │
│           │  • evidence.jpg   3.8MB    [Download]            │
└─────────────────────────────────────────────────────────┘
```

- **Layout regions**: Sidebar, back-navigation, record header (title + status placeholder + primary actions), assigned-lawyers panel, activity timeline, appointments panel, documents panel.
- **Content hierarchy**: Status badge is placeholder-only until `OQ-03` resolves the Case status set (`UI-OQ-015`); assignment and activity are the two most frequent workflows and sit highest.
- **Components**: `CaseSummary`, avatar chips for assigned lawyers, activity list item, `AppointmentCard`, `DocumentItem`, file-upload control.
- **Actions**: Primary — add activity, assign lawyer, upload document. Secondary — schedule appointment, download document.
- **Navigation**: Back link to `CASE-001`; link back to originating Lead if present.
- **Required data**: One Case's full record, assignable lawyers, activities, appointments, documents.
- **Validation placement**: Inline in each panel's add form (activity text required; document type/size checked client-side before upload per `FR-DOC-001`).
- **Error placement**: Upload failures show inline under the file picker (unsupported type / over 20MB / server rejection) without navigating away.
- **Empty-state placement**: Each panel shows its own `EmptyState` line.
- **Mobile considerations**: Same stacking/overflow pattern as `LEAD-002`; document list shows filename + size with a compact download icon rather than a full button.
- **Upstream**: `FR-CASE-002`, `FR-CASE-003`, `FR-DOC-001`, `FR-DOC-002`, `UC-CASE-002`, `UC-CASE-003`, `UC-DOC-001`, `UC-DOC-002`, `US-CASE-002`, `US-CASE-003`, `US-DOC-001`, `US-DOC-002`, `AC-CASE-002`, `AC-CASE-003`, `AC-DOC-001`, `AC-DOC-002`.

## 11. `USER-002` — User Editor (Internal Record Form Archetype)

```
┌─────────────────────────────────────────────────────────┐
│ [Sidebar] │ ‹ Back to Users                                │
│           │ New User / Edit User: {name}                   │
│           │─────────────────────────────────────────────── │
│           │ Full Name*     [_______________________]       │
│           │ Email*         [_______________________]       │
│           │ Role*          [ Select: SUPER_ADMIN/LAWYER/…▾] │
│           │ Temp Password* [_______________________]  (new)│
│           │ Active         [●On]                            │
│           │                                                  │
│           │             [ Cancel ]   [ Save User ]           │
└─────────────────────────────────────────────────────────┘
```

- **Layout regions**: Sidebar, back-navigation, form title, single-column field stack, action row.
- **Content hierarchy**: Identity fields first, then access-control fields (role), then state (active toggle).
- **Components**: `Input`, `Select` (role — 4 controlled roles only), `Checkbox`/toggle (active), `Button` (Cancel/Save).
- **Actions**: Primary — Save. Secondary — Cancel (discard, return to `USER-001`).
- **Navigation**: Save success returns to `USER-001` with a success toast; Cancel returns without saving.
- **Required data**: Name, email, role, (create only) temporary password, active state.
- **Validation placement**: Inline per-field (required, email format, duplicate-email rejection per `AC-USER-001` Scenario 5.2).
- **Error placement**: Field-level inline errors; a page-level `Alert` for server/authorization failures.
- **Empty-state placement**: N/A (form always renders).
- **Mobile considerations**: Single-column field stack already mobile-friendly; action row becomes a sticky footer bar.
- **Upstream**: `FR-USER-001`, `FR-USER-003`, `UC-USER-001`, `UC-USER-002`, `US-USER-001`, `US-USER-002`, `AC-USER-001`, `AC-USER-002`.

**Reused by**: `LAW-002` (Lawyer Editor — swaps identity/role fields for biography/experience/portrait/visibility), `APP-002` (Appointment form mode — swaps identity fields for type/schedule/status/participant).

## 12. `CMS-002` — Service Content Editor (Content Editor with Tabs/Panel Archetype)

```
┌─────────────────────────────────────────────────────────┐
│ [Sidebar] │ ‹ Back to Services          [Save Draft][Publish]│
│           │ [ Content ] [ SEO ]  ← tabs                     │
│           │─────────────────────────────────────────────── │
│           │ TAB: Content                                    │
│           │ Title*        [_______________________]        │
│           │ Category*     [Personal ▾ / Corporate ▾]        │
│           │ Description*  [ rich text editor           ]    │
│           │               [                             ]    │
│           │ Featured Image [ Upload ]                        │
│           │─────────────────────────────────────────────── │
│           │ TAB: SEO (see SEO-001 panel spec)               │
│           │ Meta Title    [_______________________]        │
│           │ Meta Desc.    [ textarea                  ]      │
│           │ Canonical URL [_______________________]        │
│           │ OG Title/Desc/Image [___________]                │
│           │ [ SERP preview card ]                            │
└─────────────────────────────────────────────────────────┘
```

- **Layout regions**: Sidebar, back-navigation + persistent save/publish actions, tab strip (Content / SEO), tab body.
- **Content hierarchy**: Content tab is default/first; SEO tab (`SEO-001`) is secondary but equally required before publish for SEO-eligible pages.
- **Components**: Tab control, `Input`, `Textarea`/rich-text, category `Select`, image upload, SEO fields + SERP preview, `Button` (Save Draft / Publish).
- **Actions**: Primary — Save Draft, Publish. Secondary — switch tabs, upload image.
- **Navigation**: Back to `CMS-001`; Publish success shows a "view on site" link.
- **Required data**: Service content fields; SEO Metadata fields.
- **Validation placement**: Inline per field; Publish is blocked (disabled + tooltip) until required Content-tab fields are valid, consistent with `AC-LAW-001` Scenario 8.2's pattern for incomplete-profile publication.
- **Error placement**: Page-level `Alert` for save/publish failures; tab indicator shows a dot/badge if that tab contains an error.
- **Empty-state placement**: N/A (always renders fields; SEO fields may be blank pending defaults per `OQ-21`).
- **Mobile considerations**: Tabs become a horizontally scrollable strip; rich-text toolbar collapses to essential controls; image upload uses the native file picker.
- **Upstream**: `FR-CMS-001`, `FR-SEO-001`, `UC-CMS-003`, `UC-SEO-001`, `US-CMS-003`, `US-SEO-001`, `AC-CMS-003`, `AC-SEO-001`.

**Reused by**: `CMS-004` (Blog Editor — adds author/date, drops category), `CMS-006` (Case Study Editor — replaces single description with Background/Challenge/Legal Strategy/Result fields and adds an anonymization/confidentiality review checklist gating Publish per `OQ-14`).

## 13. `AUDIT-002` — Audit Event Detail (Internal Read-only Detail Archetype)

```
┌─────────────────────────────────────────────────────────┐
│ [Sidebar] │ ‹ Back to Audit Logs                            │
│           │ Audit Event #a1b2c3                             │
│           │─────────────────────────────────────────────── │
│           │ Actor:          admin@firm.com (SUPER_ADMIN)     │
│           │ Action:         UPDATE                           │
│           │ Affected Entity: User #456                       │
│           │ Previous Value: { role: "LEGAL_ASSISTANT" }       │
│           │ New Value:      { role: "LAWYER" }                │
│           │ IP Address:     203.0.113.4                       │
│           │ Timestamp:      2026-08-12 09:41:03 UTC            │
└─────────────────────────────────────────────────────────┘
```

- **Layout regions**: Sidebar, back-navigation, key-value read-only attribute list.
- **Content hierarchy**: All confirmed audit attributes (`FR-AUDIT-001`) shown with equal weight; no field is hidden by default.
- **Components**: Read-only key-value list, (optional) link to affected entity if still accessible.
- **Actions**: Primary — return to list. Secondary — navigate to affected entity if permitted.
- **Navigation**: Back to `AUDIT-001`.
- **Required data**: One Audit Event's full attribute set.
- **Validation placement**: N/A (read-only).
- **Error placement**: Page-level `Alert` if the event is not found or outside retention/access rules.
- **Empty-state placement**: N/A.
- **Mobile considerations**: Key-value list stacks label-above-value on narrow viewports for legibility of long JSON-like values.
- **Upstream**: `FR-AUDIT-001`, `FR-AUDIT-002`, `UC-AUDIT-002`, `US-AUDIT-002`, `AC-AUDIT-002`.

## 14. `NOTI-001` — Notification Center (Global Embedded Panel Archetype)

```
Topbar: ... [🔔3] [Avatar▾]
              │
              ▼ (dropdown on click)
    ┌───────────────────────────────┐
    │ Notifications            [Mark all read]│
    ├───────────────────────────────┤
    │ ● New Lead: J. Nguyen — 2m ago  │
    │ ● New Lead: T. Le — 1h ago      │
    │   New Lead: A. Tran — Yesterday │
    ├───────────────────────────────┤
    │         [ View all ]            │
    └───────────────────────────────┘
```

- **Layout regions**: Topbar bell icon with unread-count badge; anchored dropdown panel.
- **Content hierarchy**: Unread items visually distinct (dot/bold) from read items; newest first.
- **Components**: Badge, `NotificationItem` list, dropdown container.
- **Actions**: Primary — click an item to open the related Lead (`LEAD-002`). Secondary — mark as read (retention model `TBD`, `UI-OQ-014`).
- **Navigation**: Deep-links into `LEAD-002`; dropdown closes on outside click or item selection.
- **Required data**: Real-time WebSocket notification events for the authenticated recipient.
- **Validation placement**: N/A.
- **Error placement**: If the WebSocket connection drops, the bell shows a subdued "offline" indicator rather than a false empty state.
- **Empty-state placement**: "No notifications yet" line inside the dropdown.
- **Mobile considerations**: Dropdown becomes a full-width sheet from the top on small viewports rather than a small anchored popover.
- **Upstream**: `FR-NOTI-001`, `UC-NOTI-001`, `US-NOTI-001`, `AC-NOTI-001`.

## 15. Validation Record

- Every archetype maps to at least one Phase 1 requirement chain (FR/UC/US/AC).
- No wireframe specifies final color, imagery, or typography — confirmed deferred to `09-high-fidelity-ui-spec.md`.
- Every wireframe states layout regions, hierarchy, components, actions, navigation, required data, and validation/error/empty-state placement per the required template.
- Mobile considerations are stated for every wireframe, consistent with BRD Mobile First direction.
- Reuse mapping (§1) prevents duplicate wireframes for structurally identical screens while still covering all 38 inventoried screens.

**Validation status:** Passed 2026-08-12.
