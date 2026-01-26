# 🌐 Live API Integration Guide

## 📋 Overview

Integrate real-time flight, train, and bus schedules from external APIs to provide live data to users.

## 🔗 APIs to Integrate

### 1. ✈️ Flights - AviationStack
- **URL:** https://aviationstack.com/
- **Data:** Flight numbers, airlines, routes, schedules
- **Pricing:** Free tier: 100 requests/month
- **Paid:** $9.99/month for 10,000 requests

### 2. 🚂 Trains - RapidAPI
- **URL:** https://rapidapi.com/
- **Data:** Train schedules, routes, station timings
- **Pricing:** Varies by API provider

### 3. 🚌 Buses - MSRTC (Government Data)
- **URL:** https://data.gov.in/catalog/msrtc-route-directory
- **Data:** Bus routes, stoppages, distances
- **Pricing:** FREE (Government Open Data)

## 🏗️ Architecture Design

### Hybrid Approach (Recommended)
Combine your database with external APIs for best performance:

```
User Search Request
    ↓
Backend Service
    ↓
┌─────────────────────────────┐
│  Check Local Database First │
│  (Your admin-added data)    │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│  Fetch from External APIs   │
│  (Live real-time data)      │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│  Merge & Cache Results      │
│  (Best of both worlds)      │
└─────────────────────────────┘
    ↓
Return to User
```

## 📦 Implementation Steps

### Phase 1: Backend Setup

#### Step 1.1: Add Dependencies to pom.xml
```xml
<!-- Add to TravelSmart/pom.xml -->
<dependencies>
    <!-- For HTTP requests to external APIs -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webflux</artifactId>
    </dependency>
    
    <!-- For caching API responses -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-cache</artifactId>
    </dependency>
    
    <dependency>
        <groupId>com.github.ben-manes.caffeine</groupId>
        <artifactId>caffeine</artifactId>
    </dependency>
</dependencies>
```

#### Step 1.2: Add API Keys to application.properties
```properties
# External API Configuration
# AviationStack API
aviationstack.api.key=YOUR_AVIATIONSTACK_API_KEY
aviationstack.api.url=http://api.aviationstack.com/v1

# RapidAPI for Trains
rapidapi.api.key=YOUR_RAPIDAPI_KEY
rapidapi.train.url=https://indian-railway-api.p.rapidapi.com

# MSRTC Bus Data
msrtc.data.url=https://data.gov.in/api/datastore/resource.json

# Cache settings
spring.cache.type=caffeine
spring.cache.caffeine.spec=maximumSize=1000,expireAfterWrite=1h
```

#### Step 1.3: Create External API Service Classes

**Create: ExternalFlightService.java**
```java
package com.BookingSystem.TravelSmartBackend.service.external;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.BookingSystem.TravelSmartBackend.dto.ExternalFlightDTO;
import java.util.List;

@Service
public class ExternalFlightService {
    
    private final WebClient webClient;
    
    @Value("${aviationstack.api.key}")
    private String apiKey;
    
    @Value("${aviationstack.api.url}")
    private String apiUrl;
    
    public ExternalFlightService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(apiUrl).build();
    }
    
    @Cacheable(value = "flights", key = "#from + #to + #date")
    public List<ExternalFlightDTO> searchLiveFlights(String from, String to, String date) {
        try {
            return webClient.get()
                .uri(uriBuilder -> uriBuilder
                    .path("/flights")
                    .queryParam("access_key", apiKey)
                    .queryParam("dep_iata", from)
                    .queryParam("arr_iata", to)
                    .queryParam("flight_date", date)
                    .build())
                .retrieve()
                .bodyToFlux(ExternalFlightDTO.class)
                .collectList()
                .block();
        } catch (Exception e) {
            // Log error and return empty list
            return List.of();
        }
    }
}
```

**Create: ExternalTrainService.java**
```java
package com.BookingSystem.TravelSmartBackend.service.external;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.BookingSystem.TravelSmartBackend.dto.ExternalTrainDTO;
import java.util.List;

@Service
public class ExternalTrainService {
    
    private final WebClient webClient;
    
    @Value("${rapidapi.api.key}")
    private String apiKey;
    
    @Value("${rapidapi.train.url}")
    private String apiUrl;
    
    public ExternalTrainService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(apiUrl).build();
    }
    
    @Cacheable(value = "trains", key = "#from + #to + #date")
    public List<ExternalTrainDTO> searchLiveTrains(String from, String to, String date) {
        try {
            return webClient.get()
                .uri(uriBuilder -> uriBuilder
                    .path("/trains/between")
                    .queryParam("from", from)
                    .queryParam("to", to)
                    .queryParam("date", date)
                    .build())
                .header("X-RapidAPI-Key", apiKey)
                .retrieve()
                .bodyToFlux(ExternalTrainDTO.class)
                .collectList()
                .block();
        } catch (Exception e) {
            return List.of();
        }
    }
}
```

