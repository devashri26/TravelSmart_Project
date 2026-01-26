# 🔍 Search Functionality Guide

## ✅ FIXED! Search Now Works

### What Changed:
1. **Landing Page Search** - Now redirects to the correct search page
2. **No Login Required** - You can search without logging in
3. **All Search Pages** - Flights, Buses, Trains, Hotels are now public

---

## 🚀 How to Search (3 Ways)

### Method 1: From Landing Page
1. Go to `http://localhost:5173/`
2. Click on the tab you want (Flights, Hotels, Buses, Trains)
3. Fill in the search fields (optional)
4. Click **"Search"** button
5. You'll be redirected to the search page

### Method 2: From Navbar
1. Click **"Flights"**, **"Hotels"**, **"Buses"**, or **"Trains"** in the navbar
2. You'll go directly to the search page
3. Start searching!

### Method 3: Direct URL
- Flights: `http://localhost:5173/flights`
- Buses: `http://localhost:5173/buses`
- Trains: `http://localhost:5173/trains`
- Hotels: `http://localhost:5173/hotels`

---

## 📝 Step-by-Step: Search for Flights

1. **Go to Flights Page**
   - Click "Flights" in navbar OR
   - Click "Search" on landing page with Flights tab selected

2. **Enter Search Details**
   - **From**: Start typing "Mumbai" or "Mum"
   - Dropdown appears with suggestions
   - Click "Mumbai (BOM)"
   
   - **To**: Start typing "Delhi" or "Del"
   - Click "Delhi (DEL)"
   
   - **Departure Date**: Pick a date
   - **Passengers**: Enter number (1-9)

3. **Click "Search Flights"**
   - Results appear in 1 second
   - You'll see 4 flights

4. **Select a Flight**
   - Click **"Select Flight"** button
   - Seat selection modal opens

5. **Choose Seats**
   - Click on available seats (white boxes)
   - Selected seats turn green
   - Price updates in real-time

6. **Confirm**
   - Click **"Continue with X Seats"**
   - Success message appears!

---

## 📝 Step-by-Step: Search for Buses

1. **Go to Buses Page**
   - Click "Buses" in navbar

2. **Enter Search Details**
   - **From**: Type "Mumbai" → Select
   - **To**: Type "Pune" → Select
   - **Date**: Pick a date

3. **Click "Search Buses"**
   - Results appear
   - You'll see 3 buses

4. **View Seats**
   - Click **"View Seats"** button
   - Bus seat layout appears (Lower/Upper berth)

5. **Select Seats**
   - Click on seats in Lower or Upper berth
   - Maximum 6 seats

6. **Confirm**
   - Click **"Continue"**

---

## 📝 Step-by-Step: Search for Trains

1. **Go to Trains Page**
   - Click "Trains" in navbar

2. **Enter Search Details**
   - **From**: Type "Mumbai" → Select
   - **To**: Type "Delhi" → Select
   - **Date**: Pick a date

3. **Click "Search Trains"**
   - Results appear
   - You'll see 3 trains

4. **View Seats**
   - Click **"View Seats"** button
   - Train compartment layout appears

5. **Select Berths**
   - Click on berths (Lower/Middle/Upper/Side)
   - Color-coded by type

6. **Confirm**
   - Click **"Continue"**

---

## 📝 Step-by-Step: Search for Hotels

1. **Go to Hotels Page**
   - Click "Hotels" in navbar

2. **Enter Search Details**
   - **Location**: Type "Mumbai" → Select
   - **Check-in**: Pick date
   - **Check-out**: Pick date
   - **Guests**: Enter number

3. **Click "Search Hotels"**
   - Results appear
   - You'll see 5 hotels

4. **View Hotel**
   - Click on any hotel card
   - (Details page coming soon)

---

## 🎯 Test Data Available

### Cities/Airports
- Mumbai (BOM)
- Delhi (DEL)
- Bangalore (BLR)
- Hyderabad (HYD)
- Chennai (MAA)
- Kolkata (CCU)
- Pune (PNQ)
- Ahmedabad (AMD)
- Jaipur (JAI)
- Goa (GOI)

### Routes with Results
- **Flights**: Mumbai ↔ Delhi
- **Buses**: Mumbai ↔ Pune
- **Trains**: Mumbai ↔ Delhi
- **Hotels**: Mumbai

---

## 💡 Tips

1. **Autocomplete is Smart**
   - Type just 2-3 letters
   - Suggestions appear instantly
   - Click to select

2. **No Login Needed**
   - Browse and search freely
   - Login only needed for booking (coming soon)

3. **Try Different Searches**
   - If no results, app shows all available options
   - Try the suggested routes above

4. **Seat Selection**
   - Click "Select Flight" or "View Seats"
   - Modal opens with seat layout
   - Click seats to select
   - Click "Continue" when done

---

## 🐛 Troubleshooting

### "I can't see the search page"
- Make sure you're at the correct URL
- Check if the app is running (`npm run dev`)
- Try refreshing the page

### "Autocomplete not showing"
- Type at least 1 character
- Click inside the input field
- Try typing a city from the list above

### "No results found"
- Try these exact searches:
  - Flights: Mumbai → Delhi
  - Buses: Mumbai → Pune
  - Trains: Mumbai → Delhi
  - Hotels: Mumbai

### "Can't select seats"
- Make sure you clicked "Select Flight" or "View Seats" first
- Gray seats are booked (can't select)
- Check if you reached maximum seats

### "Search button doesn't work"
- Fill in all required fields
- Make sure date is in the future
- Check browser console for errors (F12)

---

## ✅ What's Working Now

- ✅ Landing page search redirects to correct page
- ✅ All search pages accessible without login
- ✅ Autocomplete for cities/airports
- ✅ Search results display
- ✅ Seat selection modals
- ✅ Real-time price calculation
- ✅ Professional UI with gradients

---

## 🚀 Next Steps

After you test the search:
1. Payment integration
2. Booking confirmation
3. User booking history
4. Filters and sorting
5. Backend API integration

---

**Last Updated**: November 29, 2025
**Status**: ✅ Fully Functional - No Login Required!
