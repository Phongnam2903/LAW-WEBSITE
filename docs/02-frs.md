# Functional Requirements Specification

## Document Control

| Field | Value |
| ------------------ | ------------------------------------------------------------- |
| Project | Law Firm Website & Management System |
| Document | Functional Requirements Specification (FRS) |
| Document ID | `FRS-02` |
| Version | 1.0 |
| Status | Complete and validated baseline |
| Effective date | 2026-08-12 |
| Business authority | [01-brd.md](01-brd.md) |
| Decision register | [assumptions-open-questions.md](assumptions-open-questions.md) |

## Record of Changes

| Date | Change type | In charge | Description |
| ---------- | ----------- | --------- | --------------------------------------------------------------------------------------------------------------- |
| 2026-08-12 | Added | PhongNN | Created the FRS from the validated BRD baseline and linked unresolved behavior to controlled Open Question IDs. |

## 1. Purpose and Scope

This FRS translates the approved business capabilities in the BRD into testable functional behavior. It is the functional source of truth for later Use Cases, User Stories, Acceptance Criteria, UML, data design, API specification, and system design.

This document does not define quality targets, final REST resources or operations, database tables or columns, implementation classes, algorithms, or user-interface layouts. “Related API Candidate” describes a capability boundary only and is not an OpenAPI contract. “Related Data / Entity” names business information concepts only and is not a database design.

Unresolved decisions remain governed by the Open Question register. Where an OQ affects a requirement, the requirement specifies only confirmed behavior and must not be refined by silently choosing an answer.

### 1.1 Priority Convention

`Must` means the capability is explicitly in the current BRD scope. Priority does not imply that unresolved details are approved; the cited OQ still governs those details. No `Should` or `Could` requirements are introduced because the BRD does not establish a release-priority hierarchy.

### 1.2 Actors and Permission Convention

The only internal roles are `SUPER_ADMIN`, `LAWYER`, `LEGAL_ASSISTANT`, and `CONTENT_CREATOR`. Guest / Public Visitor is an external actor, not an RBAC role. “Authorized internal user” never grants access by itself; it indicates that the final permission must come from the RBAC decision in `OQ-04`.

### 1.3 Controlled Values

| Concept | Allowed values |
| ----------------------- | -------------------------------------------------------------- |
| Lead source | `WEBSITE`, `ZALO`, `FACEBOOK`, `HOTLINE`, `REFERRAL` |
| Lead status | `NEW`, `CONTACTED`, `QUALIFIED`, `CONVERTED`, `LOST` |
| Appointment status | `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELED` |
| Appointment type | `ONLINE`, `OFFLINE`, `PHONE_CALL` |
| Supported document type | PDF, DOCX, JPG, PNG |
| Maximum document size | 20 MB per file |

## 2. Functional Requirements

### 2.1 AUTH — Authentication & Authorization

#### FR-AUTH-001 — Authenticate Internal User

| Field | Specification |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Requirement ID | `FR-AUTH-001` |
| Feature Name | Internal Login |
| Description | The system shall authenticate an internal user before allowing access to the internal workspace. |
| Business Goal | Protect centralized legal and operational information while enabling authorized work (`BO-03`). |
| Actors | `SUPER_ADMIN`, `LAWYER`, `LEGAL_ASSISTANT`, `CONTENT_CREATOR` |
| Priority | Must |
| Preconditions | The user has an internal account that is permitted to authenticate; account-lifecycle rules remain `OQ-23`. |
| Trigger | The user submits credentials through the Login UI. |
| Main Flow | 1. The system receives the submitted credentials. 2. It verifies them against the internal account. 3. It establishes JWT-based authenticated access. 4. It returns the user to the authorized internal experience. |
| Alternative Flow | A Guest browses public content without invoking internal authentication. |
| Exception Flow | Invalid credentials, an inactive account, or an account state that does not permit authentication causes access to be denied without revealing protected information. Detailed lockout and message behavior remain `OQ-23`. |
| Business Rules | Authentication is required for internal access. Public browsing does not require an internal account. Authentication must not imply authorization to every module or record. |
| Input / Validation | Credential fields required by the approved authentication policy. Exact credential, lockout, and recovery rules are unresolved under `OQ-23`. |
| Output | Authenticated session context and JWT capability, or an authentication failure. |
| Permissions | Publicly reachable Login action; successful access is limited to the authenticated internal role and final RBAC rules (`OQ-04`). |
| Related UI | Login |
| Related Data / Entity | Internal User, Role, Authentication Session |
| Related API Candidate | Authenticate an internal user and issue JWT-based access capability; no endpoint or payload is fixed here. |
| Related BRD Reference | `FE-02`, `SEC-03`, `BO-03` |
| Related Open Question(s) | `OQ-04`, `OQ-23` |

#### FR-AUTH-002 — Log Out Internal User

| Field | Specification |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Requirement ID | `FR-AUTH-002` |
| Feature Name | Internal Logout |
| Description | The system shall allow an authenticated internal user to end the current authenticated access context. |
| Business Goal | Maintain controlled access to confidential business information (`BO-03`). |
| Actors | `SUPER_ADMIN`, `LAWYER`, `LEGAL_ASSISTANT`, `CONTENT_CREATOR` |
| Priority | Must |
| Preconditions | The user has an authenticated access context. |
| Trigger | The user selects Logout. |
| Main Flow | 1. The system receives the logout request. 2. It ends or invalidates the applicable authenticated context according to the approved JWT/session policy. 3. It removes access to protected internal functions. 4. It presents a non-protected destination. |
| Alternative Flow | If no valid authenticated context remains, the system keeps the user outside protected functions. |
| Exception Flow | If server-side logout processing cannot complete, protected access must not be presented as safely terminated; exact token revocation behavior remains `OQ-23`. |
| Business Rules | Logout must not affect public browsing. Token/session termination semantics cannot be finalized before `OQ-23`. |
| Input / Validation | Current authentication context; exact token identifiers and transport are deferred. |
| Output | Ended authenticated access context and loss of protected access. |
| Permissions | Any authenticated internal user may log out of their own context. |
| Related UI | Internal navigation / account menu |
| Related Data / Entity | Authentication Session, Internal User |
| Related API Candidate | End an authenticated access context; no HTTP operation is fixed here. |
| Related BRD Reference | `FE-02`, `SEC-03` |
| Related Open Question(s) | `OQ-23` |

#### FR-AUTH-003 — Refresh Authenticated Access

| Field | Specification |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Requirement ID | `FR-AUTH-003` |
| Feature Name | Refresh Token |
| Description | The system shall support renewal of authenticated access through a refresh-token capability. |
| Business Goal | Allow authorized personnel to continue work without bypassing controlled access (`BO-03`). |
| Actors | `SUPER_ADMIN`, `LAWYER`, `LEGAL_ASSISTANT`, `CONTENT_CREATOR` |
| Priority | Must |
| Preconditions | A refresh credential or context recognized by the approved token policy exists. |
| Trigger | The client requests renewed authenticated access. |
| Main Flow | 1. The system receives the refresh context. 2. It validates the context and current account eligibility. 3. It issues renewed JWT-based access capability according to the approved policy. |
| Alternative Flow | The user authenticates again when refresh is unavailable or not permitted. |
| Exception Flow | Invalid, expired, revoked, or otherwise ineligible refresh context is rejected and protected access is not renewed. Exact lifetime and rotation rules remain `OQ-23`. |
| Business Rules | Refresh must not elevate the user's role or record permissions. An inactive account must not gain renewed access. |
| Input / Validation | Refresh context and account state; exact lifetime, rotation, revocation, and storage rules are unresolved under `OQ-23`. |
| Output | Renewed authenticated access or a refresh failure requiring re-authentication. |
| Permissions | Available only for the user's own eligible authenticated context. |
| Related UI | Background authenticated-session handling; Login when re-authentication is required |
| Related Data / Entity | Authentication Session, Internal User, Role |
| Related API Candidate | Renew JWT-based authenticated access; no endpoint or token representation is fixed here. |
| Related BRD Reference | `FE-02`, `SEC-03` |
| Related Open Question(s) | `OQ-04`, `OQ-23` |

#### FR-AUTH-004 — Enforce Role and Record Authorization

| Field | Specification |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Requirement ID | `FR-AUTH-004` |
| Feature Name | RBAC Enforcement |
| Description | The system shall evaluate role and applicable record-level permission before executing a protected internal action or disclosing protected information. |
| Business Goal | Protect client, case, document, and administrative information under least privilege (`BO-03`). |
| Actors | `SUPER_ADMIN`, `LAWYER`, `LEGAL_ASSISTANT`, `CONTENT_CREATOR` |
| Priority | Must |
| Preconditions | The requester is authenticated and attempts a protected action. |
| Trigger | A protected UI or capability is requested. |
| Main Flow | 1. The system identifies the authenticated user and assigned role. 2. It evaluates the requested capability and applicable record scope. 3. It permits only an authorized action and returns only authorized information. |
| Alternative Flow | Public content is served without internal RBAC while still excluding confidential information. |
| Exception Flow | Missing or insufficient permission results in denial without disclosing protected data. |
| Business Rules | `LAWYER` access is assignment/permitted-record based; `CONTENT_CREATOR` has no implicit confidential case access; Guest has no internal case or document access. The complete matrix remains unresolved. |
| Input / Validation | Authenticated identity, role, requested capability, and relevant record context. Final decision rules depend on `OQ-04`. |
| Output | Authorized result or access denial. |
| Permissions | Governed by the final RBAC and record-level matrix (`OQ-04`); no permission beyond the BRD actor boundaries is granted here. |
| Related UI | All protected internal views and actions |
| Related Data / Entity | Internal User, Role, Permission, Protected Business Record |
| Related API Candidate | Evaluate and enforce authorization for protected capabilities; no policy implementation is fixed here. |
| Related BRD Reference | `FE-02`, `FE-03`, `SEC-03`, `SEC-04` |
| Related Open Question(s) | `OQ-04` |

