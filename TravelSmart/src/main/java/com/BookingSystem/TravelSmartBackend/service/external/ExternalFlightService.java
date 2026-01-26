package com.BookingSystem.TravelSmartBackend.service.external;

import com.BookingSystem.TravelSmartBackend.dto.external.ExternalFlightDTO;
import com.BookingSystem.TravelSmartBackend.model.Flight;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Service to fetch live flight data from AviationStack API
 */
@Service
public class ExternalFlightService {
    
    private static final Logger log = LoggerFactory.getLogger(ExternalFlightService.class);
    
    private final WebClient webClient;
    
    @Value("${aviationstack.api.key}")
    private String apiKey;
    
    @Value("${aviationstack.api.url}")
    private String apiUrl;
    
    public ExternalFlightService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }
    
    /**
     * Search for live flights from AviationStack API
     * Results are cached for 1 hour to save API calls
     */
    @Cacheable(value = "flights", key = "#from + '-' + #to + '-' + #date")
    public List<Flight> searchLiveFlights(String from, String to, String date) {
        log.info("Fetching live flights from AviationStack: {} -> {} on {}", from, to, date);
        
        // Check if API key is configured
        if (apiKey == null || apiKey.equals("YOUR_AVIATIONSTACK_API_KEY_HERE")) {
            log.warn("AviationStack API key not configured, skipping live flight search");
            return new ArrayList<>();
        }
        
        try {
            // Call AviationStack API
            Map<String, Object> response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                    .scheme("http")
                    .host("api.aviationstack.com")
                    .path("/v1/flights")
                    .queryParam("access_key", apiKey)
                    .queryParam("dep_iata", from)
                    .queryParam("arr_iata", to)
                    .queryParam("flight_date", date)
                    .queryParam("limit", 10)
                    .build())
                .retrieve()
                .bodyToMono(Map.class)
                .onErrorResume(error -> {
                    log.error("Error calling AviationStack API: {}", error.getMessage());
                    return Mono.just(Map.of());
                })
                .block();
            
            if (response == null || !response.containsKey("data")) {
                log.warn("No data received from AviationStack API");
                return new ArrayList<>();
            }
            
            List<Map<String, Object>> flightData = (List<Map<String, Object>>) response.get("data");
            List<Flight> flights = new ArrayList<>();
            
            for (Map<String, Object> flightMap : flightData) {
                try {
                    Flight flight = convertToFlight(flightMap);
                    if (flight != null) {
                        flights.add(flight);
                    }
                } catch (Exception e) {
                    log.error("Error converting flight data: {}", e.getMessage());
                }
            }
            
            log.info("Found {} live flights from AviationStack", flights.size());
            return flights;
            
        } catch (Exception e) {
            log.error("Error fetching live flights: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }
    
    /**
     * Convert AviationStack API response to Flight entity
     */
    private Flight convertToFlight(Map<String, Object> flightMap) {
        try {
            Map<String, Object> flightInfo = (Map<String, Object>) flightMap.get("flight");
            Map<String, Object> airline = (Map<String, Object>) flightMap.get("airline");
            Map<String, Object> departure = (Map<String, Object>) flightMap.get("departure");
            Map<String, Object> arrival = (Map<String, Object>) flightMap.get("arrival");
            
            Flight flight = new Flight();
            flight.setFlightNumber((String) flightInfo.get("iata"));
            flight.setAirline((String) airline.get("name"));
            flight.setDepartureCity((String) departure.get("airport"));
            flight.setArrivalCity((String) arrival.get("airport"));
            
            // Parse times
            String depTime = (String) departure.get("scheduled");
            String arrTime = (String) arrival.get("scheduled");
            
            if (depTime != null && arrTime != null) {
                flight.setDepartureTime(LocalDateTime.parse(depTime, DateTimeFormatter.ISO_DATE_TIME));
                flight.setArrivalTime(LocalDateTime.parse(arrTime, DateTimeFormatter.ISO_DATE_TIME));
            }
            
            // Set default values for price and seats (not provided by free API)
            flight.setPrice(new java.math.BigDecimal("5000.00")); // Default price
            flight.setAvailableSeats(100); // Default seats
            
            return flight;
        } catch (Exception e) {
            log.error("Error parsing flight data: {}", e.getMessage());
            return null;
        }
    }
}
