# 🔐 Login Troubleshooting Guide

## ✅ Backend Status: RUNNING on Port 8080

Your backend is already running! If login isn't working, follow these steps:

---

## 🎯 Quick Test

### Step 1: Check if Backend is Responding
Open your browser and go to:
```
http://localhost:8080/api/auth/test
```

If you see a response, the backend is working!

---

## 🔍 Common Login Issues

### Issue 1: "Login failed. Please check your credentials"

**Cause**: Wrong username or password

**Solution**:
1. Make sure you registered an account first
2. Use the exact username (not email) you registered with
3. Password is case-sensitive

**Test Account** (if you created one):
- Username: `testuser` or whatever you registered with
- Password: Your password

---

### Issue 2: Account Not Verified

**Cause**: You haven't verified your email

**Solution**:
1. Check your email for verification link
2. Click the verification link
3. Then try logging in

**OR** Check the backend console for the verification link if email isn't working.

---

### Issue 3: Network Error / CORS Error

**Cause**: Backend not running or CORS issue

**Solution**:
1. Make sure backend is running on port 8080
2. Check browser console (F12) for errors
3. Look for red errors in the Console tab

---

### Issue 4: Redirects to Login Instead of Dashboard

**Cause**: Token not being saved or authentication failing

**Solution**:
1. Clear browser cache and cookies
2. Try in incognito/private mode
3. Check browser console for errors

---

## 🚀 Step-by-Step: Create Test Account & Login

### Step 1: Register a New Account
1. Go to `http://localhost:5173/register`
2. Fill in the form:
   - **Username**: `testuser`
   - **Email**: `test@example.com`
   - **Password**: `Test123!`
   - **Role**: Select "Traveler"
3. Click **"Sign Up"**

### Step 2: Verify Email (if required)
- Check backend console for verification link
- OR check your email
- Click the verification link

### Step 3: Login
1. Go to `http://localhost:5173/login`
2. Enter:
   - **Username**: `testuser`
   - **Password**: `Test123!`
3. Click **"Login"**
4. You should be redirected to `/dashboard`

---

## 🔧 Debug Mode

### Check Browser Console
1. Press `F12` to open Developer Tools
2. Go to **Console** tab
3. Try logging in
4. Look for errors (red text)

### Common Console Errors:

**Error**: `Failed to fetch` or `Network Error`
- **Fix**: Backend not running. Check if port 8080 is accessible

**Error**: `401 Unauthorized`
- **Fix**: Wrong credentials or account not verified

**Error**: `CORS policy`
- **Fix**: Backend CORS configuration issue (should be fixed already)

**Error**: `Cannot read property 'token' of undefined`
- **Fix**: Backend response format issue

---

## 🧪 Test Backend Directly

### Test 1: Health Check
```bash
curl http://localhost:8080/actuator/health
```
Should return: `{"status":"UP"}`

### Test 2: Login API
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test123!"}'
```

Should return a token if credentials are correct.

---

## 📝 Check Backend Logs

The backend console should show:
```
Started TravelSmartApplication in X seconds
Tomcat started on port 8080
```

If you see errors, the backend might not be fully started.

---

## ✅ Verification Checklist

- [ ] Backend is running on port 8080
- [ ] Frontend is running on port 5173
- [ ] I registered an account
- [ ] I verified my email (if required)
- [ ] I'm using the correct username (not email)
- [ ] I'm using the correct password
- [ ] Browser console shows no errors
- [ ] I cleared browser cache

---

## 🎯 Still Not Working?

### Option 1: Skip Login for Testing
The search pages (Flights, Buses, Trains, Hotels) now work **without login**!

Just go to:
- `http://localhost:5173/flights`
- `http://localhost:5173/buses`
- `http://localhost:5173/trains`
- `http://localhost:5173/hotels`

You can search and see seat selection without logging in!

### Option 2: Check Database
Make sure your MySQL database is running and the `travelsmart` database exists.

### Option 3: Create Account via Backend
If registration isn't working, you can create an account directly in the database.

---

## 💡 Quick Fix: Test Without Login

Since search pages are now public, you can:
1. Skip login for now
2. Test all the search functionality
3. See seat selection
4. Come back to login later

Just click **"Flights"**, **"Buses"**, **"Trains"**, or **"Hotels"** in the navbar!

---

**Last Updated**: November 29, 2025
**Backend Status**: ✅ Running on Port 8080
**Frontend Status**: ✅ Running on Port 5173
