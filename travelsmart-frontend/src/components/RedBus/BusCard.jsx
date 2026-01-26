import React, { useState } from 'react';
import { Star, Wifi, Plug, Droplet, Snowflake, MapPin, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react';
import SeatSelection from '../Booking/SeatSelection';

const BusCard = ({ bus, onBooking }) => {
  const [showSeats, setShowSeats] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const amenities = [
    { icon: Snowflake, label: 'AC', available: bus.ac },
    { icon: Wifi, label: 'WiFi', available: bus.wifi },
    { icon: Plug, label: 'Charging', available: bus.charging },
    { icon: Droplet, label: 'Water', available: bus.water },
  ];

  const handleSeatsSelected = (seats) => {
    setSelectedSeats(seats);
  };

  const handleProceedToBook = () => {
    onBooking({
      bus,
      selectedSeats,
      totalAmount: selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all mb-4">
      {/* Bus Info Card */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          {/* Left: Operator & Type */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{bus.operator}</h3>
              <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded">
                <Star className="w-4 h-4 text-green-600 fill-green-600" />
                <span className="text-sm font-semibold text-green-700">{bus.rating || '4.2'}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{bus.busType || 'AC Sleeper (2+1)'}</p>
            
            {/* Amenities */}
            <div className="flex gap-3">
              {amenities.map((amenity, idx) => (
                amenity.available && (
                  <div key={idx} className="flex items-center gap-1 text-gray-600">
                    <amenity.icon className="w-4 h-4" />
                    <span className="text-xs">{amenity.label}</span>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Center: Timing */}
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">{bus.departureTime}</p>
                <p className="text-sm text-gray-600">{bus.origin}</p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="w-5 h-5 text-gray-400 mb-1" />
                <p className="text-xs text-gray-500">{bus.duration || '6h 30m'}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{bus.arrivalTime}</p>
                <p className="text-sm text-gray-600">{bus.destination}</p>
              </div>
            </div>
          </div>

          {/* Right: Price & Action */}
          <div className="flex-1 text-right">
            <p className="text-sm text-gray-500 line-through">₹{(bus.price * 1.2).toFixed(0)}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">₹{bus.price}</p>
            <p className="text-xs text-gray-600 mb-3">
              <Users className="w-3 h-3 inline mr-1" />
              {bus.availableSeats} seats left
            </p>
            <button
              onClick={() => setShowSeats(!showSeats)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
            >
              {showSeats ? 'Hide Seats' : 'View Seats'}
              {showSeats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Boarding & Dropping Points */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex gap-6 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-green-600" />
            <span>Boarding: {bus.boardingPoint || 'Multiple points'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-red-600" />
            <span>Dropping: {bus.droppingPoint || 'Multiple points'}</span>
          </div>
        </div>
      </div>

      {/* Seat Selection (Expandable) */}
      {showSeats && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <SeatSelection
            type="bus"
            inventoryId={bus.id}
            onSeatsSelected={handleSeatsSelected}
            maxSeats={6}
          />
          
          {selectedSeats.length > 0 && (
            <button
              onClick={handleProceedToBook}
              className="w-full mt-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-4 rounded-xl hover:shadow-lg transition"
            >
              Proceed to Book ({selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''})
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BusCard;
