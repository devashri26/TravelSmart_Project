package com.BookingSystem.TravelSmartBackend.service;

import com.BookingSystem.TravelSmartBackend.model.Bus;
import com.BookingSystem.TravelSmartBackend.repository.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;

    // --- Admin CRUD Operations ---

    public Bus saveBus(Bus bus) {
        return busRepository.save(bus);
    }

    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    public Optional<Bus> getBusById(Long id) {
        return busRepository.findById(id);
    }

    public void deleteBus(Long id) {
        busRepository.deleteById(id);
    }

    // --- Public Search Operation ---

    /**
     * Searches for buses based on origin, destination, and date.
     * Delegates to the custom query method in the repository.
     */
    public List<Bus> searchBuses(String origin, String destination, LocalDateTime date) {
        // Calls the custom search method defined in the BusRepository
        return busRepository.searchAvailableBuses(origin, destination, date);
    }
    
    // ==================== ADMIN METHODS ====================
    
    public org.springframework.data.domain.Page<Bus> getAllBuses(String search, org.springframework.data.domain.Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            return busRepository.findByBusNumberContainingIgnoreCaseOrOperatorContainingIgnoreCaseOrOriginContainingIgnoreCaseOrDestinationContainingIgnoreCase(
                    search, search, search, search, pageable);
        }
        return busRepository.findAll(pageable);
    }
    
    public Bus createBus(Bus bus) {
        return busRepository.save(bus);
    }
    
    public Bus updateBus(Long id, Bus busDetails) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus not found"));
        
        bus.setBusNumber(busDetails.getBusNumber());
        bus.setOperator(busDetails.getOperator());
        bus.setOrigin(busDetails.getOrigin());
        bus.setDestination(busDetails.getDestination());
        bus.setDepartureTime(busDetails.getDepartureTime());
        bus.setArrivalTime(busDetails.getArrivalTime());
        bus.setPrice(busDetails.getPrice());
        bus.setAvailableSeats(busDetails.getAvailableSeats());
        
        return busRepository.save(bus);
    }
}
