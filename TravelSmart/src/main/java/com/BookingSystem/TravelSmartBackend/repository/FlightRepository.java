package com.BookingSystem.TravelSmartBackend.repository;

import com.BookingSystem.TravelSmartBackend.model.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Flight entity.
 * Provides standard CRUD database operations.
 */
@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    /**
     * Finds available flights based on departure city, arrival city, and departure day.
     * @param departureCity The origin city.
     * @param arrivalCity The destination city.
     * @param date The date to search on (we only compare the date part).
     * @return List of matching Flight entities with available seats.
     */
    @Query("SELECT f FROM Flight f WHERE " +
            "f.departureCity = :depCity AND " +
            "f.arrivalCity = :arrCity AND " +
            "DATE(f.departureTime) = DATE(:date) AND " +
            "f.availableSeats > 0") // Filter out fully booked flights
    List<Flight> searchAvailableFlights(
            @Param("depCity") String departureCity,
            @Param("arrCity") String arrivalCity,
            @Param("date") LocalDateTime date
    );
    
    // Admin search method
    org.springframework.data.domain.Page<Flight> findByFlightNumberContainingIgnoreCaseOrAirlineContainingIgnoreCaseOrDepartureCityContainingIgnoreCaseOrArrivalCityContainingIgnoreCase(
            String flightNumber, String airline, String departureCity, String arrivalCity, org.springframework.data.domain.Pageable pageable);
}
