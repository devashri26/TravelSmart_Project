package com.BookingSystem.TravelSmartBackend.config;

import com.BookingSystem.TravelSmartBackend.security.JwtAuthEntryPoint;
import com.BookingSystem.TravelSmartBackend.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Global security configuration for JWT-based authentication.
 */
@Configuration
@EnableMethodSecurity(prePostEnabled = true) // Enables @PreAuthorize on controllers
public class WebSecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtAuthEntryPoint authenticationEntryPoint;
    private final JwtAuthenticationFilter authenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    // Constructor Injection
    public WebSecurityConfig(
            UserDetailsService userDetailsService,
            JwtAuthEntryPoint authenticationEntryPoint,
            JwtAuthenticationFilter authenticationFilter,
            CorsConfigurationSource corsConfigurationSource
    ) {
        this.userDetailsService = userDetailsService;
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.authenticationFilter = authenticationFilter;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
    // Inside SecurityConfig.java or similar class

//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(AbstractHttpConfigurer::disable)
//                .authorizeHttpRequests(authorize -> authorize
//                        // --- CRITICAL CHANGE HERE ---
//                        .requestMatchers("/api/v1/auth/**").permitAll() // Allow public access to all auth paths
//                        .anyRequest().authenticated() // All other requests must be authenticated
//                )
//                // ... (rest of configuration like session management, filters)
//                .addFilterBefore(JwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Enable CORS with custom configuration
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                // Disable CSRF for stateless JWT authentication
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authenticationEntryPoint))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests((authorize) -> authorize
                        // Allow access to authentication endpoints (login/register/confirm)
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        
                        // Allow access to seat locking endpoints (public for demo)
                        .requestMatchers("/api/seat-locks/**").permitAll()

                        // Require ADMIN role for all admin endpoints
                        // Note: Spring Security automatically prefixes role names with "ROLE_"
                        // if you use hasRole(). Since your Role enum likely has names like
                        // ROLE_ADMIN, we use hasAuthority() to match the exact string,
                        // which is more robust and common in modern configurations.
                        .requestMatchers("/api/v1/admin/**").hasAuthority("ROLE_ADMIN")

                        // Require authentication for all other requests
                        .anyRequest().authenticated());

        // Set the custom JWT filter before Spring's default filter
        http.addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}