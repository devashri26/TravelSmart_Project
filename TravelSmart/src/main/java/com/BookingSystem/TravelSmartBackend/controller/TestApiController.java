package com.BookingSystem.TravelSmartBackend.controller;

import com.BookingSystem.TravelSmartBackend.service.external.ExternalFlightService;
import com.BookingSystem.TravelSmartBackend.service.external.ExternalTrainService;
import com.BookingSystem.TravelSmartBackend.service.external.ExternalBusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Test controller to verify external API integration
 * Remove this in production
 */
@RestController
@RequestMapping("/api/test")
public class TestApiController {
    
    @Autowired
    private ExternalFlightService externalFlightService;
    
    @Autowired
    private ExternalTrainService externalTrainService;
    
    @Autowired
    private ExternalBusService externalBusService;
    
    @GetMapping("/flights")
    public ResponseEntity<Map<String, Object>> testFlights(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam String date) {
        
        Map<String, Object> response = new HashMap<>();
        try {
            var flights = externalFlightService.searchLiveFlights(from, to, date);
            response.put("success", true);
            response.put("count", flights.size());
            response.put("flights", flights);
            response.put("message", "Successfully fetched flights from AviationStack");
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/trains")
    public ResponseEntity<Map<String, Object>> testTrains(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam String date) {
        
        Map<String, Object> response = new HashMap<>();
        try {
            var trains = externalTrainService.searchLiveTrains(from, to, date);
            response.put("success", true);
            response.put("count", trains.size());
            response.put("trains", trains);
            response.put("message", "Successfully fetched trains from RapidAPI");
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/buses")
    public ResponseEntity<Map<String, Object>> testBuses(
            @RequestParam String from,
            @RequestParam String to) {
        
        Map<String, Object> response = new HashMap<>();
        try {
            var buses = externalBusService.searchLiveBuses(from, to);
            response.put("success", true);
            response.put("count", buses.size());
            response.put("buses", buses);
            response.put("message", "MSRTC data requires manual import");
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        return ResponseEntity.ok(response);
    }
}
