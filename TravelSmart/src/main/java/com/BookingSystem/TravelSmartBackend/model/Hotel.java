package com.BookingSystem.TravelSmartBackend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * Represents a single hotel and its room inventory.
 */
@Entity
@Table(name = "hotels")
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String roomType; // e.g., "Deluxe", "Suite"

    @Column(nullable = false)
    private BigDecimal nightlyRate;

    @Column(nullable = false)
    private int totalRooms; // Total rooms of this type

    @Column(nullable = false)
    private int availableRooms; // Current available inventory
    
    @Column(length = 1000)
    private String imageUrl; // Hotel image URL
    
    @Column
    private Double rating; // Hotel rating (0-5)
    
    @Column(length = 2000)
    private String description; // Hotel description
    
    @Column(length = 500)
    private String amenities; // Comma-separated amenities (WiFi, Pool, Gym, etc.)
    
    @Column
    private String starRating; // 3-star, 4-star, 5-star
    
    @Column
    private Boolean breakfastIncluded;
    
    @Column
    private Boolean freeCancellation;
    
    // Constructor
    public Hotel() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }
    
    public BigDecimal getNightlyRate() { return nightlyRate; }
    public void setNightlyRate(BigDecimal nightlyRate) { this.nightlyRate = nightlyRate; }
    
    public int getTotalRooms() { return totalRooms; }
    public void setTotalRooms(int totalRooms) { this.totalRooms = totalRooms; }
    
    public int getAvailableRooms() { return availableRooms; }
    public void setAvailableRooms(int availableRooms) { this.availableRooms = availableRooms; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getAmenities() { return amenities; }
    public void setAmenities(String amenities) { this.amenities = amenities; }
    
    public String getStarRating() { return starRating; }
    public void setStarRating(String starRating) { this.starRating = starRating; }
    
    public Boolean getBreakfastIncluded() { return breakfastIncluded; }
    public void setBreakfastIncluded(Boolean breakfastIncluded) { this.breakfastIncluded = breakfastIncluded; }
    
    public Boolean getFreeCancellation() { return freeCancellation; }
    public void setFreeCancellation(Boolean freeCancellation) { this.freeCancellation = freeCancellation; }
}
