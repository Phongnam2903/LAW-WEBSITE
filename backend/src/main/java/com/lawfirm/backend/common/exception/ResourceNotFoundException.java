package com.lawfirm.backend.common.exception;

/**
 * Generic "entity not found" signal for any domain package to throw; mapped to HTTP 404
 * by {@link GlobalExceptionHandler}. Domain-specific subclasses are not needed unless a
 * future feature requires a distinct error code.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
