package com.lawfirm.backend.common.response;

/**
 * Unified error envelope for every REST error response. Field names match
 * {@code ErrorResponse} in docs/10-openapi.yaml exactly ({@code error}, {@code message},
 * {@code status}) so the frontend's {@code ApiErrorResponse} type stays in sync.
 */
public record ErrorResponse(String error, String message, int status) {
}
