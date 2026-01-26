import React, { useState } from 'react';
import { Search, Calendar, MapPin, Users, PlaneTakeoff, PlaneLanding, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../api/travelApi.js';
import FlightCard from './FlightCard.jsx'; 

const Dashboard = ({ authToken, setAuthError }) => {
  const [searchData, setSearchData] = useState({
    origin: 'NYC',
    destination: 'LAX',
    date: '2025-12-10', // Default date for testing
    passengers: 1,
    tripType: 'roundTrip'
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const dummyFlightData = [
    { id: 1, departure: { code: 'NYC', time: '08:00' }, arrival: { code: 'LAX', time: '11:30' }, duration: '5h 30m', price: 289, airline: 'SmartAir' },
    { id: 2, departure: { code: 'NYC', time: '10:15' }, arrival: { code: 'LAX', time: '13:45' }, duration: '5h 30m', price: 315, airline: 'FlyRight' },
    { id: 3, departure: { code: 'NYC', time: '16:45' }, arrival: { code: 'LAX', time: '20:15' }, duration: '5h 30m', price: 275, airline: 'AirSwift' },
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchResults([]);
    setAuthError(null); // Clear previous errors

    // NOTE: Replace this with the actual API endpoint for flight search
    const FLIGHT_SEARCH_ENDPOINT = '/flights/search'; 
    const fullUrl = `${API_BASE_URL.replace('/api/auth', '')}${FLIGHT_SEARCH_ENDPOINT}`;

    console.log('Searching flights:', searchData);
    console.log('Full API URL for search:', fullUrl);

    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // CRITICAL: Include the JWT token in the Authorization header
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(searchData)
      });

      if (response.status === 401) {
        throw new Error("Unauthorized: Please log in again to perform a search.");
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Flight Search API Error (${response.status}): ${errorText.substring(0, 100)}...`;
        
        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch (e) {
            // response was not JSON
        }
        
        throw new Error(errorMessage);
      }
      
      // Assuming the backend returns an array of flight objects
      const data = await response.json();
      
      // Use dummy data if the API returns an empty array for demonstration purposes
      if (data.length === 0) {
        setSearchResults(dummyFlightData);
        console.warn("API returned no results. Using dummy data for display.");
      } else {
        setSearchResults(data);
      }

    } catch (error) {
      console.error("Search error:", error);
      // Pass the error message back to the App component's error modal
      setAuthError(error.message || "Failed to fetch flight results. Check server connectivity.");
      // Fallback to dummy data on failure to show the UI
      setSearchResults(dummyFlightData);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Authenticated Flight Search</h1>
        <p className="text-lg text-gray-600 mb-8">Your secure gateway to finding the best deals.</p>

        {/* Search Form Card */}
        <div className="bg-white p-6 rounded-xl shadow-2xl border border-indigo-200">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Trip Type Selector */}
            <div className="flex space-x-6 border-b pb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  value="roundTrip"
                  checked={searchData.tripType === 'roundTrip'}
                  onChange={handleChange}
                  className="form-radio text-indigo-600 h-5 w-5"
                />
                <span className="text-gray-700 font-semibold">Round Trip</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  value="oneWay"
                  checked={searchData.tripType === 'oneWay'}
                  onChange={handleChange}
                  className="form-radio text-indigo-600 h-5 w-5"
                />
                <span className="text-gray-700 font-semibold">One Way</span>
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Origin */}
              <div className="relative">
                <PlaneTakeoff className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-500" />
                <input
                  type="text"
                  name="origin"
                  value={searchData.origin}
                  onChange={handleChange}
                  placeholder="Origin (e.g., NYC)"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                  disabled={isSearching}
                />
              </div>

              {/* Destination */}
              <div className="relative">
                <PlaneLanding className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-500" />
                <input
                  type="text"
                  name="destination"
                  value={searchData.destination}
                  onChange={handleChange}
                  placeholder="Destination (e.g., LAX)"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                  disabled={isSearching}
                />
              </div>

              {/* Departure Date */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-500" />
                <input
                  type="date"
                  name="date"
                  value={searchData.date}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                  disabled={isSearching}
                />
              </div>
              
              {/* Passengers */}
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-500" />
                <input
                  type="number"
                  name="passengers"
                  value={searchData.passengers}
                  onChange={handleChange}
                  min="1"
                  placeholder="Passengers"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                  disabled={isSearching}
                />
              </div>

            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg shadow-indigo-600/40 hover:bg-indigo-700 transition duration-150 flex items-center justify-center space-x-2 transform hover:scale-[1.005]"
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Find Best Flights</span>
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* Flight Results */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Search Results ({searchResults.length} flights found)</h2>
          
          {isSearching && (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                <p>Loading results from the Spring Boot API...</p>
            </div>
          )}

          {!isSearching && searchResults.length === 0 && (
            <div className="p-12 border border-dashed border-gray-300 rounded-xl text-center text-gray-500 bg-white">
              <PlaneTakeoff className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg">Enter your details above and hit 'Find Best Flights' to see your options.</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {searchResults.map(flight => (
              <FlightCard key={flight.id} flightData={flight} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;