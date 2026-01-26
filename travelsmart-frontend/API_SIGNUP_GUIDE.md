# 🔑 API Keys Signup Guide

## ✅ Step 1: Add Dependencies (DONE!)

I've already added these to your `pom.xml`:
- ✅ spring-boot-starter-webflux (for HTTP calls)
- ✅ spring-boot-starter-cache (for caching)
- ✅ caffeine (cache implementation)
- ✅ jackson-datatype-jsr310 (JSON parsing)

And updated `application.properties` with configuration placeholders.

## 🔑 Step 2: Sign Up for API Keys

### 1️⃣ AviationStack (Flights) - FREE

**What you get:**
- Real-time flight data
- Flight schedules
- Airline information
- 100 FREE requests/month

**Sign up steps:**

1. **Go to:** https://aviationstack.com/signup/free

2. **Fill in the form:**
   ```
   Email: your-email@example.com
   Password: (create a strong password)
   ```

3. **Verify your email:**
   - Check your inbox
   - Click verification link

4. **Get your API key:**
   - Login to dashboard: https://aviationstack.com/dashboard
   - Copy your API Access Key
   - It looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

5. **Add to application.properties:**
   ```properties
   aviationstack.api.key=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   ```

**Test your key:**
```bash
curl "http://api.aviationstack.com/v1/flights?access_key=YOUR_KEY&limit=1"
```

---

### 2️⃣ RapidAPI (Trains) - FREE

**What you get:**
- Indian Railway schedules
- Train routes
- Station timings
- 100-500 FREE requests/month (varies by API)

**Sign up steps:**

1. **Go to:** https://rapidapi.com/auth/sign-up

2. **Sign up with:**
   - Email
   - Google account
   - GitHub account

3. **Search for Indian Railway API:**
   - Go to: https://rapidapi.com/hub
   - Search: "Indian Railway"
   - Popular options:
     - "Indian Railway API" by IRCTC
     - "Indian Railways" by RapidAPI
     - "IRCTC API" by various providers

4. **Subscribe to FREE tier:**
   - Click "Subscribe to Test"
   - Select "Basic" (FREE) plan
   - Click "Subscribe"

5. **Get your API key:**
   - Go to: https://rapidapi.com/developer/apps
   - Click on your app
   - Copy "X-RapidAPI-Key"
   - It looks like: `1234567890abcdefghijklmnopqrstuv`

6. **Add to application.properties:**
   ```properties
   rapidapi.api.key=1234567890abcdefghijklmnopqrstuv
   ```

**Test your key:**
```bash
curl -X GET "https://indian-railway-api.p.rapidapi.com/trains" \
  -H "X-RapidAPI-Key: YOUR_KEY" \
  -H "X-RapidAPI-Host: indian-railway-api.p.rapidapi.com"
```

---

### 3️⃣ MSRTC (Buses) - FREE (No API Key!)

**What you get:**
- Complete MSRTC bus routes
- Route numbers and names
- Source and destination
- Stoppages and distances
- **Completely FREE - No limits!**

**Download data:**

1. **Go to:** https://data.gov.in/catalog/msrtc-route-directory

2. **Download the dataset:**
   - Click "Download" button
   - Choose format: CSV or JSON
   - No registration needed!

3. **File contains:**
   ```
   - Route Number
   - Route Name
   - Source
   - Destination
   - Distance
   - Stoppages
   ```

4. **Import to database:**
   - We'll create a script to import this data
   - One-time import
   - No API calls needed!

---

## 📝 Update Your application.properties

After getting your API keys, update this file:
`TravelSmart/src/main/resources/application.properties`

```properties
# Replace YOUR_AVIATIONSTACK_API_KEY_HERE with your actual key
aviationstack.api.key=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Replace YOUR_RAPIDAPI_KEY_HERE with your actual key
rapidapi.api.key=1234567890abcdefghijklmnopqrstuv
```

**⚠️ IMPORTANT:** Never commit API keys to Git!

Add to `.gitignore`:
```
application.properties
application-*.properties
```

Or use environment variables:
```properties
aviationstack.api.key=${AVIATIONSTACK_KEY:default-key}
rapidapi.api.key=${RAPIDAPI_KEY:default-key}
```

---

## 🧪 Test Your API Keys

### Test AviationStack:

**Using curl:**
```bash
curl "http://api.aviationstack.com/v1/flights?access_key=YOUR_KEY&limit=1"
```

