# Screen Inventory

## Document Control

| Field | Value |
|---|---|
| Project | Law Firm Website & Management System |
| Document | Screen Inventory |
| Document ID | `UI-SCR-03` |
| Version | 1.0 |
| Status | Draft — Phase 2 baseline |
| Effective date | 2026-08-12 |
| Upstream | [01-information-architecture.md](01-information-architecture.md), [02-user-flows.md](02-user-flows.md) |
| Decision register | [assumptions-open-questions.md](assumptions-open-questions.md) |

## Record of Changes

| Date | Change type | In charge | Description |
|---|---|---|---|
| 2026-08-12 | Added | Phase 2 Agent | Created the full screen inventory from the validated Information Architecture. |
| 2026-08-18 | Re-validated| AI Agent | Reviewed against Phase 1 constraints and User Flows. Passed. |

## 1. Purpose

This document assigns every screen defined in `01-information-architecture.md` a complete specification: components, actions, required data, and full upstream traceability (FR/UC/US/AC), plus permission and responsive priority. Screen IDs match the Page IDs already assigned in the IA. Responsive Priority reflects Mobile First direction (BRD §10.1): **High** = must be fully usable on a 375px viewport at launch; **Medium** = usable but desktop-optimized workflows are acceptable at launch; **Low** = primarily a desktop/back-office tool, mobile support is basic read access only.

## 2. Public Website Screens

### `PUB-001` — Home
- **Route candidate**: `/`
- **Actor**: Guest
- **Purpose**: Establish authority; drive traffic to services, lawyers, and the consultation CTA.
- **Main components**: Header/nav, Hero (imagery + headline + primary CTA), Practice Area highlight cards, Our Advocates preview strip, Litigation Process (4 stages), Case Study highlights, Floating contact widget, Footer.
- **Primary actions**: Open Consultation form (`PUB-012`); navigate to a Service (`PUB-006`); navigate to a Lawyer (`PUB-003`).
- **Secondary actions**: Navigate to Case Studies (`PUB-007`), Legal Insights (`PUB-009`); use floating Zalo/Messenger/hotline.
- **Required data**: Hero content, up to N featured Services, published Lawyers subset, 4 litigation-process steps, featured Case Studies.
- **Related FR**: `FR-WEB-004`, `FR-WEB-001`, `FR-WEB-002`, `FR-WEB-003`
- **Related UC**: `UC-WEB-001`, `UC-WEB-002`, `UC-WEB-003`, `UC-WEB-004`
- **Related US**: `US-WEB-001`
- **Related AC**: `AC-WEB-001`
- **Permission**: Public read
- **Responsive priority**: High
- **Status**: REQUIRED

### `PUB-002` — Lawyers
- **Route candidate**: `/lawyers`
- **Actor**: Guest
- **Purpose**: Browse all publicly eligible lawyer profiles.
- **Main components**: Header/nav, page intro, `LawyerCard` grid, empty state, Footer.
- **Primary actions**: Select a lawyer to view `PUB-003`.
- **Secondary actions**: Navigate to Contact.
- **Required data**: List of published Lawyer Profiles (portrait, name, title, specialization).
- **Related FR**: `FR-WEB-002`, `FR-WEB-004`
- **Related UC**: `UC-WEB-003`
- **Related US**: `US-WEB-003`
- **Related AC**: `AC-WEB-003`
- **Permission**: Public read
- **Responsive priority**: High
- **Status**: REQUIRED

### `PUB-003` — Lawyer Detail
- **Route candidate**: `/lawyers/{slug}`
- **Actor**: Guest
- **Purpose**: Present one lawyer's full public profile to build trust.
- **Main components**: Header/nav, portrait, name/title, biography, experience, practice areas, contact CTA, related Lawyers, Footer.
- **Primary actions**: Open Consultation form; contact via floating widget.
- **Secondary actions**: Return to Lawyers list.
- **Required data**: One published Lawyer Profile (biography, experience, qualifications, practice areas, portrait, title).
- **Related FR**: `FR-LAW-002`, `FR-WEB-002`
- **Related UC**: `UC-LAW-002`
- **Related US**: `US-LAW-002`
- **Related AC**: `AC-LAW-002`
- **Permission**: Public read of publicly eligible profiles only
- **Responsive priority**: High
- **Status**: REQUIRED

