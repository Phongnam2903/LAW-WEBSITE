# Use Case Specification

## Document Control

| Field | Value |
|---|---|
| Project | Law Firm Website & Management System |
| Document | Use Case Specification |
| Document ID | `UCS-04` |
| Version | 1.0 |
| Status | Complete and validated baseline |
| Effective date | 2026-08-12 |
| Business authority | [01-brd.md](01-brd.md) |
| Functional baseline | [02-frs.md](02-frs.md) |
| Quality baseline | [03-nfr.md](03-nfr.md) |
| Decision register | [assumptions-open-questions.md](assumptions-open-questions.md) |

## Record of Changes

| Date | Change type | In charge | Description |
|---|---|---|---|
| 2026-08-12 | Added | PhongNN | Created and validated the Use Case Specification from the approved BRD, FRS, NFR, and controlled Open Question register. |

## 1. Purpose and Modeling Boundaries

This document describes actor goals and business interactions for the 34 approved functional requirements. It does not define user stories, acceptance criteria, UI layouts, final REST endpoints, data structures, SQL, application classes, algorithms, or implementation design.

The BRD controls business scope, actors, terminology, permissions, statuses, and exclusions. The FRS controls functional behavior. Related NFRs are cited only where their quality, privacy, security, accessibility, or reliability constraints materially affect a use case. An unresolved decision is not completed here; the affected flow remains bounded by its controlling `OQ-*` identifier.

### 1.1 Actor and Permission Conventions

- Guest / Public Visitor is an external actor and not an internal role.
- The only internal roles are `SUPER_ADMIN`, `LAWYER`, `LEGAL_ASSISTANT`, and `CONTENT_CREATOR`.
- “Authorized internal user” does not grant a permission. It means the role and record scope must be approved under `OQ-04`.
- `SUPER_ADMIN` may manage users and permissions; view all Leads, Cases, and Appointments; and access dashboards and Audit Logs. Unspecified edit or confidential-document access is not assumed.
- `LAWYER` access to Leads, Cases, Appointments, and Documents remains assignment- or record-scope based.
- `LEGAL_ASSISTANT` may receive, qualify, and assign Leads; coordinate Appointments; and manage permitted pre-litigation Documents, subject to `OQ-04`.
- `CONTENT_CREATOR` may manage authorized public content and SEO metadata but has no implicit access to confidential Cases or Documents.

### 1.2 Controlled Values

| Concept | Values |
|---|---|
| Lead source | `WEBSITE`, `ZALO`, `FACEBOOK`, `HOTLINE`, `REFERRAL` |
| Lead status | `NEW`, `CONTACTED`, `QUALIFIED`, `CONVERTED`, `LOST` |
| Appointment status | `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELED` |
| Appointment type | `ONLINE`, `OFFLINE`, `PHONE_CALL` |
| Supported document type | PDF, DOCX, JPG, PNG |
| Maximum document size | 20 MB per file |

### 1.3 Use Case Inventory

| Module | Use Case IDs | Count |
|---|---|---:|
| Authentication | `UC-AUTH-001`–`UC-AUTH-004` | 4 |
| User Management | `UC-USER-001`–`UC-USER-003` | 3 |
| Lawyer Management | `UC-LAW-001`–`UC-LAW-002` | 2 |
| Lead Management | `UC-LEAD-001`–`UC-LEAD-005` | 5 |
| Appointment | `UC-APP-001`–`UC-APP-002` | 2 |
| Case Management | `UC-CASE-001`–`UC-CASE-003` | 3 |
| Document Management | `UC-DOC-001`–`UC-DOC-003` | 3 |
| CMS | `UC-CMS-001`–`UC-CMS-003` | 3 |
| SEO | `UC-SEO-001`–`UC-SEO-002` | 2 |
| Public Website | `UC-WEB-001`–`UC-WEB-004` | 4 |
| Dashboard | `UC-DASH-001` | 1 |
| Notification | `UC-NOTI-001` | 1 |
| Audit | `UC-AUDIT-001`–`UC-AUDIT-002` | 2 |
| **Total** | | **35** |

## 2. Authentication Use Cases

### `UC-AUTH-001` — Log In

| Field | Specification |
|---|---|
| Use Case ID | `UC-AUTH-001` |
| Use Case Name | Log In |
| Goal | Establish authenticated access to the internal workspace for an eligible internal user. |
| Scope | Authentication and Authorization |
| Primary Actor | `SUPER_ADMIN`, `LAWYER`, `LEGAL_ASSISTANT`, or `CONTENT_CREATOR` |
| Secondary Actor(s) | None confirmed |
| Trigger | The actor submits credentials through Login. |
| Preconditions | The actor has an internal account permitted to authenticate; lifecycle and credential policy remain `OQ-23`. |
| Postconditions | Success: an authenticated access context exists. Failure: no protected access is granted. |
| Main Success Flow | 1. The actor opens Login. 2. The actor submits the credentials required by the approved policy. 3. The system verifies the credentials and account eligibility. 4. The system establishes JWT-based authenticated access. 5. The actor enters only the authorized internal experience. |
| Alternative Flows | A1. A visitor continues public browsing without authentication. |
| Exception Flows | E1. Invalid credentials or an ineligible/inactive account causes a safe denial. E2. Lockout and recovery behavior are not selected pending `OQ-23`. |
| Business Rules | Internal access requires authentication. Authentication alone does not authorize every module or record. |
| Permissions | Login is publicly reachable; successful internal access is constrained by the actor's role and `OQ-04`. |
| Related FR(s) | `FR-AUTH-001` |
| Related NFR(s), if applicable | `NFR-SEC-001`, `NFR-AUTH-001`, `NFR-ERR-001` |
| Related BRD Reference | `FE-02`, `SEC-03`, `BO-03` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-23` |

### `UC-AUTH-002` — Refresh Session / Token

| Field | Specification |
|---|---|
| Use Case ID | `UC-AUTH-002` |
| Use Case Name | Refresh Session / Token |
| Goal | Continue eligible authenticated work without increasing the actor's access. |
| Scope | Authentication and Authorization |
| Primary Actor | Authenticated internal user |
| Secondary Actor(s) | None confirmed |
| Trigger | The actor's client requests renewal of authenticated access. |
| Preconditions | A refresh context recognized by the approved policy exists. |
| Postconditions | Success: renewed access reflects current account and permission state. Failure: access is not renewed and re-authentication is required. |
| Main Success Flow | 1. The system receives the refresh context. 2. It validates the context and current account eligibility. 3. It re-evaluates current role and access state. 4. It issues renewed JWT-based access under the approved policy. |
| Alternative Flows | A1. The actor logs in again when refresh is unavailable or not permitted. |
| Exception Flows | E1. An invalid, expired, revoked, or ineligible refresh context is rejected. E2. An inactive account receives no renewed access. |
| Business Rules | Refresh must not elevate role or record permissions. Lifetime, rotation, revocation, and storage rules remain unresolved. |
| Permissions | Only the actor's own eligible authentication context may be refreshed. |
| Related FR(s) | `FR-AUTH-003`, `FR-AUTH-004` |
| Related NFR(s), if applicable | `NFR-AUTH-001`, `NFR-AUTH-002`, `NFR-ERR-001` |
| Related BRD Reference | `FE-02`, `SEC-03` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-23` |

### `UC-AUTH-003` — Log Out

| Field | Specification |
|---|---|
| Use Case ID | `UC-AUTH-003` |
| Use Case Name | Log Out |
| Goal | End the actor's current authenticated access context. |
| Scope | Authentication and Authorization |
| Primary Actor | Authenticated internal user |
| Secondary Actor(s) | None confirmed |
| Trigger | The actor selects Logout. |
| Preconditions | The actor has an authenticated access context. |
| Postconditions | Success: protected functions are no longer available through the ended context. Public browsing remains available. |
| Main Success Flow | 1. The actor selects Logout. 2. The system ends or invalidates the applicable context under the approved policy. 3. The system removes access to protected functions. 4. The system presents a non-protected destination. |
| Alternative Flows | A1. If no valid context remains, the system keeps the actor outside protected functions. |
| Exception Flows | E1. If termination cannot be confirmed, the system does not present the context as safely terminated; exact behavior remains `OQ-23`. |
| Business Rules | Logout does not prevent public browsing. Token/session termination semantics remain unresolved. |
| Permissions | Any authenticated internal user may log out of their own context. |
| Related FR(s) | `FR-AUTH-002` |
| Related NFR(s), if applicable | `NFR-AUTH-001`, `NFR-ERR-001` |
| Related BRD Reference | `FE-02`, `SEC-03` |
| Related Open Question(s), if applicable | `OQ-23` |

### `UC-AUTH-004` — Access Protected Functionality

| Field | Specification |
|---|---|
| Use Case ID | `UC-AUTH-004` |
| Use Case Name | Access Protected Functionality |
| Goal | Perform a protected action or view protected information only within approved role and record scope. |
| Scope | Cross-cutting authorization for the internal workspace |
| Primary Actor | Authenticated internal user |
| Secondary Actor(s) | None confirmed |
| Trigger | The actor requests a protected view, record, or action. |
| Preconditions | The actor is authenticated and a protected capability or record is requested. |
| Postconditions | Success: only authorized action/results are provided. Failure: no protected information or action is disclosed. |
| Main Success Flow | 1. The system identifies the actor and role. 2. It identifies the requested capability and applicable record scope. 3. It evaluates the approved permissions. 4. It performs only the authorized action and returns only authorized information. |
| Alternative Flows | A1. Publicly eligible content is served without internal RBAC while confidential content remains excluded. |
| Exception Flows | E1. Missing or insufficient permission results in denial without protected disclosure. E2. An undefined permission is not treated as granted. |
| Business Rules | Least privilege applies. `LAWYER` access is assignment/permitted-record based; Guest has no internal Case or Document access; `CONTENT_CREATOR` has no implicit confidential access. |
| Permissions | Governed by the final role/capability/record matrix in `OQ-04`. |
| Related FR(s) | `FR-AUTH-004` |
| Related NFR(s), if applicable | `NFR-AUTH-001`, `NFR-AUTH-002`, `NFR-PRIV-001`, `NFR-ERR-001` |
| Related BRD Reference | `FE-02`, `FE-03`, `SEC-03`, `SEC-04` |
| Related Open Question(s), if applicable | `OQ-04` |

