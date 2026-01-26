import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import { paymentService } from '../services/paymentService';
import { seatLockService } from '../services/seatLockService';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const bookingData = location.state;

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({
    name: user?.username || '',
    email: user?.email || '',
    phone: ''
  });

  useEffect(() => {
    if (!bookingData) {
      toast.error('No booking data found');
      navigate('/');
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [bookingData, navigate]);

  const handleInputChange = (e) => {
    setCustomerDetails({
      ...customerDetails,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async () => {
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      toast.error('Please fill all customer details');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const orderData = {
        amount: bookingData.totalAmount,
        currency: 'INR',
        bookingType: bookingData.type,
        bookingId: null, // Will be created after payment success
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone
      };

      const orderResponse = await paymentService.createOrder(orderData);

      // Check if this is mock mode
      const isMockMode = orderResponse.razorpayKeyId === 'rzp_test_mock_key';

      if (isMockMode) {
        // MOCK MODE: Simulate payment without Razorpay
        toast('Mock Payment Mode - Simulating payment...', { icon: '💳' });
        
        setTimeout(async () => {
          try {
            // Simulate successful payment
            const seatIds = bookingData.seats?.map(s => s.id).join(',') || '';
            const verificationData = {
              razorpayOrderId: orderResponse.orderId,
              razorpayPaymentId: 'pay_mock_' + Date.now(),
              razorpaySignature: 'sig_mock_' + Date.now(),
              bookingId: null,
              inventoryId: bookingData.flight?.id || bookingData.bus?.id || bookingData.train?.id || bookingData.hotel?.id,
              quantity: bookingData.seats?.length || 1,
              seatNumbers: seatIds
            };

            const verificationResponse = await paymentService.verifyPayment(verificationData);

            if (verificationResponse.success) {
              // Mark seat locks as booked
              try {
                await seatLockService.markLocksAsBooked();
                console.log('✅ Seat locks marked as booked');
              } catch (lockError) {
                console.error('Failed to mark locks as booked:', lockError);
              }
              
              setPaymentStatus('success');
              toast.success('Payment successful! (Mock Mode)');
              
              // Stay on success page instead of redirecting
              // setTimeout(() => {
              //   navigate('/bookings');
              // }, 2000);
            } else {
              setPaymentStatus('failed');
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Verification error:', error);
            setPaymentStatus('failed');
            toast.error('Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        }, 2000);
      } else {
        // REAL MODE: Use Razorpay
        const options = {
          key: orderResponse.razorpayKeyId,
          amount: orderResponse.amount * 100,
          currency: orderResponse.currency,
          name: 'TravelSmart',
          description: `${bookingData.type} Booking`,
          order_id: orderResponse.orderId,
          prefill: {
            name: customerDetails.name,
            email: customerDetails.email,
            contact: customerDetails.phone
          },
          theme: {
            color: '#06B6D4'
          },
          handler: async function (response) {
            try {
              const seatIds = bookingData.seats?.map(s => s.id).join(',') || '';
              const verificationData = {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                bookingId: null,
                inventoryId: bookingData.flight?.id || bookingData.bus?.id || bookingData.train?.id || bookingData.hotel?.id,
                quantity: bookingData.seats?.length || 1,
                seatNumbers: seatIds
              };

              const verificationResponse = await paymentService.verifyPayment(verificationData);

              if (verificationResponse.success) {
                // Mark seat locks as booked
                try {
                  await seatLockService.markLocksAsBooked();
                  console.log('✅ Seat locks marked as booked');
                } catch (lockError) {
                  console.error('Failed to mark locks as booked:', lockError);
                }
                
                setPaymentStatus('success');
                toast.success('Payment successful!');
                
                // Stay on success page instead of redirecting
                // setTimeout(() => {
                //   navigate('/bookings');
                // }, 2000);
              } else {
                setPaymentStatus('failed');
                toast.error('Payment verification failed');
              }
            } catch (error) {
              console.error('Verification error:', error);
              setPaymentStatus('failed');
              toast.error('Payment verification failed');
            } finally {
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              toast('Payment cancelled', { icon: 'ℹ️' });
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  if (!bookingData) {
    return null;
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-4">
              Your booking has been confirmed. Thank you for choosing TravelSmart!
            </p>
            <p className="text-sm text-gray-500 mb-8">
              A confirmation email with your ticket has been sent to your email address.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/bookings')}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                View My Bookings
              </button>
              <button
                onClick={() => navigate('/')}
                className="block w-full px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
            <p className="text-gray-600 mb-8">
              Something went wrong with your payment. Please try again.
            </p>
            <button
              onClick={() => setPaymentStatus(null)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Booking</span>
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Summary</h2>
              
              {/* Booking Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-600">Booking Type</span>
                  <span className="font-semibold text-gray-900">{bookingData.type}</span>
                </div>

                {bookingData.type === 'FLIGHT' && (
                  <>
                    <div className="flex items-center justify-between pb-4 border-b">
                      <span className="text-gray-600">Flight</span>
                      <span className="font-semibold text-gray-900">
                        {bookingData.flight.airline} {bookingData.flight.flightNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b">
                      <span className="text-gray-600">Route</span>
                      <span className="font-semibold text-gray-900">
                        {bookingData.flight.origin} → {bookingData.flight.destination}
                      </span>
                    </div>
                  </>
                )}

                {bookingData.type === 'BUS' && (
                  <>
                    <div className="flex items-center justify-between pb-4 border-b">
                      <span className="text-gray-600">Bus</span>
                      <span className="font-semibold text-gray-900">
                        {bookingData.bus.operator}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b">
                      <span className="text-gray-600">Route</span>
                      <span className="font-semibold text-gray-900">
                        {bookingData.from} → {bookingData.to}
                      </span>
                    </div>
                  </>
                )}

                {bookingData.type === 'TRAIN' && (
                  <>
                    <div className="flex items-center justify-between pb-4 border-b">
                      <span className="text-gray-600">Train</span>
                      <span className="font-semibold text-gray-900">
                        {bookingData.train.name} ({bookingData.train.trainNumber})
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b">
                      <span className="text-gray-600">Route</span>
                      <span className="font-semibold text-gray-900">
                        {bookingData.from} → {bookingData.to}
                      </span>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-600">Selected Seats</span>
                  <span className="font-semibold text-gray-900">
                    {bookingData.seats.map(s => s.id).join(', ')}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-600">Number of Seats</span>
                  <span className="font-semibold text-gray-900">{bookingData.seats.length}</span>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-xl font-bold text-gray-900">Total Amount</span>
                  <span className="text-3xl font-black text-cyan-600">
                    ₹{bookingData.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customerDetails.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerDetails.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerDetails.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center space-x-2 mb-6">
                <Lock className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Secure Payment</span>
              </div>

              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-2">You will pay</div>
                <div className="text-4xl font-black text-gray-900">
                  ₹{bookingData.totalAmount}
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Pay Now</span>
                  </>
                )}
              </button>

              <div className="mt-6 text-center">
                <img
                  src="https://razorpay.com/assets/razorpay-glyph.svg"
                  alt="Razorpay"
                  className="h-6 mx-auto opacity-50"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Powered by Razorpay
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  By proceeding, you agree to our Terms & Conditions and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
