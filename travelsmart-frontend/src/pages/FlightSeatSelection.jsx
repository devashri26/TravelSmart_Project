import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Clock, Plane, User, Lock, AlertCircle } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import { seatLockService } from '../services/seatLockService';
import { bookingService } from '../services/bookingService';
import toast from 'react-hot-toast';

const FlightSeatSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flight } = location.state || {};

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [lockedSeats, setLockedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(600);

  useEffect(() => {
    if (!flight) {
      toast.error('No flight selected');
      navigate('/flights');
      return;
    }
    fetchSeatStatus();
  }, [flight]);

  useEffect(() => {
    if (selectedSeats.length > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedSeats]);

  const fetchSeatStatus = async () => {
    try {
      const seatData = await seatLockService.getLockedSeats('FLIGHT', flight.id);
      setBookedSeats(seatData.bookedSeats || []);
      setLockedSeats(seatData.lockedSeats || []);
      
      const bookedFromDB = await bookingService.getBookedSeats('FLIGHT', flight.id);
      setBookedSeats(prev => [...new Set([...prev, ...bookedFromDB])]);
    } catch (error) {
      console.error('Error fetching seat status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeout = async () => {
    toast.error('Time expired! Releasing your seats...');
    try {
      await seatLockService.releaseUserLocks();
      setSelectedSeats([]);
      setTimeRemaining(600);
      fetchSeatStatus();
    } catch (error) {
      console.error('Error releasing locks:', error);
    }
  };

  const handleSeatClick = async (seatId, price) => {
    if (bookedSeats.includes(seatId)) {
      toast.error('This seat is already booked');
      return;
    }
    if (lockedSeats.includes(seatId) && !selectedSeats.find(s => s.id === seatId)) {
      toast.error('This seat is locked by another user');
      return;
    }

    const isSelected = selectedSeats.find(s => s.id === seatId);

    if (isSelected) {
      try {
        await seatLockService.unlockSeat(seatId, 'FLIGHT', flight.id);
        setSelectedSeats(selectedSeats.filter(s => s.id !== seatId));
        setLockedSeats(lockedSeats.filter(id => id !== seatId));
        if (selectedSeats.length === 1) {
          setTimeRemaining(600);
        }
      } catch (error) {
        console.error('Error unlocking seat:', error);
      }
    } else {
      if (selectedSeats.length >= 6) {
        toast.error('Maximum 6 seats can be selected');
        return;
      }

      try {
        const result = await seatLockService.lockSeat(seatId, 'FLIGHT', flight.id, price);
        if (result.success) {
          setSelectedSeats([...selectedSeats, { id: seatId, price }]);
          setLockedSeats([...lockedSeats, seatId]);
          setTimeRemaining(result.expiresIn || 600);
          toast.success(Seat +seatId+ locked for 10 minutes);
        }
      } catch (error) {
        toast.error(error.message || 'Failed to lock seat');
      }
    }
  };

  const getSeatClass = (seatId) => {
    if (bookedSeats.includes(seatId)) {
      return 'bg-gray-400 cursor-not-allowed';
    }
    if (lockedSeats.includes(seatId) && !selectedSeats.find(s => s.id === seatId)) {
      return 'bg-orange-300 cursor-not-allowed';
    }
    if (selectedSeats.find(s => s.id === seatId)) {
      return 'bg-green-500 text-white animate-pulse';
    }
    return 'bg-white hover:bg-blue-50 cursor-pointer border-2 border-gray-300';
  };

  const getSeatIcon = (seatId) => {
    if (bookedSeats.includes(seatId)) {
      return React.createElement(X, { className: 'w-5 h-5 text-white' });
    }
    if (lockedSeats.includes(seatId) && !selectedSeats.find(s => s.id === seatId)) {
      return React.createElement(Lock, { className: 'w-4 h-4 text-white' });
    }
    if (selectedSeats.find(s => s.id === seatId)) {
      return React.createElement(User, { className: 'w-5 h-5' });
    }
    return React.createElement('span', { className: 'text-sm font-semibold' }, seatId);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins+':'+(secs < 10 ? '0' : '')+secs;
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    navigate('/payment', {
      state: {
        bookingType: 'FLIGHT',
        inventoryId: flight.id,
        selectedSeats,
        totalAmount: selectedSeats.reduce((sum, seat) => sum + seat.price, 0),
        flight
      }
    });
  };

  const rows = 15;
  const seats = [];
  for (let row = 1; row <= rows; row++) {
    const rowSeats = ['A', 'B', 'C', 'D', 'E', 'F'].map(col => ({
      id: row+col,
      price: row <= 3 ? 2500 : row <= 6 ? 2200 : row <= 10 ? 2000 : 1800
    }));
    seats.push(rowSeats);
  }


  if (loading) { return (<div className='min-h-screen bg-gray-50'><Navbar /><div className='flex items-center justify-center h-96'><div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div></div></div>); }

  return (<div className='min-h-screen bg-gray-50'><Navbar /><div className='max-w-7xl mx-auto px-4 py-8'><div className='bg-white rounded-lg shadow-md p-6 mb-6'><div className='flex items-center justify-between'><div><h1 className='text-2xl font-bold text-gray-900 mb-2'>Select Your Seats</h1></div></div></div></div></div>);
};

export default FlightSeatSelection;
