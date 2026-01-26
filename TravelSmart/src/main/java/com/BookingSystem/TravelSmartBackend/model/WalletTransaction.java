package com.BookingSystem.TravelSmartBackend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallet_transactions")
public class WalletTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "wallet_id")
    private Wallet wallet;
    
    @Enumerated(EnumType.STRING)
    private TransactionType type; // CREDIT, DEBIT
    
    private Double amount;
    
    private String description;
    
    private String referenceId; // Booking ID or Payment ID
    
    private Double balanceBefore;
    
    private Double balanceAfter;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    public enum TransactionType {
        CREDIT, DEBIT
    }
    
    public WalletTransaction() {}
    
    public WalletTransaction(Long id, Wallet wallet, TransactionType type, Double amount, String description,
                             String referenceId, Double balanceBefore, Double balanceAfter, LocalDateTime createdAt) {
        this.id = id;
        this.wallet = wallet;
        this.type = type;
        this.amount = amount;
        this.description = description;
        this.referenceId = referenceId;
        this.balanceBefore = balanceBefore;
        this.balanceAfter = balanceAfter;
        this.createdAt = createdAt;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Wallet getWallet() { return wallet; }
    public void setWallet(Wallet wallet) { this.wallet = wallet; }
    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }
    public Double getBalanceBefore() { return balanceBefore; }
    public void setBalanceBefore(Double balanceBefore) { this.balanceBefore = balanceBefore; }
    public Double getBalanceAfter() { return balanceAfter; }
    public void setBalanceAfter(Double balanceAfter) { this.balanceAfter = balanceAfter; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
