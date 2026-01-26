package com.BookingSystem.TravelSmartBackend.service;

import com.BookingSystem.TravelSmartBackend.model.Flight;
import com.BookingSystem.TravelSmartBackend.repository.FlightRepository;
import com.BookingSystem.TravelSmartBackend.service.external.ExternalFlightService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FlightService {

    private static final Logger log = LoggerFactory.getLogger(FlightService.class);

    @Autowired
    private FlightRepository flightRepository;
    
    @Autowired
    private ExternalFlightService externalFlightService;

    // --- Admin CRUD Operations ---

    public Flight saveFlight(Flight flight) {
        return flightRepository.save(flight);
    }

    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    public Optional<Flight> getFlightById(Long id) {
        return flightRepository.findById(id);
    }

    public void deleteFlight(Long id) {
        flightRepository.deleteById(id);
    }

    // --- Public Search Operation ---

    /**
     * Searches for flights based on origin, destination, and date.
     * Combines local database flights with live data from external API.
     * 
     * @param departureCity The city of departure.
     * @param arrivalCity The city of arrival.
     * @param date A LocalDateTime object (often set to midnight of the search day).
     * @return List of matching flights from both local and external sources.
     */
    public List<Flight> searchFlights(String departureCity, String arrivalCity, LocalDateTime date) {
        log.info("Searching flights: {} -> {} on {}", departureCity, arrivalCity, date);
        
        // Get local database flights
        List<Flight> localFlights = flightRepository.searchAvailableFlights(departureCity, arrivalCity, date);
        log.info("Found {} flights from local database", localFlights.size());
        
        // Get live flights from external API
        try {
            String dateStr = date.toLocalDate().toString();
            List<Flight> liveFlights = externalFlightService.searchLiveFlights(
                departureCity, arrivalCity, dateStr);
            log.info("Found {} flights from external API", liveFlights.size());
            
            // Merge both lists
            List<Flight> allFlights = new ArrayList<>(localFlights);
            allFlights.addAll(liveFlights);
            
            log.info("Total flights found: {}", allFlights.size());
            return allFlights;
        } catch (Exception e) {
            log.error("Error fetching live flights, returning local flights only: {}", e.getMessage());
            return localFlights;
        }
    }
    
    // ==================== ADMIN METHODS ====================
    
    public org.springframework.data.domain.Page<Flight> getAllFlights(String search, org.springframework.data.domain.Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            return flightRepository.findByFlightNumberContainingIgnoreCaseOrAirlineContainingIgnoreCaseOrDepartureCityContainingIgnoreCaseOrArrivalCityContainingIgnoreCase(
                    search, search, search, search, pageable);
        }
        return flightRepository.findAll(pageable);
    }
    
    public Flight createFlight(Flight flight) {
        return flightRepository.save(flight);
    }
    
    public Flight updateFlight(Long id, Flight flightDetails) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found"));
        
        flight.setFlightNumber(flightDetails.getFlightNumber());
        flight.setAirline(flightDetails.getAirline());
        flight.setDepartureCity(flightDetails.getDepartureCity());
        flight.setArrivalCity(flightDetails.getArrivalCity());
        flight.setDepartureTime(flightDetails.getDepartureTime());
        flight.setArrivalTime(flightDetails.getArrivalTime());
        flight.setPrice(flightDetails.getPrice());
        flight.setAvailableSeats(flightDetails.getAvailableSeats());
        
        return flightRepository.save(flight);
    }
}
