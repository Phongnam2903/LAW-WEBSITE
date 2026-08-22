-- Baseline schema, generated directly from docs/08-erd.md and docs/09-database-dictionary.md.
-- No table, column, or relationship exists here that isn't in the approved ERD/dictionary.
-- See docs/technical-foundation/06-database-foundation.md for the ERD-to-DDL mapping and the
-- documented deviations (UUID generation, index naming, FK ON DELETE policy).

-- ---------------------------------------------------------------------------
-- roles
-- ---------------------------------------------------------------------------
CREATE TABLE roles (
    id          VARCHAR(50)  NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    PRIMARY KEY (id),
    CONSTRAINT uq_roles_name UNIQUE (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
CREATE TABLE users (
    id            CHAR(36)     NOT NULL,
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id       VARCHAR(50)  NOT NULL,
    is_active     BOOLEAN      NOT NULL DEFAULT 1,
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at    TIMESTAMP    NULL,
    PRIMARY KEY (id),
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id),
    INDEX idx_users_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- refresh_tokens
-- ---------------------------------------------------------------------------
CREATE TABLE refresh_tokens (
    id         CHAR(36)     NOT NULL,
    user_id    CHAR(36)     NOT NULL,
    token      VARCHAR(512) NOT NULL,
    expires_at TIMESTAMP    NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_refresh_tokens_token UNIQUE (token),
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users (id),
    INDEX idx_refresh_tokens_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- lawyer_profiles
-- ---------------------------------------------------------------------------
CREATE TABLE lawyer_profiles (
    id            CHAR(36)     NOT NULL,
    user_id       CHAR(36)     NOT NULL,
    name          VARCHAR(255) NOT NULL,
    biography     TEXT         NULL,
    experience    TEXT         NULL,
    portrait_url  VARCHAR(512) NULL,
    is_published  BOOLEAN      NOT NULL DEFAULT 0,
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_lawyer_profiles_user UNIQUE (user_id),
    CONSTRAINT fk_lawyer_profiles_user FOREIGN KEY (user_id) REFERENCES users (id),
    INDEX idx_lawyer_profiles_is_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------------
CREATE TABLE leads (
    id                CHAR(36)     NOT NULL,
    full_name         VARCHAR(255) NOT NULL,
    email             VARCHAR(255) NULL,
    phone             VARCHAR(50)  NULL,
    issue_description TEXT         NULL,
    source            VARCHAR(50)  NOT NULL,
    status            VARCHAR(50)  NOT NULL DEFAULT 'NEW',
    assigned_to       CHAR(36)     NULL,
    created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at        TIMESTAMP    NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_leads_assigned_to FOREIGN KEY (assigned_to) REFERENCES users (id),
    INDEX idx_leads_email (email),
    INDEX idx_leads_phone (phone),
    INDEX idx_leads_source (source),
    INDEX idx_leads_status (status),
    INDEX idx_leads_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- lead_notes
-- ---------------------------------------------------------------------------
CREATE TABLE lead_notes (
    id         CHAR(36)  NOT NULL,
    lead_id    CHAR(36)  NOT NULL,
    author_id  CHAR(36)  NOT NULL,
    content    TEXT      NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_lead_notes_lead FOREIGN KEY (lead_id) REFERENCES leads (id),
    CONSTRAINT fk_lead_notes_author FOREIGN KEY (author_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- cases  (mapped to Java package `cases` — `case` is a reserved keyword)
-- ---------------------------------------------------------------------------
CREATE TABLE cases (
    id          CHAR(36)     NOT NULL,
    lead_id     CHAR(36)     NOT NULL,
    title       VARCHAR(255) NOT NULL,
    description TEXT         NULL,
    status      VARCHAR(50)  NOT NULL DEFAULT 'OPEN',
    opened_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at   TIMESTAMP    NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP    NULL,
    PRIMARY KEY (id),
    CONSTRAINT uq_cases_lead UNIQUE (lead_id),
    CONSTRAINT fk_cases_lead FOREIGN KEY (lead_id) REFERENCES leads (id),
    INDEX idx_cases_status (status),
    INDEX idx_cases_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- case_lawyers  (N:M junction)
-- ---------------------------------------------------------------------------
CREATE TABLE case_lawyers (
    case_id     CHAR(36)  NOT NULL,
    lawyer_id   CHAR(36)  NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (case_id, lawyer_id),
    CONSTRAINT fk_case_lawyers_case FOREIGN KEY (case_id) REFERENCES cases (id),
    CONSTRAINT fk_case_lawyers_lawyer FOREIGN KEY (lawyer_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- case_activities
-- ---------------------------------------------------------------------------
CREATE TABLE case_activities (
    id                CHAR(36)    NOT NULL,
    case_id           CHAR(36)    NOT NULL,
    author_id         CHAR(36)    NOT NULL,
    activity_details  TEXT        NOT NULL,
    activity_type     VARCHAR(50) NOT NULL,
    created_at        TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_case_activities_case FOREIGN KEY (case_id) REFERENCES cases (id),
    CONSTRAINT fk_case_activities_author FOREIGN KEY (author_id) REFERENCES users (id),
    INDEX idx_case_activities_activity_type (activity_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- appointments
-- ---------------------------------------------------------------------------
CREATE TABLE appointments (
    id                CHAR(36)     NOT NULL,
    lead_id           CHAR(36)     NULL,
    case_id           CHAR(36)     NULL,
    appointment_type  VARCHAR(50)  NOT NULL,
    status            VARCHAR(50)  NOT NULL DEFAULT 'PENDING',
    scheduled_at      TIMESTAMP    NOT NULL,
    location_or_link  VARCHAR(512) NULL,
    created_by        CHAR(36)     NOT NULL,
    created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_appointments_lead FOREIGN KEY (lead_id) REFERENCES leads (id),
    CONSTRAINT fk_appointments_case FOREIGN KEY (case_id) REFERENCES cases (id),
    CONSTRAINT fk_appointments_created_by FOREIGN KEY (created_by) REFERENCES users (id),
    INDEX idx_appointments_status (status),
    INDEX idx_appointments_scheduled_at (scheduled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- documents
-- ---------------------------------------------------------------------------
CREATE TABLE documents (
    id             CHAR(36)     NOT NULL,
    case_id        CHAR(36)     NULL,
    lead_id        CHAR(36)     NULL,
    uploaded_by    CHAR(36)     NOT NULL,
    original_name  VARCHAR(255) NOT NULL,
    storage_key    VARCHAR(255) NOT NULL,
    mime_type      VARCHAR(100) NOT NULL,
    size_bytes     BIGINT       NOT NULL DEFAULT 0,
    uploaded_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at     TIMESTAMP    NULL,
    PRIMARY KEY (id),
    CONSTRAINT uq_documents_storage_key UNIQUE (storage_key),
    CONSTRAINT fk_documents_case FOREIGN KEY (case_id) REFERENCES cases (id),
    CONSTRAINT fk_documents_lead FOREIGN KEY (lead_id) REFERENCES leads (id),
    CONSTRAINT fk_documents_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES users (id),
    INDEX idx_documents_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------
CREATE TABLE services (
    id           CHAR(36)     NOT NULL,
    title        VARCHAR(255) NOT NULL,
    slug         VARCHAR(255) NOT NULL,
    description  TEXT         NOT NULL,
    is_published BOOLEAN      NOT NULL DEFAULT 0,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_services_slug UNIQUE (slug),
    INDEX idx_services_is_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- blogs
-- ---------------------------------------------------------------------------
CREATE TABLE blogs (
    id           CHAR(36)     NOT NULL,
    title        VARCHAR(255) NOT NULL,
    slug         VARCHAR(255) NOT NULL,
    content      TEXT         NOT NULL,
    author_id    CHAR(36)     NOT NULL,
    is_published BOOLEAN      NOT NULL DEFAULT 0,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_blogs_slug UNIQUE (slug),
    CONSTRAINT fk_blogs_author FOREIGN KEY (author_id) REFERENCES users (id),
    INDEX idx_blogs_is_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- case_studies
-- ---------------------------------------------------------------------------
CREATE TABLE case_studies (
    id           CHAR(36)     NOT NULL,
    title        VARCHAR(255) NOT NULL,
    slug         VARCHAR(255) NOT NULL,
    challenges   TEXT         NOT NULL,
    outcomes     TEXT         NOT NULL,
    author_id    CHAR(36)     NOT NULL,
    is_published BOOLEAN      NOT NULL DEFAULT 0,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uq_case_studies_slug UNIQUE (slug),
    CONSTRAINT fk_case_studies_author FOREIGN KEY (author_id) REFERENCES users (id),
    INDEX idx_case_studies_is_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- seo_metadata  (polymorphic association — no DB-level FK, see ERD note #2)
-- ---------------------------------------------------------------------------
CREATE TABLE seo_metadata (
    id                CHAR(36)     NOT NULL,
    target_type       VARCHAR(50)  NOT NULL,
    target_id         CHAR(36)     NOT NULL,
    meta_title        VARCHAR(255) NULL,
    meta_description  TEXT         NULL,
    created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_seo_metadata_target (target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
CREATE TABLE notifications (
    id                  CHAR(36)    NOT NULL,
    user_id             CHAR(36)    NOT NULL,
    notification_type   VARCHAR(50) NOT NULL,
    message             TEXT        NOT NULL,
    is_read             BOOLEAN     NOT NULL DEFAULT 0,
    created_at          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users (id),
    INDEX idx_notifications_type (notification_type),
    INDEX idx_notifications_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- audit_logs  (insert-only, immutable — see ERD note #6)
-- ---------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id           CHAR(36)     NOT NULL,
    user_id      CHAR(36)     NOT NULL,
    action       VARCHAR(50)  NOT NULL,
    entity_type  VARCHAR(50)  NOT NULL,
    entity_id    VARCHAR(255) NOT NULL,
    ip_address   VARCHAR(45)  NULL,
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) REFERENCES users (id),
    INDEX idx_audit_logs_action (action),
    INDEX idx_audit_logs_entity_type (entity_type),
    INDEX idx_audit_logs_entity_id (entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