## 3. User Management Use Cases

### `UC-USER-001` — Create User

| Field | Specification |
|---|---|
| Use Case ID | `UC-USER-001` |
| Use Case Name | Create User |
| Goal | Establish an internal user record with only approved access assignments. |
| Scope | User Management |
| Primary Actor | `SUPER_ADMIN` |
| Secondary Actor(s) | New internal user |
| Trigger | `SUPER_ADMIN` starts Create User. |
| Preconditions | `SUPER_ADMIN` is authenticated and authorized for User Management. |
| Postconditions | Success: the user exists with an approved role/access state and the sensitive change is auditable where required. Failure: no user is created. |
| Main Success Flow | 1. `SUPER_ADMIN` starts user creation. 2. The system presents approved user and access fields. 3. `SUPER_ADMIN` enters approved information and selects only a controlled role/permission assignment. 4. The system validates the information and assignment. 5. The system creates the user and confirms the result. |
| Alternative Flows | A1. `SUPER_ADMIN` cancels before saving. A2. Account activation may be managed separately through `UC-USER-003` under the approved account policy. |
| Exception Flows | E1. Invalid, conflicting, duplicate, or unapproved information is rejected. E2. Credential setup and uniqueness behavior remain `OQ-23`. |
| Business Rules | Only the four BRD roles may be assigned. Creating a record does not grant unapproved permissions or settings. |
| Permissions | `SUPER_ADMIN`, subject to sensitive-operation restrictions in `OQ-04`. |
| Related FR(s) | `FR-USER-001`, `FR-USER-003` |
| Related NFR(s), if applicable | `NFR-AUTH-002`, `NFR-AUD-001`, `NFR-ERR-001` |
| Related BRD Reference | `FE-03`, `SEC-03`, `SEC-05`, `BO-03` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-17`, `OQ-23` |

### `UC-USER-002` — Update User

| Field | Specification |
|---|---|
| Use Case ID | `UC-USER-002` |
| Use Case Name | Update User |
| Goal | Keep internal-user information, approved role/permissions, and permitted settings current. |
| Scope | User Management |
| Primary Actor | `SUPER_ADMIN` |
| Secondary Actor(s) | Affected internal user |
| Trigger | `SUPER_ADMIN` edits a user, role/permission assignment, or permitted setting. |
| Preconditions | The target user exists and `SUPER_ADMIN` is authorized. |
| Postconditions | Success: approved changes are saved, authorization uses the new assignment, and required audit information exists. Failure: prior values remain unchanged. |
| Main Success Flow | 1. `SUPER_ADMIN` selects a user. 2. The system presents current approved information and controllable assignments/settings. 3. `SUPER_ADMIN` enters an allowed change. 4. The system validates it against the approved governance model. 5. The system saves and confirms the change. |
| Alternative Flows | A1. `SUPER_ADMIN` updates profile information without changing access. A2. `SUPER_ADMIN` cancels with no change. |
| Exception Flows | E1. An unapproved role, permission combination, record scope, setting, or invalid user value is rejected. |
| Business Rules | No role outside the four controlled roles may be introduced. Role cardinality, permission combinations, record scopes, and permitted-setting catalog remain unresolved. |
| Permissions | `SUPER_ADMIN`, constrained by `OQ-04`. |
| Related FR(s) | `FR-USER-001`, `FR-USER-003` |
| Related NFR(s), if applicable | `NFR-AUTH-002`, `NFR-AUD-001`, `NFR-ERR-001` |
| Related BRD Reference | `FE-03`, `SEC-03`, `SEC-05`, `BO-03` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-17`, `OQ-23` |

### `UC-USER-003` — Activate / Deactivate User

| Field | Specification |
|---|---|
| Use Case ID | `UC-USER-003` |
| Use Case Name | Activate / Deactivate User |
| Goal | Align an internal user's access state with current authorization. |
| Scope | User Management |
| Primary Actor | `SUPER_ADMIN` |
| Secondary Actor(s) | Affected internal user |
| Trigger | `SUPER_ADMIN` requests an activation-state change. |
| Preconditions | The target user exists and `SUPER_ADMIN` is authorized. |
| Postconditions | Success: the stored access state changes and subsequent authentication/refresh respects it. Failure: the state is unchanged. |
| Main Success Flow | 1. `SUPER_ADMIN` selects the user and requested active/inactive state. 2. The system validates authority and the requested state. 3. The system records the new state. 4. Subsequent login and refresh behavior respects the state. 5. The system confirms the change. |
| Alternative Flows | A1. `SUPER_ADMIN` cancels before confirmation. |
| Exception Flows | E1. An invalid or unauthorized change is rejected. E2. Effects on existing sessions and self-deactivation restrictions remain `OQ-23` / `OQ-04`. |
| Business Rules | A deactivated account must not authenticate or receive renewed access. The full account lifecycle is unresolved. |
| Permissions | `SUPER_ADMIN`, subject to `OQ-04`. |
| Related FR(s) | `FR-USER-002`, `FR-AUTH-001`, `FR-AUTH-003` |
| Related NFR(s), if applicable | `NFR-AUTH-001`, `NFR-AUTH-002`, `NFR-AUD-001` |
| Related BRD Reference | `FE-02`, `FE-03`, `SEC-03`, `SEC-05` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-17`, `OQ-23` |

## 4. Lawyer Management Use Cases

### `UC-LAW-001` — Manage Lawyer Profile

| Field | Specification |
|---|---|
| Use Case ID | `UC-LAW-001` |
| Use Case Name | Manage Lawyer Profile |
| Goal | Maintain accurate lawyer information and control its public visibility under approved content rules. |
| Scope | Lawyer Management and authorized public content |
| Primary Actor | Authorized internal user; exact role remains `OQ-04` / `OQ-21` |
| Secondary Actor(s) | Lawyer represented by the profile |
| Trigger | The actor creates, edits, or requests a visibility change for a lawyer profile. |
| Preconditions | The actor is authenticated and authorized for Lawyer Management; an existing profile is required for update/visibility change. |
| Postconditions | Success: approved profile information and/or visibility is saved. Failure: prior public information remains unchanged. |
| Main Success Flow | 1. The actor opens a new or existing profile. 2. The system presents approved profile and portrait fields. 3. The actor maintains biography, experience, qualifications, practice areas, portrait, professional title, and visibility. 4. The system validates information and applicable publication rules. 5. The system saves and confirms the permitted change. |
| Alternative Flows | A1. The profile remains non-public while being prepared. A2. The actor updates internal profile information without changing visibility. |
| Exception Flows | E1. Invalid information, unsupported portrait input, insufficient permission, missing approval, incomplete information, or confidentiality concern blocks the affected change. |
| Business Rules | Only authorized lawyer data may be public. Publication lifecycle, approval roles, required fields, image rules, and localization are unresolved. |
| Permissions | Final Lawyer/content workflow matrix under `OQ-04` and `OQ-21`. |
| Related FR(s) | `FR-LAW-001`, `FR-LAW-002` |
| Related NFR(s), if applicable | `NFR-AUTH-002`, `NFR-AUD-001`, `NFR-PRIV-001` |
| Related BRD Reference | `FE-04`, `FE-09`, `WEB-03`, `SEC-04`, `BO-01`, `BO-03` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-21`, `OQ-25` |

### `UC-LAW-002` — View Lawyer Profile

| Field | Specification |
|---|---|
| Use Case ID | `UC-LAW-002` |
| Use Case Name | View Lawyer Profile |
| Goal | Learn about an approved lawyer's professional profile. |
| Scope | Public Lawyer presentation |
| Primary Actor | Guest / Public Visitor |
| Secondary Actor(s) | None confirmed |
| Trigger | The Guest selects a published lawyer from a public listing or homepage section. |
| Preconditions | The profile is publicly eligible under approved rules. |
| Postconditions | The Guest sees only approved public lawyer information; internal information remains protected. |
| Main Success Flow | 1. The Guest selects a published lawyer. 2. The system verifies public eligibility. 3. The system presents approved portrait, title, experience, specialization, and other eligible profile content. 4. Applicable approved metadata is included. |
| Alternative Flows | A1. The Guest returns to the public lawyer listing or uses a consultation/contact action. |
| Exception Flows | E1. A non-public, incomplete, or unavailable profile is not disclosed. |
| Business Rules | Public presentation contains only authorized lawyer data and never grants internal access. |
| Permissions | Public read of publicly eligible profiles only. |
| Related FR(s) | `FR-LAW-002`, `FR-WEB-002` |
| Related NFR(s), if applicable | `NFR-PRIV-001`, `NFR-A11Y-002`, `NFR-RWD-001`, `NFR-SEO-001` |
| Related BRD Reference | `FE-01`, `FE-04`, `WEB-03`, `SEC-04`, `BO-01` |
| Related Open Question(s), if applicable | `OQ-21`, `OQ-25` |

## 5. Lead Management Use Cases

### `UC-LEAD-001` — Submit Website Lead

