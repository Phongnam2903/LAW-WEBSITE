# 08 — Docker Development Environment

Status: Complete

## Strategy: Infra-in-Docker, Apps-Native (Hybrid)

Per the master prompt's explicit allowance ("If running frontend/backend inside Docker significantly harms developer iteration, document and use a hybrid local-development approach instead"):

- **Default `docker compose up`** starts only infrastructure: `mysql`, `minio`, `minio-init`.
- **Frontend and backend run natively** on the host (`npm run dev`, `./mvnw spring-boot:run`) against that infrastructure. Reasoning: Next.js hot reload and Spring Boot's fast restart/debugger attachment both lose most of their value inside a container on Windows (bind-mount filesystem-event and I/O overhead), while MySQL/MinIO are exactly the kind of stateful, rarely-changed service Docker is good at making reproducible.
- **`docker compose --profile full up --build`** additionally builds and runs `backend` and `frontend` as containers, for anyone who wants a fully containerized environment (e.g. to reproduce something closer to a deployed environment, or on a machine without local Java/Node). This is opt-in via Compose's `profiles` mechanism, not the default path.

## Services

| Service | Image | Profile | Purpose |
|---|---|---|---|
| `mysql` | `mysql:8.4` | default | Primary database |
| `minio` | `minio/minio:latest` | default | S3-compatible object storage |
| `minio-init` | `minio/mc:latest` | default | One-shot: creates `lawfirm-documents` and `lawfirm-documents-test` buckets, then exits |
| `backend` | built from `backend/Dockerfile` | `full` | Containerized Spring Boot app (opt-in) |
| `frontend` | built from `frontend/Dockerfile` | `full` | Containerized Next.js app (opt-in) |

## Ports

| Service | Container port | Host port | Notes |
|---|---|---|---|
| mysql | 3306 | **3307** | Host-side deliberately not 3306 — see below |
| minio | 9000 (S3 API) | 9000 | |
| minio | 9001 (console) | 9001 | Web UI at `http://localhost:9001` |
| backend (`full` profile) | 8080 | 8080 | API, under `/api/v1` |
| backend (`full` profile) | 8081 | 8081 | Actuator (`health`, `info` only) |
| frontend (`full` profile) | 3000 | 3000 | |

**Why MySQL is on host port 3307, not 3306:** discovered during validation, not decided in the abstract — attempting to publish container port 3306 to host 3306 failed with `bind: Only one usage of each socket address is normally permitted`, because this development machine already runs a local MySQL service on 3306 (a pre-existing, unrelated installation — not something Phase 3 touches or removes). Since 3306 is the single most common pre-occupied port on a dev machine that does any PHP/Node/Java work, the host mapping was moved to 3307 by default for every developer, not just fixed locally — see `backend/src/main/resources/application-local.yml`'s `DB_PORT` default. Containers on the Compose network (the `full` profile's `backend` service) are unaffected: they address MySQL as `mysql:3306` over the internal Docker network regardless of the host port mapping.

## Volumes

- `mysql-data` (named volume) → `/var/lib/mysql` — persists across `docker compose down`/`up`, removed only by `docker compose down -v`.
- `minio-data` (named volume) → `/data` — same persistence behavior.
- No bind-mounts for stateful data (avoids Windows bind-mount I/O overhead for a database).

## Networks

A single default Compose network (`law_web_default`); no custom network segmentation was needed at this scale. `minio-init` depends on `minio` reaching its healthcheck before running (`depends_on: condition: service_healthy`), so bucket creation never races container startup.

## Health Checks

- `mysql`: `mysqladmin ping`, every 5s, 10 retries.
- `minio`: `curl -f http://localhost:9000/minio/health/live`, every 5s, 10 retries.
- `backend` (`full` profile): no explicit Compose healthcheck yet — the app exposes `/actuator/health` on port 8081 for external orchestration to probe; a Compose-level healthcheck can be added once a concrete need (e.g. `depends_on: condition: service_healthy` from another containerized service) exists. Not added speculatively.

## Startup Order / Dependencies

