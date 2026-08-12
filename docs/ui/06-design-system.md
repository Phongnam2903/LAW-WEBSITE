# Design System

## Document Control

| Field | Value |
|---|---|
| Project | Law Firm Website & Management System |
| Document | Design System |
| Document ID | `UI-DS-06` |
| Version | 1.0 |
| Status | Draft — Phase 2 baseline (visual values PROPOSED pending approval) |
| Effective date | 2026-08-12 |
| Upstream | [../01-brd.md](../01-brd.md) §10.1, §11; [03-screen-inventory.md](03-screen-inventory.md) |
| Decision register | [assumptions-open-questions.md](assumptions-open-questions.md) |

## Record of Changes

| Date | Change type | In charge | Description |
|---|---|---|---|
| 2026-08-12 | Added | Phase 2 Agent | Derived the Phase 2 design system from the BRD's UI/UX business direction; all exact visual values marked PROPOSED. |

## 1. Brand Direction (CONFIRMED — BRD §10.1)

The experience must feel **authoritative, calm, premium, trustworthy, and minimal**. This is a direct BRD constraint, not a Phase 2 invention, and governs every visual and interaction decision below.

| Principle | What it means in practice |
|---|---|
| Authoritative | Confident typographic hierarchy, generous whitespace, no gimmicky animation, credentialed content (lawyer credentials, case outcomes) given visual weight. |
| Calm | Muted, low-saturation palette; no flashing or aggressive motion; ample line-height and spacing. |
| Premium | Serif display type for headings, refined spacing scale, restrained accent-color use (CTAs and status only). |
| Trustworthy | Consistent, predictable interaction patterns; clear error/validation communication; no dark patterns (e.g., consent checkbox is never pre-checked). |
| Minimal | Limited color palette, limited type scale, no decorative imagery that doesn't serve a communication purpose. |

## 2. Color Direction

**Primary palette (CONFIRMED direction, PROPOSED exact values):** Navy, Charcoal, White.
**Accent (CONFIRMED direction, PROPOSED exact values):** Gold or Bordeaux, used only for primary CTAs and important status indicators.

Exact HEX values have **not** been approved. The table below is a `PROPOSED` starting palette consistent with the BRD direction, validated only for internal contrast relationships (not yet stakeholder-approved). All values are subject to `UI-OQ-001`.

| Token | Proposed HEX | Role | Status |
|---|---|---|---|
| `color.navy.900` | `#0B1D33` | Primary brand color — headers, primary buttons, dark surfaces | PROPOSED |
| `color.navy.700` | `#1B3A5C` | Hover/active state of navy elements | PROPOSED |
| `color.charcoal.900` | `#1F2328` | Primary body text | PROPOSED |
| `color.charcoal.600` | `#4B5259` | Secondary text | PROPOSED |
| `color.white` | `#FFFFFF` | Base background, text-on-dark | PROPOSED |
| `color.neutral.100` | `#F5F6F7` | Page background, card background alternation | PROPOSED |
| `color.neutral.300` | `#DCDFE3` | Borders, dividers | PROPOSED |
| `color.gold.600` | `#B08D3E` | Accent candidate A — CTAs, highlights | PROPOSED — choose Gold **or** Bordeaux, not both, pending `UI-OQ-001` |
| `color.bordeaux.700` | `#6B2038` | Accent candidate B — CTAs, highlights | PROPOSED — alternative to Gold |
| `color.success.600` | `#2E7D46` | Success states, `CONFIRMED`/`COMPLETED`/Published indicators | PROPOSED |
| `color.warning.600` | `#B5791C` | Warning states, `PENDING`/draft indicators | PROPOSED |
| `color.danger.600` | `#B3261E` | Error states, `CANCELED`/`LOST` indicators, destructive actions | PROPOSED |
| `color.info.600` | `#2A5C8A` | Informational states, `NEW`/`CONTACTED` indicators | PROPOSED |

All PROPOSED colors must pass WCAG contrast validation against their intended background before promotion to APPROVED (see §9 Accessibility); the exact conformance target is `UI-OQ-012`.

## 3. Typography

**Direction (CONFIRMED — BRD §10.1):** Serif for major headings, sans-serif for body/interface text.

