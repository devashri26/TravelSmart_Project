import React from 'react';
import { Plane, LogIn, ChevronRight } from 'lucide-react';

const Navbar = ({ isAuthenticated, currentView, setView, handleSignOut, userEmail }) => {
  const navItems = [
    { name: 'Home', view: 'landing' },
    { name: 'Search Flights', view: 'dashboard' },
  ];

  return (
    <header className="fixed w-full z-20 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('landing')}>
          <Plane className="w-6 h-6 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900 tracking-wider">TravelSmart</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map(item => (
            <button
              key={item.name}
              onClick={() => setView(item.view)}
              className={`text-sm font-medium transition duration-150 ease-in-out ${
                currentView === item.view ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <span className="hidden lg:inline text-xs text-gray-500 truncate max-w-[150px] mr-2" title={userEmail}>
                User: {userEmail || 'Authenticated'}
              </span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full shadow-md hover:bg-red-600 transition"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setView('login')}
                className="hidden sm:flex items-center space-x-1 px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-50 transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
              <button
                onClick={() => setView('register')}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/50 hover:bg-indigo-700 transition"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;