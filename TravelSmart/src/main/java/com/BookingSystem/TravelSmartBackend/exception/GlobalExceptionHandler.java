package com.BookingSystem.TravelSmartBackend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.net.URI;
import java.time.Instant;

/**
 * Global exception handler to centralize error handling across all controllers.
 * It uses the ProblemDetail class to conform to the RFC 7807 standard for
 * error responses, ensuring consistency and clarity for the client.
 */
@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    /**
     * Handles ResourceNotFoundException, mapping it to HTTP 404 Not Found.
     * @param ex The exception instance.
     * @param request The current web request.
     * @return A ResponseEntity containing a ProblemDetail response.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ProblemDetail> handleResourceNotFound(ResourceNotFoundException ex, WebRequest request) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                ex.getMessage()
        );
        problemDetail.setTitle("Resource Not Found");
        // A type URI related to the problem type (optional but good practice)
        problemDetail.setType(URI.create("/errors/not-found"));
        problemDetail.setProperty("timestamp", Instant.now());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problemDetail);
    }

    /**
     * Handles BookingException, mapping it to HTTP 400 Bad Request.
     * This is used for business logic failures like insufficient seats.
     * @param ex The exception instance.
     * @param request The current web request.
     * @return A ResponseEntity containing a ProblemDetail response.
     */
    @ExceptionHandler(BookingException.class)
    public ResponseEntity<ProblemDetail> handleBookingException(BookingException ex, WebRequest request) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
        problemDetail.setTitle("Booking Failed");
        problemDetail.setType(URI.create("/errors/booking-failure"));
        problemDetail.setProperty("timestamp", Instant.now());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problemDetail);
    }

    // You can add more exception handlers here for general exceptions like
    // DataIntegrityViolationException, MethodArgumentNotValidException, etc., as needed.
}
