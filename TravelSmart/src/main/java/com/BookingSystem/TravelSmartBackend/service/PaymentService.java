package com.BookingSystem.TravelSmartBackend.service;

import com.BookingSystem.TravelSmartBackend.dto.PaymentOrderRequest;
import com.BookingSystem.TravelSmartBackend.dto.PaymentOrderResponse;
import com.BookingSystem.TravelSmartBackend.dto.PaymentVerificationRequest;
import com.BookingSystem.TravelSmartBackend.model.Payment;
import com.BookingSystem.TravelSmartBackend.model.User;
import com.BookingSystem.TravelSmartBackend.repository.PaymentRepository;
import com.BookingSystem.TravelSmartBackend.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.List;

@Service
public class PaymentService {
    
    @Value("${razorpay.key.id:rzp_test_YOUR_KEY_ID}")
    private String razorpayKeyId;
    
    @Value("${razorpay.key.secret:YOUR_KEY_SECRET}")
    private String razorpayKeySecret;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private EmailService emailService;
    
    public PaymentOrderResponse createOrder(PaymentOrderRequest request) throws RazorpayException {
        // Check if Razorpay keys are configured - if not, use MOCK mode
        boolean isMockMode = razorpayKeyId == null || razorpayKeyId.contains("YOUR_KEY") || 
                             razorpayKeySecret == null || razorpayKeySecret.contains("YOUR_KEY");
        
        String orderId;
        
        if (isMockMode) {
            // MOCK MODE: Generate a fake order ID for testing
            orderId = "order_mock_" + System.currentTimeMillis();
            System.out.println("⚠️ MOCK PAYMENT MODE: Using fake order ID: " + orderId);
        } else {
            // REAL MODE: Create actual Razorpay order
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int)(request.getAmount() * 100)); // Amount in paise
            orderRequest.put("currency", request.getCurrency());
            orderRequest.put("receipt", "order_" + System.currentTimeMillis());
            
