import React, { useState } from 'react';
import { Lock, Mail, Loader2 } from 'lucide-react';

const AuthForms = ({ setView, handleAuthAction, isLoading }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleAuthAction('login', formData.email, formData.password);
    } else {
      if (formData.password !== formData.confirmPassword) {
        handleAuthAction('error', null, null, 'Passwords do not match!');
        return;
      }
      handleAuthAction('register', formData.email, formData.password);
    }
  };

  const toggleForm = () => {
    setFormData({ email: '', password: '', confirmPassword: '' });
    setIsLogin(!isLogin);
    // Adjust the main view based on the form toggle
    setView(isLogin ? 'register' : 'login'); 
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 sm:p-10 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          {isLogin ? 'Welcome Back' : 'Join TravelSmart'}
        </h2>
        <p className="text-gray-500 mb-8 text-center">
          {isLogin ? 'Sign in to access your bookings.' : 'Create your account in seconds.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email/Username Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              disabled={isLoading}
            />
          </div>

          {/* Confirm Password Input (Only for Register) */}
          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                disabled={isLoading}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md shadow-indigo-500/50 hover:bg-indigo-700 transition duration-150 transform hover:scale-[1.01] flex items-center justify-center space-x-2"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>{isLogin ? (isLoading ? 'Logging In...' : 'Log In') : (isLoading ? 'Registering...' : 'Register Account')}</span>
          </button>
        </form>

        {/* Toggle Link */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={toggleForm}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition duration-150"
            disabled={isLoading}
          >
            {isLogin ? "Need an account? Register" : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForms;