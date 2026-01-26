# TravelSmart - Technical Architecture

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  React 19 + Vite + Tailwind CSS + Zustand + React Router   │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API (JWT)
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                        BACKEND                               │
│     Spring Boot 3.5.7 + Spring Security + JWT + JPA        │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │               │
┌───────▼──────┐ ┌────▼─────┐ ┌──────▼────────┐
│   MySQL DB   │ │ External │ │  Email SMTP   │
│  (travel_db) │ │   APIs   │ │    (Gmail)    │
└──────────────┘ └──────────┘ └───────────────┘
```

## 📁 Project Structure

### Frontend Structure
```
travelsmart-frontend/
├── src/
│   ├── components/
│   │   ├── Booking/
│   │   │   ├── SeatSelection.jsx       ✅ NEW
│   │   │   ├── PassengerForm.jsx       📋 TODO
│   │   │   ├── BookingSummary.jsx      📋 TODO
│   │   │   └── PaymentForm.jsx         📋 TODO
│   │   ├── Chatbot/
│   │   │   └── ChatbotWidget.jsx       ✅
│   │   ├── Layout/
│   │   │   ├── Navbar.jsx              ✅
│   │   │   └── Footer.jsx              📋 TODO
│   │   └── Common/
│   │       ├── LoadingSpinner.jsx      📋 TODO
│   │       ├── ErrorBoundary.jsx       📋 TODO
│   │       └── Modal.jsx               📋 TODO
│   ├── pages/
│   │   ├── LandingPage.jsx             ✅
│   │   ├── LoginPage.jsx               ✅
│   │   ├── RegisterPage.jsx            ✅
│   │   ├── DashboardPage.jsx           ✅
│   │   ├── FlightSearchPage.jsx        ✅
│   │   ├── HotelSearchPage.jsx         ✅
│   │   ├── BusSearchPage.jsx           ✅
│   │   ├── TrainSearchPage.jsx         ✅
│   │   ├── SeatSelectionPage.jsx       📋 TODO
│   │   ├── BookingConfirmPage.jsx      📋 TODO
│   │   └── ...
│   ├── services/
│   │   ├── authService.js              ✅
│   │   ├── flightService.js            ✅
│   │   ├── hotelService.js             ✅
│   │   ├── busService.js               ✅
│   │   ├── trainService.js             ✅
│   │   ├── bookingService.js           ✅
│   │   ├── paymentService.js           📋 TODO
│   │   └── chatbotService.js           ✅
│   ├── store/
│   │   ├── authStore.js                ✅
│   │   ├── bookingStore.js             📋 TODO
│   │   └── searchStore.js              📋 TODO
│   ├── utils/
│   │   ├── api.js                      ✅
│   │   ├── validators.js               📋 TODO
│   │   └── formatters.js               📋 TODO
│   └── hooks/
│       ├── useAuth.js                  📋 TODO
│       └── useBooking.js               📋 TODO
```

### Backend Structure
```
TravelSmart/
└── src/main/java/com/BookingSystem/TravelSmartBackend/
    ├── config/
    │   ├── CorsConfig.java             ✅
    │   ├── WebSecurityConfig.java     ✅
    │   └── RazorpayConfig.java        📋 TODO
    ├── controller/
    │   ├── AuthController.java        ✅
    │   ├── FlightController.java      ✅
    │   ├── HotelController.java       ✅
    │   ├── BusController.java         ✅
    │   ├── TrainController.java       ✅
    │   ├── BookingController.java     ✅
    │   ├── PaymentController.java     📋 TODO
    │   └── AdminController.java       📋 TODO
    ├── dto/
    │   ├── LoginDto.java              ✅
    │   ├── RegisterDto.java           ✅
    │   ├── LoginResponseDto.java      ✅
    │   ├── SeatSelectionDto.java      📋 TODO
    │   └── BookingRequestDto.java     ✅
    ├── model/
    │   ├── User.java                  ✅
    │   ├── Role.java                  ✅
    │   ├── Flight.java                ✅
    │   ├── Hotel.java                 ✅
    │   ├── Bus.java                   ✅
    │   ├── Train.java                 ✅
    │   ├── Booking.java               ✅
    │   └── ConfirmationToken.java     ✅
    ├── repository/
    │   ├── UserRepository.java        ✅
    │   ├── FlightRepository.java      ✅
    │   ├── HotelRepository.java       ✅
    │   ├── BusRepository.java         ✅
    │   ├── TrainRepository.java       ✅
    │   └── BookingRepository.java     ✅
    ├── service/
    │   ├── AuthService.java           ✅
    │   ├── EmailService.java          ✅
    │   ├── FlightService.java         ✅
    │   ├── HotelService.java          ✅
    │   ├── BusService.java            ✅
    │   ├── TrainService.java          ✅
    │   ├── BookingService.java        ✅
    │   └── PaymentService.java        📋 TODO
    ├── security/
    │   ├── JwtTokenProvider.java      ✅
    │   ├── JwtAuthenticationFilter.java ✅
    │   └── JwtAuthEntryPoint.java     ✅
    └── exception/
        └── GlobalExceptionHandler.java ✅
