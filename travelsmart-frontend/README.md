# TravelSmart Frontend

A modern, interactive, and professional travel booking platform built with React, Vite, and Tailwind CSS.

## 🚀 Features

### User Features
- ✅ User Registration & Login (JWT Authentication)
- ✅ Profile Management (budget, preferences, travel interests)
- ✅ View & Edit Personal Details
- ✅ Save Itineraries
- ✅ View Past Bookings
- ✅ Download Itinerary as PDF

### AI Agentic Chatbot
- ✅ Conversational Travel Planning
- ✅ AI-Generated Itinerary (day-wise)
- ✅ AI-Generated Estimated Budget
- ✅ AI-Based Hotel Recommendations
- ✅ AI-Based Flight/Bus Suggestions
- ✅ AI Answers for Travel-Related Queries
- ✅ AI Compares Different Travel Options

### Trip Planner Module
- ✅ User Form for Travel Inputs
- ✅ Auto-Generate Itinerary using AI
- ✅ Add or Remove Activities Manually
- ✅ Save Itinerary to User Profile

### Flight Search
- ✅ Live Flight Data using External API
- ✅ View Prices, Timings, Airlines, Duration
- ✅ Sort & Filter Flights
- ✅ Show Cheapest/Best/Fastest Options
- ✅ AI Explains Which Flight is Best

### Bus & Train Search
- ✅ Live Bus/Train Data
- ✅ Bus Type, Fare, Duration, Pick-up & Drop Points
- ✅ AI Recommends Budget-Friendly Options

### Hotel Module
- ✅ View Hotel List with Images
- ✅ Sort by Price, Rating, Amenities
- ✅ AI Suggests Best Hotels
- ✅ Hotel Detail Page with Reviews
- ✅ Booking Functionality

### Booking Module
- ✅ Book Hotels/Flights/Buses/Trains
- ✅ View Booking Summary
- ✅ Razorpay Checkout (Test Mode)
- ✅ Payment Confirmation
- ✅ Store Booking Details

### Payment Gateway
- ✅ Secure Payment with Razorpay
- ✅ Multiple Payment Methods (Card, UPI, Wallet)
- ✅ Payment Verification

### Review & Ratings
- ✅ Users Leave Ratings After Booking
- ✅ View Reviews on Hotel Detail Page

### Super Admin Panel
- ✅ Manage All Users
- ✅ Add/Edit/Delete Hotels
- ✅ View All Bookings
- ✅ Dashboard Analytics

## 🛠️ Tech Stack

- **React 19** - UI Library
- **Vite** - Build Tool
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Zustand** - State Management
- **Axios** - HTTP Client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Framer Motion** - Animations
- **jsPDF & html2canvas** - PDF Generation

## 📦 Installation

1. Clone the repository:
```bash
cd travelsmart-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_RAZORPAY_KEY=your_razorpay_key_here
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
travelsmart-frontend/
├── src/
│   ├── components/
│   │   ├── Chatbot/
│   │   │   └── ChatbotWidget.jsx
│   │   └── Layout/
│   │       └── Navbar.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── FlightSearchPage.jsx
│   │   ├── HotelSearchPage.jsx
│   │   ├── HotelDetailsPage.jsx
│   │   ├── BusSearchPage.jsx
│   │   ├── TrainSearchPage.jsx
│   │   ├── TripPlannerPage.jsx
│   │   ├── BookingsPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── PaymentPage.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── ConfirmAccountPage.jsx
│   ├── services/
│   │   ├── authService.js
│   │   ├── flightService.js
│   │   ├── hotelService.js
│   │   ├── busService.js
│   │   ├── trainService.js
│   │   ├── bookingService.js
│   │   └── chatbotService.js
│   ├── store/
│   │   └── authStore.js
│   ├── utils/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🔑 Key Features Implementation

### Authentication Flow
- JWT-based authentication
- Persistent login using Zustand with localStorage
- Protected routes for authenticated users
- Role-based access control (User/Admin)

### State Management
- Zustand for global state
- Persistent storage for auth state
- Automatic token injection in API calls

### API Integration
- Axios interceptors for auth tokens
- Centralized API configuration
- Error handling and automatic logout on 401

### Responsive Design
- Mobile-first approach
- Tailwind CSS for styling
- Responsive navigation
- Optimized for all screen sizes

## 🎨 UI/UX Features

- Modern gradient backgrounds
- Smooth animations and transitions
- Loading states and skeletons
- Toast notifications for user feedback
- Interactive chatbot widget
- Beautiful card designs
- Hover effects and micro-interactions

## 🚀 Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔐 Environment Variables

```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_RAZORPAY_KEY=your_razorpay_key_here
```

## 📱 Pages Overview

### Public Pages
- **Landing Page** - Hero section, features, CTA
- **Login Page** - User authentication
- **Register Page** - New user registration
- **Confirm Account** - Email verification

### Protected Pages
- **Dashboard** - Quick actions, recent searches, AI assistant
- **Flight Search** - Search and book flights
- **Hotel Search** - Browse and book hotels
- **Hotel Details** - Detailed hotel information and reviews
- **Bus Search** - Find bus routes
- **Train Search** - Search train schedules
- **Trip Planner** - AI-powered itinerary generation
- **Bookings** - View and manage bookings
- **Profile** - User profile management
- **Payment** - Secure payment processing

### Admin Pages
- **Admin Dashboard** - System overview and management

## 🤖 AI Chatbot Integration

The chatbot widget provides:
- Real-time conversation
- Quick action buttons
- Travel recommendations
- Itinerary suggestions
- Price comparisons

## 💳 Payment Integration

Razorpay integration supports:
- Credit/Debit Cards
- UPI Payments
- Digital Wallets
- Secure payment processing

## 🔄 API Services

All API calls are centralized in service files:
- `authService.js` - Authentication
- `flightService.js` - Flight operations
- `hotelService.js` - Hotel operations
- `busService.js` - Bus operations
- `trainService.js` - Train operations
- `bookingService.js` - Booking management
- `chatbotService.js` - AI chatbot

## 🎯 Future Enhancements

- [ ] Real-time notifications
- [ ] Social media integration
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Progressive Web App (PWA)
- [ ] Advanced filters and sorting
- [ ] Price alerts
- [ ] Travel insurance integration
- [ ] Group booking features
- [ ] Loyalty program

## 🐛 Known Issues

- PDF download feature needs backend integration
- Some API endpoints are mocked for development
- Review submission needs backend implementation

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email support@travelsmart.com or join our Slack channel.

---

Built with ❤️ by the TravelSmart Team
