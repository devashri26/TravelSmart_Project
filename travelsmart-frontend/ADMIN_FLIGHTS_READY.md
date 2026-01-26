# ✈️ Admin Flights Management - READY!

## 🎉 What's Been Added

### Frontend
1. ✅ **AdminFlights.jsx** - Complete flights management page
2. ✅ **adminService.js** - All CRUD methods for flights, hotels, buses, trains
3. ✅ **App.jsx** - Route added for `/admin/flights`
4. ✅ **AdminDashboard.jsx** - Quick navigation link to flights management

### Backend (Already Complete)
1. ✅ **AdminController** - All flight endpoints
2. ✅ **FlightService** - CRUD methods
3. ✅ **FlightRepository** - Search methods
4. ✅ **Security** - Admin endpoints protected

## 🚀 How to Use

### 1. Start Backend
```bash
cd TravelSmart
mvn spring-boot:run
```

### 2. Start Frontend
```bash
cd travelsmart-frontend
npm run dev
```

### 3. Login as Admin
- Go to `http://localhost:5173/login`
- Login with admin credentials
- Make sure your user has `ROLE_ADMIN` in database

### 4. Access Flights Management
**Option A:** From Dashboard
1. Go to `/admin`
2. Click "Manage Flights" card

**Option B:** Direct URL
- Go to `http://localhost:5173/admin/flights`

## ✨ Features Available

### View Flights
- ✅ List all flights with pagination
- ✅ Search by flight number, airline, or city
- ✅ See flight details (route, schedule, price, seats)
- ✅ Responsive table design

### Add New Flight
1. Click "Add Flight" button
2. Fill in the form:
   - Flight Number (e.g., AI 101)
   - Airline (e.g., Air India)
   - Departure City
   - Arrival City
   - Departure Time
   - Arrival Time
   - Price (₹)
   - Available Seats
3. Click "Create Flight"

### Edit Flight
1. Click edit icon (pencil) on any flight
2. Update the details
3. Click "Update Flight"

### Delete Flight
1. Click delete icon (trash) on any flight
2. Confirm deletion
3. Flight will be removed

## 📋 API Endpoints Used

- `GET /api/v1/admin/flights?page=0&size=20&search=` - List flights
- `GET /api/v1/admin/flights/{id}` - Get flight details
- `POST /api/v1/admin/flights` - Create flight
- `PUT /api/v1/admin/flights/{id}` - Update flight
- `DELETE /api/v1/admin/flights/{id}` - Delete flight

## 🎨 UI Features

- **Modern Design** - Gradient backgrounds, smooth transitions
- **Icons** - Lucide React icons for visual clarity
- **Responsive** - Works on desktop, tablet, and mobile
- **Toast Notifications** - Success/error messages
- **Modal Forms** - Clean add/edit interface
- **Pagination** - Handle large datasets
- **Search** - Real-time filtering

## 📝 Example Flight Data

```json
{
  "flightNumber": "AI 101",
  "airline": "Air India",
  "departureCity": "Mumbai",
  "arrivalCity": "Delhi",
  "departureTime": "2025-12-01T06:00:00",
  "arrivalTime": "2025-12-01T08:30:00",
  "price": 4500,
  "availableSeats": 180
}
```

## 🔄 Next Steps

### Create Similar Pages for:
1. **Hotels** - Copy AdminFlights.jsx and modify for hotels
2. **Buses** - Copy AdminFlights.jsx and modify for buses
3. **Trains** - Copy AdminFlights.jsx and modify for trains

### Fields for Each:

**Hotels:**
- name, city, address, roomType, nightlyRate, totalRooms, availableRooms

**Buses:**
- busNumber, operator, origin, destination, departureTime, arrivalTime, price, availableSeats

**Trains:**
- trainNumber, trainName, origin, destination, departureTime, arrivalTime, price, availableSeats

## 🐛 Troubleshooting

### "Failed to load flights"
- Check backend is running on port 8080
- Verify JWT token is valid
- Check browser console for errors

### "Failed to save flight"
- Verify all required fields are filled
- Check date/time format is correct
- Ensure price and seats are positive numbers

### 403 Forbidden
- Verify user has `ROLE_ADMIN` in database
- Check JWT token in Authorization header
- Ensure backend security config allows admin endpoints

### CORS Errors
- Check CorsConfig.java allows frontend URL
- Verify frontend is running on allowed origin

## ✅ Testing Checklist

- [ ] Can view list of flights
- [ ] Can search flights
- [ ] Can add new flight
- [ ] Can edit existing flight
- [ ] Can delete flight
- [ ] Pagination works
- [ ] Toast notifications appear
- [ ] Modal opens/closes properly
- [ ] Form validation works
- [ ] Data persists in database

## 🎉 You're Ready!

You can now add, edit, and delete flights from the admin panel! The same pattern can be used to create management pages for hotels, buses, and trains.

**Want me to create the other management pages (Hotels, Buses, Trains)?** Just let me know! 🚀
