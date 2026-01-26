package com.BookingSystem.TravelSmartBackend.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * DTO for RapidAPI Indian Railway API response
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExternalTrainDTO {
    
    @JsonProperty("train_number")
    private String trainNumber;
    
    @JsonProperty("train_name")
    private String trainName;
    
    @JsonProperty("from_station")
    private String fromStation;
    
    @JsonProperty("to_station")
    private String toStation;
    
    @JsonProperty("departure_time")
    private String departureTime;
    
    @JsonProperty("arrival_time")
    private String arrivalTime;
    
    @JsonProperty("duration")
    private String duration;
    
    @JsonProperty("available_classes")
    private String[] availableClasses;
}
