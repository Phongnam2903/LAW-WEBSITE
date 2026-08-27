package com.lawfirm.backend.storage;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuration for the object storage abstraction. The same properties serve both targets:
 * <ul>
 *   <li>MinIO (local) — set {@code endpoint} to the local MinIO URL and {@code accessKey}/{@code secretKey}
 *       to the MinIO credentials (see docs/technical-foundation/08-docker-development.md).</li>
 *   <li>AWS S3 (production) — leave {@code endpoint} unset so the AWS SDK resolves the real
 *       regional S3 endpoint; credentials are then normally supplied by the deployment
 *       environment (IAM role) rather than {@code accessKey}/{@code secretKey}.</li>
 * </ul>
 * See docs/technical-foundation/09-environment-configuration.md for the full variable catalog.
 */
@ConfigurationProperties(prefix = "storage")
public class StorageProperties {

    /** Non-null selects an S3-compatible endpoint (MinIO); null uses AWS's default S3 endpoint resolution. */
    private String endpoint;

    private String region = "us-east-1";

    private String bucket;

    /** Left null in production to fall back to the AWS default credentials provider chain (e.g. IAM role). */
    private String accessKey;

    private String secretKey;

    /** MinIO requires path-style bucket addressing; AWS S3 does not. */
    private boolean pathStyleAccess = true;

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getBucket() {
        return bucket;
    }

    public void setBucket(String bucket) {
        this.bucket = bucket;
    }

    public String getAccessKey() {
        return accessKey;
    }

    public void setAccessKey(String accessKey) {
        this.accessKey = accessKey;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public boolean isPathStyleAccess() {
        return pathStyleAccess;
    }

    public void setPathStyleAccess(boolean pathStyleAccess) {
        this.pathStyleAccess = pathStyleAccess;
    }
}