```

## 🔄 Data Flow

### 1. Booking Flow (Bus Example)

```
User Journey:
┌─────────────┐
│ Search Bus  │ → Enter from/to/date
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ View Results│ → List of buses (Guest OK)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Select Bus  │ → Click "Select Seats"
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Check Auth  │ → If not logged in → Redirect to Login
└──────┬──────┘       │
       │              │ After login → Return to seat selection
       ▼              │
┌─────────────┐◄──────┘
│ Select Seats│ → Visual seat layout
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Add Details │ → Passenger info
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Payment   │ → Razorpay integration
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Confirmation│ → Email + PDF ticket
└─────────────┘
```

### 2. API Request Flow

```
Frontend                Backend                 Database
   │                       │                       │
   │  POST /api/v1/auth/login                    │
   ├──────────────────────>│                      │
   │                       │  Query user          │
   │                       ├─────────────────────>│
   │                       │<─────────────────────┤
   │                       │  Generate JWT        │
   │  { token, user }      │                      │
   │<──────────────────────┤                      │
   │                       │                      │
   │  GET /api/v1/buses/search                   │
   │  Header: Bearer token │                      │
   ├──────────────────────>│                      │
   │                       │  Validate JWT        │
   │                       │  Query buses         │
   │                       ├─────────────────────>│
   │                       │<─────────────────────┤
   │  [ buses ]            │                      │
   │<──────────────────────┤                      │
