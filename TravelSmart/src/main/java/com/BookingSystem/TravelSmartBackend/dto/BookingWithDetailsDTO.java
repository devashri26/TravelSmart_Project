package com.BookingSystem.TravelSmartBackend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingWithDetailsDTO {
    private Long id;
    private Long inventoryId;
    private String inventoryType;
    private LocalDateTime bookingDate;
    private BigDecimal totalPrice;
    private String status;
    private int quantity;
    private String seatNumbers;
    
    // Inventory details
    private String displayName;      // Flight number, Bus operator, Train name, Hotel name
    private String route;            // "Mumbai → Delhi" or location
    private String departureTime;    // For flights/buses/trains
    private String arrivalTime;      // For flights/buses/trains
    
    // Constructor
    public BookingWithDetailsDTO() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getInventoryId() { return inventoryId; }
    public void setInventoryId(Long inventoryId) { this.inventoryId = inventoryId; }
    
    public String getInventoryType() { return inventoryType; }
    public void setInventoryType(String inventoryType) { this.inventoryType = inventoryType; }
    
    public LocalDateTime getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDateTime bookingDate) { this.bookingDate = bookingDate; }
    
    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    
    public String getSeatNumbers() { return seatNumbers; }
    public void setSeatNumbers(String seatNumbers) { this.seatNumbers = seatNumbers; }
    
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    
    public String getRoute() { return route; }
    public void setRoute(String route) { this.route = route; }
    
    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }
    
    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }
}
