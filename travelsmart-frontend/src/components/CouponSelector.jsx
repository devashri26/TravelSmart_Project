import React, { useState, useEffect } from 'react';
import { Tag, X, Check } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CouponSelector = ({ bookingAmount, bookingType, onCouponApplied }) => {
  const [coupons, setCoupons] = useState([]);
  const [showCoupons, setShowCoupons] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/coupons');
      setCoupons(response.data);
    } catch (error) {
      console.error('Failed to fetch coupons');
    }
  };

  const applyCoupon = async (code) => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/coupons/apply', {
        code,
        amount: bookingAmount,
        bookingType
      });

      if (response.data.success) {
        setAppliedCoupon({
          code,
          discount: response.data.discount,
          finalAmount: response.data.finalAmount
        });
        onCouponApplied(response.data.discount, code);
        toast.success(response.data.message);
        setShowCoupons(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply coupon');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    onCouponApplied(0, null);
    toast.success('Coupon removed');
  };

  return (
    <div className="bg-white rounded-xl border-2 border-dashed border-cyan-300 p-4">
      {!appliedCoupon ? (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Tag className="w-5 h-5 text-cyan-600" />
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={() => applyCoupon(couponCode)}
              className="bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-cyan-700 transition"
            >
              Apply
            </button>
          </div>
          
          <button
            onClick={() => setShowCoupons(!showCoupons)}
            className="text-cyan-600 text-sm font-semibold hover:underline"
          >
            View Available Coupons
          </button>

          {showCoupons && (
            <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="border border-gray-200 rounded-lg p-3 hover:border-cyan-500 transition cursor-pointer"
                  onClick={() => applyCoupon(coupon.code)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-cyan-600">{coupon.code}</span>
                    <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                      {coupon.discountType === 'PERCENTAGE' 
                        ? `${coupon.discountValue}% OFF` 
                        : `₹${coupon.discountValue} OFF`}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{coupon.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Min booking: ₹{coupon.minBookingAmount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-bold text-green-600">{appliedCoupon.code} Applied</p>
              <p className="text-sm text-gray-600">You saved ₹{appliedCoupon.discount.toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={removeCoupon}
            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponSelector;
