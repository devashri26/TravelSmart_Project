package com.BookingSystem.TravelSmartBackend.controller;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import com.BookingSystem.TravelSmartBackend.dto.BookingRequestDto;
import com.BookingSystem.TravelSmartBackend.model.Booking;
import com.BookingSystem.TravelSmartBackend.model.Payment;
import com.BookingSystem.TravelSmartBackend.service.BookingService;
import com.BookingSystem.TravelSmartBackend.service.CancellationService;
import com.BookingSystem.TravelSmartBackend.service.PaymentService;
import com.BookingSystem.TravelSmartBackend.service.PdfService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {

    private static final Logger log = LoggerFactory.getLogger(BookingController.class);
    private final BookingService bookingService;
    private final PdfService pdfService;
    private final PaymentService paymentService;
    private final CancellationService cancellationService;

    @Autowired
    public BookingController(BookingService bookingService, PdfService pdfService,
                             PaymentService paymentService, CancellationService cancellationService) {
        this.bookingService = bookingService;
        this.pdfService = pdfService;
        this.paymentService = paymentService;
        this.cancellationService = cancellationService;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody BookingRequestDto requestDto) {
        log.info("POST /api/bookings - inventoryType={}, inventoryId={}, quantity={}",
                requestDto.getInventoryType(), requestDto.getInventoryId(), requestDto.getQuantity());
        Booking newBooking = bookingService.createBooking(
                requestDto.getInventoryId(),
                requestDto.getInventoryType(),
                requestDto.getQuantity(),
                null, null
        );
        log.info("POST /api/bookings - created booking id={}", newBooking.getId());
        return new ResponseEntity<>(newBooking, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<com.BookingSystem.TravelSmartBackend.dto.BookingWithDetailsDTO>> getMyBookings() {
        log.info("GET /api/bookings - fetching current user's bookings with details");
        List<com.BookingSystem.TravelSmartBackend.dto.BookingWithDetailsDTO> userBookings = bookingService.getBookingsWithDetailsForCurrentUser();
        log.info("GET /api/bookings - found {} bookings", userBookings.size());
        return ResponseEntity.ok(userBookings);
    }

    @GetMapping("/booked-seats/{inventoryType}/{inventoryId}")
    public ResponseEntity<List<String>> getBookedSeats(@PathVariable String inventoryType, @PathVariable Long inventoryId) {
        try {
            log.info("GET /api/bookings/booked-seats/{}/{}", inventoryType, inventoryId);
            List<String> bookedSeats = bookingService.getBookedSeats(inventoryType, inventoryId);
            log.info("Found {} booked seats", bookedSeats.size());
            return ResponseEntity.ok(bookedSeats);
        } catch (Exception e) {
            log.error("Error fetching booked seats: {}", e.getMessage());
            return ResponseEntity.ok(new java.util.ArrayList<>());
        }
    }

    @GetMapping("/{id}/ticket")
    public ResponseEntity<byte[]> downloadTicket(@PathVariable Long id) {
        try {
            log.info("GET /api/bookings/{}/ticket - downloading ticket", id);
            Booking booking = bookingService.getBookingById(id);
            Payment payment = null;
            try {
                payment = paymentService.getPaymentByBookingId(booking.getId());
            } catch (Exception e) {
                log.warn("Payment not found for booking {}", id);
            }
            byte[] pdfBytes = pdfService.generateTicketPdf(booking, payment);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "ticket-" + booking.getId() + ".pdf");
            headers.setContentLength(pdfBytes.length);
            log.info("GET /api/bookings/{}/ticket - PDF generated successfully", id);
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            log.error("GET /api/bookings/{}/ticket - error: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            log.info("DELETE /api/v1/bookings/{} - cancelling booking", id);
            cancellationService.cancelBooking(id, "User requested cancellation");
            log.info("DELETE /api/v1/bookings/{} - booking cancelled successfully", id);
            return ResponseEntity.ok().body("{\"message\": \"Booking cancelled successfully\"}");
        } catch (Exception e) {
            log.error("DELETE /api/v1/bookings/{} - error: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
