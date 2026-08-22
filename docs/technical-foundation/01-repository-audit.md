# 01 — Repository Audit

Status: Complete
Audited: 2026-08-20

## Purpose

Full inventory of the repository state before any Phase 3 structural changes, so later tasks reuse what exists and do not silently overwrite in-progress work. No files were deleted or moved during this audit.

## Method

Inspected: root directory listing, `git status`, `git branch -a`, `git log --all`, presence of `.gitignore`/`.gitattributes`/root `README.md`, `.github/` workflows, toolchain versions (`node`, `npm`, `java`, `mvn`, `docker`, `docker compose`), and a filename-pattern secret scan (`*.env*`, `*.pem`, `*secret*`, `*.key`) excluding `.git/` and `Document/`.

## Findings

### Root structure

| Path | Classification | Notes |
|---|---|---|
| `docs/` | CURRENT | Phase 1 + Phase 2 documentation, 26 files, ~8,500 lines. Source of truth for Phase 3. |
| `Document/` | REUSABLE (legacy, non-blocking) | Pre-existing `.docx`/`.xlsx` academic report artifacts (Project Introduction, PM Plan, SRS, SDD, Test Docs, User Guides, Final Report). Not Markdown, not referenced by `docs/`. Left untouched — out of scope for Phase 3; not a conflict since it doesn't overlap the `docs/` tree or any code path. |
| `frontend/` | MISSING | Does not exist yet. To be created in Task 04. |
| `backend/` | MISSING | Does not exist yet. To be created in Task 05. |
| `infra/` | MISSING | To be created in Task 08 (Docker Compose, MinIO/MySQL config). |
| `scripts/` | MISSING | Not yet required; will add only if a concrete script is needed. |
| `.github/` | MISSING | No CI workflows exist. To be created in Task 11. |
| `.gitignore` | MISSING | Not present at root. Must be created before any frontend/backend scaffolding lands (Task 02/09) to avoid committing `node_modules`, build output, or `.env` files. |
| `.gitattributes` | MISSING | Not present. Not currently required (no line-ending or LFS concerns identified); revisit only if cross-platform line-ending issues appear. |
| root `README.md` | MISSING | No project-level README exists yet. `docs/README.md` currently serves as the documentation index only. PROPOSED to add a root `README.md` in Task 02 that orients new contributors and links to `docs/`. |
| `docker-compose.yml` | MISSING | To be created in Task 08. |

### Git state

- **CURRENT branch**: `feature/phase3`, tracking `origin/feature/phase3`, clean working tree (`nothing to commit`).
- **Branches**: local `feature/phase2`, `feature/phase3`, `main`; matching remotes on `origin`. No stray/abandoned local branches found.
- **History**: 8 commits on `main`/ancestry, linear except one merge commit (`e4e31fe`, PR #1 merging `feature/phase2` → presumably `main`). No force-push artifacts, no dangling WIP branches detected.
- **CONFLICTING items**: none found.
- **Secrets tracked**: none found. Filename-pattern scan for `*.env*`, `*.pem`, `*secret*`, `*.key` across the tracked tree (excluding `.git/`, `Document/`) returned zero matches.

### Toolchain (local machine, Windows + Git Bash)

| Tool | Detected | Classification |
|---|---|---|
| Node.js | v20.20.2 | CURRENT — Active LTS, suitable for Next.js 14/15. |
| npm | 10.8.2 | CURRENT — ships with the above Node. |
| Java (`java`) | not found | MISSING locally. No JDK installed and no `JAVA_HOME` set. |
| Maven (`mvn`) | not found | MISSING locally. |
| Docker | 29.0.1 | CURRENT — available and will be used to run backend builds (Maven via container) since a local JDK is absent, and to run MySQL/MinIO for local development. |
| Docker Compose | v2.40.3 (Compose V2, `docker compose`) | CURRENT. |

**Risk (documented, not yet resolved):** without a local JDK/Maven, backend compile/test/run in Task 05/12 must go through Docker (e.g. `maven:<version>-eclipse-temurin-<version>` image) or the Maven Wrapper (`mvnw`) inside a container, rather than a bare-metal `mvn` invocation. This is captured as `TF-OQ-002` in `assumptions-open-questions.md` and does not block proceeding — Docker-based builds are part of the planned Task 08 strategy regardless.

### Application code

- No frontend code exists (CURRENT: MISSING).
- No backend code exists (CURRENT: MISSING).
- No existing database migrations (MISSING).
- No existing Docker files (MISSING).
- No existing CI/CD configuration (MISSING).
- No existing environment files (`.env*`) tracked or untracked (MISSING/none found).
- No generated directories (`node_modules`, `target`, `dist`, `.next`, `build`) present — nothing to ignore retroactively yet.
- No tests of any kind exist (MISSING).

### Documentation

- Phase 1 (`docs/*.md`, `docs/10-openapi.yaml`) and Phase 2 (`docs/ui/*.md`) are both CURRENT and marked complete in their respective READMEs. They are the upstream source of truth for all Phase 3 decisions and are treated as authoritative and not redesigned.
- `docs/assumptions-open-questions.md` (Phase 1) and `docs/ui/assumptions-open-questions.md` (Phase 2) already exist and list business/UI-level open questions (e.g. RBAC matrix, JWT policy, SLA targets) that constrain but do not block Phase 3 technical scaffolding. Several are directly relevant to backend security config (see `docs/technical-foundation/assumptions-open-questions.md`, cross-referenced as `TF-OQ-*`).

## Risks identified before structural changes

1. **No `.gitignore` yet** — first scaffolding commit (Task 04/05) risks committing `node_modules/`, `.next/`, `target/`, or IDE files if `.gitignore` isn't in place first. Mitigation: create `.gitignore` as part of Task 02, before running any generator.
2. **No local JDK/Maven** — backend build/test/run must be validated through Docker. Mitigation: standardize on containerized Maven for local dev and CI parity from Task 05 onward.
3. **`Document/` legacy folder** — binary Office documents sit at repo root alongside `docs/`. They are not touched by Phase 3 and pose no technical conflict, but are noted so nobody assumes they need conversion/migration into `docs/`.

## Conclusion

The repository is effectively a clean slate for application code: only documentation exists. No deletions, renames, or destructive actions are required. Task 02 (Repository Structure) can proceed by creating `frontend/`, `backend/`, `infra/`, `.github/`, `.gitignore`, and root `README.md` without any conflicting prior art to reconcile.
