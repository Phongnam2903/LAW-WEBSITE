# Non-Functional Requirements Specification

## Document Control

| Field | Value |
|---|---|
| Project | Law Firm Website & Management System |
| Document | Non-Functional Requirements Specification (NFR) |
| Document ID | `NFR-03` |
| Version | 1.0 |
| Status | Complete and validated baseline |
| Effective date | 2026-08-12 |
| Business authority | [01-brd.md](01-brd.md) |
| Functional authority | [02-frs.md](02-frs.md) |
| Decision register | [assumptions-open-questions.md](assumptions-open-questions.md) |

## Record of Changes

| Date | Change type | In charge | Description |
|---|---|---|---|
| 2026-08-12 | Added | Project Team | Created measurable non-functional requirements from the BRD and FRS; confirmed mandated targets and linked unapproved thresholds to controlled Open Questions. |

## 1. Purpose and Scope

This document defines measurable quality constraints for the functional scope in the BRD and FRS. It does not add business functions, database schemas, final API endpoints, implementation classes, or unapproved infrastructure.

Each requirement distinguishes one of these constraint types:

- **Business-mandated constraint** — directly required by the BRD, FRS, or Phase 1 documentation rules. Its confirmed numeric or binary target is enforceable.
- **Business quality target — threshold TBD** — the quality characteristic is required, but the stakeholder threshold has not been approved. The metric, unit, workload, and verification approach are defined; acceptance remains blocked by the cited OQ.
- **Proposed technical quality gate — pending approval** — a technical control or gate is a candidate, not an approved stakeholder commitment. It must not become an implementation constraint until the cited OQ is resolved.

`TBD` is not a test waiver. A TBD NFR defines what must be measured, but it cannot pass acceptance until its threshold and test conditions are approved and recorded.

### 1.1 Priority Convention

- `Must` — required by confirmed business scope or a confirmed security/privacy constraint.
- `Must — target TBD` — the quality area is mandatory, but acceptance thresholds require an open decision.
- `Proposed` — a technical quality gate awaiting approval; it is not yet a production commitment.

## 2. Non-Functional Requirements

### 2.1 Performance

#### NFR-PERF-001 — Public Experience Response Performance

| Field | Specification |
|---|---|
| NFR ID | `NFR-PERF-001` |
| Category | Performance |
| Constraint Type | Business quality target — threshold TBD |
| Requirement | Public Home, Lawyers, Services, Case Studies, Legal Insights / Blog, Contact, and consultation experiences shall meet an approved page-response and user-perceived loading target under an approved production workload. |
| Rationale / Business Value | A timely public experience supports trust, urgent contact, lead generation, and mobile-first use (`BO-01`, `BO-02`). |
| Measurement / Target | **TBD (`OQ-26`, `OQ-35`):** approved page metric(s), percentile(s), threshold(s) in milliseconds, network/device profile, cache state, content set, and concurrent workload. No pass result may be declared until all are approved. |
| Priority | Must — target TBD |
| Verification Method | Repeatable browser performance test against each named public journey under the approved network, device, cache, data, and concurrency profile; report every approved percentile and threshold. |
| Related BRD Reference | `BO-01`, `BO-02`, `FE-01`, `FE-10`, `WEB-01`–`WEB-05` |
| Related FR(s) | `FR-WEB-001`–`FR-WEB-004`, `FR-LEAD-001`, `FR-SEO-001`, `FR-SEO-002` |
| Related Open Question(s) | `OQ-26`, `OQ-35` |

#### NFR-PERF-002 — Internal API and Real-time Performance

| Field | Specification |
|---|---|
| NFR ID | `NFR-PERF-002` |
| Category | Performance |
| Constraint Type | Business quality target — threshold TBD |
| Requirement | Authenticated REST-backed operations and the new-Lead WebSocket notification shall meet approved latency and throughput targets under an approved workload, including representative record scopes and document operations. |
| Rationale / Business Value | Authorized personnel need timely access to centralized work, and new inquiries require timely awareness (`BO-02`, `BO-03`). |
| Measurement / Target | **TBD (`OQ-26`):** latency percentile(s) and milliseconds by operation class, requests/transactions per second, concurrent authenticated users/connections, upload timing for files up to 20 MB, WebSocket delivery latency, dataset size, and test duration. |
| Priority | Must — target TBD |
| Verification Method | Controlled API, upload, and WebSocket load tests using the approved workload model; measure server and end-to-end latency, throughput, error rate, and resource saturation without fixing endpoint design. |
| Related BRD Reference | `BO-02`, `BO-03`, `FE-02`–`FE-08`, `FE-11`–`FE-13` |
| Related FR(s) | `FR-AUTH-001`–`FR-AUTH-004`, `FR-USER-001`–`FR-USER-003`, `FR-LAW-001`, `FR-LEAD-001`–`FR-LEAD-004`, `FR-APP-001`, `FR-CASE-001`–`FR-CASE-003`, `FR-DOC-001`, `FR-DASH-001`, `FR-NOTI-001`, `FR-AUDIT-001` |
| Related Open Question(s) | `OQ-10`, `OQ-26` |

### 2.2 Availability

#### NFR-AVAIL-001 — Service Availability

| Field | Specification |
|---|---|
| NFR ID | `NFR-AVAIL-001` |
| Category | Availability |
| Constraint Type | Business quality target — threshold TBD |
| Requirement | Public access and internal operations shall meet separately approved availability targets, with approved treatment of planned maintenance and degraded external integrations. |
| Rationale / Business Value | Potential clients need reliable contact access, while staff need dependable operational records (`BO-02`, `BO-03`). |
| Measurement / Target | **TBD (`OQ-10`):** availability percentage for public and internal services, reporting window, service hours, excluded maintenance, measurement point, and maximum planned/unplanned outage. |
| Priority | Must — target TBD |
| Verification Method | Availability monitoring and monthly or otherwise approved-window calculation from the approved measurement point; classify each outage using the approved inclusion rules. |
| Related BRD Reference | `BO-02`, `BO-03`, `FE-01`–`FE-13` |
| Related FR(s) | All requirements `FR-AUTH-001` through `FR-AUDIT-002` within their applicable public or internal service boundary |
| Related Open Question(s) | `OQ-10`, `OQ-13` |

### 2.3 Reliability

#### NFR-REL-001 — Consistent Business-operation Outcomes

| Field | Specification |
|---|---|
| NFR ID | `NFR-REL-001` |
| Category | Reliability |
| Constraint Type | Business-mandated constraint |
| Requirement | A business operation shall not report success when its required persistent outcome failed; Lead-to-Case conversion shall not leave the Lead `CONVERTED` without the corresponding successfully created Case. |
| Rationale / Business Value | Centralized legal records must not present contradictory or falsely successful outcomes (`BO-03`). |
| Measurement / Target | **Confirmed:** zero observed false-success responses or prohibited partial Lead-to-Case outcomes across the approved failure-injection and transactional test suite. The exact conversion mappings remain governed by `OQ-05`. |
| Priority | Must |
| Verification Method | Integration and failure-injection tests that interrupt each approved persistence step and verify returned outcome plus resulting business state; include Lead-to-Case conversion after `OQ-05` is resolved. |
| Related BRD Reference | `BO-03`, `FE-05`, `FE-07`, `FE-08`, `SEC-04` |
| Related FR(s) | `FR-LEAD-001`, `FR-LEAD-004`, `FR-CASE-001`, `FR-CASE-003`, `FR-DOC-001`, `FR-AUDIT-001` |
| Related Open Question(s) | `OQ-05`, `OQ-06`, `OQ-10` |

### 2.4 Scalability

#### NFR-SCALE-001 — Approved Workload Capacity

