package com.BookingSystem.TravelSmartBackend.repository;

import com.BookingSystem.TravelSmartBackend.model.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BusRepository extends JpaRepository<Bus, Long> {

    // Admin operation (optional, but good practice for unique constraints)
    Optional<Bus> findByBusNumber(String busNumber);

    /**
     * Finds buses based on origin, destination, and departure day.
     * @param origin The departure city/location.
     * @param destination The arrival city/location.
     * @param date The date to search on (we only compare the date part).
     * @return List of matching Bus entities.
     */
    @Query("SELECT b FROM Bus b WHERE " +
            "b.origin = :origin AND " +
            "b.destination = :destination AND " +
            "DATE(b.departureTime) = DATE(:date) AND " +
            "b.availableSeats > 0") // Only show buses with available seats
    List<Bus> searchAvailableBuses(
            @Param("origin") String origin,
            @Param("destination") String destination,
            @Param("date") LocalDateTime date
    );
    
    // Admin search method
    org.springframework.data.domain.Page<Bus> findByBusNumberContainingIgnoreCaseOrOperatorContainingIgnoreCaseOrOriginContainingIgnoreCaseOrDestinationContainingIgnoreCase(
            String busNumber, String operator, String origin, String destination, org.springframework.data.domain.Pageable pageable);
}
