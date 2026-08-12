# User Stories

## Document Control

| Field               | Value                                                         |
| ------------------- | ------------------------------------------------------------- |
| Project             | Law Firm Website & Management System                          |
| Document            | User Stories                                                  |
| Document ID         | `US-05`                                                     |
| Version             | 1.0                                                           |
| Status              | Complete and validated baseline                               |
| Effective date      | 2026-08-12                                                    |
| Business authority  | [01-brd.md](01-brd.md)                                         |
| Functional baseline | [02-frs.md](02-frs.md)                                         |
| Quality baseline    | [03-nfr.md](03-nfr.md)                                         |
| Use Case baseline   | [04-use-case-specification.md](04-use-case-specification.md)   |
| Decision register   | [assumptions-open-questions.md](assumptions-open-questions.md) |

## Record of Changes

| Date       | Change type | In charge | Description                                                              |
| ---------- | ----------- | --------- | ------------------------------------------------------------------------ |
| 2026-08-12 | Added       | PhongNN   | Created and validated User Stories from approved Use Case Specification. |

## 1. Introduction and Rules

This document specifies the User Stories derived from the Use Case Specification (`UCS-04`) for the Phase 1 implementation. Each story represents a meaningful actor goal and business capability, remaining free of technical implementation, data structures, or acceptance criteria.

The following approved actors are used:

- Guest / Public Visitor
- `SUPER_ADMIN`
- `LAWYER`
- `LEGAL_ASSISTANT`
- `CONTENT_CREATOR`

## 2. Authentication & Access Control

### `US-AUTH-001` — Log In

- **Title**: Authenticate Internal User
- **Epic / Module**: Authentication & Access Control
- **Actor**: `SUPER_ADMIN`, `LAWYER`, `LEGAL_ASSISTANT`, or `CONTENT_CREATOR`
- **Story**: As an authorized internal user, I want to securely log in to the management system with my credentials, so that I can access my permitted tools and information.
- **Business Value**: Protects sensitive firm data from unauthorized access while enabling staff to perform their duties.
- **Priority**: High
- **Preconditions**: The user has an active, eligible account.
- **Related Use Case(s)**: `UC-AUTH-001`
- **Related FR(s)**: `FR-AUTH-001`
- **Related NFR(s)**: `NFR-SEC-001`, `NFR-AUTH-001`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-02`, `SEC-03`, `BO-03`
- **Related Open Question(s)**: `OQ-04`, `OQ-23`
- **Dependencies / Notes**: Must be completed before any other internal functionality.

### `US-AUTH-002` — Refresh Session

- **Title**: Maintain Secure Session
- **Epic / Module**: Authentication & Access Control
- **Actor**: Authenticated internal user
- **Story**: As an authenticated internal user, I want my active session to refresh automatically or upon request when safely permitted, so that my work is not interrupted unnecessarily.
- **Business Value**: Improves user experience and productivity without compromising security standards.
- **Priority**: Medium
- **Preconditions**: A valid refresh context exists for an eligible user.
- **Related Use Case(s)**: `UC-AUTH-002`
- **Related FR(s)**: `FR-AUTH-003`, `FR-AUTH-004`
- **Related NFR(s)**: `NFR-AUTH-001`, `NFR-AUTH-002`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-02`, `SEC-03`
- **Related Open Question(s)**: `OQ-04`, `OQ-23`
- **Dependencies / Notes**: Depends on session and token policies.

### `US-AUTH-003` — Log Out

- **Title**: Terminate Session
- **Epic / Module**: Authentication & Access Control
- **Actor**: Authenticated internal user
- **Story**: As an authenticated internal user, I want to safely end my current session, so that my access cannot be used by anyone else on the same device.
- **Business Value**: Prevents unauthorized access and protects client confidentiality.
- **Priority**: High
- **Preconditions**: The user has an authenticated session.
- **Related Use Case(s)**: `UC-AUTH-003`
- **Related FR(s)**: `FR-AUTH-002`
- **Related NFR(s)**: `NFR-AUTH-001`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-02`, `SEC-03`
- **Related Open Question(s)**: `OQ-23`
- **Dependencies / Notes**: Must safely terminate or invalidate access tokens.

### `US-AUTH-004` — Role-based Access Control

- **Title**: Enforce Permitted Access
- **Epic / Module**: Authentication & Access Control
- **Actor**: Authenticated internal user
- **Story**: As an authenticated internal user, I want the system to enforce my approved role and record scope, so that I only see and modify what I am authorized to access.
- **Business Value**: Enforces the principle of least privilege, meeting security and privacy commitments.
- **Priority**: High
- **Preconditions**: The user is authenticated and attempts a protected action.
- **Related Use Case(s)**: `UC-AUTH-004`
- **Related FR(s)**: `FR-AUTH-004`
- **Related NFR(s)**: `NFR-AUTH-001`, `NFR-AUTH-002`, `NFR-PRIV-001`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-02`, `FE-03`, `SEC-03`, `SEC-04`
- **Related Open Question(s)**: `OQ-04`
- **Dependencies / Notes**: Encompasses cross-cutting RBAC constraints.

