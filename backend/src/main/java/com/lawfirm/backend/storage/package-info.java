/**
 * Object storage abstraction (MinIO local / S3-compatible production). {@link StorageService}
 * is the only type meant to be used outside this package — no S3/MinIO SDK type crosses the
 * package boundary. The abstraction itself ({@link StorageService}, {@link S3StorageService},
 * {@link StorageConfig}, {@link StorageProperties}) is implemented in Phase 3 as technical
 * foundation; {@link com.lawfirm.backend.document} (which will call it) is a later phase.
 * See docs/technical-foundation/07-storage-foundation.md for the interface boundary.
 */
package com.lawfirm.backend.storage;
