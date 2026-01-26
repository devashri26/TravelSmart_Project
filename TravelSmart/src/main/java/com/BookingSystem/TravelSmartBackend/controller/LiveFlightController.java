package com.BookingSystem.TravelSmartBackend.controller;

import com.BookingSystem.TravelSmartBackend.service.AviationStackService;
import com.BookingSystem.TravelSmartBackend.service.AviationStackService.FlightData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/live-flights")
@CrossOrigin(origins = "*")
public class LiveFlightController {
    
    @Autowired
    private AviationStackService aviationStackService;
    
    /**
     * Search live flights by route
     * Example: GET /api/v1/live-flights/search?from=DEL&to=BOM
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchLiveFlights(
            @RequestParam String from,
            @RequestParam String to) {
        
        try {
            List<FlightData> flights = aviationStackService.searchFlights(from, to);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", flights.size());
            response.put("flights", flights);
            response.put("route", from + " → " + to);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to fetch live flights: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    /**
     * Get live status of a specific flight
     * Example: GET /api/v1/live-flights/status/AI101
     */
    @GetMapping("/status/{flightNumber}")
    public ResponseEntity<Map<String, Object>> getFlightStatus(@PathVariable String flightNumber) {
        
        try {
            FlightData flight = aviationStackService.getFlightStatus(flightNumber);
            
            Map<String, Object> response = new HashMap<>();
            if (flight != null) {
                response.put("success", true);
                response.put("flight", flight);
            } else {
                response.put("success", false);
                response.put("message", "Flight not found");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to fetch flight status: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    /**
     * Get popular routes with IATA codes
     */
    @GetMapping("/routes")
    public ResponseEntity<Map<String, Object>> getPopularRoutes() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("routes", List.of(
            Map.of("from", "DEL", "to", "BOM", "fromName", "Delhi", "toName", "Mumbai"),
            Map.of("from", "DEL", "to", "BLR", "fromName", "Delhi", "toName", "Bangalore"),
            Map.of("from", "BOM", "to", "BLR", "fromName", "Mumbai", "toName", "Bangalore"),
            Map.of("from", "DEL", "to", "MAA", "fromName", "Delhi", "toName", "Chennai"),
            Map.of("from", "BOM", "to", "GOI", "fromName", "Mumbai", "toName", "Goa"),
            Map.of("from", "DEL", "to", "CCU", "fromName", "Delhi", "toName", "Kolkata"),
            Map.of("from", "BOM", "to", "HYD", "fromName", "Mumbai", "toName", "Hyderabad"),
            Map.of("from", "DEL", "to", "AMD", "fromName", "Delhi", "toName", "Ahmedabad")
        ));
        return ResponseEntity.ok(response);
    }
}
