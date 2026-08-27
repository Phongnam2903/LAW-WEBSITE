#!/bin/sh
# Bootstraps the local MinIO buckets. Run by the one-shot `minio-init` service in
# docker-compose.yml, using the `minio/mc` client image — not by application code.
set -eu

mc alias set local http://minio:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"
mc mb --ignore-existing local/lawfirm-documents
mc mb --ignore-existing local/lawfirm-documents-test

echo "MinIO buckets ready."