| Field | Specification |
|---|---|
| Use Case ID | `UC-LEAD-001` |
| Use Case Name | Submit Website Lead |
| Goal | Submit a consultation request that becomes a centralized Lead. |
| Scope | Public consultation intake and Lead Management |
| Primary Actor | Guest / Public Visitor |
| Secondary Actor(s) | Approved anti-abuse service; authorized notification recipients |
| Trigger | The Guest submits the public consultation form. |
| Preconditions | The form is available; production submission uses reCAPTCHA v3 or an approved equivalent. |
| Postconditions | Success: one Lead exists with source `WEBSITE` and status `NEW`, receipt is acknowledged safely, and the new-lead notification capability is triggered. Failure: no successful Lead creation is represented. |
| Main Success Flow | 1. The Guest opens the consultation form. 2. The Guest supplies consultation information and required anti-abuse/consent evidence once approved. 3. The system validates the approved rules and anti-abuse result. 4. The system creates a Lead with source `WEBSITE` and status `NEW`. 5. The system safely acknowledges receipt. 6. The system triggers new-lead notification. |
| Alternative Flows | A1. The Guest selects Zalo, Facebook Messenger, or hotline instead; automatic Lead creation is not assumed. A2. Appointment selection is not added pending `OQ-24`. |
| Exception Flows | E1. Failed validation, anti-abuse verification, duplicate handling, or processing prevents creation and returns a safe result. E2. Missing consent/intake rules remain unresolved rather than inferred. |
| Business Rules | Guest receives no internal access. Required fields, consent evidence, privacy notice, and duplicate behavior remain unresolved. |
| Permissions | Public submission; internal Lead retrieval is protected. |
| Related FR(s) | `FR-LEAD-001`, `FR-NOTI-001` |
| Related NFR(s), if applicable | `NFR-SEC-001`, `NFR-SEC-002`, `NFR-PRIV-001`, `NFR-PRIV-002`, `NFR-A11Y-001`, `NFR-ERR-001` |
| Related BRD Reference | `FE-01`, `FE-05`, `FE-12`, `SEC-02`, `SEC-04`, `BO-02`, `BO-03` |
| Related Open Question(s), if applicable | `OQ-06`, `OQ-09`, `OQ-12`, `OQ-20`, `OQ-24` |

### `UC-LEAD-002` — View / Manage Lead

| Field | Specification |
|---|---|
| Use Case ID | `UC-LEAD-002` |
| Use Case Name | View / Manage Lead |
| Goal | Review a permitted Lead and maintain follow-up information. |
| Scope | Lead Management |
| Primary Actor | `SUPER_ADMIN`, `LEGAL_ASSISTANT`, or assigned `LAWYER` |
| Secondary Actor(s) | Responsible staff or lawyer |
| Trigger | The actor opens Lead Management or a Lead and optionally records follow-up. |
| Preconditions | The actor is authenticated and has permission for the requested Lead. |
| Postconditions | Success: only permitted Lead details are shown and approved follow-up changes are saved. Failure: protected information and existing data remain unchanged. |
| Main Success Flow | 1. The system limits the Lead list to the actor's permitted scope. 2. The actor selects a Lead. 3. The system presents permitted details. 4. The actor records approved follow-up information. 5. The system validates and saves the change. 6. The system confirms the result. |
| Alternative Flows | A1. The actor views without changing the Lead. A2. Assignment is handled through `UC-LEAD-003`; status through `UC-LEAD-004`. |
| Exception Flows | E1. Record-scope denial, invalid information, or a conflicting change prevents the update without protected disclosure. |
| Business Rules | `SUPER_ADMIN` may view all Leads; `LAWYER` may view assigned Leads; `LEGAL_ASSISTANT` may receive and qualify Leads. Exact record scope remains unresolved. |
| Permissions | BRD actor boundaries and final matrix under `OQ-04`. |
| Related FR(s) | `FR-LEAD-003` |
| Related NFR(s), if applicable | `NFR-AUTH-002`, `NFR-PRIV-001`, `NFR-AUD-001`, `NFR-ERR-001` |
| Related BRD Reference | `FE-05`, `SEC-03`, `SEC-04`, `BO-03` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-06`, `OQ-15` |

### `UC-LEAD-003` — Assign Lead

| Field | Specification |
|---|---|
| Use Case ID | `UC-LEAD-003` |
| Use Case Name | Assign Lead |
| Goal | Make responsibility for a permitted Lead visible to authorized personnel. |
| Scope | Lead Management |
| Primary Actor | `LEGAL_ASSISTANT`; `SUPER_ADMIN` only if permitted by the final matrix |
| Secondary Actor(s) | Assigned `LAWYER` or responsible internal user |
| Trigger | The actor requests a responsible staff/lawyer assignment. |
| Preconditions | The Lead exists; the actor may assign it; the proposed assignee is eligible under approved rules. |
| Postconditions | Success: the approved responsibility is saved and visible to permitted users. Failure: the existing assignment is unchanged. |
| Main Success Flow | 1. The actor opens a permitted Lead. 2. The system presents only eligible assignees under approved rules. 3. The actor selects an assignee. 4. The system validates actor, Lead scope, and assignee eligibility. 5. The system saves and confirms the assignment. |
| Alternative Flows | A1. The actor cancels without changing responsibility. A2. Reassignment follows the same approved checks if allowed. |
| Exception Flows | E1. Invalid assignee, insufficient permission, record-scope denial, or conflicting update causes rejection. |
| Business Rules | `LEGAL_ASSISTANT` may assign Leads. Exact eligible roles, reassignment rules, and record scope remain `OQ-04`. |
| Permissions | Assignment authority and record scope under `OQ-04`. |
| Related FR(s) | `FR-LEAD-003` |
| Related NFR(s), if applicable | `NFR-AUTH-002`, `NFR-AUD-001`, `NFR-ERR-001` |
| Related BRD Reference | `FE-05`, `SEC-03`, `SEC-04`, `BO-03` |
| Related Open Question(s), if applicable | `OQ-04` |

### `UC-LEAD-004` — Update Lead Status

| Field | Specification |
|---|---|
| Use Case ID | `UC-LEAD-004` |
| Use Case Name | Update Lead Status |
| Goal | Record an authorized Lead lifecycle change using controlled statuses. |
| Scope | Lead Management |
| Primary Actor | `LEGAL_ASSISTANT`; assigned `LAWYER` or `SUPER_ADMIN` where permitted |
| Secondary Actor(s) | None confirmed |
| Trigger | The actor requests a Lead status change. |
| Preconditions | The Lead exists and the actor is authorized for the Lead and requested transition. |
| Postconditions | Success: the approved status is saved. Failure: the status remains unchanged. Conversion to `CONVERTED` occurs only through approved Lead-to-Case behavior. |
| Main Success Flow | 1. The actor selects a permitted Lead and proposed status. 2. The system validates the value and transition. 3. On the confirmed positive path, the system permits `NEW` → `CONTACTED` → `QUALIFIED`. 4. `CONVERTED` is applied only with successful `UC-CASE-001`. 5. The system saves and confirms the approved change. |
| Alternative Flows | A1. A Lead enters terminal `LOST` only after allowed source transitions and reason rules are approved. |
| Exception Flows | E1. Unknown status, unauthorized/skipped transition, missing qualification evidence, or unmet conversion rules causes rejection. |
| Business Rules | Qualification and `LOST` rules remain `OQ-15`; conversion rules remain `OQ-05`. No unapproved transition is inferred. |
| Permissions | Transition and record-scope authority under `OQ-04`. |
| Related FR(s) | `FR-LEAD-004`, `FR-CASE-001` |
| Related NFR(s), if applicable | `NFR-AUTH-002`, `NFR-REL-001`, `NFR-AUD-001`, `NFR-ERR-001` |
| Related BRD Reference | `FE-05`, `FE-07`, `SEC-03`, `BO-02`, `BO-03` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-05`, `OQ-15` |

### `UC-LEAD-005` — Register External-source Lead

| Field | Specification |
|---|---|
| Use Case ID | `UC-LEAD-005` |
| Use Case Name | Register External-source Lead |
| Goal | Centralize an inquiry received through `ZALO`, `FACEBOOK`, `HOTLINE`, or `REFERRAL`. |
| Scope | Lead Management |
| Primary Actor | `LEGAL_ASSISTANT` |
| Secondary Actor(s) | Other authorized internal role or approved future channel integration, only after applicable decisions |
| Trigger | The actor records an inquiry received outside the website form. |
| Preconditions | The actor is authenticated and authorized; inquiry information from a confirmed source is available. |
| Postconditions | Success: a Lead exists with the selected controlled source and status `NEW`; new-lead notification is triggered. Failure: no successful record is represented. |
| Main Success Flow | 1. The actor starts internal Lead intake. 2. The actor selects `ZALO`, `FACEBOOK`, `HOTLINE`, or `REFERRAL` and supplies approved information. 3. The system validates source and intake rules. 4. The system creates the Lead as `NEW`. 5. The system confirms creation and triggers new-lead notification. |
| Alternative Flows | A1. An approved future integration may supply the Lead only after `OQ-13` is resolved; manual registration remains the confirmed path. |
| Exception Flows | E1. Invalid source, insufficient permission, validation failure, or unresolved duplicate behavior prevents or suspends creation under future approved rules. |
| Business Rules | Only the five controlled sources are allowed. This use case does not commit message synchronization or provider integration. |
| Permissions | `LEGAL_ASSISTANT` is confirmed for intake; additions depend on `OQ-04` / `OQ-13`. |
| Related FR(s) | `FR-LEAD-002`, `FR-NOTI-001` |
| Related NFR(s), if applicable | `NFR-AUTH-002`, `NFR-PRIV-002`, `NFR-REL-001`, `NFR-ERR-001` |
| Related BRD Reference | `FE-01`, `FE-05`, `FE-12`, `SEC-04`, `BO-02`, `BO-03` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-06`, `OQ-09`, `OQ-12`, `OQ-13`, `OQ-20` |

## 6. Appointment Use Cases

### `UC-APP-001` — Create Appointment

| Field | Specification |
|---|---|
| Use Case ID | `UC-APP-001` |
| Use Case Name | Create Appointment |
| Goal | Record an authorized Appointment using a controlled type and status. |
| Scope | Appointment Management |
| Primary Actor | `LEGAL_ASSISTANT`; other internal roles remain `OQ-04` |
| Secondary Actor(s) | Participant and responsible `LAWYER`; Guest involvement remains `OQ-24` |
| Trigger | The actor starts Create Appointment. |
| Preconditions | The actor is authenticated and authorized; scheduling information required by approved rules is available. |
| Postconditions | Success: a permitted Appointment is saved and visible within authorized scope. Failure: no Appointment is created. |
| Main Success Flow | 1. The actor starts appointment creation. 2. The actor supplies approved scheduling/participant information, one controlled type, and an allowed initial status. 3. The system validates authority, values, and approved scheduling rules. 4. The system saves the Appointment. 5. The system confirms it and makes it available to permitted users. |
| Alternative Flows | A1. The actor cancels before saving. A2. A Guest-specific appointment request is not introduced pending `OQ-24`. |
| Exception Flows | E1. Unknown type/status, invalid information, insufficient permission, or conflict under future approved scheduling rules prevents creation. |
| Business Rules | Types are `ONLINE`, `OFFLINE`, `PHONE_CALL`; statuses are `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELED`. Availability, time zone, reminders, and participant linkage remain unresolved. |
| Permissions | `LEGAL_ASSISTANT` may schedule Appointments; additional roles and scope depend on `OQ-04`. |
| Related FR(s) | `FR-APP-001`, `FR-APP-002` |
| Related NFR(s), if applicable | `NFR-AUTH-002`, `NFR-PRIV-001`, `NFR-REL-001`, `NFR-ERR-001` |
| Related BRD Reference | `FE-06`, `SEC-03`, `SEC-04`, `BO-03` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-16`, `OQ-24` |

