package com.BookingSystem.TravelSmartBackend.repository;

import com.BookingSystem.TravelSmartBackend.model.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
    Optional<Payment> findByBookingId(Long bookingId);
    List<Payment> findByUserId(Long userId);
    List<Payment> findByStatus(String status);
    Page<Payment> findByStatus(String status, Pageable pageable);
    
    // Admin query methods
    long countByStatus(String status);
    
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = ?1")
    double sumAmountByStatus(String status);
    
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = ?1 AND p.createdAt > ?2")
    double sumAmountByStatusAndCreatedAtAfter(String status, LocalDateTime date);
    
    List<Payment> findByStatusAndCreatedAtAfter(String status, LocalDateTime date);
}
