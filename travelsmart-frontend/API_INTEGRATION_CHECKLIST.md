# ✅ API Integration Checklist

## 🎯 Quick Start Guide

### Step 1: Get API Keys (15 minutes)

#### AviationStack (Flights)
1. Go to https://aviationstack.com/signup/free
2. Sign up for free account
3. Get your API key from dashboard
4. Free tier: 100 requests/month

#### RapidAPI (Trains)
1. Go to https://rapidapi.com/auth/sign-up
2. Sign up for free account
3. Search for "Indian Railway API"
4. Subscribe to free tier
5. Get your API key

#### MSRTC (Buses) - No API Key Needed!
1. Go to https://data.gov.in/catalog/msrtc-route-directory
2. Download CSV or JSON file
3. Import to your database
4. Completely FREE!

### Step 2: Add to Backend (30 minutes)

#### 2.1: Update pom.xml
```xml
<!-- Add these dependencies -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>

<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
</dependency>
```

#### 2.2: Update application.properties
```properties
# Add your API keys
aviationstack.api.key=YOUR_KEY_HERE
aviationstack.api.url=http://api.aviationstack.com/v1

rapidapi.api.key=YOUR_KEY_HERE
rapidapi.train.url=https://indian-railway-api.p.rapidapi.com

# Enable caching
spring.cache.type=caffeine
spring.cache.caffeine.spec=maximumSize=1000,expireAfterWrite=1h
```

#### 2.3: Create External Service Classes
Create these files in `src/main/java/com/BookingSystem/TravelSmartBackend/service/external/`:
- ExternalFlightService.java
- ExternalTrainService.java
- ExternalBusService.java

(See LIVE_API_INTEGRATION_GUIDE.md for full code)

### Step 3: Test Integration (15 minutes)

#### Test Flight API
```bash
# Test AviationStack directly
curl "http://api.aviationstack.com/v1/flights?access_key=YOUR_KEY&dep_iata=BOM&arr_iata=DEL"
```

#### Test Train API
```bash
# Test RapidAPI
curl -X GET "https://indian-railway-api.p.rapidapi.com/trains/between?from=NDLS&to=BCT" \
  -H "X-RapidAPI-Key: YOUR_KEY"
```

### Step 4: Update Frontend (20 minutes)

#### Add Data Source Badges
Show users which data is live vs local:
- Green badge with pulse animation = LIVE data
- Blue badge = LOCAL data from your database

#### Add Loading States
Show "Fetching live data..." while calling external APIs

## 📊 Implementation Options

### Option A: Full Integration (Recommended)
**Pros:**
- Real-time data
- More comprehensive results
- Better user experience

**Cons:**
- API costs (after free tier)
- Slightly slower searches
- Dependency on external services

**Best for:** Production apps with budget

### Option B: Hybrid (Best Balance)
**Pros:**
- Show local data immediately
- Fetch live data in background
- Fallback if API fails

**Cons:**
- More complex code
- Need good caching strategy

**Best for:** Most applications

### Option C: Local Only (Current)
**Pros:**
- Fast searches
- No API costs
- Full control

**Cons:**
- Manual data entry
- Not real-time
- Limited data

**Best for:** MVP/Demo/Testing

## 💡 Recommended Approach

### Start Small, Scale Up:

**Week 1: MSRTC Buses (FREE)**
- Download MSRTC data
- Import to database
- No API calls needed
- Test the flow

**Week 2: Add Flights (100 free/month)**
- Integrate AviationStack
- Test with free tier
- Monitor usage

**Week 3: Add Trains**
- Integrate RapidAPI
- Complete all three types

**Week 4: Optimize**
- Improve caching
- Add monitoring
- Optimize costs

## 🎯 Quick Win: MSRTC Bus Data

### Easiest to Implement (No API Key Needed!)

1. **Download Data:**
   ```
   https://data.gov.in/catalog/msrtc-route-directory
   Format: CSV or JSON
   ```

2. **Import to Database:**
   ```sql
   CREATE TABLE msrtc_routes (
       id BIGINT PRIMARY KEY,
       route_number VARCHAR(50),
       route_name VARCHAR(255),
       source VARCHAR(100),
       destination VARCHAR(100),
       distance DECIMAL(10,2)
   );
   ```

3. **Load Data:**
   ```java
   @Service
   public class MSRTCDataLoader {
       @PostConstruct
       public void loadData() {
           // Read CSV file
           // Parse and save to database
       }
   }
   ```

4. **Use in Search:**
   ```java
   public List<Bus> searchBuses(String from, String to) {
       // Search your database
       return busRepository.findBySourceAndDestination(from, to);
   }
   ```

## 🚨 Important Notes

### API Rate Limits:
- **AviationStack Free:** 100 requests/month
- **RapidAPI Free:** Usually 100-500/month
- **MSRTC:** Unlimited (static data)

### Caching Strategy:
```
First search: Call API + Cache for 1 hour
Same search within 1 hour: Return cached data
After 1 hour: Call API again
```

### Cost Management:
```
100 searches/day × 30 days = 3,000 searches/month
Free tier = 100 requests/month
Need paid plan: $9.99/month
```

### Optimization:
- Cache popular routes longer
- Combine multiple searches
- Use local data as primary
- Live data as supplement

## 📈 Success Metrics

### Track These:
- [ ] API calls per day
- [ ] Cache hit rate (should be >80%)
- [ ] Average response time
- [ ] Cost per search
- [ ] User satisfaction

### Goals:
- Response time < 2 seconds
- Cache hit rate > 80%
- API cost < $20/month
- 95% uptime

## 🎓 Learning Resources

### Tutorials:
1. **Spring WebFlux:** https://spring.io/guides/gs/reactive-rest-service/
2. **Caching:** https://spring.io/guides/gs/caching/
3. **External APIs:** https://www.baeldung.com/spring-webclient-resttemplate

### Documentation:
- AviationStack: https://aviationstack.com/documentation
- RapidAPI: https://rapidapi.com/docs
- Spring Boot: https://docs.spring.io/spring-boot/docs/current/reference/html/

## ✅ Final Checklist

Before going live:
- [ ] API keys secured (not in code)
- [ ] Caching implemented
- [ ] Error handling added
- [ ] Rate limiting configured
- [ ] Monitoring set up
- [ ] Fallback to local data works
- [ ] Cost tracking enabled
- [ ] User feedback collected

## 🚀 Ready to Start?

**Easiest path:**
1. Start with MSRTC buses (free, no API)
2. Test the integration flow
3. Add flights when ready
4. Scale up as needed

**Need help?**
- Check LIVE_API_INTEGRATION_GUIDE.md for detailed code
- Test APIs with Postman first
- Start with free tiers
- Monitor usage closely

---

**Your app will have real-time data!** 🎉
