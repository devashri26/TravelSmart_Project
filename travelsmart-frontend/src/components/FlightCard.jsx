import React from 'react';
import { Plane, Clock, DollarSign } from 'lucide-react';

const FlightCard = ({ flightData }) => {
  // This component will be fully implemented once we have real flight data structure
  
  if (!flightData) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md border border-gray-100 flex items-center space-x-3 text-sm text-gray-500">
        <Plane className="w-4 h-4" />
        <span>Flight details will be displayed here.</span>
      </div>
    );
  }

  // Example structure for a future implementation:
  const { departure, arrival, duration, price, airline } = flightData;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-indigo-100 hover:shadow-xl transition duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="text-xl font-bold text-indigo-700">{departure.time} - {arrival.time}</div>
        <div className="text-2xl font-extrabold text-green-600 flex items-center">
            <DollarSign className="w-5 h-5 mr-1" />{price}
        </div>
      </div>
      
      <div className="flex justify-between text-sm text-gray-600">
        <p>Airline: {airline}</p>
        <p className="flex items-center">
          <Clock className="w-4 h-4 mr-1 text-indigo-400" />
          {duration}
        </p>
      </div>
      
      {/* Flight Route Diagram (Placeholder) */}
      <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
        {departure.airport} ({departure.code}) to {arrival.airport} ({arrival.code})
      </div>
    </div>
  );
};

export default FlightCard;