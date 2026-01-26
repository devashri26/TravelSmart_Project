package com.BookingSystem.TravelSmartBackend.config;

import com.BookingSystem.TravelSmartBackend.model.Flight;
import com.BookingSystem.TravelSmartBackend.model.Role;
import com.BookingSystem.TravelSmartBackend.model.User;
import com.BookingSystem.TravelSmartBackend.repository.FlightRepository;
import com.BookingSystem.TravelSmartBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Initializes default users and sample data in the database on application startup.
 * Only creates data if it doesn't already exist.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FlightRepository flightRepository;
    private final PasswordEncoder passwordEncoder;
    
    public DataInitializer(UserRepository userRepository, FlightRepository flightRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.flightRepository = flightRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        createDefaultUsers();
        createSampleFlights();
    }

    private void createDefaultUsers() {
        try {
            // Create super admin user if not exists
            if (!userRepository.existsByUsername("superadmin") && 
                userRepository.findByEmail("superadmin@travelsmart.com").isEmpty()) {
                User superAdmin = User.builder()
                        .username("superadmin")
                        .email("superadmin@travelsmart.com")
                        .password(passwordEncoder.encode("superadmin123"))
                        .role(Role.ROLE_SUPER_ADMIN)
                        .enabled(true)
                        .locked(false)
                        .build();
                userRepository.save(superAdmin);
                System.out.println("✅ Created SUPER ADMIN user - Username: superadmin, Password: superadmin123");
            } else {
                System.out.println("ℹ️  Super admin user already exists - Username: superadmin, Password: superadmin123");
            }
        } catch (Exception e) {
            System.err.println("⚠️  Could not create super admin user (may already exist): " + e.getMessage());
        }
        
        try {
            // Create admin user if not exists
            if (!userRepository.existsByUsername("admin") && 
                userRepository.findByEmail("admin@travelsmart.com").isEmpty()) {
                User admin = User.builder()
                        .username("admin")
                        .email("admin@travelsmart.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ROLE_ADMIN)
                        .enabled(true)
                        .locked(false)
                        .build();
                userRepository.save(admin);
                System.out.println("✅ Created default ADMIN user - Username: admin, Password: admin123");
            } else {
                System.out.println("ℹ️  Admin user already exists - Username: admin, Password: admin123");
            }
        } catch (Exception e) {
            System.err.println("⚠️  Could not create admin user (may already exist): " + e.getMessage());
        }

        try {
            // Create test user if not exists
            if (!userRepository.existsByUsername("testuser") && 
                userRepository.findByEmail("user@travelsmart.com").isEmpty()) {
                User testUser = User.builder()
                        .username("testuser")
                        .email("user@travelsmart.com")
                        .password(passwordEncoder.encode("user123"))
                        .role(Role.ROLE_USER)
                        .enabled(true)
                        .locked(false)
                        .build();
                userRepository.save(testUser);
                System.out.println("✅ Created default USER - Username: testuser, Password: user123");
            } else {
                System.out.println("ℹ️  Test user already exists - Username: testuser, Password: user123");
            }
        } catch (Exception e) {
            System.err.println("⚠️  Could not create test user (may already exist): " + e.getMessage());
        }
    }

    private void createSampleFlights() {
        // Only add sample flights if database is empty
        if (flightRepository.count() > 0) {
            System.out.println("ℹ️  Flights already exist in database, skipping sample data");
            return;
        }

        System.out.println("📝 Adding sample flights to database...");
        
        try {
            LocalDateTime baseDate = LocalDateTime.now().plusDays(1).withHour(6).withMinute(0).withSecond(0);
            
            // Mumbai to Delhi flights
            flightRepository.save(createFlight("AI101", "Air India", "Mumbai", "Delhi", 
                baseDate, baseDate.plusHours(2).plusMinutes(30), 4500.00, 150, 180));
            flightRepository.save(createFlight("6E202", "IndiGo", "Mumbai", "Delhi", 
                baseDate.plusHours(3), baseDate.plusHours(5).plusMinutes(30), 3800.00, 160, 180));
            flightRepository.save(createFlight("SG303", "SpiceJet", "Mumbai", "Delhi", 
                baseDate.plusHours(8), baseDate.plusHours(10).plusMinutes(30), 3500.00, 140, 180));
            
            // Delhi to Mumbai flights
            flightRepository.save(createFlight("AI102", "Air India", "Delhi", "Mumbai", 
                baseDate.plusHours(1), baseDate.plusHours(3).plusMinutes(30), 4500.00, 150, 180));
            flightRepository.save(createFlight("6E203", "IndiGo", "Delhi", "Mumbai", 
                baseDate.plusHours(6), baseDate.plusHours(8).plusMinutes(30), 3800.00, 160, 180));
            
            // Bangalore to Delhi flights
            flightRepository.save(createFlight("AI201", "Air India", "Bangalore", "Delhi", 
                baseDate.plusMinutes(30), baseDate.plusHours(3).plusMinutes(30), 5200.00, 150, 180));
            flightRepository.save(createFlight("6E301", "IndiGo", "Bangalore", "Delhi", 
                baseDate.plusHours(4), baseDate.plusHours(7), 4800.00, 160, 180));
            
            // Delhi to Bangalore flights
            flightRepository.save(createFlight("AI202", "Air India", "Delhi", "Bangalore", 
                baseDate.plusHours(2), baseDate.plusHours(5), 5200.00, 150, 180));
            
            // Mumbai to Bangalore flights
            flightRepository.save(createFlight("AI301", "Air India", "Mumbai", "Bangalore", 
                baseDate.plusHours(1).plusMinutes(30), baseDate.plusHours(3).plusMinutes(30), 3800.00, 150, 180));
            flightRepository.save(createFlight("6E401", "IndiGo", "Mumbai", "Bangalore", 
                baseDate.plusHours(7), baseDate.plusHours(9), 3500.00, 160, 180));
            
            System.out.println("✅ Successfully added 10 sample flights");
        } catch (Exception e) {
            System.err.println("❌ Error adding sample flights: " + e.getMessage());
        }
    }

    private Flight createFlight(String flightNumber, String airline, String origin, String destination,
                                LocalDateTime departureTime, LocalDateTime arrivalTime, 
                                Double price, Integer availableSeats, Integer totalSeats) {
        Flight flight = new Flight();
        flight.setFlightNumber(flightNumber);
        flight.setAirline(airline);
        flight.setDepartureCity(origin);
        flight.setArrivalCity(destination);
        flight.setDepartureTime(departureTime);
        flight.setArrivalTime(arrivalTime);
        flight.setPrice(java.math.BigDecimal.valueOf(price));
        flight.setAvailableSeats(availableSeats);
        return flight;
    }
}
