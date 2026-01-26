package com.BookingSystem.TravelSmartBackend.controller;

import com.BookingSystem.TravelSmartBackend.model.Cancellation;
import com.BookingSystem.TravelSmartBackend.service.CancellationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/cancellations")
@CrossOrigin(origins = "*")
public class CancellationController {
    
    private final CancellationService cancellationService;
    
    public CancellationController(CancellationService cancellationService) {
        this.cancellationService = cancellationService;
    }
    
    @PostMapping("/cancel/{bookingId}")
    public ResponseEntity<Cancellation> cancelBooking(
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> request) {
        String reason = request.getOrDefault("reason", "User requested cancellation");
        Cancellation cancellation = cancellationService.cancelBooking(bookingId, reason);
        return ResponseEntity.ok(cancellation);
    }
    
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Cancellation> getCancellationDetails(@PathVariable Long bookingId) {
        Cancellation cancellation = cancellationService.getCancellationDetails(bookingId);
        return ResponseEntity.ok(cancellation);
    }
}
