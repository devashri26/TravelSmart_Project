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

import com.BookingSystem.TravelSmartBackend.dto.BusSearchRequest;
import com.BookingSystem.TravelSmartBackend.model.Bus;
import com.BookingSystem.TravelSmartBackend.service.BusService;

/**
 * REST Controller for Bus inventory. Combines Admin CRUD and User Search.
 * Base path: /api/buses
 * Security:
 * - GET: requires ROLE_USER or ROLE_ADMIN
 * - POST/PUT/DELETE: requires ROLE_ADMIN
 */
@RestController
@RequestMapping("/api/v1/buses")
public class BusController {

	private static final Logger log = LoggerFactory.getLogger(BusController.class);

    private final BusService busService;

    @Autowired
    public BusController(BusService busService) {
        this.busService = busService;
    }

    // --- Search & Read Operations (User & Admin Access) ---

    /**
     * Retrieves all buses. Secured for both USER and ADMIN roles.
     * GET /api/buses
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public List<Bus> getAllBuses() {
		log.info("GET /api/buses - fetching all buses");
		List<Bus> buses = busService.getAllBuses();
		log.info("GET /api/buses - found {} buses", buses.size());
		return buses;
    }

    /**
     * Retrieves a bus by its ID. Secured for both USER and ADMIN roles.
     * GET /api/buses/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Bus> getBusById(@PathVariable Long id) {
		log.info("GET /api/buses/{} - fetching bus", id);
		return busService.getBusById(id)
				.map(bus -> {
					log.info("GET /api/buses/{} - found bus {}", id, bus.getBusNumber());
					return ResponseEntity.ok(bus);
				})
				.orElseGet(() -> {
					log.warn("GET /api/buses/{} - not found", id);
					return ResponseEntity.notFound().build();
				});
    }

    /**
     * Searches for buses based on origin, destination, and date. Secured for USER and ADMIN.
     * GET /api/buses/search?origin={}&destination={}&date={}
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<Bus>> searchBuses(BusSearchRequest request) {
		log.info("GET /api/buses/search - origin={}, destination={}, date={}",
				request.getOrigin(), request.getDestination(), request.getDate());
		List<Bus> buses = busService.searchBuses(
                request.getOrigin(),
                request.getDestination(),
                request.getDate()
        );
		log.info("GET /api/buses/search - found {} results", buses.size());
        return ResponseEntity.ok(buses);
    }

    // --- Management Operations (Admin Only Access) ---

    /**
     * Creates a new bus listing. Secured ONLY for ADMIN role.
     * POST /api/buses
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Bus> createBus(@RequestBody Bus bus) {
		log.info("POST /api/buses - creating bus number={} operator={}", bus.getBusNumber(), bus.getOperator());
		Bus newBus = busService.saveBus(bus);
		log.info("POST /api/buses - created bus id={}", newBus.getId());
		return new ResponseEntity<>(newBus, HttpStatus.CREATED);
    }

    /**
     * Updates an existing bus. Secured ONLY for ADMIN role.
     * PUT /api/buses/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Bus> updateBus(@PathVariable Long id, @RequestBody Bus busDetails) {
		log.info("PUT /api/buses/{} - updating bus", id);
		Optional<Bus> busOpt = busService.getBusById(id);

		if (busOpt.isPresent()) {
            Bus existingBus = busOpt.get();
            // Update fields
            existingBus.setBusNumber(busDetails.getBusNumber());
            existingBus.setOperator(busDetails.getOperator());
            existingBus.setOrigin(busDetails.getOrigin());
            existingBus.setDestination(busDetails.getDestination());
            existingBus.setDepartureTime(busDetails.getDepartureTime());
            existingBus.setArrivalTime(busDetails.getArrivalTime());
            existingBus.setPrice(busDetails.getPrice());
            existingBus.setAvailableSeats(busDetails.getAvailableSeats());

			Bus updatedBus = busService.saveBus(existingBus);
			log.info("PUT /api/buses/{} - update successful", id);
			return ResponseEntity.ok(updatedBus);
        } else {
			log.warn("PUT /api/buses/{} - not found", id);
			return ResponseEntity.notFound().build();
        }
    }

    /**
     * Deletes a bus by its ID. Secured ONLY for ADMIN role.
     * DELETE /api/buses/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBus(@PathVariable Long id) {
		log.info("DELETE /api/buses/{} - delete request", id);
		if (busService.getBusById(id).isPresent()) {
			busService.deleteBus(id);
			log.info("DELETE /api/buses/{} - deleted", id);
			return ResponseEntity.noContent().build();
		} else {
			log.warn("DELETE /api/buses/{} - not found", id);
			return ResponseEntity.notFound().build();
		}
    }
}
