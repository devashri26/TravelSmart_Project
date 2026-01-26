import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin, Loader2, Bus, X, Clock } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import SeatSelection from '../components/Booking/SeatSelection';
import { cities } from '../data/mockData';
import { busService } from '../services/busService';
import toast from 'react-hot-toast';

const BusSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
  });
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });

    if (name === 'from') {
      const filtered = cities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFromSuggestions(filtered);
      setShowFromSuggestions(value.length > 0);
    }

    if (name === 'to') {
      const filtered = cities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setToSuggestions(filtered);
      setShowToSuggestions(value.length > 0);
    }
  };

  const selectFrom = (city) => {
    setSearchParams({ ...searchParams, from: city });
    setShowFromSuggestions(false);
  };

  const selectTo = (city) => {
    setSearchParams({ ...searchParams, to: city });
    setShowToSuggestions(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const searchData = {
        origin: searchParams.from,
        destination: searchParams.to,
        date: searchParams.date
      };

      const results = await busService.searchBuses(searchData);
      
      setBuses(results);
      if (results.length === 0) {
        toast('No buses found for your search criteria.', { icon: 'ℹ' });
      } else {
        toast.success('Found ' + results.length + ' bus(es)!');
      }
    } catch (error) {
      toast.error('Failed to search buses. Please try again.');
      console.error('Bus search error:', error);
      setBuses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBus = (bus) => {
    const authData = localStorage.getItem('auth-storage');
    const isAuthenticated = authData && JSON.parse(authData).state?.token;
    if (!isAuthenticated) {
      toast.error('Please login to book bus tickets');
      navigate('/login', { state: { from: '/buses', busData: bus } });
      return;
    }
    
    setSelectedBus(bus);
    setShowSeatSelection(true);
  };

  const handleSeatsSelected = (seats) => {
    const totalAmount = seats.reduce((sum, s) => sum + s.price, 0);
    toast.success('Selected ' + seats.length + ' seat(s) for Rs.' + totalAmount);
    
    const bookingData = {
      type: 'BUS',
      bus: selectedBus,
      seats: seats,
      totalAmount: totalAmount,
      from: searchParams.from,
      to: searchParams.to,
      date: searchParams.date
    };
    
    navigate('/payment', { state: bookingData });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-black text-gray-900 mb-8">Search Buses</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <MapPin className="absolute left-3 bottom-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="from"
                  value={searchParams.from}
                  onChange={handleChange}
                  onFocus={() => setShowFromSuggestions(searchParams.from.length > 0)}
                  placeholder="Departure City"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
                {showFromSuggestions && fromSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {fromSuggestions.map((city) => (
                      <div
                        key={city}
                        onClick={() => selectFrom(city)}
                        className="px-4 py-3 hover:bg-cyan-50 cursor-pointer border-b border-gray-100 last:border-0"
                      >
                        <div className="font-semibold text-gray-900">{city}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <MapPin className="absolute left-3 bottom-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="to"
                  value={searchParams.to}
                  onChange={handleChange}
                  onFocus={() => setShowToSuggestions(searchParams.to.length > 0)}
                  placeholder="Arrival City"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
                {showToSuggestions && toSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {toSuggestions.map((city) => (
                      <div
                        key={city}
                        onClick={() => selectTo(city)}
                        className="px-4 py-3 hover:bg-cyan-50 cursor-pointer border-b border-gray-100 last:border-0"
                      >
                        <div className="font-semibold text-gray-900">{city}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <Calendar className="absolute left-3 bottom-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={searchParams.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
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
                  Searching Buses...
                </>
              ) : (
                <>
                  <Search className="w-6 h-6 mr-2" />
                  Search Buses
                </>
              )}
            </button>
          </form>
        </div>

        {buses.length > 0 && !showSeatSelection && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Available Buses ({buses.length})
            </h2>
            <div className="space-y-4">
              {buses.map((bus) => {
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
                  return hours + 'h ' + minutes + 'm';
                };

                return (
                  <div key={bus.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                          <Bus className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-xl font-bold text-gray-900">{bus.operator}</p>
                            {bus.id ? (
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
                          <p className="text-sm text-gray-600">{bus.busNumber}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{formatTime(bus.departureTime)}</p>
                          <p className="text-sm text-gray-600">{bus.origin}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <Clock className="w-5 h-5 text-gray-400 mb-1" />
                          <p className="text-sm text-gray-600">{calculateDuration(bus.departureTime, bus.arrivalTime)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{formatTime(bus.arrivalTime)}</p>
                          <p className="text-sm text-gray-600">{bus.destination}</p>
                        </div>
                      </div>

                      <div className="text-center md:text-right">
                        <p className="text-3xl font-bold text-cyan-600">Rs.{bus.price}</p>
                        <p className="text-sm text-gray-600 mb-2">{bus.availableSeats} seats left</p>
                        <button 
                          onClick={() => handleSelectBus(bus)}
                          className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
                        >
                          View Seats
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showSeatSelection && selectedBus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Select Your Seats</h2>
                  <p className="text-gray-600">
                    {selectedBus.operator} | {selectedBus.origin} to {selectedBus.destination}
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
                <SeatSelection
                  type="bus"
                  onSeatsSelected={handleSeatsSelected}
                  maxSeats={6}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusSearchPage;
