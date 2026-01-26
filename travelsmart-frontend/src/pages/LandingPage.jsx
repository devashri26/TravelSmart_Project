import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Calendar, Users, Shield, Leaf, Smartphone, Star, 
  User, Plane, Train, Bus, Hotel, Sparkles, CheckCircle
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('trip-planner');
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (activeTab === 'trip-planner') {
      navigate('/trip-planner');
    } else if (activeTab === 'flights') {
      navigate('/flights');
    } else if (activeTab === 'hotels') {
      navigate('/hotels');
    } else if (activeTab === 'buses') {
      navigate('/buses');
    } else if (activeTab === 'trains') {
      navigate('/trains');
    }
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                TravelSmart
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-8 text-gray-500 text-sm font-medium">
              <Link to="/trip-planner" className="flex items-center hover:text-cyan-600 transition">
                <Sparkles className="w-4 h-4 mr-1" /> AI Trip Planner
              </Link>
              <Link to="/flights" className="flex items-center hover:text-cyan-600 transition">
                <Plane className="w-4 h-4 mr-1" /> Flights
              </Link>
              <Link to="/hotels" className="flex items-center hover:text-cyan-600 transition">
                <Hotel className="w-4 h-4 mr-1" /> Hotels
              </Link>
              <Link to="/buses" className="flex items-center hover:text-cyan-600 transition">
                <Bus className="w-4 h-4 mr-1" /> Buses
              </Link>
              <Link to="/trains" className="flex items-center hover:text-cyan-600 transition">
                <Train className="w-4 h-4 mr-1" /> Trains
              </Link>
            </div>

            {/* Login / Account Button */}
            <div>
              {isAuthenticated ? (
                <Link 
                  to="/dashboard"
                  className="flex items-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold px-6 py-2 rounded-full shadow hover:shadow-lg transform active:scale-95 transition"
                >
                  <User size={16} className="mr-2" /> 
                  {user?.username || 'Dashboard'}
                </Link>
              ) : (
                <Link 
                  to="/login"
                  className="flex items-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold px-6 py-2 rounded-full shadow hover:shadow-lg transform active:scale-95 transition"
                >
                  <User size={16} className="mr-2" /> Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[600px] bg-slate-900 flex justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop" 
            alt="Travel Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50"></div>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full max-w-6xl mt-12 px-4 flex flex-col items-center">
          {/* Headlines */}
          <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-2 text-center shadow-sm">
            Smart Travel Planning with AI
          </h1>
          <p className="text-gray-200 text-lg mb-8 font-medium">
            Plan personalized trips, track carbon footprint, and travel safely with TravelSmart AI
          </p>

          {/* Search Widget */}
          <div className="bg-white rounded-xl shadow-2xl p-2 w-full max-w-5xl">
            {/* Widget Tabs */}
            <div className="flex justify-center space-x-1 mb-4 border-b border-gray-100 pb-2 p-4">
              <button 
                onClick={() => setActiveTab('trip-planner')}
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition ${activeTab === 'trip-planner' ? 'bg-cyan-50 text-cyan-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Sparkles size={20} className={activeTab === 'trip-planner' ? 'fill-cyan-600' : ''} />
                <span className="text-xs font-bold uppercase">AI Trip Planner</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('flights')}
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition ${activeTab === 'flights' ? 'bg-cyan-50 text-cyan-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Plane size={20} />
                <span className="text-xs font-bold uppercase">Flights</span>
              </button>

              <button 
                onClick={() => setActiveTab('hotels')}
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition ${activeTab === 'hotels' ? 'bg-cyan-50 text-cyan-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Hotel size={20} />
                <span className="text-xs font-bold uppercase">Hotels</span>
              </button>

              <button 
                onClick={() => setActiveTab('buses')}
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition ${activeTab === 'buses' ? 'bg-cyan-50 text-cyan-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Bus size={20} />
                <span className="text-xs font-bold uppercase">Buses</span>
              </button>

              <button 
                onClick={() => setActiveTab('trains')}
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition ${activeTab === 'trains' ? 'bg-cyan-50 text-cyan-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Train size={20} />
                <span className="text-xs font-bold uppercase">Trains</span>
              </button>
            </div>

            {/* Input Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-10 gap-2 px-4 pb-6">
              {/* Input: Destination */}
              <div className="md:col-span-3 border border-gray-200 p-3 rounded-lg hover:bg-cyan-50 cursor-pointer transition relative group">
                <label className="block text-xs text-gray-500 font-bold uppercase mb-1">Destination</label>
                <div className="flex items-center">
                  <MapPin className="text-cyan-500 w-5 h-5 mr-2" />
                  <input type="text" placeholder="Where to?" className="w-full bg-transparent outline-none text-gray-900 font-bold text-lg" defaultValue="Delhi, India" />
                </div>
              </div>

              {/* Input: Dates */}
              <div className="md:col-span-2 border border-gray-200 p-3 rounded-lg hover:bg-cyan-50 cursor-pointer transition">
                <label className="block text-xs text-gray-500 font-bold uppercase mb-1">Dates</label>
                <div className="flex items-center">
                  <Calendar className="text-cyan-500 w-5 h-5 mr-2" />
                  <span className="text-gray-900 font-bold text-lg">24 Dec</span>
                </div>
              </div>

              {/* Input: Travelers */}
              <div className="md:col-span-3 border border-gray-200 p-3 rounded-lg hover:bg-cyan-50 cursor-pointer transition">
                <label className="block text-xs text-gray-500 font-bold uppercase mb-1">Travelers & Budget</label>
                <div className="flex items-center">
                  <Users className="text-cyan-500 w-5 h-5 mr-2" />
                  <select className="bg-transparent w-full outline-none text-gray-900 font-bold text-lg appearance-none">
                    <option>2 Adults • ₹50,000</option>
                    <option>1 Adult • ₹25,000</option>
                    <option>Family • ₹1,00,000</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <div className="md:col-span-2 flex items-center justify-center">
                <button 
                  onClick={handleSearch}
                  className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition uppercase tracking-wide"
                >
                  SEARCH
                </button>
              </div>
            </div>
            
            {/* Widget Footer - Smart Features */}
            <div className="bg-gray-50 px-6 py-3 rounded-b-xl flex flex-wrap gap-6 text-xs text-gray-500 justify-center md:justify-start">
              <span className="flex items-center font-medium">
                <Leaf size={14} className="text-green-500 mr-1"/> Carbon Footprint Tracking
              </span>
              <span className="flex items-center font-medium">
                <Shield size={14} className="text-red-500 mr-1"/> Safety & SOS Features
              </span>
              <span className="flex items-center font-medium">
                <Sparkles size={14} className="text-purple-500 mr-1"/> AI-Powered Planning
              </span>
            </div>
          </div>

          {/* Promo Strip */}
          <div className="w-full max-w-5xl mt-6">
            <div className="bg-white/90 backdrop-blur-sm border border-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                  <Sparkles size={20}/>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">New: Smart Trip Planner with PDF Export</h3>
                  <p className="text-xs text-gray-500">Generate complete itineraries with budget breakdown and carbon footprint.</p>
                </div>
              </div>
              <Link 
                to="/trip-planner"
                className="text-cyan-600 text-xs font-bold border border-cyan-600 px-4 py-2 rounded-full hover:bg-cyan-50"
              >
                TRY NOW
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Destinations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          Popular Destinations 
          <span className="text-xs font-normal text-gray-400 ml-3 uppercase tracking-wider">
            Curated by our AI
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl shadow hover:shadow-2xl transition duration-300 group cursor-pointer border border-gray-100">
            <div className="relative h-56 overflow-hidden rounded-t-2xl">
              <img 
                src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800" 
                alt="Agra" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-green-700 text-xs font-bold px-2 py-1 rounded-md flex items-center shadow-sm">
                <Leaf size={12} className="mr-1"/> Eco-Friendly
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl text-gray-800">Taj Mahal & Agra</h3>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400 line-through">₹12,000</span>
                  <span className="text-xl font-bold text-gray-900">₹8,499</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-4">2 Days • Private Car • Heritage Hotels</p>
              
              <div className="flex gap-2 mb-4">
                <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded">ECO-FRIENDLY</span>
                <span className="bg-cyan-50 text-cyan-700 text-[10px] font-bold px-2 py-1 rounded">AI PLANNED</span>
              </div>

              <Link 
                to="/trip-planner"
                className="w-full py-2 rounded-lg border border-cyan-600 text-cyan-600 font-bold text-sm hover:bg-cyan-50 transition block text-center"
              >
                PLAN TRIP
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl shadow hover:shadow-2xl transition duration-300 group cursor-pointer border border-gray-100">
            <div className="relative h-56 overflow-hidden rounded-t-2xl">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800" 
                alt="Goa" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-blue-700 text-xs font-bold px-2 py-1 rounded-md flex items-center shadow-sm">
                <Shield size={12} className="mr-1"/> Safe Travel
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl text-gray-800">Goa Beach Paradise</h3>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400 line-through">₹25,000</span>
                  <span className="text-xl font-bold text-gray-900">₹18,999</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-4">4 Days • Beach Resort • Water Sports</p>
              
              <div className="flex gap-2 mb-4">
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded">SAFE TRAVEL</span>
                <span className="bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-1 rounded">POPULAR</span>
              </div>

              <Link 
                to="/trip-planner"
                className="w-full py-2 rounded-lg border border-cyan-600 text-cyan-600 font-bold text-sm hover:bg-cyan-50 transition block text-center"
              >
                PLAN TRIP
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl shadow hover:shadow-2xl transition duration-300 group cursor-pointer border border-gray-100">
            <div className="relative h-56 overflow-hidden rounded-t-2xl">
              <img 
                src="https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800" 
                alt="Himachal" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-purple-700 text-xs font-bold px-2 py-1 rounded-md flex items-center shadow-sm">
                <Sparkles size={12} className="mr-1"/> AI Curated
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl text-gray-800">Himachal Adventure</h3>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400 line-through">₹35,000</span>
                  <span className="text-xl font-bold text-gray-900">₹28,999</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-4">6 Days • Mountain Views • Adventure Sports</p>
              
              <div className="flex gap-2 mb-4">
                <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-1 rounded">AI CURATED</span>
                <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded">LOW CARBON</span>
              </div>

              <Link 
                to="/trip-planner"
                className="w-full py-2 rounded-lg border border-cyan-600 text-cyan-600 font-bold text-sm hover:bg-cyan-50 transition block text-center"
              >
                PLAN TRIP
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TravelSmart?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the future of travel planning with our AI-powered platform that prioritizes sustainability, safety, and personalization.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {/* Feature 1 */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center text-cyan-600 mb-4 group-hover:bg-cyan-600 group-hover:text-white transition duration-300">
                <Sparkles size={28} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">AI Trip Planning</h4>
              <p className="text-sm text-gray-500 max-w-[200px]">
                Personalized itineraries with budget breakdown, carbon footprint tracking, and PDF export.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-600 group-hover:text-white transition duration-300">
                <Leaf size={28} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Sustainable Travel</h4>
              <p className="text-sm text-gray-500 max-w-[200px]">
                Track your carbon footprint and choose eco-friendly options for responsible tourism.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4 group-hover:bg-red-600 group-hover:text-white transition duration-300">
                <Shield size={28} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Safety First</h4>
              <p className="text-sm text-gray-500 max-w-[200px]">
                Emergency contacts, safety alerts, and 24/7 support for worry-free travel.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                <CheckCircle size={28} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Complete Booking</h4>
              <p className="text-sm text-gray-500 max-w-[200px]">
                Book flights, hotels, buses, and trains all in one platform with secure payments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">
                Travel<span className="text-cyan-400">Smart</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mt-1">© 2024 TravelSmart Inc. All rights reserved.</p>
          </div>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