### 2.2 USER — User Management

#### FR-USER-001 — Create and Update Internal Users

| Field | Specification |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Requirement ID | `FR-USER-001` |
| Feature Name | Maintain Internal User |
| Description | The system shall allow `SUPER_ADMIN` to create and update internal user records. |
| Business Goal | Centralize administration of authorized personnel (`BO-03`). |
| Actors | `SUPER_ADMIN` |
| Priority | Must |
| Preconditions | `SUPER_ADMIN` is authenticated and authorized for User Management. |
| Trigger | `SUPER_ADMIN` starts a create or update action. |
| Main Flow | 1. The system presents the maintain-user capability. 2. `SUPER_ADMIN` enters or changes approved user information. 3. The system validates the information under the approved account policy. 4. It saves the internal user record and confirms the result. |
| Alternative Flow | `SUPER_ADMIN` abandons the action before saving; no change is made. |
| Exception Flow | Invalid, conflicting, or unauthorized information is rejected without changing the existing record. Exact identity and uniqueness rules remain `OQ-23`. |
| Business Rules | Only `SUPER_ADMIN` is confirmed to manage internal users. Creating a user does not authorize unapproved permissions. Sensitive changes are subject to Audit requirements. |
| Input / Validation | Approved internal-user fields; exact identifiers, credential setup, uniqueness, and recovery requirements remain `OQ-23`. |
| Output | Created or updated Internal User record and confirmation, or validation failure. |
| Permissions | `SUPER_ADMIN`; detailed sensitive-operation constraints remain `OQ-04`. |
| Related UI | User list; Create User; User Details / Edit User |
| Related Data / Entity | Internal User, Role |
| Related API Candidate | Create or update an internal user; no resource shape or operation is fixed here. |
| Related BRD Reference | `FE-03`, `SEC-03`, `SEC-05`, `BO-03` |
| Related Open Question(s) | `OQ-04`, `OQ-17`, `OQ-23` |

#### FR-USER-002 — Activate or Deactivate Internal Access

| Field | Specification |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Requirement ID | `FR-USER-002` |
| Feature Name | Internal User Access State |
| Description | The system shall allow `SUPER_ADMIN` to activate or deactivate an internal user's access. |
| Business Goal | Keep internal access aligned with authorized personnel (`BO-03`). |
| Actors | `SUPER_ADMIN` |
| Priority | Must |
| Preconditions | The target internal user exists;`SUPER_ADMIN` is authenticated and authorized. |
| Trigger | `SUPER_ADMIN` selects an activation-state change. |
| Main Flow | 1. The system identifies the target user and requested state. 2. It validates authorization. 3. It stores the new access state. 4. Subsequent authentication and refresh behavior respects the state. 5. It confirms the change. |
| Alternative Flow | `SUPER_ADMIN` cancels before confirmation; the state remains unchanged. |
| Exception Flow | An invalid or unauthorized state change is rejected. Effects on existing sessions remain governed by `OQ-23`. |
| Business Rules | A deactivated account must not authenticate or receive renewed access. Account lifecycle and session effects remain unresolved. |
| Input / Validation | Target Internal User and requested active/inactive state; any approval or self-deactivation restriction remains `OQ-04` / `OQ-23`. |
| Output | Updated access state and confirmation, or rejection. |
| Permissions | `SUPER_ADMIN`, subject to the final sensitive-operation matrix (`OQ-04`). |
| Related UI | User Details / Access State control |
| Related Data / Entity | Internal User, Authentication Session |
| Related API Candidate | Change internal-user access state; no endpoint is fixed here. |
| Related BRD Reference | `FE-02`, `FE-03`, `SEC-03`, `SEC-05` |
| Related Open Question(s) | `OQ-04`, `OQ-17`, `OQ-23` |

#### FR-USER-003 — Assign Roles, Permissions, and Permitted Settings

| Field | Specification |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Requirement ID | `FR-USER-003` |
| Feature Name | Access Administration |
| Description | The system shall allow `SUPER_ADMIN` to assign an authorized role, manage permissions, and configure permitted system settings within the approved governance model. |
| Business Goal | Make responsibility and access centrally controllable (`BO-03`). |
| Actors | `SUPER_ADMIN` |
| Priority | Must |
| Preconditions | `SUPER_ADMIN` is authenticated; the target user and controlled role exist. |
| Trigger | `SUPER_ADMIN` opens role, permission, or permitted-setting administration. |
| Main Flow | 1. The system presents approved roles and controllable permissions/settings. 2. `SUPER_ADMIN` selects an allowed change. 3. The system validates the change against the approved matrix. 4. It saves and confirms the change. 5. Authorization evaluation uses the updated assignment. |
| Alternative Flow | The action is canceled without changing access or settings. |
| Exception Flow | An unapproved role, permission combination, record scope, or setting change is rejected. |
| Business Rules | Only the four BRD roles may be assigned. The detailed permission matrix, role combinations, and permitted settings are not defined and must not be inferred. Changes are sensitive administrative activities. |
| Input / Validation | Target user, one or more allowed assignments only if approved, permission/record scope, or permitted setting. Exact cardinality and setting catalog remain `OQ-04`. |
| Output | Updated access assignment or permitted setting and confirmation, or rejection. |
| Permissions | `SUPER_ADMIN`, constrained by `OQ-04`. |
| Related UI | Role and Permission Management; permitted System Settings |
| Related Data / Entity | Internal User, Role, Permission, System Setting |
| Related API Candidate | Manage role/permission assignments and permitted settings; no contract is fixed here. |
| Related BRD Reference | `FE-03`, `SEC-03`, `SEC-05` |
| Related Open Question(s) | `OQ-04`, `OQ-17` |

### 2.3 LAW — Lawyer Management

#### FR-LAW-001 — Maintain Lawyer Profile

| Field | Specification |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Requirement ID | `FR-LAW-001` |
| Feature Name | Lawyer Profile Maintenance |
| Description | The system shall allow an authorized internal user to create and update lawyer profile information. |
| Business Goal | Present credible legal expertise and centralize lawyer information (`BO-01`, `BO-03`). |
| Actors | Authorized internal user; exact roles remain `OQ-04` and `OQ-21` |
| Priority | Must |
| Preconditions | The actor is authenticated and authorized for Lawyer Management. |
| Trigger | The actor creates or edits a lawyer profile. |
| Main Flow | 1. The system presents the lawyer-profile fields. 2. The actor enters or changes approved information. 3. The system validates the information and portrait input. 4. It saves the profile and confirms the result. |
| Alternative Flow | The actor saves information without making the profile publicly visible. |
| Exception Flow | Invalid information, unsupported portrait input, or insufficient permission is rejected without changing published information. |
| Business Rules | Supported profile information includes biography, experience, qualifications, practice areas, portrait, professional title, and public visibility. Exact content workflow remains unresolved. |
| Input / Validation | Profile information and portrait. Detailed required fields, text constraints, image rules, and localization remain `OQ-21` / `OQ-25`. |
| Output | Created or updated Lawyer Profile and confirmation. |
| Permissions | Must follow the final RBAC/content matrix; no role beyond confirmed boundaries is assumed (`OQ-04`, `OQ-21`). |
| Related UI | Lawyer list; Create Lawyer; Lawyer Profile Editor |
| Related Data / Entity | Lawyer Profile, Practice Area, Portrait |
| Related API Candidate | Create or update lawyer profile information; no resource schema is fixed here. |
| Related BRD Reference | `FE-04`, `FE-09`, `WEB-03`, `BO-01`, `BO-03` |
| Related Open Question(s) | `OQ-04`, `OQ-21`, `OQ-25` |

#### FR-LAW-002 — Control Public Lawyer Visibility

| Field | Specification |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Requirement ID | `FR-LAW-002` |
| Feature Name | Lawyer Public Visibility |
| Description | The system shall allow an authorized internal user to control whether approved lawyer information is visible on the public website. |
| Business Goal | Publish trustworthy lawyer information while retaining content control (`BO-01`, `BO-03`). |
| Actors | Authorized internal user; exact roles and approval authority remain `OQ-04` and `OQ-21` |
| Priority | Must |
| Preconditions | A Lawyer Profile exists and the actor is authorized to control its visibility. |
| Trigger | The actor requests a public-visibility change. |
| Main Flow | 1. The system identifies the profile and requested visibility. 2. It applies the approved publication rules. 3. It changes public visibility only when the actor and profile are eligible. 4. It confirms the result. |
| Alternative Flow | The profile remains internal or non-public while being edited. |
| Exception Flow | Missing approval, incomplete information, confidentiality concern, or insufficient permission prevents public visibility. Exact checks remain unresolved. |
| Business Rules | Only authorized lawyer data may be public. Public presentation includes the published lawyer's portrait, title, experience, and specialization. Publication lifecycle is not yet defined. |
| Input / Validation | Lawyer Profile and requested visibility; approval states and completeness rules remain `OQ-21`. |
| Output | Updated visibility and corresponding public availability, or rejection. |
| Permissions | Final content/RBAC matrix (`OQ-04`, `OQ-21`). |
| Related UI | Lawyer Profile Editor; Public Lawyers / Our Advocates |
| Related Data / Entity | Lawyer Profile, Publication Visibility |
| Related API Candidate | Change or retrieve public lawyer visibility; no endpoint is fixed here. |
| Related BRD Reference | `FE-04`, `FE-09`, `WEB-03`, `SEC-04` |
| Related Open Question(s) | `OQ-04`, `OQ-21`, `OQ-25` |

### 2.4 LEAD — Lead Management

#### FR-LEAD-001 — Capture Website Consultation as a Lead