### `PUB-004` / `PUB-005` — Personal / Corporate Legal Services
- **Route candidate**: `/services/personal`, `/services/corporate`
- **Actor**: Guest
- **Purpose**: Present the practice-area catalog for the selected client segment.
- **Main components**: Header/nav, segment intro, `ServiceCard` grid, Footer.
- **Primary actions**: Select a service to view `PUB-006`.
- **Secondary actions**: Open Consultation form.
- **Required data**: Published Service content list for the selected segment.
- **Related FR**: `FR-WEB-002`, `FR-CMS-001`
- **Related UC**: `UC-WEB-002`
- **Related US**: `US-WEB-002`
- **Related AC**: `AC-WEB-002`
- **Permission**: Public read
- **Responsive priority**: High
- **Status**: REQUIRED (`PUB-005` bounded by `LI-06`: navigation/content only, no B2B workflow)

### `PUB-006` — Service Detail
- **Route candidate**: `/services/{category}/{slug}`
- **Actor**: Guest
- **Purpose**: Explain one legal service and the litigation process.
- **Main components**: Header/nav, service title/description, 4-stage Litigation Process, related Case Studies, related Lawyers, consultation CTA, Footer.
- **Primary actions**: Open Consultation form.
- **Secondary actions**: Navigate to a related Case Study or Lawyer.
- **Required data**: One published Service item; related Case Studies/Lawyers if tagged.
- **Related FR**: `FR-WEB-002`, `FR-WEB-004`, `FR-CMS-001`
- **Related UC**: `UC-WEB-002`
- **Related US**: `US-WEB-002`
- **Related AC**: `AC-WEB-002`
- **Permission**: Public read
- **Responsive priority**: High
- **Status**: REQUIRED

### `PUB-007` — Case Studies
- **Route candidate**: `/case-studies`
- **Actor**: Guest
- **Purpose**: Demonstrate outcomes via anonymized summaries.
- **Main components**: Header/nav, `CaseStudyCard` grid, Footer.
- **Primary actions**: Select a Case Study to view `PUB-008`.
- **Secondary actions**: Navigate to Services.
- **Required data**: Published, anonymized, approved Case Studies.
- **Related FR**: `FR-CMS-003`, `FR-WEB-002`
- **Related UC**: — (public consumption covered by `FR-WEB-002`)
- **Related US**: —
- **Related AC**: `AC-CMS-002` (publication rule)
- **Permission**: Public read of approved, anonymized content only
- **Responsive priority**: Medium
- **Status**: REQUIRED

### `PUB-008` — Case Study Detail
- **Route candidate**: `/case-studies/{slug}`
- **Actor**: Guest
- **Purpose**: Present Background / Challenge / Legal Strategy / Result for one case.
- **Main components**: Header/nav, four-section content layout, related Service/Lawyer, consultation CTA, Footer.
- **Primary actions**: Open Consultation form.
- **Secondary actions**: Return to Case Studies.
- **Required data**: One published, anonymized Case Study.
- **Related FR**: `FR-CMS-003`, `FR-WEB-002`
- **Related AC**: `AC-CMS-002`
- **Permission**: Public read
- **Responsive priority**: Medium
- **Status**: REQUIRED

### `PUB-009` — Legal Insights / Blog
- **Route candidate**: `/insights`
- **Actor**: Guest
- **Purpose**: Publish legal knowledge content for SEO and trust-building.
- **Main components**: Header/nav, post list/grid with pagination, category/tag filter (if content model supports it), Footer.
- **Primary actions**: Select a post to view `PUB-010`.
- **Secondary actions**: Filter/paginate.
- **Required data**: Published Blog posts (title, excerpt, date, author).
- **Related FR**: `FR-CMS-002`, `FR-WEB-001`
- **Related UC**: `UC-CMS-001` (publication consumption side)
- **Related US**: `US-CMS-001`
- **Related AC**: `AC-CMS-001`
- **Permission**: Public read
- **Responsive priority**: Medium
- **Status**: REQUIRED