## 3. User Administration

### `US-USER-001` — Create Internal User

- **Title**: Provision New Staff Account
- **Epic / Module**: User Administration
- **Actor**: `SUPER_ADMIN`
- **Story**: As a SUPER_ADMIN, I want to create a new internal user with a designated role, so that a new staff member can access the system with appropriate permissions.
- **Business Value**: Enables staff onboarding and proper delegation of responsibilities.
- **Priority**: High
- **Preconditions**: `SUPER_ADMIN` is authorized for user management.
- **Related Use Case(s)**: `UC-USER-001`
- **Related FR(s)**: `FR-USER-001`, `FR-USER-003`
- **Related NFR(s)**: `NFR-AUTH-002`, `NFR-AUD-001`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-03`, `SEC-03`, `SEC-05`, `BO-03`
- **Related Open Question(s)**: `OQ-04`, `OQ-17`, `OQ-23`
- **Dependencies / Notes**: None

### `US-USER-002` — Update Internal User

- **Title**: Manage Staff Account Details
- **Epic / Module**: User Administration
- **Actor**: `SUPER_ADMIN`
- **Story**: As a SUPER_ADMIN, I want to update an internal user's profile and permissions, so that their access reflects their current role and responsibilities.
- **Business Value**: Keeps access control aligned with organizational changes and ensures accurate staff records.
- **Priority**: High
- **Preconditions**: The target user exists.
- **Related Use Case(s)**: `UC-USER-002`
- **Related FR(s)**: `FR-USER-001`, `FR-USER-003`
- **Related NFR(s)**: `NFR-AUTH-002`, `NFR-AUD-001`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-03`, `SEC-03`, `SEC-05`, `BO-03`
- **Related Open Question(s)**: `OQ-04`, `OQ-17`, `OQ-23`
- **Dependencies / Notes**: Cannot introduce unapproved roles.

### `US-USER-003` — Activate / Deactivate User

- **Title**: Control Account Lifecycle
- **Epic / Module**: User Administration
- **Actor**: `SUPER_ADMIN`
- **Story**: As a SUPER_ADMIN, I want to activate or deactivate a user account, so that I can immediately suspend access for departed staff or enable it for returning staff.
- **Business Value**: Prevents unauthorized access by former employees, mitigating security risks.
- **Priority**: High
- **Preconditions**: The target user exists.
- **Related Use Case(s)**: `UC-USER-003`
- **Related FR(s)**: `FR-USER-002`, `FR-AUTH-001`, `FR-AUTH-003`
- **Related NFR(s)**: `NFR-AUTH-001`, `NFR-AUTH-002`, `NFR-AUD-001`
- **Related BRD Reference**: `FE-02`, `FE-03`, `SEC-03`, `SEC-05`
- **Related Open Question(s)**: `OQ-04`, `OQ-17`, `OQ-23`
- **Dependencies / Notes**: Must immediately block login and subsequent refreshes.

## 4. Lawyer Management

### `US-LAW-001` — Manage Lawyer Profile

- **Title**: Maintain Lawyer Information
- **Epic / Module**: Lawyer Management
- **Actor**: Authorized internal user
- **Story**: As an authorized internal user, I want to maintain the biography, experience, portrait, and visibility of a lawyer, so that accurate professional information can be published on the website.
- **Business Value**: Builds trust with potential clients by showcasing the firm's expertise and professional team.
- **Priority**: High
- **Preconditions**: The actor has permission for the profile.
- **Related Use Case(s)**: `UC-LAW-001`
- **Related FR(s)**: `FR-LAW-001`, `FR-LAW-002`
- **Related NFR(s)**: `NFR-AUTH-002`, `NFR-AUD-001`, `NFR-PRIV-001`
- **Related BRD Reference**: `FE-04`, `FE-09`, `WEB-03`, `SEC-04`, `BO-01`, `BO-03`
- **Related Open Question(s)**: `OQ-04`, `OQ-21`, `OQ-25`
- **Dependencies / Notes**: Visibility controls must prevent publishing incomplete or unapproved profiles.

### `US-LAW-002` — View Lawyer Profile

