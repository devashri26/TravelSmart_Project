package com.BookingSystem.TravelSmartBackend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cancellations")
public class Cancellation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;
    
    private String reason;
    
    private Double cancellationCharge;
    
    private Double refundAmount;
    
    @Enumerated(EnumType.STRING)
    private RefundStatus refundStatus; // PENDING, PROCESSING, COMPLETED, FAILED
    
    private String refundTransactionId;
    
    private LocalDateTime cancelledAt = LocalDateTime.now();
    
    private LocalDateTime refundProcessedAt;
    
    public enum RefundStatus {
        PENDING, PROCESSING, COMPLETED, FAILED
    }
    
    // Constructors
    public Cancellation() {}
    
    public Cancellation(Long id, Booking booking, String reason, Double cancellationCharge, Double refundAmount,
                        RefundStatus refundStatus, String refundTransactionId, LocalDateTime cancelledAt,
                        LocalDateTime refundProcessedAt) {
        this.id = id;
        this.booking = booking;
        this.reason = reason;
        this.cancellationCharge = cancellationCharge;
        this.refundAmount = refundAmount;
        this.refundStatus = refundStatus;
        this.refundTransactionId = refundTransactionId;
        this.cancelledAt = cancelledAt;
        this.refundProcessedAt = refundProcessedAt;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }
    
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    
    public Double getCancellationCharge() { return cancellationCharge; }
    public void setCancellationCharge(Double cancellationCharge) { this.cancellationCharge = cancellationCharge; }
    
    public Double getRefundAmount() { return refundAmount; }
    public void setRefundAmount(Double refundAmount) { this.refundAmount = refundAmount; }
    
    public RefundStatus getRefundStatus() { return refundStatus; }
    public void setRefundStatus(RefundStatus refundStatus) { this.refundStatus = refundStatus; }
    
    public String getRefundTransactionId() { return refundTransactionId; }
    public void setRefundTransactionId(String refundTransactionId) { this.refundTransactionId = refundTransactionId; }
    
    public LocalDateTime getCancelledAt() { return cancelledAt; }
    public void setCancelledAt(LocalDateTime cancelledAt) { this.cancelledAt = cancelledAt; }
    
    public LocalDateTime getRefundProcessedAt() { return refundProcessedAt; }
    public void setRefundProcessedAt(LocalDateTime refundProcessedAt) { this.refundProcessedAt = refundProcessedAt; }
}