### `PUB-010` — Blog Detail
- **Route candidate**: `/insights/{slug}`
- **Actor**: Guest
- **Purpose**: Present one Blog post with SEO metadata and structured data.
- **Main components**: Header/nav, article body, author/date, SEO `<head>` tags + JSON-LD, related posts, Footer.
- **Primary actions**: Read article; navigate to related content.
- **Secondary actions**: Open Consultation form.
- **Required data**: One published Blog post; associated SEO Metadata.
- **Related FR**: `FR-CMS-002`, `FR-SEO-001`, `FR-SEO-002`
- **Related UC**: `UC-SEO-002`
- **Related US**: `US-SEO-002`
- **Related AC**: `AC-SEO-002`
- **Permission**: Public read
- **Responsive priority**: Medium
- **Status**: REQUIRED

### `PUB-011` — Contact
- **Route candidate**: `/contact`
- **Actor**: Guest
- **Purpose**: Consolidate every way to reach the firm.
- **Main components**: Header/nav, firm contact info, embedded Consultation form (`PUB-012`), Zalo/Messenger/hotline actions, map/address (content TBD), Footer.
- **Primary actions**: Submit consultation form; use an external channel action.
- **Secondary actions**: —
- **Required data**: Firm contact details; consultation form fields.
- **Related FR**: `FR-WEB-003`
- **Related UC**: `UC-WEB-004`
- **Related US**: `US-WEB-004`
- **Related AC**: `AC-WEB-004`
- **Permission**: Public read/write
- **Responsive priority**: High
- **Status**: REQUIRED

### `PUB-012` — Consultation / Emergency Lead Form
- **Route candidate**: Embedded in `PUB-011`; surfaced as CTA/modal on `PUB-001`, `PUB-006`, and the floating widget
- **Actor**: Guest
- **Purpose**: Capture a consultation request as a centralized `WEBSITE` Lead.
- **Main components**: Form fields (name, contact info, legal issue description — exact set `UI-OQ-008`), consent/privacy notice, reCAPTCHA v3 control, submit button, success/error states.
- **Primary actions**: Submit form.
- **Secondary actions**: Dismiss modal (if surfaced as modal); switch to an external contact channel instead.
- **Required data**: Guest-entered contact/issue fields; anti-abuse token.
- **Related FR**: `FR-LEAD-001`, `FR-NOTI-001`
- **Related UC**: `UC-LEAD-001`
- **Related US**: `US-LEAD-001`
- **Related AC**: `AC-LEAD-001`
- **Permission**: Public write, anti-abuse gated
- **Responsive priority**: High
- **Status**: REQUIRED (field set `TBD`, `UI-OQ-008` / `OQ-20`)

## 3. Authentication Screens

### `AUTH-001` — Login
- **Route candidate**: `/login`
- **Actor**: `SUPER_ADMIN`, `LAWYER`, `LEGAL_ASSISTANT`, `CONTENT_CREATOR`
- **Purpose**: Authenticate into the internal workspace.
- **Main components**: Logo, email/username field, password field, submit button, (proposed) "Forgot password" link, error banner.
- **Primary actions**: Submit credentials.
- **Secondary actions**: Navigate to Forgot Password (PROPOSED).
- **Required data**: Credentials per approved authentication policy (`OQ-23`).
- **Related FR**: `FR-AUTH-001`
- **Related UC**: `UC-AUTH-001`
- **Related US**: `US-AUTH-001`
- **Related AC**: `AC-AUTH-001`
- **Permission**: Publicly reachable
- **Responsive priority**: High
- **Status**: REQUIRED

### `AUTH-002`–`AUTH-004` — Forgot Password / Verification Code / Reset Password
- **Route candidate**: `/forgot-password`, `/forgot-password/verify`, `/reset-password`
- **Actor**: Internal user
- **Purpose**: Recover access to a locked-out account.
- **Main components**: Email/identifier field; OTP/code field; new-password + confirm fields; policy hints.
- **Primary actions**: Request code; verify code; set new password.
- **Secondary actions**: Return to Login.
- **Required data**: Identifier, verification code, new password.
- **Related FR/UC/US/AC**: None confirmed — no Phase 1 traceability exists yet.
- **Permission**: Publicly reachable (token/code-gated for the reset step)
- **Responsive priority**: Medium
- **Status**: PROPOSED — see `UI-OQ-011`; must not be implemented as a committed feature until `OQ-23` is resolved.

