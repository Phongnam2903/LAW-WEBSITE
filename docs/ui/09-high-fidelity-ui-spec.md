# High-Fidelity UI Specification

## Document Control

| Field | Value |
|---|---|
| Project | Law Firm Website & Management System |
| Document | High-Fidelity UI Specification |
| Document ID | `UI-HIFI-09` |
| Version | 1.0 |
| Status | Draft — Phase 2 baseline (visual finality gated by `UI-OQ-001`/`UI-OQ-002`/`UI-OQ-003`) |
| Effective date | 2026-08-12 |
| Prerequisite validation | `01`–`08` all passed (see each document's Validation Record) |
| Decision register | [assumptions-open-questions.md](assumptions-open-questions.md) |

## Record of Changes

| Date | Change type | In charge | Description |
|---|---|---|---|
| 2026-08-12 | Added | Phase 2 Agent | Composed conceptual high-fidelity specification from the validated IA, flows, screens, wireframes, states, design system, and responsive strategy. |
| 2026-08-18 | Re-validated| AI Agent | Reviewed against Phase 1 constraints and previous Phase 2 artifacts. Passed. |

## 1. Purpose and Gate

This document only exists because `01-information-architecture.md` through `08-responsive-strategy.md` have each passed their own Validation Record — confirmed by cross-reference before writing this file. It layers final-intent visual and interaction specification onto the low-fidelity wireframes, using the tokens defined in `06-design-system.md`. It remains conceptual: no CSS, no component code, no asset files. Every visual decision is labeled:

- **APPROVED** — confirmed by an approved Phase 1 document.
- **PROPOSED** — this document's working recommendation, consistent with confirmed direction, not yet stakeholder-approved.
- **TBD** — blocked on an unresolved `OQ-*`/`UI-OQ-*`; a placeholder treatment is described so design/build is not blocked, but must not be read as final.

## 2. Branding Usage

| Element | Treatment | Status |
|---|---|---|
| Brand voice (authoritative/calm/premium/trustworthy/minimal) | Applied via typography hierarchy, whitespace discipline, and restrained motion across every screen (§6). | APPROVED direction, PROPOSED execution |
| Logo placement | Public header top-left, linked to Home; internal sidebar top, linked to Dashboard; centered on `AUTH-001`. | PROPOSED (logo asset itself `TBD`, `UI-OQ-002`) |
| Primary color usage | `color.navy.900` for header/footer backgrounds, primary buttons, and the internal sidebar; `color.charcoal.900` for body text. | PROPOSED (exact HEX `TBD`, `UI-OQ-001`) |
| Accent color usage | One accent only (Gold **or** Bordeaux, not both) reserved exclusively for: primary CTA buttons, active-nav indicator, and the single most important stat on `DASH-001`. Never used for large fill areas — "minimal" principle. | PROPOSED, accent choice `TBD` (`UI-OQ-001`) |
| Imagery direction | Authentic firm/team photography per `WEB-01`; if unavailable, professional stock photography with a consistent desaturated/navy-toned treatment to preserve the "calm" mood — never stock imagery that reads as generic corporate cliché (handshakes, gavels as the sole visual). | PROPOSED, actual asset source `TBD` (`UI-OQ-003`) |

## 3. Color Application by Surface

Building on `06-design-system.md` §2 (all HEX values remain PROPOSED pending `UI-OQ-001`):

| Surface | Background | Primary text | Accent usage |
|---|---|---|---|
| Public header/footer | `color.navy.900` | `color.white` | Accent CTA button only |
| Public page body | `color.white` / `color.neutral.100` alternating by section | `color.charcoal.900` | Accent CTA band, accent underline on active nav item |
| Auth screens | `color.neutral.100` | `color.charcoal.900` | Accent submit button |
| Internal sidebar | `color.navy.900` | `color.white` | Accent active-item indicator (left border or icon tint) |
| Internal content area | `color.white` | `color.charcoal.900` | Accent used only for primary action buttons and the single highlighted dashboard stat |
| Status indicators (`LeadStatusBadge`, Appointment/Case status) | Per §7 status-color mapping | — | Status colors are semantic (`success`/`warning`/`danger`/`info`), never the brand accent |

## 4. Typography Application

Applying `06-design-system.md` §3 tokens:

| Screen area | Token | Status |
|---|---|---|
| Public Hero headline (`PUB-001`) | `type.display`, serif | PROPOSED wording pending `OQ-18`/`UI-OQ-007`; typography treatment itself is PROPOSED |
| Public page titles (`PUB-002`–`PUB-011`) | `type.h1`, serif | PROPOSED |
| Section headings (all screens) | `type.h2`/`type.h3`, serif | PROPOSED |
| Body copy, form labels, table content | `type.body`/`type.small`, sans-serif | PROPOSED |
| Internal page titles (`DASH-001`, `LEAD-001`, etc.) | `type.h1`, sans-serif (internal workspace favors sans-serif throughout for density and legibility; serif is reserved for public-facing brand moments) | PROPOSED |

## 5. Spacing and Layout Application

- Public marketing sections (`PUB-001` Hero, Practice Areas, etc.) use `space.12`/`space.16` between major sections on desktop, `space.8` on mobile — generous whitespace reinforces "premium/calm."
- Internal data-dense screens (`LEAD-001`, `AUDIT-001`) use tighter `space.3`/`space.4` rhythm within tables to prioritize scanability over air, while still respecting the `06-design-system.md` §4 scale (no ad hoc spacing values).
- Card padding: `space.4` mobile, `space.6` desktop, consistent across `LawyerCard`, `ServiceCard`, `CaseStudyCard`, `LeadCard`.

All PROPOSED, consistent with `06-design-system.md`.

## 6. Component Appearance

| Component | High-fidelity treatment | Status |
|---|---|---|
| `Button` (Primary) | Solid accent-color fill (public) / solid navy fill (internal primary actions), `radius.md`, `type.body` medium weight label, subtle elevation-1 on hover only (no elevation at rest — "minimal"). | PROPOSED |
| `Button` (Secondary) | Outline style, navy or charcoal border, transparent fill. | PROPOSED |
| `LawyerCard`/`ServiceCard`/`CaseStudyCard` | `radius.md`, `elevation.1` at rest, `elevation.2` on hover/focus with a subtle upward translate (≤2px) — restrained, not bouncy, per "calm." | PROPOSED |
| `LeadStatusBadge` | Pill shape (`radius.pill`), semantic background at low opacity (~12%) with full-opacity text/icon in the same hue, per §7 mapping. | PROPOSED |
| `Sidebar` active item | Left accent-colored border (3px) + slightly lighter navy background band, active icon tinted accent. | PROPOSED |
| `Alert`/`Toast` | `radius.md`, left icon, no harsh drop shadow (`elevation.1` max), semantic background per severity. | PROPOSED |
| `ConfirmationDialog` | `radius.lg`, `elevation.3`, scrim at ~40% black opacity behind, destructive variant uses `color.danger.600` for the confirm button only (not the whole dialog chrome). | PROPOSED |
| `FloatingContactWidget` | Circular icon buttons, `elevation.2`, navy or white circular background depending on page background contrast, positioned with safe-area-aware offset. | PROPOSED |

## 7. Status Color Mapping (Semantic, Not Brand Accent)

| Domain | Value | Color token | Status |
|---|---|---|---|
| Lead status | `NEW` | `color.info.600` | PROPOSED |
| Lead status | `CONTACTED` | `color.info.600` (lighter tint or icon variant to distinguish from `NEW`) | PROPOSED |
| Lead status | `QUALIFIED` | `color.warning.600` (progressing, action-needed framing) | PROPOSED |
| Lead status | `CONVERTED` | `color.success.600` | PROPOSED |
| Lead status | `LOST` | `color.danger.600` (neutral-gray alternative also acceptable to avoid overstating failure) | PROPOSED |
| Appointment status | `PENDING` | `color.warning.600` | PROPOSED |
| Appointment status | `CONFIRMED` | `color.info.600` | PROPOSED |
| Appointment status | `COMPLETED` | `color.success.600` | PROPOSED |
| Appointment status | `CANCELED` | `color.danger.600` (or neutral-gray) | PROPOSED |
| CMS publish state | Published | `color.success.600` | PROPOSED |
| CMS publish state | Draft/Non-public | `color.neutral.300` text-on-neutral (deliberately unobtrusive) | PROPOSED |
| Case status | Not applicable — no approved status set | — | `TBD` (`OQ-03`, `UI-OQ-015`) — `CaseSummary` renders a neutral "Open" placeholder only, never a fabricated status vocabulary |

## 8. Iconography Application

- One outline icon set applied consistently; internal workspace icons are always paired with text labels (per `06-design-system.md` §7).
- Status badges pair a small icon (e.g., dot, checkmark, clock) with text — never icon-only, never color-only.
- Public floating widget: brand-recognizable Zalo/Messenger icons plus a phone icon for hotline, each with `aria-label`.

## 9. Visual Hierarchy Summary

| Screen | #1 visual priority | #2 | #3 |
|---|---|---|---|
| `PUB-001` Home | Hero CTA | Hero headline | Practice-area cards |
| `PUB-012` Consultation Form | Submit button | Required-field asterisks | Consent checkbox |
| `AUTH-001` Login | Submit button | Credential fields | Forgot-password link (de-emphasized) |
| `DASH-001` | Stat tiles | Recent activity | Quick links |
| `LEAD-002` | Status badge + primary action row | Follow-up notes | Appointments/Documents panels |
| `CASE-002` | Assigned lawyers + activity | Documents | Appointments |
| `CMS-002` editor | Content fields | Publish action | SEO tab (equally required, secondary by default tab order only) |

## 10. Responsive Behavior (High-Fidelity Confirmation)

This document does not redefine responsive behavior — it confirms that every high-fidelity treatment above renders correctly at all three reference widths per `08-responsive-strategy.md`, with no new desktop-only visual dependency introduced (e.g., hover-only affordances always have a tap-accessible equivalent; `LawyerCard` hover elevation is decorative only, not required to access card content).

## 11. Interaction Behavior

| Interaction | Behavior | Status |
|---|---|---|
| Page transitions | No full-page custom transition animation — standard browser navigation; internal SPA-like transitions (if any) fade content in ≤150ms, no slide/bounce ("calm"). | PROPOSED |
| Button press | Scale/opacity micro-feedback ≤100ms; no bounce. | PROPOSED |
| Form field focus | Immediate border/ring change, no animation delay (accessibility: instant feedback). | PROPOSED |
| Toast enter/exit | Slide + fade ≤200ms, auto-dismiss after 4–6s unless it communicates an error (errors persist until dismissed or superseded). | PROPOSED |
| `ConfirmationDialog` open/close | Scrim fade + dialog scale-in ≤200ms; respects `prefers-reduced-motion` by disabling scale/slide and using opacity-only. | PROPOSED |
| Skeleton-to-content swap | Cross-fade ≤150ms, no layout shift (skeleton dimensions match final content). | PROPOSED |
| Real-time notification arrival (`NOTI-001`) | Badge count updates immediately; a subtle, non-intrusive indicator (no sound, no modal interruption) — consistent with "calm," and avoids disrupting an in-progress task per `NFR-OBS-001`/usability direction. | PROPOSED |

## 12. Validation Record

- Every visual/interaction decision is labeled APPROVED, PROPOSED, or TBD; no PROPOSED value is presented as final.
- No item here contradicts `06-design-system.md` tokens or `08-responsive-strategy.md` behavior — this document only adds application-level specificity.
- Status color mapping uses exactly the controlled Lead/Appointment values from the BRD; the unresolved Case status set is explicitly not fabricated (`TBD`, `UI-OQ-015`).
- Motion is kept minimal and respects `prefers-reduced-motion`, consistent with the "calm" brand principle and general accessibility good practice.
- All prerequisite documents (`01`–`08`) show a passed Validation Record as of 2026-08-12, satisfying the gating condition in §1.

**Validation status:** Passed 2026-08-18.
