# Component Inventory

## Document Control

| Field | Value |
|---|---|
| Project | Law Firm Website & Management System |
| Document | Component Inventory |
| Document ID | `UI-CMP-07` |
| Version | 1.0 |
| Status | Draft — Phase 2 baseline |
| Effective date | 2026-08-12 |
| Upstream | [03-screen-inventory.md](03-screen-inventory.md), [04-wireframes.md](04-wireframes.md), [06-design-system.md](06-design-system.md) |
| Decision register | [assumptions-open-questions.md](assumptions-open-questions.md) |

## Record of Changes

| Date | Change type | In charge | Description |
|---|---|---|---|
| 2026-08-12 | Added | Phase 2 Agent | Catalogued reusable UI components identified across all wireframed screens, prior to any frontend implementation. |

## 1. Purpose

This document identifies every reusable UI component implied by `04-wireframes.md` and `03-screen-inventory.md`, before any React implementation begins. Components are conceptual (purpose, variants, states, props, accessibility, responsiveness) — no JSX, no TypeScript interfaces, no file structure. Component IDs use the prefix `CMP-<GROUP>-<NNN>`.

## 2. Foundation Components

| ID | Name | Purpose | Used by | Variants | States | Props (conceptual) | Accessibility | Responsive behavior | Reusability |
|---|---|---|---|---|---|---|---|---|---|
| `CMP-FND-001` | `Button` | Primary interactive trigger. | All screens | Primary, Secondary, Text/Ghost, Destructive | Default, Hover, Focus, Active, Disabled, Loading | label, onPress, variant, size, icon (optional), disabled | Reachable via keyboard (Enter/Space), visible focus ring, `aria-busy` when loading | Full-width on mobile within forms; auto-width elsewhere | Very high |
| `CMP-FND-002` | `Link` | In-text or navigational hyperlink styled distinctly from `Button`. | Public pages, breadcrumbs | Inline, Standalone | Default, Hover, Focus, Visited (public only, optional) | label, href, external (boolean) | Underline or ≥3:1 contrast beyond color alone to convey link-ness | No change | Very high |
| `CMP-FND-003` | `Icon` | Single glyph from the shared icon set. | All screens | Outline (default) | Default | name, size, color token | Decorative icons `aria-hidden`; functional icon-only controls require `aria-label` | Scales with adjacent text size | Very high |
| `CMP-FND-004` | `Badge` | Small label for counts or categorical tags (not workflow status — see `LeadStatusBadge`). | `NOTI-001` (unread count), `CMS-*` (category tags) | Count, Text | Default | value/label, color token | Sufficient contrast; not color-only when conveying meaning | Shrinks to dot-only if space-constrained on mobile, with `aria-label` retained | High |
| `CMP-FND-005` | `Avatar` | User/lawyer identity image or initials fallback. | Internal topbar, `CASE-002` assigned-lawyers, `LAW-*` | Image, Initials-fallback | Default | src, initials, size | `alt` text with the person's name | Fixed size per breakpoint token | High |

## 3. Form Components

