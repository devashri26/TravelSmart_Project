import React from 'react';
import AuthForms from './AuthForms'; // Registration Form (already created)
import ConfirmAccount from './ConfirmAccount'; // New Confirmation Page

export default function TravelAuthApp() {
  // Simple path-based "routing" without react-router-dom
  const currentPath = window.location.pathname;
  let currentView = 'register';
  
  if (currentPath.includes('/confirm-account')) {
      currentView = 'confirm';
  }
  // Future: Add 'login' path check here
  
  const renderView = () => {
      switch (currentView) {
          case 'confirm':
              return <ConfirmAccount />;
          case 'register':
          default:
              return <AuthForms />;
      }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {renderView()}
    </div>
  );
}