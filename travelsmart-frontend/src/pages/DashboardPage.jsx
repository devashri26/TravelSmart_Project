import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plane, Hotel, Bus, Train, Sparkles, Wallet, Calendar, User, 
  MessageCircle, MapPin, Users, Clock, ArrowRight 
} from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import useAuthStore from '../store/authStore';
import ChatbotWidget from '../components/Chatbot/ChatbotWidget';
import axios from 'axios';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [showChatbot, setShowChatbot] = useState(false);
  const [stats, setStats] = useState({ 
    walletBalance: 0, 
    totalBookings: 0, 
    upcomingTrips: [], 
    loading: true 
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const authData = localStorage.getItem('auth-storage');
        if (!authData) {
          setStats(prev => ({ ...prev, loading: false }));
          return;
        }
        const { state } = JSON.parse(authData);
        const token = state?.token;
        if (!token) {
          setStats(prev => ({ ...prev, loading: false }));
          return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const [walletRes, bookingsRes] = await Promise.all([
          axios.get('http://localhost:8080/api/v1/wallet', config),
          axios.get('http://localhost:8080/api/v1/bookings', config)
        ]);
        
        const bookings = bookingsRes.data || [];
        const upcoming = bookings.filter(b => 
          b.status === 'CONFIRMED' && b.departureTime && new Date(b.departureTime) > new Date()
        ).slice(0, 3);
        
        setStats({ 
          walletBalance: walletRes.data?.balance || 0, 
          totalBookings: bookings.length, 
          upcomingTrips: upcoming, 
          loading: false 
        });
      } catch (error) {
        console.error('Error:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    loadData();
  }, []);

  if (stats.loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section with VISIBLE text */}
        <div className="relative bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl overflow-hidden shadow-xl mb-8">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200" 
              alt="Travel" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="relative px-8 py-10">
            <h1 className="text-4xl font-bold text-white mb-2">
              Hey {user?.username || 'Traveler'}, ready for your next adventure?
            </h1>
            <p className="text-cyan-100 text-lg mb-6">
              Plan smarter with AI-powered travel tools
            </p>
            
            {/* FIXED: White boxes with DARK text */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <p className="text-gray-600 text-sm font-medium mb-1">Total Trips</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md">
                <p className="text-gray-600 text-sm font-medium mb-1">Wallet</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.walletBalance.toFixed(0)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md">
                <p className="text-gray-600 text-sm font-medium mb-1">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcomingTrips.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Trips */}
        {stats.upcomingTrips.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-6 h-6 text-cyan-600" />
                Your Upcoming Trips
              </h2>
              <Link to="/bookings" className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {stats.upcomingTrips.map((trip) => (
                <div key={trip.id} className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {trip.inventoryType}
                    </span>
                    <span className="text-green-600 font-semibold text-sm">{trip.status}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{trip.displayName || `Trip #`}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(trip.departureTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    {trip.seatNumbers && (
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Seats: {trip.seatNumbers}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book Your Next Trip - IMAGES MORE VISIBLE */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plane className="w-6 h-6 text-cyan-600" />
            Book Your Next Trip
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link to="/flights" className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
              <div className="h-32 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400" 
                  alt="Flights" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60" 
                />
                <Plane className="w-12 h-12 text-white relative z-10 drop-shadow-lg" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">Flights</h3>
                <p className="text-sm text-gray-600">Search flights</p>
              </div>
            </Link>

            <Link to="/hotels" className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
              <div className="h-32 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400" 
                  alt="Hotels" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60" 
                />
                <Hotel className="w-12 h-12 text-white relative z-10 drop-shadow-lg" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">Hotels</h3>
                <p className="text-sm text-gray-600">Find stays</p>
              </div>
            </Link>

            <Link to="/buses" className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
              <div className="h-32 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400" 
                  alt="Buses" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60" 
                />
                <Bus className="w-12 h-12 text-white relative z-10 drop-shadow-lg" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">Buses</h3>
                <p className="text-sm text-gray-600">Book buses</p>
              </div>
            </Link>

            <Link to="/trains" className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
              <div className="h-32 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400" 
                  alt="Trains" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60" 
                />
                <Train className="w-12 h-12 text-white relative z-10 drop-shadow-lg" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">Trains</h3>
                <p className="text-sm text-gray-600">Reserve trains</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Smart Travel Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-600" />
            Smart Travel Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link to="/trip-planner" className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
              <div className="flex items-start justify-between mb-4">
                <Sparkles className="w-10 h-10" />
                <ArrowRight className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold mb-2">AI Trip Planner</h3>
              <p className="text-pink-100 mb-4">Get personalized itineraries with carbon tracking, SOS features, and offline PDF export</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs">Carbon Tracking</span>
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs">Emergency SOS</span>
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs">Offline PDF</span>
              </div>
            </Link>

            <Link to="/smart-trip-planner" className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
              <div className="flex items-start justify-between mb-4">
                <MapPin className="w-10 h-10" />
                <ArrowRight className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Smart Trip Planner</h3>
              <p className="text-indigo-100 mb-4">Advanced customization with budget optimization and custom packages</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs">Custom Packages</span>
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs">Budget Optimizer</span>
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs">Route Planning</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-6 h-6 text-cyan-600" />
            Quick Access
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link to="/bookings" className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">My Bookings</h3>
              <p className="text-2xl font-bold text-cyan-600">{stats.totalBookings}</p>
            </Link>

            <Link to="/wallet" className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">My Wallet</h3>
              <p className="text-2xl font-bold text-cyan-600">₹{stats.walletBalance.toFixed(0)}</p>
            </Link>

            <Link to="/travelers" className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Travelers</h3>
              <p className="text-sm text-gray-600">Manage profiles</p>
            </Link>

            <Link to="/profile" className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                <User className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">My Profile</h3>
              <p className="text-sm text-gray-600">Update details</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <button 
        onClick={() => setShowChatbot(!showChatbot)} 
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {showChatbot && (
        <div className="fixed bottom-24 right-6 z-50">
          <ChatbotWidget onClose={() => setShowChatbot(false)} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