**Expected response:**
```json
{
  "pagination": {
    "limit": 1,
    "offset": 0,
    "count": 1,
    "total": 1000
  },
  "data": [
    {
      "flight_date": "2024-12-01",
      "flight_status": "scheduled",
      "departure": {
        "airport": "Mumbai",
        "iata": "BOM"
      },
      "arrival": {
        "airport": "Delhi",
        "iata": "DEL"
      },
      "airline": {
        "name": "Air India"
      },
      "flight": {
        "number": "AI101"
      }
    }
  ]
}
```

### Test RapidAPI:

**Using curl:**
```bash
curl -X GET "https://indian-railway-api.p.rapidapi.com/trains" \
  -H "X-RapidAPI-Key: YOUR_KEY" \
  -H "X-RapidAPI-Host: indian-railway-api.p.rapidapi.com"
```

**Expected response:**
```json
{
  "trains": [
    {
      "train_number": "12951",
      "train_name": "Rajdhani Express",
      "from_station": "NDLS",
      "to_station": "BCT",
      "departure_time": "16:00",
      "arrival_time": "08:00"
    }
  ]
}
```

---

## 💰 Pricing & Limits

### AviationStack:

| Plan | Price | Requests/Month | Features |
|------|-------|----------------|----------|
| **Free** | $0 | 100 | Basic flight data |
| **Standard** | $9.99 | 10,000 | Real-time updates |
| **Professional** | $49.99 | 100,000 | Historical data |

### RapidAPI (Varies by provider):

| Plan | Price | Requests/Month |
|------|-------|----------------|
| **Basic** | $0 | 100-500 |
| **Pro** | $10-20 | 10,000 |
| **Ultra** | $50+ | 100,000+ |

### MSRTC:

| Plan | Price | Requests |
|------|-------|----------|
| **Open Data** | $0 | Unlimited |

---

## 🎯 Recommended Strategy

### For Development/Testing:
1. ✅ Use FREE tiers
2. ✅ Implement caching (1 hour)
3. ✅ Start with MSRTC (unlimited)
4. ✅ Test with 2-3 searches per day

### For Production:
1. Monitor usage daily
2. Upgrade when hitting limits
3. Optimize caching (increase to 2-4 hours)
4. Consider paid plans ($10-20/month)

### Cost Optimization:
```
100 searches/day × 30 days = 3,000 searches/month
Free tier = 100 requests/month
Cache hit rate = 80%
Actual API calls = 600/month
Need: Standard plan ($9.99/month)
```

---

## ✅ Checklist

Before proceeding to next step:

- [ ] Signed up for AviationStack
- [ ] Got AviationStack API key
- [ ] Tested AviationStack API
- [ ] Signed up for RapidAPI
- [ ] Subscribed to Indian Railway API
- [ ] Got RapidAPI key
- [ ] Tested RapidAPI
- [ ] Downloaded MSRTC data
- [ ] Updated application.properties
- [ ] Added keys to .gitignore
- [ ] Dependencies added to pom.xml ✅ (Already done!)

---

## 🚨 Troubleshooting

### "Invalid API Key" error:
- Check for typos in API key
- Verify key is active in dashboard
- Check if free tier is still available

### "Rate limit exceeded":
- You've used all free requests
- Wait for monthly reset
- Upgrade to paid plan
- Implement better caching

### "API not responding":
- Check internet connection
- Verify API URL is correct
- Check API status page
- Try again in a few minutes

---

## 📞 Support

### AviationStack:
- Docs: https://aviationstack.com/documentation
- Support: support@aviationstack.com

### RapidAPI:
- Docs: https://rapidapi.com/docs
- Support: https://rapidapi.com/support

### MSRTC:
- Portal: https://data.gov.in/
- No support needed (static data)

---

## 🎉 Next Steps

Once you have your API keys:

1. ✅ Update application.properties (do this now!)
2. Create external service classes (next step)
3. Test API integration
4. Update frontend with live data badges

**You're ready to integrate live data!** 🚀

---

## 📋 Quick Reference

**Your API Keys Location:**
```
TravelSmart/src/main/resources/application.properties

Lines to update:
- aviationstack.api.key=YOUR_KEY_HERE
- rapidapi.api.key=YOUR_KEY_HERE
```

**Test Commands:**
```bash
# Test AviationStack
curl "http://api.aviationstack.com/v1/flights?access_key=YOUR_KEY&limit=1"

# Test RapidAPI
curl -X GET "https://indian-railway-api.p.rapidapi.com/trains" \
  -H "X-RapidAPI-Key: YOUR_KEY"
```

**Free Tier Limits:**
- AviationStack: 100/month
- RapidAPI: 100-500/month
- MSRTC: Unlimited

---

**Time to complete:** 15-20 minutes
**Cost:** $0 (using free tiers)
**Difficulty:** Easy ⭐
