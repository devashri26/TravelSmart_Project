import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSystemOverview } from '../../services/superAdminService';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getSystemOverview();
        setStats(data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Super Admin Dashboard</h1>
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Total Users</p>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow cursor-pointer"
             onClick={() => navigate('/admin/super-admin/admins')}>
          <p className="text-gray-500">Total Admins</p>
          <p className="text-3xl font-bold text-purple-600">{stats?.totalAdmins || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Super Admins</p>
          <p className="text-3xl font-bold text-red-600">{stats?.totalSuperAdmins || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Active Users</p>
          <p className="text-3xl font-bold text-green-600">{stats?.activeUsers || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Total Bookings</p>
          <p className="text-3xl font-bold">{stats?.totalBookings || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Confirmed</p>
          <p className="text-3xl font-bold text-green-600">{stats?.confirmedBookings || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{stats?.pendingBookings || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Cancelled</p>
          <p className="text-3xl font-bold text-red-600">{stats?.cancelledBookings || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Total Revenue</p>
          <p className="text-3xl font-bold text-green-600">
            ₹{(stats?.totalRevenue || 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Pending Revenue</p>
          <p className="text-3xl font-bold text-yellow-600">
            ₹{(stats?.pendingRevenue || 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/admin/super-admin/admins')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Manage Admins
          </button>
          <button
            onClick={() => navigate('/admin/super-admin/users')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Manage Users
          </button>
          <button
            onClick={() => navigate('/admin/bookings')}
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            View Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