- **Title**: Browse Lawyer Expertise
- **Epic / Module**: Lawyer Management
- **Actor**: Guest / Public Visitor
- **Story**: As a Guest, I want to view the professional profile of a lawyer, so that I can evaluate their expertise and decide if they are suited for my case.
- **Business Value**: Encourages client inquiries by establishing credibility.
- **Priority**: High
- **Preconditions**: The lawyer profile is published.
- **Related Use Case(s)**: `UC-LAW-002`
- **Related FR(s)**: `FR-LAW-002`, `FR-WEB-002`
- **Related NFR(s)**: `NFR-PRIV-001`, `NFR-A11Y-002`, `NFR-RWD-001`, `NFR-SEO-001`
- **Related BRD Reference**: `FE-01`, `FE-04`, `WEB-03`, `SEC-04`, `BO-01`
- **Related Open Question(s)**: `OQ-21`, `OQ-25`
- **Dependencies / Notes**: Relies on `US-WEB-003` (View Lawyers List).

## 5. Lead Intake & Qualification

### `US-LEAD-001` — Submit Website Lead

- **Title**: Request Consultation Online
- **Epic / Module**: Lead Intake & Qualification
- **Actor**: Guest / Public Visitor
- **Story**: As a Guest, I want to submit a consultation request form with my legal issue, so that the firm can contact me and assess my case.
- **Business Value**: Captures potential new business 24/7 directly from the primary digital channel.
- **Priority**: High
- **Preconditions**: Form submission uses approved anti-abuse measures.
- **Related Use Case(s)**: `UC-LEAD-001`
- **Related FR(s)**: `FR-LEAD-001`, `FR-NOTI-001`
- **Related NFR(s)**: `NFR-SEC-001`, `NFR-SEC-002`, `NFR-PRIV-001`, `NFR-PRIV-002`, `NFR-A11Y-001`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-01`, `FE-05`, `FE-12`, `SEC-02`, `SEC-04`, `BO-02`, `BO-03`
- **Related Open Question(s)**: `OQ-06`, `OQ-09`, `OQ-12`, `OQ-20`, `OQ-24`
- **Dependencies / Notes**: Generates a `NEW` lead with source `WEBSITE`.

### `US-LEAD-002` — View / Manage Lead

- **Title**: Review and Follow Up Lead
- **Epic / Module**: Lead Intake & Qualification
- **Actor**: `LEGAL_ASSISTANT` or assigned `LAWYER`
- **Story**: As an authorized staff member, I want to view a Lead's details and record follow-up notes, so that I can accurately track communications and assess the potential client's needs.
- **Business Value**: Centralizes client history and improves the efficiency and quality of the intake process.
- **Priority**: High
- **Preconditions**: Lead exists and the actor is permitted to view it.
- **Related Use Case(s)**: `UC-LEAD-002`
- **Related FR(s)**: `FR-LEAD-003`
- **Related NFR(s)**: `NFR-AUTH-002`, `NFR-PRIV-001`, `NFR-AUD-001`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-05`, `SEC-03`, `SEC-04`, `BO-03`
- **Related Open Question(s)**: `OQ-04`, `OQ-06`, `OQ-15`
- **Dependencies / Notes**: Access is strictly scoped by role and assignment.

### `US-LEAD-003` — Assign Lead

- **Title**: Delegate Lead Responsibility
- **Epic / Module**: Lead Intake & Qualification
- **Actor**: `LEGAL_ASSISTANT`
- **Story**: As a LEGAL_ASSISTANT, I want to assign a Lead to a specific lawyer or staff member, so that the correct person is accountable for the next steps in the consultation.
- **Business Value**: Ensures clear accountability and prevents inquiries from being ignored.
- **Priority**: High
- **Preconditions**: The actor has assignment authority.
- **Related Use Case(s)**: `UC-LEAD-003`
- **Related FR(s)**: `FR-LEAD-003`
- **Related NFR(s)**: `NFR-AUTH-002`, `NFR-AUD-001`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-05`, `SEC-03`, `SEC-04`, `BO-03`
- **Related Open Question(s)**: `OQ-04`
- **Dependencies / Notes**: Affects RBAC rules for the assigned user.

### `US-LEAD-004` — Update Lead Status

- **Title**: Track Intake Progress
- **Epic / Module**: Lead Intake & Qualification
- **Actor**: `LEGAL_ASSISTANT` or assigned `LAWYER`
- **Story**: As an authorized staff member, I want to update the status of a Lead (e.g., to CONTACTED or QUALIFIED), so that the team knows exactly where the prospect is in the intake lifecycle.
- **Business Value**: Provides a clear funnel view of prospective business and supports standardized intake workflows.
- **Priority**: High
- **Preconditions**: The Lead exists and the transition is permitted.
- **Related Use Case(s)**: `UC-LEAD-004`
- **Related FR(s)**: `FR-LEAD-004`, `FR-CASE-001`
- **Related NFR(s)**: `NFR-AUTH-002`, `NFR-REL-001`, `NFR-AUD-001`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-05`, `FE-07`, `SEC-03`, `BO-02`, `BO-03`
- **Related Open Question(s)**: `OQ-04`, `OQ-05`, `OQ-15`
- **Dependencies / Notes**: `CONVERTED` is reserved for successful conversion via `US-CASE-001`.

