package com.BookingSystem.TravelSmartBackend.controller;

import com.BookingSystem.TravelSmartBackend.model.User;
import com.BookingSystem.TravelSmartBackend.model.Wallet;
import com.BookingSystem.TravelSmartBackend.model.WalletTransaction;
import com.BookingSystem.TravelSmartBackend.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/wallet")
@CrossOrigin(origins = "*")
public class WalletController {
    
    private final WalletService walletService;
    
    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }
    
    @GetMapping
    public ResponseEntity<Wallet> getWallet(@AuthenticationPrincipal User user) {
        Wallet wallet = walletService.getOrCreateWallet(user);
        return ResponseEntity.ok(wallet);
    }
    
    @GetMapping("/balance")
    public ResponseEntity<Map<String, Double>> getBalance(@AuthenticationPrincipal User user) {
        Double balance = walletService.getBalance(user.getId());
        return ResponseEntity.ok(Map.of("balance", balance));
    }
    
    @PostMapping("/add")
    public ResponseEntity<WalletTransaction> addMoney(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> request) {
        Double amount = Double.parseDouble(request.get("amount").toString());
        String description = (String) request.getOrDefault("description", "Money added to wallet");
        
        WalletTransaction transaction = walletService.addMoney(user.getId(), amount, description);
        return ResponseEntity.ok(transaction);
    }
    
    @GetMapping("/transactions")
    public ResponseEntity<List<WalletTransaction>> getTransactions(@AuthenticationPrincipal User user) {
        List<WalletTransaction> transactions = walletService.getTransactionHistory(user.getId());
        return ResponseEntity.ok(transactions);
    }
}