| Field | Specification |
|---|---|
| NFR ID | `NFR-SCALE-001` |
| Category | Scalability |
| Constraint Type | Business quality target — threshold TBD |
| Requirement | The system shall meet approved performance and error-rate targets at the approved initial and growth workload levels without changing defined business behavior, permissions, or controlled values. |
| Rationale / Business Value | The platform must support B2C operations and future content/data growth without silently changing scope (`BO-03`, `BO-04`). |
| Measurement / Target | **TBD (`OQ-26`):** concurrent users, WebSocket connections, requests per second, Leads/Appointments/Cases/Documents/content volume, object-storage volume, growth horizon, and acceptable degradation/error thresholds. |
| Priority | Must — target TBD |
| Verification Method | Capacity and endurance tests at approved initial, peak, and growth profiles; compare latency/error results to approved performance thresholds and verify unchanged authorization behavior. |
| Related BRD Reference | `BO-03`, `BO-04`, `FE-01`–`FE-13`, `LI-08` |
| Related FR(s) | All requirements `FR-AUTH-001` through `FR-AUDIT-002` |
| Related Open Question(s) | `OQ-10`, `OQ-26` |

### 2.5 Security

#### NFR-SEC-001 — HTTPS-only Production Access

| Field | Specification |
|---|---|
| NFR ID | `NFR-SEC-001` |
| Category | Security |
| Constraint Type | Business-mandated constraint |
| Requirement | All production public, internal, REST, WebSocket, and temporary document-access traffic shall use HTTPS/TLS-protected transport; plaintext application access shall not expose content or protected operations. |
| Rationale / Business Value | The BRD explicitly requires HTTPS and protection against unauthorized disclosure (`SEC-01`, `SEC-04`). |
| Measurement / Target | **Confirmed:** 100% of sampled production application entry points and generated temporary access URLs use TLS-protected schemes; zero plaintext entry points return application content or accept protected operations. Exact protocol/cipher baseline is TBD under `OQ-29`. |
| Priority | Must |
| Verification Method | Automated external transport scan plus tests of public pages, protected operations, WebSocket connection, and temporary document access; verify plaintext denial or secure redirection without sensitive content. |
| Related BRD Reference | `SEC-01`, `SEC-04`, `FE-01`, `FE-02`, `FE-08`, `FE-12` |
| Related FR(s) | `FR-WEB-001`–`FR-WEB-004`, `FR-AUTH-001`–`FR-AUTH-004`, `FR-DOC-002`, `FR-NOTI-001` |
| Related Open Question(s) | `OQ-29` |

#### NFR-SEC-002 — Consultation Anti-abuse Coverage

| Field | Specification |
|---|---|
| NFR ID | `NFR-SEC-002` |
| Category | Security |
| Constraint Type | Business-mandated constraint |
| Requirement | Every production website consultation accepted as a new Lead shall have passed reCAPTCHA v3 or an approved equivalent anti-automation decision. |
| Rationale / Business Value | Protect public intake and staff workload from automated abuse while preserving lead generation (`BO-02`, `SEC-02`). |
| Measurement / Target | **Confirmed:** 100% of accepted production website consultation submissions have a successful, verifiable anti-abuse decision; zero submissions with a failed/missing decision create a `WEBSITE` Lead. Decision thresholds and exception handling are **TBD (`OQ-20`, `OQ-29`)**. |
| Priority | Must |
| Verification Method | Security integration tests for valid, missing, invalid, expired, provider-error, and rejected anti-abuse evidence; reconcile accepted submissions against created `WEBSITE` Leads. |
| Related BRD Reference | `BO-02`, `FE-01`, `FE-05`, `SEC-02` |
| Related FR(s) | `FR-LEAD-001`, `FR-WEB-003` |
| Related Open Question(s) | `OQ-20`, `OQ-29` |

#### NFR-SEC-003 — Security Assurance and Remediation Baseline

| Field | Specification |
|---|---|
| NFR ID | `NFR-SEC-003` |
| Category | Security |
| Constraint Type | Proposed technical quality gate — pending approval |
| Requirement | Releases shall be assessed against an approved security baseline, and findings shall meet approved severity, remediation-time, exception, and release-blocking rules before production approval. |
| Rationale / Business Value | Sensitive legal and client information requires demonstrable control effectiveness, not a vague assertion of security (`SEC-03`–`SEC-06`). |
| Measurement / Target | **TBD (`OQ-29`):** assessment types/cadence, baseline, severity scheme, maximum open findings by severity, remediation windows, exception approver, and release gate. |
| Priority | Proposed |
| Verification Method | Review security-test reports and issue register for the release; calculate open findings and remediation age against the approved thresholds and exceptions. |
| Related BRD Reference | `SEC-03`, `SEC-04`, `SEC-05`, `SEC-06`, `BO-03` |
| Related FR(s) | All protected requirements, specifically `FR-AUTH-001`–`FR-AUTH-004`, `FR-LEAD-001`, `FR-CASE-001`–`FR-CASE-003`, `FR-DOC-001`–`FR-DOC-003`, `FR-AUDIT-001`, `FR-AUDIT-002` |
| Related Open Question(s) | `OQ-12`, `OQ-29`, `OQ-31` |

### 2.6 Authentication & Authorization

#### NFR-AUTH-001 — Authentication Enforcement Coverage

| Field | Specification |
|---|---|
| NFR ID | `NFR-AUTH-001` |
| Category | Authentication & Authorization |
| Constraint Type | Business-mandated constraint |
| Requirement | Every protected internal UI capability, REST operation, and WebSocket subscription shall reject access without a valid JWT-based authenticated context; public browsing remains unauthenticated. |
| Rationale / Business Value | Internal legal and operational information must be protected while the public website remains accessible (`SEC-03`, `SEC-04`). |
| Measurement / Target | **Confirmed:** 100% of protected-capability negative tests reject missing, malformed, invalid, expired, or ineligible authentication context; zero protected records are returned. Token lifetimes and refresh/revocation rules are **TBD (`OQ-23`, `OQ-29`)**. |
| Priority | Must |
| Verification Method | Automated authentication matrix across every protected capability and WebSocket subscription, covering each invalid-context class and an allowed public-navigation control case. |
| Related BRD Reference | `FE-02`, `SEC-03`, `SEC-04` |
| Related FR(s) | `FR-AUTH-001`–`FR-AUTH-003`, all protected requirements from `FR-USER-001` through `FR-AUDIT-002` |
| Related Open Question(s) | `OQ-23`, `OQ-29` |

#### NFR-AUTH-002 — Authorization Denial Coverage

| Field | Specification |
|---|---|
| NFR ID | `NFR-AUTH-002` |
| Category | Authentication & Authorization |
| Constraint Type | Business-mandated constraint |
| Requirement | For every approved role/capability/record-scope rule, attempts outside the actor's permission shall be denied without disclosing the protected record. |
| Rationale / Business Value | Least privilege and assignment-based access are required for confidential legal information (`SEC-03`, `SEC-04`). |
| Measurement / Target | **Confirmed:** zero successful unauthorized actions or protected-record disclosures across 100% of cases in the approved RBAC and record-scope negative-test matrix. The matrix itself is TBD under `OQ-04`. |
| Priority | Must |
| Verification Method | Data-driven authorization tests generated from the approved RBAC matrix, including cross-record, cross-assignment, inactive-user, and Guest attempts. |
| Related BRD Reference | `FE-02`, `FE-03`, `SEC-03`, `SEC-04` |
| Related FR(s) | `FR-AUTH-004`, `FR-USER-001`–`FR-USER-003`, `FR-LEAD-003`, `FR-LEAD-004`, `FR-APP-001`, `FR-APP-002`, `FR-CASE-001`–`FR-CASE-003`, `FR-DOC-001`–`FR-DOC-003`, `FR-DASH-001`, `FR-NOTI-001`, `FR-AUDIT-002` |
| Related Open Question(s) | `OQ-04`, `OQ-23` |

