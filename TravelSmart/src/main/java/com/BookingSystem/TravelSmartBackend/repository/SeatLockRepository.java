package com.BookingSystem.TravelSmartBackend.repository;

import com.BookingSystem.TravelSmartBackend.model.SeatLock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SeatLockRepository extends JpaRepository<SeatLock, Long> {
    
    // Find active lock for a specific seat
    @Query("SELECT sl FROM SeatLock sl WHERE sl.seatId = :seatId AND sl.inventoryType = :inventoryType " +
           "AND sl.inventoryId = :inventoryId AND sl.status = 'LOCKED' AND sl.expiresAt > :now")
    Optional<SeatLock> findActiveLock(@Param("seatId") String seatId,
                                       @Param("inventoryType") String inventoryType,
                                       @Param("inventoryId") Long inventoryId,
                                       @Param("now") LocalDateTime now);
    
    // Find any lock (LOCKED or BOOKED) for a specific seat
    @Query("SELECT sl FROM SeatLock sl WHERE sl.seatId = :seatId AND sl.inventoryType = :inventoryType " +
           "AND sl.inventoryId = :inventoryId AND sl.status IN ('LOCKED', 'BOOKED')")
    Optional<SeatLock> findAnyLockForSeat(@Param("seatId") String seatId,
                                           @Param("inventoryType") String inventoryType,
                                           @Param("inventoryId") Long inventoryId);
    
    // Find all active locks for an inventory
    @Query("SELECT sl FROM SeatLock sl WHERE sl.inventoryType = :inventoryType " +
           "AND sl.inventoryId = :inventoryId AND sl.status = 'LOCKED' AND sl.expiresAt > :now")
    List<SeatLock> findActiveLocksForInventory(@Param("inventoryType") String inventoryType,
                                                @Param("inventoryId") Long inventoryId,
                                                @Param("now") LocalDateTime now);
    
    // Find all locked AND booked seats for an inventory (to show as unavailable)
    @Query("SELECT sl FROM SeatLock sl WHERE sl.inventoryType = :inventoryType " +
           "AND sl.inventoryId = :inventoryId AND sl.status IN ('LOCKED', 'BOOKED')")
    List<SeatLock> findUnavailableSeatsForInventory(@Param("inventoryType") String inventoryType,
                                                     @Param("inventoryId") Long inventoryId);
    
    // Find user's active locks
    @Query("SELECT sl FROM SeatLock sl WHERE sl.userId = :userId AND sl.sessionId = :sessionId " +
           "AND sl.status = 'LOCKED' AND sl.expiresAt > :now")
    List<SeatLock> findUserActiveLocks(@Param("userId") Long userId,
                                        @Param("sessionId") String sessionId,
                                        @Param("now") LocalDateTime now);
    
    // Find expired locks
    @Query("SELECT sl FROM SeatLock sl WHERE sl.status = 'LOCKED' AND sl.expiresAt <= :now")
    List<SeatLock> findExpiredLocks(@Param("now") LocalDateTime now);
    
    // Release expired locks
    @Modifying
    @Query("UPDATE SeatLock sl SET sl.status = 'EXPIRED' WHERE sl.status = 'LOCKED' AND sl.expiresAt <= :now")
    int releaseExpiredLocks(@Param("now") LocalDateTime now);
    
    // Release user's locks
    @Modifying
    @Query("UPDATE SeatLock sl SET sl.status = 'EXPIRED' WHERE sl.userId = :userId " +
           "AND sl.sessionId = :sessionId AND sl.status = 'LOCKED'")
    int releaseUserLocks(@Param("userId") Long userId, @Param("sessionId") String sessionId);
    
    // Mark locks as booked
    @Modifying
    @Query("UPDATE SeatLock sl SET sl.status = 'BOOKED' WHERE sl.userId = :userId " +
           "AND sl.sessionId = :sessionId AND sl.status = 'LOCKED'")
    int markLocksAsBooked(@Param("userId") Long userId, @Param("sessionId") String sessionId);
    
    // Delete old expired locks (cleanup)
    @Modifying
    @Query("DELETE FROM SeatLock sl WHERE sl.status = 'EXPIRED' AND sl.updatedAt < :cutoffDate")
    int deleteOldExpiredLocks(@Param("cutoffDate") LocalDateTime cutoffDate);
}
