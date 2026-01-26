package com.BookingSystem.TravelSmartBackend.controller;

import com.BookingSystem.TravelSmartBackend.dto.LoginDto;
import com.BookingSystem.TravelSmartBackend.dto.LoginResponseDto;
import com.BookingSystem.TravelSmartBackend.dto.RegisterDto;
import com.BookingSystem.TravelSmartBackend.security.JwtTokenProvider;
import com.BookingSystem.TravelSmartBackend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/api/v1/auth") // Auth endpoint - matches security config
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterDto request) {
        // FIXED: Calls the public method 'register' from AuthService
        String response = authService.register(request);

        // The response message will indicate successful registration, pending confirmation.
        return ResponseEntity.ok(response);
    }

    /**
     * Handles user login and JWT generation.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> authenticateUser(@RequestBody LoginDto loginDto) {

        // 1. Authenticate the user credentials using the AuthenticationManager bean
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getUsername(),
                        loginDto.getPassword()
                )
        );

        // 2. Set the authenticated user in the security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Generate JWT token upon successful authentication
        String token = jwtTokenProvider.generateToken(authentication);

        // 4. Get user role from authentication
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_USER");

        // 5. Build response
        LoginResponseDto response = LoginResponseDto.builder()
                .token(token)
                .username(loginDto.getUsername())
                .role(role)
                .build();

        // Return the response to the client
        return ResponseEntity.ok(response);
    }

    // --- NEW ENDPOINT FOR EMAIL CONFIRMATION ---
    /**
     * Endpoint for users to click the confirmation link in their email.
     * Uses RedirectView to send the user back to the frontend app.
     */
    @GetMapping("/confirm")
    public RedirectView confirmRegistration(@RequestParam("token") String token) {
        try {
            // FIXED: Calls the public method 'confirmToken' from AuthService
            authService.confirmToken(token);
            // Redirect to the frontend login page with a success parameter/fragment
            return new RedirectView("http://localhost:3000/#/login?confirmed=true");
        } catch (Exception e) {
            // Redirect to the frontend login page with an error parameter
            // Note: The frontend must handle this redirect and display the error message.
            return new RedirectView("http://localhost:3000/#/login?confirmed=false&error=" + e.getMessage());
        }
    }
}