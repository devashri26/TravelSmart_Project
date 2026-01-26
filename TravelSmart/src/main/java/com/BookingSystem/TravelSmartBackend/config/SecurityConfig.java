//package com.BookingSystem.TravelSmartBackend.config;
//
//import com.BookingSystem.TravelSmartBackend.security.JwtAuthEntryPoint;
//import com.BookingSystem.TravelSmartBackend.security.JwtAuthenticationFilter;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//@Configuration
//@EnableMethodSecurity(prePostEnabled = true)
//public class SecurityConfig {
//
//    private final JwtAuthEntryPoint authenticationEntryPoint;
//    private final JwtAuthenticationFilter authenticationFilter;
//
//    public SecurityConfig(JwtAuthEntryPoint authenticationEntryPoint, JwtAuthenticationFilter authenticationFilter) {
//        this.authenticationEntryPoint = authenticationEntryPoint;
//        this.authenticationFilter = authenticationFilter;
//    }
//
//    @Bean
//    public static PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
//        return configuration.getAuthenticationManager();
//    }
//
//    @Bean
//    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//
//        http.csrf(csrf -> csrf.disable())
//                .exceptionHandling(exception -> exception
//                        .authenticationEntryPoint(authenticationEntryPoint)
//                )
//                .sessionManagement(session -> session
//                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // JWT is stateless
//                )
//                .authorizeHttpRequests((authorize) -> authorize
//                        // Public Endpoints
//                        .requestMatchers("/api/auth/**").permitAll() // Allow registration and login
//                        .requestMatchers("/api/public/**").permitAll() // Allow all search APIs
//
//                        // Secured Endpoints (Requires JWT)
//                        .requestMatchers("/api/admin/**").hasRole("ADMIN") // Require ADMIN role for all Admin endpoints
//                        .anyRequest().authenticated() // All other requests require authentication (USER or ADMIN)
//                );
//
//        http.addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//}
