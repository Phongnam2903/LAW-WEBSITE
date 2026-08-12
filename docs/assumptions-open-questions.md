# Assumptions and Open Questions

## Document Control

| Field | Value |
|---|---|
| Project | Law Firm Website & Management System |
| Register version | 1.0 |
| Status | Active |
| Last updated | 2026-08-12 |
| Business authority | [01-brd.md](01-brd.md) |

This register records confirmed planning assumptions and unresolved business decisions. It does not fill gaps with inferred requirements. An open question remains unresolved until an authorized decision is recorded here and, when it changes the business baseline, incorporated into the BRD.

## 1. Confirmed Planning Assumptions

| ID | Assumption | Source | Downstream impact |
|---|---|---|---|
| `AS-01` | The initial market focus is B2C legal clients; advanced B2B operations remain future scope. | Report 1, Product Background and Scope | Navigation and data foundations may support future B2B expansion, but current functional scope must not include advanced B2B workflows. |
| `AS-02` | Public Case Studies must be anonymized and approved before publication. | Report 1, Assumptions | FRS and acceptance criteria must define publication behavior only after the approval owner and checklist in `OQ-14` are resolved. |
| `AS-03` | AWS S3 and MinIO are alternative private object-storage targets; the active provider may vary by environment. | Report 1, Assumptions | NFR and SDD must avoid treating both providers as simultaneously mandatory. |
| `AS-04` | Phase 1 documentation is maintained in English. | Report 1, Assumptions | Public localization and the exact Vietnamese CTA remain unresolved under `OQ-18` and `OQ-25`. |

## 2. Open Questions

All questions currently have status **Open**. Priority indicates sequencing impact, not an invented delivery commitment.

| ID | Priority | Question / decision required | Affected BRD area | Required before |
|---|---|---|---|---|
| `OQ-01` | Medium | What is the official project code? | Project information | Formal document release |
| `OQ-02` | High | Who are the official project sponsor, business owner, product owner, stakeholders, delivery-team members, and decision owners? | Governance and project team | Approval workflow and final sign-off |
| `OQ-03` | High | What is the final legal Case lifecycle, including statuses, allowed transitions, closure, reopening, and ownership rules? | `FE-07` | Detailed FRS, Use Cases, ERD, and API |
| `OQ-04` | High | What is the complete RBAC permission matrix, including record-level access and sensitive-operation restrictions? | `FE-02`, `FE-03`, all internal capabilities | Detailed FRS and Use Cases |
| `OQ-05` | High | What validations, approvals, data mappings, and transactional rules govern Lead-to-Case conversion? | `FE-05`, `FE-07` | Detailed FRS, ERD, and API |
| `OQ-06` | High | How are duplicate Leads detected, reviewed, merged, or rejected across contact channels? | `FE-05` | Detailed Lead Management requirements |
| `OQ-07` | High | What is the retention period for each document and business-record category? | `FE-08`, `FE-13`, `SEC-04` | NFR, data design, and SDD |
| `OQ-08` | High | What document deletion, recovery, legal-hold, and permanent-disposal policy applies? | `FE-08`, `SEC-04` | FRS, NFR, data design, and SDD |
| `OQ-09` | High | Which notification channels are mandatory for MVP, who receives each notification, and what escalation, delivery, retry, and read-state rules apply? | `FE-12` | Detailed Notifications requirements and API |
| `OQ-10` | High | What SLA targets apply to public access, internal operations, support response, and incident restoration? | Quality requirements | NFR |
| `OQ-11` | High | What backup Recovery Point Objective and Recovery Time Objective are required? | Reliability and recovery | NFR and SDD |
| `OQ-12` | High | Which legal, privacy, consent, data-residency, and records-retention obligations apply to client and legal information? | `SEC-04`, `SEC-06` | NFR, FRS, ERD, API, and SDD |
| `OQ-13` | High | What integration depth is required for Zalo, Facebook Messenger, hotline services, Email, and Zalo ZNS? | Current context, `FE-01`, `FE-12` | Detailed FRS and external-interface design |
| `OQ-14` | High | Who approves Case Studies, and what anonymization and confidentiality checklist is required before publication? | `FE-09`, `WEB-05`, `AS-02` | Content FRS, Use Cases, and Acceptance Criteria |
| `OQ-15` | High | What defines a qualified or lost Lead, which transitions may lead to `LOST`, and which loss or qualification reasons must be recorded? | `FE-05` | Detailed Lead Management FRS and lifecycle diagrams |
| `OQ-16` | High | What availability, time-zone, rescheduling, reminder, completion, and cancellation rules govern appointments? | `FE-06` | Appointment FRS and Use Cases |
| `OQ-17` | High | How long must audit records be retained, and which sensitive actions require previous/new-value capture? | `FE-13`, `SEC-05` | Audit FRS, NFR, ERD, and API |
| `OQ-18` | Medium | What is the exact approved Vietnamese wording for the primary urgent-case-assessment CTA? The Office source contains corrupted characters and cannot be used verbatim. | `WEB-01` | Public content specification and UI acceptance criteria |
| `OQ-19` | High | What current systems, spreadsheets, repositories, and manual records exist, and is any migration or synchronization required? | Current operating context | Complete FRS scope and SDD context |
| `OQ-20` | High | Which data fields, validation rules, consent acknowledgements, privacy notice, and evidence of consent are required for public consultation intake? | `FE-01`, `FE-05`, `SEC-02`, `SEC-04` | Lead FRS, NFR, ERD, and API |
| `OQ-21` | High | What draft, review, approval, publication, unpublication, and archival rules apply to Lawyers, Services, Blog posts, and Case Studies, and which roles perform each action? | `FE-04`, `FE-09`, `WEB-05` | Content FRS and Use Cases |
| `OQ-22` | Medium | Which dashboard and basic-reporting measures, filters, date ranges, and role visibility are required, and what business success KPIs apply? | `BO-01`–`BO-04`, `FE-11` | Reporting FRS and Acceptance Criteria |
| `OQ-23` | High | What internal-account lifecycle, credential recovery, token/session, lockout, and any additional authentication policy are required? | `FE-02`, `FE-03`, `SEC-03` | Authentication and User Management FRS and NFR |
| `OQ-24` | High | Does a Guest request a specific appointment, or does authorized staff create an appointment after consultation intake, and what information connects the Lead and Appointment? | `FE-01`, `FE-06` | Appointment and Lead FRS |
| `OQ-25` | Medium | Which languages and localization rules apply to the public website and internal workspace? | Public experience, `AS-04` | Content FRS and UI acceptance criteria |

## 3. Clarified Scope Boundaries

These audit findings are not open business questions because the authoritative project direction resolves them:

- Corporate Legal Services may be visible in public navigation, while advanced B2B operational workflows remain outside current scope.
- AWS S3 and MinIO are environment alternatives, not a requirement to operate two object stores simultaneously.
- Email and Zalo ZNS are potential integrations, not confirmed MVP channels.
- Guest / Public Visitor is an external actor, not an internal RBAC role.
- The cafeteria, meal, menu, patron, product/order, asset-management, psychology, and unrelated capstone examples found in Office templates are legacy sample content and have no project authority.
- Angular, Android, Firebase, Eclipse, and other legacy tool examples in the Project Management Plan do not override the approved target stack in the BRD.

## 4. Decision Recording Procedure

When an answer is approved:

1. record the decision, decision date, and approving authority against the question;
2. update [01-brd.md](01-brd.md) if the decision changes the business baseline;
3. update every affected downstream document and traceability link; and
4. retain the question ID so historical references remain stable.

