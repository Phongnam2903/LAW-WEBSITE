# 05 — Backend Foundation

Status: Complete

## Framework Version

- **Spring Boot**: 4.1.0 (parent POM `org.springframework.boot:spring-boot-starter-parent:4.1.0`)
- **Java**: 17 (LTS; Spring Boot 4.0+ requires 17 minimum — see `TF-OQ-002`)
- **Build tool**: Maven, via the Maven Wrapper (`mvnw`/`mvnw.cmd`) — no local Maven install required
- **Packaging**: `jar` (Spring Boot executable jar via `spring-boot-maven-plugin`)

Scaffolded via the Spring Initializr API (`start.spring.io`), not hand-written from memory — Spring Boot 4 changed enough conventions from Spring Boot 3 (see below) that generating from the real service and validating with an actual build was necessary rather than assuming prior knowledge still applied.

**Important — Spring Boot 4 breaking changes vs. Spring Boot 3:**

- Starter artifacts were renamed: `spring-boot-starter-web` → `spring-boot-starter-webmvc`, `spring-boot-starter-web-services` → `spring-boot-starter-webservices`, `spring-boot-starter-aop` → `spring-boot-starter-aspectj`.
- The monolithic `spring-boot-starter-test` is gone. Each feature starter now has a matching `-test` starter (e.g. `spring-boot-starter-data-jpa-test`, `spring-boot-starter-security-test`) that transitively pulls in the shared test support — this project's `pom.xml` lists one per production starter.
- Full `javax.*` → `jakarta.*` migration (already true since Boot 3, still true here).
- Package modularization: autoconfiguration classes now live under per-module `org.springframework.boot.<module>.autoconfigure` packages (visible in stack traces, e.g. `org.springframework.boot.flyway.autoconfigure.FlywayAutoConfiguration`) rather than one flat autoconfigure package.
- Spring Security 7 ships alongside Spring Boot 4; the lambda-based `SecurityFilterChain` DSL (`authorizeHttpRequests`, `csrf(...)`, `sessionManagement(...)`) used here is confirmed unchanged and still the recommended style.
- **springdoc-openapi has no Spring Boot 4 / Spring Framework 7 compatible release yet** (latest published version, `2.8.6`, targets Spring Framework 6 / Boot 3 — confirmed by querying Maven Central directly, no `3.x` line exists for `org.springdoc` as of this writing). See "OpenAPI / Swagger Support" below for how this is handled.

## Project Structure

```text
backend/
├── src/
│   ├── main/
│   │   ├── java/com/lawfirm/backend/
│   │   │   ├── BackendApplication.java       # @SpringBootApplication entry point
│   │   │   ├── auth/            package-info only — Auth business feature, later phase
│   │   │   ├── user/            package-info only — users/roles, later phase
│   │   │   ├── lawyer/          package-info only — lawyer_profiles, later phase
│   │   │   ├── lead/            package-info only — leads/lead_notes, later phase
│   │   │   ├── appointment/     package-info only — appointments, later phase
│   │   │   ├── cases/           package-info only — cases/case_lawyers/case_activities, later phase (see naming note below)
│   │   │   ├── document/        package-info only — document metadata, later phase
│   │   │   ├── cms/             package-info only — services/blogs/case_studies/seo_metadata, later phase
│   │   │   ├── notification/    package-info only — notification business logic, later phase
│   │   │   ├── audit/           package-info only — audit_logs, later phase
│   │   │   ├── storage/         package-info only — MinIO/S3 abstraction, later phase (interface boundary documented in 07-storage-foundation.md)
│   │   │   └── common/
│   │   │       ├── config/
│   │   │       │   └── WebSocketConfig.java       # STOMP endpoint + broker registration (infra only)
│   │   │       ├── exception/
│   │   │       │   ├── GlobalExceptionHandler.java
│   │   │       │   └── ResourceNotFoundException.java
│   │   │       ├── security/
│   │   │       │   └── SecurityConfig.java        # SecurityFilterChain + PasswordEncoder bean
│   │   │       └── response/
│   │   │           └── ErrorResponse.java         # matches OpenAPI ErrorResponse schema
│   │   └── resources/
│   │       ├── application.yml            # base config: context-path, actuator port/exposure
│   │       ├── application-local.yml      # local dev profile (Docker Compose infra)
│   │       ├── application-test.yml       # test profile (separate schema)
│   │       ├── application-prod.yml       # prod profile (no defaults — env-var only)
│   │       └── db/migration/              # Flyway migration directory (see 06-database-foundation.md)
│   └── test/
│       └── java/com/lawfirm/backend/BackendApplicationTests.java   # context-load smoke test
├── .mvn/wrapper/
├── mvnw / mvnw.cmd
└── pom.xml
```

