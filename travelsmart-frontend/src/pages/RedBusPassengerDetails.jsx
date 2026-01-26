import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Shield, AlertCircle } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import toast from 'react-hot-toast';

const RedBusPassengerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [passengers, setPassengers] = useState(
    bookingData.selectedSeats.map((seat, idx) => ({
      seatNumber: seat.id,
      name: '',
      age: '',
      gender: 'Male'
    }))
  );

  const [contactDetails, setContactDetails] = useState({
    email: '',
    phone: '',
    emergencyContact: ''
  });

  const [boardingPoint, setBoardingPoint] = useState('');
  const [droppingPoint, setDroppingPoint] = useState('');
  const [addInsurance, setAddInsurance] = useState(false);

  const boardingPoints = [
    { id: 1, name: 'Main Bus Stand', time: '10:00 PM', address: 'Near Railway Station' },
    { id: 2, name: 'City Center', time: '10:15 PM', address: 'Opposite Mall' },
    { id: 3, name: 'Airport Road', time: '10:30 PM', address: 'Near Airport' }
  ];

  const droppingPoints = [
    { id: 1, name: 'Central Bus Terminal', time: '6:00 AM', address: 'Main Road' },
    { id: 2, name: 'Railway Station', time: '6:15 AM', address: 'Platform 1' },
    { id: 3, name: 'City Mall', time: '6:30 AM', address: 'Shopping District' }
  ];

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const validateAndProceed = () => {
    // Validate passengers
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name || !passengers[i].age) {
        toast.error(`Please fill details for Seat ${passengers[i].seatNumber}`);
        return;
      }
      if (passengers[i].age < 1 || passengers[i].age > 120) {
        toast.error('Please enter valid age');
        return;
      }
    }

    // Validate contact
    if (!contactDetails.email || !contactDetails.phone) {
      toast.error('Please fill contact details');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactDetails.email)) {
      toast.error('Please enter valid email');
      return;
    }

    if (contactDetails.phone.length !== 10) {
      toast.error('Please enter valid 10-digit phone number');
      return;
    }

    if (!boardingPoint || !droppingPoint) {
      toast.error('Please select boarding and dropping points');
      return;
    }

    // Proceed to payment
    navigate('/payment', {
      state: {
        ...bookingData,
        passengers,
        contactDetails,
        boardingPoint: boardingPoints.find(p => p.id === parseInt(boardingPoint)),
        droppingPoint: droppingPoints.find(p => p.id === parseInt(droppingPoint)),
        insurance: addInsurance ? 49 : 0,
        totalAmount: bookingData.totalAmount + (addInsurance ? 49 : 0)
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Form */}
          <div className="flex-1">
            {/* Passenger Details */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-red-600" />
                Passenger Details
              </h2>

              {passengers.map((passenger, index) => (
                <div key={index} className="mb-6 pb-6 border-b border-gray-200 last:border-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-red-600">{passenger.seatNumber}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Passenger {index + 1} - Seat {passenger.seatNumber}
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={passenger.name}
                      onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Age *"
                      value={passenger.age}
                      onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <select
                      value={passenger.gender}
                      onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Mail className="w-6 h-6 text-red-600" />
                Contact Details
              </h2>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={contactDetails.email}
                    onChange={(e) => setContactDetails({...contactDetails, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={contactDetails.phone}
                    onChange={(e) => setContactDetails({...contactDetails, phone: e.target.value})}
                    maxLength={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Emergency Contact (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="Emergency contact number"
                  value={contactDetails.emergencyContact}
                  onChange={(e) => setContactDetails({...contactDetails, emergencyContact: e.target.value})}
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Your ticket will be sent to this email and mobile number
                </p>
              </div>
            </div>

            {/* Boarding & Dropping Points */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-red-600" />
                Boarding & Dropping Points
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Boarding Point *
                  </label>
                  {boardingPoints.map(point => (
                    <label key={point.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg mb-3 cursor-pointer hover:border-red-500 transition">
                      <input
                        type="radio"
                        name="boarding"
                        value={point.id}
                        checked={boardingPoint === point.id.toString()}
                        onChange={(e) => setBoardingPoint(e.target.value)}
                        className="mt-1 w-4 h-4 text-red-600"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{point.name}</p>
                        <p className="text-sm text-gray-600">{point.address}</p>
                        <p className="text-sm text-red-600 font-semibold mt-1">{point.time}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Dropping Point *
                  </label>
                  {droppingPoints.map(point => (
                    <label key={point.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg mb-3 cursor-pointer hover:border-red-500 transition">
                      <input
                        type="radio"
                        name="dropping"
                        value={point.id}
                        checked={droppingPoint === point.id.toString()}
                        onChange={(e) => setDroppingPoint(e.target.value)}
                        className="mt-1 w-4 h-4 text-red-600"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{point.name}</p>
                        <p className="text-sm text-gray-600">{point.address}</p>
                        <p className="text-sm text-red-600 font-semibold mt-1">{point.time}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Travel Insurance */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addInsurance}
                  onChange={(e) => setAddInsurance(e.target.checked)}
                  className="mt-1 w-5 h-5 text-red-600 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-bold text-gray-900">Add Travel Insurance</h3>
                    <span className="text-lg font-bold text-red-600">₹49</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Secure your journey with comprehensive travel insurance covering accidents, delays, and cancellations
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="w-96 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-1">{bookingData.bus.operator}</p>
                <p className="font-semibold text-gray-900">{bookingData.bus.origin} → {bookingData.bus.destination}</p>
                <p className="text-sm text-gray-600 mt-1">{bookingData.bus.departureTime}</p>
              </div>

              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Selected Seats</p>
                <div className="flex flex-wrap gap-2">
                  {bookingData.selectedSeats.map(seat => (
                    <span key={seat.id} className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-semibold">
                      {seat.id}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Fare ({bookingData.selectedSeats.length} seats)</span>
                  <span className="font-semibold">₹{bookingData.totalAmount}</span>
                </div>
                {addInsurance && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Travel Insurance</span>
                    <span className="font-semibold">₹49</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t-2 border-gray-200 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-red-600">
                    ₹{bookingData.totalAmount + (addInsurance ? 49 : 0)}
                  </span>
                </div>
              </div>

              <button
                onClick={validateAndProceed}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-4 rounded-xl hover:shadow-lg transition"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedBusPassengerDetails;
