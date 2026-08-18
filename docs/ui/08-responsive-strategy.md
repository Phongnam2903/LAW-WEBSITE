# Responsive Strategy

## Document Control

| Field | Value |
|---|---|
| Project | Law Firm Website & Management System |
| Document | Responsive Strategy |
| Document ID | `UI-RESP-08` |
| Version | 1.0 |
| Status | Draft — Phase 2 baseline |
| Effective date | 2026-08-12 |
| Upstream | [03-screen-inventory.md](03-screen-inventory.md), [04-wireframes.md](04-wireframes.md), [06-design-system.md](06-design-system.md) |
| Decision register | [assumptions-open-questions.md](assumptions-open-questions.md) |

## Record of Changes

| Date | Change type | In charge | Description |
|---|---|---|---|
| 2026-08-12 | Added | Phase 2 Agent | Defined Mobile First responsive behavior for every business-critical screen and shared structure. |
| 2026-08-18 | Re-validated| AI Agent | Reviewed against Phase 1 constraints and Component Inventory. Passed. |

## 1. Principle

Design is Mobile First (`01-brd.md` §10.1, `NFR-RWD-001`). Every screen is designed for the smallest reference width first, then progressively enhanced — never designed for desktop and shrunk. Reference widths below are **design references**, not confirmed binding CSS breakpoints; the exact breakpoint set for implementation is `UI-OQ-006` (tracks `OQ-28`).

| Reference | Width | Represents |
|---|---|---|
| Mobile | ~375px | Primary target — most public-site traffic for an urgent-consultation product is expected on mobile |
| Tablet | ~768px | Secondary target — internal staff on tablets, public browsing on larger phones/small tablets |
| Desktop | ~1440px | Internal back-office workflows (data-dense tables, multi-panel detail screens), public browsing on laptops/desktops |

## 2. Navigation

| Surface | Mobile (375px) | Tablet (768px) | Desktop (1440px) |
|---|---|---|---|
| Public header (`CMP-NAV-001`) | Logo + hamburger trigger; nav items and CTA move into `CMP-NAV-008` drawer | Logo + condensed nav (may combine less-critical items into a "More" menu) + visible CTA button | Full nav row + prominent CTA button, all items visible |
| Public footer (`CMP-NAV-002`) | Single-column stacked sections | Two-column | Multi-column |
| Internal sidebar (`CMP-NAV-003`) | Hidden by default; opened via topbar trigger as an off-canvas drawer (`CMP-NAV-008`), overlaying content | Collapsible to icon-only rail, expandable on demand | Persistent expanded rail alongside content |
| Internal topbar (`CMP-NAV-004`) | Search collapses to icon; notification bell and avatar remain visible | Search visible as a compact field | Full search field, notification bell, avatar all visible inline |
| Floating contact widget (`CMP-BIZ-011`) | Icon-only cluster, fixed bottom-right, sized to avoid the safe-area and never overlapping the primary CTA or footer | Icon-only or icon+label depending on available width | Icon+label expanded state available on hover |

## 3. Forms

| Concern | Mobile | Tablet | Desktop |
|---|---|---|---|
| Field layout | Single column, full-width fields | Single column for short forms (`PUB-012`, `AUTH-001`); two-column for long forms (`USER-002`, `LAW-002`) where fields pair naturally | Two-column where it reduces scroll without harming scanability; single column retained for narrative fields (biography, description) |
| Submit actions | Sticky footer bar keeps Save/Submit reachable without excess scrolling | Inline action row at form end | Inline action row at form end |
| Field-level errors | Inline, directly below the field, full-width | Same | Same |
| Long-form editors (`CMS-002`/`004`/`006`) | Tabs become a horizontally scrollable strip; rich-text toolbar shows only essential controls | Full tab strip visible; toolbar shows most controls | Full tab strip and toolbar; SEO preview shown alongside fields rather than below |
| Consent/checkbox targets | 44px minimum touch target, full row tappable (not just the box) | Same | Same |

## 4. Tables (Internal Lists)

Applies to `LEAD-001`, `APP-001`, `CASE-001`, `USER-001`, `CMS-001`/`003`/`005`, `AUDIT-001`.

| Concern | Mobile | Tablet | Desktop |
|---|---|---|---|
| Row representation | Table rows become stacked cards (`LeadCard`-pattern) — one record per card, primary identity + status badge + one key secondary field visible; remaining fields behind a "view details" tap | Table reappears with a reduced column set (drop low-priority columns) | Full table with all confirmed columns |
| Filters | Collapse into a single "Filters" trigger opening a bottom sheet | Inline filter bar, may wrap to two rows | Inline filter bar, single row |
| Pagination (`CMP-NAV-006`) | Prev/Next only | Numbered, condensed | Full numbered pagination |
| Row actions | Primary action = tap the card (opens detail); secondary actions behind an overflow menu | Row hover reveals actions or a persistent action column | Persistent action column/icons |
| Bulk actions (if ever added) | Not supported at launch — out of current scope | — | — |

## 5. Cards (Public Content Grids)