### `US-LEAD-005` — Register External-source Lead

- **Title**: Centralize Off-Platform Inquiries
- **Epic / Module**: Lead Intake & Qualification
- **Actor**: `LEGAL_ASSISTANT`
- **Story**: As a LEGAL_ASSISTANT, I want to manually register an inquiry received via Zalo, Facebook, Hotline, or Referral, so that all potential business is tracked in one central system.
- **Business Value**: Prevents fragmented tracking and provides a comprehensive view of all marketing channels.
- **Priority**: High
- **Preconditions**: External inquiry information is provided by staff.
- **Related Use Case(s)**: `UC-LEAD-005`
- **Related FR(s)**: `FR-LEAD-002`, `FR-NOTI-001`
- **Related NFR(s)**: `NFR-AUTH-002`, `NFR-PRIV-002`, `NFR-REL-001`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-01`, `FE-05`, `FE-12`, `SEC-04`, `BO-02`, `BO-03`
- **Related Open Question(s)**: `OQ-04`, `OQ-06`, `OQ-09`, `OQ-12`, `OQ-13`, `OQ-20`
- **Dependencies / Notes**: Uses only controlled sources.

## 6. Appointment Management

### `US-APP-001` — Create Appointment

- **Title**: Schedule Client Meeting
- **Epic / Module**: Appointment Management
- **Actor**: `LEGAL_ASSISTANT`
- **Story**: As a LEGAL_ASSISTANT, I want to schedule a meeting (online, offline, or phone) for a Lead or Case, so that consultations and legal work are formally coordinated.
- **Business Value**: Standardizes the scheduling process and improves firm responsiveness to client needs.
- **Priority**: High
- **Preconditions**: Required participant and scheduling data is available.
- **Related Use Case(s)**: `UC-APP-001`
- **Related FR(s)**: `FR-APP-001`, `FR-APP-002`
- **Related NFR(s)**: `NFR-AUTH-002`, `NFR-PRIV-001`, `NFR-REL-001`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-06`, `SEC-03`, `SEC-04`, `BO-03`
- **Related Open Question(s)**: `OQ-04`, `OQ-16`, `OQ-24`
- **Dependencies / Notes**: Must relate the appointment to the relevant record.

### `US-APP-002` — Update Appointment Status

- **Title**: Track Meeting Execution
- **Epic / Module**: Appointment Management
- **Actor**: `LEGAL_ASSISTANT`
- **Story**: As a LEGAL_ASSISTANT, I want to update the status of an appointment (e.g., CONFIRMED, COMPLETED, CANCELED), so that the team knows if the meeting took place.
- **Business Value**: Keeps schedules accurate and identifies dropped or missed consultations.
- **Priority**: High
- **Preconditions**: The appointment exists and actor has update authority.
- **Related Use Case(s)**: `UC-APP-002`
- **Related FR(s)**: `FR-APP-001`, `FR-APP-002`
- **Related NFR(s)**: `NFR-AUTH-002`, `NFR-PRIV-001`, `NFR-AUD-001`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-06`, `SEC-03`, `SEC-04`, `BO-03`
- **Related Open Question(s)**: `OQ-04`, `OQ-16`, `OQ-24`
- **Dependencies / Notes**: Rescheduling rules depend on `OQ-16`.

## 7. Case Management

### `US-CASE-001` — Create / Convert to Case

- **Title**: Open Legal Case from Lead
- **Epic / Module**: Case Management
- **Actor**: Authorized internal user
- **Story**: As an authorized internal user, I want to convert a qualified Lead into a new Case, so that we can formally begin legal work and transition from intake to service delivery.
- **Business Value**: Links sales and service seamlessly, preventing data loss between qualification and formal engagement.
- **Priority**: High
- **Preconditions**: The Lead is qualified.
- **Related Use Case(s)**: `UC-CASE-001`
- **Related FR(s)**: `FR-CASE-001`, `FR-LEAD-004`
- **Related NFR(s)**: `NFR-AUTH-002`, `NFR-REL-001`, `NFR-AUD-001`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-05`, `FE-07`, `SEC-03`, `SEC-04`, `BO-03`
- **Related Open Question(s)**: `OQ-03`, `OQ-04`, `OQ-05`, `OQ-06`
- **Dependencies / Notes**: Must atomically mark the lead as `CONVERTED`.

### `US-CASE-002` — Manage Case

