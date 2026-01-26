package com.BookingSystem.TravelSmartBackend.controller;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.BookingSystem.TravelSmartBackend.dto.HotelSearchRequest;
import com.BookingSystem.TravelSmartBackend.model.Hotel;
import com.BookingSystem.TravelSmartBackend.service.HotelService;

/**
 * REST Controller for Hotel inventory. Combines Admin CRUD and User Search.
 * Base path: /api/hotels
 * * Security:
 * - GET: requires ROLE_USER or ROLE_ADMIN
 * - POST/PUT/DELETE: requires ROLE_ADMIN
 */
@RestController
@RequestMapping("/api/v1/hotels")
public class HotelController {

	private static final Logger log = LoggerFactory.getLogger(HotelController.class);

    private final HotelService hotelService;

    @Autowired
    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    // --- Search & Read Operations (User & Admin Access) ---

    /**
     * Retrieves all hotels. Secured for both USER and ADMIN roles.
     * GET /api/hotels
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public List<Hotel> getAllHotels() {
		log.info("GET /api/hotels - fetching all hotels");
		List<Hotel> hotels = hotelService.getAllHotels();
		log.info("GET /api/hotels - found {} hotels", hotels.size());
		return hotels;
    }

    /**
     * Retrieves a single hotel by ID. Secured for both USER and ADMIN roles.
     * GET /api/v1/hotels/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        log.info("GET /api/v1/hotels/{} - fetching hotel details", id);
        Optional<Hotel> hotel = hotelService.getHotelById(id);
        if (hotel.isPresent()) {
            log.info("GET /api/v1/hotels/{} - found hotel: {}", id, hotel.get().getName());
            return ResponseEntity.ok(hotel.get());
        } else {
            log.warn("GET /api/v1/hotels/{} - not found", id);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Searches for hotels based on city and minimum required guests. Secured for USER and ADMIN.
     * GET /api/hotels/search?city={}&guests={}
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<Hotel>> searchHotels(HotelSearchRequest request) {
		log.info("GET /api/hotels/search - city={}, guests={}", request.getCity(), request.getGuests());
		List<Hotel> hotels = hotelService.searchHotels(
                request.getCity(),
                request.getGuests()
        );
		log.info("GET /api/hotels/search - found {} results", hotels.size());
        return ResponseEntity.ok(hotels);
    }

    // --- Management Operations (Admin Only Access) ---

    /**
     * Creates a new hotel listing. Secured ONLY for ADMIN role.
     * POST /api/hotels
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Hotel> createHotel(@RequestBody Hotel hotel) {
		log.info("POST /api/hotels - creating hotel name={} city={}", hotel.getName(), hotel.getCity());
		Hotel newHotel = hotelService.saveHotel(hotel);
		log.info("POST /api/hotels - created hotel id={}", newHotel.getId());
		return new ResponseEntity<>(newHotel, HttpStatus.CREATED);
    }

    /**
     * Updates an existing hotel. Secured ONLY for ADMIN role.
     * PUT /api/hotels/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Hotel> updateHotel(@PathVariable Long id, @RequestBody Hotel hotelDetails) {
		log.info("PUT /api/hotels/{} - updating hotel", id);
		Optional<Hotel> hotelOpt = hotelService.getHotelById(id);

		if (hotelOpt.isPresent()) {
            Hotel existingHotel = hotelOpt.get();
            // Update fields
            existingHotel.setName(hotelDetails.getName());
            existingHotel.setCity(hotelDetails.getCity());
            existingHotel.setAddress(hotelDetails.getAddress());
            existingHotel.setRoomType(hotelDetails.getRoomType());
            existingHotel.setNightlyRate(hotelDetails.getNightlyRate());
            existingHotel.setTotalRooms(hotelDetails.getTotalRooms());
            existingHotel.setAvailableRooms(hotelDetails.getAvailableRooms());

			Hotel updatedHotel = hotelService.saveHotel(existingHotel);
			log.info("PUT /api/hotels/{} - update successful", id);
			return ResponseEntity.ok(updatedHotel);
        } else {
			log.warn("PUT /api/hotels/{} - not found", id);
			return ResponseEntity.notFound().build();
        }
    }

    /**
     * Deletes a hotel by its ID. Secured ONLY for ADMIN role.
     * DELETE /api/hotels/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {
		log.info("DELETE /api/hotels/{} - delete request", id);
		if (hotelService.getHotelById(id).isPresent()) {
			hotelService.deleteHotel(id);
			log.info("DELETE /api/hotels/{} - deleted", id);
			return ResponseEntity.noContent().build();
		} else {
			log.warn("DELETE /api/hotels/{} - not found", id);
			return ResponseEntity.notFound().build();
		}
    }
}
