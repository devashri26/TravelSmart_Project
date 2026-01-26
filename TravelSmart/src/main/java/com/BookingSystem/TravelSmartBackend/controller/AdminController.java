package com.BookingSystem.TravelSmartBackend.controller;

import com.BookingSystem.TravelSmartBackend.model.*;
import com.BookingSystem.TravelSmartBackend.service.*;
import com.BookingSystem.TravelSmartBackend.repository.TrainRepository;
import com.BookingSystem.TravelSmartBackend.repository.BusRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class AdminController {
    
    private final FlightService flightService;
    private final BookingService bookingService;
    private final HotelService hotelService;
    private final TrainRepository trainRepository;
    private final BusRepository busRepository;
    private final com.BookingSystem.TravelSmartBackend.repository.UserRepository userRepository;
    
    public AdminController(FlightService flightService, BookingService bookingService, 
                          HotelService hotelService, TrainRepository trainRepository,
                          BusRepository busRepository,
                          com.BookingSystem.TravelSmartBackend.repository.UserRepository userRepository) {
        this.flightService = flightService;
        this.bookingService = bookingService;
        this.hotelService = hotelService;
        this.trainRepository = trainRepository;
        this.busRepository = busRepository;
        this.userRepository = userRepository;
    }
    
    // ==================== FLIGHT MANAGEMENT ====================
    
    @GetMapping("/flights")
    public ResponseEntity<Map<String, Object>> getAllFlights(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        List<Flight> flights = flightService.getAllFlights();
        
        // Simple pagination
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), flights.size());
        List<Flight> pageContent = flights.subList(start, end);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", pageContent);
        response.put("currentPage", page);
        response.put("totalItems", flights.size());
        response.put("totalPages", (int) Math.ceil((double) flights.size() / size));
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/flights/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable Long id) {
        Flight flight = flightService.getFlightById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found"));
        return ResponseEntity.ok(flight);
    }
    
    @PostMapping("/flights")
    public ResponseEntity<Flight> createFlight(@RequestBody Flight flight) {
        Flight createdFlight = flightService.createFlight(flight);
        return ResponseEntity.ok(createdFlight);
    }
    
    @PutMapping("/flights/{id}")
    public ResponseEntity<Flight> updateFlight(@PathVariable Long id, @RequestBody Flight flight) {
        Flight updatedFlight = flightService.updateFlight(id, flight);
        return ResponseEntity.ok(updatedFlight);
    }
    
    @DeleteMapping("/flights/{id}")
    public ResponseEntity<Map<String, String>> deleteFlight(@PathVariable Long id) {
        flightService.deleteFlight(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Flight deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    // ==================== TRAIN MANAGEMENT ====================
    
    @GetMapping("/trains")
    public ResponseEntity<Map<String, Object>> getAllTrains(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        List<Train> trains = trainRepository.findAll();
        
        // Simple pagination
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), trains.size());
        List<Train> pageContent = trains.subList(start, end);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", pageContent);
        response.put("currentPage", page);
        response.put("totalItems", trains.size());
        response.put("totalPages", (int) Math.ceil((double) trains.size() / size));
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/trains/{id}")
    public ResponseEntity<Train> getTrainById(@PathVariable Long id) {
        Train train = trainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Train not found"));
        return ResponseEntity.ok(train);
    }
    
    @PostMapping("/trains")
    public ResponseEntity<Train> createTrain(@RequestBody Train train) {
        Train createdTrain = trainRepository.save(train);
        return ResponseEntity.ok(createdTrain);
    }
    
    @PutMapping("/trains/{id}")
    public ResponseEntity<Train> updateTrain(@PathVariable Long id, @RequestBody Train train) {
        Train existingTrain = trainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Train not found"));
        
        existingTrain.setTrainNumber(train.getTrainNumber());
        existingTrain.setTrainName(train.getTrainName());
        existingTrain.setOrigin(train.getOrigin());
        existingTrain.setDestination(train.getDestination());
        existingTrain.setDepartureTime(train.getDepartureTime());
        existingTrain.setArrivalTime(train.getArrivalTime());
        existingTrain.setPrice(train.getPrice());
        existingTrain.setAvailableSeats(train.getAvailableSeats());
        
        Train updatedTrain = trainRepository.save(existingTrain);
        return ResponseEntity.ok(updatedTrain);
    }
    
    @DeleteMapping("/trains/{id}")
    public ResponseEntity<Map<String, String>> deleteTrain(@PathVariable Long id) {
        trainRepository.deleteById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Train deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    // ==================== BUS MANAGEMENT ====================
    
    @GetMapping("/buses")
    public ResponseEntity<Map<String, Object>> getAllBuses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        List<Bus> buses = busRepository.findAll();
        
        // Simple pagination
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), buses.size());
        List<Bus> pageContent = buses.subList(start, end);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", pageContent);
        response.put("currentPage", page);
        response.put("totalItems", buses.size());
        response.put("totalPages", (int) Math.ceil((double) buses.size() / size));
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/buses/{id}")
    public ResponseEntity<Bus> getBusById(@PathVariable Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found"));
        return ResponseEntity.ok(bus);
    }
    
    @PostMapping("/buses")
    public ResponseEntity<Bus> createBus(@RequestBody Bus bus) {
        Bus createdBus = busRepository.save(bus);
        return ResponseEntity.ok(createdBus);
    }
    
    @PutMapping("/buses/{id}")
    public ResponseEntity<Bus> updateBus(@PathVariable Long id, @RequestBody Bus bus) {
        Bus existingBus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found"));
        
        existingBus.setBusNumber(bus.getBusNumber());
        existingBus.setOperator(bus.getOperator());
        existingBus.setOrigin(bus.getOrigin());
        existingBus.setDestination(bus.getDestination());
        existingBus.setDepartureTime(bus.getDepartureTime());
        existingBus.setArrivalTime(bus.getArrivalTime());
        existingBus.setPrice(bus.getPrice());
        existingBus.setAvailableSeats(bus.getAvailableSeats());
        
        Bus updatedBus = busRepository.save(existingBus);
        return ResponseEntity.ok(updatedBus);
    }
    
    @DeleteMapping("/buses/{id}")
    public ResponseEntity<Map<String, String>> deleteBus(@PathVariable Long id) {
        busRepository.deleteById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Bus deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    // ==================== BOOKING MANAGEMENT ====================
    
    @GetMapping("/bookings")
    public ResponseEntity<Map<String, Object>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<Booking> bookings = bookingService.getAllBookings();
        
        // Simple pagination
        Pageable pageable = PageRequest.of(page, size);
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), bookings.size());
        List<Booking> pageContent = bookings.subList(start, end);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", pageContent);
        response.put("currentPage", page);
        response.put("totalItems", bookings.size());
        response.put("totalPages", (int) Math.ceil((double) bookings.size() / size));
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/bookings/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }
    
    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        
        String newStatus = statusUpdate.get("status");
        Booking booking = bookingService.getBookingById(id);
        booking.setStatus(newStatus);
        Booking updatedBooking = bookingService.updateBooking(booking);
        
        return ResponseEntity.ok(updatedBooking);
    }
    
    // ==================== STATISTICS ====================
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        List<Flight> flights = flightService.getAllFlights();
        List<Booking> bookings = bookingService.getAllBookings();
        List<Hotel> hotels = hotelService.getAllHotels();
        long totalUsers = userRepository.count();
        
        stats.put("totalFlights", flights.size());
        stats.put("totalBookings", bookings.size());
        stats.put("totalHotels", hotels.size());
        stats.put("totalUsers", totalUsers);
        stats.put("confirmedBookings", bookings.stream().filter(b -> "CONFIRMED".equals(b.getStatus())).count());
        stats.put("cancelledBookings", bookings.stream().filter(b -> "CANCELLED".equals(b.getStatus())).count());
        stats.put("pendingBookings", bookings.stream().filter(b -> "PENDING".equals(b.getStatus())).count());
        
        // Calculate total revenue
        double totalRevenue = bookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()))
                .mapToDouble(b -> b.getTotalPrice().doubleValue())
                .sum();
        stats.put("totalRevenue", totalRevenue);
        
        return ResponseEntity.ok(stats);
    }
}
