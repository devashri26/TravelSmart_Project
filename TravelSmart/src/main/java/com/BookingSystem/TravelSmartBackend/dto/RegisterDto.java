package com.BookingSystem.TravelSmartBackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object for user registration requests.
 * Includes fields for password confirmation and basic validation.
 * Note: Role is not included here; users register with default ROLE_USER.
 */
public class RegisterDto {

    @NotBlank(message = "Username is required.")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters.")
    private String username;

    @NotBlank(message = "Email is required.")
    @Email(message = "Email must be valid.")
    private String email;

    @NotBlank(message = "Password is required.")
    @Size(min = 6, message = "Password must be at least 6 characters long.")
    private String password;

    // --- NEW FIELD ADDED FOR CONFIRMATION ---
    @NotBlank(message = "Confirm Password is required.")
    private String confirmPassword;

    // Role field - allows user to select ROLE_USER or ROLE_ADMIN during registration
    private String role;
    
    // Constructors
    public RegisterDto() {}
    
    public RegisterDto(String username, String email, String password, String confirmPassword, String role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.role = role;
    }
    
    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getConfirmPassword() { return confirmPassword; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}