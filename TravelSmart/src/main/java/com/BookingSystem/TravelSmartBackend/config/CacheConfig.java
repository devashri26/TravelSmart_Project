package com.BookingSystem.TravelSmartBackend.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

/**
 * Enable caching for external API responses
 * Cache configuration is in application.properties
 */
@Configuration
@EnableCaching
public class CacheConfig {
    // Cache configuration is handled by Spring Boot auto-configuration
    // using Caffeine as specified in application.properties
}
