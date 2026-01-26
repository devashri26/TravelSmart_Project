package com.BookingSystem.TravelSmartBackend.dto;

import java.time.LocalDateTime;

public class FlightSearchRequest {
    private String from;
    private String to;
    private LocalDateTime date;

    // Getters and Setters

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}