`minio-init` → waits for `minio` healthy. `backend` (`full` profile) → waits for both `mysql` and `minio` healthy (`depends_on` with `condition: service_healthy`) before starting, so Flyway/Hikari/the storage client never race a not-yet-ready dependency. `frontend` (`full` profile) → waits for `backend` (container start, not health — the frontend doesn't call the API at build/boot time in Phase 3 since no business screens exist).

## Reset Procedure

- `docker compose down` — stops and removes containers, keeps volumes (data survives).
- `docker compose down -v` — also removes `mysql-data`/`minio-data` volumes, i.e. a full reset back to an empty database and empty bucket. After this, migrations re-apply and buckets re-create automatically on the next `docker compose up` (Flyway runs on backend startup; `minio-init` runs every time the stack comes up).

## Persistent Data Behavior

Data in `mysql-data`/`minio-data` is local-only, never seeded with anything beyond what Flyway's `V1__init_schema.sql` creates (empty tables) and the two empty buckets `minio-init` creates. No business/seed data is written by anything in this task, consistent with the Strict Scope Boundary.

## Security / Exposure

- Only the ports developers actually need are published (`3307`, `9000`, `9001`, and — only under `full` — `8080`/`8081`/`3000`). No service is exposed beyond what's needed for local development; this is not a production deployment topology (no TLS termination, no reverse proxy — out of scope, no hosting target chosen yet, see `TF-OQ-010`).
- MySQL root password (`root`) and MinIO root credentials (`minioadmin`/`minioadmin`) are hardcoded in `docker-compose.yml` — acceptable for local-only, throwaway development infrastructure (matches the values already documented as local defaults in `application-local.yml`/`application-test.yml`), never used in `application-prod.yml` (Task 05), which has no credential defaults at all.

## Validation

Performed with this development machine's Docker Desktop engine (Task 01 established Docker CLI/Compose V2 are available; the daemon needed to be started manually for this session):

1. `docker compose config --quiet` — compose file parses without error.
2. `docker compose up -d mysql minio minio-init` (default profile) — all three came up; `mysql` and `minio` both reached `healthy`; `minio-init` logs confirmed: `Bucket created successfully local/lawfirm-documents` and `local/lawfirm-documents-test`.
3. Ran `flyway migrate` against the Compose-managed MySQL over the Compose network (`mysql:3306`) — applied cleanly, matching Task 06's standalone validation.
4. **Validated the hybrid workflow end-to-end**: ran the backend the way a developer would (`./mvnw spring-boot:run`, simulated via a container standing in for "native" since this particular machine has no local JDK — see Task 01) against the Compose infra via the host-published ports (`localhost:3307`, `localhost:9000`). Result: full Spring Boot startup succeeded — Hikari connected, Flyway validated the already-applied migration, JPA/Hibernate initialized, the storage beans initialized, the WebSocket broker started.
5. This end-to-end run **caught two real bugs**, both fixed and re-verified live (see `05-backend-foundation.md`'s `common/security` and `common/exception` sections for the code):
   - `GET /actuator/health` on the management port returned **403**, not 200 — the `SecurityFilterChain` was, in practice, governing the management port too, and had no rule permitting it. This would have made the container's own health check (and any future orchestrator health probe) look like a crashed app. Fixed by explicitly permitting `/actuator/health` and `/actuator/info`; re-verified: `GET /actuator/health` → `200 {"groups":["liveness","readiness"],"status":"UP"}`.
   - `GET /api/v1/lawyers` (a public route per the security rules, but with no controller behind it yet, since no business code exists) returned **500** instead of 404 — Spring MVC's `NoResourceFoundException` (its "nothing matched this request" signal) was falling into the generic `Exception` handler. Fixed by adding a dedicated handler mapping it to 404; re-verified: `GET /api/v1/lawyers` → `404 {"error":"not_found","message":"No route matches this request","status":404}`.
   - Also added: the generic 500 handler now logs the exception server-side (`log.error(...)`) — it previously discarded it entirely, which is exactly how bug #2 stayed invisible until logging was added mid-investigation.
6. `GET /api/v1/leads` (a protected route, no auth wired) → **403** (not 401) — confirmed as Spring Security's documented default (`Http403ForbiddenEntryPoint`) when no `httpBasic()`/`formLogin()` is configured to provide a 401 challenge. This is expected for a foundation with no login endpoint yet, not a defect; not "fixed" because doing so would mean adding an `AuthenticationEntryPoint`, which starts encroaching on the Auth business feature.
7. `docker build` for `backend/Dockerfile` (the `full` profile image) — **succeeded**, produced a working image (`BUILD SUCCESS` inside the build stage, image exported).
8. `docker build` for `frontend/Dockerfile` (the `full` profile image) — **could not be completed in this environment.** Partway through (`npm ci` had already finished successfully inside the image), Docker Desktop's own storage backend failed with `write .../metadata_v2.db: read-only file system` / `input/output error` — a corruption of this sandboxed machine's Docker Desktop virtual disk, unrelated to the Dockerfile or Compose configuration. This is a known class of Docker Desktop-on-Windows issue (VM disk corruption after heavy image churn), not a defect in this project. The Next.js production build itself (`npm run build`) was already independently validated natively in Task 04 (`BUILD SUCCESS`), so the only unverified piece is the container packaging step specifically — recommended next step for whoever runs this for real: `docker compose --profile full up --build` on a healthy Docker Desktop instance (a restart/disk reset of Docker Desktop was attempted here but did not complete validation within this session).
9. All test containers/networks from this task and prior tasks (Task 06/07's throwaway MySQL/MinIO/network) were removed after validation; the only artifacts kept are the committed `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`, and `infra/minio/create-buckets.sh`.

### Post-completion fix (found by the user running `docker compose --profile full up --build`)

10. **Third real bug**, found the same way as #5 above — by actually running the stack, this time by the user rather than in-session: `./mvnw spring-boot:run` inside the `backend` container failed to connect to MySQL with `CachingSha2PasswordPlugin` / "public key retrieval" errors from `mysql-connector-j`. Root cause: `application-local.yml`'s and `application-test.yml`'s JDBC URLs had `useSSL=false` but no `allowPublicKeyRetrieval=true` — MySQL 8's default `caching_sha2_password` auth plugin refuses to send its RSA public key over a connection the driver hasn't explicitly allowed it to, when that connection isn't already TLS-protected. (This is exactly the flag Task 06's manual `flyway migrate` validation already had to add — it just never got carried into the actual Spring `spring.datasource.url` values, a gap this session's own validation didn't catch because Docker Desktop's storage fault cut that validation short before a full compose-network run happened.) Fixed by adding `&allowPublicKeyRetrieval=true` to both URLs; re-verified live: `GET :8081/actuator/health` → `200 {"status":"UP",...}`. `application-prod.yml` is unaffected (`useSSL=true` there, so the key exchange happens safely over TLS regardless).
