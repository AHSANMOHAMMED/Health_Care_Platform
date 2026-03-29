package com.healthcare.user.web;

import com.healthcare.user.web.dto.ApiError;
import jakarta.validation.ConstraintViolationException;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ApiError> bad(IllegalArgumentException ex) {
    return ResponseEntity.badRequest()
        .body(new ApiError(Instant.now(), 400, ex.getMessage(), List.of()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> validation(MethodArgumentNotValidException ex) {
    List<String> details =
        ex.getBindingResult().getFieldErrors().stream()
            .map(f -> f.getField() + ": " + f.getDefaultMessage())
            .toList();
    return ResponseEntity.badRequest()
        .body(new ApiError(Instant.now(), 400, "Validation failed", details));
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ApiError> cv(ConstraintViolationException ex) {
    return ResponseEntity.badRequest()
        .body(
            new ApiError(
                Instant.now(),
                400,
                "Validation failed",
                ex.getConstraintViolations().stream().map(v -> v.getMessage()).toList()));
  }

  @ExceptionHandler(SecurityException.class)
  public ResponseEntity<ApiError> forbidden(SecurityException ex) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN)
        .body(new ApiError(Instant.now(), 403, ex.getMessage(), List.of()));
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ApiError> denied(AccessDeniedException ex) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN)
        .body(new ApiError(Instant.now(), 403, "Access denied", List.of()));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiError> generic(Exception ex) {
    return ResponseEntity.internalServerError()
        .body(new ApiError(Instant.now(), 500, ex.getMessage(), List.of()));
  }
}
