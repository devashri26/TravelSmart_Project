package com.BookingSystem.TravelSmartBackend.dto;

public class HotelSearchRequest {
    private String city;
    private int guests;

    // Getters and Setters

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public int getGuests() {
        return guests;
    }

    public void setGuests(int guests) {
        this.guests = guests;
    }
}