### 2.7 Data Protection

#### NFR-DATA-001 — Encryption at Rest Coverage

| Field | Specification |
|---|---|
| NFR ID | `NFR-DATA-001` |
| Category | Data Protection |
| Constraint Type | Business-mandated constraint |
| Requirement | Stored client, Lead, Appointment, Case, Document, internal-user, notification, and Audit information shall use encryption-at-rest capabilities supported by the selected database, hosting, and object-storage platforms. |
| Rationale / Business Value | The BRD explicitly requires platform-supported encryption for sensitive stored information (`SEC-06`). |
| Measurement / Target | **Confirmed:** 100% of production storage locations containing the named information classes have platform-supported encryption at rest enabled; exact cryptographic baseline, key ownership, and rotation are TBD under `OQ-29`. |
| Priority | Must |
| Verification Method | Configuration and provider-control inspection for the active MySQL environment and active AWS S3 or MinIO environment, plus evidence that all named information classes map only to encrypted storage locations. |
| Related BRD Reference | `SEC-04`, `SEC-06`, `FE-03`, `FE-04`, `FE-05`, `FE-06`, `FE-07`, `FE-08`, `FE-09`, `FE-12`, `FE-13`, `AS-03` |
| Related FR(s) | `FR-USER-001`–`FR-USER-003`, `FR-LAW-001`, `FR-LEAD-001`–`FR-LEAD-004`, `FR-APP-001`, `FR-CASE-001`–`FR-CASE-003`, `FR-DOC-001`–`FR-DOC-003`, `FR-CMS-003`, `FR-NOTI-001`, `FR-AUDIT-001` |
| Related Open Question(s) | `OQ-12`, `OQ-29` |

#### NFR-DATA-002 — Data Retention and Disposal Targets

| Field | Specification |
|---|---|
| NFR ID | `NFR-DATA-002` |
| Category | Data Protection |
| Constraint Type | Business quality target — threshold TBD |
| Requirement | Each approved business-record and document category shall have a measurable retention period and disposal or preservation rule consistent with applicable legal, privacy, recovery, legal-hold, and audit obligations. |
| Rationale / Business Value | The system must avoid both premature loss and unjustified retention of sensitive legal information (`SEC-04`). |
| Measurement / Target | **TBD (`OQ-07`, `OQ-08`, `OQ-12`, `OQ-17`):** retention duration and start event by category, archive/deletion deadline, recovery window, legal-hold precedence, and permitted disposal evidence. |
| Priority | Must — target TBD |
| Verification Method | Policy-to-record sampling and lifecycle simulation across each approved category; calculate record age and action timing against the approved retention/disposal rule. |
| Related BRD Reference | `FE-08`, `FE-13`, `SEC-04`, `SEC-05` |
| Related FR(s) | `FR-DOC-003`, `FR-AUDIT-001`, `FR-AUDIT-002` |
| Related Open Question(s) | `OQ-07`, `OQ-08`, `OQ-12`, `OQ-17` |

### 2.8 Document/File Security

#### NFR-FILE-001 — Private Object Access

| Field | Specification |
|---|---|
| NFR ID | `NFR-FILE-001` |
| Category | Document/File Security |
| Constraint Type | Business-mandated constraint |
| Requirement | Every stored PDF, DOCX, JPG, and PNG document shall remain non-public and shall require a successful authorization decision before content access. |
| Rationale / Business Value | Legal and client documents must not be publicly disclosed (`FE-08`, `SEC-04`). |
| Measurement / Target | **Confirmed:** zero successful anonymous/public object retrievals and zero unauthorized cross-record retrievals across 100% of sampled objects and authorization-negative cases. |
| Priority | Must |
| Verification Method | Object-storage exposure scan plus anonymous, expired-context, wrong-role, wrong-assignment, and direct-object-reference access tests for both supported storage alternatives where used. |
| Related BRD Reference | `FE-08`, `SEC-03`, `SEC-04`, `AS-03` |
| Related FR(s) | `FR-DOC-001`, `FR-DOC-002`, `FR-AUTH-004` |
| Related Open Question(s) | `OQ-04`, `OQ-12`, `OQ-29` |

#### NFR-FILE-002 — Temporary Document-access Lifetime

| Field | Specification |
|---|---|
| NFR ID | `NFR-FILE-002` |
| Category | Document/File Security |
| Constraint Type | Business quality target — threshold TBD |
| Requirement | When presigned URLs are used, their lifetime shall not exceed the approved maximum and access shall fail after expiry without making the object public. |
| Rationale / Business Value | Temporary access must remain time-bound to limit unintended disclosure (`SEC-04`). |
| Measurement / Target | **TBD (`OQ-29`):** maximum lifetime in seconds/minutes by document context. **Confirmed acceptance behavior:** 100% of test URLs deny access after their configured expiry. |
| Priority | Must — target TBD |
| Verification Method | Generate temporary access for each approved context; verify access immediately before and after configured expiry and confirm direct public access remains denied. |
| Related BRD Reference | `FE-08`, `SEC-04` |
| Related FR(s) | `FR-DOC-002` |
| Related Open Question(s) | `OQ-04`, `OQ-12`, `OQ-29` |

### 2.9 Auditability

#### NFR-AUD-001 — Audit-field Completeness

| Field | Specification |
|---|---|
| NFR ID | `NFR-AUD-001` |
| Category | Auditability |
| Constraint Type | Business-mandated constraint |
| Requirement | Every activity in the approved sensitive-event catalog shall create an Audit Event containing actor, action, affected entity, previous value, new value, IP address, and timestamp wherever the approved catalog marks each field applicable. |
| Rationale / Business Value | Sensitive administration must be attributable and reviewable (`SEC-05`, `BO-03`). |
| Measurement / Target | **Confirmed:** 100% of executed cases in the approved sensitive-event test catalog create one or more expected Audit Events with 100% of applicable mandatory fields populated. Event coverage and field applicability remain TBD under `OQ-17`. |
| Priority | Must |
| Verification Method | Execute every approved audited-event case and reconcile business actions against Audit Events, field presence, actor identity, affected entity, values, IP address, and timestamp. |
| Related BRD Reference | `FE-13`, `SEC-05`, `BO-03` |
| Related FR(s) | `FR-AUDIT-001`, plus sensitive actions in `FR-USER-001`–`FR-USER-003`, `FR-CASE-003`, `FR-DOC-003` |
| Related Open Question(s) | `OQ-04`, `OQ-17` |

#### NFR-AUD-002 — Audit Protection and Retention

| Field | Specification |
|---|---|
| NFR ID | `NFR-AUD-002` |
| Category | Auditability |
| Constraint Type | Business quality target — threshold TBD |
| Requirement | Audit records shall remain available to authorized `SUPER_ADMIN` users for the approved retention period and shall be protected against unapproved alteration or deletion under an approved integrity policy. |
| Rationale / Business Value | An audit trail has value only if it remains trustworthy, protected, and available for the required period (`SEC-05`). |
| Measurement / Target | **TBD (`OQ-17`, `OQ-29`):** retention duration, integrity/tamper-evidence control, permitted administrative actions, review frequency, and detection threshold. Unauthorized alteration/deletion acceptance target is zero successful attempts. |
| Priority | Must — target TBD |
| Verification Method | Retention-boundary tests, authorization-negative tests, integrity-control inspection, and approved tamper/detection exercises across representative Audit Events. |
| Related BRD Reference | `FE-13`, `SEC-03`, `SEC-05` |
| Related FR(s) | `FR-AUDIT-001`, `FR-AUDIT-002` |
| Related Open Question(s) | `OQ-04`, `OQ-07`, `OQ-17`, `OQ-29` |

