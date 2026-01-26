import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Plane, Menu, X, User, LogOut, 
  LayoutDashboard, Shield, Briefcase, MapPin, Wallet, Users, Crown
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setIsProfileOpen(false);
  };

  const navLinks = isAuthenticated
    ? [
        { to: '/flights', label: 'Flights', icon: Plane },
        { to: '/hotels', label: 'Hotels', icon: Briefcase },
        { to: '/trains', label: 'Trains', icon: MapPin },
        { to: '/buses', label: 'Buses', icon: MapPin },
        { to: '/test-live-flights', label: '🧪 Test API', icon: Plane },
      ]
    : [];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                TravelSmart
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive(link.to)
                    ? 'bg-cyan-50 text-cyan-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold text-gray-900">{user?.username || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.role || 'Traveler'}</p>
                  </div>
                </button>

                {/* Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-strong border border-gray-100 py-2 animate-slide-up">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Dashboard</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">My Profile</span>
                    </Link>
                    <Link
                      to="/bookings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <Briefcase className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">My Bookings</span>
                    </Link>
                    <Link
                      to="/wallet"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <Wallet className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">My Wallet</span>
                    </Link>
                    <Link
                      to="/travelers"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Saved Travelers</span>
                    </Link>
                    
                    {user?.role === 'ROLE_SUPER_ADMIN' && (
                      <>
                        <div className="border-t border-gray-100 my-2"></div>
                        <Link
                          to="/admin/super-admin/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors"
                        >
                          <Crown className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-600">Super Admin Dashboard</span>
                        </Link>
                        <Link
                          to="/admin/super-admin/admins"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors"
                        >
                          <Shield className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-600">Manage Admins</span>
                        </Link>
                        <Link
                          to="/admin/super-admin/users"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors"
                        >
                          <Users className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-600">Manage Users</span>
                        </Link>
                      </>
                    )}
                    
                    {(user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN' || user?.role === 'ROLE_SUPER_ADMIN') && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors border-t border-gray-100 mt-2 pt-2"
                      >
                        <Shield className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-600">Admin Panel</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left border-t border-gray-100 mt-2 pt-2"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-600">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link
                  to="/login"
                  className="px-5 py-2 text-gray-700 font-semibold hover:text-cyan-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-md transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-slide-up">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive(link.to)
                    ? 'bg-cyan-50 text-cyan-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <div className="border-t border-gray-100 my-2 pt-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <Link
                    to="/bookings"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    <Briefcase className="w-5 h-5" />
                    <span className="font-medium">My Bookings</span>
                  </Link>
                  <Link
                    to="/wallet"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    <Wallet className="w-5 h-5" />
                    <span className="font-medium">My Wallet</span>
                  </Link>
                  <Link
                    to="/travelers"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    <Users className="w-5 h-5" />
                    <span className="font-medium">Saved Travelers</span>
                  </Link>
                  {(user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN') && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-purple-600 hover:bg-purple-50"
                    >
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Admin Panel</span>
                    </Link>
                  )}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <div className="border-t border-gray-100 my-2 pt-2 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-center text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;



