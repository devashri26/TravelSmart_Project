package com.BookingSystem.TravelSmartBackend.controller;

import com.BookingSystem.TravelSmartBackend.dto.BookingWithDetailsDTO;
import com.BookingSystem.TravelSmartBackend.model.User;
import com.BookingSystem.TravelSmartBackend.service.BookingService;
import com.BookingSystem.TravelSmartBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@RestController
@RequestMapping("/api/v1/trip-planner")
@CrossOrigin(origins = "*")
public class TripPlannerController {

    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/generate")
    public ResponseEntity<?> generateItinerary(@RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            System.out.println("Received trip planner request: " + request);
            
            // Get username from authentication and fetch our User model
            String username = authentication.getName();
            System.out.println("Authenticated username: " + username);
            
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
            System.out.println("Found user: " + user.getUsername());
            
            // Validate and extract request data
            String destination = (String) request.get("destination");
            if (destination == null || destination.trim().isEmpty()) {
                throw new IllegalArgumentException("Destination is required");
            }
            
            String startDate = (String) request.get("startDate");
            if (startDate == null || startDate.trim().isEmpty()) {
                throw new IllegalArgumentException("Start date is required");
            }
            
            String endDate = (String) request.get("endDate");
            if (endDate == null || endDate.trim().isEmpty()) {
                throw new IllegalArgumentException("End date is required");
            }
            
            // Handle budget - could be Integer, Long, or Double from JSON
            Object budgetObj = request.get("budget");
            if (budgetObj == null) {
                throw new IllegalArgumentException("Budget is required");
            }
            Integer budget = budgetObj instanceof Number ? ((Number) budgetObj).intValue() : Integer.parseInt(budgetObj.toString());
            
            // Handle travelers - could be Integer, Long, or Double from JSON
            Object travelersObj = request.get("travelers");
            Integer travelers = travelersObj != null ? 
                (travelersObj instanceof Number ? ((Number) travelersObj).intValue() : Integer.parseInt(travelersObj.toString())) : 1;
            
            @SuppressWarnings("unchecked")
            List<String> interests = (List<String>) request.get("interests");
            if (interests == null || interests.isEmpty()) {
                throw new IllegalArgumentException("At least one interest must be selected");
            }
            
            // Calculate days
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
            long days = ChronoUnit.DAYS.between(start, end);
            
            // Get user's existing bookings
            List<BookingWithDetailsDTO> userBookings = bookingService.getBookingsWithDetailsForCurrentUser();
            
            // Generate itinerary
            Map<String, Object> itinerary = new HashMap<>();
            itinerary.put("destination", destination);
            itinerary.put("days", generateDays(days, interests, destination));
            itinerary.put("estimatedBudget", calculateBudget(days, budget));
            itinerary.put("carbonFootprint", calculateCarbonFootprint(destination, days));
            itinerary.put("emergencyContacts", getEmergencyContacts());
            itinerary.put("attractions", getAttractions(destination));
            itinerary.put("userBookings", userBookings);
            
            return ResponseEntity.ok(itinerary);
        } catch (Exception e) {
            System.out.println("Error in trip planner: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    private List<Map<String, Object>> generateDays(long days, List<String> interests, String destination) {
        List<Map<String, Object>> daysList = new ArrayList<>();
        
        for (int i = 1; i <= Math.min(days, 7); i++) {
            Map<String, Object> day = new HashMap<>();
            day.put("day", i);
            day.put("title", i == 1 ? "Arrival & Exploration" : 
                           i == days ? "Departure Day" : 
                           "Day " + i + " - " + (interests.isEmpty() ? "Sightseeing" : interests.get(0)));
            day.put("activities", generateActivities(i, interests, destination));
            daysList.add(day);
        }
        
        return daysList;
    }
    
    private List<Map<String, Object>> generateActivities(int day, List<String> interests, String destination) {
        List<Map<String, Object>> activities = new ArrayList<>();
        
        activities.add(createActivity("09:00 AM", 
            day == 1 ? "Hotel Check-in & Breakfast" : "Breakfast at local cafe",
            "City Center", "1 hour", day == 1 ? 0 : 300, true));
            
        activities.add(createActivity("11:00 AM", 
            "Visit " + destination + " main attraction",
            "Tourist District", "3 hours", 500, false));
            
        activities.add(createActivity("02:00 PM", 
            "Lunch at recommended restaurant",
            "Food Street", "1.5 hours", 400, true));
            
        activities.add(createActivity("04:00 PM", 
            interests.contains("culture") ? "Cultural experience" : "Local sightseeing",
            "Heritage Area", "2 hours", 300, true));
            
        activities.add(createActivity("07:00 PM", 
            "Dinner & evening walk",
            "Waterfront", "2 hours", 600, false));
        
        return activities;
    }
    
    private Map<String, Object> createActivity(String time, String activity, String location, 
                                               String duration, int cost, boolean ecoFriendly) {
        Map<String, Object> act = new HashMap<>();
        act.put("time", time);
        act.put("activity", activity);
        act.put("location", location);
        act.put("duration", duration);
        act.put("cost", cost);
        act.put("ecoFriendly", ecoFriendly);
        return act;
    }
    
    private Map<String, Object> calculateBudget(long days, int totalBudget) {
        Map<String, Object> budget = new HashMap<>();
        int perDay = totalBudget / (int) days;
        
        budget.put("accommodation", (int)(perDay * 0.4) * days);
        budget.put("food", (int)(perDay * 0.25) * days);
        budget.put("activities", (int)(perDay * 0.2) * days);
        budget.put("transport", (int)(perDay * 0.15) * days);
        budget.put("total", totalBudget);
        
        return budget;
    }
    
    private Map<String, Object> calculateCarbonFootprint(String destination, long days) {
        Map<String, Object> carbon = new HashMap<>();
        
        int flightCO2 = 250;
        int dailyCO2 = 15;
        int total = flightCO2 + (dailyCO2 * (int)days);
        
        carbon.put("flight", flightCO2);
        carbon.put("accommodation", (int)(dailyCO2 * days * 0.3));
        carbon.put("transport", (int)(dailyCO2 * days * 0.4));
        carbon.put("activities", (int)(dailyCO2 * days * 0.3));
        carbon.put("total", total);
        carbon.put("rating", total < 200 ? "Low" : total < 400 ? "Medium" : "High");
        carbon.put("treesToOffset", (int)Math.ceil(total / 20.0));
        carbon.put("ecoAlternatives", Arrays.asList(
            "Take train instead of flight (-150kg CO2)",
            "Choose eco-certified hotels (-20kg CO2)",
            "Use public transport (-30kg CO2)",
            "Eat local vegetarian food (-15kg CO2)"
        ));
        
        return carbon;
    }
    
    private Map<String, String> getEmergencyContacts() {
        Map<String, String> contacts = new HashMap<>();
        contacts.put("police", "100");
        contacts.put("ambulance", "102");
        contacts.put("touristHelpline", "1363");
        contacts.put("nearbyHospital", "City General Hospital - 2.5 km");
        contacts.put("embassy", "US Embassy - 5 km");
        return contacts;
    }
    
    private List<Map<String, Object>> getAttractions(String destination) {
        List<Map<String, Object>> attractions = new ArrayList<>();
        
        attractions.add(createAttraction("Main Museum", 4.5, "2 km", 500));
        attractions.add(createAttraction("Historical Fort", 4.8, "5 km", 300));
        attractions.add(createAttraction("Local Market", 4.2, "1 km", 0));
        attractions.add(createAttraction("Beach/Park", 4.6, "8 km", 0));
        
        return attractions;
    }
    
    private Map<String, Object> createAttraction(String name, double rating, String distance, int entryFee) {
        Map<String, Object> attraction = new HashMap<>();
        attraction.put("name", name);
        attraction.put("rating", rating);
        attraction.put("distance", distance);
        attraction.put("entryFee", entryFee);
        return attraction;
    }
}