```

## 🔐 Security Architecture

### JWT Token Structure
```json
{
  "sub": "username",
  "role": "ROLE_USER",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Protected Routes
- `/api/v1/auth/**` - Public
- `/api/v1/bookings/**` - Authenticated
- `/api/v1/admin/**` - Admin only
- `/api/v1/*/search` - Public (guest browsing)

## 💾 Database Schema

### Core Tables
```sql
users
├── id (PK)
├── username
├── email
├── password (hashed)
├── role (ROLE_USER, ROLE_ADMIN)
├── enabled
└── locked

bookings
├── id (PK)
├── user_id (FK)
├── booking_type (FLIGHT, BUS, TRAIN, HOTEL)
├── booking_reference
├── status (CONFIRMED, CANCELLED, PENDING)
├── total_amount
├── booking_date
└── travel_date

flights
├── id (PK)
├── airline
├── flight_number
├── origin
├── destination
├── departure_time
├── arrival_time
├── price
└── available_seats

buses
├── id (PK)
├── operator
├── bus_type
├── from_city
├── to_city
├── departure_time
├── arrival_time
├── price
├── total_seats
└── available_seats

hotels
├── id (PK)
├── name
├── location
├── rating
├── price_per_night
├── amenities
└── images

confirmation_tokens
├── id (PK)
├── token
├── user_id (FK)
├── created_at
├── expires_at
└── confirmed_at
```

## 🔌 External API Integrations

### Flight APIs
- **Amadeus API** - Real-time flight data
- **Sabre GDS** - Alternative provider
- **Implementation:** FlightService.java

### Bus APIs
- **RedBus API** - Bus bookings
- **AbhiBus API** - Alternative
- **Implementation:** BusService.java

### Train APIs
- **IRCTC API** - Indian Railways
- **RailYatri API** - Alternative
- **Implementation:** TrainService.java

### Payment Gateway
- **Razorpay** - Primary payment processor
- **Implementation:** PaymentService.java

### Maps & Location
- **Google Maps API** - Hotel locations
- **Implementation:** Frontend integration

## 📱 Component Architecture

### Reusable Components

#### SeatSelection Component
```jsx
<SeatSelection 
  type="bus|flight|train"
  onSeatsSelected={(seats) => handleSeats(seats)}
  maxSeats={6}
  layout={customLayout}
/>
```

#### BookingCard Component
```jsx
<BookingCard 
  type="flight|bus|train|hotel"
  data={bookingData}
  onSelect={() => handleSelect()}
/>
```

#### PaymentForm Component
```jsx
<PaymentForm 
  amount={totalAmount}
  onSuccess={(response) => handleSuccess(response)}
  onFailure={(error) => handleFailure(error)}
/>
```

## 🔄 State Management (Zustand)

### Auth Store
```javascript
{
  user: { username, email, role },
  token: "jwt-token",
  isAuthenticated: boolean,
  login(), logout(), updateUser()
}
```

### Booking Store (TODO)
```javascript
{
  currentBooking: {
    type: 'bus|flight|train|hotel',
    searchParams: {},
    selectedItem: {},
    selectedSeats: [],
    passengers: [],
    totalAmount: 0
  },
  setBookingData(),
  clearBooking(),
  addPassenger(),
  selectSeats()
}
```

## 🚀 Deployment Architecture

### Development
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- Database: `localhost:3306/travel_db`

### Production (Recommended)
```
Frontend: Vercel/Netlify
Backend: AWS EC2 / Heroku / Railway
Database: AWS RDS / Digital Ocean
CDN: Cloudflare
Email: SendGrid / AWS SES
```

## 📊 Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Caching with React Query
- Debounced search
- Virtual scrolling for large lists

### Backend
- Database indexing
- Redis caching
- Connection pooling
- Async processing
- Rate limiting

## 🔒 Security Measures

### Frontend
- XSS protection
- CSRF tokens
- Secure storage (httpOnly cookies)
- Input validation
- Sanitization

### Backend
- JWT authentication
- Password hashing (BCrypt)
- SQL injection prevention (JPA)
- CORS configuration
- Rate limiting
- API key encryption

## 📈 Scalability Considerations

### Horizontal Scaling
- Stateless backend (JWT)
- Load balancer ready
- Database replication
- Microservices architecture (future)

### Caching Strategy
- Redis for session data
- CDN for static assets
- Database query caching
- API response caching

## 🧪 Testing Strategy

### Frontend
- Unit tests (Jest/Vitest)
- Component tests (React Testing Library)
- E2E tests (Cypress/Playwright)
- Visual regression tests

### Backend
- Unit tests (JUnit)
- Integration tests
- API tests (Postman/REST Assured)
- Security tests

## 📝 API Documentation

### Authentication Endpoints
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/confirm?token=xxx
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
```

### Booking Endpoints
```
GET    /api/v1/flights/search
GET    /api/v1/buses/search
GET    /api/v1/trains/search
GET    /api/v1/hotels/search
POST   /api/v1/bookings
GET    /api/v1/bookings/user
GET    /api/v1/bookings/{id}
DELETE /api/v1/bookings/{id}
```

### Payment Endpoints
```
POST   /api/v1/payments/create-order
POST   /api/v1/payments/verify
POST   /api/v1/payments/refund
```

## 🎯 Implementation Phases

### Phase 1: Foundation (DONE ✅)
- Authentication system
- Basic UI/UX
- Database setup
- Email verification

### Phase 2: Core Booking (CURRENT)
- Seat selection UI ✅
- Guest browsing
- Complete booking flow
- Payment integration

### Phase 3: Advanced Features
- AI chatbot
- Holiday packages
- Activities module
- Reviews & ratings

### Phase 4: Admin & Analytics
- Complete admin panel
- Analytics dashboard
- CMS
- Reporting

### Phase 5: Optimization
- Performance tuning
- Security hardening
- Mobile app
- Advanced features

---

**Status:** Phase 1 Complete, Phase 2 In Progress
**Next:** Integrate seat selection into booking flow
