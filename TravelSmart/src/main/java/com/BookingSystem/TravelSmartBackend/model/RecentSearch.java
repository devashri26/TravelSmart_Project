package com.BookingSystem.TravelSmartBackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "recent_searches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentSearch {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @Enumerated(EnumType.STRING)
    private SearchType type; // FLIGHT, HOTEL, BUS, TRAIN
    
    private String origin;
    
    private String destination;
    
    private LocalDate travelDate;
    
    private LocalDate returnDate;
    
    private Integer passengers;
    
    private String searchParams; // JSON string for additional params
    
    private LocalDateTime searchedAt = LocalDateTime.now();
    
    public enum SearchType {
        FLIGHT, HOTEL, BUS, TRAIN
    }
}