**Create: ExternalBusService.java**
```java
package com.BookingSystem.TravelSmartBackend.service.external;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.BookingSystem.TravelSmartBackend.dto.ExternalBusDTO;
import java.util.List;

@Service
public class ExternalBusService {
    
    private final WebClient webClient;
    
    @Value("${msrtc.data.url}")
    private String apiUrl;
    
    public ExternalBusService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }
    
    @Cacheable(value = "buses", key = "#from + #to")
    public List<ExternalBusDTO> searchLiveBuses(String from, String to) {
        try {
            // MSRTC data is static, but we can filter it
            return webClient.get()
                .uri(apiUrl)
                .retrieve()
                .bodyToFlux(ExternalBusDTO.class)
                .filter(bus -> bus.getSource().equalsIgnoreCase(from) 
                            && bus.getDestination().equalsIgnoreCase(to))
                .collectList()
                .block();
        } catch (Exception e) {
            return List.of();
        }
    }
}
```

#### Step 1.4: Update Existing Services to Use External APIs

**Update FlightService.java:**
```java
@Service
public class FlightService {
    
    private final FlightRepository flightRepository;
    private final ExternalFlightService externalFlightService;
    
    public FlightService(FlightRepository flightRepository, 
                        ExternalFlightService externalFlightService) {
        this.flightRepository = flightRepository;
        this.externalFlightService = externalFlightService;
    }
    
    public List<Flight> searchFlights(String from, String to, LocalDateTime date) {
        // Get local database flights
        List<Flight> localFlights = flightRepository
            .findByDepartureCityAndArrivalCityAndDepartureTimeBetween(
                from, to, date.toLocalDate().atStartOfDay(), 
                date.toLocalDate().atTime(23, 59, 59)
            );
        
        // Get live flights from external API
        List<ExternalFlightDTO> liveFlights = externalFlightService
            .searchLiveFlights(from, to, date.toLocalDate().toString());
        
        // Convert and merge
        List<Flight> convertedLiveFlights = liveFlights.stream()
            .map(this::convertToFlight)
            .collect(Collectors.toList());
        
        // Merge both lists
        List<Flight> allFlights = new ArrayList<>();
        allFlights.addAll(localFlights);
        allFlights.addAll(convertedLiveFlights);
        
        return allFlights;
    }
    
    private Flight convertToFlight(ExternalFlightDTO dto) {
        Flight flight = new Flight();
        flight.setFlightNumber(dto.getFlightNumber());
        flight.setAirline(dto.getAirline());
        flight.setDepartureCity(dto.getDepartureAirport());
        flight.setArrivalCity(dto.getArrivalAirport());
        flight.setDepartureTime(dto.getDepartureTime());
        flight.setArrivalTime(dto.getArrivalTime());
        flight.setPrice(dto.getEstimatedPrice());
        flight.setAvailableSeats(dto.getAvailableSeats());
        return flight;
    }
}
```

### Phase 2: Frontend Updates

#### Step 2.1: Add Loading States for Live Data

**Update FlightSearchPage.jsx:**
```javascript
const [isLoadingLive, setIsLoadingLive] = useState(false);
const [dataSource, setDataSource] = useState('all'); // 'all', 'local', 'live'

const handleSearch = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setIsLoadingLive(true);

  try {
    const searchData = {
      departureCity: extractCity(searchParams.origin),
      arrivalCity: extractCity(searchParams.destination),
      date: searchParams.departureDate
    };

    const results = await flightService.searchFlights(searchData);
    
    setFlights(results);
    
    // Show data source info
    const localCount = results.filter(f => f.source === 'local').length;
    const liveCount = results.filter(f => f.source === 'live').length;
    
    toast.success(
      `Found ${results.length} flight(s)! (${localCount} local, ${liveCount} live)`
    );
  } catch (error) {
    toast.error('Failed to search flights');
  } finally {
    setIsLoading(false);
    setIsLoadingLive(false);
  }
};
```

#### Step 2.2: Add Data Source Badges

```javascript
// In flight card rendering
<div className="flex items-center space-x-2">
  {flight.source === 'live' && (
    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
      <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
      LIVE
    </span>
  )}
  {flight.source === 'local' && (
    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
      LOCAL
    </span>
  )}
</div>
```

## 💰 Cost Estimation

### Free Tier Limits:
- **AviationStack:** 100 requests/month (FREE)
- **RapidAPI Trains:** Varies (usually 100-500/month FREE)
- **MSRTC Buses:** Unlimited (FREE - Government Data)

