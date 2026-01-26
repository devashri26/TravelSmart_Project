package com.BookingSystem.TravelSmartBackend.model;

import lombok.Getter;

@Getter
public enum Role {
    // User roles hierarchy: USER < ADMIN < SUPER_ADMIN
    ROLE_USER,
    ROLE_ADMIN,
    ROLE_SUPER_ADMIN
}