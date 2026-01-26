package com.BookingSystem.TravelSmartBackend.exception;

/**
 * Custom exception thrown when a registration attempt is made with a username or email
 * that is already present in the database.
 * This extends RuntimeException, allowing Spring to handle it gracefully (usually resulting in a 409 Conflict).
 */
public class UserAlreadyExistsException extends RuntimeException {

    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