### 2.10 Privacy

#### NFR-PRIV-001 — No Confidential Information in Public Responses

| Field | Specification |
|---|---|
| NFR ID | `NFR-PRIV-001` |
| Category | Privacy |
| Constraint Type | Business-mandated constraint |
| Requirement | Public pages, public content, consultation acknowledgements, errors, SEO metadata, and structured data shall not expose internal Case/Document information, client identity, confidential details, credentials, tokens, or non-public content. |
| Rationale / Business Value | Public presentation must build trust without disclosing protected legal or client information (`SEC-04`, `WEB-05`). |
| Measurement / Target | **Confirmed:** zero occurrences of approved confidential/prohibited data classes across the complete public-response, metadata, structured-data, and error test corpus. The governing legal/data classification remains `OQ-12`. |
| Priority | Must |
| Verification Method | Automated content scanning plus manual privacy review of public pages, public API responses when defined, consultation outcomes, error cases, metadata, JSON-LD, and unpublished-content access attempts. |
| Related BRD Reference | `SEC-04`, `FE-01`, `FE-09`, `FE-10`, `WEB-01`–`WEB-05`, `AS-02` |
| Related FR(s) | `FR-LEAD-001`, `FR-LAW-002`, `FR-CMS-001`–`FR-CMS-003`, `FR-SEO-001`, `FR-SEO-002`, `FR-WEB-001`–`FR-WEB-004` |
| Related Open Question(s) | `OQ-12`, `OQ-14`, `OQ-20`, `OQ-21`, `OQ-25` |

#### NFR-PRIV-002 — Consultation Consent and Data Minimization

| Field | Specification |
|---|---|
| NFR ID | `NFR-PRIV-002` |
| Category | Privacy |
| Constraint Type | Business quality target — threshold TBD |
| Requirement | Public consultation intake shall collect only approved information and shall present, record, and retain the approved privacy notice, consent acknowledgements, and evidence required by applicable obligations. |
| Rationale / Business Value | Lead generation must respect privacy and consent requirements without inventing legal obligations (`BO-02`, `SEC-04`). |
| Measurement / Target | **TBD (`OQ-12`, `OQ-20`):** permitted/required fields, notice version, consent type, evidence fields, retention duration, withdrawal behavior, and jurisdiction/language rules. Once approved, 100% of accepted submissions shall satisfy the rule set. |
| Priority | Must — target TBD |
| Verification Method | Field-inventory review and positive/negative consultation tests for every approved consent and notice variant; reconcile accepted Leads to required consent evidence and retention rules. |
| Related BRD Reference | `BO-02`, `FE-01`, `FE-05`, `SEC-02`, `SEC-04` |
| Related FR(s) | `FR-LEAD-001`, `FR-LEAD-002`, `FR-WEB-003` |
| Related Open Question(s) | `OQ-12`, `OQ-20`, `OQ-25` |

### 2.11 Backup & Recovery

#### NFR-BACK-001 — Recovery Point Objective

| Field | Specification |
|---|---|
| NFR ID | `NFR-BACK-001` |
| Category | Backup & Recovery |
| Constraint Type | Business quality target — threshold TBD |
| Requirement | Recoverable copies of in-scope business records, configuration required for service recovery, and private document objects shall support an approved Recovery Point Objective by information class and environment. |
| Rationale / Business Value | Loss of centralized legal and operational information must be limited to an explicitly approved business tolerance (`BO-03`). |
| Measurement / Target | **TBD (`OQ-11`):** RPO in time units for MySQL information, private objects, and required configuration; backup frequency, consistency boundary, and environment applicability. |
| Priority | Must — target TBD |
| Verification Method | Inspect backup timestamps and run controlled recovery exercises; measure the gap between the recovery point and simulated failure for each information class against the approved RPO. |
| Related BRD Reference | `BO-03`, `FE-03`–`FE-13`, `SEC-04`, `SEC-06`, `AS-03` |
| Related FR(s) | Persisted information used by `FR-USER-001` through `FR-AUDIT-002`, especially `FR-DOC-001`–`FR-DOC-003` |
| Related Open Question(s) | `OQ-07`, `OQ-08`, `OQ-11`, `OQ-12`, `OQ-33` |

#### NFR-BACK-002 — Recovery Time and Restore Verification

| Field | Specification |
|---|---|
| NFR ID | `NFR-BACK-002` |
| Category | Backup & Recovery |
| Constraint Type | Business quality target — threshold TBD |
| Requirement | The system shall be restorable to an approved recoverable state within the approved Recovery Time Objective, and restore exercises shall occur with an approved frequency and success threshold. |
| Rationale / Business Value | Backups are useful only when recoverability and restoration time are demonstrated (`BO-03`). |
| Measurement / Target | **TBD (`OQ-11`):** RTO in time units, restore-test frequency, recovery scope/order, success criteria, maximum failed exercises, and evidence retention. |
| Priority | Must — target TBD |
| Verification Method | Timed restore exercise in an approved non-production recovery setting; verify database/object/configuration consistency, authorized access, and critical smoke journeys against the approved RTO and success criteria. |
| Related BRD Reference | `BO-02`, `BO-03`, `FE-01`–`FE-13`, `SEC-04`, `SEC-06` |
| Related FR(s) | All requirements `FR-AUTH-001` through `FR-AUDIT-002` whose service or information must be recovered |
| Related Open Question(s) | `OQ-10`, `OQ-11`, `OQ-33` |

### 2.12 Logging

#### NFR-LOG-001 — Operational and Security Log Policy

| Field | Specification |
|---|---|
| NFR ID | `NFR-LOG-001` |
| Category | Logging |
| Constraint Type | Business quality target — threshold TBD |
| Requirement | Application and security logs shall capture the approved event set with approved severity/context while excluding or redacting approved sensitive data classes, credentials, JWTs, document content, and prohibited client/legal information. |
| Rationale / Business Value | Operations require diagnostic evidence without creating a secondary source of confidential-data exposure (`SEC-04`, `SEC-05`). |
| Measurement / Target | **TBD (`OQ-30`):** event/severity catalog, required context, prohibited/redacted fields, retention, access, and review frequency. Once the prohibited-data catalog is approved, target is zero prohibited values in the log test corpus. |
| Priority | Must — target TBD |
| Verification Method | Execute approved success/failure/security scenarios; reconcile expected events and severities, scan captured logs for prohibited values, and test log access/retention boundaries. |
| Related BRD Reference | `FE-02`, `FE-08`, `FE-12`, `FE-13`, `SEC-03`, `SEC-04`, `SEC-05` |
| Related FR(s) | `FR-AUTH-001`–`FR-AUTH-004`, `FR-DOC-001`–`FR-DOC-003`, `FR-NOTI-001`, `FR-AUDIT-001`, `FR-AUDIT-002` |
| Related Open Question(s) | `OQ-07`, `OQ-12`, `OQ-17`, `OQ-23`, `OQ-30` |

### 2.13 Monitoring

#### NFR-MON-001 — Service and Security Alerting