| Token | Proposed typeface direction | Usage | Status |
|---|---|---|---|
| `font.serif` | A refined, editorial serif (e.g., in the family of Playfair Display / Source Serif / Georgia-class) | H1–H3 headings, hero headline, pull quotes | PROPOSED — exact typeface family pending license/approval |
| `font.sans` | A neutral, highly legible grotesque sans-serif (e.g., in the family of Inter / Source Sans / system UI stack) | Body copy, UI labels, form fields, tables | PROPOSED |

### 3.1 Type Scale (Mobile First — base sizes at 375px, scale up at wider breakpoints)

| Token | Mobile size / line-height | Desktop size / line-height | Typeface | Usage |
|---|---|---|---|---|
| `type.display` | 28px / 34px | 44px / 52px | Serif | Hero headline only |
| `type.h1` | 24px / 30px | 34px / 42px | Serif | Page title |
| `type.h2` | 20px / 26px | 26px / 34px | Serif | Section heading |
| `type.h3` | 18px / 24px | 20px / 28px | Serif | Card/subsection heading |
| `type.body` | 16px / 24px | 16px / 26px | Sans | Body copy, form labels |
| `type.small` | 14px / 20px | 14px / 20px | Sans | Secondary text, metadata, timestamps |
| `type.caption` | 12px / 16px | 12px / 16px | Sans | Badge text, helper text |

Minimum body text size is 16px to avoid mobile-browser auto-zoom on form focus and to support the accessibility target under `UI-OQ-012`.

## 4. Spacing Scale

An 8px base unit, consistent across public and internal surfaces:

| Token | Value | Typical usage |
|---|---|---|
| `space.1` | 4px | Icon-to-label gap, tight inline spacing |
| `space.2` | 8px | Form field internal padding, chip padding |
| `space.3` | 12px | Compact stack gap |
| `space.4` | 16px | Default stack gap, card padding (mobile) |
| `space.6` | 24px | Card padding (desktop), section internal gap |
| `space.8` | 32px | Section-to-section gap (mobile) |
| `space.12` | 48px | Section-to-section gap (desktop) |
| `space.16` | 64px | Hero vertical padding (desktop) |

## 5. Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius.sm` | 4px | Inputs, badges, chips |
| `radius.md` | 8px | Buttons, cards |
| `radius.lg` | 12px | Modals, large panels |
| `radius.pill` | 999px | Status badges (`LeadStatusBadge`), avatar containers |

Minimal, restrained radii — consistent with the "minimal, premium" brand principle; no heavy rounding or skeuomorphism.

## 6. Elevation

| Token | Usage | Visual treatment (PROPOSED) |
|---|---|---|
| `elevation.0` | Flat page background, inline content | No shadow |
| `elevation.1` | Cards, table rows on hover | Subtle 1px border + very soft shadow |
| `elevation.2` | Dropdowns (`NOTI-001`), popovers | Soft shadow, no border |
| `elevation.3` | Modals, `ConfirmationDialog` | Pronounced shadow + scrim overlay behind |

Shadows stay soft and low-contrast to preserve the "calm" principle — no harsh drop shadows.

## 7. Iconography

- A single, consistent icon set (outline style preferred over filled, to match "minimal") is used across public and internal surfaces — exact library choice deferred to frontend implementation, not a Phase 2 decision.
- Icons are always paired with a text label in the internal workspace (never icon-only for primary actions), for both clarity and accessibility.
- Public floating contact-widget icons (Zalo, Messenger, phone) are the one icon-only exception, and each carries an `aria-label` per `NFR-A11Y-001`.

## 8. Grid

Mobile First, content-width constrained on large viewports to preserve the "calm/minimal" reading experience:

| Breakpoint reference | Columns | Gutter | Max content width |
|---|---|---|---|
| Mobile (~375px) | 4 | 16px | Fluid (100% − margins) |
| Tablet (~768px) | 8 | 24px | Fluid |
| Desktop (~1440px) | 12 | 24px | 1200px (public), 1440px fluid (internal data tables) |

Exact breakpoint values are design references, not confirmed CSS breakpoints — see `08-responsive-strategy.md` and `UI-OQ-006`.

## 9. Accessibility Considerations

