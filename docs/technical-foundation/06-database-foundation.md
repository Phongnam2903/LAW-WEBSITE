# 06 — Database Foundation

Status: Complete

## Database

MySQL 8.4 (LTS release track). PROPOSED default (`TF-OQ-011`) — no specific MySQL version was mandated upstream, and 8.4 is Oracle's current Long Term Support release, giving the longest support window for a new project. Local development uses the `mysql:8.4` Docker image (Task 08); production version is whatever the eventual hosting target provides, expected to match or exceed 8.4.

## Migration Framework: Flyway (not Liquibase)

**Decision: Flyway.** Both were made available in the backend dependency set during Task 05 scaffolding (`spring-boot-starter-flyway` + `flyway-mysql` were kept; Liquibase was available from Spring Initializr but not added). Reasoning:

- The schema (17 tables, entirely defined already in `docs/08-erd.md`/`docs/09-database-dictionary.md`) is stable and hand-designed up front, not evolved incrementally by a code-first ORM-driven workflow — Flyway's plain-SQL, versioned-file model is a direct, readable translation of that dictionary with no XML/YAML abstraction layer in between.
- The team context (small fullstack project, per `03-git-strategy.md`) benefits from migrations that are literally the SQL a developer would write by hand — lower cognitive overhead than Liquibase's changelog format, with no loss of capability for this project's needs (no multi-database-vendor portability requirement exists — MySQL is the only approved target).
- Both tools are equally well-supported by Spring Boot 4's autoconfiguration; the choice is not a capability gap either way, this project just doesn't need Liquibase's extra abstraction.

Only one migration tool is configured — `flyway-mysql` and `spring-boot-starter-flyway` are on the classpath; no Liquibase dependency or configuration exists anywhere in the project.

## Migration Directory & Naming Convention

```text
backend/src/main/resources/db/migration/
└── V1__init_schema.sql
```

- Standard Flyway default location and naming: `V<version>__<description>.sql`, versions are plain integers (`V1`, `V2`, ...), words in the description are separated by underscores and rendered with spaces in Flyway's history table.
- `spring.flyway.locations: classpath:db/migration` is set explicitly in `application.yml`-family files (Task 05) even though it matches the Spring Boot default, so the location is self-documenting rather than implicit.
- One migration per meaningful schema change going forward; no `Vx__` file is ever edited after being committed and applied — a mistake gets a new forward migration, never a rewrite (standard Flyway immutability rule, prevents checksum-mismatch failures for anyone who already applied the old version).

## ERD → DDL Mapping

`V1__init_schema.sql` creates all 17 tables from `docs/08-erd.md` / `docs/09-database-dictionary.md`, in FK-dependency order (referenced tables before referencing tables): `roles` → `users` → `refresh_tokens`, `lawyer_profiles`, `leads` → `lead_notes`, `cases` → `case_lawyers`, `case_activities`, `appointments`, `documents` → `services`, `blogs`, `case_studies`, `seo_metadata` → `notifications`, `audit_logs`. No table, column, or relationship was added beyond what the dictionary specifies.

### Documented deviations from the dictionary's literal notation

These are SQL-implementation-level decisions, not schema/business changes — every table, column, type, nullability, and relationship the dictionary specifies is present exactly as specified:

1. **UUID primary keys have no DB-level `DEFAULT`.** The dictionary lists `DEFAULT: UUID()` for `CHAR(36)` primary keys, but MySQL does not permit `UUID()` (a non-deterministic function) as a column `DEFAULT` expression — confirmed empirically against a live MySQL 8.4 container, not assumed. UUID generation is therefore the application's responsibility (e.g. `UUID.randomUUID()` in Java, or JPA's `GenerationType.UUID` once entities exist in a later phase), which is the same effective strategy the dictionary describes, just executed at the layer that actually can execute it.
2. **`TINYINT(1)` columns are declared as `BOOLEAN`.** MySQL 8.4 emits a deprecation warning ("Integer display width is deprecated") for an explicit `TINYINT(1)` display-width literal in DDL. `BOOLEAN` is MySQL's own synonym for the same column type — verified via `information_schema.columns` that a `BOOLEAN` column reports back as `tinyint(1)`, i.e. byte-for-byte identical storage — so this avoids the warning with zero semantic change.
3. **`updated_at` columns add `ON UPDATE CURRENT_TIMESTAMP`.** The dictionary specifies `DEFAULT: CURRENT` for these columns but doesn't say whether they auto-refresh on update; `ON UPDATE CURRENT_TIMESTAMP` was added so "last update time" is actually maintained by the database rather than relying on every future write path remembering to set it manually — a reasonable engineering default consistent with the column's documented purpose, not a new column or behavior beyond what "Last update time" already implies.
4. **Foreign keys have no explicit `ON DELETE`/`ON UPDATE` clause**, which makes them `RESTRICT` (MySQL's default) — i.e. you cannot delete a parent row while dependent child rows exist. The dictionary does not specify cascade behavior anywhere, and most tables use soft deletes (`deleted_at`) rather than hard deletes, so defaulting to the safest option (reject the delete rather than silently cascading) was chosen over inventing a cascade policy. Tracked as `TF-OQ-012` if a future phase needs different behavior for a specific relationship.
5. **`seo_metadata` has no foreign key** on `target_type`/`target_id`, matching ERD note #2 explicitly: this is a documented polymorphic association with no DB-level referential integrity by design (a known SQL limitation when one column can point at multiple tables). A composite index `idx_seo_metadata_target (target_type, target_id)` exists instead, per the ERD's own recommendation.
6. **`case` package/table naming**: the table is `cases` (matches the dictionary exactly — the dictionary already uses the plural `cases`, so no deviation exists at the SQL level; the naming note in `05-backend-foundation.md` is about the Java package only, where `case` is a reserved keyword).
7. **No reference/seed data is inserted** (e.g. no `INSERT INTO roles ...` for `SUPER_ADMIN`/`LAWYER`/etc.). Seeding real role rows is deferred to the User Management feature in a later phase — inserting business reference data here would start crossing into business feature implementation, which Phase 3 explicitly excludes.

### Indexing

Every column the dictionary marks "Indexed: Yes" has an index: automatically via `PRIMARY KEY`/`UNIQUE`/`FOREIGN KEY` constraints where those already imply one (InnoDB auto-indexes FK columns), or via an explicit named `INDEX` where it doesn't (e.g. `leads.status`, `leads.source`, `notifications.is_read`, `audit_logs.action`). Naming convention: `fk_<table>_<column>` for foreign key constraints, `uq_<table>_<column>` for unique constraints, `idx_<table>_<column(s)>` for plain indexes.

### Character set

`utf8mb4` with `utf8mb4_0900_ai_ci` collation (MySQL 8's modern accent-insensitive default) on every table — full Unicode support (including emoji, needed for free-text fields like `issue_description`, `content`, `message`), not the legacy 3-byte `utf8`.

## Validation

Performed against a real, disposable MySQL 8.4 Docker container (not skipped due to the lack of local Java — Docker was used the same way Task 05 used it for Maven):

1. Started `mysql:8.4` in a container, waited for readiness (`mysqladmin ping`).
2. Ran `flyway/flyway:11 migrate` against it with `db/migration` mounted read-only. Result: **`Successfully applied 1 migration to schema `lawfirm`, now at version v1`**, zero warnings after the `BOOLEAN` fix (an initial run with `TINYINT(1)` surfaced 6 deprecation warnings, which is exactly why deviation #2 above exists).
3. Verified via `information_schema`: **18 tables** (17 business tables + Flyway's own `flyway_schema_history`), **21 foreign keys** — matches the manually-counted expected FK total from the ERD relationships exactly (users→roles: 1; refresh_tokens/lawyer_profiles/leads→users: 1 each; lead_notes→leads,users: 2; cases→leads: 1; case_lawyers→cases,users: 2; case_activities→cases,users: 2; appointments→leads,cases,users: 3; documents→cases,leads,users: 3; blogs/case_studies/notifications/audit_logs→users: 1 each).
4. Re-ran `flyway migrate` a second time against the same schema: **`Schema `lawfirm` is up to date. No migration necessary`** — confirms idempotency.
5. Ran the full backend test suite (`./mvnw test`, from Task 05) against this live database: **`BUILD SUCCESS`, Tests run: 1, Failures: 0, Errors: 0.** The Spring context fully initialized — HikariCP connected, Flyway validated the already-applied migration and made no changes, Hibernate/JPA initialized against the real schema, the WebSocket broker started. This closes out the "expected failure" noted in Task 05 (which occurred only because no MySQL was running yet at that point in the sequence).
6. Test container and network were removed after validation; no data or infrastructure from this task persists — Task 08 defines the actual long-lived local Docker Compose MySQL service.