            Order order = razorpayClient.orders.create(orderRequest);
            orderId = order.get("id");
        }
        
        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Save payment record
        Payment payment = new Payment();
        payment.setRazorpayOrderId(orderId);
        payment.setAmount(request.getAmount());
        payment.setCurrency(request.getCurrency());
        payment.setStatus("CREATED");
        payment.setBookingType(request.getBookingType());
        payment.setBookingId(request.getBookingId());
        payment.setUser(user);
        payment.setCustomerName(request.getCustomerName());
        payment.setCustomerEmail(request.getCustomerEmail());
        payment.setCustomerPhone(request.getCustomerPhone());
        
        paymentRepository.save(payment);
        
        // Return response (use mock key in mock mode)
        String keyToReturn = isMockMode ? "rzp_test_mock_key" : razorpayKeyId;
        
        return new PaymentOrderResponse(
            orderId,
            request.getAmount(),
            request.getCurrency(),
            keyToReturn
        );
    }
    
    public boolean verifyPayment(PaymentVerificationRequest request) {
        try {
            // Check if this is a mock payment
            boolean isMockPayment = request.getRazorpayOrderId().startsWith("order_mock_");
            
            boolean isValid;
            
            if (isMockPayment) {
                // MOCK MODE: Auto-approve all payments
                isValid = true;
                System.out.println("⚠️ MOCK PAYMENT MODE: Auto-approving payment for order: " + request.getRazorpayOrderId());
            } else {
                // REAL MODE: Verify signature
                String generatedSignature = generateSignature(
                    request.getRazorpayOrderId(),
                    request.getRazorpayPaymentId()
                );
                isValid = generatedSignature.equals(request.getRazorpaySignature());
            }
            
            if (isValid) {
                // Update payment status
                Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                        .orElseThrow(() -> new RuntimeException("Payment not found"));
                
                payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
                payment.setRazorpaySignature(request.getRazorpaySignature());
                payment.setStatus("SUCCESS");
                
                paymentRepository.save(payment);
                
                // CREATE BOOKING AFTER SUCCESSFUL PAYMENT
                try {
                    // Get booking details from request or payment
                    Long inventoryId = request.getInventoryId();
                    int quantity = request.getQuantity() != null ? request.getQuantity() : 1;
                    String seatNumbers = request.getSeatNumbers();
                    
                    System.out.println("🔍 Payment verification - Creating booking:");
                    System.out.println("   - Inventory ID: " + inventoryId);
                    System.out.println("   - Booking Type: " + payment.getBookingType());
                    System.out.println("   - Quantity: " + quantity);
                    System.out.println("   - Seat Numbers: " + seatNumbers);
                    System.out.println("   - Amount: " + payment.getAmount());
                    
                    // If seat numbers not provided in request, try to get from payment
                    if (seatNumbers == null || seatNumbers.isEmpty()) {
                        System.out.println("⚠️ No seat numbers in request, using quantity: " + quantity);
                    }
                    
                    // Create the booking with the seat numbers
                    com.BookingSystem.TravelSmartBackend.model.Booking booking = bookingService.createBooking(
                        inventoryId,
                        payment.getBookingType(),
                        quantity,
                        seatNumbers,
                        java.math.BigDecimal.valueOf(payment.getAmount())
                    );
                    
                    // Link booking to payment
                    payment.setBookingId(booking.getId());
                    paymentRepository.save(payment);
                    
                    // Send booking confirmation email
                    sendBookingConfirmationEmail(payment, booking);
                    
                    System.out.println("✅ Booking created successfully: ID=" + booking.getId() + " with seats: " + seatNumbers);
                } catch (Exception bookingError) {
                    System.err.println("❌ Failed to create booking: " + bookingError.getMessage());
                    bookingError.printStackTrace();
                    // Payment is still successful, but booking failed
                    // You might want to handle this differently in production
                }
                
                return true;
            }
            
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    private void sendBookingConfirmationEmail(Payment payment, com.BookingSystem.TravelSmartBackend.model.Booking booking) {
        try {
            String subject = "Booking Confirmed - TravelSmart";
            String htmlContent = buildBookingConfirmationEmail(payment, booking);
            emailService.sendHtmlEmail(payment.getCustomerEmail(), subject, htmlContent);
            System.out.println("✅ Booking confirmation email sent to: " + payment.getCustomerEmail());
        } catch (Exception e) {
            System.err.println("❌ Failed to send booking confirmation email: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private String buildBookingConfirmationEmail(Payment payment, com.BookingSystem.TravelSmartBackend.model.Booking booking) {
        String downloadUrl = "http://localhost:8080/api/v1/bookings/" + booking.getId() + "/ticket";
        
        return "<!DOCTYPE html>" +
                "<html lang=\"en\">" +
                "<head>" +
                "    <meta charset=\"UTF-8\">" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "    <title>Booking Confirmed - TravelSmart</title>" +
                "</head>" +
                "<body style=\"margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6;\">" +
                "    <table role=\"presentation\" style=\"width: 100%; border-collapse: collapse; background-color: #f3f4f6;\">" +
                "        <tr>" +
                "            <td style=\"padding: 40px 20px;\">" +
                "                <table role=\"presentation\" style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\">" +
                "                    <tr>" +
                "                        <td style=\"background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;\">" +
                "                            <div style=\"background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;\">" +
                "                                <span style=\"font-size: 48px;\">✓</span>" +
                "                            </div>" +
                "                            <h1 style=\"color: #ffffff; font-size: 32px; font-weight: 700; margin: 0 0 10px 0;\">Booking Confirmed!</h1>" +
                "                            <p style=\"color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 0;\">Your journey is all set</p>" +
                "                        </td>" +
                "                    </tr>" +
                "                    <tr>" +
                "                        <td style=\"padding: 40px 30px;\">" +
                "                            <h2 style=\"color: #111827; font-size: 20px; font-weight: 700; margin: 0 0 20px 0;\">Hi " + payment.getCustomerName() + ",</h2>" +
                "                            <p style=\"color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;\">" +
                "                                Great news! Your booking has been confirmed. Here are your booking details:" +
                "                            </p>" +
                "                            <div style=\"background-color: #f9fafb; border-radius: 12px; padding: 24px; margin: 24px 0;\">" +
                "                                <table style=\"width: 100%; border-collapse: collapse;\">" +
                "                                    <tr>" +
                "                                        <td style=\"padding: 8px 0; color: #6b7280; font-size: 14px;\">Booking ID</td>" +
                "                                        <td style=\"padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;\">#" + booking.getId() + "</td>" +
                "                                    </tr>" +
                "                                    <tr>" +
                "                                        <td style=\"padding: 8px 0; color: #6b7280; font-size: 14px;\">Booking Type</td>" +
                "                                        <td style=\"padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;\">" + payment.getBookingType() + "</td>" +
                "                                    </tr>" +
                "                                    <tr>" +
                "                                        <td style=\"padding: 8px 0; color: #6b7280; font-size: 14px;\">Number of Seats</td>" +
                "                                        <td style=\"padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;\">" + booking.getQuantity() + "</td>" +
                "                                    </tr>" +
                "                                    <tr>" +
                "                                        <td style=\"padding: 8px 0; color: #6b7280; font-size: 14px;\">Total Amount</td>" +
                "                                        <td style=\"padding: 8px 0; color: #10b981; font-size: 18px; font-weight: 700; text-align: right;\">₹" + payment.getAmount() + "</td>" +
                "                                    </tr>" +
                "                                    <tr>" +
                "                                        <td style=\"padding: 8px 0; color: #6b7280; font-size: 14px;\">Payment Status</td>" +
                "                                        <td style=\"padding: 8px 0; text-align: right;\">" +
                "                                            <span style=\"background-color: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;\">PAID</span>" +
                "                                        </td>" +
                "                                    </tr>" +
                "                                </table>" +
                "                            </div>" +
                "                            <table role=\"presentation\" style=\"margin: 32px 0;\">" +
                "                                <tr>" +
                "                                    <td style=\"text-align: center;\">" +
                "                                        <a href=\"" + downloadUrl + "\" style=\"display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(6, 182, 212, 0.3);\">" +
                "                                            📥 Download Ticket (PDF)" +
                "                                        </a>" +
                "                                    </td>" +
                "                                </tr>" +
                "                            </table>" +
                "                            <div style=\"background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 16px; margin: 32px 0 0 0; border-radius: 8px;\">" +
                "                                <p style=\"color: #1e40af; font-size: 13px; line-height: 1.6; margin: 0;\">" +
                "                                    <strong>Important:</strong> Please carry a printed copy or digital copy of your ticket. You can download it anytime from your bookings page." +
                "                                </p>" +
                "                            </div>" +
                "                        </td>" +
                "                    </tr>" +
                "                    <tr>" +
                "                        <td style=\"background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;\">" +
                "                            <p style=\"color: #6b7280; font-size: 14px; margin: 0 0 12px 0;\">" +
                "                                Need help? Contact us at <a href=\"mailto:support@travelsmart.com\" style=\"color: #06b6d4; text-decoration: none;\">support@travelsmart.com</a>" +
                "                            </p>" +
                "                            <p style=\"color: #9ca3af; font-size: 12px; margin: 0;\">" +
                "                                © 2025 TravelSmart. All rights reserved." +
                "                            </p>" +
                "                        </td>" +
                "                    </tr>" +
                "                </table>" +
                "            </td>" +
                "        </tr>" +
                "    </table>" +
                "</body>" +
                "</html>";
    }
    
    private String generateSignature(String orderId, String paymentId) throws Exception {
        String payload = orderId + "|" + paymentId;
        
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(razorpayKeySecret.getBytes(), "HmacSHA256");
        mac.init(secretKeySpec);
        
        byte[] hash = mac.doFinal(payload.getBytes());
        StringBuilder hexString = new StringBuilder();
        
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        
        return hexString.toString();
    }
    
    public List<Payment> getUserPayments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return paymentRepository.findByUserId(user.getId());
    }
    
    public Payment getPaymentByOrderId(String orderId) {
        return paymentRepository.findByRazorpayOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
    
    public Payment getPaymentByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found for booking"));
    }
    
    // ==================== ADMIN METHODS ====================
    
    public double getTotalRevenue() {
        return paymentRepository.sumAmountByStatus("SUCCESS");
    }
    
    public double getTodayRevenue() {
        java.time.LocalDateTime startOfDay = java.time.LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        return paymentRepository.sumAmountByStatusAndCreatedAtAfter("SUCCESS", startOfDay);
    }
    
    public double getSuccessRate() {
        long total = paymentRepository.count();
        if (total == 0) return 0.0;
        long successful = paymentRepository.countByStatus("SUCCESS");
        return (successful * 100.0) / total;
    }
    
    public long getPendingRefunds() {
        return paymentRepository.countByStatus("REFUND_PENDING");
    }
    
    public java.util.Map<String, Object> getRevenueByPeriod(String period) {
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        java.time.LocalDateTime startDate;
        
        switch (period) {
            case "1d":
                startDate = java.time.LocalDateTime.now().minusDays(1);
                break;
            case "30d":
                startDate = java.time.LocalDateTime.now().minusDays(30);
                break;
            case "7d":
            default:
                startDate = java.time.LocalDateTime.now().minusDays(7);
                break;
        }
        
        List<Payment> payments = paymentRepository.findByStatusAndCreatedAtAfter("SUCCESS", startDate);
        result.put("data", payments);
        result.put("total", payments.stream().mapToDouble(Payment::getAmount).sum());
        
        return result;
    }
    
    public org.springframework.data.domain.Page<Payment> getAllPayments(String status, org.springframework.data.domain.Pageable pageable) {
        if (status != null && !status.isEmpty()) {
            return paymentRepository.findByStatus(status, pageable);
        }
        return paymentRepository.findAll(pageable);
    }
    
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
    
    public void processRefund(Long bookingId, Double amount, String reason) {
        // Find payment by booking ID
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found for booking"));
        
        payment.setStatus("REFUNDED");
        paymentRepository.save(payment);
    }
    
    public void processPaymentRefund(Long paymentId, Double amount, String reason) {
        Payment payment = getPaymentById(paymentId);
        payment.setStatus("REFUNDED");
        paymentRepository.save(payment);
    }
    
    public java.util.Map<String, Object> getPaymentLogs(Long paymentId) {
        Payment payment = getPaymentById(paymentId);
        java.util.Map<String, Object> logs = new java.util.HashMap<>();
        logs.put("payment", payment);
        logs.put("logs", "Payment logs for ID: " + paymentId);
        return logs;
    }
}
