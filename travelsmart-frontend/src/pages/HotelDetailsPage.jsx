import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Wifi, Coffee, Car, Dumbbell, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import { hotelService } from '../services/hotelService';
import toast from 'react-hot-toast';

const HotelDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHotelDetails();
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      const hotelData = await hotelService.getHotelById(id);
      const reviewsData = await hotelService.getHotelReviews(id);
      setHotel(hotelData);
      setReviews(reviewsData);
    } catch (error) {
      toast.error('Failed to load hotel details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = () => {
    navigate('/payment', { state: { hotel, type: 'hotel' } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  const amenities = [
    { icon: Wifi, label: 'Free WiFi' },
    { icon: Coffee, label: 'Breakfast' },
    { icon: Car, label: 'Parking' },
    { icon: Dumbbell, label: 'Gym' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </button>

        {/* Hotel Images */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="col-span-4 md:col-span-2 md:row-span-2">
            <img
              src={hotel?.imageUrl || 'https://source.unsplash.com/1200x800/?hotel'}
              alt={hotel?.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <img
              key={i}
              src={`https://source.unsplash.com/600x400/?hotel,room,${i}`}
              alt={`Hotel view ${i}`}
              className="w-full h-48 object-cover rounded-xl"
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Hotel Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel?.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < (hotel?.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({hotel?.reviews || 0} reviews)</span>
              </div>
              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{hotel?.location}</span>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {hotel?.description || 'Experience luxury and comfort at this beautiful hotel. Perfect location with excellent amenities and outstanding service.'}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <amenity.icon className="w-5 h-5 text-indigo-600" />
                    <span className="text-gray-700">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Guest Reviews</h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{review.userName}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet</p>
              )}
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="mb-6">
                <span className="text-4xl font-bold text-indigo-600">${hotel?.pricePerNight || 0}</span>
                <span className="text-gray-600"> / night</span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                  <input
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Book Now
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsPage;
