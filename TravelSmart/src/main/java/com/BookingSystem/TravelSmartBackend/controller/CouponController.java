package com.BookingSystem.TravelSmartBackend.controller;

import com.BookingSystem.TravelSmartBackend.model.Coupon;
import com.BookingSystem.TravelSmartBackend.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/coupons")
@CrossOrigin(origins = "*")
public class CouponController {
    
    private final CouponService couponService;
    
    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }
    
    @GetMapping
    public ResponseEntity<List<Coupon>> getActiveCoupons() {
        return ResponseEntity.ok(couponService.getActiveCoupons());
    }
    
    @PostMapping("/apply")
    public ResponseEntity<Map<String, Object>> applyCoupon(@RequestBody Map<String, Object> request) {
        String code = (String) request.get("code");
        Double amount = Double.parseDouble(request.get("amount").toString());
        String bookingTypeStr = (String) request.get("bookingType");
        
        Coupon.BookingType bookingType = Coupon.BookingType.valueOf(bookingTypeStr);
        
        try {
            Double discount = couponService.applyCoupon(code, amount, bookingType);
            Double finalAmount = amount - discount;
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "discount", discount,
                "finalAmount", finalAmount,
                "message", "Coupon applied successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    @PostMapping("/admin/create")
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon) {
        return ResponseEntity.ok(couponService.createCoupon(coupon));
    }
    
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Map<String, String>> deactivateCoupon(@PathVariable Long id) {
        couponService.deactivateCoupon(id);
        return ResponseEntity.ok(Map.of("message", "Coupon deactivated successfully"));
    }
}
