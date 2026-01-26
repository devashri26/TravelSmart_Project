import React, { useState } from 'react';
import { Plane, Search, Loader2 } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import { liveFlightService } from '../services/liveFlightService';
import toast from 'react-hot-toast';

const TestLiveFlights = () => {
  const [from, setFrom] = useState('DEL');
  const [to, setTo] = useState('BOM');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchFlights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Searching flights: ${from} → ${to}`);
      const result = await liveFlightService.searchLiveFlights(from, to);
      
      console.log('API Response:', result);
      
      if (result.success) {
        setFlights(result.flights || []);
        toast.success(`Found ${result.count} flights!`);
      } else {
        setError(result.message || 'No flights found');
        toast.error('No flights found');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      toast.error('Failed to fetch flights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Plane className="w-8 h-8 text-cyan-600" />
            Test Live Flight API
          </h1>

          {/* Search Form */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                From (IATA Code)
              </label>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value.toUpperCase())}
                placeholder="DEL"
                maxLength={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                To (IATA Code)
              </label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value.toUpperCase())}
                placeholder="BOM"
                maxLength={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={searchFlights}
                disabled={loading || !from || !to}
                className="w-full bg-cyan-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Popular Routes */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Popular routes:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { from: 'DEL', to: 'BOM', label: 'Delhi → Mumbai' },
                { from: 'DEL', to: 'BLR', label: 'Delhi → Bangalore' },
                { from: 'BOM', to: 'BLR', label: 'Mumbai → Bangalore' },
                { from: 'JFK', to: 'LAX', label: 'New York → LA' }
              ].map(route => (
                <button
                  key={route.label}
                  onClick={() => {
                    setFrom(route.from);
                    setTo(route.to);
                  }}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
                >
                  {route.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-semibold">Error:</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Results */}
          {flights.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Found {flights.length} Flights
              </h2>
              
              <div className="space-y-4">
                {flights.map((flight, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-cyan-500 transition">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {flight.airlineName || 'Unknown Airline'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Flight: {flight.flightNumber || 'N/A'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        flight.flightStatus === 'scheduled' ? 'bg-green-100 text-green-700' :
                        flight.flightStatus === 'active' ? 'bg-blue-100 text-blue-700' :
                        flight.flightStatus === 'landed' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {flight.flightStatus || 'Unknown'}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Departure</p>
                        <p className="font-semibold">{flight.departureAirport || 'N/A'}</p>
                        <p className="text-sm text-gray-600">{flight.departureIata || 'N/A'}</p>
                        <p className="text-sm text-cyan-600 font-semibold">
                          {flight.departureTime ? new Date(flight.departureTime).toLocaleString() : 'N/A'}
                        </p>
                        {flight.departureTerminal && (
                          <p className="text-xs text-gray-500">Terminal: {flight.departureTerminal}</p>
                        )}
                        {flight.departureGate && (
                          <p className="text-xs text-gray-500">Gate: {flight.departureGate}</p>
                        )}
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Arrival</p>
                        <p className="font-semibold">{flight.arrivalAirport || 'N/A'}</p>
                        <p className="text-sm text-gray-600">{flight.arrivalIata || 'N/A'}</p>
                        <p className="text-sm text-cyan-600 font-semibold">
                          {flight.arrivalTime ? new Date(flight.arrivalTime).toLocaleString() : 'N/A'}
                        </p>
                        {flight.arrivalTerminal && (
                          <p className="text-xs text-gray-500">Terminal: {flight.arrivalTerminal}</p>
                        )}
                        {flight.arrivalGate && (
                          <p className="text-xs text-gray-500">Gate: {flight.arrivalGate}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && flights.length === 0 && !error && (
            <div className="text-center py-12 text-gray-500">
              <Plane className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Search for flights to see live data</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">How to use:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
            <li>Enter IATA airport codes (e.g., DEL for Delhi, BOM for Mumbai)</li>
            <li>Click "Search" to fetch live flight data</li>
            <li>View real-time flight information including status, times, and gates</li>
            <li>Try popular routes or search any valid airport codes</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestLiveFlights;
