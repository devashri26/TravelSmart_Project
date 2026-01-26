package com.BookingSystem.TravelSmartBackend.controller;

import java.util.List;

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

import com.BookingSystem.TravelSmartBackend.dto.TrainSearchRequest;
import com.BookingSystem.TravelSmartBackend.model.Train;
import com.BookingSystem.TravelSmartBackend.service.TrainService;

/**
 * Unified Controller for Train inventory management and public search.
 * Endpoints: /api/trains
 * Security: Uses @PreAuthorize for granular control over methods.
 */
@RestController
@RequestMapping("/api/v1/trains")
public class TrainController {

	private static final Logger log = LoggerFactory.getLogger(TrainController.class);

    @Autowired
    private TrainService trainService;

    // --- Admin Management Operations (Requires ROLE_ADMIN) ---

    /**
     * Creates a new train route. (ADMIN only)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Train> createTrain(@RequestBody Train train) {
		log.info("POST /api/trains - creating train number={} name={}", train.getTrainNumber(), train.getTrainName());
		Train newTrain = trainService.saveTrain(train);
		log.info("POST /api/trains - created train id={}", newTrain.getId());
		return new ResponseEntity<>(newTrain, HttpStatus.CREATED);
    }

    /**
     * Retrieves all trains (primarily for Admin reporting/management view). (ADMIN only)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<Train>> getAllTrains() {
		log.info("GET /api/trains/all - fetching all trains");
		List<Train> trains = trainService.getAllTrains();
		log.info("GET /api/trains/all - found {} trains", trains.size());
		return ResponseEntity.ok(trains);
    }

    /**
     * Updates an existing train route. (ADMIN only)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Train> updateTrain(@PathVariable Long id, @RequestBody Train trainDetails) {
		log.info("PUT /api/trains/{} - updating train", id);
		return trainService.getTrainById(id)
                .map(existingTrain -> {
                    // Update all fields from the request body
                    existingTrain.setTrainNumber(trainDetails.getTrainNumber());
                    existingTrain.setTrainName(trainDetails.getTrainName());
                    existingTrain.setOrigin(trainDetails.getOrigin());
                    existingTrain.setDestination(trainDetails.getDestination());
                    existingTrain.setDepartureTime(trainDetails.getDepartureTime());
                    existingTrain.setArrivalTime(trainDetails.getArrivalTime());
                    existingTrain.setPrice(trainDetails.getPrice());
                    existingTrain.setAvailableSeats(trainDetails.getAvailableSeats());

					Train updatedTrain = trainService.saveTrain(existingTrain);
					log.info("PUT /api/trains/{} - update successful", id);
					return new ResponseEntity<>(updatedTrain, HttpStatus.OK);
                })
				.orElseGet(() -> {
					log.warn("PUT /api/trains/{} - not found", id);
					return ResponseEntity.notFound().build();
				});
    }

    /**
     * Deletes a train route by its ID. (ADMIN only)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrain(@PathVariable Long id) {
		log.info("DELETE /api/trains/{} - delete request", id);
		if (trainService.getTrainById(id).isPresent()) {
			trainService.deleteTrain(id);
			log.info("DELETE /api/trains/{} - deleted", id);
			return ResponseEntity.noContent().build();
		} else {
			log.warn("DELETE /api/trains/{} - not found", id);
			return ResponseEntity.notFound().build();
		}
    }

    // --- Public/User Operations (Requires ROLE_USER or ROLE_ADMIN) ---

    /**
     * Searches for available trains based on route and date. (USER or ADMIN)
     * Request uses query parameters mapped to TrainSearchRequest DTO.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/search")
    public ResponseEntity<List<Train>> searchTrains(TrainSearchRequest request) {
		log.info("GET /api/trains/search - origin={}, destination={}, date={}",
				request.getOrigin(), request.getDestination(), request.getDate());
		List<Train> trains = trainService.searchTrains(
                request.getOrigin(),
                request.getDestination(),
                request.getDate()
        );
		log.info("GET /api/trains/search - found {} results", trains.size());
		return ResponseEntity.ok(trains);
    }

    /**
     * Retrieves a single train by its ID. (USER or ADMIN)
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/{id}")
    public ResponseEntity<Train> getTrainById(@PathVariable Long id) {
		log.info("GET /api/trains/{} - fetching train", id);
		return trainService.getTrainById(id)
				.map(train -> {
					log.info("GET /api/trains/{} - found train {}", id, train.getTrainNumber());
					return ResponseEntity.ok(train);
				})
				.orElseGet(() -> {
					log.warn("GET /api/trains/{} - not found", id);
					return ResponseEntity.notFound().build();
				});
    }
}