| Field | Specification |
|---|---|
| NFR ID | `NFR-MON-001` |
| Category | Monitoring |
| Constraint Type | Business quality target — threshold TBD |
| Requirement | Approved public, internal, database, object-storage, WebSocket, authentication, and security health indicators shall be monitored, and approved threshold breaches shall generate an alert through the approved route within the approved detection time. |
| Rationale / Business Value | Availability, incident restoration, and protection require timely detection rather than retrospective discovery (`BO-02`, `BO-03`). |
| Measurement / Target | **TBD (`OQ-10`, `OQ-30`):** monitored indicators, thresholds, evaluation windows, maximum detection/notification time, severity, routing, schedule, and acceptable missed/false-alert rates. |
| Priority | Must — target TBD |
| Verification Method | Synthetic fault/threshold exercises for every approved indicator; measure detection and notification times and calculate missed/false-alert rates against approved targets. |
| Related BRD Reference | `BO-02`, `BO-03`, `FE-01`, `FE-02`, `FE-08`, `FE-12`, `SEC-04` |
| Related FR(s) | `FR-WEB-001`, `FR-AUTH-001`, `FR-DOC-001`, `FR-DOC-002`, `FR-NOTI-001` |
| Related Open Question(s) | `OQ-09`, `OQ-10`, `OQ-13`, `OQ-30`, `OQ-33` |

### 2.14 Maintainability

#### NFR-MAINT-001 — Maintainability Quality Gate

| Field | Specification |
|---|---|
| NFR ID | `NFR-MAINT-001` |
| Category | Maintainability |
| Constraint Type | Proposed technical quality gate — pending approval |
| Requirement | Changes shall meet approved review, static-analysis, complexity, duplication, documentation, and critical-defect gates before release, while preserving BRD/FRS/NFR traceability. |
| Rationale / Business Value | The system must remain changeable as requirements are resolved and B2B foundations evolve without uncontrolled regressions (`BO-03`, `BO-04`). |
| Measurement / Target | **TBD (`OQ-31`):** required reviews, analysis rules, maximum severity/count, complexity/duplication limits, documentation rule, waiver owner, and release gate. **Confirmed documentation target:** 100% of changed requirements retain valid upstream references. |
| Priority | Proposed |
| Verification Method | Release quality report combining review evidence, approved static-analysis results, documentation/link checks, waiver register, and requirement-traceability validation. |
| Related BRD Reference | `BO-03`, `BO-04`, `FE-01`–`FE-13` |
| Related FR(s) | All requirements `FR-AUTH-001` through `FR-AUDIT-002` |
| Related Open Question(s) | `OQ-02`, `OQ-31`, `OQ-33` |

### 2.15 Testability

#### NFR-TEST-001 — Requirement Verification Coverage

| Field | Specification |
|---|---|
| NFR ID | `NFR-TEST-001` |
| Category | Testability |
| Constraint Type | Business-mandated constraint |
| Requirement | Every approved functional and non-functional requirement shall have at least one identified verification case before release acceptance; automated coverage and pass gates shall use approved thresholds. |
| Rationale / Business Value | Documentation-first traceability requires demonstrable evidence from requirement through acceptance (`BO-03`). |
| Measurement / Target | **Confirmed:** 100% of approved `FR-*` and `NFR-*` IDs map to at least one verification case and acceptance result before release. **TBD (`OQ-31`):** automated coverage metric/threshold, permitted exclusions, defect tolerance, and release pass rate. |
| Priority | Must |
| Verification Method | Automated traceability audit from requirement IDs to verification cases/results, plus approved coverage and defect-quality reports. |
| Related BRD Reference | `BO-03`, `FE-01`–`FE-13`, `SEC-05` |
| Related FR(s) | All 34 requirements `FR-AUTH-001` through `FR-AUDIT-002` |
| Related Open Question(s) | `OQ-31` |

### 2.16 Usability

#### NFR-USE-001 — User-task Success and Efficiency

| Field | Specification |
|---|---|
| NFR ID | `NFR-USE-001` |
| Category | Usability |
| Constraint Type | Business quality target — threshold TBD |
| Requirement | Representative Guest and internal-role users shall complete approved critical journeys within approved success-rate, time, error, assistance, and satisfaction targets. |
| Rationale / Business Value | Potential clients need a clear urgent-contact path and staff need an effective centralized workspace (`BO-02`, `BO-03`). |
| Measurement / Target | **TBD (`OQ-34`):** critical tasks by actor, participant profile/count, task-success percentage, completion time, user-error rate, assistance/training allowance, and satisfaction measure/threshold. |
| Priority | Must — target TBD |
| Verification Method | Moderated or instrumented usability study using approved representative users and tasks; calculate every approved metric by actor group. |
| Related BRD Reference | `BO-01`, `BO-02`, `BO-03`, `WEB-01`–`WEB-05` |
| Related FR(s) | `FR-WEB-001`–`FR-WEB-004`, `FR-LEAD-001`, `FR-AUTH-001`, `FR-LEAD-003`, `FR-APP-001`, `FR-CASE-003`, `FR-DOC-001`, `FR-CMS-001`–`FR-CMS-003` |
| Related Open Question(s) | `OQ-18`, `OQ-20`, `OQ-21`, `OQ-25`, `OQ-34` |

### 2.17 Accessibility

#### NFR-A11Y-001 — Accessible Primary Contact Actions

| Field | Specification |
|---|---|
| NFR ID | `NFR-A11Y-001` |
| Category | Accessibility |
| Constraint Type | Business-mandated constraint |
| Requirement | The primary consultation action and floating Zalo, Facebook Messenger, and hotline / Click-to-Call controls shall be perceivable and operable without blocking important page content across the approved accessibility and device test matrix. |
| Rationale / Business Value | The BRD explicitly requires visible, operable, accessible mobile contact actions for people seeking urgent legal help (`BO-02`). |
| Measurement / Target | **Confirmed:** 100% of named contact actions complete their approved action in every approved keyboard/assistive-technology/device case and zero cases obscure the test page's defined important content. The test matrix is TBD under `OQ-27` / `OQ-28`. |
| Priority | Must |
| Verification Method | Manual and automated tests of focus, accessible name, activation, visibility, zoom/reflow, assistive technology, and content obstruction across the approved matrix. |
| Related BRD Reference | `BO-02`, `FE-01`, `WEB-01`, `SEC-02` |
| Related FR(s) | `FR-WEB-003`, `FR-LEAD-001` |
| Related Open Question(s) | `OQ-18`, `OQ-25`, `OQ-27`, `OQ-28` |

#### NFR-A11Y-002 — Accessibility Conformance

| Field | Specification |
|---|---|
| NFR ID | `NFR-A11Y-002` |
| Category | Accessibility |
| Constraint Type | Business quality target — threshold TBD |
| Requirement | Public and internal interfaces shall meet the approved accessibility standard, conformance level, page/state coverage, assistive-technology matrix, and exception policy. |
| Rationale / Business Value | A consistent accessible experience supports trustworthy and usable legal-service access. |
| Measurement / Target | **TBD (`OQ-27`):** standard/version, conformance level, test scope, automated/manual rule set, supported assistive technologies, allowed defects/exceptions, and remediation threshold. |
| Priority | Must — target TBD |
| Verification Method | Approved automated rule scan plus manual keyboard, focus, semantics, contrast, reflow, error-identification, and assistive-technology assessment across the approved page/state sample. |
| Related BRD Reference | `BO-01`, `BO-02`, `FE-01`–`FE-11`, `WEB-01`–`WEB-05` |
| Related FR(s) | All UI-related requirements from `FR-AUTH-001` through `FR-WEB-004`, plus `FR-DASH-001` and `FR-AUDIT-002` |
| Related Open Question(s) | `OQ-25`, `OQ-27`, `OQ-28` |

### 2.18 Responsive Design

#### NFR-RWD-001 — Mobile-first Layout and Contact Visibility

