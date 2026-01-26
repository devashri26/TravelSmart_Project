package com.BookingSystem.TravelSmartBackend.controller;

import com.BookingSystem.TravelSmartBackend.model.SeatLock;
import com.BookingSystem.TravelSmartBackend.service.SeatLockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/seat-locks")
@CrossOrigin(origins = "*")
public class SeatLockController {
    
    private final SeatLockService seatLockService;
    
    public SeatLockController(SeatLockService seatLockService) {
        this.seatLockService = seatLockService;
    }
    
    /**
     * Lock a single seat
     */
    @PostMapping("/lock")
    public ResponseEntity<?> lockSeat(@RequestBody LockSeatRequest request) {
        try {
            SeatLock lock = seatLockService.lockSeat(
                request.getSeatId(),
                request.getInventoryType(),
                request.getInventoryId(),
                request.getUserId(),
                request.getSessionId(),
                request.getPrice()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("lock", lock);
            response.put("expiresIn", seatLockService.getTimeRemaining(lock));
            response.put("message", "Seat locked successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error locking seat: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Lock multiple seats
     */
    @PostMapping("/lock-multiple")
    public ResponseEntity<?> lockMultipleSeats(@RequestBody LockMultipleSeatsRequest request) {
        try {
            List<SeatLock> locks = seatLockService.lockSeats(
                request.getSeatIds(),
                request.getInventoryType(),
                request.getInventoryId(),
                request.getUserId(),
                request.getSessionId(),
                request.getPrices()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("locks", locks);
            response.put("expiresIn", locks.isEmpty() ? 0 : seatLockService.getTimeRemaining(locks.get(0)));
            response.put("message", locks.size() + " seats locked successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error locking seats: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Unlock a seat
     */
    @PostMapping("/unlock")
    public ResponseEntity<?> unlockSeat(@RequestBody UnlockSeatRequest request) {
        try {
            seatLockService.unlockSeat(
                request.getSeatId(),
                request.getInventoryType(),
                request.getInventoryId(),
                request.getUserId(),
                request.getSessionId()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Seat unlocked successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error unlocking seat: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Release all user locks
     */
    @PostMapping("/release-user-locks")
    public ResponseEntity<?> releaseUserLocks(@RequestBody ReleaseLocksRequest request) {
        try {
            int released = seatLockService.releaseUserLocks(request.getUserId(), request.getSessionId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("released", released);
            response.put("message", released + " locks released");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error releasing locks: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Get locked seats for an inventory
     */
    @GetMapping("/locked-seats")
    public ResponseEntity<?> getLockedSeats(
            @RequestParam String inventoryType,
            @RequestParam Long inventoryId) {
        try {
            List<SeatLock> allLocks = seatLockService.getAllUnavailableSeats(inventoryType, inventoryId);
            
            // Separate into locked (temporary) and booked (permanent)
            List<String> lockedSeats = allLocks.stream()
                .filter(lock -> "LOCKED".equals(lock.getStatus()))
                .map(SeatLock::getSeatId)
                .collect(Collectors.toList());
                
            List<String> bookedSeats = allLocks.stream()
                .filter(lock -> "BOOKED".equals(lock.getStatus()))
                .map(SeatLock::getSeatId)
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("lockedSeats", lockedSeats);  // Temporarily locked by other users
            response.put("bookedSeats", bookedSeats);  // Permanently booked
            response.put("allUnavailable", allLocks.stream().map(SeatLock::getSeatId).collect(Collectors.toList()));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error getting locked seats: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Get user's active locks
     */
    @GetMapping("/user-locks")
    public ResponseEntity<?> getUserLocks(
            @RequestParam Long userId,
            @RequestParam String sessionId) {
        try {
            List<SeatLock> locks = seatLockService.getUserActiveLocks(userId, sessionId);
            
            List<Map<String, Object>> locksWithTime = locks.stream()
                .map(lock -> {
                    Map<String, Object> lockData = new HashMap<>();
                    lockData.put("lock", lock);
                    lockData.put("expiresIn", seatLockService.getTimeRemaining(lock));
                    return lockData;
                })
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("locks", locksWithTime);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error getting user locks: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Mark locks as booked (after payment)
     */
    @PostMapping("/mark-booked")
    public ResponseEntity<?> markAsBooked(@RequestBody ReleaseLocksRequest request) {
        try {
            int marked = seatLockService.markLocksAsBooked(request.getUserId(), request.getSessionId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("marked", marked);
            response.put("message", marked + " locks marked as booked");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error marking locks as booked: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Check if seat is available
     */
    @GetMapping("/check-availability")
    public ResponseEntity<?> checkAvailability(
            @RequestParam String seatId,
            @RequestParam String inventoryType,
            @RequestParam Long inventoryId) {
        try {
            boolean available = seatLockService.isSeatAvailable(seatId, inventoryType, inventoryId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("available", available);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error checking availability: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}

// Request DTOs
class LockSeatRequest {
    private String seatId;
    private String inventoryType;
    private Long inventoryId;
    private Long userId;
    private String sessionId;
    private Double price;
    
    public String getSeatId() { return seatId; }
    public void setSeatId(String seatId) { this.seatId = seatId; }
    public String getInventoryType() { return inventoryType; }
    public void setInventoryType(String inventoryType) { this.inventoryType = inventoryType; }
    public Long getInventoryId() { return inventoryId; }
    public void setInventoryId(Long inventoryId) { this.inventoryId = inventoryId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}

class LockMultipleSeatsRequest {
    private List<String> seatIds;
    private String inventoryType;
    private Long inventoryId;
    private Long userId;
    private String sessionId;
    private List<Double> prices;
    
    public List<String> getSeatIds() { return seatIds; }
    public void setSeatIds(List<String> seatIds) { this.seatIds = seatIds; }
    public String getInventoryType() { return inventoryType; }
    public void setInventoryType(String inventoryType) { this.inventoryType = inventoryType; }
    public Long getInventoryId() { return inventoryId; }
    public void setInventoryId(Long inventoryId) { this.inventoryId = inventoryId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public List<Double> getPrices() { return prices; }
    public void setPrices(List<Double> prices) { this.prices = prices; }
}

class UnlockSeatRequest {
    private String seatId;
    private String inventoryType;
    private Long inventoryId;
    private Long userId;
    private String sessionId;
    
    public String getSeatId() { return seatId; }
    public void setSeatId(String seatId) { this.seatId = seatId; }
    public String getInventoryType() { return inventoryType; }
    public void setInventoryType(String inventoryType) { this.inventoryType = inventoryType; }
    public Long getInventoryId() { return inventoryId; }
    public void setInventoryId(Long inventoryId) { this.inventoryId = inventoryId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
}

class ReleaseLocksRequest {
    private Long userId;
    private String sessionId;
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
}
