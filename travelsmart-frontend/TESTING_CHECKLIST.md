# ✅ Testing Checklist

## Pre-Testing Setup

- [ ] Backend is running on `http://localhost:8080`
- [ ] Frontend is running on `http://localhost:5173`
- [ ] Database is connected and migrations are applied
- [ ] Admin user exists in database with ROLE_ADMIN

## Admin Panel Testing

### Login & Dashboard
- [ ] Can login as admin
- [ ] Dashboard shows all navigation cards
- [ ] All links work correctly

### Flights Management
- [ ] Can view all flights (paginated)
- [ ] Can search flights by number/airline/route
- [ ] Can add new flight
- [ ] Can edit existing flight
- [ ] Can delete flight (with confirmation)
- [ ] Pagination works correctly
- [ ] Toast notifications appear

### Hotels Management
- [ ] Can view all hotels (paginated)
- [ ] Can search hotels by name/city
- [ ] Can add new hotel
- [ ] Can edit existing hotel
- [ ] Can delete hotel (with confirmation)
- [ ] Pagination works correctly
- [ ] Toast notifications appear

### Buses Management
- [ ] Can view all buses (paginated)
- [ ] Can search buses by number/operator/route
- [ ] Can add new bus
- [ ] Can edit existing bus
- [ ] Can delete bus (with confirmation)
- [ ] Pagination works correctly
- [ ] Toast notifications appear

### Trains Management
- [ ] Can view all trains (paginated)
- [ ] Can search trains by number/name/route
- [ ] Can add new train
- [ ] Can edit existing train
- [ ] Can delete train (with confirmation)
- [ ] Pagination works correctly
- [ ] Toast notifications appear

### Bookings Management
- [ ] Can view all bookings
- [ ] Can filter by status
- [ ] Can search bookings
- [ ] Pagination works correctly

### Payments Management
- [ ] Can view all payments
- [ ] Can filter by status
- [ ] Can search payments
- [ ] Pagination works correctly

### Users Management
- [ ] Can view all users
- [ ] Can search users
- [ ] Can view user details
- [ ] Pagination works correctly

## User Search Testing

### Flight Search
- [ ] Can search flights by route and date
- [ ] Autocomplete works for cities
- [ ] Results show correct data from backend
- [ ] Times are formatted correctly
- [ ] Duration is calculated correctly
- [ ] Can select a flight
- [ ] Seat selection modal opens
- [ ] Can select seats and proceed to payment

### Hotel Search
- [ ] Can search hotels by city and dates
- [ ] Autocomplete works for cities
- [ ] Results show correct data from backend
- [ ] Can click on hotel card
- [ ] Navigates to hotel details page

### Bus Search
- [ ] Can search buses by route and date
- [ ] Autocomplete works for cities
- [ ] Results show correct data from backend
- [ ] Times are formatted correctly
- [ ] Duration is calculated correctly
- [ ] Can select a bus
- [ ] Seat selection modal opens
- [ ] Can select seats and proceed to payment

### Train Search
- [ ] Can search trains by route and date
- [ ] Autocomplete works for cities
- [ ] Results show correct data from backend
- [ ] Times are formatted correctly
- [ ] Duration is calculated correctly
- [ ] Can select a train
- [ ] Seat selection modal opens
- [ ] Can select seats and proceed to payment

## Integration Testing

### End-to-End Flow
- [ ] Admin adds a flight
- [ ] User searches for that flight
- [ ] User sees the flight in results
- [ ] User can book the flight
- [ ] Admin sees the booking
- [ ] Payment is processed
- [ ] Admin sees the payment

### Data Consistency
- [ ] Adding data in admin panel reflects in user search
- [ ] Editing data updates in real-time
- [ ] Deleting data removes from search results
- [ ] Available seats decrease after booking

## Error Handling

### Network Errors
- [ ] Shows error toast when backend is down
- [ ] Shows error toast on API failure
- [ ] Handles timeout gracefully

### Validation
- [ ] Required fields are validated
- [ ] Date validation works
- [ ] Number validation works
- [ ] Form shows validation errors

### Edge Cases
- [ ] Empty search results handled
- [ ] No data state handled
- [ ] Large datasets paginated correctly
- [ ] Special characters in search handled

## UI/UX Testing

### Responsiveness
- [ ] Works on desktop (1920x1080)
- [ ] Works on laptop (1366x768)
- [ ] Works on tablet (768x1024)
- [ ] Works on mobile (375x667)

### Accessibility
- [ ] All buttons are clickable
- [ ] Forms are keyboard navigable
- [ ] Error messages are visible
- [ ] Loading states are clear

### Performance
- [ ] Pages load quickly
- [ ] Search is responsive
- [ ] No lag in UI interactions
- [ ] Images load properly

## Security Testing

### Authentication
- [ ] Cannot access admin panel without login
- [ ] Cannot access admin routes as regular user
- [ ] JWT token is stored securely
- [ ] Logout clears authentication

### Authorization
- [ ] Admin routes require ROLE_ADMIN
- [ ] Regular users cannot access admin panel
- [ ] API calls include auth headers
- [ ] Unauthorized requests are rejected

## Browser Compatibility

- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

## Final Checks

- [ ] No console errors
- [ ] No console warnings
- [ ] All images load
- [ ] All icons display
- [ ] All colors are correct
- [ ] All fonts are correct
- [ ] All animations work
- [ ] All transitions are smooth

## Test Data

### Sample Flight
```
Flight Number: AI101
Airline: Air India
Departure City: Mumbai
Arrival City: Delhi
Departure Time: 2024-12-15T10:00
Arrival Time: 2024-12-15T12:30
Price: 5500
Available Seats: 180
```

### Sample Hotel
```
Name: Taj Palace
City: Mumbai
Address: Colaba, Mumbai
Price Per Night: 8500
Available Rooms: 50
Rating: 5
```

### Sample Bus
```
Bus Number: VRL123
Operator: VRL Travels
Origin: Mumbai
Destination: Pune
Departure Time: 2024-12-15T08:00
Arrival Time: 2024-12-15T11:30
Price: 800
Available Seats: 45
```

### Sample Train
```
Train Number: 12951
Train Name: Rajdhani Express
Origin: Mumbai
Destination: Delhi
Departure Time: 2024-12-15T16:00
Arrival Time: 2024-12-16T08:00
Price: 1530
Available Seats: 72
```

## Notes

- Test each feature thoroughly
- Document any bugs found
- Take screenshots of issues
- Note browser/device for bugs
- Verify fixes after implementation

---

**Testing Status:** ⏳ Pending

**Last Updated:** December 2024