- **Title**: Maintain Case Details
- **Epic / Module**: Case Management
- **Actor**: Assigned `LAWYER`
- **Story**: As an assigned LAWYER, I want to record case details, statuses, and activities, so that the firm maintains a secure, up-to-date record of the legal matter's progress.
- **Business Value**: Ensures the firm has a central source of truth for ongoing legal matters and mitigates risk from undocumented work.
- **Priority**: High
- **Preconditions**: The case exists and the actor is assigned to it.
- **Related Use Case(s)**: `UC-CASE-002`
- **Related FR(s)**: `FR-CASE-002`, `FR-CASE-003`
- **Related NFR(s)**: `NFR-AUTH-002`, `NFR-DATA-001`, `NFR-AUD-001`, `NFR-PRIV-001`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-07`, `SEC-03`, `SEC-04`, `SEC-05`, `BO-03`
- **Related Open Question(s)**: `OQ-03`, `OQ-04`, `OQ-17`
- **Dependencies / Notes**: Relies heavily on `OQ-03` for lifecycle states.

### `US-CASE-003` — Assign Lawyers to Case

- **Title**: Allocate Legal Team
- **Epic / Module**: Case Management
- **Actor**: Authorized internal user
- **Story**: As an authorized user, I want to assign or reassign lawyers to a Case, so that responsibility is clear and the assigned lawyers receive necessary system access.
- **Business Value**: Facilitates firm collaboration and strictly controls who has access to confidential case files.
- **Priority**: High
- **Preconditions**: The case exists and the actor has assignment authority.
- **Related Use Case(s)**: `UC-CASE-003`
- **Related FR(s)**: `FR-CASE-002`
- **Related NFR(s)**: `NFR-AUTH-002`, `NFR-AUD-001`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-07`, `SEC-03`, `SEC-04`, `BO-03`
- **Related Open Question(s)**: `OQ-03`, `OQ-04`
- **Dependencies / Notes**: Directly dictates `LAWYER` authorization to view the Case.

## 8. Secure Document Management

### `US-DOC-001` — Upload Document

- **Title**: Store Private File
- **Epic / Module**: Secure Document Management
- **Actor**: `LAWYER` or `LEGAL_ASSISTANT`
- **Story**: As an authorized staff member, I want to upload files (PDF, DOCX, JPG, PNG) and associate them with a Lead or Case, so that essential evidence and paperwork are safely stored.
- **Business Value**: Reduces reliance on scattered local files and ensures compliance with data protection policies.
- **Priority**: High
- **Preconditions**: Valid file format and size under 20MB. Target storage is configured (S3/MinIO).
- **Related Use Case(s)**: `UC-DOC-001`
- **Related FR(s)**: `FR-DOC-001`
- **Related NFR(s)**: `NFR-AUTH-002`, `NFR-DATA-001`, `NFR-FILE-001`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-08`, `SEC-03`, `SEC-04`, `SEC-06`, `BO-03`, `AS-03`
- **Related Open Question(s)**: `OQ-04`, `OQ-07`, `OQ-08`, `OQ-12`, `OQ-29`
- **Dependencies / Notes**: Must generate UUID filenames and store privately.

### `US-DOC-002` — Access / Download Document

- **Title**: Retrieve Protected File
- **Epic / Module**: Secure Document Management
- **Actor**: `LAWYER` or `LEGAL_ASSISTANT`
- **Story**: As an authorized staff member, I want to browse and securely download documents attached to my assigned cases, so that I can review necessary materials for my work.
- **Business Value**: Enables staff to execute legal duties while strictly maintaining client confidentiality.
- **Priority**: High
- **Preconditions**: User has record-scope access to the parent context.
- **Related Use Case(s)**: `UC-DOC-002`
- **Related FR(s)**: `FR-DOC-002`
- **Related NFR(s)**: `NFR-AUTH-002`, `NFR-FILE-001`, `NFR-FILE-002`, `NFR-PRIV-001`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-08`, `SEC-03`, `SEC-04`, `BO-03`
- **Related Open Question(s)**: `OQ-04`, `OQ-07`, `OQ-12`, `OQ-29`
- **Dependencies / Notes**: Must provide temporary/expiring access.

### `US-DOC-003` — Manage Document Metadata / Lifecycle

