package com.BookingSystem.TravelSmartBackend.service;

import com.BookingSystem.TravelSmartBackend.model.Train;
import com.BookingSystem.TravelSmartBackend.repository.TrainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TrainService {

    @Autowired
    private TrainRepository trainRepository;

    // --- Admin CRUD Operations ---

    public Train saveTrain(Train train) {
        return trainRepository.save(train);
    }

    public List<Train> getAllTrains() {
        return trainRepository.findAll();
    }

    public Optional<Train> getTrainById(Long id) {
        return trainRepository.findById(id);
    }

    public void deleteTrain(Long id) {
        trainRepository.deleteById(id);
    }

    // --- Public Search Operation ---

    /**
     * Searches for trains based on origin, destination, and date.
     * Delegates to the custom query method in the repository.
     */
    public List<Train> searchTrains(String origin, String destination, LocalDateTime date) {
        // Calls the custom search method defined in the TrainRepository
        return trainRepository.searchAvailableTrains(origin, destination, date);
    }
    
    // ==================== ADMIN METHODS ====================
    
    public org.springframework.data.domain.Page<Train> getAllTrains(String search, org.springframework.data.domain.Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            return trainRepository.findByTrainNumberContainingIgnoreCaseOrTrainNameContainingIgnoreCaseOrOriginContainingIgnoreCaseOrDestinationContainingIgnoreCase(
                    search, search, search, search, pageable);
        }
        return trainRepository.findAll(pageable);
    }
    
    public Train createTrain(Train train) {
        return trainRepository.save(train);
    }
    
    public Train updateTrain(Long id, Train trainDetails) {
        Train train = trainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Train not found"));
        
        train.setTrainNumber(trainDetails.getTrainNumber());
        train.setTrainName(trainDetails.getTrainName());
        train.setOrigin(trainDetails.getOrigin());
        train.setDestination(trainDetails.getDestination());
        train.setDepartureTime(trainDetails.getDepartureTime());
        train.setArrivalTime(trainDetails.getArrivalTime());
        train.setPrice(trainDetails.getPrice());
        train.setAvailableSeats(trainDetails.getAvailableSeats());
        
        return trainRepository.save(train);
    }
}
