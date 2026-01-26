package com.BookingSystem.TravelSmartBackend.repository;

import com.BookingSystem.TravelSmartBackend.model.PriceAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriceAlertRepository extends JpaRepository<PriceAlert, Long> {
    List<PriceAlert> findByUserIdAndActiveTrue(Long userId);
}