### `UC-APP-002` — Update Appointment Status

| Field | Specification |
|---|---|
| Use Case ID | `UC-APP-002` |
| Use Case Name | Update Appointment Status |
| Goal | Keep a permitted Appointment's current coordination status accurate. |
| Scope | Appointment Management |
| Primary Actor | `LEGAL_ASSISTANT`; other authorized internal roles remain `OQ-04` |
| Secondary Actor(s) | `LAWYER` viewing own Appointment; `SUPER_ADMIN` viewing all Appointments |
| Trigger | The actor opens a permitted Appointment and requests a status update. |
| Preconditions | The Appointment exists; the actor is authenticated and authorized for it. |
| Postconditions | Success: an approved status is saved and visible to permitted users. Failure: the previous status remains. |
| Main Success Flow | 1. The system returns only Appointments within the actor's scope. 2. The actor selects an Appointment. 3. The system presents permitted details and controlled statuses. 4. The actor requests an allowed change. 5. The system validates and saves it. 6. The system confirms the result. |
| Alternative Flows | A1. The actor views without changing status. A2. Rescheduling or cancellation proceeds only after applicable rules are approved. |
| Exception Flows | E1. Out-of-scope access, unknown status, invalid transition, schedule conflict, or insufficient permission is rejected. |
| Business Rules | No transition, rescheduling, reminder, completion, or cancellation policy is inferred before `OQ-16`. |
| Permissions | `SUPER_ADMIN` may view all; `LAWYER` may view own; `LEGAL_ASSISTANT` may coordinate. Update authority remains `OQ-04`. |
| Related FR(s) | `FR-APP-001`, `FR-APP-002` |
| Related NFR(s), if applicable | `NFR-AUTH-002`, `NFR-PRIV-001`, `NFR-AUD-001`, `NFR-ERR-001` |
| Related BRD Reference | `FE-06`, `SEC-03`, `SEC-04`, `BO-03` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-16`, `OQ-24` |

## 7. Case Management Use Cases

### `UC-CASE-001` — Create / Convert to Case

| Field | Specification |
|---|---|
| Use Case ID | `UC-CASE-001` |
| Use Case Name | Create / Convert to Case |
| Goal | Convert an appropriately qualified Lead into a related legal Case as one consistent business outcome. |
| Scope | Lead-to-Case conversion |
| Primary Actor | Authorized internal user; exact authority remains `OQ-04` / `OQ-05` |
| Secondary Actor(s) | Responsible Lead owner and assigned lawyer if approved |
| Trigger | The actor requests conversion of a qualified Lead. |
| Preconditions | The Lead exists and is appropriately qualified; actor authorization and conversion rules have been approved. |
| Postconditions | Success: a related Case exists and the Lead is `CONVERTED`. Failure: no Case is represented as created and the Lead remains unconverted. |
| Main Success Flow | 1. The actor selects an appropriately qualified Lead. 2. The system verifies qualification, conversion authority, required mapping, and approved validations. 3. The actor supplies any approved Case-creation information. 4. The system creates the related Case as one consistent business operation. 5. Only after success, the system changes the Lead to `CONVERTED`. 6. The system confirms conversion. |
| Alternative Flows | A1. The qualified Lead remains `QUALIFIED` when conversion is not requested or approved. |
| Exception Flows | E1. Missing qualification, validation failure, insufficient permission, duplicate/conflicting conversion, or Case-creation failure leaves the Lead unconverted. |
| Business Rules | Only an appropriately qualified Lead may convert. Approval, mapping, transaction, duplicate, and rollback rules are not invented. |
| Permissions | Conversion authority and record scope remain `OQ-04` / `OQ-05`. |
| Related FR(s) | `FR-CASE-001`, `FR-LEAD-004` |
| Related NFR(s), if applicable | `NFR-AUTH-002`, `NFR-REL-001`, `NFR-AUD-001`, `NFR-ERR-001` |
| Related BRD Reference | `FE-05`, `FE-07`, `SEC-03`, `SEC-04`, `BO-03` |
| Related Open Question(s), if applicable | `OQ-03`, `OQ-04`, `OQ-05`, `OQ-06` |

### `UC-CASE-002` — Manage Case

| Field | Specification |
|---|---|
| Use Case ID | `UC-CASE-002` |
| Use Case Name | Manage Case |
| Goal | View and maintain permitted Case information and activities without inventing an unapproved lifecycle. |
| Scope | Case Management |
| Primary Actor | Assigned `LAWYER` |
| Secondary Actor(s) | `SUPER_ADMIN` as confirmed all-Case viewer; other editing roles remain `OQ-04` |
| Trigger | The actor opens an assigned Case or records an activity/update. |
| Preconditions | The Case exists; the actor is authenticated, assigned, and authorized for the requested action. |
| Postconditions | Success: permitted information/activity is saved and attributable. Failure: the Case is unchanged and no protected information is disclosed. |
| Main Success Flow | 1. The system verifies assignment and record permission. 2. It presents permitted Case information. 3. The actor records approved Case information or an activity. 4. The system validates the update. 5. The system saves and confirms it. |
| Alternative Flows | A1. The actor views without changing the Case. A2. A Case status is maintained only after the status set and lifecycle are approved. |
| Exception Flows | E1. Missing assignment, invalid information, unauthorized action, or unapproved status/transition causes rejection. |
| Business Rules | Case statuses, transitions, closure, reopening, ownership, and detailed activity rules remain entirely governed by `OQ-03`. |
| Permissions | Assigned `LAWYER` within permitted scope; `SUPER_ADMIN` all-Case view is confirmed, but edit authority is not assumed. |
| Related FR(s) | `FR-CASE-002`, `FR-CASE-003` |
| Related NFR(s), if applicable | `NFR-AUTH-002`, `NFR-DATA-001`, `NFR-AUD-001`, `NFR-PRIV-001`, `NFR-ERR-001` |
| Related BRD Reference | `FE-07`, `SEC-03`, `SEC-04`, `SEC-05`, `BO-03` |
| Related Open Question(s), if applicable | `OQ-03`, `OQ-04`, `OQ-17` |

### `UC-CASE-003` — Assign Lawyers to Case

| Field | Specification |
|---|---|
| Use Case ID | `UC-CASE-003` |
| Use Case Name | Assign Lawyers to Case |
| Goal | Make approved lawyer responsibility for a Case visible and control subsequent Case access. |
| Scope | Case Management |
| Primary Actor | Authorized internal user; assignment authority remains `OQ-03` / `OQ-04` |
| Secondary Actor(s) | Assigned `LAWYER` |
| Trigger | The actor requests an assigned-lawyer change on a Case. |
| Preconditions | The Case exists; the actor may assign it; proposed lawyer eligibility can be evaluated. |
| Postconditions | Success: approved assignment is saved and authorization reflects it. Failure: prior assignments remain unchanged. |
| Main Success Flow | 1. The actor opens a permitted Case. 2. The system presents eligible lawyers under approved rules. 3. The actor selects the requested assignment. 4. The system validates actor authority, Case scope, lawyer eligibility, and approved ownership rules. 5. The system saves and confirms the assignment. |
| Alternative Flows | A1. The actor views current assignments without change. A2. Multiple assignments are handled only if approved under `OQ-03`. |
| Exception Flows | E1. Unauthorized Case access, invalid lawyer, or unapproved assignment/cardinality causes rejection. |
| Business Rules | `LAWYER` access is assignment based. Assignment cardinality, ownership, removal, and reassignment rules are unresolved. |
| Permissions | Final Case assignment authority and record scope under `OQ-03` / `OQ-04`. |
| Related FR(s) | `FR-CASE-002` |
| Related NFR(s), if applicable | `NFR-AUTH-002`, `NFR-AUD-001`, `NFR-ERR-001` |
| Related BRD Reference | `FE-07`, `SEC-03`, `SEC-04`, `BO-03` |
| Related Open Question(s), if applicable | `OQ-03`, `OQ-04` |

## 8. Document Management Use Cases

### `UC-DOC-001` — Upload Document

| Field | Specification |
|---|---|
| Use Case ID | `UC-DOC-001` |
| Use Case Name | Upload Document |
| Goal | Add a supported file to an authorized Case or permitted pre-litigation context while keeping it private. |
| Scope | Document Management |
| Primary Actor | `LAWYER` or `LEGAL_ASSISTANT` |
| Secondary Actor(s) | Active private object-storage service |
| Trigger | The actor selects a file and submits an upload. |
| Preconditions | The actor is authenticated and authorized for the association; the environment has one approved active storage provider. |
| Postconditions | Success: a private stored Document with UUID-based stored filename is associated with the permitted context. Failure: no public or successful object is exposed. |
| Main Success Flow | 1. The actor selects the permitted Case or pre-litigation context. 2. The actor selects a file and approved document information. 3. The system validates record permission, association, type, and size. 4. The system gives the stored file a UUID-based filename. 5. The system stores it privately in the active AWS S3 or MinIO target. 6. The system records the association and confirms upload. |
| Alternative Flows | A1. The actor cancels before submission. A2. AWS S3 and MinIO are alternatives by environment, not dual mandatory destinations. |
| Exception Flows | E1. Unsupported type, size over 20 MB, failed authorization, invalid association, or storage failure prevents upload. |
| Business Rules | Only PDF, DOCX, JPG, and PNG are supported; maximum size is 20 MB; stored filenames are UUID-based; objects are private. |
| Permissions | `LAWYER` for permitted Case Documents; `LEGAL_ASSISTANT` for permitted pre-litigation Documents; final matrix is `OQ-04`. |
| Related FR(s) | `FR-DOC-001` |
| Related NFR(s), if applicable | `NFR-AUTH-002`, `NFR-DATA-001`, `NFR-FILE-001`, `NFR-ERR-001` |
| Related BRD Reference | `FE-08`, `SEC-03`, `SEC-04`, `SEC-06`, `BO-03`, `AS-03` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-07`, `OQ-08`, `OQ-12`, `OQ-29` |

