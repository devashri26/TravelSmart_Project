package com.BookingSystem.TravelSmartBackend.controller;

import com.BookingSystem.TravelSmartBackend.model.Traveler;
import com.BookingSystem.TravelSmartBackend.model.User;
import com.BookingSystem.TravelSmartBackend.service.TravelerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/travelers")
@CrossOrigin(origins = "*")
public class TravelerController {
    
    private final TravelerService travelerService;
    
    public TravelerController(TravelerService travelerService) {
        this.travelerService = travelerService;
    }
    
    @GetMapping
    public ResponseEntity<List<Traveler>> getUserTravelers(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(travelerService.getUserTravelers(user.getId()));
    }
    
    @PostMapping
    public ResponseEntity<Traveler> addTraveler(
            @AuthenticationPrincipal User user,
            @RequestBody Traveler traveler) {
        traveler.setUser(user);
        return ResponseEntity.ok(travelerService.addTraveler(traveler));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Traveler> updateTraveler(
            @PathVariable Long id,
            @RequestBody Traveler traveler) {
        return ResponseEntity.ok(travelerService.updateTraveler(id, traveler));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTraveler(@PathVariable Long id) {
        travelerService.deleteTraveler(id);
        return ResponseEntity.ok(Map.of("message", "Traveler deleted successfully"));
    }
}