| Field | Specification |
|---|---|
| NFR ID | `NFR-RWD-001` |
| Category | Responsive Design |
| Constraint Type | Business-mandated constraint |
| Requirement | Public pages shall adapt across the approved viewport/device matrix so primary consultation actions remain visible and operable, floating controls do not block important content, and required content remains usable without unintended horizontal overflow. |
| Rationale / Business Value | Mobile-first access is an explicit business direction for urgent consultation and public trust (`BO-01`, `BO-02`). |
| Measurement / Target | **Confirmed within approved matrix:** 100% of tested public pages meet the named visibility/operation/non-obstruction conditions; zero unintended horizontal-overflow failures. Exact viewports/devices are TBD under `OQ-28`. |
| Priority | Must |
| Verification Method | Automated viewport screenshots/layout assertions plus manual interaction tests for every public page template at each approved viewport, orientation, zoom, and content-length case. |
| Related BRD Reference | `BO-01`, `BO-02`, `FE-01`, `WEB-01`–`WEB-05` |
| Related FR(s) | `FR-WEB-001`–`FR-WEB-004`, `FR-LEAD-001` |
| Related Open Question(s) | `OQ-25`, `OQ-28` |

### 2.19 Browser Compatibility

#### NFR-BROWSER-001 — Supported Browser Matrix

| Field | Specification |
|---|---|
| NFR ID | `NFR-BROWSER-001` |
| Category | Browser Compatibility |
| Constraint Type | Business quality target — threshold TBD |
| Requirement | All applicable public and internal acceptance journeys shall operate consistently across the approved browser/version/device matrix. |
| Rationale / Business Value | Contact and legal-work journeys must be dependable for the user environments the project commits to support. |
| Measurement / Target | **TBD (`OQ-28`):** browser names/versions, OS/device combinations, support window, permitted visual variance, and severity/pass threshold. Once approved, 100% of mandatory acceptance journeys shall pass within the allowed variance. |
| Priority | Must — target TBD |
| Verification Method | Cross-browser execution of the approved mandatory journey suite with functional, accessibility, visual, and error evidence for each supported matrix entry. |
| Related BRD Reference | `BO-01`, `BO-02`, `BO-03`, `FE-01`–`FE-13` |
| Related FR(s) | All UI-related requirements `FR-AUTH-001` through `FR-AUDIT-002` |
| Related Open Question(s) | `OQ-28`, `OQ-31` |

### 2.20 SEO

#### NFR-SEO-001 — SEO Metadata and Structured-data Validity

| Field | Specification |
|---|---|
| NFR ID | `NFR-SEO-001` |
| Category | SEO |
| Constraint Type | Business-mandated constraint |
| Requirement | Every relevant publicly eligible page shall expose its approved Meta Title, Meta Description, Canonical URL, Open Graph metadata, and applicable valid JSON-LD without unapproved business facts. |
| Rationale / Business Value | Consistent, valid metadata supports the firm's search visibility and authoritative public presence (`BO-01`, `FE-10`). |
| Measurement / Target | **Confirmed:** zero invalid approved metadata fields or invalid JSON-LD documents across 100% of the approved relevant-page test set; zero structured-data facts absent from approved content. Exact relevant-page coverage/defaults remain `OQ-21` / `OQ-35`. |
| Priority | Must |
| Verification Method | Crawl every approved relevant page; compare emitted metadata to source content, validate Canonical/Open Graph values, and run structured-data syntax/schema validation for applicable `LegalService` and `LocalBusiness` output. |
| Related BRD Reference | `BO-01`, `FE-09`, `FE-10`, `WEB-01`, `WEB-02`, `WEB-03`, `WEB-04`, `WEB-05` |
| Related FR(s) | `FR-SEO-001`, `FR-SEO-002`, `FR-WEB-001`–`FR-WEB-004`, `FR-CMS-001`–`FR-CMS-003`, `FR-LAW-002` |
| Related Open Question(s) | `OQ-21`, `OQ-25`, `OQ-35` |

#### NFR-SEO-002 — Technical Discoverability and Search Performance

| Field | Specification |
|---|---|
| NFR ID | `NFR-SEO-002` |
| Category | SEO |
| Constraint Type | Business quality target — threshold TBD |
| Requirement | Publicly eligible content shall meet approved crawl/index directives, sitemap policy, duplicate-content handling, and search-performance thresholds; non-public or confidential content shall not be intentionally made indexable. |
| Rationale / Business Value | Discoverability supports brand and lead generation, while indexing controls protect non-public information (`BO-01`, `BO-02`, `SEC-04`). |
| Measurement / Target | **TBD (`OQ-35`):** sitemap/robots requirements, indexability rules, Core Web Vitals or other metric thresholds/percentiles, sample size, field/lab source, and reporting cadence. **Confirmed:** zero protected/non-public URLs intentionally marked indexable in the test corpus. |
| Priority | Must — target TBD |
| Verification Method | Technical crawl and directive audit, sitemap/robots validation when required, duplicate/canonical analysis, protected-route inspection, and approved field/lab performance measurement. |
| Related BRD Reference | `BO-01`, `BO-02`, `FE-01`, `FE-10`, `SEC-04` |
| Related FR(s) | `FR-SEO-001`, `FR-SEO-002`, `FR-WEB-001`–`FR-WEB-004` |
| Related Open Question(s) | `OQ-21`, `OQ-26`, `OQ-35` |

### 2.21 API Quality

#### NFR-API-001 — REST Contract Conformance and Validation

| Field | Specification |
|---|---|
| NFR ID | `NFR-API-001` |
| Category | API Quality |
| Constraint Type | Business-mandated constraint |
| Requirement | Once the OpenAPI 3.x contract is approved, every implemented REST operation and documented response shall conform to it, reject contract-invalid input, and preserve the authorization boundaries defined by the FRS. This requirement does not define endpoints. |
| Rationale / Business Value | A consistent REST interface reduces integration errors and prevents undocumented behavior across the approved functional scope (`BO-03`). |
| Measurement / Target | **Confirmed after contract approval:** 100% of implemented REST operations pass request/response contract validation; zero undocumented production operations; zero contract-valid unauthorized disclosures in the authorization suite. Detailed API policy is **TBD (`OQ-32`)**. |
| Priority | Must |
| Verification Method | Automated OpenAPI conformance tests against the future approved specification, operation inventory comparison, negative validation cases, and authorization tests. |
| Related BRD Reference | `FE-01`–`FE-13`, `SEC-03`, `SEC-04` |
| Related FR(s) | REST-capable requirements across all modules `FR-AUTH-001` through `FR-AUDIT-002`; WebSocket behavior remains separate under `FR-NOTI-001` |
| Related Open Question(s) | `OQ-04`, `OQ-20`, `OQ-29`, `OQ-32` |

#### NFR-API-002 — API Compatibility and Lifecycle Policy

| Field | Specification |
|---|---|
| NFR ID | `NFR-API-002` |
| Category | API Quality |
| Constraint Type | Proposed technical quality gate — pending approval |
| Requirement | REST API changes shall follow an approved versioning, backward-compatibility, deprecation, pagination, idempotency, and change-approval policy. |
| Rationale / Business Value | Stable integrations support the web application and future evolution without accidental client breakage (`BO-03`, `BO-04`). |
| Measurement / Target | **TBD (`OQ-32`):** versioning rule, compatibility definition, supported-version count/duration, deprecation notice, pagination limits, idempotency scope, and permitted breaking-change process. |
| Priority | Proposed |
| Verification Method | Automated contract-diff classification against the previous approved OpenAPI version plus review of version/deprecation/idempotency/pagination evidence under the approved policy. |
| Related BRD Reference | `BO-03`, `BO-04`, `FE-01`–`FE-13` |
| Related FR(s) | REST-capable requirements across all modules `FR-AUTH-001` through `FR-AUDIT-002` |
| Related Open Question(s) | `OQ-02`, `OQ-32`, `OQ-33` |

### 2.22 Error Handling

#### NFR-ERR-001 — Safe and Consistent Error Outcomes