### `UC-DOC-002` — Access / Download Document

| Field | Specification |
|---|---|
| Use Case ID | `UC-DOC-002` |
| Use Case Name | Access / Download Document |
| Goal | List and obtain temporary access to a private Document within the actor's permitted record scope. |
| Scope | Document Management |
| Primary Actor | `LAWYER` or `LEGAL_ASSISTANT` |
| Secondary Actor(s) | Active private object-storage service |
| Trigger | The actor views a Document list or requests access/download. |
| Preconditions | The actor is authenticated and requests a Document within an authorized Case or pre-litigation scope. |
| Postconditions | Success: only permitted metadata and temporary private access are provided. Failure: the file remains undisclosed. |
| Main Success Flow | 1. The actor opens Documents in a permitted context. 2. The system evaluates record-level permission and lists only permitted Documents. 3. The actor selects a Document. 4. The system rechecks access. 5. The system provides temporary authorized access, which may use a presigned URL. 6. The object remains non-public. |
| Alternative Flows | A1. A later approved private access mechanism may replace presigned access without changing the actor goal. |
| Exception Flows | E1. Missing permission/object, expired temporary access, or storage failure denies access without disclosing the file. |
| Business Rules | Authorization is required for each access. `LAWYER` does not automatically receive every Document. Temporary-access lifetime remains unapproved. |
| Permissions | Case/pre-litigation scope under `OQ-04`; no public access. |
| Related FR(s) | `FR-DOC-002` |
| Related NFR(s), if applicable | `NFR-AUTH-002`, `NFR-FILE-001`, `NFR-FILE-002`, `NFR-PRIV-001`, `NFR-ERR-001` |
| Related BRD Reference | `FE-08`, `SEC-03`, `SEC-04`, `BO-03` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-07`, `OQ-12`, `OQ-29` |

### `UC-DOC-003` — Manage Document Metadata / Lifecycle

| Field | Specification |
|---|---|
| Use Case ID | `UC-DOC-003` |
| Use Case Name | Manage Document Metadata / Lifecycle |
| Goal | Maintain only currently approved Document association information and apply lifecycle actions only after governing policy is approved. |
| Scope | Document Management |
| Primary Actor | Authorized internal user; lifecycle authority remains `OQ-04` / `OQ-08` |
| Secondary Actor(s) | Legal-hold/retention decision owner once confirmed; audit capability |
| Trigger | The actor reviews Document information or requests an approved lifecycle action. |
| Preconditions | The private Document exists; any requested retention, deletion, recovery, legal-hold, or disposal action has an approved governing policy. |
| Postconditions | Success: only a permitted lifecycle result is applied and audited where required. Failure: the Document remains protected; no irreversible action is inferred. |
| Main Success Flow | 1. The actor opens a permitted Document and its approved information/association. 2. For a lifecycle request, the system identifies the approved policy. 3. The system checks authority, retention, and legal-hold state. 4. The system performs only the permitted action. 5. The system records required sensitive activity and confirms the result. |
| Alternative Flows | A1. Retention or legal hold prevents deletion and the Document remains protected. A2. The actor only views current metadata/association; no unapproved metadata-edit behavior is added. |
| Exception Flows | E1. While policy is unresolved, irreversible disposal is blocked. E2. Unauthorized or policy-conflicting action is rejected. |
| Business Rules | Retention is `OQ-07`; deletion/recovery/legal hold/disposal is `OQ-08`; applicable law is `OQ-12`; audit coverage is `OQ-17`. |
| Permissions | Final lifecycle and record-level authority under `OQ-04` / `OQ-08`. |
| Related FR(s) | `FR-DOC-003`, `FR-DOC-001`, `FR-AUDIT-001` |
| Related NFR(s), if applicable | `NFR-DATA-002`, `NFR-FILE-001`, `NFR-AUD-001`, `NFR-AUD-002`, `NFR-ERR-001` |
| Related BRD Reference | `FE-08`, `FE-13`, `SEC-04`, `SEC-05`, `BO-03` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-07`, `OQ-08`, `OQ-12`, `OQ-17` |

## 9. CMS Use Cases

### `UC-CMS-001` — Manage Blog Content

| Field | Specification |
|---|---|
| Use Case ID | `UC-CMS-001` |
| Use Case Name | Manage Blog Content |
| Goal | Maintain authorized Legal Insights / Blog content for controlled public presentation. |
| Scope | Content Management |
| Primary Actor | `CONTENT_CREATOR` |
| Secondary Actor(s) | Other authorized review/publishing role remains `OQ-21` |
| Trigger | The actor creates or edits a Blog post. |
| Preconditions | The actor is authenticated and authorized for Blog content. |
| Postconditions | Success: approved content changes are saved and become public only under approved lifecycle rules. Failure: current public content is unchanged. |
| Main Success Flow | 1. The actor starts a new post or opens an existing one. 2. The system presents approved Blog fields. 3. The actor supplies content and applicable publication/SEO information. 4. The system validates approved rules. 5. The system saves and confirms the permitted result. |
| Alternative Flows | A1. The post remains non-public while being prepared if the approved lifecycle supports it. |
| Exception Flows | E1. Invalid content, insufficient permission, or unmet approval blocks the public change. |
| Business Rules | Draft, review, publication, unpublication, archive states, ownership, exact fields, and localization remain unresolved. |
| Permissions | `CONTENT_CREATOR` within the final content/RBAC workflow. |
| Related FR(s) | `FR-CMS-002`, `FR-SEO-001` |
| Related NFR(s), if applicable | `NFR-AUTH-002`, `NFR-AUD-001`, `NFR-SEO-001`, `NFR-ERR-001` |
| Related BRD Reference | `FE-01`, `FE-09`, `FE-10`, `BO-01` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-21`, `OQ-25` |

### `UC-CMS-002` — Manage Case Study

| Field | Specification |
|---|---|
| Use Case ID | `UC-CMS-002` |
| Use Case Name | Manage Case Study |
| Goal | Maintain and publish a Case Study only after required anonymization, confidentiality review, and approval. |
| Scope | Content Management |
| Primary Actor | `CONTENT_CREATOR` or permitted `LAWYER` |
| Secondary Actor(s) | Approval/review actor remains `OQ-14` / `OQ-21` |
| Trigger | The actor creates, edits, reviews, or requests publication of a Case Study. |
| Preconditions | The actor is authorized; source material may be used publicly; publication requires approved review. |
| Postconditions | Success: the Case Study is saved non-publicly or made public only with approved evidence. Failure: no unsafe public change occurs. |
| Main Success Flow | 1. The actor maintains Background, Challenge, Legal Strategy, and Result. 2. The system applies approved completeness/workflow checks. 3. The authorized parties perform the approved anonymization/confidentiality review. 4. The system verifies approval evidence. 5. Only then, the system makes the Case Study public and confirms the result. |
| Alternative Flows | A1. The Case Study remains non-public for revision. A2. Unpublication/archive is available only under the approved lifecycle. |
| Exception Flows | E1. Missing approval, failed confidentiality review, invalid content, or insufficient permission prevents publication. |
| Business Rules | Public Case Studies must be anonymized, approved, and protect client identity/confidential details. Approval owner and checklist are unresolved. |
| Permissions | `LAWYER` may contribute/update authorized Case Studies; `CONTENT_CREATOR` may manage where permitted; approval authority is unresolved. |
| Related FR(s) | `FR-CMS-003`, `FR-AUDIT-001` |
| Related NFR(s), if applicable | `NFR-AUTH-002`, `NFR-PRIV-001`, `NFR-AUD-001`, `NFR-SEO-001` |
| Related BRD Reference | `FE-09`, `WEB-05`, `SEC-04`, `BO-01`, `AS-02` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-12`, `OQ-14`, `OQ-21`, `OQ-25` |

