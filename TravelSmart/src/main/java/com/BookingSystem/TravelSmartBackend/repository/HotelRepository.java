package com.BookingSystem.TravelSmartBackend.repository;

import com.BookingSystem.TravelSmartBackend.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HotelRepository extends JpaRepository<Hotel, Long> {

    Optional<Hotel> findByNameAndCity(String name, String city);

    /**
     * Finds available hotels in a specific city with enough available rooms.
     * @param city The location to search in.
     * @param requiredRooms The minimum number of rooms required (based on guests).
     * @return List of matching Hotel entities.
     */
    @Query("SELECT h FROM Hotel h WHERE " +
            "h.city = :city AND " +
            "h.availableRooms >= :requiredRooms") // Ensure enough rooms are available
    List<Hotel> searchAvailableHotels(
            @Param("city") String city,
            @Param("requiredRooms") int requiredRooms
    );
    
    // Admin search method
    org.springframework.data.domain.Page<Hotel> findByNameContainingIgnoreCaseOrCityContainingIgnoreCaseOrAddressContainingIgnoreCase(
            String name, String city, String address, org.springframework.data.domain.Pageable pageable);
}
