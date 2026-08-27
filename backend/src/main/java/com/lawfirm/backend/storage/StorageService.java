package com.lawfirm.backend.storage;

import java.io.InputStream;
import java.net.URL;
import java.time.Duration;

/**
 * The only interface the rest of the application is allowed to depend on for object storage.
 * No S3/MinIO type (e.g. {@code S3Client}, {@code PutObjectRequest}) may appear outside this
 * package — {@link com.lawfirm.backend.document} (a later phase) talks to storage exclusively
 * through this interface, so swapping MinIO for AWS S3 (or anything else S3-compatible) is a
 * configuration change, never a code change in the business layer.
 * <p>
 * All keys are caller-assigned object keys (e.g. {@code cases/<caseId>/<uuid>-<filename>});
 * this interface does not invent a key-naming scheme — see
 * docs/technical-foundation/07-storage-foundation.md for the recommended convention.
 */
public interface StorageService {

    /**
     * Uploads a private object. Every object in the bucket is private — this interface has no
     * "make public" operation; access is always via {@link #presignedDownloadUrl}.
     */
    void put(String key, InputStream content, long contentLength, String contentType);

    /** A time-limited URL for downloading a private object directly from the storage backend. */
    URL presignedDownloadUrl(String key, Duration expiry);

    void delete(String key);
}