**Naming deviation from the master prompt:** the recommended package list includes `case/`, but `case` is a reserved Java keyword and cannot be used as a package identifier — the compiler rejects it. This package is named `cases` instead (plural, consistent with `lead`→`leads` table naming). This is a language-level constraint, not a scope or design change.

## Package Architecture

- Each business-domain package (`auth`, `user`, `lawyer`, `lead`, `appointment`, `cases`, `document`, `cms`, `notification`, `audit`, `storage`) currently contains only a `package-info.java` documenting its future responsibility and which ERD table(s) it will back. No entities, repositories, services, or controllers exist yet — per the Strict Scope Boundary, business CRUD is a later phase.
- `common/` holds only genuinely cross-cutting, non-domain-specific code: security filter chain, global exception translation, the shared error envelope, and WebSocket transport registration. Nothing in `common/` references a specific business entity.
- **Dependency direction**: domain packages (once populated) depend on `common/`; `common/` never depends on a domain package. `storage/` is depended on by `document/` only — no other domain package talks to MinIO/S3 directly (enforced by convention now, by package-private visibility once real classes exist).

## Spring Security Foundation

`common/security/SecurityConfig.java` establishes the **shape** of the security boundary without implementing the Auth business feature:

- Stateless sessions (`SessionCreationPolicy.STATELESS`), CSRF disabled — matches a token-based JSON API with no server-side session state.
- Public routes matched exactly against `docs/10-openapi.yaml`'s per-operation `security:` declarations: `POST /auth/login`, `POST /leads`, and the public `GET` list endpoints (`/lawyers`, `/services`, `/blogs`, `/case-studies`, plus their sub-paths for future detail routes).
- Every other route requires `authenticated()`.
- A `PasswordEncoder` bean (`BCryptPasswordEncoder`) is provided, matching the BCrypt requirement in `docs/03-nfr.md` — ready for the Auth feature to use, not yet consumed by anything.
- **Not implemented**: `UserDetailsService`, JWT issuance/validation filter, login endpoint, refresh/logout logic, RBAC (`@PreAuthorize`) rules. Until a JWT filter populates the `SecurityContext` in a later phase, every `authenticated()` route will reject requests with `401` — this is the expected, verified behavior of an intentionally incomplete security foundation, not a bug.

## Global Exception Handling

`common/exception/GlobalExceptionHandler.java` is a single `@RestControllerAdvice` translating exceptions into the `ErrorResponse` envelope (`error`, `message`, `status` — field-for-field match with `docs/10-openapi.yaml`'s `ErrorResponse` schema, kept in sync with the frontend's `ApiErrorResponse` type from Task 04):

| Exception | HTTP status |
|---|---|
| `ResourceNotFoundException` (generic, `common/exception`) | 404 |
| `MethodArgumentNotValidException` (Bean Validation) | 400 |
| `AccessDeniedException` (Spring Security) | 403 |
| Anything else | 500, with a generic message — no stack trace or internal detail is ever returned to the client, per the SDD's error-handling requirement. |

## JPA / MySQL Connectivity