| Field | Specification |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Requirement ID | `FR-LEAD-001` |
| Feature Name | Website Lead Capture |
| Description | The system shall accept a Guest consultation submission and create a centralized Lead with source `WEBSITE` and initial status `NEW`. |
| Business Goal | Reduce friction for urgent legal inquiries and centralize lead intake (`BO-02`, `BO-03`). |
| Actors | Guest / Public Visitor |
| Priority | Must |
| Preconditions | The public consultation form is available; production submission uses reCAPTCHA v3 or an approved equivalent. |
| Trigger | A Guest submits the consultation form. |
| Main Flow | 1. The system receives consultation information and anti-abuse evidence. 2. It validates the confirmed input rules and anti-abuse result. 3. It creates a Lead with source `WEBSITE` and status `NEW`. 4. It acknowledges receipt without exposing internal information. 5. It triggers the new-lead notification capability. |
| Alternative Flow | The Guest uses Zalo, Facebook Messenger, or hotline / Click-to-Call instead of the form; automatic record creation from those channels is not assumed. |
| Exception Flow | Failed validation, failed anti-abuse verification, or processing failure prevents creation and returns a safe failure response. Duplicate behavior remains unresolved. |
| Business Rules | Guest has no internal access. Consultation fields, consent, privacy evidence, and duplicate handling are not yet approved. |
| Input / Validation | Consultation data and anti-abuse evidence. Exact fields, requiredness, formats, consent, privacy notice, and duplicate checks remain `OQ-20`, `OQ-12`, and `OQ-06`. |
| Output | New Lead record, public acknowledgement, and new-lead notification event; or safe validation failure. |
| Permissions | Public submission only; internal Lead retrieval remains protected. |
| Related UI | Public Contact / Consultation Form |
| Related Data / Entity | Lead, Lead Source, Lead Status, Consent Evidence |
| Related API Candidate | Submit a public consultation and create a Lead; no endpoint or request schema is fixed here. |
| Related BRD Reference | `FE-01`, `FE-05`, `FE-12`, `SEC-02`, `SEC-04`, `BO-02`, `BO-03` |
| Related Open Question(s) | `OQ-06`, `OQ-09`, `OQ-12`, `OQ-20`, `OQ-24` |

#### FR-LEAD-002 — Register Leads from Other Confirmed Sources

| Field | Specification |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Requirement ID | `FR-LEAD-002` |
| Feature Name | Multi-source Lead Registration |
| Description | The system shall support centralized Lead records whose source is `ZALO`, `FACEBOOK`, `HOTLINE`, or `REFERRAL`. |
| Business Goal | Keep inquiries from existing contact channels in a consistent operational record (`BO-02`, `BO-03`). |
| Actors | `LEGAL_ASSISTANT`; other authorized internal roles remain `OQ-04` |
| Priority | Must |
| Preconditions | The actor is authenticated and authorized; information from a confirmed source is available. |
| Trigger | An authorized actor records an inquiry received outside the website form, or an approved future integration supplies it. |
| Main Flow | 1. The system receives the selected confirmed source and approved lead information. 2. It validates the source and applicable intake rules. 3. It creates the Lead with status `NEW`. 4. It confirms the centralized record. |
| Alternative Flow | An approved channel integration may create the record only after the integration depth is decided. Manual registration remains the non-integrated capability. |
| Exception Flow | Invalid source, insufficient permission, failed validation, or unresolved duplicate prevents or suspends creation according to future approved rules. |
| Business Rules | Only the five controlled Lead sources may be used. This requirement does not commit message synchronization or provider integration. |
| Input / Validation | Confirmed Lead source and approved lead information; exact fields and duplicate rules remain `OQ-20` / `OQ-06`. |
| Output | New centralized Lead with selected source and status `NEW`, or validation failure. |
| Permissions | `LEGAL_ASSISTANT` is confirmed for lead intake; any additional role or integration identity requires `OQ-04` / `OQ-13`. |
| Related UI | Internal Lead Intake / Create Lead |
| Related Data / Entity | Lead, Lead Source, Lead Status |
| Related API Candidate | Register a Lead from a confirmed source; external synchronization is not fixed. |
| Related BRD Reference | `FE-01`, `FE-05`, `SEC-04`, `BO-02`, `BO-03` |
| Related Open Question(s) | `OQ-04`, `OQ-06`, `OQ-12`, `OQ-13`, `OQ-20` |

#### FR-LEAD-003 — View, Assign, and Follow Up Leads

| Field | Specification |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Requirement ID | `FR-LEAD-003` |
| Feature Name | Lead Work Management |
| Description | The system shall let authorized personnel view permitted Leads, identify responsible staff or lawyers, and record follow-up information. |
| Business Goal | Make lead responsibility and follow-up visible in a centralized workspace (`BO-03`). |
| Actors | `SUPER_ADMIN`, `LEGAL_ASSISTANT`, `LAWYER` |
| Priority | Must |
| Preconditions | The actor is authenticated and has permission for the requested Lead or assignment action. |
| Trigger | The actor opens Lead Management, selects a Lead, assigns responsibility, or records follow-up. |
| Main Flow | 1. The system returns only permitted Lead information. 2. The actor selects a permitted Lead. 3. The actor identifies responsible staff or lawyer and/or records follow-up information. 4. The system validates authorization and saves the change. 5. It confirms the result. |
| Alternative Flow | The actor views a Lead without changing assignment or follow-up information. |
| Exception Flow | Record-scope denial, invalid assignee, invalid information, or concurrent/conflicting change prevents the update. Detailed conflict behavior is not yet specified. |
| Business Rules | `SUPER_ADMIN` may view all Leads; `LAWYER` may view assigned Leads; `LEGAL_ASSISTANT` may receive, qualify, and assign Leads. Exact record-level permissions remain unresolved. |
| Input / Validation | Lead identifier, responsible internal user where applicable, and follow-up information. Assignee eligibility and field rules remain `OQ-04`. |
| Output | Permitted Lead details and/or updated responsibility/follow-up record. |
| Permissions | Apply the BRD actor boundaries and final RBAC matrix (`OQ-04`). |
| Related UI | Lead list; Lead Details; Assignment and Follow-up controls |
| Related Data / Entity | Lead, Internal User, Lead Assignment, Follow-up Information |
| Related API Candidate | Retrieve permitted Leads and maintain assignment/follow-up information; no endpoint design is fixed. |
| Related BRD Reference | `FE-05`, `SEC-03`, `SEC-04`, `BO-03` |
| Related Open Question(s) | `OQ-04`, `OQ-06`, `OQ-15` |

#### FR-LEAD-004 — Change Lead Status

| Field | Specification |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Requirement ID | `FR-LEAD-004` |
| Feature Name | Lead Lifecycle Status |
| Description | The system shall allow authorized personnel to update a Lead using only the controlled Lead statuses and the confirmed positive progression. |
| Business Goal | Provide consistent qualification and conversion tracking (`BO-02`, `BO-03`). |
| Actors | `LEGAL_ASSISTANT`; `LAWYER` for assigned Leads where permitted; `SUPER_ADMIN` subject to final rules |
| Priority | Must |
| Preconditions | A Lead exists; the actor is authenticated and authorized for that Lead and requested transition. |
| Trigger | The actor requests a Lead status change. |
| Main Flow | 1. The system receives the current Lead and proposed status. 2. It validates the status against controlled values. 3. For the confirmed positive path, it permits `NEW` → `CONTACTED` → `QUALIFIED` → `CONVERTED` subject to authorization and conversion rules. 4. It stores and confirms an approved change. |
| Alternative Flow | A Lead may enter terminal status `LOST` only after the allowed transition and reason rules are approved. |
| Exception Flow | Unknown status, unauthorized transition, skipped/invalid transition, or unmet conversion rule is rejected. The system must not infer missing `LOST` or qualification rules. |
| Business Rules | `LOST` is terminal; its source transitions and reasons remain `OQ-15`. Qualification definition remains `OQ-15`. `CONVERTED` is tied to Lead-to-Case rules in `OQ-05`. |
| Input / Validation | Lead, requested controlled status, and any approved qualification/loss/conversion evidence. Unresolved evidence and reason fields remain blocked by `OQ-05` / `OQ-15`. |
| Output | Updated Lead status and confirmation, or transition rejection. |
| Permissions | Final transition permissions and record scope depend on `OQ-04`. |
| Related UI | Lead Details / Status control |
| Related Data / Entity | Lead, Lead Status, Qualification Information, Loss Reason |
| Related API Candidate | Request a Lead status transition; no HTTP method or transition payload is fixed. |
| Related BRD Reference | `FE-05`, `FE-07`, `SEC-03`, `BO-02`, `BO-03` |
| Related Open Question(s) | `OQ-04`, `OQ-05`, `OQ-15` |

### 2.5 APP — Appointment Management

#### FR-APP-001 — Create and Maintain Appointment

| Field | Specification |
|---|---|
| Requirement ID | `FR-APP-001` |
| Feature Name | Appointment Maintenance |
| Description | The system shall allow authorized personnel to create and update appointments using the controlled appointment types and statuses. |
| Business Goal | Centralize coordination between potential clients and legal personnel (`BO-03`). |
| Actors | `LEGAL_ASSISTANT`; other authorized internal roles remain `OQ-04`; Guest involvement remains `OQ-24` |
| Priority | Must |
| Preconditions | The internal actor is authenticated and authorized; information needed by the approved scheduling rules is available. |
| Trigger | An authorized actor creates an appointment or edits an existing permitted appointment. |
| Main Flow | 1. Present appointment information; 2. accept a controlled type and approved scheduling information; 3. accept an allowed status; 4. validate authorization and approved scheduling rules; 5. save and confirm the Appointment. |
| Alternative Flow | The actor cancels without saving. Rescheduling or cancellation follows rules that remain unresolved under `OQ-16`. |
| Exception Flow | Unknown type/status, conflict under future approved rules, invalid information, or insufficient permission prevents saving. |
| Business Rules | Statuses are `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELED`. Types are `ONLINE`, `OFFLINE`, `PHONE_CALL`. Availability, time-zone, reminders, rescheduling, completion, and cancellation rules must not be inferred. |
| Input / Validation | Controlled type/status plus scheduling and participant information required by approved rules. Exact fields and rules remain `OQ-16` / `OQ-24`. |
| Output | Created or updated Appointment and confirmation, or validation failure. |
| Permissions | `LEGAL_ASSISTANT` may schedule and update appointments; other roles and record scope remain `OQ-04`. |
| Related UI | Appointment list; Create Appointment; Appointment Details / Edit Appointment |
| Related Data / Entity | Appointment, Appointment Type, Appointment Status, Lead or participant association |
| Related API Candidate | Create or update an Appointment; no resource schema, operation, or scheduling algorithm is fixed. |
| Related BRD Reference | `FE-06`, `SEC-03`, `SEC-04`, `BO-03` |
| Related Open Question(s) | `OQ-04`, `OQ-16`, `OQ-24` |

