import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Filter, SlidersHorizontal, Star, Clock, DollarSign, TrendingUp } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import BusCard from '../components/RedBus/BusCard';
import { busService } from '../services/busService';
import toast from 'react-hot-toast';

const RedBusBusSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state;

  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filters, setFilters] = useState({
    busType: [],
    departureTime: [],
    priceRange: [0, 5000],
    rating: 0,
    amenities: []
  });

  const [sortBy, setSortBy] = useState('price'); // price, duration, departure, rating

  useEffect(() => {
    fetchBuses();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [buses, filters, sortBy]);

  const fetchBuses = async () => {
    try {
      const data = await busService.searchBuses(searchParams);
      setBuses(data);
    } catch (error) {
      toast.error('Failed to load buses');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...buses];

    // Apply filters
    if (filters.busType.length > 0) {
      result = result.filter(bus => filters.busType.includes(bus.busType));
    }

    if (filters.departureTime.length > 0) {
      result = result.filter(bus => {
        const hour = parseInt(bus.departureTime.split(':')[0]);
        return filters.departureTime.some(slot => {
          if (slot === 'morning') return hour >= 6 && hour < 12;
          if (slot === 'afternoon') return hour >= 12 && hour < 18;
          if (slot === 'evening') return hour >= 18 && hour < 24;
          if (slot === 'night') return hour >= 0 && hour < 6;
          return false;
        });
      });
    }

    result = result.filter(bus => 
      bus.price >= filters.priceRange[0] && bus.price <= filters.priceRange[1]
    );

    if (filters.rating > 0) {
      result = result.filter(bus => (bus.rating || 4.0) >= filters.rating);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return (a.durationMinutes || 360) - (b.durationMinutes || 360);
        case 'departure':
          return a.departureTime.localeCompare(b.departureTime);
        case 'rating':
          return (b.rating || 4.0) - (a.rating || 4.0);
        default:
          return 0;
      }
    });

    setFilteredBuses(result);
  };

  const toggleFilter = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  const handleBooking = (bookingData) => {
    navigate('/redbus-passenger-details', { state: bookingData });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Summary */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {searchParams?.from} → {searchParams?.to}
              </h1>
              <p className="text-gray-600">{searchParams?.date} • {filteredBuses.length} buses found</p>
            </div>
            <button
              onClick={() => navigate('/buses')}
              className="text-red-600 font-semibold hover:underline"
            >
              Modify Search
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h2>
                <button
                  onClick={() => setFilters({
                    busType: [],
                    departureTime: [],
                    priceRange: [0, 5000],
                    rating: 0,
                    amenities: []
                  })}
                  className="text-sm text-red-600 font-semibold hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Bus Type Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Bus Type</h3>
                {['AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Non-AC Seater'].map(type => (
                  <label key={type} className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.busType.includes(type)}
                      onChange={() => toggleFilter('busType', type)}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>

              {/* Departure Time Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Departure Time</h3>
                {[
                  { value: 'morning', label: 'Morning (6AM - 12PM)' },
                  { value: 'afternoon', label: 'Afternoon (12PM - 6PM)' },
                  { value: 'evening', label: 'Evening (6PM - 12AM)' },
                  { value: 'night', label: 'Night (12AM - 6AM)' }
                ].map(slot => (
                  <label key={slot.value} className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.departureTime.includes(slot.value)}
                      onChange={() => toggleFilter('departureTime', slot.value)}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{slot.label}</span>
                  </label>
                ))}
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Rating</h3>
                {[4, 3, 2].map(rating => (
                  <label key={rating} className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === rating}
                      onChange={() => setFilters(prev => ({ ...prev, rating }))}
                      className="w-4 h-4 text-red-600"
                    />
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-gray-700">{rating}+ Stars</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Bus List */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-4">
              <div className="flex items-center gap-4">
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">Sort by:</span>
                {[
                  { value: 'price', label: 'Price', icon: DollarSign },
                  { value: 'duration', label: 'Duration', icon: Clock },
                  { value: 'departure', label: 'Departure', icon: Clock },
                  { value: 'rating', label: 'Rating', icon: Star }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold transition ${
                      sortBy === option.value
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <option.icon className="w-4 h-4" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bus Cards */}
            {filteredBuses.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">No buses found matching your filters</p>
                <button
                  onClick={() => setFilters({
                    busType: [],
                    departureTime: [],
                    priceRange: [0, 5000],
                    rating: 0,
                    amenities: []
                  })}
                  className="mt-4 text-red-600 font-semibold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredBuses.map(bus => (
                <BusCard key={bus.id} bus={bus} onBooking={handleBooking} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedBusBusSearch;
