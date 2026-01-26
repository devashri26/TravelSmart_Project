import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, PlaneTakeoff, PlaneLanding, Loader2, X, Clock, Plane } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import SeatSelection from '../components/Booking/SeatSelection';
import { airports } from '../data/mockData';
import { flightService } from '../services/flightService';
import toast from 'react-hot-toast';

const FlightSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    tripType: 'oneWay',
  });
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });

    // Autocomplete for origin
    if (name === 'origin') {
      const filtered = airports.filter(airport =>
        airport.city.toLowerCase().includes(value.toLowerCase()) ||
        airport.code.toLowerCase().includes(value.toLowerCase())
      );
      setOriginSuggestions(filtered);
      setShowOriginSuggestions(value.length > 0);
    }

    // Autocomplete for destination
    if (name === 'destination') {
      const filtered = airports.filter(airport =>
        airport.city.toLowerCase().includes(value.toLowerCase()) ||
        airport.code.toLowerCase().includes(value.toLowerCase())
      );
      setDestSuggestions(filtered);
      setShowDestSuggestions(value.length > 0);
    }
  };

  const selectOrigin = (airport) => {
    setSearchParams({ ...searchParams, origin: `${airport.city} (${airport.code})` });
    setShowOriginSuggestions(false);
  };

  const selectDestination = (airport) => {
    setSearchParams({ ...searchParams, destination: `${airport.city} (${airport.code})` });
    setShowDestSuggestions(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Extract city names from the format "City (CODE)"
      const extractCity = (str) => {
        const match = str.match(/^(.+?)\s*\(/);
        return match ? match[1].trim() : str;
      };

      const searchData = {
        departureCity: extractCity(searchParams.origin),
        arrivalCity: extractCity(searchParams.destination),
        date: searchParams.departureDate
      };

      const results = await flightService.searchFlights(searchData);
      
      setFlights(results);
      if (results.length === 0) {
        toast('No flights found for your search criteria.', { icon: 'ℹ️' });
      } else {
        toast.success(`Found ${results.length} flight(s)!`);
      }
    } catch (error) {
      toast.error('Failed to search flights. Please try again.');
      console.error('Flight search error:', error);
      setFlights([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFlight = (flight) => {
    // Check if user is logged in
    const authData = localStorage.getItem('auth-storage');
    const isAuthenticated = authData && JSON.parse(authData).state?.token;
    if (!isAuthenticated) {
      toast.error('Please login to book flights');
      navigate('/login', { state: { from: '/flights', flightData: flight } });
      return;
    }
    
    setSelectedFlight(flight);
    setShowSeatSelection(true);
  };

  const handleSeatsSelected = (seats) => {
    const totalAmount = seats.reduce((sum, s) => sum + s.price, 0);
    toast.success(`Selected ${seats.length} seat(s) for ₹${totalAmount}`);
    
    // Navigate to payment with booking data
    const bookingData = {
      type: 'FLIGHT',
      flight: selectedFlight,
      seats: seats,
      totalAmount: totalAmount,
      passengers: searchParams.passengers
    };
    
    navigate('/payment', { state: bookingData });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Search Flights</h1>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Trip Type */}
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  value="roundTrip"
                  checked={searchParams.tripType === 'roundTrip'}
                  onChange={handleChange}
                  className="form-radio text-indigo-600"
                />
                <span className="text-gray-700 font-semibold">Round Trip</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  value="oneWay"
                  checked={searchParams.tripType === 'oneWay'}
                  onChange={handleChange}
                  className="form-radio text-indigo-600"
                />
                <span className="text-gray-700 font-semibold">One Way</span>
              </label>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Origin */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <PlaneTakeoff className="absolute left-3 bottom-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="origin"
                  value={searchParams.origin}
                  onChange={handleChange}
                  onFocus={() => setShowOriginSuggestions(searchParams.origin.length > 0)}
                  placeholder="City or Airport"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
                {showOriginSuggestions && originSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {originSuggestions.map((airport) => (
                      <div
                        key={airport.code}
                        onClick={() => selectOrigin(airport)}
                        className="px-4 py-3 hover:bg-cyan-50 cursor-pointer border-b border-gray-100 last:border-0"
                      >
                        <div className="font-semibold text-gray-900">{airport.city} ({airport.code})</div>
                        <div className="text-sm text-gray-600">{airport.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <PlaneLanding className="absolute left-3 bottom-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="destination"
                  value={searchParams.destination}
                  onChange={handleChange}
                  onFocus={() => setShowDestSuggestions(searchParams.destination.length > 0)}
                  placeholder="City or Airport"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
                {showDestSuggestions && destSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {destSuggestions.map((airport) => (
                      <div
                        key={airport.code}
                        onClick={() => selectDestination(airport)}
                        className="px-4 py-3 hover:bg-cyan-50 cursor-pointer border-b border-gray-100 last:border-0"
                      >
                        <div className="font-semibold text-gray-900">{airport.city} ({airport.code})</div>
                        <div className="text-sm text-gray-600">{airport.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Departure Date */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
                <Calendar className="absolute left-3 bottom-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="departureDate"
                  value={searchParams.departureDate}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Passengers */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
                <Users className="absolute left-3 bottom-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="passengers"
                  value={searchParams.passengers}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  Searching Flights...
                </>
              ) : (
                <>
                  <Search className="w-6 h-6 mr-2" />
                  Search Flights
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {flights.length > 0 && !showSeatSelection && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Available Flights ({flights.length})
            </h2>
            <div className="space-y-4">
              {flights.map((flight) => {
                const formatTime = (dateString) => {
                  return new Date(dateString).toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });
                };

                const calculateDuration = (departure, arrival) => {
                  const diff = new Date(arrival) - new Date(departure);
                  const hours = Math.floor(diff / (1000 * 60 * 60));
                  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                  return `${hours}h ${minutes}m`;
                };

                return (
                  <div key={flight.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <Plane className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-xl font-bold text-gray-900">{flight.airline}</p>
                            {flight.id ? (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                LOCAL
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                                LIVE
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{formatTime(flight.departureTime)}</p>
                          <p className="text-sm text-gray-600">{flight.departureCity}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <Clock className="w-5 h-5 text-gray-400 mb-1" />
                          <p className="text-sm text-gray-600">{calculateDuration(flight.departureTime, flight.arrivalTime)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{formatTime(flight.arrivalTime)}</p>
                          <p className="text-sm text-gray-600">{flight.arrivalCity}</p>
                        </div>
                      </div>

                      <div className="text-center md:text-right">
                        <p className="text-3xl font-bold text-cyan-600">₹{flight.price}</p>
                        <p className="text-sm text-gray-600 mb-2">{flight.availableSeats} seats left</p>
                        <button 
                          onClick={() => handleSelectFlight(flight)}
                          className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
                        >
                          Select Flight
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Seat Selection Modal */}
        {showSeatSelection && selectedFlight && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Select Your Seats</h2>
                  <p className="text-gray-600">
                    {selectedFlight.airline} {selectedFlight.flightNumber} | {selectedFlight.origin} → {selectedFlight.destination}
                  </p>
                </div>
                <button
                  onClick={() => setShowSeatSelection(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              <div className="p-6">
                <SeatSelection                  type="flight"                  inventoryId={selectedFlight?.id}                  onSeatsSelected={handleSeatsSelected}                  maxSeats={searchParams.passengers}                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSearchPage;