#### FR-APP-002 — View Permitted Appointments

| Field | Specification |
|---|---|
| Requirement ID | `FR-APP-002` |
| Feature Name | Appointment Retrieval |
| Description | The system shall provide authorized internal users with appointment information within their permitted scope. |
| Business Goal | Make appointment coordination visible to responsible personnel (`BO-03`). |
| Actors | `SUPER_ADMIN`, `LAWYER`, `LEGAL_ASSISTANT` |
| Priority | Must |
| Preconditions | The actor is authenticated and requests appointment information. |
| Trigger | The actor opens an appointment list or details view. |
| Main Flow | 1. Identify the actor and permitted appointment scope; 2. return appointments within that scope; 3. allow selection of a permitted Appointment for details. |
| Alternative Flow | No permitted appointments exist; return an empty result without exposing other records. |
| Exception Flow | An attempt to access an Appointment outside the actor's scope is denied. |
| Business Rules | `SUPER_ADMIN` may view all Appointments. `LAWYER` may view own Appointments. `LEGAL_ASSISTANT` may coordinate Appointments. Exact ownership rules remain unresolved. |
| Input / Validation | Authenticated actor, requested Appointment or view context, and approved filters. Filter requirements are not established. |
| Output | Permitted Appointment summaries/details or access denial. |
| Permissions | BRD actor boundaries plus final RBAC matrix (`OQ-04`). |
| Related UI | Appointment list; Appointment Details |
| Related Data / Entity | Appointment, Internal User |
| Related API Candidate | Retrieve permitted Appointment summaries/details; no query contract is fixed. |
| Related BRD Reference | `FE-06`, `SEC-03`, `SEC-04`, `BO-03` |
| Related Open Question(s) | `OQ-04`, `OQ-16`, `OQ-24` |

### 2.6 CASE — Case Management

#### FR-CASE-001 — Convert Qualified Lead to Legal Case

| Field | Specification |
|---|---|
| Requirement ID | `FR-CASE-001` |
| Feature Name | Lead-to-Case Conversion |
| Description | The system shall allow an authorized actor to convert an appropriately qualified Lead into a legal Case under approved conversion rules. |
| Business Goal | Maintain a controlled path from initial inquiry to legal work (`BO-03`). |
| Actors | Authorized internal user; exact conversion authority remains `OQ-04` / `OQ-05` |
| Priority | Must |
| Preconditions | The Lead exists and is appropriately qualified; the actor is authenticated and authorized; conversion rules have been approved. |
| Trigger | The actor requests conversion of a qualified Lead. |
| Main Flow | 1. Identify the Lead and request; 2. verify qualification, authorization, mappings, and approved validations; 3. create the related Case transactionally under approved rules; 4. change the Lead to `CONVERTED` only when conversion succeeds; 5. confirm conversion. |
| Alternative Flow | A qualified Lead remains `QUALIFIED` when conversion is not requested or approved. |
| Exception Flow | Missing qualification, failed validation, insufficient permission, duplicate/conflicting conversion, or Case creation failure leaves the Lead unconverted. Exact rollback and duplicate behavior depend on `OQ-05` / `OQ-06`. |
| Business Rules | Only an appropriately qualified Lead may convert. Final validations, approvals, mappings, and transaction rules are unresolved and must not be invented. |
| Input / Validation | Qualified Lead, conversion authorization, and approved Case-creation information. Exact mappings and required inputs remain `OQ-05`. |
| Output | New Case linked to the converted Lead and confirmation, or no conversion with an error result. |
| Permissions | Conversion authority and record scope remain `OQ-04` / `OQ-05`. |
| Related UI | Lead Details / Convert to Case; Case Details |
| Related Data / Entity | Lead, Lead Status, Legal Case, Lead-to-Case Relationship |
| Related API Candidate | Convert an eligible Lead into a Case as one business operation; no endpoint or transaction design is fixed. |
| Related BRD Reference | `FE-05`, `FE-07`, `SEC-03`, `SEC-04`, `BO-03` |
| Related Open Question(s) | `OQ-03`, `OQ-04`, `OQ-05`, `OQ-06` |

#### FR-CASE-002 — View Cases and Manage Lawyer Assignments

| Field | Specification |
|---|---|
| Requirement ID | `FR-CASE-002` |
| Feature Name | Case Access and Assignment |
| Description | The system shall provide permitted Case information and support assignment of lawyers under approved ownership and RBAC rules. |
| Business Goal | Centralize legal work and make responsibility visible without granting unrestricted access (`BO-03`). |
| Actors | `SUPER_ADMIN`, `LAWYER`; assignment authority remains `OQ-04` / `OQ-03` |
| Priority | Must |
| Preconditions | A Case exists; the actor is authenticated and authorized for viewing or assignment. |
| Trigger | The actor opens a Case or requests an assigned-lawyer change. |
| Main Flow | 1. Evaluate Case record scope; 2. return permitted Case information; 3. if authorized, accept an eligible lawyer assignment; 4. validate and save the assignment; 5. confirm the result. |
| Alternative Flow | The actor views the Case without changing assignments. Multiple-assignment behavior remains governed by `OQ-03`. |
| Exception Flow | An unauthorized Case request or invalid/unauthorized lawyer assignment is denied without exposing protected information. |
| Business Rules | `SUPER_ADMIN` may view all Cases. `LAWYER` may view assigned Cases and does not automatically receive every Case. Ownership and assignment rules remain unresolved. |
| Input / Validation | Case identity and, when applicable, eligible Lawyer identity. Assignment cardinality and ownership remain `OQ-03` / `OQ-04`. |
| Output | Permitted Case information and/or updated lawyer assignment. |
| Permissions | BRD actor boundaries plus final Case ownership and RBAC rules (`OQ-03`, `OQ-04`). |
| Related UI | Case list; Case Details; Lawyer Assignment control |
| Related Data / Entity | Legal Case, Lawyer Profile or Internal User, Case Assignment |
| Related API Candidate | Retrieve permitted Cases and manage approved lawyer assignments; no resource shape is fixed. |
| Related BRD Reference | `FE-07`, `SEC-03`, `SEC-04`, `BO-03` |
| Related Open Question(s) | `OQ-03`, `OQ-04` |

#### FR-CASE-003 — Maintain Case Information and Activities

| Field | Specification |
|---|---|
| Requirement ID | `FR-CASE-003` |
| Feature Name | Case Work Maintenance |
| Description | The system shall allow an authorized `LAWYER` to update assigned Case information and maintain Case activities and internal status tracking. |
| Business Goal | Keep legal work information centralized and attributable (`BO-03`). |
| Actors | `LAWYER`; `SUPER_ADMIN` view access is confirmed but edit authority remains `OQ-04` |
| Priority | Must |
| Preconditions | The Case exists; the `LAWYER` is assigned and authorized for the requested update. |
| Trigger | The actor records an activity or requests a Case information/status update. |
| Main Flow | 1. Verify Case assignment and permission; 2. present permitted Case information; 3. accept an approved activity or update; 4. validate and save it; 5. confirm the result. |
| Alternative Flow | The actor views the assigned Case without making a change. |
| Exception Flow | Missing assignment, invalid information, unauthorized action, or an unapproved status/transition causes rejection. |
| Business Rules | A final Case status set, lifecycle, transitions, closure, reopening, ownership, and activity rules do not exist. No status may be invented before `OQ-03` is resolved. |
| Input / Validation | Permitted Case information, activity information, and any approved status. Exact fields and transitions remain `OQ-03`. |
| Output | Updated Case or Case Activity and confirmation, or rejection. |
| Permissions | Assigned `LAWYER` within permitted scope; additional editing roles remain `OQ-04`. |
| Related UI | Case Details; Case Activity; Case Status control after lifecycle approval |
| Related Data / Entity | Legal Case, Case Activity, Case Status, Case Assignment |
| Related API Candidate | Maintain permitted Case information and activities; status operations remain undefined until `OQ-03`. |
| Related BRD Reference | `FE-07`, `SEC-03`, `SEC-04`, `SEC-05`, `BO-03` |
| Related Open Question(s) | `OQ-03`, `OQ-04`, `OQ-17` |

### 2.7 DOC — Document Management

#### FR-DOC-001 — Upload Private Document

