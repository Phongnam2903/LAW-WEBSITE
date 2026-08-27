# 02 — Repository Structure

Status: Complete

## Target Structure

```text
project-root/
├── frontend/         # Next.js + TypeScript + Tailwind application (Task 04)
├── backend/          # Spring Boot application, Maven project (Task 05)
├── docs/             # All project documentation (Phase 1, 2, 3) — existing, unchanged
├── infra/            # Local infra config: Docker Compose fragments, DB init, MinIO bucket bootstrap (Task 08)
├── .github/
│   └── workflows/    # CI workflows (Task 11)
├── .gitignore
├── README.md         # Root project README — orientation + links into docs/
└── docker-compose.yml
```

`scripts/` from the reference layout in the master prompt is intentionally **not created now** (MISSING, PROPOSED-deferred) — no concrete automation script exists yet that doesn't already belong under `frontend/` (npm scripts) or `backend/` (Maven plugins/`mvnw`). It will be added the first time a genuine cross-cutting script (e.g. a combined reset-dev-environment script) is needed, rather than pre-created empty.

## Rationale / Reuse

Per the Task 01 audit, nothing pre-existing conflicts with this layout: `docs/` is reused as-is (no move), and every other top-level entry is newly created. No files are relocated.

## Directory Responsibilities & Ownership Boundaries

| Directory | Owner boundary | Contains | Must NOT contain |
|---|---|---|---|
| `frontend/` | Frontend team/agent | Next.js app router pages, components, hooks, frontend config, frontend tests | Backend source, Docker infra definitions (may have its own `Dockerfile`) |
| `backend/` | Backend team/agent | Spring Boot source, `pom.xml`, migrations (`src/main/resources/db/migration`), backend tests | Frontend source, business logic belonging to a future phase beyond foundation |
| `docs/` | Documentation | All Markdown specs, OpenAPI, ERD, UI specs, `technical-foundation/` tracker | Executable application code |
| `infra/` | DevOps/foundation | Compose service fragments, MySQL init SQL (if any), MinIO bucket-bootstrap script, reverse-proxy config if added later | Application source code |
| `.github/workflows/` | CI | GitHub Actions YAML only | Deployment credentials, long-lived secrets (use GitHub Secrets, never inline) |
| root `.gitignore` | Repo-wide | Ignore rules for both `frontend/` and `backend/` build output plus root-level artifacts | — |
| root `README.md` | Repo-wide | Project overview, quick start, links to `docs/README.md` and `docs/technical-foundation/README.md` | Duplicated detailed content that already lives in `docs/` |
| root `docker-compose.yml` | DevOps/foundation | Service orchestration referencing `frontend/`, `backend/`, `infra/` | — |

## Generated / Ignored Directories (anticipated)

These do not exist yet but are pre-declared in `.gitignore` now so the first scaffold commit is already clean:

- `frontend/node_modules/`, `frontend/.next/`, `frontend/out/`, `frontend/.env*.local`
- `backend/target/`, `backend/.mvn/wrapper/maven-wrapper.jar` (kept — wrapper jar is intentionally committed per Maven convention; excluded here only as a note, not an ignore rule)
- `**/.env`, `**/.env.local` (root, frontend, backend — see Task 09 for the `.env.example` convention)
- IDE folders: `.idea/`, `.vscode/*` (except shared `extensions.json`/`settings.json` if later curated), `*.iml`
- OS files: `.DS_Store`, `Thumbs.db`
- MinIO/MySQL local volumes if bind-mounted under `infra/` rather than named Docker volumes

## Configuration & Documentation Locations

- Frontend runtime config: `frontend/.env.local` (gitignored), example at `frontend/.env.example` (Task 09).
- Backend runtime config: `backend/src/main/resources/application.yml` + profile overlays `application-local.yml` / `application-test.yml` / `application-prod.yml` (Task 05/09); secrets via environment variables, never hardcoded.
- Infra config: `infra/` + root `docker-compose.yml` (Task 08).
- All Phase 3 documentation: `docs/technical-foundation/*.md` (this tree).
- Phase 1/2 documentation: `docs/*.md`, `docs/ui/*.md` — read-only source of truth, not modified by Phase 3.

## Actions Taken

- Created `frontend/`, `backend/`, `infra/` (empty, populated in Tasks 04/05/08).
- Created root `.gitignore` covering Node, Next.js, Java/Maven, IDE, and OS artifacts, plus `.env*` patterns.
- Created root `README.md` with a short project overview and links to `docs/README.md` and `docs/technical-foundation/README.md`.
- `.github/workflows/` and `docker-compose.yml` intentionally deferred to Tasks 11 and 08 respectively, so they are created with real, validated content instead of empty placeholders.

## Validation

- `git status` after creation shows only the intended new paths, nothing unexpected picked up (directories are otherwise empty except where a placeholder was required for Git to track them — Git does not track empty directories, so `frontend/`, `backend/`, `infra/` remain untracked-empty until Task 04/05/08 add real files; this is expected and not an error).
