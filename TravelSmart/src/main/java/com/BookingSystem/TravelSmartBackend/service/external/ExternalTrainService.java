package com.BookingSystem.TravelSmartBackend.service.external;

import com.BookingSystem.TravelSmartBackend.model.Train;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Service to fetch live train data from RapidAPI
 */
@Service
public class ExternalTrainService {
    
    private static final Logger log = LoggerFactory.getLogger(ExternalTrainService.class);
    
    private final WebClient webClient;
    
    @Value("${rapidapi.api.key}")
    private String apiKey;
    
    @Value("${rapidapi.train.url}")
    private String apiUrl;
    
    public ExternalTrainService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }
    
    /**
     * Search for live trains from RapidAPI
     * Results are cached for 1 hour
     */
    @Cacheable(value = "trains", key = "#from + '-' + #to + '-' + #date")
    public List<Train> searchLiveTrains(String from, String to, String date) {
        log.info("Fetching live trains from RapidAPI: {} -> {} on {}", from, to, date);
        
        // Check if API key is configured
        if (apiKey == null || apiKey.equals("YOUR_RAPIDAPI_KEY_HERE")) {
            log.warn("RapidAPI key not configured, skipping live train search");
            return new ArrayList<>();
        }
        
        try {
            // Call RapidAPI
            Map<String, Object> response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                    .scheme("https")
                    .host("indian-railway-api.p.rapidapi.com")
                    .path("/trains/between")
                    .queryParam("from", from)
                    .queryParam("to", to)
                    .build())
                .header("X-RapidAPI-Key", apiKey)
                .header("X-RapidAPI-Host", "indian-railway-api.p.rapidapi.com")
                .retrieve()
                .bodyToMono(Map.class)
                .onErrorResume(error -> {
                    log.error("Error calling RapidAPI: {}", error.getMessage());
                    return Mono.just(Map.of());
                })
                .block();
            
            if (response == null || !response.containsKey("trains")) {
                log.warn("No train data received from RapidAPI");
                return new ArrayList<>();
            }
            
            List<Map<String, Object>> trainData = (List<Map<String, Object>>) response.get("trains");
            List<Train> trains = new ArrayList<>();
            
            for (Map<String, Object> trainMap : trainData) {
                try {
                    Train train = convertToTrain(trainMap, date);
                    if (train != null) {
                        trains.add(train);
                    }
                } catch (Exception e) {
                    log.error("Error converting train data: {}", e.getMessage());
                }
            }
            
            log.info("Found {} live trains from RapidAPI", trains.size());
            return trains;
            
        } catch (Exception e) {
            log.error("Error fetching live trains: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }
    
    /**
     * Convert RapidAPI response to Train entity
     */
    private Train convertToTrain(Map<String, Object> trainMap, String date) {
        try {
            Train train = new Train();
            train.setTrainNumber((String) trainMap.get("train_number"));
            train.setTrainName((String) trainMap.get("train_name"));
            train.setOrigin((String) trainMap.get("from_station"));
            train.setDestination((String) trainMap.get("to_station"));
            
            // Parse times and combine with date
            String depTime = (String) trainMap.get("departure_time");
            String arrTime = (String) trainMap.get("arrival_time");
            
            if (depTime != null && arrTime != null) {
                LocalDateTime baseDate = LocalDateTime.parse(date + "T00:00:00");
                LocalTime depLocalTime = LocalTime.parse(depTime, DateTimeFormatter.ofPattern("HH:mm"));
                LocalTime arrLocalTime = LocalTime.parse(arrTime, DateTimeFormatter.ofPattern("HH:mm"));
                
                train.setDepartureTime(baseDate.with(depLocalTime));
                train.setArrivalTime(baseDate.with(arrLocalTime));
                
                // If arrival is before departure, it's next day
                if (train.getArrivalTime().isBefore(train.getDepartureTime())) {
                    train.setArrivalTime(train.getArrivalTime().plusDays(1));
                }
            }
            
            // Set default values
            train.setPrice(1500.0); // Default price
            train.setAvailableSeats(72); // Default seats
            
            return train;
        } catch (Exception e) {
            log.error("Error parsing train data: {}", e.getMessage());
            return null;
        }
    }
}
