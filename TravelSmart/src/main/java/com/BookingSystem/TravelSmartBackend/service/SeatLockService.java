package com.BookingSystem.TravelSmartBackend.service;

import com.BookingSystem.TravelSmartBackend.model.SeatLock;
import com.BookingSystem.TravelSmartBackend.repository.SeatLockRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatLockService {
    
    private final SeatLockRepository seatLockRepository;
    
    public SeatLockService(SeatLockRepository seatLockRepository) {
        this.seatLockRepository = seatLockRepository;
    }
    
    // Lock duration in minutes (10 minutes like RedBus/MakeMyTrip)
    private static final int LOCK_DURATION_MINUTES = 10;
    
    /**
     * Lock a seat for a user
     */
    @Transactional
    public SeatLock lockSeat(String seatId, String inventoryType, Long inventoryId, 
                             Long userId, String sessionId, Double price) {
        
        // Check if seat is already locked or booked
        var existingLock = seatLockRepository.findAnyLockForSeat(
            seatId, inventoryType, inventoryId
        );
        
        if (existingLock.isPresent()) {
            SeatLock lock = existingLock.get();
            
            // If seat is permanently booked, cannot lock it
            if ("BOOKED".equals(lock.getStatus())) {
                throw new RuntimeException("Seat " + seatId + " is already booked");
            }
            
            // If locked by same user/session, extend the lock
            if (lock.getUserId().equals(userId) && lock.getSessionId().equals(sessionId)) {
                lock.setExpiresAt(LocalDateTime.now().plusMinutes(LOCK_DURATION_MINUTES));
                return seatLockRepository.save(lock);
            }
            
            // If locked by another user but not expired, cannot lock
            if (lock.getExpiresAt().isAfter(LocalDateTime.now())) {
                throw new RuntimeException("Seat " + seatId + " is already locked by another user");
            }
        }
        
        // Create new lock
        SeatLock seatLock = new SeatLock();
        seatLock.setSeatId(seatId);
        seatLock.setInventoryType(inventoryType);
        seatLock.setInventoryId(inventoryId);
        seatLock.setUserId(userId);
        seatLock.setSessionId(sessionId);
        seatLock.setLockedAt(LocalDateTime.now());
        seatLock.setExpiresAt(LocalDateTime.now().plusMinutes(LOCK_DURATION_MINUTES));
        seatLock.setStatus("LOCKED");
        seatLock.setPrice(price);
        
        System.out.println("Locking seat " + seatId + " for user " + userId + " until " + seatLock.getExpiresAt());
        return seatLockRepository.save(seatLock);
    }
    
    /**
     * Lock multiple seats at once
     */
    @Transactional
    public List<SeatLock> lockSeats(List<String> seatIds, String inventoryType, Long inventoryId,
                                    Long userId, String sessionId, List<Double> prices) {
        
        return seatIds.stream()
            .map(seatId -> {
                int index = seatIds.indexOf(seatId);
                Double price = prices != null && index < prices.size() ? prices.get(index) : 0.0;
                return lockSeat(seatId, inventoryType, inventoryId, userId, sessionId, price);
            })
            .collect(Collectors.toList());
    }
    
    /**
     * Unlock a specific seat
     */
    @Transactional
    public void unlockSeat(String seatId, String inventoryType, Long inventoryId, 
                           Long userId, String sessionId) {
        
        var lock = seatLockRepository.findActiveLock(
            seatId, inventoryType, inventoryId, LocalDateTime.now()
        );
        
        if (lock.isPresent()) {
            SeatLock seatLock = lock.get();
            if (seatLock.getUserId().equals(userId) && seatLock.getSessionId().equals(sessionId)) {
                seatLock.setStatus("EXPIRED");
                seatLockRepository.save(seatLock);
                System.out.println("Unlocked seat " + seatId + " for user " + userId);
            }
        }
    }
    
    /**
     * Release all locks for a user session
     */
    @Transactional
    public int releaseUserLocks(Long userId, String sessionId) {
        System.out.println("Releasing all locks for user " + userId + " session " + sessionId);
        return seatLockRepository.releaseUserLocks(userId, sessionId);
    }
    
    /**
     * Get all locked seats for an inventory (to show as unavailable)
     * This includes both LOCKED (temporarily held) and BOOKED (permanently booked) seats
     */
    public List<String> getLockedSeats(String inventoryType, Long inventoryId) {
        return seatLockRepository.findUnavailableSeatsForInventory(
            inventoryType, inventoryId
        ).stream()
        .map(SeatLock::getSeatId)
        .collect(Collectors.toList());
    }
    
    /**
     * Get all unavailable seats with their full details (status, etc.)
     */
    public List<SeatLock> getAllUnavailableSeats(String inventoryType, Long inventoryId) {
        return seatLockRepository.findUnavailableSeatsForInventory(
            inventoryType, inventoryId
        );
    }
    
    /**
     * Get user's active locks with time remaining
     */
    public List<SeatLock> getUserActiveLocks(Long userId, String sessionId) {
        return seatLockRepository.findUserActiveLocks(userId, sessionId, LocalDateTime.now());
    }
    
    /**
     * Mark locks as booked (called after successful payment)
     */
    @Transactional
    public int markLocksAsBooked(Long userId, String sessionId) {
        System.out.println("Marking locks as booked for user " + userId + " session " + sessionId);
        return seatLockRepository.markLocksAsBooked(userId, sessionId);
    }
    
    /**
     * Scheduled task to release expired locks every minute
     */
    @Scheduled(fixedRate = 60000) // Run every 60 seconds
    @Transactional
    public void releaseExpiredLocks() {
        int released = seatLockRepository.releaseExpiredLocks(LocalDateTime.now());
        if (released > 0) {
            System.out.println("Released " + released + " expired seat locks");
        }
    }
    
    /**
     * Cleanup old expired locks (run daily)
     */
    @Scheduled(cron = "0 0 2 * * *") // Run at 2 AM daily
    @Transactional
    public void cleanupOldLocks() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(7);
        int deleted = seatLockRepository.deleteOldExpiredLocks(cutoffDate);
        if (deleted > 0) {
            System.out.println("Cleaned up " + deleted + " old expired locks");
        }
    }
    
    /**
     * Check if a seat is available (not locked or booked)
     */
    public boolean isSeatAvailable(String seatId, String inventoryType, Long inventoryId) {
        return seatLockRepository.findAnyLockForSeat(
            seatId, inventoryType, inventoryId
        ).isEmpty();
    }
    
    /**
     * Get time remaining for a lock in seconds
     */
    public long getTimeRemaining(SeatLock lock) {
        if (lock.isExpired()) {
            return 0;
        }
        return java.time.Duration.between(LocalDateTime.now(), lock.getExpiresAt()).getSeconds();
    }
}
