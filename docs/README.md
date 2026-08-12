# Law Firm Website & Management System — Documentation

## 1. Purpose

This directory contains the primary working documentation for the **Law Firm Website & Management System**. The project uses a documentation-first workflow:

`Business Requirements → Functional Requirements → System Analysis → System Design → Implementation`

Original Office files under `Document/` are retained unchanged as references and templates. Markdown and YAML files under `docs/` are the current project documentation.

## 2. Project Overview

| Item | Direction |
|---|---|
| Business domain | Litigation and Dispute Resolution |
| Current market focus | B2C legal clients |
| Future direction | B2B corporate legal services |
| Frontend | Next.js |
| Backend | Spring Boot |
| Database | MySQL |
| Authentication | JWT |
| Object storage | AWS S3 / MinIO |
| Application integration | REST API |
| Real-time communication | WebSocket |

## 3. Phase 1 — Business Analysis & System Design

### Progress

- [x] 01 — Business Requirements Document (BRD)
- [x] 02 — Functional Requirements Specification (FRS)
- [x] 03 — Non-Functional Requirements (NFR)
- [x] 04 — Use Case Specification
- [ ] 05 — User Stories
- [ ] 06 — Acceptance Criteria
- [ ] 07 — UML
- [ ] 08 — ERD
- [ ] 09 — Database Dictionary
- [ ] 10 — OpenAPI Specification
- [ ] 11 — System Design Document (SDD)
- [ ] 12 — Requirements Traceability Matrix
- [ ] 13 — Final Cross-document Consistency Review

**Completed:** 4 of 13 Phase 1 items.

## 4. Current Status

| Field | Status |
|---|---|
| Phase | Phase 1 — Business Analysis & System Design |
| Current Focus | User Stories |
| Next Task | User Stories |
| Application Development | Not started |
| Phase 2 UI/UX | Not started |
| Backend Development | Not started |
| Frontend Development | Not started |
| Deployment | Not started |

## 5. Required Documentation Structure

| Order | File | Current state |
|---:|---|---|
| — | `README.md` | Present; authoritative progress tracker |
| 1 | `01-brd.md` | Present; complete and validated |
| 2 | `02-frs.md` | Present; complete and validated |
| 3 | `03-nfr.md` | Present; complete and validated |
| 4 | `04-use-case-specification.md` | Present; complete and validated |
| 5 | `05-user-stories.md` | Not created |
| 6 | `06-acceptance-criteria.md` | Not created |
| 7 | `07-uml.md` | Not created |
| 8 | `08-erd.md` | Not created |
| 9 | `09-database-dictionary.md` | Not created |
| 10 | `10-openapi.yaml` | Not created |
| 11 | `11-system-design-document.md` | Not created |
| 12 | `requirements-traceability-matrix.md` | Not created |
| — | `assumptions-open-questions.md` | Present; active controlled register |

Files are created in dependency order. A missing downstream file is intentional until its upstream documentation is complete and validated.

## 6. Documentation Dependency

```text
01 BRD
   ↓
02 FRS
   ↓
03 NFR
   ↓
04 Use Cases
   ↓
05 User Stories
   ↓
06 Acceptance Criteria
   ↓
07 UML
   ↓
08 ERD
   ↓
09 Database Dictionary
   ↓
10 OpenAPI
   ↓
11 SDD
   ↓
12 Traceability Matrix
   ↓
13 Final Consistency Review
```

Do not design a downstream artifact from an undocumented assumption.

## 7. Sources of Truth

| Concern | Authoritative document |
|---|---|
| Phase 1 progress | `README.md` |
| Business scope and terminology | [01-brd.md](01-brd.md) |
| Assumptions and unresolved decisions | [assumptions-open-questions.md](assumptions-open-questions.md) |
| Detailed functional behavior | [02-frs.md](02-frs.md) |
| Non-functional quality constraints | [03-nfr.md](03-nfr.md) |
| Data model | `08-erd.md` and `09-database-dictionary.md` when completed |
| API contract | `10-openapi.yaml` when completed |
| Architecture | `11-system-design-document.md` when completed |