Applies to `LawyerCard`, `ServiceCard`, `CaseStudyCard` grids on `PUB-001`, `PUB-002`, `PUB-004`, `PUB-005`, `PUB-007`.

| Concern | Mobile | Tablet | Desktop |
|---|---|---|---|
| Grid columns | 1 column | 2 columns | 3 columns (occasionally 4 for compact cards on very wide viewports) |
| Card content | Full card content retained (no field dropped) — mobile users need the same trust signals as desktop | Same | Same |
| Image aspect ratio | Fixed aspect ratio maintained across breakpoints to avoid layout shift | Same | Same |

## 6. Dashboard (`DASH-001`)

| Concern | Mobile | Tablet | Desktop |
|---|---|---|---|
| Stat tiles | Stack 1-up or 2-up (whichever avoids truncating numbers) | 2-up grid | 4-up single row |
| Recent-activity feed | Full-width list below stat tiles | Same | May sit alongside a secondary panel if one is added later (not at launch) |
| Quick links | Full-width stacked buttons | Inline row | Inline row |

## 7. Lead Detail (`LEAD-002`)

Designated **High** responsive priority (staff frequently triage Leads away from a desk).

| Concern | Mobile | Tablet | Desktop |
|---|---|---|---|
| Header (identity/status/actions) | Status badge + name stack vertically; primary action becomes a single prominent button, remaining actions behind an overflow (`⋯`) menu | Header stays in one row where space allows; overflow menu still used for tertiary actions | All actions visible inline in the header |
| Panels (notes/appointments/documents) | Full-width stacked, in workflow-frequency order | Same order, slightly wider content | Optionally a two-column layout (main panel + a slim sidebar summary) — not required at launch |
| Sticky context | A condensed sticky mini-header (name + status only) remains visible while scrolling through panels | Same | Not required — full header remains visible without scrolling on typical desktop viewports |

## 8. Case Detail (`CASE-002`)

Same pattern as `LEAD-002` §7, with the Documents panel additionally optimized:

| Concern | Mobile | Tablet | Desktop |
|---|---|---|---|
| Document rows | Filename + size on one line, download as a compact icon, type icon indicates format | Filename, size, type, and a labelled Download button all visible | Same as tablet, plus upload date column |
| Upload control | Full-width "choose file" button (drag-and-drop de-emphasized — impractical on touch) | Drag-and-drop zone + button | Drag-and-drop zone + button |

## 9. Modals / Dialogs (`ConfirmationDialog`)

| Concern | Mobile | Tablet | Desktop |
|---|---|---|---|
| Presentation | Full-screen sheet sliding from the bottom | Centered modal, ~90% width | Centered modal, fixed max-width (~480–560px) |
| Action buttons | Full-width, stacked (Confirm above Cancel, Confirm visually primary) | Inline row, right-aligned | Inline row, right-aligned |

## 10. Floating Contact Widget

Already covered in §2; repeated here because it is explicitly a `NFR-A11Y-001`/`NFR-RWD-001` compliance point:

- Must remain visible and operable at every reference width.
- Must never obscure the primary CTA, form submit button, or footer contact information — verified per-page at each reference width, not assumed globally safe.
- On mobile, the widget's icon cluster respects device safe-area insets (notch/home-indicator regions).

## 11. Typography and Spacing Across Breakpoints

Already tokenized in `06-design-system.md` §3–§4 (Mobile First type scale and 8px spacing scale). This document does not restate the token values; it confirms that every screen in §3–§9 above consumes those same tokens rather than defining screen-specific one-off sizes.

## 12. Screen-by-Screen Responsive Priority Recap

Restated from `03-screen-inventory.md` for convenience — screens rated **High** must be fully usable at the mobile reference width at launch; **Medium** must be usable but may favor desktop-optimized density; **Low** are primarily back-office tools with basic mobile read access only.

| Priority | Screens |
|---|---|
| High | `PUB-001`–`PUB-011`, `PUB-012`, `AUTH-001`, `LEAD-002` |
| Medium | `DASH-001`, `LEAD-001`, `APP-001`, `APP-002`, `CASE-001`, `CASE-002`, `AUTH-005`, `NOTI-001` |
| Low | `LAW-001`, `LAW-002`, `USER-001`, `USER-002`, `CMS-001`–`CMS-006`, `AUDIT-001`, `AUDIT-002` |

## 13. Validation Record

- Every business-critical screen category (navigation, forms, tables, cards, dashboard, Lead Detail, Case Detail, modals, floating widget) has explicit mobile behavior defined, not a generic "responsive" statement.
- No screen's mobile behavior is "shrink the desktop layout" — every table becomes a card list, every multi-column form becomes single-column, every persistent sidebar becomes a drawer.
- Reference widths are explicitly marked as design references pending `UI-OQ-006`/`OQ-28`, consistent with the instruction not to freeze mandatory CSS breakpoints without approval.
- Accessibility touch-target and safe-area requirements from `06-design-system.md` are carried through consistently.

**Validation status:** Passed 2026-08-18.
