# Requirements Traceability Matrix

## Document Control

| Field               | Value                                                         |
| ------------------- | ------------------------------------------------------------- |
| Project             | Law Firm Website & Management System                          |
| Document            | Requirements Traceability Matrix                              |
| Document ID         | `RTM-12`                                                      |
| Version             | 1.0                                                           |
| Status              | Complete and validated baseline                               |
| Effective date      | 2026-08-12                                                    |
| Document references | Documents `01` through `11` in the `docs/` directory           |

## Record of Changes

| Date       | Change type | In charge | Description                                                           |
| ---------- | ----------- | --------- | --------------------------------------------------------------------- |
| 2026-08-12 | Added       | AI Agent  | Created end-to-end traceability matrix across all Phase 1 artifacts.  |

## 1. Introduction
This Requirements Traceability Matrix (RTM) links business requirements down to technical architecture, ensuring that every feature designed has a valid business justification and that no requirement was lost during the design phase.

## 2. Matrix

| Feature / Domain | BRD | FR | NFR | Use Case | User Story | Acceptance Criteria | UML Diagram | ERD Entity | API Path | SDD Section |
|---|---|---|---|---|---|---|---|---|---|---|
| **Auth / Login** | FE-02, SEC-03, BO-03 | FR-AUTH-001 | NFR-SEC-001, NFR-AUTH-001 | UC-AUTH-001 | US-AUTH-001 | AC-AUTH-001 | Sequence (3.1) | `users`, `roles` | `POST /auth/login` | 12. Authentication |
| **Token Refresh** | FE-02, SEC-03 | FR-AUTH-003, 004 | NFR-AUTH-002 | UC-AUTH-002 | US-AUTH-002 | AC-AUTH-002 | N/A | `refresh_tokens` | `POST /auth/refresh` | 12. Authentication |
| **RBAC / Scopes** | FE-03, SEC-04 | FR-AUTH-004 | NFR-PRIV-001 | UC-AUTH-004 | US-AUTH-004 | AC-AUTH-004 | N/A | `roles`, `users` | All private endpoints | 13. Authorization / RBAC |
| **User Mgmt** | FE-03, SEC-05, BO-03 | FR-USER-001, 002, 003 | NFR-AUTH-002, NFR-AUD-001 | UC-USER-001, 002, 003 | US-USER-001, 002, 003 | AC-USER-001, 002, 003 | Use Case View (1) | `users`, `roles` | `/users` | 13. Authorization / RBAC |
| **Lawyer Profile (Mgmt)**| FE-04, SEC-04 | FR-LAW-001, 002 | NFR-PRIV-001 | UC-LAW-001 | US-LAW-001 | AC-LAW-001 | Use Case View (1) | `lawyer_profiles` | N/A (Internal CMS part) | 18. CMS Architecture |
| **Lawyer Profile (Pub)** | FE-04, WEB-03, BO-01 | FR-LAW-002, FR-WEB-002 | NFR-SEO-001 | UC-LAW-002, UC-WEB-003| US-LAW-002, US-WEB-003| AC-LAW-002, AC-WEB-003| Use Case View (1) | `lawyer_profiles` | `GET /lawyers` | 8. Frontend Architecture |
| **Lead Intake (Pub)** | FE-05, WEB-01, BO-02 | FR-LEAD-001 | NFR-SEC-002, NFR-PRIV-002 | UC-LEAD-001 | US-LEAD-001 | AC-LEAD-001 | Sequence (3.1) | `leads` | `POST /leads` | 14. Lead Management |
| **Lead Tracking** | FE-05, BO-02, BO-03 | FR-LEAD-003, 004 | NFR-AUTH-002, NFR-REL-001 | UC-LEAD-002, 003, 004 | US-LEAD-002, 003, 004 | AC-LEAD-002, 003, 004 | Activity (2.1) | `leads`, `lead_notes` | `GET /leads`, `PATCH /leads/{id}` | 14. Lead Management |
| **Lead Generation (Ext)**| FE-05, FE-12 | FR-LEAD-002 | NFR-PRIV-002 | UC-LEAD-005 | US-LEAD-005 | AC-LEAD-005 | Activity (2.1) | `leads` | `POST /leads` (internal) | 14. Lead Management |
| **Case Conversion** | FE-07, BO-03 | FR-CASE-001, FR-LEAD-004 | NFR-REL-001 | UC-CASE-001 | US-CASE-001 | AC-CASE-001 | Sequence (3.2) | `cases`, `leads` | `POST /cases` | 16. Case Management |
| **Case Tracking** | FE-07, SEC-04, BO-03 | FR-CASE-002, 003 | NFR-PRIV-001, NFR-DATA-001 | UC-CASE-002, 003 | US-CASE-002, 003 | AC-CASE-002, 003 | Sequence (3.2) | `cases`, `case_activities`, `case_lawyers`| `GET /cases/{id}`, `PATCH /cases/{id}` | 16. Case Management |
| **Appointments** | FE-06, BO-03 | FR-APP-001, 002 | NFR-REL-001, NFR-PRIV-001 | UC-APP-001, 002 | US-APP-001, 002 | AC-APP-001, 002 | Use Case View (1) | `appointments` | `POST /appointments`, `PATCH /appointments/{id}`| 15. Appointment Architecture |
| **Document Upload** | FE-08, SEC-06, AS-03 | FR-DOC-001, 003 | NFR-FILE-001, NFR-DATA-001 | UC-DOC-001, 003 | US-DOC-001, 003 | AC-DOC-001, 003 | Activity (2.2) | `documents` | `POST /documents` | 17. Document Storage |
| **Document Access** | FE-08, SEC-04, SEC-06 | FR-DOC-002 | NFR-FILE-002, NFR-PRIV-001 | UC-DOC-002 | US-DOC-002 | AC-DOC-002 | Sequence (3.3) | `documents` | `GET /documents/{id}/download` | 17. Document Storage |
| **Service CMS (Pub)** | FE-09, WEB-02, LI-06 | FR-CMS-001, FR-WEB-001 | NFR-SEO-001 | UC-CMS-003, UC-WEB-002| US-CMS-003, US-WEB-002| AC-CMS-003, AC-WEB-002| Class Diagram (4) | `services` | `GET /services` | 18. CMS Architecture |
| **Blog CMS** | FE-10, BO-01 | FR-CMS-002, FR-WEB-001 | NFR-SEO-001 | UC-CMS-001 | US-CMS-001 | AC-CMS-001 | Class Diagram (4) | `blogs` | `GET /blogs` | 18. CMS Architecture |
| **Case Study CMS** | FE-09, WEB-05, AS-02 | FR-CMS-003, FR-WEB-001 | NFR-PRIV-001 | UC-CMS-002 | US-CMS-002 | AC-CMS-002 | Class Diagram (4) | `case_studies` | `GET /case-studies` | 18. CMS Architecture |
| **SEO Metadata** | FE-10, BO-01 | FR-SEO-001, 002 | NFR-SEO-001, 002 | UC-SEO-001, 002 | US-SEO-001, 002 | AC-SEO-001, 002 | Class Diagram (4) | `seo_metadata` | `PATCH /seo` | 19. SEO Architecture |
| **Public UX/Nav** | WEB-01, WEB-04 | FR-WEB-003, 004 | NFR-PERF-001, NFR-RWD-001 | UC-WEB-001, 004 | US-WEB-001, 004 | AC-WEB-001, 004 | Use Case View (1) | N/A | N/A | 8. Frontend Architecture |
| **Dashboard** | FE-11, LI-08 | FR-DASH-001 | NFR-PERF-002 | UC-DASH-001 | US-DASH-001 | AC-DASH-001 | Use Case View (1) | N/A (Aggregated) | `GET /dashboard` | 8. Frontend Architecture |
| **Notifications** | FE-12, BO-03 | FR-NOTI-001 | NFR-PERF-002 | UC-NOTI-001 | US-NOTI-001 | AC-NOTI-001 | Sequence (3.1) | `notifications` | `GET /notifications` (history) | 20. Notification Architecture |
| **Audit Logs** | FE-13, SEC-05, BO-03 | FR-AUDIT-001, 002 | NFR-AUD-001, 002 | UC-AUDIT-001, 002 | US-AUDIT-001, 002 | AC-AUDIT-001, 002 | Class Diagram (4) | `audit_logs` | `GET /audit-logs` | 21. Audit Logging |

## 3. Analysis

### Missing / Orphan Analysis
- **Orphan FRs**: None. All 34 FRs map to Use Cases and downstream components.
- **Orphan UCs**: None. All 35 UCs map to User Stories and Acceptance Criteria.
- **Orphan Stories**: None.
- **Orphan Entities**: None. Every entity in the `08-erd.md` has a business justification directly supporting a tracked FR.
- **Orphan API Paths**: None. The API paths exclusively support the front-end features defined in the Use Cases.

### Unresolved Items (OQs)
Several items tracked above retain implementation ambiguity based on the `assumptions-open-questions.md` register:
- Exact data retention logic for soft deletion (`OQ-07`, `OQ-08`, `OQ-12`).
- RBAC matrices for specific statuses (`OQ-04`).
- Lead to Case conversion field mapping requirements (`OQ-05`, `OQ-06`).

These do not break traceability, but represent final detail decisions required before coding begins.
