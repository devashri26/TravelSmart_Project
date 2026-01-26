package com.BookingSystem.TravelSmartBackend.repository;

import com.BookingSystem.TravelSmartBackend.model.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TrainRepository extends JpaRepository<Train, Long> {

    Optional<Train> findByTrainNumber(String trainNumber);

    /**
     * Finds trains based on origin, destination, and departure day.
     * @param origin The departure city/location.
     * @param destination The arrival city/location.
     * @param date The date to search on (we only compare the date part).
     * @return List of matching Train entities.
     */
    @Query("SELECT t FROM Train t WHERE " +
            "t.origin = :origin AND " +
            "t.destination = :destination AND " +
            "DATE(t.departureTime) = DATE(:date) AND " +
            "t.availableSeats > 0") // Only show trains with available seats
    List<Train> searchAvailableTrains(
            @Param("origin") String origin,
            @Param("destination") String destination,
            @Param("date") LocalDateTime date
    );
    
    // Admin search method
    org.springframework.data.domain.Page<Train> findByTrainNumberContainingIgnoreCaseOrTrainNameContainingIgnoreCaseOrOriginContainingIgnoreCaseOrDestinationContainingIgnoreCase(
            String trainNumber, String trainName, String origin, String destination, org.springframework.data.domain.Pageable pageable);
}
