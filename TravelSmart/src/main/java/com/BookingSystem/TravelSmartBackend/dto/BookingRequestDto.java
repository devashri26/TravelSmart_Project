package com.BookingSystem.TravelSmartBackend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BookingRequestDto {

    @NotNull(message = "Inventory ID must not be null.")
    @Min(value = 1, message = "Inventory ID must be positive.")
    private Long inventoryId;

    @NotBlank(message = "Inventory type must not be blank (e.g., FLIGHT, HOTEL, BUS, TRAIN).")
    private String inventoryType;

    @Min(value = 1, message = "Quantity must be at least 1.")
    private int quantity;

    // Getters and Setters

    public Long getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(Long inventoryId) {
        this.inventoryId = inventoryId;
    }

    public String getInventoryType() {
        return inventoryType;
    }

    public void setInventoryType(String inventoryType) {
        this.inventoryType = inventoryType;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
