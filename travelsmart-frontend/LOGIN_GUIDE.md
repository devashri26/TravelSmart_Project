# Login Guide for TravelSmart

## ✅ Fixed Issues

1. **CORS Error** - ✅ Resolved
2. **Login Field Mismatch** - ✅ Fixed (now uses username instead of email)
3. **Response Format** - ✅ Updated to return proper JSON with token, username, and role

## 🔐 How to Login

### Step 1: Register a New Account

1. Go to `http://localhost:5174/register`
2. Fill in the registration form:
   - **Username**: Choose a unique username (e.g., `johndoe`)
   - **Email**: Your email address
   - **Password**: At least 6 characters
   - **Confirm Password**: Must match password
3. Click "Create Account"
4. You'll see a success message

### Step 2: Login

1. Go to `http://localhost:5174/login`
2. Enter your credentials:
   - **Username or Email**: You can use EITHER your username OR your email
   - **Password**: Your password
3. Click "Sign In"
4. You'll be redirected to the dashboard

## 📝 Important Notes

- **You can login with EITHER username OR email!** ✅
- Email confirmation is NOT required (you can login immediately after registration)
- The backend is running on `http://localhost:8080`
- The frontend is running on `http://localhost:5174`

## 🧪 Test Credentials

After registering, you can login with:
- **Username or Email**: (either the username OR email you used during registration)
- **Password**: (the password you set)

## 🐛 Troubleshooting

### "Login failed" error
- You can use either your **username** OR **email** to login
- Check that your password is correct
- Verify the backend is running (check terminal with Process ID 7)

### CORS errors
- Backend should be running with CORS enabled
- Check browser console for specific errors
- Verify both servers are running

### Can't see dashboard after login
- Check browser console for errors
- Verify JWT token is stored (check Application > Local Storage in DevTools)
- Try logging out and logging in again

## 🔍 Checking Backend Logs

To see what's happening on the backend, check the terminal output for Process ID 6.
Look for:
- "User found" messages
- "Authorities assigned" messages
- Any error messages

## 🎯 Next Steps After Login

Once logged in, you can:
1. ✅ View the Dashboard
2. ✅ Search for Flights
3. ✅ Browse Hotels
4. ✅ Search Buses and Trains
5. ✅ Use the Trip Planner
6. ✅ View your Profile
7. ✅ Manage Bookings

## 💡 Tips

- Keep both terminal windows open (backend and frontend)
- Use Chrome DevTools to debug any issues
- Check the Network tab to see API requests/responses
- The JWT token is automatically included in all authenticated requests

Happy traveling! ✈️🏨🚌
