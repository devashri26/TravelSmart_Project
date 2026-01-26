package com.BookingSystem.TravelSmartBackend.controller;

import com.BookingSystem.TravelSmartBackend.model.User;
import com.BookingSystem.TravelSmartBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@RestController
@RequestMapping("/api/v1/smart-trip-planner")
@CrossOrigin(origins = "*")
public class SmartTripPlannerController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/generate")
    public ResponseEntity<?> generateSmartItinerary(@RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            System.out.println("Received smart trip planner request: " + request);
            
            // Get username from authentication and fetch our User model
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
            
            // Extract and validate request data
            String destination = (String) request.get("destination");
            String startDate = (String) request.get("startDate");
            String endDate = (String) request.get("endDate");
            Integer budget = ((Number) request.get("budget")).intValue();
            Integer travelers = ((Number) request.get("travelers")).intValue();
            String travelStyle = (String) request.get("travelStyle");
            String accommodationType = (String) request.get("accommodationType");
            String transportPreference = (String) request.get("transportPreference");
            String activityLevel = (String) request.get("activityLevel");
            
            @SuppressWarnings("unchecked")
            List<String> interests = (List<String>) request.get("interests");
            
            // Calculate days
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
            long days = ChronoUnit.DAYS.between(start, end);
            
            // Generate comprehensive smart itinerary
            Map<String, Object> smartItinerary = new HashMap<>();
            smartItinerary.put("destination", destination);
            smartItinerary.put("duration", days);
            smartItinerary.put("travelers", travelers);
            smartItinerary.put("travelStyle", travelStyle);
            smartItinerary.put("days", generateSmartDays(days, interests, destination, travelStyle, activityLevel));
            smartItinerary.put("budgetBreakdown", generateDetailedBudget(days, budget, travelStyle, accommodationType));
            smartItinerary.put("accommodationOptions", generateAccommodationOptions(destination, accommodationType, budget, days));
            smartItinerary.put("transportOptions", generateTransportOptions(destination, transportPreference, budget));
            smartItinerary.put("alternativeActivities", generateAlternativeActivities(interests, destination));
            smartItinerary.put("weatherInfo", generateWeatherInfo(destination, startDate));
            smartItinerary.put("localTips", generateLocalTips(destination));
            smartItinerary.put("packingList", generatePackingList(destination, travelStyle, days));
            smartItinerary.put("carbonFootprint", calculateDetailedCarbonFootprint(destination, days, transportPreference));
            
            return ResponseEntity.ok(smartItinerary);
        } catch (Exception e) {
            System.out.println("Error in smart trip planner: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/optimize-budget")
    public ResponseEntity<?> optimizeBudget(@RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            Integer currentBudget = ((Number) request.get("currentBudget")).intValue();
            Integer targetBudget = ((Number) request.get("targetBudget")).intValue();
            String destination = (String) request.get("destination");
            Long days = ((Number) request.get("days")).longValue();
            
            Map<String, Object> optimizedPlan = new HashMap<>();
            optimizedPlan.put("originalBudget", currentBudget);
            optimizedPlan.put("targetBudget", targetBudget);
            optimizedPlan.put("savings", currentBudget - targetBudget);
            optimizedPlan.put("optimizations", generateBudgetOptimizations(currentBudget, targetBudget, days));
            optimizedPlan.put("alternativeOptions", generateBudgetAlternatives(destination, targetBudget, days));
            
            return ResponseEntity.ok(optimizedPlan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/get-alternatives")
    public ResponseEntity<?> getAlternatives(@RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            String activityType = (String) request.get("activityType");
            String destination = (String) request.get("destination");
            Integer currentCost = ((Number) request.get("currentCost")).intValue();
            
            List<Map<String, Object>> alternatives = generateActivityAlternatives(activityType, destination, currentCost);
            
            return ResponseEntity.ok(Map.of("alternatives", alternatives));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/save-customized")
    public ResponseEntity<?> saveCustomizedItinerary(@RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
            
            // In a real implementation, you would save this to a database
            // For now, we'll just return a success response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Customized itinerary saved successfully");
            response.put("itineraryId", "SMART_" + System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private List<Map<String, Object>> generateSmartDays(long days, List<String> interests, String destination, String travelStyle, String activityLevel) {
        List<Map<String, Object>> daysList = new ArrayList<>();
        
        for (int i = 1; i <= Math.min(days, 10); i++) {
            Map<String, Object> day = new HashMap<>();
            day.put("day", i);
            day.put("title", generateDayTitle(i, days, interests, travelStyle));
            day.put("activities", generateSmartActivities(i, interests, destination, travelStyle, activityLevel));
            day.put("meals", generateMealSuggestions(destination, travelStyle));
            day.put("transport", generateDayTransport(travelStyle));
            day.put("estimatedCost", calculateDayCost(travelStyle, activityLevel));
            day.put("energyLevel", calculateEnergyLevel(i, activityLevel));
            daysList.add(day);
        }
        
        return daysList;
    }

    private String generateDayTitle(int day, long totalDays, List<String> interests, String travelStyle) {
        if (day == 1) return "Arrival & City Orientation";
        if (day == totalDays) return "Departure & Last Moments";
        
        String primaryInterest = interests.isEmpty() ? "Exploration" : interests.get((day - 2) % interests.size());
        return "Day " + day + " - " + capitalizeFirst(primaryInterest) + " Adventure";
    }

    private List<Map<String, Object>> generateSmartActivities(int day, List<String> interests, String destination, String travelStyle, String activityLevel) {
        List<Map<String, Object>> activities = new ArrayList<>();
        
        // Morning activities
        activities.add(createSmartActivity("08:00 AM", 
            day == 1 ? "Hotel check-in & welcome breakfast" : "Energizing breakfast at local spot",
            "Hotel/Local Cafe", "1 hour", 
            travelStyle.equals("budget") ? 200 : travelStyle.equals("luxury") ? 800 : 400,
            "food", true, "low"));
            
        // Main morning activity
        activities.add(createSmartActivity("10:00 AM", 
            generateActivityByInterest(interests, destination, "morning"),
            "Main Tourist Area", 
            activityLevel.equals("high") ? "3 hours" : "2 hours",
            travelStyle.equals("budget") ? 300 : travelStyle.equals("luxury") ? 1200 : 600,
            "sightseeing", false, activityLevel));
            
        // Lunch
        activities.add(createSmartActivity("01:00 PM", 
            "Authentic local cuisine experience",
            "Local Restaurant District", "1.5 hours",
            travelStyle.equals("budget") ? 300 : travelStyle.equals("luxury") ? 1000 : 500,
            "food", true, "low"));
            
        // Afternoon activity
        activities.add(createSmartActivity("03:30 PM", 
            generateActivityByInterest(interests, destination, "afternoon"),
            "Cultural District", 
            activityLevel.equals("high") ? "3 hours" : "2 hours",
            travelStyle.equals("budget") ? 250 : travelStyle.equals("luxury") ? 800 : 400,
            "culture", true, activityLevel));
            
        // Evening activity
        activities.add(createSmartActivity("07:00 PM", 
            travelStyle.equals("luxury") ? "Fine dining & sunset views" : "Street food tour & local nightlife",
            "Entertainment District", "2.5 hours",
            travelStyle.equals("budget") ? 400 : travelStyle.equals("luxury") ? 1500 : 700,
            "entertainment", false, "medium"));
        
        return activities;
    }

    private String generateActivityByInterest(List<String> interests, String destination, String timeOfDay) {
        if (interests.isEmpty()) return "General sightseeing tour";
        
        String interest = interests.get(new Random().nextInt(interests.size()));
        
        switch (interest.toLowerCase()) {
            case "culture": return timeOfDay.equals("morning") ? "Museum & heritage site visit" : "Traditional craft workshop";
            case "adventure": return timeOfDay.equals("morning") ? "Hiking & nature exploration" : "Adventure sports activity";
            case "food": return timeOfDay.equals("morning") ? "Local market food tour" : "Cooking class experience";
            case "history": return timeOfDay.equals("morning") ? "Historical monuments tour" : "Archaeological site visit";
            case "nature": return timeOfDay.equals("morning") ? "Botanical garden visit" : "Sunset nature walk";
            case "art": return timeOfDay.equals("morning") ? "Art gallery exploration" : "Local artist studio visit";
            case "music": return timeOfDay.equals("morning") ? "Traditional music experience" : "Live music venue";
            case "shopping": return timeOfDay.equals("morning") ? "Local markets exploration" : "Artisan shopping district";
            case "nightlife": return timeOfDay.equals("morning") ? "City walking tour" : "Rooftop bars & nightlife";
            case "wellness": return timeOfDay.equals("morning") ? "Spa & wellness center" : "Meditation & yoga session";
            default: return "Explore " + destination + " highlights";
        }
    }

    private Map<String, Object> createSmartActivity(String time, String activity, String location, 
                                                   String duration, int cost, String category, 
                                                   boolean ecoFriendly, String energyLevel) {
        Map<String, Object> act = new HashMap<>();
        act.put("time", time);
        act.put("activity", activity);
        act.put("location", location);
        act.put("duration", duration);
        act.put("cost", cost);
        act.put("category", category);
        act.put("ecoFriendly", ecoFriendly);
        act.put("energyLevel", energyLevel);
        act.put("customizable", true);
        return act;
    }

    private Map<String, Object> generateDetailedBudget(long days, int totalBudget, String travelStyle, String accommodationType) {
        Map<String, Object> budget = new HashMap<>();
        
        // Adjust percentages based on travel style
        double accommodationPercent = travelStyle.equals("luxury") ? 0.45 : travelStyle.equals("budget") ? 0.30 : 0.35;
        double foodPercent = travelStyle.equals("luxury") ? 0.25 : travelStyle.equals("budget") ? 0.20 : 0.25;
        double activitiesPercent = travelStyle.equals("luxury") ? 0.20 : travelStyle.equals("budget") ? 0.30 : 0.25;
        double transportPercent = 0.15;
        double miscPercent = 0.05;
        
        int accommodation = (int)(totalBudget * accommodationPercent);
        int food = (int)(totalBudget * foodPercent);
        int activities = (int)(totalBudget * activitiesPercent);
        int transport = (int)(totalBudget * transportPercent);
        int misc = (int)(totalBudget * miscPercent);
        
        budget.put("accommodation", accommodation);
        budget.put("food", food);
        budget.put("activities", activities);
        budget.put("transport", transport);
        budget.put("miscellaneous", misc);
        budget.put("total", totalBudget);
        budget.put("dailyAverage", totalBudget / days);
        budget.put("breakdown", Arrays.asList(
            Map.of("category", "Accommodation", "amount", accommodation, "percentage", (int)(accommodationPercent * 100)),
            Map.of("category", "Food & Dining", "amount", food, "percentage", (int)(foodPercent * 100)),
            Map.of("category", "Activities", "amount", activities, "percentage", (int)(activitiesPercent * 100)),
            Map.of("category", "Transport", "amount", transport, "percentage", (int)(transportPercent * 100)),
            Map.of("category", "Miscellaneous", "amount", misc, "percentage", (int)(miscPercent * 100))
        ));
        
        return budget;
    }

    private List<Map<String, Object>> generateAccommodationOptions(String destination, String type, int budget, long days) {
        List<Map<String, Object>> options = new ArrayList<>();
        int dailyBudget = (int)(budget * 0.35 / days);
        
        options.add(createAccommodationOption("Luxury Resort", dailyBudget * 2, 5, "Pool, Spa, Fine Dining", true));
        options.add(createAccommodationOption("Boutique Hotel", dailyBudget, 4, "Central Location, Modern Amenities", true));
        options.add(createAccommodationOption("Budget Hotel", dailyBudget / 2, 3, "Clean, Basic Amenities", false));
        options.add(createAccommodationOption("Hostel", dailyBudget / 3, 2, "Shared Facilities, Social", false));
        
        return options;
    }

    private Map<String, Object> createAccommodationOption(String name, int pricePerNight, int stars, String amenities, boolean recommended) {
        Map<String, Object> option = new HashMap<>();
        option.put("name", name);
        option.put("pricePerNight", pricePerNight);
        option.put("stars", stars);
        option.put("amenities", amenities);
        option.put("recommended", recommended);
        option.put("rating", 4.0 + (stars - 2) * 0.3);
        return option;
    }

    private List<Map<String, Object>> generateTransportOptions(String destination, String preference, int budget) {
        List<Map<String, Object>> options = new ArrayList<>();
        
        options.add(createTransportOption("Private Car", 1500, "Door-to-door, Flexible timing", false));
        options.add(createTransportOption("Taxi/Uber", 800, "Convenient, On-demand", false));
        options.add(createTransportOption("Public Transport", 200, "Economical, Local experience", true));
        options.add(createTransportOption("Bicycle Rental", 300, "Eco-friendly, Exercise", true));
        options.add(createTransportOption("Walking", 0, "Free, Healthy, Immersive", true));
        
        return options;
    }

    private Map<String, Object> createTransportOption(String mode, int dailyCost, String description, boolean ecoFriendly) {
        Map<String, Object> option = new HashMap<>();
        option.put("mode", mode);
        option.put("dailyCost", dailyCost);
        option.put("description", description);
        option.put("ecoFriendly", ecoFriendly);
        return option;
    }

    private List<Map<String, Object>> generateAlternativeActivities(List<String> interests, String destination) {
        List<Map<String, Object>> alternatives = new ArrayList<>();
        
        for (String interest : interests) {
            alternatives.addAll(getActivitiesByInterest(interest, destination));
        }
        
        return alternatives;
    }

    private List<Map<String, Object>> getActivitiesByInterest(String interest, String destination) {
        List<Map<String, Object>> activities = new ArrayList<>();
        
        switch (interest.toLowerCase()) {
            case "culture":
                activities.add(createAlternativeActivity("Traditional Dance Show", 500, "2 hours", "evening"));
                activities.add(createAlternativeActivity("Local Craft Workshop", 800, "3 hours", "afternoon"));
                break;
            case "adventure":
                activities.add(createAlternativeActivity("Rock Climbing", 1200, "4 hours", "morning"));
                activities.add(createAlternativeActivity("River Rafting", 1500, "6 hours", "full-day"));
                break;
            case "food":
                activities.add(createAlternativeActivity("Street Food Tour", 600, "3 hours", "evening"));
                activities.add(createAlternativeActivity("Cooking Class", 1000, "4 hours", "afternoon"));
                break;
        }
        
        return activities;
    }

    private Map<String, Object> createAlternativeActivity(String name, int cost, String duration, String timeSlot) {
        Map<String, Object> activity = new HashMap<>();
        activity.put("name", name);
        activity.put("cost", cost);
        activity.put("duration", duration);
        activity.put("timeSlot", timeSlot);
        activity.put("rating", 4.0 + Math.random());
        return activity;
    }

    private Map<String, Object> generateWeatherInfo(String destination, String startDate) {
        Map<String, Object> weather = new HashMap<>();
        weather.put("averageTemp", "25°C");
        weather.put("condition", "Partly Cloudy");
        weather.put("rainfall", "Low");
        weather.put("humidity", "65%");
        weather.put("recommendation", "Light layers recommended, carry umbrella");
        return weather;
    }

    private List<String> generateLocalTips(String destination) {
        return Arrays.asList(
            "Learn basic local greetings - locals appreciate the effort",
            "Carry cash as some places don't accept cards",
            "Dress modestly when visiting religious sites",
            "Try local transportation for authentic experience",
            "Download offline maps before exploring",
            "Keep emergency contacts handy",
            "Respect local customs and traditions"
        );
    }

    private List<String> generatePackingList(String destination, String travelStyle, long days) {
        List<String> items = new ArrayList<>();
        items.add("Comfortable walking shoes");
        items.add("Weather-appropriate clothing");
        items.add("Sunscreen and sunglasses");
        items.add("Portable charger");
        items.add("First aid kit");
        items.add("Travel documents");
        
        if (travelStyle.equals("adventure")) {
            items.add("Hiking boots");
            items.add("Waterproof jacket");
        }
        
        if (days > 7) {
            items.add("Laundry detergent");
            items.add("Extra storage bags");
        }
        
        return items;
    }

    private Map<String, Object> calculateDetailedCarbonFootprint(String destination, long days, String transportPreference) {
        Map<String, Object> carbon = new HashMap<>();
        
        int flightCO2 = 300;
        int dailyCO2 = transportPreference.equals("public") ? 10 : transportPreference.equals("private") ? 25 : 15;
        int accommodationCO2 = (int)(days * 8);
        int activitiesCO2 = (int)(days * 5);
        
        int total = flightCO2 + (dailyCO2 * (int)days) + accommodationCO2 + activitiesCO2;
        
        carbon.put("flight", flightCO2);
        carbon.put("dailyTransport", dailyCO2 * (int)days);
        carbon.put("accommodation", accommodationCO2);
        carbon.put("activities", activitiesCO2);
        carbon.put("total", total);
        carbon.put("rating", total < 250 ? "Excellent" : total < 400 ? "Good" : total < 600 ? "Fair" : "High Impact");
        carbon.put("offsetCost", (int)(total * 0.02)); // ₹2 per kg CO2
        carbon.put("ecoTips", Arrays.asList(
            "Choose eco-certified accommodations",
            "Use public transport or walk when possible",
            "Eat local, seasonal food",
            "Avoid single-use plastics",
            "Support local conservation efforts"
        ));
        
        return carbon;
    }

    private List<Map<String, Object>> generateMealSuggestions(String destination, String travelStyle) {
        List<Map<String, Object>> meals = new ArrayList<>();
        
        int budgetMultiplier = travelStyle.equals("luxury") ? 3 : travelStyle.equals("budget") ? 1 : 2;
        
        meals.add(Map.of("meal", "Breakfast", "suggestion", "Local cafe with traditional items", "cost", 200 * budgetMultiplier));
        meals.add(Map.of("meal", "Lunch", "suggestion", "Popular local restaurant", "cost", 400 * budgetMultiplier));
        meals.add(Map.of("meal", "Dinner", "suggestion", "Recommended dining experience", "cost", 600 * budgetMultiplier));
        
        return meals;
    }

    private String generateDayTransport(String travelStyle) {
        switch (travelStyle) {
            case "luxury": return "Private car with driver";
            case "budget": return "Public transport & walking";
            default: return "Mix of taxi and public transport";
        }
    }

    private int calculateDayCost(String travelStyle, String activityLevel) {
        int baseCost = travelStyle.equals("luxury") ? 3000 : travelStyle.equals("budget") ? 1000 : 2000;
        int activityMultiplier = activityLevel.equals("high") ? 2 : activityLevel.equals("low") ? 1 : 1;
        return baseCost * activityMultiplier;
    }

    private String calculateEnergyLevel(int day, String activityLevel) {
        if (day == 1) return "medium"; // Arrival day
        return activityLevel;
    }

    private List<Map<String, Object>> generateBudgetOptimizations(int current, int target, long days) {
        List<Map<String, Object>> optimizations = new ArrayList<>();
        int savings = current - target;
        
        optimizations.add(Map.of(
            "category", "Accommodation",
            "suggestion", "Choose budget-friendly options",
            "savings", savings * 40 / 100,
            "impact", "Moderate comfort reduction"
        ));
        
        optimizations.add(Map.of(
            "category", "Food",
            "suggestion", "Mix of restaurants and street food",
            "savings", savings * 25 / 100,
            "impact", "More local food experiences"
        ));
        
        optimizations.add(Map.of(
            "category", "Transport",
            "suggestion", "Use public transport more",
            "savings", savings * 20 / 100,
            "impact", "More local interaction"
        ));
        
        optimizations.add(Map.of(
            "category", "Activities",
            "suggestion", "Choose free/low-cost alternatives",
            "savings", savings * 15 / 100,
            "impact", "Different but enriching experiences"
        ));
        
        return optimizations;
    }

    private List<Map<String, Object>> generateBudgetAlternatives(String destination, int budget, long days) {
        List<Map<String, Object>> alternatives = new ArrayList<>();
        
        alternatives.add(Map.of(
            "type", "Extended Stay",
            "description", "Stay longer with lower daily budget",
            "newDuration", days + 2,
            "dailyBudget", budget / (days + 2)
        ));
        
        alternatives.add(Map.of(
            "type", "Off-Season Travel",
            "description", "Travel during off-peak season",
            "savings", "20-30%",
            "benefits", "Less crowded, authentic experience"
        ));
        
        return alternatives;
    }

    private List<Map<String, Object>> generateActivityAlternatives(String activityType, String destination, int currentCost) {
        List<Map<String, Object>> alternatives = new ArrayList<>();
        
        alternatives.add(Map.of(
            "name", "Budget Alternative",
            "cost", currentCost / 2,
            "description", "Similar experience at lower cost",
            "rating", 4.0
        ));
        
        alternatives.add(Map.of(
            "name", "Premium Option",
            "cost", currentCost * 2,
            "description", "Enhanced experience with premium features",
            "rating", 4.8
        ));
        
        alternatives.add(Map.of(
            "name", "Group Activity",
            "cost", (int)(currentCost * 0.7),
            "description", "Join group tour for better rates",
            "rating", 4.3
        ));
        
        return alternatives;
    }

    private String capitalizeFirst(String str) {
        if (str == null || str.isEmpty()) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }
}