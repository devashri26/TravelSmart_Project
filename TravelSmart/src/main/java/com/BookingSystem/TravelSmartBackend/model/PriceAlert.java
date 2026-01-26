package com.BookingSystem.TravelSmartBackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PriceAlert {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @Enumerated(EnumType.STRING)
    private AlertType type; // FLIGHT, HOTEL, BUS, TRAIN
    
    private String origin;
    
    private String destination;
    
    private LocalDate travelDate;
    
    private Double targetPrice;
    
    private Boolean active = true;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime triggeredAt;
    
    public enum AlertType {
        FLIGHT, HOTEL, BUS, TRAIN
    }
}
