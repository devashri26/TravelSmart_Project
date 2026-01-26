package com.BookingSystem.TravelSmartBackend.repository;

import com.BookingSystem.TravelSmartBackend.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for the Booking entity.
 */
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /**
     * Finds all bookings made by a specific user ID.
     * This will be used for displaying a user's booking history.
     */
    List<Booking> findByUserId(Long userId);
    
    // Admin query methods
    long countByBookingDateAfter(LocalDateTime date);
    
    Page<Booking> findByStatus(String status, Pageable pageable);
    
    Page<Booking> findByUserUsernameContainingIgnoreCase(String username, Pageable pageable);
    
    Page<Booking> findByStatusAndUserUsernameContainingIgnoreCase(String status, String username, Pageable pageable);
    
    List<Booking> findByInventoryTypeAndInventoryIdAndStatus(String inventoryType, Long inventoryId, String status);
}