| Field | Specification |
|---|---|
| Requirement ID | `FR-DOC-001` |
| Feature Name | Private Document Upload |
| Description | The system shall allow an authorized user to upload a supported file of no more than 20 MB into private AWS S3 or MinIO object storage. |
| Business Goal | Centralize legal documents while protecting confidentiality (`BO-03`). |
| Actors | `LAWYER`, `LEGAL_ASSISTANT`; additional roles remain `OQ-04` |
| Priority | Must |
| Preconditions | The actor is authenticated and authorized for the associated Case or permitted pre-litigation context; the environment has an approved storage provider. |
| Trigger | The actor selects a file and submits an upload. |
| Main Flow | 1. Receive the file and intended authorized association; 2. validate permission, type, and size; 3. generate a UUID-based stored filename; 4. store privately in active AWS S3 or MinIO; 5. record the authorized association and confirm. |
| Alternative Flow | The actor cancels before submission. AWS S3 and MinIO are environment alternatives, not simultaneous mandatory destinations. |
| Exception Flow | Unsupported type, size over 20 MB, failed authorization, storage failure, or invalid association prevents upload and must not expose a public object. |
| Business Rules | Supported types are PDF, DOCX, JPG, PNG. Maximum size is 20 MB per file. Stored filename is UUID-based. Objects are not public. |
| Input / Validation | File, type, size, authorized business association, and approved document information. Additional metadata and malware controls are not specified here. |
| Output | Private stored-document reference and confirmation, or upload failure. |
| Permissions | `LAWYER` for permitted Case documents; `LEGAL_ASSISTANT` for permitted pre-litigation documents; final matrix is `OQ-04`. |
| Related UI | Case or pre-litigation Document Upload |
| Related Data / Entity | Document, Private Object, Case or pre-litigation association |
| Related API Candidate | Upload a validated private document and associate it with authorized business context; no endpoint is fixed. |
| Related BRD Reference | `FE-08`, `SEC-03`, `SEC-04`, `SEC-06`, `BO-03`, `AS-03` |
| Related Open Question(s) | `OQ-04`, `OQ-07`, `OQ-08`, `OQ-12` |

#### FR-DOC-002 — List and Access Permitted Documents

| Field | Specification |
|---|---|
| Requirement ID | `FR-DOC-002` |
| Feature Name | Authorized Document Access |
| Description | The system shall list and provide temporary access to private documents only after an authorization check. |
| Business Goal | Enable legal work without public disclosure of confidential files (`BO-03`). |
| Actors | `LAWYER`, `LEGAL_ASSISTANT`; other authorized roles remain `OQ-04` |
| Priority | Must |
| Preconditions | The actor is authenticated and requests a document within an authorized Case or pre-litigation scope. |
| Trigger | The actor views a document list or requests document access. |
| Main Flow | 1. Evaluate record-level permission; 2. return only permitted document information; 3. for approved access, optionally issue a presigned URL; 4. keep the object non-public. |
| Alternative Flow | A later design may use another private authorized access method; this FRS does not choose it. |
| Exception Flow | Missing permission/object, expired temporary access, or storage failure denies access without disclosing the file. |
| Business Rules | Authorization is required for each access. `LAWYER` does not automatically receive every document. Presigned access is temporary; exact lifetime belongs in NFR/SDD. |
| Input / Validation | Authenticated identity, document identity, and business-record context. Final record scope remains `OQ-04`. |
| Output | Permitted document information and temporary authorized access, or denial. |
| Permissions | Case- or pre-litigation-record scope under `OQ-04`; no public access. |
| Related UI | Case Documents; Pre-litigation Documents; Document Access action |
| Related Data / Entity | Document, Private Object, Case or pre-litigation association, Access Context |
| Related API Candidate | Retrieve permitted document information and temporary access capability; no endpoint or URL lifetime is fixed. |
| Related BRD Reference | `FE-08`, `SEC-03`, `SEC-04`, `BO-03` |
| Related Open Question(s) | `OQ-04`, `OQ-07`, `OQ-12` |

#### FR-DOC-003 — Apply Approved Document Lifecycle Policy

| Field | Specification |
|---|---|
| Requirement ID | `FR-DOC-003` |
| Feature Name | Document Retention and Disposal Control |
| Description | The system shall apply retention, deletion, recovery, legal-hold, and permanent-disposal behavior only after governing policies are approved. |
| Business Goal | Prevent uncontrolled loss or retention of sensitive legal information (`BO-03`). |
| Actors | Authorized internal user; lifecycle authority remains `OQ-04` / `OQ-08` |
| Priority | Must |
| Preconditions | A private Document exists and applicable policy decisions have been recorded. |
| Trigger | A lifecycle event or authorized lifecycle action occurs under approved policy. |
| Main Flow | 1. Identify the Document and approved policy; 2. check authority, retention, and legal hold; 3. perform only a permitted action; 4. record sensitive activity when required; 5. confirm the result. |
| Alternative Flow | A retention period or legal hold prevents deletion; the Document remains protected. |
| Exception Flow | Because policies are unresolved, irreversible disposal must not be specified or implemented from this FRS alone. Unauthorized or policy-conflicting actions are rejected. |
| Business Rules | Retention is `OQ-07`; deletion/recovery/legal hold/disposal is `OQ-08`; applicable law is `OQ-12`; audit coverage is `OQ-17`. |
| Input / Validation | Document, lifecycle action, policy state, authority, and legal-hold state once approved. |
| Output | Approved lifecycle result and audit information, or a blocked/rejected action. |
| Permissions | Final lifecycle and record-level authority (`OQ-04`, `OQ-08`). |
| Related UI | Document Lifecycle action where approved; legal-hold/retention presentation remains undefined |
| Related Data / Entity | Document, Retention Policy, Legal Hold, Audit Event |
| Related API Candidate | Apply an approved document lifecycle action; no deletion/recovery contract is fixed before policy approval. |
| Related BRD Reference | `FE-08`, `FE-13`, `SEC-04`, `SEC-05`, `BO-03` |
| Related Open Question(s) | `OQ-04`, `OQ-07`, `OQ-08`, `OQ-12`, `OQ-17` |

### 2.8 CMS — Content Management

#### FR-CMS-001 — Manage Public Service Content

| Field | Specification |
|---|---|
| Requirement ID | `FR-CMS-001` |
| Feature Name | Legal Service Content Management |
| Description | The system shall allow authorized personnel to create and update content for Personal and Corporate Legal Services within current scope. |
| Business Goal | Communicate legal expertise and preserve a foundation for future B2B expansion (`BO-01`, `BO-04`). |
| Actors | `CONTENT_CREATOR`; other authorized internal roles remain `OQ-04` / `OQ-21` |
| Priority | Must |
| Preconditions | The actor is authenticated and authorized for Service content. |
| Trigger | The actor creates or edits Service content. |
| Main Flow | 1. Present approved Service content fields; 2. accept content changes; 3. validate approved content rules; 4. save and confirm. |
| Alternative Flow | Content remains non-public while being prepared under the future approved lifecycle. |
| Exception Flow | Invalid content, insufficient permission, or missing required approval prevents a public change. |
| Business Rules | Current examples include Criminal Litigation, Civil Litigation, Marriage & Family, and Land Disputes; the final catalog is content-managed. Advanced B2B workflows remain out of scope. |
| Input / Validation | Service content and approved publication/localization information. Required fields and lifecycle remain `OQ-21` / `OQ-25`. |
| Output | Created or updated Service content and confirmation. |
| Permissions | `CONTENT_CREATOR` for authorized public content; final workflow permissions remain `OQ-04` / `OQ-21`. |
| Related UI | Service list; Service Content Editor; public Service pages |
| Related Data / Entity | Legal Service Content, Practice Area, Publication State |
| Related API Candidate | Maintain and retrieve authorized/public Service content; no resource schema is fixed. |
| Related BRD Reference | `FE-01`, `FE-09`, `WEB-02`, `BO-01`, `BO-04`, `LI-06` |
| Related Open Question(s) | `OQ-04`, `OQ-21`, `OQ-25` |

#### FR-CMS-002 — Manage Blog Content

| Field | Specification |
|---|---|
| Requirement ID | `FR-CMS-002` |
| Feature Name | Blog Management |
| Description | The system shall allow `CONTENT_CREATOR` and any other authorized role to create and update Blog content for public Legal Insights. |
| Business Goal | Provide controlled legal insight content that supports trust and visibility (`BO-01`). |
| Actors | `CONTENT_CREATOR`; other authorized internal roles remain `OQ-04` / `OQ-21` |
| Priority | Must |
| Preconditions | The actor is authenticated and authorized for Blog content. |
| Trigger | The actor creates or edits a Blog post. |
| Main Flow | 1. Present approved Blog fields; 2. accept content changes; 3. validate approved content/publication rules; 4. save and confirm. |
| Alternative Flow | The post remains non-public while being prepared, if supported by the approved lifecycle. |
| Exception Flow | Invalid content, insufficient permission, or unmet approval prevents a public change. |
| Business Rules | Only authorized public content is presented. Draft/review/publication/unpublication/archive states and role ownership remain unresolved. |
| Input / Validation | Blog content and approved publication, SEO, and localization information. Exact fields and rules remain `OQ-21` / `OQ-25`. |
| Output | Created or updated Blog content and confirmation. |
| Permissions | `CONTENT_CREATOR` within final content/RBAC workflow (`OQ-04`, `OQ-21`). |
| Related UI | Blog list; Blog Editor; Legal Insights / Blog public pages |
| Related Data / Entity | Blog Post, Publication State, SEO Metadata |
| Related API Candidate | Maintain and retrieve authorized/public Blog content; no endpoint or payload is fixed. |
| Related BRD Reference | `FE-01`, `FE-09`, `FE-10`, `BO-01` |
| Related Open Question(s) | `OQ-04`, `OQ-21`, `OQ-25` |

#### FR-CMS-003 — Manage and Publish Anonymized Case Studies

