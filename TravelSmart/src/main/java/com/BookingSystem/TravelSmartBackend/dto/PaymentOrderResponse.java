package com.BookingSystem.TravelSmartBackend.dto;

public class PaymentOrderResponse {
    private String orderId;
    private Double amount;
    private String currency;
    private String razorpayKeyId;
    
    // Constructors
    public PaymentOrderResponse() {}
    
    public PaymentOrderResponse(String orderId, Double amount, String currency, String razorpayKeyId) {
        this.orderId = orderId;
        this.amount = amount;
        this.currency = currency;
        this.razorpayKeyId = razorpayKeyId;
    }
    
    // Getters and Setters
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    
    public String getRazorpayKeyId() { return razorpayKeyId; }
    public void setRazorpayKeyId(String razorpayKeyId) { this.razorpayKeyId = razorpayKeyId; }
}
