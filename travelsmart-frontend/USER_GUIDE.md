# 📖 TravelSmart User Guide

## 🎯 Complete Booking Flow

This guide shows you exactly how to search and book flights, buses, trains, and hotels with seat selection.

---

## ✈️ Flight Booking Flow

### Step 1: Navigate to Flights
- Click **"Flights"** in the navigation bar
- Or visit: `http://localhost:5173/flights`

### Step 2: Search for Flights
1. **From Field**: 
   - Start typing "Mumbai" or "Mum"
   - Dropdown appears with suggestions
   - Click "Mumbai (BOM) - Chhatrapati Shivaji International"

2. **To Field**:
   - Start typing "Delhi" or "Del"
   - Click "Delhi (DEL) - Indira Gandhi International"

3. **Trip Type**:
   - Choose "One Way" or "Round Trip"

4. **Departure Date**:
   - Select your travel date

5. **Passengers**:
   - Enter number of passengers (1-9)

6. **Click "Search Flights"**

### Step 3: View Results
You'll see flight cards showing:
- Airline name and flight number
- Departure and arrival times
- Duration
- Price
- Available seats

### Step 4: Select Flight
- Click **"Select Flight"** button on your preferred flight
- Seat selection modal opens

### Step 5: Choose Seats
- You'll see the flight layout (Economy class, A-F seats)
- Click on available seats (white boxes)
- Selected seats turn green
- Price updates in real-time
- Maximum seats = number of passengers

### Step 6: Confirm Selection
- Review selected seats in the summary box
- Check total price
- Click **"Continue with X Seats (₹XXXX)"**
- Success message appears!

---

## 🚌 Bus Booking Flow

### Step 1: Navigate to Buses
- Click **"Buses"** in the navigation bar
- Or visit: `http://localhost:5173/buses`

### Step 2: Search for Buses
1. **From Field**:
   - Type "Mumbai"
   - Select from dropdown

2. **To Field**:
   - Type "Pune"
   - Select from dropdown

3. **Date**:
   - Choose travel date

4. **Click "Search Buses"**

### Step 3: View Results
Bus cards show:
- Operator name (VRL, RedBus, Orange)
- Bus type (AC Sleeper, Non-AC Seater)
- Departure and arrival times
- Duration
- Amenities (AC, WiFi, Charging icons)
- Price
- Available seats

### Step 4: View Seats
- Click **"View Seats"** button
- Seat selection modal opens

### Step 5: Choose Seats
You'll see:
- **Lower Berth** section (left side)
- **Upper Berth** section (right side)
- Driver position indicator
- Seat numbers (L1-L15, U1-U15)
- Price below each seat

**How to Select**:
- Click on available seats (white with armchair icon)
- Selected seats turn green with user icon
- Gray seats are already booked
- Maximum 6 seats

### Step 6: Confirm Booking
- Review selected seats
- Check total amount
- Click **"Continue"**

---

## 🚂 Train Booking Flow

### Step 1: Navigate to Trains
- Click **"Trains"** in the navigation bar
- Or visit: `http://localhost:5173/trains`

### Step 2: Search for Trains
1. **From Field**:
   - Type "Mumbai"
   - Select from dropdown

2. **To Field**:
   - Type "Delhi"
   - Select from dropdown

3. **Date**:
   - Choose travel date

4. **Click "Search Trains"**

### Step 3: View Results
Train cards display:
- Train name (Rajdhani Express, Punjab Mail)
- Train number
- Class (AC 3-Tier, Sleeper)
- Departure and arrival times
- Duration
- Price
- Available seats

### Step 4: View Seats
- Click **"View Seats"** button
- Seat selection modal opens

### Step 5: Choose Berths
You'll see:
- **Coach S1 - AC 3-Tier** header
- **Compartment 1** and **Compartment 2**
- Different berth types:
  - 🔵 Lower Berth (₹850)
  - 🟢 Middle Berth (₹800)
  - 🟣 Upper Berth (₹750)
  - 🟠 Side Lower (₹850)
  - 🟠 Side Upper (₹750)

**How to Select**:
- Click on any available berth
- Color-coded by type
- Selected berths turn green
- Maximum 6 berths

### Step 6: Confirm Booking
- Review selected berths
- Check total price
- Click **"Continue"**

---

## 🏨 Hotel Search Flow

### Step 1: Navigate to Hotels
- Click **"Hotels"** in the navigation bar
- Or visit: `http://localhost:5173/hotels`

### Step 2: Search for Hotels
1. **Location**:
   - Type "Mumbai"
   - Select from dropdown

2. **Check-in Date**:
   - Select arrival date

3. **Check-out Date**:
   - Select departure date

4. **Guests**:
   - Enter number of guests

5. **Click "Search Hotels"**

### Step 3: View Results
Hotel cards show:
- Hotel image
- Hotel name
- Star rating (1-5 stars)
- Number of reviews
- Location
- Price per night
- "View Details" button

### Step 4: View Hotel Details
- Click on any hotel card
- Redirects to hotel details page
- (Details page to be implemented)

---

