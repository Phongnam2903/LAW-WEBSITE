# Database Dictionary

## Document Control

| Field               | Value                                                         |
| ------------------- | ------------------------------------------------------------- |
| Project             | Law Firm Website & Management System                          |
| Document            | Database Dictionary                                           |
| Document ID         | `DB-09`                                                       |
| Version             | 1.0                                                           |
| Status              | Complete and validated baseline                               |
| Effective date      | 2026-08-12                                                    |
| Business authority  | [01-brd.md](01-brd.md)                                         |
| Functional baseline | [02-frs.md](02-frs.md)                                         |
| ERD baseline        | [08-erd.md](08-erd.md)                                         |
| Decision register   | [assumptions-open-questions.md](assumptions-open-questions.md) |

## Record of Changes

| Date       | Change type | In charge | Description                                           |
| ---------- | ----------- | --------- | ----------------------------------------------------- |
| 2026-08-12 | Added       | AI Agent  | Created database dictionary from validated ERD.       |

## 1. Introduction

This document details the schema definitions for the MySQL database serving the Law Firm Management System. All tables and columns map directly to `08-erd.md`.

**Global Conventions:**
- UUID v4 (`CHAR(36)`) is used for primary keys and foreign keys unless noted.
- Timestamps use `TIMESTAMP` in UTC.
- Boolean fields use `TINYINT(1)` (MySQL standard).

---

## 2. Table Specifications

### 2.1 Table: `roles`

**Purpose**: Defines system access roles (e.g., SUPER_ADMIN, LAWYER).
**Relationships**: 1:N with `users`.

| Column Name | Data Type | Length | Nullable | Default | PK/FK | Unique | Indexed | Description | Example |
|---|---|---|---|---|---|---|---|---|---|
| `id` | `VARCHAR` | 50 | No | - | PK | Yes | Yes | String identifier for role | `SUPER_ADMIN` |
| `name` | `VARCHAR` | 100 | No | - | - | Yes | No | Human-readable role name | `Super Administrator` |
| `description` | `VARCHAR` | 255 | Yes | NULL | - | No | No | Role responsibilities | `Full system access` |

### 2.2 Table: `users`

**Purpose**: Stores authentication and profile data for internal staff.
**Relationships**: N:1 with `roles`. 1:N with `leads`, `cases`, `appointments`, `documents`, `audit_logs`.

| Column Name | Data Type | Length | Nullable | Default | PK/FK | Unique | Indexed | Description | Example |
|---|---|---|---|---|---|---|---|---|---|
| `id` | `CHAR` | 36 | No | UUID() | PK | Yes | Yes | Unique identifier | `123e4567-e89b...` |
| `email` | `VARCHAR` | 255 | No | - | - | Yes | Yes | User email / login | `admin@lawfirm.com` |
| `password_hash` | `VARCHAR` | 255 | No | - | - | No | No | Bcrypt hashed password | `$2a$12$...` |
| `role_id` | `VARCHAR` | 50 | No | - | FK | No | Yes | Role reference | `SUPER_ADMIN` |
| `is_active` | `TINYINT(1)` | - | No | 1 | - | No | No | Active status toggle | `1` |
| `created_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Creation time | `2026-08-12 10:00:00` |
| `updated_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Last update time | `2026-08-12 10:00:00` |
| `deleted_at` | `TIMESTAMP` | - | Yes | NULL | - | No | Yes | Soft delete timestamp | `NULL` |

### 2.3 Table: `refresh_tokens`

**Purpose**: Manages long-lived JWT refresh sessions for users.

