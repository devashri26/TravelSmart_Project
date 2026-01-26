package com.BookingSystem.TravelSmartBackend.exception;

/**
 * Custom exception for business logic errors during the booking process
 * (e.g., not enough seats).
 */
public class BookingException extends RuntimeException {

    public BookingException(String message) {
        super(message);
    }

    public BookingException(String message, Throwable cause) {
        super(message, cause);
    }
}
