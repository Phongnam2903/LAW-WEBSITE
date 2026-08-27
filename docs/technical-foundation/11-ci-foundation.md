# 11 — CI Foundation

Status: Complete

## Workflow

`.github/workflows/ci.yml` — one workflow, two independent jobs (`frontend`, `backend`), running in parallel on GitHub-hosted `ubuntu-latest` runners.

## Triggers

- `pull_request` targeting `main` or `develop`.
- `push` to `main` or `develop` (post-merge verification, matching `03-git-strategy.md`'s branch model).
- `concurrency` group cancels a superseded run for the same ref, so pushing twice to the same PR doesn't queue redundant runs.

## Jobs

### `frontend`

```text
checkout → setup-node (20, npm cache) → npm ci → npm run lint → npm run typecheck → npm run build
```

- Node 20 matches the version this project was scaffolded and validated with (Task 01/04).
- `npm run build` receives `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080` as a build-time env var — a placeholder value (no backend is actually running in this job); it exists only so `frontend/src/config/env.ts`'s fail-fast check doesn't abort the build. It does not need to resolve to anything real, since Task 04 confirmed no page currently imports `env.ts` at build time — this is future-proofing for when one does.

### `backend`

```text
checkout → setup-java (Temurin 17, maven cache) → ./mvnw compile → ./mvnw test
```

- A `mysql:8.4` **service container** runs alongside the job (GitHub Actions' native service-container feature, not a manual `docker run`), with a health check (`mysqladmin ping`) so the job waits for MySQL to be ready before `./mvnw test` runs — mirrors the exact health check used in `docker-compose.yml` (Task 08).
- `./mvnw test` runs with `SPRING_PROFILES_ACTIVE=test`, `DB_HOST=127.0.0.1`, `DB_PORT=3306` (the service container's mapped port — no `application-test.yml` change needed, this is passed as a job-level env var override of that file's default `3307`).
- No MinIO service container is included: the `test` profile's `storage.*` properties already have working defaults (`application-test.yml`, Task 07/09), and constructing the `S3Client`/`S3Presigner` beans doesn't require a live connection — only an actual upload/presign/delete call would, and no such test exists yet (Task 07's validation test was temporary and removed). Add a MinIO service container to this job the same way `mysql` is added, if/when a real storage integration test is added in a later phase.

## Caching

- `actions/setup-node`'s built-in `cache: npm` (keyed on `frontend/package-lock.json`).
- `actions/setup-java`'s built-in `cache: maven` (keyed on `backend/pom.xml`, caches `~/.m2`).

## Failure Conditions

Either job fails the workflow (and therefore blocks merge, once branch protection is configured per `03-git-strategy.md`) if:

- Frontend: `npm ci` fails (lockfile/registry issue), ESLint reports any error, `tsc --noEmit` reports any type error, or `next build` fails.
- Backend: compilation fails, any test fails, or the MySQL service container never becomes healthy (job times out waiting).

## What This CI Does NOT Do (by design, Phase 3 scope)

- No deployment step of any kind — matches the Strict Scope Boundary ("must not deploy production during Phase 3").
- No Docker image build/push in CI yet — `backend/Dockerfile`/`frontend/Dockerfile` (Task 08) exist for local `--profile full` use; wiring them into CI is a natural follow-up once there's somewhere to push/deploy them to (no hosting target chosen — `TF-OQ-010`).
- No E2E/Cypress/Playwright step — no business screens exist yet to test end-to-end.

## Validation

- **YAML syntax**: parsed successfully with Python's `yaml.safe_load` (`YAML valid`, no exceptions) — a real parse, not just eyeballing indentation.
- **Command-level validation**: every command the workflow runs was already independently executed and confirmed working in this session outside of GitHub Actions itself:
  - `npm ci`, `npm run lint`, `npm run typecheck`, `npm run build` — all run natively in Task 04/10 with the same Node major version this workflow pins (20).
  - `./mvnw compile`, `./mvnw test` against a live `mysql:8.4` container with the same credentials/health check shape — run repeatedly in Tasks 05–08 via Docker.
- **Not validated**: an actual GitHub Actions run. No `act` (local GitHub Actions runner) or `actionlint` binary is installed in this environment, and this repository has not been pushed with the workflow file yet, so the workflow has not executed on GitHub's own infrastructure. This is the one foundation piece whose first real execution will be the first PR opened after this phase — recommended as an explicit early check once the branch is pushed.
