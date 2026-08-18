# Entity Relationship Diagram (ERD)

## Document Control

| Field               | Value                                                         |
| ------------------- | ------------------------------------------------------------- |
| Project             | Law Firm Website & Management System                          |
| Document            | Entity Relationship Diagram (ERD)                             |
| Document ID         | `ERD-08`                                                      |
| Version             | 1.0                                                           |
| Status              | Complete and validated baseline                               |
| Effective date      | 2026-08-12                                                    |
| Business authority  | [01-brd.md](01-brd.md)                                         |
| Functional baseline | [02-frs.md](02-frs.md)                                         |
| UML baseline        | [07-uml.md](07-uml.md)                                         |
| Decision register   | [assumptions-open-questions.md](assumptions-open-questions.md) |

## Record of Changes

| Date       | Change type | In charge | Description                                                       |
| ---------- | ----------- | --------- | ----------------------------------------------------------------- |
| 2026-08-12 | Added       | AI Agent  | Created logical data model based on validated system requirements. |

## 1. Introduction

This document details the logical Entity Relationship Diagram (ERD) for the Law Firm Management System. It targets a MySQL implementation normalized to 3NF.
Soft delete strategies and standard audit fields (`created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`) are modeled where operational history must be preserved.

## 2. Mermaid ERD

```mermaid
erDiagram
    roles {
        varchar id PK
        varchar name "UNIQUE"
        varchar description
    }

    users {
        char(36) id PK
        varchar email "UNIQUE"
        varchar password_hash
        varchar role_id FK
        boolean is_active
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    refresh_tokens {
        char(36) id PK
        char(36) user_id FK
        varchar token "UNIQUE"
        timestamp expires_at
        timestamp created_at
    }

    lawyer_profiles {
        char(36) id PK
        char(36) user_id FK "UNIQUE"
        varchar name
        text biography
        text experience
        varchar portrait_url
        boolean is_published
        timestamp created_at
        timestamp updated_at
    }

    leads {
        char(36) id PK
        varchar full_name
        varchar email
        varchar phone
        text issue_description
        varchar source
        varchar status
        char(36) assigned_to FK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    lead_notes {
        char(36) id PK
        char(36) lead_id FK
        char(36) author_id FK
        text content
        timestamp created_at
    }

    cases {
        char(36) id PK
        char(36) lead_id FK "UNIQUE"
        varchar title
        text description
        varchar status
        timestamp opened_at
        timestamp closed_at
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    case_lawyers {
        char(36) case_id PK, FK
        char(36) lawyer_id PK, FK
        timestamp assigned_at
    }

    case_activities {
        char(36) id PK
        char(36) case_id FK
        char(36) author_id FK
        text activity_details
        varchar activity_type
        timestamp created_at
    }

    appointments {
        char(36) id PK
        char(36) lead_id FK
        char(36) case_id FK
        varchar appointment_type
        varchar status
        timestamp scheduled_at
        varchar location_or_link
        char(36) created_by FK
        timestamp created_at
        timestamp updated_at
    }

    documents {
        char(36) id PK
        char(36) case_id FK
        char(36) lead_id FK
        char(36) uploaded_by FK
        varchar original_name
        varchar storage_key "UNIQUE"
        varchar mime_type
        bigint size_bytes
        timestamp uploaded_at
        timestamp deleted_at
    }

    services {
        char(36) id PK
        varchar title
        varchar slug "UNIQUE"
        text description
        boolean is_published
        timestamp created_at
        timestamp updated_at
    }

    blogs {
        char(36) id PK
        varchar title
        varchar slug "UNIQUE"
        text content
        char(36) author_id FK
        boolean is_published
        timestamp created_at
        timestamp updated_at
    }

    case_studies {
        char(36) id PK
        varchar title
        varchar slug "UNIQUE"
        text challenges
        text outcomes
        char(36) author_id FK
        boolean is_published
        timestamp created_at
        timestamp updated_at
    }

    seo_metadata {
        char(36) id PK
        varchar target_type
        char(36) target_id "Composite Index with target_type"
        varchar meta_title
        text meta_description
        timestamp created_at
        timestamp updated_at
    }

    notifications {
        char(36) id PK
        char(36) user_id FK
        varchar notification_type
        text message
        boolean is_read
        timestamp created_at
    }

    audit_logs {
        char(36) id PK
        char(36) user_id FK
        varchar action
        varchar entity_type
        varchar entity_id
        varchar ip_address
        timestamp created_at
    }

    %% Relationships
    roles ||--o{ users : "assigns"
    users ||--o{ refresh_tokens : "has"
    users ||--o| lawyer_profiles : "is"
    users ||--o{ leads : "manages"
    users ||--o{ lead_notes : "writes"
    leads ||--o{ lead_notes : "has"
    leads ||--o| cases : "converts to"
    cases ||--o{ case_lawyers : "assigned to"
    users ||--o{ case_lawyers : "acts as (lawyer_id)"
    cases ||--o{ case_activities : "logs"
    users ||--o{ case_activities : "performs"
    leads ||--o{ appointments : "schedules (pre-conversion)"
    cases ||--o{ appointments : "schedules (post-conversion)"
    users ||--o{ appointments : "creates"
    cases ||--o{ documents : "contains"
    leads ||--o{ documents : "contains"
    users ||--o{ documents : "uploads"
    users ||--o{ blogs : "authors"
    users ||--o{ case_studies : "authors"
    users ||--o{ notifications : "receives"
    users ||--o{ audit_logs : "triggers"
```

## 3. Key Constraints and Explanations

1. **UUID Keys**: All primary entity IDs (except `roles` which may use a natural short-string ID) utilize `CHAR(36)` to represent UUID v4, preventing ID enumeration attacks.
2. **Polymorphic / Generic Links**: `seo_metadata` uses `target_type` (e.g., 'BLOG', 'SERVICE') and `target_id` to link to various CMS entities without strict referential integrity at the database layer (a known limitation in SQL when pointing to multiple tables).
3. **Lead to Case Conversion**: The `cases` table has a `lead_id` which enforces a 1:1 relationship via a UNIQUE constraint.
4. **Documents & Appointments**: These can link to either a `lead_id` or a `case_id`, allowing continuity before and after conversion. One of the two FKs will be null.
5. **Soft Deletes**: `users`, `leads`, `cases`, and `documents` contain `deleted_at` to ensure historical compliance and data recovery.
6. **Audit Logs**: Immutable insert-only table.
