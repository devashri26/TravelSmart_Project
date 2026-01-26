import React from 'react';
import { Plane, ChevronRight, Calendar, DollarSign, Zap } from 'lucide-react';

const LandingPage = ({ setView }) => (
  <main className="pt-16 min-h-screen bg-white">
    {/* Hero Section */}
    <div className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-sky-50 pt-14">
      
      {/* Decorative Blur Element */}
      <div 
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" 
        aria-hidden="true"
      >
        <div 
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-400 to-sky-400 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" 
          style={{
            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.6%, 3.3% 86.8%, 77.1% 48.2%, 88.5% 77.1%, 91.5% 64.1%)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 relative z-10">
        <div className="text-center">
          <Plane className="w-14 h-14 text-indigo-600 mx-auto mb-4 animate-bounce-slow" />
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl">
            Intelligent Booking, <span className="text-indigo-600">Maximized Savings</span>
          </h1>
          <p className="mt-8 text-xl leading-8 text-gray-700 max-w-3xl mx-auto">
            Find the best flight routes, compare prices in real-time, and securely manage your entire travel itinerary with TravelSmart.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setView('register')}
              className="w-full sm:w-auto rounded-full bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-indigo-600/40 hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
            >
              Start Planning Your Trip
            </button>
            <button
              onClick={() => setView('dashboard')}
              className="w-full sm:w-auto text-lg font-semibold leading-6 text-gray-700 hover:text-indigo-600 flex items-center justify-center group py-4 px-6 transition duration-300"
            >
              Explore Live Demo <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
    
    {/* Features Section */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Travel Smarter, Not Harder</h2>
      <p className="text-center text-gray-500 mb-16 max-w-2xl mx-auto">
        Tools and insights designed for the modern traveler.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { icon: Zap, title: "Lightning Fast Search", desc: "Our engine uses advanced indexing to deliver results faster than competitors, saving you precious time." },
          { icon: DollarSign, title: "Price Prediction Engine", desc: "We analyze historical data to tell you the best time to book, ensuring you never overpay for a flight." },
          { icon: Calendar, title: "Seamless Itinerary Sync", desc: "All your bookings, reminders, and documents are centralized and accessible offline." }
        ].map((feature) => (
          <div key={feature.title} className="p-8 bg-gray-50 rounded-xl shadow-lg border border-gray-100 transform hover:shadow-xl hover:scale-[1.02] transition duration-300">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
                <feature.icon className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* CTA Block */}
    <div className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to ditch the confusing travel sites?</h2>
            <p className="mt-4 text-xl text-indigo-200">Sign up today and get access to exclusive smart deals.</p>
            <button
                onClick={() => setView('register')}
                className="mt-8 rounded-full bg-white px-8 py-3 text-lg font-semibold text-indigo-600 shadow-2xl hover:bg-gray-100 transition duration-300 transform hover:scale-105"
            >
                Create Free Account
            </button>
        </div>
    </div>
  </main>
);

export default LandingPage;