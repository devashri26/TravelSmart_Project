package com.BookingSystem.TravelSmartBackend.service;

import com.BookingSystem.TravelSmartBackend.model.Coupon;
import com.BookingSystem.TravelSmartBackend.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CouponService {
    
    private final CouponRepository couponRepository;
    
    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }
    
    public List<Coupon> getActiveCoupons() {
        return couponRepository.findByActiveTrueAndValidUntilAfter(LocalDateTime.now());
    }
    
    @Transactional
    public Double applyCoupon(String code, Double bookingAmount, Coupon.BookingType bookingType) {
        Coupon coupon = couponRepository.findByCodeAndActiveTrue(code)
                .orElseThrow(() -> new RuntimeException("Invalid or expired coupon code"));
        
        // Validate coupon
        if (coupon.getValidUntil().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Coupon has expired");
        }
        
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new RuntimeException("Coupon usage limit reached");
        }
        
        if (bookingAmount < coupon.getMinBookingAmount()) {
            throw new RuntimeException("Minimum booking amount not met. Required: ₹" + coupon.getMinBookingAmount());
        }
        
        if (coupon.getApplicableFor() != Coupon.BookingType.ALL && 
            coupon.getApplicableFor() != bookingType) {
            throw new RuntimeException("Coupon not applicable for this booking type");
        }
        
        // Calculate discount
        Double discount = 0.0;
        if (coupon.getDiscountType() == Coupon.DiscountType.PERCENTAGE) {
            discount = (bookingAmount * coupon.getDiscountValue()) / 100;
        } else {
            discount = coupon.getDiscountValue();
        }
        
        // Apply max discount limit
        if (coupon.getMaxDiscountAmount() != null && discount > coupon.getMaxDiscountAmount()) {
            discount = coupon.getMaxDiscountAmount();
        }
        
        // Increment usage count
        coupon.setUsedCount(coupon.getUsedCount() + 1);
        couponRepository.save(coupon);
        
        return discount;
    }
    
    public Coupon createCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }
    
    public void deactivateCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        coupon.setActive(false);
        couponRepository.save(coupon);
    }
}