| ID | Name | Purpose | Used by | Variants | States | Props (conceptual) | Accessibility | Responsive behavior | Reusability |
|---|---|---|---|---|---|---|---|---|---|
| `CMP-FRM-001` | `Input` | Single-line text entry. | `PUB-012`, `AUTH-001`, `USER-002`, `LAW-002`, `CMS-*`, `APP-002` | Text, Email, Password (with reveal toggle), Search | Idle, Focus, Error, Disabled, Filled | label, value, onChange, type, required, error message | Associated `<label>`, `aria-invalid` + `aria-describedby` on error | Full-width on mobile | Very high |
| `CMP-FRM-002` | `Textarea` | Multi-line text entry. | `PUB-012`, `CMS-*`, `LEAD-002` (notes), `CASE-002` (activity) | Fixed-height, Auto-grow | Same as `Input` | label, value, onChange, rows, required, error message | Same as `Input` | Full-width, min-height preserved on mobile | High |
| `CMP-FRM-003` | `Select` | Single-choice dropdown from a controlled value set. | `USER-002` (role), `LEAD-001`/`002` (status/source filter & control), `APP-002` (type/status) | Native-style, Searchable (for long lists) | Idle, Focus, Error, Disabled | label, options, value, onChange, required | Keyboard-navigable options, `aria-expanded`/`aria-activedescendant` | Full-width on mobile; native `<select>` fallback preferred on touch devices | Very high |
| `CMP-FRM-004` | `Checkbox` | Boolean/multi-select input. | `PUB-012` (consent), `LAW-002` (visibility, if modeled as checkbox) | Single, Grouped | Unchecked, Checked, Indeterminate, Error, Disabled | label, checked, onChange, required | Associated label, keyboard toggle (Space), never pre-checked when representing consent | 44px minimum touch target | High |
| `CMP-FRM-005` | `Radio` | Mutually exclusive choice from a small set. | `APP-002` (type, if radio-styled), `LEAD-002` (status, if radio-styled) | Grouped | Unselected, Selected, Error, Disabled | name, options, value, onChange | Grouped under a `fieldset`/`legend` or equivalent labelling | Stacks vertically on mobile | Medium |
| `CMP-FRM-006` | `DateTimePicker` | Date/time selection for scheduling. | `APP-002` | Date-only, DateTime | Idle, Focus, Error, Disabled | value, onChange, min (no past dates per `AC-APP-001` 15.2), required | Keyboard-operable calendar, announces selected date to assistive tech | Native mobile date input preferred on small viewports | High |
| `CMP-FRM-007` | `FileUpload` | Document/image upload control. | `LEAD-002`/`CASE-002` Documents panel, `LAW-002` portrait, `CMS-*` media | Drag-and-drop + click, Single-file, Multi-file (documents) | Idle, Selected, Uploading, Success, Invalid Type, Too Large, Network Error, Permission Denied (see `05-wireframe-states.md` §5) | accept (MIME types), maxSizeMB, onUpload, multiple | Keyboard-operable file picker trigger, progress announced via `aria-live` | Full-width drop zone on mobile with a visible "choose file" fallback (drag-and-drop is not touch-friendly) | High |

## 4. Feedback Components

| ID | Name | Purpose | Used by | Variants | States | Props (conceptual) | Accessibility | Responsive behavior | Reusability |
|---|---|---|---|---|---|---|---|---|---|
| `CMP-FDB-001` | `Alert` | Page/section-level message (error, warning, info, success). | All form/data screens | Error, Warning, Info, Success | Default, Dismissible | severity, message, onDismiss | `role="alert"` for errors (assertive), `role="status"` for info/success (polite) | Full-width banner on mobile | Very high |
| `CMP-FDB-002` | `Toast` | Transient confirmation after a successful action. | `USER-002`, `LAW-002`, `CMS-*`, mutation actions | Success, Error | Entering, Visible, Exiting | message, duration, severity | `role="status"`, `aria-live="polite"`; auto-dismiss timing does not remove keyboard focus mid-interaction | Bottom-anchored, full-width on mobile | Very high |
| `CMP-FDB-003` | `ValidationMessage` | Field-level inline error/help text. | Every form field | Error, Help | Visible | fieldId, message, severity | Linked via `aria-describedby` to its field | No change | Very high |
| `CMP-FDB-004` | `LoadingIndicator` | Skeleton or spinner for in-flight data. | All data screens | Skeleton (lists/detail), Inline spinner (buttons) | Loading | shape/size | `aria-busy="true"` on the loading container | Skeleton dimensions match the loaded layout to avoid content jump | Very high |
| `CMP-FDB-005` | `EmptyState` | Zero-result placeholder, distinct from Error. | `LEAD-001`, `APP-001`, `CASE-001`, `USER-001`, `CMS-*` lists, `AUDIT-001`, public listings | No-data, No-search-results | Default | message, illustration (optional), action (optional) | Message conveyed as text, not solely via illustration | Centers within available space at any width | Very high |
| `CMP-FDB-006` | `ConfirmationDialog` | Explicit confirm/cancel gate before a high-consequence mutation. | `LEAD-002` (convert), `USER-001` (deactivate), `CMS-*` (publish), `CASE-002` (reassign) | Standard, Destructive | Idle, Pending, Failure (see `05-wireframe-states.md` §6) | title, body, confirmLabel, cancelLabel, onConfirm, destructive (boolean) | Focus trapped within dialog, `role="alertdialog"`, Escape closes (cancel), focus returns to trigger on close | Full-screen sheet on mobile, centered modal on desktop | High |

## 5. Navigation Components