| Field | Specification |
|---|---|
| Requirement ID | `FR-CMS-003` |
| Feature Name | Case Study Management |
| Description | The system shall allow authorized personnel to maintain Case Studies and make them public only after required anonymization, confidentiality review, and approval. |
| Business Goal | Demonstrate legal approach and outcomes without exposing client identity or confidential information (`BO-01`). |
| Actors | `CONTENT_CREATOR`, `LAWYER`; exact approval role remains `OQ-14` / `OQ-21` |
| Priority | Must |
| Preconditions | The actor is authenticated and authorized; source material may be used publicly; publication requires approved review. |
| Trigger | The actor creates, edits, reviews, or requests publication of a Case Study. |
| Main Flow | 1. Maintain Background, Challenge, Legal Strategy, and Result; 2. apply approved completeness/workflow checks; 3. perform approved anonymization/confidentiality review; 4. make only an approved Case Study public; 5. confirm. |
| Alternative Flow | The Case Study remains non-public for revision or is unpublished/archived under future approved rules. |
| Exception Flow | Missing approval, failed review, invalid content, or insufficient permission prevents publication. |
| Business Rules | Public Case Studies must be anonymized and approved and protect client identity/confidential details. Approval owner, checklist, and lifecycle remain unresolved. |
| Input / Validation | Background, Challenge, Legal Strategy, Result, and approved review evidence. Exact checklist, source relationship, and localization remain `OQ-14`, `OQ-21`, `OQ-25`. |
| Output | Saved non-public Case Study or approved public Case Study, plus confirmation. |
| Permissions | `LAWYER` may contribute/update authorized Case Studies; `CONTENT_CREATOR` may manage them where permitted; approval authority is unresolved. |
| Related UI | Case Study list; Case Study Editor / Review; public Case Studies |
| Related Data / Entity | Case Study, Review / Approval Evidence, Publication State, optional Legal Case association |
| Related API Candidate | Maintain, review, and retrieve approved public Case Studies; no workflow endpoint design is fixed. |
| Related BRD Reference | `FE-09`, `WEB-05`, `SEC-04`, `BO-01`, `AS-02` |
| Related Open Question(s) | `OQ-04`, `OQ-12`, `OQ-14`, `OQ-21`, `OQ-25` |

### 2.9 SEO — SEO Management

#### FR-SEO-001 — Maintain Search and Sharing Metadata

| Field | Specification |
|---|---|
| Requirement ID | `FR-SEO-001` |
| Feature Name | Page SEO Metadata |
| Description | The system shall allow authorized content personnel to maintain Meta Title, Meta Description, Canonical URL, and Open Graph metadata for relevant public pages. |
| Business Goal | Improve consistent search and sharing presentation of the firm's public expertise (`BO-01`). |
| Actors | `CONTENT_CREATOR`; other authorized content roles remain `OQ-04` / `OQ-21` |
| Priority | Must |
| Preconditions | A relevant public-content item or page exists and the actor is authorized. |
| Trigger | The actor opens or saves SEO metadata. |
| Main Flow | 1. Present supported metadata fields; 2. accept changes; 3. validate approved formats; 4. save and expose metadata with eligible public content. |
| Alternative Flow | If a field is absent, any default behavior must wait for approved content rules; this FRS invents no fallback. |
| Exception Flow | Invalid metadata or insufficient permission prevents saving or public exposure. |
| Business Rules | Supported fields are Meta Title, Meta Description, Canonical URL, and Open Graph metadata. Page coverage and lifecycle align with content rules. |
| Input / Validation | Supported metadata. Exact lengths, requiredness, URL rules, defaults, and localization remain `OQ-21` / `OQ-25`. |
| Output | Stored SEO metadata and corresponding public-page metadata when eligible. |
| Permissions | `CONTENT_CREATOR` may configure search metadata; final matrix remains `OQ-04`. |
| Related UI | SEO fields within public Content Editors |
| Related Data / Entity | Public Content, SEO Metadata |
| Related API Candidate | Maintain and expose SEO metadata with public content; no endpoint/rendering contract is fixed. |
| Related BRD Reference | `FE-09`, `FE-10`, `BO-01` |
| Related Open Question(s) | `OQ-04`, `OQ-21`, `OQ-25` |

#### FR-SEO-002 — Expose Relevant Structured Data

| Field | Specification |
|---|---|
| Requirement ID | `FR-SEO-002` |
| Feature Name | JSON-LD Structured Data |
| Description | The system shall expose approved JSON-LD structured data for relevant public pages, including applicable `LegalService` and `LocalBusiness` types. |
| Business Goal | Make the firm's services and business identity understandable to search systems (`BO-01`). |
| Actors | `CONTENT_CREATOR` for configuration; Guest / Public Visitor as public consumer |
| Priority | Must |
| Preconditions | Relevant approved public content and structured-data values exist. |
| Trigger | A relevant public page is requested. |
| Main Flow | 1. Identify applicable approved structured data; 2. map approved content to applicable `LegalService` or `LocalBusiness` representation; 3. include valid JSON-LD with the public response. |
| Alternative Flow | A page without approved structured data is served without inventing business facts. |
| Exception Flow | Missing or invalid source values prevent affected structured data from being emitted; the page must not claim unconfirmed information. |
| Business Rules | The two named types are relevant, not mandatory on every page. No unapproved service, address, credential, rating, or business fact may be generated. |
| Input / Validation | Approved public content and structured-data values. Applicability and localization align with `OQ-21` / `OQ-25`. |
| Output | Public page containing applicable JSON-LD, or a page without unsupported claims. |
| Permissions | Public read; configuration follows content/RBAC permissions. |
| Related UI | Public pages; structured-data configuration within authorized content management |
| Related Data / Entity | Public Content, Structured Data Metadata, Legal Service Content |
| Related API Candidate | Provide approved structured-data values with public content; no response schema is fixed. |
| Related BRD Reference | `FE-10`, `WEB-02`, `BO-01` |
| Related Open Question(s) | `OQ-04`, `OQ-21`, `OQ-25` |

### 2.10 WEB — Public Website

#### FR-WEB-001 — Navigate Public Website

| Field | Specification |
|---|---|
| Requirement ID | `FR-WEB-001` |
| Feature Name | Public Navigation |
| Description | The system shall provide public navigation to Home, Lawyers, Personal Legal Services, Corporate Legal Services, Case Studies, Legal Insights / Blog, and Contact. |
| Business Goal | Give potential clients a clear path to expertise and contact options (`BO-01`, `BO-02`, `BO-04`). |
| Actors | Guest / Public Visitor |
| Priority | Must |
| Preconditions | The public website is available. No internal account is required. |
| Trigger | A Guest opens the website or selects a public navigation item. |
| Main Flow | 1. Present confirmed public navigation; 2. accept a selection; 3. present corresponding publicly eligible content. |
| Alternative Flow | If no approved content exists, do not expose non-public content; exact empty-state presentation is deferred. |
| Exception Flow | An unavailable/invalid public destination returns a safe public response without internal information. |
| Business Rules | Corporate Legal Services navigation supports future readiness only; advanced B2B workflows remain outside scope. Navigation grants no internal access. |
| Input / Validation | Public navigation selection and approved public route context; localization is `OQ-25`. |
| Output | Requested public page or safe public error/empty state. |
| Permissions | Public read only for publicly eligible content. |
| Related UI | Global public header/navigation and named public pages |
| Related Data / Entity | Public Page, Public Content, Navigation Item |
| Related API Candidate | Retrieve publicly eligible page/content capability; routes and API separation are not fixed. |
| Related BRD Reference | `FE-01`, `FE-09`, `WEB-01`–`WEB-05`, `BO-01`, `BO-02`, `BO-04`, `LI-06` |
| Related Open Question(s) | `OQ-21`, `OQ-25` |

#### FR-WEB-002 — Present Approved Lawyers, Services, Insights, and Case Studies

| Field | Specification |
|---|---|
| Requirement ID | `FR-WEB-002` |
| Feature Name | Public Content Presentation |
| Description | The system shall present only publicly eligible Lawyers, Services, Blog posts, and anonymized Case Studies. |
| Business Goal | Communicate trustworthy expertise and outcomes while protecting confidential information (`BO-01`). |
| Actors | Guest / Public Visitor |
| Priority | Must |
| Preconditions | Content has been made publicly eligible under approved rules. |
| Trigger | A Guest requests a public listing or details page. |
| Main Flow | 1. Identify publicly eligible content; 2. return the requested listing/details; 3. include applicable approved SEO metadata. |
| Alternative Flow | No eligible content exists; return an empty public result without exposing drafts/confidential records. |
| Exception Flow | Unpublished, unauthorized, non-anonymized, or unavailable content is not disclosed. |
| Business Rules | Public Lawyer presentation includes portrait, title, experience, specialization. Public Case Studies use the four required sections and require anonymization/approval. |
| Input / Validation | Public content request and publication eligibility. Lifecycle/localization remain `OQ-14`, `OQ-21`, `OQ-25`. |
| Output | Publicly eligible Lawyer, Service, Blog, or Case Study content. |
| Permissions | Public read only; no internal Case or Document information. |
| Related UI | Lawyers / Our Advocates; Services; Legal Insights / Blog; Case Studies |
| Related Data / Entity | Lawyer Profile, Legal Service Content, Blog Post, Case Study, SEO Metadata |
| Related API Candidate | Retrieve public content collections/details; no endpoint or response schema is fixed. |
| Related BRD Reference | `FE-01`, `FE-04`, `FE-09`, `FE-10`, `WEB-02`, `WEB-03`, `WEB-05`, `SEC-04`, `BO-01` |
| Related Open Question(s) | `OQ-12`, `OQ-14`, `OQ-21`, `OQ-25` |

#### FR-WEB-003 — Provide Consultation and External Contact Actions