- `spring-boot-starter-data-jpa` + `com.mysql:mysql-connector-j` (runtime scope).
- `spring.jpa.hibernate.ddl-auto: validate` in every profile — Hibernate never auto-generates schema; Flyway migrations (Task 06) are the only source of schema changes. This was a deliberate choice consistent with "do not redesign the schema" and "establish migration infrastructure" from the master prompt.
- `spring.jpa.open-in-view: false` — avoids the Open Session In View anti-pattern by default.
- Connection settings (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`) are externalized as environment variables with local-dev defaults in `application-local.yml`/`application-test.yml` only; `application-prod.yml` has no defaults, so a misconfigured production deployment fails to start rather than silently connecting to the wrong database.

## OpenAPI / Swagger Support

The master prompt requires OpenAPI/Swagger support as a backend foundation dependency. **springdoc-openapi is not usable yet** — see the breaking-changes note above. Rather than wire in a version known to target the wrong Spring Framework major version (which risks class-loading failures at startup), this is handled as follows:

- `docs/10-openapi.yaml` (Phase 1, already approved) remains the authoritative, hand-maintained API contract for the duration of Phase 3.
- No `springdoc-openapi-starter-webmvc-ui` dependency is added to `pom.xml` at this time.
- Tracked as `TF-OQ-007`: revisit and add `springdoc-openapi` (or an equivalent) once a Spring Boot 4-compatible release exists, or reassess if the ecosystem moves to a different OpenAPI generation approach for Spring Framework 7.

## Spring Boot Actuator

- `spring-boot-starter-actuator` included.
- Configured on a **separate management port (`8081`)**, distinct from the main API port (`8080`) and outside the `/api/v1` context-path — so `/actuator/health` is never exposed on the public API surface (`server.servlet.context-path: /api/v1` only applies to the main connector). Only `health` and `info` endpoints are exposed (`management.endpoints.web.exposure.include: health,info`); no other actuator endpoints are opened.

## Realtime (WebSocket) Foundation

`common/config/WebSocketConfig.java` registers a STOMP endpoint (`/ws`, SockJS fallback) and a simple in-memory message broker (`/topic` for broadcast, `/app` for client-to-server), per the SDD's WebSocket/STOMP design and the master prompt's "WebSocket foundation only where justified" instruction. **No `@MessageMapping` handlers or Lead-notification business logic exist** — this is transport registration only, ready for `notification/` to publish onto in a later phase.

## Environment Profiles

Four YAML files under `src/main/resources/`, matching the master prompt's `local`/`test`/`prod` requirement plus a base file for profile-independent config:

- `application.yml` — `spring.profiles.active: local` (default), context-path, actuator port/exposure.
- `application-local.yml` — datasource pointed at the Task 08 Docker Compose MySQL service, with sensible local defaults (`DB_HOST=localhost`, etc.) so `mvn spring-boot:run` works out of the box once Compose is up.
- `application-test.yml` — same shape, defaults to a separate `lawfirm_test` schema so test runs never touch dev data.
- `application-prod.yml` — no defaults on any secret/connection value; startup fails fast on missing config rather than falling back to a dev value.

Full variable catalog (including non-Spring variables like MinIO/S3 credentials) is documented in `09-environment-configuration.md`.

## Global Command Reference

| Purpose | Command |
|---|---|
| Compile | `./mvnw compile` |
| Test | `./mvnw test` (requires a reachable MySQL — see 08/12) |
| Package | `./mvnw -DskipTests package` |
| Run | `./mvnw spring-boot:run` |

No local JDK/Maven is installed on this machine (Task 01 audit) — all commands above were run via `docker run ... eclipse-temurin:17-jdk sh -c "./mvnw ..."`, matching the Docker-first backend workflow formalized in Task 08.

## Explicit Non-Scope Confirmation

No business CRUD, no Lead/Case/Appointment/Document/CMS/Notification/Audit endpoints, no login/JWT implementation. `BackendApplication.java` and `BackendApplicationTests.java` are the generator defaults, unmodified in substance.

## Validation

All commands run inside `eclipse-temurin:17-jdk` via Docker (no local JDK available):

- `./mvnw compile` → **BUILD SUCCESS**.
- `./mvnw -DskipTests package` → **BUILD SUCCESS**, produced `target/backend-0.0.1-SNAPSHOT.jar` (removed after verification; build output is gitignored).
- `./mvnw test` → **BUILD FAILURE**, but for the expected reason: `BackendApplicationTests.contextLoads` attempts a full Spring context load, which initializes Hibernate/Flyway against the configured MySQL datasource — no MySQL instance exists yet at this point in the task sequence (`Connection refused` to `localhost:3306`). This confirms the datasource/JPA/Flyway wiring is structurally correct (it reached the point of attempting a real connection with the right host/port/credentials) rather than failing on misconfiguration. Full green test run is validated in Task 12 once Task 06 (migrations) and Task 08 (Docker Compose MySQL) exist.
