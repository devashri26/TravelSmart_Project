package com.BookingSystem.TravelSmartBackend.service;

import com.BookingSystem.TravelSmartBackend.dto.RegisterDto;
import com.BookingSystem.TravelSmartBackend.exception.UserAlreadyExistsException;
import com.BookingSystem.TravelSmartBackend.model.User;
import com.BookingSystem.TravelSmartBackend.model.Role;
import com.BookingSystem.TravelSmartBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value; // New Import
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ConfirmationTokenService confirmationTokenService;
    private final EmailService emailService;

    // Inject the frontend URL from application.properties
    @Value("${app.frontend.confirmation-url}")
    private String frontendConfirmationUrl;

    @Autowired
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       ConfirmationTokenService confirmationTokenService,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.confirmationTokenService = confirmationTokenService;
        this.emailService = emailService;
    }

    @Transactional
    public String register(RegisterDto request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

        // 1. Check if user already exists and is enabled
        if (existingUser.isPresent() && existingUser.get().getEnabled()) {
            throw new UserAlreadyExistsException("Email already registered and confirmed.");
        }

        // 2. Handle existing but unconfirmed user (Resend confirmation logic)
        if (existingUser.isPresent() && !existingUser.get().getEnabled()) {
            // Re-send confirmation for unconfirmed user
            User user = existingUser.get();
            // Optional: Update username if provided
            user.setUsername(request.getUsername());
            userRepository.save(user);

            // Generate new token and send email
            String token = confirmationTokenService.generateAndSaveToken(user);

            // --- UPDATED LINK TO FRONTEND ---
            String link = frontendConfirmationUrl + "?token=" + token;
            // --------------------------------

            // Send professional HTML verification email
            try {
                emailService.sendVerificationEmail(user.getEmail(), request.getUsername(), token);
            } catch (Exception e) {
                throw new RuntimeException("Failed to send verification email", e);
            }

            return "Registration incomplete. New confirmation link sent to your email.";
        }

        // 3. Register New User
        // Determine role from request, default to ROLE_USER if not provided
        Role userRole = Role.ROLE_USER;
        if (request.getRole() != null && request.getRole().equals("ROLE_ADMIN")) {
            userRole = Role.ROLE_ADMIN;
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .locked(false)
                .enabled(false)
                .build();

        userRepository.save(user);

        // Generate token and send email for new user
        String token = confirmationTokenService.generateAndSaveToken(user);

        // --- UPDATED LINK TO FRONTEND ---
        String link = frontendConfirmationUrl + "?token=" + token;
        // --------------------------------

        // Send professional HTML verification email
        try {
            emailService.sendVerificationEmail(user.getEmail(), request.getUsername(), token);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send verification email", e);
        }

        return "Registration successful! Please check your email to activate your account.";
    }

    @Transactional
    public String confirmToken(String token) {
        // FIX: Delegation to service method which handles all logic (found in your uploaded ConfirmationTokenService)
        confirmationTokenService.confirmToken(token);
        return "Email confirmed successfully. You can now login.";
    }

}