- **Title**: Apply Document Retention Policy
- **Epic / Module**: Secure Document Management
- **Actor**: Authorized internal user
- **Story**: As an authorized internal user, I want to manage a document's metadata and apply lifecycle actions (retention, legal hold, disposal), so that the firm complies with legal and operational data rules.
- **Business Value**: Mitigates legal risk by ensuring sensitive files are kept or destroyed according to policy.
- **Priority**: Medium
- **Preconditions**: Governing policies are approved.
- **Related Use Case(s)**: `UC-DOC-003`
- **Related FR(s)**: `FR-DOC-003`, `FR-DOC-001`, `FR-AUDIT-001`
- **Related NFR(s)**: `NFR-DATA-002`, `NFR-FILE-001`, `NFR-AUD-001`, `NFR-AUD-002`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-08`, `FE-13`, `SEC-04`, `SEC-05`, `BO-03`
- **Related Open Question(s)**: `OQ-04`, `OQ-07`, `OQ-08`, `OQ-12`, `OQ-17`
- **Dependencies / Notes**: Blocked from implementation until `OQ-07` and `OQ-08` are resolved.

## 9. Content Management

### `US-CMS-001` — Manage Blog Content

- **Title**: Publish Legal Insights
- **Epic / Module**: Content Management
- **Actor**: `CONTENT_CREATOR`
- **Story**: As a CONTENT_CREATOR, I want to write, edit, and publish blog articles, so that the firm can share legal knowledge and attract inbound traffic.
- **Business Value**: Drives SEO, builds brand authority, and engages potential clients.
- **Priority**: Medium
- **Preconditions**: Content is approved for publication.
- **Related Use Case(s)**: `UC-CMS-001`
- **Related FR(s)**: `FR-CMS-002`, `FR-SEO-001`
- **Related NFR(s)**: `NFR-AUTH-002`, `NFR-AUD-001`, `NFR-SEO-001`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-01`, `FE-09`, `FE-10`, `BO-01`
- **Related Open Question(s)**: `OQ-04`, `OQ-21`, `OQ-25`
- **Dependencies / Notes**: Relates directly to SEO management.

### `US-CMS-002` — Manage Case Study

- **Title**: Publish Firm Successes
- **Epic / Module**: Content Management
- **Actor**: `CONTENT_CREATOR` or permitted `LAWYER`
- **Story**: As a content author, I want to create and submit a Case Study for review, so that our past successes can be published after ensuring client confidentiality.
- **Business Value**: Demonstrates a track record of success to prospects while safely controlling sensitive information.
- **Priority**: Medium
- **Preconditions**: Content requires anonymization and formal review.
- **Related Use Case(s)**: `UC-CMS-002`
- **Related FR(s)**: `FR-CMS-003`, `FR-AUDIT-001`
- **Related NFR(s)**: `NFR-AUTH-002`, `NFR-PRIV-001`, `NFR-AUD-001`, `NFR-SEO-001`
- **Related BRD Reference**: `FE-09`, `WEB-05`, `SEC-04`, `BO-01`, `AS-02`
- **Related Open Question(s)**: `OQ-04`, `OQ-12`, `OQ-14`, `OQ-21`, `OQ-25`
- **Dependencies / Notes**: Must enforce an approval mechanism.

### `US-CMS-003` — Manage Service Content

- **Title**: Update Public Offerings
- **Epic / Module**: Content Management
- **Actor**: `CONTENT_CREATOR`
- **Story**: As a CONTENT_CREATOR, I want to update the descriptions and details of the firm's legal services, so that visitors always see accurate and current service offerings.
- **Business Value**: Ensures the firm's primary marketing message is accurate and manageable without developer intervention.
- **Priority**: High
- **Preconditions**: The content creator is authorized.
- **Related Use Case(s)**: `UC-CMS-003`
- **Related FR(s)**: `FR-CMS-001`, `FR-SEO-001`
- **Related NFR(s)**: `NFR-AUTH-002`, `NFR-AUD-001`, `NFR-SEO-001`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-01`, `FE-09`, `WEB-02`, `BO-01`, `BO-04`, `LI-06`
- **Related Open Question(s)**: `OQ-04`, `OQ-21`, `OQ-25`
- **Dependencies / Notes**: Future B2B workflows are excluded.

## 10. SEO Management

### `US-SEO-001` — Manage SEO Metadata

- **Title**: Optimize Content for Search
- **Epic / Module**: SEO Management
- **Actor**: `CONTENT_CREATOR`
- **Story**: As a CONTENT_CREATOR, I want to define Meta Titles, Descriptions, and Open Graph tags for public pages, so that our content ranks better on Google and looks professional when shared on social media.
- **Business Value**: Increases organic visibility and click-through rates.
- **Priority**: High
- **Preconditions**: Applicable to public CMS content.
- **Related Use Case(s)**: `UC-SEO-001`
- **Related FR(s)**: `FR-SEO-001`
- **Related NFR(s)**: `NFR-AUTH-002`, `NFR-SEO-001`, `NFR-SEO-002`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-09`, `FE-10`, `BO-01`
- **Related Open Question(s)**: `OQ-04`, `OQ-21`, `OQ-25`, `OQ-35`
- **Dependencies / Notes**: None

### `US-SEO-002` — Expose SEO Metadata

