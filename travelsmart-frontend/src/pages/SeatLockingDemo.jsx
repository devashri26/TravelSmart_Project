import { useState, useEffect } from 'react';
import { Lock, Unlock, Clock, Users, CheckCircle } from 'lucide-react';
import SeatSelection from '../components/Booking/SeatSelection';
import Navbar from '../components/Layout/Navbar';
import { seatLockService } from '../services/seatLockService';
import toast from 'react-hot-toast';

const SeatLockingDemo = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userLocks, setUserLocks] = useState([]);
  const [stats, setStats] = useState({
    totalLocked: 0,
    yourLocks: 0,
    timeRemaining: 0
  });

  // Fetch user's active locks
  useEffect(() => {
    const fetchLocks = async () => {
      try {
        const locks = await seatLockService.getUserLocks();
        setUserLocks(locks);
        
        if (locks.length > 0) {
          setStats({
            totalLocked: locks.length,
            yourLocks: locks.length,
            timeRemaining: locks[0].expiresIn
          });
        }
      } catch (error) {
        console.error('Error fetching locks:', error);
      }
    };

    fetchLocks();
    const interval = setInterval(fetchLocks, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSeatsSelected = (seats) => {
    setSelectedSeats(seats);
    toast.success(`${seats.length} seat(s) locked successfully!`);
  };

  const handleReleaseAll = async () => {
    try {
      await seatLockService.releaseUserLocks();
      setSelectedSeats([]);
      setUserLocks([]);
      toast.success('All locks released!');
    } catch (error) {
      toast.error('Failed to release locks');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            🔒 Seat Locking System Demo
          </h1>
          <p className="text-gray-600 text-lg">
            Professional seat locking like RedBus & MakeMyTrip
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Your Locks</p>
                <p className="text-3xl font-bold text-blue-600">{stats.yourLocks}</p>
              </div>
              <Lock className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selected Seats</p>
                <p className="text-3xl font-bold text-green-600">{selectedSeats.length}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Time Left</p>
                <p className="text-3xl font-bold text-orange-600">
                  {seatLockService.formatTimeRemaining(stats.timeRemaining)}
                </p>
              </div>
              <Clock className="w-10 h-10 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Session ID</p>
                <p className="text-xs font-mono text-purple-600 truncate">
                  {seatLockService.getSessionId().slice(0, 15)}...
                </p>
              </div>
              <Users className="w-10 h-10 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Features Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">10-Minute Lock</h3>
            </div>
            <p className="text-sm text-gray-600">
              Seats are locked for 10 minutes when selected. Auto-releases after expiry.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Real-Time Updates</h3>
            </div>
            <p className="text-sm text-gray-600">
              See locked seats in real-time. Other users can't select your locked seats.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Multi-User Support</h3>
            </div>
            <p className="text-sm text-gray-600">
              Session-based locking prevents conflicts. Fair allocation for all users.
            </p>
          </div>
        </div>

        {/* Seat Selection */}
        <SeatSelection
          type="bus"
          inventoryId={1}
          onSeatsSelected={handleSeatsSelected}
          maxSeats={6}
        />

        {/* Action Buttons */}
        {selectedSeats.length > 0 && (
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <button
              onClick={handleReleaseAll}
              className="py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <Unlock className="w-5 h-5" />
              Release All Locks
            </button>
            <button
              className="py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Proceed to Payment
            </button>
          </div>
        )}

        {/* Active Locks Table */}
        {userLocks.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Active Locks</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4">Seat ID</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Expires In</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userLocks.map((lockData, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-bold">{lockData.lock.seatId}</td>
                      <td className="py-3 px-4">{lockData.lock.inventoryType}</td>
                      <td className="py-3 px-4">₹{lockData.lock.price}</td>
                      <td className="py-3 px-4 text-orange-600 font-bold">
                        {seatLockService.formatTimeRemaining(lockData.expiresIn)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          {lockData.lock.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 border-2 border-blue-300">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 How to Test</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Single User Test:</h4>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>Click on any available seat</li>
                <li>See green highlight + countdown timer</li>
                <li>Seat is locked for 10 minutes</li>
                <li>Click again to unlock</li>
              </ol>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Multi-User Test:</h4>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>Open this page in incognito mode</li>
                <li>Select same seat in both windows</li>
                <li>Second window shows orange lock</li>
                <li>Can't select locked seats</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatLockingDemo;
