package com.lawfirm.backend.common.exception;

import com.lawfirm.backend.common.response.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

/**
 * Single point of translation from exceptions to the {@link ErrorResponse} envelope.
 * Per docs/11-system-design-document.md: no stack traces are ever returned to the client —
 * but every exception is still logged server-side (never silently swallowed), so ops/dev can
 * diagnose it. Domain packages should throw {@link ResourceNotFoundException} or a Bean
 * Validation violation and let this handler shape the HTTP response — no per-controller try/catch.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return errorResponse(HttpStatus.NOT_FOUND, "not_found", ex.getMessage());
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoRouteFound(NoResourceFoundException ex) {
        // Spring MVC's own "nothing matched this request" signal (e.g. no controller mapped
        // for the path yet) — without this handler it falls through to the generic 500 below,
        // which is the wrong status code for "this route doesn't exist".
        return errorResponse(HttpStatus.NOT_FOUND, "not_found", "No route matches this request");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                .orElse("Validation failed");
        return errorResponse(HttpStatus.BAD_REQUEST, "validation_error", message);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        return errorResponse(HttpStatus.FORBIDDEN, "access_denied", "You do not have permission to perform this action");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(Exception ex) {
        log.error("Unhandled exception reaching GlobalExceptionHandler", ex);
        return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "internal_error", "An unexpected error occurred");
    }

    private ResponseEntity<ErrorResponse> errorResponse(HttpStatus status, String error, String message) {
        return ResponseEntity.status(status).body(new ErrorResponse(error, message, status.value()));
    }
}
