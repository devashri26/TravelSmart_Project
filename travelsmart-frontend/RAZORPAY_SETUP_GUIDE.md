# 💳 Razorpay Payment Integration Guide

## ✅ What's Implemented

Complete Razorpay payment integration for Flight, Bus, and Train bookings!

### Features:
- ✅ Razorpay order creation
- ✅ Secure payment processing
- ✅ Payment verification
- ✅ Success/Failure handling
- ✅ Professional payment UI
- ✅ Customer details collection
- ✅ Booking summary display

---

## 🚀 Setup Instructions

### Step 1: Get Razorpay API Keys

1. **Sign up for Razorpay**
   - Go to https://dashboard.razorpay.com/signup
   - Create a free account
   - Verify your email

2. **Get Test API Keys**
   - Login to Razorpay Dashboard
   - Go to Settings → API Keys
   - Click "Generate Test Key"
   - You'll get:
     - **Key ID**: `rzp_test_XXXXXXXXXXXX`
     - **Key Secret**: `YYYYYYYYYYYYYYYY`

3. **Copy Your Keys**
   - Keep these keys safe
   - Never commit them to Git!

---

### Step 2: Configure Backend

1. **Open `application.properties`**
   ```
   TravelSmart/src/main/resources/application.properties
   ```

2. **Update Razorpay Configuration**
   ```properties
   # Replace with your actual keys
   razorpay.key.id=rzp_test_YOUR_KEY_ID_HERE
   razorpay.key.secret=YOUR_KEY_SECRET_HERE
   ```

3. **Example**:
   ```properties
   razorpay.key.id=rzp_test_1234567890ABCD
   razorpay.key.secret=abcdefghijklmnopqrstuvwxyz123456
   ```

---

### Step 3: Restart Backend

1. **Stop the backend** (if running)
2. **Rebuild and restart**:
   ```bash
   cd TravelSmart
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

3. **Check logs** for:
   ```
   Started TravelSmartApplication
   ```

---

### Step 4: Test Payment Flow

1. **Search for a Flight/Bus/Train**
   - Go to any search page
   - Search and select a result
   - Click "Select Flight" or "View Seats"

2. **Select Seats**
   - Choose your seats
   - Click "Continue"

3. **Payment Page**
   - Fill in customer details:
     - Name
     - Email
     - Phone number
   - Review booking summary
   - Click **"Pay Now"**

4. **Razorpay Checkout**
   - Razorpay modal opens
   - Use test card details (see below)
   - Complete payment

5. **Success!**
   - Payment verified
   - Redirected to bookings page

---

## 🧪 Test Card Details

Use these test cards in Razorpay test mode:

### Successful Payment
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
Name: Any name
```

### Failed Payment
```
Card Number: 4000 0000 0000 0002
CVV: Any 3 digits
Expiry: Any future date
```

### Other Test Cards
- **Mastercard**: 5555 5555 5555 4444
- **Rupay**: 6073 8499 9999 9999
- **Amex**: 3782 822463 10005

---

## 📋 Payment Flow

```
1. User selects seats
   ↓
2. Navigate to Payment Page
   ↓
3. Fill customer details
   ↓
4. Click "Pay Now"
   ↓
5. Backend creates Razorpay order
   ↓
6. Razorpay checkout modal opens
   ↓
7. User enters card details
   ↓
8. Payment processed
   ↓
9. Backend verifies payment signature
   ↓
10. Success → Redirect to bookings
    Failed → Show error, retry option
```

---

## 🔒 Security Features

1. **Payment Signature Verification**
   - Every payment is verified using HMAC SHA256
   - Prevents payment tampering

2. **Secure API Keys**
   - Keys stored in application.properties
   - Never exposed to frontend

3. **HTTPS Required**
   - Production must use HTTPS
   - Razorpay enforces secure connections

4. **User Authentication**
   - Only logged-in users can make payments
   - JWT token validation

---

## 💡 Important Notes

### Test Mode vs Live Mode

**Test Mode** (Current):
- Use test API keys (rzp_test_...)
- No real money charged
- Use test card numbers
- Perfect for development

**Live Mode** (Production):
- Use live API keys (rzp_live_...)
- Real money transactions
- Requires KYC verification
- Need business documents

### Switching to Live Mode

1. Complete KYC on Razorpay
2. Get live API keys
3. Update application.properties
4. Test thoroughly before going live!

---

## 🐛 Troubleshooting

### Issue 1: "Razorpay is not defined"
**Solution**: Razorpay script not loaded
- Check internet connection
- Script loads from CDN
- Check browser console for errors

### Issue 2: "Invalid API Key"
**Solution**: Wrong API keys
- Double-check keys in application.properties
- Make sure no extra spaces
- Use test keys for testing

### Issue 3: Payment verification failed
**Solution**: Signature mismatch
- Check key secret is correct
- Restart backend after changing keys
- Check backend logs for errors

### Issue 4: "Order creation failed"
**Solution**: Backend error
- Check backend is running
- Check database connection
- Check backend logs
- Verify user is logged in

---

## 📊 Payment Status

Payments can have these statuses:

- **CREATED**: Order created, payment pending
- **SUCCESS**: Payment successful and verified
- **FAILED**: Payment failed or verification failed

---

## 🎯 Testing Checklist

- [ ] Backend running with correct API keys
- [ ] Frontend running
- [ ] User logged in
- [ ] Search and select booking
- [ ] Select seats
- [ ] Navigate to payment page
- [ ] Fill customer details
- [ ] Click "Pay Now"
- [ ] Razorpay modal opens
- [ ] Enter test card details
- [ ] Payment successful
- [ ] Redirected to bookings

---

## 📱 Mobile Testing

Razorpay checkout is mobile-responsive:
- Works on all devices
- Touch-friendly interface
- UPI payment option (in live mode)
- Wallet integration

---

## 🔗 Useful Links

- **Razorpay Dashboard**: https://dashboard.razorpay.com
- **API Documentation**: https://razorpay.com/docs/api
- **Test Cards**: https://razorpay.com/docs/payments/payments/test-card-details
- **Integration Guide**: https://razorpay.com/docs/payments/payment-gateway/web-integration

---

## 💰 Pricing (Live Mode)

Razorpay charges:
- **2% + ₹0** per transaction (Domestic cards)
- **3% + ₹0** per transaction (International cards)
- **No setup fees**
- **No annual fees**

---

## ✅ Next Steps

After testing payment:
1. Implement booking confirmation email
2. Add booking history page
3. Implement refund functionality
4. Add invoice generation
5. Integrate with actual flight/bus/train APIs

---

**Last Updated**: November 29, 2025
**Status**: ✅ Ready for Testing
**Mode**: Test Mode (No real money)
