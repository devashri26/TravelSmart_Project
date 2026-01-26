package com.BookingSystem.TravelSmartBackend.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO for AviationStack API flight response
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExternalFlightDTO {
    
    @JsonProperty("flight_date")
    private String flightDate;
    
    @JsonProperty("flight_status")
    private String flightStatus;
    
    @JsonProperty("departure")
    private DepartureInfo departure;
    
    @JsonProperty("arrival")
    private ArrivalInfo arrival;
    
    @JsonProperty("airline")
    private AirlineInfo airline;
    
    @JsonProperty("flight")
    private FlightInfo flight;
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DepartureInfo {
        @JsonProperty("airport")
        private String airport;
        
        @JsonProperty("iata")
        private String iata;
        
        @JsonProperty("scheduled")
        private String scheduled;
    }
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ArrivalInfo {
        @JsonProperty("airport")
        private String airport;
        
        @JsonProperty("iata")
        private String iata;
        
        @JsonProperty("scheduled")
        private String scheduled;
    }
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AirlineInfo {
        @JsonProperty("name")
        private String name;
    }
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class FlightInfo {
        @JsonProperty("number")
        private String number;
        
        @JsonProperty("iata")
        private String iata;
    }
}
