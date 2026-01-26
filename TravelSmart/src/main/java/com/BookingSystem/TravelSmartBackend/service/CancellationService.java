package com.BookingSystem.TravelSmartBackend.service;

import com.BookingSystem.TravelSmartBackend.model.Booking;
import com.BookingSystem.TravelSmartBackend.model.Cancellation;
import com.BookingSystem.TravelSmartBackend.model.Flight;
import com.BookingSystem.TravelSmartBackend.model.SeatLock;
import com.BookingSystem.TravelSmartBackend.repository.BookingRepository;
import com.BookingSystem.TravelSmartBackend.repository.CancellationRepository;
import com.BookingSystem.TravelSmartBackend.repository.FlightRepository;
import com.BookingSystem.TravelSmartBackend.repository.SeatLockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class CancellationService {
    
    private final CancellationRepository cancellationRepository;
    private final BookingRepository bookingRepository;
    private final WalletService walletService;
    private final FlightRepository flightRepository;
    private final SeatLockRepository seatLockRepository;
    
    public CancellationService(CancellationRepository cancellationRepository, BookingRepository bookingRepository, WalletService walletService, FlightRepository flightRepository, SeatLockRepository seatLockRepository) {
        this.cancellationRepository = cancellationRepository;
        this.bookingRepository = bookingRepository;
        this.walletService = walletService;
        this.flightRepository = flightRepository;
        this.seatLockRepository = seatLockRepository;
    }
    
    @Transactional
    public Cancellation cancelBooking(Long bookingId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if ("CANCELLED".equals(booking.getStatus())) {
            throw new RuntimeException("Booking already cancelled");
        }
        
        // Release seats back to flight inventory
        releaseSeats(booking);
        
        // Calculate cancellation charges based on time remaining
        Double cancellationCharge = calculateCancellationCharge(booking);
        Double refundAmount = booking.getTotalPrice().doubleValue() - cancellationCharge;
        
        // Update booking status
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
        
        // Create cancellation record
        Cancellation cancellation = new Cancellation();
        cancellation.setBooking(booking);
        cancellation.setReason(reason);
        cancellation.setCancellationCharge(cancellationCharge);
        cancellation.setRefundAmount(refundAmount);
        cancellation.setRefundStatus(Cancellation.RefundStatus.PENDING);
        cancellation = cancellationRepository.save(cancellation);
        
        // Process refund to wallet
        processRefund(cancellation);
        
        return cancellation;
    }
    
    private void releaseSeats(Booking booking) {
        // Only release seats for flight bookings
        if ("FLIGHT".equals(booking.getInventoryType())) {
            Flight flight = flightRepository.findById(booking.getInventoryId())
                    .orElseThrow(() -> new RuntimeException("Flight not found"));
            
            // Increase available seats by the quantity that was booked
            flight.setAvailableSeats(flight.getAvailableSeats() + booking.getQuantity());
            flightRepository.save(flight);
            
            // Release seat locks for the booked seats
            if (booking.getSeatNumbers() != null && !booking.getSeatNumbers().isEmpty()) {
                List<String> seatNumbers = Arrays.asList(booking.getSeatNumbers().split(","));
                for (String seatNumber : seatNumbers) {
                    seatNumber = seatNumber.trim();
                    // Find and delete the seat lock for this seat
                    Optional<SeatLock> seatLockOpt = seatLockRepository.findAnyLockForSeat(
                        seatNumber,
                        booking.getInventoryType(),
                        booking.getInventoryId()
                    );
                    
                    // Delete the lock if it exists
                    seatLockOpt.ifPresent(seatLockRepository::delete);
                }
            }
        }
    }
    
    private Double calculateCancellationCharge(Booking booking) {
        // Calculate hours until travel (using booking date as proxy for travel date)
        long hoursUntilTravel = ChronoUnit.HOURS.between(LocalDateTime.now(), booking.getBookingDate().plusDays(1));
        
        Double totalAmount = booking.getTotalPrice().doubleValue();
        
        // Cancellation policy
        if (hoursUntilTravel > 48) {
            return totalAmount * 0.10; // 10% charge
        } else if (hoursUntilTravel > 24) {
            return totalAmount * 0.25; // 25% charge
        } else if (hoursUntilTravel > 12) {
            return totalAmount * 0.50; // 50% charge
        } else {
            return totalAmount * 0.75; // 75% charge
        }
    }
    
    @Transactional
    public void processRefund(Cancellation cancellation) {
        try {
            cancellation.setRefundStatus(Cancellation.RefundStatus.PROCESSING);
            cancellationRepository.save(cancellation);
            
            Long userId = cancellation.getBooking().getUser().getId();
            
            // Ensure wallet exists, create if it doesn't
            walletService.getOrCreateWalletByUserId(userId);
            
            // Add refund to wallet
            walletService.addMoney(
                userId,
                cancellation.getRefundAmount(),
                "Refund for cancelled booking #" + cancellation.getBooking().getId()
            );
            
            cancellation.setRefundStatus(Cancellation.RefundStatus.COMPLETED);
            cancellation.setRefundProcessedAt(LocalDateTime.now());
            cancellationRepository.save(cancellation);
            
        } catch (Exception e) {
            cancellation.setRefundStatus(Cancellation.RefundStatus.FAILED);
            cancellationRepository.save(cancellation);
            throw new RuntimeException("Refund processing failed: " + e.getMessage());
        }
    }
    
    public Cancellation getCancellationDetails(Long bookingId) {
        return cancellationRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Cancellation not found"));
    }
}
