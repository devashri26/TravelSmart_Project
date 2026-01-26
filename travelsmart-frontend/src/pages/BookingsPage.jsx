import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Download, X } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import { bookingService } from '../services/bookingService';
import toast from 'react-hot-toast';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getUserBookings();
      console.log('Bookings data:', data); // Debug log
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingService.cancelBooking(id);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleDownloadPDF = async (booking) => {
    try {
      toast.loading('Generating ticket...', { id: 'pdf-download' });
      
      const response = await fetch(`http://localhost:8080/api/v1/bookings/${booking.id}/ticket`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to download ticket');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${booking.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Ticket downloaded successfully!', { id: 'pdf-download' });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download ticket', { id: 'pdf-download' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No bookings yet</p>
            <p className="text-gray-500 mt-2">Start planning your next adventure!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {booking.displayName || `Booking #${booking.id}`}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                        {booking.inventoryType}
                      </span>
                      {booking.route && (
                        <span className="text-gray-600 text-sm">
                          {booking.route}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Booking Date</p>
                      <div className="flex items-center space-x-2 text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    {booking.departureTime && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Departure</p>
                        <div className="flex items-center space-x-2 text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium">
                            {new Date(booking.departureTime).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Seats Booked</p>
                      <div className="flex items-center space-x-2 text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          {booking.seatNumbers ? (
                            <span className="bg-white px-2 py-1 rounded border border-gray-200">
                              {booking.seatNumbers}
                            </span>
                          ) : (
                            `${booking.quantity} seat(s)`
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                    <span className="text-2xl font-bold text-cyan-600">₹{booking.totalPrice}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownloadPDF(booking)}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Ticket</span>
                    </button>
                    {booking.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    )}
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

export default BookingsPage;
