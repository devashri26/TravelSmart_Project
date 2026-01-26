package com.BookingSystem.TravelSmartBackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
// import org.springframework.cache.annotation.Cacheable; // Removed for now

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class AviationStackService {
    
    private static final String API_KEY = "1742e088415d696a4feb575a1c4f6d13";
    private static final String BASE_URL = "http://api.aviationstack.com/v1/flights";
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public AviationStackService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Search flights by route (departure and arrival airports)
     */
    public List<FlightData> searchFlights(String depIata, String arrIata) {
        try {
            String url = String.format("%s?access_key=%s&dep_iata=%s&arr_iata=%s&limit=50",
                    BASE_URL, API_KEY, depIata, arrIata);
            
            System.out.println("🛫 Fetching flights from AviationStack: " + depIata + " → " + arrIata);
            
            String response = restTemplate.getForObject(url, String.class);
            return parseFlightResponse(response);
            
        } catch (Exception e) {
            System.err.println("❌ AviationStack API error: " + e.getMessage());
            return new ArrayList<>();
        }
    }
    
    /**
     * Get live flight status by flight number
     */
    public FlightData getFlightStatus(String flightIata) {
        try {
            String url = String.format("%s?access_key=%s&flight_iata=%s",
                    BASE_URL, API_KEY, flightIata);
            
            String response = restTemplate.getForObject(url, String.class);
            List<FlightData> flights = parseFlightResponse(response);
            
            return flights.isEmpty() ? null : flights.get(0);
            
        } catch (Exception e) {
            System.err.println("❌ Failed to get flight status: " + e.getMessage());
            return null;
        }
    }
    
    /**
     * Parse AviationStack API response
     */
    private List<FlightData> parseFlightResponse(String jsonResponse) {
        List<FlightData> flights = new ArrayList<>();
        
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode data = root.get("data");
            
            if (data != null && data.isArray()) {
                for (JsonNode flightNode : data) {
                    try {
                        FlightData flight = new FlightData();
                        
                        // Flight info
                        JsonNode flightInfo = flightNode.get("flight");
                        if (flightInfo != null) {
                            flight.setFlightNumber(flightInfo.path("iata").asText("N/A"));
                            flight.setFlightIcao(flightInfo.path("icao").asText("N/A"));
                        }
                        
                        // Airline info
                        JsonNode airline = flightNode.get("airline");
                        if (airline != null) {
                            flight.setAirlineName(airline.path("name").asText("Unknown"));
                            flight.setAirlineIata(airline.path("iata").asText("N/A"));
                        }
                        
                        // Departure info
                        JsonNode departure = flightNode.get("departure");
                        if (departure != null) {
                            flight.setDepartureAirport(departure.path("airport").asText("Unknown"));
                            flight.setDepartureIata(departure.path("iata").asText("N/A"));
                            flight.setDepartureTime(departure.path("scheduled").asText("N/A"));
                            flight.setDepartureTerminal(departure.path("terminal").asText(""));
                            flight.setDepartureGate(departure.path("gate").asText(""));
                        }
                        
                        // Arrival info
                        JsonNode arrival = flightNode.get("arrival");
                        if (arrival != null) {
                            flight.setArrivalAirport(arrival.path("airport").asText("Unknown"));
                            flight.setArrivalIata(arrival.path("iata").asText("N/A"));
                            flight.setArrivalTime(arrival.path("scheduled").asText("N/A"));
                            flight.setArrivalTerminal(arrival.path("terminal").asText(""));
                            flight.setArrivalGate(arrival.path("gate").asText(""));
                        }
                        
                        // Flight status
                        flight.setFlightStatus(flightNode.path("flight_status").asText("unknown"));
                        
                        // Aircraft info
                        JsonNode aircraft = flightNode.get("aircraft");
                        if (aircraft != null) {
                            flight.setAircraftType(aircraft.path("registration").asText(""));
                        }
                        
                        flights.add(flight);
                    } catch (Exception e) {
                        System.err.println("⚠️ Error parsing individual flight: " + e.getMessage());
                        // Continue with next flight
                    }
                }
            }
            
            System.out.println("✅ Parsed " + flights.size() + " flights from AviationStack");
            
        } catch (Exception e) {
            System.err.println("❌ Error parsing flight data: " + e.getMessage());
            e.printStackTrace();
        }
        
        return flights;
    }
    
    /**
     * Flight data model
     */
    public static class FlightData {
        private String flightNumber;
        private String flightIcao;
        private String airlineName;
        private String airlineIata;
        private String departureAirport;
        private String departureIata;
        private String departureTime;
        private String departureTerminal;
        private String departureGate;
        private String arrivalAirport;
        private String arrivalIata;
        private String arrivalTime;
        private String arrivalTerminal;
        private String arrivalGate;
        private String flightStatus;
        private String aircraftType;
        
        // Getters and Setters
        public String getFlightNumber() { return flightNumber; }
        public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }
        
        public String getFlightIcao() { return flightIcao; }
        public void setFlightIcao(String flightIcao) { this.flightIcao = flightIcao; }
        
        public String getAirlineName() { return airlineName; }
        public void setAirlineName(String airlineName) { this.airlineName = airlineName; }
        
        public String getAirlineIata() { return airlineIata; }
        public void setAirlineIata(String airlineIata) { this.airlineIata = airlineIata; }
        
        public String getDepartureAirport() { return departureAirport; }
        public void setDepartureAirport(String departureAirport) { this.departureAirport = departureAirport; }
        
        public String getDepartureIata() { return departureIata; }
        public void setDepartureIata(String departureIata) { this.departureIata = departureIata; }
        
        public String getDepartureTime() { return departureTime; }
        public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }
        
        public String getDepartureTerminal() { return departureTerminal; }
        public void setDepartureTerminal(String departureTerminal) { this.departureTerminal = departureTerminal; }
        
        public String getDepartureGate() { return departureGate; }
        public void setDepartureGate(String departureGate) { this.departureGate = departureGate; }
        
        public String getArrivalAirport() { return arrivalAirport; }
        public void setArrivalAirport(String arrivalAirport) { this.arrivalAirport = arrivalAirport; }
        
        public String getArrivalIata() { return arrivalIata; }
        public void setArrivalIata(String arrivalIata) { this.arrivalIata = arrivalIata; }
        
        public String getArrivalTime() { return arrivalTime; }
        public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }
        
        public String getArrivalTerminal() { return arrivalTerminal; }
        public void setArrivalTerminal(String arrivalTerminal) { this.arrivalTerminal = arrivalTerminal; }
        
        public String getArrivalGate() { return arrivalGate; }
        public void setArrivalGate(String arrivalGate) { this.arrivalGate = arrivalGate; }
        
        public String getFlightStatus() { return flightStatus; }
        public void setFlightStatus(String flightStatus) { this.flightStatus = flightStatus; }
        
        public String getAircraftType() { return aircraftType; }
        public void setAircraftType(String aircraftType) { this.aircraftType = aircraftType; }
    }
}
