package com.BookingSystem.TravelSmartBackend.service;

import com.BookingSystem.TravelSmartBackend.exception.TokenException;
import com.BookingSystem.TravelSmartBackend.model.ConfirmationToken;
import com.BookingSystem.TravelSmartBackend.model.User;
import com.BookingSystem.TravelSmartBackend.repository.ConfirmationTokenRepository;
import com.BookingSystem.TravelSmartBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service // FIX: Ensures this is a Spring Bean, resolving 'Could not autowire' in AuthService
public class ConfirmationTokenService {

    private final ConfirmationTokenRepository confirmationTokenRepository;
    private final UserRepository userRepository;

    @Autowired
    public ConfirmationTokenService(ConfirmationTokenRepository confirmationTokenRepository,
                                    UserRepository userRepository) {
        this.confirmationTokenRepository = confirmationTokenRepository;
        this.userRepository = userRepository;
    }

    // FIX: Resolves 'Cannot resolve method generateAndSaveToken(User)'
    public String generateAndSaveToken(User user) {
        ConfirmationToken confirmationToken = new ConfirmationToken(user);
        confirmationTokenRepository.save(confirmationToken);
        return confirmationToken.getToken();
    }

    @Transactional
    // FIX: This method performs the token confirmation and user enablement
    public void confirmToken(String tokenString) {
        Optional<ConfirmationToken> optionalToken = confirmationTokenRepository.findByToken(tokenString);

        if (optionalToken.isEmpty()) {
            throw new TokenException("Token not found.");
        }

        ConfirmationToken token = optionalToken.get();

        if (token.getConfirmedAt() != null) {
            throw new TokenException("Email already confirmed.");
        }

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new TokenException("Token expired.");
        }

        // 1. Mark the token as confirmed
        confirmationTokenRepository.updateConfirmedAt(tokenString, LocalDateTime.now());

        // 2. Enable the user
        String email = token.getUser().getEmail();
        int rowsAffected = userRepository.enableUser(email);

        if (rowsAffected != 1) {
            // This should ideally not happen if the previous checks passed
            throw new TokenException("Could not enable user associated with token.");
        }
    }
}