- **Title**: Provide Structured Data
- **Epic / Module**: SEO Management
- **Actor**: Guest / Public Visitor
- **Story**: As a Guest or search engine crawler, I want to receive accurate search metadata and JSON-LD structured data on public pages, so that the page content can be correctly indexed and displayed.
- **Business Value**: Ensures search engines understand the firm's services natively, leading to better local and service-based search placements.
- **Priority**: High
- **Preconditions**: Approved metadata values exist for the page.
- **Related Use Case(s)**: `UC-SEO-002`
- **Related FR(s)**: `FR-SEO-001`, `FR-SEO-002`, `FR-WEB-002`
- **Related NFR(s)**: `NFR-SEO-001`, `NFR-SEO-002`, `NFR-PRIV-001`
- **Related BRD Reference**: `FE-10`, `WEB-02`, `BO-01`
- **Related Open Question(s)**: `OQ-21`, `OQ-25`, `OQ-35`
- **Dependencies / Notes**: Cannot invent claims (e.g. fake ratings).

## 11. Public Website Experience

### `US-WEB-001` — Browse Public Website

- **Title**: Navigate Firm Information
- **Epic / Module**: Public Website Experience
- **Actor**: Guest / Public Visitor
- **Story**: As a Guest, I want to easily navigate between the Home, Services, Lawyers, Blog, and Contact pages, so that I can explore the firm's offerings without logging in.
- **Business Value**: Retains visitors by providing an intuitive, fast, and accessible digital front door.
- **Priority**: High
- **Preconditions**: None
- **Related Use Case(s)**: `UC-WEB-001`
- **Related FR(s)**: `FR-WEB-001`, `FR-WEB-002`, `FR-WEB-003`
- **Related NFR(s)**: `NFR-PERF-001`, `NFR-SEC-001`, `NFR-USE-001`, `NFR-A11Y-002`, `NFR-RWD-001`, `NFR-BROWSER-001`, `NFR-PRIV-001`
- **Related BRD Reference**: `FE-01`, `FE-09`, `WEB-01`–`WEB-05`, `BO-01`, `BO-02`, `BO-04`, `LI-06`
- **Related Open Question(s)**: `OQ-21`, `OQ-25`, `OQ-27`, `OQ-28`, `OQ-34`
- **Dependencies / Notes**: Must be fully responsive.

### `US-WEB-002` — View Legal Services

- **Title**: Learn About Litigation Process
- **Epic / Module**: Public Website Experience
- **Actor**: Guest / Public Visitor
- **Story**: As a Guest, I want to read details about specific legal services and the firm's litigation process, so that I know if the firm handles my type of problem.
- **Business Value**: Qualifies prospects early by educating them on the firm's scope.
- **Priority**: High
- **Preconditions**: Published service content exists.
- **Related Use Case(s)**: `UC-WEB-002`
- **Related FR(s)**: `FR-WEB-001`, `FR-WEB-002`, `FR-WEB-004`, `FR-CMS-001`
- **Related NFR(s)**: `NFR-PERF-001`, `NFR-A11Y-001`, `NFR-A11Y-002`, `NFR-RWD-001`, `NFR-SEO-001`
- **Related BRD Reference**: `FE-01`, `FE-09`, `WEB-02`, `WEB-04`, `BO-01`, `BO-02`, `BO-04`, `LI-06`
- **Related Open Question(s)**: `OQ-21`, `OQ-25`
- **Dependencies / Notes**: Depends on CMS content (`US-CMS-003`).

### `US-WEB-003` — View Lawyers

- **Title**: Browse Legal Team
- **Epic / Module**: Public Website Experience
- **Actor**: Guest / Public Visitor
- **Story**: As a Guest, I want to view a list of the firm's lawyers and their short summaries, so that I can see the caliber of the team before selecting one to view in detail.
- **Business Value**: Humanizes the firm and builds immediate trust.
- **Priority**: High
- **Preconditions**: At least one lawyer profile is published.
- **Related Use Case(s)**: `UC-WEB-003`
- **Related FR(s)**: `FR-WEB-002`, `FR-WEB-004`, `FR-LAW-002`
- **Related NFR(s)**: `NFR-PERF-001`, `NFR-A11Y-002`, `NFR-RWD-001`, `NFR-SEO-001`, `NFR-PRIV-001`
- **Related BRD Reference**: `FE-01`, `FE-04`, `WEB-03`, `BO-01`
- **Related Open Question(s)**: `OQ-21`, `OQ-25`
- **Dependencies / Notes**: Supports `US-LAW-002`.

### `US-WEB-004` — Use Contact Channels

