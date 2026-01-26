import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Star, Loader2 } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import { cities } from '../data/mockData';
import { hotelService } from '../services/hotelService';
import toast from 'react-hot-toast';

const HotelSearchPage = () => {
  const [searchParams, setSearchParams] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1
  });
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    if (!searchParams.destination || !searchParams.checkIn || !searchParams.checkOut) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const results = await hotelService.searchHotels(searchParams);
      setHotels(results);
      setSearched(true);
      toast.success(`Found ${results.length} hotels`);
    } catch (error) {
      toast.error('Failed to search hotels');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHotelSelect = (hotel) => {
    navigate(`/hotels/${hotel.id}`, { 
      state: { 
        hotel, 
        searchParams,
        checkIn: searchParams.checkIn,
        checkOut: searchParams.checkOut,
        guests: searchParams.guests,
        rooms: searchParams.rooms
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Search Hotels</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Destination
              </label>
              <select
                value={searchParams.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select destination</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Check-in
              </label>
              <input
                type="date"
                value={searchParams.checkIn}
                onChange={(e) => handleInputChange('checkIn', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Check-out
              </label>
              <input
                type="date"
                value={searchParams.checkOut}
                onChange={(e) => handleInputChange('checkOut', e.target.value)}
                min={searchParams.checkIn || new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline w-4 h-4 mr-1" />
                  Guests
                </label>
                <select
                  value={searchParams.guests}
                  onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rooms</label>
                <select
                  value={searchParams.rooms}
                  onChange={(e) => handleInputChange('rooms', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1,2,3,4].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Searching...' : 'Search Hotels'}
          </button>
        </div>

        {searched && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {hotels.length > 0 ? `Found ${hotels.length} hotels` : 'No hotels found'}
            </h2>
            
            {hotels.map(hotel => (
              <div key={hotel.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 mb-4 md:mb-0">
                    <img
                      src={hotel.image || '/api/placeholder/300/200'}
                      alt={hotel.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="md:w-2/4 md:px-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{hotel.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < hotel.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">({hotel.rating}/5)</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      {hotel.location}
                    </p>
                    <p className="text-gray-600 text-sm">{hotel.description}</p>
                    
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities?.slice(0, 4).map((amenity, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities?.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{hotel.amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/4 text-right">
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-green-600">₹{hotel.pricePerNight?.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">per night</div>
                      <div className="text-xs text-gray-500">+ taxes & fees</div>
                    </div>
                    
                    <button
                      onClick={() => handleHotelSelect(hotel)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelSearchPage;
