package com.BookingSystem.TravelSmartBackend.controller;

import com.BookingSystem.TravelSmartBackend.model.*;
import com.BookingSystem.TravelSmartBackend.repository.UserRepository;
import com.BookingSystem.TravelSmartBackend.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/super-admin")
@PreAuthorize("hasRole('SUPER_ADMIN')")
@CrossOrigin(origins = "*")
public class SuperAdminController {
    
    private final UserRepository userRepository;
    private final FlightService flightService;
    private final BookingService bookingService;
    private final PasswordEncoder passwordEncoder;
    
    public SuperAdminController(UserRepository userRepository, FlightService flightService, 
                               BookingService bookingService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.flightService = flightService;
        this.bookingService = bookingService;
        this.passwordEncoder = passwordEncoder;
    }
    
    // ==================== DASHBOARD STATISTICS ====================
    
    @GetMapping("/stats/overview")
    public ResponseEntity<Map<String, Object>> getSystemOverview() {
        Map<String, Object> stats = new HashMap<>();
        
        // User statistics
        List<User> allUsers = userRepository.findAll();
        long totalUsers = allUsers.stream().filter(u -> u.getRole() == Role.ROLE_USER).count();
        long totalAdmins = allUsers.stream().filter(u -> u.getRole() == Role.ROLE_ADMIN).count();
        long totalSuperAdmins = allUsers.stream().filter(u -> u.getRole() == Role.ROLE_SUPER_ADMIN).count();
        long activeUsers = allUsers.stream().filter(User::getEnabled).count();
        long lockedUsers = allUsers.stream().filter(User::getLocked).count();
        
        stats.put("totalUsers", totalUsers);
        stats.put("totalAdmins", totalAdmins);
        stats.put("totalSuperAdmins", totalSuperAdmins);
        stats.put("activeUsers", activeUsers);
        stats.put("lockedUsers", lockedUsers);
        
        // Booking statistics
        List<Booking> allBookings = bookingService.getAllBookings();
        long totalBookings = allBookings.size();
        long confirmedBookings = allBookings.stream().filter(b -> "CONFIRMED".equals(b.getStatus())).count();
        long cancelledBookings = allBookings.stream().filter(b -> "CANCELLED".equals(b.getStatus())).count();
        long pendingBookings = allBookings.stream().filter(b -> "PENDING".equals(b.getStatus())).count();
        
        stats.put("totalBookings", totalBookings);
        stats.put("confirmedBookings", confirmedBookings);
        stats.put("cancelledBookings", cancelledBookings);
        stats.put("pendingBookings", pendingBookings);
        
        // Revenue statistics
        double totalRevenue = allBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()))
                .mapToDouble(b -> b.getTotalPrice().doubleValue())
                .sum();
        double pendingRevenue = allBookings.stream()
                .filter(b -> "PENDING".equals(b.getStatus()))
                .mapToDouble(b -> b.getTotalPrice().doubleValue())
                .sum();
        
        stats.put("totalRevenue", totalRevenue);
        stats.put("pendingRevenue", pendingRevenue);
        
        // Inventory statistics
        List<Flight> allFlights = flightService.getAllFlights();
        stats.put("totalFlights", allFlights.size());
        stats.put("totalTrains", 0); // TODO: Add when train service is implemented
        stats.put("totalBuses", 0);  // TODO: Add when bus service is implemented
        stats.put("totalHotels", 0); // TODO: Add when hotel service is implemented
        
        return ResponseEntity.ok(stats);
    }
    
    // ==================== ADMIN MANAGEMENT ====================
    
    @GetMapping("/admins")
    public ResponseEntity<Map<String, Object>> getAllAdmins(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<User> allAdmins = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ROLE_ADMIN || u.getRole() == Role.ROLE_SUPER_ADMIN)
                .collect(Collectors.toList());
        
        // Simple pagination
        int start = page * size;
        int end = Math.min(start + size, allAdmins.size());
        List<User> pageContent = allAdmins.subList(start, end);
        
        // Remove password from response
        List<Map<String, Object>> adminData = pageContent.stream().map(user -> {
            Map<String, Object> data = new HashMap<>();
            data.put("id", user.getId());
            data.put("username", user.getUsername());
            data.put("email", user.getEmail());
            data.put("role", user.getRole().name());
            data.put("enabled", user.getEnabled());
            data.put("locked", user.getLocked());
            return data;
        }).collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", adminData);
        response.put("currentPage", page);
        response.put("totalItems", allAdmins.size());
        response.put("totalPages", (int) Math.ceil((double) allAdmins.size() / size));
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/admins/{id}")
    public ResponseEntity<Map<String, Object>> getAdminById(@PathVariable Long id) {
        User admin = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        
        Map<String, Object> data = new HashMap<>();
        data.put("id", admin.getId());
        data.put("username", admin.getUsername());
        data.put("email", admin.getEmail());
        data.put("role", admin.getRole().name());
        data.put("enabled", admin.getEnabled());
        data.put("locked", admin.getLocked());
        
        return ResponseEntity.ok(data);
    }
    
    @PostMapping("/admins")
    public ResponseEntity<Map<String, Object>> createAdmin(@RequestBody Map<String, String> adminData) {
        // Validate required fields
        if (!adminData.containsKey("username") || !adminData.containsKey("email") || !adminData.containsKey("password")) {
            throw new RuntimeException("Username, email, and password are required");
        }
        
        // Check if username or email already exists
        if (userRepository.findByUsername(adminData.get("username")).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(adminData.get("email")).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
        // Create new admin
        User newAdmin = new User();
        newAdmin.setUsername(adminData.get("username"));
        newAdmin.setEmail(adminData.get("email"));
        newAdmin.setPassword(passwordEncoder.encode(adminData.get("password")));
        newAdmin.setRole(Role.ROLE_ADMIN); // Default to ADMIN role
        newAdmin.setEnabled(true);
        newAdmin.setLocked(false);
        
        User savedAdmin = userRepository.save(newAdmin);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", savedAdmin.getId());
        response.put("username", savedAdmin.getUsername());
        response.put("email", savedAdmin.getEmail());
        response.put("role", savedAdmin.getRole().name());
        response.put("message", "Admin created successfully");
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/admins/{id}")
    public ResponseEntity<Map<String, Object>> updateAdmin(
            @PathVariable Long id,
            @RequestBody Map<String, String> updates) {
        
        User admin = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        
        // Update fields if provided
        if (updates.containsKey("email")) {
            admin.setEmail(updates.get("email"));
        }
        if (updates.containsKey("password")) {
            admin.setPassword(passwordEncoder.encode(updates.get("password")));
        }
        if (updates.containsKey("role")) {
            admin.setRole(Role.valueOf(updates.get("role")));
        }
        
        User updatedAdmin = userRepository.save(admin);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", updatedAdmin.getId());
        response.put("username", updatedAdmin.getUsername());
        response.put("email", updatedAdmin.getEmail());
        response.put("role", updatedAdmin.getRole().name());
        response.put("message", "Admin updated successfully");
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/admins/{id}/status")
    public ResponseEntity<Map<String, String>> updateAdminStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> statusUpdate) {
        
        User admin = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        
        if (statusUpdate.containsKey("enabled")) {
            admin.setEnabled(statusUpdate.get("enabled"));
        }
        if (statusUpdate.containsKey("locked")) {
            admin.setLocked(statusUpdate.get("locked"));
        }
        
        userRepository.save(admin);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Admin status updated successfully");
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/admins/{id}")
    public ResponseEntity<Map<String, String>> deleteAdmin(@PathVariable Long id) {
        User admin = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        
        // Prevent deleting super admins
        if (admin.getRole() == Role.ROLE_SUPER_ADMIN) {
            throw new RuntimeException("Cannot delete super admin");
        }
        
        userRepository.delete(admin);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Admin deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    // ==================== USER MANAGEMENT ====================
    
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        
        List<User> allUsers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ROLE_USER)
                .collect(Collectors.toList());
        
        // Apply search filter if provided
        if (search != null && !search.isEmpty()) {
            String searchLower = search.toLowerCase();
            allUsers = allUsers.stream()
                    .filter(u -> u.getUsername().toLowerCase().contains(searchLower) ||
                               u.getEmail().toLowerCase().contains(searchLower))
                    .collect(Collectors.toList());
        }
        
        // Simple pagination
        int start = page * size;
        int end = Math.min(start + size, allUsers.size());
        List<User> pageContent = allUsers.subList(start, end);
        
        // Remove password from response
        List<Map<String, Object>> userData = pageContent.stream().map(user -> {
            Map<String, Object> data = new HashMap<>();
            data.put("id", user.getId());
            data.put("username", user.getUsername());
            data.put("email", user.getEmail());
            data.put("enabled", user.getEnabled());
            data.put("locked", user.getLocked());
            return data;
        }).collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", userData);
        response.put("currentPage", page);
        response.put("totalItems", allUsers.size());
        response.put("totalPages", (int) Math.ceil((double) allUsers.size() / size));
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/users/{id}/role")
    public ResponseEntity<Map<String, String>> changeUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> roleUpdate) {
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Role newRole = Role.valueOf(roleUpdate.get("role"));
        user.setRole(newRole);
        userRepository.save(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "User role updated successfully");
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        userRepository.delete(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        return ResponseEntity.ok(response);
    }
}