The original Office files are references and templates. If legacy sample content or an unresolved placeholder conflicts with the BRD, the BRD controls.

## 8. Traceability Rule

Every major feature must ultimately be traceable through:

`BRD → FRS → NFR / Use Case → User Story → Acceptance Criteria → UML → ERD / API → SDD`

BRD identifiers currently available as traceability anchors are:

- `BO-01`–`BO-04` — business opportunities;
- `FE-01`–`FE-13` — in-scope capabilities;
- `LI-01`–`LI-08` — exclusions and future scope;
- `WEB-01`–`WEB-05` — public experience requirements; and
- `SEC-01`–`SEC-06` — security and privacy business requirements.

## 9. Controlled Terminology

### Roles

- `SUPER_ADMIN`
- `LAWYER`
- `LEGAL_ASSISTANT`
- `CONTENT_CREATOR`

Guest / Public Visitor is an external actor, not an internal role.

### Lead Statuses

- `NEW`
- `CONTACTED`
- `QUALIFIED`
- `CONVERTED`
- `LOST`

### Appointment Statuses

- `PENDING`
- `CONFIRMED`
- `COMPLETED`
- `CANCELED`

### Appointment Types

- `ONLINE`
- `OFFLINE`
- `PHONE_CALL`

New roles, statuses, or major business concepts must be approved in the BRD before downstream use.

## 10. Office Source Audit

All `.docx`, `.xlsx`, and `.xls` files in `Document/` were read on 2026-08-12, including their tables, workbook sheets, and embedded diagrams.

| Source | Audit result and use |
|---|---|
| `Report1_Project Introduction.docx` | Primary project-specific source for the BRD. Text and useful Project Introduction structure were migrated. A legacy cafeteria diagram and corrupted CTA text were not carried forward. |
| `Report2_Project Management Plan.docx` | Generic planning template. Useful headings were noted; sample team names, dates, estimates, and legacy technologies were excluded. |
| `Report3_Software Requirement Specification.docx` | Generic SRS template. Useful structural guidance was noted for future FRS/NFR/Use Case work; cafeteria, meal, menu, patron, product, order, asset, and placeholder examples were excluded. |
| `Report4_Software Design Document.docx` | Generic SDD template. Useful architecture/database/detailed-design headings were noted for future work; legacy packages, product classes, cafeteria ERD, and sample sequence diagrams were excluded. |
| `Report5_Test Documentation.docx` | Generic test-documentation template retained only as a future reference. No project-specific Phase 1 requirement was found. |
| `Report5_Test Report.xlsx` | Generic test-case/report workbook retained only as a future reference. Placeholder features and company-form examples were excluded. |
| `Report5_Unit Test.xls` | Generic unit-test workbook retained only as a future reference. Placeholder functions and sample results were excluded. |
| `Report6_Software User Guides.docx` | Generic release/user-guide template retained only as a future reference. No project-specific Phase 1 requirement was found. |
| `Report7_Final Project Report.docx` | Generic consolidated capstone template. Useful document-section relationships were noted; Psychology and all other unrelated examples and placeholders were excluded. |

## 11. Completion Criteria

A document is marked complete only when:

- required sections are complete for the confirmed scope;
- legacy/template content and unresolved placeholders are absent;
- terminology matches upstream documents;
- identifiers are unique and stable;
- cross-document references are valid;
- unknowns are recorded in the open-question register;
- scope and requirements are validated against the BRD; and
- consistency checks pass.

## 12. Working Rules

Before changing Phase 1 documentation:

1. read this tracker;
2. read the BRD;
3. read the assumptions and open-question register;
4. read all completed upstream documents relevant to the task;
5. continue from the first incomplete dependency; and
6. update this tracker only after validation.

Do not modify application source code, generate production code, alter Office references, introduce unapproved business behavior, or bypass the documented order while performing Phase 1 documentation work.

## 13. Last Updated

| Field | Value |
|---|---|
| Last Updated | 2026-08-12 |
| Updated By | Project Team |
| Current Milestone | Use Case Specification complete; begin User Stories |
| Current Focus | User Stories (`05-user-stories.md`) |
