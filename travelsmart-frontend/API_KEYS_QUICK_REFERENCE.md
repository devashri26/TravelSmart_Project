# 🔑 API Keys - Quick Reference Card

## ✈️ AviationStack (Flights)

**Sign up:** https://aviationstack.com/signup/free

**Steps:**
1. Enter email & password
2. Verify email
3. Login to dashboard
4. Copy API Access Key

**Your key looks like:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**Add to application.properties:**
```properties
aviationstack.api.key=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**Test:**
```bash
curl "http://api.aviationstack.com/v1/flights?access_key=YOUR_KEY&limit=1"
```

**Free tier:** 100 requests/month

---

## 🚂 RapidAPI (Trains)

**Sign up:** https://rapidapi.com/auth/sign-up

**Steps:**
1. Sign up with email/Google/GitHub
2. Search "Indian Railway API"
3. Subscribe to FREE plan
4. Go to Apps → Copy X-RapidAPI-Key

**Your key looks like:**
```
1234567890abcdefghijklmnopqrstuv
```

**Add to application.properties:**
```properties
rapidapi.api.key=1234567890abcdefghijklmnopqrstuv
```

**Test:**
```bash
curl -X GET "https://indian-railway-api.p.rapidapi.com/trains" \
  -H "X-RapidAPI-Key: YOUR_KEY"
```

**Free tier:** 100-500 requests/month

---

## 🚌 MSRTC (Buses)

**Download:** https://data.gov.in/catalog/msrtc-route-directory

**Steps:**
1. Click "Download"
2. Choose CSV or JSON
3. Save file

**No API key needed!**

**Free tier:** Unlimited (static data)

---

## 📝 Update Your Config

**File:** `TravelSmart/src/main/resources/application.properties`

**Find these lines:**
```properties
aviationstack.api.key=YOUR_AVIATIONSTACK_API_KEY_HERE
rapidapi.api.key=YOUR_RAPIDAPI_KEY_HERE
```

**Replace with your actual keys:**
```properties
aviationstack.api.key=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
rapidapi.api.key=1234567890abcdefghijklmnopqrstuv
```

---

## ⚠️ Security

**Never commit API keys to Git!**

**Option 1: Use .gitignore**
```
application.properties
application-*.properties
```

**Option 2: Use environment variables**
```properties
aviationstack.api.key=${AVIATIONSTACK_KEY}
rapidapi.api.key=${RAPIDAPI_KEY}
```

Then set in terminal:
```bash
export AVIATIONSTACK_KEY=your-key-here
export RAPIDAPI_KEY=your-key-here
```

---

## 🧪 Quick Test

After adding keys, test your setup:

```bash
cd TravelSmart
./mvnw clean install
./mvnw spring-boot:run
```

Look for in logs:
```
✓ Cache manager initialized
✓ WebClient configured
✓ Application started successfully
```

---

## 💰 Cost Summary

| Service | Free Tier | Paid Plan |
|---------|-----------|-----------|
| AviationStack | 100/month | $9.99 (10k/month) |
| RapidAPI | 100-500/month | $10-20 (10k/month) |
| MSRTC | Unlimited | FREE |

**Recommendation:** Start with free tiers, upgrade if needed.

---

## 📞 Support

**AviationStack:**
- Dashboard: https://aviationstack.com/dashboard
- Docs: https://aviationstack.com/documentation

**RapidAPI:**
- Dashboard: https://rapidapi.com/developer/apps
- Docs: https://rapidapi.com/docs

**MSRTC:**
- Portal: https://data.gov.in/

---

## ✅ Checklist

- [ ] Signed up for AviationStack
- [ ] Got AviationStack key
- [ ] Signed up for RapidAPI
- [ ] Got RapidAPI key
- [ ] Downloaded MSRTC data
- [ ] Updated application.properties
- [ ] Tested keys with curl
- [ ] Reloaded Maven dependencies
- [ ] Started backend successfully

---

**Time to complete:** 15 minutes
**Cost:** $0 (free tiers)

**Next step:** Create external service classes
