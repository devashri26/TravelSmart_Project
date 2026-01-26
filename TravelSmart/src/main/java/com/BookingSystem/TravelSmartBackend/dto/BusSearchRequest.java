package com.BookingSystem.TravelSmartBackend.dto;

import java.time.LocalDateTime;

public class BusSearchRequest {
    private String origin;
    private String destination;
    private LocalDateTime date;

    // Getters and Setters

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}
