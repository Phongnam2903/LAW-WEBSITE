# 10 — Code Quality Foundation

Status: Complete

## Frontend Checks

| Check | Command | What it does |
|---|---|---|
| Lint | `npm run lint` | ESLint 9 flat config (`eslint-config-next` core-web-vitals + typescript) |
| Typecheck | `npm run typecheck` | `next typegen && tsc --noEmit` |
| Build | `npm run build` | Production build (`next build`) |

`typecheck` runs `next typegen` first — **discovered as necessary, not assumed**: `src/app/layout.tsx` uses Next.js 16's generated `LayoutProps<"/">` type (an ambient declaration written to `.next/types/` by the framework, not something in `node_modules`'s shipped `.d.ts` files). Running bare `tsc --noEmit` without that generation step first fails with `Cannot find name 'LayoutProps'` on a clean checkout or right after deleting `.next/` — exactly the state CI starts from. `next typegen` produces the same type declarations `next build`/`next dev` would, without a full build, so `typecheck` stays fast and independent of `build`.

## Backend Checks

| Check | Command | What it does |
|---|---|---|
| Compile | `./mvnw compile` | |
| Test | `./mvnw test` | Requires a reachable MySQL (Task 06/08) — the context-load test initializes the full JPA/Flyway stack |
| Package | `./mvnw -DskipTests package` | Produces the executable jar |

No separate lint/format check command exists yet — see "Backend Static Analysis" below for why nothing was added.

## Frontend Coding Conventions

- **Naming**: `PascalCase` for components and types, `camelCase` for variables/functions/hooks (`useXyz`), `kebab-case` for non-component file names (e.g. `api-client.ts`), route segment folders lowercase (Next.js convention).
- **Folder organization**: established in `04-frontend-foundation.md` — `app/` is routes only; `components/ui` is domain-agnostic primitives; `components/shared` is domain-agnostic composites; `features/<name>` is where a business feature's components/hooks/services live once one exists; `lib/`, `hooks/`, `types/`, `config/`, `services/`, `styles/` are flat, non-nested utility homes.
- **TypeScript rules**: `strict: true` (generator default, kept as-is — no loosening). No `any` without a comment explaining why it's unavoidable at that call site (not enforced by a lint rule yet — see open item below).
- **Import conventions**: use the `@/*` alias (→ `src/*`) for any cross-folder import; relative imports (`./`, `../`) only within the same feature/folder. Absolute `@/` imports over deep relative chains (`../../../lib/x`) keep moves/renames cheap.
- **Component boundaries**: a component in `components/ui` never imports from `features/`; a `features/<name>` component may import from `components/ui`, `components/shared`, `lib`, `hooks`, `services`, `types` — never from another `features/<other>` (cross-feature reuse goes through `components/shared` or `lib` instead, so features stay independently removable).

## Backend Coding Conventions

- **Package naming**: all lowercase, one package per bounded concept (`lead`, `cases`, `document`, ...) — see `05-backend-foundation.md` for the full list and the `cases`-not-`case` naming note (Java reserved word).
- **Class naming**: `XxxController`, `XxxService`, `XxxRepository`, `XxxConfig`, `XxxProperties`, `XxxException` — suffix states the role, no other convention needed at this scale.
- **DTO naming**: `XxxRequest` / `XxxResponse` (matches the naming already used in `docs/10-openapi.yaml`'s schemas, e.g. `LeadCreateRequest`, `TokenResponse`) — a future controller's request/response types should match the OpenAPI schema names exactly, not invent parallel names.
- **Exception strategy**: throw a specific exception (`ResourceNotFoundException` or a new `common/exception` type for a genuinely new failure category) and let `GlobalExceptionHandler` shape the HTTP response — no controller-level `try/catch` that builds a `ResponseEntity` by hand. New exception types are added to `common/exception` only when they represent a cross-cutting concern; a business-rule-specific exception belongs in its own domain package (e.g. a future `lead.LeadAlreadyConvertedException`), not `common`.
- **Logging conventions**: SLF4J (`LoggerFactory.getLogger(X.class)`), never `System.out`/`e.printStackTrace()`. `GlobalExceptionHandler` logs every exception that reaches its catch-all handler at `ERROR` — **this was originally missing and was added after Task 08's live validation showed a real bug (a 500 response) with nothing in the server log to explain it**; every future `@ExceptionHandler` added to that class should keep logging what it handles, not just translate it to a status code. Per `docs/03-nfr.md`, never log credentials, JWTs, or full document content.
- **Dependency direction**: `common/` is depended on by domain packages, never the reverse. Within `storage/`, only `StorageService` is public API for other packages — `document` (once it exists) must not import `S3Client`, `PutObjectRequest`, or any other AWS SDK type directly (enforced by convention today; see `07-storage-foundation.md`).

## Backend Static Analysis — deliberately not added

No formatter (Spotless/google-java-format) or static analysis tool (Checkstyle/PMD/SpotBugs) was added to `pom.xml`. Reasoning, not an oversight:

- The master prompt explicitly warns against over-engineering tooling without justification, and the current backend is 21 small, straightforward source files with one contributor context (this session) — there is no formatting drift to correct yet and no team-scale bikeshedding risk to prevent.
- Docker Desktop's storage layer failed mid-way through Task 08 (see that task's validation notes) and had not recovered by the time this task ran, which removed the ability to validate a new Maven plugin's build behavior with the same rigor used for every other backend change in this phase — adding an unvalidated plugin would violate this phase's own working rule (validate before ticking complete).
- Tracked as `TF-OQ-013` (PROPOSED default: add Spotless with `google-java-format` once the backend has enough contributors/files that formatting drift becomes a real cost — not before).

## Explicit Non-Scope Confirmation

No lint rule, formatter config, or CI gate was tuned around business code, because none exists yet — these conventions apply from the first real feature branch onward.

## Validation

- `npm run typecheck` → **initially failed** (`Cannot find name 'LayoutProps'`) on a clean `.next/`-less checkout; root-caused to the missing `next typegen` step and fixed by changing the script itself, not by avoiding the generated type. Re-run after the fix: **passed**.
- `npm run lint` → passed (unchanged from Task 04).
- `npm run build` → passed (unchanged from Task 04; also independently regenerates the same types `typegen` does, confirming no drift between the two).
- Backend `./mvnw compile`/`test`/`package` → already validated in Tasks 05–07; no code changed in this task that touches the backend compile path.
