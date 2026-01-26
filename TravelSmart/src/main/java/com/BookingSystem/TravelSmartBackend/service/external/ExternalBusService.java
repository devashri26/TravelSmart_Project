package com.BookingSystem.TravelSmartBackend.service.external;

import com.BookingSystem.TravelSmartBackend.model.Bus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Service to fetch bus data from MSRTC Government Open Data
 * Note: MSRTC data is static route information, not real-time schedules
 */
@Service
public class ExternalBusService {
    
    private static final Logger log = LoggerFactory.getLogger(ExternalBusService.class);
    
    private final WebClient webClient;
    
    @Value("${msrtc.data.url}")
    private String apiUrl;
    
    public ExternalBusService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }
    
    /**
     * Search for buses from MSRTC data
     * Results are cached for 1 hour
     * Note: This is static route data, not real-time schedules
     */
    @Cacheable(value = "buses", key = "#from + '-' + #to")
    public List<Bus> searchLiveBuses(String from, String to) {
        log.info("Fetching MSRTC bus routes: {} -> {}", from, to);
        
        try {
            // Note: MSRTC API might require authentication or specific parameters
            // This is a placeholder implementation
            // In production, you would download the CSV/JSON file and import to database
            
            log.info("MSRTC data integration requires manual data import");
            log.info("Download data from: https://data.gov.in/catalog/msrtc-route-directory");
            log.info("Import the CSV/JSON file to your database for bus routes");
            
            // Return empty list for now
            // In production, this would query your local database with imported MSRTC data
            return new ArrayList<>();
            
        } catch (Exception e) {
            log.error("Error fetching MSRTC bus data: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }
    
    /**
     * Convert MSRTC data to Bus entity
     * This would be used when importing the downloaded data
     */
    private Bus convertToBus(Map<String, Object> busMap, String date) {
        try {
            Bus bus = new Bus();
            bus.setBusNumber((String) busMap.get("route_number"));
            bus.setOperator("MSRTC");
            bus.setOrigin((String) busMap.get("source"));
            bus.setDestination((String) busMap.get("destination"));
            
            // Set default times (MSRTC data doesn't include schedules)
            LocalDateTime baseDate = LocalDateTime.parse(date + "T00:00:00");
            bus.setDepartureTime(baseDate.withHour(8).withMinute(0));
            bus.setArrivalTime(baseDate.withHour(12).withMinute(0));
            
            // Set default values
            bus.setPrice(500.0);
            bus.setAvailableSeats(45);
            
            return bus;
        } catch (Exception e) {
            log.error("Error parsing bus data: {}", e.getMessage());
            return null;
        }
    }
}