- **Title**: Access Contact Options
- **Epic / Module**: Public Website Experience
- **Actor**: Guest / Public Visitor
- **Story**: As a Guest, I want easily accessible buttons to contact the firm via Zalo, Facebook Messenger, Hotline, or a consultation form, so that I can reach out using my preferred method.
- **Business Value**: Maximizes lead conversion by reducing friction for the prospect.
- **Priority**: High
- **Preconditions**: Integrations/links are configured.
- **Related Use Case(s)**: `UC-WEB-004`
- **Related FR(s)**: `FR-WEB-003`, `FR-LEAD-001`
- **Related NFR(s)**: `NFR-SEC-001`, `NFR-SEC-002`, `NFR-A11Y-001`, `NFR-RWD-001`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-01`, `FE-05`, `WEB-01`, `BO-02`
- **Related Open Question(s)**: `OQ-13`, `OQ-18`, `OQ-20`, `OQ-24`, `OQ-25`
- **Dependencies / Notes**: Must be visible without blocking main content.

## 12. Dashboard & Reporting

### `US-DASH-001` — View Dashboard Metrics

- **Title**: Review Operational Performance
- **Epic / Module**: Dashboard & Reporting
- **Actor**: `SUPER_ADMIN`
- **Story**: As a SUPER_ADMIN, I want to view a dashboard with high-level summaries of leads, appointments, and cases, so that I can monitor the firm's overall operational health.
- **Business Value**: Enables data-driven decision making and quick identification of operational bottlenecks.
- **Priority**: Low (MVP Phase)
- **Preconditions**: Authorized access and existing operational data.
- **Related Use Case(s)**: `UC-DASH-001`
- **Related FR(s)**: `FR-DASH-001`
- **Related NFR(s)**: `NFR-AUTH-002`, `NFR-PRIV-001`, `NFR-PERF-002`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-11`, `BO-01`–`BO-04`, `LI-08`, `SEC-03`, `SEC-04`
- **Related Open Question(s)**: `OQ-04`, `OQ-22`
- **Dependencies / Notes**: Advanced analytics are excluded.

## 13. Notification

### `US-NOTI-001` — Receive New Lead Notification

- **Title**: Get Real-time Lead Alerts
- **Epic / Module**: Notification
- **Actor**: Authorized internal recipient
- **Story**: As a staff member responsible for intake, I want to receive a real-time system notification when a new Lead is created, so that I can respond to the prospect immediately.
- **Business Value**: Increases conversion rates by enabling rapid response to inbound inquiries.
- **Priority**: Medium
- **Preconditions**: The recipient is logged in and connected via WebSocket.
- **Related Use Case(s)**: `UC-NOTI-001`
- **Related FR(s)**: `FR-NOTI-001`, `FR-LEAD-001`, `FR-LEAD-002`
- **Related NFR(s)**: `NFR-PERF-002`, `NFR-AUTH-002`, `NFR-PRIV-001`, `NFR-OBS-001`
- **Related BRD Reference**: `FE-05`, `FE-12`, `SEC-03`, `SEC-04`, `BO-02`, `BO-03`
- **Related Open Question(s)**: `OQ-04`, `OQ-09`, `OQ-13`
- **Dependencies / Notes**: Backed by WebSocket implementation.

## 14. Audit & Governance

### `US-AUDIT-001` — Record Auditable Activity

- **Title**: Log Sensitive Actions
- **Epic / Module**: Audit & Governance
- **Actor**: Authenticated internal actor
- **Story**: As an internal user, I want the system to automatically record my sensitive administrative actions (e.g., deleting a file, changing user roles), so that a secure trail of activity is preserved.
- **Business Value**: Provides accountability and satisfies compliance/security requirements for legal software.
- **Priority**: High
- **Preconditions**: The action falls under the approved audit policy.
- **Related Use Case(s)**: `UC-AUDIT-001`
- **Related FR(s)**: `FR-AUDIT-001`
- **Related NFR(s)**: `NFR-AUD-001`, `NFR-AUD-002`, `NFR-DATA-002`, `NFR-ERR-001`
- **Related BRD Reference**: `FE-13`, `SEC-05`, `BO-03`
- **Related Open Question(s)**: `OQ-04`, `OQ-07`, `OQ-17`
- **Dependencies / Notes**: Runs transparently to the actor.

### `US-AUDIT-002` — View Audit Log

- **Title**: Review System Activity
- **Epic / Module**: Audit & Governance
- **Actor**: `SUPER_ADMIN`
- **Story**: As a SUPER_ADMIN, I want to view the system audit logs showing who performed sensitive actions and when, so that I can investigate unauthorized changes or operational errors.
- **Business Value**: Enables security oversight and rapid incident response.
- **Priority**: High
- **Preconditions**: `SUPER_ADMIN` is authorized.
- **Related Use Case(s)**: `UC-AUDIT-002`
- **Related FR(s)**: `FR-AUDIT-002`
- **Related NFR(s)**: `NFR-AUTH-002`, `NFR-AUD-001`, `NFR-AUD-002`, `NFR-PRIV-001`
- **Related BRD Reference**: `FE-13`, `SEC-03`, `SEC-05`, `BO-03`
- **Related Open Question(s)**: `OQ-04`, `OQ-07`, `OQ-17`
- **Dependencies / Notes**: Requires protection against log tampering.
