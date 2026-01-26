package com.BookingSystem.TravelSmartBackend.service;

import com.BookingSystem.TravelSmartBackend.model.Traveler;
import com.BookingSystem.TravelSmartBackend.repository.TravelerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TravelerService {
    
    private final TravelerRepository travelerRepository;
    
    public TravelerService(TravelerRepository travelerRepository) {
        this.travelerRepository = travelerRepository;
    }
    
    public List<Traveler> getUserTravelers(Long userId) {
        return travelerRepository.findByUserId(userId);
    }
    
    public Traveler addTraveler(Traveler traveler) {
        return travelerRepository.save(traveler);
    }
    
    public Traveler updateTraveler(Long id, Traveler travelerDetails) {
        Traveler traveler = travelerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Traveler not found"));
        
        traveler.setFirstName(travelerDetails.getFirstName());
        traveler.setLastName(travelerDetails.getLastName());
        traveler.setGender(travelerDetails.getGender());
        traveler.setDateOfBirth(travelerDetails.getDateOfBirth());
        traveler.setNationality(travelerDetails.getNationality());
        traveler.setPassportNumber(travelerDetails.getPassportNumber());
        traveler.setPassportExpiry(travelerDetails.getPassportExpiry());
        traveler.setType(travelerDetails.getType());
        traveler.setEmail(travelerDetails.getEmail());
        traveler.setPhone(travelerDetails.getPhone());
        
        return travelerRepository.save(traveler);
    }
    
    public void deleteTraveler(Long id) {
        travelerRepository.deleteById(id);
    }
}
