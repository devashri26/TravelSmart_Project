import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import FlightSearchPage from './pages/FlightSearchPage';
import HotelSearchPage from './pages/HotelSearchPage';
import BusSearchPage from './pages/BusSearchPage';
import TrainSearchPage from './pages/TrainSearchPage';
import TripPlannerPage from './pages/TripPlannerPage';
import SmartTripPlannerPage from './pages/SmartTripPlannerPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminPayments from './pages/admin/AdminPayments';
import AdminUsers from './pages/admin/AdminUsers';
import AdminFlights from './pages/admin/AdminFlights';
import AdminHotels from './pages/admin/AdminHotels';
import AdminBuses from './pages/admin/AdminBuses';
import AdminTrains from './pages/admin/AdminTrains';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import AdminManagement from './pages/admin/AdminManagement';
import ConfirmAccountPage from './pages/ConfirmAccountPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import PaymentPage from './pages/PaymentPage';
import SeatSelectionDemo from './pages/SeatSelectionDemo';
import SeatLockingDemo from './pages/SeatLockingDemo';
import WalletPage from './pages/WalletPage';
import TravelersPage from './pages/TravelersPage';
import RedBusBusSearch from './pages/RedBusBusSearch';
import RedBusPassengerDetails from './pages/RedBusPassengerDetails';
import TestLiveFlights from './pages/TestLiveFlights';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false, superAdminOnly = false }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check for super admin access
  if (superAdminOnly && user?.role !== 'ROLE_SUPER_ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  // Check for admin access (includes super admin)
  if (adminOnly && user?.role !== 'ADMIN' && user?.role !== 'ROLE_ADMIN' && user?.role !== 'ROLE_SUPER_ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/confirm-account" element={<ConfirmAccountPage />} />
        <Route path="/seat-demo" element={<SeatSelectionDemo />} />
        <Route path="/seat-locking-demo" element={<SeatLockingDemo />} />

        {/* Public Search Pages - No login required for browsing */}
        <Route path="/flights" element={<FlightSearchPage />} />
        <Route path="/hotels" element={<HotelSearchPage />} />
        <Route path="/buses" element={<BusSearchPage />} />
        <Route path="/trains" element={<TrainSearchPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        
        {/* RedBus-style booking flow */}
        <Route path="/redbus-search" element={<RedBusBusSearch />} />
        <Route path="/redbus-passenger-details" element={<RedBusPassengerDetails />} />
        
        {/* Test Live Flights API */}
        <Route path="/test-live-flights" element={<TestLiveFlights />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotels/:id"
          element={
            <ProtectedRoute>
              <HotelDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trip-planner"
          element={
            <ProtectedRoute>
              <TripPlannerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <WalletPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/travelers"
          element={
            <ProtectedRoute>
              <TravelersPage />
            </ProtectedRoute>
          }
        />
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute adminOnly>
              <AdminBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute adminOnly>
              <AdminPayments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/flights"
          element={
            <ProtectedRoute adminOnly>
              <AdminFlights />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hotels"
          element={
            <ProtectedRoute adminOnly>
              <AdminHotels />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/buses"
          element={
            <ProtectedRoute adminOnly>
              <AdminBuses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/trains"
          element={
            <ProtectedRoute adminOnly>
              <AdminTrains />
            </ProtectedRoute>
          }
        />

        {/* Super Admin Routes */}
        <Route
          path="/admin/super-admin/dashboard"
          element={
            <ProtectedRoute superAdminOnly>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/super-admin/admins"
          element={
            <ProtectedRoute superAdminOnly>
              <AdminManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/super-admin/users"
          element={
            <ProtectedRoute superAdminOnly>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;




