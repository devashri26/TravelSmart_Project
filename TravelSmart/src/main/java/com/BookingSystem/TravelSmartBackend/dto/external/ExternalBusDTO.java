package com.BookingSystem.TravelSmartBackend.dto.external;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * DTO for MSRTC Government Data
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExternalBusDTO {
    
    @JsonProperty("route_number")
    private String routeNumber;
    
    @JsonProperty("route_name")
    private String routeName;
    
    @JsonProperty("source")
    private String source;
    
    @JsonProperty("destination")
    private String destination;
    
    @JsonProperty("distance")
    private Double distance;
    
    @JsonProperty("stoppages")
    private String stoppages;
}
