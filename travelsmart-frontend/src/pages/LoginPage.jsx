import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, Plane, Eye, EyeOff, MapPin, Compass, Globe } from 'lucide-react';
import { authService } from '../services/authService';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { username: formData.username });
      const response = await authService.login(formData);
      console.log('Login response:', response);
      console.log('User role from backend:', response.role);
      
      login({ username: response.username, role: response.role }, response.token);
      toast.success('Login successful!');
      
      // Log the stored user data
      console.log('Stored user data:', { username: response.username, role: response.role });
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || error.message 
        || 'Login failed. Please check your credentials.';
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Animated Travel Theme */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Circles */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white/10 rounded-full animate-float-delayed"></div>
          <div className="absolute bottom-32 left-40 w-40 h-40 bg-white/10 rounded-full animate-float-slow"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          {/* Animated Travel Icons */}
          <div className="mb-8 relative">
            <div className="relative w-64 h-64">
              {/* Plane Animation */}
              <div className="absolute top-0 left-0 animate-fly-around">
                <Plane className="w-16 h-16 text-white drop-shadow-lg" />
              </div>
              
              {/* Globe in Center */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <Globe className="w-32 h-32 text-white/80 animate-spin-slow" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-white animate-bounce-slow" />
                  </div>
                </div>
              </div>

              {/* Compass */}
              <div className="absolute bottom-0 right-0 animate-pulse-slow">
                <Compass className="w-12 h-12 text-white/70" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <h1 className="text-5xl font-bold mb-4 text-center drop-shadow-lg">
            Explore the World
          </h1>
          <p className="text-xl text-center text-white/90 max-w-md drop-shadow-md">
            Your journey begins here. Discover amazing destinations and create unforgettable memories.
          </p>

          {/* Animated Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-sm text-white/80">Happy Travelers</div>
            </div>
            <div className="animate-fade-in animation-delay-200">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm text-white/80">Destinations</div>
            </div>
            <div className="animate-fade-in animation-delay-400">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-white/80">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo for Mobile */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Plane className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                TravelSmart
              </span>
            </Link>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">WELCOME BACK!</h2>
            <p className="text-gray-600">Login to your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username or Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Enter your username or email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-white text-gray-900 font-bold rounded-xl border-2 border-gray-900 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Login'
                )}
              </button>

              <Link
                to="/register"
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center"
              >
                Sign Up
              </Link>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="text-cyan-600 hover:text-cyan-700 font-semibold"
            >
              Create a new account →
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
