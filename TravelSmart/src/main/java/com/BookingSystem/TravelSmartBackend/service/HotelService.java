package com.BookingSystem.TravelSmartBackend.service;

import com.BookingSystem.TravelSmartBackend.model.Hotel;
import com.BookingSystem.TravelSmartBackend.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    // --- Admin CRUD Operations ---

    public Hotel saveHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public Optional<Hotel> getHotelById(Long id) {
        return hotelRepository.findById(id);
    }

    public void deleteHotel(Long id) {
        hotelRepository.deleteById(id);
    }

    // --- Public Search Operation ---

    /**
     * Searches for hotels in a specific city with enough available rooms for the requested number of guests.
     * Delegates to the custom query method in the repository.
     * @param city The city to search in.
     * @param guests The number of guests, used as the minimum required available rooms.
     * @return List of matching Hotel entities.
     */
    public List<Hotel> searchHotels(String city, int guests) {
        // Calls the custom search method defined in the HotelRepository
        return hotelRepository.searchAvailableHotels(city, guests);
    }
    
    // ==================== ADMIN METHODS ====================
    
    public org.springframework.data.domain.Page<Hotel> getAllHotels(String search, org.springframework.data.domain.Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            return hotelRepository.findByNameContainingIgnoreCaseOrCityContainingIgnoreCaseOrAddressContainingIgnoreCase(
                    search, search, search, pageable);
        }
        return hotelRepository.findAll(pageable);
    }
    
    public Hotel createHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }
    
    public Hotel updateHotel(Long id, Hotel hotelDetails) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
        
        hotel.setName(hotelDetails.getName());
        hotel.setCity(hotelDetails.getCity());
        hotel.setAddress(hotelDetails.getAddress());
        hotel.setRoomType(hotelDetails.getRoomType());
        hotel.setNightlyRate(hotelDetails.getNightlyRate());
        hotel.setTotalRooms(hotelDetails.getTotalRooms());
        hotel.setAvailableRooms(hotelDetails.getAvailableRooms());
        
        return hotelRepository.save(hotel);
    }
}
