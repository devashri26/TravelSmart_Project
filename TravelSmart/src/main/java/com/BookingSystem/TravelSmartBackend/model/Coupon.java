package com.BookingSystem.TravelSmartBackend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
public class Coupon {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String code;
    
    private String description;
    
    @Enumerated(EnumType.STRING)
    private DiscountType discountType; // PERCENTAGE, FLAT
    
    private Double discountValue;
    
    private Double minBookingAmount;
    
    private Double maxDiscountAmount;
    
    private Integer usageLimit;
    
    private Integer usedCount = 0;
    
    private LocalDateTime validFrom;
    
    private LocalDateTime validUntil;
    
    private Boolean active = true;
    
    @Enumerated(EnumType.STRING)
    private BookingType applicableFor; // ALL, FLIGHT, HOTEL, BUS, TRAIN
    
    public enum DiscountType {
        PERCENTAGE, FLAT
    }
    
    public enum BookingType {
        ALL, FLIGHT, HOTEL, BUS, TRAIN
    }
    
    // Constructors
    public Coupon() {}
    
    public Coupon(Long id, String code, String description, DiscountType discountType, Double discountValue,
                  Double minBookingAmount, Double maxDiscountAmount, Integer usageLimit, Integer usedCount,
                  LocalDateTime validFrom, LocalDateTime validUntil, Boolean active, BookingType applicableFor) {
        this.id = id;
        this.code = code;
        this.description = description;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.minBookingAmount = minBookingAmount;
        this.maxDiscountAmount = maxDiscountAmount;
        this.usageLimit = usageLimit;
        this.usedCount = usedCount;
        this.validFrom = validFrom;
        this.validUntil = validUntil;
        this.active = active;
        this.applicableFor = applicableFor;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public DiscountType getDiscountType() { return discountType; }
    public void setDiscountType(DiscountType discountType) { this.discountType = discountType; }
    
    public Double getDiscountValue() { return discountValue; }
    public void setDiscountValue(Double discountValue) { this.discountValue = discountValue; }
    
    public Double getMinBookingAmount() { return minBookingAmount; }
    public void setMinBookingAmount(Double minBookingAmount) { this.minBookingAmount = minBookingAmount; }
    
    public Double getMaxDiscountAmount() { return maxDiscountAmount; }
    public void setMaxDiscountAmount(Double maxDiscountAmount) { this.maxDiscountAmount = maxDiscountAmount; }
    
    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }
    
    public Integer getUsedCount() { return usedCount; }
    public void setUsedCount(Integer usedCount) { this.usedCount = usedCount; }
    
    public LocalDateTime getValidFrom() { return validFrom; }
    public void setValidFrom(LocalDateTime validFrom) { this.validFrom = validFrom; }
    
    public LocalDateTime getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDateTime validUntil) { this.validUntil = validUntil; }
    
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    
    public BookingType getApplicableFor() { return applicableFor; }
    public void setApplicableFor(BookingType applicableFor) { this.applicableFor = applicableFor; }
}
