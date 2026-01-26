import React, { useState, useEffect } from 'react';
import { Users, Hotel, Plane, DollarSign, Settings, BarChart } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalHotels: 0,
    totalFlights: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    pendingBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: BarChart, color: 'bg-green-500' },
    { label: 'Revenue', value: 'Rs ' + stats.totalRevenue.toLocaleString(), icon: DollarSign, color: 'bg-purple-500' },
    { label: 'Hotels', value: stats.totalHotels, icon: Hotel, color: 'bg-orange-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={'w-12 h-12 ' + stat.color + ' rounded-lg flex items-center justify-center'}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <a href="/admin/bookings" className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                <BarChart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Manage Bookings</p>
                <p className="text-sm text-gray-600">View all bookings</p>
              </div>
            </div>
          </a>

          <a href="/admin/users" className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Manage Users</p>
                <p className="text-sm text-gray-600">View all users</p>
              </div>
            </div>
          </a>

          <a href="/admin/payments" className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Manage Payments</p>
                <p className="text-sm text-gray-600">View payments</p>
              </div>
            </div>
          </a>

          <a href="/admin/flights" className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center group-hover:bg-cyan-200 transition">
                <Plane className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Manage Flights</p>
                <p className="text-sm text-gray-600">Add/Edit flights</p>
              </div>
            </div>
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <a href="/admin/hotels" className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition">
                <Hotel className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Manage Hotels</p>
                <p className="text-sm text-gray-600">Add/Edit hotels</p>
              </div>
            </div>
          </a>

          <a href="/admin/buses" className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Manage Buses</p>
                <p className="text-sm text-gray-600">Add/Edit buses</p>
              </div>
            </div>
          </a>

          <a href="/admin/trains" className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Manage Trains</p>
                <p className="text-sm text-gray-600">Add/Edit trains</p>
              </div>
            </div>
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-lg">
          <div className="border-b">
            <div className="flex space-x-8 px-6">
              {['overview', 'users', 'hotels', 'bookings', 'api-keys'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={'py-4 px-2 border-b-2 font-medium capitalize transition ' + (activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700')}
                >
                  {tab.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Confirmed Bookings</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.confirmedBookings}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Pending Bookings</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Cancelled Bookings</p>
                    <p className="text-2xl font-bold text-red-600">{stats.cancelledBookings}</p>
                  </div>
                </div>
                <p className="text-gray-600 mt-4">
                  Welcome to the admin dashboard. Use the tabs above to manage different aspects of the platform.
                </p>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
                <p className="text-gray-600">Manage all registered users here.</p>
              </div>
            )}

            {activeTab === 'hotels' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Hotel Management</h2>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  Add New Hotel
                </button>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Management</h2>
                <p className="text-gray-600">View and manage all bookings.</p>
              </div>
            )}

            {activeTab === 'api-keys' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">API Key Management</h2>
                <p className="text-gray-600">Configure API keys for external services.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
