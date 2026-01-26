package com.BookingSystem.TravelSmartBackend.controller;

import com.BookingSystem.TravelSmartBackend.model.Flight;
import com.BookingSystem.TravelSmartBackend.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDateTime;

/**
 * REST Controller for Flight inventory.
 * This controller is secured using method-level authorization.
 * Base path: /api/flights
 */
@RestController
@RequestMapping("/api/v1/flights")
public class FlightController {

    private final FlightService flightService;

    @Autowired
    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    /**
     * Retrieves all flights. Secured for both USER and ADMIN roles.
     * GET /api/flights
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public List<Flight> getAllFlights() {
        return flightService.getAllFlights();
    }

    /**
     * Searches for flights based on origin, destination, and date. Secured for USER and ADMIN.
     * GET /api/flights/search?from={}&to={}&date={YYYY-MM-DD}
     * NOTE: The @DateTimeFormat is crucial for Spring to correctly parse the date from the URL.
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<Flight>> searchFlights(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam String date) {

        // Convert date string to LocalDateTime at midnight
        LocalDateTime dateTime = java.time.LocalDate.parse(date).atStartOfDay();
        List<Flight> flights = flightService.searchFlights(from, to, dateTime);
        return ResponseEntity.ok(flights);
    }

    /**
     * Retrieves a flight by its ID. Secured for USER and ADMIN.
     * GET /api/flights/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Flight> getFlightById(@PathVariable Long id) {
        return flightService.getFlightById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Creates a new flight. Secured ONLY for ADMIN role.
     * POST /api/flights
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Flight> createFlight(@RequestBody Flight flight) {
        Flight newFlight = flightService.saveFlight(flight);
        return new ResponseEntity<>(newFlight, HttpStatus.CREATED);
    }

    /**
     * Updates an existing flight. Secured ONLY for ADMIN role.
     * PUT /api/flights/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Flight> updateFlight(@PathVariable Long id, @RequestBody Flight flightDetails) {
        return flightService.getFlightById(id)
                .map(existingFlight -> {
                    // Update fields
                    existingFlight.setFlightNumber(flightDetails.getFlightNumber());
                    existingFlight.setAirline(flightDetails.getAirline());
                    existingFlight.setDepartureCity(flightDetails.getDepartureCity());
                    existingFlight.setArrivalCity(flightDetails.getArrivalCity());
                    existingFlight.setDepartureTime(flightDetails.getDepartureTime());
                    existingFlight.setArrivalTime(flightDetails.getArrivalTime());
                    existingFlight.setPrice(flightDetails.getPrice());
                    existingFlight.setAvailableSeats(flightDetails.getAvailableSeats());

                    Flight updatedFlight = flightService.saveFlight(existingFlight);
                    return ResponseEntity.ok(updatedFlight);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Deletes a flight by its ID. Secured ONLY for ADMIN role.
     * DELETE /api/flights/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFlight(@PathVariable Long id) {
        if (flightService.getFlightById(id).isPresent()) {
            flightService.deleteFlight(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
