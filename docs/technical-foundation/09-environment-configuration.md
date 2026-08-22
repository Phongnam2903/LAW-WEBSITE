# 09 — Environment Configuration

Status: Complete

## Conventions

- One `.env` file per app (`frontend/.env.local`) plus one at the repo root for Docker Compose (`.env`) — each gitignored, each with a matching, committed `.env.example`.
- Every variable name is reused verbatim across the files that need it (e.g. `DB_PASSWORD` is the same name in root `.env.example`, `docker-compose.yml`, and `backend/src/main/resources/application-local.yml`) — one mental model for the whole stack, not per-file renaming.
- Every local default is a throwaway, well-known value (`lawfirm`/`lawfirm`, `minioadmin`/`minioadmin`, `root`) — safe to commit as a fallback because it only ever points at disposable local infrastructure (Task 08). Production (`application-prod.yml`) has no defaults for any of these — see below.

## Spring Profiles

Established in Task 05, referenced here for completeness:

| Profile | File | Used by |
|---|---|---|
| `local` (default, `spring.profiles.active: local` in `application.yml`) | `application-local.yml` | `./mvnw spring-boot:run` against Task 08's Docker Compose infra |
| `test` | `application-test.yml` | `./mvnw test` — separate schema/bucket (`lawfirm_test` / `lawfirm-documents-test`) so tests never touch dev data |
| `prod` | `application-prod.yml` | A future real deployment — activate via `SPRING_PROFILES_ACTIVE=prod`. No hosting target is chosen yet (`TF-OQ-010`), so this profile is unused until then, but exists so `application-prod.yml`'s "no defaults" property already governs how a real deployment must be configured. |

## Variable Catalog

### Database (MySQL)

| Variable | Local default | Test default | Prod default | Consumed by |
|---|---|---|---|---|
| `DB_HOST` | `localhost` | `localhost` | *(required, no default)* | backend |
| `DB_PORT` | `3307` | `3307` | *(required)* | backend |
| `DB_NAME` | `lawfirm` | `lawfirm_test` | *(required)* | backend, `docker-compose.yml` |
| `DB_USERNAME` | `lawfirm` | `lawfirm` | *(required)* | backend, `docker-compose.yml` |
| `DB_PASSWORD` | `lawfirm` | `lawfirm` | *(required)* | backend, `docker-compose.yml` |
| `MYSQL_ROOT_PASSWORD` | `root` | — | — | `docker-compose.yml` `mysql` service only (root superuser, not used by the app itself) |

### Object Storage (MinIO / S3)

| Variable | Local default | Prod default | Consumed by |
|---|---|---|---|
| `STORAGE_ENDPOINT` | `http://localhost:9000` | *(unset → real AWS S3 endpoint resolution)* | backend |
| `STORAGE_REGION` | `us-east-1` | `us-east-1` | backend |
| `STORAGE_BUCKET` | `lawfirm-documents` | *(required)* | backend, `docker-compose.yml` |
| `STORAGE_ACCESS_KEY` | `minioadmin` | *(unset → IAM role via `DefaultCredentialsProvider`)* | backend, `docker-compose.yml` (maps to `MINIO_ROOT_USER`) |
| `STORAGE_SECRET_KEY` | `minioadmin` | *(unset → IAM role)* | backend, `docker-compose.yml` (maps to `MINIO_ROOT_PASSWORD`) |
| `STORAGE_PATH_STYLE_ACCESS` | `true` | `false` | backend |

### Authentication (JWT) — placeholders only

No JWT filter, token issuance, or `@ConfigurationProperties` class exists yet — Task 05/07 deliberately stopped short of implementing the Auth business feature. These names are reserved so a future phase doesn't have to invent a naming convention, but **none of them are read by any code today**:

| Variable (reserved) | Purpose (future) |
|---|---|
| `JWT_SECRET` | Signing key for access/refresh tokens |
| `JWT_ACCESS_TOKEN_EXPIRY` | Access token lifetime — exact value is `OQ-23` (Phase 1 open question), not decided |
| `JWT_REFRESH_TOKEN_EXPIRY` | Refresh token lifetime — same open question |

### Frontend

| Variable | Local default | Consumed by |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8080` | `frontend/src/config/env.ts` (validated at import time — throws if missing, see `04-frontend-foundation.md`), `docker-compose.yml` `frontend` build arg |

### Application/runtime

| Variable | Default | Consumed by |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | `local` (via `application.yml`) | backend — set to `local` explicitly in `docker-compose.yml`'s `backend` service |

## Files

```text
.env.example                 # root — Docker Compose stack (committed)
.env                         # root — gitignored, optional (all vars have compose-level defaults)
frontend/.env.example        # committed
frontend/.env.local          # gitignored
backend/                     # no .env file — Spring reads real environment variables
                              # directly (application-<profile>.yml + env vars), not dotenv files
```

Spring Boot does not read `.env` files natively (that's a Node/dotenv convention) — backend configuration is environment variables plus the profile YAML files already covered in Task 05. No `backend/.env.example` was created for that reason; the variable catalog above **is** the backend's environment documentation, satisfying the master prompt's "backend environment documentation" requirement without a file Spring would never read.

## Secrets Policy

- No real secret has ever been committed — verified by pattern-scanning all tracked-candidate source (`*.java`, `*.yml`, `*.ts`/`*.tsx`, `*.md`) for AWS access key patterns, PEM private key headers, and hardcoded `password = "..."` literals: zero matches outside the local-only throwaway defaults already covered above.
- `git ls-files | grep -i '\.env'` returns nothing — no `.env`/`.env.local` file has ever been tracked.
- `application-prod.yml` (Task 05) has zero default values for `DB_*`, `STORAGE_BUCKET`, `STORAGE_ACCESS_KEY`, or `STORAGE_SECRET_KEY` — a production deployment cannot silently inherit a dev credential; it fails to start if any required variable is missing.

## Validation

- `git check-ignore -v .env` / `frontend/.env.local` → both correctly ignored.
- `git check-ignore -v .env.example` / `frontend/.env.example` → **first check on `frontend/.env.example` incorrectly showed it as ignored**, caught by actually running `git check-ignore` rather than assuming the root `.gitignore`'s `!**/.env.example` exception would apply everywhere. Root cause: `frontend/.gitignore` (generated by `create-next-app`) has its own `.env*` rule with no matching negation, and a nested `.gitignore`'s rules take precedence over the parent's for paths under it. Fixed by adding `!.env.example` to `frontend/.gitignore` directly. Re-verified: `frontend/.env.example` is no longer ignored, `frontend/.env.local` still is.
- `git status --short` after all Task 04–09 file creation shows only the expected new paths — no `node_modules/`, `.next/`, `target/`, or credential file was accidentally picked up for tracking.
