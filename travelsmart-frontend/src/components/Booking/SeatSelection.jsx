import React, { useState, useEffect } from 'react';
import { User, Armchair, X, Clock, Lock } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { seatLockService } from '../../services/seatLockService';
import toast from 'react-hot-toast';

const SeatSelection = ({ type = 'bus', inventoryId, onSeatsSelected, maxSeats = 6 }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeatsFromDB, setBookedSeatsFromDB] = useState([]);
  const [lockedSeats, setLockedSeats] = useState([]);
  const [bookedSeatsFromLocks, setBookedSeatsFromLocks] = useState([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [isLockActive, setIsLockActive] = useState(false);

  // Debug log
  console.log('SeatSelection props:', { type, inventoryId, maxSeats });

  // Fetch booked and locked seats from backend
  useEffect(() => {
    const fetchSeats = async () => {
      if (!inventoryId) {
        setIsLoadingSeats(false);
        return;
      }

            try {
        // Fetch booked seats from bookings table (may fail if not authenticated)
        try {
          const bookedSeats = await bookingService.getBookedSeats(type.toUpperCase(), inventoryId);
          console.log('Booked seats from DB:', bookedSeats);
          setBookedSeatsFromDB(bookedSeats || []);
        } catch (dbError) {
          console.warn('Could not fetch booked seats from DB (may not be authenticated):', dbError);
          setBookedSeatsFromDB([]);
        }

        // Fetch locked seats and booked seats from seat lock service
        const seatLockData = await seatLockService.getLockedSeats(type, inventoryId);
        console.log(' Seat lock data:', seatLockData);
                console.log(' Booked seats from locks:', seatLockData.bookedSeats);
        setLockedSeats(seatLockData.lockedSeats || []);
        setBookedSeatsFromLocks(seatLockData.bookedSeats || []);
              } catch (error) {
        console.error('Failed to fetch seats:', error);
        toast.error('Failed to load seat availability');
      } finally {
        setIsLoadingSeats(false);
      }
    };

    fetchSeats();
    
    // Refresh locked seats every 5 seconds
    const interval = setInterval(async () => {
      if (inventoryId) {
        const seatLockData = await seatLockService.getLockedSeats(type, inventoryId);
        console.log(' Seat lock data:', seatLockData);
                console.log(' Booked seats from locks:', seatLockData.bookedSeats);
        setLockedSeats(seatLockData.lockedSeats || []);
        setBookedSeatsFromLocks(seatLockData.bookedSeats || []);
              }
    }, 5000);

    return () => clearInterval(interval);
  }, [type, inventoryId]);

    useEffect(() => {
    console.log(' State updated:', { bookedSeatsFromDB, bookedSeatsFromLocks, lockedSeats });
  }, [bookedSeatsFromDB, bookedSeatsFromLocks, lockedSeats]);

  // Countdown timer for seat locks
  useEffect(() => {
    if (!isLockActive || selectedSeats.length === 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time expired - release locks
          handleLockExpiry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLockActive, selectedSeats]);

  // Handle lock expiry
  const handleLockExpiry = async () => {
    setIsLockActive(false);
    setSelectedSeats([]);
    toast.error('? Seat selection expired! Please select again.');
    
    try {
      await seatLockService.releaseUserLocks();
    } catch (error) {
      console.error('Error releasing locks:', error);
    }
  };

  // Helper functions
  const isSeatBookedInDB = (seatId) => {
    const isBooked = bookedSeatsFromDB.includes(seatId) || bookedSeatsFromLocks.includes(seatId);
    return isBooked;
    };

  const isSeatLocked = (seatId) => {
    return lockedSeats.includes(seatId);
  };

  const isSeatUnavailable = (seatId) => {
    return isSeatBookedInDB(seatId) || isSeatLocked(seatId);
  };

  // Bus seat layout (base layout without booked status)
  const busSeatsBase = {
    lower: [
      [{ id: 'L1', price: 1530 }, null, { id: 'L2', price: 1530 }, { id: 'L3', price: 1530 }],
      [{ id: 'L4', price: 1530 }, null, { id: 'L5', price: 1530 }, { id: 'L6', price: 1530 }],
      [{ id: 'L7', price: 1530 }, null, { id: 'L8', price: 1530 }, { id: 'L9', price: 1530 }],
      [{ id: 'L10', price: 1530 }, null, { id: 'L11', price: 1530 }, { id: 'L12', price: 1530 }],
      [{ id: 'L13', price: 1530 }, null, { id: 'L14', price: 1415 }, { id: 'L15', price: 1415 }],
    ],
    upper: [
      [null, { id: 'U1', price: 1530 }, null, { id: 'U2', price: 1530 }, { id: 'U3', price: 1530 }],
      [null, { id: 'U4', price: 1530 }, null, { id: 'U5', price: 1530 }, { id: 'U6', price: 1530 }],
      [null, { id: 'U7', price: 1530 }, null, { id: 'U8', price: 1530 }, { id: 'U9', price: 1530 }],
      [null, { id: 'U10', price: 1530 }, null, { id: 'U11', price: 1530 }, { id: 'U12', price: 1530 }],
      [null, { id: 'U13', price: 1530 }, null, { id: 'U14', price: 1415 }, { id: 'U15', price: 1415 }],
    ],
  };

  // Apply booked and locked status from database
  const busSeats = {
    lower: busSeatsBase.lower.map(row => 
      row.map(seat => seat ? { 
        ...seat, 
        booked: isSeatBookedInDB(seat.id),
        locked: isSeatLocked(seat.id)
      } : null)
    ),
    upper: busSeatsBase.upper.map(row => 
      row.map(seat => seat ? { 
        ...seat, 
        booked: isSeatBookedInDB(seat.id),
        locked: isSeatLocked(seat.id)
      } : null)
    ),
  };

  // Flight seat layout (Economy class - base layout)
  const flightSeatsBase = [
    [{ id: '1A', price: 2500 }, { id: '1B', price: 2500 }, null, { id: '1C', price: 2500 }, { id: '1D', price: 2500 }, { id: '1E', price: 2500 }, { id: '1F', price: 2500 }],
    [{ id: '2A', price: 2200 }, { id: '2B', price: 2200 }, null, { id: '2C', price: 2200 }, { id: '2D', price: 2200 }, { id: '2E', price: 2200 }, { id: '2F', price: 2200 }],
    [{ id: '3A', price: 2200 }, { id: '3B', price: 2200 }, null, { id: '3C', price: 2200 }, { id: '3D', price: 2200 }, { id: '3E', price: 2200 }, { id: '3F', price: 2200 }],
    [{ id: '4A', price: 2000 }, { id: '4B', price: 2000 }, null, { id: '4C', price: 2000 }, { id: '4D', price: 2000 }, { id: '4E', price: 2000 }, { id: '4F', price: 2000 }],
    [{ id: '5A', price: 2000 }, { id: '5B', price: 2000 }, null, { id: '5C', price: 2000 }, { id: '5D', price: 2000 }, { id: '5E', price: 2000 }, { id: '5F', price: 2000 }],
    [{ id: '6A', price: 1800 }, { id: '6B', price: 1800 }, null, { id: '6C', price: 1800 }, { id: '6D', price: 1800 }, { id: '6E', price: 1800 }, { id: '6F', price: 1800 }],
    [{ id: '7A', price: 1800 }, { id: '7B', price: 1800 }, null, { id: '7C', price: 1800 }, { id: '7D', price: 1800 }, { id: '7E', price: 1800 }, { id: '7F', price: 1800 }],
    [{ id: '8A', price: 1800 }, { id: '8B', price: 1800 }, null, { id: '8C', price: 1800 }, { id: '8D', price: 1800 }, { id: '8E', price: 1800 }, { id: '8F', price: 1800 }],
  ];

  // Apply booked and locked status from database
  const flightSeats = flightSeatsBase.map(row =>
    row.map(seat => seat ? { 
      ...seat, 
      booked: isSeatBookedInDB(seat.id),
      locked: isSeatLocked(seat.id)
    } : null)
  );

  // Train seat layout (AC 3-Tier example - base layout)
  const trainSeatsBase = {
    coach: 'S1',
    compartments: [
      {
        name: 'Compartment 1',
        seats: [
          [{ id: '1L', type: 'Lower', price: 850 }, { id: '2L', type: 'Lower', price: 850 }],
          [{ id: '1M', type: 'Middle', price: 800 }, { id: '2M', type: 'Middle', price: 800 }],
          [{ id: '1U', type: 'Upper', price: 750 }, { id: '2U', type: 'Upper', price: 750 }],
          [{ id: '1SL', type: 'Side Lower', price: 850 }, { id: '2SL', type: 'Side Lower', price: 850 }],
          [{ id: '1SU', type: 'Side Upper', price: 750 }, { id: '2SU', type: 'Side Upper', price: 750 }],
        ]
      },
      {
        name: 'Compartment 2',
        seats: [
          [{ id: '3L', type: 'Lower', price: 850 }, { id: '4L', type: 'Lower', price: 850 }],
          [{ id: '3M', type: 'Middle', price: 800 }, { id: '4M', type: 'Middle', price: 800 }],
          [{ id: '3U', type: 'Upper', price: 750 }, { id: '4U', type: 'Upper', price: 750 }],
          [{ id: '3SL', type: 'Side Lower', price: 850 }, { id: '4SL', type: 'Side Lower', price: 850 }],
          [{ id: '3SU', type: 'Side Upper', price: 750 }, { id: '4SU', type: 'Side Upper', price: 750 }],
        ]
      },
    ]
  };

  // Apply booked and locked status from database
  const trainSeats = {
    ...trainSeatsBase,
    compartments: trainSeatsBase.compartments.map(comp => ({
      ...comp,
      seats: comp.seats.map(row =>
        row.map(seat => ({ 
          ...seat, 
          booked: isSeatBookedInDB(seat.id),
          locked: isSeatLocked(seat.id)
        }))
      )
    }))
  };

  const handleSeatClick = async (seat) => {
    if (seat.booked || seat.locked) {
      if (seat.locked) {
        toast.error('This seat is temporarily locked by another user');
      }
      return;
    }

    const isSelected = selectedSeats.find(s => s.id === seat.id);

    if (isSelected) {
      // Deselect seat - unlock it
      try {
        await seatLockService.unlockSeat(seat.id, type, inventoryId);
        setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
        setLockedSeats(lockedSeats.filter(id => id !== seat.id)); // Remove from locked seats immediately
        
        if (selectedSeats.length === 1) {
          setIsLockActive(false);
          setTimeRemaining(600);
        }
      } catch (error) {
        console.error('Error unlocking seat:', error);
      }
    } else {
      // Select seat - lock it
      if (selectedSeats.length >= maxSeats) {
        toast.error(`You can select maximum ${maxSeats} seats`);
        return;
      }

      try {
        const result = await seatLockService.lockSeat(seat.id, type, inventoryId, seat.price);
        
        if (result.success) {
          setSelectedSeats([...selectedSeats, seat]);
          setLockedSeats([...lockedSeats, seat.id]); // Add to locked seats immediately
          setIsLockActive(true);
          setTimeRemaining(result.expiresIn);
          toast.success(`Seat ${seat.id} locked for 10 minutes`);
        }
      } catch (error) {
        console.error('Error locking seat:', error);
        toast.error(error.message || 'Failed to lock seat');
      }
    }
  };

  const getSeatClass = (seat) => {
    if (!seat) return '';
    if (seat.booked) return 'bg-gray-400 cursor-not-allowed opacity-90 border-gray-600';
    if (seat.locked) return 'bg-orange-400 cursor-not-allowed opacity-80 border-orange-600';
    if (selectedSeats.find(s => s.id === seat.id)) return 'bg-green-500 text-white border-green-600 animate-pulse';
    return 'bg-white border-2 border-green-400 hover:border-green-600 hover:bg-green-50 cursor-pointer';
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const renderBusSeat = (seat, index) => {
    if (!seat) return <div key={index} className="w-16"></div>;

    return (
      <div key={seat.id} className="flex flex-col items-center">
        <button
          onClick={() => handleSeatClick(seat)}
          disabled={seat.booked || seat.locked}
          className={`w-14 h-20 border-2 rounded-lg flex flex-col items-center justify-center transition-all ${getSeatClass(seat)}`}
          title={seat.booked ? ' BOOKED - Not Available' : seat.locked ? ' Locked by another user' : 'Available'}
        >
          {seat.booked ? (
            <>
              <X className="w-6 h-6 text-white font-bold" />
              <span className="text-[8px] text-white font-bold mt-1">BOOKED</span>
            </>
          ) : seat.locked ? (
            <>
              <Lock className="w-5 h-5 text-white" />
              <span className="text-[8px] text-white font-bold mt-1">LOCKED</span>
            </>
          ) : selectedSeats.find(s => s.id === seat.id) ? (
            <User className="w-5 h-5" />
          ) : (
            <Armchair className="w-5 h-5 text-gray-400" />
          )}
          <div className="w-8 h-1 bg-gray-300 rounded mt-2"></div>
        </button>
        <span className={`text-xs mt-1 font-semibold ${seat.booked ? 'text-red-600 line-through' : seat.locked ? 'text-orange-600' : 'text-gray-700'}`}>
          {seat.booked ? '?' : `?${seat.price}`}
        </span>
      </div>
    );
  };

  const renderFlightSeat = (seat, index) => {
    if (!seat) return <div key={index} className="w-12"></div>;

    return (
      <button
        key={seat.id}
        onClick={() => handleSeatClick(seat)}
        disabled={seat.booked || seat.locked}
        className={`w-10 h-10 border-2 rounded-md flex items-center justify-center text-xs font-bold transition-all relative ${getSeatClass(seat)}`}
        title={seat.booked ? ' BOOKED - Not Available' : seat.locked ? ' Locked by another user' : 'Available'}
      >
        {seat.booked ? (
          <X className="w-5 h-5 text-white font-bold" />
        ) : seat.locked ? (
          <Lock className="w-4 h-4 text-white" />
        ) : (
          <span className="text-gray-700">{seat.id}</span>
        )}
      </button>
    );
  };

  const renderTrainSeat = (seat) => {
    const getBerthColor = (type) => {
      if (type.includes('Lower')) return 'bg-blue-50 border-blue-300';
      if (type.includes('Middle')) return 'bg-green-50 border-green-300';
      if (type.includes('Upper')) return 'bg-purple-50 border-purple-300';
      if (type.includes('Side')) return 'bg-orange-50 border-orange-300';
      return 'bg-gray-50 border-gray-300';
    };

    return (
      <button
        onClick={() => handleSeatClick(seat)}
        disabled={seat.booked || seat.locked}
        title={seat.booked ? ' BOOKED - Not Available' : seat.locked ? ' Locked by another user' : 'Available'}
        className={`w-full p-3 border-2 rounded-lg transition-all ${
          seat.booked ? 'bg-gray-400 cursor-not-allowed opacity-90 border-gray-600' 
            : seat.locked
            ? 'bg-orange-400 cursor-not-allowed opacity-80 border-orange-600'
            : selectedSeats.find(s => s.id === seat.id)
            ? 'bg-green-500 text-white border-green-600 animate-pulse'
            : `${getBerthColor(seat.type)} hover:border-cyan-500 cursor-pointer`
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="text-left">
            <div className="font-bold text-sm flex items-center gap-1">
              {seat.booked ? (
                <>
                  <X className="w-4 h-4 text-white" />
                  <span className="text-white">{seat.id}</span>
                </>
              ) : seat.locked ? (
                <>
                  <Lock className="w-3 h-3 text-white" />
                  <span className="text-white">{seat.id}</span>
                </>
              ) : (
                seat.id
              )}
            </div>
            <div className={`text-xs ${seat.booked || seat.locked ? 'text-white font-bold' : 'opacity-75'}`}>
              {seat.booked ? ' BOOKED' : seat.locked ? ' LOCKED' : seat.type}
            </div>
          </div>
          <div className="text-right">
            <div className={`font-bold text-sm ${seat.booked ? 'text-white line-through' : seat.locked ? 'text-white' : ''}`}>
              {seat.booked ? '?' : `?${seat.price}`}
            </div>
          </div>
        </div>
      </button>
    );
  };

  // Show loading state while fetching booked seats
  if (isLoadingSeats) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
          <span className="ml-3 text-gray-600">Loading seat availability...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header with Timer */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Select Seats</h2>
        
        {isLockActive && selectedSeats.length > 0 && (
          <div className="flex items-center gap-3 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-lg border-2 border-orange-300">
            <Clock className="w-5 h-5 text-orange-600 animate-pulse" />
            <div>
              <div className="text-xs text-gray-600">Time Remaining</div>
              <div className={`text-xl font-bold ${timeRemaining < 60 ? 'text-red-600' : 'text-orange-600'}`}>
                {seatLockService.formatTimeRemaining(timeRemaining)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-cyan-200">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white border-2 border-green-400 rounded shadow-sm"></div>          <span className="font-semibold text-gray-700">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-green-500 rounded shadow-sm animate-pulse"></div>
          <span className="font-semibold text-gray-700">Your Selection</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-orange-400 border-2 border-orange-600 rounded shadow-sm"></div>
          <span className="font-semibold text-gray-700">Locked by Others</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-400 border-2 border-gray-600 rounded shadow-sm"></div>
          <span className="font-semibold text-gray-700 font-bold"> BOOKED</span>
        </div>
      </div>

      {type === 'bus' && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Lower Berth */}
          <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center mr-2 text-cyan-600 text-sm">
                L
              </span>
              LOWER BERTH ({busSeats.lower.flat().filter(s => s).length})
            </h3>
            <div className="space-y-3">
              {/* Driver indicator */}
              <div className="flex justify-end mb-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path strokeWidth="2" d="M12 8v8m-4-4h8"/>
                  </svg>
                </div>
              </div>
              {busSeats.lower.map((row, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  {row.map((seat, seatIdx) => renderBusSeat(seat, seatIdx))}
                </div>
              ))}
            </div>
          </div>

          {/* Upper Berth */}
          <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2 text-purple-600 text-sm">
                U
              </span>
              UPPER BERTH ({busSeats.upper.flat().filter(s => s).length})
            </h3>
            <div className="space-y-3 mt-12">
              {busSeats.upper.map((row, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  {row.map((seat, seatIdx) => renderBusSeat(seat, seatIdx))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {type === 'flight' && (
        <div className="max-w-2xl mx-auto">
          <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
            <div className="mb-4 text-center">
              <div className="inline-block bg-cyan-100 px-4 py-2 rounded-lg">
                <span className="font-bold text-cyan-700"> Economy Class</span>
              </div>
            </div>
            <div className="flex justify-center mb-4 text-xs font-semibold text-gray-600 space-x-8">
              <span>A</span>
              <span>B</span>
              <span className="ml-4">C</span>
              <span>D</span>
              <span>E</span>
              <span>F</span>
            </div>
            <div className="space-y-2">
              {flightSeats.map((row, idx) => (
                <div key={idx} className="flex justify-center items-center space-x-2">
                  <span className="text-xs font-semibold text-gray-500 w-6">{idx + 1}</span>
                  {row.map((seat, seatIdx) => renderFlightSeat(seat, seatIdx))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {type === 'train' && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 text-center">
            <div className="inline-block bg-orange-100 px-4 py-2 rounded-lg">
              <span className="font-bold text-orange-700"> Coach {trainSeats.coach} - AC 3-Tier</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {trainSeats.compartments.map((compartment, idx) => (
              <div key={idx} className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                <h3 className="font-bold text-gray-800 mb-3 text-center">{compartment.name}</h3>
                <div className="space-y-2">
                  {compartment.seats.map((row, rowIdx) => (
                    <div key={rowIdx} className="grid grid-cols-2 gap-2">
                      {row.map((seat) => (
                        <div key={seat.id}>
                          {renderTrainSeat(seat)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-50 border-2 border-blue-300 rounded"></div>
              <span>Lower Berth</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-50 border-2 border-green-300 rounded"></div>
              <span>Middle Berth</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-50 border-2 border-purple-300 rounded"></div>
              <span>Upper Berth</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-50 border-2 border-orange-300 rounded"></div>
              <span>Side Berth</span>
            </div>
          </div>
        </div>
      )}

      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-6 p-4 bg-cyan-50 rounded-lg border-2 border-cyan-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">Selected Seats ({selectedSeats.length})</h3>
            <button
              onClick={() => setSelectedSeats([])}
              className="text-sm text-red-600 hover:text-red-700 font-semibold"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedSeats.map(seat => (
              <div key={seat.id} className="flex items-center space-x-2 bg-white px-3 py-1 rounded-lg border border-cyan-300">
                <span className="font-semibold text-gray-900">{seat.id}</span>
                <span className="text-sm text-gray-600">?{seat.price}</span>
                <button
                  onClick={() => handleSeatClick(seat)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-cyan-200">
            <span className="text-lg font-bold text-gray-900">Total Amount:</span>
            <span className="text-2xl font-black text-cyan-600">?{totalPrice}</span>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={() => onSeatsSelected && onSeatsSelected(selectedSeats)}
        disabled={selectedSeats.length === 0}
        className="w-full mt-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue with {selectedSeats.length} Seat{selectedSeats.length !== 1 ? 's' : ''} (?{totalPrice})
      </button>
    </div>
  );
};

export default SeatSelection;















