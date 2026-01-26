import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  X,
  RefreshCw,
  Calendar,
  Users,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plane,
  Bus,
  Train,
  Building,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const pageSize = 20;

  useEffect(() => {
    loadBookings();
  }, [currentPage, searchTerm, statusFilter, typeFilter]);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      
      // Mock data for demonstration
      const mockBookings = [
        {
          id: 'BK001',
          user: { name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210' },
          type: 'FLIGHT',
          details: {
            airline: 'Air India',
            flightNumber: 'AI 101',
            route: 'Mumbai → Delhi',
            departure: '2025-12-01T06:00:00Z',
            arrival: '2025-12-01T08:30:00Z',
            passengers: 2,
            seats: ['2A', '2B']
          },
          amount: 9000,
          status: 'CONFIRMED',
          bookingDate: '2025-11-30T10:30:00Z',
          pnr: 'AI123456',
          paymentId: 'pay_123456789'
        },
        {
          id: 'BK002',
          user: { name: 'Jane Smith', email: 'jane@example.com', phone: '+91 9876543211' },
          type: 'BUS',
          details: {
            operator: 'VRL Travels',
            busNumber: 'VRL 789',
            route: 'Mumbai → Pune',
            departure: '2025-12-01T22:00:00Z',
            arrival: '2025-12-02T04:30:00Z',
            passengers: 1,
            seats: ['L5']
          },
          amount: 800,
          status: 'CONFIRMED',
          bookingDate: '2025-11-30T09:15:00Z',
          pnr: 'VRL789123',
          paymentId: 'pay_987654321'
        },
        {
          id: 'BK003',
          user: { name: 'Mike Johnson', email: 'mike@example.com', phone: '+91 9876543212' },
          type: 'TRAIN',
          details: {
            trainName: 'Rajdhani Express',
            trainNumber: '12951',
            route: 'Mumbai → Delhi',
            departure: '2025-12-01T17:00:00Z',
            arrival: '2025-12-02T09:15:00Z',
            passengers: 1,
            seats: ['S1-15L'],
            class: 'AC 3-Tier'
          },
          amount: 1530,
          status: 'PENDING',
          bookingDate: '2025-11-30T08:45:00Z',
          pnr: 'RJ12345678',
          paymentId: 'pay_456789123'
        },
        {
          id: 'BK004',
          user: { name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+91 9876543213' },
          type: 'HOTEL',
          details: {
            hotelName: 'The Taj Mahal Palace',
            location: 'Mumbai, Maharashtra',
            checkIn: '2025-12-05T14:00:00Z',
            checkOut: '2025-12-07T11:00:00Z',
            rooms: 1,
            guests: 2,
            roomType: 'Deluxe Room'
          },
          amount: 30000,
          status: 'CONFIRMED',
          bookingDate: '2025-11-30T07:20:00Z',
          pnr: 'TAJ001234',
          paymentId: 'pay_789123456'
        },
        {
          id: 'BK005',
          user: { name: 'David Brown', email: 'david@example.com', phone: '+91 9876543214' },
          type: 'FLIGHT',
          details: {
            airline: 'SpiceJet',
            flightNumber: 'SG 303',
            route: 'Delhi → Bangalore',
            departure: '2025-12-02T14:30:00Z',
            arrival: '2025-12-02T17:00:00Z',
            passengers: 1,
            seats: ['15F']
          },
          amount: 3800,
          status: 'CANCELLED',
          bookingDate: '2025-11-29T18:30:00Z',
          pnr: 'SG456789',
          paymentId: 'pay_321654987',
          cancellationReason: 'Customer requested cancellation',
          refundAmount: 3420,
          refundStatus: 'PROCESSED'
        }
      ];
      
      // Filter bookings
      let filteredBookings = mockBookings;
      
      if (searchTerm) {
        filteredBookings = filteredBookings.filter(booking => 
          booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.pnr.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (statusFilter) {
        filteredBookings = filteredBookings.filter(booking => booking.status === statusFilter);
      }
      
      if (typeFilter) {
        filteredBookings = filteredBookings.filter(booking => booking.type === typeFilter);
      }
      
      setBookings(filteredBookings);
      setTotalElements(filteredBookings.length);
      setTotalPages(Math.ceil(filteredBookings.length / pageSize));
      
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking || !cancelReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    try {
      setBookings(bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, status: 'CANCELLED', cancellationReason: cancelReason }
          : booking
      ));
      
      toast.success('Booking cancelled successfully');
      setShowCancelModal(false);
      setCancelReason('');
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const getBookingIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'FLIGHT': return <Plane className={iconClass} />;
      case 'BUS': return <Bus className={iconClass} />;
      case 'TRAIN': return <Train className={iconClass} />;
      case 'HOTEL': return <Building className={iconClass} />;
      default: return <Calendar className={iconClass} />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      CONFIRMED: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {totalElements} Total
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadBookings}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition font-semibold flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, name, or PNR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="FLIGHT">Flights</option>
              <option value="BUS">Buses</option>
              <option value="TRAIN">Trains</option>
              <option value="HOTEL">Hotels</option>
            </select>
            
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setTypeFilter('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-cyan-600" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Travel Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                              {getBookingIcon(booking.type)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{booking.id}</div>
                              <div className="text-xs text-gray-500">PNR: {booking.pnr}</div>
                              <div className="text-xs text-gray-500">{formatDateTime(booking.bookingDate)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{booking.user.name}</div>
                            <div className="text-xs text-gray-500">{booking.user.email}</div>
                            <div className="text-xs text-gray-500">{booking.user.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">
                              {booking.type === 'FLIGHT' && `${booking.details.airline} ${booking.details.flightNumber}`}
                              {booking.type === 'BUS' && `${booking.details.operator}`}
                              {booking.type === 'TRAIN' && `${booking.details.trainName}`}
                              {booking.type === 'HOTEL' && `${booking.details.hotelName}`}
                            </div>
                            <div className="text-xs text-gray-500">{booking.details.route || booking.details.location}</div>
                            <div className="text-xs text-gray-500">
                              {booking.type === 'HOTEL' 
                                ? `${booking.details.rooms} room(s), ${booking.details.guests} guest(s)`
                                : `${booking.details.passengers} passenger(s)`
                              }
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatCurrency(booking.amount)}</div>
                          {booking.refundAmount && (
                            <div className="text-xs text-green-600">Refund: {formatCurrency(booking.refundAmount)}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(booking.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowDetailsModal(true);
                              }}
                              className="text-cyan-600 hover:text-cyan-900"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {booking.status === 'CONFIRMED' && (
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowCancelModal(true);
                                }}
                                className="text-red-600 hover:text-red-900"
                                title="Cancel Booking"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage === totalPages - 1}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{currentPage * pageSize + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min((currentPage + 1) * pageSize, totalElements)}
                        </span>{' '}
                        of <span className="font-medium">{totalElements}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                          disabled={currentPage === 0}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = currentPage < 3 ? i : currentPage - 2 + i;
                          if (pageNum >= totalPages) return null;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pageNum === currentPage
                                  ? 'z-10 bg-cyan-50 border-cyan-500 text-cyan-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum + 1}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                          disabled={currentPage === totalPages - 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Cancel Booking Modal */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cancel Booking</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel booking <span className="font-semibold">{selectedBooking.id}</span>?
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter cancellation reason..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent mb-4"
              rows="3"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelBooking}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
