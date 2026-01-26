package com.BookingSystem.TravelSmartBackend.service;

import com.BookingSystem.TravelSmartBackend.model.User;
import com.BookingSystem.TravelSmartBackend.model.Wallet;
import com.BookingSystem.TravelSmartBackend.model.WalletTransaction;
import com.BookingSystem.TravelSmartBackend.repository.UserRepository;
import com.BookingSystem.TravelSmartBackend.repository.WalletRepository;
import com.BookingSystem.TravelSmartBackend.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WalletService {
    
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final UserRepository userRepository;
    
    public WalletService(WalletRepository walletRepository, WalletTransactionRepository transactionRepository, UserRepository userRepository) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }
    
    public Wallet getOrCreateWallet(User user) {
        return walletRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Wallet wallet = new Wallet();
                    wallet.setUser(user);
                    wallet.setBalance(0.0);
                    return walletRepository.save(wallet);
                });
    }
    
    @Transactional
    public Wallet getOrCreateWalletByUserId(Long userId) {
        return walletRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    Wallet wallet = new Wallet();
                    wallet.setUser(user);
                    wallet.setBalance(0.0);
                    return walletRepository.save(wallet);
                });
    }
    
    @Transactional
    public WalletTransaction addMoney(Long userId, Double amount, String description) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        
        Double balanceBefore = wallet.getBalance();
        wallet.setBalance(balanceBefore + amount);
        walletRepository.save(wallet);
        
        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setType(WalletTransaction.TransactionType.CREDIT);
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setBalanceBefore(balanceBefore);
        transaction.setBalanceAfter(wallet.getBalance());
        
        return transactionRepository.save(transaction);
    }
    
    @Transactional
    public WalletTransaction deductMoney(Long userId, Double amount, String description, String referenceId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        
        if (wallet.getBalance() < amount) {
            throw new RuntimeException("Insufficient wallet balance");
        }
        
        Double balanceBefore = wallet.getBalance();
        wallet.setBalance(balanceBefore - amount);
        walletRepository.save(wallet);
        
        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setType(WalletTransaction.TransactionType.DEBIT);
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setReferenceId(referenceId);
        transaction.setBalanceBefore(balanceBefore);
        transaction.setBalanceAfter(wallet.getBalance());
        
        return transactionRepository.save(transaction);
    }
    
    public List<WalletTransaction> getTransactionHistory(Long userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        return transactionRepository.findByWalletIdOrderByCreatedAtDesc(wallet.getId());
    }
    
    public Double getBalance(Long userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        return wallet.getBalance();
    }
}
