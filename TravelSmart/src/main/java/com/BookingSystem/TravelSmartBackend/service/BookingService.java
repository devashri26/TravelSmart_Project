package com.BookingSystem.TravelSmartBackend.service;

import com.BookingSystem.TravelSmartBackend.model.*;
import com.BookingSystem.TravelSmartBackend.repository.BookingRepository;
import com.BookingSystem.TravelSmartBackend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final FlightService flightService;
    private final HotelService hotelService;
    private final BusService busService;
    private final TrainService trainService;

    @Autowired
    public BookingService(BookingRepository bookingRepository,
                          UserRepository userRepository,
                          FlightService flightService,
                          HotelService hotelService,
                          BusService busService,
                          TrainService trainService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.flightService = flightService;
        this.hotelService = hotelService;
        this.busService = busService;
        this.trainService = trainService;
    }

    /**
     * Creates a new booking in a transactional manner.
     * This ensures inventory is updated only if the booking record is created successfully.
     *
     * @param inventoryId   The ID of the item being booked (Flight, Hotel, etc.).
     * @param inventoryType The type of inventory ("FLIGHT", "HOTEL", etc.).
     * @param quantity      The number of seats/rooms to book.
     * @param seatNumbers   Comma-separated seat IDs (optional).
     * @param totalAmount   The actual total amount paid (optional, will calculate if null).
     * @return The newly created Booking object.
     */
    @Transactional
    public Booking createBooking(Long inventoryId, String inventoryType, int quantity, String seatNumbers, BigDecimal totalAmount) {
        // 1. Get the authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found for authenticated principal."));

        // 2. Validate, Update Inventory, and Get Price
        BigDecimal unitPrice;
        String normalizedType = inventoryType.toUpperCase();

        switch (normalizedType) {
            case "FLIGHT":
                unitPrice = handleFlightBooking(inventoryId, quantity);
                break;
            case "HOTEL":
                unitPrice = handleHotelBooking(inventoryId, quantity);
                break;
            case "BUS":
                unitPrice = handleBusBooking(inventoryId, quantity);
                break;
            case "TRAIN":
                unitPrice = handleTrainBooking(inventoryId, quantity);
                break;
            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid inventory type specified.");
        }

        // 3. Create and save the new Booking record
        Booking newBooking = new Booking();
        newBooking.setUser(user);
        newBooking.setInventoryId(inventoryId);
        newBooking.setInventoryType(normalizedType);
        newBooking.setBookingDate(LocalDateTime.now());
        newBooking.setQuantity(quantity);
        // Use provided totalAmount if available, otherwise calculate from unit price
        newBooking.setTotalPrice(totalAmount != null ? totalAmount : unitPrice.multiply(new BigDecimal(quantity)));
        newBooking.setStatus("CONFIRMED");
        newBooking.setSeatNumbers(seatNumbers); // Store seat numbers

        return bookingRepository.save(newBooking);
    }

    // --- Helper Methods to Handle Specific Inventory Types ---

    private BigDecimal handleFlightBooking(Long flightId, int quantity) {
        Optional<Flight> flightOptional = flightService.getFlightById(flightId);
        Flight flight = flightOptional.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Flight not found with ID: " + flightId));

        if (flight.getAvailableSeats() < quantity) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not enough seats available for Flight " + flight.getFlightNumber());
        }

        // Decrement seats and save
        flight.setAvailableSeats(flight.getAvailableSeats() - quantity);
        flightService.saveFlight(flight);
        return flight.getPrice();
    }

    private BigDecimal handleHotelBooking(Long hotelId, int quantity) {
        Optional<Hotel> hotelOptional = hotelService.getHotelById(hotelId);
        Hotel hotel = hotelOptional.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Hotel not found with ID: " + hotelId));

        if (hotel.getAvailableRooms() < quantity) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not enough rooms available at " + hotel.getName());
        }

        // Decrement rooms and save
        hotel.setAvailableRooms(hotel.getAvailableRooms() - quantity);
        hotelService.saveHotel(hotel);
        return hotel.getNightlyRate();
    }

    private BigDecimal handleBusBooking(Long busId, int quantity) {
        Optional<Bus> busOptional = busService.getBusById(busId);
        Bus bus = busOptional.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Bus not found with ID: " + busId));

        if (bus.getAvailableSeats() < quantity) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not enough seats available for Bus " + bus.getBusNumber());
        }

        // Decrement seats and save
        bus.setAvailableSeats(bus.getAvailableSeats() - quantity);
        busService.saveBus(bus);
        // Assuming price for bus is a double, converting to BigDecimal for consistency
        return BigDecimal.valueOf(bus.getPrice());
    }

    private BigDecimal handleTrainBooking(Long trainId, int quantity) {
        Optional<Train> trainOptional = trainService.getTrainById(trainId);
        Train train = trainOptional.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Train not found with ID: " + trainId));

        if (train.getAvailableSeats() < quantity) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not enough seats available for Train " + train.getTrainNumber());
        }

        // Decrement seats and save
        train.setAvailableSeats(train.getAvailableSeats() - quantity);
        trainService.saveTrain(train);
        // Assuming price for train is a double, converting to BigDecimal for consistency
        return BigDecimal.valueOf(train.getPrice());
    }

    /**
     * Retrieves all bookings for the currently authenticated user.
     * @return List of Booking objects for the user.
     */
    public List<Booking> getBookingsForCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found for authenticated principal."));

        return bookingRepository.findByUserId(user.getId());
    }
    
    /**
     * Retrieves all bookings with inventory details for the currently authenticated user.
     * @return List of BookingWithDetailsDTO objects.
     */
    public List<com.BookingSystem.TravelSmartBackend.dto.BookingWithDetailsDTO> getBookingsWithDetailsForCurrentUser() {
        List<Booking> bookings = getBookingsForCurrentUser();
        List<com.BookingSystem.TravelSmartBackend.dto.BookingWithDetailsDTO> result = new java.util.ArrayList<>();
        
        for (Booking booking : bookings) {
            com.BookingSystem.TravelSmartBackend.dto.BookingWithDetailsDTO dto = new com.BookingSystem.TravelSmartBackend.dto.BookingWithDetailsDTO();
            dto.setId(booking.getId());
            dto.setInventoryId(booking.getInventoryId());
            dto.setInventoryType(booking.getInventoryType());
            dto.setBookingDate(booking.getBookingDate());
            dto.setTotalPrice(booking.getTotalPrice());
            dto.setStatus(booking.getStatus());
            dto.setQuantity(booking.getQuantity());
            dto.setSeatNumbers(booking.getSeatNumbers());
            
            // Fetch inventory details based on type
            enrichWithInventoryDetails(dto, booking);
            
            result.add(dto);
        }
        
        return result;
    }
    
    private void enrichWithInventoryDetails(com.BookingSystem.TravelSmartBackend.dto.BookingWithDetailsDTO dto, Booking booking) {
        try {
            switch (booking.getInventoryType()) {
                case "FLIGHT":
                    Optional<Flight> flightOpt = flightService.getFlightById(booking.getInventoryId());
                    if (flightOpt.isPresent()) {
                        Flight flight = flightOpt.get();
                        dto.setDisplayName(flight.getAirline() + " " + flight.getFlightNumber());
                        dto.setRoute(flight.getDepartureCity() + " → " + flight.getArrivalCity());
                        dto.setDepartureTime(flight.getDepartureTime().toString());
                        dto.setArrivalTime(flight.getArrivalTime().toString());
                    }
                    break;
                    
                case "BUS":
                    Optional<Bus> busOpt = busService.getBusById(booking.getInventoryId());
                    if (busOpt.isPresent()) {
                        Bus bus = busOpt.get();
                        dto.setDisplayName(bus.getOperator() + " " + bus.getBusNumber());
                        dto.setRoute(bus.getOrigin() + " → " + bus.getDestination());
                        dto.setDepartureTime(bus.getDepartureTime().toString());
                    }
                    break;
                    
                case "TRAIN":
                    Optional<Train> trainOpt = trainService.getTrainById(booking.getInventoryId());
                    if (trainOpt.isPresent()) {
                        Train train = trainOpt.get();
                        dto.setDisplayName(train.getTrainName() + " (" + train.getTrainNumber() + ")");
                        dto.setRoute(train.getOrigin() + " → " + train.getDestination());
                        dto.setDepartureTime(train.getDepartureTime().toString());
                    }
                    break;
                    
                case "HOTEL":
                    Optional<Hotel> hotelOpt = hotelService.getHotelById(booking.getInventoryId());
                    if (hotelOpt.isPresent()) {
                        Hotel hotel = hotelOpt.get();
                        dto.setDisplayName(hotel.getName());
                        dto.setRoute(hotel.getCity() + ", " + hotel.getAddress());
                    }
                    break;
            }
        } catch (Exception e) {
            // If inventory not found, just show basic info
            dto.setDisplayName(booking.getInventoryType() + " #" + booking.getInventoryId());
        }
    }
    
    /**
     * Retrieves a booking by its ID.
     * @param id The booking ID
     * @return The Booking object
     */
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
    }
    
    /**
     * Retrieves all booked seat numbers for a specific inventory item.
     * @param inventoryType The type (FLIGHT, BUS, TRAIN)
    // You can add methods for cancellation here later if needed.
    
    // ==================== ADMIN METHODS ====================
    
    public long getTotalBookings() {
        return bookingRepository.count();
    }
    
    public long getTodayBookings() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        return bookingRepository.countByBookingDateAfter(startOfDay);
    }
    
    public long getTotalUsers() {
        return userRepository.count();
    }
    
    public long getActiveUsers() {
        return userRepository.countByEnabled(true);
    }
    
    public org.springframework.data.domain.Page<Booking> getRecentBookings(org.springframework.data.domain.Pageable pageable) {
        return bookingRepository.findAll(pageable);
    }
    
    public org.springframework.data.domain.Page<Booking> getAllBookings(String search, String status, org.springframework.data.domain.Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            if (status != null && !status.isEmpty()) {
                return bookingRepository.findByStatusAndUserUsernameContainingIgnoreCase(status, search, pageable);
            }
            return bookingRepository.findByUserUsernameContainingIgnoreCase(search, pageable);
        }
        if (status != null && !status.isEmpty()) {
            return bookingRepository.findByStatus(status, pageable);
        }
        return bookingRepository.findAll(pageable);
    }
    
    @Transactional
    public void cancelBooking(Long id, String reason) {
        Booking booking = getBookingById(id);
        
        // Only allow cancellation if not already cancelled
        if ("CANCELLED".equals(booking.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking is already cancelled");
        }
        
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
        
        // Restore inventory (unlock seats)
        restoreInventory(booking);
        
        System.out.println("✅ Booking " + id + " cancelled. Seats unlocked and restored to inventory.");
    }
    
    /**
     * Admin function to unlock specific seats for a booking
     * This allows admin to manually release seats if needed
     */
    @Transactional
    public void unlockSeats(Long bookingId) {
        Booking booking = getBookingById(bookingId);
        
        if ("CANCELLED".equals(booking.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking is already cancelled");
        }
        
        // Restore inventory
        restoreInventory(booking);
        
        // Mark as cancelled
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
        
        System.out.println("🔓 Admin unlocked seats for booking " + bookingId + ". Seats: " + booking.getSeatNumbers());
    }
    
    private void restoreInventory(Booking booking) {
        switch (booking.getInventoryType()) {
            case "FLIGHT":
                Optional<Flight> flight = flightService.getFlightById(booking.getInventoryId());
                flight.ifPresent(f -> {
                    f.setAvailableSeats(f.getAvailableSeats() + booking.getQuantity());
                    flightService.saveFlight(f);
                });
                break;
            case "HOTEL":
                Optional<Hotel> hotel = hotelService.getHotelById(booking.getInventoryId());
                hotel.ifPresent(h -> {
                    h.setAvailableRooms(h.getAvailableRooms() + booking.getQuantity());
                    hotelService.saveHotel(h);
                });
                break;
            case "BUS":
                Optional<Bus> bus = busService.getBusById(booking.getInventoryId());
                bus.ifPresent(b -> {
                    b.setAvailableSeats(b.getAvailableSeats() + booking.getQuantity());
                    busService.saveBus(b);
                });
                break;
            case "TRAIN":
                Optional<Train> train = trainService.getTrainById(booking.getInventoryId());
                train.ifPresent(t -> {
                    t.setAvailableSeats(t.getAvailableSeats() + booking.getQuantity());
                    trainService.saveTrain(t);
                });
                break;
        }
    }
    
    public org.springframework.data.domain.Page<User> getAllUsers(String search, org.springframework.data.domain.Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            return userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, pageable);
        }
        return userRepository.findAll(pageable);
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
    
    @Transactional
    public void blockUser(Long id, String reason) {
        User user = getUserById(id);
        user.setLocked(true);
        userRepository.save(user);
    }
    
    @Transactional
    public void unblockUser(Long id) {
        User user = getUserById(id);
        user.setLocked(false);
        userRepository.save(user);
    }
    
    @Transactional
    public String resetUserPassword(Long id) {
        User user = getUserById(id);
        String tempPassword = generateTemporaryPassword();
        // You should encode this password before saving
        user.setPassword(tempPassword);
        userRepository.save(user);
        return tempPassword;
    }
    
    private String generateTemporaryPassword() {
        return "Temp" + System.currentTimeMillis();
    }
    
    /**
     * Get all booked seats for a specific inventory
     * Returns seats from both confirmed bookings and booked seat locks
     */
    public List<String> getBookedSeats(String inventoryType, Long inventoryId) {
        List<String> bookedSeats = new java.util.ArrayList<>();
        
        // Get seats from confirmed bookings
        List<Booking> bookings = bookingRepository.findByInventoryTypeAndInventoryIdAndStatus(
            inventoryType, inventoryId, "CONFIRMED"
        );
        
        for (Booking booking : bookings) {
            if (booking.getSeatNumbers() != null && !booking.getSeatNumbers().isEmpty()) {
                String[] seats = booking.getSeatNumbers().split(",");
                for (String seat : seats) {
                    bookedSeats.add(seat.trim());
                }
            }
        }
        
        return bookedSeats;
    }
    
    // Additional admin methods
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public Booking updateBooking(Booking booking) {
        return bookingRepository.save(booking);
    }
}