### `UC-CMS-003` — Manage Service / Public Content

| Field | Specification |
|---|---|
| Use Case ID | `UC-CMS-003` |
| Use Case Name | Manage Service / Public Content |
| Goal | Maintain authorized Personal and Corporate Legal Service content for controlled public presentation. |
| Scope | Content Management |
| Primary Actor | `CONTENT_CREATOR` |
| Secondary Actor(s) | Other authorized content role remains `OQ-04` / `OQ-21` |
| Trigger | The actor creates or edits Service content. |
| Preconditions | The actor is authenticated and authorized for the selected content. |
| Postconditions | Success: approved content is saved and exposed only when eligible. Failure: current public content remains unchanged. |
| Main Success Flow | 1. The actor selects Service content. 2. The system presents approved Service fields. 3. The actor enters changes and applicable publication/SEO information. 4. The system validates scope and approved content rules. 5. The system saves and confirms the permitted result. |
| Alternative Flows | A1. Content remains non-public while being prepared under the approved lifecycle. |
| Exception Flows | E1. Invalid content, insufficient permission, missing approval, or an attempt to add advanced B2B workflow behavior blocks the affected change. |
| Business Rules | Current examples include Criminal Litigation, Civil Litigation, Marriage & Family, and Land Disputes; final catalog is content-managed. Advanced B2B workflows remain out of scope. |
| Permissions | `CONTENT_CREATOR` for authorized public content; final workflow permissions remain `OQ-04` / `OQ-21`. |
| Related FR(s) | `FR-CMS-001`, `FR-SEO-001` |
| Related NFR(s), if applicable | `NFR-AUTH-002`, `NFR-AUD-001`, `NFR-SEO-001`, `NFR-ERR-001` |
| Related BRD Reference | `FE-01`, `FE-09`, `WEB-02`, `BO-01`, `BO-04`, `LI-06` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-21`, `OQ-25` |

## 10. SEO Use Cases

### `UC-SEO-001` — Manage SEO Metadata

| Field | Specification |
|---|---|
| Use Case ID | `UC-SEO-001` |
| Use Case Name | Manage SEO Metadata |
| Goal | Maintain approved search and sharing metadata for relevant public content. |
| Scope | SEO Management |
| Primary Actor | `CONTENT_CREATOR` |
| Secondary Actor(s) | Other authorized content role remains `OQ-04` / `OQ-21` |
| Trigger | The actor opens or saves SEO metadata for a relevant content item/page. |
| Preconditions | Relevant public content exists and the actor is authenticated and authorized. |
| Postconditions | Success: valid approved metadata is saved and associated with eligible content. Failure: existing metadata/public output is unchanged. |
| Main Success Flow | 1. The actor selects relevant public content. 2. The system presents Meta Title, Meta Description, Canonical URL, and Open Graph metadata fields. 3. The actor maintains supported values. 4. The system validates approved formats and content rules. 5. The system saves and confirms the metadata. |
| Alternative Flows | A1. A field may remain absent; no fallback is invented before content rules are approved. |
| Exception Flows | E1. Invalid metadata or insufficient permission prevents saving or public exposure. |
| Business Rules | Supported metadata is limited to the confirmed field types. Exact lengths, requiredness, URL rules, defaults, page coverage, and localization remain unresolved. |
| Permissions | `CONTENT_CREATOR`; final content/RBAC matrix remains `OQ-04` / `OQ-21`. |
| Related FR(s) | `FR-SEO-001` |
| Related NFR(s), if applicable | `NFR-AUTH-002`, `NFR-SEO-001`, `NFR-SEO-002`, `NFR-ERR-001` |
| Related BRD Reference | `FE-09`, `FE-10`, `BO-01` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-21`, `OQ-25`, `OQ-35` |

### `UC-SEO-002` — Expose SEO Metadata on Public Pages

| Field | Specification |
|---|---|
| Use Case ID | `UC-SEO-002` |
| Use Case Name | Expose SEO Metadata on Public Pages |
| Goal | Receive public pages with applicable approved search, sharing, and structured metadata without invented business facts. |
| Scope | SEO Management and Public Website |
| Primary Actor | Guest / Public Visitor |
| Secondary Actor(s) | Search and sharing consumers |
| Trigger | The Guest or a public consumer requests a relevant public page. |
| Preconditions | Publicly eligible content exists; approved metadata or structured-data values may exist. |
| Postconditions | The page contains only applicable approved metadata/JSON-LD; unsupported claims are absent. |
| Main Success Flow | 1. The system identifies the publicly eligible page/content. 2. It retrieves approved search and sharing metadata. 3. It identifies applicable approved structured-data values. 4. It includes valid metadata and applicable `LegalService` or `LocalBusiness` JSON-LD with the public page. 5. The page is returned. |
| Alternative Flows | A1. A page without approved metadata/structured data is served without inventing values or business facts. |
| Exception Flows | E1. Missing or invalid source values prevent the affected metadata from being emitted; the page does not claim unconfirmed information. |
| Business Rules | The two named structured-data types are relevant, not mandatory on every page. No unapproved service, address, credential, rating, or fact is generated. |
| Permissions | Public read; configuration remains protected. |
| Related FR(s) | `FR-SEO-001`, `FR-SEO-002`, `FR-WEB-002` |
| Related NFR(s), if applicable | `NFR-SEO-001`, `NFR-SEO-002`, `NFR-PRIV-001` |
| Related BRD Reference | `FE-10`, `WEB-02`, `BO-01` |
| Related Open Question(s), if applicable | `OQ-21`, `OQ-25`, `OQ-35` |

## 11. Public Website Use Cases

### `UC-WEB-001` — Browse Public Website

| Field | Specification |
|---|---|
| Use Case ID | `UC-WEB-001` |
| Use Case Name | Browse Public Website |
| Goal | Navigate the firm's public information without an internal account. |
| Scope | Public Website |
| Primary Actor | Guest / Public Visitor |
| Secondary Actor(s) | None confirmed |
| Trigger | The Guest opens the website or selects public navigation. |
| Preconditions | The public website is available. |
| Postconditions | The Guest receives the selected publicly eligible page or a safe public result; no internal access is granted. |
| Main Success Flow | 1. The system presents Home, Lawyers, Personal Legal Services, Corporate Legal Services, Case Studies, Legal Insights / Blog, and Contact navigation. 2. The Guest selects a destination. 3. The system identifies publicly eligible content. 4. The system presents the requested page with applicable approved metadata and visible contact actions. |
| Alternative Flows | A1. If no approved content exists, the system does not expose non-public content. A2. The Guest selects another navigation or contact action. |
| Exception Flows | E1. An invalid/unavailable destination returns a safe public response without internal information. |
| Business Rules | Corporate Legal Services navigation supports future readiness only; advanced B2B workflows remain excluded. Public navigation grants no internal access. |
| Permissions | Public read of publicly eligible content only. |
| Related FR(s) | `FR-WEB-001`, `FR-WEB-002`, `FR-WEB-003` |
| Related NFR(s), if applicable | `NFR-PERF-001`, `NFR-SEC-001`, `NFR-USE-001`, `NFR-A11Y-002`, `NFR-RWD-001`, `NFR-BROWSER-001`, `NFR-PRIV-001` |
| Related BRD Reference | `FE-01`, `FE-09`, `WEB-01`–`WEB-05`, `BO-01`, `BO-02`, `BO-04`, `LI-06` |
| Related Open Question(s), if applicable | `OQ-21`, `OQ-25`, `OQ-27`, `OQ-28`, `OQ-34` |

### `UC-WEB-002` — View Legal Services

| Field | Specification |
|---|---|
| Use Case ID | `UC-WEB-002` |
| Use Case Name | View Legal Services |
| Goal | Understand approved Personal or Corporate Legal Service information and the firm's litigation process. |
| Scope | Public Website |
| Primary Actor | Guest / Public Visitor |
| Secondary Actor(s) | None confirmed |
| Trigger | The Guest selects a Service, Practice Area, or litigation-process section. |
| Preconditions | Relevant content is publicly eligible. |
| Postconditions | The Guest sees only approved Service/process information and may proceed to a contact action. |
| Main Success Flow | 1. The Guest selects Personal or Corporate Legal Services or a highlighted practice area. 2. The system presents eligible Service content. 3. Where applicable, it explains Case Assessment, Legal Strategy, Negotiation / Pre-litigation, and Court Litigation. 4. The system presents accessible contact actions and approved metadata. |
| Alternative Flows | A1. The Guest browses another Service or returns Home. A2. Missing approved content is not replaced with invented content. |
| Exception Flows | E1. Non-public/unavailable content is not disclosed and a safe public result is presented. |
| Business Rules | The final Service catalog is content-managed. Advanced corporate B2B legal management remains outside scope. |
| Permissions | Public read of eligible Service content. |
| Related FR(s) | `FR-WEB-001`, `FR-WEB-002`, `FR-WEB-004`, `FR-CMS-001` |
| Related NFR(s), if applicable | `NFR-PERF-001`, `NFR-A11Y-001`, `NFR-A11Y-002`, `NFR-RWD-001`, `NFR-SEO-001` |
| Related BRD Reference | `FE-01`, `FE-09`, `WEB-02`, `WEB-04`, `BO-01`, `BO-02`, `BO-04`, `LI-06` |
| Related Open Question(s), if applicable | `OQ-21`, `OQ-25` |

### `UC-WEB-003` — View Lawyers