| Field | Specification |
|---|---|
| Requirement ID | `FR-WEB-003` |
| Feature Name | Public Contact Entry Points |
| Description | The system shall provide a consultation-form entry point and accessible actions for Zalo, Facebook Messenger, and hotline / Click-to-Call. |
| Business Goal | Reduce the effort required to contact the firm in an urgent legal situation (`BO-02`). |
| Actors | Guest / Public Visitor |
| Priority | Must |
| Preconditions | The public website is available and the configured external contact destination exists. |
| Trigger | A Guest selects a consultation or external contact action. |
| Main Flow | 1. Present contact actions; 2. accept a selection; 3. for consultation, use `FR-LEAD-001`; 4. for an external channel, direct the Guest to its configured capability. |
| Alternative Flow | The Guest selects another confirmed channel if one is unavailable. Message synchronization is not implied. |
| Exception Flow | Missing/invalid configuration or failed handoff returns a safe result without fabricating successful contact or Lead creation. |
| Business Rules | Actions must remain visible, operable, accessible on mobile without blocking important content. Integration depth and ownership remain unresolved. |
| Input / Validation | Selected channel and destination; consultation data follows `FR-LEAD-001`. Provider behavior remains `OQ-13`. |
| Output | Consultation intake experience or handoff to the selected external channel. |
| Permissions | Public. External providers remain outside internal RBAC. |
| Related UI | Contact page; consultation CTA; floating Zalo / Messenger / hotline controls |
| Related Data / Entity | Contact Channel Configuration, Lead when consultation is submitted |
| Related API Candidate | Expose contact configuration and delegate consultation submission; no third-party API integration is committed. |
| Related BRD Reference | `FE-01`, `FE-05`, `WEB-01`, `BO-02` |
| Related Open Question(s) | `OQ-13`, `OQ-18`, `OQ-20`, `OQ-24`, `OQ-25` |

#### FR-WEB-004 — Present Homepage Business Content

| Field | Specification |
|---|---|
| Requirement ID | `FR-WEB-004` |
| Feature Name | Public Homepage |
| Description | The system shall present approved hero, practice-area highlights, published advocates, litigation process, and approved Case Studies. |
| Business Goal | Establish authority and guide potential clients toward information and contact (`BO-01`, `BO-02`). |
| Actors | Guest / Public Visitor |
| Priority | Must |
| Preconditions | The public website and applicable approved content are available. |
| Trigger | A Guest requests Home or a corresponding public content section. |
| Main Flow | 1. Present authentic approved hero imagery and litigation-focused headline; 2. present urgent-case-assessment CTA; 3. present practice areas and published lawyers; 4. explain four litigation stages; 5. present approved Case Studies. |
| Alternative Flow | Sections without approved content are not populated with invented content; exact empty-state behavior is deferred. |
| Exception Flow | Non-public/confidential content is excluded. The corrupted CTA source text must not be guessed. |
| Business Rules | Exact Vietnamese CTA is `OQ-18`. The four stages are Case Assessment, Legal Strategy, Negotiation / Pre-litigation, Court Litigation. Measurable UI quality belongs in NFR/Acceptance Criteria. |
| Input / Validation | Approved public content and eligibility. CTA wording/localization remain `OQ-18` / `OQ-25`. |
| Output | Public homepage/content sections containing only approved information. |
| Permissions | Public read only. |
| Related UI | Home hero; Practice Areas; Our Advocates; Litigation Process; Case Studies |
| Related Data / Entity | Public Page Content, Legal Service Content, Lawyer Profile, Case Study |
| Related API Candidate | Retrieve approved homepage content composition; no page/API architecture is fixed. |
| Related BRD Reference | `FE-01`, `FE-04`, `FE-09`, `WEB-01`, `WEB-02`, `WEB-03`, `WEB-04`, `WEB-05`, `BO-01`, `BO-02` |
| Related Open Question(s) | `OQ-14`, `OQ-18`, `OQ-21`, `OQ-25` |

### 2.11 DASH — Dashboard & Reporting

#### FR-DASH-001 — View Role-appropriate Operational Summaries

| Field | Specification |
|---|---|
| Requirement ID | `FR-DASH-001` |
| Feature Name | Dashboard and Basic Reporting |
| Description | The system shall provide authorized internal users with role-appropriate operational summaries for Leads, Appointments, Cases, and other approved basic business indicators. |
| Business Goal | Give authorized personnel visibility into centralized operations and business outcomes (`BO-02`, `BO-03`). |
| Actors | `SUPER_ADMIN`, `LAWYER`, `LEGAL_ASSISTANT`, `CONTENT_CREATOR` only where the final role matrix grants a relevant summary |
| Priority | Must |
| Preconditions | The actor is authenticated and authorized for a dashboard or report and underlying record scope. |
| Trigger | The actor opens the Dashboard or requests a basic report. |
| Main Flow | 1. Identify actor and permitted record scope; 2. calculate only approved indicators from permitted information; 3. present the role-appropriate summary. |
| Alternative Flow | If no permitted data exists, present an empty summary without exposing information from another scope. |
| Exception Flow | An unapproved measure, filter, record scope, or insufficient permission prevents the requested result. |
| Business Rules | `SUPER_ADMIN` may access dashboards. Other role visibility must be role appropriate. Measures, filters, date ranges, KPI definitions, and role visibility remain unresolved; advanced analytics is out of scope. |
| Input / Validation | Authenticated actor, approved indicator/filter/date range, and permitted record scope. Exact requirements remain `OQ-22`. |
| Output | Role-appropriate operational summary or basic report. |
| Permissions | Final dashboard/report and record-level matrix (`OQ-04`, `OQ-22`). |
| Related UI | Internal Dashboard; Basic Reporting view |
| Related Data / Entity | Lead, Appointment, Legal Case, Approved Business Indicator |
| Related API Candidate | Retrieve approved role-scoped operational summaries; no metric schema or query contract is fixed. |
| Related BRD Reference | `FE-11`, `BO-01`–`BO-04`, `LI-08`, `SEC-03`, `SEC-04` |
| Related Open Question(s) | `OQ-04`, `OQ-22` |

### 2.12 NOTI — Notification

#### FR-NOTI-001 — Notify Authorized Recipients of a New Lead

| Field | Specification |
|---|---|
| Requirement ID | `FR-NOTI-001` |
| Feature Name | Real-time New-lead Notification |
| Description | The system shall produce a real-time administrative notification through WebSocket when a new Lead is successfully created. |
| Business Goal | Support timely awareness and follow-up for new inquiries (`BO-02`, `BO-03`). |
| Actors | Authorized internal recipients; exact roles remain `OQ-09` / `OQ-04` |
| Priority | Must |
| Preconditions | A Lead has been successfully created and an authorized recipient has an eligible real-time connection. |
| Trigger | Successful creation of a new Lead from any supported intake path. |
| Main Flow | 1. Receive the successful new-Lead event; 2. determine recipients under approved rules; 3. send the administrative notification through WebSocket; 4. display it only to eligible connected recipients. |
| Alternative Flow | Email or Zalo ZNS delivery may occur only if later confirmed for MVP. Disconnected-client, delivery, retry, escalation, and read-state behavior remain unresolved. |
| Exception Flow | Failure to determine recipients or deliver a real-time notification must not fabricate delivery. Exact retry/escalation handling depends on `OQ-09`. Lead creation is not stated to roll back because notification delivery fails. |
| Business Rules | WebSocket new-lead notification is confirmed. Recipient roles, content, escalation, delivery, retry, and read state are not confirmed. Email and Zalo ZNS are potential, not mandatory, channels. |
| Input / Validation | New Lead event and approved recipient/content rules. Notification content must not disclose Lead data to an unauthorized recipient. |
| Output | Real-time administrative notification to eligible connected recipients, or recorded delivery failure behavior once approved. |
| Permissions | Recipient eligibility and data visibility follow `OQ-04` / `OQ-09`. |
| Related UI | Internal real-time notification area |
| Related Data / Entity | Lead, Notification, Recipient, Delivery State if approved |
| Related API Candidate | Publish/subscribe to authorized new-Lead notifications through WebSocket; no event schema, topic, or fallback contract is fixed. |
| Related BRD Reference | `FE-05`, `FE-12`, `SEC-03`, `SEC-04`, `BO-02`, `BO-03` |
| Related Open Question(s) | `OQ-04`, `OQ-09`, `OQ-13` |

### 2.13 AUDIT — Audit Log

#### FR-AUDIT-001 — Record Sensitive Administrative Activity

| Field | Specification |
|---|---|
| Requirement ID | `FR-AUDIT-001` |
| Feature Name | Audit Event Capture |
| Description | The system shall record sensitive administrative activity with actor, action, affected entity, previous value, new value, IP address, and timestamp where the approved event-coverage rules require it. |
| Business Goal | Make sensitive administration attributable and reviewable (`BO-03`). |
| Actors | Any authenticated internal actor performing an audited action |
| Priority | Must |
| Preconditions | An authenticated actor initiates an activity covered by the approved audit policy. |
| Trigger | A covered sensitive administrative action is attempted or completed, according to the approved event policy. |
| Main Flow | 1. Identify actor and covered action; 2. identify affected entity; 3. capture required previous/new values where applicable; 4. capture IP address and timestamp; 5. persist the audit event under approved policy. |
| Alternative Flow | If previous/new values do not apply to an approved event, capture the fields required by the final event policy rather than inventing values. |
| Exception Flow | Audit-capture failure handling and whether it blocks the business action are not defined and must be resolved before implementation of affected critical operations. |
| Business Rules | Confirmed audit attributes are actor, action, affected entity, previous value, new value, IP address, timestamp. Event coverage and value-capture rules remain `OQ-17`; retention is `OQ-07` / `OQ-17`. |
| Input / Validation | Authenticated actor, action, affected entity, applicable old/new values, IP address, timestamp. Exact event taxonomy remains `OQ-17`. |
| Output | Protected Audit Event associated with the sensitive activity. |
| Permissions | Event creation occurs as part of a covered action; audit data access is separately controlled by `FR-AUDIT-002`. |
| Related UI | No independent input UI; audit capture accompanies protected administrative actions |
| Related Data / Entity | Audit Event, Internal User, Affected Business Entity |
| Related API Candidate | Record audit information as part of covered business operations; no standalone endpoint or event transport is fixed. |
| Related BRD Reference | `FE-13`, `SEC-05`, `BO-03` |
| Related Open Question(s) | `OQ-04`, `OQ-07`, `OQ-17` |

#### FR-AUDIT-002 — View Audit Records

