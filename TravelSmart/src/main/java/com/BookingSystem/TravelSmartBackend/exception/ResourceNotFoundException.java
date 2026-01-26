package com.BookingSystem.TravelSmartBackend.exception;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

/**
 * Custom exception to signal that a requested resource (like a Flight or Booking)
 * does not exist.
 * The @ResponseStatus annotation automatically sets the HTTP status code to 404 Not Found
 * when this exception is thrown from a controller method.
 */
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
