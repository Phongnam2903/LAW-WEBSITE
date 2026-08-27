# 07 — Storage Foundation

Status: Complete

## Approach

MinIO (local) and AWS S3 (production) both implement the S3 API, so a single client library and a single implementation class serve both — no dual-implementation, no runtime `if (minio) ... else ...` branch anywhere. Which target is active is purely a `StorageProperties`/environment-variable decision (Task 09): setting `STORAGE_ENDPOINT` selects an S3-compatible endpoint (MinIO); leaving it unset lets the AWS SDK resolve the real regional S3 endpoint.

Dependency: `software.amazon.awssdk:s3:2.46.7` (AWS SDK v2), added to `backend/pom.xml` — not offered as a Spring Initializr starter, added directly.

## Interface Boundary

```text
backend/src/main/java/com/lawfirm/backend/storage/
├── StorageService.java     # the only type anything outside this package may depend on
├── S3StorageService.java   # the only implementation — works against MinIO or AWS S3 unmodified
├── StorageConfig.java      # builds the single S3Client/S3Presigner pair from StorageProperties
└── StorageProperties.java  # @ConfigurationProperties(prefix = "storage")
```

`StorageService` is a 3-method interface:

```java
void put(String key, InputStream content, long contentLength, String contentType);
URL presignedDownloadUrl(String key, Duration expiry);
void delete(String key);
```

No `S3Client`, `PutObjectRequest`, or any other AWS SDK type is public outside `com.lawfirm.backend.storage` — `com.lawfirm.backend.document` (a later phase) will depend on `StorageService` only, so replacing MinIO/S3 with a different backend later is contained entirely within this package.

## Bucket Strategy

- One bucket per environment (`lawfirm-documents` locally, a distinct bucket name in each of test/staging/production), configured via `storage.bucket`. No per-tenant or per-case bucket — object isolation is achieved through the key naming convention below, not separate buckets, since bucket-per-case would not scale and isn't justified by the ERD (`documents.storage_key` is a single flat string column).
- Bucket creation itself is **not** performed by application code — Task 08 provisions the local MinIO bucket as part of Docker Compose startup; production bucket provisioning is an infrastructure/deployment concern outside Phase 3's scope (no hosting target is chosen yet — see `TF-OQ-010`).

## Presigned URL Strategy

- Every object is private. There is no "make public" operation anywhere in `StorageService` — the only read path is `presignedDownloadUrl(key, expiry)`, a time-limited signed URL generated on demand, matching `GET /documents/{id}/download` in `docs/10-openapi.yaml` (which itself returns a URL, not file bytes).
- `expiry` is caller-specified, not hardcoded in this package — `docs/03-nfr.md` (`NFR-FILE-002`) requires presigned URLs to expire but leaves the exact lifetime **TBD** (`OQ-29`, upstream Phase 1 open question). Baking in a specific number of minutes here would silently resolve an open business decision; the business/document-management feature (later phase) decides the value when it calls this method.

## Private Object Access

No object is ever served through the Spring application itself (no proxy-download endpoint) — the backend only issues short-lived presigned URLs, and the client downloads directly from MinIO/S3. This matches the SDD's storage design and avoids the backend becoming a bandwidth bottleneck for file downloads.

## Filename / Key Strategy

`StorageService.put`/`presignedDownloadUrl`/`delete` all take a caller-assigned `key` — this package does not invent a key-naming scheme, since the actual naming convention (e.g. `cases/<caseId>/<uuid>-<originalFilename>`) is a `document` package decision tied to the `documents.storage_key` column (already `UNIQUE` in the schema, Task 06) and belongs with the business feature that populates it, not the storage abstraction.

## Local MinIO Configuration

- `storage.endpoint`: `http://localhost:9000` (from inside the backend when run locally; `http://minio:9000` inside Docker Compose — see Task 08).
- `storage.path-style-access`: `true` — **required** for MinIO. Path-style must be set on **both** the `S3Client` and the `S3Presigner` (see Validation below for why this was caught, not assumed).
- `storage.access-key` / `storage.secret-key`: `minioadmin` / `minioadmin` locally (matches the MinIO container's default root credentials in Task 08) — never used outside local/test.

## Production S3 Substitution

- `storage.endpoint`: left unset — the AWS SDK resolves the real `s3.<region>.amazonaws.com`-style endpoint itself.
- `storage.path-style-access`: `false` (AWS's modern default; virtual-hosted style).
- `storage.access-key` / `storage.secret-key`: left unset by default in `application-prod.yml`, so `StorageConfig` falls back to `DefaultCredentialsProvider` (IAM role or environment-resolved credentials) rather than requiring static keys to be stored anywhere — only set these two if a future production deployment targets a non-AWS S3-compatible service instead of real AWS S3.

## Explicit Non-Scope Confirmation

No `document` package code exists yet (Task 05's Strict Scope Boundary) — nothing calls `StorageService` from a controller or persists a `documents` row. This task delivers the abstraction and proves it works, not the Document Management feature.

## Validation

Performed against real, disposable MinIO and MySQL containers (both needed — `S3Client`/`S3Presigner` beans live inside the same Spring context as the JPA/Flyway beans from Task 05/06):

1. Started `mysql:8.4` (migrated with `V1__init_schema.sql`) and `minio/minio` on a shared Docker network; pre-created the `lawfirm-documents` bucket directory.
2. Added a temporary test (deleted immediately after use, not part of the permanent suite) that autowired `StorageService` and exercised the full cycle: `put()` a small text object, `presignedDownloadUrl()`, fetch that URL with a real HTTP client, assert the downloaded bytes match what was uploaded, then `delete()`.
3. **First run failed** with `UnresolvedAddressException` trying to reach a host like `lawfirm-documents.lawfirm-minio-test` — the presigned URL came back in virtual-hosted style (bucket name as a DNS subdomain) even though `S3Client` was configured for path-style, because **`S3Presigner` needs its own, separate `serviceConfiguration(...)` with `pathStyleAccessEnabled` — setting it only on `S3Client` does not carry over to `S3Presigner`.** This is a real MinIO/AWS-SDK integration pitfall that a code read-through would not have caught; `StorageConfig.java` now sets path-style access on both builders.
4. **Second run: `BUILD SUCCESS`, Tests run: 1, Failures: 0, Errors: 0** — upload, presigned-URL generation, direct HTTP download through the presigned URL (200, exact byte match), and delete all succeeded against live MinIO.
5. Temporary test file and both containers were removed after validation; nothing from this task persists as a long-lived service — Task 08 defines the actual local MinIO Docker Compose service.