| Field | Specification |
|---|---|
| Requirement ID | `FR-AUDIT-002` |
| Feature Name | Audit Log Access |
| Description | The system shall allow `SUPER_ADMIN` to access protected audit records. |
| Business Goal | Support oversight of sensitive administrative activities (`BO-03`). |
| Actors | `SUPER_ADMIN` |
| Priority | Must |
| Preconditions | `SUPER_ADMIN` is authenticated and authorized for Audit Log access. |
| Trigger | `SUPER_ADMIN` opens the Audit Log or requests an Audit Event. |
| Main Flow | 1. Verify `SUPER_ADMIN` authorization; 2. retrieve audit records within approved retention and access rules; 3. present confirmed audit attributes. |
| Alternative Flow | No retained audit records match the request; return an empty result. Filtering and search behavior are not yet defined. |
| Exception Flow | Unauthorized access is denied. Records outside approved retention or unavailable under policy are not returned. |
| Business Rules | `SUPER_ADMIN` access is confirmed. Retention, detailed event coverage, filtering, export, and sensitive-value masking are not established and must not be inferred. |
| Input / Validation | Authenticated `SUPER_ADMIN` and an approved audit query if later defined. |
| Output | Protected Audit Event information or access denial/empty result. |
| Permissions | `SUPER_ADMIN`, subject to final sensitive-operation restrictions in `OQ-04`. |
| Related UI | Audit Log list / Audit Event Details |
| Related Data / Entity | Audit Event, Internal User, Affected Business Entity |
| Related API Candidate | Retrieve protected audit records for an authorized `SUPER_ADMIN`; no query or response contract is fixed. |
| Related BRD Reference | `FE-13`, `SEC-03`, `SEC-05`, `BO-03` |
| Related Open Question(s) | `OQ-04`, `OQ-07`, `OQ-17` |

## 3. Requirement Inventory

| Module | Requirement IDs | Count |
|---|---|---:|
| AUTH | `FR-AUTH-001`–`FR-AUTH-004` | 4 |
| USER | `FR-USER-001`–`FR-USER-003` | 3 |
| LAW | `FR-LAW-001`–`FR-LAW-002` | 2 |
| LEAD | `FR-LEAD-001`–`FR-LEAD-004` | 4 |
| APP | `FR-APP-001`–`FR-APP-002` | 2 |
| CASE | `FR-CASE-001`–`FR-CASE-003` | 3 |
| DOC | `FR-DOC-001`–`FR-DOC-003` | 3 |
| CMS | `FR-CMS-001`–`FR-CMS-003` | 3 |
| SEO | `FR-SEO-001`–`FR-SEO-002` | 2 |
| WEB | `FR-WEB-001`–`FR-WEB-004` | 4 |
| DASH | `FR-DASH-001` | 1 |
| NOTI | `FR-NOTI-001` | 1 |
| AUDIT | `FR-AUDIT-001`–`FR-AUDIT-002` | 2 |
| **Total** | | **34** |

## 4. BRD Functional Coverage

| BRD capability | FRS coverage |
|---|---|
| `FE-01` — Public Website and Lead Generation | `FR-WEB-001`–`FR-WEB-004`, `FR-LEAD-001`, `FR-LEAD-002` |
| `FE-02` — Authentication and Authorization | `FR-AUTH-001`–`FR-AUTH-004` |
| `FE-03` — User Management | `FR-USER-001`–`FR-USER-003`, `FR-AUTH-004` |
| `FE-04` — Lawyer Management | `FR-LAW-001`, `FR-LAW-002`, `FR-WEB-002` |
| `FE-05` — Lead Management | `FR-LEAD-001`–`FR-LEAD-004`, `FR-CASE-001` |
| `FE-06` — Appointment Management | `FR-APP-001`, `FR-APP-002` |
| `FE-07` — Case Management | `FR-CASE-001`–`FR-CASE-003` |
| `FE-08` — Document Management | `FR-DOC-001`–`FR-DOC-003` |
| `FE-09` — Content Management | `FR-LAW-001`, `FR-LAW-002`, `FR-CMS-001`–`FR-CMS-003`, `FR-WEB-002` |
| `FE-10` — Search Visibility | `FR-SEO-001`, `FR-SEO-002` |
| `FE-11` — Dashboard and Basic Reporting | `FR-DASH-001` |
| `FE-12` — Notifications | `FR-NOTI-001`, triggered by `FR-LEAD-001` / `FR-LEAD-002` |
| `FE-13` — Audit Log | `FR-AUDIT-001`, `FR-AUDIT-002` and audit references in sensitive module requirements |

All 13 in-scope BRD capabilities have at least one functional requirement. Exclusions `LI-01`–`LI-08` are not implemented as functional requirements. `LI-06` and `LI-08` are cited where they constrain public Corporate Legal Services and reporting scope.

### 4.1 Public Experience Coverage

| BRD requirement | FRS coverage |
|---|---|
| `WEB-01` — Hero and urgent CTA | `FR-WEB-003`, `FR-WEB-004`; exact CTA remains `OQ-18` |
| `WEB-02` — Practice Areas | `FR-CMS-001`, `FR-WEB-001`, `FR-WEB-004` |
| `WEB-03` — Our Advocates | `FR-LAW-001`, `FR-LAW-002`, `FR-WEB-002`, `FR-WEB-004` |
| `WEB-04` — Litigation Process | `FR-WEB-004` |
| `WEB-05` — Case Studies | `FR-CMS-003`, `FR-WEB-002`, `FR-WEB-004` |

### 4.2 Security Requirement Intersection

| BRD requirement | Functional treatment / downstream boundary |
|---|---|
| `SEC-01` — HTTPS | Applies to all production access; measurable protocol and deployment controls belong in NFR/SDD. No alternative transport is introduced here. |
| `SEC-02` — Anti-abuse control | `FR-LEAD-001` requires reCAPTCHA v3 or approved equivalent for public consultation submission. |
| `SEC-03` — RBAC / least privilege | `FR-AUTH-004` and every protected requirement enforce permission boundaries; exact matrix is `OQ-04`. |
| `SEC-04` — Confidentiality | Lead, Case, Document, Case Study, Dashboard, Notification, and Audit requirements prohibit unauthorized disclosure; legal/privacy rules remain `OQ-12`. |
| `SEC-05` — Audit trail | `FR-AUDIT-001`, `FR-AUDIT-002`; event scope and retention remain `OQ-17`. |
| `SEC-06` — Encryption capability | Private storage is required by `FR-DOC-001`; detailed encryption controls belong in NFR/SDD and applicable obligations remain `OQ-12`. |

## 5. Permission Alignment Summary

| Actor / role | Confirmed functional boundary represented in this FRS |
|---|---|
| Guest / Public Visitor | Browse public pages and eligible content, submit consultation requests, and use external contact actions; no internal Case or Document access. |
| `SUPER_ADMIN` | Manage users/access/settings; view all Leads, Cases, Appointments; access dashboards and Audit Logs. Unspecified edit and confidential-document access is not assumed. |
| `LAWYER` | View assigned Leads/Cases, own Appointments, permitted Case Documents; update assigned Case information; contribute to authorized Case Studies. |
| `LEGAL_ASSISTANT` | Receive/qualify/assign Leads, schedule Appointments, manage permitted pre-litigation Documents, and update Lead/Appointment status. |
| `CONTENT_CREATOR` | Manage authorized public content and Case Studies where permitted; configure SEO metadata; no implicit confidential Case/Document access. |

The complete capability and record-level permission matrix remains `OQ-04`. Requirements use “authorized” where the BRD confirms a capability but not the final responsible role.

## 6. Open Questions Affecting the FRS

| OQ range / ID | Functional impact |
|---|---|
| `OQ-03`–`OQ-06` | Case lifecycle, RBAC, Lead-to-Case conversion, and duplicate Lead behavior constrain AUTH, USER, LEAD, CASE, and protected modules. |
| `OQ-07`, `OQ-08` | Retention and document lifecycle constrain DOC and AUDIT. |
| `OQ-09` | Notification recipients, content, escalation, delivery, retry, read state, and external channels constrain NOTI. |
| `OQ-12`–`OQ-17` | Privacy/consent, integrations, Case Study approval, Lead qualification/loss, Appointment rules, and Audit coverage constrain their respective modules. |
| `OQ-18` | Exact Vietnamese CTA wording constrains WEB public copy. |
| `OQ-19` | Current-system inventory may reveal migration or synchronization scope. No migration/synchronization FR is included until this is answered. |
| `OQ-20`, `OQ-24` | Consultation fields/consent and the Guest-to-Appointment boundary constrain LEAD, WEB, and APP. |
| `OQ-21` | Content lifecycle and role ownership constrain LAW, CMS, SEO, and WEB. |
| `OQ-22` | Metrics, filters, date ranges, visibility, and KPIs constrain DASH. |
| `OQ-23` | Account, credential, token/session, recovery, and lockout policy constrain AUTH and USER. |
| `OQ-25` | Language/localization rules constrain public content and relevant internal UI. |

`OQ-01` and `OQ-02` concern document/project governance rather than system behavior. `OQ-10` and `OQ-11` define SLA and recovery quality targets and are deferred to NFR. They are not silently answered by this FRS.

## 7. Validation Record

**Validation status:** Passed on 2026-08-12.

The completion review must confirm:

- every `FR-*` identifier is unique and follows the module convention;
- every requirement contains all mandatory specification fields;
- every requirement references at least one valid BRD anchor;
- all 13 `FE-*` capabilities have coverage and no `LI-*` exclusion is implemented;
- actors, roles, Lead sources/statuses, Appointment statuses/types, and document constraints match the BRD;
- unresolved behavior cites a defined OQ and does not select an answer;
- API candidates remain capability descriptions rather than endpoint contracts; and
- no database table, implementation code, NFR target, Use Case, UML, ERD, OpenAPI contract, or SDD design is introduced.

Validation confirmed 34 unique functional requirements across all 13 modules, all 680 mandatory field instances, complete coverage of `FE-01`–`FE-13` and `WEB-01`–`WEB-05`, valid BRD/OQ references, controlled role and status usage, no orphan requirements, and no final API or database design.

