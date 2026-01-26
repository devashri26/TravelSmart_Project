import React, { useState } from 'react';
import SeatSelection from '../components/Booking/SeatSelection';
import { Bus, Plane, Train } from 'lucide-react';

const SeatSelectionDemo = () => {
  const [selectedType, setSelectedType] = useState('bus');
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatsSelected = (seats) => {
    setSelectedSeats(seats);
    console.log('Selected seats:', seats);
    alert(`Booking ${seats.length} seat(s) for ₹${seats.reduce((sum, s) => sum + s.price, 0)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Seat Selection Demo
          </h1>
          <p className="text-gray-600">
            Choose your preferred transport type to see the seat layout
          </p>
        </div>

        {/* Transport Type Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedType('bus')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all ${
              selectedType === 'bus'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <Bus className="w-5 h-5" />
            <span>Bus</span>
          </button>

          <button
            onClick={() => setSelectedType('flight')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all ${
              selectedType === 'flight'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <Plane className="w-5 h-5" />
            <span>Flight</span>
          </button>

          <button
            onClick={() => setSelectedType('train')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all ${
              selectedType === 'train'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <Train className="w-5 h-5" />
            <span>Train</span>
          </button>
        </div>

        {/* Seat Selection Component */}
        <SeatSelection
          type={selectedType}
          onSeatsSelected={handleSeatsSelected}
          maxSeats={6}
        />

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-cyan-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                <Bus className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="font-bold text-gray-900">Bus Layout</h3>
            </div>
            <p className="text-sm text-gray-600">
              Lower and upper berth configuration with driver position indicator. Perfect for overnight journeys.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Plane className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900">Flight Layout</h3>
            </div>
            <p className="text-sm text-gray-600">
              Economy class seating with aisle separation (A-F configuration). Choose window, middle, or aisle seats.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Train className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900">Train Layout</h3>
            </div>
            <p className="text-sm text-gray-600">
              AC 3-Tier compartments with lower, middle, upper, and side berths. Color-coded for easy identification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionDemo;
