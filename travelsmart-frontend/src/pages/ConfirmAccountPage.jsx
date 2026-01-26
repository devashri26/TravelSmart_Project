import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Plane } from 'lucide-react';
import { authService } from '../services/authService';

const ConfirmAccountPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      confirmAccount(token);
    } else {
      setStatus('error');
      setMessage('Invalid confirmation link');
    }
  }, [searchParams]);

  const confirmAccount = async (token) => {
    try {
      await authService.confirmAccount(token);
      setStatus('success');
      setMessage('Your account has been successfully confirmed!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to confirm account');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-strong p-8 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Plane className="w-9 h-9 text-white" />
          </div>
        </div>

        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-cyan-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirming your account...</h2>
            <p className="text-gray-600">Please wait while we verify your email</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to TravelSmart! 🎉</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="bg-cyan-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-cyan-800">
                You can now access all features including flight bookings, hotel reservations, and AI trip planning!
              </p>
            </div>
            <p className="text-sm text-gray-500">Redirecting to login page in 3 seconds...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                The verification link may have expired or is invalid. Please try registering again or contact support.
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmAccountPage;