| Field | Specification |
|---|---|
| NFR ID | `NFR-ERR-001` |
| Category | Error Handling |
| Constraint Type | Business-mandated constraint |
| Requirement | Public and protected failures shall produce a deterministic failure outcome appropriate to the channel, shall not claim success, and shall not disclose stack traces, credentials, JWTs, internal storage identifiers, document content, confidential business data, or unauthorized record existence. |
| Rationale / Business Value | Clear failures protect trust and confidentiality while supporting diagnosis (`BO-01`, `BO-03`, `SEC-04`). |
| Measurement / Target | **Confirmed:** 100% of cases in the approved validation, authorization, not-found, dependency-failure, and unexpected-failure test catalog return the expected failure class; zero prohibited information occurrences; zero false-success outcomes. Final REST error representation is TBD under `OQ-32`. |
| Priority | Must |
| Verification Method | Automated negative/failure-injection suite across UI, future REST contract, WebSocket, storage, and external-channel boundaries; scan outputs for prohibited data and compare outcomes to the approved error catalog. |
| Related BRD Reference | `BO-01`, `BO-03`, `SEC-03`, `SEC-04` |
| Related FR(s) | All requirements `FR-AUTH-001` through `FR-AUDIT-002` |
| Related Open Question(s) | `OQ-12`, `OQ-23`, `OQ-29`, `OQ-30`, `OQ-32` |

### 2.23 Deployment

#### NFR-DEP-001 — Approved Stack and Environment Deployment

| Field | Specification |
|---|---|
| NFR ID | `NFR-DEP-001` |
| Category | Deployment |
| Constraint Type | Business-mandated constraint |
| Requirement | Deployable system components shall use the approved technology direction: Next.js frontend, Spring Boot backend, MySQL primary database, JWT authentication, REST API integration, WebSocket real-time communication, and one active private object-storage target—AWS S3 or MinIO—per environment. |
| Rationale / Business Value | The BRD establishes these technologies as project constraints and AWS S3/MinIO as alternatives (`AS-03`). |
| Measurement / Target | **Confirmed:** 100% of deployed application components and environment manifests conform to the named stack; exactly one approved active object-storage target per environment unless the BRD is amended; zero unapproved production platform substitutions. Environment topology is **TBD (`OQ-33`)**. |
| Priority | Must |
| Verification Method | Release-manifest and deployed-environment inspection against the BRD technology matrix; verify active storage configuration and prohibit assumptions that both providers are required simultaneously. |
| Related BRD Reference | `FE-02`, `FE-08`, `FE-12`, `SEC-06`, `AS-03` |
| Related FR(s) | `FR-AUTH-001`–`FR-AUTH-004`, `FR-DOC-001`, `FR-DOC-002`, `FR-NOTI-001`, plus REST-backed functional scope |
| Related Open Question(s) | `OQ-29`, `OQ-33` |

#### NFR-DEP-002 — Release Verification and Rollback Target

| Field | Specification |
|---|---|
| NFR ID | `NFR-DEP-002` |
| Category | Deployment |
| Constraint Type | Proposed technical quality gate — pending approval |
| Requirement | Production releases shall follow approved authorization, smoke-verification, rollback, evidence, and change-window rules; rollback shall meet an approved maximum restoration time and data-consistency condition. |
| Rationale / Business Value | Controlled releases reduce outages and inconsistent legal records (`BO-03`). |
| Measurement / Target | **TBD (`OQ-33`):** environments, release approver, smoke suite, success threshold, rollback trigger, maximum rollback time, data-migration treatment, and evidence retention. |
| Priority | Proposed |
| Verification Method | Staged deployment/rollback exercise and release-record review; measure smoke results, authorization evidence, rollback duration, and post-rollback consistency against approved rules. |
| Related BRD Reference | `BO-02`, `BO-03`, `FE-01`–`FE-13` |
| Related FR(s) | Critical journeys represented by `FR-WEB-001`, `FR-LEAD-001`, `FR-AUTH-001`, `FR-CASE-001`, `FR-DOC-001`, `FR-NOTI-001`, `FR-AUDIT-001` |
| Related Open Question(s) | `OQ-02`, `OQ-05`, `OQ-10`, `OQ-11`, `OQ-33` |

### 2.24 Configuration Management

#### NFR-CONF-001 — Externalized and Controlled Configuration

| Field | Specification |
|---|---|
| NFR ID | `NFR-CONF-001` |
| Category | Configuration Management |
| Constraint Type | Proposed technical quality gate — pending approval |
| Requirement | Environment-specific non-secret configuration and secrets shall be separated from application source, controlled under approved ownership/change rules, and validated before activation; secrets shall not be committed to the documentation or application source repository. |
| Rationale / Business Value | Controlled configuration supports secure environment differences, including AWS S3 versus MinIO, without source changes or credential disclosure (`SEC-04`, `SEC-06`). |
| Measurement / Target | **Confirmed:** zero active plaintext secrets in repository scans. **TBD (`OQ-29`, `OQ-33`):** secret/configuration systems, owners, rotation, approval, validation, audit, recovery, and environment-promotion rules. |
| Priority | Proposed |
| Verification Method | Repository secret scan, environment configuration inventory, unauthorized-change test, and review of approval/validation/rotation evidence under the approved policy. |
| Related BRD Reference | `FE-03`, `FE-08`, `FE-12`, `SEC-03`, `SEC-04`, `SEC-06`, `AS-03` |
| Related FR(s) | `FR-USER-003`, `FR-DOC-001`, `FR-DOC-002`, `FR-NOTI-001`, `FR-WEB-003` |
| Related Open Question(s) | `OQ-09`, `OQ-13`, `OQ-29`, `OQ-33` |

### 2.25 Observability

#### NFR-OBS-001 — End-to-end Diagnostic Correlation

| Field | Specification |
|---|---|
| NFR ID | `NFR-OBS-001` |
| Category | Observability |
| Constraint Type | Business quality target — threshold TBD |
| Requirement | Approved critical journeys shall produce enough correlated logs, metrics, and traces or equivalent diagnostic evidence to locate the failing system boundary without exposing prohibited sensitive information. |
| Rationale / Business Value | Fast diagnosis supports availability and incident restoration across frontend, backend, database, private storage, WebSocket, and approved external services (`BO-02`, `BO-03`). |
| Measurement / Target | **TBD (`OQ-30`):** critical journeys, correlation coverage, required signals/fields, sampling, retention, maximum diagnostic time, redaction, and access. Once approved, 100% of sampled critical-journey failures shall meet the correlation rule. |
| Priority | Must — target TBD |
| Verification Method | Inject a known failure at each approved boundary, use only approved telemetry to identify it, measure diagnostic time/coverage, and scan evidence for prohibited data. |
| Related BRD Reference | `BO-02`, `BO-03`, `FE-01`, `FE-02`, `FE-05`, `FE-08`, `FE-12`, `SEC-04`, `SEC-05` |
| Related FR(s) | `FR-WEB-003`, `FR-LEAD-001`, `FR-AUTH-001`, `FR-DOC-001`, `FR-DOC-002`, `FR-NOTI-001`, `FR-AUDIT-001` |
| Related Open Question(s) | `OQ-10`, `OQ-12`, `OQ-13`, `OQ-30`, `OQ-33` |

## 3. Requirement Inventory