## 🎨 Understanding the Seat Layouts

### Flight Layout (Economy Class)
```
     A  B     C  D  E  F
   ┌──────────────────────┐
1  │ □  □  |  □  □  □  □ │  ← Front (Premium)
2  │ □  □  |  □  □  □  □ │
3  │ □  □  |  □  □  □  □ │
4  │ □  □  |  □  □  □  □ │
5  │ □  □  |  □  □  □  □ │
6  │ □  □  |  □  □  □  □ │
7  │ □  □  |  □  □  □  □ │
8  │ □  □  |  □  □  □  □ │  ← Back (Economy)
   └──────────────────────┘
```
- **A, F**: Window seats
- **B, E**: Middle seats
- **C, D**: Aisle seats
- **|**: Aisle

### Bus Layout (Sleeper)
```
LOWER BERTH          UPPER BERTH
┌─────────────┐     ┌─────────────┐
│   [Driver]  │     │             │
│             │     │             │
│ L1  [ ] L2 L3│     │ [ ] U1 [ ] U2 U3│
│ L4  [ ] L5 L6│     │ [ ] U4 [ ] U5 U6│
│ L7  [ ] L8 L9│     │ [ ] U7 [ ] U8 U9│
│ L10 [ ] L11 L12│    │ [ ] U10[ ] U11 U12│
│ L13 [ ] L14 L15│    │ [ ] U13[ ] U14 U15│
└─────────────┘     └─────────────┘
```
- **Lower Berth**: Ground level, easier access
- **Upper Berth**: Elevated, more privacy
- **[ ]**: Aisle space

### Train Layout (AC 3-Tier)
```
COMPARTMENT 1
┌──────────────┐
│ Lower Berth  │ ← Can sit during day
│ Middle Berth │ ← Folds during day
│ Upper Berth  │ ← Always available
│ Side Lower   │ ← Side section
│ Side Upper   │ ← Side section
└──────────────┘
```
- **Lower**: Most comfortable, ₹850
- **Middle**: Mid-level, ₹800
- **Upper**: Top level, ₹750
- **Side**: Narrower, varies

---

## 💡 Pro Tips

### Autocomplete Tips
1. **Type just 2-3 letters** - Suggestions appear instantly
2. **Use arrow keys** - Navigate suggestions (coming soon)
3. **Click to select** - Faster than typing full names
4. **Clear and retype** - If you made a mistake

### Seat Selection Tips
1. **Window seats** - Choose A or F in flights
2. **Lower berths** - Best for elderly/children in trains
3. **Upper berths** - More privacy, always available
4. **Group booking** - Select adjacent seats
5. **Check price** - Different seats may have different prices

### Search Tips
1. **Be flexible with dates** - Check different days
2. **Book early** - Better seat availability
3. **Compare options** - Check all results before selecting
4. **Check amenities** - AC, WiFi, etc. for buses
5. **Read class info** - AC vs Non-AC for trains

---

## 🔍 Troubleshooting

### Autocomplete not showing?
- Make sure you're typing in the correct field
- Type at least 1 character
- Click inside the field to focus

### No results found?
- Try different cities (Mumbai, Delhi, Pune, Bangalore)
- Check if date is in the future
- The app shows all results if no match found

### Can't select seats?
- Gray seats are already booked
- Check if you've reached maximum seats
- Make sure you clicked "Select Flight/View Seats" first

### Modal won't close?
- Click the X button in top-right
- Click outside the modal (coming soon)
- Press Escape key (coming soon)

---

## 📱 Keyboard Shortcuts (Coming Soon)

- `Ctrl + F` - Focus on search
- `Escape` - Close modal
- `Enter` - Submit search
- `Tab` - Navigate fields

---

## 🎯 Quick Test Scenarios

### Scenario 1: Quick Flight Booking
1. Go to `/flights`
2. Type "Mum" → Select Mumbai
3. Type "Del" → Select Delhi
4. Pick tomorrow's date
5. Enter 2 passengers
6. Search → Select first flight
7. Choose 2 seats → Continue

### Scenario 2: Overnight Bus Journey
1. Go to `/buses`
2. Mumbai → Pune
3. Pick date
4. Search → Select AC Sleeper
5. Choose lower berth seats
6. Continue

### Scenario 3: Train Journey
1. Go to `/trains`
2. Mumbai → Delhi
3. Pick date
4. Search → Select Rajdhani
5. Choose lower berths
6. Continue

### Scenario 4: Hotel Stay
1. Go to `/hotels`
2. Type "Mumbai"
3. Check-in: Tomorrow
4. Check-out: Day after
5. 2 guests
6. Search → Browse hotels

---

## 🚀 What's Coming Next

- ✅ Payment integration
- ✅ Booking confirmation
- ✅ Email tickets
- ✅ My Bookings page
- ✅ Cancel/Modify bookings
- ✅ Filters and sorting
- ✅ Reviews and ratings
- ✅ Trip planner

---

**Need Help?** Check the QUICKSTART.md or WHATS_NEW.md files!

**Last Updated**: November 29, 2025
