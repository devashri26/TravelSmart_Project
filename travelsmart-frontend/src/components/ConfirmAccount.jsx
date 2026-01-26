import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { confirmAccount } from '../api/travelApi';

export default function ConfirmAccount() {
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('Verifying your account token...');

  useEffect(() => {
    // 1. Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage("Invalid confirmation link. The activation token is missing.");
      return;
    }

    // 2. Call the API to confirm the account
    const activateAccount = async () => {
      const result = await confirmAccount(token);

      if (result.success) {
        setStatus('success');
        setMessage(result.message);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    };

    activateAccount();
  }, []); // Run only once on component mount

  // UI rendering logic based on status
  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Please Wait...</h2>
          <p className="text-gray-600 mt-2">{message}</p>
        </div>
      );
    }

    const Icon = status === 'success' ? CheckCircle : XCircle;
    const iconColor = status === 'success' ? 'text-green-500' : 'text-red-500';
    const title = status === 'success' ? 'Account Activated!' : 'Activation Failed';
    const buttonText = status === 'success' ? 'Go to Login' : 'Try Registering Again';
    const buttonHref = status === 'success' ? '#' : '#'; // Placeholder for login/register route

    return (
      <div className="text-center">
        <Icon className={`h-16 w-16 mx-auto mb-4 ${iconColor}`} />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <a 
          href={buttonHref}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
        >
          {buttonText}
        </a>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white p-10 shadow-2xl rounded-xl border border-gray-200">
        {renderContent()}
      </div>
    </div>
  );
}