| ID | Name | Purpose | Used by | Variants | States | Props (conceptual) | Accessibility | Responsive behavior | Reusability |
|---|---|---|---|---|---|---|---|---|---|
| `CMP-NAV-001` | `Header` (public) | Global public navigation + primary CTA. | All `PUB-*` | — | Default, Scrolled (compact) | nav items, ctaLabel | Skip-to-content link, `nav` landmark, current-page indicated via `aria-current` | Collapses to hamburger + drawer under the tablet breakpoint reference | Very high |
| `CMP-NAV-002` | `Footer` (public) | Secondary navigation, firm identity, legal links. | All `PUB-*` | — | Default | nav items, contact info | `contentinfo` landmark | Stacks single-column on mobile | Very high |
| `CMP-NAV-003` | `Sidebar` (internal) | Primary internal navigation, role-filtered. | All internal screens | Expanded, Collapsed | Default, Active-item highlighted | items (role-filtered), activeRoute | `nav` landmark, current route via `aria-current` | Becomes an off-canvas drawer triggered from the topbar on mobile | Very high |
| `CMP-NAV-004` | `Header` (internal/topbar) | Search entry point, `NotificationItem` bell, account menu. | All internal screens | — | Default | user, unreadCount | Account menu is a keyboard-operable disclosure widget | Search may collapse to an icon-trigger on mobile | Very high |
| `CMP-NAV-005` | `Breadcrumb` | Hierarchical location indicator. | `PUB-003`/`006`/`008`/`010`, `LEAD-002`, `CASE-002` (as "‹ Back to X") | Public (full trail), Internal (single "back" link) | Default | trail items | `nav aria-label="Breadcrumb"`, ordered list semantics | Truncates to last 1–2 items on mobile | High |
| `CMP-NAV-006` | `Pagination` | Page-through control for long result sets. | `LEAD-001`, `APP-001`, `CASE-001`, `USER-001`, `CMS-*` lists, `AUDIT-001`, `PUB-009` | Numbered, Prev/Next only (mobile) | Default, First-page (Prev disabled), Last-page (Next disabled) | currentPage, totalPages, onChange | Buttons labelled ("Previous page"/"Next page"), current page announced | Collapses to Prev/Next-only on mobile | Very high |
| `CMP-NAV-007` | `Tabs` | Switch between related content panels within one screen. | `CMS-002`/`004`/`006` (Content/SEO) | Horizontal | Default, Active, Error-indicator (badge dot) | tabs, activeTab, onChange | `role="tablist"`/`tab`/`tabpanel`, arrow-key navigation | Horizontally scrollable strip on mobile | Medium |
| `CMP-NAV-008` | `MobileNavigation` | Off-canvas drawer for public and internal nav on small viewports. | Public `CMP-NAV-001`, internal `CMP-NAV-003` | Public, Internal | Closed, Open | items, isOpen, onClose | Focus trapped while open, Escape closes, focus returns to trigger | Only rendered below the tablet breakpoint reference | High |

## 6. Business Components