| Column Name | Data Type | Length | Nullable | Default | PK/FK | Unique | Indexed | Description | Example |
|---|---|---|---|---|---|---|---|---|---|
| `id` | `CHAR` | 36 | No | UUID() | PK | Yes | Yes | Unique identifier | `234e4567...` |
| `user_id` | `CHAR` | 36 | No | - | FK | No | Yes | User reference | `123e4567...` |
| `token` | `VARCHAR` | 512 | No | - | - | Yes | Yes | Secure refresh token | `eyJhbG...` |
| `expires_at` | `TIMESTAMP` | - | No | - | - | No | Yes | Expiration time | `2026-08-19 10:00:00` |
| `created_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Issue time | `2026-08-12 10:00:00` |

### 2.4 Table: `lawyer_profiles`

**Purpose**: Stores public-facing biography and expertise for lawyers.
**Relationships**: 1:1 with `users`.

| Column Name | Data Type | Length | Nullable | Default | PK/FK | Unique | Indexed | Description | Example |
|---|---|---|---|---|---|---|---|---|---|
| `id` | `CHAR` | 36 | No | UUID() | PK | Yes | Yes | Unique identifier | `345e4567...` |
| `user_id` | `CHAR` | 36 | No | - | FK | Yes | Yes | User reference | `123e4567...` |
| `name` | `VARCHAR` | 255 | No | - | - | No | No | Display name | `Jane Doe, Esq.` |
| `biography` | `TEXT` | - | Yes | NULL | - | No | No | HTML or Markdown bio | `<p>Jane is a...</p>` |
| `experience` | `TEXT` | - | Yes | NULL | - | No | No | Experience details | `15 years in...` |
| `portrait_url` | `VARCHAR` | 512 | Yes | NULL | - | No | No | Link to S3 portrait | `https://s3.../jane.jpg` |
| `is_published` | `TINYINT(1)` | - | No | 0 | - | No | Yes | Visibility flag | `1` |
| `created_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Creation time | `2026-08-12 10:00:00` |
| `updated_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Last update time | `2026-08-12 10:00:00` |

### 2.5 Table: `leads`

**Purpose**: Tracks potential clients from initial contact to conversion or loss.

| Column Name | Data Type | Length | Nullable | Default | PK/FK | Unique | Indexed | Description | Example |
|---|---|---|---|---|---|---|---|---|---|
| `id` | `CHAR` | 36 | No | UUID() | PK | Yes | Yes | Unique identifier | `456e4567...` |
| `full_name` | `VARCHAR` | 255 | No | - | - | No | No | Prospect name | `John Smith` |
| `email` | `VARCHAR` | 255 | Yes | NULL | - | No | Yes | Prospect email | `john@example.com` |
| `phone` | `VARCHAR` | 50 | Yes | NULL | - | No | Yes | Prospect phone | `+84 901...` |
| `issue_description`| `TEXT` | - | Yes | NULL | - | No | No | Legal issue context | `Seeking advice on...` |
| `source` | `VARCHAR` | 50 | No | - | - | No | Yes | Origin of lead | `WEBSITE` |
| `status` | `VARCHAR` | 50 | No | 'NEW' | - | No | Yes | Current lead status | `CONTACTED` |
| `assigned_to` | `CHAR` | 36 | Yes | NULL | FK | No | Yes | Assigned staff user | `123e4567...` |
| `created_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Creation time | `2026-08-12 10:00:00` |
| `updated_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Last update time | `2026-08-12 10:00:00` |
| `deleted_at` | `TIMESTAMP` | - | Yes | NULL | - | No | Yes | Soft delete timestamp | `NULL` |

### 2.6 Table: `lead_notes`

**Purpose**: Tracks internal follow-up logs and communications on a Lead.