| Field | Specification |
|---|---|
| Use Case ID | `UC-WEB-003` |
| Use Case Name | View Lawyers |
| Goal | Browse the firm's publicly approved lawyers and select a profile. |
| Scope | Public Website |
| Primary Actor | Guest / Public Visitor |
| Secondary Actor(s) | None confirmed |
| Trigger | The Guest opens Lawyers / Our Advocates or the published-lawyer homepage section. |
| Preconditions | The public website is available; zero or more eligible profiles may exist. |
| Postconditions | The Guest sees only publicly eligible lawyer summaries and may select `UC-LAW-002`. |
| Main Success Flow | 1. The Guest opens the public Lawyers or Our Advocates section. 2. The system identifies published profiles. 3. It presents approved portrait, title, experience, and specialization summaries. 4. The Guest selects a profile for details. |
| Alternative Flows | A1. No eligible profile exists; the system returns an empty public result without exposing internal profiles. |
| Exception Flows | E1. Non-public, incomplete, or unavailable lawyer data is excluded. |
| Business Rules | Only approved, publicly visible lawyer information is presented. |
| Permissions | Public read of publicly eligible lawyer information only. |
| Related FR(s) | `FR-WEB-002`, `FR-WEB-004`, `FR-LAW-002` |
| Related NFR(s), if applicable | `NFR-PERF-001`, `NFR-A11Y-002`, `NFR-RWD-001`, `NFR-SEO-001`, `NFR-PRIV-001` |
| Related BRD Reference | `FE-01`, `FE-04`, `WEB-03`, `BO-01` |
| Related Open Question(s), if applicable | `OQ-21`, `OQ-25` |

### `UC-WEB-004` — Submit Consultation Request / Use Contact Channels

| Field | Specification |
|---|---|
| Use Case ID | `UC-WEB-004` |
| Use Case Name | Submit Consultation Request / Use Contact Channels |
| Goal | Reach the firm through the website consultation path or a confirmed external contact channel. |
| Scope | Public Website and Lead Generation |
| Primary Actor | Guest / Public Visitor |
| Secondary Actor(s) | Zalo, Facebook Messenger, or telephone service; approved anti-abuse service for form submission |
| Trigger | The Guest selects the consultation CTA, Zalo, Facebook Messenger, or hotline / Click-to-Call. |
| Preconditions | The public website is available and the selected configured destination exists. |
| Postconditions | Consultation path: `UC-LEAD-001` determines Lead creation. External path: the Guest is handed off to the configured channel without representing synchronized Lead creation. |
| Main Success Flow | 1. The system presents visible and accessible contact actions. 2. The Guest selects a channel. 3. For consultation, the system starts `UC-LEAD-001`. 4. For an external channel, the system directs the Guest to its configured capability. 5. The system does not claim internal Lead creation for an external handoff. |
| Alternative Flows | A1. The Guest selects another confirmed channel if one is unavailable. A2. Exact urgent CTA wording remains unresolved under `OQ-18`. |
| Exception Flows | E1. Missing/invalid configuration or failed handoff returns a safe result without fabricating successful contact or Lead creation. |
| Business Rules | Contact actions must remain visible, operable, accessible on mobile, and not block important content. Integration/synchronization depth is unresolved. |
| Permissions | Public. External providers are outside internal RBAC. |
| Related FR(s) | `FR-WEB-003`, `FR-LEAD-001` |
| Related NFR(s), if applicable | `NFR-SEC-001`, `NFR-SEC-002`, `NFR-A11Y-001`, `NFR-RWD-001`, `NFR-ERR-001` |
| Related BRD Reference | `FE-01`, `FE-05`, `WEB-01`, `BO-02` |
| Related Open Question(s), if applicable | `OQ-13`, `OQ-18`, `OQ-20`, `OQ-24`, `OQ-25` |

## 12. Dashboard Use Case

### `UC-DASH-001` — View Dashboard Metrics

| Field | Specification |
|---|---|
| Use Case ID | `UC-DASH-001` |
| Use Case Name | View Dashboard Metrics |
| Goal | View approved role-appropriate operational summaries without advanced analytics or out-of-scope data. |
| Scope | Dashboard and Basic Reporting |
| Primary Actor | `SUPER_ADMIN`; another internal role only where the final matrix grants a relevant summary |
| Secondary Actor(s) | None confirmed |
| Trigger | The actor opens Dashboard or requests an approved basic report. |
| Preconditions | The actor is authenticated and authorized for the summary and underlying records. |
| Postconditions | The actor sees only approved indicators calculated from permitted information. |
| Main Success Flow | 1. The system identifies the actor and permitted record scope. 2. It identifies approved indicators and, once defined, approved filters/date range. 3. It calculates results only from permitted Leads, Appointments, Cases, or other approved information. 4. It presents the role-appropriate summary. |
| Alternative Flows | A1. If no permitted data exists, the system presents an empty summary without other-scope information. |
| Exception Flows | E1. An unapproved measure/filter/scope or insufficient permission prevents the requested result. |
| Business Rules | Measures, filters, date ranges, KPI definitions, and role visibility remain `OQ-22`. Advanced analytics remains excluded. |
| Permissions | `SUPER_ADMIN` dashboard access is confirmed; other role visibility and record scope depend on `OQ-04` / `OQ-22`. |
| Related FR(s) | `FR-DASH-001` |
| Related NFR(s), if applicable | `NFR-AUTH-002`, `NFR-PRIV-001`, `NFR-PERF-002`, `NFR-ERR-001` |
| Related BRD Reference | `FE-11`, `BO-01`–`BO-04`, `LI-08`, `SEC-03`, `SEC-04` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-22` |

## 13. Notification Use Case

### `UC-NOTI-001` — Receive New Lead Notification

| Field | Specification |
|---|---|
| Use Case ID | `UC-NOTI-001` |
| Use Case Name | Receive New Lead Notification |
| Goal | Alert eligible internal recipients in real time when a Lead is successfully created. |
| Scope | Notification |
| Primary Actor | Authorized internal recipient; exact roles remain `OQ-04` / `OQ-09` |
| Secondary Actor(s) | Lead-creation use case |
| Trigger | `UC-LEAD-001` or `UC-LEAD-005` successfully creates a Lead. |
| Preconditions | A Lead exists successfully and an authorized recipient has an eligible real-time connection. |
| Postconditions | Success: eligible connected recipients receive an authorized administrative notification. Notification failure does not falsely report delivery or imply Lead rollback. |
| Main Success Flow | 1. Successful Lead creation produces the confirmed new-Lead event. 2. The system determines recipients under approved rules. 3. The system sends the administrative notification through WebSocket. 4. Only eligible connected recipients see it. 5. The recipient becomes aware of the new Lead. |
| Alternative Flows | A1. Email or Zalo ZNS is used only if later approved for MVP. A2. Disconnected-client, retry, escalation, and read-state behavior remains unresolved. |
| Exception Flows | E1. Recipient determination or delivery failure must not fabricate delivery. E2. Notification content is withheld from unauthorized recipients. |
| Business Rules | WebSocket notification for a new Lead is confirmed. Recipients, content, delivery, retry, escalation, read state, and optional external channels remain unresolved. |
| Permissions | Recipient eligibility and visible content under `OQ-04` / `OQ-09`. |
| Related FR(s) | `FR-NOTI-001`, `FR-LEAD-001`, `FR-LEAD-002` |
| Related NFR(s), if applicable | `NFR-PERF-002`, `NFR-AUTH-002`, `NFR-PRIV-001`, `NFR-OBS-001` |
| Related BRD Reference | `FE-05`, `FE-12`, `SEC-03`, `SEC-04`, `BO-02`, `BO-03` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-09`, `OQ-13` |

## 14. Audit Use Cases

### `UC-AUDIT-001` — Record Auditable Activity

