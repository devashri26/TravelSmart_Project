package com.BookingSystem.TravelSmartBackend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, UserDetailsService userDetailsService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Skips the JWT filter for whitelisted public URLs (like /register and /login).
     * This prevents a 401 error since these endpoints do not carry a JWT token.
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();

        // Whitelist all paths under /api/v1/auth/
        if (path.startsWith("/api/v1/auth/")) {
            logger.debug("Bypassing JwtAuthenticationFilter for whitelisted path: {}", path);
            return true;
        }

        return false;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Note: If shouldNotFilter returns true, this method is never executed for the request.
        logger.info("Executing JwtAuthenticationFilter for URI: {}", request.getRequestURI());

        try {
            // 1. Get JWT from HTTP request
            String token = getJwtFromRequest(request);

            // 2. Validate token
            if (StringUtils.hasText(token) && tokenProvider.validateToken(token)) {

                logger.info("Token validation successful. Proceeding with authentication.");

                // 3. Get username from token
                String username = tokenProvider.getUsername(token);

                // 4. Load user associated with token
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 5. Set Spring Security
                SecurityContextHolder.getContext().setAuthentication(authentication);

                logger.info("User '{}' successfully set in SecurityContext.", username);
            } else if (StringUtils.hasText(token)) {
                logger.warn("JWT was present but failed validation (or other error occurred in validateToken).");
            }

        } catch (Exception ex) {
            // This catches issues like token decryption errors or user not found
            logger.error("Could not set user authentication in security context for URI: {}", request.getRequestURI(), ex);
        }

        filterChain.doFilter(request, response);
    }

    // Bearer <token>
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            logger.debug("Successfully extracted Bearer token from Authorization header.");
            // NOTE: Using substring(7) is sufficient and slightly cleaner than substring(7, bearerToken.length())
            return bearerToken.substring(7);
        }

        logger.debug("No Authorization header found or it does not start with 'Bearer ' for URI: {}", request.getRequestURI());
        return null;
    }
}