| Column Name | Data Type | Length | Nullable | Default | PK/FK | Unique | Indexed | Description | Example |
|---|---|---|---|---|---|---|---|---|---|
| `id` | `CHAR` | 36 | No | UUID() | PK | Yes | Yes | Unique identifier | `567e4567...` |
| `lead_id` | `CHAR` | 36 | No | - | FK | No | Yes | Parent lead | `456e4567...` |
| `author_id` | `CHAR` | 36 | No | - | FK | No | Yes | Note creator | `123e4567...` |
| `content` | `TEXT` | - | No | - | - | No | No | Note content | `Called client, busy.` |
| `created_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Creation time | `2026-08-12 10:00:00` |

### 2.7 Table: `cases`

**Purpose**: Formal record of an engaged legal matter.

| Column Name | Data Type | Length | Nullable | Default | PK/FK | Unique | Indexed | Description | Example |
|---|---|---|---|---|---|---|---|---|---|
| `id` | `CHAR` | 36 | No | UUID() | PK | Yes | Yes | Unique identifier | `678e4567...` |
| `lead_id` | `CHAR` | 36 | No | - | FK | Yes | Yes | Originating lead | `456e4567...` |
| `title` | `VARCHAR` | 255 | No | - | - | No | No | Internal case name | `Smith vs. Corp` |
| `description` | `TEXT` | - | Yes | NULL | - | No | No | Case details | `Breach of contract` |
| `status` | `VARCHAR` | 50 | No | 'OPEN'| - | No | Yes | Current case state | `OPEN` |
| `opened_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Official start time | `2026-08-12 10:00:00` |
| `closed_at` | `TIMESTAMP` | - | Yes | NULL | - | No | No | Official close time | `NULL` |
| `created_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | System creation time | `2026-08-12 10:00:00` |
| `updated_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Last update time | `2026-08-12 10:00:00` |
| `deleted_at` | `TIMESTAMP` | - | Yes | NULL | - | No | Yes | Soft delete timestamp | `NULL` |

### 2.8 Table: `case_lawyers`

**Purpose**: Junction table managing N:M assignments of lawyers to cases.

| Column Name | Data Type | Length | Nullable | Default | PK/FK | Unique | Indexed | Description | Example |
|---|---|---|---|---|---|---|---|---|---|
| `case_id` | `CHAR` | 36 | No | - | PK,FK | No | Yes | Case reference | `678e4567...` |
| `lawyer_id` | `CHAR` | 36 | No | - | PK,FK | No | Yes | User reference | `123e4567...` |
| `assigned_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Time of assignment | `2026-08-12 10:00:00` |

### 2.9 Table: `case_activities`

**Purpose**: Logs formal updates and milestones on a Case.

| Column Name | Data Type | Length | Nullable | Default | PK/FK | Unique | Indexed | Description | Example |
|---|---|---|---|---|---|---|---|---|---|
| `id` | `CHAR` | 36 | No | UUID() | PK | Yes | Yes | Unique identifier | `789e4567...` |
| `case_id` | `CHAR` | 36 | No | - | FK | No | Yes | Parent case | `678e4567...` |
| `author_id` | `CHAR` | 36 | No | - | FK | No | Yes | Update creator | `123e4567...` |
| `activity_details`| `TEXT` | - | No | - | - | No | No | Activity description | `Filed motion to...` |
| `activity_type` | `VARCHAR` | 50 | No | - | - | No | Yes | Category of action | `COURT_FILING` |
| `created_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Log time | `2026-08-12 10:00:00` |

### 2.10 Table: `appointments`

**Purpose**: Schedules meetings for Leads or Cases.

| Column Name | Data Type | Length | Nullable | Default | PK/FK | Unique | Indexed | Description | Example |
|---|---|---|---|---|---|---|---|---|---|
| `id` | `CHAR` | 36 | No | UUID() | PK | Yes | Yes | Unique identifier | `890e4567...` |
| `lead_id` | `CHAR` | 36 | Yes | NULL | FK | No | Yes | Associated lead | `456e4567...` |
| `case_id` | `CHAR` | 36 | Yes | NULL | FK | No | Yes | Associated case | `NULL` |
| `appointment_type`| `VARCHAR` | 50 | No | - | - | No | No | Type of meeting | `ONLINE` |
| `status` | `VARCHAR` | 50 | No | 'PENDING'| - | No | Yes | Meeting status | `CONFIRMED` |
| `scheduled_at` | `TIMESTAMP` | - | No | - | - | No | Yes | Time of meeting | `2026-08-15 14:00:00` |
| `location_or_link`| `VARCHAR` | 512 | Yes | NULL | - | No | No | Zoom link / Address | `https://zoom.us/...` |
| `created_by` | `CHAR` | 36 | No | - | FK | No | Yes | Scheduler user ID | `123e4567...` |
| `created_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Creation time | `2026-08-12 10:00:00` |
| `updated_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Last update time | `2026-08-12 10:00:00` |

