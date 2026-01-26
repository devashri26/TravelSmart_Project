package com.BookingSystem.TravelSmartBackend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception for issues related to email confirmation tokens,
 * such as token not found, expired, or already confirmed.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class TokenException extends RuntimeException {

    public TokenException(String message) {
        super(message);
    }

    public TokenException(String message, Throwable cause) {
        super(message, cause);
    }
}