- **Conformance target**: not yet approved — see `UI-OQ-012` (tracks Phase 1 `OQ-27`). Design proceeds against WCAG 2.1 AA as a working baseline until an official target is confirmed, per `NFR-A11Y-001`/`NFR-A11Y-002`.
- **Contrast**: all text/background color pairs must meet at least 4.5:1 (normal text) / 3:1 (large text, ≥18px bold or ≥24px regular) once the palette in §2 is finalized.
- **Touch targets**: minimum 44×44px for any tappable control, including floating-widget icons and table row actions on mobile.
- **Keyboard accessibility**: every interactive element (including `LeadStatusBadge` dropdown triggers, tab controls in `CMS-002`, and the `NOTI-001` bell) must be reachable and operable via keyboard alone, with a visible focus indicator (§10).
- **Label association**: every form input has a programmatically associated `<label>`; placeholder text is never the only label.
- **Error communication**: validation and server errors are communicated both visually (color/icon) and textually (never color alone), per `NFR-ERR-001`'s "no false-success" and general form-state rules in `05-wireframe-states.md`.
- **Semantic structure**: heading levels follow document order (no skipped levels for visual-size reasons); landmark regions (`header`, `nav`, `main`, `footer`) are used consistently across public and internal shells.

## 10. Focus States

| Element | Focus treatment (PROPOSED) |
|---|---|
| All interactive elements | 2px solid outline in `color.navy.700` (or an accent color with confirmed ≥3:1 contrast against adjacent surfaces) offset 2px from the element edge; never `outline: none` without a replacement indicator. |
| Form inputs | Focus ring plus a subtle border-color change to `color.navy.700`. |
| Buttons | Focus ring visible in addition to any hover/active background change — focus must remain visible even when a button also has a pressed/active style. |

## 11. Validation States

Consistent visual language across every form (ties to `05-wireframe-states.md` §3):

| State | Border/indicator | Text/icon treatment |
|---|---|---|
| Default | `color.neutral.300` border | Neutral helper text below field, if any |
| Focus | `color.navy.700` border + focus ring | Helper text unchanged |
| Error | `color.danger.600` border + error icon | Error message in `color.danger.600` below the field, `type.small` |
| Success (e.g., confirmed-available email) | `color.success.600` border (used sparingly — most fields do not need a positive-confirmation state) | Optional success icon only |
| Disabled | `color.neutral.300` border, reduced-opacity text | No interaction; disabled controls still communicate *why* via adjacent helper text where the reason isn't obvious (e.g., "Convert to Case" disabled tooltip) |

## 12. Form Behavior Principles

- Inline validation on blur for format/required checks; full validation re-run on submit.
- Never clear user-entered values after a failed submission.
- Primary submit action is always the rightmost/bottom-most button in a Cancel/Submit pair, consistent placement across every form screen.
- Destructive or high-consequence actions (deactivate user, convert Lead to Case, publish Case Study) always route through a `ConfirmationDialog` (see `05-wireframe-states.md` §6).

## 13. Mobile First Commitment

Every token and pattern above is defined mobile-first: base type scale, spacing, and grid are specified at the 375px reference width first, then scaled up. This satisfies BRD §10.1's explicit "Design is Mobile First" direction and `NFR-RWD-001`. Full responsive behavior per screen is detailed in `08-responsive-strategy.md`.

## 14. Governance

| Status label | Meaning |
|---|---|
| CONFIRMED | Directly stated in an approved Phase 1 document (BRD/FRS/NFR); not open to silent change. |
| PROPOSED | A Phase 2 working value consistent with the confirmed direction, awaiting explicit stakeholder approval; safe to use for wireframes and prototypes, not safe to treat as final for frontend implementation. |
| TBD | Depends on an unresolved Phase 1 `OQ-*` and cannot be usefully proposed yet. |

No PROPOSED value in this document may be silently promoted to CONFIRMED; promotion requires recording the decision in `assumptions-open-questions.md` per its Decision Recording Procedure.

## 15. Validation Record

- Brand direction, primary palette family, and Mobile First commitment are all traced directly to BRD §10.1 — no invented brand direction.
- Every exact visual value (HEX, typeface family) is explicitly marked PROPOSED, consistent with the master instruction not to silently invent a final brand palette.
- Accessibility, focus, and validation-state sections give concrete, testable guidance while leaving the exact conformance level `TBD` pending `UI-OQ-012`/`OQ-27`.
- Spacing/type/grid scales are Mobile First per BRD §10.1's explicit design direction.

**Validation status:** Passed 2026-08-12.