### 2.11 Table: `documents`

**Purpose**: Manages metadata for securely stored files in S3/MinIO.

| Column Name | Data Type | Length | Nullable | Default | PK/FK | Unique | Indexed | Description | Example |
|---|---|---|---|---|---|---|---|---|---|
| `id` | `CHAR` | 36 | No | UUID() | PK | Yes | Yes | Unique identifier | `901e4567...` |
| `case_id` | `CHAR` | 36 | Yes | NULL | FK | No | Yes | Associated case | `678e4567...` |
| `lead_id` | `CHAR` | 36 | Yes | NULL | FK | No | Yes | Associated lead | `NULL` |
| `uploaded_by` | `CHAR` | 36 | No | - | FK | No | Yes | Uploader user ID | `123e4567...` |
| `original_name` | `VARCHAR` | 255 | No | - | - | No | No | User-provided filename| `contract_v1.pdf` |
| `storage_key` | `VARCHAR` | 255 | No | - | - | Yes | Yes | S3 Object Key | `cases/678/abc.pdf` |
| `mime_type` | `VARCHAR` | 100 | No | - | - | No | No | File MIME type | `application/pdf` |
| `size_bytes` | `BIGINT` | - | No | 0 | - | No | No | File size in bytes | `1048576` |
| `uploaded_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Upload time | `2026-08-12 10:00:00` |
| `deleted_at` | `TIMESTAMP` | - | Yes | NULL | - | No | Yes | Soft delete timestamp | `NULL` |

### 2.12 Table: `services`

**Purpose**: Stores CMS content for public legal services.

| Column Name | Data Type | Length | Nullable | Default | PK/FK | Unique | Indexed | Description | Example |
|---|---|---|---|---|---|---|---|---|---|
| `id` | `CHAR` | 36 | No | UUID() | PK | Yes | Yes | Unique identifier | `012e4567...` |
| `title` | `VARCHAR` | 255 | No | - | - | No | No | Service name | `Corporate Litigation`|
| `slug` | `VARCHAR` | 255 | No | - | - | Yes | Yes | URL slug | `corporate-litigation`|
| `description` | `TEXT` | - | No | - | - | No | No | HTML content | `<p>Our firm...</p>` |
| `is_published` | `TINYINT(1)` | - | No | 0 | - | No | Yes | Visibility flag | `1` |
| `created_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Creation time | `2026-08-12 10:00:00` |
| `updated_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Last update time | `2026-08-12 10:00:00` |

### 2.13 Table: `blogs`

**Purpose**: Stores CMS content for public blog articles.

| Column Name | Data Type | Length | Nullable | Default | PK/FK | Unique | Indexed | Description | Example |
|---|---|---|---|---|---|---|---|---|---|
| `id` | `CHAR` | 36 | No | UUID() | PK | Yes | Yes | Unique identifier | `123a4567...` |
| `title` | `VARCHAR` | 255 | No | - | - | No | No | Article title | `New Tax Laws 2026` |
| `slug` | `VARCHAR` | 255 | No | - | - | Yes | Yes | URL slug | `new-tax-laws-2026` |
| `content` | `TEXT` | - | No | - | - | No | No | HTML content | `<p>The new...</p>` |
| `author_id` | `CHAR` | 36 | No | - | FK | No | Yes | User reference | `123e4567...` |
| `is_published` | `TINYINT(1)` | - | No | 0 | - | No | Yes | Visibility flag | `1` |
| `created_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Creation time | `2026-08-12 10:00:00` |
| `updated_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Last update time | `2026-08-12 10:00:00` |

### 2.14 Table: `case_studies`

**Purpose**: Stores CMS content for public firm successes.

| Column Name | Data Type | Length | Nullable | Default | PK/FK | Unique | Indexed | Description | Example |
|---|---|---|---|---|---|---|---|---|---|
| `id` | `CHAR` | 36 | No | UUID() | PK | Yes | Yes | Unique identifier | `234a4567...` |
| `title` | `VARCHAR` | 255 | No | - | - | No | No | Study title | `Tech Corp Merger` |
| `slug` | `VARCHAR` | 255 | No | - | - | Yes | Yes | URL slug | `tech-corp-merger` |
| `challenges` | `TEXT` | - | No | - | - | No | No | Pre-case issues | `<p>The client...</p>`|
| `outcomes` | `TEXT` | - | No | - | - | No | No | Results | `<p>Successfully...</p>`|
| `author_id` | `CHAR` | 36 | No | - | FK | No | Yes | User reference | `123e4567...` |
| `is_published` | `TINYINT(1)` | - | No | 0 | - | No | Yes | Visibility flag | `1` |
| `created_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Creation time | `2026-08-12 10:00:00` |
| `updated_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Last update time | `2026-08-12 10:00:00` |

### 2.15 Table: `seo_metadata`

**Purpose**: Links SEO tags to various CMS objects generically.

| Column Name | Data Type | Length | Nullable | Default | PK/FK | Unique | Indexed | Description | Example |
|---|---|---|---|---|---|---|---|---|---|
| `id` | `CHAR` | 36 | No | UUID() | PK | Yes | Yes | Unique identifier | `345a4567...` |
| `target_type` | `VARCHAR` | 50 | No | - | - | No | Yes* | Entity type (e.g. BLOG) | `BLOG` |
| `target_id` | `CHAR` | 36 | No | - | - | No | Yes* | Entity ID | `123a4567...` |
| `meta_title` | `VARCHAR` | 255 | Yes | NULL | - | No | No | SEO Title tag | `New Tax Laws | Firm` |
| `meta_description`| `TEXT` | - | Yes | NULL | - | No | No | SEO Description tag | `Learn how the...` |
| `created_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Creation time | `2026-08-12 10:00:00` |
| `updated_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Last update time | `2026-08-12 10:00:00` |

*\* Note: `target_type` and `target_id` should have a composite index.*

### 2.16 Table: `notifications`

**Purpose**: Stores system alerts generated for internal users.

| Column Name | Data Type | Length | Nullable | Default | PK/FK | Unique | Indexed | Description | Example |
|---|---|---|---|---|---|---|---|---|---|
| `id` | `CHAR` | 36 | No | UUID() | PK | Yes | Yes | Unique identifier | `456a4567...` |
| `user_id` | `CHAR` | 36 | No | - | FK | No | Yes | Recipient user | `123e4567...` |
| `notification_type`|`VARCHAR` | 50 | No | - | - | No | Yes | Category (e.g. NEW_LEAD)| `NEW_LEAD` |
| `message` | `TEXT` | - | No | - | - | No | No | Alert content | `New lead from...` |
| `is_read` | `TINYINT(1)` | - | No | 0 | - | No | Yes | Read toggle | `0` |
| `created_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Event time | `2026-08-12 10:00:00` |

### 2.17 Table: `audit_logs`

**Purpose**: Immutable ledger of sensitive system activity.

| Column Name | Data Type | Length | Nullable | Default | PK/FK | Unique | Indexed | Description | Example |
|---|---|---|---|---|---|---|---|---|---|
| `id` | `CHAR` | 36 | No | UUID() | PK | Yes | Yes | Unique identifier | `567a4567...` |
| `user_id` | `CHAR` | 36 | No | - | FK | No | Yes | Actor user | `123e4567...` |
| `action` | `VARCHAR` | 50 | No | - | - | No | Yes | Action type (e.g. DELETE)| `DELETE` |
| `entity_type` | `VARCHAR` | 50 | No | - | - | No | Yes | Target entity type | `DOCUMENT` |
| `entity_id` | `VARCHAR` | 255 | No | - | - | No | Yes | Target entity ID | `901e4567...` |
| `ip_address` | `VARCHAR` | 45 | Yes | NULL | - | No | No | Actor's IP (IPv4/v6) | `192.168.1.1` |
| `created_at` | `TIMESTAMP` | - | No | CURRENT | - | No | No | Action time | `2026-08-12 10:00:00` |