### `AUTH-005` — Unauthorized / Access Denied
- **Route candidate**: Shared state/route reached from any internal page (`/403`)
- **Actor**: Authenticated internal user without sufficient permission
- **Purpose**: Communicate denial safely without disclosing protected information.
- **Main components**: Denial message, "return to Dashboard" action, (optional) contact-admin note.
- **Primary actions**: Return to a permitted page.
- **Secondary actions**: Log out.
- **Required data**: None (must not echo the denied resource's protected data).
- **Related FR**: `FR-AUTH-004`
- **Related UC**: `UC-AUTH-004`
- **Related US**: `US-AUTH-004`
- **Related AC**: `AC-AUTH-004`
- **Permission**: Any authenticated role (as denial target)
- **Responsive priority**: Medium
- **Status**: REQUIRED

## 4. Dashboard

### `DASH-001` — Dashboard
- **Route candidate**: `/app/dashboard`
- **Actor**: `SUPER_ADMIN` (confirmed); other roles `TBD`
- **Purpose**: Role-appropriate operational summary.
- **Main components**: KPI/stat tiles (active Leads, open Cases, upcoming Appointments, etc.), recent-activity list, quick links to Leads/Cases/Appointments, Notification Center entry point.
- **Primary actions**: Navigate to a summarized module (Leads/Cases/Appointments).
- **Secondary actions**: Adjust date range/filter (once `OQ-22` resolved).
- **Required data**: Aggregated counts scoped to the actor's permitted records.
- **Related FR**: `FR-DASH-001`
- **Related UC**: `UC-DASH-001`
- **Related US**: `US-DASH-001`
- **Related AC**: `AC-DASH-001`
- **Permission**: `SUPER_ADMIN` confirmed; other roles `TBD` (`OQ-04`, `OQ-22`, `UI-OQ-009`)
- **Responsive priority**: Medium
- **Status**: REQUIRED

## 5. Lead Management Screens

### `LEAD-001` — Leads
- **Route candidate**: `/app/leads`
- **Actor**: `SUPER_ADMIN`, `LEGAL_ASSISTANT`, assigned `LAWYER`
- **Purpose**: List and triage permitted Leads.
- **Main components**: Filter bar (status, source, assignee), `LeadStatusBadge`-annotated table/list, pagination, "New Lead" action (internal intake), empty state.
- **Primary actions**: Open a Lead; create a manually registered Lead (`UC-LEAD-005`).
- **Secondary actions**: Filter/sort/search.
- **Required data**: Leads within actor's permitted scope (id, name, contact, source, status, assignee, created date).
- **Related FR**: `FR-LEAD-003`, `FR-LEAD-002`
- **Related UC**: `UC-LEAD-002`, `UC-LEAD-005`
- **Related US**: `US-LEAD-002`, `US-LEAD-005`
- **Related AC**: `AC-LEAD-002`, `AC-LEAD-005`
- **Permission**: Record-scope per `OQ-04`
- **Responsive priority**: Medium
- **Status**: REQUIRED

### `LEAD-002` — Lead Detail
- **Route candidate**: `/app/leads/{id}`
- **Actor**: `SUPER_ADMIN`, `LEGAL_ASSISTANT`, assigned `LAWYER`
- **Purpose**: View, follow up, assign, and progress a single Lead; convert to Case.
- **Main components**: Lead summary header (name, contact, source, `LeadStatusBadge`), follow-up notes timeline, assignment control, status-transition control, "Convert to Case" action (enabled only when `QUALIFIED`), linked Appointments, linked pre-litigation Documents panel.
- **Primary actions**: Add follow-up note; change status; assign; convert to Case; schedule Appointment.
- **Secondary actions**: Upload pre-litigation document.
- **Required data**: One Lead's full record within permitted scope; assignable users; appointment/document associations.
- **Related FR**: `FR-LEAD-003`, `FR-LEAD-004`, `FR-CASE-001`, `FR-DOC-001`, `FR-DOC-002`
- **Related UC**: `UC-LEAD-002`, `UC-LEAD-003`, `UC-LEAD-004`, `UC-CASE-001`
- **Related US**: `US-LEAD-002`, `US-LEAD-003`, `US-LEAD-004`, `US-CASE-001`
- **Related AC**: `AC-LEAD-002`, `AC-LEAD-003`, `AC-LEAD-004`, `AC-CASE-001`
- **Permission**: Record-scope per `OQ-04`
- **Responsive priority**: High (staff frequently triage on the move)
- **Status**: REQUIRED

## 6. Appointment Screens

### `APP-001` — Appointments
- **Route candidate**: `/app/appointments`
- **Actor**: `SUPER_ADMIN`, `LAWYER`, `LEGAL_ASSISTANT`
- **Purpose**: List permitted Appointments; create new.
- **Main components**: Filter bar (status, type, date range), list/table (list confirmed; calendar view `UI-OQ-013`), "New Appointment" action, empty state.
- **Primary actions**: Open an Appointment; create a new Appointment.
- **Secondary actions**: Filter/sort.
- **Required data**: Appointments within actor's scope (type, status, schedule, linked Lead/Case).
- **Related FR**: `FR-APP-001`, `FR-APP-002`
- **Related UC**: `UC-APP-001`, `UC-APP-002`
- **Related US**: `US-APP-001`, `US-APP-002`
- **Related AC**: `AC-APP-001`, `AC-APP-002`
- **Permission**: `SUPER_ADMIN` all; `LAWYER` own; `LEGAL_ASSISTANT` coordinate
- **Responsive priority**: Medium
- **Status**: REQUIRED

### `APP-002` — Appointment Detail
- **Route candidate**: `/app/appointments/{id}` (also reachable as a create/edit modal from `APP-001`, `LEAD-002`, `CASE-002`)
- **Actor**: Same as `APP-001`
- **Purpose**: View/edit one Appointment and its status.
- **Main components**: Type selector (`ONLINE`/`OFFLINE`/`PHONE_CALL`), schedule fields, linked Lead/Case reference, status control (`PENDING`/`CONFIRMED`/`COMPLETED`/`CANCELED`), location/link field.
- **Primary actions**: Save changes; update status.
- **Secondary actions**: Cancel appointment; navigate to linked Lead/Case.
- **Required data**: One Appointment's full record.
- **Related FR**: `FR-APP-001`, `FR-APP-002`
- **Related UC**: `UC-APP-001`, `UC-APP-002`
- **Related US**: `US-APP-001`, `US-APP-002`
- **Related AC**: `AC-APP-001`, `AC-APP-002`
- **Permission**: Same as `APP-001`
- **Responsive priority**: Medium
- **Status**: REQUIRED

## 7. Case Management Screens

### `CASE-001` — Cases
- **Route candidate**: `/app/cases`
- **Actor**: `SUPER_ADMIN`, assigned `LAWYER`
- **Purpose**: List permitted Cases.
- **Main components**: Filter bar, table/list with status indicator, pagination, empty state.
- **Primary actions**: Open a Case.
- **Secondary actions**: Filter/sort.
- **Required data**: Cases within actor's permitted scope.
- **Related FR**: `FR-CASE-002`
- **Related UC**: `UC-CASE-002`
- **Related US**: `US-CASE-002`
- **Related AC**: `AC-CASE-002`
- **Permission**: `SUPER_ADMIN` all; `LAWYER` assigned only
- **Responsive priority**: Medium
- **Status**: REQUIRED

### `CASE-002` — Case Detail
- **Route candidate**: `/app/cases/{id}`
- **Actor**: `SUPER_ADMIN`, assigned `LAWYER`
- **Purpose**: Maintain Case info, activities, lawyer assignments, appointments, and documents.
- **Main components**: Case summary header (title, status indicator — set `TBD`, `UI-OQ-015`), assigned-lawyers panel, activity timeline (`CaseActivity` entries), linked Appointments, Documents panel (upload/list/download), linked originating Lead.
- **Primary actions**: Add activity entry; assign/reassign lawyer; upload document; update Case status (once `OQ-03` resolved).
- **Secondary actions**: Schedule Appointment from Case; navigate to originating Lead.
- **Required data**: One Case's full record; assignable lawyers; activities; documents; appointments.
- **Related FR**: `FR-CASE-002`, `FR-CASE-003`, `FR-DOC-001`, `FR-DOC-002`
- **Related UC**: `UC-CASE-002`, `UC-CASE-003`, `UC-DOC-001`, `UC-DOC-002`
- **Related US**: `US-CASE-002`, `US-CASE-003`, `US-DOC-001`, `US-DOC-002`
- **Related AC**: `AC-CASE-002`, `AC-CASE-003`, `AC-DOC-001`, `AC-DOC-002`
- **Permission**: Assigned `LAWYER`; `SUPER_ADMIN` view confirmed, edit `TBD` (`OQ-04`)
- **Responsive priority**: Medium
- **Status**: REQUIRED (Case status set `TBD`, `OQ-03`/`UI-OQ-015`)

## 8. Lawyer Management Screens (Internal)

### `LAW-001` — Lawyers (Internal)
- **Route candidate**: `/app/lawyers`
- **Actor**: Authorized internal user (`OQ-04`, `OQ-21`)
- **Purpose**: List all lawyer profiles, published and unpublished, for management.
- **Main components**: Table/grid with publish-state indicator, "New Lawyer" action, search/filter.
- **Primary actions**: Open a profile to edit; create new profile.
- **Secondary actions**: Toggle visibility inline (if permitted).
- **Required data**: All Lawyer Profiles regardless of visibility.
- **Related FR**: `FR-LAW-001`
- **Related UC**: `UC-LAW-001`
- **Related US**: `US-LAW-001`
- **Related AC**: `AC-LAW-001`
- **Permission**: `TBD` (`OQ-04`, `OQ-21`)
- **Responsive priority**: Low
- **Status**: REQUIRED

### `LAW-002` — Lawyer Editor
- **Route candidate**: `/app/lawyers/{id}/edit`, `/app/lawyers/new`
- **Actor**: Same as `LAW-001`
- **Purpose**: Create/update profile and control public visibility.
- **Main components**: Portrait upload, name/title, biography, experience, qualifications, practice-area tags, visibility toggle, save/publish actions.
- **Primary actions**: Save profile; toggle public visibility.
- **Secondary actions**: Preview public profile.
- **Required data**: Lawyer Profile fields; portrait asset.
- **Related FR**: `FR-LAW-001`, `FR-LAW-002`
- **Related UC**: `UC-LAW-001`
- **Related US**: `US-LAW-001`
- **Related AC**: `AC-LAW-001`
- **Permission**: `TBD` (`OQ-04`, `OQ-21`)
- **Responsive priority**: Low
- **Status**: REQUIRED

## 9. User Management Screens

### `USER-001` — Users
- **Route candidate**: `/app/users`
- **Actor**: `SUPER_ADMIN`
- **Purpose**: List internal users; manage access state.
- **Main components**: Table (name, email, role, active/inactive indicator), "New User" action, activate/deactivate control.
- **Primary actions**: Open a user to edit; create new user; toggle active state.
- **Secondary actions**: Filter by role/status.
- **Required data**: All internal users.
- **Related FR**: `FR-USER-001`, `FR-USER-002`
- **Related UC**: `UC-USER-001`, `UC-USER-002`, `UC-USER-003`
- **Related US**: `US-USER-001`–`US-USER-003`
- **Related AC**: `AC-USER-001`–`AC-USER-003`
- **Permission**: `SUPER_ADMIN`
- **Responsive priority**: Low
- **Status**: REQUIRED

### `USER-002` — User Editor
- **Route candidate**: `/app/users/{id}/edit`, `/app/users/new`
- **Actor**: `SUPER_ADMIN`
- **Purpose**: Create/update a user; assign role and permissions.
- **Main components**: Name/email fields, role selector (4 controlled roles only), temporary-password field (create), active-state toggle, save action.
- **Primary actions**: Save user; assign role.
- **Secondary actions**: Reset/reissue temporary password (once `OQ-23` resolved).
- **Required data**: Internal User fields; Role list.
- **Related FR**: `FR-USER-001`, `FR-USER-003`
- **Related UC**: `UC-USER-001`, `UC-USER-002`
- **Related US**: `US-USER-001`, `US-USER-002`
- **Related AC**: `AC-USER-001`, `AC-USER-002`
- **Permission**: `SUPER_ADMIN`
- **Responsive priority**: Low
- **Status**: REQUIRED

## 10. Content Management (CMS) Screens

### `CMS-001` / `CMS-003` / `CMS-005` — Content Lists (Services / Blog / Case Studies)
- **Route candidate**: `/app/content/services`, `/app/content/blog`, `/app/content/case-studies`
- **Actor**: `CONTENT_CREATOR` (Case Studies also permitted `LAWYER`)
- **Purpose**: List content items for management, including non-public drafts.
- **Main components**: Table/list with publish-state indicator, "New" action, search/filter.
- **Primary actions**: Open item to edit; create new item.
- **Secondary actions**: Filter by publish state.
- **Required data**: All content items of that type, regardless of publish state.
- **Related FR**: `FR-CMS-001` (Services), `FR-CMS-002` (Blog), `FR-CMS-003` (Case Studies)
- **Related UC**: `UC-CMS-003`, `UC-CMS-001`, `UC-CMS-002`
- **Related US**: `US-CMS-003`, `US-CMS-001`, `US-CMS-002`
- **Related AC**: `AC-CMS-003`, `AC-CMS-001`, `AC-CMS-002`
- **Permission**: `CONTENT_CREATOR`; Case Studies also `TBD` for `LAWYER` (`OQ-04`, `OQ-14`, `OQ-21`)
- **Responsive priority**: Low
- **Status**: REQUIRED

### `CMS-002` / `CMS-004` / `CMS-006` — Content Editors (Service / Blog / Case Study)
- **Route candidate**: `/app/content/services/{id}/edit`, `/app/content/blog/{id}/edit`, `/app/content/case-studies/{id}/edit` (+ `/new` variants)
- **Actor**: Same as corresponding list
- **Purpose**: Author content; for Case Studies, additionally complete anonymization/confidentiality review before publish.
- **Main components**: Rich-text/structured content fields (Case Study: Background/Challenge/Legal Strategy/Result), media upload, `SEO-001` panel, publish-state control, (Case Study only) review/approval checklist and publish gate.
- **Primary actions**: Save draft; publish (Case Study: only after approval evidence recorded).
- **Secondary actions**: Preview public rendering; unpublish (once `OQ-21` resolved).
- **Required data**: Content fields; SEO Metadata; (Case Study) review evidence.
- **Related FR**: `FR-CMS-001`/`FR-CMS-002`/`FR-CMS-003`, `FR-SEO-001`
- **Related UC**: `UC-CMS-003`/`UC-CMS-001`/`UC-CMS-002`, `UC-SEO-001`
- **Related US**: `US-CMS-003`/`US-CMS-001`/`US-CMS-002`, `US-SEO-001`
- **Related AC**: `AC-CMS-003`/`AC-CMS-001`/`AC-CMS-002`, `AC-SEO-001`
- **Permission**: Same as corresponding list
- **Responsive priority**: Low
- **Status**: REQUIRED (publish-state model `TBD`, `UI-OQ-010`)

### `SEO-001` — SEO Metadata Panel
- **Route candidate**: Embedded panel/tab within `CMS-002`, `CMS-004`, `CMS-006` — no independent route
- **Actor**: `CONTENT_CREATOR`
- **Purpose**: Maintain Meta Title, Meta Description, Canonical URL, Open Graph metadata for the content item being edited.
- **Main components**: Meta Title field (with character-count guidance), Meta Description field, Canonical URL field, Open Graph fields (title/description/image), live SERP-style preview.
- **Primary actions**: Save metadata alongside content.
- **Secondary actions**: Reset to auto-generated defaults (once defaults are approved, `OQ-21`).
- **Required data**: SEO Metadata fields bound to the parent content item.
- **Related FR**: `FR-SEO-001`
- **Related UC**: `UC-SEO-001`
- **Related US**: `US-SEO-001`
- **Related AC**: `AC-SEO-001`
- **Permission**: `CONTENT_CREATOR`; `TBD` (`OQ-04`, `OQ-21`)
- **Responsive priority**: Low
- **Status**: REQUIRED

## 11. Notification Screen

### `NOTI-001` — Notification Center
- **Route candidate**: Global header dropdown/panel on every internal page — no independent route
- **Actor**: Authorized internal recipient (`OQ-04`, `OQ-09`)
- **Purpose**: Surface real-time new-Lead notifications.
- **Main components**: Bell icon with unread indicator, dropdown list of `NotificationItem` entries, "view Lead" deep link, (if retained) mark-as-read control.
- **Primary actions**: Open a notification to view the related Lead.
- **Secondary actions**: Mark as read/dismiss (retention model `TBD`, `UI-OQ-014`).
- **Required data**: Real-time WebSocket notification events scoped to the recipient.
- **Related FR**: `FR-NOTI-001`
- **Related UC**: `UC-NOTI-001`
- **Related US**: `US-NOTI-001`
- **Related AC**: `AC-NOTI-001`
- **Permission**: `TBD` recipient roles (`OQ-04`, `OQ-09`)
- **Responsive priority**: Medium
- **Status**: REQUIRED

## 12. Audit Screens

### `AUDIT-001` — Audit Logs
- **Route candidate**: `/app/audit-logs`
- **Actor**: `SUPER_ADMIN`
- **Purpose**: List sensitive administrative Audit Events.
- **Main components**: Table (actor, action, entity, timestamp), filter bar (once filtering is approved), pagination, empty state.
- **Primary actions**: Open an Audit Event for full detail.
- **Secondary actions**: Filter/search (`TBD`).
- **Required data**: Retained Audit Events within approved retention policy.
- **Related FR**: `FR-AUDIT-002`
- **Related UC**: `UC-AUDIT-002`
- **Related US**: `US-AUDIT-002`
- **Related AC**: `AC-AUDIT-002`
- **Permission**: `SUPER_ADMIN`
- **Responsive priority**: Low
- **Status**: REQUIRED

### `AUDIT-002` — Audit Event Detail
- **Route candidate**: `/app/audit-logs/{id}`
- **Actor**: `SUPER_ADMIN`
- **Purpose**: Show one Audit Event's full attribute set.
- **Main components**: Actor, action, affected entity, previous value, new value, IP address, timestamp — read-only display.
- **Primary actions**: Return to Audit Logs list.
- **Secondary actions**: Navigate to affected entity, if still accessible and permitted.
- **Required data**: One Audit Event's full record.
- **Related FR**: `FR-AUDIT-001`, `FR-AUDIT-002`
- **Related UC**: `UC-AUDIT-001`, `UC-AUDIT-002`
- **Related US**: `US-AUDIT-001`, `US-AUDIT-002`
- **Related AC**: `AC-AUDIT-001`, `AC-AUDIT-002`
- **Permission**: `SUPER_ADMIN`
- **Responsive priority**: Low
- **Status**: REQUIRED

## 13. Screen Inventory Summary

| Module | Screens | Count |
|---|---|---:|
| Public Website | `PUB-001`–`PUB-012` | 12 |
| Authentication | `AUTH-001`–`AUTH-005` | 5 |
| Dashboard | `DASH-001` | 1 |
| Lead Management | `LEAD-001`, `LEAD-002` | 2 |
| Appointment | `APP-001`, `APP-002` | 2 |
| Case Management | `CASE-001`, `CASE-002` | 2 |
| Lawyer Management (Internal) | `LAW-001`, `LAW-002` | 2 |
| User Management | `USER-001`, `USER-002` | 2 |
| Content Management | `CMS-001`–`CMS-006` | 6 |
| SEO (embedded) | `SEO-001` | 1 |
| Notification (embedded) | `NOTI-001` | 1 |
| Audit | `AUDIT-001`, `AUDIT-002` | 2 |
| **Total** | | **38** |

## 14. Validation Record

- Every screen in the IA (§3–§5) has a corresponding entry here; no screen was invented beyond the IA baseline.
- Every screen references FR/UC/US/AC where Phase 1 traceability exists; screens without confirmed traceability (`AUTH-002`–`AUTH-004`) are explicitly marked PROPOSED.
- No duplicate screens exist for the same purpose; shared/embedded surfaces (`PUB-012`, `SEO-001`, `NOTI-001`, Document panels) are modeled once and reused rather than redefined per context.
- Responsive Priority is assigned for every screen per BRD Mobile First direction.
- Permission boundaries match the BRD/FRS actor boundaries exactly; unresolved boundaries cite `OQ-04`.

**Validation status:** Passed 2026-08-18.