| Field | Specification |
|---|---|
| Use Case ID | `UC-AUDIT-001` |
| Use Case Name | Record Auditable Activity |
| Goal | Make covered sensitive administrative activity attributable and reviewable. |
| Scope | Audit; supporting use case invoked by covered protected actions |
| Primary Actor | Authenticated internal actor performing a covered action |
| Secondary Actor(s) | The protected business use case being performed |
| Trigger | A sensitive administrative action covered by the approved event policy is attempted or completed. |
| Preconditions | The actor is authenticated; the action is within approved audit-event coverage. |
| Postconditions | A protected Audit Event exists with all fields applicable under approved policy, or unresolved capture failure is not falsely represented as successful. |
| Main Success Flow | 1. A covered protected action identifies the actor and action. 2. The system identifies the affected entity. 3. It captures applicable previous/new values. 4. It captures IP address and timestamp. 5. It protects and records the Audit Event under approved policy. |
| Alternative Flows | A1. When previous/new values do not apply, the system captures only fields required by the final event policy and does not invent values. |
| Exception Flows | E1. Audit-capture failure handling and whether it blocks the business action remain unresolved; affected critical behavior must follow the eventual decision. |
| Business Rules | Confirmed attributes are actor, action, affected entity, previous value, new value, IP address, and timestamp. Event coverage, value capture, and retention remain unresolved. |
| Permissions | Capture accompanies a covered action; this use case grants no Audit Log read permission. |
| Related FR(s) | `FR-AUDIT-001` |
| Related NFR(s), if applicable | `NFR-AUD-001`, `NFR-AUD-002`, `NFR-DATA-002`, `NFR-ERR-001` |
| Related BRD Reference | `FE-13`, `SEC-05`, `BO-03` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-07`, `OQ-17` |

### `UC-AUDIT-002` — View Audit Log

| Field | Specification |
|---|---|
| Use Case ID | `UC-AUDIT-002` |
| Use Case Name | View Audit Log |
| Goal | Review protected records of sensitive administrative activity. |
| Scope | Audit |
| Primary Actor | `SUPER_ADMIN` |
| Secondary Actor(s) | None confirmed |
| Trigger | `SUPER_ADMIN` opens Audit Log or requests an Audit Event. |
| Preconditions | `SUPER_ADMIN` is authenticated and authorized for Audit Log access. |
| Postconditions | Only retained, permitted Audit Events and applicable confirmed attributes are presented. |
| Main Success Flow | 1. The system verifies `SUPER_ADMIN` authorization. 2. It retrieves Audit Events within approved retention/access rules. 3. It presents applicable actor, action, affected entity, previous value, new value, IP address, and timestamp information. 4. `SUPER_ADMIN` reviews a permitted event. |
| Alternative Flows | A1. No retained records match; the system returns an empty result. Filtering/search is not assumed. |
| Exception Flows | E1. Unauthorized access is denied. E2. Records outside retention or unavailable under policy are not returned. |
| Business Rules | `SUPER_ADMIN` access is confirmed. Filtering, export, sensitive-value masking, retention, and detailed event coverage remain unresolved. |
| Permissions | `SUPER_ADMIN`, subject to sensitive-operation restrictions in `OQ-04`. |
| Related FR(s) | `FR-AUDIT-002` |
| Related NFR(s), if applicable | `NFR-AUTH-002`, `NFR-AUD-001`, `NFR-AUD-002`, `NFR-PRIV-001` |
| Related BRD Reference | `FE-13`, `SEC-03`, `SEC-05`, `BO-03` |
| Related Open Question(s), if applicable | `OQ-04`, `OQ-07`, `OQ-17` |

## 15. Functional Requirement Coverage

| FR ID | Covering Use Case(s) | Standalone modeling note |
|---|---|---|
| `FR-AUTH-001` | `UC-AUTH-001`, `UC-USER-003` | Login is standalone; account state also affects activation/deactivation. |
| `FR-AUTH-002` | `UC-AUTH-003` | Standalone actor goal. |
| `FR-AUTH-003` | `UC-AUTH-002`, `UC-USER-003` | Refresh is standalone; account state also constrains it. |
| `FR-AUTH-004` | `UC-AUTH-002`, `UC-AUTH-004` | Protected access is standalone and cross-cutting. |
| `FR-USER-001` | `UC-USER-001`, `UC-USER-002` | Create and update are separate actor goals. |
| `FR-USER-002` | `UC-USER-003` | Standalone actor goal. |
| `FR-USER-003` | `UC-USER-001`, `UC-USER-002` | Not standalone; access assignments/settings are part of creating or updating a user. |
| `FR-LAW-001` | `UC-LAW-001` | Consolidated profile maintenance goal. |
| `FR-LAW-002` | `UC-LAW-001`, `UC-LAW-002`, `UC-WEB-003` | Not standalone; visibility is part of profile management and public viewing eligibility. |
| `FR-LEAD-001` | `UC-LEAD-001`, `UC-WEB-004`, `UC-NOTI-001` | Public intake is standalone and triggers notification. |
| `FR-LEAD-002` | `UC-LEAD-005`, `UC-NOTI-001` | Staff-driven intake is separate from the Guest form. |
| `FR-LEAD-003` | `UC-LEAD-002`, `UC-LEAD-003` | Viewing/follow-up and assignment are distinct actor goals. |
| `FR-LEAD-004` | `UC-LEAD-004`, `UC-CASE-001` | Status management and successful conversion are coupled. |
| `FR-APP-001` | `UC-APP-001`, `UC-APP-002` | Creation and status maintenance are distinct goals. |
| `FR-APP-002` | `UC-APP-001`, `UC-APP-002` | Not standalone; permitted retrieval supports creation confirmation/status work. |
| `FR-CASE-001` | `UC-LEAD-004`, `UC-CASE-001` | Conversion is standalone and determines `CONVERTED`. |
| `FR-CASE-002` | `UC-CASE-002`, `UC-CASE-003` | Case viewing and assignment support two goals. |
| `FR-CASE-003` | `UC-CASE-002` | Consolidated Case work goal. |
| `FR-DOC-001` | `UC-DOC-001`, `UC-DOC-003` | Upload is standalone; approved association information supports lifecycle management. |
| `FR-DOC-002` | `UC-DOC-002` | Standalone actor goal. |
| `FR-DOC-003` | `UC-DOC-003` | Lifecycle behavior remains policy-gated. |
| `FR-CMS-001` | `UC-CMS-003`, `UC-WEB-002` | Management and public consumption are separate goals. |
| `FR-CMS-002` | `UC-CMS-001` | Standalone content-management goal. |
| `FR-CMS-003` | `UC-CMS-002` | Standalone confidentiality-sensitive publication goal. |
| `FR-SEO-001` | `UC-CMS-001`, `UC-CMS-003`, `UC-SEO-001`, `UC-SEO-002` | Metadata is managed directly and may accompany content editing/exposure. |
| `FR-SEO-002` | `UC-SEO-002` | Standalone public-consumption goal. |
| `FR-WEB-001` | `UC-WEB-001`, `UC-WEB-002` | Navigation supports browsing and Service discovery. |
| `FR-WEB-002` | `UC-LAW-002`, `UC-SEO-002`, `UC-WEB-001`, `UC-WEB-002`, `UC-WEB-003` | Public content supports several discovery goals. |
| `FR-WEB-003` | `UC-WEB-001`, `UC-WEB-004` | Contact actions are visible across browsing and direct contact. |
| `FR-WEB-004` | `UC-WEB-002`, `UC-WEB-003` | Not standalone; homepage content supports Service and Lawyer discovery. |
| `FR-DASH-001` | `UC-DASH-001` | Standalone actor goal. |
| `FR-NOTI-001` | `UC-LEAD-001`, `UC-LEAD-005`, `UC-NOTI-001` | Lead creation triggers the recipient goal. |
| `FR-AUDIT-001` | `UC-DOC-003`, `UC-CMS-002`, `UC-AUDIT-001` | Supporting behavior is explicit because auditability is a confirmed business capability. |
| `FR-AUDIT-002` | `UC-AUDIT-002` | Standalone oversight goal. |

All 34 valid FRS IDs are covered. `FR-USER-003`, `FR-LAW-002`, `FR-APP-002`, and `FR-WEB-004` are intentionally not represented by one-to-one standalone use cases because their behavior supports broader actor goals. `FR-AUDIT-001` is retained as a supporting use case despite being system-assisted because the BRD explicitly makes sensitive-activity traceability a business capability and it directly enables `SUPER_ADMIN` oversight.

## 16. Open Questions Affecting Use Cases

| Open Question | Affected Use Case Area |
|---|---|
| `OQ-03` | Case lifecycle, ownership, assignment, closure, and reopening in `UC-CASE-001`–`UC-CASE-003`. |
| `OQ-04` | Role/capability/record permissions across all protected use cases. |
| `OQ-05` | Lead qualification-to-Case validation, approval, mapping, and consistent outcome in `UC-LEAD-004` / `UC-CASE-001`. |
| `OQ-06` | Duplicate Lead handling in `UC-LEAD-001`, `UC-LEAD-002`, `UC-LEAD-005`, and conversion conflict handling. |
| `OQ-07`, `OQ-08` | Document and Audit retention plus document deletion, recovery, legal hold, and disposal. |
| `OQ-09` | New-Lead notification recipients, content, delivery, retry, escalation, read state, and optional channels. |
| `OQ-12` | Intake privacy/consent and protection/lifecycle of client, Case, Document, and Case Study information. |
| `OQ-13` | External contact/channel integration and synchronization depth. |
| `OQ-14` | Case Study approval owner and anonymization/confidentiality checklist. |
| `OQ-15` | Lead qualification, `LOST` transitions, and reason rules. |
| `OQ-16` | Appointment availability, time zone, rescheduling, reminder, completion, and cancellation rules. |
| `OQ-17` | Audit-event coverage, old/new-value capture, and retention. |
| `OQ-18` | Exact Vietnamese urgent-assessment CTA wording. |
| `OQ-20` | Consultation/intake fields, validation, privacy notice, consent, and evidence. |
| `OQ-21` | Lawyer and public-content lifecycle, workflow states, approvals, and role ownership. |
| `OQ-22` | Dashboard measures, filters, date ranges, KPIs, and role visibility. |
| `OQ-23` | Account lifecycle, credential, recovery, token/session, lockout, and existing-session behavior. |
| `OQ-24` | Boundary between Guest consultation intake and staff-created Appointment. |
| `OQ-25` | Public/internal language and localization rules. |
| `OQ-27`, `OQ-28`, `OQ-34` | Measurable accessibility, supported-client, and usability targets for public interactions. |
| `OQ-29` | Document security controls and temporary-access lifetime. |
| `OQ-35` | Technical SEO coverage and success targets. |

`OQ-01`, `OQ-02`, `OQ-10`, `OQ-11`, `OQ-19`, `OQ-26`, and `OQ-30`–`OQ-33` remain active in their governing documents but do not select an additional actor-flow decision in this specification. Any future approved answer that changes business scope or functional behavior must update the BRD/FRS before this use-case baseline.

## 17. Validation Record

**Validation status:** Passed on 2026-08-12.

Validation confirmed:

- 35 unique `UC-*` identifiers across all 13 FRS modules;
- all mandatory fields are present for every use case;
- every use case references one or more valid `FR-*` identifiers;
- all 34 FRS requirements are covered, with no orphan FR;
- actors, role boundaries, Lead sources/statuses, Appointment types/statuses, and Document constraints match the BRD/FRS;
- unresolved functional or quality-dependent decisions cite valid `OQ-*` identifiers and no answer is invented;
- all `FR-*`, `NFR-*`, BRD, and OQ references used by this document exist in the upstream baselines/register;
- one-to-many and many-to-one mappings are used where they reflect meaningful actor goals instead of forcing one use case per FR;
- sensitive system-assisted audit behavior is modeled only as a justified supporting use case;
- exclusions remain excluded, including Client Portal, payments, advanced workflow, advanced B2B legal management, AI legal assistant, and advanced analytics; and
- no endpoint, payload, database, SQL, Java, Next.js, storage-schema, UML, ERD, OpenAPI, SDD, User Story, or Acceptance Criteria design is introduced.