| Category | Requirement IDs | Count |
|---|---|---:|
| Performance | `NFR-PERF-001`–`NFR-PERF-002` | 2 |
| Availability | `NFR-AVAIL-001` | 1 |
| Reliability | `NFR-REL-001` | 1 |
| Scalability | `NFR-SCALE-001` | 1 |
| Security | `NFR-SEC-001`–`NFR-SEC-003` | 3 |
| Authentication & Authorization | `NFR-AUTH-001`–`NFR-AUTH-002` | 2 |
| Data Protection | `NFR-DATA-001`–`NFR-DATA-002` | 2 |
| Document/File Security | `NFR-FILE-001`–`NFR-FILE-002` | 2 |
| Auditability | `NFR-AUD-001`–`NFR-AUD-002` | 2 |
| Privacy | `NFR-PRIV-001`–`NFR-PRIV-002` | 2 |
| Backup & Recovery | `NFR-BACK-001`–`NFR-BACK-002` | 2 |
| Logging | `NFR-LOG-001` | 1 |
| Monitoring | `NFR-MON-001` | 1 |
| Maintainability | `NFR-MAINT-001` | 1 |
| Testability | `NFR-TEST-001` | 1 |
| Usability | `NFR-USE-001` | 1 |
| Accessibility | `NFR-A11Y-001`–`NFR-A11Y-002` | 2 |
| Responsive Design | `NFR-RWD-001` | 1 |
| Browser Compatibility | `NFR-BROWSER-001` | 1 |
| SEO | `NFR-SEO-001`–`NFR-SEO-002` | 2 |
| API Quality | `NFR-API-001`–`NFR-API-002` | 2 |
| Error Handling | `NFR-ERR-001` | 1 |
| Deployment | `NFR-DEP-001`–`NFR-DEP-002` | 2 |
| Configuration Management | `NFR-CONF-001` | 1 |
| Observability | `NFR-OBS-001` | 1 |
| **Total** | | **38** |

## 4. Confirmed Measurable Constraints

The following targets come directly from approved business constraints or from binary/coverage interpretations required to verify them:

- 100% of production application access points use TLS-protected transport; plaintext access exposes no application content or protected operation.
- 100% of accepted production website consultations pass reCAPTCHA v3 or an approved equivalent anti-abuse decision.
- Zero false-success or prohibited partial Lead-to-Case outcomes in the approved failure test suite.
- 100% denial across approved unauthorized authentication, authorization, object-access, and post-expiry temporary-access cases; zero protected disclosures.
- 100% of production storage locations holding named sensitive information classes have platform-supported encryption at rest enabled.
- Supported document types remain PDF, DOCX, JPG, and PNG; each uploaded file remains limited to 20 MB by the FRS.
- 100% of approved sensitive-event cases produce required Audit Events and applicable fields.
- Zero prohibited confidential values in the approved public-response and error corpora.
- 100% traceability from approved FR/NFR IDs to at least one verification case before release acceptance.
- 100% of tested primary contact actions meet the confirmed operability/non-obstruction conditions across the eventual approved matrix.
- 100% of approved relevant public pages produce valid approved metadata/JSON-LD with zero invented structured-data facts.
- 100% of implemented REST operations conform to the future approved OpenAPI contract, with zero undocumented production REST operations.
- Deployed components conform to Next.js, Spring Boot, MySQL, JWT, REST API, WebSocket, and one active AWS S3 or MinIO target per environment.
- Zero active plaintext secrets in repository scans.

These targets do not resolve the OQs that define the test matrix, protocol baseline, content catalog, event catalog, workload, or policy.

## 5. Targets Still TBD

| Target group | Required decision |
|---|---|
| Performance and capacity | Page/API/upload/WebSocket latency percentiles, throughput, concurrency, dataset/object volume, growth horizon, test duration, and acceptable error/degradation (`OQ-26`, `OQ-35`). |
| Availability and restoration | Public/internal availability, service hours, maintenance exclusions, incident response/restoration, reporting window (`OQ-10`). |
| Recovery | RPO, RTO, backup/restore frequency, recovery scope, success criteria, evidence retention (`OQ-11`). |
| Security | TLS/cryptographic baseline, headers, vulnerability/remediation gates, secrets, file-malware controls, temporary URL lifetime (`OQ-29`). |
| RBAC and authentication | Complete role/record matrix; credential, session, token, recovery, lockout rules (`OQ-04`, `OQ-23`). |
| Privacy and lifecycle | Applicable obligations, consent, field minimization, residency, retention, deletion, legal hold, audit retention (`OQ-07`, `OQ-08`, `OQ-12`, `OQ-17`, `OQ-20`). |
| Operations | Log/metric/trace catalogs, redaction, sampling, retention, alert thresholds/routes, incident severity, diagnostic target (`OQ-30`). |
| Engineering quality | Review, static analysis, coverage, defect, pass-rate, and release gates (`OQ-31`). |
| User experience | Usability metrics, accessibility conformance, assistive technology, browser/device/viewport support (`OQ-27`, `OQ-28`, `OQ-34`). |
| SEO | Crawl/index/sitemap/robots and field/lab performance targets/tooling (`OQ-35`). |
| API | Versioning, compatibility, deprecation, pagination, idempotency, validation, error policy (`OQ-32`). |
| Deployment/configuration | Environments, region/hosting boundary, approvals, smoke/rollback rules, configuration ownership/change control (`OQ-33`). |

## 6. BRD and FRS Coverage

### 6.1 BRD Coverage

All four business opportunities, all 13 in-scope capabilities, all five public-experience requirements, and all six security/privacy requirements have NFR coverage through direct references or cross-cutting requirements. Excluded capabilities `LI-01`–`LI-08` are not introduced; advanced analytics is explicitly excluded from scalability and performance scope.

### 6.2 Functional Coverage

Every one of the 34 FRS IDs is referenced by at least one NFR, either explicitly or through a clearly bounded complete range. Cross-cutting “all requirements” references apply only to quality concerns relevant to every functional module and do not redefine functional behavior.

## 7. Open Questions Affecting the NFR

The NFR requirements directly reference `OQ-02`, `OQ-04`–`OQ-14`, `OQ-17`, `OQ-18`, `OQ-20`, `OQ-21`, `OQ-23`, and `OQ-25`–`OQ-35`.

- `OQ-10` and `OQ-11` are the authoritative blockers for SLA, RPO, and RTO values.
- `OQ-26`–`OQ-35` were added during NFR analysis because the existing register did not contain decision IDs for required measurable workload, accessibility, browser, security, observability, engineering-quality, API, deployment, usability, and technical-SEO targets.
- `OQ-03`, `OQ-15`, `OQ-16`, `OQ-19`, `OQ-22`, and `OQ-24` remain unresolved but do not set NFR thresholds in this baseline. Their functional decisions may require a future NFR consistency update.
- `OQ-01` concerns the project code and does not affect system quality behavior.

## 8. Validation Record

**Validation status:** Passed on 2026-08-12.

The completion review must confirm:

- all `NFR-*` identifiers are unique and follow the category convention;
- every requirement contains all ten mandatory fields plus its constraint type;
- every requirement has a metric or explicitly TBD metric dimensions, a repeatable verification method, valid BRD anchors, valid FR references, and valid OQ references;
- every numeric or policy target not approved upstream is marked `TBD` and linked to the controlling OQ;
- confirmed targets are derived from business-mandated constraints rather than invented stakeholder thresholds;
- all required categories, `FE-01`–`FE-13`, `WEB-01`–`WEB-05`, `SEC-01`–`SEC-06`, and all 34 FRs have coverage;
- functional behavior is referenced rather than duplicated;
- terminology matches the BRD and FRS; and
- no database schema, final endpoint, implementation class, unapproved infrastructure, Use Case, UML, ERD, OpenAPI contract, SDD, or application code is introduced.

Validation confirmed 38 unique NFRs across all 25 required categories, all 380 mandatory field instances, complete coverage of the 34 FRS requirements and the BRD `FE-*`, `WEB-*`, and `SEC-*` baselines, valid OQ references for every unresolved target, measurable verification definitions, and separation of confirmed constraints from unapproved technical targets.