### Paid Plans:
- **AviationStack Standard:** $9.99/month (10,000 requests)
- **RapidAPI:** $10-50/month depending on provider

### Optimization Tips:
1. **Cache aggressively** - 1 hour cache for schedules
2. **Combine sources** - Show local data first, then live
3. **Rate limiting** - Limit API calls per user
4. **Fallback** - Always have local data as backup

## 🔐 Security Best Practices

### 1. Never Expose API Keys in Frontend
```javascript
// ❌ WRONG - Don't do this
const API_KEY = 'your-api-key-here';

// ✅ CORRECT - Keep in backend
// Backend handles all external API calls
```

### 2. Use Environment Variables
```properties
# application.properties
aviationstack.api.key=${AVIATIONSTACK_KEY:default-key}
```

### 3. Implement Rate Limiting
```java
@RateLimiter(name = "externalApi", fallbackMethod = "fallbackSearch")
public List<Flight> searchLiveFlights(String from, String to, String date) {
    // API call
}
```

## 📊 Implementation Priority

### Phase 1 (Week 1): Setup & Testing
- [ ] Sign up for API keys
- [ ] Add dependencies to pom.xml
- [ ] Create external service classes
- [ ] Test API connections
- [ ] Implement caching

### Phase 2 (Week 2): Integration
- [ ] Update existing services
- [ ] Merge local + live data
- [ ] Add data source tracking
- [ ] Test search functionality

### Phase 3 (Week 3): Frontend
- [ ] Add loading states
- [ ] Add data source badges
- [ ] Improve error handling
- [ ] Add filters (local/live/all)

### Phase 4 (Week 4): Optimization
- [ ] Implement rate limiting
- [ ] Optimize caching strategy
- [ ] Add monitoring/logging
- [ ] Performance testing

## 🧪 Testing Strategy

### 1. Unit Tests
```java
@Test
public void testExternalFlightService() {
    List<ExternalFlightDTO> flights = externalFlightService
        .searchLiveFlights("BOM", "DEL", "2024-12-20");
    assertNotNull(flights);
}
```

### 2. Integration Tests
```java
@Test
public void testMergedFlightSearch() {
    List<Flight> flights = flightService
        .searchFlights("Mumbai", "Delhi", LocalDateTime.now());
    
    // Should have both local and live flights
    assertTrue(flights.stream().anyMatch(f -> f.getSource().equals("local")));
    assertTrue(flights.stream().anyMatch(f -> f.getSource().equals("live")));
}
```

### 3. Manual Testing
- Test with valid routes
- Test with invalid routes
- Test API failures (disconnect internet)
- Test caching (same search twice)

## 🚨 Error Handling

### Graceful Degradation
```java
public List<Flight> searchFlights(String from, String to, LocalDateTime date) {
    List<Flight> localFlights = flightRepository.findByRoute(from, to, date);
    
    try {
        List<ExternalFlightDTO> liveFlights = externalFlightService
            .searchLiveFlights(from, to, date.toString());
        localFlights.addAll(convertLiveFlights(liveFlights));
    } catch (Exception e) {
        // Log error but don't fail - return local data
        log.warn("External API failed, returning local data only", e);
    }
    
    return localFlights;
}
```

## 📈 Monitoring & Analytics

### Track API Usage
```java
@Service
public class ApiUsageService {
    
    public void trackApiCall(String apiName, boolean success) {
        // Log to database or monitoring service
        ApiUsageLog log = new ApiUsageLog();
        log.setApiName(apiName);
        log.setSuccess(success);
        log.setTimestamp(LocalDateTime.now());
        apiUsageRepository.save(log);
    }
}
```

### Dashboard Metrics
- Total API calls per day
- Success/failure rate
- Average response time
- Cost per day
- Cache hit rate

## 🎯 Next Steps

1. **Sign up for API keys:**
   - AviationStack: https://aviationstack.com/signup/free
   - RapidAPI: https://rapidapi.com/auth/sign-up

2. **Download MSRTC data:**
   - Visit: https://data.gov.in/catalog/msrtc-route-directory
   - Download CSV/JSON
   - Import to database

3. **Start with one API:**
   - Begin with MSRTC (free, no limits)
   - Test integration
   - Then add flights and trains

4. **Monitor costs:**
   - Track API usage daily
   - Set up alerts for limits
   - Optimize caching

## 📚 Resources

- **AviationStack Docs:** https://aviationstack.com/documentation
- **RapidAPI Docs:** https://rapidapi.com/docs
- **MSRTC Data:** https://data.gov.in/
- **Spring WebFlux:** https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html
- **Caffeine Cache:** https://github.com/ben-manes/caffeine

---

**Ready to integrate live data!** 🚀
