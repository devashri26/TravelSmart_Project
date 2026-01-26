# TravelSmart Frontend - Quick Start Guide

## 🎯 NEW: Complete Booking System with Seat Selection!

### ✅ What's Working Now:

1. **Flight Booking** (`/flights`)
   - Autocomplete search for airports (Mumbai, Delhi, Bangalore, etc.)
   - Real-time flight results with pricing
   - Click "Select Flight" to see seat selection modal
   - Choose seats and see total price

2. **Bus Booking** (`/buses`)
   - Autocomplete city search
   - View available buses with amenities
   - Click "View Seats" for bus seat layout (Lower/Upper berth)
   - Select seats and proceed to booking

3. **Train Booking** (`/trains`)
   - Station autocomplete
   - Train results with class information
   - Click "View Seats" for AC 3-Tier compartment layout
   - Select berths (Lower/Middle/Upper/Side)

4. **Hotel Search** (`/hotels`)
   - City autocomplete
   - Hotel cards with ratings and pricing
   - Click to view hotel details

5. **Seat Selection Demo** (`/seat-demo`)
   - Standalone demo to test all three seat layouts

### 🚀 How to Test:

1. Start the frontend: `npm run dev`
2. Login or Register
3. Navigate to Flights/Buses/Trains from the navbar
4. **Try these searches:**
   - **Flights**: Mumbai → Delhi
   - **Buses**: Mumbai → Pune
   - **Trains**: Mumbai → Delhi
   - **Hotels**: Mumbai
5. Click on results to see seat selection!

---

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Backend API running on `http://localhost:8080`

### Installation Steps

1. **Navigate to the frontend directory:**
```bash
cd travelsmart-frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Start the development server:**
```bash
npm run dev
```

5. **Open your browser:**
Navigate to `http://localhost:5173`

## 📋 Default Test Credentials

For testing purposes, you can use these credentials (if your backend supports them):

**Admin Account:**
- Email: `admin@travelsmart.com`
- Password: `admin123`

**Regular User:**
- Email: `user@travelsmart.com`
- Password: `user123`

## 🎯 Key Features to Test

### 1. User Registration & Login
- Go to `/register` to create a new account
- Verify email (check console for confirmation link in development)
- Login at `/login`

### 2. Dashboard
- View quick actions for flights, hotels, buses, trains
- See recent searches
- Access AI trip planner

### 3. Flight Search
- Navigate to `/flights`
- Enter origin, destination, and date
- View search results
- Select and book a flight

### 4. Hotel Search
- Navigate to `/hotels`
- Search by location and dates
- View hotel details
- Book a room

### 5. Trip Planner
- Navigate to `/trip-planner`
- Fill in destination, dates, budget
- Select interests
- Generate AI-powered itinerary

### 6. Bookings
- Navigate to `/bookings`
- View all your bookings
- Download booking confirmations
- Cancel bookings

### 7. Profile Management
- Navigate to `/profile`
- Update personal information
- Manage preferences

### 8. Admin Dashboard (Admin Only)
- Navigate to `/admin`
- View system statistics
- Manage users, hotels, bookings
- Configure API keys

## 🔧 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🌐 API Configuration

The frontend connects to your backend API. Update the `.env` file:

```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_RAZORPAY_KEY=your_razorpay_key_here
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 UI Components

### Navigation
- Sticky navbar with user menu
- Mobile-responsive hamburger menu
- Role-based navigation items

### Forms
- Input validation
- Loading states
- Error handling
- Success notifications

### Cards
- Hover effects
- Shadow transitions
- Responsive layouts

### Modals & Widgets
- AI Chatbot widget (bottom-right)
- Payment modal
- Confirmation dialogs

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill the process using port 5173
npx kill-port 5173
# Or use a different port
npm run dev -- --port 3000
```

### API Connection Issues
- Ensure backend is running on `http://localhost:8080`
- Check CORS settings in backend
- Verify API_URL in `.env` file

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Styling Issues
```bash
# Rebuild Tailwind CSS
npm run build
```

## 📚 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Chatbot/     # AI chatbot widget
│   └── Layout/      # Layout components (Navbar, Footer)
├── pages/           # Page components (routes)
├── services/        # API service functions
├── store/           # Zustand state management
├── utils/           # Utility functions
├── App.jsx          # Main app component with routing
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## 🔐 Authentication Flow

1. User registers → Email confirmation sent
2. User confirms email → Account activated
3. User logs in → JWT token received
4. Token stored in localStorage via Zustand
5. Token automatically included in API requests
6. On 401 error → User redirected to login

## 💡 Tips for Development

1. **Use React DevTools** for debugging components
2. **Check Network tab** for API call issues
3. **Use Console** for error messages
4. **Hot reload** works automatically - just save files
5. **Tailwind IntelliSense** extension recommended for VS Code

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 📞 Support

- Documentation: See README.md
- Issues: Create an issue on GitHub
- Email: support@travelsmart.com

## 🎉 You're Ready!

Your TravelSmart frontend is now running. Start exploring the features and building amazing travel experiences!

Happy coding! 🚀✈️🏨