| ID | Name | Purpose | Used by | Variants | States | Props (conceptual) | Accessibility | Responsive behavior | Reusability |
|---|---|---|---|---|---|---|---|---|---|
| `CMP-BIZ-001` | `LawyerCard` | Compact lawyer summary for grids/lists. | `PUB-001`, `PUB-002`, `PUB-006`, `LAW-001` (internal variant with publish-state indicator) | Public, Internal (with edit affordance) | Default, Hover, Focus | portrait, name, title, specialization, href | Card is a single focusable link/region, not nested interactive elements | 1-column mobile, up to 3-column desktop grid | High |
| `CMP-BIZ-002` | `ServiceCard` | Compact service summary for grids. | `PUB-004`, `PUB-005`, `PUB-001` (highlights) | Personal, Corporate | Default, Hover, Focus | title, excerpt, href, category | Same pattern as `LawyerCard` | Same as `LawyerCard` | High |
| `CMP-BIZ-003` | `CaseStudyCard` | Compact anonymized case-outcome summary. | `PUB-001`, `PUB-007` | Default | Default, Hover, Focus | title, excerpt, href | Same pattern as `LawyerCard`; never surfaces client-identifying fields | Same as `LawyerCard` | High |
| `CMP-BIZ-004` | `LeadCard` | Compact Lead summary for mobile list view (card-per-row). | `LEAD-001` (mobile) | Default | Default, Selected | name, source, status, assignee, href | Whole card focusable/operable as one control | Replaces table rows below the tablet breakpoint reference | High |
| `CMP-BIZ-005` | `LeadStatusBadge` | Visual indicator of controlled Lead status. | `LEAD-001`, `LEAD-002`, `LeadCard` | `NEW`, `CONTACTED`, `QUALIFIED`, `CONVERTED`, `LOST` — exactly the five controlled values, no others | Static display; interactive variant opens the status-change control | status value, interactive (boolean) | Color is paired with text label, never color-only | No change | Very high |
| `CMP-BIZ-006` | `AppointmentCard` | Compact appointment summary. | `LEAD-002`, `CASE-002`, `APP-001` (mobile) | Compact (embedded panel), Full (list row) | Default | type, status, schedule, href | Same card-focus pattern | Compact variant used consistently on mobile | High |
| `CMP-BIZ-007` | `CaseSummary` | Case identity + status header block. | `CASE-001` (row), `CASE-002` (header) | Row, Header | Default | title, statusPlaceholder (`TBD`, `UI-OQ-015`), openedDate | Status placeholder must not imply a false specific status once real statuses are approved | Header stacks title/status/actions vertically on mobile | Medium |
| `CMP-BIZ-008` | `DocumentItem` | Single private document row (filename, size, actions). | `LEAD-002`, `CASE-002` Documents panels | Default | Default, Uploading, Error (see `05-wireframe-states.md` §5) | filename, sizeBytes, mimeType, onDownload | Download control labelled with filename for screen readers, not just an icon | Compact single-line on mobile with overflow menu for actions | High |
| `CMP-BIZ-009` | `NotificationItem` | Single real-time notification entry. | `NOTI-001` | Unread, Read | Default | message, timestamp, leadRef, read (boolean) | Unread state conveyed by more than color (e.g., dot + bold text) | Full-width row in the mobile sheet variant of `NOTI-001` | Medium |
| `CMP-BIZ-010` | `AuditLogTable` | Structured presentation of Audit Events. | `AUDIT-001` | Table (desktop), Stacked cards (mobile) | Default, Loading, Empty, Error (per `05-wireframe-states.md` §2) | events, onRowSelect | Table semantics (`<table>`/`role="table"`) with row headers where useful | Reuses `CMP-NAV-003` list-to-card mobile pattern | Medium |
| `CMP-BIZ-011` | `FloatingContactWidget` | Persistent Zalo/Messenger/hotline access on public pages. | All `PUB-*` | Expanded (desktop hover/click), Icon-only (mobile) | Default, Expanded | channels (Zalo/Messenger/Hotline), positions | Each channel icon has `aria-label`; must never obscure the primary CTA or footer content (`NFR-A11Y-001`) | Shrinks and repositions to avoid overlapping the mobile-safe-area and primary CTA | Very high |
| `CMP-BIZ-012` | `SeoMetaPanel` | SEO field group + SERP preview, realizing `SEO-001`. | `CMS-002`, `CMS-004`, `CMS-006` | Default | Default, Validation Error | metaTitle, metaDescription, canonicalUrl, ogFields | Preview region is decorative (`aria-hidden`); actual fields carry the accessible labels | Preview card stacks below fields on mobile rather than side-by-side | Medium |

## 7. Component Coverage Summary

| Group | Component count |
|---|---:|
| Foundation | 5 |
| Form | 7 |
| Feedback | 6 |
| Navigation | 8 |
| Business | 12 |
| **Total** | **38** |

## 8. Validation Record

- Every component traces to at least one screen in `03-screen-inventory.md`/`04-wireframes.md`; none are speculative additions beyond what the wireframes require.
- `LeadStatusBadge`, Lead sources, and Appointment type/status components use exactly the controlled values from `01-brd.md` §9 — no invented status values.
- Every component states an accessibility requirement and a responsive behavior, consistent with Mobile First and the accessibility principles in `06-design-system.md`.
- No component specification includes React/TypeScript implementation detail — props are described conceptually only.
- `CaseSummary`'s status field is explicitly marked as a placeholder pending `OQ-03`/`UI-OQ-015`, preventing an invented Case-status vocabulary from leaking into the component layer.

**Validation status:** Passed 2026-08-12.
